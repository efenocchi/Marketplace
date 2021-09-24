from django.forms import ModelForm


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


class ReviewCustomerForm(ModelForm):
    # per formattazione errori e richieste (vedi documentazione Django)
    required_css_class = 'required'

    class Meta:
        model = models.ReviewItem
        fields = [
            'title_of_comment',
            'description',
            'rating'
        ]