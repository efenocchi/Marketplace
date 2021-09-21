from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.validators import UnicodeUsernameValidator
from users.models import GeneralUser


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        exclude=[
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


class CompleteUserData(serializers.ModelSerializer):
    user = UserSerializer(many=False)
    # numero_recensioni = serializers.SerializerMethodField("get_numero_recensioni_utente")
    # media_voti = serializers.SerializerMethodField("get_media_voti_utente")
    foto_profilo = serializers.FileField(read_only=True)
    class Meta:
        model = GeneralUser
        fields =["user",
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







