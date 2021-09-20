from django.urls import path
from . import views

app_name = 'review'  #fondamentale per poter usare ad es. {% url 'users:login_all'%}

urlpatterns = [

    path('<int:item_selected_id>/add_review_item', views.add_review_item, name='add_review_item'),

    path('<int:shop_selected_id>/add_review_shop', views.add_review_shop, name='add_review_shop'),

    path('<int:customer_selected_id>/add_review_customer', views.add_review_customer, name='add_review_customer'),

]
