from django.shortcuts import render
from django.http import HttpResponse
import json
from .models import Business, Appointment, Employee
# Create your views here.
def index(response):
    return HttpResponse("This is a test of our first view")

def view1(response, id):
    ls = Business.objects.get(id=id)
    response_data = {"name": ls.name, "email": ls.email, "description": ls.description}
    return HttpResponse(json.dumps(response_data), content_type="application/json")