from django.contrib.auth import authenticate, login
from django.contrib.auth import logout
from django.contrib.sites import requests
from django.http import HttpResponseRedirect
from django.shortcuts import render
# Create your views here.
from django.urls import reverse
from django.contrib.auth.decorators import login_required, user_passes_test

#le views nelle funzioni sono ancora collegate a caso tra le pagine html esistenti solo per vedere se funzionavano le funzioni
def login_all(request):
    """
    Permette agli utenti di effettuare il login.

    :param request: request utente.
    :return: render della pagina login.
    """

    if not request.user.is_authenticated():
        if request.method == "POST":
            username = request.POST['username']
            password = request.POST['password']
            user = authenticate(username=username, password=password)
            if user is not None:
                if user.is_active:
                    login(request, user)
                    return HttpResponseRedirect(reverse('main:index'))
                else:
                    return render(request, 'main/login_page.html', {'error_message': 'Il tuo account è stato disattivato'})
            else:
                return render(request, 'main/login_page.html', {'error_message': 'Login invalido'})
        return render(request, 'main/login_page.html')
    else:
        return HttpResponseRedirect(reverse('main:index'))


def registration(request):
    """
    Permette agli utenti di registrarsi al sito.

    :param request: request utente.
    :return: render della pagina di registrazione o redirect a pagina principale.
    """

    if not request.user.is_authenticated():
        base_template = 'main/contact.html'
        return render(request, 'utenti/contact.html', {'base_template': base_template})
    else:
        return HttpResponseRedirect(reverse('main:index'))

@login_required(login_url='/login')
def test_login(request):
        return render(request, 'users/checkLogin.html')


# @login_required(login_url='/users/login/')
# def edit_profile(request, oid):
#     """
#     Permette agli utenti di modificare il proprio profilo, cambiando i loro dati.
#
#     :param request: request utente.
#     :param oid: id dell'utente di cui si vuole modificare il profilo (con controllo che sia == all'id
#     dell'utente loggato).
#     :return: render pagina modifica profilo o errore 404.
#     """


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

@login_required(login_url='/utenti/login/')
def logout_user(request):

    """
    Permette agli utenti di effettuare il logout.

    :param request: request utente.
    :return: render della pagina principale.
    """

    # if nega_accesso_senza_profilo(request):
    #     return HttpResponseRedirect(reverse('utenti:scelta_profilo_oauth'))

    logout(request)
    return HttpResponseRedirect(reverse('main:index'))




def compute_distance(request, profile):
    """
    Thanks to an external API we are able to find the latitude and longitude of a user and to compute
    the distance user-store.

    :param profile: user profilo.
    """
    mykey = '5EIZ4tvrnyP3cOOMXpKoGlQ0bo92YoM3'
    get_latlong = requests.get('https://open.mapquestapi.com/geocoding/v1/address?'
                            
                            'key=5EIZ4tvrnyP3cOOMXpKoGlQ0bo92YoM3&location=' + profile.indirizzo.replace("/", "")
                            + ',' + profile.citta.replace("/", "") + ',' + profile.provincia.replace("/", "") +
                            ',' + profile.regione.replace("/", ""))
    latLong = get_latlong.json()
    return latLong['results'][0]['locations'][0]['latLng']["lat"], \
        latLong['results'][0]['locations'][0]['latLng']["lng"]
