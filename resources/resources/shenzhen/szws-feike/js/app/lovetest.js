
(function($) {
    H.question = {
        $textb:$(".yao-cool-tips"),
        $nav_middle:$(".nav-middle"),
        $nav_left:$(".nav-left"),
        qitems:null,
        item_index:0,
        auid:null,
        headImg:headimgurl ? headimgurl + '/' + yao_avatar_size : "images/head.png",
        nowTop:0,
        init: function() {
            var me = this;
            me.event();
            me.questionList();
        },
      
        event: function() {
            var me = this;
            me.$nav_middle.click(function(e) {
                e.preventDefault();
                toUrl('timebuy.html');
            });
            me.$nav_left.click(function(e) {
                e.preventDefault();
                toUrl('yaoyiyao.html');
            });
            
        },
        questionList: function(){
            getResult("api/question/info",{yoi:openid},"callbackQuestionInfoHandler",true);
        },
        initQuestion: function(){
            var me = this;
            $(".title").removeClass("none");
            $(".ball").removeClass("none");
            setTimeout(function(){
                $("#defaultTit").removeClass("none");
            },1000);
            setTimeout(function(){
                $(".content").append(me.questionTpl(me.qitems[0]));
                me.bindClick(me.qitems[0].quid);
            },2000);
        },
        bindClick: function(data){
            $("#"+data).find(".ritem").click(function(){
                if($(this).hasClass("checked")){
                    return;
                }
                $(this).addClass("gray");
                $(this).parent().find("li").addClass("checked");
                var auid = $(this).attr("data-uuid");
                H.question.auid = auid;
                H.question.nowTop = $('body').height();
                $(".content").append(H.question.checkTpl($(this).text()));
                $('body').scrollTop(H.question.nowTop,$('body').height());
                if(H.question.qitems.length > H.question.item_index){
                    setTimeout(function(){
                        var cont = H.question.repTpl($("#"+ H.question.auid).html());
                        H.question.nowTop = $('body').height();
                        $(".content").append(cont);
                        $('body').scrollTop(H.question.nowTop,$('body').height());
                        setTimeout(function(){
                            H.question.nowTop = $('body').height();
                            $(".content").append(H.question.questionTpl(H.question.qitems[H.question.item_index]));
                            $('body').scrollTop(H.question.nowTop,$('body').height());
                            H.question.bindClick(H.question.qitems[H.question.item_index-1].quid);
                        },1000);
                    },1000);
                }else if(H.question.qitems.length == H.question.item_index){
                    setTimeout(function(){
                        H.question.nowTop = $('body').height();
                        var cont = H.question.resultTpl();
                        $(".content").append(cont);
                        $('body').scrollTop(H.question.nowTop,$('body').height());
                    },1000);
                }
            });
        },
        questionTpl:function(data){
            var t = new simpleTpl();
            t._('<li id="'+data.quid+'" class="fadeInDown">')
                ._('<img class="fl" src="images/head.png">')
                ._('<span class="triangle-top"></span>')
                ._('<div class="question">')
                    ._('<span class="tile">'+data.qt+'</span>')
                    ._('<ul>');
                    var ritems = data.ritems;
                    if(ritems){
                        for(var i =0;i<ritems.length;i++){
                            t._('<li class="ritem" data-uuid="'+ritems[i].ruid+'">'+ritems[i].rt+'</li>')
                            ._('<span class="none" id="'+ritems[i].ruid+'">'+ritems[i].rrc+'</span>');
                        }
                    }
                    t._('</ul>')
                ._('</div>')
            ._('</li>');
            H.question.item_index ++;
            return t.toString();
        },
        resultTpl:function(){
            var t = new simpleTpl();
            t._('<li class="fadeInLeft">')
                ._('<img class="fl" src="images/head.png">')
                ._('<span class="triangle"></span>')
                ._('<div class="article fl">哟呵，不错嘛，对爹地还可以嘛！快到飞科商城给爹地挑一款合适的剃须刀孝敬孝敬吧！</div>')
            ._('</li>')
            ._('<li class="opacity">')
                ._('<a href="http://m.flyco.com" class="go-btn" data-collect="true" data-collect-flag="question-linebtn" data-collect-desc="测试页-线路按钮">现在就去GO</a>')
            ._('</li>');
            return t.toString();
            // $('.content').scrollTop(9999);
        },
        checkTpl:function(data){
            var t = new simpleTpl();
            t._('<li class="fadeInRight">')
                ._('<img class="fr" src="'+ H.question.headImg+'">')
                ._('<span class="triangle-right"></span>')
                ._('<div class="article-right fr">'+data+'</div>')
                ._('</li>');
            return t.toString();
        },
        repTpl:function(data){
            var t = new simpleTpl();
            t._('<li class="fadeInLeft">')
                ._('<img class="fl" src="images/head.png">')
                ._('<span class="triangle"></span>')
                ._('<div class="article fl">'+data+'</div>')
                ._('</li>');
            return t.toString();
        }
    };

    W.callbackQuestionInfoHandler = function(data){
        if(data.code == 0){
            var qitems = data.qitems;
            if(qitems){
                H.question.qitems = qitems;
                H.question.initQuestion();
            }
        }
        else
        {
            showTips("暂无活动");
        }
    };
   
})(Zepto);
$(function() {
    //shownewLoading();
    H.question.init();
    
   
});