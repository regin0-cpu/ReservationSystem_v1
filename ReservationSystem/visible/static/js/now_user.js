/**
 * 页面初始化
 * **/

$(function () {
    var desk = urlvalue('desk');
    if (!desk) {
        desk = window.localStorage.getItem('now_user_name');
    }
    if (desk) {
        $.ajax({
            url: window.globalConfig.ROUTE + window.globalConfig.VERSIONS + 'messages/customer_get_desk?desk=' + desk,
            dataType: 'json',
            type: 'get',
            success: function (result) {
                if (200 == result.code) {
                    window.localStorage.setItem('now_user_token', result.user_token);
                    window.localStorage.setItem('now_user_name', desk);
                    window.localStorage.setItem('now_user_phone', result.user_phone);
                    var user_token = window.localStorage.getItem('now_user_token');
                    var user_phone = window.localStorage.getItem('now_user_phone');
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
                    $('#desk').text(desk);
                    $.ajax({
                        url: window.globalConfig.ROUTE + window.globalConfig.VERSIONS + 'messages/customer_get_green',
                        dataType: 'json',
                        type: 'get',
                        success: function (greendata) {
                            if (200 == greendata.code) {
                                var green_str = '';
                                for (var i = 0; i < greendata.green_data.length; i++) {
                                    green_str += "<div class='col-sm-6 col-md-4 col-lg-offset-1'>" +
                                        "<div class='thumbnail'>" +
                                        "<div class='tp'>" +
                                        "<img src='" + window.globalConfig.ROUTE + "media/" + greendata.green_data[i].green_picture + "' alt=''>" +
                                        "</div>" +
                                        "<div class='caption'>" +
                                        "<h3>" + greendata.green_data[i].green_name + "</h3>" +
                                        "<p><span class='glyphicon glyphicon-tag'></span>&nbsp;&nbsp;" + greendata.green_data[i].green_label + "</p>" +
                                        "<p class='cp'>" +
                                        "<button style='margin-left: 5px;' type='button' class='btn btn-danger'><span class='glyphicon glyphicon-yen'>:&nbsp;</span><span id='x2'>" + greendata.green_data[i].green_price + "</span></button>" +
                                        "<span>&nbsp;&nbsp;&nbsp;</span>" +
                                        "<button type='button' class='btn btn-success glyphicon glyphicon-shopping-cart' id='" + greendata.green_data[i].green_number + "' onclick='add_green(this.id);'>&nbsp;加入订单</button>" +
                                        "</p>" +
                                        "</div>" +
                                        "</div>" +
                                        "</div>"
                                }
                                $('#nrcp').html(green_str);
                            }
                        }
                    });
                } else {
                    $('#login_ti').on('show.bs.modal', function (event) {
                        var modal = $(this);
                        modal.find('.modal-title').text('提示信息');
                        modal.find('.modal-body').text(result.error);
                    });
                    $('#login_ti').modal('show');
                }
            }
        });
    } else {
        $('#login_ti').on('show.bs.modal', function (event) {
            var modal = $(this);
            modal.find('.modal-title').text('提示信息');
            modal.find('.modal-body').text('访问不合法');
        });
        $('#login_ti').modal('show');
    }
});

function urlvalue(qs) {
    var href = location.href;
    var href_list = href.replace("?", "?&").split('&');
    var re = '';
    for (i = 1; i < href_list.length; i++) {
        if (href_list[i].indexOf(qs + '=') == 0) {
            re = href_list[i].replace(qs + '=', '')
        }
    }
    return re;
}

//关闭浏览器 清空user数据
window.onbeforeunload = function () {
    if (event.clientX > document.body.clientWidth && event.clientY < 0 || event.altKey) {
        window.localStorage.removeItem('now_user_token');
        window.localStorage.removeItem('now_user_name');
        window.localStorage.removeItem('now_user_phone');
    }
};


/**
 * 通过点击分类拿菜品数据
 * */
$('#nav-cp').on('click', function () {
    //ajax   拿菜品分类信息
    $('#nav-but .btn').each(function (k, v) {
        $(v).show();
    });
    $.ajax({
        url: window.globalConfig.ROUTE + window.globalConfig.VERSIONS + 'messages/customer_get_greens',
        dataType: 'json',
        type: 'POST',
        success: function (greensdata) {
            if (200 == greensdata.code) {
                var greens_str = '<button onclick="get_green(this.id);" type="button" id="all" class="nav-btn2 nav-back btn btn-info" data-dismiss="modal">全部</button><br>';
                for (var i = 0; i < greensdata.greens_data.length; i++) {
                    var n = Math.ceil(Math.random() * 5);
                    if (n == 0) {
                        greens_str += '<button onclick="get_green(this.id);" type="button" id="' + greensdata.greens_data[i].greens_number + '" class="nav-btn2 nav-back btn btn-default" data-dismiss="modal">' + greensdata.greens_data[i].greens_name + '</button>';
                    } else if (n == 1) {
                        greens_str += '<button onclick="get_green(this.id);" type="button" id="' + greensdata.greens_data[i].greens_number + '" class="nav-btn2 nav-back btn btn-primary" data-dismiss="modal">' + greensdata.greens_data[i].greens_name + '</button>';
                    } else if (n == 2) {
                        greens_str += '<button onclick="get_green(this.id);" type="button" id="' + greensdata.greens_data[i].greens_number + '" class="nav-btn2 nav-back btn btn-success" data-dismiss="modal">' + greensdata.greens_data[i].greens_name + '</button>';
                    } else if (n == 3) {
                        greens_str += '<button onclick="get_green(this.id);" type="button" id="' + greensdata.greens_data[i].greens_number + '" class="nav-btn2 nav-back btn btn-info" data-dismiss="modal">' + greensdata.greens_data[i].greens_name + '</button>';
                    } else if (n == 4) {
                        greens_str += '<button onclick="get_green(this.id);" type="button" id="' + greensdata.greens_data[i].greens_number + '" class="nav-btn2 nav-back btn btn-warning" data-dismiss="modal">' + greensdata.greens_data[i].greens_name + '</button>';
                    } else {
                        greens_str += '<button onclick="get_green(this.id);" type="button" id="' + greensdata.greens_data[i].greens_number + '" class="nav-btn2 nav-back btn btn-danger" data-dismiss="modal">' + greensdata.greens_data[i].greens_name + '</button>';
                    }
                }
                $('#exampleModal').on('show.bs.modal', function (event) {
                    var modal = $(this);
                    modal.find('.modal-body').html(greens_str);
                });
                $('#exampleModal').modal('show');
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
});

function get_green(but_id) {
    //根据分类获取菜品信息
    var greens_id = but_id.toString();
    $.ajax({
        url: window.globalConfig.ROUTE + window.globalConfig.VERSIONS + 'messages/customer_get_green',
        dataType: 'json',
        data: JSON.stringify({'greens_id': greens_id}),
        type: 'post',
        success: function (greendata) {
            if (200 == greendata.code) {
                var green_str = '';
                for (var i = 0; i < greendata.green_data.length; i++) {
                    green_str += "<div class='col-sm-6 col-md-4 col-lg-offset-1'>" +
                        "<div class='thumbnail'>" +
                        "<div class='tp'>" +
                        "<img src='" + window.globalConfig.ROUTE + "media/" + greendata.green_data[i].green_picture + "' alt=''>" +
                        "</div>" +
                        "<div class='caption'>" +
                        "<h3 id='x2'>" + greendata.green_data[i].green_name + "</h3>" +
                        "<p><span class='glyphicon glyphicon-tag'></span>&nbsp;&nbsp;" + greendata.green_data[i].green_label + "</p>" +
                        "<p class='cp'>" +
                        "<button style='margin-left: 5px;' type='button' class='btn btn-danger'><span class='glyphicon glyphicon-yen'>:&nbsp;</span><span id='x2'>" + greendata.green_data[i].green_price + "</span></button>" +
                        "<span>&nbsp;&nbsp;&nbsp;</span>" +
                        "<button type='button' class='btn btn-success glyphicon glyphicon-shopping-cart' id='" + greendata.green_data[i].green_number + "' onclick='add_green(this.id);'>&nbsp;加入订单</button>" +
                        "</p>" +
                        "</div>" +
                        "</div>" +
                        "</div>"
                }
                $('#nrcp').html(green_str);
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

function add_green(green_id1) {
    //添加购物车
    var green_id = green_id1.toString();
    var user_token = window.localStorage.getItem('now_user_token');
    var user_phone = window.localStorage.getItem('now_user_phone');
    if (user_token) {
        $.ajax({
            url: window.globalConfig.ROUTE + window.globalConfig.VERSIONS + 'messages/customer_shoppingcart',
            dataType: 'json',
            data: JSON.stringify({'green_id': green_id, 'token': user_token, 'user_phone': user_phone}),
            type: 'post',
            success: function (greendata) {
                if (200 == greendata.code) {
                    $('#green_number').text(greendata.green_number);
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
