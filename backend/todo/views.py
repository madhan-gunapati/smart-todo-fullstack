from django.shortcuts import render

# Create your views here.
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import requests
from .models import Tasks, Context
from django.forms.models import model_to_dict
from datetime import datetime , date

import  uuid

def convert_datetime(obj):
    for key, value in obj.items():
        if isinstance(value,  (datetime, date)):
            obj[key] = value.isoformat()
    return obj

def edit_task(updated_tasks):
    for item in updated_tasks:
        task_id = item['id']
        task = Tasks.objects.get(id=task_id)
        task.description = item['description']
        task.title = item['title']
        task.status = item['status']
        task.priority = item['priority']
        task.deadline = item['deadline']
        task.save()



def save_context(context):
    
        Context.objects.create(
                            id=context['id'],
                            content=context['context'],
                            createdAt=context['timestamp'],
                            source=context['source'],
                            processedInsights={
                            'sentiment': context['sentiment'],
                            'keywords': context['keywords']
                                                }
                                )
    
@csrf_exempt
def change_task(request):
    task = json.loads(request.body)
    task_id = task['id']

    task_object = Tasks.objects.get(id=task_id)
    task_object.description = task['description']
    task_object.title = task['title']
    task_object.status = task['status']
    task_object.priority = task['priority']
    task_object.deadline = task['deadline']
    task_object.save()

    return JsonResponse({'message':'Task Updated'})


@csrf_exempt
def post_items(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            #put data in the DB
            result = Tasks.objects.create(**data)
            

        except Exception as e:
            print("Error:", str(e))
             
            return JsonResponse({'error': 'Invalid JSON'}, status=400)

       
       
        return JsonResponse({'message':'Task Saved'})
    




LM_STUDIO_URL = "http://localhost:1234/v1/chat/completions"  # Or /v1/completions for plain models
MODEL_NAME =  "mistralai/mathstral-7b-v0.1"

# Prompt template
PROMPT_TEMPLATE ="""
You are a productivity assistant.

Input:
1. A `context` paragraph describing my current mood, energy, stress level, or blockers.
2. A list of `tasks`, each with:
    -id
   - title
   - description
   - deadline
   - priority (1 = low, 5 = high)
   - status (e.g., "pending", "in progress", "done")
     


Instructions:
- Analyze the context and extract:
  - Sentiment (e.g., positive, neutral, negative, mixed)
  - Keywords that indicate urgency, stress, emotions, motivation
- Use the context to adjust each task:
  - Update priority
  - Change status
  - Add a short "note" for any changes made in the description

Respond strictly in the following JSON format:

```json
{{
  "sentiment": "<sentiment>",
  "keywords": "[<keyword1>, <keyword2>, ...]",
  "updated_tasks": "[
    {{
      "id":"...",
      "title": "...",
      "description: ...",
      "deadline": "...",
      "priority": "...",
      "status": "...",
      
    }}
  ]"
}}
```

Context:{context}

Tasks:{tasks}
"""


@csrf_exempt
def modify_with_ai(request):
    if(request.method == 'POST'):
         try:
            
            data = json.loads(request.body)
            
            context = data['content']
            all_tasks = Tasks.objects.all()
            tasks = [convert_datetime(model_to_dict(task)) for task in all_tasks]
            
            

             # Fill prompt
            full_prompt = PROMPT_TEMPLATE.format(context=context,tasks=json.dumps(tasks, indent=2))                                 
             #Chat-style request to LM Studio
            payload = {
                         "model": MODEL_NAME,
                        "messages": [
                             {"role": "system", "content": "You are a helpful assistant that only responds with valid JSON."},
                             {"role": "user", "content": full_prompt}
                                     ],
                             "temperature": 0.3
                     }
            
            response = requests.post(LM_STUDIO_URL, json=payload)
            response.raise_for_status()
            
            result = response.json()
            
            output_text = result['choices'][0]['message']['content']
            
            # Extract JSON from model response
            try:
                parsed_output = json.loads(output_text)
            except json.JSONDecodeError:
                 start = output_text.find('{')
                 end = output_text.rfind('}') + 1
                 parsed_output = json.loads(output_text[start:end])
                
            #update the edited tasks     
                 edit_task(parsed_output['updated_tasks'])
                 
            #add the contex to DB
                 source = data['source']
                 timestamp = data['timestamp']
                 id= data['id']
                 sentiment = parsed_output['sentiment']
                 keywords = parsed_output['keywords']
                 
                 save_context({ 'id':id, 'context' : context, 'timestamp':timestamp , 'source':source ,'sentiment':sentiment , 'keywords':keywords})
                 return JsonResponse({'msg':'updated'})
         except Exception as e:
            print("Error:", e)
             
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        

@csrf_exempt
def fetch_saved_tasks(request):
            all_tasks = Tasks.objects.all()
            tasks = [convert_datetime(model_to_dict(task)) for task in all_tasks]

            
            return JsonResponse(tasks, safe=False)

@csrf_exempt
def fetch_saved_contexts(request):
            all_contexts = Context.objects.all()
            contexts = [convert_datetime(model_to_dict(context)) for context in all_contexts]

            
            return JsonResponse(contexts, safe=False)

@csrf_exempt
def suggest_with_ai(request):
      data = json.loads(request.body)
      context = data['context']
      task = data['task']
      
    


      # send context and task to ai and get updated task 
     
      SUGGESTION_TEMPLATE ="""
                        You are a productivity assistant.

                        Input:
                        1. A `context` paragraph describing my current mood, energy, stress level, or blockers.
                        2. A  `task`,  with:
                                 -id
                                - title
                                 - description
                                - deadline
                                - priority (1 = low, 5 = high)
                                 - status (e.g., "pending", "in progress", "done")
     


                        Instructions:
                        - Analyze the context and extract:
                        - Sentiment (e.g., positive, neutral, negative, mixed)
                        - Keywords that indicate urgency, stress, emotions, motivation
                        - Use the context to adjust  task:
                        - Update priority
                        - Change status
                        - Update description
                         - Update title
                          - Update deadline

                        Respond strictly in the following JSON format:

                        ```json
                        {{
                         "sentiment": "<sentiment>",
                        "keywords": "[<keyword1>, <keyword2>, ...]",
                        "updated_task": "
                        {{
                     "id":"...",
                    "title": "...",
                    "description: ...",
                    "deadline": "...",
                    "priority": "...",
                    "status": "...",
      
                         }}
                             "
                            }}
                            ```

                        Context:{context}

                        Task:{task}
                    """
      full_prompt = SUGGESTION_TEMPLATE.format(context=context,task=json.dumps(task, indent=2))                                 

      payload = {
                         "model": MODEL_NAME,
                        "messages": [
                             {"role": "system", "content": "You are a helpful assistant that only responds with valid JSON."},
                             {"role": "user", "content": full_prompt}
                                     ],
                             "temperature": 0.3
                     }
            
      response = requests.post(LM_STUDIO_URL, json=payload)
      response.raise_for_status()

      result = response.json()
      output_text = result['choices'][0]['message']['content']
            
     # Extract JSON from model response
      try:
            parsed_output = json.loads(output_text)
      except json.JSONDecodeError:
            start = output_text.find('{')
            end = output_text.rfind('}') + 1
            parsed_output = json.loads(output_text[start:end])

            
             #save the context , source: suggestion, sentiment, keywords, id, 
            sentiment = parsed_output['sentiment']
            keywords = parsed_output['keywords']
            createdAt = datetime.now()
            id= uuid.uuid4()
            save_context({'sentiment':sentiment , 'keywords':keywords , 'id':id , 'context':context , 'source':'Ai suggetsion' , 'timestamp':createdAt })
            
 #send it back
            return JsonResponse({'msg':parsed_output['updated_task']})
     