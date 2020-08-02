//查看购物车
$(function () {
    var user_token = window.localStorage.getItem('now_user_token');
    var user_phone = window.localStorage.getItem('now_user_phone');
    var get_url = window.globalConfig.ROUTE + window.globalConfig.VERSIONS + 'messages/customer_shoppingcart?token=' + user_token + '&user_phone=' + user_phone;
    if (user_token) {
        $('#no_login').hide();
        $('#user').show();
        var name_str = window.localStorage.getItem('now_user_name');
        $('#desk').html(name_str);
        $.ajax({
            url: window.globalConfig.ROUTE + window.globalConfig.VERSIONS + 'messages/customer_shoppingcart',
            dataType: 'json',
            data: JSON.stringify({'token': user_token, 'user_phone': user_phone}),
            type: 'post',
            success: function (greendata) {
                if (200 == greendata.code) {
                    $('#green_number').text(greendata.green_number);
                }
            }
        });
        $.ajax({
            url: get_url,
            type: 'get',
            dataType: 'json',
            success: function (greendata) {
                if (200 == greendata.code) {
                    var cart_list = greendata.cart_list;
                    var green_str = '';
                    var greens_numbers = 0;
                    if (cart_list.length != 0) {
                        for (var i = 0; i < cart_list.length; i++) {
                            greens_numbers += cart_list[i].green_number;
                            var n = Math.ceil(Math.random() * 5);
                            if (n == 0) {
                                green_str += '<div class="mypanel col-xs-10 col-xs-offset-1 panel panel-primary">';
                            } else if (n == 1) {
                                green_str += '<div class="mypanel col-xs-10 col-xs-offset-1 panel panel-info">';

                            } else if (n == 2) {
                                green_str += '<div class="mypanel col-xs-10 col-xs-offset-1 panel panel-success">';

                            } else if (n == 3) {
                                green_str += '<div class="mypanel col-xs-10 col-xs-offset-1 panel panel-warning">';

                            } else {
                                green_str += '<div class="mypanel col-xs-10 col-xs-offset-1 panel panel-danger">';

                            }
                            green_str += '<div class="panel-heading">' +
                                '<h3 class="panel-title">' +
                                '<span class="green_name_x">' + cart_list[i].green_name + '</span>' +
                                '<button onclick="cose_green(' + cart_list[i].green_id1 + ');" class="cose">' +
                                '<span class="glyphicon glyphicon-remove-circle"></span>' +
                                '</button>' +
                                '</h3>' +
                                '</div>' +
                                '<div class="panel-body">' +
                                '<div class="left1">' +
                                '<span class="glyphicon glyphicon-yen"></span>' +
                                '<span id="' + cart_list[i].green_id1 + 'price">' + cart_list[i].green_price_all + '</span>' +
                                '</div>' +
                                '<div class="right1">' +
                                '<button class="btn_cre btn-default" onclick="sub_green(' + cart_list[i].green_id1 + ');"><span class="glyphicon glyphicon-minus"></span></button>' +
                                '<span class="green_number_x" id="' + cart_list[i].green_id1 + 'number">&nbsp;&nbsp;' + cart_list[i].green_number + '&nbsp;&nbsp;</span>' +
                                '<button class="btn_cre btn-default"><span class="glyphicon glyphicon-plus" onclick="add_green(' + cart_list[i].green_id1 + ');"></span></button>' +
                                '</div>' +
                                '</div>' +
                                '</div>'
                        }
                        green_str += '<div class="submit_panel panel panel-default col-xs-10 col-xs-offset-1">\n' +
                            '                <div class="panel-body">\n' +
                            '                    <button id="car_submit" onclick="add_order();" type="button" class="btn btn-success">\n' +
                            '                        提交\n' +
                            '                    </button>\n' +
                            '                </div>\n' +
                            '            </div>';
                        $('#nrcp').html(green_str);
                        $('#green_number').text(greens_numbers);
                    } else {
                        green_str = '<div class="col-xs-10 col-xs-offset-1 jumbotron">\n' +
                            '                <h1>空空如也</h1>\n' +
                            '                <p>饿了吗？别急，先去点个菜～</p>\n' +
                            '                <p><a class="btn btn-primary btn-lg" href="now_user" role="button">GO！</a></p>\n' +
                            '            </div>';
                        $('#nrcp').html(green_str)
                    }
                } else {
                    $('#login_ti').on('show.bs.modal', function (event) {
                        var modal = $(this);
                        modal.find('.modal-title').text('提示信息');
                        modal.find('.modal-body').text(greendata.error);
                    });
                    $('#login_ti').modal('show');
                }
            }
        });
    } else {
        $('#login_ti').on('show.bs.modal', function (event) {
            var modal = $(this);
            modal.find('.modal-title').text('提示信息');
            modal.find('.modal-body').html('非法访问');
        });
        $('#login_ti').modal('show');
    }
});

function cose_green(green_id) {
    // 删除购物车某菜品
    console.log(green_id);
    var user_token = window.localStorage.getItem('now_user_token');
    var user_phone = window.localStorage.getItem('now_user_phone');
    var get_url = window.globalConfig.ROUTE + window.globalConfig.VERSIONS + 'messages/customer_shoppingcart';
    var post_data = {'token': user_token, 'user_phone': user_phone, 'green_id': green_id};
    if (user_token) {
        $.ajax({
            url: get_url,
            type: 'delete',
            dataType: 'json',
            data: JSON.stringify(post_data),
            success: function (ruslt) {
                if (ruslt.code == 200) {
                    window.location.reload()
                } else {
                    $('#login_ti').on('show.bs.modal', function (event) {
                        var modal = $(this);
                        modal.find('.modal-title').text('提示信息');
                        modal.find('.modal-body').text(greendata.error);
                    });
                    $('#login_ti').modal('show');
                }
            }
        });
    }
}

function add_green(green_id1) {
    //增加购物车某菜品的数量
    var green_id = green_id1.toString();
    var user_token = window.localStorage.getItem('now_user_token');
    var user_phone = window.localStorage.getItem('now_user_phone');
    if (user_token) {
        $.ajax({
            url: window.globalConfig.ROUTE + window.globalConfig.VERSIONS + 'messages/customer_shoppingcart',
            dataType: 'json',
            data: JSON.stringify({
                'handle': 'add',
                'green_id': green_id,
                'token': user_token,
                'user_phone': user_phone
            }),
            type: 'PUT',
            success: function (greendata) {
                if (200 == greendata.code) {
                    $('#green_number').text(greendata.greens_number);
                    $('#' + green_id1 + 'number').html('&nbsp;&nbsp;' + greendata.green_number + '&nbsp;&nbsp;');
                    $('#' + green_id1 + 'price').text(greendata.green_number * greendata.green_price);

                } else {
                    $('#login_ti').on('show.bs.modal', function (event) {
                        var modal = $(this);
                        modal.find('.modal-title').text('提示信息');
                        modal.find('.modal-body').text(greendata.error);
                    });
                    $('#login_ti').modal('show');
                }
            }
        });
    } else {
        $('#login_ti').on('show.bs.modal', function (event) {
            var modal = $(this);
            modal.find('.modal-title').text('提示信息');
            modal.find('.modal-body').html('非法访问');
        });
        $('#login_ti').modal('show');
    }
}

function sub_green(green_id2) {
    //减少购物车某菜品的数量
    var green_id = green_id2.toString();
    var user_token = window.localStorage.getItem('now_user_token');
    var user_phone = window.localStorage.getItem('now_user_phone');
    if (user_token) {
        $.ajax({
            url: window.globalConfig.ROUTE + window.globalConfig.VERSIONS + 'messages/customer_shoppingcart',
            dataType: 'json',
            data: JSON.stringify({
                'handle': 'sub',
                'green_id': green_id,
                'token': user_token,
                'user_phone': user_phone
            }),
            type: 'PUT',
            success: function (greendata) {
                if (200 == greendata.code) {
                    var number = greendata.green_number;
                    if (number) {
                        $('#green_number').text(greendata.greens_number);
                        $('#' + green_id2 + 'number').html('&nbsp;&nbsp;' + greendata.green_number + '&nbsp;&nbsp;');
                        $('#' + green_id2 + 'price').text(greendata.green_number * greendata.green_price);
                    } else {
                        window.location.reload()
                    }

                } else {
                    $('#login_ti').on('show.bs.modal', function (event) {
                        var modal = $(this);
                        modal.find('.modal-title').text('提示信息');
                        modal.find('.modal-body').text(greendata.error);
                    });
                    $('#login_ti').modal('show');
                }
            }
        });
    } else {
        $('#login_ti').on('show.bs.modal', function (event) {
            var modal = $(this);
            modal.find('.modal-title').text('提示信息');
            modal.find('.modal-body').html('非法访问');
        });
        $('#login_ti').modal('show');
    }
}

//提交订单
function add_order() {
    var user_token = window.localStorage.getItem('now_user_token');
    var user_phone = window.localStorage.getItem('now_user_phone');
    if (user_token) {
        var get_url = window.globalConfig.ROUTE + window.globalConfig.VERSIONS + 'messages/customer_shoppingcart?token=' + user_token + '&user_phone=' + user_phone;
        $.ajax({
            url: get_url,
            type: 'get',
            dataType: 'json',
            success: function x(greendata) {
                if (200 == greendata.code) {
                    var greens_price_all = 0;
                    var cart_list = greendata.cart_list;
                    if (cart_list.length != 0) {
                        for (var i = 0; i < cart_list.length; i++) {
                            greens_price_all = greens_price_all + parseInt(cart_list[i].green_price_all);
                        }
                    }
                    var name = [];
                    $('.green_name_x').each(function (k, v) {
                        name.push($(v).text())
                    });
                    var number = [];
                    $('.green_number_x').each(function (j, i) {
                        number.push($(i).text().trim())
                    });
                    var message = '';
                    for (var o = 0; o < name.length; o++) {
                        message += '<li class="list-group-item">\n' +
                            '                            <span id="number" class="badge">' + number[o] + '</span>\n' +
                            '                            <span id="name">' + name[o] + '</span>\n' +
                            '                        </li>'
                    }
                    $('#car_message_model').on('show.bs.modal', function (event) {
                        var modal = $(this);
                        modal.find('.modal-body #message').html(message);
                        modal.find('.modal-body #d_price').html(greens_price_all);
                    });
                    $('#car_message_model').modal('show');
                }
            }
        });
    } else {
        $('#login_ti').on('show.bs.modal', function (event) {
            var modal = $(this);
            modal.find('.modal-title').text('提示信息');
            modal.find('.modal-body').html('非法访问');
        });
        $('#login_ti').modal('show');
    }
}

$('#order_submit').on('click', function () {
    // 用户提交订单
    var user_token = window.localStorage.getItem('now_user_token');
    var user_phone = window.localStorage.getItem('now_user_phone');
    var desk = window.localStorage.getItem('now_user_name');
    if (user_token) {
        var user_number = parseInt($('#user_number').val());
        if (user_number >= 1) {
            $.ajax({
                url: window.globalConfig.ROUTE + window.globalConfig.VERSIONS + 'pay/user_pay',
                dataType: 'json',
                data: JSON.stringify({
                    'desk': desk,
                    'token': user_token,
                    'user_phone': user_phone,
                    'user_number': user_number
                }),
                type: 'post',
                success: function (pay_data) {
                    $('#login_error').html('<button type="button" class="btn btn-success pull-left">' + '正在前往支付宝支付，订单正在准备中' + '</button>');
                    if (200 == pay_data.code) {
                        var timeid = setTimeout(function () {
                            $('#car_message_model').modal('hide');
                            window.location = pay_data.pay_url;
                            clearTimeout(timeid);
                        }, 2000);
                    } else {
                        $('#login_error').html('<button type="button" class="btn btn-danger pull-left">' + '订单未支付' + '</button>');
                    }
                }
            });
        } else {
            $('#login_error').html('<button type="button" class="btn btn-danger pull-left">' + '人数不符合规范' + '</button>')
        }
    }

});

//关闭浏览器 清空user数据
window.onbeforeunload = function () {
    if (event.clientX > document.body.clientWidth && event.clientY < 0 || event.altKey) {
        window.localStorage.removeItem('now_user_token');
        window.localStorage.removeItem('now_user_name');
        window.localStorage.removeItem('now_user_phone');
    }
};