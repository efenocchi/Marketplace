from django.http import Http404
from django.shortcuts import render
from .models import Item    #importo il modello così che possa utilizzalo, andrà a pescare gli Item dal db e conservarli in una variabile
from .forms import ItemForm

def item_page(request):

    #metto nella var all_items tutti gli oggetti item che ho nel db
    all_items = Item.objects.all()

    #faccio il render della pagina html item_page e le passo la var all_items
    #per farlo passo un dictionary chiamato all_items con valori presi dalla var sopra all_items
    #così la var all_items che contiene i dati estratti dal db verrà passata alla pagina html
    #item_page.html che potrà accedervi tramite la var all_items
    return render(request, 'items/item_page.html', {'all_items': all_items})

def buy_page(request, item_selected_id):
    print(item_selected_id)

    #seleziono prodotto con l'id passato dalla schermata
    item_selected = Item.objects.filter(id=item_selected_id).first()
    context = {}
    context['item_selected'] = item_selected
    print(context)
    return render(request, 'items/buy_page.html', context)

def modify_item(request, item_selected_id):
    print(request)

def delete_item(request, item_selected_id):
    #if nega_accesso_senza_profilo(request):
     #   return HttpResponseRedirect(reverse('utenti:scelta_profilo_oauth'))

    item_to_delete = Item.objects.filter(id=item_selected_id).first()

    if item_to_delete is not None: # and annuncio.user == request.user:
        Item.objects.filter(id=item_selected_id).first().image.delete(save=True)
        #if not annuncio.annuncio_petsitter:
         #   userprofile = Profile.objects.filter(user=request.user).first()
          #  userprofile.pet_coins = userprofile.pet_coins + item_to_delete.pet_coins
           # userprofile.save()

        Item.objects.filter(id=item_selected_id).delete()
        all_items = Item.objects.all()

        context = {}
        context = {"all_items": all_items}

        return render(request, 'items/item_page.html', context)

    raise Http404
