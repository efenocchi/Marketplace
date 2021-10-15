import re
import uuid
from math import radians, sin, atan2, sqrt, cos

from django.contrib.auth.models import User
from django.http import JsonResponse
from django.shortcuts import render
from rest_framework import generics
# Create your views here.
from items.models import Order, OrderItem, Item, WhoHasReviewed, WaitUser
from items.views import computeTime
from review.models import ReviewCustomer, ReviewItem, ReviewShop
from users.models import GeneralUser
from API.serializers import CompleteUserData, CompleteNormalUserData, CompleteShopUserData, ReviewCustomerSerializer, \
    OrderCustomerSerializer, OrderItemSerializer, ItemSerializer, ReviewItemSerializer, ReviewShopSerializer, \
    ReviewPartialCustomerSerializer, InsertItemSerializer, WaitUserSerializer, OrderSerializer
from .permissions import *
from django.contrib.auth import logout
from rest_framework.views import APIView
from django.utils import timezone


def foundOrdersFromCustomer(request):
    """
    Mostro gli ordini che sono stati effettutati dagli utenti e per ogni ordine posso dare un feedback all'utente
    :param request:
    :return:
    """
    # oggetti venduti dal negozio
    dict = {}
    # orders = Order.objects.filter(items=OrderItem.objects.filter(Item.objects.filter(user=request.user)))

    items = Item.objects.filter(user=request.user)
    print("tutti gli oggetti di " + request.user.username + " sono: ", items)
    for single_item in items:
        order_items = OrderItem.objects.filter(item=single_item)
        print("per l'oggetto: " + single_item.name + " abbiamo i seguenti ordini: ", order_items)
        for single_order_item in order_items:
            orders = Order.objects.filter(items=single_order_item)
            # if single_order_item.order_set.filter(pk=single_order_item.pk):
            print("ecco gli ordini")
            for single_order in orders:
                print(single_order.ref_code)
                list = []

                if dict.get(single_order.ref_code) is not None:
                    list = dict[single_order.ref_code]
                    # list[0].append(dict[single_order.ref_code])
                    list.append(single_order_item)
                    dict.update({str(single_order.ref_code): list})
                    print("tipo dict ", type(dict))
                    print("cosa c'è nel dizionario", dict)
                    stringa = single_order.ref_code
                    print("tipo stringa ", type(stringa))
                    print("eccoci qua", dict[stringa])
                else:
                    # come primo elemento metto l'order che mi servirà nel file html
                    # gli elementi successivi sono invece i single_order
                    list.append(single_order)
                    list.append(single_order_item)
                    dict.update({str(single_order.ref_code): list})
    return dict


def ReturnTimeUserShop(request, username_shop):
    """
    Ritorna il valore di tempo che ci vuole dall'utente al negozio
    """
    if request.method == "GET":
        try:
            user = User.objects.get(username=username_shop)
            shop = GeneralUser.objects.get(user=user)
            time = computeTime(request, shop.id)
            return JsonResponse({'result': str(time)})
        except Exception:
            return JsonResponse({'result': 'Il risultato non è calcolabile'})
            raise Exception("Errore nell'aggiunta di un oggetto")


class ReturnReviewShop(generics.ListAPIView):
    """
    Ritorna tutte le recensioni che un negozio ha ricevuto
    """
    serializer_class = ReviewShopSerializer

    def get_queryset(self):
        username_shop = self.kwargs['username_shop']
        user = User.objects.get(username=username_shop)
        shop = GeneralUser.objects.get(user=user)
        review = ReviewShop.objects.filter(receiver=shop.user)

        return list(review)


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
            print("exception")
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
    registra un utente dal telefono cellulare (l'utente general user viene creato senza nessun parametro quando creo
    l'utente user, per questo motivo invece che andare a utilizzare API Create vado a fare un update)
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


# Da Vale
class ListAllItems(generics.ListAPIView):
    serializer_class = ItemSerializer

    def get_queryset(self):
        print(Item.objects.all().order_by('name'))
        queryset = Item.objects.all().order_by('name')
        lista_query = list(queryset)
        print(lista_query)
        return lista_query


class ShopAllItems(generics.ListAPIView):
    serializer_class = ItemSerializer

    def get_queryset(self):
        id_shop = self.kwargs['id_shop']
        # user = User.objects.get(username=id_shop)
        shop = GeneralUser.objects.get(id=id_shop)
        queryset = Item.objects.filter(user=shop.user)
        lista_query = list(queryset)
        print(lista_query)
        return lista_query


class DeleteItem(generics.RetrieveUpdateDestroyAPIView):
    """
    #Funzione utilizzata per eliminare un item dal carrello
    """
    serializer_class = ItemSerializer

    def get_object(self):
        id_item = self.kwargs['id_item']
        return Item.objects.get(id=id_item)

    def perform_destroy(self, instance):
        id_item = self.kwargs['id_item']    #prendo id dell'item da cancellare
        item_to_delete = Item.objects.filter(id=id_item).first()    #prendo l'item da cancellare

        #filtro tutti gli oggetti con ordered=False
        order_qs = Order.objects.filter(
            user=self.request.user,
            ordered=False
        )
        print(order_qs)
        # se c'è almeno un elemento
        if order_qs.exists():
            print(59)
            order = order_qs[0]
            # controllo che l'elemento da eliminare sia in ordine(carrello) se si allora:
            if order.items.filter(item__id=item_to_delete.id).exists():
                print(60)
                # se l'elemento da eliminare è nel carrello
                order_item = OrderItem.objects.filter(
                    item=item_to_delete,
                    user=self.request.user,
                    ordered=False
                )[0]
                # se la quantità è maggiore di 1 la decremento prima di eliminarlo
                if order_item.quantity > 1:
                    print(61)
                    order_item.quantity -= 1
                    order_item.save()
                # se la quantità è 1 rimuovo direttamente
                if order_item.quantity <= 1:
                    print(62)
                    order.items.remove(order_item)
                    order_item.delete()


class DeleteItemShop(generics.RetrieveUpdateDestroyAPIView):
    """
    #Funzione utilizzata per eliminare un item dal del negozio
    """
    serializer_class = ItemSerializer

    def get_object(self):
        id_item_to_delete = self.kwargs['id_item_to_delete']
        return Item.objects.get(id=id_item_to_delete)

    def perform_destroy(self, instance):
        id_item_to_delete = self.kwargs['id_item_to_delete']
        item_to_delete = Item.objects.filter(user=self.request.user,id=id_item_to_delete)
        item_to_delete.first().delete()


def Checkout(request, pk):
    price_without_discount = 0
    price_with_discount = 0
    total_price = 0
    total_quantity = 0
    list_checkout = []
    general_user = GeneralUser.objects.get(id=pk)
    queryset = OrderItem.objects.filter(user=general_user.user, ordered=False)
    print(queryset)
    for i in queryset:
        price_without_discount = (i.item.price * i.quantity)

        if i.item.discount_price is not None:
            price_with_discount = (i.item.discount_price * i.quantity)
            total_price = total_price + price_with_discount

        else:
            total_price = total_price + price_without_discount

        total_quantity = total_quantity + i.quantity

    print(price_without_discount)
    print(price_with_discount)
    print(total_price)
    print(total_quantity)
    list_checkout.append(total_price)
    list_checkout.append(total_quantity)
    return JsonResponse({'results': list(list_checkout)})


def ConfirmCheckout(request, pk):
    serializer_class = OrderSerializer
    general_user = GeneralUser.objects.get(id=pk)
    list_checkout = []
    #ORDER E' L'INSIEME DI ITEM CHE COMPONGONO L'ORDINE DELL'UTENTE
    order = Order.objects.get(user=general_user.user, ordered=False)
    print("CHECKOUT INIZIALE-order:")
    print(order)
    order_items = order.items.all()
    order_items.update(ordered=True)

    for item in order_items:
        item.save()

    all_items = Item.objects.all()

    for item in all_items:
        for item_in_order in order_items:
            if item_in_order.item.name == item.name:
                item.quantity = item.quantity - item_in_order.quantity
                item.save()

    order.ordered = True
    order.ref_code = uuid.uuid4()
    order.number_order = order.number_order + 1
    order.save()
    list_checkout.append(order.ref_code)
    list_checkout.append(order.number_order)
    return JsonResponse({'results': list(list_checkout)})


class ItemDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Questa view restituisce l'annuncio avente ID passato tramite URL
    e ne permette la modifica
    """

    serializer_class = ItemSerializer
    print(10)

    def get_object(self):
        """
        Questa view restituisce i flag dell'annuncio avente ID passato tramite URL
        """
        print(11)
        id_item = self.kwargs['id_item']
        return Item.objects.get(id=id_item)


class ModifyItem(generics.RetrieveUpdateAPIView):
    """
    Aggiungo all'oggetto con quantità 0 la mail dell'utente interessato WaitUser passato
    """
    print("eccoci!!")
    # permission_classes = [IsUserLogged]
    serializer_class = ItemSerializer

    def get_object(self):
        id_item_to_modify = self.kwargs['id_item']
        return Item.objects.get(id=id_item_to_modify)

    def put(self, request, *args, **kwargs):
        id_item_to_modify = self.kwargs['id_item']
        item_to_modify = Item.objects.get(id=id_item_to_modify)
        item_to_modify.name = self.request.data["name"]
        item_to_modify.price = self.request.data["price"]
        item_to_modify.discount_price = self.request.data["discount_price"]
        item_to_modify.category = self.request.data["category"]
        item_to_modify.quantity = self.request.data["quantity"]
        item_to_modify.description = self.request.data["description"]
        # image_item: null,
        item_to_modify.save()
        return JsonResponse({'results': True})

# Fine Da Vale


class ShowShop(generics.ListAPIView):
    serializer_class = ItemSerializer

    def get_queryset(self):
        username_shop = self.kwargs['username_shop']
        user = User.objects.get(username=username_shop)
        shop = GeneralUser.objects.get(user=user)
        queryset = Item.objects.filter(user=shop.user)
        lista_query = list(queryset)
        print(lista_query)
        return lista_query


class ReturnReviewCustomer(generics.ListAPIView):
    serializer_class = ReviewCustomerSerializer

    def get_queryset(self):
        oid = self.kwargs['pk']
        try:
            print(oid)
            user = User.objects.get(id=oid)
            user_customer = GeneralUser.objects.get(user=user)
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
            user_customer = User.objects.get(id=oid)

        except Exception:
            raise Exception("Utente recensito non trovato")
        orders = Order.objects.filter(user=user_customer)
        print(orders)
        print("list(review)", list(orders))
        return list(orders)


class ReturnOrderDoneByCustomer(generics.ListAPIView):
    """
    Ritorno tutti gli ordini che sono stati fatti presso il mio negozio
    N.B. lo stesso ref_code contiene è relativo anche a oggetti acquistati in altri negozi,
    saranno quindi filtrati
    """
    permission_classes = [IsSameUser, IsUserLogged]
    serializer_class = OrderCustomerSerializer

    def get_queryset(self):
        dict_order_orderitems = foundOrdersFromCustomer(self.request)
        list_order = []
        print ("inizio")
        print(dict_order_orderitems)
        try:
            for single_row in dict_order_orderitems:

                print(type(dict_order_orderitems[single_row][0]))
                list_order.append(dict_order_orderitems[single_row][0])  # single_row[0]: ref_code, single_row[1]: order

        except Exception:
            raise Exception("Riscontrato errore")
        print("list_order", list_order)
        return list_order


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


# class ReturnOrderItemsAndOrderItems(generics.ListAPIView):
#     """
#     L'utente passa tramite url i valori degli order items che desidera visualizzare ed essi gli vengono ritornati.
#     Vengono anche ritornate le info relative ai prodotti acquistati.
#     In questa funzione vengono filtrati gli oggetti acquistati in un ordine relativi a un solo negozio
#     (se in quell'ordine l'utente ha fatto acquisti in più negozi verrà ritornato un numero ridotto di prodotti)
#     """
#     serializer_class = OrderItemSerializer
#
#     def get_queryset(self):
#         order_items_id = self.kwargs['order_items_id']  # Lista degli id degli order items che voglio
#         id_shop = self.kwargs['id_shop']
#         try:
#             shop = GeneralUser.objects.get(id=id_shop)
#             order_items_id = order_items_id.split(',')  # da stringa a lista
#             order_items = OrderItem.objects.filter(id__in=order_items_id)  # take the items order
#             print(order_items.item.pk)
#             items = Item.objects.filter(id__in=order_items.item.pk, user=shop.user)
#             order_items = OrderItem.objects.filter(item__in=items.pk)
#
#         except Exception:
#             raise Exception("Oggetto non trovato")
#
#         print("list(review)", list(order_items))
#
#         return list(order_items)


class ReturnItemsBooked(generics.ListAPIView):
    """
    Ritorno gli item che sono stati prenotati presso un negozio
    N.B. Dati gli order item ricevuti filtro solo quelli relativi al negozio che invoca la funzione
    """
    serializer_class = ItemSerializer

    def get_queryset(self):
        order_items_id = self.kwargs['order_items_id']  # Lista degli id degli order items che voglio
        items = []
        try:
            order_items_id = order_items_id.split(',')  # da stringa a lista
            order_items = OrderItem.objects.filter(id__in=order_items_id) # take the items order
            for single_item in order_items:
                item = Item.objects.get(id=single_item.item.id) # prendo gli oggetti dei vari order item
                if item.user == self.request.user:  # Filtro gli items
                    items.append(item)
                    print("item", item)
            print(items)

        except Exception:
            raise Exception("Oggetto non trovato")

        print("list(review)", list(order_items))

        return items


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


class ReturnItemsFromOrderItemsFiltered(generics.ListAPIView):
    """
    In questa funzione vengono filtrati gli oggetti acquistati in un ordine relativi a un solo negozio
    (se in quell'ordine l'utente ha fatto acquisti in più negozi verrà ritornato un numero ridotto di prodotti)
    """
    serializer_class = ItemSerializer

    def get_queryset(self):
        order_items_id = self.kwargs['order_items_id'] # Lista degli id degli order items che voglio
        name_shop = self.kwargs['name_shop'] # Lista degli id degli order items che voglio
        user = User.objects.get(username=name_shop)
        shop = GeneralUser.objects.get(user=user)
        items = []
        try:
            order_items_id = order_items_id.split(',') # da stringa a lista
            order_items = OrderItem.objects.filter(id__in=order_items_id) # take the items order
            for single_item in order_items:
                item = Item.objects.get(id=single_item.item.id) # prendo gli oggetti dei vari order item
                if item.user == shop.user:
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
    If the user hasn't already left the review can be left.
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


class GetSingleReviewShop(generics.RetrieveUpdateAPIView):
    """
    Return the review that the user logged has already left to the shop.
    If the user hasn't already left the review can be left.
    """
    permission_classes = [IsSameUser, IsUserLogged]
    serializer_class = ReviewShopSerializer

    def get_object(self):
        username_shop = self.kwargs['username_shop']
        try:
            user = User.objects.get(username=username_shop)
            receiver = GeneralUser.objects.get(user=user)
        except Exception:
            raise Exception("Negozio non valido")

        return ReviewShop.objects.get(writer=self.request.user, receiver=receiver.user)


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


class CreateReviewForShop(generics.CreateAPIView):
    """
    Create a review for the selected shop, made by the logged user
    """
    permission_classes = [IsUserLogged]
    serializer_class = ReviewShopSerializer

    def perform_create(self, serializer):
        username_shop = self.kwargs['username_shop']

        try:
            user = User.objects.get(username=username_shop)
            shop = GeneralUser.objects.get(user=user)
        except Exception:
            raise Exception("Negozio non valido")

        serializer.save(writer=self.request.user, receiver=shop.user)


class CreateReviewForCustomer(generics.CreateAPIView):
    """
    Create a review for the selected customer, given an order and the logged shop
    """
    permission_classes = [IsUserLogged]
    serializer_class = ReviewPartialCustomerSerializer

    def perform_create(self, serializer):
        id_user = self.kwargs['id_user']
        id_order = self.kwargs['id_order']
        print("id_order", id_order)
        print("id_user", id_user)
        try:
            user = User.objects.get(id=id_user)
            order = Order.objects.get(id=id_order)
            print(order)
        except Exception:
            raise Exception("Utente o Ordine non valido")

        whohasreviewed = WhoHasReviewed.objects.get_or_create(writer=self.request.user)[0]
        print("whohasreviewed", whohasreviewed)
        try:
            order.review_customer_done.add(whohasreviewed)
            order.save()
        except Exception:
            raise Exception("Negozio recensore non aggiunto")
        print(self.request.data)
        serializer.save(writer=self.request.user, receiver=user, order=order)


class GetSingleReviewCustomer(generics.RetrieveUpdateAPIView):
    """
    Ritona la recensione che il negozio ha già lasciato all'utente per un determinato ordine prenotato
    """
    serializer_class = ReviewPartialCustomerSerializer
    permission_classes = [IsUserLogged]

    def get_object(self):
        id_user = self.kwargs['id_user']
        id_order = self.kwargs['id_order']
        try:
            user = User.objects.get(id=id_user)
        except Exception:
            raise Exception("Utente non valido")
        try:
            order = Order.objects.get(id=id_order)
        except Exception:
            raise Exception("Ordine non valido")

        return ReviewCustomer.objects.get(writer=self.request.user, receiver=user, order=order)


# class UploadItem(generics.CreateAPIView):
#     """
#     Upload a new item for the shop
#     """
#     permission_classes = [IsUserLogged]
#     serializer_class = ItemSerializer
#
#     def perform_create(self, serializer):
#         id_shop = self.kwargs['id_shop']
#
#         try:
#             shop = GeneralUser.objects.get(id=id_shop)
#         except Exception:
#             raise Exception("Negozio non valido")
#
#         serializer.save(writer=self.request.user, receiver=shop.user)


class InsertNewItem(generics.CreateAPIView):
    """
    Create a review for the selected customer, given an order and the shop
    """
    permission_classes = [IsUserLogged, IsSameUser]
    serializer_class = InsertItemSerializer

    def perform_create(self, serializer):

        try:
            serializer.save(user=self.request.user)
        except Exception:
            raise Exception("Errore nell'aggiunta di un oggetto")


def check_existing_username(request, username_to_check):
    """
    Controlla se uno username, passato come parametro GET, non sia già registrato nel model.
    I valori di True e False sono invertiti perchè se è già presente lo username devo ritornare False in modo da evitare
    che l'utente possa registrarsi
    :param request: request utente.
    :return: falso se username già registrato, vero se username non registrato.
    """

    if request.method == "GET":
        print(username_to_check)
        try:
            user = User.objects.get(username__exact=username_to_check)
            return JsonResponse({'result': False})
        except Exception:
            return JsonResponse({'result': True})
            raise Exception("Errore nell'aggiunta di un oggetto")


def check_existing_username_ajax(request):
    """
    Controlla se uno username, passato come parametro GET, non sia già registrato nel model.

    :param request: request utente.
    :return: falso se username già registrato, vero se username non registrato.
    """
    if request.method == "GET":
        p = request.GET.copy()
        if 'username' in p:
            name = p['username']
            if User.objects.filter(username__iexact=name):
                return JsonResponse({'result': False})
            else:
                return JsonResponse({'result': True})


class CartOrders(generics.ListAPIView):
    """
    Funzione utilizzata per listare tutti gli item aggiunti nel carrello
    """
    serializer_class = OrderItemSerializer  #sistemare con serializzatore order item

    def get_queryset(self):
        id = self.kwargs['pk']
        normal_user = GeneralUser.objects.get(id=id)
        queryset = OrderItem.objects.filter(user=normal_user.user, ordered=False)
        lista_query = list(queryset)
        print(lista_query)
        return lista_query


class IdItemsFromOrderItems(generics.ListAPIView):
    """
    Ritorno ogni item collegato ad un order items
    Questa funzione riceve una lista di id di order items
    """
    serializer_class = ItemSerializer

    def get_queryset(self):
        id = self.kwargs['pk']  #prendo id dell'utente di cui voglio sapere gli order items
        normal_user = GeneralUser.objects.get(id=id)
        order_items = OrderItem.objects.filter(user=normal_user.user, ordered=False)  #prendo i suoi order_items
        order_items_id = []
        items = []
        print(order_items)
        for i in order_items:    #scorro gli order_items e li metto in order_items_id
            order_items_id.append(i.id)
        print(order_items_id)
        try:
            order_items = OrderItem.objects.filter(id__in=order_items_id) # take the items order
            for single_item in order_items:
                item = Item.objects.get(id=single_item.item.id) # prendo gli item dei vari order item
                items.append(item)
                print("item", item)
            print(items)

        except Exception:
            raise Exception("Oggetto non trovato")

        print("list(review)", list(order_items))

        return items


class SearchItem(generics.ListAPIView):
    """
    Funzione utilizzata per ricercare gli item sia per il negozio che per l'utente
    """
    serializer_class = ItemSerializer

    def get_queryset(self):
        text = self.kwargs['text']
        id = self.kwargs['pk']
        print(id)
        print(text)
        ascending = True
        item_searched = Item.objects.filter(name__contains=text)
        print(item_searched)
        general_user = GeneralUser.objects.get(user__id=id)

        parameters = []

        # shops_validi = GeneralUser.objects.filter(login_negozio=True)
        print(item_searched)

        # metto tutti i valori tranne il primo, li aggiorno e metto in testa il primo
        # dato l'oggetto prendo le coordinate del suo negozio
        for item in item_searched:
            shop = GeneralUser.objects.get(user=item.user)
            print(shop)
            print(shop.latitudine)
            parameters.append(shop.indirizzo.replace("/", "") + ',' + shop.citta.replace("/", "") + ','
                              + shop.stato.replace("/", "") + ',' + shop.codice_postale.replace("/", ""))
            # parameters['locations'].append(str(shop.latitudine) + ',' + str(shop.longitudine))

        # return HttpResponse(parameters['locations'])

        lat_shop = 0
        lng_shop = 0
        if general_user.latitudine is not None and general_user.longitudine is not None:
            lat_shop = general_user.latitudine
            lng_shop = general_user.longitudine

        distanze = []
        indici = []
        items_pk = []
        # raggio della terra approssimato
        r = 6371.0

        lat1 = radians(lat_shop)
        lon1 = radians(lng_shop)

        # Calcola le distanze di tutti i prodotti
        for i, item in enumerate(item_searched):
            indici.append(i)
            shop_profile = GeneralUser.objects.filter(user=item.user).first()

            if shop_profile.latitudine is not None and shop_profile.longitudine is not None:
                lat2 = radians(shop_profile.latitudine)
                lon2 = radians(shop_profile.longitudine)
            else:
                lat2 = 0
                lon2 = 0
            print(str(lat2) + ',' + str(lon2))

            dlon = lon2 - lon1
            dlat = lat2 - lat1

            a = sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2
            c = 2 * atan2(sqrt(a), sqrt(1 - a))

            distanze.append(r * c)
            items_pk.append(item.pk)

        # Ordina in modo crescente o decrescente sulle distanze
        if ascending:
            distanze_negozi, indici = (list(t) for t in zip(*sorted(zip(distanze, indici))))
            _, items_pk = (list(t) for t in zip(*sorted(zip(distanze, items_pk))))
            _, parameters = (list(t) for t in zip(*sorted(zip(distanze, parameters))))
        else:
            distanze_negozi, indici = (list(t) for t in zip(*sorted(zip(distanze, indici), reverse=True)))
            _, items_pk = (list(t) for t in zip(*sorted(zip(distanze, items_pk), reverse=True)))
            _, parameters = (list(t) for t in zip(*sorted(zip(distanze, parameters), reverse=True)))

        # return indici
        print("distanze", distanze_negozi)
        print("indici", indici)

        complete_parameters = parameters[:]
        complete_parameters.insert(0,
                                   general_user.indirizzo.replace("/", "") + ',' + general_user.citta.replace("/",
                                                                                                              "") + ','
                                   + general_user.stato.replace("/", "") + ',' + general_user.codice_postale.replace(
                                       "/",
                                       ""))

        # Creo il dizionario che utilizzerò con per le richieste POST nella funzione successiva e
        # inserisco anche l'indirizzo dell'utente (oltre a quello dei negozi)
        complete_parameters = {
            'locations':
                complete_parameters

        }

        # inserisco anche l'identificatore univoco dell'utente
        # items_pk.insert(0, request.user)

        print('items_pk', items_pk)
        # t = threading.Thread(target=computeTime, args=[items_pk, complete_parameters], daemon=True)
        # t.start()
        # computeTime(items_pk, complete_parameters)
        # return HttpResponse(distanze, indici)

        items_ordered = list()
        for id_item in items_pk:
            items_ordered.append(item_searched.get(id=id_item))

        print(items_ordered)
        return items_ordered


class AddToCart(generics.UpdateAPIView):
    """
    #Funzione utilizzata per aggiungere gli item al carrello dalla ItemDetaiPage
    """
    serializer_class = ItemSerializer
    permission_classes = [IsSameUser, IsUserLogged]

    def get_object(self):
        user_id = self.kwargs['pk']  #prendo la quantità di disponibilità di quell'oggetto
        id_item = self.kwargs['id_item']    #prendo l'id di quell'oggetto
        quantity = self.kwargs['quantity']  # prendo l'id di quell'oggetto
        item_selected = Item.objects.get(id=id_item)    #oggetto da aggiungere al carrello

        print(item_selected)
        print(item_selected.quantity)

        order_item, created = OrderItem.objects.get_or_create(
            item=item_selected,
            user=self.request.user,
            ordered=False,
            quantity=quantity
        )
        # ORDER E' L'INSIEME DI ITEM CHE COMPONGONO L'ORDINE DELL'UTENTE
        order_qs = Order.objects.filter(user=user_id, ordered=False)
        print(order_qs)

        if order_qs.exists():
            order = order_qs[0]
            print(order)

            if order.items.filter(item__id=item_selected.id).exists():
                print(12)
                if (item_selected.quantity >= quantity):
                    print(13)
                    order_item.quantity += quantity
                    print(order_item.quantity)
                    order_item.save()
                    # item_selected.quantity -= quantity
                    # item_selected.save()

                else:
                    print(100)  #non ci va mai

            else:
                print(14)
                # order_item.quantity += quantity
                order_item.save()
                # item_selected.quantity -= quantity
                # item_selected.save()
                order.items.add(order_item)

        else:
            # ordered_date = timezone.now()
            print(15)
            ordered_date = timezone.now()
            order = Order.objects.create(user=self.request.user, ordered_date=ordered_date)
            order.items.add(order_item)

        return order_item


class CreateWaitUser(generics.CreateAPIView):
    """
    Se il WaitUser con username e password passati non esiste lo creo.
    """
    permission_classes = [IsUserLogged]
    serializer_class = WaitUserSerializer

    def perform_create(self, serializer):
        print("serializer.email", self.request.data)

        if len(WaitUser.objects.filter(customer=self.request.user, email=self.request.data["email"])) == 0:
            serializer.save(customer=self.request.user)
            print("ho creato un nuovo waituser")
        else:
            print("waituser già presente")


class InsertEmail(generics.RetrieveUpdateAPIView):
    """
    Aggiungo all'oggetto con quantità 0 la mail dell'utente interessato WaitUser passato
    """
    print("eccoci!!")
    permission_classes = [IsUserLogged]
    serializer_class = ItemSerializer

    def put(self, request, *args, **kwargs):
        item_selected_id = self.kwargs['item_selected_id']

        try:
            waiting_user = WaitUser.objects.filter(customer=self.request.user, email=self.request.data["email"]).first()

        except Exception:
            raise Exception("Errore nel settaggio della mail")

        item_to_wait = Item.objects.filter(id=item_selected_id, waiting_customer=waiting_user)

        # se questo utente non ha già lasciato la propria email la setto
        if len(item_to_wait) == 0:
            item = Item.objects.get(id=item_selected_id)
            item.waiting_customer.add(waiting_user)
            item.save()
            print("Email inserita")
            return JsonResponse({'result': True})
        else:
            print("Email già lasciata")
            return JsonResponse({'result': False})

