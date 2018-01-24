(function($) {

    H.rolling = (function () {
        var defaultParam = {
            container: "", //容器(zetop对象)
            width: "", //容器宽度
            height: 20, //容器高度
            datas: [], //翻滚的数据
            initEvent: null, //初始化时间函数
            afterRolling: null//每项翻滚后的回调
        };
        var param = {};
        var rolling = {

            init: function (container) {//初始化
                this.container = container;
                this.rollingSetSize();
                var rs = this.appendData();
                rs && this.startRolling(); //开始滚动
            },

            rollingSetSize: function () {//设置滚动容器的大小
                this.container.css({"height": param.height, "overflow": "hidden", "text-align": "center" });
                this.container.html('');
            },

            appendData: function (data) {//附加数据
                if (!data) {
                    this.itemArr = [];
                    if (param.datas.length == 0) { return };

                    this.itemArr = param.datas;
                   
                    for (i = 0; i < (param.datas.length >= 2 ? 2 : 1); i++) {//加载前两项

                        var htmlStr = $('#tmpl_rollingRecord').tmpl({
                            'content' : ( this.itemArr[i].un ? this.itemArr[i].un : '匿名用户' ) + '获得了' + this.itemArr[i].pn
                        });

                        this.container.append(htmlStr);

                        var item = this.container.find('p');
                        H.resize.attr(item, ['font-size']);
                        item.css('line-height', param.height + 'px');
                    }
                } else {
                    this.itemArr = this.itemArr.concat(data);
                }
                if (param.initEvent) {
                    param.initEvent(this.itemArr, this.container);
                }
                return this.itemArr.length >= 2;
            },

            startRolling: function () {//开始滚动
                var isFirst = true;
                var that = this;
                that.marqueeInterval = [];
                that.marqueeId = 1;
                that.marqueeDelay = 2000;

                function start() {
                    that.marqueeInterval[0] && clearTimeout(that.marqueeInterval[0]);
                    that.marqueeInterval[0] = setTimeout(function () {
                        startMarquee();
                    }, that.marqueeDelay); //开始循环
                };
                function startMarquee() {
                    var cn = that.container.get(0);
                    var html = ( that.itemArr[that.marqueeId].un ? that.itemArr[that.marqueeId].un : '匿名用户' ) + '获得了' + that.itemArr[that.marqueeId].pn;
                    that.marqueeId++;
                    if (that.marqueeId >= that.itemArr.length) that.marqueeId = 0;
                    var html1 = that.container.children()[1].innerHTML
                    that.container.children()[1].innerHTML = html;
                    if (isFirst) {
                        isFirst = false;
                    } else {
                        that.container.children()[0].innerHTML = html1;
                    }
                    cn.scrollTop = 0;
                    clearInterval(that.marqueeInterval[1]);
                    that.marqueeInterval[1] = setInterval(function () {
                        scrollMarquee(function () {
                            start();
                        });
                    }, 20);
                };
                function scrollMarquee(fn) {
                    that.container.get(0).scrollTop++;
                    if (that.container.get(0).scrollTop % param.height == (param.height - 1)) {
                        param.afterRolling && param.afterRolling(that.container.children()[1].innerHTML);
                        clearInterval(that.marqueeInterval[1]);
                        delete that.marqueeInterval[1];
                        if (fn) { fn() }
                    }
                };
                start(); //开始
            }

        };
        function init(obj) {

            param = $.extend(defaultParam, obj);
            if (!param.container) {
                alert("请输入容器对象");
                return;
            }
            rolling.init(param.container);
        };
        function appendData(data) {
            rolling.appendData(data);
        };
        return { init: init, appendData: appendData };
    })();
})(Zepto);



(function($) {
    
    H.rollingRecord = {
        firstLoad: true,

        $wrapper: $('.rollingRecord-wrapper'),

        init: function(){
            getResult('api/lottery/allrecord',null,'callbackLotteryAllRecordHandler');
        },

        fill: function(data){
            if(data.result == true){
                if(H.rollingRecord.firstLoad){
                    H.rollingRecord.firstLoad = false;

                    H.rolling.init({
                        height: H.rollingRecord.$wrapper.height(),
                        container: H.rollingRecord.$wrapper,
                        datas: data.rl
                    });
                }else{
                    H.rolling.appendData(data.rl);
                }
            }

            setTimeout(function(){
                getResult('api/lottery/allrecord',null,'callbackLotteryAllRecordHandler');
            }, 5000);
        }
    };

    W.callbackLotteryAllRecordHandler = function(data){
        H.rollingRecord.fill(data);
    }

    H.rollingRecord.init();

})(Zepto);