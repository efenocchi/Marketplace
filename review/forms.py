from django.forms import ModelForm
from django.core.exceptions import ValidationError
from django.utils.translation import ugettext_lazy as _
import re
from items.models import OrderItem
from . import models
from django import forms


class ReviewItemForm(ModelForm):
    # per formattazione errori e richieste (vedi documentazione Django)
    required_css_class = 'required'

    class Meta:
        model = models.ReviewItem
        fields = [
            'title_of_comment',
            'description',
            'rating'
        ]

    def __init__(self, *args, **kwargs):
        reviewed = kwargs.pop('reviewed')
        super(ReviewItemForm, self).__init__(*args, **kwargs)
        if reviewed:
            self.fields['title_of_comment'].widget.attrs['readonly'] = True
            self.fields['description'].widget.attrs['readonly'] = True
            self.fields['rating'].widget.attrs['readonly'] = True

    def clean_title_of_comment(self):
        if not re.match("^[A-Za-z0-9., 'èòàùì]+$", self.cleaned_data['title_of_comment']):
            raise ValidationError(_('Errore: il campo titolo può contenere solo lettere e numeri.'))
        if not (3 <= len(self.cleaned_data['title_of_comment']) <= 50):
            raise ValidationError(_('Errore: il campo titolo deve avere lunghezza fra 3 e 50 caratteri.'))
        return self.cleaned_data['title_of_comment']

    def clean_description(self):
        # controllo descrizione
        if not re.match("^[A-Za-z0-9., 'èòàùì]+$", self.cleaned_data['description']):
            raise ValidationError(
                _('Errore: il campo descrizione può contenere solo lettere, numeri, punti, virgole e spazi.'))
        if not (3 <= len(self.cleaned_data['description']) <= 50):
            raise ValidationError(_('Errore: il campo descrizione deve avere lunghezza fra 3 e 50 caratteri.'))
        return self.cleaned_data['description']


class ReviewShopForm(ModelForm):
    # per formattazione errori e richieste (vedi documentazione Django)
    required_css_class = 'required'

    class Meta:
        model = models.ReviewShop
        fields = [
            'title_of_comment',
            'description',
            'rating'
        ]

    def clean_title_of_comment(self):
        if not re.match("^[A-Za-z0-9., 'èòàùì]+$", self.cleaned_data['title_of_comment']):
            raise ValidationError(_('Errore: il campo titolo può contenere solo lettere e numeri.'))
        if not (3 <= len(self.cleaned_data['title_of_comment']) <= 50):
            raise ValidationError(_('Errore: il campo titolo deve avere lunghezza fra 3 e 50 caratteri.'))
        return self.cleaned_data['title_of_comment']

    def clean_description(self):
        # controllo descrizione
        if not re.match("^[A-Za-z0-9., 'èòàùì]+$", self.cleaned_data['description']):
            raise ValidationError(
                _('Errore: il campo descrizione può contenere solo lettere, numeri, punti, virgole e spazi.'))
        if not (3 <= len(self.cleaned_data['description']) <= 50):
            raise ValidationError(_('Errore: il campo descrizione deve avere lunghezza fra 3 e 50 caratteri.'))
        return self.cleaned_data['description']

class ReviewCustomerForm(ModelForm):
    # per formattazione errori e richieste (vedi documentazione Django)
    required_css_class = 'required'

    class Meta:
        model = models.ReviewCustomer
        fields = [
            'title_of_comment',
            'description',
            'rating'
        ]

    def __init__(self, *args, **kwargs):
        reviewed = kwargs.pop('reviewed')
        super(ReviewCustomerForm, self).__init__(*args, **kwargs)
        if reviewed:
            self.fields['title_of_comment'].widget.attrs['readonly'] = True
            self.fields['description'].widget.attrs['readonly'] = True
            self.fields['rating'].widget.attrs['readonly'] = True

    def clean_title_of_comment(self):
        if not re.match("^[A-Za-z0-9., 'èòàùì]+$", self.cleaned_data['title_of_comment']):
            raise ValidationError(_('Errore: il campo titolo può contenere solo lettere e numeri.'))
        if not (3 <= len(self.cleaned_data['title_of_comment']) <= 50):
            raise ValidationError(_('Errore: il campo titolo deve avere lunghezza fra 3 e 50 caratteri.'))
        return self.cleaned_data['title_of_comment']

    def clean_description(self):
        # controllo descrizione
        if not re.match("^[A-Za-z0-9., 'èòàùì]+$", self.cleaned_data['description']):
            raise ValidationError(
                _('Errore: il campo descrizione può contenere solo lettere, numeri, punti, virgole e spazi.'))
        if not (3 <= len(self.cleaned_data['description']) <= 50):
            raise ValidationError(_('Errore: il campo descrizione deve avere lunghezza fra 3 e 50 caratteri.'))
        return self.cleaned_data['description']
