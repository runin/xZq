/**
 * 第一时间--签到有礼页
 */
(function(){
    H.qdyl = {
        $body: $('body'),
        $tc: $('#tc'),
        $jfzj_body: $('.jfzj-body'),
        $qd_btn: $('.qd-btn'),
        $back_btn: $('.back-btn'),
        REQUEST_CLS: 'requesting',
        puid: '',
        bt: '',
        i: '',//签到成功img
        init: function(){
            this.event();
            this.round_sign();
        },
        //获取签到活动
        round_sign: function(){
            getResult('api/sign/round', {}, 'callbackSignRoundHandler', true);
        },
        //获取签到记录
        myrecord_sign: function(){
            getResult("api/sign/myrecord", {yoi:openid, bt:H.qdyl.bt },"callbackSignMyRecordHandler",true);
        },
        //保存签到记录
        signed_sign: function(){
            getResult("api/sign/signed",{yoi:openid, auid:H.qdyl.puid, wxnn:nickname, wxurl:headimgurl}, "callbackSignSignedHandler", true);
        },
        //判断是否已经签到过某个活动
        issign_sign: function(){
            getResult("api/sign/issign",{yoi:openid, auid:H.qdyl.puid}, "callbackSignIsHandler", true);
        },
        dom_resize: function(){
            var $jfzj_body = $('.jfzj-body'),
                jfzj_bodyHeight = $jfzj_body.height(),
                win_height = $(window).height()*1;
            $jfzj_body.css({
                "top": (win_height - jfzj_bodyHeight)/2
            });
        },
        btn_animate: function(str,calback){
            str.addClass('flipInY');
            setTimeout(function(){
                str.removeClass('flipInY');
            },200);
        },
        event: function(){
            var me = H.qdyl;
            me.$qd_btn.click(function(e){
                e.preventDefault();
                me.btn_animate($(this));
                if($(this).hasClass(me.REQUEST_CLS)){
                    return;
                }
                $(this).addClass(me.REQUEST_CLS);
                me.signed_sign();

            });
            $('.zj-close').click(function(e){
                e.preventDefault();
                me.btn_animate($(this));

                me.$jfzj_body.removeClass('bounceInDown').addClass('bounceOutUp');
                setTimeout(function(){
                    me.$tc.addClass('none');
                },500);
            });
            me.$back_btn.click(function(e){
                e.preventDefault();
                me.btn_animate($(this));

                toUrl('user.html');
            });
        },
        qd_succ_domZS: function(){//签到成功展示
            var me = H.qdyl;
            me.$qd_btn.addClass('none');
            me.$back_btn.removeClass('none');
            me.$body.addClass('qd-sc');
        },
        qd_not_domZS: function(){//未签到展示
            var me = H.qdyl;
            me.$qd_btn.removeClass('none');
            me.$back_btn.addClass('none');
            me.$body.removeClass('qd-sc');
        },
        qd_wan_domZS: function(imgSrc){//签到次数完成--领奖
            var me = H.qdyl;
            me.$tc.removeClass('none');
            $('.pi').attr('src',imgSrc);
            me.dom_resize();
            me.$jfzj_body.removeClass('bounceOutUp').addClass('bounceInDown');
        }
    };
    W.callbackSignRoundHandler = function(data){
        var me = H.qdyl;
        //testData
        /*data = roundData;*/
        if(data.code == 0){
            var now = new Date(),
                currentWeek = 0,
                currentYMD = '';
            currentWeek = new Date().getDay();
            currentYMD = now.getFullYear()+"-"+((now.getMonth()+1)<10?"0":"")+(now.getMonth()+1)+"-"+(now.getDate()<10?"0":"")+now.getDate();

            //testData
            /*currentWeek = new Date('2015-08-09 15:00:00').getDay();
            currentYMD = "2015-08-09";*/

            $.each(data.items, function(i,item){
                me.i = item.i;
                var serverST = item.st;
                if(new Date(currentYMD).getTime() === new Date(serverST.split(" ")[0]).getTime()){
                    var serverWeek = new Date(Date.parse(serverST.replace(/-/g, "/"))).getDay();
                    me.puid = item.uid;
                    $('header').text(item.t || '');
                    if(currentWeek === serverWeek){
                        var MondayIndex = 0,
                            len = data.items.length - 1;
                        if(currentWeek === 0){
                            currentWeek = 7;
                        }
                        MondayIndex = i + (currentWeek -1);
                        if(MondayIndex > len){
                            me.bt = data.items[len].st.split(" ")[0];
                        }else{
                            me.bt = data.items[MondayIndex].st.split(" ")[0];
                        }
                    }
                }
            });
            /*me.issign_sign();*/
            me.myrecord_sign();
        }
    };
    /*W.callbackSignIsHandler = function(data){
        var me = H.qdyl;
        if(data.result){
            me.qd_succ_domZS();
        }else{
            me.qd_not_domZS();
        }
    };*/
    W.callbackSignMyRecordHandler = function(data){
        var me = H.qdyl;
        //testData
        //data = MyRecordData;
        if(data.code == 0){
            var $weeks = $('.weeks'),
                currentWeek = new Date().getDay();

            /*$.each(data.items, function(i,item){
                var serverWeek = new Date(Date.parse(item.t.replace(/-/g, "/"))).getDay();
                $.each($weeks, function(j,jtem){
                    if(parseInt($weeks.eq(j).attr('id')) === serverWeek){
                        $weeks.eq(j).find('i').addClass('actived');
                    }
                });
            });*/
            if(data.items.length){
                var flag = true;
                $.each(data.items, function(i,item){
                    var serverWeek = new Date(Date.parse(item.t.replace(/-/g, "/"))).getDay();
                    $.each($weeks, function(j,jtem){
                        if(parseInt($weeks.eq(j).attr('id')) === serverWeek){
                            $weeks.eq(j).find('i').addClass('actived');
                            if(flag){
                                if(currentWeek === serverWeek){
                                    me.qd_succ_domZS();
                                }else{
                                    me.qd_not_domZS();
                                }
                                flag = false;
                            }
                        }
                    });
                });
            }else{
                me.qd_not_domZS();
            }
        }
    };
    W.callbackSignSignedHandler = function(data){
        var me = H.qdyl;
        if(data.code == 0){
            var $weeks = $('.weeks'),
                currentWeek = new Date().getDay();
            $.each($weeks, function(j,jtem){
                if(parseInt($weeks.eq(j).attr('id')) === currentWeek){
                    $weeks.eq(j).find('i').addClass('actived');
                }
            });
            me.qd_succ_domZS();
            if(data.keepVal){
                me.qd_wan_domZS(me.i);
            }
        }
    }
})(Zepto);
$(function(){
    H.qdyl.init();
});