from django.conf.urls import url
from . import views, code_views

urlpatterns = [
    url(r'c_login$', views.login),
    url(r'c_register$', views.registered),
    url(r'^code$', code_views.code)
]
