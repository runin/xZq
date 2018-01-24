(function($){
    H.index = {
        $btnReserve: $('#btn-reserve'),
        init: function(){
            this.event();
            this.gg();
            this.prereserve();
        },
        prereserve: function() {
            var me = this;
            $.ajax({
                type : 'GET',
                async : true,
                url : domain_url + 'api/program/reserve/get'+dev,
                data: {},
                dataType : "jsonp",
                jsonpCallback : 'callbackProgramReserveHandler',
                success : function(data) {
                    if (!data.reserveId) {
                        return;
                    }
                    window['shaketv'] && shaketv.preReserve_v2({
                            tvid:yao_tv_id,
                            reserveid:data.reserveId,
                            date:data.date},
                        function(resp){
                            if (resp.errorCode == 0) {
                                me.$btnReserve.removeClass('none').attr('data-reserveid', data.reserveId).attr('data-date', data.date);
                            }
                        });
                }
            });
        },
        loadImg: function(items){
            var imgsDeafult = [
                "images/going.png"
            ];
            var imgs = imgsDeafult.concat(items.split(','));
            loadImg = function () {
                for (var i = 0; i < imgs.length; i++) {//图片预加载
                    var img = new Image();
                    img.style = "display:none";
                    img.src = imgs[i];
                    img.onload = function () {
                        $("body").animate({'opacity':'1'}, 100);
                    }
                }
            };
            loadImg();
        },
        resize: function(){
          var w_Hegiht = $(window).height(),
              f_Height = $("footer").height();
           /* $(".item").css({
                "height": w_Hegiht*0.75-f_Height
            });*/

        },
        event: function(){
            var me = this;
            $(".go").tap(function(e){
                e.preventDefault();
                $(this).find("img").attr("src","images/going.png");
                me.btn_animate($(this));
                if(!$(this).hasClass('requesting')){
                    $(this).addClass('requesting');
                    toUrl('answer.html');
                }
            });
            me.$btnReserve.click(function(e) {
                e.preventDefault();
                $(this).find(".yy").addClass("rotate");
                var reserveId = $(this).attr('data-reserveid');
                var date = $(this).attr('data-date');
                if (!reserveId || !date) {
                    return;
                };
                window['shaketv'] && shaketv.reserve_v2({
                        tvid:yao_tv_id,
                        reserveid:reserveId,
                        date:date},
                    function(d){
                        if(d.errorCode == 0){
                            H.index.$btnReserve.addClass('none');
                        }
                    });
            });
        },
        gg: function(){
            getResult('api/linesdiy/info',{},'callbackLinesDiyInfoHandler');
        },
        btn_animate: function(str){
            str.addClass('flipInY');
            setTimeout(function(){
                str.removeClass('flipInY');
            },150);
        }
    };
    W.callbackLinesDiyInfoHandler = function(data){
        //is:小图
        //ib:大图
        var me = H.index;
        if(data.code == 0){
            $(".tv-img div img").attr("src",data.gitems[0].ib);
            $("footer img.name").attr("src",data.gitems[0].is);
            me.loadImg(data.gitems[0].ib + ',' + data.gitems[0].is);
            me.resize();
        }else{
            $(".tlt").attr("src","images/tlt.png");
        }
    }
})(Zepto);
$(function(){
    H.index.init();
});
