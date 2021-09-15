from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse

from items.models import Item
from review.forms import ReviewItemForm, ReviewShopForm
from review.models import ReviewItem
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
def add_review_user(request, user_selected_id):

    review_form = ReviewShopForm(request.POST or None, request.FILES or None)

    shop_to_review = GeneralUser.objects.get(user=user_selected_id)

    if review_form.is_valid():
        review = ReviewItem.objects.get_or_create(writer=request.user, receiver=shop_to_review)[0]

        review.title_of_comment = review_form.cleaned_data['title_of_comment']
        review.description = review_form.cleaned_data['description']
        review.rating = review_form.cleaned_data['rating']
        review.save()
        return HttpResponseRedirect(reverse('index'))

    context = {
        "shop_to_review": shop_to_review,
        "review_form": review_form,
    }

    return render(request, 'review/add_review_user.html', context)

