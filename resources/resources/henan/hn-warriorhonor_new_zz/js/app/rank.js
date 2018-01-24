(function($) {
    H.rank = {
        $body:$(".body"),
        init: function(){
            this.event();
            this.resize();
            this.getUserinfo();
            this.getrank();
        },
        event: function(){
            var me = H.rank;
            $(".go-lottery").tap(function(e){
                e.preventDefault();
                me.btn_animate($(this));
                toUrl("lottery.html?cb41faa22e731e9b="+cb41faa22e731e9b);
            });
            $("#info").tap(function(e){
                e.preventDefault();
                $(".user-info").removeClass('none');
            });
        },
        resize: function () {
            $(".body").css({"height":($(window).height() - 145) + "px"});
        },
        getUserinfo: function () {
            getResult('api/user/info_v2', {matk: matk}, 'callbackUserInfoHandler', true);
        },
        getrank: function () {
            getResult('api/greetingcard/material/rank4self', {oi:openid}, 'callbackGreetingcardMaterialFightRank4SelfHandler');
            getResult('api/greetingcard/material/rank4win', {oi:openid}, 'callbackGreetingcardMaterialFightRank4WinHandler');
        },
        fillrank: function (data) {
            var rankinfo = "";
            for(var i=0;i<data.top10.length;i++){
                rankinfo += '<div class="rank">'
                    + '<div class="head"><div class="player-head">'
                    + '<img src="' + (data.top10[i].hi?data.top10[i].hi:"./images/avatar.png") + '" /></div>';
                if(i<3){
                    rankinfo += '<p>第' + (i+1) + '名</p></div>';
                }else{
                    rankinfo += '<p style="opacity: 0"></p></div>';
                }
                rankinfo += '<div class="name">' + (data.top10[i].nn?data.top10[i].nn:"匿名") + '</div>'
                    + '<div class="rank-win"><img src="images/winnumb-bg.png" /><p>' + (data.top10[i].wc?data.top10[i].wc:"0") + '胜</p></div>'
                    + '<div class="rank-lose"><img src="images/losenumb-bg.png" /><p>' + (data.top10[i].fc?(parseInt(data.top10[i].fc)-parseInt(data.top10[i].wc)):"0") + '负</p></div></div>';
            }
            this.$body.append(rankinfo);
        },
        userinfo: function (data) {
            $(".player-name").text(data.nn?data.nn:"匿名");
            $(".player-headimg").find('img').attr("src",data.hi?data.hi:"./images/avatar.png");
            $(".user-name").val(data.nn?data.nn:"");
            $(".user-tel").val(data.ph?data.ph:"");
            $(".user-addr").val(data.ad?data.ad:"");
            $(".info-text").on("click", function () {
                var name = $.trim($('.user-name').val()), mobile = $.trim($('.user-tel').val()), address = $.trim($('.user-addr').val());
                if (name.length > 20 || name.length == 0) {
                    showTips('请填写您的姓名，以便顺利领奖！');
                    return false;
                } else if (!/^\d{11}$/.test(mobile)) {
                    showTips('请填写正确手机号，以便顺利领奖！');
                    return false;
                } else if (address.length < 8 || address.length > 60 || address.length == 0) {
                    showTips('请填写您的详细地址，以便顺利领奖！');
                    return false;
                }else{
                    shownewLoading();
                    getResult('api/user/edit_v2',
                        {
                            matk:matk,
                            rn:name,
                            ph:mobile,
                            ad:address
                        },'callbackUserEditHandler');
                }
            });
        },
        btn_animate: function(str){
            str.addClass('flipInY');
            setTimeout(function(){
                str.removeClass('flipInY');
            },200);
        }
    };
    W.callbackGreetingcardMaterialFightRank4SelfHandler = function(data) {
        if(data == undefined){

        }else{
            if(data.result){
                $(".ft-win").text((data.wc?data.wc:"0") + "胜");
                $(".ft-lose").text((data.fc?(parseInt(data.fc)-parseInt(data.wc)):"0") + "负");
                $(".btn-box>span").text("第" + (data.rk?data.rk:"0") + "名");
            }else{
            }
        }
        hidenewLoading();
    };
    W.callbackGreetingcardMaterialFightRank4WinHandler = function(data) {
        if(data == undefined){

        }else{
            if(data.result){
                H.rank.fillrank(data);
            }else{
            }
        }
        hidenewLoading();
    };
    W.callbackUserInfoHandler = function(data) {
        if(data == undefined){

        }else{
            if(data.result){
            }else{
            }
            H.rank.userinfo(data);
        }
        hidenewLoading();
    };
    W.callbackUserEditHandler = function(data) {
        if(data == undefined){

        }else{
            if(data.result){
                $(".user-info").addClass('none');
            }else{
            }
        }
        hidenewLoading();
    };
})(Zepto);

$(function() {
    H.rank.init();
});
