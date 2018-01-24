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
            items: [],
            datas: [],
            isLoading: true,
            serverIds: [],
            isCover1: false,
            isCover2: false,
            isMain: false,
            windowSize: {},
            img: [
                    "/static/photo/tmpl/young/qc_light.png",
                    "/static/photo/tmpl/young/qc_book.png",
                    "/static/photo/tmpl/young/qc_win1.png",
                    "/static/photo/tmpl/young/qc_win2.png",
                    "/static/photo/tmpl/young/qc_win3.png",
                    "/static/photo/tmpl/young/qc_bg1.jpg",
                    "/static/photo/tmpl/young/qc_bg2.jpg",
                    "/static/photo/tmpl/young/qc_bg3.jpg",
                    "/static/photo/tmpl/young/qc_bg4.jpg",
                    "/static/photo/tmpl/young/qc_t1.jpg",
                    "/static/photo/tmpl/young/qc_t2.jpg",
                    "/static/photo/tmpl/young/qc_t3.jpg",
                    "/static/photo/tmpl/young/qc_t4.jpg",
                    "/static/photo/tmpl/young/qc_t5.png",
                    "/static/photo/tmpl/young/qc_tip1.png",
                    "/static/photo/tmpl/young/qc_tip21.png",
                    "/static/photo/tmpl/young/qc_tip22.png",
                    "/static/photo/tmpl/young/qc_tip3.png",
                    "/static/photo/tmpl/young/qc_tip4.png"
            ]
        }
    },

    methods: {
        init: function(){
            this.preLoadPhotos();
            this.preLoadPhotosLocaltion();
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
            }
            this.wxLoadPhotos();
        },
        preLoadPhotosLocaltion: function(){
            var that = this;
            for (var i = 0; i < that.img.length; i++) {
                var img = new Image();
                img.src = that.img[i];
                img.onload = function () {}
            }
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
            var that = this;
            var width = $(window).width();
            var height = $(window).height();
            var items = [];
            var screenRatio = 1;

            this.datas = this.photos.concat();
            this.windowSize = {
                'width' : width + 'px',
                'height' : height + 'px'
            };
           
            for(var i = 0; i < this.datas.length; i++){
                this.datas[i].class = {};
                this.datas[i].class['animate'] = false;
                this.datas[i].isChange = false;

                this.datas[i].class['page-' + ((i % 4) + 1) ] = true;
                this.datas[i].iclass= ((i % 4) + 1);

                var itemWidth = this.datas[i].width,
                    itemHeight = this.datas[i].height,
                    boxWidth = 0,
                    boxHeight = 0,
                    picWidth = 0,
                    picHeight = 0;

                var num = ((i % 4) + 1);
                switch (num) {
                    case 1:
                        boxWidth = width * 0.76;
                        boxHeight = height * 0.58;
                        break;
                    case 2:
                        boxWidth = width * 0.78;
                        boxHeight = height * 0.44;
                        break;
                    case 3:
                        boxWidth = width * 0.8;
                        boxHeight = height * 0.46;
                        break;
                    case 4:
                        boxWidth = width * 1;
                        boxHeight = height * 0.7;
                        break;
                }

                var picWidth = boxWidth,    //照片width
                    picHeight = itemHeight * picWidth / itemWidth; //照片height

                if (picHeight >= boxHeight) {
                    this.datas[i].defaultStyle = this.datas[i].imgStyle = { 'width' : '100%' };
                    this.datas[i].animateStyle = {
                        'width' : '100%',
                        'transform' : 'translate3d(0px, '+ -1 * (picHeight - boxHeight) +'px, 0px)'
                    }
                    this.datas[i].isWidth = false;
                    // console.error('width: 100%' + '   move(-1 * (picHeight - boxHeight)): ' + -1 * (picHeight - boxHeight));
                } else {
                    picHeight = boxHeight;
                    picWidth = itemWidth * picHeight / itemHeight;
                    this.datas[i].defaultStyle = this.datas[i].imgStyle = { 'height' : '100%' };
                    this.datas[i].animateStyle = {
                        'height' : '100%',
                        'transform' : 'translate3d('+ -1 * (picWidth - boxWidth) +'px, 0px, 0px)'
                    }
                    this.datas[i].isWidth = true;
                    // console.error('height: 100%' + '   move(-1 * (picWidth - boxWidth)): ' + -1 * (picWidth - boxWidth));
                }

                // console.warn('boxWidth: ' + boxWidth +'   boxHeight: ' + boxHeight +'   picWidth: ' + picWidth +'   picHeight: ' + picHeight);
                

                this.items.push({
                    url : this.datas[i].url,
                    class : this.datas[i].class,
                    imgStyle : this.datas[i].imgStyle,
                    animateStyle : this.datas[i].animateStyle,
                    iclass : this.datas[i].iclass,
                    isWidth : this.datas[i].isWidth,
                    isChange : this.datas[i].isChange
                });
            }

            
            imgReady(this.datas[0].url, function(e) {
                that.$nextTick(function(){
                    that.isCover1 = true;
                    setTimeout(function(){
                        that.$emit('playing');
                        setTimeout(function(){
                            that.isCover2 = true;
                            that.isMain = true;
                            that.isLoading = false;
                            that.play();
                        }, 3000);
                    }, 4000);
                });
            });
        },

        play: function(){
            var that = this;
            var theIndex = this.curIndex;
            var width = $(window).width();
            var height = $(window).height();

            if(this.items.length <= 0) return false;
            if (theIndex > 0) {
                if(this.curIndex + 1 >= this.items.length) {
                    setTimeout(function(){
                        that.items[that.items.length - 1].isChange = false;
                    }, 2e3);
                    this.items[this.items.length - 1].class.animate = false;
                } else {
                    this.items[theIndex].class.animate = false;
                }
            }

            this.curIndex++;

            if(this.curIndex >= this.items.length){
                this.end();
                return false;
            }
            
            this.items[this.curIndex].class.animate = true;
            this.items[this.curIndex].isChange = true;
            
            that.items[that.curIndex].imgStyle = that.items[that.curIndex].animateStyle;

            that.resetItem(theIndex);
            if(that.curIndex > 0) that.items[that.curIndex - 1].class.animate = false;
            
            setTimeout(function(){
                that.play();
            }, 7000);
        },

        resetItem: function(index){
            var that = this;
            if(this.items[index]){
                this.items[index].class.animate = false;
                setTimeout(function(){
                    that.items[index].isChange = false;
                }, 2e3);
                this.items[index].imgStyle = this.items[index].defaultStyle;
            }
        },
        end: function(){
            if(this.preview){
                // 循环播放
                this.curIndex = -1;
                if(this.curIndex > 0){
                    if(this.photos.length > 1) this.resetItem(this.curIndex - 1);    
                }
                this.play();
            }else{
                // 结束界面
                this.items[this.items.length - 1].isChange = true;
                this.items[this.items.length - 1].class.animate = true;
                this.$emit('end');
            }
        }
    },
    route: {
        activate: function (transition) {
            setTitle('致青春');
            transition.next();
        }
    },
    created: function(){
        this.init();
    }
}
</script>

<template>
<section class="young-vue mod-os-ios">
    <div id="j-body">
        <div class="wrap j-wrap">
            <div class="mod-img-wrap">
                <div class="j-tpl-wrap">
                    <div class="wrap j-tpl-wrap">
                        <div class="mod-img-wrap">
                            <div v-bind:class="{ animate : isCover1 , 'animate-b' : isCover2}" class="tpl-cover j-mod-tpl-cover j-tpl-cover tpl-preview" style="display: block;" v-bind:style="windowSize">
                                <div class="qc_logo">
                                    <img class="qc_t1" src="/static/photo/tmpl/young/qc_t1.jpg">
                                    <img class="qc_t2" src="/static/photo/tmpl/young/qc_t2.jpg">
                                    <img class="qc_t3" src="/static/photo/tmpl/young/qc_t3.jpg">
                                    <img class="qc_t4" src="/static/photo/tmpl/young/qc_t4.jpg">
                                    <img class="qc_t5" src="/static/photo/tmpl/young/qc_t5.png">
                                </div>
                                <div class="qc_book">
                                    <img src="/static/photo/tmpl/young/qc_book.png">
                                </div>
                                <div class="cover-title">
                                    <p class="title j-album-title">{{ title }}</p>
                                    <i></i>
                                    <p class="author j-album-author j-lazy-load-nickname">{{ author }}</p>
                                </div>
                            </div>

                            <div v-bind:class="{'animate' : isMain}" class="tpl-lists">
                                <div class="img-list tpl-preview j-img-list" v-bind:style="windowSize">
                                    <div v-for="(item, i) in items" v-bind:class="[item.class, item.isChange ? 'animate-b' : '']" class="type-item item list-page j-img-item" v-bind:style="windowSize">
                                        <div v-if="item.class['page-1'] == true" class="qc_page qc_page1 type1">
                                            <div class="globalbox">
                                                <img src="/static/photo/tmpl/young/qc_leaf1.png" class="ele0">
                                                <img src="/static/photo/tmpl/young/qc_leaf2.png" class="ele1">
                                                <img src="/static/photo/tmpl/young/qc_leaf3.png" class="ele2">
                                                <img src="/static/photo/tmpl/young/qc_leaf4.png" class="ele3">
                                                <img src="/static/photo/tmpl/young/qc_leaf5.png" class="ele4">
                                                <img src="/static/photo/tmpl/young/qc_leaf6.png" class="ele5">
                                            </div>
                                            <img class="qc_tip1" src="/static/photo/tmpl/young/qc_tip1.png">
                                        </div>
                                        <div v-if="item.class['page-2'] == true" class="qc_page qc_page2">
                                            <b class="qc_tip2"></b>
                                            <img class="qc_boom1" src="/static/photo/tmpl/young/qc_boom1.png">
                                            <img class="qc_boom2" src="/static/photo/tmpl/young/qc_boom2.png">
                                            <img class="qc_boom3" src="/static/photo/tmpl/young/qc_boom3.png">
                                        </div>
                                        <div v-if="item.class['page-3'] == true" class="qc_page qc_page3 type3">
                                            <div class="globalbox">
                                                <img src="/static/photo/tmpl/young/qc_leaf1.png" class="ele0">
                                                <img src="/static/photo/tmpl/young/qc_leaf2.png" class="ele1">
                                                <img src="/static/photo/tmpl/young/qc_leaf3.png" class="ele2">
                                                <img src="/static/photo/tmpl/young/qc_leaf4.png" class="ele3">
                                                <img src="/static/photo/tmpl/young/qc_leaf5.png" class="ele4">
                                                <img src="/static/photo/tmpl/young/qc_leaf6.png" class="ele5">
                                            </div>
                                            <img class="qc_tip3" src="/static/photo/tmpl/young/qc_tip3.png">
                                        </div>
                                        <div v-if="item.class['page-4'] == true" class="qc_page qc_page4 type4">
                                            <div class="globalbox">
                                                <img src="/static/photo/tmpl/young/qc_leaf1.png" class="ele0">
                                                <img src="/static/photo/tmpl/young/qc_leaf8.png" class="ele1">
                                                <img src="/static/photo/tmpl/young/qc_leaf5.png" class="ele2">
                                                <img src="/static/photo/tmpl/young/qc_leaf7.png" class="ele3">
                                                <img src="/static/photo/tmpl/young/qc_leaf9.png" class="ele4">
                                                <img src="/static/photo/tmpl/young/qc_leaf8.png" class="ele5">
                                            </div>
                                            <img class="qc_tip4" src="/static/photo/tmpl/young/qc_tip4.png">
                                            <b class="qc_box">
                                                <img class="qc_ring" src="/static/photo/tmpl/young/qc_ring.png">
                                                <img class="qc_clock" src="/static/photo/tmpl/young/qc_clock.png">
                                            </b>
                                        </div>
                                        <div class="cover-frame" v-bind:class="'frame' + i" >
                                            <div class="cover-img j-img-page">
                                                <div class="mask-cover"></div>
                                                <img v-bind:style="item.imgStyle" v-bind:class="[item.isWidth ? 'isWidth' : 'isHeight']" v-bind:src="item.url" class="j-page-inner-move-img" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
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
html,body,div,span,iframe,h1,h2,h3,h4,h5,h6,p,blockquote,a,address,em,img,ol,ul,li,fieldset,form,label,legend,table,tbody,tfoot,thead,tr,th,td,i,b,s {
    margin: 0;
    padding: 0;
    border: 0;
    font-weight: inherit;
    font-style: inherit;
    font-size: 100%;
    font-family: Helvetica,'microsoft yahei',Arial
}

ul,
ol {
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

textarea,
input {
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

textarea:focus,
input:focus,
button:focus {
    outline: none
}

body {
    word-wrap: break-word
}

* {
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0)
}


.young-vue .tpl-preview.tpl-cover {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 2;
    background: #ede5e2;
    text-align: center;
}

.young-vue .tpl-cover.animate-b {
    -webkit-animation: qc_cover 1.5s .3s cubic-bezier(0.6, .04, .98, .335) both;
    z-index: 0;
}
.young-vue .cover-title {
    position: absolute;
    width: 78%;
    text-align: center;
    margin: 0 auto;
    color: #666;
    left: 10%;
    bottom: 3%;
    text-shadow: 0 0 2px #FFF;
    z-index: 3;
}
.young-vue .tpl-preview .title {
    display: inline-block;
    max-width: 100%;
    position: relative;
    text-align: right;
    margin: 0 auto 2px;
    letter-spacing: 2px;
    overflow: hidden;
    /*white-space: nowrap;*/
    /*text-overflow: ellipsis;*/
    word-break: break-all;
    font-size: 15px;
    line-height: 1.5;
    clear: both;
    padding-right: 13px;

    opacity: 0;

    -webkit-transition: all 1s 2.5s;
}
.young-vue .tpl-preview .title:before {
    content: '（';
}
.young-vue .tpl-preview .title:after {
    content: '）';
    position: absolute;
    right: -5px;
    bottom: 1px;
}
.young-vue .tpl-preview .author {
    text-align: right;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    font-size: 12px;
    width: 75%;
    float: right;

    opacity: 0;

    -webkit-transition: all 3s 5s;
}
.young-vue .animate .title {
    opacity: 1;

    -webkit-transition: all 2s 4s !important;
}
.young-vue .animate .author {
    opacity: 1;

    -webkit-transition: all 3s 5s !important;
}
.young-vue .tpl-preview .author:before {
    content: '—';
}


.young-vue .qc_logo {
    position: relative;
    font-size: 0;
    z-index: 0;
    width: 72%;
}
.young-vue .animate .qc_logo {
    -webkit-transform: translateY(0);
    -webkit-transition: all 1s 0s;
}
.young-vue .qc_logo img {
    opacity: 0;
    -webkit-transform: translateY(-15px) scale(1.3,1.3);
}
.young-vue .qc_logo .qc_t1 {
    -webkit-transform: translateY(0) scale(1.5,1.5);
    -webkit-transition: all 1s .6s;
}
.young-vue .qc_logo .qc_t2 {
    -webkit-transform: translateY(0) scale(2,2);
    -webkit-transition: all 1s 1.2s;
}
.young-vue .qc_logo .qc_t3 {
    -webkit-transform: translateY(0) scale(1.3,1.3);
    -webkit-transition: all 1s 1.8s;
}
.young-vue .qc_logo .qc_t4 {
    -webkit-transform: translateY(0) scale(1.5,1.5);
    -webkit-transition: all 1s 2.4s;
}
.young-vue .qc_logo .qc_t5 {
    position: absolute;
    width: 26%;
    top: 29%;
    left: 49%;

    -webkit-transform: translateY(0) scale(.5,.5);
    -webkit-transition: all 1.8s 1.5s !important;
}
.young-vue .tpl-cover.animate img {
    opacity: 1 !important;
    -webkit-transform: translateY(0) scale(1,1) !important;
    -webkit-transition: all 2s .3s !important;
}

.young-vue .qc_book {
    position: relative;
    display: inline-block;
    z-index: 2;
    height: 65%;
    margin-top: -5%;
    font-size: 0;
    opacity: 0;

    -webkit-transition: all 2s 3s;
}
.young-vue .animate .qc_book {
    opacity: 1;

    -webkit-transition: all 2s 3s;
}
/*.young-vue .qc_book:after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    opacity: 1;
    z-index: -1;

    background: url(/static/photo/tmpl/young/qc_light.png) no-repeat;
    background-size: 100% 100%;

    transform: translate3d(0,0,0) scale(.5,.5);
    -webkit-transform: translate3d(0,0,0) scale(.5,.5);
    -webkit-transform-origin: center center;
    transform-origin: center center;

    -webkit-transition: all 2s 5s;
    transition: all 2s 5s;
}
.young-vue .animate .qc_book:after {
    content: '';
    opacity: 1;
    -webkit-transform-origin: bottom right;
    transform-origin: bottom right;

    transform: translate3d(150%,200%,0) scale(8,8);
    -webkit-transform: translate3d(150%,200%,0) scale(8,8);

    -webkit-transition: all 2s 5s;
    transition: all 2s 5s;
}*/
.young-vue .qc_book img {
    position: relative;
    display: block;
    height: 100%;
    z-index: 0;

    -webkit-transform: scale(1,1);
    -webkit-transition: all .5s .5s !important;
}

.young-vue .animate-b .qc_book {
    z-index: 11;
}
.young-vue .animate-b .qc_book img {
    -webkit-transform: scale(2.5,2.5) !important;
    -webkit-transition: all 1s 0s !important;
}


.young-vue .isWidth {
    height: 100% !important;
}
.young-vue .isHeight {
    width: 100% !important;
}

.young-vue .hide {
    display: none!important
}

.young-vue .clearfix:after {
    content: ".";
    height: 0;
    visibility: hidden;
    display: block;
    clear: both;
    font-size: 0;
    line-height: 0
}

.young-vue .clearfix {
    *zoom: 1
}

.young-vue .textoverflow {
    display: inline-block;
    white-space: nowrap;
    word-wrap: normal;
    word-break: break-all;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
    _width: 100%
}

.young-vue .noOp {
    opacity: 0!important
}

.young-vue .tpl-preview {
    height: 100%
}

.young-vue .tpl-preview.img-list {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 4;
    width: 100%;
    overflow: visible;
    -webkit-transition: all 1.3s .4s cubic-bezier(0.165, .84, .44, 1);
    -webkit-transform-style: preserve-3d;
}

.young-vue .img-list.animate {
    -webkit-transform: translateX(0%);
}

.young-vue .j-page-inner-move-img{
    max-width: inherit;
    -webkit-transform : translate3d(0px, 0px, 0px);
    -webkit-transition: -webkit-transform 4s ease 3s;
    -webkit-animation-fill-mode:forwards;
    z-index: 5;
}

.young-vue .tpl-lists {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    overflow: hidden;
    opacity: 0;
    background: #EEE7DF;

    -webkit-transition: all 2.5s 0s ease;
    -webkit-perspective: 1000px;
    -webkit-transform-style: preserve-3d;
}
.young-vue .tpl-lists.animate {
    opacity: 1;
    z-index: 5;

    -webkit-transition: all 2.5s 0s ease;
}

.young-vue .tpl-lists .list-page {
    position: absolute;
    opacity: 0;
    top: 0;
    left: 0;
    z-index: 0;

    -webkit-transform: rotateY(0deg);
    -webkit-transform-origin: left center;

    overflow: hidden;
}
.young-vue .tpl-lists .list-page.animate, .young-vue .tpl-lists .list-page.animate.animate-b {
    opacity: 1;
    z-index: 1;

    -webkit-transform: rotateY(0deg);
}
.young-vue .tpl-lists .list-page.animate-b {
    opacity: .6;
    z-index: 3;

    -webkit-transform: rotateY(-90deg);
    -webkit-transition: all 1s 0s ease;
    -webkit-transform-origin: left center;
}

.young-vue .qc_page {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
}
.young-vue .qc_page1 {
    background: url(/static/photo/tmpl/young/qc_bg1.jpg) no-repeat;
    background-size: 100% 100%;
}
.young-vue .qc_page2 {
    background: url(/static/photo/tmpl/young/qc_bg2.jpg) no-repeat;
    background-size: 100% 100%;
}
.young-vue .qc_page3 {
    background: url(/static/photo/tmpl/young/qc_bg3.jpg) no-repeat;
    background-size: 100% 100%;
}
.young-vue .qc_page4 {
    background: url(/static/photo/tmpl/young/qc_bg4.jpg) no-repeat;
    background-size: 100% 100%;
}

.young-vue .cover-frame {
    position: relative;
    width: 100%;
    height: 100%;
    margin: 0 auto;
    font-size: 0;
}
.young-vue .tpl-preview .cover-img {
    -webkit-transition: all 2s .3s;
}
.young-vue .cover-img {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-size: 100% auto;
    background-position: 50% 50%;
    background-repeat: no-repeat;
}
.young-vue .mask-cover {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 8;
}
.young-vue .page-1 .mask-cover {
    background: url(/static/photo/tmpl/young/qc_win1.png) no-repeat;
    background-size: 100% 100%;
}
.young-vue .page-2 .mask-cover, .young-vue .page-3 .mask-cover {
    background: url(/static/photo/tmpl/young/qc_win2.png) no-repeat;
    background-size: 100% 100%;
}
.young-vue .page-4 .mask-cover {
    background: url(/static/photo/tmpl/young/qc_win3.png) no-repeat;
    background-size: 100% 100%;
}



.young-vue .page-1 .cover-frame:before {
    content: '';
    position: absolute;
    top: -4.5%;
    right: 8%;
    width: 15%;
    height: 16%;
    background: url(/static/photo/tmpl/young/qc_pin.png) no-repeat;
    background-size: 100% 100%;
    z-index: 9;
}
.young-vue .page-1 .cover-frame {
    position: absolute;
    width: 76%;
    height: 58%;
    top: 2%;
    left: -1%;
    -webkit-transform: rotate(4deg);
}
.young-vue .page-1 .cover-img {
    box-shadow: 2px 4px 7px rgba(0,0,0,.3);
    border-radius: 5px;
    overflow: hidden;
}
.young-vue .qc_tip1 {
    position: absolute;
    width: 11%;
    top: 33%;
    left: 78%;
    opacity: 0;
    -webkit-transform: translateY(-50px);
    -webkit-transition: all 3.5s 1s;
}
.young-vue .item.animate .qc_tip1 {
    opacity: 1;
    -webkit-transform: translateY(0);
    -webkit-transition: all 3.5s 1s;
}


.young-vue .page-2 .cover-frame:before {
    content: '';
    position: absolute;
    top: -4.5%;
    right: 8%;
    width: 15%;
    height: 16%;
    background: url(/static/photo/tmpl/young/qc_pin.png) no-repeat;
    background-size: 100% 100%;
    z-index: 9;
}
.young-vue .page-2 .cover-frame {
    position: absolute;
    width: 78%;
    height: 44%;
    top: 43%;
    right: 10.3%;
    -webkit-transform: rotate(5deg);
}
.young-vue .page-2 .cover-img {
    box-shadow: 2px 4px 7px rgba(0,0,0,.3);
    border-radius: 5px;
    overflow: hidden;
}

.young-vue .item .qc_tip2 {
    position: absolute;
    width: 30%;
    height: 12%;
    top: 22%;
    left: 5%;

    background: url(/static/photo/tmpl/young/qc_tip21.png);
    background-size: 100% 100%;

    -webkit-animation: qc_tip2 1s 0s infinite step-start;
}

.young-vue .item .qc_boom1 {
    position: absolute;
    width: 8%;
    top: 18%;
    left: 37%;

    -webkit-animation: boom1 1s 0s infinite step-start;
}

.young-vue .item .qc_boom2 {
    position: absolute;
    width: 5.5%;
    top: 35%;
    left: 66%;

    -webkit-animation: boom2 1s 0s infinite step-start;
}

.young-vue .item .qc_boom3 {
    position: absolute;
    width: 5%;
    top: 38%;
    left: 80%;

    -webkit-animation: boom3 1s 0s infinite step-start;
}


.young-vue .page-3 .cover-frame:before {
    content: '';
    position: absolute;
    top: -19%;
    right: -17%;
    width: 100%;
    height: 38%;
    background: url(/static/photo/tmpl/young/qc_line.png) no-repeat;
    background-size: 100% 100%;
    z-index: 9;
    -webkit-transform: rotate(-5deg);
}
.young-vue .page-3 .cover-frame:after {
    content: '';
    position: absolute;
    top: -30%;
    left: -19%;
    width: 50%;
    height: 45%;
    background: url(/static/photo/tmpl/young/qc_hat.png) no-repeat;
    background-size: 100% 100%;
    z-index: 10;
}
.young-vue .page-3 .cover-frame {
    position: absolute;
    width: 80%;
    height: 46%;
    top: 16%;
    left: 10%;
    -webkit-transform: rotate(5deg);
}
.young-vue .page-3 .cover-img {
    box-shadow: 2px 4px 7px rgba(0,0,0,.3);
    border-radius: 5px;
    overflow: hidden;
}
.young-vue .qc_tip3 {
    position: absolute;
    width: 40%;
    top: 65%;
    left: 8%;
}

.young-vue .item.animate .qc_tip3 {
    -webkit-animation: qc_tip3 2s 1s 1 both;
}

.young-vue .page-4 .cover-frame {
    position: absolute;
    width: 100%;
    height: 70%;
    top: .8%;
    left: -4.2%;
    -webkit-transform: rotate(5deg);
}
.young-vue .page-4 .cover-img {
    overflow: hidden;
}
.young-vue .qc_tip4 {
    position: absolute;
    width: 26%;
    top: 3%;
    left: 22%;
    z-index: 10;
    -webkit-transform: rotate(4deg);
}

.young-vue .item.animate .qc_tip4 {
    -webkit-animation: qc_tip4 3s 1s 1 both;
}

.young-vue .qc_box {
    position: absolute;
    width: 24%;
    bottom: 3%;
    right: 18%;
    z-index: 11;
}
.young-vue .qc_box .qc_ring {
    position: absolute;
    width: 70%;
    left: 38%;
    top: -25%;
}

.young-vue .item.animate .qc_clock {
    -webkit-animation: qc_clock 3s 1s infinite both;
}

.young-vue .globalbox{
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    overflow: hidden;
    z-index: 10;
    pointer-events: none;
}
.young-vue .globalbox img{
    position: absolute;
    width: 42px;
    opacity: 0;
}

.young-vue .type1 .ele0 {
    width: 16px;
    left: 92%;
    top: 12%;
    -webkit-animation: iclass2-f2 6.7s 3s linear infinite;
}
.young-vue .type1 .ele1 {
    width: 36px;
    left: 75%;
    top: 1%;
    -webkit-animation: iclass2-fl 9.5s 1s linear infinite;
}
.young-vue .type1 .ele2 {
    width: 42px;
    left: 92%;
    top: 2%;
    -webkit-animation: iclass2-f2 9.2s 1.5s linear infinite;
}
.young-vue .type1 .ele3 {
    width: 39px;
    left: 82%;
    top: 9%;
    -webkit-animation: iclass2-f3 11.5s 4s linear infinite;
}
.young-vue .type1 .ele4 {
    width: 29px;
    left: 85%;
    top: 5%;
    -webkit-animation: iclass2-f4 8.3s 2.5s linear  infinite;
}
.young-vue .type1 .ele5 {
    width: 36px;
    left: 91%;
    top: 16%;
    -webkit-animation: iclass2-f5 11.3s 2s linear  infinite;
}

.young-vue .type3 .ele0 {
    width: 18px;
    top: 7%;
    left: 1%;
    -webkit-animation: hua0 6.3s ease 0.5s  infinite;
}
.young-vue .type3 .ele1 {
    top: 3%;
    left: 10%;
    -webkit-animation: hua1 5.6s 1s linear infinite;
}
.young-vue .type3 .ele2 {
    top: 10%;
    left: 3%;
    -webkit-animation: hua2 7s 1.5s ease infinite;
}
.young-vue .type3 .ele3 {
    top: -1%;
    left: 12%;
    -webkit-animation: hua3 6.5s 2s ease infinite;
}
.young-vue .type3 .ele4 {
    top: 15%;
    left: 2%;
    -webkit-animation: hua4 7.3s 2.3s ease  infinite;
}
.young-vue .type3 .ele5 {
    top: 22%;
    left: 1%;
    -webkit-animation: hua5 8s 1s ease  infinite;
}

.young-vue .type4 .ele0 {
    width: 16px;
    left: 92%;
    top: 12%;
    -webkit-animation: iclass2-f2 6.7s 3s linear infinite;
}
.young-vue .type4 .ele1 {
    width: 36px;
    left: 75%;
    top: 1%;
    -webkit-animation: iclass2-fl 9.5s 1s linear infinite;
}
.young-vue .type4 .ele2 {
    width: 42px;
    left: 92%;
    top: 2%;
    -webkit-animation: iclass2-f2 9.2s 1.5s linear infinite;
}
.young-vue .type4 .ele3 {
    width: 39px;
    left: 82%;
    top: 9%;
    -webkit-animation: iclass2-f3 11.5s 4s linear infinite;
}
.young-vue .type4 .ele4 {
    width: 29px;
    left: 85%;
    top: 5%;
    -webkit-animation: iclass2-f4 8.3s 2.5s linear  infinite;
}
.young-vue .type4 .ele5 {
    width: 36px;
    left: 91%;
    top: 16%;
    -webkit-animation: iclass2-f5 11.3s 2s linear  infinite;
}

/**
 * young animate
 */
@-webkit-keyframes qc_cover {
    0% {opacity: 1;}
    100% {opacity: 0}
}
@keyframes qc_cover {
    0% {opacity: 1;}
    100% {opacity: 0}
}
@-webkit-keyframes qc_logo_show {
    0% {opacity: 1;}
    100% {opacity: 0}
}
@keyframes qc_logo_show {
    0% {opacity: 1;}
    100% {opacity: 0}
}
@-webkit-keyframes qc_tip2 {
    0%, 100% {
        background: url(/static/photo/tmpl/young/qc_tip21.png);
        background-size: 100% 100%;
    }
    50% {
        background: url(/static/photo/tmpl/young/qc_tip22.png);
        background-size: 100% 100%;
    }
}
@keyframes qc_tip2 {
    0%, 100% {
        background: url(/static/photo/tmpl/young/qc_tip21.png);
        background-size: 100% 100%;
    }
    50% {
        background: url(/static/photo/tmpl/young/qc_tip22.png);
        background-size: 100% 100%;
    }
}
@-webkit-keyframes boom1 {
    0%, 100% {
        transform: translate3d(0,0,0);
        -webkit-transform: translate3d(0,0,0);
    }
    50% {
        transform: translate3d(-7px,-7px,0);
        -webkit-transform: translate3d(-7px,-7px,0);
    }
}
@keyframes boom1 {
    0%, 100% {
        transform: translate3d(0,0,0);
        -webkit-transform: translate3d(0,0,0);
    }
    50% {
        transform: translate3d(-7px,-7px,0);
        -webkit-transform: translate3d(-7px,-7px,0);
    }
}
@-webkit-keyframes boom2 {
    0%, 100% {
        transform: translate3d(0,0,0);
        -webkit-transform: translate3d(0,0,0);
    }
    50% {
        transform: translate3d(0,-5px,0);
        -webkit-transform: translate3d(0,-5px,0);
    }
}
@keyframes boom2 {
    0%, 100% {
        transform: translate3d(0,0,0);
        -webkit-transform: translate3d(0,0,0);
    }
    50% {
        transform: translate3d(0,-5px,0);
        -webkit-transform: translate3d(0,-5px,0);
    }
}
@-webkit-keyframes boom3 {
    0%, 100% {
        transform: translate3d(0,0,0);
        -webkit-transform: translate3d(0,0,0);
    }
    50% {
        transform: translate3d(0,5px,0);
        -webkit-transform: translate3d(0,5px,0);
    }
}
@keyframes boom3 {
    0%, 100% {
        transform: translate3d(0,0,0);
        -webkit-transform: translate3d(0,0,0);
    }
    50% {
        transform: translate3d(0,5px,0);
        -webkit-transform: translate3d(0,5px,0);
    }
}
@-webkit-keyframes qc_tip3 {
    0% {
        opacity: 0;
        transform: scale(.3,.3);
        -webkit-transform: scale(.3,.3);
    }
    100% {
        opacity: 1;
        transform: scale(1,1);
        -webkit-transform: scale(1,1);
    }
}
@keyframes qc_tip3 {
    0% {
        opacity: 0;
        transform: scale(.3,.3);
        -webkit-transform: scale(.3,.3);
    }
    100% {
        opacity: 1;
        transform: scale(1,1);
        -webkit-transform: scale(1,1);
    }
}
@-webkit-keyframes qc_tip4 {
    0% {
        opacity: 0;
        transform: translateX(-50px);
        -webkit-transform: translateX(-50px);
    }
    100% {
        opacity: 1;
        transform: translateX(0);
        -webkit-transform: translateX(0);
    }
}
@keyframes qc_tip4 {
    0% {
        opacity: 0;
        transform: translateX(-50px);
        -webkit-transform: translateX(-50px);
    }
    100% {
        opacity: 1;
        transform: translateX(0);
        -webkit-transform: translateX(0);
    }
}
@-webkit-keyframes qc_clock {
    0%,25%,100% {
        -webkit-transform: scale3d(1,1,1);
        -ms-transform: scale3d(1,1,1);
        transform: scale3d(1,1,1)
    }
    2.5%,5% {
        -webkit-transform: scale3d(.9,.9,.9) rotate3d(0,0,1,-3deg);
        -ms-transform: scale3d(.9,.9,.9) rotate3d(0,0,1,-3deg);
        transform: scale3d(.9,.9,.9) rotate3d(0,0,1,-3deg)
    }
    7.5%,12.5%,17.5%,22.5% {
        -webkit-transform: scale3d(1.1,1.1,1.1) rotate3d(0,0,1,3deg);
        -ms-transform: scale3d(1.1,1.1,1.1) rotate3d(0,0,1,3deg);
        transform: scale3d(1.1,1.1,1.1) rotate3d(0,0,1,3deg)
    }
    10%,15%,20% {
        -webkit-transform: scale3d(1.1,1.1,1.1) rotate3d(0,0,1,-3deg);
        -ms-transform: scale3d(1.1,1.1,1.1) rotate3d(0,0,1,-3deg);
        transform: scale3d(1.1,1.1,1.1) rotate3d(0,0,1,-3deg)
    }
}
@keyframes qc_clock {
    0%,25%,100% {
        -webkit-transform: scale3d(1,1,1);
        -ms-transform: scale3d(1,1,1);
        transform: scale3d(1,1,1)
    }
    2.5%,5% {
        -webkit-transform: scale3d(.9,.9,.9) rotate3d(0,0,1,-3deg);
        -ms-transform: scale3d(.9,.9,.9) rotate3d(0,0,1,-3deg);
        transform: scale3d(.9,.9,.9) rotate3d(0,0,1,-3deg)
    }
    7.5%,12.5%,17.5%,22.5% {
        -webkit-transform: scale3d(1.1,1.1,1.1) rotate3d(0,0,1,3deg);
        -ms-transform: scale3d(1.1,1.1,1.1) rotate3d(0,0,1,3deg);
        transform: scale3d(1.1,1.1,1.1) rotate3d(0,0,1,3deg)
    }
    10%,15%,20% {
        -webkit-transform: scale3d(1.1,1.1,1.1) rotate3d(0,0,1,-3deg);
        -ms-transform: scale3d(1.1,1.1,1.1) rotate3d(0,0,1,-3deg);
        transform: scale3d(1.1,1.1,1.1) rotate3d(0,0,1,-3deg)
    }
}
@-webkit-keyframes iclass2-fl{
        0% {opacity:1; transform:translate(0px, 0px) scale(1) rotateX(53deg) rotateY(-58deg) rotateZ(0deg) translate(-50%, -50%);animation-timing-function: cubic-bezier(.25,.25,.75,.75);}
        33.33% {opacity:1; transform:translate(-137px, 119px) scale(1) rotateX(10deg) rotateY(0deg) rotateZ(0deg) translate(-50%, -50%);animation-timing-function: cubic-bezier(.25,.25,.75,.75);}
        53.33% {opacity:1; transform:translate(-193px, 337px) scale(1) rotateX(53deg) rotateY(72deg) rotateZ(-37deg) translate(-50%, -50%);animation-timing-function: cubic-bezier(.25,.25,.75,.75);}
        66.67% {opacity:1; transform:translate(-131px, 512px) scale(1) rotateX(-19deg) rotateY(50deg) rotateZ(0deg) translate(-50%, -50%);animation-timing-function: cubic-bezier(.25,.25,.75,.75);}
        100% {opacity:1; transform:translate(-173px, 685px) scale(0.5) rotateX(0.5deg) rotateY(-40deg) rotateZ(0deg) translate(-50%, -50%);}
    }
    @-webkit-keyframes iclass2-f2{
        0% {opacity:1; transform:translate(0px, 0px) scale(1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) translate(-50%, -50%);animation-timing-function: cubic-bezier(.25,.25,.75,.75);}
        11.11% {opacity:1; transform:translate(-97px, 102px) scale(1) rotateX(10deg) rotateY(50deg) rotateZ(50deg) translate(-50%, -50%);animation-timing-function: cubic-bezier(.25,.25,.75,.75);}
        33.33% {opacity:1; transform:translate(-187px, 215px) scale(1) rotateX(-30deg) rotateY(-60deg) rotateZ(0deg) translate(-50%, -50%);animation-timing-function: cubic-bezier(.25,.25,.75,.75);}
        55.56% {opacity:1; transform:translate(-126px, 325px) scale(1) rotateX(10deg) rotateY(-30deg) rotateZ(0deg) translate(-50%, -50%);animation-timing-function: cubic-bezier(.25,.25,.75,.75);}
        77.78% {opacity:1; transform:translate(-91px, 420px) scale(0.8) rotateX(30deg) rotateY(0deg) rotateZ(10deg) translate(-50%, -50%);animation-timing-function: cubic-bezier(.25,.25,.75,.75);}
        100% {opacity:1; transform:translate(-106px, 517px) scale(0.8) rotateX(40deg) rotateY(20deg) rotateZ(-10deg) translate(-50%, -50%);}
    }
    @-webkit-keyframes iclass2-f3{
        0% {opacity:1; transform:translate(0px, 0px) scale(1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) translate(-50%, -50%);animation-timing-function: cubic-bezier(.25,.25,.75,.75);}
        11.11% {opacity:1; transform:translate(-64px, 108px) scale(1) rotateX(10deg) rotateY(-50deg) rotateZ(150deg) translate(-50%, -50%);animation-timing-function: cubic-bezier(.25,.25,.75,.75);}
        33.33% {opacity:1; transform:translate(-135px, 219px) scale(1) rotateX(20deg) rotateY(60deg) rotateZ(60deg) translate(-50%, -50%);animation-timing-function: cubic-bezier(.25,.25,.75,.75);}
        55.56% {opacity:1; transform:translate(-192px, 284px) scale(1) rotateX(10deg) rotateY(-30deg) rotateZ(80deg) translate(-50%, -50%);animation-timing-function: cubic-bezier(.25,.25,.75,.75);}
        77.78% {opacity:1; transform:translate(-92px, 411px) scale(1) rotateX(130deg) rotateY(0deg) rotateZ(100deg) translate(-50%, -50%);animation-timing-function: cubic-bezier(.25,.25,.75,.75);}
        100% {opacity:1; transform:translate(-65px, 505px) scale(0.8) rotateX(40deg) rotateY(20deg) rotateZ(-10deg) translate(-50%, -50%);}
    }
    @-webkit-keyframes iclass2-f4{
        0% {opacity:1; transform:translate(0px, 0px) scale(1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) translate(-50%, -50%);animation-timing-function: cubic-bezier(.25,.25,.75,.75);}
        14.29% {opacity:1; transform:translate(-96px, 52px) scale(1) rotateX(10deg) rotateY(-50deg) rotateZ(150deg) translate(-50%, -50%);animation-timing-function: cubic-bezier(.25,.25,.75,.75);}
        42.86% {opacity:1; transform:translate(-169px, 205px) scale(1) rotateX(50deg) rotateY(50deg) rotateZ(149deg) translate(-50%, -50%);animation-timing-function: cubic-bezier(.25,.25,.75,.75);}
        71.43% {opacity:1; transform:translate(-140px, 343px) scale(1) rotateX(10deg) rotateY(-50deg) rotateZ(150deg) translate(-50%, -50%);animation-timing-function: cubic-bezier(.25,.25,.75,.75);}
        100% {opacity:1; transform:translate(-118px, 505px) scale(1) rotateX(80deg) rotateY(-150deg) rotateZ(150deg) translate(-50%, -50%);}
    }
    @-webkit-keyframes iclass2-f5{
        0% {opacity:1; transform:translate(0px, 0px) scale(1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) translate(-50%, -50%);animation-timing-function: cubic-bezier(.25,.25,.75,.75);}
        11.11% {opacity:1; transform:translate(-142px, 92px) scale(1) rotateX(10deg) rotateY(-50deg) rotateZ(150deg) translate(-50%, -50%);animation-timing-function: cubic-bezier(.25,.25,.75,.75);}
        33.33% {opacity:1; transform:translate(-108px, 208px) scale(1) rotateX(50deg) rotateY(50deg) rotateZ(149deg) translate(-50%, -50%);animation-timing-function: cubic-bezier(.25,.25,.75,.75);}
        55.56% {opacity:1; transform:translate(-133px, 387px) scale(1) rotateX(10deg) rotateY(-50deg) rotateZ(150deg) translate(-50%, -50%);animation-timing-function: cubic-bezier(.25,.25,.75,.75);}
        77.78% {opacity:1; transform:translate(-175px, 449px) scale(1) rotateX(80deg) rotateY(-150deg) rotateZ(150deg) translate(-50%, -50%);animation-timing-function: cubic-bezier(.25,.25,.75,.75);}
        100% {opacity:1; transform:translate(-156px, 545px) scale(1) rotateX(10deg) rotateY(-50deg) rotateZ(150deg) translate(-50%, -50%);}
    }
    @-webkit-keyframes iclass2-f0{
        0% {opacity:1; transform:translate(0px, 0px) scale(1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) translate(-50%, -50%);animation-timing-function: cubic-bezier(.25,.25,.75,.75);}
        11.11% {opacity:1; transform:translate(-64px, 108px) scale(1) rotateX(10deg) rotateY(-50deg) rotateZ(150deg) translate(-50%, -50%);animation-timing-function: cubic-bezier(.25,.25,.75,.75);}
        33.33% {opacity:1; transform:translate(-135px, 219px) scale(1) rotateX(20deg) rotateY(60deg) rotateZ(60deg) translate(-50%, -50%);animation-timing-function: cubic-bezier(.25,.25,.75,.75);}
        55.56% {opacity:1; transform:translate(-192px, 284px) scale(1) rotateX(10deg) rotateY(-30deg) rotateZ(80deg) translate(-50%, -50%);animation-timing-function: cubic-bezier(.25,.25,.75,.75);}
        77.78% {opacity:1; transform:translate(-92px, 411px) scale(0.8) rotateX(130deg) rotateY(0deg) rotateZ(100deg) translate(-50%, -50%);animation-timing-function: cubic-bezier(.25,.25,.75,.75);}
        100% {opacity:1; transform:translate(-65px, 505px) scale(0.8) rotateX(40deg) rotateY(20deg) rotateZ(-10deg) translate(-50%, -50%);}
    }
    @-webkit-keyframes hua2
    {
        0% {opacity:1; -webkit-transform:translate(0px, 0px) scale(1) rotateX(10deg) rotateY(100deg) rotateZ(0deg) translate(-50%, -50%);-webkit-animation-timing-function: cubic-bezier(.25,.25,.75,.75);}
        33.33% {opacity:1; -webkit-transform:translate(104px, 49px) scale(1) rotateX(10deg) rotateY(100deg) rotateZ(0deg) translate(-50%, -50%);-webkit-animation-timing-function: cubic-bezier(.25,.25,.75,.75);}
        66.67% {opacity:.81; -webkit-transform:translate(161px, 131px) scale(1) rotateX(-9deg) rotateY(150deg) rotateZ(0deg) translate(-50%, -50%);-webkit-animation-timing-function: cubic-bezier(.25,.25,.75,.75);}
        100% {opacity:.6; -webkit-transform:translate(189px, 276px) scale(1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) translate(-50%, -50%);}
    }
    @-webkit-keyframes hua1
    {
        from{opacity:1; -webkit-transform: translate(0px,0px) rotate(204deg);}
        to{opacity:.3; -webkit-transform:translate(545px,365px) rotate(350deg);}
    }

    @-webkit-keyframes hua3
    {
        0% {opacity:1; -webkit-transform:translate(0px, 0px) scale(1) rotateX(58deg) rotateY(58deg) rotateZ(0deg) translate(-50%, -50%);-webkit-animation-timing-function: cubic-bezier(.25,.25,.75,.75);}
        25% {opacity:1; -webkit-transform:translate(86px, 60px) scale(1) rotateX(10deg) rotateY(0deg) rotateZ(0deg) translate(-50%, -50%);-webkit-animation-timing-function: cubic-bezier(.25,.25,.75,.75);}
        50% {opacity:1; -webkit-transform:translate(139px, 164px) scale(1) rotateX(10deg) rotateY(0deg) rotateZ(0deg) translate(-50%, -50%);-webkit-animation-timing-function: cubic-bezier(.25,.25,.75,.75);}
        75% {opacity:.9; -webkit-transform:translate(118px, 260px) scale(1) rotateX(-20deg) rotateY(50deg) rotateZ(0deg) translate(-50%, -50%);-webkit-animation-timing-function: cubic-bezier(.25,.25,.75,.75);}
        100% {opacity:.5; -webkit-transform:translate(64px, 343px) scale(1) rotateX(10deg) rotateY(-40deg) rotateZ(0deg) translate(-50%, -50%);}
    }

    @-webkit-keyframes hua4
    {
        0% {opacity:1; -webkit-transform:translate(0px, 0px) scale(1) rotateX(58deg) rotateY(58deg) rotateZ(0deg) translate(-50%, -50%);-webkit-animation-timing-function: cubic-bezier(.25,.25,.75,.75);}
        33.33% {opacity:1; -webkit-transform:translate(51px, 78px) scale(1) rotateX(10deg) rotateY(0deg) rotateZ(0deg) translate(-50%, -50%);-webkit-animation-timing-function: cubic-bezier(.25,.25,.75,.75);}
        53.33% {opacity:1; -webkit-transform:translate(36px, 184px) scale(1) rotateX(10deg) rotateY(0deg) rotateZ(0deg) translate(-50%, -50%);-webkit-animation-timing-function: cubic-bezier(.25,.25,.75,.75);}
        66.67% {opacity:.8; -webkit-transform:translate(99px, 242px) scale(1) rotateX(-20deg) rotateY(50deg) rotateZ(0deg) translate(-50%, -50%);-webkit-animation-timing-function: cubic-bezier(.25,.25,.75,.75);}
        100% {opacity:.6; -webkit-transform:translate(64px, 343px) scale(1) rotateX(10deg) rotateY(-40deg) rotateZ(0deg) translate(-50%, -50%);}
    }

    @-webkit-keyframes hua5
    {
        0% {opacity:1; -webkit-transform:translate(0px, 0px) scale(1) rotateX(46deg) rotateY(-58deg) rotateZ(0deg) translate(-50%, -50%);-webkit-animation-timing-function: cubic-bezier(.25,.25,.75,.75);}
        33.33% {opacity:1; -webkit-transform:translate(127px, 67px) scale(1) rotateX(10deg) rotateY(0deg) rotateZ(0deg) translate(-50%, -50%);-webkit-animation-timing-function: cubic-bezier(.25,.25,.75,.75);}
        43.33% {opacity:1; -webkit-transform:translate(203px, 163px) scale(1) rotateX(10deg) rotateY(0deg) rotateZ(0deg) translate(-50%, -50%);-webkit-animation-timing-function: cubic-bezier(.25,.25,.75,.75);}
        66.67% {opacity:.9; -webkit-transform:translate(331px, 229px) scale(1) rotateX(-20deg) rotateY(50deg) rotateZ(0deg) translate(-50%, -50%);-webkit-animation-timing-function: cubic-bezier(.25,.25,.75,.75);}
        100% {opacity:.8; -webkit-transform:translate(367px, 356px) scale(1) rotateX(10deg) rotateY(-40deg) rotateZ(0deg) translate(-50%, -50%);}
    }

    @-webkit-keyframes hua0
    {
        0% {opacity:1; -webkit-transform:translate(0px, 0px) scale(1) rotateX(46deg) rotateY(-58deg) rotateZ(0deg) translate(-50%, -50%);-webkit-animation-timing-function: cubic-bezier(.25,.25,.75,.75);}
        23.33% {opacity:1; -webkit-transform:translate(89px, 36px) scale(1) rotateX(10deg) rotateY(0deg) rotateZ(0deg) translate(-50%, -50%);-webkit-animation-timing-function: cubic-bezier(.25,.25,.75,.75);}
        53.33% {opacity:1; -webkit-transform:translate(167px, 161px) scale(1) rotateX(10deg) rotateY(0deg) rotateZ(0deg) translate(-50%, -50%);-webkit-animation-timing-function: cubic-bezier(.25,.25,.75,.75);}
        66.67% {opacity:.8; -webkit-transform:translate(241px, 231px) scale(1) rotateX(-20deg) rotateY(50deg) rotateZ(0deg) translate(-50%, -50%);-webkit-animation-timing-function: cubic-bezier(.25,.25,.75,.75);}
        100% {opacity:.5; -webkit-transform:translate(257px, 335px) scale(1) rotateX(10deg) rotateY(-40deg) rotateZ(0deg) translate(-50%, -50%);}
    }
/**
 * END OF young animate
 */

</style>