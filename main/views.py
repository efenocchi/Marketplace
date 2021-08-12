from django.shortcuts import render
from django.http import HttpResponse

def index(request):
    return render(request, 'main/home.html')    #pagina principale del sito

#def handler404(request):
    #add something
    #return render(request, '404.html', status=404, context=context)

def login_page(request):
    return render(request, 'main/login_page.html')

def registration_page(request):
    return render(request, 'main/registration_page.html')

def empty_cart(request):
    return render(request, 'main/empty_cart.html')

def contact(request):
    return render(request, 'main/contact.html')
