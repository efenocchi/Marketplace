import magic
from django import forms
from .models import Item, WaitUser
from django.forms import ModelForm
from django.core.exceptions import ValidationError
from django.utils.translation import ugettext_lazy as _
import re

MIME_TYPES = ['image/jpeg', 'image/png']


class WaitUserForm(ModelForm):
    # email = forms.EmailField(max_length=100)
    email = forms.EmailField(widget=forms.Textarea(attrs={'cols': 20, 'rows': 1}))

    class Meta:
        model = WaitUser
        fields = ['email']

    def clean_email(self):
        if not (5 <= len(self.cleaned_data['email']) <= 100):
            raise ValidationError(_('Errore: la mail deve essere compresa gra 5 e 100 caratteri.'))
        return self.cleaned_data['email']


class ItemForm(ModelForm):
    required_css_class = 'required'
    name = forms.CharField(max_length=95)
    price = forms.FloatField()
    discount_price = forms.FloatField(required=True)
    choice_category = (('Abbigliamento', 'Abbigliamento'), ('Tecnologia', 'Tecnologia'), ('Sport', 'Sport'),
                       ('Casa', 'Casa'), ('Motori', 'Motori'))
    category = forms.ChoiceField(choices=choice_category)
    quantity = forms.IntegerField()
    description = forms.CharField(widget=forms.Textarea)
    #data_inizio = forms.DateTimeField(input_formats=['%d/%m/%Y %H:%M'])
    #data_fine = forms.DateTimeField(input_formats=['%d/%m/%Y %H:%M'])
    image = forms.ImageField(required=False)

    def __init__(self, *args, **kwargs):
        super(ItemForm, self).__init__(*args, **kwargs)
        self.fields['discount_price'].required = False

    class Meta:
        model = Item
        fields = ['name', 'price', 'discount_price', 'category', 'quantity', 'description', 'image']

    def clean_name(self):
        if not re.match("^[A-Za-z0-9 .,'èòàùì]+$", self.cleaned_data['name']):
            raise ValidationError(_('Errore: il nome può contenere solo lettere, numeri e spazi.'))
        if not (1 <= len(self.cleaned_data['name']) <= 95):
            raise ValidationError(_('Errore: il nome deve avere lunghezza fra 1 e 95 caratteri.'))
        return self.cleaned_data['name']

    def clean_price(self):
        if not (0 <= self.cleaned_data['price'] <= 10000000):
            raise ValidationError(_('Errore: inserire un prezzo valido.'))
        return self.cleaned_data['price']

    def clean_discount_price(self):
        print(self.cleaned_data['discount_price'])
        if self.cleaned_data['discount_price'] is not None:
            if not (0 <= self.cleaned_data['discount_price'] <= 10000000):
                raise ValidationError(_('Errore: inserire un prezzo valido.'))
        return self.cleaned_data['discount_price']

    def clean_description(self):
        # controllo descrizione
        if not re.match("^[A-Za-z0-9 .,'èòàùì]+$", self.cleaned_data['description']):
            raise ValidationError(_('Errore: la descrizione può contenere solo lettere, '
                                    'numeri, punti, virgole e spazi.'))
        if not (3 <= len(self.cleaned_data['description']) <= 50):
            raise ValidationError(_('Errore: la descrizione deve avere lunghezza fra 3 e 50 caratteri.'))
        return self.cleaned_data['description']

    def clean_quantity(self):
        if not re.match("^[0-9]+$", str(self.cleaned_data['quantity'])):
            raise ValidationError(_('Errore: inserire una quantità valida.'))
        return self.cleaned_data['quantity']

    def clean_image(self):
        files = self.files.get('image')
        if files is not None:
            file_size = files.size
            limit_MB = 5
            if file_size > limit_MB * 1024 * 1024:
                raise ValidationError("La dimensione massima per le immagini è %s MB" % limit_MB)
            file_type = magic.from_buffer(files.read(), mime=True)
            if file_type not in MIME_TYPES:
                raise forms.ValidationError(_("file non supportato."))
            return files
        return None
