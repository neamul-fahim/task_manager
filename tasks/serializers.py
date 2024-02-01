from rest_framework import serializers
from .models import Task, Photo
from django.contrib.auth import get_user_model

User = get_user_model()


class PhotoModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Photo
        fields = '__all__'


class UserModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
        extra_kwargs = {'password': {'write_only': True}}


class TaskModelSerializer(serializers.ModelSerializer):
    # user = UserModelSerializer()

    class Meta:
        model = Task
        fields = '__all__'

    def update(self, instance, validated_data):
        print(f"=========update==============")
        # Loop through the validated_data and update the instance fields
        for key, value in validated_data.items():
            print(f"===={key}===={value}")
            setattr(instance, key, value)

        # Save the instance with the updated data
        instance.save()
        print(f"=========update========={instance}=====")
        return instance


class TaskWithPhotosSerializer(serializers.ModelSerializer):
    photos = PhotoModelSerializer(many=True, read_only=True)

    class Meta:
        model = Task
        fields = '__all__'
