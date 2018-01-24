$(function () {
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
        hashchange: (function () {
            $(window).bind("hashchange", function () {
                var pname = window.location.hash.slice(1);
                if (pname) {
                    N.page[pname]();
                } else {
                    pname = "firstPage";
                    N.page[pname]();
                }
                if (N[pname].goIntoFn) {
                    N[pname].goIntoFn();
                }
            });
            return {};
        })(),
        loadData: function (param) {

            var p = $.extend({ url: "", type: "get", async: false, dataType: "jsonp", showload: true }, param);
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
            $.ajax({ type: p.type, data: param.data, async: p.async, url: p.url, dataType: p.dataType, jsonpCallback: cbName,
                success: function (data) {

                    W.hideLoading();
                    cbFn(data);

                },
                error: function () {
                    if (param.error) { param.error() };
                    W.hideLoading();
                    // H.dialog.showWin.open("抱歉网络延迟，请稍后再试！");
                }
            });
        },
        loadImg: function (img) {
            if (!this.images) {
                this.images = [];
            }
            if (img && !(img instanceof Array)) {
                img.isLoad = false;
                this.images.push(img);
            } else if ((img instanceof Array)) {
                for (var i = 0; i < img.length; i++) {
                    img[i].isLoad = false;
                    this.images.push(img[i]);
                }
            }
            for (var j = 0; j < this.images.length; j++) {
                var that = this;
                if (!this.images[j].isLoad) {
                    var im = new Image();
                    im.src = this.images[j].src;
                    this.images[j].isLoad = true;
                    im.onload = function () {

                    }
                }
            }
        },
        module: function (mName, fn, fn2) {
            !N[mName] && (N[mName] = new fn());
            if (fn2) {
                $(function () {
                    fn2();
                });
            }

        },
        page: {
            firstPage: function (fn) {
                window.location.hash = "firstPage";
                $(".footer").show();
                $(".bottom_tip").show();
                N.showPage("firstPage", function () {

                    if (fn) {
                        fn();
                    }
                })
            },
            starPage: function (fn) {
                window.location.hash = "starPage";

                $(".footer").hide();
                N.showPage("starPage", function () {
                    if (fn) {
                        fn();
                    }
                })
            }
        }
    };
    H.openjs = {
        localId: "",
        serverId: "",
        init: function (fn) {

            window.callbackJsapiTicketHandler = function (data) { };
            $.ajax({
                type: 'GET',
                url: domain_url + 'mp/jsapiticket',
                data: {
                    appId: shaketv_appid
                },
                async: true,
                dataType: 'jsonp',
                jsonpCallback: 'callbackJsapiTicketHandler',
                success: function (data) {
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
                            'stopVoice',
                            'uploadVoice',
                            'downloadVoice',
                            'pauseVoice'

                        ]
                    });

                    window.signature = signature;
                    if (fn) {
                        fn();
                    }

                },
                error: function (xhr, type) {
                    alert('获取微信授权失败！');
                }
            });
        }

    };
    window.H = H;
    H.openjs.init();

    N.module("firstPage", function () {
    

        this.initEvent = function () {
            setTimeout(function () {
                N.page.starPage();

            }, 3000);

        };
        this.init = function () {
            if (window.location.href.indexOf('cb41faa22e731e9b') == -1) {
                $('#div_subscribe_area').css('height', '0');
            } else {
                $('#div_subscribe_area').css('height', '50px');
            };
            var getQueryString2 = function (name) {
                var currentSearch = decodeURIComponent(share_url.split('?')[1]);
                if (currentSearch != '') {
                    var paras = currentSearch.split('&');
                    for (var i = 0, l = paras.length, items; i < l; i++) {
                        items = paras[i].split('=');
                        if (items[0] === name) {
                            return items[1];
                        }
                    }
                    return '';
                }
                return '';
            };

            this.initEvent();


            if (getQueryString2("cardUuid")) {
                window.loadgreetingcardCount = 0;
                function greetingcardFn() {
                    N.loadData({ url: domain_url + "api/greetingcard/get?temp=" + new Date().getTime(), callbackCardInfoHandler: function (data) {
                        N.page.starPage();
                        if (data.result) {
                            window.share_head = data.hi + "/64";
                            window.share_nickname = data.nn;
                            window.share_bgimgurl = N["starPage1"].starsList[parseInt(data.sn) + 1].bgimgurl;
                            $.proxy(N["starPage1"].eventObj.f_share_btnFn, N["starPage1"])(0, data.sn);
                            var currentWin = N["starPage1"].currentWin;
                            var wo = currentWin.winObj;
                            wo.find(".audios_icon").hide();
                            wo.find(".audios_icon_success").show();
                            wo.find(".s_con").append('<img src="./images/i_in.png" class="i_in" />');
                            wo.find(".i_in").unbind("click").click(function () {

                                currentWin.close();

                                //                                    currentWin.setUserImg(headimgurl);
                                //                                    currentWin.setNickname(nickname);

                                //                                    $.proxy(N["starPage1"].eventObj.recordAudios, N["starPage1"])(wo);



                            });
                            wx.ready(function () {

                                wx.downloadVoice({
                                    serverId: getQueryString2("serverId"), // 需要下载的音频的服务器端ID，由uploadVoice接口获得
                                    isShowProgressTips: 1, // 默认为1，显示进度提示
                                    success: function (res) {

                                        var localId = res.localId; // 返回音频的本地ID
                                        var reccordAudios = getQueryString2("reccordAudios");

                                        if (reccordAudios) {
                                            wo.find(".play_long_num").text(reccordAudios + "\'");

                                        }
                                        wo.find(".audios_icon_success").unbind("click").click(function () {
                                            var p = wo.find(".play_img_tip");
                                            p.addClass("playBack");
                                            wx.playVoice({
                                                localId: localId
                                            });
                                            wx.onVoicePlayEnd({
                                                complete: function (res) {
                                                    p.removeClass("playBack");
                                                }
                                            });
                                            wx.onVoiceRecordEnd({
                                                complete: function (res) {
                                                    p.removeClass("playBack");
                                                }
                                            });

                                            setTimeout(function () {
                                                p.removeClass("playBack");
                                            }, parseInt(reccordAudios) * 1000);


                                        });
                                        //播放背景音乐

                                        var au = $("li[data-id='" + parseInt(data.sn) + "']").find('audio').get(0);
                                        if (au) {
                                            au.play();
                                        }

                                    },
                                    fail: function (res) {
                                        alert("下载音频失败");
                                    }
                                });
                            })



                        } else {
                            if (window.loadgreetingcardCount > 10) {
                                return;
                            }
                            setTimeout(function () {
                                greetingcardFn();
                                window.loadgreetingcardCount++;
                            }, 1000);

                        }

                    },
                        data: { cu: encodeURIComponent(getQueryString2("cardUuid")) }
                    })
                }
                greetingcardFn();

            } else {
                N.page.firstPage();
            }
        };
        this.goIntoFn = function () {
            this.initEvent();
        }
        this.init();
    });

    N.module("starPage1", function () {
     

        this.showStarWin = function (obj) {
            var p = $.extend({
                starid: '', //明星id
                name: '', //明星姓名
                voice: '', //明星声音
                headimgurl: '', //明星头像
                bgimgurl: '', //明星背景大图
                userimgurl: '', //用户头像
                nickname: ''
            }, obj || {});

            var arr = [];
            arr.push('<section class="star_record"><div class="s_model"></div><div class="s_con"><img src="./images/close_b.png" class="audio_close" /><div class="s_head">');
            arr.push('<img src="images/s_b_t.png" class="s_head_img" /></div>');
            arr.push('<div class="s_man"><div class="s_man_headImg"><img src="./images/avatar.jpg" class="s_m_h_i" alt="" /></div>');
            arr.push('<div class="audios_icon_name"><div class="s_niname">**</div>');
            arr.push('<div class="audios_icon" ><div class="audios_litte"><img src="images/audios_litte.png" /></div>');
            arr.push('<div class="audios_big"><div class="audios_big_tip">点击加入你的声音</div></div></div>');
            arr.push('<div class="audios_icon_success"  style="display:none"><div class="audios_icon_success_div">');
            arr.push('<div  class="play_img_tip" ></div><div class="play_long_num"></div></div>');
            arr.push('<div class="shanjiao"></div></div></div><div class="audios_long_icon"><div class="audios_long_tip"></div></div>');
            arr.push('</div></div></section>');
            this.winObj = $(arr.join(""));

            this.setUserImg = function (imgurl) {
                if (imgurl) {
                    this.winObj.find(".s_m_h_i").attr("src", imgurl + "/64");
                    return;
                }
                if (p.headimgurl) {
                    this.winObj.find(".s_m_h_i").attr("src", p.headimgurl + "/64");
                    return;
                }
                // this.winObj.find(".s_m_h_i").attr("src", "./images/avatar.jpg");
            }
            this.setNickname = function (nickname) {
                this.winObj.find(".s_niname").text(nickname || "匿名");
            }
            this.setWinBg = function (bgimgurl) {
                this.winObj.find(".s_con").css({ "background-image": "url(" + (bgimgurl || p.bgimgurl) + ")" });
            }
            this.initWinEvent = function () {
                var that = this;
                this.winObj.find(".audios_big_tip").unbind("click").click(function () {
                    if (that.recordAudios) {
                        that.recordAudios(that.winObj);
                    }
                });
                this.winObj.find(".audio_close").unbind("click").click(function () {
                    that.close();




                });
            };
            this.close = function () {
                this.winObj.remove();
            }
            this.init = function (fn) {

                this.setUserImg(p.userimgurl);

                this.setNickname(p.nickname);
                this.setWinBg(p.bgimgurl);

                this.winObj.hide();
                $("body").append(this.winObj);

                this.initWinEvent();

                this.winObj.find(".s_con").addClass("show_slow");

                this.winObj.show();
                if (fn) {
                    fn();
                }
            }
        };
        this.showAudiosWin = function (fn) {
            var arr = [];
            arr.push('<section class="audio-pop"><div class="audio-pcon"><img src="./images/close-a.png" class="audio_close" /> <div class="audio-pimg"></div>');
            arr.push('<div class="audio-pbtn"><span id="startbtn">开始录音</span><span id="stopbtn">停止录音</span>');
            arr.push('<span id="shitingbtn">试 听</span><span id="keepbtn">确 定</span>');
            arr.push('</div></div></section>');
            this.AudiosWin = $(arr.join(""));
            this.initAudiosEvent = function () {
                var that = this;
                this.AudiosWin.find(".audio_close").unbind("click").click(function () {
                    that.close();
                });
            }
            this.close = function () {
                this.AudiosWin.remove();
                //                try {
                //                    wx.stopRecord();
                //                } catch (e) {

                //                }

            }
            this.init = function (fn) {
                this.AudiosWin.hide();
                $("body").append(this.AudiosWin);
                this.initAudiosEvent();
                this.AudiosWin.find(".audio-pcon").addClass("show_slow");
                this.AudiosWin.show();
                if (fn) {
                    fn();
                }
            }

        };
        this.initParam = function () {
            this.star_list = $("#star-list");
            this.arrow = $(".arrow");
            this.f_share_btn = $(".f_share_btn"); //点击分享给朋友普
        };

        this.initWx = function () {


        };

        this.initEvent = function () {
            this.eventObj = {
                f_share_btnFn: function (e, selectStarId) {
                    if (e) {

                        window.share_head = "";
                        window.share_nickname = "";
                    } else {


                    }

                    if (!selectStarId) {
                        if (this.star_list.find(".selected").length == 0) {
                            alert("请先选择一个明星");
                            return;
                        }
                        this.selectStarId = $(".selected", this.star_list).attr("data-id");
                    } else {
                        this.selectStarId = selectStarId;
                    }





                    var headimgurlt = window.share_head || headimgurl || "./images/avatar.jpg";
                    var bgimgurlt = this.starsList[this.selectStarId - 1].bgimgurl;
                    var nicknamet = window.share_nickname || nickname || "匿名";

                    this.currentWin = new this.showStarWin({ starid: this.selectStarId, bgimgurl: bgimgurlt, userimgurl: headimgurlt, nickname: nicknamet });
                    this.currentWin.init();

                    var that = this;
                    this.currentWin.recordAudios = function (wo) {
                        $.proxy(that.eventObj.recordAudios, that)(wo);
                    }
                },
                recordAudios: function (wo) {//录音的操作逻辑
                    window.reccordAudios = 0;
                    var that = this;
                    var auWin = new this.showAudiosWin();
                    auWin.init(function () {
                        var startbtn = $("#startbtn");
                        var stopbtn = $("#stopbtn");
                        var shitingbtn = $("#shitingbtn");
                        var keepbtn = $("#keepbtn");
                        function changeBtnFn(clickBtn) {
                            if (clickBtn == "start_before") {
                                startbtn.show();
                                stopbtn.hide();
                                shitingbtn.show();
                                keepbtn.show();
                                shitingbtn.addClass("noClick");
                                keepbtn.addClass("noClick");

                            }

                            if (clickBtn == "startBtn_click") {
                                startbtn.hide();
                                stopbtn.show();
                                shitingbtn.show();
                                keepbtn.show();
                                shitingbtn.addClass("noClick");
                                keepbtn.addClass("noClick");

                            }
                            if (clickBtn == "stopbtn_click") {
                                startbtn.show();
                                stopbtn.hide();
                                shitingbtn.show();
                                keepbtn.show();
                                shitingbtn.removeClass("noClick");
                                keepbtn.removeClass("noClick");

                            }




                        }
                        changeBtnFn("start_before");
                        document.querySelector('#startbtn').onclick = function () {
                            if ($("#startbtn").hasClass("noClick")) {
                                return;
                            }
                            changeBtnFn("startBtn_click");
                            wx.startRecord({
                                cancel: function () {
                                    alert('用户拒绝授权录音');
                                },
                                success: function () {

                                    $(".audio-pcon").addClass("pcon-a");
                                    window.recordInterval = setInterval(function () {
                                        window.reccordAudios++;
                                    }, 1000);

                                }
                            });
                        };
                        //停止录音
                        document.querySelector('#stopbtn').onclick = function () {

                            changeBtnFn("stopbtn_click");
                            if ($("#stopbtn").hasClass("noClick")) {
                                return;
                            }

                            $(".audio-pcon").removeClass("pcon-a");

                            wx.stopRecord({
                                success: function (res) {
                                    if (window.recordInterval) {
                                        clearInterval(window.recordInterval);
                                    }
                                    H.openjs.localId = res.localId;
                                    $("#startbtn").show();
                                    $("#stopbtn").hide();
                                },
                                fail: function (res) {

                                    alert("停止失败");
                                    if (window.recordInterval) {
                                        clearInterval(window.recordInterval);
                                    }
                                }
                            });
                        };
                        //试听录音
                        document.querySelector('#shitingbtn').onclick = function () {
                            if ($("#shitingbtn").hasClass("noClick")) {
                                return;
                            }
                            if (H.openjs.localId == '') {
                                alert('请先录音');
                                return;
                            }

                            $(".audio-pcon").addClass("pcon-a");
                            wx.playVoice({
                                localId: H.openjs.localId

                            });
                        };
                        // 监听录音播放停止
                        wx.onVoicePlayEnd({
                            complete: function (res) {
                                $(".audio-pcon").removeClass("pcon-a");
                                //alert('录音（' + res.localId + '）播放结束');
                                if (window.recordInterval) {
                                    clearInterval(window.recordInterval);
                                }
                            }
                        });
                        // 监听录音自动停止
                        wx.onVoiceRecordEnd({
                            complete: function (res) {
                                $(".audio-pcon").removeClass("pcon-a");
                                H.openjs.localId = res.localId;
                                alert('录音时间已超过一分钟');
                                if (window.recordInterval) {
                                    clearInterval(window.recordInterval);
                                }
                            }
                        });
                        // 确定关闭弹层,上传录音
                        document.querySelector('#keepbtn').onclick = function () {

                            if ($("#keepbtn").hasClass("noClick")) {
                                return;
                            }

                            auWin.close();

                            if (H.openjs.localId == '') {
                                alert('请先录音');
                                return;
                            }

                            setTimeout(function () {
                                wx.stopVoice({
                                    localId: H.openjs.localId
                                });
                                wx.uploadVoice({
                                    localId: H.openjs.localId,
                                    success: function (res) {
                                        H.openjs.serverId = res.serverId;
                                        audios_successFn();
                                        //    alert("您的录音已上传成功！"); //todo放到本地

                                    }
                                });
                            }, 250);

                        };
                    });

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
                    }


                    function audios_successFn() {

                        var wo = that.currentWin.winObj;
                        wo.find(".audios_icon").hide();
                        wo.find(".audios_icon_success").show();
                        wo.find(".i_in").remove();
                        wo.find(".s_con").append('<img src="./images/f_share.png" class="f_share_btn2" />');
                        wo.find(".play_long_num").text(window.reccordAudios + "\'");




                        wo.find(".audios_icon_success_div").unbind("click").click(function () {
                            var p = wo.find(".play_img_tip");
                            p.addClass("playBack");
                            wx.playVoice({
                                localId: H.openjs.localId
                            });
                            wx.onVoicePlayEnd({
                                complete: function (res) {
                                    p.removeClass("playBack");
                                }
                            });
                            wx.onVoiceRecordEnd({
                                complete: function (res) {
                                    p.removeClass("playBack");
                                }
                            });
                        });





                        wo.find(".f_share_btn2").unbind("click").click(function () {
                            N.loadData({ url: domain_url + "api/greetingcard/make", callbackMakeCardHandler: function (data) {
                                if (data.result) {


                                    //  alert("H.openjs.serverId=" + H.openjs.serverId);
                                    share_url = delQueStr(share_url, 'cardUuid');
                                    share_url = delQueStr(share_url, 'serverId');
                                    share_url = delQueStr(share_url, 'reccordAudios');
                                    share_url = add_param(share_url, 'cardUuid', data.cu, true);
                                    share_url = add_param(share_url, 'serverId', H.openjs.serverId, true);
                                    share_url = add_param(share_url, 'reccordAudios', window.reccordAudios, true);

                                    share_url = add_yao_prefix(share_url);

                                    window['shaketv'] && shaketv.wxShare(share_img, share_title, share_desc, share_url);
                                    wo.find(".s_con").addClass("marginTop20");
                                    wo.find(".f_share_btn2").addClass("push");
                                    wo.find(".f_share_btn2").before("<div class='card_tip'>语音上传成功，右上角，你懂的</div>");







                                } else {
                                    alert("抱歉分享失败");
                                }
                            }, data: { oi: openid, sn: that.selectStarId, vi: H.openjs.serverId, gt: "", hi: headimgurl, nn: nickname }
                            });
                        });

                    }

                }

            }
            this.f_share_btn.unbind("click").click($.proxy(this.eventObj.f_share_btnFn, this)); //分享朋友
        };
        this.fillData = function () {
            this.month = new Date().getMonth() + 1;
            this.days = new Date().getDate();
            this.starsList = window["stars_" + this.month + "_" + this.days];
            var that = this;
            if (!that.starsList) {
                that.starsList = stars_5_1;
            }
            N.loadData({ url: domain_url + "common/time", callbackTimeHandler: function (data) {
                if (data && data.t) {
                    var dt = new Date(data.t);
                    that.month = dt.getMonth() + 1;
                    that.days = dt.getDate();
                }
                that.starsList = window["stars_" + that.month + "_" + that.days];
                if (!that.starsList) {
                    that.starsList = stars_5_1;
                }
                var arr = [];
                for (var i = 0, len = that.starsList.length; i < len; i++) {
                    arr.push('<li data-id="' + that.starsList[i].starNo + '">');
                    arr.push('<audio preload="auto" class="audio none" src="' + that.starsList[i].voice + '"></audio>');
                    arr.push('<div class="avatar">');
                    arr.push('<i class="icon-voice none"></i>');
                    arr.push('<img src="' + that.starsList[i].headimgurl + '" />');
                    arr.push('</div>')
                    arr.push('<span>' + that.starsList[i].name + '</span>');
                    arr.push('</li>');
                }
                that.star_list.html(arr.join('')).css('minHeight', "300px");

                $("#starPage").css({ "height": document.body.scrollHeight, "background-size": "cover" })
                event();
            }
            });

            var event = function () {
                var me = this;

                that.star_list.delegate('li', 'click', function (e) {
                    var $tg = $(this),
					$siblings = $tg.siblings('li');

                    if ($siblings.hasClass('scale')) {
                        return;
                    }
                    $siblings.removeClass('selected');
                    $(this).addClass('selected scale');

                    var $audio = $(this).find('audio');
                    $audio.get(0).play();
                    $audio.on('playing', function () {
                        console.log('playing')
                    }).on('ended', function () {
                        console.log('ended');
                        $audio.get(0).pause();
                        $tg.removeClass('scale');
                    });

                });

                $('#btn-sendcard').click(function (e) {
                    e.preventDefault();

                    var $selected = me.star_list.find('.selected');
                    if ($selected.length == 0) {
                        alert('请先选择您喜欢的明星');
                        return false;
                    }
                    me.starId = $selected.attr('data-id');
                    window.location.href = 'card.html?id=' + me.starId;
                });

                var $box = $('#bomb-box'),
				$baozhu = $('#baozhu');

                $baozhu.addClass('no-border').click(function (e) {
                    me.lottery();
                });
                $('#btn-award').click(function (e) {
                    e.preventDefault();

                    var $mobile = me.$mobile,
					mobile = $.trim($mobile.val());

                    if (!mobile) {
                        H.dialog.didi.open();
                        return;

                    } else if (!/^\d{11}$/.test(mobile)) {
                        alert('请先输入正确的手机号码');
                        $mobile.focus();
                        return;
                    }
                    me.award(mobile, $mobile);
                });
                $('.btn-card').click(function (e) {
                    e.preventDefault();

                    $('html').attr('class', 'h-star');
                });
            }

        }
        this.init = function () {
            this.initParam();
            this.initEvent();
            this.fillData();
            // N.page.starPage();
        };
        this.init();

    });


});
