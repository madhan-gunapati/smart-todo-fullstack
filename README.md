This is a Smart Todo FullStack Application Repo.
- Frontend: [Next.js]
- Backend: [Django]
- DB : Supabase (postgresql)
- API Communication: REST 
- AI usage : LM stdio Mathstral 7B 

---


## Screenshots of the UI 

![Dashboard ](./assets/dashboard-empty.png)
![Dashboard Filled ](./assets/dashboard-filled.png)

![Context UI ](./assets/context-empty.png)
![Context UI filled ](./assets/context-filled.png)

![Add Task ](./assets/addTask.png)



![Dashboard Mobile ](./assets/mobile-dashboard-empty.png)
![Dashboard Mobile Filled ](./assets/dashboard-mobile-filled.png)

![Context UI Mobile ](./assets/mobile-context-empty.png)
![Context UI Mobile filled ](./assets/context-mobile-filled.png)

![Add Task  Mobile](./assets/add-task-mobile.png)





## 🗂️ Project Structure

root/                                   </br>
├── backend/ # Django project directory </br>
│                                       </br>
├── frontend/ # Next.js project directory </br>
│__ assets                                </br>




## Instructions to run the FE application:

->clone the Repo </br>
->change to the Front End folder </br>
-> run 'npm install' </br>
-> you will see a package.lock.json file </br>
-> run npm run dev </br>
-> you can access the application from http://localhost:3000 </br>
-> you can access the Hosted Application at https://smart-todo-pied.vercel.app/ </br>

## Instructions to run the BE application:

->clone the repo </br>
-> cd backend (go to backend folder) </br>
->  pip3 install -r requirements.txt (install the necessary packages) </br>
-> add the .env file to add db login creds. </br>
    DB_NAME=postgres </br>
    DB_USER=your user-name </br>
    DB_PASSWORD=yourpassword </br>
    DB_HOST=yourhost </br>
    DB_PORT=6543 </br>

-> python3 manage.py makemigrations (make the migration files ready) </br>
-> python3 manage.py migrate (run the migrations to make changes in the database) </br>
-> python3 manage.py runserver      (run the server) </br>
-> check the server response from postman  <br/>
request : POST http://localhost:8000/tasks </br>

you will get the saved tasks <br/>

-> make sure LM studio server is running at http://127.0.0.1:1234 to get the AI suggestions



# API documentation:

url :-> http://localhost:8000/

End point : Respective handler Function  :-> It's Functionality</br>

'create'   : post_items  :-> useful to create new TODO task and save in the DB </br>
'modify'   : modify_with_ai :-> takes in context and makes changes to already stored tasks </br>
'tasks'    : fetch_saved_tasks 
'contexts' : fetch_saved_contexts
'suggest'  : suggest_with_ai
'change'   : change_task



# Sample data to test:
