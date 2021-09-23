import re
from django.utils.translation import ugettext_lazy as _

import magic
from django.core.exceptions import ValidationError
from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.validators import UnicodeUsernameValidator
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
        instance.stato = 'Italia' # [modifica] in un secondo momento andrà scelto dall'utente
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
        instance.stato = 'Italia' # [modifica] in un secondo momento andrà scelto dall'utente
        instance.telefono =validated_data['telefono']
        # instance.eta = validated_data['eta']
        # instance.caratteristiche = validated_data['caratteristiche']
        instance.user.save()
        instance.save()
        # print(instance.user)
        # print("self.context['request']", self.context['request'])
        # updatePositionLatLong(instance.user, self.context['request'])
        updatePositionLatLong(instance.user)
        return instance
