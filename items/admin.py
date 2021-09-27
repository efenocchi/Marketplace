from django.contrib import admin
from .models import Item, OrderItem, Order


# Faccio in modo di visualizzare nella schermata di admin gli Item
class ItemAdmin(admin.ModelAdmin):
    list_display = ("pk", "user", "name", "price", "category", "description", "image")


class OrderItemAdmin(admin.ModelAdmin):
    list_display = ("pk", "user", "item", "ordered", "quantity", "review_item_done")


class OrderAdmin(admin.ModelAdmin):
    list_display = ("pk", "user", "ref_code")


admin.site.register(Item, ItemAdmin)
admin.site.register(OrderItem, OrderItemAdmin)
admin.site.register(Order, OrderAdmin)
