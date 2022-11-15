from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.conf import settings

# Create your models here.
class CustomAccountManager(BaseUserManager):

    def create_superuser(self, email, user_name, password, **other_fields):
        other_fields.setdefault('is_staff', True)
        other_fields.setdefault('is_superuser', True)
        other_fields.setdefault('is_active', True)

        if other_fields.get('is_staff') is not True:
            raise ValueError('SuperUser must be staff')

        return self.create_user(email, user_name, password, **other_fields)

    def create_user(self, email, user_name, password, **other_fields):

        if not email:
            raise ValueError('Has to be an email address')

        email = self.normalize_email(email)
        user = self.model(email=email, user_name= user_name, **other_fields)
        user.set_password(password)
        user.save()
        return user


class newUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(('email_address'), unique=True)
    user_name = models.CharField(max_length=50, unique=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_superuser = models.BooleanField(default=False)

    objects = CustomAccountManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['user_name']

    def __str__(self):
        return self.user_name

class Business(models.Model):
    name = models.CharField(max_length=100)
    email = models.CharField(max_length=50)
    phone = models.CharField(max_length=16)
    description = models.TextField()
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    views = models.IntegerField(default=0)

class Service (models.Model):
    name = models.CharField(max_length=100)
    price = models.CharField(max_length=50)
    category = models.CharField(max_length=50)
    provider_id = models.ForeignKey(Business, on_delete=models.CASCADE)


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
    business_id = models.ForeignKey(Business, on_delete=models.CASCADE, default=None)
    client_email = models.CharField(max_length=50, default=None)
    client_name = models.CharField(max_length=50, default=None)
    client_phone = models.CharField(max_length=16, default=None)
    provider_id = models.ForeignKey(Employee, on_delete=models.CASCADE, default=None)
    date = models.CharField(max_length=15, default=None)
    start = models.CharField(max_length=5, default=None)
    end = models.CharField(max_length=5, default=None)
    service = models.CharField(max_length=100, default=None)
    address_id = models.ForeignKey(Address, on_delete=models.CASCADE, default=None)
    token = models.CharField(max_length=22, default=None)

class Recovery(models.Model):
    owner_id = models.ForeignKey(newUser, on_delete=models.CASCADE, default=None)
    code = models.CharField(max_length=6, default=None)
