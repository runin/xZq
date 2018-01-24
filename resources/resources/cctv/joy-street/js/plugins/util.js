/*
* 工具方法以及素材全局方法
*/

/*
* 字符串 -> Date对象
*/
var str2date = function (str) {
    str = str.replace(/-/g, '/');
    return new Date(str);
};
 
/*
* 字符串 -> 毫秒数
*/
var timestamp = function (str) {
    return str2date(str).getTime();
};
 
/*
* Date对象 -> 字符串
* 
* @param format 例:yyyy年MM月dd日 hh:mm:ss
*/
var dateformat = function (date, format) {
    var z = {
        M: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        m: date.getMinutes(),
        s: date.getSeconds()
    };
    format = format.replace(/(M+|d+|h+|m+|s+)/g, function (v) {
        return ((v.length > 1 ? "0" : "") + eval('z.' + v.slice(-1))).slice(-2);
    });
    return format.replace(/(y+)/g, function (v) {
        return date.getFullYear().toString().slice(-v.length)
    });
};

var preloadimages = function(arr){ 
    var newimages=[], loadedimages=0
    var postaction=function(){}  //此处增加了一个postaction函数
    var arr=(typeof arr!="object")? [arr] : arr
    function imageloadpost(){
        loadedimages++
        if (loadedimages==arr.length){
            postaction(newimages) //加载完成用我们调用postaction函数并将newimages数组做为参数传递进去
        }
    }
    for (var i=0; i<arr.length; i++){
        newimages[i]=new Image()
        newimages[i].src=arr[i]
        newimages[i].onload=function(){
            imageloadpost()
        }
        newimages[i].onerror=function(){
            imageloadpost()
        }
    }
    return { //此处返回一个空白对象的done方法
        done:function(f){
            postaction=f || postaction
        }
    }
};


(function($) {
    
    H.rule = {
        $dialog : $('.dialog'),
        $rule : $('#rule'),
        $tab: $('.tab'),
        $tabRule: $('#tab_rule'),
        $tabScore: $('#tab_score'),
        $tabAllScore: $('#tab_all_score'),
        $tabTicket: $('#tab_ticket'),
        $contentRule: $('#content_rule'),
        $contentScore: $('#content_score'),
        $contentTicket: $('#content_ticket'),
        $info : $('#info'),

        $close: $('.dialog-close'),

        dialogTopRatio : 580 / 87,
        dialogBottomRatio : 580 / 34,

        contentHeight : 0,


        init: function() {
            this.resize();
            this.bindBtn();
            this.prereserve();
            this.promotion();

            if (window.location.href.indexOf('cb41faa22e731e9b') == -1) {
                $('#div_subscribe_area').css('height', '0');
            } else {
                $('#div_subscribe_area').css('height', '50px');
            };
        },

        promotion: function() {
            getResult('api/common/promotion',{oi:openid},commonApiPromotionHandler);
        },

        resize: function(){
            width = $(window).width();
            height = $(window).height();

            var topHeight = width * 0.9 / this.dialogTopRatio;
            $('.dialog .dialog-top').css({
                'height' : topHeight,
                'background-size' : width * 0.9
            });

            var bottomHeight = width * 0.9 / this.dialogBottomRatio
            $('.dialog .dialog-bottom').css({
                'height' : bottomHeight,
                'background-size' : width * 0.9
            });

            var centerHeight = height - topHeight - bottomHeight - 20;
            $('.dialog .dialog-center').css({
                'height' : centerHeight,
                'background-size' : width * 0.9
            });

            $('.dialog .separator').css({
                'background-size' : width * 0.8
            });

            this.contentHeight = height - 125 - 20;
            this.$contentRule.css('height', this.contentHeight);
            this.$contentScore.css('height', this.contentHeight);
            this.$contentTicket.css('height', this.contentHeight);

        },

        ruleCallback: function(data){
            this.$contentRule.html(data.rule);
        },

        ruleError: function(){
            alert('网络错误，请稍后重试');
            $('.dialog-wrapper').addClass('none');
        },

        bindBtn: function(){
            this.$rule.click(function(){
                $('body,html').scrollTop(0);
                $('#guize').parent().removeClass('none');
                $('body').css('height', $(window).height());
                showLoading();
                getResult('api/common/rule',null, 'commonApiRuleHandler');

            });

            this.$tabScore.click(function(){
                $('.tab a').removeClass('active');
                H.rule.$tabScore.addClass('active');
                H.rule.$info.removeClass('none');
                $('#tttj').removeClass('none');
                H.rule.closeInfo();

                $('.tab-content').addClass('none');
                H.rule.$contentScore.removeClass('none');
                H.rule.$contentScore.find('.detail').text('我的积分：0 排名：暂无排名' );
                H.rule.$contentScore.find('.rank-list').html('');

                showLoading();
                
                var now = new Date().getTime() + H.router.timeOffset;
                var lastSunday = now - new Date(now).getDay() * 24 * 60 * 60 * 1000;
                lastSunday = dateformat(new Date(lastSunday), 'yyyy-MM-dd');

                getResult('api/lottery/integral/rank/self', {oi:openid , pu: lastSunday}, 'callbackIntegralRankSelfRoundHandler');
                getResult('api/lottery/integral/rank/top10', {pu: lastSunday}, 'callbackIntegralRankTop10RoundHandler');
            });

            this.$tabAllScore.click(function(){
                $('.tab a').removeClass('active');
                H.rule.$tabAllScore.addClass('active');
                H.rule.$info.removeClass('none');
                $('#tttj').removeClass('none');
                H.rule.closeInfo();

                $('.tab-content').addClass('none');
                H.rule.$contentScore.removeClass('none');
                H.rule.$contentScore.find('.detail').text('我的积分：0 排名：暂无排名' );
                H.rule.$contentScore.find('.rank-list').html('');

                showLoading();
                getResult('api/lottery/integral/total/rank/self', {oi:openid}, 'callbackIntegralTotalRankSelfRoundHandler');
                getResult('api/lottery/integral/total/rank/top10', {oi:openid}, 'callbackIntegralTotalRankTop10Handler');
            });

            this.$tabRule.click(function(){
                $('.tab a').removeClass('active');
                H.rule.$tabRule.addClass('active');
                H.rule.$info.addClass('none');
                $('#tttj').addClass('none');
                H.rule.closeInfo();

                $('.tab-content').addClass('none');
                H.rule.$contentRule.removeClass('none');
            });

            this.$tabTicket.click(function(){
                $('.tab a').removeClass('active');
                H.rule.$tabTicket.addClass('active');
                H.rule.$info.addClass('none');
                $('#tttj').addClass('none');
                H.rule.closeInfo();

                $('.tab-content').addClass('none');
                H.rule.$contentTicket.removeClass('none');
                H.rule.$contentTicket.find('.rank-list').html('');

                showLoading();
                getResult('api/lottery/record', {
                    oi : openid,
                    pt : 5
                }, 'callbackLotteryRecordHandler');
            });

            this.$close.click(function(){
                $(this).parent().parent().addClass('none');
                $('body').css('height', 'auto');
            });
			//预约
            $("#appointment").click(function(e){
                e.preventDefault();
            
                var reserveId = $(this).attr('data-reserveid');
				var dateT = $(this).attr('data-date');
                if (!reserveId) {
                    return;
                }
                shaketv.reserve_v2({tvid:yao_tv_id, reserveid:reserveId, date:dateT}, function(data){});
            });

            this.$info.click(function(){
                if($(this).hasClass('active')){
                    H.rule.closeInfo();
                }else{
                    H.rule.openInfo();
                }
            });
            
            $('#info_submit').click(function(){
                var token = $('#token').val();
                var name = $.trim($('#name').val());
                var ad = $.trim($('#add').val());
                var tel = $.trim($('#tel').val());

                if(!tel){
                    alert("手机号码不能为空");
                    return;
                }else if(!/^(13[0-9]|14[0-9]|15[0-9]|18[0-9])\d{8}$/i.test(tel)){
                    alert('这个手机号可打不通...');
                    return;
                }

                if(name.length <= 0){
                    alert('请填写姓名');
                    return;
                }

                if(ad.length <= 0){
                    alert('请填写地址');
                    return;
                }

                getResult('api/user/edit',{
                    oi : openid,
                    tk : token, 
                    nn : encodeURIComponent(nickname),
                    hi : headimgurl,
                    ph : tel,
                    rn : encodeURIComponent(name),
                    ad : encodeURIComponent(ad),
                },'callbackUserEditHandler');
            });
        },

        openInfo: function(){
            getResult('api/user/info',{
                oi : openid
            }, 'callbackUserInfoHandler');

            this.$info.addClass('active');
            $(".info-wrapper").removeClass('none');
            H.rule.$contentScore.css('height', H.rule.contentHeight - 160);
            setTimeout(function(){
                $(".info-wrapper").css('height', '168px');
            },1);
        },

        closeInfo: function(){
            this.$info.removeClass('active');
            $(".info-wrapper").css('height', '0px');
            H.rule.$contentScore.css('height', H.rule.contentHeight);
            setTimeout(function(){
                $(".info-wrapper").addClass('none');
            },300);
        },

        fillSelfData: function(data){
            if(data.in >= 0){
                this.$contentScore.find('.detail').text('我的积分：' + data.in + ' 排名：' + data.rk ); 
            }else{
                this.$contentScore.find('.detail').text('我的积分：0 排名：暂无排名' );
            }
        },

        fillListData: function(data){

            var t = simpleTpl();
            for(var i in data.top10){
                t._('<li>')
                    ._('<section class="avatar">')
                            ._('<img src="'+ data.top10[i].hi +'" onerror="this.src=\'./images/avatar.jpg\'" />')
                    ._('</section>')
                    ._('<section class="nickname">')
                        ._(data.top10[i].nn ? data.top10[i].nn : '匿名用户' )
                    ._('</section>')
                    ._('<section class="rank">第')
                        ._(data.top10[i].rk)
                    ._('名</section>')
                ._('</li>');
            }

            this.$contentScore.find('.rank-list').html(t.toString());
        },

        fillTicketListData: function(data){
            var t = simpleTpl();

            t._('<li class="ticket-wrapper">')
                ._('<section class="ticket-name center">')
                    ._('类型')
                ._('</section>')
                ._('<section class="ticket-code center">')
                    ._('密钥')
                ._('</section>')
            ._('</li>');

            for(var i in data.rl){
                t._('<li class="ticket-wrapper">')
                    ._('<section class="ticket-name">')
                        ._(data.rl[i].pn)
                    ._('</section>')
                    ._('<section class="ticket-code">')
                        ._(data.rl[i].cc)
                    ._('</section>')
                ._('</li>');
            }

            this.$contentTicket.find('.rank-list').html(t.toString());
        },

        fillUserData: function(data){
            $('#token').val(data.tk);
            $('#name').val(data.rn ? data.rn : '');
            $('#add').val(data.ad ? data.ad : '' );
            $('#tel').val(data.ph ? data.ph : '' );
        },

        // 检查该互动是否配置了预约功能
        prereserve: function() {
            var me = this;
            $.ajax({
                type : 'GET',
                async : true,
                url : domain_url + 'api/program/reserve/get',
                data: {},
                dataType : "jsonp",
                jsonpCallback : 'callbackProgramReserveHandler',
                success : function(data) {
                    if (!data.reserveId) {
                        return;
                    }
                    // yao_tv_id: 微信为电视台分配的id
                    window['shaketv'] && shaketv.preReserve_v2({tvid:yao_tv_id, reserveid:data.reserveId, date:data.date}, function(resp){
                        if (resp.errorCode == 0) {
                            $("#appointment").removeClass('none').attr('data-reserveid', data.reserveId).attr('data-date', data.date);
                        }
                    });
                }
            });
        },
    };

    W.commonApiRuleHandler = function(data){
        hideLoading();
        if(data.code == 0){
            H.rule.ruleCallback(data);
        }else{
            H.rule.ruleError();
        }
    };

    W.callbackIntegralRankSelfRoundHandler = function(data){
        hideLoading();
        if(data.result == true){
            H.rule.fillSelfData(data);
        }
    };

    W.callbackIntegralTotalRankSelfRoundHandler = function(data){
        hideLoading();
        if(data.result == true){
            H.rule.fillSelfData(data);
        }
    };

    W.callbackIntegralRankTop10RoundHandler = function(data){
        hideLoading();
        if(data.result == true){
            H.rule.fillListData(data);
        }
    };

    W.callbackIntegralTotalRankTop10Handler = function(data){
        hideLoading();
        if(data.result == true){
            H.rule.fillListData(data);
        }
    };

    W.callbackLotteryRecordHandler = function(data){
        hideLoading();
        if(data.result == true){
            H.rule.fillTicketListData(data);
        }
    };

    W.callbackUserInfoHandler = function(data){
        if(data.result){
            H.rule.fillUserData(data);    
        }
    };

    W.callbackUserEditHandler = function(data){
        if(data.result){
            alert('修改成功！');
            H.rule.closeInfo();
        }else{
            alert('网络错误，请刷新重试');
        }
    };

    W.commonApiPromotionHandler = function(data){
        if(data.code == 0){
            $('#tttj').html(data.desc).attr('href', data.url);
            $('#tttj').before('&nbsp;&nbsp;&nbsp;');
        }
    };

})(Zepto);

$(function(){

    var showNum = 5;
    var moveX = 0;
    var moveY = 0;

    var lastX = 0;
    var lastY = 0;

    var nowPage = -1;

    var slidePage = ['zuji', 'toutiao', 'comment'];
    var slideTarget = ['zuji-view.html', 'toutiao.html', 'comment.html'];

    var url = location.href;
    for(var i in slidePage){
        if(url.indexOf(slidePage[i]) >= 0){
            nowPage = i;
        }
    }
    $(document).bind('touchstart', function(e){
        moveX = e.touches[0].clientX;
        moveY = e.touches[0].clientY;

        lastX = e.touches[0].clientX;
        lastY = e.touches[0].clientY;

    }); 

    $(document).bind('touchmove', function(e){
        lastX = e.touches[0].clientX;
        lastY = e.touches[0].clientY;
        if(moveX - lastX > 5 && Math.abs(moveY - lastY) < 5){
            e.preventDefault();    
        }
    });

    $(document).bind('touchend', function(e){
        if(moveX - lastX > 100 && Math.abs(moveY - lastY) < 100 ){
            if(nowPage >= 0){
                showLoading();
                nowPage ++;
                if(nowPage > 2){
                    nowPage = 0;
                }

                var query = "";
                var key = 'cb41faa22e731e9b';
                var value = getQueryString(key);
                if(value){
                    query = "?" + key + "=" + value;
                }
                location.href = slideTarget[nowPage] + query;
            }else{
                // 非返回页
            }
        }else{
            // 非返回操作
        }
    });


    var showed = parseInt($.fn.cookie(mpappid + '_slide_showed'),10);
    if(!showed){
        showed = 0;
    }
    
    if(showed < showNum){
        $('#slide').removeClass('none');
        setTimeout(function(){
            $('#slide').addClass('none');
        },3000);
        showed++;
        $.fn.cookie(mpappid + '_slide_showed', showed);
    }
});
