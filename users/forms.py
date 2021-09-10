from django.contrib.auth.models import User
from django.forms import ModelForm
from django import forms
from . import models
from django.core.exceptions import ValidationError
from django.utils.translation import ugettext_lazy as _
import re
from .static import NamingList

# import magic

IMAGE_FILE_TYPES = ['png', 'jpg', 'jpeg']
MIME_TYPES = ['image/jpeg', 'image/png']
CONTENT_TYPES = ['image', 'video']
MAX_UPLOAD_SIZE = "5242880"


class UserForm(forms.ModelForm):
    required_css_class = 'required'
    # first_name = forms.CharField(max_length=30, label="Nome")
    # last_name = forms.CharField(max_length=30, label="Cognome")
    # email = forms.EmailField(max_length=254)
    password = forms.CharField(widget=forms.PasswordInput(attrs={'id': 'password'}))

    # conferma_password = forms.CharField(widget=forms.PasswordInput())

    # Il modello User è già creato da Django, esiste di default
    class Meta:
        model = User
        fields = ('username',
                  'password',
                  # 'conferma_password',
                  # 'first_name',
                  # 'last_name',
                  # 'email'
                  )

    def __init__(self, *args, **kwargs):
        oauth_user = kwargs.pop('oauth_user')
        super(UserForm, self).__init__(*args, **kwargs)
        if oauth_user == 1:
            del self.fields['password']
            # del self.fields['conferma_password']

    def clean_username(self):
        if not re.match("^[A-Za-z0-9]+$", self.cleaned_data['username']):
            return 'Errore: lo username può contenere solo lettere e numeri.'
        if not (3 <= len(self.cleaned_data['username']) <= 30):
            return 'Errore: lo username deve avere lunghezza fra 3 e 30 caratteri.'
        return self.cleaned_data['username']

    def clean_password(self):
        # controllo password
        if not re.match("^[A-Za-z0-9èòàùì]+$", self.cleaned_data['password']):
            raise ValidationError(_('Errore: la password può contenere solo lettere minuscole, maiuscole e numeri.'))
        if not (3 <= len(self.cleaned_data['password']) <= 20):
            raise ValidationError(_('Errore: la password deve avere lunghezza fra 3 e 20 caratteri.'))
        return self.cleaned_data['password']

    def clean_conferma_password(self):
        if not re.match("^[A-Za-z0-9èòàùì]+$", self.cleaned_data['conferma_password']):
            raise ValidationError(
                _('Errore: la conferma password può contenere solo lettere minuscole, maiuscole e numeri.'))
        if not (3 <= len(self.cleaned_data['conferma_password']) <= 20):
            raise ValidationError(_('Errore: la conferma password deve avere lunghezza fra 3 e 20 caratteri.'))
        return self.cleaned_data['conferma_password']

    def clean_first_name(self):
        if not re.match("^[A-Za-z 'èòàùì]+$", self.cleaned_data['first_name']):
            raise ValidationError(_('Errore: il nome può contenere solo lettere.'))
        if not (1 <= len(self.cleaned_data['first_name']) <= 30):
            raise ValidationError(_('Errore: il nome deve avere lunghezza fra 1 e 30 caratteri.'))
        return self.cleaned_data['first_name']

    def clean_last_name(self):
        # controllo cognome
        if not re.match("^[A-Za-z 'èòàùì]+$", self.cleaned_data['last_name']):
            raise ValidationError(_('Errore: il cognome può contenere solo lettere.'))
        if not (1 <= len(self.cleaned_data['last_name']) <= 30):
            raise ValidationError(_('Errore: il cognome deve avere lunghezza fra 1 e 30 caratteri.'))
        return self.cleaned_data['last_name']

    def clean_email(self):
        # controllo email
        if not (5 <= len(self.cleaned_data['email']) <= 50):
            raise ValidationError(_('Errore: la mail deve essere compresa gra 5 e 50 caratteri.'))
        return self.cleaned_data['email']


class NormalUserForm(ModelForm):
    # per formattazione errori e richieste (vedi documentazione Django)
    required_css_class = 'required'

    # scelta_sesso = (('Maschio', 'Maschio'), ('Femmina', 'Femmina'))
    # sesso = forms.ChoiceField(choices=scelta_sesso)
    # foto_profilo = forms.ImageField(required=False)
    regione = forms.ChoiceField(choices=NamingList.AnagraficaIstat.ListaRegioni)
    provincia = forms.ChoiceField(choices=NamingList.AnagraficaIstat.ListaProvince)

    class Meta:
        model = models.GeneralUser
        fields = [
            'indirizzo',
            'citta',
            'regione',
            'provincia',
            'codice_postale',
            # 'telefono',
            # 'data_nascita',
            # 'foto_profilo',
            # 'eta',
            # 'sesso',
            'descrizione'
        ]

    # def clean_indirizzo(self):
    #     # controllo indirizzo
    #     if not re.match("^[A-Za-z0-9/ 'èòàùì]+$", self.cleaned_data['indirizzo']):
    #         raise ValidationError(_('Errore: l\'indirizzo può contenere solo lettere, numeri e /.'))
    #     if not (3 <= len(self.cleaned_data['indirizzo']) <= 50):
    #         raise ValidationError(_('Errore: l\'indirizzo deve avere lunghezza fra 3 e 50 caratteri.'))
    #     return self.cleaned_data['indirizzo']
    #
    # def clean_citta(self):
    #     # controllo citta
    #     if not re.match("^[A-Za-z 'èòàùì]+$", self.cleaned_data['citta']):
    #         raise ValidationError(_('Errore: il campo città può contenere solo lettere.'))
    #     if not (3 <= len(self.cleaned_data['citta']) <= 50):
    #         raise ValidationError(_('Errore: la città deve avere lunghezza fra 3 e 50 caratteri.'))
    #     return self.cleaned_data['citta']
    #
    # def clean_provincia(self):
    #     # controllo provincia
    #     if not re.match("^[A-Za-z 'èòàùì]+$", self.cleaned_data['provincia']):
    #         raise ValidationError(_('Errore: il campo provincia può contenere solo lettere.'))
    #     if not (2 <= len(self.cleaned_data['provincia']) <= 50):
    #         raise ValidationError(_('Errore: la provincia deve avere lunghezza fra 2 e 50 caratteri.'))
    #     return self.cleaned_data['provincia']
    #
    # def clean_telefono(self):
    #     # controllo telefono
    #     if not re.match("^[0-9]+$", self.cleaned_data['telefono']):
    #         raise ValidationError(_('Errore: il telefono può contenere solo numeri.'))
    #     if not (3 <= len(self.cleaned_data['telefono']) <= 30):
    #         raise ValidationError(_('Errore: il telefono deve avere lunghezza fra 3 e 30 caratteri.'))
    #     return self.cleaned_data['telefono']

    # def clean_data_nascita(self):
    #     # controllo data nascita
    #     if not re.match("^[0-9]+$", self.cleaned_data['data_nascita']):
    #         raise ValidationError(('Errore: la data di nascita può contenere solo numeri.'))
    #     if not (8 <= len(self.cleaned_data['data_nascita']) <= 8):
    #         raise ValidationError(_('Errore: la data di nascita deve avere lunghezza 8 caratteri (dd-mm-yyyy).'))
    #     return self.cleaned_data['data_nascita']

    # def clean_foto_profilo(self):
    #     files = self.files.get('foto_profilo')
    #     if files is not None:
    #         file_size = files.size
    #         limit_MB = 5
    #         if file_size > limit_MB * 1024 * 1024:
    #             raise ValidationError("La dimensione massima per le immagini è %s MB" % limit_MB)
    #
    #         file_type = magic.from_buffer(files.read(), mime=True)
    #         if file_type not in MIME_TYPES:
    #             raise forms.ValidationError(_("file non supportato."))
    #         return files
    #     return None
    #
    # def clean_descrizione(self):
    #     # controllo descrizione
    #     if not re.match("^[A-Za-z0-9., 'èòàùì]+$", self.cleaned_data['descrizione']):
    #         raise ValidationError(
    #             _('Errore: il campo descrizione può contenere solo lettere, numeri, punti, virgole e spazi.'))
    #     if not (1 <= len(self.cleaned_data['descrizione']) <= 245):
    #         raise ValidationError(_('Errore: il campo descrizione deve avere lunghezza fra 1 e 245 caratteri.'))
    #     return self.cleaned_data['descrizione']
    #
    # def clean_eta(self):
    #     # controllo eta
    #     if not re.match("^[0-9]+$", str(self.cleaned_data['eta'])):
    #         raise ValidationError(_('Errore: l\'età può contenere solo numeri.'))
    #     if not (14 <= int(self.cleaned_data['eta']) <= 100):
    #         raise ValidationError(_('Errore: l\'età deve essere compresa fra 14 e 100.'))
    #     return self.cleaned_data['eta']
    #
    # def clean_descrizione(self):
    #     # controllo caratteristiche
    #     if not re.match("^[A-Za-z0-9., 'èòàùì]+$", self.cleaned_data['descrizione']):
    #         raise ValidationError(
    #             _('Errore: il campo descrizione può contenere solo lettere, numeri, punti, virgole e spazi.'))
    #     if not (1 <= len(self.cleaned_data['descrizione']) <= 245):
    #         raise ValidationError(_('Errore: il campo caratteristiche deve avere lunghezza fra 1 e 245 caratteri.'))
    #     return self.cleaned_data['descrizione']


class ShopProfileForm(ModelForm):
    # per formattazione errori e richieste (vedi documentazione Django)
    required_css_class = 'required'

    # scelta_sesso = (('Maschio', 'Maschio'), ('Femmina', 'Femmina'))
    # sesso = forms.ChoiceField(choices=scelta_sesso)
    # foto_profilo = forms.ImageField(required=False)
    regione = forms.ChoiceField(choices=NamingList.AnagraficaIstat.ListaRegioni)
    provincia = forms.ChoiceField(choices=NamingList.AnagraficaIstat.ListaProvince)

    class Meta:
        model = models.GeneralUser
        fields = [
            'indirizzo',
            'citta',
            'regione',
            'provincia',
            'codice_postale',
            'telefono',
            # 'foto_profilo',
            'descrizione'
        ]
