
(function($) {
    H.task = {
            $height:$(window).height(),
            $width:$(window).width(),
            topValue: 0,// 上次滚动条到顶部的距离
            interval: null,// 定时器
            init:function()
            {
                var me = this;
                $('body').css({'height':me.$height,'width':me.$width});
                $('.result-list').height(me.$height - $('header').height()-$('.tab-div').height()-20);
                me.event();
                me.dataRead();
                me.scrolling();
                //me.letScroll();
                //判断是不是在浏览器中打开
                // if(!WeixinApi.openInWeixin())
                // {
                //     window.location.href="http://121.43.233.61/document/20150909/default/77bc551a2c8e5f97732e31d9413d3781.apk";
                // }       
            },
            event:function()
            {
                //中间菜单
                $(".tab-div a").each(function(e)
                {
                     $(this).click(function(e)
                    {
                        e.preventDefault();
                        //下拉菜单效果
                        $(".tag-bg p").removeClass("click-style");
                        if($(this).find('p').hasClass('reflect-name'))
                        {
                            $(".tab-div a").removeClass("click-style");
                            $(".tab-div .tag-bg").removeClass("none");
                            $('.reflect-name').addClass("click-style");
                            $(".tag-bg p:eq(0)").addClass("click-style");
                            $(this).find('.reflect-name').addClass('none');
                        }
                        else
                        {
                            $(".tab-div a").removeClass("click-style");               
                            $(".tab-div .tag-bg").addClass("none");
                            $('.reflect-name').removeClass('click-style');
                            $('.reflect-name').removeClass('none');
                            $(this).addClass("click-style");
                        }
                        
                    });
                    
                });
                
                // 做任务返回按钮
                $('#app-go-task').live('click',function(e){
                    e.preventDefault();
                    var taskid =  $(this).attr('data-taskId');
                    getResult("userTask/do/"+busiAppId + "/" + openid+"/"+taskid,{},"doTaskCallbackHandler",true);
                   
                });
                 $('#app-infor').delegate('#task-back','click',function(e){
                     e.preventDefault();
                     // var taskid =  $(this).attr('data-taskId');
                     // getResult("userTask/do/"+busiAppId + "/" + openid+"/"+taskid,{},"doTaskCallbackHandler",true)
                     $('#app-infor').addClass('none');
                });
                
                // 任务页面两个图片点击跳入外链
                $('.top-image-nav1').click(function()
                {
                    window.location.href = "http://www.baidu.com";

                });
                $('.top-image-nav2').click(function()
                {
                    window.location.href = "http://www.baidu.com";
                    
                });
       
                //做任务按钮
                $('#all-task').on('click',function(e)
                {
                    e.preventDefault();
                    getResult("task/list/"+busiAppId,{},"taskCallBackHandler",true);

                });
                //中间弹出菜单
                $(".tag-bg p").each(function(e)
                {
                    $(this).click(function(e)
                    { 
                       e.preventDefault();
                       var me = this;
                       var menuName = $(this).find('span:first-child').text();
                       var replaceName = $('span.pop-name').text();

                        //下拉菜单效果
                       $(".tag-bg p").removeClass("click-style");
                       $(this).addClass("click-style");
                       $(".menu-name").text(menuName);
                       //点击取消弹出层
                       setTimeout(function(){
                            if(menuName == "最容易")
                            {   
                                getResult("task/list/"+busiAppId,{type:1},"taskCallBackHandler",true);
                            }
                            else if(menuName == "最赚钱")
                            {
                                getResult("task/list/"+busiAppId,{type:2},"taskCallBackHandler",true);
                            }
                            else if(menuName == "最人气")
                            {
                                getResult("task/list/"+busiAppId,{type:3},"taskCallBackHandler",true);
                            }

                            $(".tab-div .tag-bg").addClass("none");
                            $('.pop-name').text(menuName);
                            $('.reflect-name').removeClass('none')
                            $(me).find('span:first-child').text(replaceName);
                       }, 200);
                    });
                    
                });
                
            },
            //任务一览
            dataRead:function () 
            {
                getResult("task/list/"+busiAppId,{},"taskCallBackHandler",true);
               
            },
            update:function(data)
            {
                $('#list').empty();
                var length = data.length;
                var t = simpleTpl();

                for(i = 0; i < length; i++)
                {
                    t._('<li>')
                    ._('<div>')
                    ._('<img  src=' + data[i].taskIcon + '>')
                    ._('<span class="app-name" >' + data[i].taskName + '</span>')
                    ._('<span class="app-tips">' + data[i].remark + '</span>')
                    ._('</div>')
                    ._('<div>')
                    ._('<p></span><span class="gold-infor">'+ data[i].goldTip + '</span><span class="gold-icon"></p>')
                    ._(' <a href="'+ data[i].taskUrl + '" data-collect="true" class="go-task"  data-collect-flag="tt-go-task" data-collect-desc="天天淘金-做任务" id="much-makemoney" onclick="showinfor(' + data[i].taskId + ')">任务详情 </a>')
                    ._('</div>')
                    ._('</li>');
                }
                $('#list').append(t.toString());
            },
            scrolling:function()
            { 
                var maxHeight = 0,
                    initHeight = 0,
                    pageHeight = 0;
            
                $('.result-list').scroll(function(){
                    var srollHeight = $('.result-list').scrollTop();
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
            letScroll: function() {
            var el = document.querySelector('.taotao-recommend');
            var pic_el = document.querySelector('.top-image-nav');
                   
            var elStep = $(window).height();
            var startPosition, endPosition, deltaX, deltaY, moveLength;
            var pic_startPosition, pic_endPosition, pic_deltaX, pic_deltaY;
            var clientWidth = $(window).width();
            el.addEventListener('touchstart', function (e) {
                e.preventDefault();
                var touch = e.touches[0];
                startPosition = {
                    x: touch.pageX,
                    y: touch.pageY
                }
            });
            //箭头
            el.addEventListener('touchmove', function (e) {
                e.preventDefault();
                var touch = e.touches[0];
                endPosition = {
                    x: touch.pageX,
                    y: touch.pageY
                }
                deltaX = endPosition.x - startPosition.x;
                deltaY = endPosition.y - startPosition.y;
                

            });
            //箭头
            el.addEventListener('touchend', function (e) {    
               e.preventDefault();
               if(deltaY < 0) {
                    if($('.top-image-nav').hasClass('none'))
                    {

                    }
                    else
                    {   
                        $('.top-image-nav').addClass('none');
                        $(".arrow").removeClass("arrowup").addClass('arrowdown').attr("src","./images/arrowred-down.png");
                    }
                    
                } else if (deltaY > 0) {
                    if($('.top-image-nav').hasClass('none'))
                    {
                        $('.top-image-nav').removeClass('none');
                        $(".arrow").removeClass("arrowdown").addClass('arrowup').attr("src","./images/arrowred-up.png");   
                    }
                    else
                    {

                    }
                }else{
                    if($('.top-image-nav').hasClass('none'))
                    {
                         $('.top-image-nav').removeClass('none');
                         $(".arrow").removeClass("arrowdown").addClass('arrowup').attr("src","./images/arrowred-up.png");   
                    }
                    else
                    {   
                        $('.top-image-nav').addClass('none');
                        $(".arrow").removeClass("arrowup").addClass('arrowdown').attr("src","./images/arrowred-down.png");
                    }

                };
                $('.result-list').height(H.task.$height - $('header').height()-$('.tab-div').height()-20);
            });
            //图片
            pic_el.addEventListener('touchstart', function (e) {
                e.preventDefault();
                var touch = e.touches[0];
                pic_startPosition = {
                    x: touch.pageX,
                    y: touch.pageY
                }
            });

           //图片
            pic_el.addEventListener('touchmove', function (e) {
                e.preventDefault();
                var touch = e.touches[0];
                pic_endPosition = {
                    x: touch.pageX,
                    y: touch.pageY
                }
                pic_deltaX = pic_endPosition.x - pic_startPosition.x;
                pic_deltaY = pic_endPosition.y - pic_startPosition.y;
                

            });
            //图片上滑
            pic_el.addEventListener('touchend', function (e) {    
               e.preventDefault();
                if(pic_deltaY < 0) {
                    if(!$('.top-image-nav').hasClass('none'))
                    {
                        $('.top-image-nav').addClass('none');
                        $(".arrow").removeClass("arrowup").addClass('arrowdown').attr("src","./images/arrowred-down.png");
                    }
                    
                }
                $('.result-list').height(H.task.$height - $('header').height()-$('.tab-div').height()-20);

           });

        }
       }
    //查询任务列表
   W.taskCallBackHandler = function(data)
   {
       if(data.result)
       {
          H.task.update(data.message);
          popAppData = data.message;
       }
       else
       {
         showTips(data.message);
         // showTips("亲，不要着急再刷新一次！");
       }
   }
   //做任务
   W.doTaskCallbackHandler = function(data){  
       if(data.result)
       {
            $("#app-download").removeClass("none");
            // localStorage.setItem("downUrl",data.taskUrl);
       }
       else
       {
            showTips(data.message);
       }
   }
})(Zepto);

//任务弹层
function showinfor(index)
{   
    var t = simpleTpl();
    var length = popAppData.length;
    $('#app-infor').empty();
    for(var i = 0;i<length;i++)
    {
        if(popAppData[i].taskId == index)
        {
            t._('<div class="infor-header">')
                ._('<div class="task-back" id="task-back" data-taskId="'+ index+ '"><span class="back-icon"></span>任务</div>')
                ._('<h3>' + popAppData[i].taskName + '</h3>')     
                ._('</div>')
                ._(' <section class="app-infor-main">')
                ._('<div class="divide-line">') 
                       ._('<div>')
                       ._('<img  src=' + popAppData[i].taskIcon + '>')
                       ._('<span class="app-name">' + popAppData[i].taskName + '</span>')
                       ._('<span class="app-tips"><span class="prize-style">奖励金币:    </span>' + popAppData[i].taskGold + '金币</span>')
                       ._('</div>')

                ._('</div>')    
                    ._('<div class="divive-content">')    
                    ._('<div class="theme-content">')   
                    // ._('<h4>' + popAppData[i].themeName + '</h4>')   
                    ._('<p>'+ popAppData[i].taskDetail + '</p>')     
                    ._('</div>')            
                    // ._(' <div class="grey-content">')     
                    //     ._('<h5>' + popAppData[index].greyName + '</h5>')   
                    //     ._('<p>' + popAppData[index].greyPtips + '</p>')     
                    // ._('</div>')          
                    // ._(' <div class="app-download">')     
                    //     // ._('<h5>' + popAppData[i].appinforName + '</h5>')   
                    //     ._('<p class="p-first">1、点击<a href="http://www.baidu.com">下载' + popAppData[i].taskName + '（安卓用户专用）</a>，安装后打开 软件，按照提示完成注册。</p>')  
                    //     ._('<p >2、苹果手机用户或者不想安装软件的用户可以直接  打开 <a href="http://www.baidu.com">' + popAppData[i].taskName + 'WAP网站</a>，同样可以注册完成任务。')     
                    // ._('</div>') 
                    ._('<div class="app-back">')
                    ._('<a href="" class="app-go-task" id="app-go-task" data-taskId="'+ index+ '">')
                    ._('去做任务')
                    ._('</a>')       
                    ._('</div>') 
                    ._('</div>')  
                    ._('</section>')       
                   
                $('#app-infor').append(t.toString()).removeClass('none');
                $('#app-infor').css({'height':H.task.$height,'width':H.task.$width});
                $('#app-download').css({'height':H.task.$height,'width':H.task.$width});
        }
    }
}
