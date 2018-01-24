(function($) {
    H.qtCode = {
        itemId: getQueryString("itemId")?getQueryString("itemId"):0,
        count: 0,
        arr: [],
        $qtBg: $(".qt-bg"),
        $qtcodeBg: $(".qtcode").find("img"),
        $body: $("body"),
        $qtcodeP: $(".qtcode").find("p"),
        init: function() {
            //this.initParam();
            this.$body.addClass("none");
            //this.imgShow();
            this.eventHander();
            this.loadData();
        },
        initParam: function() {
            var me = this;
            me.arr.push("./images/pink-bg.jpg");
            me.arr.push("./images/blue-bg.jpg");
            me.arr.push("./images/green-bg.jpg");
            me.arr.push("./images/purple-bg.jpg");
            me.arr.push("./images/bd-bg.jpg");
        },
        imgShow: function(activities) {
            var me = this;
            if (activities[me.itemId].backgroundUrl!= undefined && activities[me.itemId].backgroundUrl != null&&activities[me.itemId].backgroundUrl != "") {
                imgObject = new Image();
                imgObject.src = activities[me.itemId].backgroundUrl;
                me.$qtBg.css("background", "url(" + imgObject.src + ")");

                imgObject.onload = function() {
                    me.$body.removeClass("none");
                }
            }
            else
            {
                me.$body.removeClass("none");
            }
            if(activities[me.itemId].dimensionUrl != undefined && activities[me.itemId].dimensionUrl != null)
            {
                 me.$qtcodeBg.attr("src", activities[me.itemId].dimensionUrl);
            }
        },
        eventHander: function() {
            var me = this;
            $(".test").click(function() {
                me.imgShow();
            })
        },
        loadData: function() {
            getResult("redpack/list", {}, "callbackRedPackListHandler", true)
        },

    }
    W.callbackRedPackListHandler = function(data) {
        if (data.code == 0) {
            H.qtCode.imgShow(data.activities);
        }
    }
    H.qtCode.init();
})(Zepto)