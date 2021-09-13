#questo file non viene creato da Django al momento della creazione dell'app ma deve essere creato manualmente
from django.urls import path
from . import views



urlpatterns = [

    #views.name = name
    path('', views.index, name='index'),    #quando viene riconosciuto il path localhost:8000 vengo reindirizzato alla funzione index presente in views.py di main

    #/main/login/
    # path('login', views.login_page, name='login_page'),

    #/main/registration/
    path('registration', views.registration_page, name='registration_page'),

    #/main/cart-> DA CAMBIAREEEEEEEEEE !!!!! NON VOGLIO IL CARRRELLO VUOTO NELLA HOME è solo x vedere la grafica
    path('empty_cart', views.empty_cart, name='empty_cart'),

    path('contact', views.contact, name='contact'),

    path('mostra_logout_avvenuto', views.mostra_logout_avvenuto, name='mostra_logout_avvenuto'),
    path('autenticato', views.autenticato, name='autenticato'),
]
