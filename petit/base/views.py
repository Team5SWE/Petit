import django.db.models
from django.shortcuts import render
from django.http import HttpResponse
import json
import sys
from .models import Business, Appointment, Employee, Address, Service, newUser
import datetime
from .utility import date_manager, encryption, authentication

from rest_framework import status
from rest_framework.response import Response
from .serializers import RegisterUserSerializer
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView


class CustomUserCreate(APIView):
    permission_classes = [AllowAny]


    def post(self, request):
        reg_serializer = RegisterUserSerializer(data=request.data)
        if reg_serializer.is_valid():
            newUser = reg_serializer.save()
            if newUser:
                return Response(status=status.HTTP_201_CREATED)
        return Response(reg_serializer.errors, status=status.HTTP_400_BAD_REQUEST)



# Create your views here.
#####################################################################
#            TEST CASE PLACED HERE FOR DATE_MANAGER
#####################################################################
def index(response):
    date = "02/03/2022"
    time = "10:30"
    date_2 = "10/10/2023"
    time_2 = "10:30"
    is_expired = date_manager.has_expired(date, time)
    is_expired_2 = date_manager.has_expired(date_2, time_2)
    print(is_expired)
    print(is_expired_2)
    return HttpResponse("This is a test of our first view")

def view1(response, id):
    ls = Business.objects.get(id=id)
    response_data = {"name": ls.name, "email": ls.email, "description": ls.description}
    return HttpResponse(json.dumps(response_data), content_type="application/json")

######################################################################################
#   _____ ______ _______   _    _          _   _ _____  _      ______ _____   _____
#  / ____|  ____|__   __| | |  | |   /\   | \ | |  __ \| |    |  ____|  __ \ / ____|
# | |  __| |__     | |    | |__| |  /  \  |  \| | |  | | |    | |__  | |__) | (___
# | | |_ |  __|    | |    |  __  | / /\ \ | . ` | |  | | |    |  __| |  _  / \___ \
# | |__| | |____   | |    | |  | |/ ____ \| |\  | |__| | |____| |____| | \ \ ____) |
#  \_____|______|  |_|    |_|  |_/_/    \_\_| \_|_____/|______|______|_|  \_\_____/
#####################################################################################


def get_appointment(request, appointment_token):
    """
    View that handles API get request from an appointment

    Returns an HTTP Response in JSON format with all data
    from database related to the appointment
    """

    try:
        appointment = Appointment.objects.get(token=appointment_token)
    except django.db.models.ObjectDoesNotExist:
        appointment = None

    response_data = appointment_to_object(appointment)

    return HttpResponse(json.dumps(response_data), content_type="application/json")

#################################
# BUSINESS GET REQUESTS        #
###############################


def get_business(response, business_id):

    # Check if business with provided id exists
    try:
        business = Business.objects.get(id=business_id)
    except django.db.models.ObjectDoesNotExist:
        business = None

    # Transform Django model query to dictionary
    response_data = business_to_object(business)

    return HttpResponse(json.dumps(response_data), content_type="application/json")


def get_businesses(request):
    """
    Returns an object with the list business based on query parameters
    ex: state, city, zip
    If none provide, returns all businesses
    """

    # URL Query parameters
    state_name = request.GET.get('state', None)
    city_name = request.GET.get('city', None)
    zip_code = request.GET.get('zip', None)

    business_list = get_businesses_by_address(state_name, city_name, zip_code)

    response_data = dict()

    # Convert all businesses to dictionaries
    businesses = []
    for business in business_list:
        businesses.append(business_to_object(business))

    response_data['businesses'] = businesses

    return HttpResponse(json.dumps(response_data), content_type="application/json")

#################################
# BUSINESS RELATED GET REQUESTS#
###############################


def get_business_employees(request, business_id):

    try:
        business = Business.objects.get(id=business_id)
    except django.db.models.ObjectDoesNotExist:
        business = None

    response_data = dict()
    response_data['valid'] = False

    if business is None:
        return HttpResponse(json.dumps(response_data), content_type="application/json")

    response_data['valid'] = True

    employee_objects = []

    employees = Employee.objects.filter(works_at=business_id)
    for employee in employees:
        employee_obj = employee_to_object(employee)
        employee_objects.append(employee_obj)

    response_data['employees'] = employee_objects

    return HttpResponse(json.dumps(response_data), content_type="application/json")


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



def get_employee_timeslots(request):
    """
    Returns an object with the list of available time slots at a specified
    date for a specific employee.
    If user doesnt provide date, it will consider the current date
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


############################################################################################
#  _____   ____   _____ _______   _    _          _   _ _____  _      ______ _____   _____
# |  __ \ / __ \ / ____|__   __| | |  | |   /\   | \ | |  __ \| |    |  ____|  __ \ / ____|
# | |__) | |  | | (___    | |    | |__| |  /  \  |  \| | |  | | |    | |__  | |__) | (___
# |  ___/| |  | |\___ \   | |    |  __  | / /\ \ | . ` | |  | | |    |  __| |  _  / \___ \
# | |    | |__| |____) |  | |    | |  | |/ ____ \| |\  | |__| | |____| |____| | \ \ ____) |
# |_|     \____/|_____/   |_|    |_|  |_/_/    \_\_| \_|_____/|______|______|_|  \_\_____/
###########################################################################################

#              _   _                _   _           _   _
#             | | | |              | | (_)         | | (_)
#   __ _ _   _| |_| |__   ___ _ __ | |_ _  ___ __ _| |_ _  ___  _ __
#  / _` | | | | __| '_ \ / _ \ '_ \| __| |/ __/ _` | __| |/ _ \| '_ \
# | (_| | |_| | |_| | | |  __/ | | | |_| | (_| (_| | |_| | (_) | | | |
#  \__,_|\__,_|\__|_| |_|\___|_| |_|\__|_|\___\__,_|\__|_|\___/|_| |_|
######################################################################

def login(request):
    if request.method == "GET":
        if not request.COOKIES.get('email'):
            pass
        # response_data.set_cookie(cookie_name, value, max_age=None, expires=None)
    elif request.method == "POST":
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        email = body['email']
        password = body['password']

        try:
            email_exist = Business.objects.get(email=email)
        except django.db.models.ObjectDoesNotExist:
            email_exist = None

        if email_exist is None:
            print('Authentication failed: email doesnt exist')
            return HttpResponse(json.dumps("Email doesnt exist."), content_type="application/json")

        encrypted_password = encryption.encrypt_password(password)

        if encrypted_password != email_exist.password:
            print('Incorrect password')
            return HttpResponse(json.dumps("Incorrect password."), content_type="application/json")

        print('User authenticated!')
        print(email_exist)

    return HttpResponse(json.dumps("Login."), content_type="application/json")


def signup(request):

    response = dict()
    response['valid'] = False

    if request.method == "POST":
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)

        email = body['email']

        reg_serializer = RegisterUserSerializer(data=body)
        if reg_serializer.is_valid():
            created_user = reg_serializer.save()
            if created_user:
                response['valid'] = True
                authentication.send_email(email)
                print('New account was created with email: ' + email)

    return HttpResponse(json.dumps(response), content_type="application/json")

 #  _               _
 # | |             (_)
 # | |__  _   _ ___ _ _ __   ___  ___ ___
 # | '_ \| | | / __| | '_ \ / _ \/ __/ __|
 # | |_) | |_| \__ \ | | | |  __/\__ \__ \
 # |_.__/ \__,_|___/_|_| |_|\___||___/___/
 #########################################


def make_appointment(request):

    if request.method == 'POST':
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)

        response_data = dict()
        response_data['valid'] = False
        response_data['errorMessage'] = ''

        business_id = body['businessId']
        client_email = body['clientEmail']
        client_phone = body['clientPhone']
        employee_id = body['employeeId']
        app_date = body['date']
        start_time = body['startTime']
        end_time = body['endTime']
        service = body['service']

        try:
            business = Business.objects.get(id=business_id)
        except django.db.models.ObjectDoesNotExist:
            response_data['errorMessage'] = 'That business doesnt exist!'
            return HttpResponse(json.dumps(response_data), content_type="application/json")

        try:
            employee = Employee.objects.get(id=employee_id)
        except django.db.models.ObjectDoesNotExist:
            response_data['errorMessage'] = 'The employee doesnt exist!'
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



##########################################################################################
#  _____  ____    _                _     _           _
# |  __ \|  _ \  | |              | |   (_)         | |
# | |  | | |_) | | |_ ___     ___ | |__  _  ___  ___| |_ ___
# | |  | |  _ <  | __/ _ \   / _ \| '_ \| |/ _ \/ __| __/ __|
# | |__| | |_) | | || (_) | | (_) | |_) | |  __/ (__| |_\__ \
# |_____/|____/   \__\___/   \___/|_.__/| |\___|\___|\__|___/
#                                      _/ |
#                                     |__/
#########################################################################################


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

    addresses = []
    for address in Address.objects.filter(business_id=business):
        address_string = address_to_string(address)
        addresses.append(address_string)

    services = []
    for service in Service.objects.filter(provider_id=business):
        service_object = service_to_object(service)
        services.append(service_object)

    business_obj['services'] = services
    business_obj['addresses'] = addresses

    return business_obj


def appointment_to_object(appointment=None):

    response_data = dict()
    response_data['valid'] = False

    if appointment is None:
        return response_data

    response_data['valid'] = True
    response_data['finish'] = date_manager.has_expired(appointment.date, appointment.start)

    response_data['business'] = appointment.business_id.name
    response_data['businessEmail'] = appointment.business_id.email

    response_data['clientEmail'] = appointment.client_email
    response_data['clientPhone'] = appointment.client_phone

    response_data['provider'] = appointment.provider_id.first + " " + appointment.provider_id.last
    response_data['date'] = appointment.date
    response_data['start'] = appointment.start
    response_data['end'] = appointment.end
    response_data['service'] = appointment.service
    response_data['address'] = address_to_string(appointment.address_id)

    return response_data


def employee_to_object(employee=None):
    employee_obj = dict()

    employee_obj['id'] = employee.id
    employee_obj['name'] = employee.first + " " + employee.last
    employee_obj['email'] = employee.email
    employee_obj['phone'] = employee.phone

    return employee_obj


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

#################################
# BUSINESS RELATED GET REQUESTS#
################################





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


def get_businesses_by_address(address_state=None, address_city=None, address_zip=None):

    addresses = Address.objects.all()
    if address_state is not None:
        addresses = addresses.filter(state=address_state)
    if address_city is not None:
        addresses = addresses.filter(city=address_city)
    if address_zip is not None:
        addresses = addresses.filter(zip=address_zip)

    businesses = set()
    for address in addresses:
        businesses.add(address.business_id)

    return list(businesses)


def get_available_slots_per_employee(appointment_date, employee=None):

    if employee is None:
        return []

    possible_times = {"08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00",
                      "16:00", "17:00"}

    busy_times = set()
    current_appointments = Appointment.objects.filter(provider_id=employee, date=appointment_date)
    for appointment in current_appointments:
        busy_times.add(appointment.start)

    available_slots = list(possible_times.difference(current_appointments))
    available_slots.sort()
    available_slots = filter(lambda time: date_manager.has_expired(appointment_date, time) == False, available_slots)

    return list(available_slots)
