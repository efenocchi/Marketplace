from django.contrib import admin
from .models import Item,OrderItem,Order

#Faccio in modo di visualizzare nella schermata di admin gli Item
admin.site.register(Item)
admin.site.register(OrderItem)
admin.site.register(Order)