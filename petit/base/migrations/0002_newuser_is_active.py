# Generated by Django 4.1.1 on 2022-10-23 17:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='newuser',
            name='is_active',
            field=models.BooleanField(default=True),
        ),
    ]