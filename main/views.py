from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.models import User

def index(request):
    return render(request, 'main/home.html')    #pagina principale del sito

def home_for_shop(request, user_profile):
    #seleziono user con l'id passato dalla schermata
    user_profile = User.objects.filter(id=user_profile).first()

    context = {}
    context['user_profile'] = user_profile
    context['boolean_shop_user'] = 0
    print(context)
    return render(request, 'main/home_for_shop.html', context)    #pagina principale del sito


def home_for_user(request, user_profile):
    # seleziono user con l'id passato dalla schermata
    user_profile = User.objects.filter(id=user_profile).first()

    context = {}
    context['user_profile'] = user_profile
    print(context)
    return render(request, 'main/home_for_shop.html', context)  # pagina principale del sito

def autenticato(request):
    return render(request, 'main/autenticato.html')

#def handler404(request):
    #add something
    #return render(request, '404.html', status=404, context=context)

# def login_page(request):
#     return render(request, 'users/login_page.html')

def registration_page(request):
    return render(request, 'users/registration_page.html')

def empty_cart(request):
    return render(request, 'main/empty_cart.html')

def mostra_logout_avvenuto(request):
    return render(request, 'users/logout_effettuato.html')

def contact(request):
    return render(request, 'main/contact.html')