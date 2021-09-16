from django.urls import path
from . import views

app_name = 'items'  #fondamentale per poter usare ad es. {% url 'users:login_all'%}

urlpatterns = [

    path('', views.item_page, name='item_page'),

    path('add_item', views.add_item, name='add_item'),

    path('send_email', views.send_email, name='send_email'),

    path('<int:item_selected_id>/computeTime', views.computeTime, name='computeTime'),

    path('<int:item_selected_id>/show_feedback_item', views.show_feedback_item, name='show_feedback_item'),

    path('<int:shop_selected_id>/show_feedback_shop', views.show_feedback_shop, name='show_feedback_shop'),

    path('<int:item_selected_id>/', views.buy_page, name='buy_page'),

    #/annunci/#annuncio/modifica/
    path('<int:item_selected_id>/modify', views.modify_item, name='modify_item'),

    #/annunci/#annuncio/elimina/
    path('<int:item_selected_id>/delete', views.delete_item, name='delete_item'),

    #/annunci/#annuncio/add_to_cart/
    path('<int:item_selected_id>/add_to_cart', views.add_to_cart, name='add_to_cart'),

    path('<int:item_selected_id>/remove_single_item_from_cart', views.remove_single_item_from_cart, name='remove_single_item_from_cart'),

    path('search/', views.search, name='search'),
]
