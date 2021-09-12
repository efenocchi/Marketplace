from django import forms
from .models import Item
from datetime import datetime
from django.core.exceptions import ValidationError
from django.utils.translation import ugettext_lazy as _
import re
#import magic

MIME_TYPES = ['image/jpeg', 'image/png']


class ItemForm(forms.ModelForm):
    required_css_class = 'required'
    name = forms.CharField(max_length=95)
    price = forms.IntegerField()
    choice_category = (('Abbigliamento', 'Abbigliamento'), ('Tecnologia', 'Tecnologia'), ('Sport', 'Sport'),
                       ('Casa', 'Casa'), ('Motori', 'Motori'))
    category = forms.ChoiceField(choices=choice_category)
    description = forms.CharField(widget=forms.Textarea)
    #data_inizio = forms.DateTimeField(input_formats=['%d/%m/%Y %H:%M'])
    #data_fine = forms.DateTimeField(input_formats=['%d/%m/%Y %H:%M'])
    image = forms.ImageField(required=False)

    class Meta:
        model = Item
        fields = ['name', 'price', 'category', 'description', 'image']

    # #CONTROLLO NAME ->OK
    # def clean_name(self):
    #     if not re.match("^[A-Za-z0-9 .,'èòàùì]+$", self.cleaned_data['name']):
    #         raise ValidationError(_('Errore: il "name" può contenere solo lettere, numeri e spazi.'))
    #     if not (1 <= len(self.cleaned_data['titolo']) <= 95):
    #         raise ValidationError(_('Errore: il "name" deve avere lunghezza fra 1 e 95 caratteri.'))
    #     return self.cleaned_data['name']
    #
    # #CONTROLLO PRICE -> OK
    # def clean_price(self):
    #     # controllo pet_coins
    #     if not re.match("^[0-9]+$", str(self.cleaned_data['price'])):
    #         raise ValidationError(_('Errore: il campo "price" può contenere solo numeri.'))
    #     if not (1 <= int(self.cleaned_data['pet_coins']) <= 1000):
    #         raise ValidationError(_('Errore: il valore di "price" deve essere compreso tra 1 e 1000.'))
    #     return self.cleaned_data['price']
    #
    # #CONTROLLO DESCRIZIONE -> OK
    # def clean_description(self):
    #     # controllo descrizione
    #     if not re.match("^[A-Za-z0-9 .,'èòàùì]+$", self.cleaned_data['description']):
    #         raise ValidationError(_('Errore: la "description" può contenere solo lettere, '
    #                                 'numeri, punti, virgole e spazi.'))
    #     if not (1 <= len(self.cleaned_data['description']) <= 245):
    #         raise ValidationError(_('Errore: il campo "description" deve avere lunghezza fra 1 e 245 caratteri.'))
    #     return self.cleaned_data['description']

    #CONTROLLO IMAGE -> OK

