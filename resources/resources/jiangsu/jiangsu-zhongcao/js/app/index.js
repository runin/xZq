// JavaScript Document

$(function() {
    var N = {
        showPage: function (pageName, fn, pMoudel) {
            var mps = $(".page");
            mps.addClass("none");
            mps.each(function (i, item) {
                var t = $(item);
                if (t.attr("id") == pageName) {
                    t.removeClass("none");
                    N.currentPage = t;
                    if (fn) {
                        fn(t);
                    };
                    return false;
                }
            });
        },
        loadData: function (param) {
            var p = $.extend({ url: "", type: "get", async: false, dataType: "jsonp", jsonp: "callback", showload: true }, param);
            if (p.showload) {
                W.showLoading();
            }
            var connt = 0;
            var cbName = "";
            var cbFn = null;
            for (var i in param) {
                connt++;
                if (connt == 2) {
                    cbName = i;
                    cbFn = param[i];
                    break;
                }
            }
            if (cbName && cbFn && !W[cbName]) { W[cbName] = cbFn; }
            $.ajax({ type: p.type, data: param.data, async: p.async, url: p.url, dataType: p.dataType, jsonp: p.jsonp, jsonpCallback: cbName,
                success: function () {
                    W.hideLoading();
                },
                error: function () {
                    if (param.error) { param.error() };
                    W.hideLoading();
                    // H.dialog.showWin.open("抱歉网络延迟，请稍后再试！");
                }
            });
        },
        module: function (mName, fn) {
            !N[mName] && (N[mName] = new fn());

        }
    };

    N.module("bodyH", function(){

        this.mpage = function() {
            var winH = $(window).height();
            $("#mainPage").css("height",winH);
            $(".encounter").css("height",winH-50);
        }
        this.init = function() {
            var that = this;
            this.mpage();
            window.onresize = function(){
                that.mpage();
            }
        }
        this.init();
    })

    //首页
    N.module("mainhome", function(){
        var mainFn = {
            teamInfo: function() {
                var that = this;
                N.loadData({url: domain_url+'sport/match/info',callbackSportMatchInfo:function(data){
                    if(data.code == 0){
                        $(".top_log").css({"background-image":"url('"+data.ad1+"')"});//广告01
                    }
                },data:{
                    op: openid
                }});
            }
        }; 
        this.init = function() {
            mainFn.teamInfo();
        }
        this.init();
    });
    
    //一键关注
    if(openid) {
        shaketv.subscribe({
            appid: weixin_appid,
            selector: "#div_subscribe_area",
            type: 1
        }, function(returnData) {

        });
    }
})