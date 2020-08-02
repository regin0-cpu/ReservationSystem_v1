from django.db import models


# Create your models here.


# 管理员数据库
class Management(models.Model):
    # admin_id = models.CharField(max_length=8, verbose_name='管理员主键', primary_key=True)
    admin_phone = models.CharField(max_length=11, verbose_name='管理员电话', primary_key=True)
    admin_picture = models.ImageField(upload_to='administrators',
                                      default='administrators/default_admin.png',
                                      verbose_name='管理员头像')
    admin_name = models.CharField(max_length=24, verbose_name='管理员姓名')
    admin_password = models.CharField(max_length=64, verbose_name='管理员密码')
    admin_email = models.EmailField(max_length=32, verbose_name='管理员邮箱')
    admin_created_time = models.DateTimeField(auto_now_add=True, verbose_name='管理员创建时间')
    admin_updated_time = models.DateTimeField(auto_now=True, verbose_name='管理员更新时间')

    def __str__(self):
        return self.admin_name

    class Meta:
        db_table = 'management'
        verbose_name = '管理员表'
        verbose_name_plural = verbose_name


class ShopMassage(models.Model):
    shop_name = models.CharField(max_length=32, verbose_name='店家名字')
    shop_site = models.CharField(max_length=100, verbose_name='店家位置信息', null=True)
    shop_longitude = models.FloatField(verbose_name='位置经度')
    shop_latitude = models.FloatField(verbose_name='位置纬度')

    class Meta:
        db_table = 'shopmassage'
        verbose_name = '店家信息表'
        verbose_name_plural = verbose_name
