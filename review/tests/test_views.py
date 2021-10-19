from django.urls import reverse
from django.test import TestCase, Client
from django.contrib.auth.models import User
import pytest

#STATUS CODE
# 200 OK -> SUCCESS

@pytest.mark.django_db
class TestViews(TestCase):
    def setUp(self):
        self.user_unauthenticated = Client()
        self.user_login = Client()
        self.user = User.objects.create_user(username='user', password='12345')
        self.user_login.login(username='user', password='12345')
        self.shop_login = Client()
        self.shop = User.objects.create_user(username='shop', password='12345')

        self.shop_login.login(username='shop', password='12345')

        self.user_oauth_login = Client()
        self.user_oauth = User.objects.create_user(username='oauth', password='12345')
        self.user_oauth_login.login(username='oauth', password='12345')

    #ADD REVIEW ITEM
    def test_add_review_item(self):
        response = self.user_login.get(reverse('review:add_review_item', kwargs={'item_selected_id': 1, 'order_item_id': 1}))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'review/add_review_item.html')

    # #ADD REVIEW SHOP
    def test_add_review_shop(self):
        response = self.shop_login.get(reverse('review:add_review_shop', kwargs={'shop_selected_id': 1}))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'review/add_review_shop.html')

