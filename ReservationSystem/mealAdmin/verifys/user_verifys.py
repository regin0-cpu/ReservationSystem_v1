import json

from django.http import JsonResponse

from customer.models import Customer
from wtoken.views import make_token_c


def user_check(*methods):
    def _user_check(func):
        def wrapper(request, *args, **kwargs):
            if not methods:
                return func(request, *args, **kwargs)
            else:
                if request.method not in methods:
                    return func(request, *args, **kwargs)
            if request.method == 'GET':
                user_token = request.GET.get('token')
                user_phone = request.GET.get('user_phone')
            else:
                json_str = request.body
                json_obj = json.loads(json_str)
                user_token = json_obj.get('token')
                user_phone = json_obj.get('user_phone')
            if not user_phone and not user_token:
                return JsonResponse({'code': 10501, 'error': '登陆信息有误,请重新登陆'})
            try:
                user = Customer.objects.get(customer_phone=user_phone)
            except Exception as e:
                return JsonResponse({'code': 10502, 'error': '登陆信息有误,请重新登陆'})
            user_phone = user.customer_phone
            user_password = user.customer_password
            str_token = make_token_c(user_phone, user_password).decode()
            if str_token != user_token:
                return JsonResponse({'code': 10503, 'error': '登陆信息有误,请重新登陆'})

            return func(request, *args, **kwargs)

        return wrapper

    return _user_check
