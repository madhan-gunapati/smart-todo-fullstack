from django.db import models

# Create your models here.


class Tasks(models.Model):
    id=models.CharField(max_length=100,  primary_key=True)
    title=models.CharField(max_length=100)
    description=models.TextField()
    category = models.CharField(max_length=100)
    priority = models.FloatField()
    deadline = models.DateField()
    status = models.CharField(max_length=100)
    createdAt = models.DateTimeField()
    updatedAt = models.DateTimeField()
    context=models.TextField()

class Context(models.Model):
    id=models.CharField(max_length=100, primary_key=True)
    content = models.TextField()
    createdAt = models.DateTimeField()
    processedInsights = models.JSONField()
   
    source = models.CharField(max_length=100)