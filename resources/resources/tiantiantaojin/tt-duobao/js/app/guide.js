/**
 * Created by E on 2015/11/10.
 */
$(document).ready(function () {
    S.guide.init();
});

S.guide = {
    init: function () {
        var me = S.guide;
        me.el.swiper_pag = $(".swiper-pagination");
        me.swinit();
        me.el.winW = $(window).width();
        me.el.winH = $(window).height();
        me.el.toIndex = $(".toindex");
        me.even();
        //me.applydata();
    },
    el:{
        swiper_pag:null,
        winW:null,
        winH:null,
        toIndex:null
    },
    applydata: function () {
        showLoading();
        getResult('indianaPeriod/myjoinperiod', {
            appId:busiAppId,
            openid:openid,
            pageSize:100
        },'indianaPeriodMyJoinPeriodCallBackHandler');
    },
    even: function () {
        S.guide.el.toIndex.one("click", function () {
            toUrl("../../index.html");
        });
    },
    swinit: function () {
        var swiper = new Swiper('.swiper-container', {
            pagination: '.swiper-pagination',
            paginationClickable: true,
            //effect : 'coverflow',
            paginationBulletRender: function (index, className) {
                //var pname = null;
                //if(index == 0){
                //    pname = "全部";
                //}else if(index == 1){
                //    pname = "进行中";
                //}else{
                //    pname = "已揭晓";
                //}
                return '<span class="' + className + '"></span>';
            }
        });
    }
};

function indianaPeriodMyJoinPeriodCallBackHandler(data){
    hideLoading();
    if(data.result == true){
        S.guide.el.allInfo = data;
        S.guide.info(data);
    }else{

    }
}