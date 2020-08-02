from flask import Flask, send_file

app = Flask(__name__)


@app.route('/management')
def management_index():
    return send_file('templates/management.html')

@app.route('/reserve_user')
def customer_index():
    return send_file('templates/reserve_user.html')

@app.route('/reserve_cart')
def reserve_cart():
    return send_file('templates/reserve_cart.html')

@app.route('/reserve_order')
def reserve_order():
    return send_file('templates/reserve_order.html')

@app.route('/site_message')
def site():
    return send_file('templates/site.html')

@app.route('/user')
def user():
    return send_file('templates/user.html')

@app.route('/pay1')
def pay1():
    return send_file('templates/pay1.html')

@app.route('/pay2')
def pay2():
    return send_file('templates/pay2.html')
@app.route('/pay3')
def pay3():
    return send_file('templates/pay3.html')

@app.route('/pay4')
def pay4():
    return send_file('templates/pay4.html')

@app.route('/now_user')
def now_user():
    return send_file('templates/now_user.html')

@app.route('/now_cart')
def now_cart():
    return send_file('templates/now_cart.html')

@app.route('/now_order')
def now_order():
    return send_file('templates/now_order.html')


if __name__ == '__main__':
    app.run(debug=True)
