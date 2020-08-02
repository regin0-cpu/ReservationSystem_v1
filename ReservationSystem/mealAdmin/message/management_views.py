import json, time, datetime
from django.http import JsonResponse
from message.models import Order, Desk, OrderData
from verifys.management_verifys import management_check
from django.db.models import Q


@management_check('GET', 'POST')
def reserve_order(request):
    """
    预定订单处理
    :param request:
    :return: 状态码
    """
    if request.method == 'GET':
        order_list = Order.objects.filter(admin_order_isActive=False, order_type='R', order_state='R').order_by(
            'take_time')
        data_list = []

        for order in order_list:
            order_time = time.mktime(order.take_time.timetuple())
            dateArray = datetime.datetime.fromtimestamp(order_time)
            otherStyleTime = dateArray.strftime("%Y-%m-%d %H:%M:%S")
            dic = {
                'order_number': order.order_number,
                'order_price': order.order_price,
                'take_time': otherStyleTime,
                'order_user_number': order.order_user_number
            }
            data_list.append(dic)
        return JsonResponse({
            'code': 200,
            'order_list': data_list
        })
    if request.method == 'POST':
        json_str = request.body
        json_obj = json.loads(json_str)
        order_id = json_obj.get('order_id')
        order_list = Order.objects.filter(admin_order_isActive=False, order_number=order_id, order_type='R')
        if not order_list:
            return JsonResponse({'code': 20101, 'error': '没有找到订单数据'})

        user_number = order_list[0].order_user_number
        order_list[0].order_state = 'P'
        time1 = time.time()
        time3 = time.localtime(time1)
        time2 = time.strftime("%Y-%m-%d %H:%M:%S", time3)
        order_list[0].take_time = time2
        # 处理桌台分配问题：
        desk_list = desk_allot(user_number)
        if not desk_list:
            return JsonResponse({'code': 20102, 'error': '当前位置已满，请稍后再试'})
        for desk in desk_list:
            order_list[0].order_desk.add(desk)
            desk.desk_isActive = False
            desk.save()
        order_list[0].save()
        return JsonResponse({'code': 200})


@management_check('GET', 'POST')
def indent_order(request):
    """
    实时订单处理
    :param request:
    :return: 处理状态码
    """
    if request.method == 'GET':
        order_list = Order.objects.filter(admin_order_isActive=False, order_state='P').order_by('take_time')
        data_list = []
        for order in order_list:
            order_deskObj_list = order.order_desk.all()
            order_desk_list = []
            order_time = time.mktime(order.take_time.timetuple())
            dateArray = datetime.datetime.fromtimestamp(order_time)
            otherStyleTime = dateArray.strftime("%Y-%m-%d %H:%M:%S")
            for order_desk in order_deskObj_list:
                order_desk_list.append(order_desk.desk_number)
            dic = {
                'order_number': order.order_number,
                'order_price': order.order_price,
                'take_time': otherStyleTime,
                'order_user_number': order.order_user_number,
                'order_desk_list': order_desk_list
            }
            data_list.append(dic)
        return JsonResponse({
            'code': 200,
            'order_list': data_list
        })
    if request.method == 'POST':
        json_str = request.body
        json_obj = json.loads(json_str)
        order_id = json_obj.get('order_id')
        order_list = Order.objects.filter(admin_order_isActive=False, order_number=order_id, order_state='P')
        if not order_list:
            return JsonResponse({'code': 20103, 'error': '没有找到订单数据'})
        try:
            order_list[0].order_state = 'O'
            if order_list[0].order_type == 'A':
                order_list[0].user_order_isActive = True
            order_deskObj_list = order_list[0].order_desk.all()
            if order_deskObj_list:
                for order_desk in order_deskObj_list:
                    order_desk.desk_isActive = True
                    order_desk.save()
            order_list[0].save()
            return JsonResponse({'code': 200})
        except Exception as e:
            print(e)
            return JsonResponse({'code': 20104, 'error': '操作失败'})


@management_check('GET')
def get_order_green(request):
    """
    获取订单菜品
    :param request:
    :return:
    """
    if request.method == 'GET':
        order_id = request.GET.get('order_id')
        order_list = Order.objects.filter(order_number=order_id)
        print(order_id)

        if not order_list:
            return JsonResponse({'code': 20107, 'error': '没有找到订单信息'})

        order_info_list = OrderData.objects.filter(order_info=order_list[0])
        if not order_info_list:
            return JsonResponse({'code': 20108, 'error': '订单中好像没有菜品'})
        order_green_list = []
        for order in order_info_list:
            dic = {
                'green_name': order.green.green_name,
                'green_number': order.number
            }
            order_green_list.append(dic)
        return JsonResponse({'code': 200, 'order_green_list': order_green_list})


@management_check('GET', 'DELETE')
def cuisine_order(request):
    """
    历史定单处理
    :param request:
    :return: 处理状态码
    """
    if request.method == 'GET':
        order_list = Order.objects.filter(
            Q(admin_order_isActive=False) & Q(order_state='O') | Q(order_state='S') | Q(order_state='L')).order_by(
            '-create_time')
        data_list = []

        for order in order_list:
            order_time = time.mktime(order.create_time.timetuple())
            dateArray = datetime.datetime.fromtimestamp(order_time)
            otherStyleTime = dateArray.strftime("%Y-%m-%d %H:%M:%S")
            dic = {
                'order_number': order.order_number,
                'order_state': order.order_state,
                'create_time': otherStyleTime,
                'order_price': order.order_price,
            }
            data_list.append(dic)
        return JsonResponse({
            'code': 200,
            'order_list': data_list
        })
    if request.method == 'DELETE':
        json_str = request.body
        json_obj = json.loads(json_str)
        order_id = json_obj.get('order_id')
        order_list = Order.objects.filter(admin_order_isActive=False, order_number=order_id)
        if not order_list:
            return JsonResponse({'code': 20105, 'error': '没有找到订单数据'})
        try:
            order_list[0].admin_order_isActive = True
            order_list[0].save()
            return JsonResponse({'code': 200})
        except:
            return JsonResponse({'code': 20106, 'error': '删除失败'})


def desk_allot(user_number):
    """
    处理桌台分配问题：
    :param user_number: 用户人数
    :return: 该分配的桌台列表
    """
    desk_list = Desk.objects.filter(desk_isActive=True)
    if not desk_list:
        return []
    list1 = []
    for desk in desk_list:
        list1.append(desk.desk_user_number)
    list1.append(user_number)
    list1.sort()
    for item in range(len(list1)):
        if list1[item] == user_number:
            if item >= len(list1) - 1:
                k = list1[item - 1]
                for desk in desk_list:
                    if desk.desk_user_number == k:
                        return [desk]
            else:
                k = list1[item + 1]
                for desk in desk_list:
                    if desk.desk_user_number == k:
                        return [desk]


@management_check('GET')
def get_order_info(request):
    """
    获取订单详情
    :param request:
    :return:
    """
    if request.method == 'GET':
        order_id = request.GET.get('order_id')
        order_obj_list = Order.objects.filter(order_number=order_id)
        if not order_obj_list:
            return JsonResponse({'code': 20109, 'error': '订单不存在'})
        order_obj = order_obj_list[0]
        order_green_info_list = OrderData.objects.filter(order_info=order_obj)
        green_number = 0
        for order_green in order_green_info_list:
            green_number += order_green.number
        order_time1 = time.mktime(order_obj.create_time.timetuple())
        dateArray1 = datetime.datetime.fromtimestamp(order_time1)
        create_time = dateArray1.strftime("%Y-%m-%d %H:%M:%S")
        if order_obj.order_type == 'R':
            order_type = '预定'
        else:
            order_type = '实时'
        order_dic = {
            'order_number': order_obj.order_number,
            'order_type': order_type,
            'create_time': create_time,
            'order_price': order_obj.order_price,
            'customer_order': order_obj.customer_order.customer_phone,
            'order_user_number': order_obj.order_user_number,
            'green_number': green_number
        }
        return JsonResponse({'code': 200, 'order_dic': order_dic})
