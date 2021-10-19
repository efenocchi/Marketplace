from django.test import TestCase
from review.forms import ReviewItemForm, ReviewShopForm, ReviewCustomerForm

class TestForms(TestCase):

    def test_review_item_form_valid_data(self):
        form = ReviewItemForm(data={
            'title_of_comment': 'Un titolo',
            'description': 'Una descrizione',
            'rating': 5
        })

        self.assertTrue(form.is_valid())

    def test_review_item_form_no_data(self):
        form = ReviewItemForm(data={})

        self.assertFalse(form.is_valid())
        self.assertEquals(len(form.errors), 3)

    def test_review_shop_form_valid_data(self):
        form = ReviewShopForm(data={
            'title_of_comment': 'Un titolo',
            'description': 'Una descrizione',
            'rating': 5
        })

        self.assertTrue(form.is_valid())

    def test_review_shop_form_no_data(self):
        form = ReviewShopForm(data={})

        self.assertFalse(form.is_valid())
        self.assertEquals(len(form.errors), 3)

    def test_review_customer_form_valid_data(self):
        form = ReviewCustomerForm(data={
            'title_of_comment': 'Un titolo',
            'description': 'Una descrizione',
            'rating': 5
        })

        self.assertTrue(form.is_valid())

    def test_review_customer_form_no_data(self):
        form = ReviewCustomerForm(data={})

        self.assertFalse(form.is_valid())
        self.assertEquals(len(form.errors), 3)
