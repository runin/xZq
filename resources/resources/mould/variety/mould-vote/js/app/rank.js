(function($){
    H.rank = {
        playerId: getQueryString('player'),
        init : function(){
            var me = this;
            me.event();
            me.voteRank();
        },
        event: function () {
          var me = this;

        },
        voteRank: function () {
            var me = this;
            getResult('api/voteguess/pltop10', {pluids:me.playerId}, 'callbackVoteguessTop10Handler');
        }
    };
    W.callbackVoteguessTop10Handler = function (data) {
        if(data.code == 0){
            var items = data.items;
            var t = new simpleTpl();
            if(items && items.length > 0){
                var t = new simpleTpl();
                for (var i = 0; i < items.length; i ++){
                    if(items[i]){
                        var hi = items[i].hi ? items[i].hi : "images/danmu-head.jpg";
                        var name = items[i].nn ? items[i].nn : "匿名用户";
                        var vts = items[i].vts ? items[i].vts : 0;
                        if(i == 0){
                            $(".no1").find(".head").attr("src",hi);
                            $(".no1").find(".name").text(name);
                            $(".no1").find(".num").text(vts);
                            $(".no1").removeClass("opacity0");
                        }else if(i == 1){
                            $(".no2").find(".head").attr("src",hi);
                            $(".no2").find(".name").text(name);
                            $(".no2").find(".num").text(vts);
                            $(".no2").removeClass("opacity0");
                        }else if(i == 2){
                            $(".no3").find(".head").attr("src",hi);
                            $(".no3").find(".name").text(name);
                            $(".no3").find(".num").text(vts);
                            $(".no3").removeClass("opacity0");
                        }else{
                            t._('<li><span class="rk">'+(i+1)+'</span><img class="hd" src="'+hi+'"><span class="na">'+name+'</span><span class="nm">'+vts+'</span></li>');
                        }
                    }
                }
                $("#rank-list").append(t.toString());
            }
        }
    };
})(Zepto);
$(function(){
   H.rank.init();
});

