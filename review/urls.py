from django.urls import path
from . import views

app_name = 'review'  #fondamentale per poter usare ad es. {% url 'users:login_all'%}

urlpatterns = [

    path('<int:item_selected_id>/add_review_item', views.add_review_item, name='add_review_item'),
    path('<int:user_selected_id>/add_review_user', views.add_review_user, name='add_review_user'),

]
