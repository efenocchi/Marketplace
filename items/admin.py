from django.contrib import admin
from .models import Item

#Faccio in modo di visualizzare nella schermata di admin gli Item
admin.site.register(Item)