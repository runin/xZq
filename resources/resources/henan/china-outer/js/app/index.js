(function($){
    H.index = {
        init: function(){
            if(window.localStorage.getItem("go")){
                toUrl("lottery.html");
            }else{
                this.event();
            }
        },
        event: function(){
            var me = this,
                $key = $("#key");
            $(".go").tap(function(e){
                e.preventDefault();
                me.btn_animate($(this));
                if(!$key.val()){
                    showTips("您还没有输入口令~");
                }else if($key.val() == "wsw920"){
                    window.localStorage.setItem("go",true);
                    me.drawlottery();
                    toUrl("lottery.html");
                }else{
                    showTips("口令错误，请重新输入~");
                }
            });
        },
        btn_animate: function(str,calback){
            str.addClass('flipInY');
            setTimeout(function(){
                str.removeClass('flipInY');
            },150);
        },
        drawlottery: function(){
            var me = H.index;
            var sn = new Date().getTime()+'';
            recordUserOperate(openid, "调用投票抽奖接口", "doVoteLottery");
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/lottery/exec/luck4Vote' + dev,
                data: {
                    matk: matk,
                    sn: sn
                },
                dataType : "jsonp",
                jsonpCallback : 'callbackLotteryLuck4VoteHandler',
                timeout: 11000,
                complete: function() {
                },
                success : function(data) {
                    if(data && data.result){}
                },
                error : function(xmlHttpRequest, error) {}
            });
        }
    }
})(Zepto);
$(function(){
    H.index.init();
});
