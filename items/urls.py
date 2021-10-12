from django.urls import path
from . import views

app_name = 'items'  #fondamentale per poter usare ad es. {% url 'users:login_all'%}

urlpatterns = [

    path('', views.item_page, name='item_page'),

    path('insert_item', views.insert_item, name='insert_item'),

    path('insert_email/<str:item_selected_id>', views.insert_email, name='insert_email'),

    path('<int:item_selected_id>/computeTime', views.computeTime, name='computeTime'),

    path('<int:item_selected_id>/show_feedback_item', views.show_feedback_item, name='show_feedback_item'),

    path('<int:shop_selected_id>/show_reviews_shop', views.show_reviews_shop, name='show_reviews_shop'),

    path('checkout', views.checkout, name='checkout'),

    path('<int:item_selected_id>/', views.buy_page, name='buy_page'),

    path('show_shop/<str:username_shop>', views.show_shop, name='show_shop'),

    #/annunci/#annuncio/modifica/
    path('<int:item_selected_id>/modify', views.modify_item, name='modify_item'),

    #/annunci/#annuncio/elimina/
    path('<int:item_selected_id>/delete', views.delete_item, name='delete_item'),

    #/annunci/#annuncio/add_to_cart/
    path('<int:item_selected_id>/add_to_cart', views.add_to_cart, name='add_to_cart'),

    path('go_to_cart', views.go_to_cart, name='go_to_cart'),

    path('<int:item_selected_id>/remove_single_item_from_cart', views.remove_single_item_from_cart, name='remove_single_item_from_cart'),

    path('<int:item_selected_id>/remove_entire_item_from_cart', views.remove_entire_item_from_cart, name='remove_entire_item_from_cart'),

    path('view_order', views.view_order, name='view_order'),

    path('search/', views.search, name='search'),
]
