//封装用js控制css的插件
//有几个要点1.可以定时回调 2.可以队列执行，可以根据id回调，3.主要用于手机
; (function (w, $) {
    $.fn.cartoon = function (p) {
        $.cartoonDefault = {
            delay: "", //定义动画开始前等待的时间 值：秒
            direction: "normal", //是否应该轮流反向播放动画 值normal  alternate(轮流反向播放动画)
            duration: "", //动画持续时间
            iteration_count: "", //定义动画的播放次数 值： 次数 或者infinite(无穷)
            play_state: '', //规定动画正在运行还是暂停 值：paused running
            timing_function: "", //动画的速度曲线 值：linear ease  ease-in ease-out ease-in-out
            content: null, //执行的内容
            complete: null //完成时候的回调
        };
        var param = $.extend($.cartoonDefault, p || {});
        var that = this;
        this.cartoons = []; //动画队列
        function Cartoon() {

        };
        Cartoon.prototype = {
            init: function () {
                var sid = "s_" + parseInt(Math.random() * 1000);
                var style = $('<style  id=' + sid + '></style>');
                var className = "pass_barrage" + parseInt(Math.random() * 1000);
                var arr = [];
                arr.push("." + className + " {");
                arr.push("-webkit-animation-name: " + className + "_a;");
                this.delay && arr.push("-webkit-animation-delay: " + this.delay + "s;");
                this.direction && arr.push("-webkit-animation-direction: " + this.direction + ";");
                this.duration && arr.push("-webkit-animation-duration: " + this.duration + "s;");
                this.iteration_count && arr.push("-webkit-animation-iteration-count: " + this.iteration_count + ";");
                this.play_state && arr.push("-webkit-animation-play-state: " + this.play_state + ";");
                this.timing_function && arr.push("-webkit-animation-timing-function: " + this.timing_function + ";");
                arr.push("}");
                arr.push(" @-webkit-keyframes " + className + "_a {");
                arr.push(param.content && param.content() || "100% {}");
                arr.push("}");
                style[0].innerHTML = arr.join("");
                $("head").append(style);
                $(that).addClass(className);
                if (this.iteration_count == "infinite") {
                    return;
                }
                (function (m, t, s) {
                    setTimeout(function () {
                        s.remove();
                        if (param.complete) {
                            param.complete(m);
                        }
                    }, t);
                })($(that), this.duration * 1000, style);
            }
        };
        this.each(function () {//循环初始化
            var cartoon = new Cartoon();
            for (var i in param) {
                cartoon[i] = param[i];
            }
            cartoon.init();
        });
        return this;
    }


})(window, Zepto)