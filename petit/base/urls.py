from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="home"),

    path("salon/", views.get_businesses, name="Salons"),

    path("salon/<int:business_id>/", views.get_business, name="Salon"),
    path("salon/<int:business_id>/employees/", views.get_business_employees, name="Employees"),

    path("appointment/<int:id>", views.get_appointment, name="Appointments")
]