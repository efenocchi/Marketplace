#questo file non viene creato da django al momento della creazione dell'app ma deve essere creato manualmente
from django.urls import path
from . import views

app_name = 'users'  #fondamentale per poter usare ad es. {% url 'users:login_all'%}

urlpatterns = [

    # /users/login/
    path('login', views.login_all, name='login_all'),

    # /utenti/registrazione/
    # path('registration', views.registration, name='registration'),

    # path('test_login', views.test_login, name='test_login'),

    # /utenti/registrazione/normale
    path('normal_user_registration', views.normal_user_registration, name='normal_user_registration'),

    path('logout_user', views.logout_user, name='logout_user'),

    path('shop_registration', views.shop_registration, name='shop_registration'),
    path('<int:user_profile>/modify_profile', views.modify_profile, name='modify_profile'),
    path('<int:user_profile>/modify_shop', views.modify_shop, name='modify_shop'),
    # path('<int:oid>/insert_user_info', views.insert_user_info, name='insert_user_info'),
    path('<int:oid>/prova_passaggio_interi', views.prova_passaggio_interi, name='prova_passaggio_interi'),
    path('insert_user_info', views.insert_user_info, name='insert_user_info'),
    path('insert_shop_info', views.insert_shop_info, name='insert_shop_info'),
    path('show_distance_shops', views.show_distance_shops, name='show_distance_shops'),

    path('<int:user_profile>/home_for_user', views.home_for_user, name='home_for_user'),
    path('<int:user_profile>/home_for_shop', views.home_for_shop, name='home_for_shop'),
    # path('prova_registrazione', views.prova_registrazione, name='prova_registrazione'),

    # /utenti/logout/
    #path('logout', views.logout, name='logout'),

]
