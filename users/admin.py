from django.contrib import admin

# Register your models here.

from django.contrib import admin
from .models import GeneralUser, User


class GeneralUserAdmin(admin.ModelAdmin):
    list_display = (
        "pk", "login_negozio", "user", "telefono", "citta", "indirizzo", "provincia", "regione", "codice_postale",
        "latitudine", "longitudine")


class UserAdmin(admin.ModelAdmin):
    list_display = ("pk", "username", "email", "first_name", "last_name", "is_staff")


# Faccio in modo di visualizzare nella schermata di admin gli Item
admin.site.register(GeneralUser, GeneralUserAdmin)
admin.site.unregister(User)
admin.site.register(User, UserAdmin)

# admin.site.register(NormalUser)
