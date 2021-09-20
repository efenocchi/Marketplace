from django.contrib import admin
from .models import Item, OrderItem, Order


# Faccio in modo di visualizzare nella schermata di admin gli Item
class ItemAdmin(admin.ModelAdmin):
    list_display = ("pk", "user", "name", "price", "category", "description", "image")


admin.site.register(Item, ItemAdmin)
admin.site.register(OrderItem)
admin.site.register(Order)
