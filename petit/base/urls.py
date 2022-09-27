from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="home"),
    path("<int:id>", views.view1, name="view1")
]