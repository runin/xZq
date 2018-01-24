/**
 * Created by E on 2015/9/21.
 */
$(document).ready(function () {
    //alert(openid);
    getResult('api/entryinfo/personcount',{openid:openid},'callbackActiveEntryPersoncountHandler');
    if(S.el.isload){
        S.init();
    }else{
        S.el.isload = true;
    }
    //S.callback.isend(1);
});
var S = {
    init : function () {
        var se = S.el;
        se.winW = $(window).width();
        se.winH = $(window).height();
        se.plan = $(".plan");
        se.planp = $(".plan>p");
        se.submit = $(".submit");
        se.signdiv = $(".sign>div");
        se.chkbox = $(".chkbox");
        se.footer = $(".follow-box");
        se.btnboy = $(".btn-boy");
        se.btngirl = $(".btn-girl");
        se.chs = $(".chs");
        se.chsw = $(".chs>.chs-watch");
        se.chsj = $(".chs>.chs-join");
        se.chss = $(".chs>.chs-sign");
        S.resize();
        S.event();
    },
    el:{
        winW:"",
        winH:"",
        chs:"",
        chsw:"",
        chsj:"",
        chss:"",
        plan:"",
        planp:"",
        submit:"",
        signdiv:"",
        chkbox:"",
        username:"",
        userage:"",
        userjob:"",
        usertel:"",
        usermaj:"",
        userplan:"",
        planinfo:"",
        ispickinfo:"",
        footer:"",
        btnboy:"",
        btngirl:"",
        sex:"",
        joininfo:"",
        ispickobj:"",
        ispicknum:0,
        ischk:false,
        isload:false,
        isani:false,
        isout:false,
        isshow:false,
        ischkboxchk:false,
        delayask:5000
    },
    event: function () {
        S.el.submit.css("opacity","1");
        S.el.chs.removeClass("none");
        $(".issubmit").css("display","none");
        $(".sign>.btn-submit").css("left",(((S.el.winW * 0.8) - 150) * 0.5) + "px").on("click", function () {
            S.chkinfo();
        });
        $(".btn-back").on("click", function () {
            toUrl("talk.html");
        });
        S.el.btnboy.on("click", function () {
            S.el.sex = 1;
        });
        S.el.btngirl.on("click", function () {
            S.el.sex = 2;
        });
        S.el.chsw.on("click", function () {
            if(S.el.joininfo == ""){
                $(".chs-watch span").css("opacity","1");
                S.el.joininfo = "现场观众";
            }else if(S.el.joininfo == "参加节目"){
                $(".chs-watch span").css("opacity","1");
                $(".chs-join span").css("opacity","0");
                S.el.joininfo = "现场观众";
            }
        });
        S.el.chsj.on("click", function () {
            if(S.el.joininfo == ""){
                $(".chs-join span").css("opacity","1");
                S.el.joininfo = "参加节目";
            }else if(S.el.joininfo == "现场观众"){
                $(".chs-join span").css("opacity","1");
                $(".chs-watch span").css("opacity","0");
                S.el.joininfo = "参加节目";
            }
        });
        S.el.chss.on("click", function () {
            if(S.el.joininfo == ""){
                showTips("请选择参与方式");
            }else{
                S.el.chs.css("display","none");
                S.el.submit.removeClass("none");
            }
        });
        S.el.plan.on("click", function () {
            S.el.ischkboxchk = false;
            if(!S.el.isout){
                if(!S.el.isani){
                    S.el.chkbox.animate({"height":"80px"},"ease-out", function () {
                        if(!S.el.isshow){
                            S.el.isshow = true;
                        }
                        S.el.chkbox.children().one("click", function () {
                            var me = this;
                            if(S.el.ischkboxchk == false){
                                if($(me) == S.el.ispickobj){

                                }else{
                                    if(S.el.ispickobj == ""){

                                    }else{
                                        S.el.ispickobj.css("color","#000000");
                                    }
                                    $(me).css("color","#0099ff");
                                    S.el.ispickobj = $(me);
                                }
                                if(S.el.ispickinfo.indexOf(me.innerText) == -1){
                                    S.el.ispickinfo = me.innerText;
                                    S.el.planp.text(me.innerText);
                                }else if(S.el.ispickinfo.indexOf(me.innerText) !== -1){

                                }
                                S.el.ischkboxchk = true;
                            }
                        });
                        S.el.isout = true;
                        S.el.isani = false;
                    })
                }
                S.el.isani = true;
            }
            if(S.el.isout){
                if(!S.el.isani){
                    S.el.chkbox.animate({"height":"0px"},"ease-out", function () {
                        S.el.isout = false;
                        S.el.isani = false;
                    })
                }
                S.el.isani = true;
            }
        });
    },
    resize: function () {
        $("body").css({"height": S.el.winH,"width": S.el.winW});
        S.el.chs.css("top",(S.el.winH-300)*0.5 + "px");
        if(S.el.winH <= 400){
            S.el.submit.css({"top":(S.el.winH - 280) * 0.4});
        }else{
            var l = (S.el.winH - 400) * 0.5;
            S.el.submit.css({"top":(S.el.winH - 280) * 0.4});
            S.el.signdiv.css({"height":(40+( l * 0.16))+"px"});
            $(".sign>.btn-submit").css({"bottom":-(20+( l * 0.6))+"px"});
            S.el.submit.css("height",(280+l)+"px");
        }
        S.el.footer.css("top",(S.el.winH - 30) + "px");
    },
    chkinfo:function(){
        S.el.username = $(".name").val();
        S.el.userage = $(".age").val();
        S.el.usertel = $(".tel").val();
        //S.el.userjob = $(".job").val();
        S.el.userplan = S.el.ispickinfo;
        var $age = parseInt($("input[name='age']").val(),10);
        if (S.el.username.length > 20 || S.el.username.length == 0) {
            showTips('请输入您的姓名，不要超过20字哦!');
            return false;
        }else if (S.el.sex == "") {
            showTips('请选择性别');
            return false;
        }
        //else if(S.el.userjob.length < 1 || S.el.userjob.length > 30){
        //    showTips('请填写正确的职业');
        //    return false;
        //}
        else if(!/^\d{11}$/.test(S.el.usertel)){
            showTips('请填写正确的电话号码');
            return false;
        }else if(!$age || $age <= 0 || $age > 200){
            showTips('请输入正确年龄!');
            return false;
        }else if(S.el.joininfo == ""){
            showTips('请选择参与方式!');
            return false;
        }else if(S.el.userplan == ""){
            showTips('请选择城市');
            return false;
        }else{
            shownewLoading();
            getResult('api/entryinfo/asyncsave',
                {
                    openid:openid,
                    phone: S.el.usertel,
                    name: S.el.username,
                    sex: S.el.sex,
                    //profession: S.el.userjob,
                    age: S.el.userage,
                    address:S.el.userplan,
                    remark: S.el.joininfo
                },'callbackActiveEntryInfoSaveHandler');
        }
    },
    callback:{
        info: function (data) {

        },
        isend: function (data) {
            $(".issubmit").css("display","block");
            $(".submit").css("display","none");
            if(data == 1){
                S.el.winW = $(window).width();
                S.el.winH = $(window).height();
                hidenewLoading();
                $(".issubmit>p").html("提交失败了~ 再试一次吧");
            }else if(data == 0){
                hidenewLoading();
                S.el.winW = $(window).width();
                S.el.winH = $(window).height();
                $(".issubmit>p").html("报名成功，继续看节目吧");
            }else if(data == 2){
                hidenewLoading();
                S.el.winW = $(window).width();
                S.el.winH = $(window).height();
                $(".issubmit>p").html("活动尚未开始，请耐心等待");
            }
            $("body").css({"height": S.el.winH,"width": S.el.winW});
            $(".issubmit>div").css({"left":((S.el.winW - 150)*0.5)+"px","display":"block"}).on("click", function () {
                toUrl("index.html");
            });
        }
    }
};

function callbackActiveEntryPersoncountHandler(data){
    if(data.code == 0){
        if(data.result){
            S.callback.isend(0);
        }else{
            getResult('api/entryinfo/info',{},'callbackActiveEntryInfoHandler');
        }
    }else{
        S.callback.isend(2);
    }
}

function callbackActiveEntryInfoHandler(data){
    if(data.code == 0){
        S.el.planinfo = data.d;
        if(S.el.isload){
            S.init();
        }else{
            S.el.isload = true;
        }
    }else{
        hidenewLoading();
        S.callback.isend(2);
    }
}

function callbackActiveEntryInfoSaveHandler(data){
    if(data.code == 0){
        hidenewLoading();
        S.callback.isend(0);
    }else{
        hidenewLoading();
        S.callback.isend(1);
    }
}