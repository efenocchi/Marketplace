from django.contrib import admin

# Register your models here.

from django.contrib import admin
from .models import NormalUser, ShopProfile


class NormalUserAdmin(admin.ModelAdmin):
    list_display = ("pk","user","citta","indirizzo","provincia","regione","latitudine","longitudine")


class ShopProfileAdmin(admin.ModelAdmin):
    list_display = ("pk","user","citta","indirizzo","provincia","regione","latitudine","longitudine")

#Faccio in modo di visualizzare nella schermata di admin gli Item
admin.site.register(NormalUser, NormalUserAdmin)
admin.site.register(ShopProfile, ShopProfileAdmin)
# admin.site.register(NormalUser)
