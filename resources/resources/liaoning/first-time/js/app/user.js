/**
 * 第一时间-个人中心页
 */
(function(){
    H.user = {
        $user: $('#user'),
        $jfcj: $('#jfcj'),
        $user_h2: $('.user-top h2'),
        ui: 0,//积分抽奖机会所扣积分值
        in: 0,//用户自身总积分
        init: function(){
            H.jfcj.init();
            this.self();
            this.event();
            this.lotteryRound();

        },
        //查询用户信息
        self: function(){
            getResult('api/lottery/integral/rank/self', {oi: openid}, 'callbackIntegralRankSelfRoundHandler', true);
        },
        selfupdate: function(data) {
            $('.nav-header').find('p img').attr('src', headimgurl ? (headimgurl + '/' + yao_avatar_size) : './images/avatar.jpg');
            $('.nickname').text(nickname ? nickname : '匿名用户');
            $('.nav-header').find('label').text('我的积分：'+ data.in || 0);
        },
        lotteryRound: function(){
            getResult('api/lottery/round', {at: 3}, 'callbackLotteryRoundHandler', true);
        },
        btn_animate: function(str,calback){
            str.addClass('animated');
            setTimeout(function(){
                str.removeClass('animated');
            },200);
        },
        event: function(){
            var me = H.user;
            $('div.qdyl').click(function(e){
                e.preventDefault();
                me.btn_animate($(this));
                toUrl('qdyl.html');
            });
            $('div.jfcj').click(function(e){
                e.preventDefault();
                me.btn_animate($(this));
                me.$user.addClass('none');
                me.$jfcj.removeClass('none');
                me.$user_h2.removeClass('none');
            });
            $('a.jfcj-close').click(function(e){
                e.preventDefault();
                me.btn_animate($(this));
                me.$user.removeClass('none');
                me.$jfcj.addClass('none');
                me.$user_h2.addClass('none');
            });
            $('div.wdlp').click(function(e){
                e.preventDefault();
                me.btn_animate($(this));
                toUrl('gift.html');
            });
            $('div.jfhl').click(function(e){
                e.preventDefault();
                me.btn_animate($(this));
                toUrl('mall.html');
            });
            $('img.back').click(function(e){
                e.preventDefault();
                me.btn_animate($(this));
                toUrl('index.html');
            });
        },
        btn_animate: function(str,calback){
            str.addClass('flipInY');
            setTimeout(function(){
                str.removeClass('flipInY');
            },200);
        }
    };
    H.jfcj = {
        $jfzj: $('#jfzj'),
        $jfzj_body: $('.jfzj-body'),
        $jf: $('#jf'),
        $sw: $('#sw'),
        $confirm: $('.confirm'),
        $h4: $('h4'),
        $input: $('input'),
        REQUEST_CLS: 'requesting',
         init: function(){
            this.documen_pre();
            this.houser();
            this.event();
            this.info();
         },
        //查询奖品list
        info: function(){
            getResult('api/linesdiy/info', {}, 'callbackLinesDiyInfoHandler', true);
        },
        documen_pre: function(){
            var win_w = $(window).width(),
                doc_w = 0;
                doc_w = win_w*0.96/3;
            $('li.items').css({
                'width': doc_w,
                'height': doc_w
            });
        },
        houser: function(){
            var me = H.jfcj,
                flag = false,
                jpDta = null;
            /*
             * $prizes表示奖品的块
             * changeClass 表示会跳动变化的类
             * prizeArr表示奖品跳动的数组
             * prizeNum 表示获得的奖品
             */
            var num = 0; //当前点亮的灯
            var circle = 0; //至少转跑马灯的圈数
            var t; //定时器
            var len;//奖品个数
            function lightChange($prizes, changeClass, prizeArr, prizeNum){
                var self = this;
                len = $prizes.length;

                $prizes.removeClass(changeClass);
                $prizes.eq(prizeArr[num]).addClass(changeClass).attr('id', num);
                if(num == len-1){
                    num = 0;
                    circle ++;
                } else {
                    num ++;

                }

                if(circle == 1 && num == prizeNum){
                    circle = 0;
                    num = 0;
                    clearTimeout(t);
                    if(prizeNum == thanksIndex){
                        $('#btn-lottery').find('img').addClass('cjani2');
                    }
                    if(flag){
                        setTimeout(function(){
                            me.fill_lottery(jpDta);
                        },500);
                    }
                } else {
                    t = setTimeout(function(){lightChange($prizes, changeClass, prizeArr, prizeNum)},300);
                }
            }

            var ui = {
                $btnLottery: $('#btn-lottery')
                , $prizes: $('.prizebg')
            };
            var prizeArr = [0,1,2,4,7,6,5,3]; // 奖品数组
            var prizeNum = 1;//奖品指针（位置从1开始）
            var thanksIndex = 1;//奖品指针（位置从1开始）

            var oPage = {
                init: function() {
                    this.listen();
                }
                ,listen: function() {
                    var self = this;

                    // 鼠标点击按钮抽奖效果
                    ui.$btnLottery.on('click',function(){
                        if(!$(this).find('img').hasClass('cjani2')){
                            return;
                        }
                        if(H.user.in < H.user.ui){
                            showTips('抱歉，您的积分值不够！');
                            return;
                        }

                        var sn = new Date().getTime()+'';
                        shownewLoading();
                        $(this).find('img').removeClass('cjani2');
                        $.ajax({
                            type : 'GET',
                            async : false,
                            url : domain_url + 'api/lottery/luck4Integral',
                            data: {
                                oi: openid,
                                sn : sn
                            },
                            dataType : "jsonp",
                            jsonpCallback : 'callbackLotteryLuck4IntegralHandler',
                            timeout: 11000,
                            complete: function() {
                                hidenewLoading();
                                sn = new Date().getTime()+'';
                                // 调用跑马灯效果
                                lightChange(ui.$prizes, "active", prizeArr, prizeNum);
                            },
                            success : function(data) {
                                if(data && data.result){
                                    if(data.sn == sn){
                                        if(data.pt != 0){
                                            flag = true;
                                            jpDta = data;
                                            prizeNum = data.aw;
                                        }else{
                                            prizeNum = thanksIndex;
                                        }
                                    }else{
                                        prizeNum = thanksIndex;
                                    }
                                }else{
                                    prizeNum = thanksIndex;
                                }
                            },
                            error : function() {
                                prizeNum = thanksIndex;
                            }
                        });
                    });
                }
            };
            oPage.init();
        },
        jfcj_size: function(){
            var win_h = $(window).height(),
                $jfzj_body = $('.jfzj-body'),
                jfzj_h = 0;
            jfzj_h = $jfzj_body.height()*1;
            $jfzj_body.css('top', (win_h - jfzj_h)/2);
        },
        fill_lottery: function(data){
            H.user.self();
            var me = H.jfcj,$sw = $('#sw');
            me.$jfzj.find('img.pi').attr('src', data.pi || '').attr("onerror","$(this).addClass(\'none\')");
            $sw.find('.name').val(data.rn || '');
            $sw.find('.mobile').val(data.ph || '');
            $sw.find('.address').val(data.ad || '');
            if(data.pt === 1){//实物
                me.$sw.removeClass('none');
            }else if(data.pt === 2){//积分
                me.$jf.removeClass('none');
            }
            me.$jfzj.removeClass('none');
            me.$jfzj_body.removeClass('slideOutDown').addClass('slideInDown');
            setTimeout(function(){
                me.jfcj_size();
            },300);


        },
        event: function(){
            var me = H.jfcj;
            me.$confirm.click(function(e){
                e.preventDefault();
                H.user.btn_animate($(this));
                var me = this, $mobile = $('.mobile'),
                    mobile = $.trim($mobile.val()),
                    $name = $('.name'),
                    name = $.trim($name.val()),
                    $address = $('.address'),
                    address = $.trim($address.val());

                if ($(this).hasClass(me.REQUEST_CLS)) {
                    return false;
                }

                if (((me.name && me.name == name) && me.mobile && me.mobile == phone)
                    && (me.address && me.address == address)) {
                    return;
                }

                if (name.length < 2 || name.length > 30) {
                    showTips('姓名长度为2~30个字符');
                    $name.focus();
                    return false;
                }
                else if (!/^\d{11}$/.test(mobile)) {
                    showTips('这手机号，可打不通哦...');
                    $mobile.focus();
                    return false;
                } else if(address.length < 5 || address.length > 60) {
                        showTips('地址长度为5~60个字符');
                        return false;
                    }

                $(this).addClass(me.REQUEST_CLS);
                getResult('api/lottery/award', {
                    oi: openid,
                    rn: encodeURIComponent(name),
                    ph: mobile,
                    ad: encodeURIComponent(address)
                }, 'callbackLotteryAwardHandler', true, me.$dialog);
            });
            $('.zj-close').click(function(e){
                e.preventDefault();
                H.user.btn_animate($(this));
                me.$jfzj_body.removeClass('slideInDown').addClass('slideOutDown');
                setTimeout(function(){
                    me.init_page();
                },300);
            });
        },
        init_page: function(){
            var me = H.jfcj;
            me.$jfzj.addClass('none');
            me.$jf.addClass('none');
            me.$sw.addClass('none');
            me.$h4.text('请填写您的正确信息，以便顺利领奖');
            me.$confirm.removeClass('none');
            me.$sw.find('.zj-close').addClass('none');
            me.$input.removeAttr('disabled').removeClass('disabled');
            $('#btn-lottery').find('img').addClass('cjani2');

            $('li.prizebg').removeClass('active');
            $('li.prizebg').eq(0).addClass('active');
        },
        succ: function(){
            var me = H.jfcj;
            me.$h4.text('以下是您的信息');
            me.$input.attr('disabled', 'disabled').addClass('disabled');
            me.$confirm.addClass('none');
            me.$sw.find('.zj-close').removeClass('none');
        }
    };
    W.callbackIntegralRankSelfRoundHandler = function(data) {
        if (data.result) {
            H.user.in = data.in;
            H.user.selfupdate(data);
        }
    };
    W.callbackLotteryAwardHandler = function(data) {
        if (data.result) {
            H.jfcj.succ();
        }
    };
    W.callbackLotteryRoundHandler = function(data){
        if(data && data.result){
            var me = H.user;
            me.ui =  data.la[0].ui;
            if(me.ui){
                me.$user_h2.html('每次抽奖将消耗'+ me.ui +'积分');
            }
        }
    };
    W.callbackLinesDiyInfoHandler = function(data){
        if(data.code == 0){
            var $items = $('.items');
            $.each(data.gitems, function(i,item){
                $.each($items, function(j,jtem){
                    if($items.eq(j).attr('data-id') == item.t){
                        $items.eq(j).find('img').attr('src', item.ib).attr("onerror","$(this).addClass(\'none\')");
                    }
                });
            });
        }
    }
})(Zepto);
$(function(){
    H.user.init();
});
