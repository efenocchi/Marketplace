from django.db import models

#CLASSE dei PRODOTTI in vendita
class Item(models.Model):
    name = models.CharField(max_length=100)
    price = models.FloatField()
    category = models.TextField()
    description = models.TextField()
    image = models.ImageField()

    #faccio in modo che tutti i file quando li aggiungo abbiano il nome=name
    def __str__(self):
        return self.name

class OrderItem(models.Model):
    #user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             #on_delete=models.CASCADE)
    ordered = models.BooleanField(default=False)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)

    def __str__(self):
        return self.item.name

class Order(models.Model):
    #user = models.ForeignKey(settings.AUTH_USER_MODEL,
        #                     on_delete=models.CASCADE)
    ref_code = models.CharField(max_length=20, blank=True, null=True)
    items = models.ManyToManyField(OrderItem)
    start_date = models.DateTimeField(auto_now_add=True)
    ordered_date = models.DateTimeField()
    ordered = models.BooleanField(default=False)
