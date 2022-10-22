from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="home"),

    path("salon/", views.get_businesses, name="Salons"),

    path("salon/<int:business_id>/", views.get_business, name="Salon"),
    path("salon/<int:business_id>/employees/", views.get_business_employees, name="Employees"),
    path("salon/<int:business_id>/appointments/", views.get_business_appointments, name="Business Appointments"),
    path("salon/<int:business_id>/services/", views.api_services, name="Business Services"),

    path("slots/", views.get_employee_timeslots, name="Slots"),

    path("appointment/<int:id>", views.get_appointment, name="Appointments"),

    path("signup/", views.signup, name="SignUp"),
    path("login/", views.login, name="Login")
]
