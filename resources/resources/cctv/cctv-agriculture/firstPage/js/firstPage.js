$(function () {
    var loadFirst = function (param) {
        this.domain_url = domain_url + "api/ad/get?areaNo=ad_homepage_envelope";
        this.url = param && param.domain_url || this.domain_url + ""; //请求url
        this.jsonpCallback = "callbackAdGetHandler"; //回调
        this.timer = param && param.timer || 4000; //隔三秒跳转
        this.jumpUrl = "firstPage.html"; //跳转的url
    };
    loadFirst.prototype.init = function () {
        this.loadImg($.proxy(function () {
            this.junpPage();
        }, this));
    };
    loadFirst.prototype.loadImg = function (fn) {


        $.ajax({ url: this.url, dataType: "jsonp", type: "get", jsonpCallback: this.jsonpCallback, success: function (data) {
            if (data.code == 0) {
                $("#containBg").addClass("bg").css({ "background-image": "url('" + data.ads[0].p + "')" });
                if (fn) {
                    fn();
                }
            } else {//不成功就默认的
                $("#containBg").addClass("bg_default");
            }
        }, error: function () {
            $("#containBg").addClass("bg_default");
            alert("抱歉，加载失败");
        }
        });
    };
    loadFirst.prototype.junpPage = function () {
        var that = this;
        setTimeout(function () {
            debugger;
            //  window.location.href = "firstPage.html";
            new Impower().authorize(function () {
                window.location.href = "firstPage.html";
            });

        }, this.timer);
    };

    new loadFirst().init(); //调用
});


