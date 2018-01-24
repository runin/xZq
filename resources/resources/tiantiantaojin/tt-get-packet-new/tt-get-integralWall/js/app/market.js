(function($) {
        var dataObject = []; //用来取金币数量
        var goldTemp = 0;
        var goodflag = true;
        var flag = 1;
        H.market = {
                $height: $(window).height(),
                $width: $(window).width(),
                topValue: 0, // 上次滚动条到顶部的距离
                interval: null, // 定时器
                init: function() {
                    var me = this;
                    $('title').text("积分商城");
                    $('body').css({
                        'height': me.$height,
                        'width': me.$width
                    });
                    $('.market-image-list').height(me.$height - 225);
                    me.event();
                    me.dataRead();
                    me.scrolling();
                    me.userlog();
                },
                event: function() {
                    $(".top-image-nav2  #user").on("click", function(e) {
                            var me = this;
                            e.preventDefault();
                            goodflag = false;
                            flag = 2;
                            var isred = $(this).attr("red-state");
                            var goodId = $(this).attr("data-goodId");
                                // 弹层
                            if(!$(this).hasClass("click"))
                            {
                                $(this).addClass("click"); 
                                $.ajax({
                                        type: 'GET',
                                        async: false,
                                        url: business_url + "goods/exchange/" + busiAppId + "/" + openid + "/" + goodId + "/" + isred,
                                        data: {},
                                        dataType: "jsonp",
                                        jsonp: "callback",
                                        complete: function() {
                                           $(me).removeClass("click"); 
                                        },
                                        success: function(data) {

                                        },
                                        error: function() {

                                        }
                                });
                            }

                    });

                //做任务按钮
            },
            successPop: function(url) {
                var me = this;
                var isLucker = true;
                data = {
                    tt: "请到一元夺宝—个人中心—我的红包中查看。！"
                }
                if (isLucker) {
                    var t = simpleTpl();
                    t._('<section class="modal">')
                        ._('<div class="lucker-section bounceInDown">')
                        ._('<div class="con">')
                        ._('<h1 style="font-size:20px">恭喜兑换成功！</h1>')
                        ._('<p class="con-tt">' + data.tt + '</p>')
                        ._('<div class="con-tab">')
                        ._('<a href="javascript:void(0)" data-collect="true" class="duobao-close click-btn"  data-collect-flag="tt-intergral-lucker-close" ')
                        ._(' data-collect-desc="积分商城-兑换-关闭弹层" id="duobao-close">')
                        ._('知道了')
                        ._('</a>')
                        ._(' <a href="javascript:void(0)" data-collect="true" class="confirm-now click-btn" ')
                        ._(' data-collect-flag="tt-intergral-duobao"')
                        ._(' data-collect-desc="积分商城-立即夺宝" id="confirm-now">')
                        ._(' 立即夺宝')
                        ._(' </a>')
                        ._(' </div>')
                        ._(' </div>')
                        ._(' </div>')
                        ._(' </section>')
                    $("body").append(t.toString());
                    $("body").delegate(".duobao-close","click",function()
                    {
                        $(".lucker-section").removeClass("bounceInDown");
                        $(".lucker-section").addClass("bounceOutDown");
                        $(".lucker-section").on("webkitAnimationEnd", function () {
                            $(".lucker-section").parent().remove();
                         });
                    });
                    $("body").delegate(".confirm-now","click",function()
                    {
                        $(".lucker-section").removeClass("bounceInDown");
                        $(".lucker-section").addClass("bounceOutDown");
                        $(".lucker-section").on("webkitAnimationEnd", function () {
                            $(".lucker-section").parent().remove();
                            toUrl(url);
                         });
                        
                    });
                    me.relocate();
                }
            },
            // 设置弹层的高度
            relocate:function(){
                var height = $(window).height(), width = $(window).width();
                var modalH = $('.lucker-section').height();
                $('.lucker-section').css({
                    'margin-top': (height-modalH)/2,
                });
            },
            dataRead: function() {
                //获取头像信息
                getResult("user/query/" + busiAppId + "/" + openid, {}, "callBackUserInfoHandler", true);
                //获取实物奖
                getResult("goods/list/" + busiAppId, {}, "queryGoodsInfoCallBackHandler", true);

            },
            specialDate: function(data) {
                var t = simpleTpl();
                $(".top-image-nav .top-image-nav1").css("background-image", "url(" + data.hotGoods.goodsImg + ")");
                $(".top-image-nav2  p").text(data.hotGoods.goodsDesc);
                $(".top-image-nav2  .top-img-gold").text(data.hotGoods.goodsValue);
                $(".top-image-nav2  #user").attr("data-goodId", data.hotGoods.goodsId);
                $(".top-image-nav2  #user").attr("red-state", data.hotGoods.isred);
            },

            //特殊图片展示信息
            update: function(data) {
                var length = data.length;
                var t = simpleTpl();

                //实体奖列表
                for (i = 0; i < length; i++) {
                    t._('<li onclick=exchangePrize(this,' + data[i].goodsId + ')  red_state="' + data[i].isred + '">')
                        ._('<a>')
                        ._('<img  src="./images/load-image.png"  onload="$(this).attr(\'src\',\'' + data[i].goodsImg + '\')"  onerror="$(this).addClass("none")">')
                        ._('</a>')
                        ._('<div class="ex-change-prize">' + data[i].goodsValue + '金币点击领取</div>')
                        ._('</li>');
                }
                $('.image-list').append(t.toString());
            },
            scrolling: function() {
                var maxHeight = 0,
                    initHeight = 0,
                    pageHeight = 0;

                $('.market-image-list').scroll(function() {
                    var srollHeight = $('.market-image-list').scrollTop();
                    if (initHeight <= srollHeight) {
                        $('.fix-tab-div').css({
                            "opacity": "0",
                            "-webkit-transition": "all .2s ease-in",
                            "z-index": "0",
                            "display": "none"
                        });
                    } else {
                        $('.fix-tab-div').css({
                            "opacity": "1",
                            "-webkit-transition": "all .5s ease",
                            "z-index": "2",
                            "display": "block"
                        });
                    }
                    setInterval(function() {
                        initHeight = srollHeight;
                    }, 0);
                });
            },
            //用户日志
            userlog: function() {
                onpageload();
            }
    }

    // 获取头部信息
    W.callBackUserInfoHandler = function(data) {
        var headDafault = "./images/player.jpg";
        if (data.code == 0) {
            var headurl = data.result.headImg || headDafault;
            var name = data.result.nickName || "匿名游客";
            var gold = (data.result.goldNum || "0") + "金币";
            $('.user-information .head-img').css("background-image", "url(" + headurl + ")");
            $('.user-information #user-name').text(name);
            $('.user-information #money-amount').text(gold);
        } else {
            var name = "匿名游客";
            var gold = "0" + "金币";
            $('.user-information .head-img').css("background-image", "url(" + headDafault + ")");
            $('.user-information #user-name').text(name);
            $('.user-information #money-amount').text(gold);
        }

    }

    //查询实体奖
    W.queryGoodsInfoCallBackHandler = function(data) {
        if (data.result) {
            H.market.update(data.message);
            dataObject = data.message;
        } else {
            showTips("网络不给力，请您再刷新一次");
        }
        H.market.specialDate(data);
    };
    //兑换奖品
    W.exchangePrize = function(obj, index) {
        var isred = $(obj).attr("red_state");
        for (var i = 0; i < dataObject.length; i++) {
            if (dataObject[i].goodsId == index) {
                goldTemp = dataObject[i].goodsValue;

            }
        };
     
            showLoading()
            $.ajax({
                type: 'GET',
                async: false,
                url: business_url + "goods/exchange/" + busiAppId + "/" + openid + "/" + index + "/" + isred,
                data: {},
                dataType: "jsonp",
                jsonp: "callback",
                complete: function() {
                    hideLoading();
                },
                success: function(data) {

                },
                error: function() {

                }
            });
    }
    //奖品兑换回调函数
    W.exchangeCallBackHandler = function(data) {

        if (data.result) {
            if(flag==1)
            {
                showTips(data.message);
            }
            else
            {

                H.market.successPop(data.duobaoUrl);
            }
            getResult("user/query/" + busiAppId + "/" + openid, {}, "callBackUserInfoHandler", false);
           
        } else {
            showTips(data.message);
        }

    }
})(Zepto);
