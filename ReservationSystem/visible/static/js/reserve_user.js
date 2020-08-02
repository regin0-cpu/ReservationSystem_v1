/**
 * 页面初始化
 * **/

$(function () {
    var token = window.localStorage.getItem('reserve_user_token');
    if (token) {
        $('#no_login').hide();
        $('#user').show();
        var name_str = window.localStorage.getItem('reserve_user_name');
        if (name_str.length > 5) {
            var new_name = name_str.slice(0, 5).concat('...');
            $('#user_n').html(new_name);
        } else {
            $('#user_n').html(name_str);
        }
        var user_phone = window.localStorage.getItem('reserve_user_phone');
        $.ajax({
            url: window.globalConfig.ROUTE + window.globalConfig.VERSIONS + 'messages/customer_shoppingcart',
            dataType: 'json',
            data: JSON.stringify({'token': token, 'user_phone': user_phone}),
            type: 'post',
            success: function (greendata) {
                if (200 == greendata.code) {
                    $('#green_number').text(greendata.green_number);
                }
            }
        });
    }
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
});

/**
 * 用户注册验证开始
 */
function str_phone() {
    //判断手机号是否符合规范
    userPhone = $('#inputPhone').val();
    var myreg = /^(((13[0-9]{1})|(14[0-9]{1})|(17[0-9]{1})|(15[0-3]{1})|(15[4-9]{1})|(18[0-9]{1})|(199))+\d{8})$/;
    if (userPhone == '') {
        return false
    }
    return myreg.test(userPhone);

}

function Phone_c() {
    if (str_phone()) {
        $('#has1').removeClass('has-error');
        $('#f1').removeClass('glyphicon-remove');
        $('#input1Status').html('');
        $('#has1').addClass('has-success');
        $('#f1').addClass('glyphicon-ok');
        $('#input1Status').html('(success)');
    } else {
        $('#has1').removeClass('has-success');
        $('#f1').removeClass('glyphicon-ok');
        $('#input1Status').html('');
        $('#has1').addClass('has-error');
        $('#f1').addClass('glyphicon-remove');
        $('#input1Status').html('(error)');
    }
}


function str_name() {
    userName = $('#userName').val();
    return userName != '';
}

function len_name() {
    userName = $('#userName').val();
    return userName.length <= 11;
}

function Name_c() {

    if (str_name() && len_name()) {
        $('#has2').removeClass('has-error');
        $('#f2').removeClass('glyphicon-remove');
        $('#input2Status').html('');
        $('#has2').addClass('has-success');
        $('#f2').addClass('glyphicon-ok');
        $('#input2Status').html('(success)');
    } else {
        $('#has2').removeClass('has-success');
        $('#f2').removeClass('glyphicon-ok');
        $('#input2Status').html('');
        $('#has2').addClass('has-error');
        $('#f2').addClass('glyphicon-remove');
        $('#input2Status').html('(error)');
    }

}

function chem_password() {
    //验证密码合法性
    password1 = $('#inputPassword1').val();
    return !!password1;
}

function Password1_c() {

    if (chem_password()) {
        $('#has3').removeClass('has-error');
        $('#f3').removeClass('glyphicon-remove');
        $('#input3Status').html('');
        $('#has3').addClass('has-success');
        $('#f3').addClass('glyphicon-ok');
        $('#input3Status').html('(success)');
    } else {
        $('#has3').removeClass('has-success');
        $('#f3').removeClass('glyphicon-ok');
        $('#input3Status').html('');
        $('#has3').addClass('has-error');
        $('#f3').addClass('glyphicon-remove');
        $('#input3Status').html('(error)');
    }

}

function str_password() {
    //确认密码
    password1 = $('#inputPassword1').val();
    password2 = $('#inputPassword2').val();

    return password1 == password2;

}

function Password2_c() {

    if (str_password()) {
        $('#has4').removeClass('has-error');
        $('#f4').removeClass('glyphicon-remove');
        $('#input4Status').html('');
        $('#has4').addClass('has-success');
        $('#f4').addClass('glyphicon-ok');
        $('#input4Status').html('(success)');
    } else {
        $('#has4').removeClass('has-success');
        $('#f4').removeClass('glyphicon-ok');
        $('#input4Status').html('');
        $('#has4').addClass('has-error');
        $('#f4').addClass('glyphicon-remove');
        $('#input4Status').html('(error)');
    }

}

// 获取验证码
$('#code').on('click', function () {
    var phone = $('#inputPhone').val();
    if (str_phone()) {
        $('#code_span').html('<button id="code" class="btn btn-primary" type="button" disabled="disabled">发送验证码</button>');
        $.ajax(
            {
                url: window.globalConfig.ROUTE + window.globalConfig.VERSIONS + "customers/code?user_phone=" + phone,
                type: "get",
                dataType: "json",
                success: function (result) {
                    if (200 == result.code) {
                        var a = 60;
                        var timeid = setInterval(function () {
                            a -= 1;
                            if (a <= 0) {
                                $('#code_span').html('<button id="code" class="btn btn-primary" type="button">发送验证码</button>');
                                clearInterval(timeid);
                            } else {
                                $('#code_span').html('<button id="code" class="btn btn-primary" type="button" disabled="disabled">重新发送（' + a.toString() + 's)</button>');
                            }
                        }, 1000);
                    } else {
                        $('#code_span').html('<button id="code" class="btn btn-primary" type="button">发送验证码</button>');
                        $('#error').html('<button type="button" class="btn btn-danger pull-left">' + result.error + '</button>')
                    }
                }
            }
        );
    } else {
        $('#error').html('<button id="error_nut" type="button" class="btn btn-success pull-left">' + '手机号有误' + '</button>');
    }

});

/**
 * 用户注册验证结束
 * */



//用户注册
$('#Button2').on('click', function () {
    var phone = $('#inputPhone').val();
    var name = $('#userName').val();
    var password1 = $('#inputPassword1').val();
    var password2 = $('#inputPassword2').val();
    var sex = $("input[type='radio']:checked").val();
    var code = $('#Verification').val();
    var post_data = {
        'phone': phone, 'name': name, 'password1': password1,
        'password2': password2, 'sex': sex, 'code': code
    };
    $.ajax({
        type: 'post',
        contentType: 'application/json',
        dataType: 'json',
        url: window.globalConfig.ROUTE + window.globalConfig.VERSIONS + 'customers/c_register',
        data: JSON.stringify(post_data),
        success: function (result) {
            if (200 == result.code) {
                window.localStorage.setItem('reserve_user_token', result.token);
                window.localStorage.setItem('reserve_user_name', result.username);
                window.localStorage.setItem('reserve_user_phone', result.userphone);
                var i = 1;
                var timeid = setInterval(function () {
                    if (i <= 0) {
                        $('#register-from').modal('hide');
                        $('#inputPhone').val('');
                        $('#userName').val('');
                        $('#inputPassword1').val('');
                        $('#inputPassword2').val('');
                        $("input[type='radio']:checked").val('');
                        $('#has4').removeClass('has-success');
                        $('#f4').removeClass('glyphicon-ok');
                        $('#has3').removeClass('has-success');
                        $('#f3').removeClass('glyphicon-ok');
                        $('#has2').removeClass('has-success');
                        $('#f2').removeClass('glyphicon-ok');
                        $('#has1').removeClass('has-success');
                        $('#f1').removeClass('glyphicon-ok');
                        $('#no_login').hide();
                        $('#user').show();
                        var name_str = window.localStorage.getItem('reserve_user_name');
                        if (name_str.length > 5) {
                            var new_name = name_str.slice(0, 5).concat('...');
                            $('#user_n').html(new_name);
                        } else {
                            $('#user_n').html(name_str);
                        }
                        clearInterval(timeid)
                    }
                    $('#error').html('<button id="error_nut" type="button" class="btn btn-success pull-left">' + '注册成功!' + '</button>');
                    i -= 1;
                }, 1000);
            } else {
                $('#error').html('<button type="button" class="btn btn-danger pull-left">' + result.error + '</button>')
            }
        }
    })
});

//顾客登录模块
$('#Button1').on('click', function () {
    var username = $('#inputPhone1').val();
    var password = $('#Password1').val();
    var post_data = {'username': username, 'password': password};
    $.ajax({
        type: 'post',
        contentType: 'application/json',
        dataType: 'json',
        url: window.globalConfig.ROUTE + window.globalConfig.VERSIONS + 'customers/c_login',
        data: JSON.stringify(post_data),
        success: function (result) {
            if (200 == result.code) {
                window.localStorage.setItem('reserve_user_token', result.token);
                window.localStorage.setItem('reserve_user_name', result.username);
                window.localStorage.setItem('reserve_user_phone', result.userphone);
                var i = 1;
                var timeid = setInterval(function () {
                    if (i <= 0) {
                        $('#login-from').modal('hide');
                        $('#inputPhone1').val('');
                        $('#Password1').val('');
                        $('#no_login').hide();
                        $('#user').show();
                        name_str = window.localStorage.getItem('reserve_user_name');
                        if (name_str.length > 5) {
                            new_name = name_str.slice(0, 5).concat('...');
                        }
                        $('#user_n').html(new_name);
                        clearInterval(timeid)
                    }
                    $('#login_error').html('<button id="error_nut" type="button" class="btn btn-success pull-left">' + '登陆成功!' + '</button>');
                    i -= 1;
                }, 1000);
            } else {
                $('#login_error').html('<button type="button" class="btn btn-danger pull-left">' + result.error + '</button>')
            }
        }
    })
});


/**
 * 通过点击分类拿菜品数据
 * */
$('#nav-cp').on('click', function () {
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
    var user_token = window.localStorage.getItem('reserve_user_token');
    var user_phone = window.localStorage.getItem('reserve_user_phone');
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
        $('#login_ti').modal('show');
    }
}

