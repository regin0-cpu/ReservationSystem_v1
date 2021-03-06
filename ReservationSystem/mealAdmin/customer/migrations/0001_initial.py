# Generated by Django 2.2.7 on 2020-03-09 13:54

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Customer',
            fields=[
                ('customer_phone', models.CharField(max_length=11, primary_key=True, serialize=False, verbose_name='顾客电话')),
                ('customer_name', models.CharField(max_length=33, verbose_name='顾客昵称')),
                ('customer_sex', models.CharField(choices=[('male', '男'), ('female', '女')], default='male', max_length=8, verbose_name='性别')),
                ('customer_birthday', models.DateTimeField(null=True, verbose_name='顾客生日')),
                ('customer_picture', models.ImageField(default='customer/default_customer.png', upload_to='customer', verbose_name='顾客头像')),
                ('customer_password', models.CharField(max_length=64, verbose_name='顾客密码')),
                ('customer_created_time', models.DateTimeField(auto_now_add=True, verbose_name='顾客创建时间')),
                ('customer_updated_time', models.DateTimeField(auto_now=True, verbose_name='顾客更新时间')),
            ],
            options={
                'verbose_name': '顾客信息表',
                'verbose_name_plural': '顾客信息表',
                'db_table': 'customer',
            },
        ),
        migrations.CreateModel(
            name='UserCode',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user_phone', models.CharField(max_length=11, verbose_name='用户手机号')),
                ('user_code', models.CharField(max_length=4, verbose_name='用户验证码')),
                ('create_time', models.DateTimeField(auto_now_add=True, verbose_name='发送时间')),
            ],
        ),
    ]
