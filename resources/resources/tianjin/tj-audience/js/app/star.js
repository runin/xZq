// JavaScript Document
H.openjs = {
        localId: "",
        serverId: "",
        init: function() {
            window.callbackJsapiTicketHandler = function(data) {};
            $.ajax({
                type: 'GET',
                url: domain_url + 'mp/jsapiticket',
                data: {
                    appId: shaketv_appid
                },
                async: true,
                dataType: 'jsonp',
                jsonpCallback: 'callbackJsapiTicketHandler',
                success: function(data){
                    if (data.code !== 0) {
                        return;
                    }
                    
                    var nonceStr = 'F7SxQmyXaFeHsFOT',
                        timestamp = new Date().getTime(),
                        url = window.location.href.split('#')[0],
                        signature = hex_sha1('jsapi_ticket=' + data.ticket + '&noncestr=' + nonceStr + '&timestamp=' + timestamp + '&url=' + url);

                    wx.config({
                        debug: false,
                        appId: shaketv_appid,   
                        timestamp: timestamp,
                        nonceStr: nonceStr,
                        signature: signature,
                        jsApiList: [
                            'startRecord',
                            'stopRecord',
                            'onVoiceRecordEnd',
                            'onVoicePlayEnd',
                            'playVoice',
                            //'pauseVoice',
                            'user-said',
                            'stopVoice',
                            'keepbtn',
                            'uploadVoice',
                            'downloadVoice'
                        ]
                    });
                },
                error: function(xhr, type){
                     alert('获取微信授权失败！');
                }
            });
        }     
};
H.openjs.init();

var stars = [{
    id: 1,
    name: "李佳",
    avatar: "./images/stars/lj.jpg",
    wish: "http://cdn.holdfun.cn/tianjin/wzj/lj.mp3",
    timh: "6",
}, {
    id: 2,
    name: "宏海",
    avatar: "./images/stars/hh.jpg",
    wish: "http://cdn.holdfun.cn/tianjin/wzj/hh.mp3",
    timh: "10",
}, {
    id: 3,
    name: "海瑛",
    avatar: "./images/stars/hy.jpg",
    wish: "http://cdn.holdfun.cn/tianjin/wzj/hy.mp3",
    timh: "7",
}, {
    id: 4,
    name: "郭睿",
    avatar: "./images/stars/gr.jpg",
    wish: "http://cdn.holdfun.cn/tianjin/wzj/gr.mp3",
    timh: "7",
}, {
    id: 5,
    name: "布丁哥哥",
    avatar: "./images/stars/bdgg.jpg",
    wish: "http://cdn.holdfun.cn/tianjin/wzj/bdgg.mp3",
    timh: "8",
}, {
    id: 6,
    name: "鲍天宇",
    avatar: "./images/stars/bty.jpg",
    wish: "http://cdn.holdfun.cn/tianjin/wzj/bty.mp3",
    timh: "9",
}, {
    id: 7,
    name: "张旭",
    avatar: "./images/stars/zx.jpg",
    wish: "http://cdn.holdfun.cn/tianjin/wzj/zx.mp3",
    timh: "7",
}, {
    id: 8,
    name: "张淼",
    avatar: "./images/stars/zm.jpg",
    wish: "http://cdn.holdfun.cn/tianjin/wzj/zm.mp3",
    timh: "7",
}, {
    id: 9,
    name: "月亮姐姐",
    avatar: "./images/stars/yljj.jpg",
    wish: "http://cdn.holdfun.cn/tianjin/wzj/yljj.mp3",
    timh: "7",
}, {
    id: 10,
    name: "杨威",
    avatar: "./images/stars/yw.jpg",
    wish: "http://cdn.holdfun.cn/tianjin/wzj/yw.mp3",
    timh: "7",
}, {
    id: 11,
    name: "马艳",
    avatar: "./images/stars/my.jpg",
    wish: "http://cdn.holdfun.cn/tianjin/wzj/my.mp3",
    timh: "7",
}, {
    id: 12,
    name: "丁瑾",
    avatar: "./images/stars/dj.jpg",
    wish: "http://cdn.holdfun.cn/tianjin/wzj/dj.mp3",
    timh: "8",
}];

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

    H.main = {
        //统计人数
        updatepv: function() {
            var that = this;
            $.ajax({
                type: 'GET',
                async: true,
                url: domain_url + "log/serpv?temp=" + new Date().getTime(),
                dataType: "jsonp",
                jsonpCallback: 'callbackCountServicePvHander',
                success: function (data) {
                    setTimeout(function () {
                        that.updatepv();
                    }, 5000);
                    if (data.code == 0) {
                       $(".participant span").text("已有" + data.c + "人发邀请卡");

                    } else {
                        if (data.message) {
                            // alert(data.message);
                        }
                    }
                }
            });
        }
    };
    window.reccordAudios = 0;
    window.timerHl = 0;
	var timeds = 5000;
    N.module("star", function(){
		var jktime = {
            stimeFn: function() {
                var that = this;
                N.loadData({url: domain_url+'api/lottery/round',callbackLotteryRoundHandler:function(data) {
                    
                    if(data.result == true) {
                        var sctm = data.sctm;//系统当前毫秒时间
                        var la = data.la;
                        for(var i=0; i<la.length; i++) {
                            var pd = la[i].pd;//活动日期YYYY-MM-DD
                            var st = la[i].st;//开始时间HH:mm:ss
                            var s = timestamp(pd+" "+st);
                            var et = la[i].et;//结束时间HH:mm:ss
                            var e = timestamp(pd+" "+et);
							var en = la[la.length-1].et;//结束时间HH:mm:s
							var n = timestamp(pd+" "+en);
							
							if(s>sctm || n<sctm) {
								window.location.href = "index.html"
								return;
							}
							if(s<sctm && sctm<e) {
								timeds = e-sctm;
								return;
							}
                        }
                    }
                    
                }});
            },
            stimeInt: function() {
                var that = this;
				var stime;
                that.stimeFn();
				clearInterval(stime);
                stime = setInterval(function() {
                    that.stimeFn();
                },timeds);
            }
        };
		
        //判断是否是分享
        var judge = {
            shakeJu: function() {
                //var url = getQueryString("uuid");
				jktime.stimeInt();
                if(getQueryString("uuid")) {
                    shakeUrl.$shakeFn();
                }else {
                    starList.starArray();
                }
                $(".participant").find("label").text();
                starList.divH();
            }
        };
        //制作贺卡
        var starList = {
            $stars: $("#star-list"),
            $iconVoice: $(".icon-voice"),
            starId: getQueryString("id"),
            $mainStar: $(".main-star"),
            $mainCard: $(".main-card"),
            $getMyimg: $("#get-myimg"),//用户头像
            $getMyname: $("#get-myname"),//用户头像
            $voiceMy: $(".voice-my"),
            $textMy: $(".text-my"),
            $voiceCon: $(".voice-con"),
            $btnCon: $("#btn-scon"),
            $successText: $(".success-text"),
            $btnZhk: $("#btn-zhk"),
            $makeStarimg: $("#make-starimg"),
            $makeCard: $("#make-card"),
            $userSaid: $("#user-said"),
            $mystarName: $("#mystar-name"),
            $on: true,
            divH: function() {
                var winH = $(window).height();
                this.$mainCard.css("height",winH);
                $("#boxheight").css("height",winH);
                $(".backhome").click(function() {
                    window.location.href="index.html";
                });
            },
            starArray: function() {//遍历明星
                this.$mainStar.removeClass("none");
                var starsLength = stars.length;
                var d = simpleTpl(),
                    b = W.stars || [];
                for(var c=0; c<starsLength; c++) {
                    d._('<li data-id="'+ c +'">')
                        d._('<audio preload="auto" class="none" src="'+ b[c].wish +'"></audio>')
                        d._('<div class="avatar">')
                            d._('<i class="icon-voice none"></i>')
                            d._('<img src="'+ b[c].avatar +'" />')
                        d._('</div>')
                        d._('<span>'+ b[c].name +'</span>')
                    d._('</li>')
                }
                this.$stars.html(d.toString());
                this.starWho();
            },

            starWho: function() {//选中哪个明星
                var that = this;
                var a;
                var b = W.stars || [];
                this.$stars.delegate("li", "click", function(h) {
                    var g = $(this),
                        f = g.siblings("li");
                    if (f.hasClass("scale")) {
                        return
                    }
                    var inx = $(this).index();
                    f.removeClass("selected");
                    $(this).addClass("selected scale");
                    a = $(this).find("audio");
                    a.get(0).play();
                    //a.attr("data-name",Math.ceil($(this).get(0).duration));//音频时间长度
                    $("#timelong").text(b[inx].timh + "''");
                    //alert(a.get(0).duration);

                    a.on("playing", function() {
                        //console.log("playing")
                    }).on("ended", function() {
                        //console.log("ended");
                        a.get(0).pause();
                        g.removeClass("scale")
                    })
                });

                $("#btn-sendcard").click(function(f) {
                    f.preventDefault();
                    var d = that.$stars.find(".selected");
                    if (d.length == 0) {
                        alert("请先选择您喜欢的主持人");
                        return false
                    }
                    a.get(0).pause();
                    that.$mainStar.addClass("none");
                    that.$mainCard.removeClass("none");
                    that.$voiceMy.removeClass("none");
                    var src = d.find("img").attr("src");
                    that.$makeStarimg.find("img").attr("src",src);
                    var text = d.find("span").text();
                    that.$makeCard.find("h3").text(text);
                    that.$mystarName.text(text);
                    var audio = d.find("audio").attr("src");
                    that.$makeCard.find("audio").attr("src",audio);
                    var timer = d.find("audio").attr("data-name");

                    if(headimgurl) {
                        that.$getMyimg.find("img").attr("src",headimgurl + '/' + yao_avatar_size);//用户头像
                    }else {
                        that.$getMyimg.find("img").attr("src","images/avatar.jpg");//用户头像
                    }
                    
                    that.$getMyname.find("h3").text(nickname || "匿名");//用户名称

                    that.playAudio();
                    that.popAudio();
                    that.tabAudio();
                    that.makecardFn();
                    that.starId = d.attr("data-id");
                    //window.location.href = "card.html?id=" + b.starId
                });
            },
            playAudio: function() {//播放音频
                var that = this;
                that.$makeCard.find(".voice-con").click(function() {
                    var g = $(this);
                    g.find("i").addClass("imging");
                    var a = $(this).find("audio");
                    a.get(0).play();
                    a.on("playing", function() {
                        //console.log("playing")
                    }).on("ended", function() {
                        //console.log("ended");
                        a.get(0).pause();
                         g.find("i").removeClass("imging");
                    })
                });
            },
            tabAudio: function() {//语音或文本切换
                var that = this;
                var myAudeo = $("#myaudeo");
                var myText = $("#mytext");
                myAudeo.click(function() {
                    that.$voiceMy.addClass("none");
                    that.$textMy.removeClass("none");
                });
                myText.click(function() {
                    that.$voiceMy.removeClass("none");
                    that.$textMy.addClass("none");
                });
            },
            audioPop: function() {
                var that = this;
                var t = simpleTpl();
                t._('<section class="audio-pop">')
                t._('<div class="audio-pcon">')
                t._('<a href="###" class="audio-close"></a>')
                t._('<div class="audio-pimg"></div>')
                t._('<div class="audio-pbtn">')
                t._('<span id="startbtn">开始录音</span>')
                t._('<span class="none" id="stopbtn">停止录音</span>')
                t._('<span class="none" id="keepbtn">确 定</span>')
                t._('</div>')
                t._('</div>')
                t._('</section>')
                $("body").append(t.toString());
            },
            popAudio: function() {//打开语音弹层
                var that = this;
                $("#on-audeo").click(function() {
                    that.audioPop();
                    that.onSaid();
                    that.closeAudio();
                });
            },
            onSaid: function() {
                //var gettime = 0;
                var ta = 0;
                var tb = 0;
                var that = this;

                //开始录音
                document.querySelector('#startbtn').onclick = function () {
                    wx.startRecord({
                      cancel: function () {
                        alert('用户拒绝授权录音');
                      },
                      success: function () {

                        $("#startbtn").addClass("none");
                        $("#stopbtn").removeClass("none");
                        $(".audio-pimg").addClass("dping");
                        ta = new Date().getTime();
                      }
                    });
                };
                //停止录音
                document.querySelector('#stopbtn').onclick = function () {
                    wx.stopRecord({
                      success: function (res) {
                        $("#stopbtn").addClass("none");
                        $("#keepbtn").removeClass("none");
                        $(".audio-pimg").removeClass("dping");
                        tb = new Date().getTime();
                        H.openjs.localId = res.localId;
                      },
                      fail: function (res) {
                        alert(JSON.stringify(res));
                      }
                    });
                };

                //试听录音
                /*
                document.querySelector('#shitingbtn').onclick = function () {
                    if (H.openjs.localId == '') {
                        alert('先说点什么吧');
                        return;
                    }
                    $(".audio-pimg").addClass("dping");
                    wx.playVoice({
                        localId: H.openjs.localId
                    });
                };
                */
                // 监听录音播放停止
                wx.onVoicePlayEnd({
                    complete: function (res) {
                      //$(".audio-pimg").removeClass("dping");
                      $(".talking").removeClass("imging");
                      //alert('录音（' + res.localId + '）播放结束');
                    }
                });
                // 监听录音自动停止
                wx.onVoiceRecordEnd({
                    complete: function (res) {
                      H.openjs.localId = res.localId;
                      $(".audio-pimg").removeClass("dping");
                      $(".talking").removeClass("imging");
                      alert('录音时间已超过一分钟');
                    }
                });
                // 确定关闭弹层
                document.querySelector('#keepbtn').onclick = function () {
                    wx.stopVoice({
                        localId: H.openjs.localId
                    });
                    wx.uploadVoice({
                        localId: H.openjs.localId,
                        success: function (res) {
                            H.openjs.serverId = res.serverId;
                            $("#timehow").text(Math.ceil((tb-ta)/1000) + "''");//计算语音长度
                            reccordAudios = Math.ceil((tb-ta)/1000);
                            that.$voiceMy.addClass("none");
                            that.$userSaid.removeClass("none");
                            $(".audio-pop").remove();
                            that.shiTing();
                        }
                    });
                };
            },
            closeAudio: function() {
                $(".audio-close").click(function() {
                    wx.stopVoice({
                        localId: H.openjs.localId
                    });
                    wx.stopRecord({
                        success: function (res) {
                           H.openjs.localId = "";
                        }
                    });
                    $(".audio-pop").remove();
                });
            },
            shiTing: function() {//试听录音
                var that = this;
                document.querySelector('#user-said').onclick = function () {
                    if(!that.$makeCard.find(".talking").hasClass("imging")) {
                        $(this).find(".talking").addClass("imging");
                        wx.playVoice({
                            localId: H.openjs.localId
                        });
                    }
                };
            },
            /*
            uploadVoice: function() {//上传语音
                wx.uploadVoice({
                    localId: H.openjs.localId,
                    success: function (res) {
                        H.openjs.serverId = res.serverId;
                    }
                });
            },
            */
            tipsPop: function() {//成功后提示
                var t = simpleTpl();
                t._('<section class="tipspop">邀请卡制作成功！</section>')
                $("body").append(t.toString());
            },
            makecardFn: function() {
                var that = this;

                function delQueStr(url, ref) {
                    var str = "";
                    if (url.indexOf('?') != -1) {
                        str = url.substr(url.indexOf('?') + 1);
                    }
                    else {
                        return url;
                    }
                    var arr = "";
                    var returnurl = "";
                    var setparam = "";
                    if (str.indexOf('&') != -1) {
                        arr = str.split('&');
                        for (var i in arr) {
                            if (arr[i].split('=')[0] != ref) {
                                returnurl = returnurl + arr[i].split('=')[0] + "=" + arr[i].split('=')[1] + "&";
                            }
                        }
                        return url.substr(0, url.indexOf('?')) + "?" + returnurl.substr(0, returnurl.length - 1);
                    }
                    else {
                        arr = str.split('=');
                        if (arr[0] == ref) {
                            return url.substr(0, url.indexOf('?'));
                        }
                        else {
                            return url;
                        }
                    }
                };

                $("#btn-submit").click(function(e) {
                    e.preventDefault();
					var zname = $("#make-card").find("h3").text();
                    var q = $("#input-text"),
                        l = H.openjs.localId,
                        o = $.trim(q.val()),
                        m = o.length;
                        //p = g.hasClass("voice") ? false : true;
                    if (m == 0 && l=="") {
                        alert("先说点什么吧");
                        return
                    } else {
                        if (m > 300) {
                            alert("祝福的话儿贵精不贵多哦");
                            return
                        }
                    }
                    N.loadData({url: domain_url+'api/greetingcard/make',callbackMakeCardHandler:function(data) {

                        if(data.result == true) {
                            //W.cardid = data.cu;
                            $(".send-friend,.success-text").removeClass("none");
                            $("#btn-scon").addClass("none");

                            that.tipsPop();
                            share_url = delQueStr(share_url, 'uuid');
                            share_url = delQueStr(share_url, 'serverId');
                            share_url = delQueStr(share_url, 'reccordAudios');
                            share_url = add_param(share_url, 'uuid', data.cu, true);
                            share_url = add_param(share_url, 'serverId', H.openjs.serverId, true);
                            share_url = add_param(share_url, 'reccordAudios', window.reccordAudios, true);
                            share_url = add_param(share_url, 'timerHow', window.timerHl, true);
                            share_url = add_yao_prefix(share_url);
							share_title = "我和主持人"+ zname +"邀请您一起玩转观众节，5.8-5.10梅江会展中心等您哦~";
                            window['shaketv'] && shaketv.wxShare(share_img, share_title, share_desc, share_url);
							/*
                            wx.onMenuShareAppMessage({
                                  title: share_title, // 分享标题
                                  desc: share_desc, // 分享描述
                                  link: share_url, // 分享链接
                                  imgUrl: share_img, // 分享图标
                                  success: function (res) {
                                    //window.location.href = "lottery.html"
                                  }
                            });
                            wx.onMenuShareTimeline({
                                title: share_title, // 分享标题
                                link: share_url, // 分享链接
                                imgUrl: share_img, // 分享图标
                                success: function () { 
                                    //window.location.href = "lottery.html"
                                }
                            });
							*/
                            return
                        }
                        alert("发邀请卡失败，请重试")
                        
                    },data:{
                        oi: openid,
                        sn: that.starId,
                        vi: H.openjs.serverId,
                        gt: o,
                        nn: nickname,
                        hi: headimgurl + '/' + yao_avatar_size
                    }});
                });
            }
        };

        //分享页面
        var shakeUrl = {
            playingVoiceId : '',
            $userText: $("#user-text"),
            $serverId: $("#serverId"),
            $starAudio: function(b) {//明星相关
                var that = this;
                if(!b){
                    return
                }
                $("#make-starimg").find("img").attr("src",b.avatar);
                $("#make-card").find("h3").text(b.name);
                $("#mystar-name").text(b.name);
                $("#make-card").find("audio").attr("src",b.wish);
                var ai = $("#make-card").find("audio");
                $("#timelong").text(b.timh+ "''");
                var btim = parseInt(b.timh)*1000;
                $("#make-card").find(".voice-con").click(function(){
                    $("#user-said").find(".talking").removeClass("imging");
                    $(this).find(".talking").addClass("imging");
                    wx.ready(function(){
                        wx.stopVoice({
                            localId: playingVoiceId
                        });
                    });
                    ai.get(0).play();
                    setTimeout(function() {
                        $("#make-card").find(".talking").removeClass("imging");
                    },btim);
                    ai.on("playing", function() {
                    //console.log("playing")
                    }).on("ended", function() {
                        //console.log("ended");
                        ai.get(0).pause();
                        $("#make-card").find(".talking").removeClass("imging");
                    })
                });
            },
            $shakeFn: function() {
                var that = this;
                starList.$mainCard.removeClass("none");
                starList.$voiceCon.removeClass("none");
                starList.$textMy.addClass("none");
                starList.$btnZhk.removeClass("none");
                N.loadData({url: domain_url+'api/greetingcard/get',callbackCardInfoHandler:function(data) {
                    if(data.result == true) {
                        starList.$getMyimg.find("img").attr("src",data.hi);//用户头像
                        starList.$getMyname.find("h3").text(data.nn);//用户名称
                        var gt = data.gt,
                            vi = data.vi,
                            sn = parseInt(data.sn),
                            b = W.stars[sn];
                        that.$starAudio(b);
                        if(gt) {
                            that.$userText.removeClass("none").find("div").text(gt);
                            starList.$userSaid.addClass("none");
                        }else {
                            $("#timehow").text(getQueryString("reccordAudios")+"''");
                            //试听
                             wx.ready(function(){

                              wx.downloadVoice({
                                serverId: data.vi, 
                                isShowProgressTips: 1, 
                                success: function (res) {
                                    var localId = res.localId; 
                                    playingVoiceId = localId;
                                     document.querySelector('#user-said').onclick = function () {
                                        var rad = parseInt(getQueryString("reccordAudios"))*1000;
                                        
                                       // if(!$("#make-card").find(".talking").hasClass("imging")) {
                                            $("#make-card").find("audio").get(0).pause();
                                            $("#make-card").find(".talking").removeClass("imging");
                                            $(this).find(".talking").addClass("imging");

                                            wx.playVoice({
                                                localId: localId
                                            });
                                            setTimeout(function() {
                                                $("#user-said").find(".talking").removeClass("imging");
                                            },rad)
                                            // 监听录音播放停止
                                            wx.onVoicePlayEnd({
                                                success: function (res) {
                                                    var localId = res.localId;; // 返回音频的本地ID
                                                    $(this).find(".talking").removeClass("imging");
                                                }
                                            });
                                            wx.onVoiceRecordEnd({
                                                complete: function (res) {
                                                    var localId = res.localId; 
                                                    $(this).find(".talking").removeClass("imging");
                                                }
                                            });
                                        //}
                                    };
                                }
                            });

                             })
                            that.$userText.addClass("none");
                        }
                    }
                
                },data:{
                    cu:getQueryString("uuid")
                }})
            }
        };
        this.init = function() {
            judge.shakeJu();
        };
        this.init();
    });

    H.main.updatepv();
})