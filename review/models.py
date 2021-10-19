from django.db import models
from django.contrib.auth.models import User
from items.models import Item, Order, OrderItem


# Create your models here.

# class Transaction(models.Model):
#     """
#     Serve per identificare in modo univoco ogni transazione creata tra acquirente e venditore.
#     Permette di lasciare un feedback per ognuna di esse
#     """
#     id_transaction = models.CharField(max_length=100)
#     customer = models.CharField(max_length=100)
#     # per sapere se l'acquisto nel negozio è stato fatto da un altro negozio
#     customer_is_shop = models.BooleanField(default=False)


class ReviewItem(models.Model):
    """
    L'utente che ha effettuato un acquisto può lasciare una recensione per ogni oggetto comprato.
    """
    writer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='writer_item')
    # receiver = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='receiver_item')
    # order_item = models.ForeignKey(OrderItem, on_delete=models.CASCADE)
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    title_of_comment = models.CharField(max_length=100)
    description = models.CharField(max_length=250)
    rating = models.IntegerField(default=5)
    altro = models.CharField(max_length=20, blank=True, null=True)

    class Meta:
        verbose_name = 'ReviewItem'
        verbose_name_plural = "ReviewItems"

    def __str__(self):
        return self.title_of_comment


class ReviewShop(models.Model):
    """
    L'acquirente può recensire una volta il negozio.
    Il writer può essere solo un utente (acquirente o negozio)
    Il receiver è un negozio
    """
    writer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='writer_shop')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='receiver_shop')
    rating = models.IntegerField(default=5)
    title_of_comment = models.CharField(max_length=100)
    description = models.CharField(max_length=250)

    class Meta:
        verbose_name = 'ReviewShop'
        verbose_name_plural = "ReviewShops"

    def __str__(self):
        return self.title_of_comment


class ReviewCustomer(models.Model):
    """
    Il writer può essere solo un negozio
    Il receiver è un utente
    Una volta che è stato effettuato un acquisto e quindi un ordine con ref code il negozio può lasciare la recensione
    per l'utente acquirente.
    Una recensione negativa comporterà un periodo di fermo per l'utente acquirente.
    """
    writer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='writer_customer')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='receiver_customer')
    order = models.ForeignKey(Order, on_delete=models.CASCADE)

    rating = models.IntegerField(default=5)
    title_of_comment = models.CharField(max_length=100)
    description = models.CharField(max_length=250)

    class Meta:
        verbose_name = 'ReviewCustomer'
        verbose_name_plural = "ReviewCustomers"

    def __str__(self):
        return self.title_of_comment

