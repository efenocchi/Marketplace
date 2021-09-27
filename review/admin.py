from django.contrib import admin

# Register your models here.

from django.contrib import admin
from .models import ReviewItem, ReviewShop, ReviewCustomer


class ReviewItemAdmin(admin.ModelAdmin):
    list_display = ("pk", "writer", "order", "item", "title_of_comment", "description", "rating")


class ReviewShopAdmin(admin.ModelAdmin):
    list_display = ("pk", "writer", "receiver", "title_of_comment", "description", "rating")


class ReviewCustomerAdmin(admin.ModelAdmin):
    list_display = ("pk", "writer", "receiver", "title_of_comment", "order", "description", "rating")

    # def get_ref_code(self, instance):
    #     return instance.get_ref_code()


# Faccio in modo di visualizzare nella schermata di admin gli Item
admin.site.register(ReviewItem, ReviewItemAdmin)
admin.site.register(ReviewShop, ReviewShopAdmin)
admin.site.register(ReviewCustomer, ReviewCustomerAdmin)

# admin.site.register(NormalUser)
