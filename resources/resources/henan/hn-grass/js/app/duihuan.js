+(function () { //兑换类型的奖品
    H.duihuan = {
        $duihuanDiv: $("#duihuan"),
        init: function () {
            this.bindBtns();
            this.resize();
        },
        show: function (data) {
            var data = JSON.parse(data);
            H.duihuan.data = data;
            if (data.tt) {
                H.duihuan.$duihuanDiv.find('.hongbao-text').html(data.tt);
            }
            H.duihuan.$duihuanDiv.find('.hongbao-imgt img').attr('src', data.pi);
            $(".duihuan-click").css({ "background": "url('images/lingqu.png') no-repeat center center;", "background-size": "contain" });
            if (data.ph) {
                H.duihuan.$duihuanDiv.find(".duihuaninput").val(data.ph);
            }
            H.duihuan.$duihuanDiv.removeClass("none");
        },
        bindBtns: function () {
            var isuse = false;
            var that = this;
            {  //点击领取
                window.callbackLotteryAwardHandler = function () {

                };
                window.callbackGameHandler = function (data) { //再调用领奖接口
                    if (data.code == 0) {
                        getResult('api/lottery/award', {
                            nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
                            hi: headimgurl ? headimgurl : "",
                            oi: openid
                        }, 'callbackLotteryAwardHandler', false);
                        showTips("领取成功！！");
                        $(".duihuan-click").css({ "background": "url('images/lijiuserbtn.png') no-repeat center center;", "background-size": "contain" });
                        isuse = true;
                        $(".duihuan-click").unbind("click").click(function () {
                            if (isuse) {
                                window.location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.wandao.huanghou'; //游戏下载地址
                                isuse = false;
                            } else {
                                alert("不能再次使用了");
                            }
                        });
                    } else {
                        showTips(data.mes);
                    }
                };
                H.duihuan.$duihuanDiv.find(".duihuan-click").unbind("click").click(function () {  //点击领取事件
                    var ph = H.duihuan.$duihuanDiv.find(".duihuaninput").val();
                    if (!ph || ph.length < 11) {
                        showTips("这手机号，可打不通...");
                        return false;
                    }
                    if (!/^\d{11}$/.test(ph)) {
                        showTips("这手机号，可打不通...");
                        return false;
                    };
                    var keysInfo = '91quible4lfwm0za';
                    var cdk = H.duihuan.data.cc;
                    var usermobile = ph;
                    var type = 'yaotv';
                    var timestampInfos = new Date().getTime();
                    var url = H.duihuan.data.ru || "http://www.huanghou.cc/weixininvitation.html";
                    $.ajax({  //注册
                        type: "get",
                        async: !1,
                        url: url,
                        data: { 'mobile': usermobile, 'cdk': cdk, 'timestamp': new Date().getTime(), 'type': type, 'sign': hex_md5(usermobile + cdk + type + new Date().getTime() + '91quible4lfwm0za') },
                        dataType: "jsonp",
                        jsonp: "callback",
                        jsonpCallback: "callbackGameHandler",
                        success: function () {
                        },
                        error: function () {
                        }
                    });
                });
            }
            H.duihuan.$duihuanDiv.find(".hongbao-close").unbind("click").click(function () {
                H.duihuan.$duihuanDiv.addClass("none");
            });
        },
        resize: function () {

        }
    };
    H.duihuan.init();
})();