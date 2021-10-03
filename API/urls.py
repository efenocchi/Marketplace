from . import views
from django.urls import path
app_name = 'API'

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
    path('get_review_item/<str:order_item_id>/<str:item_selected_id>/', views.GetSingleReviewItem.as_view(), name='API-get-review-item-order'),
    path('leave_review_item/<str:order_item_id>/<str:item_selected_id>/', views.CreateReviewItem.as_view(), name='API-leave-review-item'),

    # per Shop
    path('orders_shop/', views.ReturnOrderDoneByCustomer.as_view(), name='API-orders-shop'),
    path('items_booked/<str:order_items_id>/', views.ReturnItemsBooked.as_view(), name='API-items-shop'),
    path('travel_time/<str:id_shop>/', views.ReturnTimeUserShop.as_view(), name='API-time-travel'),
    path('review_shop/<str:id_shop>/', views.ReturnReviewShop.as_view(), name='API-review-shop'),
    path('review_from_customer_to_shop/<str:id_shop>/', views.CreateReviewForShop.as_view(), name='API-new-review-shop'),
    path('get_single_review_shop/<str:id_shop>/', views.GetSingleReviewShop.as_view(), name='API-get-single-review-left-to-shop'),


    # Vale
    path('items/list_all_items/', views.ListAllItems.as_view(), name='API-list-all-items'),
    path('items/<int:pk>/shop_all_items/', views.ShopAllItems.as_view(), name='API-shop-all-items'),
    path('items/<int:pk>/cart_orders/', views.CartOrders.as_view(), name='API-cart-orders'),
    path('items_from_orderitems/<int:pk>/', views.IdItemsFromOrderItems.as_view(), name='API-id-items-from-orderitems'),
    # Fine

]