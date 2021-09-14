from django.forms import ModelForm
from . import models


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


class ReviewShopForm(ModelForm):
    # per formattazione errori e richieste (vedi documentazione Django)
    required_css_class = 'required'

    class Meta:
        model = models.ReviewItem
        fields = [
            'title_of_comment',
            'description',
            'rating'
        ]