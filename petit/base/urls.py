from django.urls import path
from rest_framework_simplejwt.views import (
TokenObtainPairView,
TokenRefreshView,)
from . import views
from .views import CustomUserCreate

urlpatterns = [
    path("", views.index, name="home"),

    path("salon/", views.get_businesses, name="Salons"),

    path("salon/<int:business_id>/", views.get_business, name="Salon"),
    path("salon/<int:business_id>/employees/", views.get_business_employees, name="Employees"),
    path("salon/<int:business_id>/appointments/", views.get_business_appointments, name="Business Appointments"),
    path("salon/<int:business_id>/services/", views.api_services, name="Business Services"),

    path("token/", TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),


    path("slots/", views.get_employee_timeslots, name="Slots"),

    path("appointment/<int:id>", views.get_appointment, name="Appointments"),

    path("signup/", views.signup, name="create_user"),
    path("login/", views.login, name="Login")
]
