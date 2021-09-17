from django.db import models
from django.contrib.auth.models import User
from django.conf import settings


class Item(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user')
    name = models.CharField(max_length=100)
    price = models.FloatField(default=0)
    category = models.TextField()
    description = models.TextField()
    image = models.FileField(null=True, default='', blank=True)
    quantity_available = models.IntegerField(default=1)
    is_finished = models.BooleanField(default=False)

    def item_pic_or_default(self, default_path="/default_images/item_default.jpg"):
        if self.image:
            return settings.MEDIA_URL + str(self.image)

        return default_path
    #faccio in modo che tutti i file quando li aggiungo abbiano il nome=name
    # def __str__(self):
    #     return self.name


class OrderItem(models.Model):
    #user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             #on_delete=models.CASCADE)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    ordered = models.BooleanField(default=False)
    quantity = models.IntegerField(default=1)

    def __str__(self):
        return self.item.name


class Order(models.Model):
    #user = models.ForeignKey(settings.AUTH_USER_MODEL,
                            # on_delete=models.CASCADE)

    ref_code = models.CharField(max_length=20, blank=True, null=True)
    items = models.ManyToManyField(OrderItem)
    start_date = models.DateTimeField(auto_now_add=True)
    ordered_date = models.DateTimeField()
    ordered = models.BooleanField(default=False)
