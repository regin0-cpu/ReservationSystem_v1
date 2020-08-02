import random

from django.http import JsonResponse
from .models import UserCode, Customer
from .tasks import tasks_code


def codes():
    code_str = ''
    for i in range(6):
        a = random.randint(0, 9)
        code_str += str(a)
    return code_str


# 发送验证码  以后完善
def code(request):
    try:
        phone = request.GET.get('user_phone')
        user_list = UserCode.objects.filter(user_phone=phone)
        if len(user_list) >= 5:
            return JsonResponse({'code': 10103, 'error': '检测到您是恶意攻击(账号已加入黑名单)'})
        user_list2 = Customer.objects.filter(customer_phone=phone)
        if user_list2:
            return JsonResponse({'code': 10104, 'error': '账号已注册'})
        code_str = codes()
        UserCode.objects.create(user_phone=phone, user_code=code_str)
        tuple01 = (phone, code_str)
        tasks_code.delay(tuple01)
        return JsonResponse({'code': '200'})
    except Exception as e:
        print(e)
        return JsonResponse({'code': '10102', 'error': '发送失败'})
