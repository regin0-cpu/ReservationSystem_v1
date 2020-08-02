from message.models import Order
import time


# 数据库更新函数 用于检查过期订单
def update_orders():
    os_time = time.time()
    user_orders = Order.objects.filter(order_isActive=False, order_state='R')
    for order in user_orders:
        order_time = str(order.take_time)
        try:
            timeStruct = time.strptime(order_time, "%Y-%m-%d %H:%M:%S")
            order_time2 = int(time.mktime(timeStruct))
            if order_time2 < os_time:
                order.order_state = 'L'
                order.save()
        except Exception as e:
            print(e)
