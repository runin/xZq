/**

 */
(function($) {
    H.lottery = {
        isLottery :false,
        nowTime :null,
        isCanShake:true,
        times:0,
        isToLottey:true,
        isTimeOver: false,
        first: true,
        lotteryTime:getRandomArbitrary(1,5),
        init : function(){
            var me = this, tipsRandom = getRandomArbitrary(1,3);
            setTimeout(function()
            {
                me.account_num();
            }, 3000);
            me.event();
            me.shake();
        },
        event: function(){
            $("#test").click(function(e){
                e.preventDefault();
                H.lottery.shake_listener();
            });
            $(".record-btn").click(function(){
                 window.location.href = "http://mp.weixin.qq.com/s?__biz=MjM5ODg0MjgzNA==&mid=214182936&idx=1&sn=42d0bf4e48ef136e614b797e939fc66e&scene=1&srcid=0916hJg3lXSKr0WHvKH9uZnS#rd";  
            });
           
            
        },
        shake: function() {
            W.addEventListener('shake', H.lottery.shake_listener, false);
        },
        shake_listener: function() {

            if(H.lottery.isCanShake){
                //H.lottery.isCanShake = false;
            }else{
                return;
            }
            $(".yao-cool-tips").addClass("none");
            $(".yao-cool-tips").removeClass("none-tips");
            H.lottery.times++;
            if(!(H.lottery.times % H.lottery.lotteryTime == 0)){
                H.lottery.isToLottey = false;
            }
            if(!$(".yao-bg").hasClass("yao")) {

                $("#audio-a").get(0).play();
                $(".m-t-b").css({
                    '-webkit-transition': '-webkit-transform .2s ease',
                    '-webkit-transform': 'translate(0px,-100px)'
                });
                $(".m-f-b").css({
                    '-webkit-transition': '-webkit-transform .2s ease',
                    '-webkit-transform': 'translate(0px,100px)'
                });
                setTimeout(function(){
                    $(".m-t-b").css({
                        '-webkit-transform': 'translate(0px,0px)',
                        '-webkit-transition': '-webkit-transform .5s ease'
                    });
                    $(".m-f-b").css({
                        '-webkit-transform': 'translate(0px,0px)',
                        '-webkit-transition': '-webkit-transform .5s ease'
                    });
                }, 1200);
                $(".yao-bg").addClass("yao");
            }
            if(!openid || openid=='null' || H.lottery.isToLottey == false){
                setTimeout(function(){
                    H.lottery.fill(null);//摇一摇
                }, 2000);
            }else{
                H.lottery.fill(true);
            }
            H.lottery.isToLottey = true;
        },
        //查询当前参与人数
        account_num: function(){
            getResult('api/common/servicepv', {}, 'commonApiSPVHander');
        },
     
        fill : function(data){
            setTimeout(function() {
                $(".yao-bg").removeClass("yao");
            },300);
            if(data == null){
                $("#audio-a").get(0).pause();
                $(".yao-cool-tips").removeClass("none");
                $(".yao-cool-tips").addClass(" none-tips");
                return;
            }else{
                H.lottery.isCanShake = false;
                $("#audio-a").get(0).pause();
                setTimeout(function() {
                   $("#audio-b").get(0).play();//中奖声音
                },500);
                
                $(".yao-cool-tips").text("恭喜您中奖了");
                $(".yao-cool-tips").removeClass("none");
                shownewLoading($('body'),"奖品跳转中")
                setTimeout(function()
                {
                    
                    window.location.href = "http://yhq.yuanbenyun.net/Coupon/ReceiveCoupon?from=groupmessage&isappinstalled=0";  
                }, 1200);

            }
        },
    };

     W.commonApiSPVHander = function(data){
        var number = 2000;
        if(data.code == 0)
        {
            var cdata = data.c+number;
            $(".count label").html(cdata);
            $(".count").removeClass("none");
        }
        else
        {    $(".count").removeClass("none");
             $(".count label").html(number);
        }
    }

})(Zepto);

$(function() {
    H.lottery.init();
});
