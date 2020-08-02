from hashlib import md5

from django.contrib import admin

# Register your models here.

from . import models
from customer.models import Customer
import qrcode
from wtoken.views import encryption
from mealAdmin.settings import FRONT_END_URL


class MessageGreens(admin.ModelAdmin):
    list_display = ['greens_number', 'greens_name']
    list_display_links = ['greens_number']
    list_filter = ['greens_name']
    search_fields = ['greens_number']


class MessageGreen(admin.ModelAdmin):
    list_display = ['green_number', 'green_name', 'green_price', 'green_label']
    list_display_links = ['green_name']
    list_filter = ['green_name']
    search_fields = ['green_number']


class MessageDesk(admin.ModelAdmin):
    def save_model(self, request, obj, form, change):
        desk_password = encryption(obj.desk_password)
        desk_number = obj.desk_number
        user_number_str = encryption(desk_number)[:11]
        Customer.objects.create(customer_phone=user_number_str, customer_name=desk_number,
                                customer_password=desk_password)
        obj.desk_password = desk_password

        # 生成桌台链接
        url = FRONT_END_URL + 'now_user?&desk=' + str(desk_number)
        img = qrcode.make(url)
        img.save('media/code/' + str(desk_number) + '.png')
        code_pwd = 'code/' + str(desk_number) + '.png'
        models.DeskUrl.objects.create(desk=desk_number, desk_url=url, desk_code=code_pwd)
        super(MessageDesk, self).save_model(request, obj, form, change)

    list_display = ['desk_number', 'desk_user_number']
    list_display_links = ['desk_number']
    list_filter = ['desk_number']
    search_fields = ['desk_number']


class MessageOrder(admin.ModelAdmin):
    list_display = ['order_number', 'order_type', 'create_time', 'take_time', 'order_price', 'customer_order']
    list_display_links = ['order_number']
    list_filter = ['order_number']
    search_fields = ['order_number']


class MessageOrderData(admin.ModelAdmin):
    list_display = ['order_info', 'number', 'green']
    list_display_links = ['order_info']
    list_filter = ['order_info']
    search_fields = ['order_info']


class MessageOrderCode(admin.ModelAdmin):
    list_display = ['desk', 'desk_url']
    list_display_links = ['desk']
    list_filter = ['desk']
    search_fields = ['desk']


admin.site.register(models.Greens, MessageGreens)
admin.site.register(models.Green, MessageGreen)
admin.site.register(models.Desk, MessageDesk)
admin.site.register(models.Order, MessageOrder)
admin.site.register(models.OrderData, MessageOrderData)
admin.site.register(models.DeskUrl, MessageOrderCode)
