import datetime
from math import radians, sin, cos, atan2, sqrt
import requests
from django.contrib import messages
from django.contrib.auth.models import User
from django.http import Http404, HttpResponseRedirect
from django.shortcuts import render, get_object_or_404
from django.urls import reverse
import uuid
from .models import Item,OrderItem,Order  # importo il modello così che possa utilizzalo, andrà a                                          # pescare gli Item dal db e conservarli in una variabile
from Marketplace import settings
from review.forms import ReviewShopForm
from review.models import ReviewItem, ReviewShop
from .models import Item, OrderItem, Order  # importo il modello così che possa utilizzalo, andrà a
# pescare gli Item dal db e conservarli in una variabile
from django.contrib.auth.decorators import login_required, user_passes_test
from django.http import Http404, HttpResponse
from django.shortcuts import render
from users.models import GeneralUser
from .models import Item  # importo il modello così che possa utilizzalo, andrà a pescare gli Item dal db e conservarli in una variabile
from .forms import ItemForm
from django.utils import timezone
from django.core.mail import send_mail


# [modifica] usare send_mass_mail()

@login_required(login_url='/users/login')
def search(request):
    word_searched= request.GET.get('search')
    item_searched = Item.objects.filter(name__contains=word_searched, user=request.user,)
    order_qs = Order.objects.filter(
        user=request.user,
        ordered=False
    )

    if order_qs.exists():
        order = order_qs[0]

    else:
        order = 0
    print(item_searched)

    if item_searched.count() == 0:
        context = {}
        context['item_searched'] = item_searched
        context['word_searched'] = word_searched
        context['user'] = request.user
        context["all_items"] = order
        return render(request, 'items/search.html', context)

    indici = show_distance_shops(request, item_searched)
    items_ordered = list()

    if indici is not None:
        for id_item in indici:
            items_ordered.append(item_searched.get(id=id_item))

    # [modifica] mettere gli elementi ritornati in base alla distanza (guardare codice vecchio)

    print("è una lista", type(items_ordered))
    print("tipo di struttura", type(item_searched))
    context = {}
    context['item_searched'] = item_searched
    context['word_searched'] = word_searched
    context['user'] = request.user
    context["all_items"] = order
    return render(request, 'items/search.html',context)

def isShop(user):
    print("isShop")
    general_user = GeneralUser.objects.get(user=user)
    print("fineisshop")
    return general_user.login_negozio


def send_email(request):
    subject = "Sending an email with Django"
    message = "Oggetto caricato"
    send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [settings.DEFAULT_FROM_EMAIL], fail_silently=False)
    return HttpResponse("sono un utente e devo visualizzare la BARRA DI RICERCA" + request.user.username)


@login_required(login_url='/users/login')
@user_passes_test(isShop)
def insert_item(request):
    """
    Permette all'utente di inserire un nuovo item.

    :param request: request utente.
    :return: render pagina inserisci_annuncio e redirect alla home.
    """

    # if nega_accesso_senza_profilo(request):
    #     return HttpResponseRedirect(reverse('utenti:scelta_profilo_oauth'))

    form = ItemForm(request.POST or None, request.FILES or None)

    if form.is_valid():
        print("FORM ITEM VALIDA!!")
        item = Item.objects.create(user=request.user)
        item.name = form.cleaned_data['name']
        item.price = form.cleaned_data['price']
        item.discount_price = form.cleaned_data['discount_price']
        item.category = form.cleaned_data['category']
        item.quantity = form.cleaned_data['quantity']
        item.description = form.cleaned_data['description']
        item.image = form.cleaned_data['image']

        try:
            item.image = request.FILES['image']
        except Exception:
            item.image = item.item_pic_or_default()
        item.save()
        context = {
            "form": form,
        }
        return render(request, 'items/insert_item.html', context)

    context = {
        "form": form,
    }

    # return render(request, 'users/base_registrazione.html', context)
    return render(request, 'items/insert_item.html', context)


def show_item_shop(request):
    ...


def control_info_generalUser(user):
    """
    Se l'utente si è registrato ma non ha riempito i propri dati => non può visualizzare gli oggetti e viene rimandato
    nella pagina di compilazione dati utente o shop
    :param user:
    :return:
        - primo parametro: indica se l'utente può entrare nella pagina o no
        - secondo parametro: se non può entrare indica quale modulo di compilazione dati debba essere caricato
    """
    if user.latitudine == 0 or user.longitudine == 0:
        print("Entra nelle latlon")
        if user.login_negozio:
            print("Entra-1")
            return False, HttpResponseRedirect(reverse('users:insert_shop_info'))
        else:
            print("Entra2")
            return False, HttpResponseRedirect(reverse('users:insert_user_info'))
    else:
        return True, True


@login_required(login_url='/users/login')
def item_page(request):
    """
    Dobbiamo ritornare due pagine differenti a seconda che il login sia stato fatto da un utente o da un negozio
    """
    general_user = GeneralUser.objects.get(user=request.user)
    order_qs = Order.objects.filter(user=request.user, ordered=False)
    print(order_qs)

    is_registered, value_redirect = control_info_generalUser(general_user)
    if not is_registered:
        return value_redirect
    if order_qs.exists():
        order = order_qs[0]

    # metto nella var all_items tutti gli oggetti item che ho nel db
    else:
        order = 0
    print("item_page-order:")
    print(order)
    #order_qs = Order.objects.filter(user=request.user, ordered=False)
    #metto nella var all_items tutti gli oggetti item che ho nel db

    all_items = Item.objects.all()
    item_shop = Item.objects.filter(user=request.user)
    context = {}
    context['user'] = general_user
    context['all_items'] = all_items
    context['all_items_cart'] = order

    # faccio il render della pagina html item_page e le passo la var all_items
    # per farlo passo un dictionary chiamato all_items con valori presi dalla var sopra all_items
    # così la var all_items che contiene i dati estratti dal db verrà passata alla pagina html
    # item_page.html che potrà accedervi tramite la var all_items

    if not general_user.login_negozio:
        # se sono un utente
        context['all_items'] = all_items
        return render(request, 'items/item_page.html', context)
        # return HttpResponse("sono un utente e devo visualizzare la BARRA DI RICERCA" + request.user.username)

    else:
        # se sono un negozio
        context['all_items'] = item_shop
        return render(request, 'items/item_page_shop.html', context)
        # return HttpResponse("sono un negozio e devo visualizzare un'altra schermata" + request.user.username)


def show_shop(request, username_shop):
    """
    Mostriamo tutti gli oggetti di un negozio e diamo la possibilità a un utente di lasciare una recensione
    """
    user = User.objects.get(username=username_shop)
    print(username_shop)
    print("username_shop")
    shop_user = GeneralUser.objects.get(user=user)

    is_registered, value_redirect = control_info_generalUser(shop_user)
    if not is_registered:
        return value_redirect

    item_shop = Item.objects.filter(user=shop_user.user)
    print(item_shop)
    text = computeTime(request, shop_user.id)
    review_shop = ReviewShop.objects.filter(writer=request.user, receiver=shop_user.user)
    is_reviewed = False
    if review_shop is not None:
        is_reviewed = True
    context = {
        'all_items': item_shop,
        'text': str(text),
        'is_reviewed': is_reviewed,
        'shop_user': shop_user
    }

    return render(request, 'items/show_shop.html', context)


@login_required(login_url='/users/login')
def buy_page(request, item_selected_id):

    order_qs = Order.objects.filter(user=request.user, ordered=False)
    print(order_qs)

    if order_qs.exists():
        order = order_qs[0]

    else:
        order = 0

    print("buy_page-order:")
    print(order)
    general_user = GeneralUser.objects.get(user=request.user)

    # seleziono prodotto con l'id passato dalla schermata
    item_selected = Item.objects.filter(id=item_selected_id).first()
    context = {}
    context['item_selected'] = item_selected
    context['user'] = general_user
    context['all_items'] = order

    return render(request, 'items/buy_page.html', context)

def modify_item(request, item_selected_id):
    print(request)

@login_required(login_url='/users/login')
def delete_item(request, item_selected_id):
    """
    [Modifica] Usare Ajax per eliminare gli oggetti
    :param request:
    :param item_selected_id:
    :return:
    """
    # if nega_accesso_senza_profilo(request):
    #   return HttpResponseRedirect(reverse('utenti:scelta_profilo_oauth'))

    item_to_delete = Item.objects.filter(user=request.user,id=item_selected_id).first()
    print(item_to_delete)

    if item_to_delete is not None and item_to_delete.user == request.user:
        Item.objects.filter(id=item_selected_id).first().delete()
        # if not annuncio.annuncio_petsitter:
        #   userprofile = Profile.objects.filter(user=request.user).first()
        #  userprofile.pet_coins = userprofile.pet_coins + item_to_delete.pet_coins

        all_items = Item.objects.filter(user=request.user)
        print(item_to_delete)
        print(all_items)
        context = {}
        context = {"all_items": all_items}

        return render(request, 'items/item_page_shop.html', context)

    raise Http404

@login_required(login_url='/users/login')
def checkout(request):
    #ORDER E' L'INSIEME DI ITEM CHE COMPONGONO L'ORDINE DELL'UTENTE
    order = Order.objects.get(user=request.user, ordered=False)
    print("CHECKOUT INIZIALE-order:")
    print(order)
    order_items = order.items.all()
    order_items.update(ordered=True)

    for item in order_items:
        item.save()

    all_items = Item.objects.all()

    for item in all_items:
        for item_in_order in order_items:
            if(item_in_order.item.name == item.name):
                item.quantity = item.quantity - item_in_order.quantity
                item.save()

    order.ordered = True
    order.ref_code = uuid.uuid4()
    order.number_order = order.number_order + 1
    order.save()
    print("CHECKOUT FINALE-order:")
    print(order)

    context = {"all_items": order, 'user': request.user, 'order_qs': order_items, "ref_code": order.ref_code }
    print(context)

    return render(request, 'items/checkout.html', context)


@login_required(login_url='/users/login')
def add_to_cart(request, item_selected_id):
    #item_selected_id = slug

    #SELEZIONO PRODOTTO CORRENTE CHE STO AGGIUNGENDO AL CARRELLO
    item_selected = get_object_or_404(Item, id=item_selected_id)
    print(item_selected)
    #IN ORDER_ITEM HO L'OGGETTO CORRENTE CHE STO AGGIUNGENDO AL CARRELLO
    #.get_or_create funzione che ritorna in order_item l'oggetto creato e created è un flag, se True ha
    #creato l'oggetto se False è stato recuperato dal db
    order_item, created = OrderItem.objects.get_or_create(
        item= item_selected,
        user=request.user,
        ordered=False
    )

    #ORDER E' L'INSIEME DI ITEM CHE COMPONGONO L'ORDINE DELL'UTENTE
    order_qs = Order.objects.filter(user=request.user, ordered=False)
    print(order_qs)

    if order_qs.exists():
        order = order_qs[0]

        if order.items.filter(item__id=item_selected_id).exists():
            if item_selected.quantity > order_item.quantity:
                order_item.quantity += 1
                order_item.save()
                messages.info(request, "This item quantity was updated")

                context = {"all_items": order, 'user': request.user, 'order_qs': order_item, 'item_selected': item_selected}
                print(context)

                return render(request, 'items/buy_page.html',context)
            else:
                messages.info(request, "The quantity of item is insufficient")
                context = {"all_items": order, 'user': request.user, 'order_qs': order_item,
                           'item_selected': item_selected}

                return render(request, 'items/buy_page.html', context)
        else:
            order.items.add(order_item)
            messages.info(request, "This item was added to your cart")

            context = {"all_items": order, 'user': request.user, 'order_qs': order_item, 'item_selected': item_selected}
            print(context)

            return render(request, 'items/buy_page.html', context)

    else:
        ordered_date = timezone.now()
        order = Order.objects.create(user=request.user, ordered_date=ordered_date)
        order.items.add(order_item)
        messages.info(request, "This item was added to your cart")

        context = {"all_items": order, 'user': request.user, 'order_qs': order_item, 'item_selected': item_selected}
        print(context)

        return render(request, 'items/buy_page.html', context)

@login_required(login_url='/users/login')
def go_to_cart(request):

    #ORDER E' L'INSIEME DI ITEM CHE COMPONGONO L'ORDINE DELL'UTENTE
    order_qs = Order.objects.filter(user=request.user, ordered=False)
    print(order_qs)

    if order_qs.exists():
        order = order_qs[0]

    else:
        order = 0

    print("go_to_cart-order:")
    print(order)
    context = {"all_items": order, 'user': request.user}
    print(context)

    return render(request, 'items/add_to_cart.html', context)

@login_required(login_url='/users/login')
def remove_single_item_from_cart(request, item_selected_id):

    #salvo in item_selected l'oggetto che desidero eliminare
    item_selected = Item.objects.filter(id=item_selected_id).first()
    print(item_selected)
    #filtro tutti gli oggetti con ordered=False
    order_qs = Order.objects.filter(
        user=request.user,
        ordered=False
    )
    print(order_qs)
    # se nel carrello c'è almeno un elemento
    if order_qs.exists():
        order = order_qs[0]
        # controllo che l'elemento da eliminare sia in ordine(carrello) se si allora:
        if order.items.filter(item__id=item_selected_id).exists():
            # se l'elemento da eliminare è nel carrello
            order_item = OrderItem.objects.filter(
                item=item_selected,
                user=request.user,
                ordered=False
            )[0]
            # se la quantità è maggiore di 1 la decremento prima di eliminarlo
            if order_item.quantity > 1:
                order_item.quantity -= 1
                order_item.save()
            # se la quantità è 1 rimuovo direttamente
            else:
                order.items.remove(order_item)
            messages.info(request, "This item quantity was updated.")
            context = {"all_items": order}
            print(context)
            return render(request, 'items/add_to_cart.html', context)

        # controllo che l'elemento da eliminare sia in ordine(carrello) se no allora:
        else:
            messages.info(request, "This item was not in your cart")
            context = {"all_items": order}
            print(context)
            return render(request, 'items/add_to_cart.html', context)
    # se il carrello è vuoto
    else:
        messages.info(request, "You do not have an active order")

        context = {"all_items": order, 'user': request.user, 'order_qs': order_item}
        print(context)

        return render(request, 'items/add_to_cart.html', context)

@login_required(login_url='/users/login')
def remove_entire_item_from_cart(request, item_selected_id):
    #salvo in item_selected l'oggetto che desidero eliminare
    item_selected = Item.objects.filter(id=item_selected_id).first()
    print(item_selected)

    order_qs = Order.objects.filter(
        user=request.user,
        ordered=False
    )
    if order_qs.exists():
        order = order_qs[0]
        # check if the order item is in the order
        if order.items.filter(item__id=item_selected_id).exists():
            order_item = OrderItem.objects.filter(
                item=item_selected,
                user=request.user,
                ordered=False
            )[0]
            order.items.remove(order_item)
            order_item.delete()
            messages.info(request, "This item was removed from your cart.")

            context = {"all_items": order, 'user': request.user, 'order_qs': order_item}
            print(context)

            return render(request, 'items/add_to_cart.html', context)
        else:
            messages.info(request, "This item was not in your cart")

            context = {"all_items": order, 'user': request.user, 'order_qs': order_item}
            print(context)

            return render(request, 'items/add_to_cart.html', context)
    else:
        messages.info(request, "You do not have an active order")

        context = {"all_items": order, 'user': request.user, 'order_qs': order_item}
        print(context)

        return render(request, 'items/add_to_cart.html', context)

def view_order(request):
    all_orders = Order.objects.filter(user=request.user, ordered=True)
    order_qs = Order.objects.filter(user=request.user, ordered=False)
    print(order_qs)

    if order_qs.exists():
        order = order_qs[0]

    else:
        order = 0

    context = {}
    context["all_orders"] = all_orders
    context["all_items"] = order
    print(context)
    return render(request, 'items/view_order.html', context)


def isUser(user):
    general_user = GeneralUser.objects.get(user=user)
    return not general_user.login_negozio


@login_required(login_url='/users/login')
@user_passes_test(isUser)
def show_distance_shops(request, items_available, ascending=True):

    """
    Ordina gli annunci per distanza geografica secondo la selezione fatta dall'utente.
    Il calcolo risultante permette di considerare la distanza tra due punti espressa in km.

    :param ascending: Se è True gli indici ritornati sono in ordine crescente in base alle distanze
    :param items_available:
    :param ordina: indica se l'ordinamento deve essere crescente, decrescente o non ordinare.
    :return: indici degli annunci ordinati.

    """

    general_user = GeneralUser.objects.get(user=request.user)

    parameters = []

    # shops_validi = GeneralUser.objects.filter(login_negozio=True)
    print(items_available)

    # metto tutti i valori tranne il primo, li aggiorno e metto in testa il primo
    # dato l'oggetto prendo le coordinate del suo negozio
    for item in items_available:
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
    for i, item in enumerate(items_available):
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

    if len(indici) > 0:
        # Ordina in modo crescente o decrescente sulle distanze
        if ascending:
            distanze_negozi, indici = (list(t) for t in zip(*sorted(zip(distanze, indici))))
            _, items_pk = (list(t) for t in zip(*sorted(zip(distanze, items_pk))))
            _, parameters = (list(t) for t in zip(*sorted(zip(distanze, parameters))))
        else:
            distanze_negozi, indici = (list(t) for t in zip(*sorted(zip(distanze, indici), reverse=True)))
            _, items_pk = (list(t) for t in zip(*sorted(zip(distanze, items_pk), reverse=True)))
            _, parameters = (list(t) for t in zip(*sorted(zip(distanze, parameters), reverse=True)))

    else:
        return None


    # return indici
    print("distanze", distanze_negozi)
    print("indici", indici)

    complete_parameters = parameters[:]
    complete_parameters.insert(0,
                               general_user.indirizzo.replace("/", "") + ',' + general_user.citta.replace("/", "") + ','
                               + general_user.stato.replace("/", "") + ',' + general_user.codice_postale.replace("/",
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
    return items_pk


def computeTime(request, id_shop):
    """"
    Passo gli identificativi univoci dei negozi più vicini e in base a questo filtro mostro i prodotti richiesti

    [modifica] da modificare la descrizione della funzione

    :param locations: è un elenco di indirizzi in cui il primo è quello dell'utente e
                        gli altri sono quelli dei negozi più vicini in linea d'aria
    :param id_utente: sono gli id univoci dell'utente e dei negozi a lui vicini in linea d'aria

    [modifica] --> Funzione da mostrare in Ajax
    """

    # print('complete parameters \n', complete_parameters)

    # se voglio posso iterare sull'oggetto e tenere solo alcuni negozi da mostrare, altrimenti posso fare la ricerca
    # di tutte le distanze utente-negozio

    # item = Item.objects.filter(id=item_selected_id).first()
    # shop = GeneralUser.objects.get(user=item.user)

    shop = GeneralUser.objects.get(id=id_shop)
    user = GeneralUser.objects.get(user=request.user)
    parameters = []
    # metto le coordinate dell'utente
    parameters.append(user.indirizzo.replace("/", "") + ',' + user.citta.replace("/", "") + ','
                      + user.stato.replace("/", "") + ',' + user.codice_postale.replace("/", ""))

    # metto le coordinate del negozio relativo all'item
    parameters.append(shop.indirizzo.replace("/", "") + ',' + shop.citta.replace("/", "") + ','
                      + shop.stato.replace("/", "") + ',' + shop.codice_postale.replace("/", ""))

    complete_parameters = parameters[:]

    complete_parameters = {
        'locations':
            complete_parameters
    }

# [modifica] dare un controllo sulla latitudine e longitudine giuste

    # ritorna il tempo in secondi
    response = requests.post(
        "http://www.mapquestapi.com/directions/v2/routematrix?key=5EIZ4tvrnyP3cOOMXpKoGlQ0bo92YoM3",
        json=complete_parameters)
    response_post_JSON = response.json()

    # arrotondo al minuto successivo a meno che la posizione non sia la stessa
    # è stato creato per un insieme di valori ma adesso gliene vengono passati solo due
    time = [(float(x) + 59) // 60 for x in response_post_JSON['time']]  # da secondi ---> minuti

    print(response_post_JSON)
    print(response_post_JSON['distance'])
    print(response_post_JSON['time'])
    print("time", time)
    ore = ''

    if time[1] // 60 > 0:
        if time[1] // 3600 > 1:
            ore = str(int(time[1] // 60)) + " ore e "
        else:
            ore = str(int(time[1] // 60)) + " ora e "

    if time[1] % 60 > 1:
        minuti = " minuti dal negozio"
    else:
        minuti = " minuto dal negozio"

    return "L'utente " + request.user.username + " si trova a " + ore + str((int(time[1]) % 60)) + minuti


def show_feedback_item(request, item_selected_id):
    """
    [modifica]
    Dobbiamo mostrare una serie di recensioni e cliccando sopra si può visualizzare l'intera recensione (fatta con card)
    """

    item = Item.objects.filter(id=item_selected_id).first()
    reviews = ReviewItem.objects.filter(receiver=item)

    context = {
        'item': item,
        'all_reviews': reviews
    }

    return render(request, 'items/show_feedback_item.html', context)


def show_reviews_shop(request, shop_selected_id):
    """
    Mostra tutte le recensioni del negozio
    """

    shop = GeneralUser.objects.filter(id=shop_selected_id).first()
    reviews = ReviewShop.objects.filter(receiver=shop.user)

    print(reviews)
    context = {
        'shop': shop,
        'all_reviews': reviews
    }

    return render(request, 'items/show_reviews_shop.html', context)
