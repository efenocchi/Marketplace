from . import views
from django.urls import path
app_name = 'API'

urlpatterns = [

    path('', views.UserInfoLogin.as_view(), name='API-user-info'),
    path('users/find/<str:name>/', views.FindUser.as_view(), name='API-cerca-utente'),
    path('users/register/normaluser/', views.RegisterNormalUserFromMobilePhone.as_view(), name='API-registra-utente-normale'),
    path('users/register/shopuser/', views.RegisterShopUserFromMobilePhone.as_view(), name='API-registra-negozio'),
    path('users/profile/<int:pk>/', views.UserInfoLogin.as_view(), name='API-user-info'),
    path('users/profile/', views.ModifyInfoLoginUser.as_view(), name='API-user-modify-info'),
    path('reviews_customer/<int:pk>/', views.ReturnReviewUser.as_view(), name='API-reviews-customer'),

]