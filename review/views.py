from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse

from items.models import Item
from review.forms import ReviewItemForm, ReviewShopForm
from review.models import ReviewItem, ReviewShop
from users.models import GeneralUser
from django.contrib.auth.decorators import login_required


@login_required(login_url='/utenti/login/')
def add_review_item(request, item_selected_id):

    review_form = ReviewItemForm(request.POST or None, request.FILES or None)

    item = Item.objects.get(id=item_selected_id)
    if review_form.is_valid():
        review = ReviewItem.objects.get_or_create(writer=request.user, receiver=item)[0]

        review.title_of_comment = review_form.cleaned_data['title_of_comment']
        review.description = review_form.cleaned_data['description']
        review.rating = review_form.cleaned_data['rating']
        review.save()
        return HttpResponseRedirect(reverse('index'))

    context = {
        "item": item,
        "review_form": review_form,
    }

    return render(request, 'review/add_review_item.html', context)


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
        return HttpResponseRedirect(reverse('add_review_customer', args=customer_selected_id))

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
