from django.contrib.auth import authenticate, login
from django.contrib.auth import logout
from django.http import HttpResponseRedirect
from django.shortcuts import render
# Create your views here.
from django.urls import reverse

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