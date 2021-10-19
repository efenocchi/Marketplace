from django.urls import reverse, resolve
import unittest
from main.views import index, registration_page, empty_cart, contact, mostra_logout_avvenuto, autenticato

class TestUrls(unittest.TestCase):

    def test_index_url(self):
        path = reverse('index')
        self.assertEquals(resolve(path).func, index)

    def test_registration_page_url(self):
        path = reverse('registration_page')
        self.assertEquals(resolve(path).func, registration_page)

    def test_empty_cart_url(self):
        path = reverse('empty_cart')
        self.assertEquals(resolve(path).func, empty_cart)

    def test_contact_url(self):
        path = reverse('contact')
        self.assertEquals(resolve(path).func, contact)

    def test_mostra_logout_avvenuto_url(self):
        path = reverse('mostra_logout_avvenuto')
        self.assertEquals(resolve(path).func, mostra_logout_avvenuto)

    def test_autenticato_url(self):
        path = reverse('autenticato')
        self.assertEquals(resolve(path).func, autenticato)
