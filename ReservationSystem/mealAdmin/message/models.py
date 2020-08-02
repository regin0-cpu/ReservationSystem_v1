from django.db import models

# Create your models here.


# 菜品类别
from customer.models import Customer


class Greens(models.Model):
    greens_number = models.IntegerField(verbose_name='类别号', default=500001, primary_key=True)
    greens_name = models.CharField(max_length=30, verbose_name='类别名')

    def __str__(self):
        return self.greens_name

    class Meta:
        db_table = 'greens'
        verbose_name = '菜品类别信息表'
        verbose_name_plural = verbose_name


# 菜品数据库
class Green(models.Model):
    green_number = models.IntegerField(verbose_name='菜品编号', default=600001, primary_key=True)
    green_name = models.CharField(max_length=30, verbose_name='菜品名称')
    green_price = models.DecimalField(max_digits=8, decimal_places=2, default=0.0, verbose_name='菜品价格')
    green_picture = models.ImageField(upload_to='menu', default='menu/default_menu.png',
                                      verbose_name='商品图片')
    green_isActive = models.BooleanField(default=True, verbose_name="是否上架")
    green_created_time = models.DateTimeField(auto_now_add=True, verbose_name='菜品创建时间')
    green_updated_time = models.DateTimeField(auto_now=True, verbose_name='菜品更新时间')
    green_type = models.ForeignKey(Greens, verbose_name='所属菜品类别', on_delete=models.CASCADE)
    green_label = models.CharField(max_length=33, null=True, verbose_name='菜品标签')
    green_recommend = models.BooleanField(default=True, verbose_name='是否推荐')

    def __str__(self):
        return self.green_name

    class Meta:
        db_table = 'green'
        verbose_name = '菜品信息表'
        verbose_name_plural = verbose_name


# 桌台数据库
class Desk(models.Model):
    desk_number = models.IntegerField(verbose_name='桌号', primary_key=True)
    desk_isActive = models.BooleanField(default=True, verbose_name='是否空闲')
    desk_user_number = models.IntegerField(verbose_name='桌台人数')
    desk_password = models.CharField(max_length=64, verbose_name='桌台密码')

    class Meta:
        db_table = 'desk'
        verbose_name = '桌台信息表'
        verbose_name_plural = verbose_name


class DeskUrl(models.Model):
    desk = models.IntegerField(verbose_name='桌号', primary_key=True)
    desk_url = models.CharField(max_length=100, verbose_name='桌台链接')
    desk_code = models.ImageField(upload_to='code', verbose_name='桌台二维码')

    class Meta:
        db_table = 'desk_code'
        verbose_name = '桌台二维码表'
        verbose_name_plural = verbose_name


# 购物车
class ShoppingCart(models.Model):
    user_id = models.CharField(max_length=11, verbose_name='用户ID')
    cart_green = models.ForeignKey(Green, verbose_name='购物车中的菜品', on_delete=models.CASCADE)
    green_number = models.IntegerField(default=1)

    def __str__(self):
        return self.user_id

    class Meta:
        db_table = 'shoppingcart'


# 订单数据库
class Order(models.Model):
    order_number = models.IntegerField(verbose_name='订单编号', primary_key=True)
    order_type = models.CharField(max_length=2, verbose_name='订单类型', choices=(('R', '预订'), ('A', '实时')))
    create_time = models.DateTimeField(auto_now_add=True, verbose_name='订单下单时间')
    take_time = models.DateTimeField(verbose_name='订单生效时间')
    order_price = models.DecimalField(max_digits=8, decimal_places=2, default=0.0, verbose_name='订单总价')
    user_order_isActive = models.BooleanField(default=False, verbose_name="用户是否删除")
    admin_order_isActive = models.BooleanField(default=False, verbose_name="管理员是否删除")
    order_state = models.CharField(max_length=2,
                                   choices=(('P', '进行中'), ('R', '预订中'), ('O', '完成'), ('S', '取消'), ('L', '失效')),
                                   default='P')
    order_desk = models.ManyToManyField(Desk, verbose_name='所属桌台', blank=True, default=None)
    customer_order = models.ForeignKey(Customer, verbose_name='订单所属顾客', null=True, on_delete=models.CASCADE)
    order_user_number = models.IntegerField(verbose_name='订单人数')

    def __str__(self):
        return str(self.order_number)

    class Meta:
        db_table = 'order'
        verbose_name = '订单信息表'
        verbose_name_plural = verbose_name


# 订单详情
class OrderData(models.Model):
    green = models.ForeignKey(Green, verbose_name='订单中的菜品', on_delete=models.CASCADE)
    number = models.IntegerField(verbose_name='菜品数量')
    order_info = models.ForeignKey(Order, verbose_name='订单详细信息', on_delete=models.CASCADE)

    class Meta:
        db_table = 'orderdata'
        verbose_name = '订单详情表'
        verbose_name_plural = verbose_name
