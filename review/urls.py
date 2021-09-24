from django.urls import path
from . import views

app_name = 'review'  #fondamentale per poter usare ad es. {% url 'users:login_all'%}

urlpatterns = [

    path('show_items_to_review', views.show_items_to_review, name='show_items_to_review'),

    path('<int:item_selected_id>/<int:order_item_id>/add_review_item', views.add_review_item, name='add_review_item'),

    path('<int:item_selected_id>/<int:order_item_id>/show_item_reviewed', views.show_item_reviewed, name='show_item_reviewed'),

    path('<int:shop_selected_id>/add_review_shop', views.add_review_shop, name='add_review_shop'),

    path('<int:customer_selected_id>/add_review_customer', views.add_review_customer, name='add_review_customer'),

]
