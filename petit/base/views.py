import django.db.models
from django.db.models import Count
from django.shortcuts import render
from django.http import HttpResponse
import json
import sys
import jwt
import math
from .models import Business, Appointment, Employee, Address, Service, newUser, Recovery
import datetime
import time
from .utility import date_manager, encryption, authentication

from django.core.paginator import Paginator

from rest_framework import status
from rest_framework.response import Response
from .serializers import RegisterUserSerializer
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from django.conf import settings

import os

################################################################################
# This file contains all endpoints of our API. In addition, it contains related
# methods used to manipulate data
#
# Section index:
# 1. Authentication Endpoints: Line 38
# 2.Business Endpoints: Line 155
# 3.Contact Endpoints: Line 797
# 4.Recovery Endpoints: Line 853
# 5.Django Models to JSON: Line 975
# 6.Utilities methods: Line 1164
################################################################################


################################################################################
#              _   _                _   _           _   _
#             | | | |              | | (_)         | | (_)
#   __ _ _   _| |_| |__   ___ _ __ | |_ _  ___ __ _| |_ _  ___  _ __
#  / _` | | | | __| '_ \ / _ \ '_ \| __| |/ __/ _` | __| |/ _ \| '_ \
# | (_| | |_| | |_| | | |  __/ | | | |_| | (_| (_| | |_| | (_) | | | |
#  \__,_|\__,_|\__|_| |_|\___|_| |_|\__|_|\___\__,_|\__|_|\___/|_| |_|
#
# Includes endpoints used to handle the authentication process for
# a Business Owner
################################################################################


def header_decoder (request):
    """
    Endpoint used to verify a business owner has active JWT session before
    sending data to dashboard pages.
    Backend gets JWT and tries to match a corrsponding User and Business
    If match occurs, return a valid flag
    """

    response_data = dict()
    response_data['valid'] = False

    if request.method == "POST":

        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)

        # Find business from provided token
        access = body.get('access')
        business = get_business_from_token(access)
        if business is None:
            response_data['error'] = "Incorrect credentials"
            return HttpResponse(json.dumps(response_data), content_type="application/json")


        response_data['valid'] = True
        response_data['business'] = business_to_object(business)

        includeEmployees = request.POST.get('employees', None)
        if includeEmployees is not None:

            employee_objects = []
            employees = Employee.objects.filter(works_at=business_id)
            for employee in employees:
                employee_obj = employee_to_object(employee)
                employee_objects.append(employee_obj)

            response_data['employees'] = employee_objects



    return HttpResponse(json.dumps(response_data), content_type="application/json")
###################################################################################

################################################################################
class CustomUserCreate(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        reg_serializer = RegisterUserSerializer(data=request.data)
        if reg_serializer.is_valid():
            newUser = reg_serializer.save()
            if newUser:
                return Response(status=status.HTTP_201_CREATED)
        return Response(reg_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
##################################################################################

################################################################################
def signup(request):

    response = dict()
    response['valid'] = False

    if request.method == "POST":
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)

        email = body['email']
        name = body['user_name']

        business_data = body['businessData']

        reg_serializer = RegisterUserSerializer(data=body)
        if reg_serializer.is_valid():
            created_user = reg_serializer.save()
            if created_user:

                # Handle business creation
                ####################################################
                business_name = business_data.get('name')
                business_email = business_data.get('email')
                business_phone = business_data.get('phone')
                business_description = business_data.get('description')

                business = Business(name=business_name, email=business_email,
                phone=business_phone, description=business_description,
                owner=created_user, url='')
                business.save()
                ####################################################

                response['valid'] = True

                # Handle Email notification
                #####################################################
                subject = "Welcome to Petit " + name
                content = "Welcome to Petit, your email has been verified"
                authentication.send_email(email, subject, content)
                print('New account was created with email: ' + email)
                #######################################################
        else:
            response['error'] = 'An account with this email already exists!'

    return HttpResponse(json.dumps(response), content_type="application/json")
################################################################################

################################################################################
#  ____            _
# |  _ \          (_)
# | |_) |_   _ ___ _ _ __   ___  ___ ___
# |  _ <| | | / __| | '_ \ / _ \/ __/ __|
# | |_) | |_| \__ \ | | | |  __/\__ \__ \
# |____/ \__,_|___/_|_| |_|\___||___/___/
#
# This section handles most of the backend Endpoints
# These are related to Salons, and Dashboard
# Some methods include both POST and GET requests
################################################################################

def get_appointment(request, id):
    """
    View that handles API get request from an appointment

    Returns an HTTP Response in JSON format with all data
    from database related to the appointment
    """

    try:
        appointment = Appointment.objects.select_related('business_id','provider_id','address_id').get(token=id)
    except django.db.models.ObjectDoesNotExist:
        appointment = None

    response_data = appointment_to_object(appointment)

    return HttpResponse(json.dumps(response_data), content_type="application/json")
################################################################################

################################################################################
def get_business(request, business_id):
    """
    Provides all information about a business with a specific id
    It can also handle PUT requests.

    The PUT request is used when editing the business settings
    It verifies the user is authenticated and then it performs the changes
    At the end, it also returns all information so it can be updated on the
    front-end
    """

    # Check if business with provided id exists
    try:
        business = Business.objects.get(id=business_id)
    except django.db.models.ObjectDoesNotExist:
        business = None

    # Transform Django model query to dictionary
    response_data = business_to_object(business)

    # Handle update request from authenticated user
    if request.method == 'PUT':

        put_response = dict()
        put_response['valid'] = False

        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)

        access = body.get('access')
        changes = body.get('changes')

        requester_business = get_business_from_token(access)
        if business != requester_business:
            return HttpResponse(json.dumps(put_response), content_type="application/json")

        put_response['valid'] = True
        business.name = changes.get('name')
        business.phone = changes.get('phone')
        business.email = changes.get('email')
        business.description = changes.get('description')
        business.url = changes.get('url')
        business.save()

        addresses = changes.get('addresses')

        ##############################################
        # Handle address changes
        ##############################################
        for address in addresses:
            action = address.get('action')
            id = address.get('id')

            if action is None:
                continue

            if action == 'remove':
                Address.objects.filter(id=id).delete()
            else:
                street = address.get('street')
                city = address.get('city')
                state = address.get('state')
                zip = address.get('zip')

                if action == 'add':
                    addressObj = Address(street=street, city=city, state=state,
                    zip=zip, business_id=business)
                elif action == 'set':
                    try:
                        addressObj = Address.objects.get(id=id)
                        addressObj.street = street
                        addressObj.city = city
                        addressObj.state = state
                        addressObj.zip = zip
                    except django.db.models.ObjectDoesNotExist:
                        addressObj = Address(street=street, city=city, state=state,
                        zip=zip, business_id=business)
                addressObj.save()
        #################################################


        put_response['business'] = business_to_object(business)
        return HttpResponse(json.dumps(put_response), content_type="application/json")

    return HttpResponse(json.dumps(response_data), content_type="application/json")
################################################################################


################################################################################
def get_business_stats(request, business_id):
    """
    This endpoint is called for dashboard Home
    It returns stats and bits of important information
    about the Owner's business
    """

    response = dict()
    response['valid'] = False

    try:
        business = Business.objects.get(id=business_id)
    except django.db.models.ObjectDoesNotExist:
        business = None

    if business is None:
        return HttpResponse(json.dumps(response), content_type="application/json")

    response['valid'] = True
    response['employees'] = len(Employee.objects.filter(works_at=business).values('id'))

    appointments = []

    appointment_query = Appointment.objects.select_related('provider_id').filter(business_id=business).order_by('-id')

    top_services = Appointment.objects.filter(business_id=business).values('service').annotate(total=Count('service')).order_by('-total')

    if len(top_services) > 0:
        response['popularService'] = top_services[0].get('service')
    else:
        response['popularService'] = '-'

    for appointment in appointment_query:
        appointment_object = appointment_to_object(appointment)
        appointments.append(appointment_object)

    response['recentAppointments'] = appointments[:10]
    response['appointments'] = len(appointments)
    response['views'] = business.views

    return HttpResponse(json.dumps(response), content_type="application/json")
################################################################################


################################################################################
def get_complete_business(request, business_id):
    """
    Returns an object with all data of a particular business
    This endpoint is inteded to be called when the client accesses the
    business site. Unlike get_business, this method will add a 'visit' value
    to the business table.
    """

    # Check if business with provided id exists
    try:
        business = Business.objects.get(id=business_id)
    except django.db.models.ObjectDoesNotExist:
        business = None

    # Add views amount
    if business is not None:
        business.views = business.views + 1
        business.save()

    response_data = business_to_object(business)
    return HttpResponse(json.dumps(response_data), content_type="application/json")
################################################################################

################################################################################
def get_businesses(request):
    """
    Returns an object with the list business based on query parameters
    ex: state, city, zip
    If none provide, returns all businesses
    Unlike the other endpoints, this only extracts minimal amount of data to
    make the request more optimized
    """

    init_time = time.time()

    # URL Query parameters
    page = request.GET.get('page', 1)

    state_name = request.GET.get('state', None)
    city_name = request.GET.get('city', None)
    zip_code = request.GET.get('zip', None)
    name = request.GET.get('name', None)
    sort_by = request.GET.get('sort', None)

    if name is None:
        business_list = get_businesses_by_address(state_name, city_name, zip_code)
    else:
        try:
            business_list = Business.objects.filter(name__contains=name)
        except django.db.models.ObjectDoesNotExist:
            business_list = []

    response_data = dict()

    # Sort if query parameter included
    # Sort by popularity by default
    if sort_by is not None:

        if sort_by == "Name (A-Z)":
            business_list = sorted(business_list, key=lambda x : x.name)

        elif sort_by == "Name (Z-A)":
            business_list = sorted(business_list, key=lambda x : x.name, reverse=True)

        elif sort_by == "Popularity":
            business_list = sorted(business_list, key=lambda x : x.views, reverse=True)

        elif sort_by == "Newest":
            business_list = sorted(business_list, key=lambda x : x.id, reverse=True)

        elif sort_by == "Oldest":
            business_list = sorted(business_list, key=lambda x : x.id)
    else :
        business_list = sorted(business_list, key=lambda x : x.views, reverse=True)

    # Convert all businesses to dictionaries
    businesses = []
    for business in business_list:
        businesses.append(enhanced_business_to_object(business))

    p = Paginator(businesses, 3)

    selected_page = p.page(page)

    response_data['pagesAmount'] = p.num_pages
    response_data['businesses'] = selected_page.object_list
    response_data['time'] = time.time() -init_time

    return HttpResponse(json.dumps(response_data), content_type="application/json")
################################################################################

################################################################################
def get_business_appointments(request, business_id):

    response_data = dict()
    response_data['valid'] = False

    # Check if business with provided id exists
    try:
        business = Business.objects.get(id=business_id)
    except django.db.models.ObjectDoesNotExist:
        return HttpResponse(json.dumps(response_data), content_type="application/json")

    response_data['valid'] = True

    appointment_objects = []
    try:
        appointments = Appointment.objects.filter(business_id=business)
        for appointment in appointments:
            appointment_object = appointment_to_object(appointment)
            appointment_objects.append(appointment_object)
    except django.db.models.ObjectDoesNotExist:
        pass

    response_data['appointments'] = appointment_objects

    return HttpResponse(json.dumps(response_data), content_type="application/json")
################################################################################

################################################################################
def get_business_schedule(request):
    """
    This endpoint is in charge of providing appropiate JSON objects of appointments
    for the Appointments page in the dashboard.
    Its difference with the get_appointments is that the format has been adapted
    to be read by DayPilot Schedule library
    """

    response = dict()
    response['valid'] = False

    if request.method == 'POST':
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)

        access = body.get('access')

        business = get_business_from_token(access)


        if business is None:
            return HttpResponse(json.dumps(response), content_type="application/json")


        current_day = datetime.date.today()
        date = datetime.date.strftime(current_day, "%Y-%m-%d")
        response['valid'] = True
        response['currentDate'] = date

        schedules = []
        try:
            appointments = Appointment.objects.filter(business_id=business)
            for appointment in appointments:
                schedule_object = appointment_to_schedule_object(appointment)
                schedules.append(schedule_object)

        except django.db.models.ObjectDoesNotExist:
            pass

        response['schedules'] = schedules

    return HttpResponse(json.dumps(response), content_type="application/json")
################################################################################

################################################################################
def get_employee_timeslots(request):
    """
    Returns a response with the list of available time slots at a specified
    date for a specific employee.
    If user doesnt provide date, it will consider the current date
    This is used for the Appointments page from the client side
    """

    # Get query parameters
    employee_id = request.GET.get('empId', None)
    date = request.GET.get('date', '')

    # Check if input meets date requirements
    # If fails, override it with the current date
    try:
        test_date = datetime.datetime.strptime(date, '%m/%d/%Y').date()
        current_time = datetime.datetime.now().strftime("%H:%M")

        # Check if actual date entered has already passed
        if date_manager.has_expired(date, current_time):
            raise TypeError

    except (TypeError, ValueError):
        print('Invalid date')
        current_day = datetime.date.today()
        date = datetime.date.strftime(current_day, "%m/%d/%Y")

    # Create object for response
    response_data = dict()
    response_data['valid'] = False

    # If employee id is not provided return response
    if employee_id is None:
        return HttpResponse(json.dumps(response_data), content_type="application/json")

    # If query matches no result, return response
    try:
        employee = Employee.objects.get(id=employee_id)
    except django.db.models.ObjectDoesNotExist:
        return HttpResponse(json.dumps(response_data), content_type="application/json")


    response_data['valid'] = True

    response_data['employeeId'] = employee.id
    response_data['employee'] = employee.first + ' ' + employee.last
    response_data['date'] = date
    response_data['slots'] = get_available_slots_per_employee(date, employee)

    return HttpResponse(json.dumps(response_data), content_type="application/json")
###################################################################################

################################################################################
# CLIENT FOCUSED ENDPOINTS
################################################################################
def make_appointment(request):
    """
    This endpoint handles making an appointment from the client side.
    It gets the data and makes an additional check just in case someone
    else made a request faster. If all goes well, it will send the user an email
    with their confirmation code and details
    """

    if request.method == 'POST':
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)

        response_data = dict()
        response_data['valid'] = False
        response_data['errorMessage'] = ''

        client_name = body['clientName']
        business_id = body['businessId']
        client_email = body['clientEmail']
        client_phone = body['clientPhone']
        employee_id = body['employeeId']
        app_date = body['date']
        start_time = body['startTime']
        end_time = body['endTime']
        service_id = body['service']
        address_id = body['addressId']

        business = Business.objects.get(id=business_id)
        bussiness_email = ''

        try:
            business = Business.objects.get(id=business_id)
            bussiness_email = business.email
        except django.db.models.ObjectDoesNotExist:
            response_data['errorMessage'] = 'That business doesnt exist!'
            return HttpResponse(json.dumps(response_data), content_type="application/json")

        try:
            employee = Employee.objects.get(id=employee_id)
        except django.db.models.ObjectDoesNotExist:
            response_data['errorMessage'] = 'The employee doesnt exist!'
            return HttpResponse(json.dumps(response_data), content_type="application/json")

        try:
            address = Address.objects.get(id=address_id)
        except django.db.models.ObjectDoesNotExist:
            response_data['errorMessage'] = 'This address doesnt exist!'
            return HttpResponse(json.dumps(response_data), content_type="application/json")

        try:
            service = Service.objects.get(id=service_id)
        except django.db.models.ObjectDoesNotExist:
            response_data['errorMessage'] = 'This service is no longer offered'
            return HttpResponse(json.dumps(response_data), content_type="application/json")

        # Last check if someone else made an appointment just before this request
        try:
            appointment = Appointment.objects.get(provider_id=employee, date=app_date, start=start_time)
            response_data['errorMessage'] = 'Someone was quicker!'
            return HttpResponse(json.dumps(response_data), content_type="application/json")
        except django.db.models.ObjectDoesNotExist:
            pass

        response_data['valid'] = True
        response_data['url'] = encryption.generate_random_token()

        new_appointment = Appointment(business_id=business, client_email=client_email,
        client_name=client_name, client_phone=client_phone, provider_id=employee, date=app_date,
        start=start_time, end=end_time, service=service.name, address_id=address, token=response_data["url"])
        new_appointment.save()

        full_url_path = "localhost:3000/appointments/" + response_data['url']

        #appointment confirmation email to client
        content_client = "Your appointment details: \n\nDate: {}\n\nTime: {}\n\nService: {}\n\nPrice: {}\n\nStylist: {}\n\nLocation: {}"
        content_client += "\n\nAppointment code: {}\n\nUnable to come? Edit your appointment at http://localhost:3000/confirmation/{} \n\nThank you for choosing Petit"
        content_client = content_client.format(app_date, start_time, service.name, "$"+str(service.price),
        employee.first+' '+employee.last, address_to_object(address).get('toString'), response_data['url'],
        response_data['url'])

        subject_client = "Appointment confirmation with "+business.name
        authentication.send_email(client_email, subject_client, content_client)

        #appointment confirmation email to
        content_business = "Appointment details: \n\nDate: {}\n\nTime: {}\n\nService: {}\n\nEmployee: {}\n\nLocation: {}\n\nAppointment code: {}"
        content_business = content_business.format(app_date, start_time, service.name, employee.first+' '+employee.last,
        address_to_object(address).get('toString'), response_data['url'])
        subject_business = "New appointment made by " + client_name
        authentication.send_email(bussiness_email, subject_business, content_business)

        print('New appointment was created with email: ' + client_name)

        return HttpResponse(json.dumps(response_data), content_type="application/json")
#######################################################################################

def delete_appointment(request):

    response_data = dict()
    response_data['valid'] = False

    if request.method == 'POST':
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        appointment_id = body['token']



        # If provided appointmentId is invalid, return invalid object
        try:
            appointment = Appointment.objects.select_related('business_id').get(token=appointment_id)

            subject = "Appointment from "+appointment.client_name+" has been canceled"
            content = 'This is an email notifying you the cancellation of the appointment for '+appointment.client_name
            authentication.send_email(appointment.business_id.email, subject, content)

            subject = "Appointment Cancelation"
            content = "This is an email confirming your cancellation for the appointment with {} on {} at {}"
            content = content.format(appointment.business_id.name, appointment.date, appointment.start)
            authentication.send_email(appointment.client_email, subject, content)

        except django.db.models.ObjectDoesNotExist:
            return HttpResponse(json.dumps(response_data), content_type="application/json")

        response_data['valid'] = True

        Appointment.objects.filter(token=appointment_id).delete()




    return HttpResponse(json.dumps(response_data), content_type="application/json")

def api_services(request, business_id):

    # Create response for all requests
    response = dict()
    response['valid'] = False

    # If provided businessId is invalid, return invalid object
    try:
        business = Business.objects.get(id=business_id)
    except django.db.models.ObjectDoesNotExist:
        return HttpResponse(json.dumps(response), content_type="application/json")

    response['valid'] = True

    # For POST, server expects:
    # List of changes done in the client
    # If the action is add, we add to database, else remove
    if request.method == 'POST':
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)

        # Parse through request data
        changes = body['changeLog']

        # Evaluate if requester is authenticated and owns business
        access = body.get('access')
        req_business = get_business_from_token(access)
        if req_business != business:
            response['valid'] = False
            return HttpResponse(json.dumps(response), content_type="application/json")

        for change in changes:

            service_id = change['id']
            service_action = change['action']
            service_name = change['name']
            service_price = change['price']
            service_category = change['category']

            if service_action == 'add':
                service = Service(name=service_name, price=service_price, category=service_category, provider_id=business)
                service.save()
            else:
                Service.objects.filter(id=service_id).delete()


    # Include all the services related to the business_id to the response
    services = []

    for service in Service.objects.filter(provider_id=business):
        service_object = service_to_object(service)
        services.append(service_object)

    response['services'] = services

    # Response
    return HttpResponse(json.dumps(response), content_type="application/json")

def api_employees(request, business_id):

    init_time = time.time()

    # Create response for all requests
    response = dict()
    response['valid'] = False

    # If provided businessId is invalid, return invalid object
    try:
        business = Business.objects.get(id=business_id)
    except django.db.models.ObjectDoesNotExist:
        return HttpResponse(json.dumps(response), content_type="application/json")

    response['valid'] = True

    #Authentication needed => send access token

    if request.method == 'PUT':
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)

        # Parse through request data
        changes = body['changeLog']

        # Evaluate if requester is authenticated and owns business
        access = body.get('access')
        req_business = get_business_from_token(access)
        if req_business != business:
            response['valid'] = False
            return HttpResponse(json.dumps(response), content_type="application/json")

        for change in changes:

            employee_id = change['id']
            employee_first = change['first']
            employee_last = change['last']
            employee_email = change['email']
            employee_phone = change['phone']
            employee_action = change['action']
            employee_url = change['url']

            if employee_action == 'add':

                employee = Employee(first=employee_first, last=employee_last,
                email=employee_email, phone=employee_phone, works_at=business, url=employee_url)
                employee.save()

            else:
                Employee.objects.filter(id=employee_id).delete()

    # Include all the employees related to the business_id to the response
    employees = []

    for employee in Employee.objects.filter(works_at=business):
        employee_object = employee_to_object(employee)
        employees.append(employee_object)

    response['employees'] = employees

    response['time'] = time.time() -init_time


    # Response
    return HttpResponse(json.dumps(response), content_type="application/json")

################################################################################
#   _____            _             _
#  / ____|          | |           | |
# | |     ___  _ __ | |_ __ _  ___| |_
# | |    / _ \| '_ \| __/ _` |/ __| __|
# | |___| (_) | | | | || (_| | (__| |_
#  \_____\___/|_| |_|\__\__,_|\___|\__|
#
# These endpoints handle sending messages both to the main website and a
# particular business
################################################################################

def contact_business(request, business_id):
    response = dict()
    response['valid'] = False

    if request.method == 'POST':
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)

        name = body.get('name')
        email = body.get('email')
        message = body.get('message')

        try:
            business = Business.objects.get(id=business_id)
        except django.db.models.ObjectDoesNotExist:
            return HttpResponse(json.dumps(response), content_type="application/json")

        # Send message to business email
        subject_client = "New message from "+name
        content_client = 'Sender: '+name+'\nEmail: '+email+'\nMessage: '+message
        authentication.send_email(business.email, subject_client, content_client)

        response['valid'] = True
    return HttpResponse(json.dumps(response), content_type="application/json")
################################################################################

################################################################################
def contact_site(request):
    response = dict()
    response['valid'] = False

    if request.method == 'POST':
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)

        name = body.get('name')
        email = body.get('email')
        message = body.get('message')

        subject_client = "New message from "+name
        content_client = 'Sender: '+name+'\nEmail: '+email+'\nMessage: '+message
        authentication.send_email('petit2022nreply@outlook.com', subject_client, content_client)

################################################################################
#  _____
# |  __ \
# | |__) |___  ___ _____   _____ _ __ _   _
# |  _  // _ \/ __/ _ \ \ / / _ \ '__| | | |
# | | \ \  __/ (_| (_) \ V /  __/ |  | |_| |
# |_|  \_\___|\___\___/ \_/ \___|_|   \__, |
#                                      __/ |
#                                     |___/
#
# Includes the endpoints that handle the recovery process
# from the backend side
# It is divided in three steps: Check Email, Check Code, Update Password
###############################################################################

def recovery_check_email(request):
    """
    Gets user email input and tries to find an account associated
    If there is one, it looks in the recovery table for an existing
    recovery record. If there is not, it creates a new one.
    Send the generated code through email method
    """

    response = dict()
    response['valid'] = False

    if request.method == 'POST':
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)

        email = body.get('email')

        try:
            user = newUser.objects.get(email=email)
        except django.db.models.ObjectDoesNotExist:
            response['error'] = 'Account with this email doesnt exist!'
            return HttpResponse(json.dumps(response), content_type="application/json")

        response['valid'] = True

        code = encryption.generate_random_code(6)

        # Handle data in table
        try:
            recovery = Recovery.objects.get(owner_id=user)
            recovery.code = code
        except django.db.models.ObjectDoesNotExist:
            recovery = Recovery(owner_id=user, code=code)

        recovery.save()

        # Send code to client email
        content_client = "Account password reset request"
        subject_client = "Your recovery code: " + code
        authentication.send_email(email, subject_client, content_client)

    return HttpResponse(json.dumps(response), content_type="application/json")
################################################################################

################################################################################
def recovery_check_code(request):
    """
    Check code sent by the client.
    Compares in the database if it matches
    If it doesnt, send invalid flag
    """

    response = dict()
    response['valid'] = False

    if request.method == 'POST':
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)

        email = body.get('email')
        code = body.get('code')

        try:
            user = newUser.objects.get(email=email)
        except django.db.models.ObjectDoesNotExist:
            response['error'] = 'Account with this email doesnt exist!'
            return HttpResponse(json.dumps(response), content_type="application/json")
        try:
            recovery = Recovery.objects.get(owner_id=user, code=code)
        except django.db.models.ObjectDoesNotExist:
            response['error'] = 'Incorrect recovery code'
            return HttpResponse(json.dumps(response), content_type="application/json")

        response['valid'] = True

    return HttpResponse(json.dumps(response), content_type="application/json")
################################################################################

################################################################################
def recovery_update_password(request):
    """
    Receives client new password and updates it on the user table
    This is the last step on the recovery process from the backend side
    """

    response = dict()
    response['valid'] = False

    if request.method == 'POST':
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)

        password = body.get('password')
        email = body.get('email')

        try:
            user = newUser.objects.get(email=email)
            user.set_password(password)
            user.save()
        except django.db.models.ObjectDoesNotExist:
            response['error'] = 'Account with this email doesnt exist!'
            return HttpResponse(json.dumps(response), content_type="application/json")

        response['valid'] = True

    return HttpResponse(json.dumps(response), content_type="application/json")

##########################################################################################
#  _____  ____    _                _     _           _
# |  __ \|  _ \  | |              | |   (_)         | |
# | |  | | |_) | | |_ ___     ___ | |__  _  ___  ___| |_ ___
# | |  | |  _ <  | __/ _ \   / _ \| '_ \| |/ _ \/ __| __/ __|
# | |__| | |_) | | || (_) | | (_) | |_) | |  __/ (__| |_\__ \
# |_____/|____/   \__\___/   \___/|_.__/| |\___|\___|\__|___/
#                                      _/ |
#                                     |__/
#
# All these methods are used to transform Django Models from queries
# into customized dictionaries that will be passed later as JSON objects
# for HTTP responses
#########################################################################################

def enhanced_business_to_object(business):

    business_obj = dict()
    business_obj['valid'] = False

    if business is not None:
        business_obj['valid'] = True
    else:
        return business_obj



    business_obj['id'] = business.id
    business_obj['name'] = business.name
    business_obj['email'] = business.email
    business_obj['url'] = business.url

    return business_obj
################################################################################

################################################################################
def business_to_object(business=None):

    business_obj = dict()
    business_obj['valid'] = False

    if business is not None:
        business_obj['valid'] = True
    else:
        return business_obj

    business_obj['id'] = business.id
    business_obj['name'] = business.name
    business_obj['email'] = business.email
    business_obj['phone'] = business.phone
    business_obj['description'] = business.description
    business_obj['url'] = business.url

    addresses = []
    for address in Address.objects.filter(business_id=business):
        address_object = address_to_object(address)
        addresses.append(address_object)

    services = []
    for service in Service.objects.filter(provider_id=business):
        service_object = service_to_object(service)
        services.append(service_object)

    employees = []
    for employee in Employee.objects.filter(works_at=business):
        employee_object = employee_to_object(employee)
        employees.append(employee_object)


    business_obj['services'] = services
    business_obj['addresses'] = addresses
    business_obj['employees'] = employees

    return business_obj
################################################################################

################################################################################
def appointment_to_object(appointment=None):

    response_data = dict()
    response_data['valid'] = False

    if appointment is None:
        return response_data

    response_data['valid'] = True
    response_data['finish'] = date_manager.has_expired(appointment.date, appointment.start)

    if appointment.business_id is not None:
        response_data['business'] = appointment.business_id.name
        response_data['businessId'] = appointment.business_id.id
        response_data['businessEmail'] = appointment.business_id.email

    response_data['clientName'] = appointment.client_name
    response_data['clientEmail'] = appointment.client_email
    response_data['clientPhone'] = appointment.client_phone

    response_data['provider'] = appointment.provider_id.first + " " + appointment.provider_id.last
    response_data['providerEmail'] = appointment.provider_id.email
    response_data['providerPhone'] = appointment.provider_id.phone
    response_data['providerUrl'] = appointment.provider_id.url
    response_data['date'] = appointment.date
    response_data['start'] = appointment.start
    response_data['end'] = appointment.end
    response_data['service'] = appointment.service
    response_data['address'] = address_to_string(appointment.address_id)

    return response_data
################################################################################

################################################################################
def appointment_to_schedule_object(appointment=None):
    response_data = dict()

    if appointment is None:
        return response_data

    appointment_text = 'Service: '+appointment.service+' Client: '+appointment.client_name+' Emp: '+appointment.provider_id.first
    date = date_manager.slash_to_dash(appointment.date)

    response_data['id'] = appointment.id
    response_data['text'] = appointment_text
    response_data['start'] = date+'T'+appointment.start+':00'
    response_data['end'] = date+'T'+appointment.end+':00'
    response_data['moveVDisabled'] = True
    response_data['moveHDisabled'] = True

    # Default color, green = available, yellow = ongoing, red= expired
    color = "#6aa84f"

    if date_manager.has_expired(appointment.date,appointment.start):
        color = "#f1c232"
        if date_manager.has_expired(appointment.date,appointment.end):
            color = "#cc4125"

    response_data['backColor'] = color
    return response_data
################################################################################

################################################################################
def employee_to_object(employee=None):
    employee_obj = dict()

    employee_obj['id'] = employee.id
    employee_obj['name'] = employee.first + " " + employee.last
    employee_obj['first'] = employee.first
    employee_obj['last'] = employee.last
    employee_obj['email'] = employee.email
    employee_obj['phone'] = employee.phone
    employee_obj['url'] = employee.url

    return employee_obj
################################################################################

################################################################################
def service_to_object(service=None):
    service_obj = dict()
    service_obj['valid'] = False

    if service is None:
        return service_obj

    service_obj['valid'] = True
    service_obj['id'] = service.id
    service_obj['name'] = service.name
    service_obj['price'] = service.price
    service_obj['category'] = service.category

    return service_obj
################################################################################

################################################################################
def address_to_object(address=None):

    response_data = dict()
    response_data['valid'] = False

    if address is None:
        return response_data

    response_data['valid'] = True
    response_data['id'] = address.id
    response_data['street'] = address.street
    response_data['city'] = address.city
    response_data['state'] = address.state
    response_data['zip'] = address.zip
    response_data['toString'] = address.street + ', ' + address.city + ', ' + address.state + ' ' + address.zip
    return response_data

###################################################################
#  _    _ _   _ _ _ _   _
# | |  | | | (_) (_) | (_)
# | |  | | |_ _| |_| |_ _  ___  ___
# | |  | | __| | | | __| |/ _ \/ __|
# | |__| | |_| | | | |_| |  __/\__ \
#  \____/ \__|_|_|_|\__|_|\___||___/
###################################################################

def address_to_string(address):
    return address.street + ', ' + address.city + ', ' + address.state + ' ' + address.zip


def get_businesses_by_address(address_state=None, address_city=None, address_zip=None, name=None):

    addresses = Address.objects.select_related('business_id').all()
    if address_state is not None:
        addresses = addresses.filter(state__contains=address_state)
    if address_city is not None:
        addresses = addresses.filter(city__contains=address_city)
    if address_zip is not None:
        addresses = addresses.filter(zip=address_zip)

    businesses = set()
    for address in addresses:
        businesses.add(address.business_id)

    return list(businesses)


def get_business_from_token(token):

    # Check if input token exists
    business = None
    if token is None:
        return business

    try:

        # Decodes the data from the JWT token
        decoded_data = jwt.decode(token, settings.SECRET_KEY, algorithms="HS256")
        user_id = decoded_data['user_id']

        # Try to find a business associated with that id
        try:
            user = newUser.objects.get(id=user_id)
            business = Business.objects.get(owner=user)
        except django.db.models.ObjectDoesNotExist:
            pass

    except jwt.exceptions.ExpiredSignatureError:
        pass

    return business


def get_available_slots_per_employee(appointment_date, employee=None):

    if employee is None:
        return []

    possible_times = {"08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00",
                      "16:00", "17:00"}

    busy_times = set()
    current_appointments = Appointment.objects.filter(provider_id=employee, date=appointment_date)
    for appointment in current_appointments:
        busy_times.add(appointment.start)

    print(busy_times)

    available_slots = list(possible_times.difference(busy_times))
    available_slots.sort()
    available_slots = filter(lambda time: date_manager.has_expired(appointment_date, time) == False, available_slots)

    return list(available_slots)
