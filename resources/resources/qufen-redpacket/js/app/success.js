+(function() {
    var success = {
        initParam: function() {
            this.$metosend = $(".metosend2");
            this.ra = getQueryString("ra");
            if (this.ra) {
                $("#redra").html(this.ra / 100);
            }
            this.sn = getQueryString("sn");
            if (this.sn) {
                $(".sendman").html(this.sn);
            }
            this.simg = decodeURIComponent(getQueryString("simg"));
            if (this.simg) {
                $(".headurl").css({
                    'background-image': 'url(' + this.simg + ')',
                    'background-repeat': 'no-repeat',
                    'background-position': 'center',
                    'background-size': 'contain'
                });
            }
            this.qc = decodeURIComponent(getQueryString("qc"));
            if (this.qc) {
                $(".questiontext").html(this.qc);
            }
            this.rid = getQueryString("rid");

            this.$qrcodediv = $("#qrcodediv"); //二维码界面

        },
        initEvent: function() {
            success.$metosend.click(function() {
                var subscribe = $.fn.cookie("subscribe_" + openid);
                if (subscribe) {
                    window.location.href = "index.html";
                } else {
                    success.$qrcodediv.removeClass("none");
                }
            });
            success.$qrcodediv.click(function() {
                $(this).addClass("none");
            });
        },
        loadDataFn: function() {
            function appendData(data) {
                if (data.rs == 1) { //部分领取
                    $(".open-time").html("已领取红包" + data.rn + "/" + data.tn);
                } else {
                    var time = parseInt((data.rets - data.rsts) / 1000);
                    if (time == 0) {
                        time = 1;
                    }
                    if (time < 60) {
                        $(".open-time").html(data.tn + "个红包," + time + "秒钟被抢完");
                    } else {
                        time = parseInt(time / 60);
                        $(".open-time").html(data.tn + "个红包," + time + "分钟被抢完");
                    }
                }
                var friendlist = $(".friends-list");
                friendlist.empty();
                var anlist = [];
                for (var i = 0; i < data.aitem.length; i++) {
                    var d = data.aitem[i];
                    var item = $("<li><i class='user'></i><h2 class='name'></h2><p class='ans'></p><span class='time'></span></li>");
                    item.find(".user").css({
                        'background-image': 'url(' + d.aimg + ')',
                        'background-repeat': 'no-repeat',
                        'background-position': 'center',
                        'background-size': 'contain'
                    });

                    item.find(".name").html(d.an + ' <span style="color:gray;margin-left:15px;">' + (d.am ? (d.am / 100 + "元") : "") + '</span><span class="theBest bestTag_' + d.am + '"></span>');
                    anlist.push(d.am);
                    item.find(".ans").html(d.ac);
                    var cimg = "../images/icon_dui.png";
                    if (d.ar == 0) { //答错
                        cimg = "images/icon_cuo.png";
                    } else { //答对
                        cimg = "images/icon_dui.png";

                    }
                    item.find(".time").css({
                        'background-image': 'url(' + cimg + ')',
                        'background-repeat': 'no-repeat',
                        'background-position': 'center',
                        'background-size': 'contain'
                    });
                    friendlist.append(item);
                }

                var bm = Math.max.apply(null, anlist);
                if (bm) {
                    if (data.rs == 0) {
                        $($(".bestTag_" + bm).get(0)).html("手气最佳");
                    }

                }

            };
            loadData({
                url: domain_url + "api/redpack/record",
                callbackRedpackRecordHandler: function(data) {
                    if (data.code == 0) {
                        appendData(data);
                    } else {
                        alert("抱歉请稍后再试code=7");
                    }
                },
                data: {
                    op: openid, // 用户openid，必填
                    cop: codeOpenid, //  用户codeopenid，必填
                    rid: success.rid //  红包id，必填
                }
            });
        },
        init: function() {
            success.initParam();
            success.initEvent();
            success.loadDataFn();
        }
    };
    success.init();
})();
