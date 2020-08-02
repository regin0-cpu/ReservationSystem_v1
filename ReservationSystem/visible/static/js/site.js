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
    $.ajax({
        url: window.globalConfig.ROUTE + window.globalConfig.VERSIONS + 'managements/get_shop_message',
        type: 'get',
        dataType: 'json',
        success: function (shopedata) {
            if (200 == shopedata.code) {
                var map = new BMap.Map("allmap");
                map.centerAndZoom(new BMap.Point(shopedata.shop.shop_longitude, shopedata.shop.shop_latitude), 18);
                // 添加带有定位的导航控件
                var navigationControl = new BMap.NavigationControl({
                    // 靠左上角位置
                    anchor: BMAP_ANCHOR_TOP_LEFT,
                    // LARGE类型
                    type: BMAP_NAVIGATION_CONTROL_LARGE,
                });
                map.addControl(navigationControl);
                // 用经纬度设置地图中心点
                map.clearOverlays();
                var new_point = new BMap.Point(shopedata.shop.shop_longitude, shopedata.shop.shop_latitude);
                var marker = new BMap.Marker(new_point);  // 创建标注
                map.addOverlay(marker);// 将标注添加到地图中
                marker.setAnimation(BMAP_ANIMATION_BOUNCE);
                $('#site_ti').text(shopedata.shop.shop_site);
            }
        }
    });
});