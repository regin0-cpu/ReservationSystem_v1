import json
from wtoken.views import make_token_c, encryption
from django.http import JsonResponse
from customer.models import Customer, UserCode


# Create your views here.


def login(request):
    # 用户登录
    if request.method == 'POST':
        json_str = request.body
        if not json_str:
            result = {'code': 10200, 'error': '请正确填登录信息！'}
            return JsonResponse(result)
        json_obj = json.loads(json_str)
        username = json_obj.get('username')
        if not username:
            result = {'code': 10201, 'error': '你忘记了填写用户名！'}
            return JsonResponse(result)
        password = json_obj.get('password')
        if not password:
            result = {'code': 10202, 'error': '你忘记了填写密码！'}
            return JsonResponse(result)
        passwordmd5 = encryption(password)
        password_token = make_token_c(username, passwordmd5)

        old_username = Customer.objects.filter(customer_phone=username)
        if not old_username:
            result = {'code': 10203, 'error': '用户名或者密码错误！'}
            return JsonResponse(result)
        old_password = old_username[0].customer_password
        old_password_token = make_token_c(old_username[0].customer_phone, old_password)
        customer_name = old_username[0].customer_name
        user_phone = old_username[0].customer_phone
        if password_token == old_password_token:
            result = {'code': 200, 'token': password_token.decode(), 'username': customer_name, 'userphone': user_phone}
            return JsonResponse(result)
        else:
            result = {'code': 10204, 'error': '用户名或者密码错误！'}
            return JsonResponse(result)


def registered(request):
    # 用户注册
    if request.method == 'POST':
        json_str = request.body
        if not json_str:
            result = {'code': 10300, 'error': '请正确填登录信息！'}
            return JsonResponse(result)
        json_obj = json.loads(json_str)
        phone = json_obj.get('phone')
        if not phone:
            result = {'code': 10301, 'error': '你忘记了填写用户电话！'}
            return JsonResponse(result)
        name = json_obj.get('name')
        if not name:
            result = {'code': 10302, 'error': '你忘记了填写昵称！'}
            return JsonResponse(result)
        password1 = json_obj.get('password1')
        if not password1:
            result = {'code': 10303, 'error': '你忘记了填写密码！'}
            return JsonResponse(result)
        password2 = json_obj.get('password2')
        if not password2:
            result = {'code': 10304, 'error': '你忘记了填写确认密码！'}
            return JsonResponse(result)
        sex = json_obj.get('sex')
        if not sex:
            result = {'code': 10305, 'error': '你忘记了确认性别！'}
            return JsonResponse(result)
        if sex == 'option1':
            sex = '男'
        elif sex == 'option2':
            sex = '女'
        if password1 != password2:
            result = {'code': 10306, 'error': '两次密码不一致哦！'}
            return JsonResponse(result)
        user_code = json_obj.get('code')
        if not user_code:
            return JsonResponse({'code': 10309, 'error': '请填写验证码'})
        code_list = UserCode.objects.filter(user_phone=phone).order_by('-create_time')
        print(len(code_list))
        if user_code != code_list[0].user_code:
            return JsonResponse({'code': 10310, 'error': '验证码错误'})
        for code in code_list:
            code.delete()
        old_phone = Customer.objects.filter(customer_phone=phone)
        if old_phone:
            result = {'code': 10307, 'error': '该用户电话已被使用，请换一个电话试试！'}
            return JsonResponse(result)
        passwordmd5 = encryption(password1)
        try:
            Customer.objects.create(customer_phone=phone, customer_name=name,
                                    customer_password=passwordmd5, customer_sex=sex)

        except Exception as e:
            result = {'code': 10308, 'error': '哎呀，创建用户出了一点问题，请稍后再试！'}
            return JsonResponse(result)
        old_phone = Customer.objects.filter(customer_phone=phone)
        customer_name = old_phone[0].customer_name
        user_phone = old_phone[0].customer_phone
        password_token = make_token_c(phone, passwordmd5)
        result = {'code': 200, 'token': password_token.decode(), 'username': customer_name, 'userphone': user_phone}
        return JsonResponse(result)
