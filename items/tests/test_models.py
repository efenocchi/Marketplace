from django.test import TestCase
from django.contrib.auth.models import User
from items.models import Item, OrderItem, Order, WhoHasReviewed


class TestModels(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='user', password='12345')
        self.item = Item.objects.create(
            user=self.user,
            name='Un nome',
            price=100,
            discount_price=50,
            category='Abbigliamento',
            description='Una descrizione',
            quantity=5
            # image=
        )

        self.orderitem = OrderItem.objects.create(
            user=self.user,
            item=self.item,
            ordered=False,
            quantity=5,
            review_item_done=False
        )

        self.whohasreviewed = WhoHasReviewed.objects.create(
            writer=self.user
        )

        self.order = Order.objects.create(
            user=self.user,
            ref_code='Un ref_code',
            items=self.orderitem,
            start_date='15/08/2140 15:00',
            ordered_date='15/08/2140 15:00',
            ordered=False,
            number_order=5,
            review_customer_done=self.whohasreviewed
        )

