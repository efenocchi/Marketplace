from django.urls import reverse, resolve

#view without int or str
from items.views import item_page, insert_item, insert_email, checkout, go_to_cart, view_order, search

#view with int
from items.views import computeTime, show_feedback_item, show_reviews_shop, buy_page, modify_item, delete_item, add_to_cart, remove_single_item_from_cart, remove_entire_item_from_cart
import unittest


class TestUrls(unittest.TestCase):

    def test_item_page_url(self):
        path = reverse('items:item_page')
        self.assertEquals(resolve(path).func, item_page)

    def test_insert_item_url(self):
        path = reverse('items:insert_item')
        self.assertEquals(resolve(path).func, insert_item)

    def test_insert_email_url(self):
        path = reverse('items:insert_email', kwargs={'item_selected_id': 'email'})
        self.assertEquals(resolve(path).func, insert_email)

    def test_computeTime_url(self):
        path = reverse('items:computeTime', kwargs={'item_selected_id': 1})
        self.assertEquals(resolve(path).func, computeTime)

    def test_show_feedback_item_url(self):
        path = reverse('items:show_feedback_item', kwargs={'item_selected_id': 1})
        self.assertEquals(resolve(path).func, show_feedback_item)

    def test_show_reviews_shop_url(self):
        path = reverse('items:show_reviews_shop', kwargs={'shop_selected_id': 1})
        self.assertEquals(resolve(path).func, show_reviews_shop)

    def test_checkout_url(self):
        path = reverse('items:checkout')
        self.assertEquals(resolve(path).func, checkout)

    def test_buy_page_url(self):
        path = reverse('items:buy_page', kwargs={'item_selected_id': 1})
        self.assertEquals(resolve(path).func, buy_page)

    def test_modify_item_url(self):
        path = reverse('items:modify_item', kwargs={'item_selected_id': 1})
        self.assertEquals(resolve(path).func, modify_item)

    def test_delete_item_url(self):
        path = reverse('items:delete_item', kwargs={'item_selected_id': 1})
        self.assertEquals(resolve(path).func, delete_item)

    def test_add_to_cart_url(self):
        path = reverse('items:add_to_cart', kwargs={'item_selected_id': 1})
        self.assertEquals(resolve(path).func, add_to_cart)

    def test_go_to_cart_url(self):
        path = reverse('items:go_to_cart')
        self.assertEquals(resolve(path).func, go_to_cart)

    def test_remove_single_item_from_cart_url(self):
        path = reverse('items:remove_single_item_from_cart', kwargs={'item_selected_id': 1})
        self.assertEquals(resolve(path).func, remove_single_item_from_cart)

    def test_remove_entire_item_from_cart_url(self):
        path = reverse('items:remove_entire_item_from_cart', kwargs={'item_selected_id': 1})
        self.assertEquals(resolve(path).func, remove_entire_item_from_cart)

    def test_view_order_url(self):
        path = reverse('items:view_order')
        self.assertEquals(resolve(path).func, view_order)

    def test_search_url(self):
        path = reverse('items:search')
        self.assertEquals(resolve(path).func, search)