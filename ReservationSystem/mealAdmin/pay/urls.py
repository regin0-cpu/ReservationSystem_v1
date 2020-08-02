from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^user_pay$', views.page1),
    url(r'^update_order$', views.page2)
]
