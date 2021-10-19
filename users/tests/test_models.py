from django.templatetags.static import static
from django.test import TestCase
from users.models import User
from django.contrib.auth.models import User


class TestModels(TestCase):
    def setUp(self):
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

    # def test_foto_profilo_or_default(self):
    #     self.assertEquals(self.generaluser.foto_profilo_or_default(), static("/images/user_default.jpg"))


