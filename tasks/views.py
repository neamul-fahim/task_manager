from django.db.models import Case, When, Value
import os
from django.conf import settings
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model, authenticate, login
from django.shortcuts import render
from django.views import View
from django.db.models import Q
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import ValidationError
from .serializers import TaskModelSerializer, UserModelSerializer, PhotoModelSerializer, TaskWithPhotosSerializer
from .models import Task, Photo

User = get_user_model()


class SignupPageView(View):
    template_name = 'tasks/signup.html'

    def get(self, request, *args, **kwargs):
        context = {}
        return render(request, self.template_name, context)


class LoginPageView(View):
    template_name = 'tasks/login.html'

    def get(self, request, *args, **kwargs):
        context = {}
        return render(request, self.template_name, context)


class UserProfilePageView(View):
    template_name = 'tasks/user_profile.html'

    def get(self, request, *args, **kwargs):
        context = {}

        return render(request, self.template_name, context)


class HomePageView(View):
    template_name = 'tasks/home_page.html'

    def get(self, request, *args, **kwargs):

        context = {}
        return render(request, self.template_name, context)


class CreateTaskPageView(View):
    template_name = 'tasks/create_task_page.html'

    def get(self, request, *args, **kwargs):

        context = {}
        return render(request, self.template_name, context)


class UpdateTaskPageView(View):
    template_name = 'tasks/update_task.html'

    def get(self, request, *args, **kwargs):

        context = {}
        return render(request, self.template_name, context)


class SearchPageView(View):
    template_name = 'tasks/search_page.html'

    def get(self, request, *args, **kwargs):

        context = {}
        return render(request, self.template_name, context)


class FilterPageView(View):
    template_name = 'tasks/filter_page.html'

    def get(self, request, *args, **kwargs):

        context = {}
        return render(request, self.template_name, context)


class EditPhotoPageView(View):
    template_name = 'tasks/edit_photo_page.html'

    def get(self, request, *args, **kwargs):

        task_id = request.GET.get('taskID')

        # Include taskID in the context
        context = {'taskID': task_id}
        return render(request, self.template_name, context)


class UserAPIView(APIView):

    def get(self, request):
        user = self.request.user
        serializer = UserModelSerializer(user)
        return Response({"user": serializer.data}, status=status.HTTP_200_OK)


class SignupAPIView(APIView):
    def post(self, request):
        username = request.data.get("username", None)
        password = request.data.get("password", None)
        email = request.data.get("email", None)
        if username == None or email == None or password == None:
            return Response("username or email or password can't be null", status=status.HTTP_400_BAD_REQUEST)

        existing_user = User.objects.filter(username=username).first()
        if existing_user is not None:
            return Response("User already exists", status=status.HTTP_400_BAD_REQUEST)

        try:
            User.objects.create_user(
                username=username, email=email, password=password)
            return Response("user created", status=status.HTTP_200_OK)
        except:
            return Response("something went wrong", status=status.HTTP_400_BAD_REQUEST)


class LoginAPIView(APIView):
    def post(self, request):
        username = request.data.get("username", None)
        password = request.data.get("password", None)
        if username == None or password == None:
            return Response("username or password can't be null", status=status.HTTP_400_BAD_REQUEST)
        user = authenticate(
            request=request, username=username, password=password)
        if user is not None:
            login(request, user)
            return Response('Login successful', status=status.HTTP_200_OK)
        else:
            return Response('Invalid credentials', status=status.HTTP_400_BAD_REQUEST)


class SearchAPIView(APIView):
    def get(self, request):
        user = self.request.user
        try:
            # Extract search query parameter from the request
            search_query = request.GET.get('query', '')

            # Filter tasks based on the user and search query
            tasks = Task.objects.filter(user=user).filter(
                # Case-insensitive search for task title
                Q(title__icontains=search_query)
            ).order_by('-created_at')

            serializer = TaskWithPhotosSerializer(tasks, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class PhotosAPIView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request, task_id):
        try:
            photos = Photo.objects.filter(task_id=task_id)
            serializer = PhotoModelSerializer(photos, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request, task_id, photo_id):
        try:
            photo = Photo.objects.get(id=photo_id, task_id=task_id)
            photo.delete()
            return Response({'message': 'Photo deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        except Photo.DoesNotExist:
            return Response({'error': 'Photo not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        task_id = request.data.get('taskID')
        photos = request.FILES.getlist('photos')
        try:
            task = Task.objects.get(pk=task_id)
            for photo in photos:
                new_photo = Photo(task=task, image=photo)
                new_photo.save()
            return Response(status=status.HTTP_201_CREATED)
        except Task.DoesNotExist:
            return Response({'error': 'Task not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class TaskAPIView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request, pk=None):
        user = self.request.user
        if pk:
            task_instance = get_object_or_404(Task, pk=pk, user=user)
            serializer = TaskWithPhotosSerializer(task_instance)
            return Response(serializer.data, status=status.HTTP_200_OK)

        else:
            try:
                tasks = Task.objects.filter(user=user).order_by(
                    Case(
                        When(priority='high', then=Value(1)),
                        When(priority='medium', then=Value(2)),
                        When(priority='low', then=Value(3)),
                        default=Value(4),
                    )
                )
                creation_date_filter = self.request.query_params.get(
                    'creation_date', None)
                due_date_filter = self.request.query_params.get(
                    'due_date', None)
                priority_filter = self.request.query_params.get(
                    'priority', None)
                status_filter = self.request.query_params.get('status', None)

                # Apply filters
                if creation_date_filter:
                    tasks = tasks.filter(created_at__date=creation_date_filter)
                if due_date_filter:
                    tasks = tasks.filter(due_date__date=due_date_filter)
                if priority_filter:
                    tasks = tasks.filter(priority=priority_filter)
                if status_filter:
                    tasks = tasks.filter(is_complete=(
                        status_filter.lower() == 'complete'))

                task_serializer = TaskWithPhotosSerializer(tasks, many=True)
                return Response(task_serializer.data, status=status.HTTP_200_OK)
            except:
                return Response('Something went wrong', status=status.HTTP_400_BAD_REQUEST)

    def post(self, request):
        try:
            request_data = request.data
            request_data['user'] = self.request.user.id
        except:
            request_data = request.data.copy()
            request_data['user'] = self.request.user.id
        task_serializer = TaskModelSerializer(data=request_data)
        is_valid = task_serializer.is_valid()
        if not is_valid:
            print(f"========task===={task_serializer.errors}")
            return Response({"error": task_serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        task_instance = task_serializer.save()
        photos_data = request.FILES.getlist('photos', [])
        print(f"=========photos_data====={len(photos_data)}")

        for photo_data in photos_data:
            Photo.objects.create(task=task_instance, image=photo_data)

        return Response("Task created", status=status.HTTP_201_CREATED)

    def put(self, request, pk):
        user = self.request.user

        try:
            request_data = request.data
            request_data['user'] = user.id
        except:
            request_data = request.data.copy()
            request_data['user'] = user.id

        task_instance = get_object_or_404(Task, pk=pk, user=user)
        task_serializer = TaskModelSerializer(
            instance=task_instance, data=request_data)
        if not task_serializer.is_valid():
            print(f"========task===={task_serializer.errors}")
            return Response({"error": task_serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        task_serializer.save()

        photos_data = request.FILES.getlist('photos', [])
        if len(photos_data) > 0:
            photos = Photo.objects.filter(task=task_instance)
            for photo in photos:
                file_path = os.path.join(settings.MEDIA_ROOT, str(photo.image))
                if os.path.exists(file_path):
                    os.remove(file_path)
                photo.delete()
        for photo_data in photos_data:
            Photo.objects.create(task=task_instance, image=photo_data)

        return Response("Task updated", status=status.HTTP_200_OK)

    def delete(self, request, pk):
        user = self.request.user
        task_instance = get_object_or_404(Task, pk=pk, user=user)
        photos = Photo.objects.filter(task=task_instance)
        for photo in photos:
            file_path = os.path.join(settings.MEDIA_ROOT, str(photo.image))
            if os.path.exists(file_path):
                os.remove(file_path)
            photo.delete()
        task_instance.delete()
        return Response({'response': 'Task deleted'}, status=status.HTTP_200_OK)
