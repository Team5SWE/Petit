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
    response_data['valid'] = False

    # Check if this is a valid appointment
    if appointment is None:
        return HttpResponse(json.dumps(response_data), content_type="application/json")

    response_data['valid'] = True

    business = Business.objects.get(id=appointment.business_id)

    employee_name = "TBA"

    address_name = "TBA"

    employee = Employee.objects.get(id=appointment.provider_id)

    if employee is not None:
        employee_name = employee.first+' '+employee.last

    address = Address.objects.get(business_id= appointment.business_id)

    if address is not None:
        address_name = address.street + ', ' + address.city + ', '+ address.state + ',' + str(address.zip)

    date = appointment.date
    start = appointment.start
    end = appointment.end
    service = appointment.service

    if date_manager.has_expired(date, end) :
        response_data['finished'] = True
    else:
        response_data['finished'] = False

    response_data['business'] = business.name
    response_data['businessEmail'] = business.email
    response_data['provider'] = employee_name
    response_data['date'] = date
    response_data['start'] = start
    response_data['end'] = end
    response_data['service'] = service
    response_data['address'] = address_name

    return HttpResponse(json.dumps(response_data), content_type="application/json")




