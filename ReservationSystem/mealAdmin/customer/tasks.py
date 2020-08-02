from __future__ import unicode_literals
# -*- coding: utf-8 -*-
from datetime import datetime
from mealAdmin.code_info import app
import hashlib
import base64
import requests
import json


@app.task
def tasks_code(tuple01):
    config = {
        "accountSid": "8a216da86e011fa3016e4572c19b2614",  # 主账户id
        "appToken": "f810d5cf7d0342f6a0e1ca3e2bc316b7",  # 令牌
        "appId": "8a216da86e011fa3016e4572c1ee261a",  # 应用id
        "templateId": "1"  # 模版id
    }
    phone = '13885617254'  # 手机号，如果是多个手机号用英文的,分割 比如说13200000000,13300000000
    code = tuple01[1] + '(' + tuple01[0] + ')'  # 验证码
    yun = YunTongXin(**config)
    res = yun.run(phone, code)
    print(res)


class YunTongXin():
    # 生产环境的base_url
    base_url = 'https://app.cloopen.com:8883'
    timestamp = None

    def __init__(self, accountSid, appToken, appId, templateId, notice=''):
        self.accountSid = accountSid  # 开发者主账户 ACCOUNT SID
        self.appToken = appToken  # 账户授权令牌
        self.appId = appId  # 应用id
        self.templateId = templateId  # 模版id
        self.notice = notice  # 提示信息

    # 构造请求url
    def gen_request_url(self, sig):
        self.url = self.base_url + \
                   '/2013-12-26/Accounts/{}/SMS/TemplateSMS?sig={}'.format(
                       self.accountSid, sig)
        return self.url

    # 构造请求头
    def gen_request_header(self, timestamp):
        authorization = self.gen_authorization(timestamp)
        return {
            "Accept": "application/json",
            "Content-Type": "application/json;charset=utf-8",
            "Authorization": authorization
        }

    # 构建请求体
    def gen_request_body(self, phone, code):
        return {
            "to": phone,
            "appId": self.appId,
            "templateId": self.templateId,
            "datas": [code, "3"]
        }

    # 获取 Authorization
    def gen_authorization(self, timestamp):
        return self.base64_encode(self.accountSid + ':' + timestamp)

    # base64加密
    def base64_encode(self, raw):
        return base64.b64encode(raw.encode('utf-8')).decode()

    # 生成签名文档
    def gen_sig(self, timestamp):
        return self.md5(self.accountSid + self.appToken + timestamp)

    # 生成时间戳
    def gen_timestamp(self):
        return datetime.now().strftime('%Y%m%d%H%M%S')

    # md5加密
    def md5(self, raw):
        md5 = hashlib.md5()
        md5.update(raw.encode('utf-8'))
        return md5.hexdigest().upper()

    # 请求云通信接口
    def request_yuntongxin_api(self, url, header, body):
        response = requests.post(url, headers=header, data=body)
        return response.text

    # 运行
    def run(self, phone, code):
        # 获取时间戳
        timestamp = self.gen_timestamp()
        # 生成签名
        sig = self.gen_sig(timestamp)
        # 请求url
        url = self.gen_request_url(sig)
        # 请求头
        header = self.gen_request_header(timestamp)
        # 请求体
        body = self.gen_request_body(phone, code)
        # 请求云通信接口
        data = self.request_yuntongxin_api(url, header, json.dumps(body))
        return data
