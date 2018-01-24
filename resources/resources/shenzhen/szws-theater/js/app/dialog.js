(function($) {
    H.dialog = {
        puid: 0,
        $container: $('body'),
        REQUEST_CLS: 'requesting',
        iscroll: null,
        clickFlag: true,
        successFlag: true,
        hluck: false,
        haward: false,
        isrank: false,
        PV: "",
        PT: "",
        lotteryFlag:false,//判断是不是答题调用的接口
        rule_flag: true,
        init: function() {
            var me = this;
            this.$container.delegate('.btn-close', 'click', function(e) {
                e.preventDefault();
                var me = $(this);
                if (H.dialog.isrank == true) {

                    $(".rank-dialog").css({
                        "-webkit-animation": "disphide 0.3s",
                        "animation-timing-function": "ease-in",
                        "-webkit-animation-timing-function": "ease-in"
                    }).one("webkitAnimationEnd", function() {
                        H.dialog.rank.close();
                        $('.rank-dialog').css({
                            "-webkit-animation": ""
                        });
                        me.css({
                            "-webkit-animation": ""
                        });
                        me.closest('.modal').addClass('none');
                    });
                    H.dialog.isrank = false;
                } else {
                    me.closest('.modal').addClass('none');
                }
            }).delegate('.btn-result', 'click', function(e) {
                e.preventDefault();
                H.dialog.result.open();
            }).delegate('.btn-comeon', 'click', function(e) {
                e.preventDefault();
                H.dialog.guide.open();
            });

            getResult("api/sign/round",{},"callbackSignRoundHandler",false);
            //吸粉链接

        },
        close: function() {
            $('.modal').addClass('none');
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
                    'width': width * 0.80,
                    'height': height * 0.60,
                    'left': width * 0.1,
                    'top': height * 0.10,
                });
                $(".rank-dialog").css({
                    'width': width * 0.86,
                    'height': height * 0.77,
                    'left': width * 0.07,
                    'right': 0,
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
                    $(".guide-dialog").addClass("disphide");
                    setTimeout(function() {
                        me.close();
                    }, 300);
                });
            },
            close: function() {
                $(".logo").addClass("index-bounce");
                $(".tv-name").addClass("bounce-btn");
                this.$dialog && this.$dialog.addClass('none');
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<section class="modal modal-guide" id="guide-dialog">')
                    ._('<div class="dialog guide-dialog relocated">')
                    ._('<div class="guide-title"></div>')
                    ._('<div class="guide-content"><p><i>1</i>打开电视，锁定深圳卫视</p>')
                    ._('<p><i>2</i>打开微信，进入摇一摇（电视）</p>')
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
                $(".rule-dialog").addClass("dispshow");
                setTimeout(function() {
                    $(".rule-dialog").removeClass("dispshow");
                }, 300);
                $('body').addClass('noscroll');
                if (H.dialog.rule_flag == true) {
                    getResult('common/rule', {}, 'callbackRuleHandler', true, this.$dialog);
                }
            },
            close: function() {
                var me = this;
                me.$dialog && me.$dialog.addClass('none');
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
                    ._('<h2>活动规则</h2>')
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
                    pu: acttUID
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
                getResult('api/lottery/integral/rank/top10', {
                    pu: acttUID
                }, 'callbackIntegralRankTop10RoundHandler', true, this.$dialog);
            },
            update: function(data) {
                var t = simpleTpl(),
                    top10 = data.top10 || [],
                    len = top10.length;

                for (var i = 0; i < len; i++) {
                    t._('<li>')
                        ._('<span class="r-avatar"><img src="' + (top10[i].hi ? (top10[i].hi + '/64') : './images/danmu-head.jpg') + '" /></span>')
                        ._('<span class="r-rank">第' + (top10[i].rk || '-') + '名</span>')
                        //._('<span class="r-bac"></span>')
                        ._('<span class="r-name ellipsis">积分：' + (top10[i].in || '0') + '</span>')
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
        fudai: {
            $dialog: null,
            open: function() {
                var me = this,
                    $dialog = this.$dialog;
                H.dialog.open.call(this);
                this.event();
            },
            close: function() {
                this.$dialog && this.$dialog.addClass('none');
            },
            event: function() {
                var me = this,
                    $fudai = this.$dialog.find('.fudai');
                recordUserOperate(openid,"调用抽奖接口", "doLottery");
                if (H.dialog.clickFlag) {
                    H.dialog.clickFlag = false;

                    $fudai.click(function(e) {
                        e.preventDefault();

                        H.dialog.lotteryFlag = true;
                        setTimeout(function() {
                            shownewLoading();
                            setTimeout(function() {
                                $.ajax({
                                    type: 'GET',
                                    async: false,
                                    url: domain_url + 'api/lottery/luck' + dev,
                                    data: {
                                        oi: openid,
                                        sau: acttUID
                                    },
                                    dataType: "jsonp",
                                    jsonpCallback: 'callbackLotteryLuckHandler'
                                        // complete: function() {
                                        //     hidenewLoading();
                                        // },
                                        //success : function(data) {
                                        //    H.dialog.lottery.open(data);
                                        //},
                                        //error : function() {
                                        //    H.dialog.lottery.open(null);
                                        //}
                                });
                            }, (Math.ceil(2000 * Math.random())))
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
                    ._('<div class="fudai" data-collect="true" data-collect-flag="rankdialog-clickbtn" data-collect-desc="领奖弹层-点击按钮"><div class="hand"></div><div class="fudai-round"></div><p>恭喜您答对了！</br>送您一份大礼，打开看看吧</p><div class="dakai">打开</div></div>')
                    ._('</section>');
                $(".dakai").on("click", function() {
                    $("header").css("display", "none");
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
            ci:null,
            ts:null,
            si:null,
            url:null,
            open: function(data) {
                H.dialog.PT = data.pt;
                var me = this,
                    $dialog = this.$dialog,
                    winW = $(window).width(),
                    winH = $(window).height();
                hideLoading($dialog);
                H.dialog.open.call(this);
                if (!$dialog) {
                    this.event();
                }
                this.$dialog && this.$dialog.removeClass('none');

                $(".lottery-dialog").css({
                    'width': winW,
                    'height': winH * 0.88,
                    'left': 0,
                    'right': 0,
                    'top': winH * 0.07,
                    'bottom': winH * 0.09
                });
                H.dialog.lottery.update(data);
                var inheight;
                if(data.pt == 7){

                    this.$dialog.find('.btn-award').off();
                    H.dialog.lottery.readyFunc();

                    document.getElementById('aw').onload = function () {
                        inheight = ($(".contact").height() + $(".award-img").height() + 35) + (winH * 0.2);
                        if(inheight >= winH){
                            $(".award-img img").css("height","60px");
                            inheight = ($(".contact").height() + 95) + (winH * 0.2);
                        }
                        $(".lottery-dialog").css({
                            'height': inheight,
                            'top': (winH - inheight) * 0.5
                        });
                    };
                }else
                if (data.pt == 2) {
                    document.getElementById('aw').onload = function() {
                        inheight = ($(".contact").height() + $(".award-img").height() + 35) + (winH * 0.12) + $(".award-tip-img").height();
                        if (inheight >= winH) {
                            $(".award-img img").css("height", "80px");
                            inheight = ($(".contact").height() + 115) + (winH * 0.12);
                        }

                        $(".lottery-dialog").css({
                            'height': inheight,
                            'top': (winH - inheight) * 0.5
                        });
                    };
                } else if (data.pt == 9) {
                    document.getElementById('aw').onload = function() {
                        inheight = ($(".lottery-link").height() + $(".award-img").height() + 35) + (winH * 0.12) + $(".award-tip-img").height();
                        if (inheight >= winH) {
                            $(".award-img img").css("height", "80px");
                            inheight = ($(".contact").height() + 115) + (winH * 0.12);
                        }

                        $(".lottery-dialog").css({
                            'height': inheight,
                            'top': (winH - inheight) * 0.5
                        });

                    };
                } else {
                    document.getElementById('aw').onload = function() {
                    
                        $(".lottery-dialog").css({
                            'height':winH * 0.60 ,
                            'top': winH * 0.20,
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
                        if(H.dialog.PT == 7){
                            shownewLoading();
                            me.close();
                            me.sto = setTimeout(function(){
                                H.lottery.isCanShake = true;
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
                        cardId: me.ci,
                        cardExt: "{\"timestamp\":\""+ me.ts +"\",\"signature\":\""+ me.si +"\"}"
                    }],
                    success: function (res) {
                        getResult('api/lottery/award', {
                            nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
                            hi: headimgurl ? headimgurl : "",
                            oi: openid
                            //rn: me.name ? encodeURIComponent(me.name) : "",
                            //ph: me.mobile ? me.mobile : ""
                        }, 'callbackLotteryAwardHandler');
                    },
                    fail: function(res){
                        //H.lottery.canJump = true;
                        hidenewLoading();
                        recordUserOperate(openid, res.errMsg, "card-fail");
                    },
                    complete:function(){
                        me.sto && clearTimeout(me.sto);
                        hidenewLoading();
                    },
                    cancel:function(){
                        hidenewLoading();
                    }
                });
            },
            event: function() {
                var me = this;
                $(".award-none").on("click", function() {
                    $("header").css("display", "none");
                    $(".modal-pop").css("display", "none");
                });
                this.$dialog.find('.btn-out').click(function(e) {
                    e.preventDefault();
                    shownewLoading();
                    $('.btn-out').text("领取中");
                    getResult('api/lottery/award', {
                        nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
                        hi: headimgurl ? headimgurl : "",
                        oi: openid,
                        // rn: me.name ? encodeURIComponent(me.name) : "",
                        // ph: me.mobile ? me.mobile : ""
                    }, 'callbackLotteryAwardHandler');
                    setTimeout(function(){
                        location.href = H.dialog.lottery.url;
                    },500);
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
                    if(H.dialog.PT == 7)
                    {

                    }else if (H.dialog.PT == 2) {
                        setTimeout(function() {
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
                        }, (Math.ceil(5000 * Math.random())))
                    } else {
                        setTimeout(function() {
                            getResult('api/lottery/award', {
                                nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
                                hi: headimgurl ? headimgurl : "",
                                oi: openid,
                                rn: encodeURIComponent(name),
                                ph: mobile,
                                ad: address
                            }, 'callbackLotteryAwardHandler', true, false);
                        }, (Math.ceil(5000 * Math.random())))
                    }
                });

                this.$dialog.find('.btn-close').click(function(e) {
                    e.preventDefault();
                    me.$dialog && me.$dialog.remove();
                    $(".modal-pop").remove();
                    me.$dialog = null;
                    H.lottery.isCanShake = true;
                });

                this.$dialog.find('.btn-share').click(function(e) {
                    e.preventDefault();
                    me.$dialog.find('.btn-close').trigger('click');
                    me.reset();
                });
            },
            update: function(data) {
                var me = this;
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
                            recordUserOperate(openid,"深圳卫视", "doLottery");
                            this.$dialog.find(".lottery-dialog").addClass("award-bg");
                            // this.$dialog.find('.awardwin-tips').html(data.tt || '');
                            this.$dialog.find('.award-img img').attr("src", data.pi).attr("onerror", "$(this).addClass(\'none\')");
                            this.$dialog.find('.name').val(data.rn || '');
                            this.$dialog.find('.mobile').val(data.ph || '');
                            this.$dialog.find('.address').val(data.ad || '');
                            this.$dialog.addClass(this.LOTTERIED_CLS);
                            this.$dialog.find('.award-win').removeClass('none');
                            this.$dialog.find('.contact').removeClass('redbag');
                        } else if (data.pt === 7) { //卡券
                            me.ci = data.ci;
                            me.ts = data.ts;
                            me.si = data.si;
                            this.$dialog.addClass("award-bg");
                            this.$dialog.find('.awardwin-tips').html(data.tt || '');
                            this.$dialog.find('.award-img img').attr("src", data.pi).attr("onerror", "$(this).addClass(\'none\')");
                            this.$dialog.addClass(this.LOTTERIED_CLS);
                            this.$dialog.find('.award-tip-img').addClass("none");
                            this.$dialog.find('.q-name').addClass("none");
                            this.$dialog.find('.q-mobile').addClass("none");
                            this.$dialog.find('.q-address').addClass("none");
                            this.$dialog.find('.award-win').removeClass('none');
                            this.$dialog.find('.award-tip').addClass("none");
                            this.$dialog.find('.award-win').css({
                                'padding-top': '8%'
                            });
                            this.$dialog.find('.contact').removeClass('redbag');
                        } else if (data.pt === 9) {
                            this.$dialog.find('.contact').addClass('none');
                            this.$dialog.find('.lottery-link').removeClass('none');
                            // this.$dialog.find('.awardwin-tips').html(data.tt || '');
                            this.$dialog.find('.award-img img').attr("src", data.pi).attr("onerror", "$(this).addClass(\'none\')");
                            this.$dialog.addClass(this.LOTTERIED_CLS);
                            this.$dialog.find('.award-win').removeClass('none');
                            me.url = data.ru;
                            // this.$dialog.find("#btn-out").attr("href", data.ru);
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
                if (name.length > 20 || name.length == 0) {
                    showTips('请输入您的姓名，不要超过20字哦!');
                    return false;
                } else if (!/^\d{11}$/.test(mobile)) {
                    showTips('这手机号，可打不通...');
                    return false;
                } else if (address.length == 0 || address.length > 20) {
                    showTips('请填写正确的地址');
                    return false;
                }
                return true;
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
                showTips('领取成功');
                var me = this,
                    $qmobile = $('.dialog').find('.mobile'),
                    qmobile = $qmobile.val(),
                    $name = $('.dialog').find('.name'),
                    qname = $name.val(),
                    $address = $('.dialog').find('.address'),
                    qaddress = $address.val();
                this.$dialog.addClass(this.AWARDED_CLS);
                var qname = $('.name').val(),
                    qmobile = $('.mobile').val(),
                    qaddress = $('.address').val();
                $('.contact p').css({
                    "background": "transparent",
                    "width": "80%",
                    "margin": "0px auto",
                    "text-align": "left"
                })
                $('.q-name').text("姓名：" + qname);
                $('.q-mobile').text("电话：" + qmobile);
                $('.q-address').text("地址：" + qaddress);
            },
            reset: function() {
                this.$dialog && this.$dialog.remove();
                this.$dialog = null;
                $("header").css("display", "none");
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
                    ._('<img src="./images/award-tip-img.png" class="award-tip-img">')
                    ._('<div class="award-img">')
                    ._('<img id="aw" src="./images/gift-blank.png">')
                    ._('</div>')
                    ._('<div class="contact">')
                    ._('<h4 class="award-tip">请填写您的联系方式,以便顺利领奖</h4>')
                    ._('<h4 class="awarded-tip">以下是您的联系方式</h4>')
                    ._('<p class="q-name">姓名：<input type="text" class="name" placeholder="" /></p>')
                    ._('<p class="q-mobile">电话：<input type="tel" class="mobile" placeholder="" /></p>')
                    ._('<p class="q-address">地址：<input type="text" class="address" placeholder="" /></p>')
                    ._('<a href="#" class="btn btn-award" data-collect="true" data-collect-flag="lotterydialog-OKbtn" data-collect-desc="抽奖弹层-确定按钮">领取</a>')
                    ._('<a href="#" class="btn btn-red" id="btn-out" data-collect="true" data-collect-flag="lotterydialog-redbtn" data-collect-desc="抽奖弹层-领取现金按钮">领取</a>')
                    ._('<div class="share"><a href="#" class="btn btn-share">确定</a></div>')
                    ._('</div>')

                ._('<div class="lottery-link none">')
                    ._('<a href="#" class="btn btn-out"  id="btn-out" data-collect="true" data-collect-flag="lotterydialog-link" data-collect-desc="抽奖弹层-外链领取按钮">领取</a>')
                    ._('</div>')
                    ._('</div>')
                    ._('<div class="award-none none">')
                    ._('<div class="award-text">真遗憾，下次加油哦</div>')
                    ._('<img src="./images/thank-tip-img.png">')
                    ._('<a href="#" class="btn-close" id="btn-non" data-collect="true" data-collect-flag="lotterydialog-backbtn" data-collect-desc="未中奖弹层-返回按钮">确定</a>')
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
                var me = this,
                    $dialog = this.$dialog,
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
                H.lottery.isCanShake = true;
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

    // 抽奖
    W.callbackLotteryLuckHandler = function(data) {
        if(H.dialog.lotteryFlag)
        {
            if(data.result) {
                H.dialog.lottery.open(data);
                H.dialog.PV = data.pv;
            } else 
            {
                var fakedata = {pt: 0};
                H.dialog.lottery.open(fakedata); 
            }
        }
        
    };

    W.callbackRuleHandler = function(data) {
        if (data.code == 0) {
            H.dialog.rule_flag = false;
            $(".rule-dialog .rule").html(data.rule).removeClass("none");
        }
    };

    W.callbackLotteryAwardHandler = function(data) {
        if (data.result) {
            hidenewLoading();
            H.dialog.lottery.succ();
            return;
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

function callbackSignRoundHandler(data) {
    if (data.code == 0) {
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
var acttUID, actTtle = "";

$(function() {
    H.dialog.init();
});