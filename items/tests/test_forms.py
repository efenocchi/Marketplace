from django.test import TestCase
from items.forms import ItemForm


class TestForms(TestCase):

    def test_item_form_valid_data(self):
        form = ItemForm(data={
            'name': 'Un nome',
            'price': '100.0',
            'discount_price': '50.0',
            'category': 'Abbigliamento',
            'quantity': '5',
            'description': 'Una descrizione',
        })

        self.assertTrue(form.is_valid())

    def test_item_form_no_data(self):
        form = ItemForm(data={})

        self.assertFalse(form.is_valid())
        # lunghezza del form
        self.assertEquals(len(form.errors), 5)  #discount_price non è required
