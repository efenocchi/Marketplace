from django.http import HttpResponseRedirect, HttpResponse
from django.shortcuts import render
from django.urls import reverse

from items.models import Item, Order, OrderItem
from review.forms import ReviewItemForm, ReviewShopForm
from review.models import ReviewItem, ReviewShop
from users.models import GeneralUser
from django.contrib.auth.decorators import login_required


@login_required(login_url='/utenti/login/')
def add_review_item(request, item_selected_id, order_item_id):

    review_form = ReviewItemForm(request.POST or None, request.FILES or None)

    if review_form.is_valid():
        order = Order.objects.get(items=order_item_id)
        item = Item.objects.get(id=item_selected_id)

        # # ripulisco il nome dell'oggetto
        # oggetto_scelto = review_form.cleaned_data['order_item']
        # x = oggetto_scelto.find("of")
        # oggetto_scelto = oggetto_scelto[x + 3:]

        review = ReviewItem.objects.get_or_create(writer=request.user, item=item, order=order)[0]
        review.title_of_comment = review_form.cleaned_data['title_of_comment']
        review.description = review_form.cleaned_data['description']
        review.rating = review_form.cleaned_data['rating']
        review.save()

        return HttpResponseRedirect(reverse('index'))

    context = {
        'review_form': review_form,
        'item_selected_id': item_selected_id,
        'order_item_id': order_item_id
    }
    return render(request, 'review/add_review_item.html', context)


@login_required(login_url='/utenti/login/')
def show_items_to_review(request):

    order_item = OrderItem.objects.filter(user=request.user)

    context = {
        'user': request.user,
        'order_item': order_item
    }

    # context['all_items_cart'] = order

    # if review_form.is_valid():
    #     # ripulisco il nome dell'oggetto
    #     oggetto_scelto = review_form.cleaned_data['order_item']
    #     x = oggetto_scelto.find("of")
    #     oggetto_scelto = oggetto_scelto[x + 3:]
    #
    #     item = Item.objects.get(name=oggetto_scelto)
    #
    #     my_order_items2 = OrderItem.objects.get(user=request.user, item=oggetto_scelto)
    #     # review = ReviewItem.objects.get_or_create(writer=request.user, receiver=item)[0]
    #     review = ReviewItem.objects.get_or_create(writer=request.user, item = item, my_items = my_order_items2)[0]
    #     review.title_of_comment = review_form.cleaned_data['title_of_comment']
    #     review.description = review_form.cleaned_data['description']
    #     review.rating = review_form.cleaned_data['rating']
    #     review.save()
    #     return HttpResponseRedirect(reverse('index'))

    # context = {
    #     "review_form": review_form,
    # }

    return render(request, 'review/mostra_ordini_fatti.html', context)


@login_required(login_url='/utenti/login/')
def add_review_shop(request, shop_selected_id):
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
def add_review_customer(request, customer_selected_id):
    """
    Un negozio potrà dare un feedback all'utente dopo che esso avrà fatto un acquisto nello stesso
    :param request:
    :param customer_selected_id:
    :return:
    """

    review_form = ReviewShopForm(request.POST or None, request.FILES or None)

    customer_to_review = GeneralUser.objects.get(user=customer_selected_id)
    writer = GeneralUser.objects.get(user=request.user)

    # un utente sta cercando di fare una recensione a un altro utente, non è possibile
    # [Modifica] devo ritornare anche l'errore dove faccio capire che non è possibile farlo
    if not writer.login_negozio:
        return HttpResponseRedirect("un utente non può dare un feedback a un altro utente")

    if review_form.is_valid():
        review = ReviewItem.objects.get_or_create(writer=request.user, receiver=customer_to_review)[0]

        review.title_of_comment = review_form.cleaned_data['title_of_comment']
        review.description = review_form.cleaned_data['description']
        review.rating = review_form.cleaned_data['rating']
        review.save()
        return HttpResponseRedirect(reverse('index'))

    context = {
        "customer_to_review": customer_to_review,
        "review_form": review_form,
    }

    return render(request, 'review/add_review_shop.html', context)
