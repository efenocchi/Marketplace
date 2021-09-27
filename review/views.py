from django.http import HttpResponseRedirect, HttpResponse
from django.shortcuts import render
from django.urls import reverse

from items.models import Item, Order, OrderItem
from review.forms import ReviewItemForm, ReviewShopForm, ReviewCustomerForm
from review.models import ReviewItem, ReviewShop, ReviewCustomer
from users.models import GeneralUser
from django.contrib.auth.decorators import login_required


@login_required(login_url='/utenti/login/')
def show_item_reviewed(request, item_selected_id, order_item_id):
    """
    Se clicco su un oggetto già recensito posso visualizzare la recensione precedentemente lasciata
    :param request:
    :param item_selected_id:
    :param order_item_id:
    :return:
    """
    order = Order.objects.get(items=order_item_id)
    item = Item.objects.get(id=item_selected_id)
    review = ReviewItem.objects.get(writer=request.user, order=order, item=item)
    review_form = ReviewItemForm(request.POST or None, request.FILES or None, instance=review, reviewed=True)
    context = {
        'review_form': review_form,
        'item_selected_id': item_selected_id,
        'order_item_id': order_item_id
    }

    return render(request, 'review/show_item_reviewed.html', context)


@login_required(login_url='/utenti/login/')
def show_customers_reviewed(request, receiver_id, order_item_id):
    """
     Se clicco su un cliente già recensito posso visualizzare la recensione precedentemente lasciata
     (per un determinato ordine)
    :param request:
    :param receiver_id:
    :param order_item_id:
    :return:
    """
    order = Order.objects.get(items=order_item_id)
    receiver = GeneralUser.objects.get(id=receiver_id)
    review = ReviewCustomer.objects.get(writer=request.user, receiver=receiver.user, order=order)
    review_form = ReviewCustomerForm(request.POST or None, request.FILES or None, instance=review, reviewed=True)
    context = {
        'review_form': review_form,
        'receiver_id': receiver_id,
        'order_item_id': order_item_id
    }

    return render(request, 'review/show_customers_reviewed.html', context)

@login_required(login_url='/utenti/login/')
def add_review_item(request, item_selected_id, order_item_id):
    """
    Una volta selezionato l'oggetto che voglio recensire mi viene caricata la pagina e posso effettuare la recensione
    :param request:
    :param item_selected_id:
    :param order_item_id:
    :return:
    """
    review_form = ReviewItemForm(request.POST or None, request.FILES or None, reviewed=False)

    if review_form.is_valid():
        order = Order.objects.get(items=order_item_id)
        item = Item.objects.get(id=item_selected_id)
        order_item = OrderItem.objects.get(id=order_item_id)

        # # ripulisco il nome dell'oggetto
        # oggetto_scelto = review_form.cleaned_data['order_item']
        # x = oggetto_scelto.find("of")
        # oggetto_scelto = oggetto_scelto[x + 3:]

        review = ReviewItem.objects.get_or_create(writer=request.user, item=item, order=order)[0]
        review.title_of_comment = review_form.cleaned_data['title_of_comment']
        review.description = review_form.cleaned_data['description']
        review.rating = review_form.cleaned_data['rating']
        review.save()
        order_item.review_item_done = True
        order_item.save()

        return HttpResponseRedirect(reverse('review:show_items_to_review'))

    context = {
        'review_form': review_form,
        'item_selected_id': item_selected_id,
        'order_item_id': order_item_id
    }
    return render(request, 'review/add_review_item.html', context)


@login_required(login_url='/utenti/login/')
def show_items_to_review(request):
    """
    Mostra gli oggetti che ho comprato
    :param request:
    :return:
    """
    order_item = OrderItem.objects.filter(user=request.user)

    context = {
        'user': request.user,
        'order_item': order_item
    }

    return render(request, 'review/mostra_ordini_fatti.html', context)


@login_required(login_url='/utenti/login/')
def add_review_shop(request, shop_selected_id):
    """
    Un utente (negozio o utente normale) potrà lasciare un feedback generale a un negozio
    :param request:
    :param shop_selected_id:
    :return:
    """
    review_form = ReviewShopForm(request.POST or None, request.FILES or None)

    shop_to_review = GeneralUser.objects.get(id=shop_selected_id)

    if review_form.is_valid():
        review = ReviewShop.objects.get_or_create(writer=request.user, receiver=shop_to_review.user)[0]

        review.title_of_comment = review_form.cleaned_data['title_of_comment']
        review.description = review_form.cleaned_data['description']
        review.rating = review_form.cleaned_data['rating']
        review.save()
        return HttpResponseRedirect(reverse('index'))

    context = {
        "shop_to_review": shop_to_review,
        "review_form": review_form,
    }

    return render(request, 'review/add_review_shop.html', context)


@login_required(login_url='/utenti/login/')
def add_review_customer(request, order_id, customer_id):
    """
    Un negozio potrà dare un feedback all'utente dopo che esso avrà fatto un acquisto
    :param request:
    :param order_id:
    :param customer_id:
    :return:
    """

    review_form = ReviewCustomerForm(request.POST or None, request.FILES or None, reviewed=False)

    writer = GeneralUser.objects.get(user=request.user)
    receiver = GeneralUser.objects.get(id=customer_id)
    order = Order.objects.get(id=order_id)

    # un utente sta cercando di fare una recensione a un altro utente, non è possibile
    # [Modifica] devo ritornare anche l'errore dove faccio capire che non è possibile farlo
    if not writer.login_negozio:
        return HttpResponseRedirect("un utente non può dare un feedback a un altro utente")

    if review_form.is_valid():

        review = ReviewCustomer.objects.get_or_create(writer=request.user, receiver=receiver.user, order=order)[0]

        review.title_of_comment = review_form.cleaned_data['title_of_comment']
        review.description = review_form.cleaned_data['description']
        review.rating = review_form.cleaned_data['rating']
        review.save()
        order.review_customer_done = True
        order.save()
        return HttpResponseRedirect(reverse('index'))

    context = {
        "order": order,
        "receiver": receiver,
        'review_form': review_form,
    }

    return render(request, 'review/add_review_customer.html', context)


def show_order_done_by_customer(request):
    """
    Mostro gli ordini che sono stati effettutati dagli utenti e per ogni ordine posso dare un feedback all'utente
    :param request:
    :return:
    """
    # oggetti venduti dal negozio
    dict = {}
    # orders = Order.objects.filter(items=OrderItem.objects.filter(Item.objects.filter(user=request.user)))

    items = Item.objects.filter(user=request.user)
    stringa="ciao"
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
                    print("tipo dict ",type(dict))
                    print("cosa c'è nel dizionario", dict)
                    stringa = single_order.ref_code
                    print("tipo stringa ",type(stringa))
                    print("eccoci qua", dict[stringa])
                else:
                    # come primo elemento metto l'order che mi servirà nel file html
                    # gli elementi successivi sono invece i single_order
                    list.append(single_order)
                    list.append(single_order_item)
                    dict.update({str(single_order.ref_code): list})


    # print(dict[stringa])
    print("dizionario finale", dict)
    context = {
        'user': request.user,
        'dict': dict
    }

    return render(request, 'review/show_order_done_by_customer.html', context)
