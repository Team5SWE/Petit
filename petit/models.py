import models

class Accounts(models.Model):
    business_email = models.CharField(max_length=100)
    business_password = models.CharField(max_length=100)
