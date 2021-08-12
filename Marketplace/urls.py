"""Marketplace URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
#poichè si sta utilizzando Django >= 2.x si userà path e non url + pattern '' e non regexp r'^$' (analogamente nelle views)
from django.urls import path
from django.conf.urls import include    #aggiungo per poter usare la funzione include

#RICORDARSI: la / iniziale non va scritta all'inizio perchè si assume già inclusa nel path di grado inferiore
urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('main.urls')),          #appena apro localhost:8000 parte la main.views
    path('users/', include('users.urls')),
]
