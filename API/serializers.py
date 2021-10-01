import re
from django.utils.translation import ugettext_lazy as _

import magic
from django.core.exceptions import ValidationError
from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.validators import UnicodeUsernameValidator

from items.models import Order, OrderItem, Item
from review.models import ReviewCustomer, ReviewItem
from users.models import GeneralUser
from users.views import compute_position

MIME_TYPES = ['image/jpeg', 'image/png']


def updatePositionLatLong(user):
    utente_richiedente = GeneralUser.objects.get(user=user)
    latitudine, longitudine = compute_position(utente_richiedente)
    utente_richiedente.latitudine = latitudine
    utente_richiedente.longitudine = longitudine
    utente_richiedente.save()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        exclude = [
            "last_login",
            "is_superuser",
            "is_staff",
            "is_active",
            "date_joined",
            "groups",
            "user_permissions",
        ]
        read_only_fields = ["id"]
        extra_kwargs = {
            'username': {
                'validators': [UnicodeUsernameValidator()],
            }
        }

        def validate_username(self, data):
            if not re.match("^[A-Za-z0-9]+$", data):
                return serializers.ValidationError(
                    _('Errore: lo username può contenere solo lettere e numeri.'))
            if not (3 <= len(data) <= 30):
                return serializers.ValidationError(
                    _('Errore: lo username deve avere lunghezza fra 3 e 30 caratteri.'))
            return data['username']

        def validate_password(self, data):
            # controllo password
            if not re.match("^[A-Za-z0-9èòàùì]+$", data):
                raise serializers.ValidationError(
                    _('Errore: la password può contenere solo lettere minuscole, maiuscole e numeri.'))
            if not (3 <= len(data) <= 20):
                raise serializers.ValidationError(
                    _('Errore: la password deve avere lunghezza fra 3 e 20 caratteri.'))
            return data

        def validate_conferma_password(self, data):
            if not re.match("^[A-Za-z0-9èòàùì]+$", data):
                raise serializers.ValidationError(
                    _('Errore: la conferma password può contenere solo lettere minuscole, maiuscole e numeri.'))
            if not (3 <= len(data) <= 20):
                raise serializers.ValidationError(
                    _('Errore: la conferma password deve avere lunghezza fra 3 e 20 caratteri.'))
            return data

        def validate_first_name(self, data):
            if not re.match("^[A-Za-z 'èòàùì]+$", data):
                raise serializers.ValidationError(_('Errore: il nome può contenere solo lettere.'))
            if not (1 <= len(data) <= 30):
                raise ValidationError(_('Errore: il nome deve avere lunghezza fra 1 e 30 caratteri.'))
            return data

        def validate_last_name(self, data):
            # controllo cognome
            if not re.match("^[A-Za-z 'èòàùì]+$", data):
                raise serializers.ValidationError(_('Errore: il cognome può contenere solo lettere.'))
            if not (1 <= len(data) <= 30):
                raise serializers.ValidationError(_('Errore: il cognome deve avere lunghezza fra 1 e 30 caratteri.'))
            return data

        def validate_email(self, data):
            # controllo email
            if not (5 <= len(data) <= 50):
                raise serializers.ValidationError(_('Errore: la mail deve essere compresa gra 5 e 50 caratteri.'))
            return data


class CompleteShopData(serializers.ModelSerializer):
    user = UserSerializer(many=False)
    # numero_recensioni = serializers.SerializerMethodField("get_numero_recensioni_utente")
    # media_voti = serializers.SerializerMethodField("get_media_voti_utente")
    foto_profilo = serializers.FileField(read_only=True)

    class Meta:
        model = GeneralUser
        fields = ["user",
                  "indirizzo",
                  "citta",
                  "provincia",
                  "regione",
                  "codice_postale",
                  "stato",
                  "telefono",
                  # "data_nascita",
                  # "foto_profilo",
                  # "eta",
                  # "sesso",
                  "descrizione",
                  "login_negozio",
                  # "numero_recensioni",
                  # "media_voti",
                  ]


class CompleteUserData(serializers.ModelSerializer):
    user = UserSerializer(many=False)
    # numero_recensioni = serializers.SerializerMethodField("get_numero_recensioni_utente")
    # media_voti = serializers.SerializerMethodField("get_media_voti_utente")
    foto_profilo = serializers.FileField(read_only=True)

    class Meta:
        model = GeneralUser
        fields = ["user",
                  "indirizzo",
                  "citta",
                  "provincia",
                  "regione",
                  "codice_postale",
                  "stato",
                  "telefono",
                  "data_nascita",
                  "foto_profilo",
                  "eta",
                  "sesso",
                  "descrizione",
                  "login_negozio",
                  # "numero_recensioni",
                  # "media_voti",
                  ]

    def validate_indirizzo(self, data):
        # controllo indirizzo
        if not re.match("^[A-Za-z0-9/ 'èòàùì]+$", data):
            raise serializers.ValidationError(
                _('Errore: l\'indirizzo può contenere solo lettere, numeri e /.'))
        if not (3 <= len(data) <= 50):
            raise serializers.ValidationError(
                _('Errore: l\'indirizzo deve avere lunghezza fra 3 e 50 caratteri.'))
        return data

    def validate_citta(self, data):
        # controllo citta
        if not re.match("^[A-Za-z 'èòàùì]+$", data):
            raise serializers.ValidationError(
                _('Errore: il campo città può contenere solo lettere.'))
        if not (3 <= len(data) <= 50):
            raise serializers.ValidationError(
                _('Errore: la città deve avere lunghezza fra 3 e 50 caratteri.'))
        return data

    def validate_telefono(self, data):
        # controllo telefono
        if not re.match("^[0-9]+$", data):
            raise serializers.ValidationError(
                _('Errore: il telefono può contenere solo numeri.'))
        if not (3 <= len(data) <= 30):
            raise serializers.ValidationError(
                _('Errore: il telefono deve avere lunghezza fra 3 e 30 caratteri.'))
        return data

    def validate_foto_profilo(self, data):
        files = data

        if files is not None:
            file_size = files.size
            limit_MB = 5
            if file_size > limit_MB * 1024 * 1024:
                raise serializers.ValidationError("La dimensione massima per le immagini è %s MB" % limit_MB)

            file_type = magic.from_buffer(files.read(), mime=True)
            if file_type not in MIME_TYPES:
                raise serializers.ValidationError(_("file non supportato."))
            return files
        return None

    def validate_descrizione(self, data):
        # controllo descrizione
        if not re.match("^[A-Za-z0-9., 'èòàùì]+$", data):
            raise serializers.ValidationError(
                _('Errore: il campo descrizione può contenere solo lettere, numeri, punti, virgole e spazi.'))
        if not (1 <= len(data) <= 245):
            raise serializers.ValidationError(
                _('Errore: il campo descrizione deve avere lunghezza fra 1 e 245 caratteri.'))
        return data

    def validate_eta(self, data):
        # controllo eta
        if not re.match("^[0-9]+$", str(data)):
            raise serializers.ValidationError(_('Errore: l\'età può contenere solo numeri.'))
        if not (0 <= int(data) <= 100):
            raise serializers.ValidationError(_('Errore: l\'età deve essere compresa fra 0 e 100.'))
        return data

    # def get_media_voti_utente(self,profilo):
    #     # user = Profile.__class__.objects.get(user=self.instance)
    #     return calcolaMediaVotiUtente(profilo)
    #
    # def get_numero_recensioni_utente(self,profilo):
    #     # user = Profile.__class__.objects.get(user=self.instance)
    #     return calcolaNumeroVotiUtente(profilo)

    def update(self, instance, validated_data):

        dati_utente = validated_data.pop('user')
        utente_richiedente = GeneralUser.objects.get(user=instance.user)
        # username, first_name, last_name, email
        instance.user.username = dati_utente['username']
        instance.user.set_password(dati_utente['password'])
        # instance.user.first_name = dati_utente['first_name']
        # instance.user.last_name = dati_utente['last_name']
        # instance.user.email = dati_utente['email']

        instance.indirizzo = validated_data['indirizzo']
        instance.citta = validated_data['citta']
        instance.regione = validated_data['regione']
        instance.provincia = validated_data['provincia']
        # instance.descrizione = validated_data['descrizione']

        if not utente_richiedente.login_negozio:
            instance.login_negozio = False

        else:
            instance.pet_sitter = True
            instance.telefono = validated_data['telefono']

        instance.user.save()
        instance.save()
        updatePositionLatLong(instance.user)
        return instance


class CompletaDatiDjangoUser(serializers.ModelSerializer):
    class Meta:
        model = User
        exclude = [
            "last_login",
            "is_superuser",
            "is_staff",
            "is_active",
            "date_joined",
            "groups",
            "user_permissions",
        ]
        read_only_fields = ["id", "email", "username", "password"]

        def validate_first_name(self, data):
            if not re.match("^[A-Za-z 'èòàùì]+$", data):
                raise serializers.ValidationError(_('Errore: il nome può contenere solo lettere.'))
            if not (1 <= len(data) <= 30):
                raise ValidationError(_('Errore: il nome deve avere lunghezza fra 1 e 30 caratteri.'))
            return data

        def validate_last_name(self, data):
            # controllo cognome
            if not re.match("^[A-Za-z 'èòàùì]+$", data):
                raise serializers.ValidationError(_('Errore: il cognome può contenere solo lettere.'))
            if not (1 <= len(data) <= 30):
                raise serializers.ValidationError(_('Errore: il cognome deve avere lunghezza fra 1 e 30 caratteri.'))
            return data


class CompleteNormalUserData(serializers.ModelSerializer):
    user = CompletaDatiDjangoUser(many=False)
    foto_profilo = serializers.FileField(read_only=True)

    class Meta:
        model = GeneralUser
        exclude = ("latitudine",
                   "longitudine",
                   "id",
                   "descrizione",
                   )

    def validate_indirizzo(self, data):
        # controllo indirizzo
        if not re.match("^[A-Za-z0-9/ 'èòàùì]+$", data):
            raise serializers.ValidationError(
                _('Errore: l\'indirizzo può contenere solo lettere, numeri e /.'))
        if not (3 <= len(data) <= 50):
            raise serializers.ValidationError(
                _('Errore: l\'indirizzo deve avere lunghezza fra 3 e 50 caratteri.'))
        return data

    def validate_citta(self, data):
        # controllo citta
        if not re.match("^[A-Za-z 'èòàùì]+$", data):
            raise serializers.ValidationError(
                _('Errore: il campo città può contenere solo lettere.'))
        if not (3 <= len(data) <= 50):
            raise serializers.ValidationError(
                _('Errore: la città deve avere lunghezza fra 3 e 50 caratteri.'))
        return data

    def validate_telefono(self, data):
        # controllo telefono
        if not re.match("^[0-9]+$", data):
            raise serializers.ValidationError(
                _('Errore: il telefono può contenere solo numeri.'))
        if not (3 <= len(data) <= 30):
            raise serializers.ValidationError(
                _('Errore: il telefono deve avere lunghezza fra 3 e 30 caratteri.'))
        return data

    def validate_foto_profilo(self, data):
        files = data

        if files is not None:
            file_size = files.size
            limit_MB = 5
            if file_size > limit_MB * 1024 * 1024:
                raise serializers.ValidationError("La dimensione massima per le immagini è %s MB" % limit_MB)

            file_type = magic.from_buffer(files.read(), mime=True)
            if file_type not in MIME_TYPES:
                raise serializers.ValidationError(_("file non supportato."))
            return files
        return None

    def validate_caratteristiche(self, data):
        # controllo caratteristiche
        if not re.match("^[A-Za-z0-9., 'èòàùì]+$", data):
            raise serializers.ValidationError(
                _('Errore: il campo caratteristiche può contenere solo lettere, numeri, punti, virgole e spazi.'))
        if not (1 <= len(data) <= 245):
            raise serializers.ValidationError(
                _('Errore: il campo caratteristiche deve avere lunghezza fra 1 e 245 caratteri.'))
        return data

    def validate_descrizione(self, data):
        # controllo descrizione
        if not re.match("^[A-Za-z0-9., 'èòàùì]+$", data):
            raise serializers.ValidationError(
                _('Errore: il campo descrizione può contenere solo lettere, numeri, punti, virgole e spazi.'))
        if not (1 <= len(data) <= 245):
            raise serializers.ValidationError(
                _('Errore: il campo descrizione deve avere lunghezza fra 1 e 245 caratteri.'))
        return data

    def validate_eta(self, data):
        # controllo eta
        if not re.match("^[0-9]+$", str(data)):
            raise serializers.ValidationError(_('Errore: l\'età può contenere solo numeri.'))
        if not (0 <= int(data) <= 100):
            raise serializers.ValidationError(_('Errore: l\'età deve essere compresa fra 0 e 100.'))
        return data

    def update(self, instance, validated_data):
        dati_utente = validated_data.pop('user')
        # instance.user.first_name = dati_utente['first_name']
        # instance.user.last_name = dati_utente['last_name']
        instance.indirizzo = validated_data['indirizzo']
        instance.citta = validated_data['citta']
        instance.regione = validated_data['regione']
        instance.provincia = validated_data['provincia']
        instance.login_negozio = False
        instance.codice_postale = validated_data['codice_postale']
        instance.stato = 'Italia'  # [modifica] in un secondo momento andrà scelto dall'utente
        # instance.telefono =validated_data['telefono']
        # instance.eta = validated_data['eta']
        # instance.caratteristiche = validated_data['caratteristiche']
        instance.user.save()
        instance.save()
        # print(instance.user)
        # print("self.context['request']", self.context['request'])
        # updatePositionLatLong(instance.user, self.context['request'])
        updatePositionLatLong(instance.user)
        return instance


class CompleteShopUserData(serializers.ModelSerializer):
    user = CompletaDatiDjangoUser(many=False)
    foto_profilo = serializers.FileField(read_only=True)

    class Meta:
        model = GeneralUser
        exclude = ("latitudine",
                   "longitudine",
                   "id",
                   "descrizione",
                   )

    def validate_indirizzo(self, data):
        # controllo indirizzo
        if not re.match("^[A-Za-z0-9/ 'èòàùì]+$", data):
            raise serializers.ValidationError(
                _('Errore: l\'indirizzo può contenere solo lettere, numeri e /.'))
        if not (3 <= len(data) <= 50):
            raise serializers.ValidationError(
                _('Errore: l\'indirizzo deve avere lunghezza fra 3 e 50 caratteri.'))
        return data

    def validate_citta(self, data):
        # controllo citta
        if not re.match("^[A-Za-z 'èòàùì]+$", data):
            raise serializers.ValidationError(
                _('Errore: il campo città può contenere solo lettere.'))
        if not (3 <= len(data) <= 50):
            raise serializers.ValidationError(
                _('Errore: la città deve avere lunghezza fra 3 e 50 caratteri.'))
        return data

    def validate_telefono(self, data):
        # controllo telefono
        if not re.match("^[0-9]+$", data):
            raise serializers.ValidationError(
                _('Errore: il telefono può contenere solo numeri.'))
        if not (3 <= len(data) <= 30):
            raise serializers.ValidationError(
                _('Errore: il telefono deve avere lunghezza fra 3 e 30 caratteri.'))
        return data

    def validate_foto_profilo(self, data):
        files = data

        if files is not None:
            file_size = files.size
            limit_MB = 5
            if file_size > limit_MB * 1024 * 1024:
                raise serializers.ValidationError("La dimensione massima per le immagini è %s MB" % limit_MB)

            file_type = magic.from_buffer(files.read(), mime=True)
            if file_type not in MIME_TYPES:
                raise serializers.ValidationError(_("file non supportato."))
            return files
        return None

    def validate_caratteristiche(self, data):
        # controllo caratteristiche
        if not re.match("^[A-Za-z0-9., 'èòàùì]+$", data):
            raise serializers.ValidationError(
                _('Errore: il campo caratteristiche può contenere solo lettere, numeri, punti, virgole e spazi.'))
        if not (1 <= len(data) <= 245):
            raise serializers.ValidationError(
                _('Errore: il campo caratteristiche deve avere lunghezza fra 1 e 245 caratteri.'))
        return data

    def validate_descrizione(self, data):
        # controllo descrizione
        if not re.match("^[A-Za-z0-9., 'èòàùì]+$", data):
            raise serializers.ValidationError(
                _('Errore: il campo descrizione può contenere solo lettere, numeri, punti, virgole e spazi.'))
        if not (1 <= len(data) <= 245):
            raise serializers.ValidationError(
                _('Errore: il campo descrizione deve avere lunghezza fra 1 e 245 caratteri.'))
        return data

    def validate_eta(self, data):
        # controllo eta
        if not re.match("^[0-9]+$", str(data)):
            raise serializers.ValidationError(_('Errore: l\'età può contenere solo numeri.'))
        if not (0 <= int(data) <= 100):
            raise serializers.ValidationError(_('Errore: l\'età deve essere compresa fra 0 e 100.'))
        return data

    def update(self, instance, validated_data):
        dati_utente = validated_data.pop('user')
        # instance.user.first_name = dati_utente['first_name']
        # instance.user.last_name = dati_utente['last_name']
        instance.indirizzo = validated_data['indirizzo']
        instance.citta = validated_data['citta']
        instance.regione = validated_data['regione']
        instance.provincia = validated_data['provincia']
        instance.login_negozio = True
        instance.codice_postale = validated_data['codice_postale']
        instance.stato = 'Italia'  # [modifica] in un secondo momento andrà scelto dall'utente
        instance.telefono = validated_data['telefono']
        # instance.eta = validated_data['eta']
        # instance.caratteristiche = validated_data['caratteristiche']
        instance.user.save()
        instance.save()
        # print(instance.user)
        # print("self.context['request']", self.context['request'])
        # updatePositionLatLong(instance.user, self.context['request'])

        updatePositionLatLong(instance.user)
        return instance


class ReviewCustomerSerializer(serializers.ModelSerializer):
    writer = serializers.CharField(max_length=30, allow_null=True, allow_blank=True, required=False)
    receiver = serializers.CharField(max_length=30, allow_null=True, allow_blank=True, required=False)
    order = serializers.CharField(max_length=30, allow_null=True, allow_blank=True, required=False)

    class Meta:
        model = ReviewCustomer
        fields = '__all__'

    def validate_title_of_comment(self, data):
        if not re.match("^[A-Za-z0-9 .,'èòàùì]+$", data):
            raise serializers.ValidationError(_('Errore: il titolo può contenere solo lettere, numeri e spazi.'))
        if not (1 <= len(data) <= 95):
            raise serializers.ValidationError(_('Errore: il titolo deve avere lunghezza fra 1 e 95 caratteri.'))
        return data

    def validate_description(self, data):
        # controllo descrizione
        if not re.match("^[A-Za-z0-9 ,.'èòàùì]+$", data):
            raise serializers.ValidationError(_('Errore: la descrizione può contenere solo lettere, '
                                                'numeri, punti, virgole e spazi.'))
        return data


class OrderCustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = '__all__'


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = '__all__'


# class ItemSerializer(serializers.ModelSerializer):
#
#     class Meta:
#         model = Item
#         fields ='__all__'

class ItemSerializer(serializers.ModelSerializer):
    user = UserSerializer(many=False)

    class Meta:
        model = Item
        fields = "__all__"
        read_only_fields = ("id",)
        ordering = ['name']


class ReviewItemSerializer(serializers.ModelSerializer):
    writer = serializers.CharField(max_length=30, allow_null=True, allow_blank=True, required=False)
    order = serializers.CharField(max_length=30, allow_null=True, allow_blank=True, required=False)
    item = serializers.CharField(max_length=30, allow_null=True, allow_blank=True, required=False)

    class Meta:
        model = ReviewItem
        fields = "__all__"
