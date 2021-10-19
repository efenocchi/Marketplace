from django.test import TestCase
from users.forms import UserForm, NormalUserForm, ShopProfileForm


class TestForms(TestCase):

    def test_user_form_valid_data(self):
        form = UserForm(data={
            'username': 'mariorossi',
            'password': 'password0!',
        }, oauth_user=0)

        self.assertTrue(form.is_valid())

    def test_user_form_no_data(self):
        form = UserForm(data={}, oauth_user=0)

        self.assertFalse(form.is_valid())
        self.assertEquals(len(form.errors), 2)

    def test_normal_user_form_valid_data(self):
        form = NormalUserForm(data={
            'indirizzo': 'Via Vivarelli',
            'citta': 'Modena',
            'regione': 'Emilia-Romagna',
            'provincia': 'MO',
            'codice_postale': 41125,
            'descrizione': 'Una descrizione'
        })

        self.assertTrue(form.is_valid())

    def test_normal_user_form_no_data(self):
        form = NormalUserForm(data={})

        self.assertFalse(form.is_valid())
        self.assertEquals(len(form.errors), 6)

    def test_shop_profile_form_valid_data(self):
        form = ShopProfileForm(data={
            'indirizzo': 'Via Vivarelli',
            'citta': 'Modena',
            'regione': 'Emilia-Romagna',
            'provincia': 'MO',
            'codice_postale': 41125,
            'telefono': 3391234556,
            'descrizione': 'Una descrizione'
        })

        self.assertTrue(form.is_valid())

    def test_shop_profile_form_no_data(self):
        form = ShopProfileForm(data={})

        self.assertFalse(form.is_valid())
        self.assertEquals(len(form.errors), 7)
