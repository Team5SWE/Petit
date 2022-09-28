from django.shortcuts import render
from django.http import HttpResponse
import json
import sys
from .models import Business, Appointment, Employee, Address

from petit.utility import date_manager, csv

# Create your views here.
def index(response):
    return HttpResponse("This is a test of our first view")


def view1(response, id):
    ls = Business.objects.get(id=id)
    response_data = {"name": ls.name, "email": ls.email, "description": ls.description}
    return HttpResponse(json.dumps(response_data), content_type="application/json")


def get_appointment(appointment_id):
    """
    View that handles API get request from an appointment

    Returns an HTTP Response in JSON format with all data
    from database related to the appointment
    """

    appointment = Appointment.objects.get(id=appointment_id)

    # Create dictionary to be sent as JSON
    response_data = dict()
    response_data['valid'] = False

    # Check if this is a valid appointment
    if appointment is None:
        return HttpResponse(json.dumps(response_data), content_type="application/json")

    response_data['valid'] = True

    business = Business.objects.get(id=appointment.business_id)

    # Placeholders in case data is missing
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

    if date_manager.has_expired(date, end):
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


def get_business(business_id):

    business = Business.objects.get(id=business_id)

    response_data = dict()
    response_data['valid'] = False

    if business is None:
        return HttpResponse(json.dumps(response_data), content_type="application/json")

    response_data['name'] = business.name
    response_data['email'] = business.email
    response_data['description'] = business.description
    response_data['services'] = csv.csv_to_list(business.services)

    




