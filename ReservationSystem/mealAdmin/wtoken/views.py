import jwt
from hashlib import md5
import uuid


# 生成管理员令牌
def make_token_m(username, password):
    key = '123456'
    payload = {'username': username, 'password': password}
    return jwt.encode(payload, key, algorithm='HS256')


# 生成顾客令牌
def make_token_c(username, password):
    key = '123456'
    payload = {'username': username, 'password': password}
    return jwt.encode(payload, key, algorithm='HS256')


# 加密
def encryption(password):
    s = md5()
    password = str(password)
    s.update(password.encode())
    password = s.hexdigest()
    return password


# 生成ID
def get_id():
    array = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
    id = str(uuid.uuid4()).replace("-", '')
    buffer = []
    for i in range(0, 8):
        start = i * 4
        end = i * 4 + 4
        val = int(id[start:end], 16)
        buffer.append(array[val % 9])
    return "".join(buffer)
