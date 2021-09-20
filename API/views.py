from django.contrib.auth.models import User
from django.shortcuts import render
from rest_framework import generics
# Create your views here.
from users.models import GeneralUser
from API.serializers import (CompleteUserData)


class userInfoLogin(generics.RetrieveAPIView):
    """
    Questa view restituisce la lista completa degli utenti registrati
    """
    serializer_class = CompleteUserData

    def get_object(self):
        """
        Modifico il query set in modo da ottenere l'utente con l'id
        prelevato dall'url
        """
        oid = self.kwargs['pk']
        return GeneralUser.objects.get(user=oid)


class findUser(generics.ListAPIView):
    serializer_class = CompleteUserData

    def get_queryset(self):
        name = self.kwargs['name']
        profili = []
        try:
            username_cercato = User.objects.get(username__exact=name)
            profilo = GeneralUser.objects.get(user=username_cercato)
            profilo.user.password = ""
            profili.append(profilo)
            return profili
        except Exception:
            username_trovati = User.objects.filter(username__startswith=name)
            if len(username_trovati) == 0:
                username_trovati = User.objects.filter(username__contains=name)
            for user in username_trovati:
                p = GeneralUser.objects.get(user=user)
                p.user.password = ""
                profili.append(p)
            return profili

