from django.contrib import admin

# Register your models here.

from . import models


class Customer(admin.ModelAdmin):
    list_display = ['customer_phone', 'customer_name', 'customer_password']
    list_display_links = ['customer_phone']
    list_filter = ['customer_phone']
    search_fields = ['customer_phone']


admin.site.register(models.Customer, Customer)
