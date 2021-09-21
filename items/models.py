from django.db import models
from django.contrib.auth.models import User
from django.conf import settings

#CLASSE dei PRODOTTI in vendita
from django.templatetags.static import static

CATEGORY_CHOICES = (
    ('Abbigliamento', 'Abbigliamento'),
    ('Tecnologia', 'Tecnologia'),
    ('Sport', 'Sport'),
    ('Casa', 'Casa'),
    ('Motori', 'Motori'),
)

#LABEL_CHOICES = (
#   ('P', 'primary'),
#   ('S', 'secondary'),
#   ('D', 'danger')
#)

class Item(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user')
    name = models.CharField(max_length=100) #title
    price = models.FloatField(default=0)
    discount_price = models.FloatField(blank=True, null=True)
    category = models.CharField(choices=CATEGORY_CHOICES, max_length=20)
   # label = models.CharField(choices=LABEL_CHOICES, max_length=1)
    description = models.TextField()
    quantity = models.IntegerField(default=1)
    image = models.FileField(null=True, default='', blank=True)
    #quantity_available = models.IntegerField(null=True, default=1)

    def item_pic_or_default(self, default_path="/default_images/item_default.jpg"):
        if self.image:
            return settings.MEDIA_URL + str(self.image)

        return default_path
    #faccio in modo che tutti i file quando li aggiungo abbiano il nome=name
    # def __str__(self):
    #     return self.name

    def __str__(self):
        return self.name



class OrderItem(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE)
    ordered = models.BooleanField(default=False)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)

    def __str__(self):
        return self.item.name

    def __str__(self):
        return f"{self.quantity} of {self.item.name}"

    def get_total_item_price(self):
        return self.quantity * self.item.price

    def get_total_discount_item_price(self):
        return self.quantity * self.item.discount_price

    def get_amount_saved(self):
        return self.get_total_item_price() - self.get_total_discount_item_price()

    def get_final_price(self):
        if self.item.discount_price:
            return self.get_total_discount_item_price()
        return self.get_total_item_price()

    def get_quantity(self):
        return self.quantity

class Order(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE)
    ref_code = models.CharField(max_length=20, blank=True, null=True)
    items = models.ManyToManyField(OrderItem)
    start_date = models.DateTimeField(auto_now_add=True)
    ordered_date = models.DateTimeField()
    ordered = models.BooleanField(default=False)
    number_order = models.IntegerField(default=0)

    def __str__(self):
        return self.user.username

    def get_total(self):
        total = 0
        for order_item in self.items.all():
            total += order_item.get_final_price()
        return total

    def get_final_quantity(self):
        total_quantity = 0
        for order_item in self.items.all():
            total_quantity += order_item.get_quantity()
        return total_quantity
