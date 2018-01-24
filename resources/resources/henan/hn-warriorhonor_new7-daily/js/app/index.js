(function($){
    H.index = {
        puid:null,
        serverT:null,
        signRData:null,
        init: function(){
            this.event();
            getResult('api/linesdiy/info',{},'callbackLinesDiyInfoHandler');
            getResult('api/common/time',{},'commonApiTimeHandler');
            if($("body").hasClass('switch')){
                this.swinit();
            }
            //getResult('api/article/list', {}, 'callbackArticledetailListHandler');
        },
        btn_animate: function(str,calback){
            str.addClass('flipInY');
            setTimeout(function(){
                str.removeClass('flipInY');
            },150);
        },
        swinit: function () {
            var swiper = new Swiper('.swiper-container', {
                pagination: '.swiper-pagination',
                paginationClickable: true,
                //effect : 'coverflow',
                slidesPerView: 3,
                prevButton:'.swiper-button-prev',
                nextButton:'.swiper-button-next',
                paginationBulletRender: function (index, className) {
                    var pname = null;
                    //return '<span class="' + className + '">' + pname + '</span>';
                }
            });
        },
        event: function(){
            var me = H.index;
            $(".go").on('click',function(e){
                e.preventDefault();
                me.btn_animate($(this));
                toUrl("switch.html");
            });
            $(".switch-fight").on('click',function(e){
                e.preventDefault();
                me.btn_animate($(this));
                toUrl("card.html");
            });
            $(".switch-job").on('click',function(e){
                e.preventDefault();
                me.btn_animate($(this));
                toUrl("daily.html");
            });
            $(".switch-rank").on('click',function(e){
                e.preventDefault();
                me.btn_animate($(this));
                toUrl("fdrank.html");
            });
            $(".switch-card").on('click',function(e){
                e.preventDefault();
                me.btn_animate($(this));
                toUrl("getcard.html");
            });
            $(".get").tap(function (e) {
                e.preventDefault();
                getResult('api/sign/signed',{yoi:openid, auid:H.index.puid},'callbackSignSignedHandler');
            });
        }
    };
    W.callbackLinesDiyInfoHandler = function(data){
    	if(data.code == 0){
    		$(".tlt").attr("src",data.gitems&&data.gitems[0].is?data.gitems[0].is:"images/tlt.png");
    	}else{
    		$(".tlt").attr("src","images/tlt.png");
    	}
    };
    W.commonApiTimeHandler = function(data){
        H.index.serverT = data.t;
        getResult('api/sign/round',{},'callbackSignRoundHandler');
    };
    W.callbackSignRoundHandler = function(data){
    	if(data.code == 0){
            H.index.signRData = data;
            for(var i = 0;(i<=H.index.signRData.items.length - 1);i++){
                var st = timestamp(H.index.signRData.items[i].st);
                var et = timestamp(H.index.signRData.items[i].et);
                if((H.index.serverT>st)&&(H.index.serverT<et)){
                    getResult('api/sign/issign',{yoi:openid,auid:H.index.signRData.items[i].uid},'callbackSignIsHandler');
                }
            }
    	}else{
    	}
    };
    W.callbackSignIsHandler = function(data){
    	if(data.result == false){
            $(".sign").removeClass('none');
            getResult('api/sign/myrecord',{yoi:openid},'callbackSignMyRecordHandler');
        }else{
        }
    };
    W.callbackSignSignedHandler = function(data){
    	if(data.code == 0){
            $(".sign").addClass('none');
            $(".get-tips").removeClass('none');
            $(".get-cls").tap(function (e) {
                e.preventDefault();
                $(".get-tips").addClass('none');
            });
    	}else{
            showTips(data.message);
            $(".sign").addClass('none');
        }
    };
    W.callbackSignMyRecordHandler  = function(data){
    	if(data.code == 0){
            var isContinue = false,nowGold=0,startPos=0;
            if(H.index.signRData.items.length<7){

            }
            for(var i = (H.index.signRData.items.length - 1);i>=startPos;i--){
                var hasSign = false,signInfo='';
                for(var a=0;a<data.items.length;a++){
                    if(data.items[a].aid==H.index.signRData.items[i].uid){
                        signInfo += '<div id="' + data.items[a].aid + '" class="sign-content">';
                        hasSign = true;
                    }
                }
                if(hasSign == false){
                    signInfo += '<div id="' + H.index.signRData.items[i].uid + '" class="sign-content">';
                }
                switch (i){
                    case 6:
                        signInfo += '<p>星期一</p>';
                        break;
                    case 5:
                        signInfo += '<p>星期二</p>';
                        break;
                    case 4:
                        signInfo += '<p>星期三</p>';
                        break;
                    case 3:
                        signInfo += '<p>星期四</p>';
                        break;
                    case 2:
                        signInfo += '<p>星期五</p>';
                        break;
                    case 1:
                        signInfo += '<p>星期六</p>';
                        break;
                    case 0:
                        signInfo += '<p>星期天</p>';
                        break;
                    default :
                        break;
                }
                if(hasSign == true){
                    if(isContinue == false){nowGold=0;}
                    isContinue = true;
                    signInfo += '<img src="images/daily-issign.png" />'
                        + '<span>' + parseInt(parseInt(H.index.signRData.items[i].bv)+nowGold) + '战斗币</span></div>';
                    nowGold += H.index.signRData.items[i].iv;
                }else{
                    isContinue = false;
                    signInfo += '<img src="images/daily-notsign.png" />'
                        + '<span>' + parseInt(parseInt(H.index.signRData.items[i].bv)+nowGold) + '战斗币</span></div>';
                    nowGold += H.index.signRData.items[i].iv;
                }
                $(".sign-body").append(signInfo);
            }
            for(var b = 0;(b<=H.index.signRData.items.length - 1);b++){
                var st = timestamp(H.index.signRData.items[b].st);
                var et = timestamp(H.index.signRData.items[b].et);
                if((H.index.serverT>st)&&(H.index.serverT<et)){
                    $("#"+H.index.signRData.items[b].uid).css({"background":'url("images/sign-bg.png") no-repeat',"background-size":"100% 100%"});
                    H.index.puid = H.index.signRData.items[b].uid;
                }
            }
    	}else{
    	}
    };
    W.callbackArticledetailListHandler = function(data) {
        if(data == undefined){

        }else{
            if(data.code == 0){
                $(".go").before('<img class="ad" src="' + (data.arts[0].img).toString() + '" />');
            }else if(data.code == 1){
            }
        }
        hidenewLoading();
    }
})(Zepto);
$(function(){
    H.index.init();
});
