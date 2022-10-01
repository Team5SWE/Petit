# Generated by Django 4.1.1 on 2022-09-28 01:09

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0002_address'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='address',
            name='zip',
        ),
        migrations.AddField(
            model_name='appointment',
            name='address_id',
            field=models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, to='base.address'),
        ),
        migrations.AddField(
            model_name='appointment',
            name='service',
            field=models.CharField(default=None, max_length=100),
        ),
        migrations.AlterField(
            model_name='appointment',
            name='business_id',
            field=models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, to='base.business'),
        ),
        migrations.AlterField(
            model_name='appointment',
            name='client_email',
            field=models.CharField(default=None, max_length=50),
        ),
        migrations.AlterField(
            model_name='appointment',
            name='client_phone',
            field=models.CharField(default=None, max_length=16),
        ),
        migrations.AlterField(
            model_name='appointment',
            name='date',
            field=models.CharField(default=None, max_length=15),
        ),
        migrations.AlterField(
            model_name='appointment',
            name='end',
            field=models.CharField(default=None, max_length=5),
        ),
        migrations.AlterField(
            model_name='appointment',
            name='provider_id',
            field=models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, to='base.employee'),
        ),
        migrations.AlterField(
            model_name='appointment',
            name='start',
            field=models.CharField(default=None, max_length=5),
        ),
    ]