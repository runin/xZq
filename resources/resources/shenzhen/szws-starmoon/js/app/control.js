/**
 * Created by Administrator on 2015/7/21.
 */
var winW,winH,btnrl,black,rl,rlcls,rltext,yy,st,yyinpage,yyindex,
    jj,jjdiv,jjimg,jjh4,playid,ctrl,yybj,btntouchrl,yycls,
    yyQS,yyclsQS,rlQS,rlclsQS,btntouchrlQS,stQS,blackQS;
var isload = false;
var isshow = false;
var isinjj = false;
var bkisshow = false;
$(document).ready(function () {
    winW = $(window).width();
    winH = $(window).height();
    getel();
    blindevent();
});

function getel(){
    st = $(".st");
    yyQS = document.querySelector('.yy');
    yyclsQS = document.querySelector('.yy>img');
    rlQS = document.querySelector('.rl');
    rlclsQS = document.querySelector('.rl>img');
    btntouchrlQS = document.querySelector('.ctrls-down');
    stQS = document.querySelector('.st');
    blackQS = document.querySelector('.black');
    btnrl = $(".ctrls-down>a");
    btntouchrl = $(".ctrls-down");
    black = $(".black");
    rl = $(".rl");
    rlcls = $(".rl>img");
    rltext = $(".rl>div");
    yy = $(".yy");
    yycls = $(".yy>img");
    yyindex = $(".yy-index");
    jj = $(".jj");
    jjdiv = $(".jj>div");
    jjimg = $(".jj>img");
    jjh4 =$(".jj>h4");
    yybj = $(".ctrls-up>a");
    ctrl = $(".ctrl");
    $(".box").css("height",(winW * 0.07) + "px");
    ctrl.css({"height":(winW * 0.2)+"px","width":(winW * 0.28) + "px"});
    btnrl.css({"line-height":(winW * 0.09)+"px"});
    yybj.css({"line-height":(winW * 0.09)+"px"});
}

function blindevent(){
    btntouchrl.on("click", function () {
        btntouchrl.css({"-webkit-animation":"toggle 0.8s","animation-timing-function":"linear","-webkit-animation-timing-function":"linear"})
    });
    rlcls.on("click", function () {
        hidenewLoading();
        rl.css({"-webkit-animation":"ubuntuhide 0.7s","animation-timing-function":"linear","-webkit-animation-timing-function":"linear"});
    });
    st.on("click", function () {
        st.css({"-webkit-animation":"btnpress 0.8s","animation-timing-function":"linear","-webkit-animation-timing-function":"linear"});
    });
    yycls.on("click", function () {
        isinjj = false;
        hidenewLoading();
        yy.css({"-webkit-animation":"justhide 0.7s","animation-timing-function":"linear","-webkit-animation-timing-function":"linear"});
    });
    jjimg.on("click", function () {
        jj.css("display","none");
        black.css({"-webkit-animation":"behide 0.4s","animation-timing-function":"linear","-webkit-animation-timing-function":"linear"});
    });

    blackQS.addEventListener("webkitAnimationEnd", function () {
        if(bkisshow == false){
            black.css({"-webkit-animation":""});
            jj.css("display","block");
            bkisshow = true;
        }else{
            black.css("display","none");
            black.css({"-webkit-animation":""});
            bkisshow = false;
        }
    },false);

    stQS.addEventListener("webkitAnimationEnd", function () {
        isshow = true;
        yy.css("display","block");
        yy.css({"-webkit-animation":"justshow 0.4s","animation-timing-function":"linear","-webkit-animation-timing-function":"linear"});
        st.css({"-webkit-animation":""});
    },false);

    btntouchrlQS.addEventListener("webkitAnimationEnd", function () {
        isshow = true;
        rl.css("display","block");
        black.css("display","block");
        rl.css({"-webkit-animation":"ubuntushow 0.7s","animation-timing-function":"linear","-webkit-animation-timing-function":"linear"})
        btntouchrl.css("-webkit-animation","");
    },false);

    yyQS.addEventListener("webkitAnimationEnd", function () {
        if(isinjj == false){
            if(isshow == true){
                isinjj = true;
                isshow = false;
                shownewLoading();
                applydata("api/article/list","callbackArticledetailListHandler",true);
            }else if(isshow == false){
                yy.css("display","none");
                st.css({"-webkit-animation":""});
                yycls.css({"-webkit-animation":""});
            }
        }
    },false);

    rlQS.addEventListener("webkitAnimationEnd", function () {
        if(isshow == false){
            rl.css("display","none");
            black.css("display","none");
            rl.css({"-webkit-animation":""});
            rlcls.css({"-webkit-animation":""});
        }else{
            isshow = false;
            if(isload == false){
                isload = true;
                shownewLoading();
                applydata("common/rule","callbackRuleHandler",true);
            }
        }
    },false);
}

function callbackRuleHandler(data){
    if(data.code == 0){
        hidenewLoading();
        rltext.html(data.rule) ;
    }else if(data.code == 1){
        applydata("common/rule","callbackRuleHandler",true);
    }
}

function callbackArticledetailListHandler(data){
    if(data.code == 0){
        var inr = "";
        $.each(data.arts, function (index,el) {
            var im = el.img.toString();
            inr += "<div class='yy-in-page' id="+index+" t="+el.t+" ind="+el.uid+" onclick = 'show("+index+")'><div></div><p>第"+ (index+1) +"集</p><img src="+ im +"></div>";
        });
        yyindex.html(inr);
        yyinpage = $(".yy-in-page");
        yyinpage.css({"width":(winW * 0.44)+"px","height":(winW * 0.44)+"px"});
        yyindex.scrollTop(10000);
        hidenewLoading();
    }else if(data.code == 1){
        //alert("获取剧集数据失败，请刷新页面");
    }
}
function show(t){
    //alert($('#'+t).attr("ind"));
    black.css("display","block");
    black.css({"-webkit-animation":"beshow 0.4s","animation-timing-function":"linear","-webkit-animation-timing-function":"linear"});
    var uid = $('#'+t).attr("ind");
    playid = $('#'+t).attr("t");
    shownewLoading();
    applydata("api/article/detail?uuid="+uid+"&dev=Exio","callbackArticledetailDetailHandler",false);
}

function callbackArticledetailDetailHandler(data){
    if(data.code == 0){
        jjh4.html("<p>第"+ playid +"集</p>");
        jjdiv.html(data.i);
        jjdivspan = $(".jj>div>span");
        jjdivspan.css("background","transparent !important");
        hidenewLoading();
    }else if(data.code == 1){
        applydata("api/article/detail?uuid="+uid+"&dev=Exio","callbackArticledetailDetailHandler",false);
    }
}