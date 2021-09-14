from django.db import models
from django.contrib.auth.models import User
from items.models import Item

# Create your models here.


class ReviewItem(models.Model):
    """
    Il writer può essere solo un utente (acquirente o negozio)
    """
    writer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='writer_item')
    receiver = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='receiver_item')

    title_of_comment = models.CharField(max_length=100)
    description = models.CharField(max_length=250)
    rating = models.FloatField(default=5)

    class Meta:
        verbose_name = 'ReviewItem'
        verbose_name_plural = "ReviewItems"

    def __str__(self):
        return self.title_of_comment


class ReviewShop(models.Model):
    """
    Il writer può essere solo un utente (acquirente o negozio)
    Il receiver è un negozio
    """
    writer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='writer_shop')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='receiver_shop')

    rating = models.FloatField(default=5)
    title_of_comment = models.CharField(max_length=100)
    description = models.CharField(max_length=250)

    class Meta:
        verbose_name = 'ReviewShop'
        verbose_name_plural = "ReviewShops"

    def __str__(self):
        return self.title_of_comment
