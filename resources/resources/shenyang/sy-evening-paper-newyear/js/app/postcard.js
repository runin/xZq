(function($) {
    H.postcard = {
        ruid: getQueryString("ruid"),
        cu: getQueryString("cu"),
        sn:null,
        init: function() {
            var me = this;
            me.event();
            me.cardList();
            if(me.cu !== ""){
                getResult("api/ceremony/greetingcard/get",{
                    cu:me.cu
                },"callbackCardInfoHandler",true);
            }
        },
        event: function(){
            $('.back-btn').click(function(e){
                e.preventDefault();
                H.postcard.btn_animate($(this));
                toUrl('index.html');
            });
        },
        btn_animate: function(str){
            str.addClass('flipInY');
            setTimeout(function(){
                str.removeClass('flipInY');
            },200);
        },
        cardList: function(){
            var items = infoData.gitems;
            var t = simpleTpl();
            for(var i = 0;i < items.length;i++){
                t._('<li id="'+items[i].uid+'" data-t="'+ items[i].t +'" data-info="'+ items[i].info +'">')
                    ._('<img class="fr" src="'+items[i].ib+'">')
                    ._('<div class="ron">')
                    ._('<p class="to">To:<input disabled="disabled" type="text"></p>')
                    ._('<textarea disabled="disabled" type="text">在明信片相应位置点击即可填写</textarea>')
                    ._('<p class="from">From:<input disabled="disabled" type="text"></p>')
                    ._('</div>')
                    ._('</li>');
            }
            $(".content").html(t.toString());
            $("li").click(function(){
                var img = $(this).find("img").attr("src"),
                    uid = $(this).attr("id"),
                    t = $(this).attr("data-t"),
                    info = $(this).attr("data-info");
                H.postcard.sn = parseInt(uid)-1;
                H.dialog.postcard.open(img, uid, t, info);
            });
        }
    };

})(Zepto);

$(function(){
    H.postcard.init();
    H.dialog.init();
});


(function($) {
    H.dialog = {
        $container: $('body'),
        REQUEST_CLS: 'requesting',
        isLotteryDialog: false,
        uid: '',
        wa: '',
        cu:"",
        init: function() {
            var me = this;
            this.$container.delegate('.btn-close', 'click', function(e) {
                e.preventDefault();
                H.dialog.btn_animate($(this));
                $('.dialog').removeClass('bounceInDown').addClass('bounceOutUp');
                setTimeout(function(){
                    $('.modal').addClass('none');
                    $('.dialog').addClass('none');
                    if(H.dialog.isLotteryDialog){
                        H.dialog.lottery.close_lottery();
                        H.dialog.isLotteryDialog = false;
                    }
                },1300);

            });
        },
        close: function() {
            $('.modal').addClass('none');
        },
        open: function() {
            H.dialog.close();
            if (this.$dialog) {
                this.$dialog.removeClass('none');
            } else {
                this.$dialog = $(this.tpl());
                H.dialog.$container.append(this.$dialog);
            }

            H.dialog.relocate();
        },
        relocate: function() {
            var height = $(window).height(),
                width = $(window).width(),
                top = $(window).scrollTop() + height * 0.06;

            $('.modal').each(function() {
                $(this).css({ 'width': width, 'height': height }).find('.btn-close').css({'right': width * 0.10 -15, 'top': height * 0.16 -15})
            });
            $('.dialog').each(function() {
                if ($(this).hasClass('relocated')) {
                    return;
                }
                $(this).css({
                    'width': width * 0.80,
                    'height': height * 0.68,
                    'left': width * 0.1,
                    'right': width * 0.1,
                    'top': height * 0.16,
                    'bottom': height * 0.16
                });
                var $box = $(this).find('.box');
                if ($box.length > 0) {
                    $box.css('height', height * 0.38);
                }
            });
        },
        btn_animate: function(str){
            str.addClass('flipInY');
            setTimeout(function(){
                str.removeClass('flipInY');
            },200);
        },
        postcard: {
            $dialog: null,
            img:null,
            uid:null,
            t:null,
            info:null,
            open: function(img, uid, t, info) {
                this.img = img;
                this.uid = uid;
                this.t = t;
                this.info = info;
                H.dialog.open.call(this);
                this.event();
                var height = $(window).height(),
                    width = $(window).width();
                $(".postcard-dialog").css({
                    'width': width * 0.95,
                    'height': height * 0.70,
                    'left': width * 0.025,
                    'right': width * 0.025,
                    'top': height * 0.15,
                    'bottom': height * 0.15
                });
                $('html').bind("touchmove",function(e){
                    e.preventDefault();
                });
            },
            close: function() {
                this.$dialog && this.$dialog.addClass('none');
                this.$dialog.remove();
                this.$dialog = null;
                $('html').unbind("touchmove");
            },
            event: function() {
                var me = this;
                this.$dialog.find('#btn-close').click(function(e) {
                    e.preventDefault();
                    me.close();
                });
                this.$dialog.find('#btn-send').click(function(e) {
                    e.preventDefault();
                    if(me.check()){
                        var to = $(".to-in").val(),
                            con= $(".con-in").val(),
                            from = $(".from-in").val();
                        getResult("api/ceremony/greetingcard/make",{
                            oi: openid,
                            vi: to,
                            gt: encodeURIComponent(con),
                            nn: from,
                            sn:H.postcard.sn
                        },"callbackMakeCardHandler",true);
                    }
                });

            },
            check: function(){
                var $to = $(".ron").find(".to-in"),
                    $con = $(".ron").find(".con-in"),
                    $from = $(".ron").find(".from-in");
                var to = $to.val(),
                    con = $con.val(),
                    from = $from.val();
                if(to.length == 0 || to.length > 10){
                    showTips('请填写您要发送的人，不超过10个字哦！',4);
                    $to.focus();
                    return false;
                }
                if(con.length == 0 || con.length > 50){
                    showTips('请填写您的祝福，不超过50个字哦！',4);
                    $con.focus();
                    return false;
                }
                if(from.length == 0 || from.length > 10){
                    showTips('请填写您的姓名，不超过10个字哦！',4);
                    $from.focus();
                    return false;
                }
                return true;
            },
            tpl: function() {
                var t = simpleTpl();
                t._('<section class="modal" id="rank-dialog">')
                    ._('<div class="dialog postcard-dialog">')
                    ._('<p class="tip">我要给你寄张明信片，就躺在你家门口的信箱里。</p>')
                    ._('<div class="content">')
                    ._('<img class="fr" src="'+this.img+'">')
                    ._('<div class="ron">')
                    ._('<p class="to">To:<input class="to-in" type="text"></p>')
                    ._('<textarea class="con-in" type="text"></textarea>')
                    ._('<p class="from">From:<input class="from-in" type="text"></p>')
                    ._('</div>')
                    ._('</div>')
                    ._('<p class="tip" id="send-tips">在明信片相应位置点击即可填写。</p>')
                    ._('<a class="btn-send" id="btn-send" data-collect="true" data-collect-flag="syrj-tour-postcard-sendbtn" data-collect-desc="明信片弹层-发送按钮">发送</a>')
                    ._('<a class="btn-send none" id="btn-close" data-collect="true" data-collect-flag="syrj-tour-postcard-closebtn" data-collect-desc="明信片弹层-关闭按钮">关闭</a>')
                    ._('</div>')
                    ._('</section>');
                return t.toString();
            },
            update: function(data){
                var to = data.vi,
                    con = data.gt,
                    from = data.nn;
                $(".to-in").val(to);
                $(".con-in").val(con);
                $(".from-in").val(from);
                $("#btn-send").addClass("none");
                $("#btn-close").html("我也要玩");
                $("#btn-close").removeClass("none");
                this.$dialog.find(".tip").addClass("none");
                this.$dialog.find("input").attr("disabled","disabled");
                this.$dialog.find("textarea").attr("disabled","disabled");
                this.$dialog.find("textarea").addClass("border-no");
            }
        }
    };


    W.callbackMakeCardHandler = function(data) {
        if (data.result) {
            $("#btn-send").addClass("none");
            $("#btn-close").removeClass("none");
            $("#send-tips").html("想送给谁？右上角单击试试。");
            H.dialog.cu = data.cu;
        }
        //H.dialog.cu = "asdasdasd";
    };
    W.callbackCardInfoHandler = function(data) {
        if (data.result) {
            $("#btn-send").addClass("none");
            $("#btn-close").removeClass("none");
            $("#send-tips").html("想送给谁？右上角单击试试。");
            var sn = infoData.gitems[parseInt(data.sn)];
            H.dialog.postcard.open(sn.ib, sn.uid, sn.t, sn.info);
            H.dialog.postcard.update(data);
        }
    };

})(Zepto);


var infoData = {
    "gitems": [
        {
            "uid": "1",
            "t": "",
            "info": "",
            "is": "",
            "ib": "images/m1.jpg",
            "mu": ""
        },
        {
            "uid": "2",
            "t": "",
            "info": "",
            "is": "",
            "ib": "images/m2.jpg",
            "mu": ""
        },
        {
            "uid": "4",
            "t": "",
            "info": "",
            "is": "",
            "ib": "images/m4.jpg",
            "mu": ""
        },
        {
            "uid": "5",
            "t": "",
            "info": "",
            "is": "",
            "ib": "images/m5.jpg",
            "mu": ""
        },
        {
            "uid": "6",
            "t": "",
            "info": "",
            "is": "",
            "ib": "images/m6.jpg",
            "mu": ""
        },
        {
            "uid": "7",
            "t": "",
            "info": "",
            "is": "",
            "ib": "images/m7.jpg",
            "mu": ""
        }
    ]
};