from django.contrib import messages
from django.http import Http404, HttpResponseRedirect
from django.shortcuts import render, get_object_or_404
from django.urls import reverse

from .models import Item,OrderItem,Order  # importo il modello così che possa utilizzalo, andrà a
                                          # pescare gli Item dal db e conservarli in una variabile
from django.contrib.auth.decorators import login_required, user_passes_test
from django.http import Http404, HttpResponse
from django.shortcuts import render

from users.models import GeneralUser
from .models import Item    #importo il modello così che possa utilizzalo, andrà a pescare gli Item dal db e conservarli in una variabile
from .forms import ItemForm
from django.utils import timezone


def search(request):
    word_searched = request.GET.get('search')
    item_searched = Item.objects.filter(name__contains=word_searched)

    context = {
        'item_searched': item_searched,
        'word_searched': word_searched
    }

    return render(request, 'items/search.html',context)


def isShop(user):
    print("isShop")
    general_user = GeneralUser.objects.get(user=user)
    print("fineisshop")
    return general_user.login_negozio


@login_required(login_url='/users/login')
@user_passes_test(isShop)
def add_item(request):
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
        item.category = form.cleaned_data['category']
        item.description = form.cleaned_data['description']
        # item.image = form.cleaned_data['image']

        try:
            print("entra nel try")
            item.image = request.FILES['image']
        except Exception:
            print("entra nell'except")
            item.image = item.item_pic_or_default()
        print("FOTO PROFILO ", item.image)
        item.save()

        return HttpResponseRedirect(reverse('items:item_page'))

    context = {
        "form": form,
    }

    # return render(request, 'users/base_registrazione.html', context)
    return render(request, 'items/insert_item.html', context)


def show_item_shop(request):
    ...



@login_required(login_url='/users/login')
def item_page(request):
    """
    Dobbiamo ritornare due pagine differenti a seconda che il login sia stato fatto da un utente o da un negozio
    """
    general_user = GeneralUser.objects.get(user=request.user)


    #metto nella var all_items tutti gli oggetti item che ho nel db
    all_items = Item.objects.all()
    item_shop = Item.objects.filter(user=request.user)

    context = {}
    context['user'] = general_user

    #faccio il render della pagina html item_page e le passo la var all_items
    #per farlo passo un dictionary chiamato all_items con valori presi dalla var sopra all_items
    #così la var all_items che contiene i dati estratti dal db verrà passata alla pagina html
    #item_page.html che potrà accedervi tramite la var all_items

    if general_user.login_negozio == False:
        #se sono un utente
        context['all_items'] = all_items
        return render(request, 'items/item_page.html', context)
        # return HttpResponse("sono un utente e devo visualizzare la BARRA DI RICERCA" + request.user.username)

    else:
        #se sono un negozio
        context['all_items'] = item_shop
        return render(request, 'items/item_page.html', context)
        # return HttpResponse("sono un negozio e devo visualizzare un'altra schermata" + request.user.username)


def buy_page(request, item_selected_id):
   # print(item_selected_id)

    #seleziono prodotto con l'id passato dalla schermata
    item_selected = Item.objects.filter(id=item_selected_id).first()
    context = {}
    context['item_selected'] = item_selected
    print(context)
    return render(request, 'items/buy_page.html', context)

def modify_item(request, item_selected_id):
    print(request)

def delete_item(request, item_selected_id):
    """
    [Modifica] Usare Ajax per eliminare gli oggetti
    :param request:
    :param item_selected_id:
    :return:
    """
    #if nega_accesso_senza_profilo(request):
     #   return HttpResponseRedirect(reverse('utenti:scelta_profilo_oauth'))


    item_to_delete = Item.objects.filter(id=item_selected_id).first()

    if item_to_delete is not None: # and annuncio.user == request.user:
        Item.objects.filter(id=item_selected_id).first().image.delete(save=True)
        #if not annuncio.annuncio_petsitter:
         #   userprofile = Profile.objects.filter(user=request.user).first()
          #  userprofile.pet_coins = userprofile.pet_coins + item_to_delete.pet_coins
           # userprofile.save()

        Item.objects.filter(id=item_selected_id).delete()
        all_items = Item.objects.all()

        context = {}
        context = {"all_items": all_items}

        return render(request, 'items/item_page.html', context)

    raise Http404


#@login_required
def add_to_cart(request, item_selected_id):

    #get_object_or_404 funzione che chiama il modello specificato e se non esiste genera errore 404
    #item = get_object_or_404(Item, item_selected=item_selected_id)

    # seleziono prodotto con l'id passato dalla schermata
    item_selected = Item.objects.filter(id=item_selected_id).first()
    #print(item_selected)
    #.get_or_create funzione che ritorna in order_item l'oggetto creato e created è un flag, se True ha
    #creato l'oggetto se False è stato recuperato dal db
    order_item, created = OrderItem.objects.get_or_create(
        item=item_selected,
        #user=request.user,
        ordered=False
    )
    order_qs = Order.objects.filter(ordered=False)
    if order_qs.exists():
        order = order_qs[0]

        if order.items.filter(item__id=item_selected_id).exists():
            order_item.quantity += 1
            order_item.save()
            messages.info(request, "This item quantity was updated.")
            context = {"all_items": order}
            print(context)
            return render(request, 'items/add_to_cart.html', context)
        else:
            order.items.add(order_item)
            messages.info(request, "This item was added to your cart.")
            context = {"all_items": order}
            print(context)
            return render(request, 'items/add_to_cart.html', context)

    else:
        ordered_date = timezone.now()
        order = Order.objects.create(ordered_date=ordered_date)
        order.items.add(order_item)
        messages.info(request, "This item was added to your cart.")
        context = {"all_items": order}
        print(context)
        return render(request, 'items/add_to_cart.html', context)


#@login_required
def remove_single_item_from_cart(request, item_selected_id):

    #salvo in item_selected l'oggetto che desidero eliminare
    item_selected = Item.objects.filter(id=item_selected_id).first()
    print(item_selected)
    #filtro tutti gli oggetti con ordered=False
    order_qs = Order.objects.filter(
        #user=request.user,
        ordered=False
    )
    print(order_qs)
    #se nel carrello c'è almeno un elemento
    if order_qs.exists():
        order = order_qs[0]
        #controllo che l'elemento da eliminare sia in ordine(carrello) se si allora:
        if order.items.filter(item__id=item_selected_id).exists():
            #se l'elemento da eliminare è nel carrello
            order_item = OrderItem.objects.filter(
                item=item_selected,
                #user=request.user,
                ordered=False
            )[0]
            #se la quantità è maggiore di 1 la decremento prima di eliminarlo
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

        #controllo che l'elemento da eliminare sia in ordine(carrello) se no allora:
        else:
            messages.info(request, "This item was not in your cart")
            context = {"all_items": order}
            print(context)
            return render(request, 'items/add_to_cart.html', context)
    #se il carrello è vuoto
    else:
        return render(request, 'items/empty_cart.html')