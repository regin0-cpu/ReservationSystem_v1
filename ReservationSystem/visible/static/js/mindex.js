$(function () {

});


const login = $('#login');
const gl = $('.gl');
const lock = $('#lock');


/*预定订单开始*/

$('#reserve').on('click', function () {
    // 提示：
    gl.each(function (k, e) {
        e.style.color = '#fff'
    });
    const refresh = $('#refresh');
    const lock = $('#lock');
    refresh.off('click');
    refresh.removeClass('refresh_indent');
    refresh.removeClass('refresh_cuisine');
    refresh.addClass('refresh_reserve');
    this.style.color = '#ff5783';
    refresh.removeClass('refresh-dh2');
    refresh.addClass('refresh-dh1');
    lock.removeClass('lock-dh2');
    lock.addClass('lock-dh1');
    // 主体
    reserve_order();
    $('.refresh_reserve').on(
        'click',
        function () {
            reserve_order();
        }
    );
});


function reserve_order() {
    // 查看预定订单
    var management_token = window.localStorage.getItem('managements_token');
    var user_name = window.localStorage.getItem('managements_phone');
    $.ajax({
        url: window.globalConfig.ROUTE + window.globalConfig.VERSIONS + 'messages/management_reserve_order?management_token=' + management_token + '&management_phone=' + user_name,
        type: 'get',
        dataType: 'json',
        success: function (result) {
            if (result.code == 200) {
                // 请求成功
                var order_list = result.order_list;
                var order_str = '';
                if (order_list) {
                    for (var i = 0; i < order_list.length; i++) {
                        order_str += '<div id="' + order_list[i].order_number + 'div" class="data alert alert-info alert-dismissible" role="alert">\n' +
                            '        <button onclick="reserve_indent(' + order_list[i].order_number + ');" type="button" class="close"><span\n' +
                            '                aria-hidden="true" class="reserve_but glyphicon glyphicon-cutlery"></span></button>\n' +
                            '        <strong><span class="ico glyphicon glyphicon-bookmark"></span><span onclick="order_info(' + order_list[i].order_number + ')" class="into_h into">' + order_list[i].order_number + '</span></strong>\n' +
                            '        <strong><span class="ico glyphicon glyphicon-yen"></span></strong><span class="into">' + parseFloat(order_list[i].order_price).toFixed(1) + '</span>\n' +
                            '        <strong><span class="ico glyphicon glyphicon-compressed"></span></strong><span class="into">' + parseFloat(order_list[i].order_price * (40 / 100)).toFixed(1) + '</span>\n' +
                            '        <strong><span class="ico glyphicon glyphicon-time"></span></strong><span class="into">' + order_list[i].take_time + '</span>\n' +
                            '        <strong><span class="ico glyphicon glyphicon-user"></span></strong><span class="into">' + order_list[i].order_user_number + '</span>\n' +
                            '    </div>'
                    }
                }
                $('#info').html(order_str);
            } else {
                $('#order_ti').on('show.bs.modal', function (event) {
                    var modal = $(this);
                    modal.find('.modal-title').text('提示信息');
                    modal.find('.modal-body').text(result.error);
                });
                $('#order_ti').modal('show');
            }
        }
    });
}

function reserve_indent(order_id) {
    // 完成预定订单
    var management_token = window.localStorage.getItem('managements_token');
    var user_name = window.localStorage.getItem('managements_phone');
    var post_data = {'management_token': management_token, 'management_phone': user_name, 'order_id': order_id};
    $.ajax({
        // url
        url: window.globalConfig.ROUTE + window.globalConfig.VERSIONS + "messages/management_reserve_order",

        // 请求方式
        type: "post",
        // contentType
        // dataType
        dataType: "json",
        // 把JS的对象或数组序列化一个json 字符串
        data: JSON.stringify(post_data),
        // result 为请求的返回结果对象
        success: function (result) {
            if (result.code == 200) {
                $('#' + order_id.toString() + 'div').hide();
            } else {
                $('#order_ti').on('show.bs.modal', function (event) {
                    var modal = $(this);
                    modal.find('.modal-title').text('提示信息');
                    modal.find('.modal-body').text(result.error);
                });
                $('#order_ti').modal('show');
            }
        }
    });
}

/*预定订单结束*/

/*实时订单开始*/
$('#indent').on('click', function () {
    indent_order();
});

function indent_order() {
    // 查看实时订单
    gl.each(function (k, e) {
        e.style.color = '#fff'
    });
    $('#indent').css('color', '#ff5783');
    const refresh = $('#refresh');
    const lock = $('#lock');
    refresh.removeClass('refresh-dh2');
    refresh.addClass('refresh-dh1');
    lock.removeClass('lock-dh2');
    lock.addClass('lock-dh1');
    refresh.off('click');
    refresh.removeClass('refresh_cuisine');
    refresh.removeClass('refresh_reserve');
    refresh.addClass('refresh_indent');
    $('.refresh_indent').on(
        'click',
        function () {
            indent_order();
        }
    );

    var management_token = window.localStorage.getItem('managements_token');
    var user_name = window.localStorage.getItem('managements_phone');
    $.ajax({
        url: window.globalConfig.ROUTE + window.globalConfig.VERSIONS + 'messages/management_indent_order?management_token=' + management_token + '&management_phone=' + user_name,
        type: 'get',
        dataType: 'json',
        success: function (result) {
            if (result.code == 200) {
                // 请求成功
                var order_list = result.order_list;
                var order_str = '';
                if (order_list) {
                    for (var i = 0; i < order_list.length; i++) {
                        order_str += '<div id="' + order_list[i].order_number + 'div" class="data alert alert-success alert-dismissible" role="alert">\n' +
                            '        <button onclick="indent_cuisine(' + order_list[i].order_number + ');" type="button" class="close"><span\n' +
                            '                aria-hidden="true" class="glyphicon glyphicon-saved"></span></button>\n' +
                            '        <button id="' + order_list[i].order_number + 'but1" onclick="order_green_examine(' + order_list[i].order_number + ')" type="button" class="close"><span\n' +
                            '                 class="down_order glyphicon glyphicon-chevron-down"></span></button>\n' +
                            '        <button id="' + order_list[i].order_number + 'but2" onclick="order_green_hide(' + order_list[i].order_number + ')" type="button" class="down_order2 close"><span\n' +
                            '                 class="down_order glyphicon glyphicon-chevron-up"></span></button>\n' +
                            '        <strong><span class="ico glyphicon glyphicon-bookmark"></span><span class="into_h into" onclick="order_info(' + order_list[i].order_number + ');">' + order_list[i].order_number + '</span></strong>\n' +
                            '        <strong><span class="ico glyphicon glyphicon-yen"></span></strong><span class="into">' + parseFloat(order_list[i].order_price).toFixed(1) + '</span>\n' +
                            '        <strong><span class="ico glyphicon glyphicon-map-marker"></span></strong><span class="into">';
                        for (var j = 0; j < order_list[i].order_desk_list.length; j++) {
                            order_str += (order_list[i].order_desk_list[j] + ' ');
                        }
                        order_str += '</span>\n' +
                            '        <strong><span class="ico glyphicon glyphicon-time"></span></strong><span class="into">' + order_list[i].take_time + '</span>\n' +
                            '        <strong><span class="ico glyphicon glyphicon-user"></span></strong><span class="into">' + order_list[i].order_user_number + '</span>\n' +
                            '<div id="' + order_list[i].order_number + 'info" class="green_info"></div>' +
                            '    </div>'
                    }
                }
                $('#info').html(order_str);
            } else {
                $('#order_ti').on('show.bs.modal', function (event) {
                    var modal = $(this);
                    modal.find('.modal-title').text('提示信息');
                    modal.find('.modal-body').text(result.error);
                });
                $('#order_ti').modal('show');
            }
        }
    });

}

function indent_cuisine(order_id) {
    // 完成实时订单
    var management_token = window.localStorage.getItem('managements_token');
    var user_name = window.localStorage.getItem('managements_phone');
    var post_data = {'management_token': management_token, 'management_phone': user_name, 'order_id': order_id};
    $.ajax({
        // url
        url: window.globalConfig.ROUTE + window.globalConfig.VERSIONS + "messages/management_indent_order",

        // 请求方式
        type: "post",
        // contentType
        // dataType
        dataType: "json",
        // 把JS的对象或数组序列化一个json 字符串
        data: JSON.stringify(post_data),
        // result 为请求的返回结果对象
        success: function (result) {
            if (result.code == 200) {
                $('#' + order_id.toString() + 'div').hide();
            } else {
                $('#order_ti').on('show.bs.modal', function (event) {
                    var modal = $(this);
                    modal.find('.modal-title').text('提示信息');
                    modal.find('.modal-body').text(result.error);
                });
                $('#order_ti').modal('show');
            }
        }
    });
}

function order_green_examine(order_id) {
    /*查看订单菜品*/
    var management_token = window.localStorage.getItem('managements_token');
    var user_name = window.localStorage.getItem('managements_phone');
    var green_str = '';
    $.ajax({
        url: window.globalConfig.ROUTE + window.globalConfig.VERSIONS + 'messages/get_order_green?management_token=' + management_token + '&management_phone=' + user_name + '&order_id=' + order_id,
        type: 'get',
        dataType: 'json',
        success: function (result) {
            if (result.code == 200) {
                var green_list = result.order_green_list;
                var o = green_list.length;
                var info = $('#' + order_id.toString() + 'info');
                info.show();
                for (var k = 0; k < o; k++) {
                    green_str += '<h5 class="info_green">' + green_list[k].green_name + ' <span class="label label-info">×' + green_list[k].green_number + '</span></h5>'
                }
                const div_height = (parseInt(o / 4) + 1) * 30;
                info.animate({height: div_height.toString() + 'px'},
                    100, function () {
                        $('#' + order_id.toString() + 'but1').hide();
                        $('#' + order_id.toString() + 'but2').show();
                    }
                );
                info.html(green_str);
            } else {
                $('#order_ti').on('show.bs.modal', function (event) {
                    var modal = $(this);
                    modal.find('.modal-title').text('提示信息');
                    modal.find('.modal-body').text(result.error);
                });
                $('#order_ti').modal('show');
            }
        }
    });

}

function order_green_hide(order_id) {
    /*隐藏订单菜品*/
    $('#' + order_id.toString() + 'info').html('');
    $('#' + order_id.toString() + 'info').animate({height: '0px'}, 100, function () {
        $('#' + order_id.toString() + 'but2').hide();
        $('#' + order_id.toString() + 'but1').show();
        $('#' + order_id.toString() + 'info').hide();
    })

}

/*实时订单结束*/

/*历史订单开始*/
function cuisine_order() {
    // 查看历史订单
    var management_token = window.localStorage.getItem('managements_token');
    var user_name = window.localStorage.getItem('managements_phone');
    $.ajax({
        url: window.globalConfig.ROUTE + window.globalConfig.VERSIONS + 'messages/management_cuisine_order?management_token=' + management_token + '&management_phone=' + user_name,
        type: 'get',
        dataType: 'json',
        success: function (result) {
            if (result.code == 200) {
                // 请求成功
                var order_list = result.order_list;
                var order_str = '';
                if (order_list) {
                    for (var i = 0; i < order_list.length; i++) {
                        if (order_list[i].order_state == 'O') {
                            order_str += '<div id="' + order_list[i].order_number + 'div" class="data alert alert-success alert-dismissible" role="alert">\n';
                        } else if (order_list[i].order_state == 'S') {
                            order_str += '<div id="' + order_list[i].order_number + 'div" class="data alert alert-warning alert-dismissible" role="alert">\n';
                        } else if (order_list[i].order_state == 'L') {
                            order_str += '<div id="' + order_list[i].order_number + 'div" class="data alert alert-danger alert-dismissible" role="alert">\n';
                        } else {
                            order_str += '<div id="' + order_list[i].order_number + 'div" class="data alert alert-info alert-dismissible" role="alert">\n';
                        }
                        order_str += '        <button onclick="delete_order(' + order_list[i].order_number + ');" type="button" class="close"><span\n' +
                            '                aria-hidden="true" class="cuisine_but glyphicon glyphicon-trash"></span></button>\n' +
                            '        <strong><span class="ico glyphicon glyphicon-bookmark"></span><span onclick="order_info(' + order_list[i].order_number + ')" class="into_h into">' + order_list[i].order_number + '</span></strong>\n' +
                            '        <strong><span class="ico glyphicon glyphicon-yen"></span></strong><span class="into">' + parseFloat(order_list[i].order_price).toFixed(1) + '</span>\n' +
                            '        <strong><span class="ico glyphicon glyphicon-time"></span></strong><span class="into">' + order_list[i].create_time + '</span>\n';
                        if (order_list[i].order_state == 'O') {
                            order_str += '<strong><span class="ico tis">已完成</span></strong>';
                        } else if (order_list[i].order_state == 'S') {
                            order_str += '<strong><span class="ico tis">用户取消</span></strong>';
                        } else if (order_list[i].order_state == 'L') {
                            order_str += '<strong><span class="ico tis">已失效</span></strong>';
                        } else {
                            order_str += '<strong><span class="ico tis">其他</span></strong>';
                        }
                        order_str += '    </div>'
                    }
                }
                $('#info').html(order_str);
            } else {
                $('#order_ti').on('show.bs.modal', function (event) {
                    var modal = $(this);
                    modal.find('.modal-title').text('提示信息');
                    modal.find('.modal-body').text(result.error);
                });
                $('#order_ti').modal('show');
            }
        }
    });
}

$('#cuisine').on('click', function () {
    gl.each(function (k, e) {
        e.style.color = '#fff'
    });
    const refresh = $('#refresh');
    const lock = $('#lock');

    refresh.off('click');

    refresh.removeClass('refresh_indent');
    refresh.removeClass('refresh_reserve');
    refresh.addClass('refresh_cuisine');
    this.style.color = '#ff5783';
    refresh.removeClass('refresh-dh2');
    refresh.addClass('refresh-dh1');
    lock.removeClass('lock-dh2');
    lock.addClass('lock-dh1');
    cuisine_order();
    $('.refresh_cuisine').on(
        'click',
        function () {
            cuisine_order();
        }
    );
});


function delete_order(order_id) {
    // 删除历史订单
    var management_token = window.localStorage.getItem('managements_token');
    var user_name = window.localStorage.getItem('managements_phone');
    var post_data = {'management_token': management_token, 'management_phone': user_name, 'order_id': order_id};
    $.ajax({
        // url
        url: window.globalConfig.ROUTE + window.globalConfig.VERSIONS + "messages/management_cuisine_order",
        // 请求方式
        type: "delete",
        // contentType
        // dataType
        dataType: "json",
        // 把JS的对象或数组序列化一个json 字符串
        data: JSON.stringify(post_data),
        // result 为请求的返回结果对象
        success: function (result) {
            if (result.code == 200) {
                $('#' + order_id.toString() + 'div').hide();
                $('#order_ti').on('show.bs.modal', function (event) {
                    var modal = $(this);
                    modal.find('.modal-title').text('提示信息');
                    modal.find('.modal-body').text('删除成功');
                });
                $('#order_ti').modal('show');
            } else {
                $('#order_ti').on('show.bs.modal', function (event) {
                    var modal = $(this);
                    modal.find('.modal-title').text('提示信息');
                    modal.find('.modal-body').text(result.error);
                });
                $('#order_ti').modal('show');
            }
        }
    });

}


/*历史订单结束*/


function order_info(order_id) {
    // 查看订单详细信息
    var management_token = window.localStorage.getItem('managements_token');
    var user_name = window.localStorage.getItem('managements_phone');
    $.ajax({
        url: window.globalConfig.ROUTE + window.globalConfig.VERSIONS + 'messages/get_order_info?management_token=' + management_token + '&management_phone=' + user_name + '&order_id=' + order_id,
        type: 'get',
        dataType: 'json',
        success: function (result) {
            if (result.code == 200) {
                var order_info = result.order_dic;
                var order_info_str = '';
                order_info_str += '<div class="row">\n' +
                    '                    <div class="col-md-3">订单号：</div>\n' +
                    '                    <div class="col-md-9">' + order_info.order_number + '</div>\n' +
                    '                </div>' +
                    '<div class="row">\n' +
                    '                    <div class="col-md-3">订单类型：</div>\n' +
                    '                    <div class="col-md-9">' + order_info.order_type + '</div>\n' +
                    '                </div>' +
                    '<div class="row">\n' +
                    '                    <div class="col-md-3">创建时间：</div>\n' +
                    '                    <div class="col-md-9">' + order_info.create_time + '</div>\n' +
                    '                </div>' +
                    '<div class="row">\n' +
                    '                    <div class="col-md-3">订单价格：</div>\n' +
                    '                    <div class="col-md-9">' + order_info.order_price + '</div>\n' +
                    '                </div>' +
                    '<div class="row">\n' +
                    '                    <div class="col-md-3">所属用户：</div>\n' +
                    '                    <div class="col-md-9">' + order_info.customer_order + '</div>\n' +
                    '                </div>' +
                    '<div class="row">\n' +
                    '                    <div class="col-md-3">订单人数：</div>\n' +
                    '                    <div class="col-md-9">' + order_info.order_user_number + '</div>\n' +
                    '                </div>' +
                    '<div class="row">\n' +
                    '                    <div class="col-md-3">菜品数量：</div>\n' +
                    '                    <div class="col-md-9">' + order_info.green_number + '</div>\n' +
                    '                </div>';
                $('#myModal').on('show.bs.modal', function (event) {
                    var modal = $(this);
                    modal.find('.modal-body').html(order_info_str);
                });
                $('#myModal').modal('toggle');
            } else {
                $('#order_ti').on('show.bs.modal', function (event) {
                    var modal = $(this);
                    modal.find('.modal-title').text('提示信息');
                    modal.find('.modal-body').text(result.error);
                });
                $('#order_ti').modal('show');
            }
        }
    });
}

/*管理员登陆开始*/
login.on('click', function () {
    const username = $('#username').val();
    const password = $('#password').val();

    var post_data = {'username': username, 'password': password};

    //ajax验证用户
    $.ajax({
        // url
        url: window.globalConfig.ROUTE + window.globalConfig.VERSIONS + "managements/admin_login",

        // 请求方式
        type: "post",
        // contentType
        // dataType
        dataType: "json",
        // 把JS的对象或数组序列化一个json 字符串
        data: JSON.stringify(post_data),
        // result 为请求的返回结果对象
        success: function (result) {
            if (200 == result.code) {
                window.localStorage.setItem('managements_token', result.token);
                window.localStorage.setItem('managements_phone', result.admin_phone);
                $('#username').val('');
                $('#password').val('');
                const bottom = $('#bottom');
                const top = $('.top');
                const up = $('#up');
                const log = $('#log');
                const sp = $('#sp');
                const l = $('#l');
                const l4 = $('#l4');
                const gl = $('.gl');
                const lock = $('#lock');
                const refresh = $('#refresh');
                const info = $('#info');
                const nr = $('#nr');
                top.removeClass('topdh2');
                top.addClass('topdh1');
                bottom.removeClass('bottomdh2');
                bottom.addClass('bottomdh1');
                up.removeClass('updh2');
                up.addClass('updh1');
                log.removeClass('logdh2');
                log.addClass('logdh1');
                sp.removeClass('spdh2');
                sp.addClass('spdh1');
                l.removeClass('ldh2');
                l.addClass('ldh1');
                l4.removeClass('l4dh2');
                l4.addClass('l4dh1');
                $.each(gl, function (k, v) {
                    k = k + 1;
                    $(v).removeClass('gldh2');
                    $(v).addClass('gldh1' + k.toString());
                });
                const timeID = setTimeout(function () {
                    nr.hide();
                    bottom.hide();
                    sp.hide();
                    l.hide();
                    info.show();
                    lock.removeClass('lock-dh2');
                    lock.addClass('lock-dh1');
                    refresh.removeClass('refresh-dh2');
                    refresh.addClass('refresh-dh1');

                    //加载实时定单
                    indent_order();


                    clearTimeout(timeID)
                }, 1000);


            } else {
                $('#order_ti').on('show.bs.modal', function (event) {
                    var modal = $(this);
                    modal.find('.modal-title').text('提示信息');
                    modal.find('.modal-body').text(result.error);
                });
                $('#order_ti').modal('show');
            }
        }
    });
});
/*管理员登陆结束*/

//前台管理上锁
lock.on('click', function () {
    const bottom = $('#bottom');
    const top = $('.top');
    const up = $('#up');
    const nr = $('#nr');
    $('#down').hide();
    $('#message').hide();
    const log = $('#log');
    const sp = $('#sp');
    const l = $('#l');
    const l4 = $('#l4');
    const gl = $('.gl');
    const lock = $('#lock');
    const refresh = $('#refresh');
    const info = $('#info');
    info.html('');
    nr.show();
    info.hide();
    bottom.show();
    l.show();

    const timeID = setTimeout(function () {
        sp.show();
        clearTimeout(timeID)
    }, 1000);

    top.removeClass('topdh1');
    top.addClass('topdh2');
    bottom.removeClass('bottomdh1');
    bottom.addClass('bottomdh2');
    up.removeClass('updh1');
    up.addClass('updh2');
    log.removeClass('logdh1');
    log.addClass('logdh2');
    sp.removeClass('spdh1');
    sp.addClass('spdh2');
    l.removeClass('ldh1');
    l.addClass('ldh2');
    l4.removeClass('l4dh1');
    l4.addClass('l4dh2');

    lock.removeClass('lock-dh1');
    lock.addClass('lock-dh2');
    refresh.removeClass('refresh-dh1');
    refresh.addClass('refresh-dh2');

    $.each(gl, function (k, v) {
        k = k + 1;
        $(v).removeClass('gldh1' + k.toString());
        $(v).addClass('gldh2');
    });
    window.localStorage.removeItem('managements_token');
    window.localStorage.removeItem('managements_phone')
});
//前台管理上锁结束

