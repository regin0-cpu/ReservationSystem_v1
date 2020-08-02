from django.conf import settings
from customer.models import Customer
from message.models import ShoppingCart, Order, OrderData, Desk
from pay.models import UserPayInfo
from .alipay import AliPay
from django.http import JsonResponse
from django.shortcuts import redirect, HttpResponse
from wtoken.views import get_id
from mealAdmin.settings import FRONT_END_URL, AFTER_END_URL, VERSION
import json


def get_ali_object():
    # 沙箱环境地址：https://openhome.alipay.com/platform/appDaily.htm?tab=info
    app_id = "2016101500689832"  # APPID （沙箱应用）

    # 支付完成后，支付偷偷向这里地址发送一个post请求，识别公网IP,如果是 192.168.20.13局域网IP ,支付宝找不到，def page2()
    # 接收不到这个请求
    notify_url = AFTER_END_URL + VERSION + 'pay/update_order'

    # 支付完成后，跳转的地址。
    return_url = AFTER_END_URL + VERSION + 'pay/update_order'

    alipay = AliPay(
        appid=app_id,
        app_notify_url=notify_url,
        return_url=return_url,
        app_private_key_path=settings.ALIPAY_KEY_DIRS + "app_private_key.pem",
        alipay_public_key_path=settings.ALIPAY_KEY_DIRS + "alipay_public_key.pem",  # 支付宝的公钥，验证支付宝回传消息使用，不是你自己的公钥
        debug=True,  # 默认False,
    )
    return alipay


def page1(request):
    if request.method == 'POST':
        json_str = request.body
        json_obj = json.loads(json_str)
        desk = json_obj.get('desk')
        user_phone = json_obj.get('user_phone')
        user_number = json_obj.get('user_number')
        carts = ShoppingCart.objects.filter(user_id=user_phone)
        order_price = 0
        for cart in carts:
            green_price = cart.cart_green.green_price
            green_number = cart.green_number
            order_price += green_number * green_price
        try:
            user_number = int(user_number)
        except Exception as e:
            return JsonResponse({'code': 10801, 'error': '人数错误'})
        order_id = get_id()
        # 将数据存到临时数据库中
        if desk:
            total_amount = float(order_price)
            UserPayInfo.objects.create(order_id=order_id,
                                       desk_number=desk,
                                       customer_phone=user_phone,
                                       order_user_number=user_number
                                       )
        else:
            total_amount = float(order_price) * (60 / 100)
            user_time = json_obj.get('user_time')
            UserPayInfo.objects.create(order_id=order_id,
                                       desk_number=desk,
                                       take_time=user_time,
                                       customer_phone=user_phone,
                                       order_user_number=user_number
                                       )
        # 根据当前用户的配置，生成URL，并跳转。
        alipay = get_ali_object()
        # 生成支付的url
        query_params = alipay.direct_pay(
            subject=order_id,  # 商品简单描述
            out_trade_no=order_id,  # 用户购买的商品订单号（每次不一样） 20180301073422891
            total_amount=total_amount,  # 交易金额(单位: 元 保留俩位小数)
        )

        pay_url = "https://openapi.alipaydev.com/gateway.do?{0}".format(query_params)  # 支付宝网关地址（沙箱应用）
        return JsonResponse({'code': 200, 'pay_url': pay_url})


def page2(request):
    alipay = get_ali_object()
    if request.method == "POST":
        # 检测是否支付成功
        # 去请求体中获取所有返回的数据：状态/订单号
        from urllib.parse import parse_qs
        body_str = request.body.decode('utf-8')
        post_data = parse_qs(body_str)
        post_dict = {}
        for k, v in post_data.items():
            post_dict[k] = v[0]
        return HttpResponse('POST返回')

    else:
        # 完成订单
        params = request.GET.dict()
        sign = params.pop('sign', None)
        status = alipay.verify(params, sign)
        order_id = params['out_trade_no']
        order_info_list = UserPayInfo.objects.filter(order_id=order_id)
        desk_number = order_info_list[0].desk_number
        if status:
            user_phone = order_info_list[0].customer_phone
            user_number = order_info_list[0].order_user_number
            user_time = order_info_list[0].take_time
            carts = ShoppingCart.objects.filter(user_id=user_phone)
            user = Customer.objects.get(customer_phone=user_phone)
            order_price = 0
            for cart in carts:
                green_price = cart.cart_green.green_price
                green_number = cart.green_number
                order_price += green_number * green_price
            if not desk_number:
                order = Order.objects.create(order_number=order_id, order_type='R', take_time=user_time,
                                             order_state='R',
                                             customer_order=user,
                                             order_price=order_price,
                                             order_user_number=user_number)
            else:
                desk_list = Desk.objects.filter(desk_number=desk_number)
                order = Order.objects.create(order_number=order_id, order_type='A', take_time=user_time,
                                             order_state='P',
                                             customer_order=user,
                                             order_price=order_price,
                                             order_user_number=user_number)
                order.order_desk.add(desk_list[0])
                order.save()
            for cart in carts:
                OrderData.objects.create(green=cart.cart_green, number=cart.green_number, order_info=order)
            for cart in carts:
                cart.delete()
            order_info_list[0].delete()
            if not desk_number:
                return redirect(FRONT_END_URL + 'pay1')
            else:
                return redirect(FRONT_END_URL + 'pay3')
        else:
            if not desk_number:
                return redirect(FRONT_END_URL + 'pay2')
            else:
                return redirect(FRONT_END_URL + 'pay4')
