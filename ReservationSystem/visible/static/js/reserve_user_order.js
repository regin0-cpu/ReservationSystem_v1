$(function () {
    var user_token = window.localStorage.getItem('reserve_user_token');
    var user_phone = window.localStorage.getItem('reserve_user_phone');
    if (user_token) {
        $('#no_login').hide();
        $('#user').show();
        var name_str = window.localStorage.getItem('reserve_user_name');
        if (name_str.length > 5) {
            var new_name = name_str.slice(0, 5).concat('...');
            $('#user_n').html(new_name);
        } else {
            $('#user_n').html(name_str);
        }
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
            url: window.globalConfig.ROUTE + window.globalConfig.VERSIONS + 'messages/customer_orders?token=' + user_token + '&user_phone=' + user_phone,
            type: 'get',
            dataType: 'json',
            success: function (orderdata) {
                if (200 == orderdata.code) {
                    var order_list = orderdata.user_order_list;
                    var order_str = '';
                    if (order_list) {
                        if (order_list.length != 0) {
                            for (var i = 0; i < order_list.length; i++) {
                                var order_state = order_list[i].order_state;
                                var user_times = Date.parse(order_list[i].take_time);
                                var os_time = new Date().getTime();
                                if (order_state == 'P') {
                                    order_str += '<div class="col-xs-10 col-xs-offset-1 myju jumbotron">\n';
                                    order_str += '                    <h4>订单号：<span>' + order_list[i].order_number + '</span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color: #67b168">就餐中</span></h4>\n';
                                } else if (order_state == 'R') {
                                    if (user_times - os_time >= 20 * 1000 * 60) {
                                        order_str += '<div class="col-xs-10 col-xs-offset-1 myju jumbotron">\n';
                                        order_str += '                    <h4>订单号：<span>' + order_list[i].order_number + '</span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color: #31b0d5">预订中</span><button  type="button" onclick="unsubscribe_order(' + order_list[i].order_number + ');" class="pull-right btn btn-warning">退订</button></h4>\n';
                                    } else {
                                        order_str += '<div class="col-xs-10 col-xs-offset-1 myju jumbotron">\n';
                                        order_str += '                    <h4>订单号：<span>' + order_list[i].order_number + '</span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color: #31b0d5">预订中</span></h4>\n';
                                    }
                                } else if (order_state == 'O') {
                                    order_str += '<div style="color: gray" class="col-xs-10 col-xs-offset-1 myju jumbotron">\n';
                                    order_str += '                    <h4>订单号：<span>' + order_list[i].order_number + '</span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color: #5bc0de">已就餐</span><button type="button" onclick="remove_order(' + order_list[i].order_number + ');" class="pull-right btn btn-danger">删除</button></h4>\n';
                                } else if (order_state == 'S') {
                                    order_str += '<div style="color: gray" class="col-xs-10 col-xs-offset-1 myju jumbotron">\n';
                                    order_str += '                    <h4>订单号：<span>' + order_list[i].order_number + '</span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color: red">已取消</span><button type="button" onclick="remove_order(' + order_list[i].order_number + ');" class="pull-right btn btn-danger">删除</button></h4>\n';
                                } else if (order_state == 'L') {
                                    order_str += '<div style="color: gray" class="col-xs-10 col-xs-offset-1 myju jumbotron">\n';
                                    order_str += '                    <h4>订单号：<span>' + order_list[i].order_number + '</span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>已失效</span><button type="button" onclick="remove_order(' + order_list[i].order_number + ');" class="pull-right btn btn-danger">删除</button></h4>\n';
                                } else {
                                    order_str += '<div style="color: gray" class="col-xs-10 col-xs-offset-1 myju jumbotron">\n';
                                    order_str += '                    <h4>订单号：<span>' + order_list[i].order_number + '</span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color: #d9534f">有问题</span><button type="button" onclick="remove_order(' + order_list[i].order_number + ');" class="pull-right btn btn-danger">删除</button></h4>\n';
                                }
                                order_str += '                    <p></p>\n' +
                                    '                    <h5 class="row order_message">\n' +
                                    '                        <sapn class="col-sm-offset-6 glyphicon glyphicon-user">\n' + order_list[i].order_user_number + '</sapn>\n' +
                                    '                        <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>\n' +
                                    '                        <sapn class="glyphicon glyphicon-time">\n' + order_list[i].take_time + '</sapn>\n' +
                                    '                        <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>\n' +
                                    '                        <sapn class="glyphicon glyphicon-pushpin">\n' + '预定' + '</sapn>\n' +
                                    '                    </h5>\n' +
                                    '                </div>'
                            }
                            $('#nrcp').html(order_str)
                        } else {
                            order_str = '<div class="col-xs-10 col-xs-offset-1 jumbotron">\n' +
                                '                <h1>空空如也</h1>\n' +
                                '                <p>饿了吗？别急，先去点个菜～</p>\n' +
                                '                <p><a class="btn btn-primary btn-lg" href="reserve_user" role="button">GO！</a></p>\n' +
                                '            </div>';
                            $('#nrcp').html(order_str)
                        }
                    } else {
                        order_str = '<div class="col-xs-10 col-xs-offset-1 jumbotron">\n' +
                            '                <h1>空空如也</h1>\n' +
                            '                <p>饿了吗？别急，先去点个菜～</p>\n' +
                            '                <p><a class="btn btn-primary btn-lg" href="reserve_user" role="button">GO！</a></p>\n' +
                            '            </div>';
                        $('#nrcp').html(order_str)
                    }
                } else {
                    $('#login_ti').on('show.bs.modal', function (event) {
                        var modal = $(this);
                        modal.find('.modal-title').text('提示信息');
                        modal.find('.modal-body').html(orderdata.error);
                    });
                    $('#login_ti').modal('show');
                }
            }
        });
    } else {
        $('#login_ti').modal('show');
    }
});

function remove_order(order_id) {
    //删除订单
    var user_token = window.localStorage.getItem('reserve_user_token');
    var user_phone = window.localStorage.getItem('reserve_user_phone');
    if (user_token) {
        $.ajax({
            url: window.globalConfig.ROUTE + window.globalConfig.VERSIONS + 'messages/customer_orders',
            type: 'delete',
            data: JSON.stringify({'order_id': order_id, 'token': user_token, 'user_phone': user_phone}),
            dataType: 'json',
            success: function (orderdata) {
                if (200 == orderdata.code) {
                    window.location.reload()
                } else {
                    $('#login_ti').on('show.bs.modal', function (event) {
                        var modal = $(this);
                        modal.find('.modal-title').text('提示信息');
                        modal.find('.modal-body').text(orderdata.error);
                    });
                    $('#login_ti').modal('show');
                }
            }
        });
    }
}

function unsubscribe_order(order_id) {
    //取消订单
    var user_token = window.localStorage.getItem('reserve_user_token');
    var user_phone = window.localStorage.getItem('reserve_user_phone');
    if (user_token) {
        $.ajax({
            url: window.globalConfig.ROUTE + window.globalConfig.VERSIONS + 'messages/customer_orders',
            type: 'put',
            data: JSON.stringify({
                'order_id': order_id,
                'token': user_token,
                'user_phone': user_phone,
                'operate': 'cancel'
            }),
            dataType: 'json',
            success: function (orderdata) {
                if (200 == orderdata.code) {
                    window.location.reload()
                } else {
                    $('#login_ti').on('show.bs.modal', function (event) {
                        var modal = $(this);
                        modal.find('.modal-title').text('提示信息');
                        modal.find('.modal-body').text(orderdata.error);
                    });
                    $('#login_ti').modal('show');
                }
            }
        });
    }
}

