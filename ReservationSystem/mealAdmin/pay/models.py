from django.db import models


# Create your models here.
class UserPayInfo(models.Model):
    order_id = models.IntegerField(verbose_name='订单编号', primary_key=True)
    order_type = models.CharField(max_length=2, verbose_name='订单类型', choices=(('R', '预订'), ('A', '实时')))
    desk_number = models.IntegerField(verbose_name='桌号', null=True)
    take_time = models.DateTimeField(auto_now_add=True, verbose_name='订单生效时间')
    customer_phone = models.CharField(max_length=11, verbose_name='顾客电话')
    order_user_number = models.IntegerField(verbose_name='订单人数')

    class Meta:
        db_table = 'user_info'
        verbose_name = '订单信息表'
        verbose_name_plural = verbose_name
