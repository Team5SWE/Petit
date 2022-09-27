from django.shortcuts import render
from django.http import HttpResponse
from .models import Business, Appointment, Employee
# Create your views here.
def index(response):
    return HttpResponse("This is a test of our first view")

def view1(response, id):
    ls = Business.objects.get(id=id)
    return HttpResponse("This is a test for viewing data id number: %s" % ls.name)