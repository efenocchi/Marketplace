from . import views
from django.urls import path
app_name = 'API'

urlpatterns = [

    path('', views.userInfoLogin.as_view(), name='API-user-info'),
    path('users/find/<str:name>/', views.findUser.as_view(), name='API-cerca-utente'),

]