from django.urls import path
from . import views

app_name = 'items'  #fondamentale per poter usare ad es. {% url 'users:login_all'%}

urlpatterns = [

    path('', views.item_page, name='item_page'),

    path('<int:item_selected_id>/', views.buy_page, name='buy_page'),

    # /annunci/#annuncio/modifica/
    path('<int:item_selected_id>/modify', views.modify_item, name='modify_item'),

    # /annunci/#annuncio/elimina/
    path('<int:item_selected_id>/delete', views.delete_item, name='delete_item'),

]
