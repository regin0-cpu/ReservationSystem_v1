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
    }else {
        $('#login_ti').modal('show');
    }
});
