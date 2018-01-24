<script>

import imgReady from 'img-ready'

export default{
    props: {
        preview : Boolean,
        photos: Array,
        music: Object,
        Tmpl: Object,
        title: String,
        author: String
    },

    data(){
        return {
            curIndex: -1,
            cover: null,
            items: [],
            datas: [],
            isLoading: true,
            serverIds: [],
            isCover1: false,
            isCover2: false,
            isCover3: false,
            isEnd: false,
            isMain: false,
            slideStyle: {},
            globalSize: {'width': $(window).width() + 'px', 'height': $(window).height() + 'px'},
            circleoneId: 0,
            svgPathList: {}
        }
    },

    methods: {
        lastX: 0,
        lastY: 0,
        base3: function(t, p1, p2, p3, p4) {
            var t1 = -3 * p1 + 9 * p2 - 9 * p3 + 3 * p4
              , t2 = t * t1 + 6 * p1 - 12 * p2 + 6 * p3;
            return t * t2 - 3 * p1 + 3 * p2;
        },
        bezlen: function(x1, y1, x2, y2, x3, y3, x4, y4, z) {
            var self = this;
            if (z == null ) {
                z = 1;
            }
            z = z > 1 ? 1 : z < 0 ? 0 : z;
            var z2 = z / 2
              , n = 12
              , Tvalues = [-0.1252, 0.1252, -0.3678, 0.3678, -0.5873, 0.5873, -0.7699, 0.7699, -0.9041, 0.9041, -0.9816, 0.9816]
              , Cvalues = [0.2491, 0.2491, 0.2335, 0.2335, 0.2032, 0.2032, 0.1601, 0.1601, 0.1069, 0.1069, 0.0472, 0.0472]
              , sum = 0;
            for (var i = 0; i < n; i++) {
                var ct = z2 * Tvalues[i] + z2
                  , xbase = self.base3(ct, x1, x2, x3, x4)
                  , ybase = self.base3(ct, y1, y2, y3, y4)
                  , comb = xbase * xbase + ybase * ybase;
                sum += Cvalues[i] * Math.sqrt(comb);
            }
            return z2 * sum;
        },
        getTatLen: function(x1, y1, x2, y2, x3, y3, x4, y4, ll) {
            var self = this;
            if (ll < 0 || self.bezlen(x1, y1, x2, y2, x3, y3, x4, y4) < ll) {
                return;
            }
            var t = 1, step = t / 2, t2 = t - step, l, e = 0.01;
            l = self.bezlen(x1, y1, x2, y2, x3, y3, x4, y4, t2);
            while (Math.abs(l - ll) > e) {
                step /= 2;
                t2 += (l < ll ? 1 : -1) * step;
                l = self.bezlen(x1, y1, x2, y2, x3, y3, x4, y4, t2);
            }
            return t2;
        },
        findDotsAtSegment: function(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t) {
            var self = this;
            var t1 = 1 - t
              , t13 = Math.pow(t1, 3)
              , t12 = Math.pow(t1, 2)
              , t2 = t * t
              , t3 = t2 * t
              , x = t13 * p1x + t12 * 3 * t * c1x + t1 * 3 * t * t * c2x + t3 * p2x
              , y = t13 * p1y + t12 * 3 * t * c1y + t1 * 3 * t * t * c2y + t3 * p2y
              , mx = p1x + 2 * t * (c1x - p1x) + t2 * (c2x - 2 * c1x + p1x)
              , my = p1y + 2 * t * (c1y - p1y) + t2 * (c2y - 2 * c1y + p1y)
              , nx = c1x + 2 * t * (c2x - c1x) + t2 * (p2x - 2 * c2x + c1x)
              , ny = c1y + 2 * t * (c2y - c1y) + t2 * (p2y - 2 * c2y + c1y)
              , ax = t1 * p1x + t * c1x
              , ay = t1 * p1y + t * c1y
              , cx = t1 * c2x + t * p2x
              , cy = t1 * c2y + t * p2y
              , alpha = 90 - Math.atan2(mx - nx, my - ny) * 180 / Math.PI;
            (mx > nx || my < ny) && (alpha += 180);
            return {
                x: x,
                y: y,
                m: {
                    x: mx,
                    y: my
                },
                n: {
                    x: nx,
                    y: ny
                },
                start: {
                    x: ax,
                    y: ay
                },
                end: {
                    x: cx,
                    y: cy
                },
                alpha: alpha
            };
        },
        getPointAtSegmentLength: function(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, length) {
            var self = this;
            if (length == null ) {
                return self.bezlen(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y);
            } else {
                return self.findDotsAtSegment(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, self.getTatLen(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, length));
            }
        },
        calTotalLength: function(list) {
            var self = this;
            var p, len = 0;
            for (var i = 0, ii = list.length; i < ii; i++) {
                p = list[i];
                len += self.bezlen(p[0], p[1], p[2], p[3], p[4], p[5], p[6], p[7]);
            }
            return len;
        },
        getPointAtLength: function(list, length) {
            var self = this;
            var p, l, len = 0, point, x, y;
            for (var i = 0, ii = list.length; i < ii; i++) {
                p = list[i];
                l = self.getPointAtSegmentLength(p[0], p[1], p[2], p[3], p[4], p[5], p[6], p[7]);
                if (len + l > length) {
                    point = self.getPointAtSegmentLength(p[0], p[1], p[2], p[3], p[4], p[5], p[6], p[7], length - len);
                    return {
                        x: point.x,
                        y: point.y,
                        alpha: point.alpha
                    };
                }
                len += l;
                x = +p[6];
                y = +p[7];
            }
            point = self.findDotsAtSegment(p[0], p[1], p[2], p[3], p[4], p[5], p[6], p[7], 1);
            return point;
        },
        calMatrix: function(x, y) {
            var self = this;
            if (typeof self.lastX == "undefined" || typeof self.lastY == "undefined") {
                self.lastX = x;
                self.lastY = y;
                return "";
            }
            var xd = x - self.lastX
              , yd = y - self.lastY;
            var c = Math.sqrt(Math.pow(xd * 100, 2) + Math.pow(yd * 100, 2)) / 100;
            var result = [];
            var a = (xd / c).toFixed(4);
            var b = (yd / c).toFixed(4);
            var e = x.toFixed(4);
            var f = y.toFixed(4);
            isNaN(a) && (a = 1);
            isNaN(b) && (b = 0);
            result.push(a);
            result.push(b);
            result.push(-1 * parseFloat(b));
            result.push(a);
            result.push(e);
            result.push(f);
            self.lastX = x;
            self.lastY = y;
            return "matrix(" + result.join(",") + ")";
        },
        init: function(){
            this.preLoadPhotos();
        },
        preLoadPhotos: function(){
            this.serverIds = [];
            for(var i in this.photos){
                if(!this.photos[i].liu && this.photos[i].wiu){
                    this.serverIds.push({
                        index: i,
                        id: this.photos[i].wiu
                    });
                }else{
                    if(this.photos[i].liu){
                        this.photos[i].url = this.photos[i].liu;    
                    }
                }
            };
            this.wxLoadPhotos();
        },
        wxLoadPhotos: function(){
            var that = this;
            if(this.serverIds.length == 0){
                this.resizePhotos();
                return false;
            }
            var serverObj = this.serverIds.pop();
            wx.downloadImage({
                serverId: serverObj.id,
                isShowProgressTips: 0,
                success: function (res){
                    that.photos[serverObj.index].url = res.localId;
                    if(that.serverIds.length > 0){
                        that.wxLoadPhotos();
                    }else{
                        that.resizePhotos();
                    }
                }
            });
        },
        resizePhotos: function(){
            var that = this,
                items = [],
                width = $(window).width(),
                height = $(window).height();

            this.datas = this.photos.concat();

            for(var i = 0; i < this.datas.length; i++){
                this.datas[i].class = {};
                this.datas[i].class['active'] = false;
                
                if(i % 8 == 0){
                    this.datas[i].text = 'Life is a one-way travel.';
                }else if(i % 8 == 1){
                    this.datas[i].text = 'All time is no time when it is past.';
                }else if(i % 8 == 2){
                    this.datas[i].text = 'Each section of the road, as long as there can not be reconciled, it has not yet come to an end.';
                }else if(i % 8 == 3){
                    this.datas[i].text = 'Time is a bird for ever on the wing.';
                }else if(i % 8 == 4){
                    this.datas[i].text = 'The first step is as good as half over.';
                }else if(i % 8 == 5){
                    this.datas[i].text = 'Nothing for nothing.';
                }else if(i % 8 == 6){
                    this.datas[i].text = 'Life is a one-way travel.';
                }else if(i % 8 == 7){
                    this.datas[i].text = 'All time is no time when it is past.';
                }else{
                    this.datas[i].text = 'Nothing for nothing.';
                }

                var itemWidth = this.datas[i].width;
                var itemHeight = this.datas[i].height;
                this.datas[i].isW = false;
                this.datas[i].isH = false;
                this.datas[i].isE = false;

                if (itemWidth > itemHeight){
                    // 宽图 style-5-4
                    this.datas[i].isW = true;
                    this.datas[i].isH = false;
                    this.datas[i].isE = false;
                } else if (itemWidth < itemHeight) {
                    // 长图 style-2-3
                    this.datas[i].isW = false;
                    this.datas[i].isH = true;
                    this.datas[i].isE = false;
                } else {
                    // 1:1 style-1-1
                    this.datas[i].isW = false;
                    this.datas[i].isH = false;
                    this.datas[i].isE = true;
                }

                this.datas[i].bgStyle = {'width': '100%', 'height': '100%', 'background': 'url(' + this.datas[i].url + ') no-repeat', 'object-fit': 'cover', 'background-size': '100% 100%'};

                // this.datas[0].bgStyle = {'padding-top': '60%', 'width': '100%', 'background': 'url(' + this.datas[0].url+ ') no-repeat center center', 'object-fit': 'cover', 'background-size': '100% 100%'};
                // var cover = {
                //     url : this.datas[0].url,
                //     isActive : false,
                //     class : this.datas[0].class,
                //     imgStyle : this.datas[0].imgStyle,
                //     animateStyle : this.datas[0].animateStyle,
                //     text : this.datas[0].text,
                //     iclass : this.datas[0].iclass,
                //     bgStyle : this.datas[0].bgStyle,
                //     isW: this.datas[0].isW,
                //     isH: this.datas[0].isH,
                //     isE: this.datas[0].isE,
                // }

                this.datas[i].class['page-' + (i % 9 + 1) + ' animate-' + (i % 9 + 1) ] = true;
                this.datas[i].iclass= (i % 9 + 1);
                this.items.push({
                    url : this.datas[i].url,
                    isActive : false,
                    class : this.datas[i].class,
                    imgStyle : this.datas[i].imgStyle,
                    animateStyle : this.datas[i].animateStyle,
                    text : this.datas[i].text,
                    iclass : this.datas[i].iclass,
                    bgStyle : this.datas[i].bgStyle,
                    isW: this.datas[i].isW,
                    isH: this.datas[i].isH,
                    isE: this.datas[i].isE,
                });
            }

            imgReady(this.datas[0].url, function(e) {
                that.$nextTick(function(){
                    that.svg('init');
                    that.isCover1 = true;
                    setTimeout(function(){
                        that.isCover2 = true;
                        $('.j-img-line').html('<svg xmlns="http://www.w3.org/2000/svg" version="1.1" id="subLineSvg-0" x="0px" y="0px" viewBox="0 0 2273.936170212766 1689.5209580838323" style="enable-background:new 0 0 ; position:absolute;2273.936170212766 1689.5209580838323; " xml:space="preserve"><path fill="none" data-key="0" id="planeLine-0" class="fly-line" stroke="rgb(150,150,150)" stroke-width="2" stroke-miterlimit="10" d="M1037.234,112.635C1224.734,131.407,1337.234,135.16140000000001,1412.234,131.407" stroke-dasharray="375.7752380371094 375.7752380371094" stroke-dashoffset="375.7752380371094"></path></svg>');
                        $("#planeLine-0").animate({
                            strokeDashoffset: 0
                        }, 500, function() {
                        });
                        setTimeout(function(){
                            $('.j-img-line').html('');
                            that.isCover3 = true;
                            that.isMain = true;
                            that.isLoading = false;
                            that.play();
                            that.$emit('playing');
                        }, 1000);
                    }, 5000);
                });
            });
        },
        play: function(){
            var that = this, theIndex = this.curIndex;
            var width = $(window).width();
            var height = $(window).height();

            var w = width;
            var h = height;

            var posiArray = [{
                x: 0,
                y: 0
            }, {
                x: -1.3 * w,
                y: 0.3 * h
            }, {
                x: -2.23 * w,
                y: -0.437 * h
            }, {
                x: -2.02 * w,
                y: -1.635 * h
            }, {
                x: 0.106 * w,
                y: -1.731 * h
            }, {
                x: 1.638 * w,
                y: -1.976 * h
            }, {
                x: 2.691 * w,
                y: -1.198 * h
            }, {
                x: 2.064 * w,
                y: 0.048 * h
            }, {
                x: 1.011 * w,
                y: 0.048 * h
            }];

            if(this.items.length <= 0) return false;
            
            this.curIndex++;
            if(this.curIndex >= this.items.length){
                this.end();
                return false;
            }

            setTimeout(function(){
                that.items[that.curIndex].isActive = true;
                that.items[that.curIndex].class['active-end'] = false;
                that.items[that.curIndex].class.active = true;
            }, 1000);

            that.items[that.curIndex].imgStyle = that.items[that.curIndex].animateStyle;
            that.slideStyle = {
                webkitTransform: "translate3d(" + posiArray[that.curIndex].x + "px" + "," + posiArray[that.curIndex].y + "px" + ",0)",
                transform: "translate3d(" + posiArray[that.curIndex].x + "px" + "," + posiArray[that.curIndex].y + "px" + ",0)"
            };
            
            setTimeout(function(){
                that.resetItem(theIndex);
                if(that.curIndex > 0) that.items[that.curIndex - 1].class.active = false;
            }, 2000);
            
            setTimeout(function(){
                that.play();
            }, 6000);

            this.svg('play', that.curIndex);
        },
        resetItem: function(index){
            if(this.items[index]){
                this.items[index].isActive = false;
                this.items[index].imgStyle = this.items[index].defaultStyle;
            }
        },
        end: function(){
            if(this.preview){
                // 循环播放
                if(this.curIndex > 0){
                    if(this.photos.length > 1){
                        this.resetItem(this.curIndex - 1);    
                    }
                }
                this.curIndex = -1;
                this.play();
            }else{
                // 结束界面
                var that = this;
                this.isEnd = true;
                setTimeout(function(){
                    that.$emit('end');
                }, 1500);
            }
        },
        svg: function(code, index) {
            var that = this;
            var planeImg = "https://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/img/tpl-tour/plane@2x.png";
            var svgPrepared;
            var container, planeContainer;
            var h = window.innerHeight
              , w = window.innerWidth;
            var xOffset = w * 260 / 94
              , yOffset = 0;
            var speed = 600;
            var sections = [0, 1, 3, 5, 7, 9, 11, 13, 15];
            var containerHeight = h * 450 / 167;
            var containerWidth = w * 570 / 94;
            var noPlaneIndexList = [2, 3, 5, 6];
            var positions = {
                0: {
                    x: parseFloat((0 + xOffset).toFixed(3)),
                    y: parseFloat((57 / 167 * h + yOffset).toFixed(3))
                },
                1: {
                    x: parseFloat((w + xOffset).toFixed(3)),
                    y: parseFloat((80 / 167 * h + yOffset).toFixed(3))
                },
                2: {
                    x: parseFloat((122 / 94 * w + xOffset).toFixed(3)),
                    y: parseFloat((62 / 167 * h + yOffset).toFixed(3))
                },
                3: {
                    x: parseFloat((216 / 94 * w + xOffset).toFixed(3)),
                    y: parseFloat((30 / 167 * h + yOffset).toFixed(3))
                },
                4: {
                    x: parseFloat((269 / 94 * w + xOffset).toFixed(3)),
                    y: parseFloat((73 / 167 * h + yOffset).toFixed(3))
                },
                5: {
                    x: parseFloat((216 / 94 * w + xOffset).toFixed(3)),
                    y: parseFloat((240 / 167 * h + yOffset).toFixed(3))
                },
                6: {
                    x: parseFloat((244 / 94 * w + xOffset).toFixed(3)),
                    y: parseFloat((273 / 167 * h + yOffset).toFixed(3))
                },
                7: {
                    x: parseFloat((192 / 94 * w + xOffset).toFixed(3)),
                    y: parseFloat((392 / 167 * h + yOffset).toFixed(3))
                },
                8: {
                    x: parseFloat((84 / 94 * w + xOffset).toFixed(3)),
                    y: parseFloat((380 / 167 * h + yOffset).toFixed(3))
                },
                9: {
                    x: parseFloat((-10 / 94 * w + xOffset).toFixed(3)),
                    y: parseFloat((345 / 167 * h + yOffset).toFixed(3))
                },
                10: {
                    x: parseFloat((-50 / 94 * w + xOffset).toFixed(3)),
                    y: parseFloat((377 / 167 * h + yOffset).toFixed(3))
                },
                11: {
                    x: parseFloat((-154 / 94 * w + xOffset).toFixed(3)),
                    y: parseFloat((340 / 167 * h + yOffset).toFixed(3))
                },
                12: {
                    x: parseFloat((-158 / 94 * w + xOffset).toFixed(3)),
                    y: parseFloat((330 / 167 * h + yOffset).toFixed(3))
                },
                13: {
                    x: parseFloat((-223 / 94 * w + xOffset).toFixed(3)),
                    y: parseFloat((200 / 167 * h + yOffset).toFixed(3))
                },
                14: {
                    x: parseFloat((-193 / 94 * w + xOffset).toFixed(3)),
                    y: parseFloat((100 / 167 * h + yOffset).toFixed(3))
                },
                15: {
                    x: parseFloat((-100 / 94 * w + xOffset).toFixed(3)),
                    y: parseFloat((44 / 167 * h + yOffset).toFixed(3))
                }
            };

            function getControlPoints(pointA, pointB, index) {
                var result = [];
                var xand = pointA.x + pointB.x
                  , xd = pointB.x - pointA.x;
                var yd = pointB.y - pointA.y;
                switch (index) {
                case "0":
                    var x0 = pointB.x - xd * 0.5;
                    var y0 = pointB.y;
                    var x1 = pointB.x - xd * 0.2;
                    var y1 = pointB.y + yd * 0.2;
                    result.push(x0);
                    result.push(y0);
                    result.push(x1);
                    result.push(y1);
                    break;
                case "1":
                    var x0 = pointA.x + xd * 0.4;
                    var y0 = pointA.y + yd * 0.14;
                    var x1 = pointA.x + xd * 0.7;
                    var y1 = pointB.y - yd * 0.6;
                    result.push(x0);
                    result.push(y0);
                    result.push(x1);
                    result.push(y1);
                    break;
                case "2":
                    var x0 = pointA.x + xd * 0.3;
                    var y0 = pointA.y + yd * 1.2;
                    var x1 = pointA.x + xd * 0.5;
                    var y1 = pointB.y + yd * 0.4;
                    result.push(x0);
                    result.push(y0);
                    result.push(x1);
                    result.push(y1);
                    break;
                case "3":
                    var x0 = pointA.x + xd * 0.4;
                    var y0 = pointA.y + yd * 0.14;
                    var x1 = pointA.x + xd * 0.77;
                    var y1 = pointA.y + yd * 0.45;
                    result.push(x0);
                    result.push(y0);
                    result.push(x1);
                    result.push(y1);
                    break;
                case "4":
                    var x0 = pointA.x - xd * 0.7;
                    var y0 = pointA.y + yd * 0.4;
                    var x1 = pointA.x + xd * 1.5;
                    var y1 = pointA.y + yd * 0.4;
                    result.push(x0);
                    result.push(y0);
                    result.push(x1);
                    result.push(y1);
                    break;
                case "5":
                    var x0 = pointA.x + xd * 0.2;
                    var y0 = pointA.y + yd * 0.4;
                    var x1 = pointA.x + xd * 0.8;
                    var y1 = pointA.y + yd * 0.8;
                    result.push(x0);
                    result.push(y0);
                    result.push(x1);
                    result.push(y1);
                    break;
                case "6":
                    var x0 = pointA.x - xd * 0.8;
                    var y0 = pointA.y + yd * 0.35;
                    var x1 = pointA.x - xd * 0.2;
                    var y1 = pointA.y + yd * 0.75;
                    result.push(x0);
                    result.push(y0);
                    result.push(x1);
                    result.push(y1);
                    break;
                case "7":
                    var x0 = pointA.x + xd * 0.3;
                    var y0 = pointA.y - yd * 1.1;
                    var x1 = pointA.x + xd * 0.8;
                    var y1 = pointA.y - yd * 1.6;
                    result.push(x0);
                    result.push(y0);
                    result.push(x1);
                    result.push(y1);
                    break;
                case "8":
                    var x0 = pointA.x + xd * 0.2;
                    var y0 = pointA.y + yd * 0.9;
                    var x1 = pointA.x + xd * 0.8;
                    var y1 = pointA.y + yd * 1.2;
                    result.push(x0);
                    result.push(y0);
                    result.push(x1);
                    result.push(y1);
                    break;
                case "9":
                    var x0 = pointA.x + xd * 0.3;
                    var y0 = pointA.y + yd * 0.1;
                    var x1 = pointA.x + xd * 0.8;
                    var y1 = pointA.y + yd * 0.5;
                    result.push(x0);
                    result.push(y0);
                    result.push(x1);
                    result.push(y1);
                    break;
                case "10":
                    var x0 = pointA.x + xd * 0.2;
                    var y0 = pointA.y - yd * 0.9;
                    var x1 = pointA.x + xd * 0.7;
                    var y1 = pointA.y - yd * 0.5;
                    result.push(x0);
                    result.push(y0);
                    result.push(x1);
                    result.push(y1);
                    break;
                case "12":
                    var x0 = pointA.x + xd * 0.35;
                    var y0 = pointA.y + yd * 0.35;
                    var x1 = pointA.x + xd * 0.9;
                    var y1 = pointA.y + yd * 0.2;
                    result.push(x0);
                    result.push(y0);
                    result.push(x1);
                    result.push(y1);
                    break;
                case "13":
                    var x0 = pointA.x - xd * 0.08;
                    var y0 = pointA.y + yd * 0.5;
                    var x1 = pointA.x + xd * 0.45;
                    var y1 = pointA.y + yd * 0.8;
                    result.push(x0);
                    result.push(y0);
                    result.push(x1);
                    result.push(y1);
                    break;
                case "14":
                    var x0 = pointA.x + xd * 0.3;
                    var y0 = pointA.y + yd * 0.6;
                    var x1 = pointA.x + xd * 0.7;
                    var y1 = pointA.y + yd * 0.9;
                    result.push(x0);
                    result.push(y0);
                    result.push(x1);
                    result.push(y1);
                    break;
                case "15":
                    var x0 = pointA.x + xd * 0.6;
                    var y0 = pointA.y - yd * 0.9;
                    var x1 = pointA.x + xd * 0.8;
                    var y1 = pointA.y + yd * 0.2;
                    result.push(x0);
                    result.push(y0);
                    result.push(x1);
                    result.push(y1);
                    break;
                default:
                    result.push(pointA.x);
                    result.push(pointA.y);
                    result.push(pointB.x);
                    result.push(pointB.y);
                }
                return result;
            };

            var generatePath = function(sectionPath, params) {
                var key = that.circleoneId++;
                var line = '<path fill="none" data-key="' + key + '" id="planeLine-' + key + '" class="fly-line" stroke="rgb(150,150,150)" stroke-width="2" stroke-miterlimit="10"  d="';
                line += sectionPath;
                line += '" />';
                that.svgPathList[key] = {
                    line: line,
                    params: params,
                    id: "planeLine-" + key
                };
                return line;
            };
            var getPathTotalLength = function(id, params) {
                var path = document.getElementById(id);
                if (path) {
                    return path.getTotalLength();
                } else {
                    return that.calTotalLength(params);
                }
            };
            var useSVG = true;
            var generatePlaneImage = function(width, height) {
                if (useSVG) {
                    var str = [width, height].join(" ");
                    var img = '<image xlink:href="' + planeImg + '"  x="0" class="j-plane" id="j-plane" y="-42px" width="90px" height="95px"></image>';
                    planeContainer.append('<svg xmlns="http://www.w3.org/2000/svg"  version="1.1" id="PlaneSvg" x="0px" y="0px" viewBox="0 0 ' + str + '" style="position:absolute;enable-background:new 0 0 ' + str + ' " xml:space="preserve">' + img + "</svg>");
                } else {
                    var img = '<img id="j-plane" src="' + planeImg + '" style="width:90px;height:95px;top:-47.5px;left:-42px;position:absolute"/>';
                    planeContainer.append(img);
                }
            };
            var generateSubSVG = function(width, height, index) {
                var str = [width, height].join(" ");
                $(".j-img-line").append('<svg xmlns="http://www.w3.org/2000/svg"  version="1.1" id="subLineSvg-' + index + '" x="0px" y="0px" viewBox="0 0 ' + str + '" style="enable-background:new 0 0 ; position:absolute;' + str + '; " xml:space="preserve">' + that.svgPathList[index].line + "</svg>");
                if (!that.svgPathList[index].totalLength) {
                    that.svgPathList[index].totalLength = getPathTotalLength("planeLine-" + index, that.svgPathList[index].params);
                }
                if (!that.svgPathList[index].dur) {
                    that.svgPathList[index].dur = parseFloat((that.svgPathList[index].totalLength / speed).toFixed(2));
                }
                var listcp = $(".j-img-line #subLineSvg-" + index + " .fly-line");
                var s = that.svgPathList[index].totalLength;
                listcp.attr("stroke-dasharray", s + " " + s);
                listcp.attr("stroke-dashoffset", s);
            };
            var planeAnimationFrame;
            var curKey, rafSpeed = 1E3, planeV = 0;
            var planeMove = function() {
                var path = that.svgPathList[curKey];
                var point = that.getPointAtLength(path.params, planeV * path.totalLength);
                var matrix = that.calMatrix(point.x, point.y, point.alpha);
                if (matrix) {
                    if (useSVG) {
                        $("#j-plane").attr({
                            transform: matrix
                        });
                    } else {
                        $("#j-plane").css({
                            transform: matrix,
                            webkitTransform: matrix
                        });
                    }
                }
                planeV += 16 / (path.dur * 1E3);
                if (planeV < 1) {
                    planeAnimationFrame = requestAnimationFrame(planeMove);
                } else {
                    playStop();
                }
            };
            var playStop = function() {
                $("#j-plane").hide();
                cancelAnimationFrame(planeAnimationFrame);
            };
            var playMotion = function(index, delay, callback) {
                curKey = index;
                if (noPlaneIndexList.indexOf(index) == -1) {
                    setTimeout(function() {
                        planeV = 0;
                        $("#j-plane").css("display", "block");
                        planeMove();
                    }, delay);
                }
                var time = parseFloat(that.svgPathList[curKey].dur) * 1E3;
                $("#planeLine-" + index).animate({
                    strokeDashoffset: 0
                }, time, function() {
                    callback.call();
                });
            };
            var init = function(imgLine, imgPlane, opt) {
                imgLine = imgLine || $(".j-img-line");
                imgPlane = imgPlane || $(".j-img-plane");
                container = imgLine;
                planeContainer = imgPlane;
                container.height(containerHeight);
                container.width(containerWidth);
                imgPlane.height(containerHeight);
                imgPlane.width(containerWidth);
                container.css({
                    "position": "absolute",
                    "left": -xOffset + "px"
                });
                imgPlane.css({
                    "position": "absolute",
                    "left": -xOffset + "px"
                });
                generatePlaneImage(containerWidth, containerHeight);
                if (svgPrepared) {
                    return;
                }
                opt = opt || {};
                opt.noPlaneIndexList && (noPlaneIndexList = opt.noPlaneIndexList);
                opt.debug = opt.debug || (opt.showPoint || (opt.showControl || opt.showKeyPoint));
                var str = [container.width(), container.height()].join(" ");
                if (opt.debug) {
                    container.append('<svg xmlns="http://www.w3.org/2000/svg"  version="1.1" id="j-svg" x="0px" y="0px" viewBox="0 0 ' + str + '" style="enable-background:new 0 0 ' + str + '; " xml:space="preserve"></svg>');
                    svgPrepared = $(".j-img-line svg");
                }
                var next, curPosition, nextPosition, control, str = "", sectionPath = "", paramsList = [], firstParams, keyPoint, firstSection;
                for (var index in positions) {
                    curPosition = positions[index];
                    next = 1 + parseInt(index);
                    if (!positions[next]) {
                        next = 0;
                    }
                    nextPosition = positions[next];
                    control = getControlPoints(curPosition, nextPosition, index);
                    if (opt.showPoint) {
                        str += '<circle cx="' + curPosition.x + '" cy="' + curPosition.y + '" r="8" style="fill:blue;stroke:rgba(200,200,200,1);stroke-width:2" class="j-point"></circle>';
                        str += '<text x="' + (curPosition.x + 20) + '" + y="' + curPosition.y + '" fill="red">' + index + "</text>";
                    }
                    opt.showControl && (str += '<circle cx="' + control[0] + '" cy="' + control[1] + '" r="10" style="fill:yellow;stroke:rgba(200,200,200,1);stroke-width:3" id="control1"></circle>');
                    opt.showControl && (str += '<circle cx="' + control[2] + '" cy="' + control[3] + '" r="10" style="fill:red;stroke:rgba(200,200,200,1);stroke-width:3" id="control1"></circle>');
                    keyPoint = sections.indexOf(parseInt(index));
                    if (keyPoint > 0) {
                        str += generatePath(sectionPath, paramsList);
                        sectionPath = "";
                        paramsList = [];
                    }
                    if (opt.showKeyPoint && !sectionPath) {
                        str += '<circle cx="' + curPosition.x + '" cy="' + curPosition.y + '" r="5" style="fill:gray;stroke:rgba(200,200,200,1);stroke-width:2" class="j-point"></circle>';
                    }
                    if (sectionPath == "") {
                        sectionPath = "M" + curPosition.x + "," + curPosition.y + "C" + control.join(",") + "," + nextPosition.x + "," + nextPosition.y;
                    } else {
                        sectionPath += "C" + control.join(",") + "," + nextPosition.x + "," + nextPosition.y;
                    }
                    paramsList.push([curPosition.x, curPosition.y].concat(control).concat([nextPosition.x, nextPosition.y]));
                    if (!firstSection) {
                        firstSection = "C" + control.join(",") + "," + nextPosition.x + "," + nextPosition.y;
                        firstParams = [curPosition.x, curPosition.y].concat(control).concat([nextPosition.x, nextPosition.y]);
                    }
                    if (keyPoint == sections.length - 1) {
                        sectionPath += firstSection;
                        paramsList.push(firstParams);
                        str += generatePath(sectionPath, paramsList);
                    }
                }
                opt.debug && svgPrepared.html(str);
            };
            var play = function(i) {
                var index = (i - 1) % (that.circleoneId - 1) + 1;
                generateSubSVG(containerWidth, containerHeight, index);
                playMotion(index, 100, function() {
                    if (index == 1) {
                        $("#subLineSvg-" + (that.circleoneId - 1)).remove();
                    }
                    if (index > 0) {
                        $("#subLineSvg-" + (index - 1)).remove();
                    }
                });
            };
            if (code == 'init') {
                init();
            } else {
                play(index);
            }
        }
    },

    created: function(){
        this.init();
    }
}
</script>

<template>

<section class="tpl-tour mod-os-ios">
    <div id="j-body">
        <div class="wrap j-wrap">
            <div class="mod-img-wrap">
                <div class="j-tpl-wrap">
                    <div v-bind:class="{ 'active' : isCover1 , 'active-end' : isCover2 , 'none' : isCover3}" class="mod-tpl-cover tpl-cover j-mod-tpl-cover j-tpl-cover tpl-preview">
                        <!-- <div class="cover-img j-cover-img j-img-page" v-bind:style="cover.bgStyle"> -->
                        <div class="cover-img j-cover-img j-img-page">
                            <div class="inner-mask none"></div>
                            <div class="inner none">
                                <span class="local from">出发地</span>
                                <span class="airplane"><i class="icon-plane"></i></span>
                                <span class="local to">目的地</span>
                            </div>
                        </div>
                        <div class="album-info">
                            <div class="item name"><p class="t">ALBUM</p><p class="c">{{ title }}</p></div>
                            <div class="item author"><p class="t">AUTHOR</p><p class="c j-lazy-load-nick">{{ author }}</p></div>
                            <div class="item date none"><p class="t">DATE</p><p class="c">2016年11月17日</p></div>
                        </div>
                        <div class="decoration"><div class="line"><div class="line-in"></div></div><span class="code" id="code"></span></div>
                        <div class="cover-cloud j-cover-cloud"><b class="cloud-1"></b><b class="cloud-2"></b></div>
                        <div class="cover-plane"><span class="airplane"><i class="icon-plane"></i></span></div>
                    </div>

                    <div class="mod-tpl-main j-mod-tpl-main" style="display: block;">
                        <div v-bind:class="{ 'show' : isMain }" class="img-list tpl-preview j-img-list" style="width: 1020px !important; height: 1500px !important; transition-duration: 1000ms; transform: translate3d(0px, 0px, 0px);" v-bind:style="slideStyle">
                            <!-- 线条 -->
                            <div class="img-line j-img-line" style="height: 1689.52px; width: 2273.94px; position: absolute; left: -1037.23px;">
                            </div>
                            <!-- 飞机 -->
                            <div class="img-line img-plane j-img-plane"></div>

                            <!-- 拼装 -->
                            <div v-for="(item, i) in items" v-bind:class="item.class" class="item list-page j-img-item" v-bind:style="globalSize">
                                <div class="mask-box"></div>
                                <div v-bind:class="{ 'style-5-4' : item.isW, 'style-2-3' : item.isH, 'style-1-1' : item.isE }" class="img-box">
                                    <div class="box-wrap">
                                        <!--图片区域-->
                                        <div class="box-main">
                                            <div class="img-wrap">
                                                <div class="img-item j-img-page" v-bind:style="item.bgStyle"></div>
                                                <i class="ico-postmark"></i>
                                            </div>
                                        </div>
                                        <!--描述区域-->
                                        <div class="box-txt">
                                            <p class="txt-location" style="visibility: hidden;"></p>
                                            <p class="txt-describe">{{ item.text }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                         </div>
                    </div>

                    <div class="mod-tpl-mask" v-bind:class="{ 'active' : isEnd }">
                        <div class="cover-cloud"><b class="cloud-1"></b><b class="cloud-2"></b></div>
                    </div>
                </div>
                <div class="mod-tpl-over tpl-over-anim j-tpl-over" style="display: none;">
                    <div class="bg-border"></div>
                    <div class="page">
                        <div class="inner">
                            <div class="author">
                                <div class="avatar-w">
                                    <img class="avatar j-over-avatar" data-src="//qlogo3.store.qq.com/qzone/248747210/248747210/100">
                                </div>
                                <span class="name j-owner-name">出品&nbsp;/&nbsp;w</span>
                            </div>
                            <div class="btn j-make-wrap">
                                <div class="svg-wrap">
                                    <svg xmlns="http://www.w3.org/2000/svg" id="svg" class="svg" width="165px" height="40px" viewBox="210 688 300 86" preserveAspectRatio="xMinYMin meet">
                                        <path class="path" fill="#fff" fill-opacity="0" stroke="#00A3FF" stroke-width="2" stroke-dasharray="788" stroke-opacity="0" stroke-miterlimit="4" d="M538.25,698.833c0,3.688,0,56.823,0,59.823 c0,4.188-3,6.5-6.5,6.5c-3.875,0-309.583,0-313.583,0c-3.167,0-5.542-3.5-5.542-6.625s0-57.375,0-60.875s3-6.813,6.813-6.813 s308.063,0,311.979,0C535.333,690.844,538.25,695.521,538.25,698.833z"></path>
                                    </svg>
                                </div> <a href="javascript:void(0);" class="make-btn j-make-btn" style="display:none">我也制作</a>
                            </div>
                            <div class="btn j-share-wrap">
                                <a href="javascript:void(0);" class="share-btn j-share-btn">分享动感影集</a>
                            </div>
                        </div>
                        <div class="tpl-over-logo j-over-logo">
                            <div class="logo-star"></div>
                            <div class="logo-qzone">
                                <div class="logo-qzone-inner"></div>
                            </div>
                            <div class="logo-text">
                                <span class="fen"></span>
                                <span class="xiang"></span>
                                <span class="sheng"></span>
                                <span class="huo"></span>
                                <span class="liu"></span>
                                <span class="zhu"></span>
                                <span class="gan"></span>
                                <span class="dong"></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
</template>

<style scoped>
.j-tpl-wrap{
    position: absolute;
    width: 100%;
    height: 100%;
}

html,body,div,span,iframe,h1,h2,h3,h4,h5,h6,p,blockquote,a,address,em,img,ol,ul,li,fieldset,form,label,legend,table,tbody,tfoot,thead,tr,th,td,i,b,s {
    margin: 0;
    padding: 0;
    border: 0;
    font-weight: inherit;
    font-style: inherit;
    font-size: 100%;
    font-family: Helvetica,'microsoft yahei',Arial
}

ul,ol {
    list-style: none
}

a img {
    border: none;
    vertical-align: top
}

a {
    text-decoration: none
}

button {
    overflow: visible;
    padding: 0;
    margin: 0;
    border: 0 none;
    background-color: transparent
}

button::-moz-focus-inner {
    padding: 0
}

textarea,input {
    background: none;
    padding: 0;
    -webkit-border-radius: 0;
    -moz-border-radius: 0;
    border-radius: 0;
    -webkit-appearance: none
}

input[type=password] {
    -webkit-text-security: disc
}

textarea:focus,input:focus,button:focus {
    outline: none
}

body {
    word-wrap: break-word
}

* {
    -webkit-tap-highlight-color: rgba(0,0,0,0)
}

.play-vue, .tpl-tour, #j-body {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.hide {
    opacity: 0;
    -webkit-transition: all 1s linear;
}

.clearfix:after {
    content: ".";
    height: 0;
    visibility: hidden;
    display: block;
    clear: both;
    font-size: 0;
    line-height: 0
}

.clearfix {
    *zoom: 1
}

.tpl-lovers .tpl-cover {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 100;
    background-color: #fff;
    overflow: hidden
}

.tpl-lovers .tpl-cover .img {
    background-size: cover;
    display: block;
    width: 100%;
    height: 100%
}

.tpl-lovers .love-cover .tpl-cover .love-avator,.tpl-lovers .love-cover .tpl-cover .love-info {
    position: absolute;
    top: 90px;
    width: 160px;
    height: 60px;
    left: 50%;
    -webkit-transform: translateX(-50%);
}

.tpl-lovers .love-cover .tpl-cover .love-avator .lavator {
    width: 60px;
    height: 60px
}

.tpl-lovers .love-cover .tpl-cover .love-avator .img2 {
    width: 24px;
    height: 27px;
    margin: 16px auto
}

.tpl-lovers .love-cover .tpl-cover .love-info {
    overflow: hidden;
    top: 170px;
    width: 200px;
    height: 80px;
    overflow: hidden;
    top: 170px;
    -webkit-transition: opactiy 1s ease
}

.tpl-lovers .love-cover .tpl-cover .love-info .info {
    padding-top: 11px;
    text-align: center;
    font-size: 14px;
    opacity: 0
}

.tpl-lovers .love-img .tpl-cover .custom1 {
    max-height: 350px
}

.tpl-lovers .love-img .tpl-cover .love-info {
    position: absolute;
    bottom: -91px;
    width: 100px;
    height: 140px;
    text-align: center;
    padding: 0 20px
}

.tpl-lovers .love-img .tpl-cover .love-info .img {
    height: 150px;
    width: 100px
}

.tpl-lovers .love-img .tpl-cover .love-down {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 120px
}

.tpl-lovers .love-img .tpl-cover .love-custom {
    position: relative;
    top: 0;
    width: 100%;
    max-height: 350px;
    height: 350px
}

.tpl-lovers .play-animate .avator-left {
    -webkit-animation: slideInLeft 1s 1.5s forwards linear
}

.tpl-lovers .play-animate .avator-right {
    -webkit-animation: slideInRight 1s 1.5s forwards linear
}

.tpl-lovers .fade-cover-out.play-animate .avator-right {
    -webkit-animation: slide-in-right-fade 1s forwards ease
}

.tpl-lovers .fade-cover-out.play-animate .avator-left {
    -webkit-animation: slide-in-left-fade 1s forwards ease
}

.tpl-lovers .play-animate .lover-play-wrap .lover-umbrella.tada {
    -webkit-transform-origin: 50% bottom;
    opacity: 1;
    -webkit-animation: tada 1.5s infinite alternate ease-in-out;
}


html,body {
    width: 100%;
    height: 100%
}

.tpl-tour .wrap,.mod-img-wrap,.tpl-tour .img-list,.list-page {
    height: 100%
}
/*.tpl-tour .j-plane {
    display: block !important;
}*/
.tpl-tour {
    background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/img/tpl-tour/page-bg.jpg?max_age=19830212&d=20151027110721);
    overflow: hidden;
    background-size: 100% 100%!important;
    background-position: top center
}

.tpl-tour .active {
    z-index: 2;
}

.tpl-tour .mod-tpl-cover {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    overflow: hidden
}

.tpl-tour .mod-tpl-cover .cover-img {
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 60%;
    background-size: cover;
    background-position: center;
    overflow: hidden
}

.tpl-tour .mod-tpl-cover .cover-img .inner {
    width: 100%;
    height: 30px;
    position: absolute;
    top: 50%;
    left: 0;
    -webkit-transform: translate3d(0,-50%,0);
    padding: 0 10%
}

.tpl-tour .mod-tpl-cover .cover-img .local {
    width: 40%;
    height: 30px;
    float: left;
    line-height: 30px;
    font-size: 24px;
    color: #fff;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap
}

.tpl-tour .mod-tpl-cover .cover-img .airplane {
    width: 20%;
    height: 30px;
    float: left;
    text-align: center
}

.tpl-tour .mod-tpl-cover .cover-img .airplane .icon-plane {
    display: inline-block;
    width: 28px;
    height: 28px;
    margin: 2px 0 0;
    background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-tour.32.png?max_age=19830212&d=20151027110721);
    background-position: -203px 0
}

.tpl-tour .mod-tpl-cover .cover-img .inner-mask {
    width: 100%;
    height: 100%;
    position: absolute;
    background-color: #000;
    opacity: .5;
    top: 0;
    left: 0
}

.tpl-tour .mod-tpl-cover .album-info {
    width: 240px;
    margin: 0 auto;
    padding: 30px 0 0
}

.tpl-tour .mod-tpl-cover .album-info .item {
    margin-bottom: 20px
}

.tpl-tour .mod-tpl-cover .album-info .c {
    font-size: 19px;
    color: #000;
    height: 25px;
    overflow: hidden;
    white-space: nowrap;
    word-wrap: normal;
    text-overflow: ellipsis
}

.tpl-tour .mod-tpl-cover .album-info .t {
    font-size: 13px;
    color: #999;
    margin-bottom: 5px;
    height: 20px;
    overflow: hidden
}

.tpl-tour .mod-tpl-cover .decoration {
    width: 100%;
    height: 120px;
    position: absolute;
    bottom: 0;
    left: 0;
    text-align: center
}

.tpl-tour .mod-tpl-cover .decoration .line {
    width: 100%;
    height: 1px;
    position: absolute;
    left: 0;
    top: 0
}

.tpl-tour .mod-tpl-cover .decoration .line-in {
    width: 100%;
    height: 100%;
    position: relative;
    top: -1px;
    border-top: 1px dashed #6f6f6f;
    opacity: 0;
    -webkit-transform: translate3d(-100%,0,0);
}

.tpl-tour .mod-tpl-cover .decoration .line:before,.tpl-tour .mod-tpl-cover .decoration .line:after {
    content: "";
    display: block;
    width: 10px;
    height: 10px;
    position: absolute;
    top: -6px;
    background-color: #282828;
    border-radius: 100%
}

.tpl-tour .mod-tpl-cover .decoration .line:before {
    left: -5px
}

.tpl-tour .mod-tpl-cover .decoration .line:after {
    right: -5px
}

.tpl-tour .mod-tpl-cover .decoration .code {
    display: inline-block;
    width: 201px;
    height: 53px;
    position: absolute;
    top: 32px;
    left: 50%;
    -webkit-transform: translate3d(-50%,0,0);
    background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-tour.32.png?max_age=19830212&d=20151027110721);
    background-position: 0 0
}

.tpl-tour .cover-cloud {
    width: 600px;
    height: 745px;
    position: absolute;
    top: 0;
    left: 0;
    -webkit-transform: translate3d(-100%,0,0);
    -webkit-transition: all 1500ms;
}

.tpl-tour .cover-cloud .cloud-1 {
    display: block;
    width: 100%;
    height: 100%;
    z-index: 2;
    position: absolute;
    top: 0;
    left: 0;
    background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/img/tpl-tour/cloud.png?max_age=19830212&d=20151027110721);
    overflow: hidden;
    background-size: 100% 100%;
    background-position: top center
}

.tpl-tour .cover-cloud .cloud-2 {
    display: block;
    width: 100%;
    height: 100%;
    z-index: 2;
    position: absolute;
    top: 0;
    left: 0;
    background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/img/tpl-tour/cloud-2.png?max_age=19830212&d=20151027110721);
    overflow: hidden;
    background-size: 100% 100%;
    background-position: top center
}

.tpl-tour.mod-os-ios .tpl-preview.mod-tpl-cover .cover-img {
    -webkit-transition: all 1000ms 500ms;
    -webkit-transform: translate3d(0,-100%,0);
}

.tpl-tour.mod-os-ios .tpl-preview.mod-tpl-cover .cover-img .inner-mask {
    opacity: 0;
    -webkit-transition: all 1000ms 1000ms;
}

.tpl-tour .tpl-preview.mod-tpl-cover .cover-img .airplane {
    -webkit-transition: all 1200ms 1700ms,opacity 100ms 1700ms;
    -webkit-transform: translate3d(-160%,0,0);
    opacity: 0
}

.tpl-tour .tpl-preview.mod-tpl-cover .album-info .item p {
    -webkit-transition: all 1000ms 1500ms,opacity 100ms 1500ms;
    -webkit-transform: translate3d(0,30px,0);
    opacity: 0
}

.tpl-tour .tpl-preview.mod-tpl-cover .decoration .code {
    height: 0
}

.tpl-tour .tpl-preview.mod-tpl-cover.active .decoration .code {
    -webkit-animation: code-show 2000ms 3000ms linear forwards;
}

.tpl-tour .tpl-preview.mod-tpl-cover.active .decoration .line-in {
    -webkit-animation: line-show 2000ms 3000ms linear forwards;
}

.tpl-tour .tpl-preview.mod-tpl-cover .cover-plane {
    padding-top: 60%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    display: block
}

.tpl-tour .tpl-preview.mod-tpl-cover .cover-plane .airplane {
    float: left;
    text-align: center;
    width: 80%;
    height: 30px;
    position: absolute;
    top: 50%;
    left: 0;
    -webkit-transform: translate3d(-2%,-50%,0);
    padding: 0 10%;
    opacity: 0;
    -webkit-transition: all 1500ms 0ms,opacity 1ms;
    overflow: hidden;
}

.tpl-tour .tpl-preview.mod-tpl-cover .cover-plane .airplane .icon-plane {
    display: inline-block;
    width: 28px;
    height: 28px;
    margin: 2px 0 0;
    background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-tour.32.png?max_age=19830212&d=20151027110721);
    background-position: -203px 0;
    -webkit-transition: opacity 800ms;
}

.tpl-tour .tpl-preview.mod-tpl-cover .decoration .line {
    opacity: 0
}

.tpl-tour .tpl-preview.mod-tpl-cover.active .decoration .line {
    -webkit-transition: all 10ms 1500ms;
    opacity: 1
}

.tpl-tour .mod-tpl-main {
    height: 100%;
    width: 100%;
    position: relative;
    overflow: hidden
}

.tpl-tour .mask-box {
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/img/tpl-tour/markpost-bg.png?max_age=19830212&d=20151027110721);
    background-size: 100% 100%;
    background-position: top center;
    opacity: 0;
    -webkit-transition: all 2500ms 1500ms,opacity 1000ms 1500ms;
}

.tpl-tour .img-box {
    margin: 0 30px;
    position: relative
}

.tpl-tour .img-box .box-wrap {
    width: 100%;
    padding-top: 100%;
    position: relative
}

.tpl-tour .img-box .box-main {
    border: 10px solid #3c3c3c;
    padding: 15px;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    position: absolute;
    top: 0;
    left: 0;
    background-color: #fff;
    overflow: hidden;
    z-index: 2;
    -webkit-box-shadow: 2px 0 8px rgba(0,0,0,.23) inset,-2px 0 8px rgba(0,0,0,.23) inset,0px 9px 16px rgba(0,0,0,.45);
    box-shadow: 2px 0 8px rgba(0,0,0,.23) inset,-2px 0 8px rgba(0,0,0,.23) inset,0px 9px 16px rgba(0,0,0,.45)
}

.tpl-tour .img-box .box-main .img-item {
    width: 100%;
    height: 100%;
    background-size: 100% auto;
    background-size: cover;
    background-position: 50% 50%;
    background-repeat: no-repeat
}

.tpl-tour .img-box .box-txt {
    position: absolute;
    color: #141414;
    font-size: 16px;
    width: 100%;
    text-align: center
}

.tpl-tour .img-box .box-txt .txt-location {
    text-align: center;
    line-height: 40px;
    margin-top: 18px;
    font-weight: bold;
    height: 40px;
    overflow: hidden
}

.tpl-tour .img-box .box-txt .txt-location:before {
    content: '';
    display: inline-block;
    width: 18px;
    height: 18px;
    margin-right: 7px;
    background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-tour.png?max_age=19830212&d=20151027110721);
    background-position: -46px -108px;
    vertical-align: text-top
}

.tpl-tour .img-box .box-txt .txt-describe {
    line-height: 26px;
    min-height: 26px
}

.tpl-tour .style-1-1 {
    top: 16%
}

.tpl-tour .style-1-1 .box-wrap {
    padding-top: 100%
}

.tpl-tour .style-1-1 .box-txt .txt-describe {
    max-height: 52px;
    overflow: hidden
}

.tpl-tour .style-5-4 {
    top: 16%;
    margin: 0 20px
}

.tpl-tour .style-5-4 .box-wrap {
    padding-top: 75%
}

.tpl-tour .style-1-1 .box-txt .txt-describe {
    max-height: 52px;
    overflow: hidden
}

.tpl-tour .style-2-3 {
    top: 6.5%
}

.tpl-tour .style-2-3 .box-wrap {
    padding-top: 146%
}

.tpl-tour .style-2-3 .box-txt {
    text-align: center
}

.tpl-tour .style-2-3 .box-txt .txt-describe {
    height: 26px;
    overflow: hidden;
    white-space: nowrap;
    word-wrap: normal;
    text-overflow: ellipsis
}

.tpl-tour .img-list {
    width: 100%;
    height: 100%;
    -webkit-transition: all 1000ms;
    overflow: visible
}

.tpl-tour .list-page {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    opacity: 1!important
}

.tpl-tour .list-page.animate-1 {
    -webkit-transform: translate3d(0%,0%,0)
}

.tpl-tour .list-page.animate-2 {
    -webkit-transform: translate3d(130%,-30%,0)
}

.tpl-tour .list-page.animate-3 {
    -webkit-transform: translate3d(223%,43.7%,0)
}

.tpl-tour .list-page.animate-4 {
    -webkit-transform: translate3d(202%,163.5%,0)
}

.tpl-tour .list-page.animate-5 {
    -webkit-transform: translate3d(-10.6%,173.1%,0)
}

.tpl-tour .list-page.animate-6 {
    -webkit-transform: translate3d(-163.8%,197.6%,0)
}

.tpl-tour .list-page.animate-7 {
    -webkit-transform: translate3d(-269.1%,119.8%,0)
}

.tpl-tour .list-page.animate-8 {
    -webkit-transform: translate3d(-206.4%,-4.8%,0)
}

.tpl-tour .list-page.animate-9 {
    -webkit-transform: translate3d(-101.1%,-4.8%,0)
}

.tpl-tour .list-page .box-wrap {
    -webkit-transition: all 1500ms 1000ms cubic-bezier(0.19,1,.22,1),opacity 1ms 800ms;
    opacity: 0
}

.tpl-tour .list-page.animate-4 .box-wrap,.tpl-tour .list-page.animate-8 .box-wrap {
    -webkit-transition: all 1500ms 1000ms cubic-bezier(0.19,1,.22,1),opacity 1ms 800ms;
    opacity: 1
}

.tpl-tour .list-page .box-wrap .img-wrap {
    width: 100%;
    height: 100%;
    overflow: hidden
}

.tpl-tour .img-box .box-main .img-item {
    -webkit-transition: all 3000ms 1000ms linear;
    -webkit-transform: scale(1.2);
}

.tpl-tour .list-page.animate-1 .box-txt,.tpl-tour .list-page.animate-7 .box-txt {
    -webkit-transition: all 1200ms 1500ms cubic-bezier(0.19,1,.22,1),opacity 1ms 1500ms;
    opacity: 0;
    -webkit-transform: translate3d(0,-150%,0);
}

.tpl-tour .list-page.animate-1 .box-wrap {
    -webkit-transform: translate3d(0,-200%,0);
}

.tpl-tour .list-page.animate-2 .box-wrap {
    -webkit-transform: translate3d(-200%,0,0);
}

.tpl-tour .list-page.animate-3 .box-wrap, .tpl-tour .list-page.animate-9 .box-wrap {
    -webkit-transform: translate3d(200%,0,0);
}

.tpl-tour .list-page.animate-4 .box-wrap {
    -webkit-transform: translate3d(0,0,0);
}

.tpl-tour .list-page.animate-5 .box-wrap {
    -webkit-transform: translate3d(200%,0,0);
}

.tpl-tour .list-page.animate-6 .box-wrap {
    -webkit-transform: translate3d(-200%,0,0);
}

.tpl-tour .list-page.animate-7 .box-wrap {
    -webkit-transform: translate3d(0,-200%,0);
}

.tpl-tour .list-page.animate-8 .box-wrap {
    -webkit-transform: translate3d(0,0,0);
}

.tpl-tour .list-page.animate-1 .mask-box {
    -webkit-transform: translate3d(0,-20%,0);
}

.tpl-tour .list-page.animate-2 .mask-box {
    -webkit-transform: translate3d(-20%,0,0);
}

.tpl-tour .list-page.animate-3 .mask-box, .tpl-tour .list-page.animate-9 .mask-box {
    -webkit-transform: translate3d(20%,0,0);
}

.tpl-tour .list-page.animate-4 .mask-box {
    -webkit-transform: translate3d(0,20%,0);
}

.tpl-tour .list-page.animate-5 .mask-box {
    -webkit-transform: translate3d(20%,0,0);
}

.tpl-tour .list-page.animate-6 .mask-box {
    -webkit-transform: translate3d(-20%,0,0);
}

.tpl-tour .list-page.animate-7 .mask-box {
    -webkit-transform: translate3d(0,-20%,0);
}

.tpl-tour .list-page.animate-8 .mask-box {
    -webkit-transform: translate3d(-20%,20%,0);
}

.tpl-tour .list-page.style-5-4 .mask-box {
    -webkit-transition-delay: 800ms,800ms!important;
}

.tpl-tour .list-page.animate-8.style-5-4 .mask-box {
    -webkit-transition-delay: 500ms,500ms!important;
}

.tpl-tour .list-page.animate-1 .ico-postmark {
    position: absolute;
    width: 75px;
    height: 50px;
    background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-tour.png?max_age=19830212&d=20151027110721);
    background-position: 0 -56px;
    top: 5px;
    right: 5px
}

.tpl-tour .list-page.animate-2 .ico-postmark {
    position: absolute;
    width: 75px;
    height: 50px;
    background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-tour.png?max_age=19830212&d=20151027110721);
    background-position: 0 -56px;
    top: 15px;
    left: 15px
}

.tpl-tour .list-page.animate-3 .ico-postmark, .tpl-tour .list-page.animate-9 .ico-postmark {
    position: absolute;
    width: 75px;
    height: 50px;
    background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-tour.png?max_age=19830212&d=20151027110721);
    background-position: 0 -56px;
    top: 20px;
    left: 20px
}

.tpl-tour .list-page.animate-4 .ico-postmark {
    position: absolute;
    width: 44px;
    height: 44px;
    background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-tour.png?max_age=19830212&d=20151027110721);
    background-position: 0 -108px;
    top: 5px;
    right: 5px
}

.tpl-tour .list-page.animate-5 .ico-postmark {
    position: absolute;
    width: 44px;
    height: 44px;
    background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-tour.png?max_age=19830212&d=20151027110721);
    background-position: 0 -108px;
    bottom: 5px;
    right: 5px
}

.tpl-tour .list-page.animate-6 .ico-postmark {
    position: absolute;
    width: 72px;
    height: 54px;
    background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-tour.png?max_age=19830212&d=20151027110721);
    background-position: 0 0;
    top: 5px;
    right: 5px
}

.tpl-tour .list-page.animate-7 .ico-postmark {
    position: absolute;
    width: 44px;
    height: 44px;
    background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-tour.png?max_age=19830212&d=20151027110721);
    background-position: 0 -108px;
    bottom: 5px;
    right: 5px
}

.tpl-tour .list-page.animate-8 .ico-postmark {
    position: absolute;
    width: 44px;
    height: 44px;
    background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-tour.png?max_age=19830212&d=20151027110721);
    background-position: 0 -108px;
    top: 5px;
    right: 5px
}

.tpl-tour .tpl-preview .list-page .ico-postmark {
    -webkit-transition: opacity 500ms 3000ms linear;
    opacity: 0
}

.tpl-tour .tpl-preview .list-page.active .ico-postmark {
    opacity: 1
}

.tpl-tour.mod-os-ios .mod-tpl-cover.active .cover-img {
    -webkit-transform: translate3d(0,0,0);
}

.tpl-tour.mod-os-ios .mod-tpl-cover.active .cover-img .inner-mask {
    opacity: .5
}

.tpl-tour .mod-tpl-cover.active .cover-img .airplane {
    -webkit-transform: translate3d(-15%,0,0);
    opacity: 1
}

.tpl-tour .mod-tpl-cover.active .album-info .name .t {
    -webkit-transition-delay: 1500ms,1500ms;
}

.tpl-tour .mod-tpl-cover.active .album-info .name .c {
    -webkit-transition-delay: 1700ms,1700ms;
}

.tpl-tour .mod-tpl-cover.active .album-info .author .t {
    -webkit-transition-delay: 1900ms,1900;
}

.tpl-tour .mod-tpl-cover.active .album-info .author .c {
    -webkit-transition-delay: 2100ms,2100ms;
}

.tpl-tour .mod-tpl-cover.active .album-info .date .t {
    -webkit-transition-delay: 2300ms,2300ms;
}

.tpl-tour .mod-tpl-cover.active .album-info .date .c {
    -webkit-transition-delay: 2500ms,2500ms;
}

.tpl-tour .mod-tpl-cover.active .album-info .item p {
    -webkit-transform: translate3d(0,0,0);
    opacity: 1
}

.tpl-tour .mod-tpl-cover.active-end .cover-cloud {
    -webkit-transform: translate3d(0,0,0);
}

.tpl-tour .mod-tpl-cover.active-end {
    opacity: 0;
    -webkit-transition: opacity 500ms 800ms;
}

.tpl-tour .mod-tpl-cover.active-end .cover-plane {
    display: block
}

.tpl-tour .mod-tpl-cover.active-end .cover-img .airplane {
    -webkit-transition: all 1ms 0ms;
    opacity: 0
}

.tpl-tour .mod-tpl-cover.active-end .cover-plane .airplane {
    float: left;
    text-align: center;
    -webkit-transform: translate3d(100%,-50%,0) scale(5);
    opacity: 1
}

.tpl-tour .mod-tpl-cover.active-end .cover-plane .airplane .icon-plane {
    opacity: 0
}

.tpl-tour .tpl-preview.mod-tpl-cover .cover-plane .airplane:before {
    content: '';
    position: absolute;
    width: 28px;
    height: 28px;
    top: 50%;
    left: 50%;
    margin: -14px 0 0 -14px;
    background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-tour.32.png?max_age=19830212&d=20151027110721);
    background-position: -203px -30px
}

.tpl-tour .mod-tpl-mask {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    overflow: hidden
}

.tpl-tour .mod-tpl-mask .cover-cloud {
    -webkit-transform: translate3d(0,0,0);
}

.tpl-tour .mod-tpl-mask .cover-cloud .cloud-1 {
    -webkit-transition: all 1500ms;
    -webkit-transform: translate3d(100%,0,0);
}

.tpl-tour .mod-tpl-mask .cover-cloud .cloud-2 {
    -webkit-transition: all 1500ms;
    -webkit-transform: translate3d(-100%,0,0);
}

.tpl-tour .mod-tpl-mask.active .cover-cloud .cloud-1,.tpl-tour .mod-tpl-mask.active .cover-cloud .cloud-2 {
    -webkit-transform: translate3d(-20%,0,0);
}

.tpl-tour .list-page.active .mask-box {
    -webkit-transform: translate3d(0,0,0);
    opacity: 1
}

.tpl-tour .list-page.active .box-wrap {
    -webkit-transform: translate3d(0,0,0);
    opacity: 1
}

.tpl-tour .list-page.active .box-txt,.tpl-tour .list-page.active .box-txt {
    opacity: 1;
    -webkit-transform: translate3d(0,0,0);
}

.tpl-tour .active .img-box .box-main .img-item {
    -webkit-transform: scale(1);
}

.tpl-tour.mod-os-android .mod-tpl-cover .cover-img {
    -webkit-transform: translate3d(0,0%,0);
}

.tpl-tour.mod-os-android .mod-tpl-cover .cover-img .inner-mask {
    -webkit-transition: none;
    opacity: .3
}

@media(max-height:626px) {
}

@media(max-height:563px) {
    .tpl-tour .style-2-3 {
        top: 3.5%
    }
}

@media(max-height:562px) {
    .tpl-tour .style-2-3 {
        top: 1%
    }
}

@media(max-height:531px) {
    .tpl-tour .mod-tpl-cover .decoration {
        opacity: 0
    }

    .tpl-tour .style-2-3 {
        top: 3.5%;
        margin: 0 auto;
        max-width: 280px
    }

    .tpl-tour .style-2-3 .box-txt .txt-location {
        margin-top: 5px
    }

    .tpl-tour .style-1-1 {
        top: 10%
    }
}

@media(max-height:458px) {
    .tpl-tour .style-2-3 {
        margin: 0 45px
    }

    .tpl-tour .style-1-1 {
        top: 5%
    }
}

@media(max-height:416px) {
    .tpl-tour .style-2-3 {
        margin: 0 60px
    }
}

@media(max-height:372px) {
    .tpl-tour .mod-tpl-cover .album-info {
        padding-top: 5px
    }

    .tpl-tour .mod-tpl-cover .album-info .item {
        margin-bottom: 15px
    }

    .tpl-tour .style-2-3 {
        top: 1%
    }

    .tpl-tour .style-2-3 .box-txt .txt-location {
        margin-top: 0
    }

    .tpl-tour .style-1-1 {
        top: 1%
    }

    .tpl-tour .style-1-1 .box-txt .txt-location {
        margin-top: 5px
    }

    .tpl-tour .style-5-4 {
        top: 8%
    }
}

@media(min-width:321px) and (max-width:360px) {
    .tpl-tour .mod-album-edit .style-2-3 {
        max-width: 200px;
        margin: 0 auto
    }
}

@media(min-width:375px) {
    .tpl-tour .style-2-3 {
        margin: 0 auto;
        max-width: 315px;
        top: 3.5%
    }
}

@media(min-width:414px) {
    .tpl-tour .style-2-3 {
        margin: 0 auto;
        max-width: 340px;
        top: 3.5%
    }
}

.tpl-tour.edit-body-bg {
    background-image: none
}

.tpl-tour .mod-album-edit .edit-content {
    background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/img/tpl-tour/page-bg.jpg?max_age=19830212&d=20151027110721)
}

.tpl-tour .mod-album-edit .mod-tpl-cover .cover-img {
    -webkit-transform: translate3d(0,0,0)
}

.tpl-tour .mod-album-edit .mod-tpl-cover .decoration {
    display: none
}

.tpl-tour .mod-album-edit .mask-box,.tpl-tour .mod-album-edit .list-page .box-wrap {
    opacity: 1
}

.tpl-tour .mod-album-edit .list-page.animate-1 .box-txt,.tpl-tour .mod-album-edit .list-page.animate-7 .box-txt {
    opacity: 1;
    -webkit-transform: translate3d(0,0,0)
}

.tpl-tour .mod-album-edit .cover-cloud {
    display: none
}

.tpl-tour .mod-album-edit .mod-tpl-cover .cover-img .local {
    width: 38%
}

.tpl-tour .mod-album-edit .list-page.animate-1,.tpl-tour .mod-album-edit .list-page.animate-2,.tpl-tour .mod-album-edit .list-page.animate-3,.tpl-tour .mod-album-edit .list-page.animate-4,.tpl-tour .mod-album-edit .list-page.animate-5,.tpl-tour .mod-album-edit .list-page.animate-6,.tpl-tour .mod-album-edit .list-page.animate-7,.tpl-tour .mod-album-edit .list-page.animate-8,.tpl-tour .mod-album-edit .list-page.animate-9 {
    -webkit-transform: translate3d(0,0,0)
}

.tpl-tour .mod-album-edit .list-page.animate-1 .box-wrap,.tpl-tour .mod-album-edit .list-page.animate-2 .box-wrap,.tpl-tour .mod-album-edit .list-page.animate-3 .box-wrap,.tpl-tour .mod-album-edit .list-page.animate-4 .box-wrap,.tpl-tour .mod-album-edit .list-page.animate-5 .box-wrap,.tpl-tour .mod-album-edit .list-page.animate-6 .box-wrap,.tpl-tour .mod-album-edit .list-page.animate-7 .box-wrap,.tpl-tour .mod-album-edit .list-page.animate-8 .box-wrap,.tpl-tour .mod-album-edit .list-page.animate-9 .box-wrap {
    -webkit-transform: translate3d(0,0,0);
}

.tpl-tour .mod-album-edit .list-page.animate-1 .mask-box,.tpl-tour .mod-album-edit .list-page.animate-2 .mask-box,.tpl-tour .mod-album-edit .list-page.animate-3 .mask-box,.tpl-tour .mod-album-edit .list-page.animate-4 .mask-box,.tpl-tour .mod-album-edit .list-page.animate-5 .mask-box,.tpl-tour .mod-album-edit .list-page.animate-6 .mask-box,.tpl-tour .mod-album-edit .list-page.animate-7 .mask-box,.tpl-tour .mod-album-edit .list-page.animate-8 .mask-box,.tpl-tour .mod-album-edit .list-page.animate-9 .mask-box {
    -webkit-transform: translate3d(0,0,0);
}

@media only screen and (-webkit-min-device-pixel-ratio:1.25),only screen and (min-resolution:120dpi),only screen and (min-resolution:1.25dppx) {
    .tpl-tour {
        background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/img/tpl-tour/page-bg@2x.jpg?max_age=19830212&d=20151027110721);
        background-size: 375px 602px
    }

    .tpl-tour .mod-tpl-cover .cover-img .airplane .icon-plane {
        background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-tour.32@2x.png?max_age=19830212&d=20151027110721);
        background-size: 231px 58px;
        background-position: -203px 0
    }

    .tpl-tour .mod-tpl-cover .decoration .code {
        background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-tour.32@2x.png?max_age=19830212&d=20151027110721);
        background-size: 231px 58px;
        background-position: 0 0
    }

    .tpl-tour .tpl-preview.mod-tpl-cover .cover-plane .airplane .icon-plane {
        background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-tour.32@2x.png?max_age=19830212&d=20151027110721);
        background-size: 231px 58px;
        background-position: -203px 0
    }

    .tpl-tour .mask-box {
        background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/img/tpl-tour/markpost-bg@2x.png?max_age=19830212&d=20151027110721);
        background-size: 379px 603px
    }

    .tpl-tour .img-box .box-txt .txt-location:before {
        background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-tour@2x.png?max_age=19830212&d=20151027110721);
        background-size: 75px 152px;
        background-position: -46px -108px
    }

    .tpl-tour .list-page.animate-1 .ico-postmark {
        background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-tour@2x.png?max_age=19830212&d=20151027110721);
        background-size: 75px 152px;
        background-position: 0 -56px
    }

    .tpl-tour .list-page.animate-2 .ico-postmark {
        background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-tour@2x.png?max_age=19830212&d=20151027110721);
        background-size: 75px 152px;
        background-position: 0 -56px
    }

    .tpl-tour .list-page.animate-3 .ico-postmark, .tpl-tour .list-page.animate-9 .ico-postmark {
        background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-tour@2x.png?max_age=19830212&d=20151027110721);
        background-size: 75px 152px;
        background-position: 0 -56px
    }

    .tpl-tour .list-page.animate-4 .ico-postmark {
        background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-tour@2x.png?max_age=19830212&d=20151027110721);
        background-size: 75px 152px;
        background-position: 0 -108px
    }

    .tpl-tour .list-page.animate-5 .ico-postmark {
        background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-tour@2x.png?max_age=19830212&d=20151027110721);
        background-size: 75px 152px;
        background-position: 0 -108px
    }

    .tpl-tour .list-page.animate-6 .ico-postmark {
        background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-tour@2x.png?max_age=19830212&d=20151027110721);
        background-size: 75px 152px;
        background-position: 0 0
    }

    .tpl-tour .list-page.animate-7 .ico-postmark {
        background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-tour@2x.png?max_age=19830212&d=20151027110721);
        background-size: 75px 152px;
        background-position: 0 -108px
    }

    .tpl-tour .list-page.animate-8 .ico-postmark {
        background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-tour@2x.png?max_age=19830212&d=20151027110721);
        background-size: 75px 152px;
        background-position: 0 -108px
    }

    .tpl-tour .tpl-preview.mod-tpl-cover .cover-plane .airplane:before {
        background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-tour.32@2x.png?max_age=19830212&d=20151027110721);
        background-size: 231px 58px;
        background-position: -203px -30px
    }

    .tpl-tour .mod-album-edit .edit-content {
        background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/img/tpl-tour/page-bg@2x.jpg?max_age=19830212&d=20151027110721);
        background-size: 375px 602px
    }
}

.show {
    display: block !important;
}
#CssGaga {
    content: "151027110721,coi,334"
}

.mod-os-ios {
    height: 100%;
}


/**
 * tour animate
 */

@-webkit-keyframes pop-heart {
    0% {
        opacity: 1;
        transform: scale(0.6) rotate(-30deg) translate(-5px,-10px);
        -webkit-transform: scale(0.6) rotate(-30deg) translate(-5px,-10px)
    }

    100% {
        opacity: 0;
        transform: scale(0.6) rotate(-30deg) translate(-15px,-50px);
        -webkit-transform: scale(0.6) rotate(-30deg) translate(-15px,-50px)
    }
}

@-webkit-keyframes pop-heart-right {
    0% {
        opacity: 1;
        transform: scale(0.6) rotate(30deg) translate(-21px,-10px);
        -webkit-transform: scale(0.6) rotate(30deg) translate(-21px,-10px)
    }

    100% {
        opacity: 0;
        transform: scale(0.6) rotate(30deg) translate(-28px,-55px);
        -webkit-transform: scale(0.6) rotate(30deg) translate(-28px,-55px)
    }
}

@-webkit-keyframes slideInLeft {
    0% {
        -webkit-transform: translate3d(-100%,0,0);
        transform: translate3d(-100%,0,0);
        opacity: 0
    }

    80% {
        opacity: 1;
        -webkit-transform: translate3d(20px,0,0);
        transform: translate3d(20px,0,0)
    }

    100% {
        opacity: 1;
        -webkit-transform: translate3d(0,0,0);
        transform: translate3d(0,0,0)
    }
}

@keyframes slideInLeft {
    0% {
        -webkit-transform: translate3d(-100%,0,0);
        transform: translate3d(-100%,0,0);
        opacity: 0
    }

    80% {
        opacity: 1;
        -webkit-transform: translate3d(20px,0,0);
        transform: translate3d(20px,0,0)
    }

    100% {
        opacity: 1;
        -webkit-transform: translate3d(0,0,0);
        transform: translate3d(0,0,0)
    }
}

@-webkit-keyframes slide-in-left-fade {
    0% {
        opacity: 1;
        -webkit-transform: translate3d(0,0,0);
        transform: translate3d(0,0,0)
    }

    100% {
        -webkit-transform: translate3d(30px,0,0);
        transform: translate3d(30px,0,0);
        opacity: 0
    }
}

@-webkit-keyframes slide-in-right-fade {
    0% {
        opacity: 1;
        -webkit-transform: translate3d(0,0,0);
        transform: translate3d(0,0,0)
    }

    100% {
        -webkit-transform: translate3d(-30px,0,0);
        transform: translate3d(-30px,0,0);
        opacity: 0
    }
}

@-webkit-keyframes slideInRight {
    0% {
        -webkit-transform: translate3d(100%,0,0);
        transform: translate3d(100%,0,0);
        opacity: 0
    }

    80% {
        opacity: 1;
        -webkit-transform: translate3d(-20px,0,0);
        transform: translate3d(-20px,0,0)
    }

    100% {
        opacity: 1;
        -webkit-transform: translate3d(0,0,0);
        transform: translate3d(0,0,0)
    }
}

@keyframes slideInRight {
    0% {
        -webkit-transform: translate3d(100%,0,0);
        transform: translate3d(100%,0,0);
        opacity: 0
    }

    80% {
        opacity: 1;
        -webkit-transform: translate3d(-20px,0,0);
        transform: translate3d(-20px,0,0)
    }

    100% {
        opacity: 1;
        -webkit-transform: translate3d(0,0,0);
        transform: translate3d(0,0,0)
    }
}

@keyframes slideWidth {
    0% {
        width: 0
    }

    100% {
        width: 200px
    }
}

@-webkit-keyframes slideWidth {
    0% {
        width: 0
    }

    100% {
        width: 200px
    }
}

@-webkit-keyframes mid-avator-anim {
    0% {
        opacity: 1;
        transform: scale(.8);
        -webkit-transform: scale(.8)
    }

    50% {
        opacity: 1;
        transform: scale(1);
        -webkit-transform: scale(1)
    }

    100% {
        opacity: 1;
        transform: scale(.8);
        -webkit-transform: scale(.8)
    }
}

@keyframes mid-avator-anim {
    0% {
        opacity: 1;
        transform: scale(.8);
        -webkit-transform: scale(.8)
    }

    50% {
        opacity: 1;
        transform: scale(1);
        -webkit-transform: scale(1)
    }

    100% {
        opacity: 1;
        transform: scale(.8);
        -webkit-transform: scale(.8)
    }
}

@-webkit-keyframes draw-words {
    0% {
        opacity: 0
    }

    20% {
        opacity: .2
    }

    40% {
        opacity: .4
    }

    60% {
        opacity: .6
    }

    80% {
        opacity: .8
    }

    100% {
        opacity: 1
    }
}

@keyframes draw-words {
    0% {
        opacity: 0
    }

    20% {
        opacity: .2
    }

    40% {
        opacity: .4
    }

    60% {
        opacity: .6
    }

    80% {
        opacity: .8
    }

    100% {
        opacity: 1
    }
}

@-webkit-keyframes bgp-bg {
    0% {
        transform: translate3d(0,0,0);
        -webkit-transform: translate3d(0,0,0)
    }

    100% {
        transform: translate3d(-200px,0,0);
        -webkit-transform: translate3d(-200px,0,0)
    }
}

@keyframes bgp-bg {
    0% {
        transform: translate3d(0,0,0);
        -webkit-transform: translate3d(0,0,0)
    }

    100% {
        transform: translate3d(-200px,0,0);
        -webkit-transform: translate3d(-200px,0,0)
    }
}

@-webkit-keyframes mask-left-bg {
    0% {
        transform: translate3d(0,0,0);
        -webkit-transform: translate3d(0,0,0)
    }

    100% {
        transform: translate3d(0,-578px,0);
        -webkit-transform: translate3d(0,-578px,0)
    }
}

@keyframes mask-left-bg {
    0% {
        transform: translate3d(0,0,0);
        -webkit-transform: translate3d(0,0,0)
    }

    100% {
        transform: translate3d(0,-578px,0);
        -webkit-transform: translate3d(0,-578px,0)
    }
}

@-webkit-keyframes mask-bottom-bg {
    0% {
        transform: translate3d(0,0,0);
        -webkit-transform: translate3d(0,0,0)
    }

    100% {
        transform: translate3d(-100%,0,0);
        -webkit-transform: translate3d(-100%,0,0)
    }
}

@keyframes mask-bottom-bg {
    0% {
        transform: translate3d(0,0,0);
        -webkit-transform: translate3d(0,0,0)
    }

    100% {
        transform: translate3d(-100%,0,0);
        -webkit-transform: translate3d(-100%,0,0)
    }
}

@-webkit-keyframes mask-wave {
    0% {
        transform: translate3d(0,0,0);
        -webkit-transform: translate3d(0,0,0)
    }

    100% {
        transform: translate3d(-100%,0,0);
        -webkit-transform: translate3d(-100%,0,0)
    }
}

@keyframes mask-wave {
    0% {
        transform: translate3d(0,0,0);
        -webkit-transform: translate3d(0,0,0)
    }

    100% {
        transform: translate3d(-100%,0,0);
        -webkit-transform: translate3d(-100%,0,0)
    }
}

@-webkit-keyframes mask-lover {
    0% {
        transform: translate3d(0,0,0);
        -webkit-transform: translate3d(0,0,0)
    }

    100% {
        transform: translate3d(0,-95px,0);
        -webkit-transform: translate3d(0,-95px,0)
    }
}

@keyframes mask-lover {
    0% {
        transform: translate3d(0,0,0);
        -webkit-transform: translate3d(0,0,0)
    }

    100% {
        transform: translate3d(0,-95px,0);
        -webkit-transform: translate3d(0,-95px,0)
    }
}

@-webkit-keyframes mail-mask {
    0% {
        opacity: .8
    }

    100% {
        opacity: 0
    }
}

@keyframes mail-mask {
    0% {
        opacity: .8
    }

    100% {
        opacity: 0
    }
}

@-webkit-keyframes fade-in-down {
    from {
        opacity: 0;
        -webkit-transform: translate3d(0,-100%,0);
        transform: translate3d(0,-100%,0)
    }

    100% {
        opacity: 1;
        -webkit-transform: none;
        transform: none
    }
}

@-webkit-keyframes fade-in-up {
    from {
        opacity: 0;
        -webkit-transform: translate3d(0,100%,0);
        transform: translate3d(0,100%,0)
    }

    100% {
        opacity: 1;
        -webkit-transform: none;
        transform: none
    }
}

@keyframes fade-in-down {
    from {
        opacity: 0;
        -webkit-transform: translate3d(0,-100%,0);
        transform: translate3d(0,-100%,0)
    }

    100% {
        opacity: 1;
        -webkit-transform: none;
        transform: none
    }
}

@-webkit-keyframes fade-in-up {
    from {
        opacity: 0;
        -webkit-transform: translate3d(0,100%,0);
        transform: translate3d(0,100%,0)
    }

    100% {
        opacity: 1;
        -webkit-transform: none;
        transform: none
    }
}

@keyframes fade-in-up {
    from {
        opacity: 0;
        -webkit-transform: translate3d(0,100%,0);
        transform: translate3d(0,100%,0)
    }

    100% {
        opacity: 1;
        -webkit-transform: none;
        transform: none
    }
}

@-webkit-keyframes fade-out {
    from {
        opacity: 1
    }

    100% {
        opacity: 0
    }
}

@keyframes fade-out {
    from {
        opacity: 1
    }

    100% {
        opacity: 0
    }
}

@-webkit-keyframes fade {
    0%,100% {
        opacity: 0
    }
}

@-webkit-keyframes fade-in-words {
    0% {
        transform: translate3d(0,0,0);
        -webkit-transform: translate3d(0,0,0)
    }

    100% {
        transform: translate3d(210px,0,0);
        -webkit-transform: translate3d(210px,0,0)
    }
}

@-webkit-keyframes fade-words {
    0% {
        opacity: 1;
        transform: translate3d(0,90px,0);
        -webkit-transform: translate3d(0,90px,0)
    }

    100% {
        opacity: 1;
        transform: translate3d(0,160px,0);
        -webkit-transform: translate3d(0,160px,0)
    }
}

@keyframes fade-words {
    0% {
        opacity: 1;
        transform: translate3d(0,90px,0);
        -webkit-transform: translate3d(0,90px,0)
    }

    100% {
        opacity: 1;
        transform: translate3d(0,160px,0);
        -webkit-transform: translate3d(0,160px,0)
    }
}

@keyframes zoom-in {
    from {
        opacity: 0;
        -webkit-transform: scale3d(.3,.3,.3);
        transform: scale3d(.3,.3,.3)
    }

    100% {
        opacity: 1
    }
}

@-webkit-keyframes zoom-in {
    from {
        opacity: 0;
        -webkit-transform: scale3d(.3,.3,.3);
        transform: scale3d(.3,.3,.3)
    }

    100% {
        opacity: 1
    }
}

@-webkit-keyframes fadeIn {
    from {
        opacity: 0
    }

    100% {
        opacity: 1
    }
}

@keyframes fadeIn {
    from {
        opacity: 0
    }

    100% {
        opacity: 1
    }
}

@-webkit-keyframes tada {
    0% {
        -webkit-transform: rotate(0);
        transform: rotate(0)
    }

    50% {
        -webkit-transform: rotate(-8deg);
        transform: rotate(-8deg)
    }

    100% {
        -webkit-transform: rotate(8deg);
        transform: rotate(8deg)
    }
}

@-webkit-keyframes pop-heart-1 {
    0% {
        opacity: 1;
        transform: translate3d(0,-10px,0) rotate(20deg) scale(0.5);
        -webkit-transform: translate3d(0,-10px,0) rotate(20deg) scale(0.5)
    }

    100% {
        transform: translate3d(0,-40px,0) rotate(20deg) scale(0.6);
        -webkit-transform: translate3d(0,-40px,0) rotate(20deg) scale(0.6);
        opacity: 0
    }
}

@keyframes pop-heart-1 {
    0% {
        opacity: 1;
        transform: translate3d(0,-10px,0) rotate(20deg) scale(0.9);
        -webkit-transform: translate3d(0,-10px,0) rotate(20deg) scale(0.9)
    }

    100% {
        transform: translate3d(0,-40px,0) rotate(20deg) scale(1);
        -webkit-transform: translate3d(0,-40px,0) rotate(20deg) scale(1);
        opacity: 0
    }
}

@-webkit-keyframes pop-heart-2 {
    0% {
        opacity: 1;
        transform: translate3d(0,-10px,0) scale(0.9);
        -webkit-transform: translate3d(0,-10px,0) scale(0.9)
    }

    100% {
        transform: translate3d(0,-50px,0) scale(1);
        -webkit-transform: translate3d(0,-50px,0) scale(1);
        opacity: 0
    }
}

@keyframes pop-heart-2 {
    0% {
        opacity: 1;
        transform: translate3d(0,-10px,0) scale(0.9);
        -webkit-transform: translate3d(0,-10px,0) scale(0.9)
    }

    100% {
        transform: translate3d(0,-50px,0) scale(1);
        -webkit-transform: translate3d(0,-50px,0) scale(1);
        opacity: 0
    }
}

@-webkit-keyframes pop-heart-3 {
    0% {
        opacity: 1;
        transform: translate3d(0,-10px,0) rotate(20deg) scale(0.6);
        -webkit-transform: translate3d(0,-10px,0) rotate(20deg) scale(0.6)
    }

    100% {
        transform: translate3d(0,-30px,0) rotate(20deg) scale(0.6);
        -webkit-transform: translate3d(0,-30px,0) rotate(20deg) scale(0.6);
        opacity: 0
    }
}

@keyframes pop-heart-3 {
    0% {
        opacity: 1;
        transform: translate3d(0,-10px,0) rotate(20deg) scale(0.6);
        -webkit-transform: translate3d(0,-10px,0) rotate(20deg) scale(0.6)
    }

    100% {
        transform: translate3d(0,-30px,0) rotate(20deg) scale(0.6);
        -webkit-transform: translate3d(0,-30px,0) rotate(20deg) scale(0.6);
        opacity: 0
    }
}

@-webkit-keyframes pop-heart-up {
    0% {
        opacity: 1;
        transform: translate3d(0,0,0);
        -webkit-transform: translate3d(0,0,0)
    }

    100% {
        transform: translate3d(0,-300%,0);
        -webkit-transform: translate3d(0,-300%,0);
        opacity: 0
    }
}

@keyframes pop-heart-up {
    0% {
        transform: translate3d(0,0,0);
        -webkit-transform: translate3d(0,0,0)
    }

    100% {
        transform: translate3d(0,-300%,0);
        -webkit-transform: translate3d(0,-300%,0);
        opacity: 0
    }
}

@-webkit-keyframes wheel-mask {
    0% {
        transform: translate3d(0,0,0);
        -webkit-transform: translate3d(0,0,0)
    }

    100% {
        transform: translate3d(-170px,0,0);
        -webkit-transform: translate3d(-170px,0,0);
        opacity: 0
    }
}

@keyframes wheel-mask {
    0% {
        transform: translate3d(0,0,0);
        -webkit-transform: translate3d(0,0,0)
    }

    100% {
        transform: translate3d(-170px,0,0);
        -webkit-transform: translate3d(-170px,0,0);
        opacity: 0
    }
}

@-webkit-keyframes wheel-move {
    0% {
        transform: translate3d(0,0,0);
        -webkit-transform: translate3d(0,0,0)
    }

    100% {
        transform: translate3d(-20px,-30px,0);
        -webkit-transform: translate3d(-20px,-30px,0)
    }
}

@keyframes wheel-move {
    0% {
        transform: translate3d(0,0,0);
        -webkit-transform: translate3d(0,0,0)
    }

    100% {
        transform: translate3d(-20px,-30px,0);
        -webkit-transform: translate3d(-20px,-30px,0)
    }
}

@-webkit-keyframes clound-move {
    0% {
        transform: translate3d(0,0,0);
        -webkit-transform: translate3d(0,0,0)
    }

    100% {
        transform: translate3d(-90px,0,0);
        -webkit-transform: translate3d(-90px,0,0)
    }
}

@keyframes clound-move {
    0% {
        transform: translate3d(0,0,0);
        -webkit-transform: translate3d(0,0,0)
    }

    100% {
        transform: translate3d(-90px,0,0);
        -webkit-transform: translate3d(-90px,0,0)
    }
}

@-webkit-keyframes slide-right {
    from {
        -webkit-transform: translate3d(100%,0,0) rotate(-5deg);
        transform: translate3d(100%,0,0) rotate(-5deg);
        visibility: visible
    }

    40% {
        -webkit-transform: translate3d(0,0,0) rotate(5deg);
        transform: translate3d(0,0,0) rotate(5deg)
    }

    50% {
        -webkit-transform: translate3d(0,0,0) rotate(0);
        transform: translate3d(0,0,0) rotate(0)
    }

    60% {
        -webkit-transform: translate3d(0,0,0) rotate(-5deg);
        transform: translate3d(0,0,0) rotate(-5deg)
    }

    100% {
        -webkit-transform: translate3d(-40px,0,0) rotate(-3deg);
        transform: translate3d(-40px,0,0) rotate(-3deg)
    }
}

@-webkit-keyframes slide-right-move {
    0% {
        -webkit-transform: translate3d(-40px,0,0) rotate(-3deg)
    }

    100% {
        -webkit-transform: translate3d(-60px,0,0) rotate(-3deg);
        transform: translate3d(-60px,0,0) rotate(-3deg)
    }
}

@-webkit-keyframes slide-in-right {
    from {
        -webkit-transform: translate3d(100%,0,0);
        transform: translate3d(100%,0,0);
        opacity: 1
    }

    100% {
        -webkit-transform: translate3d(0,0,0);
        transform: translate3d(0,0,0);
        opacity: 1
    }
}

@-webkit-keyframes move-man {
    0% {
        -webkit-transform: scale(0.75);
        transform: scale(0.75)
    }

    100% {
        -webkit-transform: scale(1);
        transform: scale(1)
    }
}

@-webkit-keyframes move-hwave {
    from {
        background-position: 0 0
    }

    to {
        background-position: -3312px 0
    }
}

@-webkit-keyframes zoom-in-swing {
    0% {
        -webkit-transform: rotate(0);
        transform: rotate(0)
    }

    40% {
        -webkit-transform: rotate(20deg);
        transform: rotate(20deg)
    }

    50% {
        -webkit-transform: rotate(0);
        transform: rotate(0)
    }

    60% {
        -webkit-transform: rotate(20deg);
        transform: rotate(20deg)
    }

    70% {
        -webkit-transform: rotate(0);
        transform: rotate(0)
    }

    80% {
        -webkit-transform: rotate(20deg);
        transform: rotate(20deg)
    }

    100% {
        -webkit-transform: rotate(0);
        transform: rotate(0)
    }
}

@-webkit-keyframes sun-up {
    from {
        transform: translate3d(0,0,0);
        -webkit-transform: translate3d(0,0,0)
    }

    to {
        transform: translate3d(0,-20px,0);
        -webkit-transform: translate3d(0,-20px,0)
    }
}

@-webkit-keyframes move-happy {
    from {
        opacity: 1;
        transform: translate3d(-20px,0,0);
        -webkit-transform: translate3d(-20px,0,0)
    }

    to {
        opacity: 1;
        transform: translate3d(0,0,0);
        -webkit-transform: translate3d(0,0,0)
    }
}

@-webkit-keyframes move-river {
    from {
        transform: translate3d(60px,0,0);
        -webkit-transform: translate3d(60px,0,0)
    }

    to {
        transform: translate3d(-10px,0,0);
        -webkit-transform: translate3d(-10px,0,0)
    }
}

@-webkit-keyframes fade-out-heart {
    from {
        opacity: 1;
        -webkit-transform: scale(0);
        transform: scale(0)
    }

    to {
        -webkit-transform: scale(10);
        transform: scale(10);
        opacity: 0
    }
}

@-webkit-keyframes fade-bottom-out {
    from {
        transform: translate3d(0,0,0);
        -wwebkit-transform: translate3d(0,0,0)
    }

    to {
        transform: translate3d(0,200px,0);
        -webkit-transform: translate3d(0,200px,0)
    }
}

@-webkit-keyframes fade-bottom-left {
    from {
        transform: translate3d(0,0,0);
        -wwebkit-transform: translate3d(0,0,0)
    }

    to {
        transform: translate3d(-150%,0,0);
        -webkit-transform: translate3d(-150%,0,0)
    }
}

@-webkit-keyframes romantic-fade-b {
    from {
        transform: translate3d(0,0,0);
        -wwebkit-transform: translate3d(0,0,0)
    }

    to {
        transform: translate3d(0,100%,0);
        -webkit-transform: translate3d(0,100%,0)
    }
}

@-webkit-keyframes romantic-fade-up {
    from {
        opacity: 1;
        transform: translate3d(0,0,0);
        -wwebkit-transform: translate3d(0,0,0)
    }

    to {
        transform: translate3d(0,-200%,0);
        -webkit-transform: translate3d(0,-200%,0);
        opacity: 1
    }
}

@-webkit-keyframes rotate-fade-up {
    from {
        opacity: 1;
        transform: translate3d(0,0,0) rotate(-10deg);
        -wwebkit-transform: translate3d(0,0,0) rotate(-10deg)
    }

    to {
        transform: translate3d(0,-200%,0) rotate(-10deg);
        -webkit-transform: translate3d(0,-200%,0) rotate(-10deg);
        opacity: 1
    }
}

@-webkit-keyframes fade-in-heart {
    from {
        background-position: 0 0
    }

    to {
        background-position: -4554px 0
    }
}

@-webkit-keyframes fade-love-info {
    0% {
        -webkit-transform: translate(-50%,0);
        transform: translate(-50%,0)
    }

    100% {
        -webkit-transform: translate(-50%,25px);
        transform: translate(-50%,25px);
        opacity: 0
    }
}

@-webkit-keyframes fade-out-page {
    0% {
        -webkit-transform: translate3d(100%,0,0);
        transform: translate3d(100%,0,0)
    }

    100% {
        -webkit-transform: translate3d(-100%,0,0);
        transform: translate3d(-100%,0,0)
    }
}

@-webkit-keyframes zooming-cover {
    0% {
        -webkit-transform: scale(2) translate3d(30%,50%,200px);
        transform: scale(2) translate3d(30%,50%,200px)
    }

    100% {
        -webkit-transform: scale(1.2) translate3d(0,0,0);
        transform: scale(1.2) translate3d(0,0,0)
    }
}

@-webkit-keyframes zooming-cover-after {
    0% {
        -webkit-transform: scale(1.2) translate3d(0,0,0);
        transform: scale(1.2) translate3d(0,0,0)
    }

    100% {
        -webkit-transform: scale(1) translate3d(0,0,0);
        transform: scale(1) translate3d(0,0,0)
    }
}

@-webkit-keyframes zooming-lover {
    0% {
        -webkit-transform: scale(1);
        transform: scale(1)
    }

    100% {
        -webkit-transform: scale(0.8);
        transform: scale(0.8)
    }
}

@-webkit-keyframes fade-out-down {
    0% {
        opacity: 1
    }

    100% {
        opacity: 0;
        -webkit-transform: translate3d(0,100%,0);
        transform: translate3d(0,100%,0)
    }
}

@-webkit-keyframes poster-move {
    0% {
        opacity: 1;
        -webkit-transform: translate3d(0,0,0);
        transform: translate3d(0,0,0)
    }

    100% {
        opacity: 1;
        -webkit-transform: translate3d(-20px,0,0);
        transform: translate3d(-20px,0,0)
    }
}

@-webkit-keyframes fade-move-out {
    0%,100% {
        -webkit-transform: translate3d(-20px,0,0);
        transform: translate3d(-20px,0,0);
        opacity: 0
    }
}

@-webkit-keyframes cover-fade-mask {
    0% {
        -webkit-transform: translate3d(0,0,0);
        transform: translate3d(0,0,0)
    }

    100% {
        -webkit-transform: translate3d(100%,0,0);
        transform: translate3d(100%,0,0)
    }
}

@-webkit-keyframes fade-in-page {
    100% {
        -webkit-transform: translate3d(-100%,0,0);
        transform: translate3d(-100%,0,0)
    }
}

@-webkit-keyframes code-show {
    0% {
        height: 0
    }

    30% {
        height: 53px
    }

    70% {
        height: 53px
    }

    100% {
        height: 0
    }
}

@keyframes code-show {
    0% {
        height: 0
    }

    30% {
        height: 53px
    }

    70% {
        height: 53px
    }

    100% {
        height: 0
    }
}

@-webkit-keyframes line-show {
    0% {
        -webkit-transform: translate3d(-100%,0,0);
        opacity: 1
    }

    30% {
        -webkit-transform: translate3d(0,0,0);
        opacity: 1
    }

    70% {
        -webkit-transform: translate3d(0,0,0);
        opacity: 1
    }

    100% {
        -webkit-transform: translate3d(100%,0,0);
        opacity: 1
    }
}

@keyframes line-show {
    0% {
        transform: translate3d(-100%,0,0);
        opacity: 1
    }

    30% {
        transform: translate3d(0,0,0);
        opacity: 1
    }

    70% {
        transform: translate3d(0,0,0);
        opacity: 1
    }

    100% {
        transform: translate3d(100%,0,0);
        opacity: 1
    }
}

/**
 * END OF tour animate
 */

</style>