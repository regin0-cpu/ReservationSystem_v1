from django.db import models


# Create your models here.

# 顾客数据库
class Customer(models.Model):
    customer_phone = models.CharField(max_length=11, verbose_name='顾客电话', primary_key=True)
    customer_name = models.CharField(max_length=33, verbose_name='顾客昵称')
    customer_sex = models.CharField(max_length=8, choices=(('male', '男'), ('female', '女')), default='male',
                                    verbose_name='性别')
    customer_birthday = models.DateTimeField(verbose_name='顾客生日', null=True)
    customer_picture = models.ImageField(upload_to='customer', default='customer/default_customer.png',
                                         verbose_name='顾客头像')
    customer_password = models.CharField(max_length=64, verbose_name='顾客密码')
    customer_created_time = models.DateTimeField(auto_now_add=True, verbose_name='顾客创建时间')
    customer_updated_time = models.DateTimeField(auto_now=True, verbose_name='顾客更新时间')

    def __str__(self):
        return self.customer_name

    class Meta:
        db_table = 'customer'
        verbose_name = '顾客信息表'
        verbose_name_plural = verbose_name


class UserCode(models.Model):
    user_phone = models.CharField(max_length=11, verbose_name='用户手机号')
    user_code = models.CharField(max_length=6, verbose_name='用户验证码')
    create_time = models.DateTimeField(auto_now_add=True, verbose_name='发送时间')

    class Meta:
        db_table = 'user_code'
        verbose_name = '验证码表'
        verbose_name_plural = verbose_name
