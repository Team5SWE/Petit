from django.db import models


class Business(models.Model):
    name = models.CharField(max_length=100)
    email = models.CharField(max_length=50)
    password = models.CharField(max_length=50)
    phone = models.CharField(max_length=16)
    description = models.TextField()
    services = models.TextField()


class Employee(models.Model):
    first = models.CharField(max_length=100)
    last = models.CharField(max_length=100)
    email = models.CharField(max_length=50)
    phone = models.CharField(max_length=16)
    works_at = models.ForeignKey(Business, on_delete=models.CASCADE)


# Full Address:
class Address(models.Model):
    street = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    zip = models.CharField(max_length=5)
    business_id = models.ForeignKey(Business, on_delete=models.CASCADE)


class Appointment(models.Model):
    business_id = models.ForeignKey(Business, on_delete=models.CASCADE)
    client_email = models.CharField(max_length=50)
    client_name = models.CharField(max_length=50)
    client_phone = models.CharField(max_length=16)
    provider_id = models.ForeignKey(Employee, on_delete=models.CASCADE)
    date = models.CharField(max_length=15)
    start = models.CharField(max_length=5)
    end = models.CharField(max_length=5)
    address_id = models.ForeignKey(Address, on_delete=models.CASCADE)
