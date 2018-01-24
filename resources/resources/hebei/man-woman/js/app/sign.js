/**
 * Created by E on 2015/9/21.
 */
$(document).ready(function () {
    if(S.el.isload){
        S.init();
    }else{
        S.el.isload = true;
    }
    //S.callback.isend(1);
});
getResult('api/entryinfo/personcount',{openid:openid},'callbackActiveEntryPersoncountHandler');
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
        se.footer = $(".footer");
        S.resize();
        S.event();
    },
    el:{
        winW:"",
        winH:"",
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
        $(".issubmit").css("display","none");
        $(".submit>.btn-submit").css("left",(((S.el.winW * 0.8) - 150) * 0.5) + "px").on("click", function () {
            S.chkinfo();
        });
        $(".btn-back").on("click", function () {
            toUrl("yao.html");
        });
        S.el.plan.on("click", function () {
            S.el.ischkboxchk = false;
            if(!S.el.isout){
                if(!S.el.isani){
                    S.el.chkbox.animate({"height":"80px"},"ease-out", function () {
                        if(!S.el.isshow){
                            S.el.chkbox.html(S.el.planinfo);
                            S.el.isshow = true;
                        }
                        S.el.chkbox.children().one("click", function () {
                            var me = this;
                            if(S.el.ischkboxchk == false){
                                $(me).css("color","#0099ff");
                                if(S.el.ispickinfo.indexOf(me.innerText) == -1){
                                    S.el.ispickinfo += me.innerText+"-";
                                    S.el.ispicknum += 1;
                                    S.el.planp.text("已选择"+ S.el.ispicknum +"项");
                                }else if(S.el.ispickinfo.indexOf(me.innerText) !== -1){
                                    S.el.ispicknum = S.el.ispicknum - 1;
                                    $(me).css("color","#000000");
                                    var startpos = S.el.ispickinfo.indexOf(me.innerText);
                                    if((startpos == 0) && (S.el.ispickinfo.length == (me.innerText.length + 1))){
                                        S.el.ispickinfo = "";
                                    }else if(startpos == 0){
                                        S.el.ispickinfo = S.el.ispickinfo.substring(me.innerText.length+1);
                                    }else{
                                        var picstpos = S.el.ispickinfo.indexOf(me.innerText);
                                        var picststr = S.el.ispickinfo.substring(0,picstpos);
                                        S.el.ispickinfo = picststr + S.el.ispickinfo.substring(picstpos + me.innerText.length+1);
                                    }
                                    S.el.planp.text("已选择"+ S.el.ispicknum +"项");
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
        if(S.el.winH <= 400){
            S.el.submit.css({"top":(S.el.winH - 300) * 0.4});
        }else{
            var l = (S.el.winH - 400) * 0.5;
            S.el.submit.css({"top":(S.el.winH - 300) * 0.4});
            S.el.signdiv.css({"height":(40+( l * 0.16))+"px"});
            S.el.submit.css("height",(260+l)+"px");
        }
        S.el.footer.css("top",(S.el.winH) + "px");
    },
    chkinfo:function(){
        var se = S.el;
        se.username = $(".name").val();
        se.userage = $(".age").val();
        se.userjob = $(".job").val();
        se.usertel = $(".tel").val();
        se.usermaj = $(".maj").val();
        se.userplan = S.el.ispickinfo;
        var $age = parseInt($("input[name='age']").val(),10);
        if (S.el.username.length > 20 || S.el.username.length == 0) {
            showTips('请输入您的姓名，不要超过20字哦!');
            return false;
        }else if (!/^\d{11}$/.test(S.el.usertel)) {
            showTips('这手机号，可打不通...');
            return false;
        }else if(S.el.userjob.length < 1 || S.el.userjob.length > 30){
            showTips('请填写正确的职业');
            return false;
        }else if(!$age || $age <= 0 || $age > 200){
            showTips('请输入正确年龄!');
            return false;
        }else if(S.el.usermaj.length < 2 || S.el.usermaj.length > 30){
            showTips('请填写正确的特长');
            return false;
        }else if(S.el.userplan == ""){
            showTips('请选择计划');
            return false;
        }else{
            shownewLoading();
            getResult('api/entryinfo/save',
                {
                    openid:openid,
                    phone: S.el.usertel,
                    name: S.el.username,
                    profession: S.el.userjob,
                    age: S.el.userage,
                    address: S.el.usermaj,
                    remark: S.el.userplan
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
                $(".issubmit>p").html("报名成功，继续看节目吧");
            }else if(data == 2){
                hidenewLoading();
                S.el.winW = $(window).width();
                S.el.winH = $(window).height();
                $(".issubmit>p").html("活动尚未开始，请耐心等待");
            }
            $("body").css({"height": S.el.winH,"width": S.el.winW});
            $(".issubmit>div").css({"left":((S.el.winW - 150)*0.5)+"px","display":"block"}).on("click", function () {
                toUrl("yao.html");
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