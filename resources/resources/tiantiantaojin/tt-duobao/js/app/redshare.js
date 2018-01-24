(function($) {
    var page = 1;
    var pageSize = 20;
    var loadmore = true;
    var lastlength = 0;
    H.redshare = {
        initParam: function() {
            this.$hear = $(".hear"); //头像
            this.$top_content = $(".top_content"); //内容
            this.$username = $(".username"); //用户名称
            this.$program = $(".program"); //节目名称
            this.$money_num = $(".money_num"); //金额
            this.$comment = $(".conment"); //评论的容器   

            //评论模版
            var arr = [];
            arr.push('<div class="c_item">');
            arr.push('<div class="c_hear">');
            arr.push('</div>');
            arr.push('<div class="c_msg">');
            arr.push('<div class="c_msg_top">');
            arr.push('<span class="c_name">--</span> <span class="c_time">--</span>');
            arr.push('</div>');
            arr.push('<div class="c_msg_bottom">');
            arr.push('一起来玩众凑吧');
            arr.push('</div>');
            arr.push('</div>');
            arr.push('<div class="c_money">');
            arr.push('<span>0</span>元');
            arr.push('</div>');
            arr.push('</div>');
            this.$citem = $(arr.join(""));
        },
        initEvent: function() {
            var that = this;
            $(".gotouse").click(function() {
                window.location.href = "./html/user/redpacket.html"
            });
        },
        getRedpackInfo: function() {
            getResult("wx/redpackInfo", {}, "redpackInfoCallBackHandler", true)
        },
        getAwardRed: function(redpackId) {
            // 获取当前地址
            showLoading();
            var url = getQueryString("timestamp") ? (window.location.href) : (window.location.href.split("?")[0] + "?shareOpenid=" + shareOpenid + "&timestamp=" + timestamp+"&resopenid="+shareOpenid);
            getResult("wx/awardRed", { appId: busiAppId, openId: openid, redpackId: redpackId, nickName: nickname, url: url }, "pickupRedpackcallBackHandler", false)
        },
        loadFriend: function(data) {
            var that = this;
            //$(".conment").empty();
            // var data = {};
            // data.items = [{ img: "./images/avatar.png", n: "ezZang", ra: "5", ct: "2015.11.22" }, { img: "./images/avatar.png", n: "庄立伟", ra: "0.01", ct: "2015.11.22" }, { img: "./images/avatar.png", n: "漫步", ra: "-5", ct: "2015.11.22" }]
            hideLoading();
            function appendFriendData(data) { //加载朋友的数据
                if (!data.items) {
                    return;
                }
                //$(".nofriend").addClass("none");
                for (var i = 0; i < data.items.length; i++) {
                    var d = data.items[i];
                    var citem = that.$citem.clone();
                    citem.find(".c_hear").css({ "background": "url('" + (d.im ? d.im : './images/avatar.png') + "') no-repeat center center", "background-size": "cover" }); //头像
                    citem.find(".c_name").html(d.na); //姓名
                    citem.find(".c_money span").html(d.ra);
                    citem.find(".c_time").html(d.rt);
                    citem.find(".c_msg_bottom").html("礼券到手，快来一起夺宝吧~"); //文字
                    that.$comment.append(citem);
                }
            };
            appendFriendData(data);
        },
        scrolling: function() {
            getList(true);
            page++;
            var range = 180, //距下边界长度/单位px
                maxpage = 100, //设置加载最多次数
                totalheight = 0;

            $(window).scroll(function() {
                var srollPos = $(window).scrollTop();
                totalheight = parseFloat($(window).height()) + parseFloat(srollPos);
                if (($(document).height() - range) <= totalheight && page < maxpage && loadmore) {
                    if ($('.loading-space').hasClass('none')) {
                        console.log($('.loading-space').hasClass('none'));
                        return;
                    }
                    $('.loading-space').addClass('none');
                    getList(true);
                    page++;
                }
            });
        },
        init: function() {
            this.initParam();
            this.initEvent();
            this.getRedpackInfo();

        }
    };
    // 查询所有参与者的信息
    W.getList = function(showloading) {
       
        var url = getQueryString("timestamp") ? (window.location.href) : (window.location.href.split("?")[0] + "?shareOpenid=" + shareOpenid + "&timestamp=" + timestamp+"&resopenid="+shareOpenid);
        getResult("wx/listRed", { appId: busiAppId, page: page, url: url }, 'listRedCallBackHandler', showloading);
    }
    W.listRedCallBackHandler = function(data) {

            $('.loading-space').removeClass('none');
            if (data.result) {
                var items = data.items || [],
                    len = items.length;
                lastlength = len;
                if (len < pageSize) {
                    loadmore = false;
                    $('.loading-space').html(' --已到达列表底部--');
                } else {
                    $('.loading-space').html(' --下拉显示更多--');
                }
                //调用用户列表函数
                H.redshare.loadFriend(data);

            } else {
                if (lastlength == pageSize) {
                    loadmore = false;
                    $('.loading-space').html(' --已到达列表底部--');
                } else {
                    $('.loading-space').html(' --暂时没有朋友哦~--');
                }
            }
        }
        //领取红包
    W.pickupRedpackcallBackHandler = function(data) {
            H.redshare.scrolling();
        }
        // 获取红包信息
    W.redpackInfoCallBackHandler = function(data) {
        if (data.result) {
            $(".m_center").find(".money_num").html(data.message.ra);
            H.redshare.getAwardRed(data.message.rid);
        } else {
            showTips("啊哦，网络在开小差噢，稍后再试试吧~");
        }
    }
    H.shareban = {
        wxConfig: function() {
            var me = this;
            $.ajax({
                type: "GET",
                url: business_url + "wx/apiTicket/" + busiAppId + "/jsapi",
                data: {},
                async: true,
                dataType: "jsonp",
                jsonpCallback: "ApiTicketCallBackHandler",
                success: function(data) {
                    if (!data.result) {
                        return;
                    }
                    var timestamp = Math.round(new Date().getTime() / 1000),
                        nonceStr = "df51d5cc9bc24d5e86d4ff92a9507361",
                        url = window.location.href.split('#')[0],
                        signature = hex_sha1("jsapi_ticket=" + data.apiTicket + "&noncestr=" + nonceStr + "&timestamp=" + timestamp + "&url=" + url);
                    wx.config({
                        debug: false,
                        appId: busiAppId,
                        timestamp: timestamp,
                        nonceStr: nonceStr,
                        signature: signature,
                        jsApiList: ["chooseCard", "openCard", 'onMenuShareTimeline', 'onMenuShareAppMessage', 'hideAllNonBaseMenuItem', 'onMenuShareQQ', 'onMenuShareWeibo', 'hideMenuItems', 'showMenuItems', 'hideOptionMenu', 'showOptionMenu']
                    });

                },
                error: function(xhr, type) {
                    // alert('获取微信授权失败！');
                }
            });
        },

    };
    wx.ready(function() {
        wx.hideOptionMenu();
    });
    H.shareban.wxConfig();
    H.redshare.init();
})(Zepto);
