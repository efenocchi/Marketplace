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