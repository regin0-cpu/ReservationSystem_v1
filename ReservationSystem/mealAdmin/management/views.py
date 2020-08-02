import json
from django.http import JsonResponse
from wtoken.views import make_token_m, encryption
from management.models import Management, ShopMassage


# Create your views here.


def get_site(request):
    if request.method == 'GET':
        shop = ShopMassage.objects.all()[0]
        dic = dict()
        dic['shop_name'] = shop.shop_name
        dic['shop_site'] = shop.shop_site
        dic['shop_longitude'] = shop.shop_longitude
        dic['shop_latitude'] = shop.shop_latitude
        return JsonResponse({'code': 200, 'shop': dic})


def admin_login(request):
    # 管理员登录
    if request.method == 'POST':
        json_str = request.body
        if not json_str:
            result = {'code': 10100, 'error': '请正确填登录信息！'}
            return JsonResponse(result)
        json_obj = json.loads(json_str)
        username = json_obj.get('username')
        if not username:
            result = {'code': 10101, 'error': '你忘记了填写用户名！'}
            return JsonResponse(result)
        password = json_obj.get('password')
        if not password:
            result = {'code': 10102, 'error': '你忘记了填写密码！'}
            return JsonResponse(result)
        passwordmd5 = encryption(password)
        password_token = make_token_m(username, passwordmd5)
        old_username = Management.objects.filter(admin_phone=username)
        if not old_username:
            result = {'code': 10103, 'error': '用户名或者密码错误！'}
            return JsonResponse(result)
        old_password = old_username[0].admin_password
        old_password_token = make_token_m(old_username[0].admin_phone, old_password)
        admin_phone = old_username[0].admin_phone
        if password_token == old_password_token:
            result = {'code': 200, 'token': password_token.decode(), 'admin_phone': admin_phone}
            return JsonResponse(result)
        else:
            result = {'code': 10104, 'error': '用户名或者密码错误！'}
            return JsonResponse(result)
