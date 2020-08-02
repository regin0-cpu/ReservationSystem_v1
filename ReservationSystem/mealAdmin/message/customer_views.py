import datetime
import json
import time
from django.http import JsonResponse
from message.models import Green, Greens, ShoppingCart, Order, Desk
from customer.models import Customer
from verifys.user_verifys import user_check
from wtoken.views import make_token_c, encryption


# Create your views here.

def test(request):
    return JsonResponse({'code': 200, 'test': '信息应用测试'})


def get_green(request):
    '''
    GET
    推荐菜品信息
    :param request:
    :return:
    '''
    if request.method == 'GET':
        green_list = Green.objects.filter(green_recommend=True, green_isActive=True)
        green_data = []
        for green in green_list:
            dic = dict()
            dic['green_number'] = green.green_number
            dic['green_name'] = green.green_name
            dic['green_price'] = green.green_price
            dic['green_picture'] = str(green.green_picture)
            dic['green_label'] = green.green_label
            green_data.append(dic)
        return JsonResponse({'code': 200, 'green_data': green_data})
    if request.method == 'POST':
        json_str = request.body
        json_obj = json.loads(json_str)
        greens_id = json_obj.get('greens_id')
        if greens_id == 'all':
            green_list = Green.objects.filter(green_isActive=True)
        else:
            try:
                greens = Greens.objects.get(greens_number=greens_id)
            except Exception as e:
                return JsonResponse({'code': 10401, 'error': '获取数据异常'})
            green_list = Green.objects.filter(green_type=greens, green_isActive=True)
        green_data = []
        for green in green_list:
            dic = dict()
            dic['green_number'] = green.green_number
            dic['green_name'] = green.green_name
            dic['green_price'] = green.green_price
            dic['green_picture'] = str(green.green_picture)
            dic['green_label'] = green.green_label
            green_data.append(dic)
        return JsonResponse({'code': 200, 'green_data': green_data})


def get_greens(request):
    '''
    获取菜品分类
    :param request:
    :return:
    '''
    if request.method == 'POST':
        greens_list = Greens.objects.all()
        greens_data = []
        for greens in greens_list:
            dic = dict()
            dic['greens_number'] = greens.greens_number
            dic['greens_name'] = greens.greens_name
            greens_data.append(dic)
        return JsonResponse({'code': 200, 'greens_data': greens_data})


@user_check('POST', 'GET', 'DELETE', 'PUT')
def shoppingcart(request):
    '''
    添加菜品到购物车
    :param request:
    :return:
    '''
    if request.method == 'POST':
        json_str = request.body
        json_obj = json.loads(json_str)
        user_phone = json_obj.get('user_phone')

        green_id = json_obj.get('green_id')
        if not green_id:
            green_number = get_cart_green_number(user_phone)
            return JsonResponse({'code': 200, 'green_number': green_number})
        try:
            green_id = int(green_id)
        except Exception as e:
            return JsonResponse({'code': 10504, 'error': '菜品信息错误'})
        green = Green.objects.filter(green_number=green_id, green_isActive=True)
        if not green:
            return JsonResponse({'code': 10504, 'error': '菜品信息不存在'})
        green = green[0]

        user_cart = ShoppingCart.objects.filter(user_id=user_phone, cart_green=green)
        if user_cart:
            green_number = user_cart[0].green_number
            user_cart[0].green_number = green_number + 1
            user_cart[0].save()
        else:
            ShoppingCart.objects.create(user_id=user_phone, cart_green=green)
        green_number = get_cart_green_number(user_phone)
        return JsonResponse({'code': 200, 'green_number': green_number})
    # 查询购物车
    if request.method == 'GET':
        user_phone = request.GET.get('user_phone')
        user_cart = ShoppingCart.objects.filter(user_id=user_phone)
        cart_list = []
        for cart in user_cart:
            dic = dict()
            dic['green_name'] = cart.cart_green.green_name
            green_price = cart.cart_green.green_price
            green_number = cart.green_number
            dic['green_id1'] = cart.cart_green.green_number
            dic['green_number'] = green_number
            dic['green_price_all'] = green_price * green_number
            cart_list.append(dic)
        return JsonResponse({'code': 200, 'cart_list': cart_list})
    if request.method == 'DELETE':
        json_str = request.body
        json_obj = json.loads(json_str)
        user_phone = json_obj.get('user_phone')
        green_id = json_obj.get('green_id')
        if not green_id:
            green_number = get_cart_green_number(user_phone)
            return JsonResponse({'code': 200, 'green_number': green_number})
        try:
            green_id = int(green_id)
        except Exception as e:
            return JsonResponse({'code': 10601, 'error': '菜品信息错误'})
        green = Green.objects.filter(green_number=green_id, green_isActive=True)
        if not green:
            return JsonResponse({'code': 10601, 'error': '菜品信息不存在'})
        green = green[0]
        try:
            user_cart = ShoppingCart.objects.get(user_id=user_phone, cart_green=green)
            user_cart.delete()
        except Exception as e:
            return JsonResponse({'code': 10602, 'error': '删除失败'})
        user_cart = ShoppingCart.objects.filter(user_id=user_phone)
        cart_list = []
        for cart in user_cart:
            dic = dict()
            dic['green_name'] = cart.cart_green.green_name
            green_price = cart.cart_green.green_price
            green_number = cart.green_number
            dic['green_id1'] = cart.cart_green.green_number
            dic['green_number'] = green_number
            dic['green_price_all'] = green_price * green_number
            cart_list.append(dic)
        return JsonResponse({'code': 200, 'cart_list': cart_list})

    # 更新购物车
    if request.method == 'PUT':
        json_str = request.body
        json_obj = json.loads(json_str)
        user_phone = json_obj.get('user_phone')
        green_id = json_obj.get('green_id')
        if not green_id:
            green_number = get_cart_green_number(user_phone)
            return JsonResponse({'code': 200, 'green_number': green_number})
        try:
            green_id = int(green_id)
        except Exception as e:
            return JsonResponse({'code': 10701, 'error': '菜品信息错误'})
        green = Green.objects.filter(green_number=green_id, green_isActive=True)
        if not green:
            return JsonResponse({'code': 10702, 'error': '菜品信息不存在'})
        green = green[0]
        user_cart = ShoppingCart.objects.filter(user_id=user_phone, cart_green=green)
        handle = json_obj.get('handle')
        if handle == 'add':
            if user_cart:
                green_number = user_cart[0].green_number
                user_cart[0].green_number = green_number + 1
                user_cart[0].save()
            else:
                ShoppingCart.objects.create(user_id=user_phone, cart_green=green)
            greens_number = get_cart_green_number(user_phone)
            green_number = ShoppingCart.objects.filter(user_id=user_phone, cart_green=green)[0].green_number
            return JsonResponse({'code': 200, 'greens_number': greens_number, 'green_number': green_number,
                                 'green_price': green.green_price})
        elif handle == 'sub':
            if user_cart:
                green_number = user_cart[0].green_number
                if green_number > 1:
                    user_cart[0].green_number = green_number - 1
                    user_cart[0].save()
                    greens_number = get_cart_green_number(user_phone)
                    green_number = ShoppingCart.objects.filter(user_id=user_phone, cart_green=green)[0].green_number
                    return JsonResponse({'code': 200, 'greens_number': greens_number, 'green_number': green_number,
                                         'green_price': green.green_price})
                else:
                    try:
                        user_cart[0].delete()
                        return JsonResponse(
                            {'code': 200})
                    except Exception as e:
                        print('-------数据异常--------')
                        return JsonResponse({'code': 10704, 'error': '数据异常'})
            else:
                return JsonResponse({'code': 10703, 'error': '菜品信息不存在'})
        else:
            return JsonResponse({'code': 10705, 'error': '请求错误'})


def get_cart_green_number(user_phone):
    '''
    获取用户购物车内菜品的数量
    :param user_phone:
    :return:
    '''
    user_cart = ShoppingCart.objects.filter(user_id=user_phone)
    green_number = 0
    for cart in user_cart:
        green_number += cart.green_number
    return green_number


@user_check('POST', 'GET', 'DELETE', 'PUT')
def order(request):
    global order_number1
    if request.method == 'GET':
        user_phone = request.GET.get('user_phone')
        user_orders = Order.objects.filter(customer_order=user_phone, user_order_isActive=False).order_by('-take_time')
        if user_orders:
            user_order_list = []
            for user_order in user_orders:
                order_time = time.mktime(user_order.take_time.timetuple())
                dateArray = datetime.datetime.fromtimestamp(order_time)
                otherStyleTime = dateArray.strftime("%Y-%m-%d %H:%M:%S")
                dic = dict()
                dic['order_number'] = user_order.order_number
                dic['order_type'] = user_order.order_type
                dic['take_time'] = otherStyleTime
                dic['order_state'] = user_order.order_state
                dic['order_user_number'] = user_order.order_user_number
                user_order_list.append(dic)
            return JsonResponse({'code': 200, 'user_order_list': user_order_list})
        else:
            return JsonResponse({'code': 200})
    if request.method == 'DELETE':
        json_str = request.body
        json_obj = json.loads(json_str)
        order_id = json_obj.get('order_id')
        user_phone = json_obj.get('user_phone')
        user_order = Order.objects.filter(order_number=order_id, customer_order=user_phone)
        if user_order:
            user_order[0].user_order_isActive = True
            user_order[0].save()
            return JsonResponse({'code': 200})
        else:
            return JsonResponse({'code': 10903, 'error': '订单数据不存在'})
    if request.method == 'PUT':
        json_str = request.body
        json_obj = json.loads(json_str)
        order_id = json_obj.get('order_id')
        user_phone = json_obj.get('user_phone')
        user_order = Order.objects.filter(order_number=order_id, customer_order=user_phone, user_order_isActive=False)
        if user_order:
            operate = json_obj.get('operate')
            if operate == 'cancel':
                user_order[0].order_state = 'S'
            user_order[0].save()
            return JsonResponse({'code': 200})
        else:
            return JsonResponse({'code': 10903, 'error': '订单数据不存在'})


def desk(request):
    if request.method == 'GET':
        try:
            desk_number = int(request.GET.get('desk'))
        except Exception as e:
            return JsonResponse({'code': 11102, 'error': '非法访问'})
        desk_list = Desk.objects.filter(desk_number=desk_number, desk_isActive=True)
        if desk_list:
            desk_str = encryption(desk_list[0].desk_number)[:11]
            user_list = Customer.objects.filter(customer_phone=desk_str)
            if user_list:
                user_phone = user_list[0].customer_phone
                user_password = user_list[0].customer_password
                user_token = make_token_c(user_phone, user_password)
                return JsonResponse({'code': 200, 'user_phone': user_phone, 'user_token': user_token.decode()})
            else:
                return JsonResponse({'code': 11103, 'error': '访问桌台出错'})
        else:
            return JsonResponse({'code': 11101, 'error': '桌台不存在'})
