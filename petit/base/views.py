from django.shortcuts import render
from django.http import HttpResponse
import json
import sys
from .models import Business, Appointment, Employee, Address
from utility import date_manager

# Create your views here.
def index(response):
    return HttpResponse("This is a test of our first view")

def view1(response, id):
    ls = Business.objects.get(id=id)
    response_data = {"name": ls.name, "email": ls.email, "description": ls.description}
    return HttpResponse(json.dumps(response_data), content_type="application/json")


def appointments(response, appointmentId):

    appointment = Appointment.objects.get(id=appointmentId)

    response_data = dict()
    response_data["valid"] = False

    # Check if this is a valid appointment
    if appointment is None:
        return HttpResponse(json.dumps(response_data), content_type="application/json")

    business = Business.objects.get(id=appointment.business_id)

    employee_name = "TBA"

    employee = Employee.objects.get(id=appointment.provider_id)


