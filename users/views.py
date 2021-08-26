from django.contrib.auth import authenticate, login
from django.contrib.auth import logout
from django.contrib.auth.models import User
from django.http import HttpResponseRedirect, HttpResponse
from django.shortcuts import render, get_object_or_404
# Create your views here.
from django.http import Http404
from django.urls import reverse
from django.contrib.auth.decorators import login_required, user_passes_test
from django.forms import modelformset_factory

from users.forms import NormalUserForm, UserForm, ShopProfileForm
from .models import NormalUser, ShopProfile
from . import models
from . import forms
import requests
import tkinter as tk

def index(request):
    return render(request, 'users/home.html')    #pagina sito con barra di ricerca


#le views nelle funzioni sono ancora collegate a caso tra le pagine html esistenti solo per vedere se funzionavano le funzioni
def login_all(request):
    """
    Permette agli utenti di effettuare il login.

    :param request: request utente.
    :return: render della pagina login.
    """

    if not request.user.is_authenticated:
        if request.method == "POST":
            username = request.POST['username']
            password = request.POST['password']
            user = authenticate(username=username, password=password)
            if user is not None:
                if user.is_active:
                    login(request, user) #[modifica]invece che loggare direttamente, creare un pop-up che avvisi l'utente che può loggarsi
                                    # mostrare quindi la pagina principale, evitando di loggare in automatico
                    #controllo se ha fatto l'accesso un utente normale o un negozio
                    return HttpResponse("L'utente " + request.user.username + " si è loggato con successo")
 
                else:
                    return render(request, 'users/login_page.html', {'error_message': 'Il tuo account è stato disattivato'})
            else:
                return render(request, 'users/login_page.html', {'error_message': 'Login invalido'})
        return render(request, 'users/login_page.html')
    else:
        return render(request, 'users/login_page.html', {'error_message': 'Immettere un utente e una password validi'})


# def registration(request):
#     """
#     Permette agli utenti di registrarsi al sito.
#
#     :param request: request utente.
#     :return: render della pagina di registrazione o redirect a pagina principale.
#     """
#
#     if not request.user.is_authenticated:
#         base_template = 'main/contact.html'
#         return render(request, 'users/contact.html', {'base_template': base_template})
#     else:
#         return HttpResponseRedirect(reverse('main:index'))

#uguale alla registrazione dell'utente, se non cambia niente in futuro se ne può lasciare solo una
def shop_registration(request):
    form = UserForm(request.POST or None, oauth_user=0)
    if form.is_valid() and \
            not User.objects.filter(username=form.cleaned_data['username']).exists():
        shop = form.save(commit=False)
        username = form.cleaned_data['username']
        password = form.cleaned_data['password']
        shop.set_password(password)
        shop.save()

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

        # profile = NormalUser.objects.get_or_create(user=user)[0]

        # print(profile)
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


@login_required(login_url='/login')     #aggiungere il controllo che sia un negozio e non un utente
def insert_shop_info(request):
    """
    [modifica]
1)    Creare anche la funzione edit profile, questa viene chiamata dopo il login
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
        profile = ShopProfile.objects.get_or_create(user=request.user)[0]
        try:
            profile.foto_profilo = request.FILES['foto_profilo']
        except Exception:
            profile.foto_profilo = None

        profile.indirizzo = shopform.cleaned_data['indirizzo']
        profile.citta = shopform.cleaned_data['citta']
        profile.provincia = shopform.cleaned_data['provincia']
        profile.regione = shopform.cleaned_data['regione']
        profile.descrizione = shopform.cleaned_data['descrizione']

        profile.latitudine, profile.longitudine = compute_distance(request, profile)
        profile.save()

        return HttpResponse("Login effettuato con successo dall'utente: " + request.user.username +
                            ' che abita in via: ' + profile.indirizzo)
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

@login_required(login_url='/login')
def insert_user_info(request):
    """
    [modifica]
1)    Creare anche la funzione edit profile, questa viene chiamata dopo il login
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
    # if user_profile.has_usable_password():  # se la password è valida
    #     form = UserForm(data=request.POST or None, instance=request.user, oauth_user=0)
    # else:
    #     form = UserForm(data=request.POST or None, instance=request.user, oauth_user=1)
    #     oaut_user = True

    form = UserForm(data=request.POST or None, instance=user_profile, oauth_user=1)
    normalform = NormalUserForm(request.POST or None, request.FILES or None)

    if normalform.is_valid():
        print("normal form validi")
        profile = NormalUser.objects.get_or_create(user=request.user)[0]
        try:
            profile.foto_profilo = request.FILES['foto_profilo']
        except Exception:
            profile.foto_profilo = None

        profile.indirizzo = normalform.cleaned_data['indirizzo']
        profile.citta = normalform.cleaned_data['citta']
        profile.provincia = normalform.cleaned_data['provincia']
        profile.regione = normalform.cleaned_data['regione']
        # profile.telefono = normalform.cleaned_data['telefono']
        # profile.data_nascita = normalform.cleaned_data['data_nascita']
        # profile.eta = normalform.cleaned_data['eta']
        # profile.sesso = normalform.cleaned_data['sesso']
        profile.descrizione = normalform.cleaned_data['descrizione']

        profile.latitudine, profile.longitudine = compute_distance(request, profile)
        profile.save()

        return HttpResponse("Login effettuato con successo dall'utente: " + request.user.username +
                            ' che abita in via: ' + profile.indirizzo)
        # return HttpResponseRedirect(reverse('users:prova_passaggio_interi', kwargs={'oid':request.user.pk}))
    else:
        print("normal form NON validi")
    context = {
        "form": form,
        "profileForm": normalform,
    }


    # return render(request, 'users/'+ str(oid) +'/insert_info.html', context)
    return render(request, 'users/insert_info.html', context)

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

@login_required(login_url='/login')
def logout_user(request):           # [modifica] creare un pop-up in JS della durata di 2-3 secondi che mostri il nome dell'utente che si è disconnesso
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
    return HttpResponse("Logout di " + username + " effettuato con successo")



def compute_distance(request, profile):
    """
    Thanks to an external API we are able to find the latitude and longitude of a user and to compute
    the distance user-store.

    :param profile: user profilo.
    """
    mykey = '5EIZ4tvrnyP3cOOMXpKoGlQ0bo92YoM3'

    get_latlong = requests.get('https://open.mapquestapi.com/geocoding/v1/address?'
                            + 'key=5EIZ4tvrnyP3cOOMXpKoGlQ0bo92YoM3&location=' + profile.indirizzo.replace("/", "")
                            + ',' + profile.citta.replace("/", "") + ',' + profile.provincia.replace("/", "") +
                            ',' + profile.regione.replace("/", ""))
    latLong = get_latlong.json()
    return latLong['results'][0]['locations'][0]['latLng']["lat"], \
        latLong['results'][0]['locations'][0]['latLng']["lng"]
