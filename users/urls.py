#questo file non viene creato da django al momento della creazione dell'app ma deve essere creato manualmente
from django.urls import path
from . import views

app_name = 'users'  #fondamentale per poter usare ad es. {% url 'users:login_all'%}

urlpatterns = [

    # /users/login/
    path('login', views.login_all, name='login_all'),

    # /utenti/registrazione/
    path('registration', views.registration, name='registration'),

    path('test_login', views.test_login, name='test_login'),

    # /utenti/registrazione/normale
    #path('registration/user', views.registration_user, name='registration_user'),

    # /utenti/registrazione/petsitter
    #path('registration/shop', views.registration_shop, name='registration_shop'),

    # /utenti/logout/
    #path('logout', views.logout, name='logout'),

]
