(function($) {
    H.user = 
    {
            $height:$(window).height(),
            $width:$(window).width(),
            topValue: 0,// 上次滚动条到顶部的距离
            interval: null,// 定时器
            init:function()
            {
                var me = this;
                $('title').text("用户个人信息");
                $('body').css({'height':me.$height,'width':me.$width});
                $('.user-list').height(me.$height -100);
                H.user.dataLoding.init();
                H.user.userPersonalInformation.init();
                //me.userlog();
            },
                      //用户日志
            userlog: function() {
                onpageload();
            },
            // 全部任务和兑换状态的数据加载
            dataLoding:
            {   
                init:function()
                {
                    this.event();
                    this.scrolling();
                    this.taskDataRead();
                },
                taskDataRead:function()
                {
                    getResult("userTask/queryusertask/"+busiAppId+"/"+openid,{},"queryUserTaskCallBackHandler",true);
                },
                //获取已经兑换的奖品
                exchangePrizeRead:function()
                {
                    getResult("goods/exchange/record/"+busiAppId+"/"+openid,{},"QueryExchangRecordCallBackHandler",true);
                },
               //全部任务状态
                updata:function (data) 
                {
                    $('.user-list #list').empty();
                    var length = data.length;
                    var t = simpleTpl();
                    var stateSword = "";
                    var data_state = "";
                    for(i = 0; i < length; i++)
                    {
                        if(data[i].taskState == 1)
                        {
                             stateSword="完成";
                             data_state ="finished"
                        } 
                        else if(data[i].taskState == 0)
                        {
                             stateSword="未审核";
                             data_state ="wait-checking"
                        }
                        else
                        {
                             stateSword="审核中";
                             data_state ="checking"
                        }
                        t._('<li>')
                        ._('<div class="user-task-name"><p>'+data[i].taskName+'</p>')
                        ._('<p><time>'+data[i].taskTime+'</p></div>')
                        ._('<div class="user-task-states"  data-flag = ' + data_state+'>')
                        ._('<p>' + stateSword+'</p></div>')
                        ._('</li>');
                    }
                    $('.user-list #list').append(t.toString());
                },
                //兑换信息数据读取
                exchangedupdata:function (data) 
                {
                   $('.user-list #list').empty();
                    var length = data.length;
                    var t = simpleTpl();
                    var stateSword = "";
                    var data_state = "";
                    for(i = 0; i < length; i++)
                    {
                        t._('<li>')
                        ._('<div class="user-task-name"><p>'+data[i].goodsName+'</p>')
                        ._('<p><time>'+data[i].exchangeTime+'</p></div>')
                        ._('</li>');
                    }
                    $('.user-list #list').append(t.toString());
                },
                event:function()
                {
                    var me = this;
                    $("#my-all-task").click(function(e)
                    {
                        e.preventDefault();
                        me.taskDataRead();
                    });
                    $("#exchange-prize").click(function(e)
                    {
                        e.preventDefault();
                        me.exchangePrizeRead();
                        
                    });
                    $(".tab-div a").each(function(e)
                    {
                         $(this).click(function(e)
                        {
                           $(".tab-div a").removeClass('click-style');
                           $(this).addClass('click-style');
                        });
                    });
                },
                scrolling:function()
                { 
                    var maxHeight = 0,
                        initHeight = 0,
                        pageHeight = 0;
                
                    $('.user-list').scroll(function(){
                        var srollHeight = $('.user-list').scrollTop();
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
            }, 
            //用户信息修改
            userPersonalInformation:
                {
                    init:function()
                    {
                        this.userLoad();
                        this.event();
                        this.letScroll();
                        //获取头像信息
                        getResult("user/query/"+busiAppId + "/" + openid,{},"callBackUserInfoHandler",false);
                    },
                    userLoad:function()
                    {
                        $.ajax({
                               type : 'GET',
                               async : false,
                               url : business_url + "user/address/"+busiAppId + "/" + openid,
                               data: {},
                               dataType : "jsonp",
                               jsonp : "callback",
                               jsonpCallBack:"callBackQueryAddressHandler",
                               complete: function() {
                               },
                               success : function(data) {}
                        });
                    },

                    updataLoad:function(data)
                    {
                            $('.mobile').val(data.phone||"");
                            $('.address').val(data.address||"");
                            $('.name').val(data.name||"");
                            if(data.age !=0 )
                            {
                                $('.age').val(data.age + "后");   
                            }
                            
                          
                    },
                    event:function()
                    {
                         //年龄选择
                         var me =this;
                        var selectArea = new MobileSelectArea();
                        selectArea.init({trigger:'#txt_area',value:$('#hd_area').val()});
                    },
                    check: function() {
                        var $mobile = $('.mobile'),
                        mobile = $.trim($mobile.val()),
                        $address = $('.address'),
                        address = $.trim($address.val()),
                        $name = $('.name'),
                        name = $.trim($name.val()),
                        $age = $('.age'),
                        age = $.trim($age.val());
                        if (name.length > 20 || name.length == 0) {
                            showTips('请输入您的姓名，不要超过20字哦!');
                            return false;
                        }else if (!/^\d{11}$/.test(mobile)) {
                            showTips('这手机号，可打不通...');
                            return false;
                        }else if(address.length == 0){
                            showTips('请填写正确的地址');
                            return false;
                        }else if(age.length==0 || age=="——")
                        {
                            showTips('请选择正确的年龄');
                            return false;
                        }
                        return true;
                    },
                    letScroll: function()
                    {
                        var me = this;
                        var el = document.querySelector('.arrow');
                        var top_el = document.querySelector('.user-information');
                        var down_el = document.querySelector('.pop-age');
                        var elStep = $(window).height();
                        var startPosition, endPosition, deltaX, deltaY, moveLength;
                        var top_deltaY,down_deltaY;

                        var clientWidth = $(window).width();
                        el.addEventListener('touchstart', function (e) {
                           e.preventDefault();
                        var touch = e.touches[0];
                        startPosition = {
                            x: touch.pageX,
                            y: touch.pageY
                        }
                        });
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
                       el.addEventListener('touchend', function (e) {
                            e.preventDefault();
                       if(deltaY < 0) {
                            if($(".user-personal-information").hasClass('none'))
                            {
                                $(".user-personal-information").removeClass('none');
                                $(".arrow img").removeClass("arrowdown").addClass('arrowup').attr("src","./images/arrowup.png");   
                            }
                            else
                            {
                                $(".user-personal-information").addClass('none');
                                $(".arrow img").removeClass("arrowup").addClass('arrowdown').attr("src","./images/arrowdown.png");
                                me.inforModify();
                            }

                            $('.user-list').height(H.user.$height -$('header').height()-60);
                            
                        } else if (deltaY > 0) {
                            if($(".user-personal-information").hasClass('none'))
                            {
                                $(".user-personal-information").removeClass('none');
                                $(".arrow img").removeClass("arrowdown").addClass('arrowup').attr("src","./images/arrowup.png");   
                            }
                            else
                            {
                                // $(".user-personal-information").addClass('none');
                                // $(".arrow img").removeClass("arrowup").addClass('arrowdown').attr("src","./images/arrowdown.png");
                            }
                            $('.user-list').height(H.user.$height -$('header').height()-60);
                          }
                          else
                          {
                            if($(".user-personal-information").hasClass('none'))
                            {
                                $(".user-personal-information").removeClass('none');
                                $(".arrow img").removeClass("arrowdown").addClass('arrowup').attr("src","./images/arrowup.png");   
                            }
                            else
                            {
                               
                                $(".user-personal-information").addClass('none');
                                $(".arrow img").removeClass("arrowup").addClass('arrowdown').attr("src","./images/arrowdown.png");
                                me.inforModify();
                            }
                            $('.user-list').height(H.user.$height -$('header').height()-60);
                          }
                        });
                        //头部标签start
                        top_el.addEventListener('touchstart', function (e) {
                           e.preventDefault();
                            var touch = e.touches[0];
                            startPosition = {
                                x: touch.pageX,
                                y: touch.pageY
                        }
                        });
                        top_el.addEventListener('touchmove', function (e) {
                            e.preventDefault();
                            var touch = e.touches[0];
                            endPosition = {
                                x: touch.pageX,
                                y: touch.pageY
                            }
                            top_deltaY = endPosition.y - startPosition.y;
                        });
                        top_el.addEventListener('touchend', function (e) {
                            e.preventDefault();
                            if (top_deltaY > 0) {
                                if($(".user-personal-information").hasClass('none'))
                                {
                                    $(".user-personal-information").removeClass('none');
                                    $(".arrow img").removeClass("arrowdown").addClass('arrowup').attr("src","./images/arrowup.png");   
                                }
                                else
                                {
                                    // $(".user-personal-information").addClass('none');
                                    // $(".arrow img").removeClass("arrowup").addClass('arrowdown').attr("src","./images/arrowdown.png");
                                }
                                $('.user-list').height(H.user.$height -$('header').height()-60);
                          };
                        });
                        //头部标签end
                    },
                    inforModify:function()
                    {  
                        var $mobile = $('.mobile'),
                        mobile = $.trim($mobile.val()),
                        $address = $('.address'),
                        address = $.trim($address.val()),
                        $name = $('.name'),
                        name = $.trim($name.val()),
                        $userage = $('.age'),
                         userage = $.trim($userage.val());
                         userage = userage.substring(0,userage.length-1);
                        $.ajax({
                               type : 'GET',
                               async : false,
                               url : business_url + "user/modify/"+busiAppId + "/" + openid,
                               data: {
                                    name:encodeURI(name),
                                    address:encodeURI(address),
                                    phone:mobile,
                                    age:userage
                               },
                               dataType : "jsonp",
                               jsonp : "callback",
                               complete: function() {
                               },
                               success: function(data) {
                                    
                               }
                        });
                    }
            },     
    }
    //查询用户信息
    W.callBackQueryAddressHandler = function(data)
    {
        if(data.code == 0)
        {
            H.user.userPersonalInformation.updataLoad(data.message);
        }
    }
    //修改用户信息
    W.callbackModifyUserInfoHandler =function(data)
    {
        if(data.code==0)
        {
            showTips("用户信息修改成功");
        }
    }
    //查询用户参与任务列表
    W.queryUserTaskCallBackHandler = function(data)
    {
        if(data.result){
            H.user.dataLoding.updata(data.message);
        }
        else
        {
            showTips(data.message);
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
    };
    W.QueryExchangRecordCallBackHandler =function(data)
    {
        if(data.result)
        {
             H.user.dataLoding.exchangedupdata(data.message);
        }
        else
        {
            showTips(data.message);
        }
    }

})(Zepto);
$(function()
{
    H.user.init();
     $('#money-market').click(function(e)
    {
        toUrl("index.html");
    });
})