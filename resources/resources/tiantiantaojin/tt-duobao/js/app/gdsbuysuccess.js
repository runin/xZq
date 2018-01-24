var orderNo = getQueryString("orderNo");
var i = 0;
var interval = null;
(function($) {
    H.gdsbuysuccess = {
        $sduobao_continue: $(".duobao-continue"),
        $view_record: $(".view-record"),
        $luck_show: $(".prize-infor"),
        $error_show: $(".error-infor"),
        $back_infor: $(".back-infor"),
        
        init: function() {
            var me = this;
            me.event();
            me.initDateList();
            me.successDateGet(true);

        },
        officialaccounts: function() {
            var wxid = "gh_17e97feb82ba";
            var addWxContact = function(wxid, cb) {
                if (typeof WeixinJSBridge == 'undefined') return false;
                WeixinJSBridge.invoke('addContact', {
                    webtype: '1',
                    username: wxid
                }, function(d) {
                    // 返回d.err_msg取值，d还有一个属性是err_desc
                    // add_contact:cancel 用户取消
                    // add_contact:fail　关注失败
                    // add_contact:ok 关注成功
                    // add_contact:added 已经关注
                    // WeixinJSBridge.log(d.err_msg);
                    alert(d.err_msg);
                });
            };
        },
        initDateList: function() {
            //评论模版
            var arr = [];
            arr.push('<div class="prizelist">');
            arr.push('<p><ul class="goods-rp">');
            arr.push('<li class="left-rp"><span class="editor-num"></span><span class="goods-name"></span></li>');
            arr.push('<li class="right-rp"><strong class="txt-red"></strong>人次</li>');
            arr.push('</ul>');
            arr.push('</p>');
            arr.push('<ul class="num-list">');
            arr.push('</ul>');
            arr.push('</p>');
            arr.push('</div>');
            this.$citem = $(arr.join(""));
        },
        successDateGet: function(showloading) {
            getResult("indianaPeriod/detailordermore", { orderNos: orderNo }, "indianaPeriodDetailOrderMoreCallBackHandler", showloading);
        },

        //获取购买的夺宝号码
        num_list: function(data) {
            var t = simpleTpl();
            var label = '<li>夺宝号码：</li>';
            for (var i = 0; i < data.length; i++) {
                t._('<li>' + data[i] + '</li>')
            };
            $(".num-list").append(label + t.toString());
        },
        dateShow: function(data) {
            var that = this;
            for (var i = 0; i < data.length; i++) {
                if (data[i].jsta == 1) {
                    var t = simpleTpl();
                    var luckN = data[i].jn.split(",")
                    var label = '<li>夺宝号码：</li>';
                    for (var j = 0; j < luckN.length; j++) {
                        t._('<li>' + luckN[j] + '</li>')
                    };
                    var citem = that.$citem.clone();
                    citem.find(".editor-num").text("(第" + data[i].jq + "期)  "); //商品期数
                    citem.find(".goods-name").text(data[i].jt); //商品名称
                    citem.find(".right-rp").find("strong").text(data[i].jc);
                    citem.find(".num-list").append(label + t.toString());
                    this.$luck_show.append(citem);
                } else if (data[i].jsta == 0) {
                    var t = simpleTpl();
                    var citem = that.$citem.clone();
                    citem.find(".editor-num").text("(第" + data[i].jq + "期)  "); //商品期数
                    citem.find(".goods-name").text(data[i].jt); //商品名称
                    citem.find(".right-rp").find("strong").text(data[i].jc);
                    citem.find(".num-list").append("未支付成功");
                    this.$error_show.append(citem);
                } else if (data[i].jsta == 3) {
                   var t = simpleTpl();
                    var citem = that.$citem.clone();
                    citem.find(".editor-num").text("(第" + data[i].jq + "期)  "); //商品期数
                    citem.find(".goods-name").text(data[i].jt); //商品名称
                    citem.find(".right-rp").find("strong").text(data[i].jc);
                    citem.find(".num-list").append("手慢咯，支付的金额以元宝的形式充值到您的账户，下次参与可直接抵扣");
                    this.$back_infor.append(citem);
                }

            }
        },
        event: function() {
            var me = this;
            $(".officialaccounts").click(function(e) {
                e.preventDefault();
                location.href = "http://mp.weixin.qq.com/s?__biz=MzA3MjkyMDU2MQ==&mid=403013236&idx=1&sn=a687b1ed6dd17ef75c20d6975d865487#rd";
                // alert(11);
                //me.officialaccounts();
            });
            this.$sduobao_continue.click(function() {

                toUrl("../../index.html");
            });
            this.$view_record.click(function() {

                toUrl("../user/historylist.html");
            });
        }
    }
    W.indianaPeriodDetailOrderMoreCallBackHandler = function(data) {
        if (data.result) {
            hideLoading();
            if (interval) {
                clearInterval(interval);
            }
            if(data.ci>0)
            {
                $(".prize-infor").find(".rp-num").text(data.jian);
                $(".prize-infor").find(".rp-prize").text(data.ci);
            }

            if (data.mf) {
                $(".tt-link-tips").addClass("none");
                $(".tt-phone-tips").removeClass("none");

            } else {
                $(".tt-link-tips").removeClass("none");
                $(".tt-phone-tips").addClass("none");
            }
            H.gdsbuysuccess.dateShow(data.items);

        } else {
            showLoading();
            interval = setInterval(function() {
                if (i++ > 2) {
                    hideLoading();
                    clearInterval(interval);
                } else {
                    H.gdsbuysuccess.successDateGet(false);
                }

            }, 1000);
            $(".tt-link-tips").removeClass("none").html("网络在开小差哦...请稍后再试");
            $(".prize-infor").addClass("none");
        }
    }

})(Zepto);

$(function() {
    H.gdsbuysuccess.init();
});
