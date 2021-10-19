from django.urls import reverse, resolve
from review.views import show_items_to_review, show_order_done_by_customer, add_review_item, show_item_reviewed, show_customers_reviewed
from review.views import add_review_shop, add_review_customer
import unittest

class TestUrls(unittest.TestCase):

    def test_show_items_to_review_url(self):
        path = reverse('review:show_items_to_review')
        self.assertEquals(resolve(path).func, show_items_to_review)

    def test_show_order_done_by_customer_url(self):
        path = reverse('review:show_order_done_by_customer')
        self.assertEquals(resolve(path).func, show_order_done_by_customer)

    def test_add_review_item_url(self):
        path = reverse('review:add_review_item', kwargs={'item_selected_id': 1, 'order_item_id': 1})
        self.assertEquals(resolve(path).func, add_review_item)

    def test_show_item_reviewed_url(self):
        path = reverse('review:show_item_reviewed', kwargs={'item_selected_id': 1, 'order_item_id': 1})
        self.assertEquals(resolve(path).func, show_item_reviewed)

    def test_show_customers_reviewed_shop_url(self):
        path = reverse('review:show_customers_reviewed', kwargs={'receiver_id': 1, 'order_item_id': 1})
        self.assertEquals(resolve(path).func, show_customers_reviewed)

    def test_add_review_shop_url(self):
        path = reverse('review:add_review_shop', kwargs={'shop_selected_id': 1})
        self.assertEquals(resolve(path).func, add_review_shop)

    def test_add_review_customer_url(self):
        path = reverse('review:add_review_customer', kwargs={'order_id': 1, 'customer_id': 1})
        self.assertEquals(resolve(path).func, add_review_customer)
