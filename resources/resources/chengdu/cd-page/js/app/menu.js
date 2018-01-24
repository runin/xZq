(function($) {
    var classId = {
        $nickname: $("#nickname"),
        $headimg: $(".head-url"),
        $myGold: $(".my-gold"),
        $orderBox: $(".order-box"),
        $swiperData: $("#swiper-data"),
        $bgBlur: $(".bg-blur"),
        $srcimg: $("#srcimg"),
        $canvas: $("#canvas"),
        $canvasShow: $("#canvas-show"),
        $headLogo: $(".head_logo"),
        $footBtn: $(".foot-btn"),
        $fBtn: $(".f-btn"),
        $signglBtn: "signgl-btn",
        $programBtn: "program-btn",
        $mallBtn: "mall-btn",
    };

    H.index = {
        $hdtime: [], //互动开始时间
        $edtime: [], //互动结束时间
        $nowtime: null, //系统当前时间
        $tvid: [], //预约vid
        $reserveid: [],
        $datetime: [],
        $other: "",
        $commentBtn: $("#comment-btn"),
        listData: null,
        isBgChanging: false,
        curBgIndex: null,

        init: function() {
            this.nowtimtFn();
            this.eventHander();
        },
        eventHander: function() {
            this.$commentBtn.on("click", function() {
                toUrl("./comment.html");
            })

        },
        nowtimtFn: function() { //查询当前系统时间
            getResult('api/common/time', {}, 'commonApiTimeHandler');
        },
        getTimeImgFn: function() { //节目管理(首页滚动图片)
            getResult('api/recommendpro/programlist', {}, 'callbackApiRedProlistHandler');
        },
        //--------------------预约部分------------------------//
        changeSileFn: function(index) { //获取滚动图片的第几个
            var reserveid = H.index.$reserveid[index];
            if (reserveid == "not" || $(".btnbox" + index).hasClass("reserved")) {
                classId.$orderBox.addClass("none");
                return;
            } else {
                classId.$orderBox.removeClass("none");
                classId.$orderBox.find("p").eq(index).removeClass("none").siblings().addClass("none");
            }

        },
        downTimeFn: function(index) {
            function endFn(i) {
                $("#uid" + i).click(function() {
                    if ($(this).attr("data-url")) {
                        showLoading(null, '跳转中');
                        window.location.href = $(this).attr("data-url");
                    }
                });
                $(".btnbox" + i).addClass("none");
            }

            function startFn(i) {
                $("#uid" + i).click(function() {
                    toUrl("./singletvdetail.html?uid=" + i);
                });
            }
            H.index.changeSileFn(index); //获取滚动图片的第几个
            var timeArr = [];
            var sctm = H.index.$nowtime; //系统时间
            var hst, het;
            var sarray = H.index.$hdtime;
            var earray = H.index.$edtime;

            if (sarray[index] == "not" || H.index.$reserveid[index] == "not") {
                return;
            }

            // var s = $(sarray[index]).text();
            // var sa = s.substr(0, 8);
            // var ea = s.substr(9, 8);
            var sa = sarray[index];
            var ea = earray[index];
            var dateNow = timeTransform(new Date().getTime());
            var startTime = dateNow.substr(0, 11) + sa;
            var endTime = dateNow.substr(0, 11) + ea;
            if (comptime(startTime, sctm) > 0 && comptime(sctm, endTime) > 0) {
                endFn(index);
            } else {
                startFn(index);
            }

        },
        bespeakFn: function(i) { //预约活动请求
            var me = this;
            var leg = this.$reserveid.length;
            var reserveid = H.index.$reserveid[i];
            var date = H.index.$datetime[i];
                    console.log(i + '' + leg);
            if (reserveid != "not") {
                window['shaketv'] && shaketv.preReserve_v2({ tvid: yao_tv_id, reserveid: reserveid, date: date }, function(resp) {
                    if (resp.errorCode == -1007) { //已经预约过的
                        $(".btnbox" + i).addClass("none");
                        $(".btnbox" + i).addClass("reserved");
                        H.index.downTimeFn(0);

                    } else if (resp.errorCode == 0) {
                        $(".btnbox" + i).removeClass("none");
                        H.index.downTimeFn(0);
                    }
                    
                    if(i<leg-1) me.bespeakFn(++i);
                });
            } else {
                H.index.downTimeFn(0);
                if(i<leg-1) me.bespeakFn(++i);
            }
            this.reserveFn();
        },

        reserveFn: function() { //点击预约
            $("body").delegate(".btn-order1", "click", function(e) {
                e.preventDefault();
                if ($(this).hasClass("grey")) {
                    return;
                }
                var id = $(this).attr("id");
                var reserveid = H.index.$reserveid[id];
                var date = H.index.$datetime[id];
                if (!reserveid) {
                    return;
                }
                //shaketv.reserve_v2({tvid:10048, reserveid:155370, date:20151120},function(data) {
                shaketv.reserve_v2({ tvid: yao_tv_id, reserveid: reserveid, date: date }, function(data) {
                    if (data.errorCode == 0 || data.errorCode == -1007) { //预约成功回调
                        $(".btnbox" + id).addClass("none"); //隐藏按钮
                        $(".btnbox" + id).addClass("reserved");
                    }
                });
            });
        },
        hrefFn: function() { //广告跳转
            $(".swiper-slide").click(function() {
                if ($(this).attr("data-href")) {
                    showLoading(null, '跳转中');
                    window.location.href = $(this).attr("data-href");
                } else {
                    var i = $(this).attr("id").substr(3, 1);
                    toUrl("./singletvdetail.html?uid=" + i);
                }
            });
        }
    };
    W.callbackApiRedProlistHandler = function(data) { //首页滚动图
        showLoading();
        if (data && data.code == 0) {
            $(".swiper-button-white").removeClass("none");
            H.index.listData = data.items;

            var items = data.items;
            var t = simpleTpl();
            var p = simpleTpl();
            // 录播点
            // if (items.length > 1) {
            //     $(".pagination").removeClass("none");
            // }
            for (var k = 0, leg = items.length; k < leg; k++) {

                if (items[k].pd) {
                    t._('<div class="swiper-slide" data-url="' + items[k].url + '" id="uid' + k + '" style="background-image:url(' + items[k].is + ')">');
                    H.index.$hdtime.push(items[k].pbt); //每个互动时间
                    H.index.$edtime.push(items[k].pet); //每个结束互动时间
                } else {
                    t._('<div class="swiper-slide" id="uid' + k + '" data-href="' + items[k].gourl + '" style="background-image:url(' + items[k].is + ')">');
                    H.index.$hdtime.push("not"); //广告没时间
                    H.index.$edtime.push("not"); //广告没时间
                }
                t._('</div>');
                p._('<p class="btnbox btnbox' + k + ' none">');
                p._('<a href="javascript:void(0)" class="btn-order1 bespeak' + k + '" id="' + k + '">预约节目</a>');
                //p._('<a href="' + items[k].gourl + '" id="interact' + k + '" class="btn-order1 none">进入互动</a>');
                p._('</p>');
                if (items[k].reserveId && items[k].date) { //假如存在预约
                    H.index.$tvid.push(items[k].rds); //节目tvid
                    H.index.$reserveid.push(items[k].reserveId); //业务reserveid
                    H.index.$datetime.push(items[k].date); //预约时间
                } else {
                    H.index.$tvid.push("not"); //节目tvid
                    H.index.$reserveid.push("not"); //业务reserveid
                    H.index.$datetime.push("not"); //预约时间
                }
            }


            classId.$swiperData.empty().append(t.toString());
            classId.$orderBox.empty().append(p.toString());

            H.index.bespeakFn(0); //预约请求


            H.index.hrefFn(); //广告跳转

            var mySwiper = new Swiper('.swiper-container', {
                //pagination: '.pagination',
                grabCursor: true,
                nextButton: '.swiper-button-next',
                prevButton: '.swiper-button-prev',
                paginationClickable: true,
                lazyLoading: true,
                onInit: function() { //初始化后执行的事件

                },
                onSlideChangeEnd: function(swiper) {
                    H.index.$other = $(".swiper-slide-active").index();
                    H.index.downTimeFn(H.index.$other);
                    // H.index.bespeakFn(); //预约请求
                }
            });
            hideLoading();
        } else {
            var t = simpleTpl();
            t._('<div class="swiper-slide icon-show" style="background-image:url(./images/icon-snow.jpg)">');
            classId.$swiperData.empty().append(t.toString());
            $(".scroll-box").css("padding", "0px");
            hideLoading();
        }
    };

    W.commonApiTimeHandler = function(data) { //获取系统当前时间串
        H.index.$nowtime = timeTransform(parseInt(data.t));
        H.index.getTimeImgFn();
    };

})(Zepto);
$(function() {

    H.index.init();
});
