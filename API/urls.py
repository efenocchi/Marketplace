from . import views
from django.urls import path
app_name = 'API'
from .views import *

"""
Per chiamare queste funzioni è necessario mettere nell'url prima la stringa http://127.0.0.1:5000/api/
"""
urlpatterns = [

    path('', views.UserInfoLogin.as_view(), name='API-user-info'),
    path('users/find/<str:name>/', views.FindUser.as_view(), name='API-cerca-utente'),
    path('users/register/normaluser/', views.RegisterNormalUserFromMobilePhone.as_view(), name='API-registra-utente-normale'),
    path('users/register/shopuser/', views.RegisterShopUserFromMobilePhone.as_view(), name='API-registra-negozio'),
    path('users/profile/<int:pk>/', views.UserInfoLogin.as_view(), name='API-user-info'),
    path('users/profile/', views.ModifyInfoLoginUser.as_view(), name='API-user-modify-info'),

    # per utente
    path('reviews_customer/<int:pk>/', views.ReturnReviewCustomer.as_view(), name='API-reviews-customer'),
    path('orders_customer/<int:pk>/', views.ReturnOrderCustomer.as_view(), name='API-orders-customer'),
    path('order_items_ref_code/<str:order_items_id>/', views.ReturnOrderItems.as_view(), name='API-orderitems-customer'),
    path('items_from_orderitems/<str:order_items_id>/', views.ReturnItemsFromOrderItems.as_view(), name='API-items-from-orderitemscustomer'),
    path('items_from_orderitems_filtered/<str:order_items_id>/<str:name_shop>/', views.ReturnItemsFromOrderItemsFiltered.as_view(), name='API-items-from-orderitemscustomer-filtered'),
    path('get_review_item/<str:order_item_id>/<str:item_selected_id>/', views.GetSingleReviewItem.as_view(), name='API-get-review-item-order'),
    path('leave_review_item/<str:order_item_id>/<str:item_selected_id>/', views.CreateReviewItem.as_view(), name='API-leave-review-item'),
    # path('orderitem_item/<str:order_items_id>/<str:id_shop>/', views.ReturnOrderItemsAndOrderItems.as_view(), name='API-orderitem-item'),
    path('check_existing_username/<str:username_to_check>/', check_existing_username),
    path('check_existing_username_ajax/', check_existing_username_ajax),

    # se devo aggiungere la mail prima controllo che non esista già un waituser con quell'username e quella password
    # e se non esiste lo creo e con un altro fetch aggiungo la password
    path('create_waituser/', views.CreateWaitUser.as_view(), name='API-create-waituser'),
    path('insert_email/<int:item_selected_id>/', views.InsertEmail.as_view(), name='API-insert-email'),



    # per Shop
    path('orders_shop/', views.ReturnOrderDoneByCustomer.as_view(), name='API-orders-shop'),
    path('items_booked/<str:order_items_id>/', views.ReturnItemsBooked.as_view(), name='API-items-shop'),
    path('travel_time/<str:username_shop>/', views.ReturnTimeUserShop, name='API-time-travel'),
    # path('upload_image/<str:id_shop>/', views.UploadItem.as_view(), name='API-upload-item'),
    path('insert_item/', views.InsertNewItem.as_view(), name='API-insert-item'),

    # *** review for/to shop
    path('review_shop/<str:username_shop>/', views.ReturnReviewShop.as_view(), name='API-review-shop'),
    path('review_from_customer_to_shop/<str:username_shop>/', views.CreateReviewForShop.as_view(), name='API-new-review-shop'),
    path('get_single_review_shop/<str:username_shop>/', views.GetSingleReviewShop.as_view(), name='API-get-single-review-left-to-shop'),

    # *** review for/to customer
    path('review_from_shop_to_customer/<int:id_user>/<int:id_order>/', views.CreateReviewForCustomer.as_view(),name='API-new-review-to-customer'),
    path('get_single_review_customer/<int:id_user>/<int:id_order>/', views.GetSingleReviewCustomer.as_view(),name='API-get-single-review-customer'),
    #

    # Vale
    path('items/list_all_items/', views.ListAllItems.as_view(), name='API-list-all-items'),
    path('items/<int:id_shop>/shop_all_items/', views.ShopAllItems.as_view(), name='API-shop-all-items'),
    path('items/<str:username_shop>/show_shop/', views.ShowShop.as_view(), name='API-show-shop'),
    path('items/<int:pk>/cart_orders/', views.CartOrders.as_view(), name='API-cart-orders'),
    path('id_items_from_orderitems/<int:pk>/', views.IdItemsFromOrderItems.as_view(), name='API-id-items-from-orderitems'),
    path('items/search/<int:pk>/<str:text>/', views.SearchItem.as_view(), name='API-search-item'),
    path('items/add_quantity/<int:pk>/<int:id_item>/<int:quantity>/', views.AddToCart.as_view(),
         name='API-add-to-cart'),
    path('items/<int:id_item>/delete/', views.DeleteItem.as_view(), name='API-delete-item-from-cart'),
    # Fine

]