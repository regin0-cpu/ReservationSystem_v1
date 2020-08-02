import json
from django.http import JsonResponse
from management.models import Management
from wtoken.views import make_token_m


def management_check(*methods):
    def _user_check(func):
        def wrapper(request, *args, **kwargs):
            if not methods:
                return func(request, *args, **kwargs)
            else:
                if request.method not in methods:
                    return func(request, *args, **kwargs)
            if request.method == 'GET':
                user_token = request.GET.get('management_token')
                user_phone = request.GET.get('management_phone')
            else:
                json_str = request.body
                json_obj = json.loads(json_str)
                user_token = json_obj.get('management_token')
                user_phone = json_obj.get('management_phone')
            if not user_phone and not user_token:
                return JsonResponse({'code': 10501, 'error': '登陆信息有误,请重新登陆'})
            try:
                user = Management.objects.get(admin_phone=user_phone)
            except Exception as e:
                return JsonResponse({'code': 10502, 'error': '登陆信息有误,请重新登陆'})
            user_phone = user.admin_phone
            user_password = user.admin_password
            str_token = make_token_m(user_phone, user_password).decode()
            if str_token != user_token:
                return JsonResponse({'code': 10503, 'error': '登陆信息有误,请重新登陆'})

            return func(request, *args, **kwargs)

        return wrapper

    return _user_check
