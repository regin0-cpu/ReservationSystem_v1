from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^admin_login$', views.admin_login),
    url(r'^get_shop_message$', views.get_site)
]
