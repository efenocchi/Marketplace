from django.contrib import admin

# Register your models here.

from django.contrib import admin
from .models import ReviewItem, ReviewShop


class ReviewItemAdmin(admin.ModelAdmin):
    list_display = ("pk","writer","receiver","title_of_comment","description","rating")

class ReviewShopAdmin(admin.ModelAdmin):
    list_display = ("pk","writer","receiver","title_of_comment","description","rating")


#Faccio in modo di visualizzare nella schermata di admin gli Item
admin.site.register(ReviewItem, ReviewItemAdmin)
admin.site.register(ReviewShop, ReviewShopAdmin)

# admin.site.register(NormalUser)
