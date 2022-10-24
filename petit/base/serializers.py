from rest_framework import serializers
from .models import newUser

class RegisterUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = newUser
        fields = ('email', 'user_name', 'password')

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance
