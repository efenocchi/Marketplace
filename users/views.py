import threading
from math import radians, sin, cos, atan2, sqrt
from django.contrib import messages
from django.contrib.auth import authenticate, login
from django.contrib.auth import logout
from django.contrib.auth.models import User
from items.models import Order
from django.http import HttpResponseRedirect, HttpResponse
from django.shortcuts import render, get_object_or_404
# Create your views here.
from django.http import Http404
from django.urls import reverse
from django.contrib.auth.decorators import login_required, user_passes_test
from django.forms import modelformset_factory

from users.forms import NormalUserForm, UserForm, ShopProfileForm
from .models import GeneralUser
from . import models
from . import forms
import requests



def index(request):
    return render(request, 'users/home.html')  # pagina sito con barra di ricerca


# le views nelle funzioni sono ancora collegate a caso tra le pagine html esistenti solo per vedere se funzionavano le funzioni

def login_all(request):
    """
    [modifica] aggiungere parte Ajax!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    Permette agli utenti di effettuare il login.

    :param request: request utente.
    :return: render della pagina login.
    """
    print("entra")
    if not request.user.is_authenticated:
        print("Non è autenticato")
        if request.method == "POST":
            username = request.POST['username']
            password = request.POST['password']
            user = authenticate(username=username, password=password)
            if user is not None:
                if user.is_active:
                    login(request,
                          user)  # [modifica]invece che loggare direttamente, creare un pop-up che avvisi l'utente che può loggarsi
                    # mostrare quindi la pagina principale, evitando di loggare in automatico
                    # controllo se ha fatto l'accesso un utente normale o un negozio

                    # return HttpResponse("L'utente " + request.user.username + " si è loggato con successo")
                    return HttpResponseRedirect(reverse('items:item_page'))
                else:
                    return render(request, 'users/login_page.html',
                                  {'error_message': 'Il tuo account è stato disattivato'})
            else:
                return render(request, 'users/login_page.html', {'error_message': 'Login invalido'})
        return render(request, 'users/login_page.html')
    else:
        # se l'utente è loggato gli faccio vedere la pagina items (andrà cambiata con la pagina per info utente-negozio) [modifica]
        return HttpResponseRedirect(reverse('items:item_page'))
        # return render(request, 'users/login_page.html', {'error_message': 'Immettere un utente e una password validi'})


# uguale alla registrazione dell'utente, se non cambia niente in futuro se ne può lasciare solo una
def shop_registration(request):
    form = UserForm(request.POST or None, oauth_user=0)

    if form.is_valid() and \
            not User.objects.filter(username=form.cleaned_data['username']).exists():
        shop = form.save(commit=False)
        username = form.cleaned_data['username']
        password = form.cleaned_data['password']
        shop.set_password(password)
        shop.save()
        # serve così se per qualche motivo non va a buon fine l'inserimento successivo dei dati del GeneralUser,
        # posso inserirli in un secondo momento
        general_user = GeneralUser.objects.get_or_create(user=shop)[0]
        general_user.login_negozio = True
        general_user.save()
        shop = authenticate(username=username, password=password)
        if shop is not None:
            if shop.is_active:
                login(request, shop)
                return HttpResponseRedirect(reverse('users:insert_shop_info'))

    context = {
        "form": form,
    }

    return render(request, 'users/registration_page.html', context)


# Ricordarsi di mandare una email tra la registrazione iniziale e la compilazione del profilo
def normal_user_registration(request):
    """
    Permette agli utenti di registrare un account utente normale.

    :param request: request utente.
    :return: render della pagina di registrazione utente normale.
    """

    form = UserForm(request.POST or None, oauth_user=0)
    # normalform = NormalUserForm(request.POST or None, request.FILES or None)
    # form validi e utenti con lo stesso username non si sono già registrati
    if form.is_valid() and \
            not User.objects.filter(username=form.cleaned_data['username']).exists():

        user = form.save(commit=False)
        username = form.cleaned_data['username']
        password = form.cleaned_data['password']
        user.set_password(password)
        user.save()
        print(user)
        general_user = GeneralUser.objects.get_or_create(user=user)[0]
        general_user.login_negozio = False
        general_user.save()
        print("passato oltre")
        '''try:
            profile.foto_profilo = request.FILES['foto_profilo']
        except Exception:
            profile.foto_profilo = None'''

        print("ha salvato")
        user = authenticate(username=username, password=password)
        if user is not None:
            if user.is_active:
                login(request, user)
                # return HttpResponseRedirect(reverse('users:insert_user_info', kwargs={'oid':user.pk}))
                return HttpResponseRedirect(reverse('users:insert_user_info'))
                # return HttpResponseRedirect(reverse('index'))
    else:
        print("i form non sono validi")
    context = {
        "form": form,
    }

    if not request.user.is_authenticated:
        # context['base_template'] = 'main/home.html'
        ...
    else:
        # return render(request, 'users/registration_page.html', context)
        # return HttpResponse("Effettuare prima il logout di: " + request.user.username)
        ...
    return render(request, 'users/registration_page.html', context)


@login_required(login_url='/users/login')  # aggiungere il controllo che sia un negozio e non un utente
def insert_shop_info(request):
    """
    [modifica]
1)    Creare anche la funzione edit shop_profile, questa viene chiamata dopo il login
  2) fare il controllo con oid passato anche tramite file html
    [fine-modifica]

    Permette agli utenti di modificare il proprio profilo, cambiando i loro dati.
    Verrà visualizzato dopo il primo login in modo tale da permettere all'utente di inserire tutti i dati.

    :param request: request utente.
    :param oid: id dell'utente di cui si vuole modificare il profilo (con controllo che sia == all'id
    dell'utente loggato).
    """

    oaut_user = False
    # if int(oid) == int(request.user.pk):

    # user_profile = User.objects.get(pk=oid)
    user_profile = User.objects.get(pk=request.user.pk)

    # if user_profile.has_usable_password():  # se la password è valida
    #     form = UserForm(data=request.POST or None, instance=request.user, oauth_user=0)
    # else:
    #     form = UserForm(data=request.POST or None, instance=request.user, oauth_user=1)
    #     oaut_user = True

    form = UserForm(data=request.POST or None, instance=user_profile, oauth_user=1)
    shopform = ShopProfileForm(request.POST or None, request.FILES or None)

    if shopform.is_valid():
        print("normal form validi")
        shop_profile = GeneralUser.objects.get_or_create(user=request.user)[0]
        try:
            shop_profile.foto_profilo = request.FILES['foto_profilo']
        except Exception:
            shop_profile.foto_profilo = None

        set_shop_info(shop_profile, shopform)
        print(user_profile)

        context={"user_profile": shop_profile}
        return render(request, 'main/home_for_shop.html', context)
        #return HttpResponse("Login effettuato con successo dall'utente: " + request.user.username +
                           # ' che abita in via: ' + shop_profile.indirizzo)
        # return HttpResponseRedirect(reverse('users:prova_passaggio_interi', kwargs={'oid':request.user.pk}))
    else:
        print("normal form NON validi")
    context = {
        "form": form,
        "profileForm": shopform,
    }

    # return render(request, 'users/'+ str(oid) +'/insert_info.html', context)
    return render(request, 'users/insert_shop_info.html', context)


def prova_passaggio_interi(request, oid):
    context = {
        'variabile': oid,
    }
    return render(request, 'users/prova_passaggio.html', context)


@login_required(login_url='/users/login')
def insert_user_info(request):
    """
    [modifica]
1)    Creare anche la funzione edit general_user, questa viene chiamata dopo il login
  2) fare il controllo con oid passato anche tramite file html
    [fine-modifica]

    Permette agli utenti di modificare il proprio profilo, cambiando i loro dati.
    Verrà visualizzato dopo il primo login in modo tale da permettere all'utente di inserire tutti i dati.

    :param request: request utente.
    :param oid: id dell'utente di cui si vuole modificare il profilo (con controllo che sia == all'id
    dell'utente loggato).
    """
    print("entra nel insert")
    oaut_user = False
    # if int(oid) == int(request.user.pk):
    print("CORRISPONDONO")

    # user_profile = User.objects.get(pk=oid)
    user_profile = User.objects.get(pk=request.user.pk)

    form = UserForm(data=request.POST or None, instance=user_profile, oauth_user=1)
    normalform = NormalUserForm(request.POST or None, request.FILES or None)

    if normalform.is_valid():
        print("normal form validi")
        general_user = GeneralUser.objects.get_or_create(user=request.user)[0]
        try:
            general_user.foto_profilo = request.FILES['foto_profilo']
        except Exception:
            general_user.foto_profilo = None

        set_user_info(general_user, normalform)
        order_qs = Order.objects.filter(
            user=request.user,
            ordered=False
        )

        if order_qs.exists():
            order = Order.objects.get(user=request.user, ordered=False)
        else:
            order = 0
        context={"user_profile": general_user,"all_items":order}
        return render(request, 'main/home_for_user.html', context)
        #return HttpResponse("Login effettuato con successo dall'utente: " + request.user.username +
         #                   ' che abita in via: ' + general_user.indirizzo)
        # return HttpResponseRedirect(reverse('users:prova_passaggio_interi', kwargs={'oid':request.user.pk}))
    else:
        print("normal form NON validi")
    context = {
        "form": form,
        "profileForm": normalform,
    }

    # return render(request, 'users/'+ str(oid) +'/insert_info.html', context)
    return render(request, 'users/insert_info.html', context)

def home_for_user(request,user_profile):

    user_profile = GeneralUser.objects.get(user=request.user)
    print(user_profile)
    order_qs = Order.objects.filter(
        user=request.user,
        ordered=False
    )

    if order_qs.exists():
        order = Order.objects.get(user=request.user, ordered=False)
    else:
        order = 0
    context = {
        "user_profile": user_profile,
        "all_items": order
    }

    return render(request, 'main/home_for_user.html', context)

def home_for_shop(request,user_profile):

    user_profile = GeneralUser.objects.get(user=request.user)
    context={}
    context["user_profile"] = user_profile
    return render(request, 'main/home_for_shop.html', context)
# else:
#     raise Http404


# if nega_accesso_senza_profilo(request):
#     return HttpResponseRedirect(reverse('utenti:scelta_profilo_oauth'))

# context = {'base_template': 'main/base.html'}
# oaut_user = False
# if int(oid) == int(request.user.pk):
#     user_profile = User.objects.filter(id=oid).first()
#     if user_profile.has_usable_password():
#         form = UserForm(data=request.POST or None, instance=request.user, oauth_user=0)
#     else:
#         form = UserForm(data=request.POST or None, instance=request.user, oauth_user=1)
#         oaut_user = True
#
#     profile = Profile.objects.filter(user=user_profile.pk).first()
#
#     if not profile.pet_sitter:
#         profile_form = UtenteNormaleForm(data=request.POST or None, instance=profile, files=request.FILES)
#     else:
#         profile_form = UtentePetSitterForm(data=request.POST or None, instance=profile, files=request.FILES)
#
#     if form.is_valid() and profile_form.is_valid():
#
#         if not oaut_user:
#             if form.cleaned_data['password'] != form.cleaned_data['conferma_password']:
#                 context.update({'form': form})
#                 context.update({'profileForm': profile_form})
#                 context.update({'error_message': 'Errore: le due password inserite non corrispondono'})
#
#                 return render(request, 'utenti/modifica_profilo.html', context)
#
#         profile.latitudine, profile.longitudine = calcola_lat_lon(request, profile)
#
#         user = form.save(commit=False)
#         if not oaut_user:
#             password = form.cleaned_data['password']
#             user.set_password(password)
#         form.save()
#         profile_form.save()
#         if not oaut_user:
#             user = authenticate(username=form.cleaned_data['username'], password=form.cleaned_data['password'])
#
#         if user is not None:
#             if user.is_active:
#                 if not oaut_user:
#                     login(request, user)
#                 return HttpResponseRedirect(reverse('main:index'))
#     else:
#         try:
#             if User.objects.exclude(pk=request.user.id).get(username=form['username'].value()):
#                 context.update({'form': form})
#                 context.update({'profileForm': profile_form})
#                 context['user_profile'] = profile
#
#                 return render(request, 'utenti/modifica_profilo.html', context)
#         except User.DoesNotExist:
#             # Nessun utente trovato con questo username --> username valido
#             pass
#
#         if oaut_user:
#             form = UserForm(instance=request.user, oauth_user=1)
#         else:
#             form = UserForm(instance=request.user, oauth_user=0)
#
#         if not profile.pet_sitter:
#             profile_form = UtenteNormaleForm(instance=profile)
#         else:
#             profile_form = UtentePetSitterForm(instance=profile)
#
#     context.update({'form': form})
#     context.update({'profileForm': profile_form})
#     context['user_profile'] = profile
#
#     return render(request, 'utenti/modifica_profilo.html', context)
#
# else:
#     raise Http404

@login_required(login_url='/users/login')
def logout_user(request):
    # [modifica] creare un pop-up in JS della durata di 2-3 secondi che mostri il nome dell'utente che si è disconnesso
    # nel mentre caricare la pagina principale invece che la pagina con la scritta

    """
    Permette agli utenti di effettuare il logout.

    :param request: request utente.
    :return: render della pagina principale.
    """

    # if nega_accesso_senza_profilo(request):
    #     return HttpResponseRedirect(reverse('utenti:scelta_profilo_oauth'))
    username = request.user.username
    logout(request)
    # return HttpResponseRedirect(reverse('main:index'))

    messages.success(request,"Logout di " + username + " effettuato con successo" )
    return render(request, 'main/home.html')
    #return HttpResponse("Logout di " + username + " effettuato con successo")


def compute_position(profile):
    """
    [modifica] creare una funzione per similarità tra stringhe e scegliere il valore di CAP che più si avvicina

    Thanks to an external API we are able to find the latitude and longitude of a user and to compute
    the distance user-store.
    In order to be very precise we must insert these parameters --> street, city, state, postalCode
    for clarification see --> https://developer.mapquest.com/documentation/common/forming-locations/#singleLineLocations
    :param profile: user profilo.
    """
    mykey = '5EIZ4tvrnyP3cOOMXpKoGlQ0bo92YoM3'

    get_latlong = requests.get('https://www.mapquestapi.com/geocoding/v1/address?'
                               + 'key=5EIZ4tvrnyP3cOOMXpKoGlQ0bo92YoM3&location=' + profile.indirizzo.replace("/", "")
                               + ',' + profile.citta.replace("/", "") + ',' + profile.stato.replace("/", "") +
                               ',' + profile.codice_postale.replace("/", ""))

    response_get_JSON = get_latlong.json()

    possibili_indirizzi = len(response_get_JSON['results'][0]['locations'])
    postalCode = profile.codice_postale
    postalCode_1 = str(int(postalCode)+1)
    postalCode_0 = str(int(postalCode)-1)


    # se trovo il valore corrispondente al cap lo ritorno, altrimenti ne ritorno uno anche se non corretto
    for i in range(possibili_indirizzi):
        if response_get_JSON['results'][0]['locations'][i]['postalCode'] == postalCode:
            return response_get_JSON['results'][0]['locations'][i]['latLng']["lat"], \
                   response_get_JSON['results'][0]['locations'][i]['latLng']["lng"]

    # cerco l'indirizzo inerente a un CAP con una approssimazione di un valore, es dato 41125 cerco 41124 e 41123
    for i in range(possibili_indirizzi):
        if response_get_JSON['results'][0]['locations'][i]['postalCode'] == postalCode or \
                response_get_JSON['results'][0]['locations'][i]['postalCode'] == postalCode_1 or \
                response_get_JSON['results'][0]['locations'][i]['postalCode'] == postalCode_0:
            return response_get_JSON['results'][0]['locations'][i]['latLng']["lat"], \
                   response_get_JSON['results'][0]['locations'][i]['latLng']["lng"]

    return response_get_JSON['results'][0]['locations'][0]['latLng']["lat"], \
        response_get_JSON['results'][0]['locations'][0]['latLng']["lng"]



@login_required(login_url='/users/login')
def modify_profile(request):
    shop_or_user = GeneralUser.objects.get(user=request.user)
    user = User.objects.get(pk=request.user.pk)
    form = UserForm(data=request.POST or None, instance=user, oauth_user=0)

    if shop_or_user.login_negozio:
        form_user_or_shop = ShopProfileForm(request.POST or None, instance=shop_or_user)
    else:
        form_user_or_shop = NormalUserForm(request.POST or None, instance=shop_or_user)

    if form_user_or_shop.is_valid() and form.is_valid():
        # entro se l'username non è già presente o se è già presente e coincide con l'userneme di chi è loggato
        if not User.objects.filter(username=form.cleaned_data['username']).exists() or \
                form.cleaned_data['username'] == request.user.username:

            # se non creo questo oggetto non ci sarà differenza tra i campi dell'oggetto e i form
            shop_or_user2 = GeneralUser.objects.get(user=request.user)

            if shop_or_user.login_negozio:
                set_shop_info(shop_or_user2, form_user_or_shop)
            else:
                set_user_info(shop_or_user2, form_user_or_shop)

            user_form = form.save(commit=False)
            password = form.cleaned_data['password']
            user_form.set_password(password)
            user_form.save()

            if shop_or_user is not None:
                if user.is_active:
                    login(request, user)
                    return HttpResponseRedirect(reverse('index'))

    context = {
        "form": form,
        "form_user_or_shop": form_user_or_shop,
    }

    return render(request, 'users/modify_profile.html', context)

@login_required(login_url='/users/login')
def modify_shop(request,user_profile):
    user = GeneralUser.objects.get(user=request.user)
    user_basic = User.objects.get(pk=request.user.pk)
    form_for_username = UserForm(data=request.POST or None, instance=user_basic, oauth_user=1)
    # if form.is_valid() and \
    #         not User.objects.filter(username=form.cleaned_data['username']).exists():
    #     shop = form.save(commit=False)
    #     username = form.cleaned_data['username']
    #     password = form.cleaned_data['password']
    #     shop.set_password(password)
    #     shop.save()

    if user.login_negozio:
        form = ShopProfileForm(request.POST or None, instance=user)
    else:
        form = NormalUserForm(request.POST or None, instance=user)

    if form.is_valid() and form_for_username.is_valid() and user.login_negozio:
        set_shop_info(user, form)

        return HttpResponseRedirect(reverse('index'))

    elif form.is_valid() and not user.login_negozio:
        set_user_info(user, form)
        return HttpResponseRedirect(reverse('index'))

    context = {
        "form_for_username": form_for_username,
        "form": form,
        "user_profile":user,
    }

    return render(request, 'users/modify_shop.html', context)

def set_shop_info(shop_profile, shopform):
    """
    Se questa funzione viene chiamata quando devo registrare un nuovo utente allora salverò le info dell'utente,
    se viene chiamata quando devo modificare le info di un utente allora controllo se devo calcolare nuovamente
    le coordinate geografiche o se sono rimaste invariate

    :param shop_profile: profilo del negozio
    :param shopform: form relative al profilo negozio
    :return: i valori vengono salvati nel database quindi non ho bisogno di ritornare niente
    """

    shop_profile.stato = 'Italia'

    # se uno di questi valori è cambiato allora calcolo nuovamente anche le coordinate geografiche
    if shop_profile.indirizzo != shopform.cleaned_data['indirizzo'] or \
            shop_profile.citta != shopform.cleaned_data['citta'] or \
            shop_profile.codice_postale != shopform.cleaned_data['codice_postale']:

        shop_profile.indirizzo = shopform.cleaned_data['indirizzo']
        shop_profile.citta = shopform.cleaned_data['citta']
        shop_profile.codice_postale = shopform.cleaned_data['codice_postale']
        shop_profile.latitudine, shop_profile.longitudine = compute_position(shop_profile)

    shop_profile.regione = shopform.cleaned_data['regione']
    shop_profile.provincia = shopform.cleaned_data['provincia']
    shop_profile.telefono = shopform.cleaned_data['telefono']
    shop_profile.descrizione = shopform.cleaned_data['descrizione']
    shop_profile.login_negozio = True
    shop_profile.save()


def set_user_info(general_user, normalform):
    """
    Vedi funzione set_shop_info
    :param general_user:
    :param normalform:
    :return:
    """
    general_user.stato = 'Italia'
    if general_user.indirizzo != normalform.cleaned_data['indirizzo'] or \
            general_user.citta != normalform.cleaned_data['citta'] or \
            general_user.codice_postale != normalform.cleaned_data['codice_postale']:

        general_user.stato = 'Italia'
        general_user.indirizzo = normalform.cleaned_data['indirizzo']
        general_user.citta = normalform.cleaned_data['citta']
        general_user.codice_postale = normalform.cleaned_data['codice_postale']
        general_user.latitudine, general_user.longitudine = compute_position(general_user)

    general_user.stato = 'Italia'
    general_user.provincia = normalform.cleaned_data['provincia']
    general_user.regione = normalform.cleaned_data['regione']
    # general_user.telefono = normalform.cleaned_data['telefono']
    # general_user.data_nascita = normalform.cleaned_data['data_nascita']
    # general_user.eta = normalform.cleaned_data['eta']
    # general_user.sesso = normalform.cleaned_data['sesso']
    general_user.descrizione = normalform.cleaned_data['descrizione']

    general_user.save()















