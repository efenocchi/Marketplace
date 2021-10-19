from django.urls import reverse
from django.test import TestCase, Client
from django.contrib.auth.models import User
from users.models import GeneralUser
from items.models import Item, OrderItem, Order, WhoHasReviewed

import pytest

@pytest.mark.django_db
class TestViews(TestCase):
    def setUp(self):
        # USER
        self.user_unauthenticated = Client()
        self.user_login = Client()
        self.user = User.objects.create_user(username='username', password='12345')
        self.generaluser = User.objects.get(user=self.user)
        self.generaluser.indirizzo = 'Via Vivarelli'
        self.generaluser.citta = 'Modena'
        self.generaluser.provincia = 'Modena'
        self.generaluser.regione = 'Emilia Romagna'
        self.generaluser.codice_postale = 41125
        self.generaluser.stato = 'Italia'
        self.generaluser.latitudine = 0
        self.generaluser.longitudine = 0
        self.generaluser.telefono = 3391234567
        self.generaluser.data_nascita = '15/08/2140 15:00'
        self.generaluser.foto_profilo = None
        self.generaluser.eta = 12
        self.generaluser.sesso = 'Maschio'
        self.generaluser.descrizione = 'Una descrizione'
        self.generaluser.login_negozio = False
        self.generaluser.data_fine_blocco = '15/08/2140 15:00'
        self.generaluser.numero_volte_bloccato = 1
        self.generaluser.save()

        self.user_login.login(username='username', password='12345')

        # SHOP
        self.shop_unauthenticated = Client()
        self.shop_login = Client()
        self.shop = User.objects.create_user(username='shop', password='12345')
        self.generaluser = User.objects.get(user=self.shop)
        self.generaluser.indirizzo = 'Via Vivarelli'
        self.generaluser.citta = 'Modena'
        self.generaluser.provincia = 'Modena'
        self.generaluser.regione = 'Emilia Romagna'
        self.generaluser.codice_postale = 41125
        self.generaluser.stato = 'Italia'
        self.generaluser.latitudine = 0
        self.generaluser.longitudine = 0
        self.generaluser.telefono = 3391234567
        self.generaluser.data_nascita = '15/08/2140 15:00'
        self.generaluser.foto_profilo = None
        self.generaluser.eta = 12
        self.generaluser.sesso = 'Maschio'
        self.generaluser.descrizione = 'Una descrizione'
        self.generaluser.login_negozio = False
        self.generaluser.data_fine_blocco = '15/08/2140 15:00'
        self.generaluser.numero_volte_bloccato = 1
        self.generaluser.save()

        self.shop_login.login(username='shop', password='12345')

        #ITEM + ORDERITEM + ORDER + WHOHASREVIEWED
        item = Item.objects.create(
            user=self.user_normale,
            name='Un nome',
            price=100,
            discount_price=50,
            category='Abbigliamento',
            description='Una descrizione',
            quantity=5
            # image=
        )

        orderitem = OrderItem.objects.create(
            user=self.user_normale,
            item=item,
            ordered=False,
            quantity=5,
            review_item_done=False
        )
        whohasreviewed = WhoHasReviewed.objects.create(
            writer=self.user_normale
        )

        order = Order.objects.create(
            user=self.user_normale,
            ref_code='Un ref_code',
            items=orderitem,
            start_date='15/08/2140 15:00',
            ordered_date='15/08/2140 15:00',
            ordered=False,
            number_order=5,
            review_customer_done=whohasreviewed
        )

        self.user_oauth_login = Client()
        self.user_oauth = User.objects.create_user(username='oauth', password='12345')
        self.user_oauth_login.login(username='oauth', password='12345')


    #CHECK VIEWS

