from django.contrib import admin
from . import models
from hashlib import md5
from wtoken.views import encryption


# Register your models here.
class Management(admin.ModelAdmin):
    def save_model(self, request, obj, form, change):
        obj.admin_password = encryption(obj.admin_password)
        super(Management, self).save_model(request, obj, form, change)

    list_display = ['admin_phone', 'admin_email', 'admin_created_time']
    list_display_links = ['admin_phone']
    list_filter = ['admin_phone']
    search_fields = ['admin_phone']


class ShopMassage(admin.ModelAdmin):
    list_display = ['shop_name', 'shop_site', 'shop_longitude', 'shop_latitude']
    list_display_links = ['shop_name']
    list_filter = ['shop_name']
    search_fields = ['shop_name']


admin.site.register(models.Management, Management)
admin.site.register(models.ShopMassage, ShopMassage)
admin.site.site_header = '怡家小厨后台管理系统'
admin.site.site_title = '超级管理'
