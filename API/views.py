import re

from django.contrib.auth.models import User
from django.shortcuts import render
from rest_framework import generics
# Create your views here.
from items.models import Order, OrderItem, Item
from review.models import ReviewCustomer, ReviewItem
from users.models import GeneralUser
from API.serializers import CompleteUserData, CompleteNormalUserData, CompleteShopUserData, ReviewCustomerSerializer, \
    OrderCustomerSerializer, OrderItemSerializer, ItemSerializer, ReviewItemSerializer
from .permissions import *
from django.contrib.auth import logout


class UserInfoLogin(generics.RetrieveAPIView):
    """
    Questa view restituisce la lista completa degli utenti registrati
    """
    serializer_class = CompleteUserData

    def get_object(self):
        """
        Modifico il query set in modo da ottenere l'utente con l'id
        prelevato dall'url
        """
        oid = self.kwargs['pk']
        return GeneralUser.objects.get(user=oid)


# selfUserInfoLogin
class ModifyInfoLoginUser(generics.RetrieveUpdateDestroyAPIView):
    """
    Restituisco le info del profilo dell'utente loggato.
    Con questa funzione vengono modificate le informazioni di un utente
    """
    permission_classes = [IsSameUser, IsUserLogged]
    serializer_class = CompleteUserData

    def get_object(self):
        return GeneralUser.objects.get(user=self.request.user)

    def perform_destroy(self, instance):
        profile_to_modify = User.objects.get(id=instance.user.id)
        profile_to_modify.is_active = False
        profile_to_modify.save()
        logout(self.request)


class FindUser(generics.ListAPIView):
    """
    Trova un utente GeneralUser e ritorna tutte le sue info (utente negozio o acquirente)
    """
    serializer_class = CompleteUserData

    def get_queryset(self):
        name = self.kwargs['name']
        profili = []
        try:
            username_cercato = User.objects.get(username__exact=name)
            # profilo = GeneralUser.objects.get_or_create(user=username_cercato)[0]
            profilo = GeneralUser.objects.get_or_create(user=username_cercato)[0]
            profilo.user.password = ""
            profili.append(profilo)
            return profili
        except Exception:
            username_trovati = User.objects.filter(username__startswith=name)
            if len(username_trovati) == 0:
                username_trovati = User.objects.filter(username__contains=name)
            for user in username_trovati:
                p = GeneralUser.objects.get(user=user)
                p.user.password = ""
                profili.append(p)
            return profili


class RegisterNormalUserFromMobilePhone(generics.RetrieveUpdateAPIView):
    '''
        registra un utente dal telefono cellulare
    permission_classes: Returns a boolean denoting whether the current user has permission to execute the decorated view
    '''
    permission_classes = [IsSameUser, IsUserLogged]
    # permission_classes = [IsSameUser]
    serializer_class = CompleteNormalUserData

    def get_object(self):
        return GeneralUser.objects.get_or_create(user=self.request.user)[0]


class RegisterShopUserFromMobilePhone(generics.RetrieveUpdateAPIView):
    '''
    registra un utente dal telefono cellulare
    permission_classes: Returns a boolean denoting whether the current user has permission to execute the decorated view
    '''
    permission_classes = [IsSameUser, IsUserLogged]
    # permission_classes = [IsSameUser]
    serializer_class = CompleteShopUserData

    def get_object(self):
        return GeneralUser.objects.get_or_create(user=self.request.user)[0]


class ReturnReviewCustomer(generics.ListAPIView):
    serializer_class = ReviewCustomerSerializer

    def get_queryset(self):
        oid = self.kwargs['pk']
        try:
            print(oid)
            user_customer = GeneralUser.objects.get(id=oid)
            print("user_customer", user_customer)
            print("user_customer.user", user_customer.indirizzo)

        except Exception:
            raise Exception("Utente recensito non trovato")
        review = ReviewCustomer.objects.filter(receiver=user_customer.user)
        print("list(review)", list(review))
        return list(review)


class ReturnOrderCustomer(generics.ListAPIView):
    """
    Ritorno tutti gli oggetti che ho acquistato
    """
    serializer_class = OrderCustomerSerializer

    def get_queryset(self):
        oid = self.kwargs['pk']
        try:
            print(oid)
            user_customer = GeneralUser.objects.get(id=oid)

        except Exception:
            raise Exception("Utente recensito non trovato")
        orders = Order.objects.filter(user=user_customer.user)
        print("list(review)", list(orders))
        return list(orders)


class ReturnOrderItems(generics.ListAPIView):
    """
    L'utente passa tramite url i valori degli order items che desidera visualizzare ed essi gli vengono ritornati
    """
    serializer_class = OrderItemSerializer

    def get_queryset(self):
        order_items_id = self.kwargs['order_items_id']  # Lista degli id degli order items che voglio
        try:
            order_items_id = order_items_id.split(',')  # da stringa a lista
            order_items = OrderItem.objects.filter(id__in=order_items_id)  # take the items order

        except Exception:
            raise Exception("Oggetto non trovato")

        print("list(review)", list(order_items))

        return list(order_items)


class ReturnItemsFromOrderItems(generics.ListAPIView):
    """
    Ritorno ogni item collegato ad un order items
    Questa funzione riceve una lista di id di order items
    """
    serializer_class = ItemSerializer

    def get_queryset(self):
        order_items_id = self.kwargs['order_items_id'] # Lista degli id degli order items che voglio
        items = []
        try:
            order_items_id = order_items_id.split(',') # da stringa a lista
            order_items = OrderItem.objects.filter(id__in=order_items_id) # take the items order
            for single_item in order_items:
                item = Item.objects.get(id=single_item.item.id) # prendo gli oggetti dei vari order item
                items.append(item)
                print("item", item)
            print(items)

        except Exception:
            raise Exception("Oggetto non trovato")

        print("list(review)", list(order_items))

        return items


class GetSingleReviewItem(generics.RetrieveUpdateAPIView):
    """
    Return the review that an user has already left to one item.
    If the user hasn't already left the review the review will be left.
    """
    permission_classes = [IsSameUser, IsUserLogged]
    serializer_class = ReviewItemSerializer

    def get_object(self):
        order_item_id = self.kwargs['order_item_id']
        item_selected_id = self.kwargs['item_selected_id']
        try:
            order = Order.objects.get(items=order_item_id)
        except Exception:
            raise Exception("Ordine non trovato")
        try:
            item = Item.objects.get(id=item_selected_id)
        except Exception:
            raise Exception("Oggetto non trovato")

        return ReviewItem.objects.get(writer=self.request.user, item=item, order=order)


class CreateReviewItem(generics.CreateAPIView):
    """
    Create a review for the selected item
    """
    permission_classes = [IsUserLogged]
    serializer_class = ReviewItemSerializer

    def perform_create(self, serializer):
        order_item_id = self.kwargs['order_item_id']
        item_selected_id = self.kwargs['item_selected_id']

        try:
            order = Order.objects.get(items=order_item_id)
        except Exception:
            raise Exception("Ordine non trovato")
        try:
            item = Item.objects.get(id=item_selected_id)
        except Exception:
            raise Exception("Oggetto non trovato")
        try:
            order_item = OrderItem.objects.get(id=order_item_id)
        except Exception:
            raise Exception("Singolo ordine non trovato")

        if order_item.review_item_done:
            raise PermissionDenied("hai già recensito l'oggetto")

        order_item.review_item_done = True
        order_item.save()

        serializer.save(writer=self.request.user, order=order, item=item)