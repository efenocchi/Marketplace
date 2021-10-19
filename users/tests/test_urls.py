from django.urls import reverse, resolve

#view without int or str
from users.views import login_all, normal_user_registration, logout_user, shop_registration, modify_profile
from users.views import insert_user_info, insert_shop_info, home_for_user, home_for_shop
#view with int
from users.views import prova_passaggio_interi
import unittest


class TestUrls(unittest.TestCase):

    def test_login_url(self):
        path = reverse('users:login_all')
        self.assertEquals(resolve(path).func, login_all)

    def test_normal_user_registration_url(self):
        path = reverse('users:normal_user_registration')
        self.assertEquals(resolve(path).func, normal_user_registration)

    def test_logout_user_url(self):
        path = reverse('users:logout_user')
        self.assertEquals(resolve(path).func, logout_user)

    def test_shop_registration_url(self):
        path = reverse('users:shop_registration')
        self.assertEquals(resolve(path).func, shop_registration)

    def test_modify_profile_url(self):
        path = reverse('users:modify_profile')
        self.assertEquals(resolve(path).func, modify_profile)

    def test_prova_passaggio_interi_url(self):
        path = reverse('users:prova_passaggio_interi', kwargs={'oid': 1})
        self.assertEquals(resolve(path).func, prova_passaggio_interi)

    def test_insert_user_info_url(self):
        path = reverse('users:insert_user_info')
        self.assertEquals(resolve(path).func, insert_user_info)

    def test_insert_shop_info_url(self):
        path = reverse('users:insert_shop_info')
        self.assertEquals(resolve(path).func, insert_shop_info)

    def test_home_for_user_url(self):
        path = reverse('users:home_for_user')
        self.assertEquals(resolve(path).func, home_for_user)

    def test_home_for_shop_url(self):
        path = reverse('users:home_for_shop')
        self.assertEquals(resolve(path).func, home_for_shop)