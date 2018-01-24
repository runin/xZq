/**
 * 第一时间-个人中心页
 */
(function(){
    H.award = {
        REQUEST_CLS: 'requesting',
        wxCheck:false, //判断微信jsapi检查以及wxconfig，如果检查失败不能调抽奖接口，默认为false,congfig成功之后置为true
        isError:false, //判断 wxcongfig是否失败，默认为false（未失败），config失败之后置为true（失败）
         init: function(){
         	if(getQueryString("source")!="vote"){
         		$("#btn-lottery").addClass("request");
         	}
         	this.documen_pre();
	        this.houser();
	        this.info();
	        this.wxConfig();
         },
        //查询奖品list
        info: function(){
            getResult('api/linesdiy/info', {}, 'callbackLinesDiyInfoHandler', true);
        },
        wxConfig: function(){
            //后台获取jsapi_ticket并wx.config
            $.ajax({
                type : 'GET',
                async : true,
                url : domain_url + 'mp/jsapiticket',
                data: {appId: shaketv_appid},
                dataType : "jsonp",
                jsonpCallback : 'callbackJsapiTicketHandler',
                timeout: 15000,
                complete: function() {
                },
                success : function(data) {
                    if(data.code == 0){
                        var url = window.location.href.split('#')[0];
                        var nonceStr = 'df51d5cc9bc24d5e86d4ff92a9507361';
                        var timestamp = Math.round(new Date().getTime()/1000);
                        var signature = hex_sha1('jsapi_ticket=' + data.ticket + '&noncestr=' + nonceStr + '&timestamp=' + timestamp + '&url=' + url);
                        //权限校验
                        wx.config({
                            debug: false,
                            appId: shaketv_appid,
                            timestamp: timestamp,
                            nonceStr:nonceStr,
                            signature:signature,
                            jsApiList: [
                                "addCard",
                                "checkJsApi"
                            ]
                        });
                    }

                },
                error : function(xmlHttpRequest, error) {
                }
            });
        },
        documen_pre: function(){
            var win_w = $(window).width(),
                doc_w = 0;
                doc_w = win_w*0.96/3;
            $('li.items').css({
                'width': doc_w,
                'height': doc_w
            });
           $("#back").click(function(e){
				e.preventDefault();
				if($(this).hasClass("requesting")){
					return;
				}
				$(this).addClass("requesting");
				toUrl("comment.html?markJump=yaoClick");
			})
        },
        houser: function(){
            var me = H.award,
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
                    	setTimeout(function(){
                       		H.dialog.thank.open("tiger");
                        },500);
                    }else{
                    	setTimeout(function(){
	                       H.dialog.lottery.open(jpDta,"tiger");
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
            var thanksIndex = 3;//奖品指针（位置从1开始）

            var oPage = {
                init: function() {
                    this.listen();
                }
                ,listen: function() {
                    var self = this;

                    // 鼠标点击按钮抽奖效果
                    ui.$btnLottery.on('click',function(){
                        var sn = new Date().getTime()+'';
                        if($(this).hasClass("request")){
                        	return;
                        }
                        $(this).addClass("request");
                        if(!H.award.wxCheck){
                        	prizeNum = thanksIndex;
		                    lightChange(ui.$prizes, "active", prizeArr, prizeNum);
		                    return;
		                }else{
		                	 $.ajax({
	                            type : 'GET',
	                            async : false,
	                         	url : domain_url + 'api/lottery/exec/luck4Vote'+dev,
	                            data: {
	                                matk: matk ,
	                                sn : sn
	                            },
	                            dataType : "jsonp",
	                            jsonpCallback : 'callbackLotteryLuck4VoteHandler',
	                            timeout: 11000,
	                            complete: function() {
	                                sn = new Date().getTime()+'';
	                                // 调用跑马灯效果
	                                lightChange(ui.$prizes, "active", prizeArr, prizeNum);
	                            },
	                            success : function(data) {
	                                if(data && data.result){
	                                    if(data.sn == sn){
	                                        if(data.pt != 0){
	                                        	jpDta = data;
	                                            prizeNum = data.px;
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
		                }
                     
                    });
                }
            };
            oPage.init();
        }
    };
    W.callbackLinesDiyInfoHandler = function(data){
        if(data.code == 0){
            var $items = $('.items');
            $.each(data.gitems, function(i,item){
                $.each($items, function(j,jtem){
                    if($items.eq(j).attr('data-id') == item.info){
                        $items.eq(j).find('img').attr('src', item.ib).attr("onerror","$(this).addClass(\'none\')");
                        $items.eq(j).find('span').html(item.t);
                    }
                });
            });
            $("#award-box").removeClass("none")
        }
    }
})(Zepto);
$(function(){
    H.award.init();
      wx.ready(function () {
      wx.checkJsApi({
            jsApiList: [
                'addCard'
            ],
            success: function (res) {
                var t = res.checkResult.addCard;
                //判断checkJsApi 是否成功 以及 wx.config是否error
                if(t && !H.award.isError){
                    H.award.wxCheck = true;
                }
            }
        });
        //wx.config成功
    });

    wx.error(function(res){
        H.award.isError = true;
        //wx.config失败，重新执行一遍wx.config操作
        //H.record.wxConfig();
    });
});
