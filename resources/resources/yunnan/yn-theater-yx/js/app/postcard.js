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
                    //._('<p class="to">To:<input disabled="disabled" type="text"></p>')
                    ._('<textarea placeholder="点击此处编辑祝福" type="text"></textarea>')
                    //._('<p class="from">From:<input disabled="disabled" type="text"></p>')
                    ._('<a class="btn-send" id="btn-send" data-collect="true" data-collect-flag="card-send" data-collect-desc="发送贺卡"></a>')
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
        },
        close: function() {
        },
        open: function() {
        },
        relocate: function() {
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
                this.event();
                $('html').bind("touchmove",function(e){
                    e.preventDefault();
                });
            },
            close: function() {
            },
            event: function() {
                var me = this;
                $('#btn-send').click(function(e) {
                    e.preventDefault();
                    if(me.check()){
                        var con= $(".con-in").val();
                        getResult("api/ceremony/greetingcard/make",{
                            oi: openid,
                            vi: "1",
                            gt: encodeURIComponent(con),
                            nn: "1",
                            sn:H.postcard.sn
                        },"callbackMakeCardHandler",true);
                    }
                });
            },
            check: function(){
                var $con = $(".ron").find(".con-in");
                var con = $con.val();
                //if(to.length == 0 || to.length > 10){
                //    showTips('请填写您要发送的人，不超过10个字哦！',4);
                //    $to.focus();
                //    return false;
                //}
                if(con.length == 0 || con.length > 50){
                    showTips('请填写您的祝福，不超过50个字哦！',4);
                    $con.focus();
                    return false;
                }
                //if(from.length == 0 || from.length > 10){
                //    showTips('请填写您的姓名，不超过10个字哦！',4);
                //    $from.focus();
                //    return false;
                //}
                return true;
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
            "ib": "images/m1.png",
            "mu": ""
        }
        //{
        //    "uid": "2",
        //    "t": "",
        //    "info": "",
        //    "is": "",
        //    "ib": "images/m2.jpg",
        //    "mu": ""
        //},
        //{
        //    "uid": "4",
        //    "t": "",
        //    "info": "",
        //    "is": "",
        //    "ib": "images/m4.jpg",
        //    "mu": ""
        //},
        //{
        //    "uid": "5",
        //    "t": "",
        //    "info": "",
        //    "is": "",
        //    "ib": "images/m5.jpg",
        //    "mu": ""
        //},
        //{
        //    "uid": "6",
        //    "t": "",
        //    "info": "",
        //    "is": "",
        //    "ib": "images/m6.jpg",
        //    "mu": ""
        //},
        //{
        //    "uid": "7",
        //    "t": "",
        //    "info": "",
        //    "is": "",
        //    "ib": "images/m7.jpg",
        //    "mu": ""
        //}
    ]
};