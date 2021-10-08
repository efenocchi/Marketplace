import datetime

from django.db import models
from django.contrib.auth.models import User
from django.conf import settings

# Create your models here.


class GeneralUser(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    indirizzo = models.CharField(max_length=100)
    citta = models.CharField(max_length=50, default='')
    provincia = models.CharField(max_length=2, default='')
    regione = models.CharField(max_length=50, default='')
    codice_postale = models.CharField(max_length=50, default='')
    stato = models.CharField(max_length=50, default='')
    latitudine = models.FloatField(null=True, default=0, blank=True)
    longitudine = models.FloatField(null=True, default=0, blank=True)
    telefono = models.CharField(null=True, default="", max_length=20)
    data_nascita = models.DateField(null=True, default=None, blank=True)
    foto_profilo = models.FileField(null=True, default='', blank=True)
    eta = models.PositiveIntegerField(null=True)
    sesso = models.CharField(max_length=50, default="", null=True)

    # descrizione dei propri gusti in modo da poter ricevere consigli dai negozi tramite chat
    descrizione = models.CharField(max_length=250, default="", null=True)
    login_negozio = models.BooleanField(default=False)  # per capire se il login è fatta da un utente o da un negozio

    # quando vengo bloccato viene settato questo valore il quale verrà controllato quando devo prenotare merce
    data_fine_blocco = models.DateField(default=datetime.date.today)
    # se vengo bloccato per un numero di volte elevate posso essere bannato
    numero_volte_bloccato = models.IntegerField(default=0)

    # def foto_profilo_or_default(self, default_path=static("/images/user_default.jpg")):
    #     if self.foto_profilo:
    #         return settings.MEDIA_URL + str(self.foto_profilo)
    #     return default_path

    def __str__(self):
        return self.user.username

    class Meta:
        verbose_name = 'GeneralUser'
        verbose_name_plural = 'GeneralUsers'

