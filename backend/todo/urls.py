from django.urls import path
from .views import post_items , modify_with_ai , fetch_saved_tasks , fetch_saved_contexts , suggest_with_ai , change_task

urlpatterns = [
    path('create', post_items),
    path('modify' , modify_with_ai),
    path('tasks' , fetch_saved_tasks),
    path('contexts' , fetch_saved_contexts),
    path('suggest' , suggest_with_ai),
    path('change' , change_task)
]
