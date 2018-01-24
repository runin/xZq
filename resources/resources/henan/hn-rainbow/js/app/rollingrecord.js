+(function (w, $) { //报名插件
    //独立函数的形式(连续执行的时候)
    w.Cartoon = function (arr) {
        this.defaultParam = {
            element: "", //应用的元素
            delay: "", //定义动画开始前等待的时间 值：秒
            direction: "normal", //是否应该轮流反向播放动画 值normal  alternate(轮流反向播放动画)
            duration: "", //动画持续时间
            iteration_count: "", //定义动画的播放次数 值： 次数 或者 infinite (无穷)
            play_state: '', //规定动画正在运行还是暂停 值：paused running
            timing_function: "linear", //动画的速度曲线 值：linear ease  ease-in ease-out ease-in-out
            animation_fill_mode: "", //规定动画在播放之前或之后，其动画效果是否可见 值：none forwards(当动画完成后，保持最后一个属性值)  backwards(保持开始属性值) both(向前和向后填充模式都被应用)
            content: null, //执行的内容
            complete: null, //完成时候的回调
            isRemoveStyle: false
        }
        arr.constructor == Array && (this.arr = arr); //保存变量
        this.initItem();
        this.start(0);
    };
    Cartoon.prototype.initItem = function () {
        this.items = [];
        for (var i = 0, len = this.arr.length; i < len; i++) {
            var im = new this.arr[i]();
            im.index = i;
            this.items.push(im);
        }
    };
    Cartoon.prototype.start = function (sindex) {
        var that = this;
        function exeAnimation(sindex) {
            if (sindex >= that.items.length) {
                return;
            }
            var item = that.items[sindex];
            exeCode(item);
            function exeCode(item, isChild) {
                if (item.meanwhile && item.meanwhile.length) {
                    for (var k = 0, len = item.meanwhile.length; k < len; k++) {
                        exeCode(new item.meanwhile[k](), true);
                    }
                }
                var pt = {};
                for (var i in item) {
                    pt[i] = item[i];
                }
                var df = {};
                for (var i in that.defaultParam) {
                    df[i] = that.defaultParam[i];
                }
                var p = $.extend(df, pt);
                var sid = "s_" + parseInt(Math.random() * 1000);
                while ($("#" + sid).length >= 1) {
                    sid = "s_" + parseInt(Math.random() * 1000);
                }
                var style = $('<style  id=' + sid + '></style>');
                var className = "pass_barrage" + parseInt(Math.random() * 1000);
                while ($("." + className).length >= 1) {
                    className = "pass_barrage" + parseInt(Math.random() * 1000);
                }
                var arr = [];
                arr.push("." + className + " {");
                arr.push("-webkit-animation-name: " + className + "_a;");
                p.delay && arr.push("-webkit-animation-delay: " + p.delay + "s;");
                p.direction && arr.push("-webkit-animation-direction: " + p.direction + ";");
                p.duration && arr.push("-webkit-animation-duration: " + p.duration + "s;");
                p.iteration_count && arr.push("-webkit-animation-iteration-count: " + p.iteration_count + ";");
                p.play_state && arr.push("-webkit-animation-play-state: " + p.play_state + ";");
                p.timing_function && arr.push("-webkit-animation-timing-function: " + p.timing_function + ";");
                p.animation_fill_mode && arr.push("-webkit-animation-fill-mode: " + p.animation_fill_mode + ";");
                arr.push("}");
                arr.push(" @-webkit-keyframes " + className + "_a {");
                arr.push(p.content && p.content() || "100% {}");
                arr.push("}");
                style[0].innerHTML = arr.join("");
                p.before && p.before($(p.element), className);
                $("head").append(style);
                $(p.element).addClass(className);
                if (p.iteration_count == "infinite") {
                    if (p.duration * 1000) {
                        setTimeout(function () {
                            if (!isChild) {
                                sindex++;
                                exeAnimation(sindex);
                            }

                        }, p.duration * 1000)
                    } else {
                        if (!isChild) {
                            sindex++;
                            exeAnimation(sindex);
                        }
                    }
                    return;
                }
                (function (m, t, s, p) {
                    setTimeout(function () {
                        if (!p.animation_fill_mode) {
                            s.remove();
                        }
                        if (p.isRemoveStyle) {
                            s.remove();
                        }
                        if (p.complete) {
                            p.complete(m, className);
                        }
                        if (p.stop) {
                            return;
                        }
                        if (!isChild) {
                            sindex++;
                            exeAnimation(sindex);
                        }
                    }, t);
                })($(p.element), p.duration * 1000, style, p, className);
            };
        }
        exeAnimation(sindex);
    };
    rollingRecord = function (obj) {
        rollingRecord.param = $.extend({
            datas: [], //数据
            items: [], //每项的jq对象
            width: 300, //宽度
            height: 50, //高度
            container: null, //容器
            interval: 1500//时间间隔
        }, obj || {});
        for (var i in rollingRecord.param) {
            this[i] = rollingRecord.param[i];
        }
        this.init();
    }
    rollingRecord.prototype.init = function () {
        Array.prototype.insert = function (index, item) {
            this.splice(index, 0, item);
        };
        this.loadData(); //加载数据
        this.setCss();
    };
    rollingRecord.prototype.loadData = function () {
        var that = this;
        var isFirstLoad = true;
        function loadFn() {
            getResult("api/lottery/allrecord", { ps: 10 }, "callbackLotteryAllRecordHandler", function (data) {
                if (data.result == true) {//成功
                    if (isFirstLoad) {
                        isFirstLoad = false;
                        var rs = [];
                        for (var i = 0; i < data.rl.length; i++) {
                            var it = data.rl[i];
                            rs.push((it.un || "匿名用户") + "获得" + it.pn);
                        }
                        that.datas = rs;
                        if (rs.length > 2) {
                            that.rollingRecord.css("visibility", "visible");
                            $("#rollingrecord").css("visibility", "visible");
                        } else {
                            $("#rollingrecord").css("visibility", "hidden");
                        }
                        that.createHtml(function () {
                            that.startAn(); //开始动画
                        }); //创建结构附加数据
                    } else {
                        var rs = [];
                        for (var i = 0; i < data.rl.length; i++) {
                            var it = data.rl[i];
                            that.appendData((it.un || "匿名用户") + "获得" + it.pn);
                        }
                    }
                } else {//请求失败
                }
                setTimeout(function () {
                    loadFn();
                }, 5000)
            });
        };
        loadFn();
    };
    rollingRecord.prototype.setCss = function () {
        this.container.empty().css({ width: this.width, height: this.height, "overflow": "hidden" });
        this.rollingRecord = $("<div class='rollingRecord' style='visibility:hidden; '></div>");
        this.rollingRecord.css({ width: this.width, height: this.height * 2 });
        this.container.append(this.rollingRecord);
    }
    rollingRecord.prototype.createHtml = function (fn) {//创建html
        //先添加两个子容器
        var item = $("<div class='lan_item'></div>");
        item.css({ "display": "block;", width: this.width, height: this.height, "overflow": "hidden", "text-align": "center", "line-height": this.height + "px" });
        this.items.push(item);
        this.rollingRecord.append(item);
        var item2 = item.clone(true);
        this.items.push(item2);
        this.rollingRecord.append(item2);
        if (this.datas.length == 0) {//不做
            return;
        }
        if (this.datas.length == 1) {
            this.items[0].html("<span>" + this.datas[0] + "</span>");
            return;
        }
        this.items[0].html("<span>" + this.datas[0] + "</span>");
        this.items[1].html("<span>" + this.datas[1] + "</span>");

        fn && fn();
    }
    rollingRecord.prototype.appendData = function (html) {
        if (this.datas.length > 50) {//删除一个
            this.datas.splice(0, 1);
        }
        this.datas[this.datas.length] = html;
    }
    rollingRecord.prototype.startAn = function () { //开始
        var that = this;
        var isFirst = true;
        that.turnCount = 0;
        that.lastClassName = "";
        function Winterval() {
            that.CartoonObj = null;
            that.CartoonObj = new Cartoon([function () {
                this.element = that.rollingRecord;
                this.duration = that.interval / 1000;
                this.animation_fill_mode = "forwards";
                this.isRemoveStyle = true;
                this.content = function () {
                    var arr = [];
                    arr.push("0% {  -webkit-transform: translateY(-" + 0 + "px) }");
                    arr.push("100% {  -webkit-transform: translateY(-" + that.height + "px)}");
                    return arr.join("");
                };
                this.before = function () {
                    if (isFirst) {
                        isFirst = false;
                    } else {
                        //第一个容器 赋值后一个数据
                        var c = that.turnCount;
                        c++;
                        if (c > that.datas.length - 1) {
                            c = 0;
                        }
                        that.items[1].html("<span>" + that.datas[c] + "</span>");
                    }
                };
                this.complete = function (item, className) {
                    that.turnCount++; //1  2
                    if (that.turnCount > that.datas.length - 1) {
                        that.turnCount = 0;
                    }
                    that.items[0].html("<span>" + that.datas[that.turnCount] + "</span>");
                    that.rollingRecord.removeClass(that.lastClassName);
                    that.lastClassName = className;
                    setTimeout(function () {
                        Winterval();
                    }, that.interval)
                };
            } ]);
        }
        setTimeout(function () {
            Winterval();
        }, that.interval)
    }
    rollingRecord.prototype.stop = function () {//停止
        if (this.Winterval) {
            clearInterval(this.Winterval);
        }
    }

    var contain = $(".rollingrecord-wrapper");
    new rollingRecord({ width: contain.width() || 300, height: contain.height() || 50, container: contain });

})(window, Zepto)