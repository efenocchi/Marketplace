from django.db import models
from django.contrib.auth.models import User
from items.models import Item, Order, OrderItem


# Create your models here.

class Transaction(models.Model):
    """
    Serve per identificare in modo univoco ogni transazione creata tra acquirente e venditore.
    Permette di lasciare un feedback per ognuna di esse
    """
    id_transaction = models.CharField(max_length=100)
    customer = models.CharField(max_length=100)
    # per sapere se l'acquisto nel negozio è stato fatto da un altro negozio
    customer_is_shop = models.BooleanField(default=False)


class ReviewItem(models.Model):
    """
    Il writer può essere un utente acquirente o un negozio
    """
    writer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='writer_item')
    # receiver = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='receiver_item')
    # order_item = models.ForeignKey(OrderItem, on_delete=models.CASCADE)
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    title_of_comment = models.CharField(max_length=100)
    description = models.CharField(max_length=250)
    rating = models.IntegerField(default=5)

    class Meta:
        verbose_name = 'ReviewItem'
        verbose_name_plural = "ReviewItems"

    def __str__(self):
        return self.title_of_comment


class ReviewShop(models.Model):
    """
    Il writer può essere solo un utente (acquirente o negozio)
    Il receiver è un negozio
    E' stato creato un campo transazione in modo da lasciare tanti feedback al negozio quanti sono gli acquisti
    effettuati, senza questo campo il negozio avrebbe potuto ricevere solo una recensione dall'utente
    (magari in un'occasione il negoziante si è comportato in modo corretto e in quella successiva no)
    """
    writer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='writer_shop')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='receiver_shop')
    # transaction = models.ForeignKey(Transaction, on_delete=models.CASCADE, related_name='customer_to_shop')  # custuomer or another shop
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
    Il receiver è un negozio
    E' stato creato un campo transazione in modo da lasciare tanti feedback agli acquirenti quanti sono gli acquisti
    da lui effettuati, senza questo campo il negozio avrebbe potuto dare solo una recensione all'utente
    """
    writer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='writer_customer')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='receiver_customer')
    order = models.ForeignKey(Order, on_delete=models.CASCADE)

    # transaction = models.ForeignKey(Transaction, on_delete=models.CASCADE, related_name='shop_to_user')
    rating = models.IntegerField(default=5)
    title_of_comment = models.CharField(max_length=100)
    description = models.CharField(max_length=250)

    class Meta:
        verbose_name = 'ReviewCustomer'
        verbose_name_plural = "ReviewCustomers"

    def __str__(self):
        return self.title_of_comment



