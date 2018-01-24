(function($) {
    var dataObject = {};//用来取金币数量
    var goldTemp = 0;
    var goodflag = true;
    H.market = {
            $height:$(window).height(),
            $width:$(window).width(),
            topValue: 0,// 上次滚动条到顶部的距离
            interval: null,// 定时器
            init:function()
            {
                var me = this;
                $('title').text("积分商城");
                $('body').css({'height':me.$height,'width':me.$width});
                $('.market-image-list').height(me.$height -225);
                me.event();
                me.dataRead();
                me.scrolling();
                me.userlog();
            },
            event:function()
            {
                $(".top-image-nav2  #user").on("click",function(e)
                {
                    e.preventDefault();
                    goodflag = false;
                    var goodId = $(this).attr("data-goodId");
                     $.ajax({
                            type : 'GET',
                            async : false,
                            url : business_url + "goods/exchange/"+busiAppId + "/" + openid + "/" + goodId,
                            data: {},
                            dataType : "jsonp",
                            jsonp : "callback",
                            complete: function() {
                            },
                            success : function(data) {

                            },
                            error:function()
                            {

                            }
                    });

                });
               
                
                //做任务按钮
            },
            dataRead:function () 
            {   
                //获取头像信息
                getResult("user/query/"+busiAppId + "/" + openid,{},"callBackUserInfoHandler",true);
                //获取实物奖
                getResult("goods/list/"+busiAppId,{},"taskCallBackHandler",true);
               
            },
            specialDate:function(data)
            {
                var t = simpleTpl();
                $(".top-image-nav .top-image-nav1").css("background-image","url(" + data.hotGoods.goodsImg + ")");
                $(".top-image-nav2  p").text(data.hotGoods.goodsDesc);
                $(".top-image-nav2  .top-img-gold").text(data.hotGoods.goodsValue);
                $(".top-image-nav2  #user").attr("data-goodId",data.hotGoods.goodsId);
            },

            //特殊图片展示信息
            update:function(data)
            {
                var length = data.length;
                var t = simpleTpl();
     
                //实体奖列表
                for(i = 0; i < length; i++)
                {
                    t._('<li onclick=exchangePrize('+ data[i].goodsId  + ')>')
                    ._('<a>')
                    ._('<img  src="./images/load-image.png"  onload="$(this).attr(\'src\',\'' + data[i].goodsImg + '\')"  onerror="$(this).addClass("none")">')
                    ._('</a>')
                    ._('<div class="ex-change-prize">'+data[i].goodsValue+'金币点击领取</div>')
                    ._('</li>');
                }
              $('.image-list').append(t.toString());
            },
            scrolling:function()
            { 
                var maxHeight = 0,
                    initHeight = 0,
                    pageHeight = 0;
            
                $('.market-image-list').scroll(function(){
                    var srollHeight = $('.market-image-list').scrollTop();
                    if(initHeight <= srollHeight)
                    {
                        $('.fix-tab-div').css({"opacity":"0","-webkit-transition":"all .2s ease-in","z-index":"0"});
                    }
                    else
                    {
                        $('.fix-tab-div').css({"opacity":"1","-webkit-transition":"all .5s ease","z-index":"2"});   
                    }
                    setInterval(function()
                    {
                        initHeight = srollHeight;
                    },0);     
                });
            },
            //用户日志
            userlog: function() {
                onpageload();
            }
       }

    // 获取头部信息
    W.callBackUserInfoHandler = function(data)
    {
        var headDafault = "./images/player.jpg";
        if(data.code == 0)
        {
            var headurl = data.result.headImg || headDafault;
            var name = data.result.nickName ||"匿名游客";
            var gold = (data.result.goldNum ||"0")+"金币";
            $('.user-information .head-img').css("background-image","url("+headurl+")");
            $('.user-information #user-name').text(name);
            $('.user-information #money-amount').text(gold);
        }
        else
        {
            var name = "匿名游客";
            var gold = "0"+"金币";
            $('.user-information .head-img').css("background-image","url("+headDafault+")");
            $('.user-information #user-name').text(name);
            $('.user-information #money-amount').text(gold);
        }

    }

    //查询实体奖
    W.queryGoodsInfoCallBackHandler=function(data)
    {   
        if(data.result)
        {
            H.market.update(data.message);
            dataObject = data.message;
        }
        else
        {
            showTips("网络不给力，请您再刷新一次");
        }
        H.market.specialDate(data);
    };
    //兑换奖品
    W.exchangePrize = function (index)
    {
        goodflag = true;
        for(var i = 0; i < dataObject.length;i++)
        {
            if(dataObject[i].goodsId == index)
            {
                goldTemp = dataObject[i].goodsValue;
            }
        };
        $.ajax({
                type : 'GET',
                async : false,
                url : business_url + "goods/exchange/"+busiAppId + "/" + openid + "/" + index,
                data: {},
                dataType : "jsonp",
                jsonp : "callback",
                complete: function() {
                },
                success : function(data) {

                },
                error:function()
                {

                }
         });
        
    } 
    //奖品兑换回调函数
    W.exchangeCallBackHandler = function(data)
    { 
        
        if(data.result)
        {
            // var amountStr = $('.user-information #money-amount').text();
            // var amount = amountStr.substring(0,amountStr.length-2);
            // if(goodflag == false)
            // {
            //      amount = parseInt(amount)-parseInt($(".top-img-gold").text());
            //      if(amount<0)
            //      {
            //         amount = 0;
            //      }  
            // }
            // else
            // {
            //      amount = parseInt(amount)-parseInt(goldTemp);
            //      if(amount<0)
            //      {
            //         amount = 0;
            //      }
            //      goldTemp = 0; 
            // }
            // $('.user-information #money-amount').text(amount + "金币");
            
            getResult("user/query/"+busiAppId + "/" + openid,{},"callBackUserInfoHandler",false);
            showTips(data.message);
        }
        else
        {
            showTips(data.message);
        }

    }
})(Zepto);



