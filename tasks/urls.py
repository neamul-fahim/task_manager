from django.urls import path
from . import views

urlpatterns = [
    path('', views.LoginPageView.as_view(), name="login-page"),
    path('task/', views.TaskAPIView.as_view(), name='task'),
    # might have problem ,if face problem, set name = update-task
    path('task/<int:pk>/', views.TaskAPIView.as_view(), name='task'),
    path('create_task_page/', views.CreateTaskPageView.as_view(),
         name='create-task-page'),
    path('signup_page/', views.SignupPageView.as_view(), name="signup-page"),
    path('signup_API/', views.SignupAPIView.as_view(), name="signup-API"),
    path('login_API/', views.LoginAPIView.as_view(), name="login-API"),
    path('user_profile_page/', views.UserProfilePageView.as_view(),
         name='user_profile_page'),
    path('home_page/', views.HomePageView.as_view(),
         name='home_page'),
    path('user/', views.UserAPIView.as_view(),
         name='user'),
    # path('task/<int:article_id>/',
    #      views.UpdateTaskAPIView.as_view(), name='update_task'),
    path('update_task_page/', views.UpdateTaskPageView.as_view(),
         name='update_task_page'),
    path('search_page/', views.SearchPageView.as_view(), name='search-page'),
    path('search_API/', views.SearchAPIView.as_view(), name='search-API'),
    path('filter_page/', views.FilterPageView.as_view(), name='filter-page'),
    path('edit_photo_page/',
         views.EditPhotoPageView.as_view(), name='edit-photo'),
    path('photos/', views.PhotosAPIView.as_view(), name='photos'),
    path('photos/<int:task_id>/', views.PhotosAPIView.as_view(), name='photos'),
    path('photos/<int:task_id>/<int:photo_id>/',
         views.PhotosAPIView.as_view(), name='photos'),


]
