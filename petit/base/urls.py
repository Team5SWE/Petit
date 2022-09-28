from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="home"),
    path("salon/<int:id>", views.view1, name="Salon"),
    path("appointment/<int:id>", views.appointments, name="Appointments")
]