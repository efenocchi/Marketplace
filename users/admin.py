from django.contrib import admin

# Register your models here.

from django.contrib import admin
from .models import GeneralUser


class NormalUserAdmin(admin.ModelAdmin):
    list_display = ("pk","login_negozio","user","telefono","citta","indirizzo","provincia","regione","latitudine","longitudine")


class ShopProfileAdmin(admin.ModelAdmin):
    list_display = ("pk","login_negozio","user","telefono","citta","indirizzo","provincia","regione","latitudine","longitudine")

#Faccio in modo di visualizzare nella schermata di admin gli Item
admin.site.register(GeneralUser, NormalUserAdmin)
# admin.site.register(GeneralUser, ShopProfileAdmin)

# admin.site.register(NormalUser)
