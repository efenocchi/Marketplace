import threading
from math import radians, sin, cos, atan2, sqrt

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
from .models import GeneralUser
from . import models
from . import forms
import requests



def index(request):
    return render(request, 'users/home.html')  # pagina sito con barra di ricerca


# le views nelle funzioni sono ancora collegate a caso tra le pagine html esistenti solo per vedere se funzionavano le funzioni

def login_all(request):
    """
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

        user_profile.indirizzo = shopform.cleaned_data['indirizzo']
        set_shop_info(shop_profile, shopform)
        return HttpResponse("Login effettuato con successo dall'utente: " + request.user.username +
                            ' che abita in via: ' + shop_profile.indirizzo)
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
        return HttpResponse("Login effettuato con successo dall'utente: " + request.user.username +
                            ' che abita in via: ' + general_user.indirizzo)
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
    return HttpResponse("Logout di " + username + " effettuato con successo")


def compute_position(profile):
    """
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

    latLong = get_latlong.json()

    return latLong['results'][0]['locations'][0]['latLng']["lat"], \
           latLong['results'][0]['locations'][0]['latLng']["lng"]


def isUser(user):
    general_user = GeneralUser.objects.get(user=user)
    return not general_user.login_negozio


@login_required(login_url='/users/login')
@user_passes_test(isUser)
def show_distance_shops(request):

    """
    Ordina gli annunci per distanza geografica secondo la selezione fatta dall'utente.
    Il calcolo risultante permette di considerare la distanza tra due punti espressa in km.

    :param ordina: indica se l'ordinamento deve essere crescente, decrescente o non ordinare.
    :return: indici degli annunci ordinati.

    """

    general_user = GeneralUser.objects.get(user=request.user)

    parameters = []

    shops = GeneralUser.objects.filter(login_negozio=True)
    print(shops)
    # metto tutti i valori tranne il primo, li aggiorno e metto in testa il primo
    for shop in shops:
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
    id_univoci = []
    # raggio della terra approssimato
    r = 6371.0

    lat1 = radians(lat_shop)
    lon1 = radians(lng_shop)

    # Calcola le distanze di tutti gli annunci
    for i, shop in enumerate(shops):
        indici.append(i)
        shop_profile = GeneralUser.objects.filter(user=shop.user).first()

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
        id_univoci.append(shop.user)
    # Ordina in base all'order param
    # if ordina == 'crescente':
    #     distanze, indici = (list(t) for t in zip(*sorted(zip(distanze, indici))))
    #
    # if ordina == 'decrescente':
    #     distanze, indici = (list(t) for t in zip(*sorted(zip(distanze, indici), reverse=True)))

    #adesso ho tutto ordinato
    distanze, indici = (list(t) for t in zip(*sorted(zip(distanze, indici))))
    _, id_univoci = (list(t) for t in zip(*sorted(zip(distanze, id_univoci))))
    _, parameters = (list(t) for t in zip(*sorted(zip(distanze, parameters))))

    # return indici
    print(distanze)
    print(indici)

    complete_parameters = parameters[:]
    complete_parameters.insert(0, general_user.indirizzo.replace("/", "") + ',' + general_user.citta.replace("/", "") + ','
                              + general_user.stato.replace("/", "") + ',' + general_user.codice_postale.replace("/", ""))

    # Creo il dizionario che utilizzerò con per le richieste POST nella funzione successiva e
    # inserisco anche l'indirizzo dell'utente (oltre a quello dei negozi)
    complete_parameters = {
        'locations':
            complete_parameters

    }

    #inserisco anche l'identificatore univoco dell'utente
    id_univoci.insert(0, request.user)
    print('id_univoci', id_univoci)
    # t = threading.Thread(target=computeTime, args=[id_univoci, complete_parameters], daemon=True)
    # t.start()
    computeTime(id_univoci, complete_parameters)
    return HttpResponse(distanze, indici)


def computeTime(id_univoci, complete_parameters):
    """"
    Passo gli identificativi univoci dei negozi più vicini e in base a questo filtro mostro i prodotti richiesti

    :param locations: è un elenco di indirizzi in cui il primo è quello dell'utente e
                        gli altri sono quelli dei negozi più vicini in linea d'aria
    :param id_univoci: sono gli id univoci dell'utente e dei negozi a lui vicini in linea d'aria
    """

    print('complete parameters \n', complete_parameters)
    #se voglio posso iterare sull'oggetto e tenere solo alcuni negozi da mostrare, altrimenti posso fare la ricerca
    #di tutte le distanze utente-negozio

    response = requests.post(
        "http://www.mapquestapi.com/directions/v2/routematrix?key=5EIZ4tvrnyP3cOOMXpKoGlQ0bo92YoM3", json=complete_parameters)
    response_post_JSON = response.json()

    # arrotondo al minuto successivo a meno che la posizione non sia la stessa
    time = [(float(x) + 59) // 60 for x in response_post_JSON['time']]
    # time = (time + 0.5) // 60
    print(response_post_JSON)
    print(response_post_JSON['distance'])
    print(response_post_JSON['time'])
    print(time)


@login_required(login_url='/users/login')
def modify_profile(request):

    shop_or_user = GeneralUser.objects.get(user=request.user)
    user = User.objects.get(pk=request.user.pk)
    form = UserForm(data=request.POST or None, instance=user, oauth_user=0)


    # if form.is_valid() and \
    #         not User.objects.filter(username=form.cleaned_data['username']).exists():
    #     shop = form.save(commit=False)
    #     username = form.cleaned_data['username']
    #     password = form.cleaned_data['password']
    #     shop.set_password(password)
    #     shop.save()

    if shop_or_user.login_negozio:
        form_user_or_shop = ShopProfileForm(request.POST or None, instance=shop_or_user)
    else:
        form_user_or_shop = NormalUserForm(request.POST or None, instance=shop_or_user)

    if form_user_or_shop.is_valid() and form.is_valid():
        # entro se l'username non è già presente o se è già presente e coincide con l'userneme di chi è loggato
        if not User.objects.filter(username=form.cleaned_data['username']).exists() or \
                form.cleaned_data['username'] == request.user.username:

            user_form = form.save(commit=False)
            password = form.cleaned_data['password']
            user_form.set_password(password)
            user_form.save()

            if shop_or_user.login_negozio:
                set_shop_info(shop_or_user, form_user_or_shop)
            else:
                set_user_info(shop_or_user, form_user_or_shop)

            if shop_or_user is not None:
                if user.is_active:
                    login(request, user)
                    return HttpResponseRedirect(reverse('index'))

    context = {
        "form": form,
        "form_user_or_shop": form_user_or_shop,
    }

    return render(request, 'users/modify_profile.html', context)


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















