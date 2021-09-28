from rest_framework import permissions
from django.core.exceptions import PermissionDenied
from users.models import GeneralUser


class IsSameUser(permissions.BasePermission):
    """
    Object-level permission to only allow owners of an object to edit it.
    Assumes the model instance has an `owner` attribute.
    Controlla se posso fare un update o eliminare, in sostanza controlla se i dati che voglio modificare sono
    i miei e sono quindi loggato (insieme alla funzione IsUserLogged.
    Per dettagli:
    https://www.django-rest-framework.org/api-guide/permissions/
    """

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.user.id == request.user.id
        # return obj.owner == request.user


class IsUserLogged(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated)
