from django.urls import reverse
from django.test import TestCase, Client
from django.contrib.auth.models import User
from users.models import GeneralUser #Profile
import pytest


@pytest.mark.django_db
class TestViews(TestCase):
    def setUp(self):
        self.user_unauthenticated = Client()
        self.user_login = Client()
        self.user = User.objects.create_user(username='user', password='12345')

        self.generaluser = User.objects.get(user=self.user)
        # profilo.user = self.user_normale,
        self.generaluser.indirizzo = 'Via Vivarelli'
        self.generaluser.citta = 'Modena'
        self.generaluser.provincia = 'Modena'
        self.generaluser.regione = 'Emilia Romagna'
        self.generaluser.codice_postale = 41125
        self.generaluser.stato = 'Italia'
        self.generaluser.latitudine = 0
        self.generaluser.longitudine = 0
        self.generaluser.telefono = 3391234567
        self.generaluser.data_nascita= '15/08/2140 15:00'
        self.generaluser.foto_profilo = None
        self.generaluser.eta= 10
        self.generaluser.sesso='Maschio'
        self.profilo.save()

        self.user_login.login(username='user', password='12345')

        self.shop_login = Client()
        self.shop = User.objects.create_user(username='shop', password='12345')
