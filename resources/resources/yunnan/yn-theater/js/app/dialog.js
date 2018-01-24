(function($) {
    H.dialog = {
        puid: 0,
        $container: $('body'),
        REQUEST_CLS: 'requesting',
        iscroll: null,
        clickFlag: true,
        successFlag: true,
        hluck:false,
        haward:false,
        isrank:false,
        isOnFocus:false,
        PV:"",
        PT:"",
        ci:"",
        ts:"",
        si:"",
        cdk:"",
        ru:"",
        init: function() {
            var me = this;
            this.$container.delegate('.btn-rule', 'click', function(e) {
                e.preventDefault();
                H.dialog.rule.open();
            }).delegate('.btn-close', 'click', function(e) {
                e.preventDefault();
                var me = $(this);
                if(H.dialog.isrank == true){
                    $(".rank-dialog").css({"-webkit-animation":"disphide 0.3s","animation-timing-function":"ease-in","-webkit-animation-timing-function":"ease-in"}).one("webkitAnimationEnd", function () {
                        H.dialog.rank.close();
                        $('.rank-dialog').css({"-webkit-animation":""});
                        me.css({"-webkit-animation":""});
                        me.closest('.modal').addClass('none');
                    });
                    H.dialog.isrank = false;
                }else{
                    me.closest('.modal').addClass('none');
                }
            }).delegate('.btn-result', 'click', function(e) {
                e.preventDefault();
                H.dialog.result.open();
            }).delegate('.btn-comeon', 'click', function(e) {
                e.preventDefault();
                H.dialog.guide.open();
            });
            applydata("api/sign/round","callbackSignRoundHandler",true);
            //$.ajax({
            //    type:"GET",
            //    url:domain_url+"api/comments/topic/round",
            //    dataType:"jsonp",
            //    jsonp: "callback",
            //    jsonpCallback:"callbackCommentsTopicInfo",
            //    data:{
            //        openid:openid
            //    },
            //    async: false,
            //    error: function () {
            //        //alert("请求数据失败，请刷新页面");
            //    }
            //});
            //getResult("fashion/indexnew",{
            //	openid:openid
            //},"fashionIndexNewHandler");
        },
        close: function() {
            $('.modal').addClass('none');
            $("header").css("display","none");
        },
        open: function() {
            H.dialog.close();
            if (this.$dialog) {
                this.$dialog.removeClass('none');
            } else {
                this.$dialog = $(this.tpl());
                H.dialog.$container.append(this.$dialog);
            }

            H.dialog.relocate();
        },

        relocate: function() {
            var height = $(window).height(),
                width = $(window).width(),
                top = $(window).scrollTop() + height * 0.06;

            $('.dialog').each(function() {
                if ($(this).hasClass('relocated')) {
                    return;
                }
                $(this).css({
                    'width': width * 0.88,
                    'height': height * 0.91,
                    'left': width * 0.06,
                    'right': width * 0.06,
                    'top': height * 0.06,
                    'bottom': height * 0.06
                });
                $(".rule-dialog").css({
                    'width': width,
                    'height': height * 0.80,
                    'left': 0,
                    'right':0,
                    'top': height * 0.10,
                    'bottom': height * 0.15
                });
                $(".rank-dialog").css({
                    'width': width * 0.86,
                    'height': height * 0.77,
                    'left': width * 0.07,
                    'right':0,
                    'top': height * 0.10,
                    'bottom': height * 0.06
                });
                var $box = $(this).find('.box');
                if ($box.length > 0) {
                    $box.css('height', height * 0.38);
                }
            });
        },

        //引导
        guide: {
            $dialog: null,
            open: function() {
                H.dialog.open.call(this);
                this.event();

                var me = this;
                setTimeout(function() {
                    me.close();
                }, 10000);
            },
            event: function() {
                var me = this;
                this.$dialog.find('.btn-try').click(function(e) {
                    e.preventDefault();
                    $(this).removeClass("pop-zoom").addClass("pop-zoom");
                    me.$dialog && me.$dialog.find(".relocated").addClass("guide-top-ease");
                    setTimeout(function() {
                        me.close();
                    },500);
                });
            },
            close: function() {
                this.$dialog && this.$dialog.addClass('none');
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<section class="modal modal-guide" id="guide-dialog">')
                    ._('<div class="dialog guide-dialog relocated">')
                    ._('<div class="guide-title"></div>')
                    ._('<div class="guide-content"><p><i>1</i>锁定云南卫视《浪漫剧场》</p>')
                    ._('<p><i>2</i>打开微信，进入摇一摇(电视)</p>')
                    ._('<p><i>3</i>对着电视摇一摇</p>')
                    ._('<p><i>4</i>参与互动就有机会赢取超值礼品</p>')
                    ._('<a href="#" class="btn btn-try" data-collect="true" data-collect-flag="guide-trybtn" data-collect-desc="引导弹层-关闭按钮"></a></div>')
                    ._('</div>')
                    ._('</section>');
                return t.toString();
            }
        },

        // 规则
        rule: {
            $dialog: null,
            open: function() {
                H.dialog.open.call(this);
                this.event();
                $(".rule-dialog").addClass("pop-zoom");
                $('body').addClass('noscroll');
                getResult('common/rule', {}, 'callbackRuleHandler', true, this.$dialog);
            },
            close: function() {
                $('body').removeClass('noscroll');
                $('.pop-zoom').removeClass('pop-zoom');
                $('.pop-opacity').removeClass('pop-opacity');
                this.$dialog && this.$dialog.addClass('none');
            },
            event: function() {
                var me = this;
                this.$dialog.find('.btn-close').click(function(e) {
                    e.preventDefault();
                    me.close();
                });
            },
            update: function(rule) {
                this.$dialog.find('.rule').html(rule).removeClass('none');
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<section class="modal" id="rule-dialog">')
                    ._('<div class="dialog rule-dialog">')
                    ._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="ruledialog-closebtn" data-collect-desc="规则弹层-关闭按钮"></a>')
                    ._('<div class="content border">')
                    ._('<h2></h2>')
                    ._('<div class="rule none"></div>')
                    ._('</div>')
                    ._('</div>')
                    ._('</section>');
                return t.toString();
            }
        },
        // 积分排行榜
        rank: {
            $dialog: null,
            open: function() {
                H.dialog.open.call(this);
                this.event();
                getResult('api/lottery/integral/rank/self', {
                    oi: openid,
                    pu:acttUID
                }, 'callbackIntegralRankSelfRoundHandler', true, this.$dialog);
            },
            close: function() {
                this.$dialog && this.$dialog.addClass('none');
            },
            event: function() {
                var me = this;
                //this.$dialog.find('.btn-close').click(function(e) {
                //    e.preventDefault();
                //    me.close();
                //});
                H.dialog.isrank = true;
            },
            selfupdate: function(data) {
                this.$dialog.find('.jf').text(data.in || 0);
                this.$dialog.find('.pm').text(data.rk || '暂无排名');
                getResult('api/lottery/integral/rank/top10', {pu:acttUID}, 'callbackIntegralRankTop10RoundHandler', true, this.$dialog);
            },
            update: function(data) {
                var t = simpleTpl(),
                    top10 = data.top10 || [],
                    len = top10.length;

                for (var i = 0; i < len; i ++) {
                    t._('<li>')
                        ._('<span class="r-avatar"><img src="'+ (top10[i].hi ? (top10[i].hi + '/64') : './images/danmu-head.jpg') +'" /></span>')
                        ._('<span class="r-rank">第'+ (top10[i].rk || '-') +'名</span>')
                        //._('<span class="r-bac"></span>')
                        ._('<span class="r-name ellipsis">积分：'+ (top10[i].in || '0') +'</span>')
                        ._('</li>');
                }
                this.$dialog.find('ul').html(t.toString());
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<section class="modal" id="rank-dialog">')
                    ._('<div class="dialog rank-dialog">')
                    ._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="rankdialog-closebtn" data-collect-desc="积分排行榜弹层-关闭按钮"></a>')
                    ._('<div class="rank-content"><div class="rank-title" ></div><p>积分前十奖品请参照活动规则</p>')
                    ._('<h3>我的积分：<span class="jf"></span>排名<span class="pm"></span></h3>')
                    ._('<div class="list border">')
                    ._('<div class="content">')
                    ._('<ul></ul>')
                    ._('</div>')
                    ._('</div></div>')
                    ._('</div>')
                    ._('</section>');
                return t.toString();
            }
        },
        iphonefixed: function () {
            H.dialog.isOnFocus = true;
        },
        fudai: {
            $dialog: null,
            open: function() {
                var me = this, $dialog = this.$dialog;
                H.dialog.open.call(this);
                this.event();
            },
            close: function() {
                this.$dialog && this.$dialog.addClass('none');
            },
            event: function() {
                var me = this,
                    $fudai = this.$dialog.find('.fudai');
                if (H.dialog.clickFlag) {
                    H.dialog.clickFlag = false;
                    $fudai.click(function(e) {
                        e.preventDefault();
                        setTimeout(function() {
                            shownewLoading();
                            setTimeout(function () {
                                recordUserOperate(openid, "调用抽奖接口", "doLottery");
                                $.ajax({
                                    type : 'GET',
                                    async : false,
                                    url : domain_url + 'api/lottery/luck'+dev,
                                    data: {
                                        oi: openid,
                                        sau:acttUID
                                    },
                                    dataType : "jsonp",
                                    jsonpCallback : 'callbackLotteryLuckHandler'
                                });
                            },(Math.ceil(5000*Math.random())))
                        }, 5);
                        me.close();
                    });
                } else {
                    return;
                };
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<section class="modal" id="fudai-dialog">')
                    ._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="rankdialog-closebtn" data-collect-desc="领奖弹层-关闭按钮"></a>')
                    ._('<div class="fudai" data-collect="true" data-collect-flag="awarddialog-clickbtn" data-collect-desc="领奖弹层-点击按钮"><div class="hand"></div><div class="fudai-round"></div><p>恭喜您答对了！</br>送您一份大礼，打开看看吧</p><a href="#" class="dakai">打开</a></div>')
                    ._('</section>');
                $(".dakai").on("click", function () {
                    $("header").css("display","none");
                });
                return t.toString();
            }
        },
        lottery: {
            iscroll: null,
            $dialog: null,
            LOTTERIED_CLS: 'lotteried',
            REQUEST_CLS: 'requesting',
            AWARDED_CLS: 'lottery-awarded',
            LOTTERY_NONE_CLS: 'lottery-none',
            sto:null,
            pt:null,
            outurl:"",
            open: function(data) {
                H.dialog.PT = data.pt;
                var me = this, $dialog = this.$dialog,
                    winW = $(window).width(),
                    winH = $(window).height();
                H.dialog.lottery.pt = data.pt;
                hideLoading($dialog);
                H.dialog.open.call(this);
                if (!$dialog) {
                    this.event();
                }
                this.$dialog && this.$dialog.removeClass('none');

                $(".lottery-dialog").css({
                    'width': winW,
                    'height': winH * 0.85,
                    'left': 0,
                    'right':0,
                    'top': winH * 0.07,
                    'bottom': winH * 0.09
                });
                H.dialog.lottery.update(data);
                var inheight;
                if(data.pt == 7){
                    this.$dialog.find('.btn-award').off();
                    H.dialog.lottery.readyFunc();

                    document.getElementById('aw').onload = function () {
                        inheight = ($(".contact").height() + $(".award-img").height() + 35) + $(".awardwin-tips").height() + (winH * 0.2);
                        if(inheight >= winH){
                            $(".award-img img").css("height","60px");
                            inheight = ($(".contact").height() + 95) + (winH * 0.2);
                        }
                        $(".lottery-dialog").css({
                            'height': inheight,
                            'top': (winH - inheight) * 0.5
                        });
                    };
                }else if(data.pt == 9){
                    document.getElementById('aw').onload = function () {
                        inheight = ($(".contact").height() + $(".award-img").height() + 35) + $(".awardwin-tips").height() + (winH * 0.2);
                        if(inheight >= winH){
                            $(".award-img img").css("height","80px");
                            inheight = ($(".contact").height() + 115) + (winH * 0.12);
                        }
                        $(".lottery-dialog").css({
                            'height': inheight,
                            'top': (winH - inheight) * 0.5
                        });
                    };
                }else{
                    document.getElementById('aw').onload = function () {
                        inheight = ($(".contact").height() + $(".award-img").height() + 35) + $(".awardwin-tips").height() + (winH * 0.2);
                        if(inheight >= winH){
                            $(".award-img img").css("height","80px");
                            inheight = ($(".contact").height() + 115) + (winH * 0.12);
                        }

                        $(".lottery-dialog").css({
                            'height': inheight,
                            'top': (winH - inheight) * 0.5
                        });
                    };
                }
                //getResult('api/common/promotion', {oi: openid}, 'commonApiPromotionHandler',true);
            },
            readyFunc: function(){
                var me = this;
                this.$dialog.find('.btn-award').on("click", function (e) {
                    e.preventDefault();
                    if(!$('.btn-award').hasClass("flag")){
                        $('.btn-award').addClass("flag");
                        if(H.dialog.lottery.pt == 7){
                            shownewLoading();
                            me.close();
                            me.sto = setTimeout(function(){
                                //H.lottery.isCanShake = true;
                                hidenewLoading();
                            },15000);
                            // H.lottery.wxCheck = false;
                            setTimeout(function(){
                                H.dialog.lottery.wx_card();
                            },1000);
                        }
                    }
                });
            },
            wx_card:function(){
                var me = this;
                //卡券
                wx.addCard({
                    cardList: [{
                        cardId: H.dialog.ci,
                        cardExt: "{\"timestamp\":\""+ H.dialog.ts +"\",\"signature\":\""+ H.dialog.si +"\"}"
                    }],
                    success: function (res) {
                        getResult('api/lottery/award', {
                            nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
                            hi: headimgurl ? headimgurl : "",
                            oi: openid
                            //rn: me.name ? encodeURIComponent(me.name) : "",
                            //ph: me.mobile ? me.mobile : ""
                        }, 'callbackLotteryAwardHandler');
                        H.yao.isCanShake = true;
                    },
                    fail: function(res){
                        //H.lottery.canJump = true;
                        hidenewLoading();
                        recordUserOperate(openid, res.errMsg, "card-fail");
                        H.yao.isCanShake = true;
                    },
                    complete:function(){
                        me.sto && clearTimeout(me.sto);
                        hidenewLoading();
                        H.yao.isCanShake = true;
                    },
                    cancel:function(){
                        hidenewLoading();
                        H.yao.isCanShake = true;
                    }
                });
            },
            event: function() {
                var me = this;
                $(".award-none").on("click", function () {
                    $("header").css("display","none");
                });
                this.$dialog.find('.btn-award').click(function(e) {
                    e.preventDefault();
                    if (!me.check()) {
                        return false;
                    }
                    var $mobile = $('.mobile'),
                        mobile = $.trim($mobile.val()),
                        $name = $('.name'),
                        name = $.trim($name.val()),
                        $address = $('.address'),
                        address = $.trim($address.val());
                    me.disable();
                    shownewLoading();
                    if(H.dialog.lottery.pt == 7){

                    }else if(H.dialog.PT == 5){
                        var keysInfo = '91quible4lfwm0za';
                        var cdk = H.dialog.cdk;
                        var usermobile = mobile;
                        var type='yaotv';
                        var timestampInfos = new Date().getTime();

                        $.ajax({
                            type: "get",
                            async: !1,
                            url: H.dialog.ru,
                            data:{'mobile':usermobile,'cdk':cdk,'timestamp':new Date().getTime(),'type':type,'sign':hex_md5(usermobile+cdk+type+new Date().getTime()+'91quible4lfwm0za')},
                            dataType: "jsonp",
                            jsonpCallback: "callbackGameHandler",
                            success: function() {},
                            error: function() {}
                        });
                    }else if(H.dialog.PT == 2){
                        setTimeout(function () {
                            getResult('api/lottery/award', {
                                nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
                                hi: headimgurl ? headimgurl : "",
                                oi: openid,
                                rn: encodeURIComponent(name),
                                ph: mobile,
                                ad: address,
                                pv: H.dialog.PV,
                                pu: acttUID
                            }, 'callbackLotteryAwardHandler', true, me.$dialog);
                        },(Math.ceil(5000*Math.random())));
                    }else{
                        setTimeout(function () {
                            getResult('api/lottery/award', {
                                nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
                                hi: headimgurl ? headimgurl : "",
                                oi: openid,
                                rn: encodeURIComponent(name),
                                ph: mobile,
                                ad: address
                            }, 'callbackLotteryAwardHandler', true, me.$dialog);
                        },(Math.ceil(5000*Math.random())))
                    }
                    H.yao.isCanShake = true;
                });

                $("#btn-out").one("click", function () {
                    shownewLoading();
                    getResult('api/lottery/award', {
                        nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
                        hi: headimgurl ? headimgurl : "",
                        oi: openid
                    }, 'callbackLotteryAwardHandler');
                    $(".btn-red").text("领取中");
                    shownewLoading();
                    setTimeout(function () {
                        window.location.href = H.dialog.lottery.outerUrl;
                    },1000)
                });

                this.$dialog.find('.btn-close').click(function(e) {
                    e.preventDefault();
                    me.$dialog && me.$dialog.remove();
                    me.$dialog = null;
                });

                this.$dialog.find('.btn-share').click(function(e) {
                    e.preventDefault();
                    if(H.dialog.lottery.pt == 5){
                        window.location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.wandao.huanghou';//游戏下载地址
                    }else{
                        me.$dialog.find('.btn-close').trigger('click');
                        me.reset();
                        if(H.dialog.isOnFocus == true){
                            window.location.href = "";
                        }
                    }
                });
            },
            update: function(data) {
                if (data != null && data != '') {
                    if (data.result) {
                        if (data.pt === 1) { //实物奖品
                            this.$dialog.find(".lottery-dialog").addClass("award-bg");
                            this.$dialog.find('.awardwin-tips').html(data.tt || '');
                            this.$dialog.find('img').attr('src', (data.pi || ''));
                            this.$dialog.find('.name').val(data.rn || '');
                            this.$dialog.find('.mobile').val(data.ph || '');
                            this.$dialog.find('.address').val(data.ad || '');
                            this.$dialog.addClass(this.LOTTERIED_CLS);
                            this.$dialog.find('.award-win').removeClass('none');
                            this.$dialog.find('.contact').removeClass('redbag');
                        } else if (data.pt === 2) { //积分
                            this.$dialog.find(".lottery-dialog").addClass("award-bg");
                            this.$dialog.find('.awardwin-tips').html(data.tt || '');
                            this.$dialog.find('img').attr('src', (data.pi || ''));
                            this.$dialog.find('.name').val(data.rn || '');
                            this.$dialog.find('.mobile').val(data.ph || '');
                            this.$dialog.find('.address').val(data.ad || '');
                            this.$dialog.addClass(this.LOTTERIED_CLS);
                            this.$dialog.find('.award-win').removeClass('none');
                            this.$dialog.find('.contact').removeClass('redbag');
                        } else if (data.pt === 5) { //兑换码
                            H.dialog.cdk = data.cc;
                            H.dialog.ru = data.ru;
                            this.$dialog.find(".lottery-dialog").addClass("award-bg");
                            this.$dialog.find('.awardwin-tips').html(data.pn || '');
                            this.$dialog.find('img').attr('src', (data.pi || ''));
                            this.$dialog.find('.mobile').val(data.ph || '');
                            this.$dialog.addClass(this.LOTTERIED_CLS);
                            this.$dialog.find('.q-name').addClass("none");
                            this.$dialog.find('.q-address').addClass("none");
                            this.$dialog.find('.award-win').removeClass('none');
                            this.$dialog.find('.contact').removeClass('redbag');
                        } else if (data.pt === 7) { //卡券
                            H.dialog.ci = data.ci;
                            H.dialog.ts = data.ts;
                            H.dialog.si = data.si;
                            this.$dialog.addClass("award-bg");
                            this.$dialog.find('.awardwin-tips').html(data.tt || '');
                            this.$dialog.find('img').attr('src', (data.pi || ''));
                            this.$dialog.addClass(this.LOTTERIED_CLS);
                            this.$dialog.find('.q-name').addClass("none");
                            this.$dialog.find('.q-mobile').addClass("none");
                            this.$dialog.find('.q-address').addClass("none");
                            this.$dialog.find('.award-win').removeClass('none');
                            this.$dialog.find('.award-tip').addClass("none");
                            //this.$dialog.find('.award-win').css({
                            //    'padding-top': '6%'
                            //});
                            this.$dialog.find('.contact').removeClass('redbag');
                        } else if(data.pt === 9){
                            H.dialog.lottery.outerUrl = data.ru;
                            this.$dialog.addClass("award-bg");
                            this.$dialog.find('.awardwin-tips').html(data.tt || '');
                            this.$dialog.find('img').attr('src', (data.pi || ''));
                            this.$dialog.addClass(this.LOTTERIED_CLS);
                            this.$dialog.find('.award-win').removeClass('none');
                            this.$dialog.find('.contact').addClass('redbag');
                            //this.$dialog.find('.award-img').css({
                            //    'padding-top': '6%'
                            //});
                            $("#btn-out").css("display","none");
                        } else {
                            this.$dialog.find('.award-win').addClass('none');
                            this.$dialog.addClass(this.LOTTERY_NONE_CLS);
                        }
                    } else {
                        this.$dialog.find('.award-win').addClass('none');
                        this.$dialog.addClass(this.LOTTERY_NONE_CLS);
                    }
                } else {
                    this.$dialog.find('.award-win').addClass('none');
                    this.$dialog.addClass(this.LOTTERY_NONE_CLS);
                }
                this.$dialog.removeClass(this.REQUEST_CLS);
            },
            check: function() {
                var $mobile = $('.mobile'),
                    mobile = $.trim($mobile.val()),
                    $address = $('.address'),
                    address = $.trim($address.val()),
                    $name = $('.name'),
                    name = $.trim($name.val());
                if(H.dialog.lottery.pt == 5){
                    if (!/^\d{11}$/.test(mobile)) {
                        showTips('这手机号，可打不通...');
                        return false;
                    }
                    return true;
                }else{
                    if (name.length > 20 || name.length == 0) {
                        showTips('请输入您的姓名，不要超过20字哦!');
                        return false;
                    }else if (!/^\d{11}$/.test(mobile)) {
                        showTips('这手机号，可打不通...');
                        return false;
                    }else if(address.length == 0 || address.length > 20){
                        showTips('请填写正确的地址');
                        return false;
                    }
                    return true;
                }
            },

            enable: function() {
                this.$dialog.find('.btn-award').removeClass(this.REQUEST_CLS);
            },
            disable: function() {
                this.$dialog.find('.btn-award').addClass(this.REQUEST_CLS);
            },
            scroll_enable: function() {
                if (this.iscroll) {
                    this.iscroll.scrollTo(0, 0);
                    this.iscroll.enable();
                }
            },
            scroll_disable: function() {
                if (this.iscroll) {
                    this.iscroll.scrollTo(0, 0);
                    this.iscroll.disable();
                }
            },
            succ: function() {
                if(H.dialog.lottery.pt == 5){
                    showTips('领取成功');
                    var me = this,
                        $qmobile = $('.dialog').find('.mobile'),
                        qmobile = $qmobile.val();
                    $qmobile.attr("disabled","disabled");
                    this.$dialog.addClass(this.AWARDED_CLS);
                    var qmobile = $('.mobile').val();
                    $('.mobile').val(qmobile);
                }else if(H.dialog.lottery.pt !== 9){
                    showTips('领取成功');
                    var me = this, $qmobile = $('.dialog').find('.mobile'),
                        qmobile = $qmobile.val(),
                        $name = $('.dialog').find('.name'),
                        qname = $name.val(),
                        $address = $('.dialog').find('.address'),
                        qaddress = $address.val();
                    $qmobile.attr("disabled","disabled");
                    $name.attr("disabled","disabled");
                    $address.attr("disabled","disabled");
                    this.$dialog.addClass(this.AWARDED_CLS);
                    var qname = $('.name').val(),
                        qmobile = $('.mobile').val(),
                        qaddress = $('.address').val();
                    $('.name').val(qname);
                    $('.mobile').val(qmobile);
                    $('.address').val(qaddress);
                }else{
                    shownewLoading();
                }
            },
            reset: function() {
                this.$dialog && this.$dialog.remove();
                this.$dialog = null;
                $("header").css("display","none");
            },
            close: function() {
                this.$dialog.find('.btn-close').trigger('click');
            },
            tpl: function() {
                var t = simpleTpl();

                t._('<section class="modal" id="lottery-dialog">')
                    // ._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="tv-yunnan-tianxia-lotterydialog-closebtn" data-collect-desc="抽奖弹层-关闭按钮"></a>')
                    ._('<div class="dialog lottery-dialog">')
                    ._('<div class="dialog-inner">')
                    ._('<div class="content">')
                    ._('<div class="back">')
                    ._('<div class="award-win none">')
                    ._('<h5 class="awardwin-tips"></h5>')
                    ._('<div class="award-img">')
                    ._('<img id="aw" src="" />')
                    ._('</div>')
                    ._('<div class="contact">')
                    ._('<h4 class="award-tip">请填写您的联系方式,以便顺利领奖</h4>')
                    ._('<h4 class="awarded-tip">以下是您的联系方式</h4>')
                    ._('<p class="q-name">姓名：<input type="text" class="name" onchange="H.dialog.iphonefixed();" placeholder="" /></p>')
                    ._('<p class="q-mobile">电话：<input type="tel" class="mobile" onchange="H.dialog.iphonefixed(); placeholder="" /></p>')
                    ._('<p class="q-address">地址：<input type="text" class="address" onchange="H.dialog.iphonefixed(); placeholder="" /></p>')
                    ._('<a href="#" class="btn btn-award" data-collect="true" data-collect-flag="lotterydialog-OKbtn" data-collect-desc="抽奖弹层-确定按钮">领取</a>')
                    ._('<a href="#" class="btn btn-red" id="btn-out" data-collect="true" data-collect-flag="lotterydialog-redbtn" data-collect-desc="抽奖弹层-领取现金按钮">领取</a>')
                    ._('<div class="share"><a href="#" class="btn btn-share">确定</a></div>')
                    ._('</div>')
                    ._('</div>')
                    ._('<div class="award-none none">')
                    ._('<div class="award-text">真遗憾，下次加油哦</div>')
                    ._('<img src="./images/talk-noad.png">')
                    ._('<a href="#" class="btn-close" id="btn-non" data-collect="true" data-collect-flag="lotterydialog-backbtn" data-collect-desc="答对未中奖-关闭按钮">确定</a>')
                    ._('</div>')
                    ._('</div>')
                    ._('</div>')
                    ._('</div>')
                    ._('</div>')
                    ._('</section>');
                return t.toString();
            }
        },
        success: {
            $dialog: null,
            open: function() {
                var me = this, $dialog = this.$dialog,
                    winH = $(window).height(),
                    winW = $(window).width();
                H.dialog.open.call(this);
                this.event();
                this.$dialog.find('.qrbox').css({
                    'width': winW,
                    'height': winH
                });
                this.$dialog.removeClass('qr');
            },
            close: function() {
                this.$dialog && this.$dialog.addClass('none');
                // this.$dialog && this.$dialog.remove();
                // this.$dialog = null;
            },
            event: function() {
                var me = this,
                    $success = this.$dialog.find('.success');
                $successClose = this.$dialog.find('.btn-close');

                if (H.dialog.successFlag) {
                    H.dialog.successFlag = false;
                    $success.click(function(e) {
                        e.preventDefault();
                        me.$dialog.addClass('qr');
                    });
                    $successClose.click(function(e) {
                        me.close();
                    });
                } else {
                    return;
                }
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<section class="modal" id="success-dialog">')
                    ._('<a href="#" class="btn-close" data-collect="true" data-collect-flag="successdialog-closebtn" data-collect-desc="领奖成功弹层-关闭按钮"></a>')
                    ._('<div class="success" data-collect="true" data-collect-flag="successdialog-clickbtn" data-collect-desc="领奖成功弹层-点击按钮"><div class="success-round"></div><p>领取成功</p><i>关注微店公众号</i></div>')
                    ._('<div class="qrbox"><img src="./images/qrcode.png" border="0"></div>')
                    ._('</section>');
                return t.toString();
            }
        }
    };


    W.callbackGameHandler = function(data){
        hidenewLoading();
        if(data.code == 0){
            getResult('api/lottery/award', {
                nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
                hi: headimgurl ? headimgurl : "",
                oi: openid
            }, 'callbackLotteryAwardHandler', true);
        }else{
            showTips(data.mes);
        }
    };

    // 抽奖
    W.callbackLotteryLuckHandler = function(data) {
        if(data.result && $(".ranking").text() == "积分排行"){
            H.dialog.lottery.open(data);
            H.dialog.PV = data.pv;
        }else if(data.code == 1 && $(".ranking").text() == "积分排行"){
            if(H.dialog.hluck == false){
                setTimeout(function () {
                    $.ajax({
                        type : 'GET',
                        async : false,
                        url : domain_url + 'api/lottery/luck'+dev,
                        data: {
                            oi: openid,
                            sau:acttUID
                        },
                        dataType : "jsonp",
                        jsonpCallback : 'callbackLotteryLuckHandler'
                    });
                },(Math.ceil(5000*Math.random())));
                H.dialog.hluck =true;
            }else{
                var fakedata = {
                    pt:0
                };
                H.dialog.lottery.open(fakedata);
            }
        }else if($(".ranking").text() == "积分排行"){
            var fakedata = {
                pt:0
            };
            H.dialog.lottery.open(fakedata);
        }
    };

    W.callbackRuleHandler = function(data) {
        if (data.code == 0 && data.rule) {
            H.dialog.rule.update(data.rule);
        }
    };

    W.callbackLotteryAwardHandler = function(data) {
        if (data.result) {
            hidenewLoading();
            H.dialog.lottery.succ();
            return;
        } else {
            if(H.dialog.haward == false){
                //getResult('api/lottery/award', {
                //    nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
                //    hi: headimgurl ? headimgurl : "",
                //    oi: openid,
                //    rn: encodeURIComponent(name),
                //    ph: mobile,
                //    ad: address,
                //    pv: H.dialog.PV,
                //    pu: acttUID
                //}, 'callbackLotteryAwardHandler', true, me.$dialog);
                H.dialog.haward = true;
            }else{

            }
        }
    };

    W.callbackIntegralRankSelfRoundHandler = function(data) {
        if (data.result) {
            H.dialog.rank.selfupdate(data);
        };
    };

    W.callbackIntegralRankTop10RoundHandler = function(data) {
        if (data.result) {
            H.dialog.rank.update(data);
        };
    };
})(Zepto);

//查询主活动接口

function callbackSignRoundHandler(data){
    if(data == undefined){

    }else if(data.code == 0){
        acttUID = data.puid;
        //actTtle = data.puid;
    }
}
//function callbackCommentsTopicInfo(data){
//    if(data.code == 0){
//        acttUID = data.items[0].uid;
//        //actTtle = data.tl[0].actTle;
//    }
//}



//需要取得的两条数据
var acttUID,actTtle="";

$(function() {
    H.dialog.init();
});