from django.conf.urls import url
from . import customer_views, management_views

urlpatterns = [
    url(r'^customer_test$', customer_views.test),
    url(r'^customer_get_green$', customer_views.get_green),
    url(r'^customer_get_greens$', customer_views.get_greens),
    url(r'^customer_shoppingcart$', customer_views.shoppingcart),
    url(r'^customer_orders$', customer_views.order),
    url(r'^customer_get_desk$', customer_views.desk),
]

urlpatterns += [
    url(r'^management_reserve_order$', management_views.reserve_order),
    url(r'^management_indent_order$', management_views.indent_order),
    url(r'^management_cuisine_order$', management_views.cuisine_order),
    url(r'^get_order_green$', management_views.get_order_green),
    url(r'^get_order_info$', management_views.get_order_info),
]
