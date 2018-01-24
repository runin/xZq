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
            isActive: false,
            isMain: false,
            windowSize: {},
            img: [
                    "/static/photo/tmpl/dad/dad_bg.jpg",
                    "/static/photo/tmpl/dad/dad_main.png",
                    "/static/photo/tmpl/dad/dad_bom.png",
                    "/static/photo/tmpl/dad/dad_air.png",
                    "/static/photo/tmpl/dad/dad_bg1.jpg",
                    "/static/photo/tmpl/dad/dad_host1.png",
                    "/static/photo/tmpl/dad/dad_bg2.jpg",
                    "/static/photo/tmpl/dad/dad_host2.png",
                    "/static/photo/tmpl/dad/dad_bg3.jpg",
                    "/static/photo/tmpl/dad/dad_host3.png",
                    "/static/photo/tmpl/dad/dad_bg4.jpg",
                    "/static/photo/tmpl/dad/dad_host4.png",
                    "/static/photo/tmpl/dad/dad_roll.png",
                    "/static/photo/tmpl/dad/dad_grass.png",
                    "/static/photo/tmpl/dad/dad_swing.png",
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
                        boxWidth = width * 0.6;
                        boxHeight = height * 0.36;
                        break;
                    case 2:
                        boxWidth = width * 0.66;
                        boxHeight = width * 0.66;
                        break;
                    case 3:
                        boxWidth = width * 0.82;
                        boxHeight = width * 0.82;
                        break;
                    case 4:
                        boxWidth = width * 0.45;
                        boxHeight = height * 0.45;
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

            // this.$set('items',items);
            
            imgReady(this.datas[0].url, function(e) {
                that.$nextTick(function(){
                    that.isCover1 = true;
                    setTimeout(function(){
                        that.nextMap();
                            that.$emit('playing');
                            that.isCover2 = true;
                            that.isMain = true;
                            that.isLoading = false;
                            that.play();
                    }, 6e3);
                });
            });
        },

        nextMap: function() {
            var that = this;
            this.isActive = true;
            setTimeout(function(){
                that.isActive = false;
            }, 1500);
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
            // this.curIndex = 3;

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
                that.nextMap();
                that.play();
            }, 6e3);
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
            var that = this;
            if(this.preview){
                // 循环播放
                this.curIndex = -1;
                if(this.curIndex > 0){
                    if(this.photos.length > 1) this.resetItem(this.curIndex - 1);    
                }
                this.play();
            }else{
                // 结束界面
                this.isActive = false;
                this.items[this.items.length - 1].isChange = true;
                this.items[this.items.length - 1].class.animate = true;
                this.$emit('end');
            }
        }
    },
    route: {
        activate: function (transition) {
            setTitle('爸爸去哪儿');
            transition.next();
        }
    },
    created: function(){
        this.init();
    }
}
</script>

<template>
<section class="dad-vue mod-os-ios">
    <div id="j-body">
        <div class="wrap j-wrap">
            <div class="mod-img-wrap">
                <div class="j-tpl-wrap">
                    <div class="wrap j-tpl-wrap">
                        <div class="mod-img-wrap">
                            <div v-bind:class="{ 'active' : isActive }" class="cover-cloud">
                                <b class="cloud-1"></b>
                                <!-- <b class="cloud-2"></b> -->
                                <b class="cloud-3"></b>
                                <b class="shadow"></b>
                            </div>
                            <div v-bind:class="{ animate : isCover1 , 'animate-b' : isCover2}" class="tpl-cover j-mod-tpl-cover j-tpl-cover tpl-preview" style="display: block;" v-bind:style="windowSize">
                                <div class="cover-title">
                                    <p class="title j-album-title">{{ title.slice(0,6) }}</p>
                                    <img class="dad_slogan" src="/static/photo/tmpl/dad/dad_slogan.png">
                                    <p class="author j-album-author j-lazy-load-nickname">{{ author }}</p>
                                </div>
                                <div class="cover-bottom">
                                    <img class="dad_leaf" src="/static/photo/tmpl/dad/dad_leaf.png">
                                    <img class="dad_bom" src="/static/photo/tmpl/dad/dad_bom.png">
                                    <img class="dad_main" src="/static/photo/tmpl/dad/dad_main.png">
                                </div>
                                <b class="dad_bird1"><img src="/static/photo/tmpl/dad/dad_bird1.png"></b>
                                <b class="dad_bird2"><img src="/static/photo/tmpl/dad/dad_bird2.png"></b>
                            </div>
                            <div v-bind:class="{'animate' : isMain}" class="tpl-lists">
                                <div class="img-list tpl-preview j-img-list" v-bind:style="windowSize">
                                    <div v-for="(item, i) in items" v-bind:class="[item.class, item.isChange ? 'animate-b' : '']" class="type-item item list-page j-img-item" v-bind:style="windowSize">
                                        <div v-if="item.class['page-1'] == true" class="dad_page type1">
                                            <div class="globalbox">
                                                <img src="/static/photo/tmpl/dad/dad_leaf1.png" class="ele0">
                                                <img src="/static/photo/tmpl/dad/dad_leaf2.png" class="ele1">
                                                <img src="/static/photo/tmpl/dad/dad_leaf1.png" class="ele2">
                                                <img src="/static/photo/tmpl/dad/dad_leaf2.png" class="ele3">
                                                <img src="/static/photo/tmpl/dad/dad_leaf1.png" class="ele4">
                                                <img src="/static/photo/tmpl/dad/dad_leaf2.png" class="ele5">
                                            </div>
                                            <b class="dad_line"><img src="/static/photo/tmpl/dad/dad_line.png"></b>
                                            <b class="dad_host1"><img src="/static/photo/tmpl/dad/dad_host1.png"></b>
                                            <b class="dad_grass"><img src="/static/photo/tmpl/dad/dad_grass.png"></b>
                                        </div>
                                        <div v-if="item.class['page-2'] == true" class="dad_page">
                                            <b class="dad_host2"><img src="/static/photo/tmpl/dad/dad_host2.png"></b>
                                            <b class="dad_tree1"><img src="/static/photo/tmpl/dad/dad_tree.png"></b>
                                            <b class="dad_tree2"><img src="/static/photo/tmpl/dad/dad_tree.png"></b>
                                            <b class="dad_cloud1"><img src="/static/photo/tmpl/dad/dad_cloud1.png"></b>
                                            <b class="dad_cloud2"><img src="/static/photo/tmpl/dad/dad_cloud2.png"></b>
                                        </div>
                                        <div v-if="item.class['page-3'] == true" class="dad_page dad_page3 type3">
                                            <b class="dad_host3"><img src="/static/photo/tmpl/dad/dad_host3.png"></b>
                                            <b class="dad_plane"><img src="/static/photo/tmpl/dad/dad_plane.png"></b>
                                        </div>
                                        <div v-if="item.class['page-4'] == true" class="dad_page dad_page4 type4">
                                            <div class="globalbox">
                                                <img src="/static/photo/tmpl/dad/dad_flower.png" class="ele0">
                                                <img src="/static/photo/tmpl/dad/dad_flower.png" class="ele1">
                                                <img src="/static/photo/tmpl/dad/dad_flower.png" class="ele2">
                                                <img src="/static/photo/tmpl/dad/dad_flower.png" class="ele3">
                                                <img src="/static/photo/tmpl/dad/dad_flower.png" class="ele4">
                                                <img src="/static/photo/tmpl/dad/dad_flower.png" class="ele5">
                                            </div>
                                            <b class="dad_host4"><img src="/static/photo/tmpl/dad/dad_host4.png"></b>
                                            <b class="dad_bug1"><img src="/static/photo/tmpl/dad/dad_bug2.png"></b>
                                            <b class="dad_bug2"><img src="/static/photo/tmpl/dad/dad_bug1.png"></b>
                                            <b class="dad_bug3"><img src="/static/photo/tmpl/dad/dad_bug1.png"></b>
                                        </div>
                                        <div class="cover-frame" v-bind:class="'frame' + i" >
                                            <div class="cover-img j-img-page">
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

.dad-vue .isWidth {
    height: 100% !important;
}
.dad-vue .isHeight {
    width: 100% !important;
}

.dad-vue .hide {
    display: none !important
}

.dad-vue .clearfix:after {
    content: ".";
    height: 0;
    visibility: hidden;
    display: block;
    clear: both;
    font-size: 0;
    line-height: 0
}

.dad-vue .clearfix {
    *zoom: 1
}

.dad-vue .textoverflow {
    display: inline-block;
    white-space: nowrap;
    word-wrap: normal;
    word-break: break-all;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
    _width: 100%;
}

.dad-vue .noOp {
    opacity: 0 !important;
}

.dad-vue .tpl-preview {
    height: 100%;
}

.dad-vue .tpl-preview.tpl-cover {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 2;
    background: #FFF;
    text-align: center;
    background: url(/static/photo/tmpl/dad/dad_bg.jpg) no-repeat #FFF;
    background-size: 100% 100%;
}
.dad-vue .tpl-cover.animate-b {
    -webkit-animation: dad_cover 1.5s .3s cubic-bezier(0.6, .04, .98, .335) both;
    z-index: 0;
}
.dad-vue .cover-title {
    display: inline-block;
    position: relative;
    max-width: 92%;
    text-align: center;
    margin: 0 auto;
    top: 12%;
    z-index: 3;
}
.dad-vue .tpl-preview .title {
    position: relative;
    z-index: 3;
    display: inline-block;
    width: 100%;
    text-align: center;
    position: relative;
    margin: 0 auto 5px;
    letter-spacing: 3px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    word-break: break-all;
    font-size: 44px;
    line-height: 1;
    clear: both;
    color: #ff7290;

    opacity: 0;
    -webkit-transform: translateY(-60px);
}
.dad-vue .tpl-preview .dad_slogan {
    position: relative;
    z-index: 2;
    display: block;
    width: 60%;
    margin: 5px auto;

    opacity: 0;
    -webkit-transform: translateY(-40px);
}
.dad-vue .tpl-preview .author {
    position: relative;
    z-index: 1;
    display: inline-block;
    text-align: center;
    overflow: hidden;
    font-size: 12px;
    background: #94995e;
    color: #FFF;
    padding: 5px 12px;
    border-radius: 3px;
    letter-spacing: 2px;
    margin-top: 12px;

    white-space: nowrap; 
    text-overflow: ellipsis;
    overflow: hidden;

    opacity: 0;
    -webkit-transform: translateY(-40px);
}
.dad-vue .animate .cover-title .title {
    opacity: 1;

    -webkit-transform: translateY(0);
    -webkit-transition: all 2s .3s;
}
.dad-vue .animate .cover-title .dad_slogan {
    opacity: 1;
    -webkit-transform: translateY(0);
    -webkit-transition: all 1s 1.5s;
}
.dad-vue .animate .cover-title .author {
    opacity: 1;
    -webkit-transform: translateY(0);
    -webkit-transition: all 1s 1.5s;
}

.dad-vue .cover-bottom {
    position: absolute;
    width: 100%;
    bottom: 0;
    left: 0;
    font-size: 0;
}
.dad-vue .cover-bottom .dad_main {
    position: relative;
    z-index: 2;
}
.dad-vue .cover-bottom .dad_bom {
    position: absolute;
    width: 84%;
    left: 8%;
    z-index: 0;
    opacity: 0;
}
.dad-vue .cover-bottom .dad_leaf {
    position: absolute;
    z-index: 3;

    top: -50%;
    left: -30%;
}
.dad-vue .animate .cover-bottom .dad_bom {
    opacity: 1;

    -webkit-transition: all 3s 4.5s;
    transition: all 3s 4.5s;
}
.dad-vue .animate .cover-bottom .dad_leaf {
    -webkit-animation: hua1 7s 3s 1 ease;
}

.dad-vue .tpl-preview .dad_bird1 {
    position: absolute;
    width: 35%;
    top: 36%;
    left: 16%;
}
.dad-vue .tpl-preview .dad_bird2 {
    position: absolute;
    width: 36%;
    top: 3%;
    right: 0;
}
.dad-vue .tpl-preview > b {
    opacity: 1;
    -webkit-transform: scale(1,1);
}

.dad-vue .tpl-preview > b img {
    opacity: 0;
    -webkit-transform: scale(.5,.5);
}
.dad-vue .tpl-preview.animate > b img {
    opacity: 1;
    -webkit-transform: scale(1,1);
    -webkit-transition: all 1s 2s;
}

.dad-vue .cover-cloud {
    position: absolute;
    width: 600px;
    height: 745px;
    top: 0;
    left: 0;
    -webkit-transform: translate3d(0,0,0);
    z-index: 9;
    pointer-events: none;
}
.dad-vue .cover-cloud .cloud-1 {
    display: block;
    width: 100%;
    height: 100%;
    z-index: 2;
    position: absolute;
    top: 0;
    left: 0;
    background: url(/static/photo/tmpl/dad/dad_air.png) top center;
    background-size: 100% 100%;
    overflow: hidden;
    -webkit-transform: translate3d(-100%,0,0);
}
.dad-vue .cover-cloud .cloud-3 {
    display: block;
    width: 100%;
    height: 100%;
    z-index: 2;
    position: absolute;
    top: 0;
    left: 0;
    background: url(/static/photo/tmpl/dad/dad_air.png) top center;
    background-size: 100% 100%;
    overflow: hidden;
    -webkit-transform: translate3d(-150%,0,0) scaleX(-1);
}
.dad-vue .cover-cloud .cloud-2 {
    display: block;
    width: 100%;
    height: 100%;
    z-index: 2;
    position: absolute;
    top: 0;
    left: 0;
    background: url(/static/photo/tmpl/dad/dad_air.png) top center;
    background-size: 100% 100%;
    overflow: hidden;
    -webkit-transform: translate3d(100%,0,0) scaleX(-1);
}
.dad-vue .cover-cloud .shadow {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 1;
    top: 0;
    left: 0;
    opacity: 0;
    background: #FFF;
}

.dad-vue .cover-cloud.active {
    opacity: 1;
    -webkit-transform: translate3d(0,0,0);
    -webkit-transition: all 1.2s;
}
.dad-vue .cover-cloud.active .cloud-1 {
    -webkit-transform: translate3d(100%,0,0);
    -webkit-transition: all 1.2s;
}
.dad-vue .cover-cloud.active .cloud-3 {
    -webkit-transform: translate3d(100%,0,0) scaleX(-1);
    -webkit-transition: all 1.2s;
}
.dad-vue .cover-cloud.active .cloud-2 {
    -webkit-transform: translate3d(-100%,0,0) scaleX(-1);
    -webkit-transition: all 1.2s;
}
.dad-vue .cover-cloud.active .shadow {
    opacity: 0;
    -webkit-transition: all .7s .5s;
}

.dad-vue .tpl-preview.img-list {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 4;
    width: 100%;
    overflow: visible;
    -webkit-transition: all 1.3s .4s cubic-bezier(0.165, .84, .44, 1);
    -webkit-transform-style: preserve-3d;
}

.dad-vue .img-list.animate {
    -webkit-transform: translateX(0%);
}

.dad-vue .j-page-inner-move-img{
    max-width: inherit;
    -webkit-transform : translate3d(0px, 0px, 0px);
    -webkit-transition: -webkit-transform 4s ease 1.5s;
    -webkit-animation-fill-mode:forwards;
    z-index: 5;
}

.dad-vue .tpl-lists {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    overflow: hidden;
    opacity: 0;

    -webkit-transition: all 2.5s 0s ease;
    -webkit-perspective: 1000px;
    -webkit-transform-style: preserve-3d;
}
.dad-vue .tpl-lists.animate {
    opacity: 1;
    z-index: 5;
    -webkit-transition: all 2.5s 0s ease;
}

.dad-vue .tpl-lists .list-page {
    position: absolute;
    opacity: 0;
    top: 0;
    left: 0;
    z-index: 0;

    -webkit-transform: rotateY(0deg);
    -webkit-transform-origin: left center;
    overflow: hidden;
}
.dad-vue .tpl-lists .list-page.animate, .dad-vue .tpl-lists .list-page.animate.animate-b {
    opacity: 1;
    z-index: 1;

    -webkit-transform: rotateY(0deg);
}
.dad-vue .tpl-lists .list-page.animate-b {
    opacity: 0;
    z-index: 3;

    /*-webkit-transform: rotateY(-90deg);*/
    /*transform: rotateY(-90deg);*/

    -webkit-transition: all 1s 0s ease;
    -webkit-transform-origin: left center;
}

.dad-vue .dad_page {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
}
.dad-vue .page-1 {
    background: url(/static/photo/tmpl/dad/dad_bg1.jpg) no-repeat;
    background-size: 100% 100%;
}
.dad-vue .page-2 {
    background: url(/static/photo/tmpl/dad/dad_bg2.jpg) no-repeat;
    background-size: 100% 100%;
}
.dad-vue .page-3 {
    background: url(/static/photo/tmpl/dad/dad_bg3.jpg) no-repeat;
    background-size: 100% 100%;
}
.dad-vue .page-4 {
    background: url(/static/photo/tmpl/dad/dad_bg4.jpg) no-repeat;
    background-size: 100% 100%;
}

.dad-vue .cover-frame {
    position: relative;
    width: 100%;
    height: 100%;
    margin: 0 auto;
    font-size: 0;
}
.dad-vue .tpl-preview .cover-img {
    -webkit-transition: all 2s .3s;
}
.dad-vue .cover-img {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-size: 100% auto;
    background-position: 50% 50%;
    background-repeat: no-repeat;
}
.dad-vue .mask-cover {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 8;
}

.dad-vue .globalbox{
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    overflow: hidden;
    z-index: 10;
    pointer-events: none;
}
.dad-vue .globalbox img{
    position: absolute;
    width: 42px;
    opacity: 0;
}

.dad-vue .type1 .ele0 {
    width: 46px;
    left: 92%;
    top: 12%;
    -webkit-animation: iclass2-f2 6.7s 3s linear infinite;
}
.dad-vue .type1 .ele1 {
    width: 50px;
    left: 75%;
    top: 1%;
    -webkit-animation: iclass2-fl 9.5s 1s linear infinite;
}
.dad-vue .type1 .ele2 {
    width: 60px;
    left: 92%;
    top: 2%;
    -webkit-animation: iclass2-f2 9.2s 1.5s linear infinite;
}
.dad-vue .type1 .ele3 {
    width: 66px;
    left: 82%;
    top: 9%;
    -webkit-animation: iclass2-f3 11.5s 4s linear infinite;
}
.dad-vue .type1 .ele4 {
    width: 33px;
    left: 85%;
    top: 5%;
    -webkit-animation: iclass2-f4 8.3s 2.5s linear  infinite;
}
.dad-vue .type1 .ele5 {
    width: 26px;
    left: 91%;
    top: 16%;
    -webkit-animation: iclass2-f5 11.3s 2s linear  infinite;
}

.dad-vue .type4 .ele0 {
    width: 9px;
    top: 7%;
    left: 1%;
    -webkit-animation: hua0 6.3s ease 0.5s  infinite;
}
.dad-vue .type4 .ele1 {
    width: 5px;
    top: 3%;
    left: 10%;
    -webkit-animation: hua1 5.6s 1s linear infinite;
}
.dad-vue .type4 .ele2 {
    width: 8px;
    top: 10%;
    left: 3%;
    -webkit-animation: hua2 7s 1.5s ease infinite;
}
.dad-vue .type4 .ele3 {
    width: 6px;
    top: -1%;
    left: 12%;
    -webkit-animation: hua3 6.5s 2s ease infinite;
}
.dad-vue .type4 .ele4 {
    width: 5px;
    top: 15%;
    left: 2%;
    -webkit-animation: hua4 7.3s 2.3s ease  infinite;
}
.dad-vue .type4 .ele5 {
    width: 6px;
    top: 22%;
    left: 1%;
    -webkit-animation: hua5 8s 1s ease  infinite;
}

.dad-vue .page-1 .cover-frame {
    position: absolute;
    width: 60%;
    height: 36%;
    background: #FFF;
    top: 8%;
    left: 23%;
    font-size: 0;
    -webkit-transform: rotate(6deg);
}
.dad-vue .page-1 .cover-frame:before {
    content: '';
    position: absolute;
    top: -12%;
    left: 60%;
    z-index: 5;
    width: 6%;
    height: 20%;
    background: url(/static/photo/tmpl/dad/dad_pin.png) no-repeat;
    background-size: 100% 100%;
    -webkit-transform: rotate(-10deg);
}
.dad-vue .page-1 .cover-frame:after {
    content: '';
    display: block;
    width: 100%;
    height: 20%;
    background: #FFF;
}
.dad-vue .page-1 .dad_line {
    display: block;
    width: 100%;
    margin-top: 10%;
}
.dad-vue .page-1 .dad_host1 {
    position: absolute;
    width: 60%;
    bottom: 0;
    left: 6%;
    z-index: 6;
}
.dad-vue .page-1 .dad_grass {
    position: absolute;
    width: 82%;
    bottom: 0;
    left: 0;
    opacity: .9;
    z-index: 7;
}

.dad-vue .page-2 .cover-frame {
    position: absolute;
    width: 66%;
    height: 0;
    padding-top: 66%;
    top: 10%;
    left: 16%;
    font-size: 0;
}
.dad-vue .page-2.animate .cover-frame {
    -webkit-animation: foolishIn 1s .3s ease both;
}
.dad-vue .page-2 .cover-frame:before {
    content: '';
    position: absolute;
    top: -26%;
    left: -30%;
    width: 160%;
    height: 160%;
    background: url(/static/photo/tmpl/dad/dad_roll.png) no-repeat;
    background-size: 100% 100%;
    z-index: 5;
}
.dad-vue .page-2 .cover-img {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 2;
    display: block;
    border-radius: 100%;
    -webkit-border-radius: 100%;
    overflow: hidden;
}
.dad-vue .page-2 .cover-img img {
    position: absolute;
}
.dad-vue .page-2 .dad_host2 {
    position: absolute;
    width: 42%;
    bottom: -1%;
    right: 1%;
    z-index: 6;
}
.dad-vue .page-2 .dad_tree1 {
    position: absolute;
    width: 42%;
    bottom: 18%;
    right: -14%;
    z-index: 2;
    -webkit-transform: scale(.3,.3);
    opacity: 0;
}
.dad-vue .page-2 .dad_tree2 {
    position: absolute;
    width: 28%;
    bottom: 8%;
    left: -7%;
    z-index: 2;
    -webkit-transform: scale(.5,.5);
    opacity: 0;
}
.dad-vue .page-2.animate .dad_tree1, .dad-vue .page-2.animate .dad_tree2 {
    opacity: 1;
    -webkit-transform: scale(1,1);

    transition: all 1.5s .3s;
    -webkit-transition: all 1.5s .3s;
}
.dad-vue .page-2 .dad_tree2 img {
    -webkit-transform: scaleX(-1) rotate(-18deg);
}
.dad-vue .page-2 .dad_cloud1 {
    position: absolute;
    width: 30%;
    top: 22%;
    right: -14%;
    z-index: 0;
    -webkit-transform: translateX(150%);
}
.dad-vue .page-2 .dad_cloud2 {
    position: absolute;
    width: 22%;
    top: 3%;
    left: 50%;
    z-index: 0;
    -webkit-transform: translateX(200%);
}
.dad-vue .page-2.animate .dad_cloud1, .dad-vue .page-2.animate .dad_cloud2 {
    -webkit-transform: translateX(-500%);
    -webkit-transition: all 15s 2s;
}

.dad-vue .page-3 .cover-frame {
    position: absolute;
    width: 82%;
    height: 0;
    padding-top: 82%;
    top: 5%;
    left: 10%;
    font-size: 0;
    -webkit-transform: scale(1,1);
    -webkit-transition: all 1s;
    overflow: hidden;
    z-index: 3;
}
.dad-vue .page-3.animate .cover-frame {
    -webkit-transform: scale(1,1);
    -webkit-transition: all 1s 1s;
}
.dad-vue .page-3 .cover-img {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 2;
    display: block;
    border-radius: 100%;
    -webkit-border-radius: 100%;
    overflow: hidden;
    border: 4px solid #FFF;
}
.dad-vue .page-3 .cover-img img {
    position: absolute;
    z-index: 1;
}
.dad-vue .page-3 .dad_host3 {
    position: absolute;
    width: 61%;
    bottom: -1%;
    right: 0;
    z-index: 6;
}
.dad-vue .page-3 .dad_plane {
    position: absolute;
    width: 20%;
    top: 6%;
    right: -20%;
    z-index: 0;
    -webkit-transform: translateX(100%);
}
.dad-vue .page-3.animate .dad_plane {
    -webkit-transform: translateX(-500%);
    -webkit-transition: all 7s 3s;
}

.dad-vue .page-4 .cover-frame {
    position: absolute;
    width: 45%;
    height: 46%;
    top: 10%;
    left: 16%;
    font-size: 0;
}
.dad-vue .page-4 .cover-frame:before {
    content: '';
    position: absolute;
    top: -26%;
    left: -30%;
    width: 150%;
    height: 150%;
    background: url(/static/photo/tmpl/dad/dad_swing.png) no-repeat;
    background-size: 100% 100%;
    z-index: 3;
}
.dad-vue .page-4 .cover-img {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: -7%;
    z-index: 2;
    display: block;
    overflow: hidden;
    border: 3px solid #2e0510;
    background: #2e0510;
}
.dad-vue .page-4 .cover-img img {
    position: absolute;
}
.dad-vue .page-4 .dad_host4 {
    position: absolute;
    width: 42%;
    bottom: -1%;
    right: -1%;
    z-index: 6;
}
.dad-vue .page-4 .dad_bug1 {
    position: absolute;
    width: 15%;
    top: 62%;
    left: 16%;
    z-index: 5;
}
.dad-vue .page-4 .dad_bug1 img {
}
.dad-vue .page-4 .dad_bug2 {
    position: absolute;
    width: 7%;
    top: 18%;
    left: 66%;
    z-index: 5;
}
.dad-vue .page-4 .dad_bug2 img {
}
.dad-vue .page-4 .dad_bug3 {
    position: absolute;
    width: 4%;
    top: 38%;
    left: 3%;
    z-index: 5;
}
.dad-vue .page-4 .dad_bug3 img {
    -webkit-transform: scaleX(-1) rotate(-18deg);
}
.dad-vue .page-4.animate .dad_bug1 {
    -webkit-animation: bugflyup 2s 0s infinite alternate;
}
.dad-vue .page-4.animate .dad_bug2 {
    -webkit-animation: bugfly 3s 0s infinite alternate;
}
.dad-vue .page-4.animate .dad_bug3 {
    -webkit-animation: bugfly 8s 0s infinite alternate;
}

.dad-vue .page-1 .dad_host1, .dad-vue .page-3 .dad_host3 {
    opacity: 0;
    -webkit-transform: scale(.5,.5);
    -webkit-transition: all 1s;
}
.dad-vue .page-1.animate .dad_host1, .dad-vue .page-3.animate .dad_host3 {
    opacity: 1;
    -webkit-transform: scale(1,1);
    -webkit-transition: all 1.5s .5s;
}
.dad-vue .page-2 .dad_host2, .dad-vue .page-4 .dad_host4 {
    opacity: 0;
    -webkit-transform: translateX(100%);
    -webkit-transition: all 1s;
}
.dad-vue .page-2.animate .dad_host2, .dad-vue .page-4.animate .dad_host4 {
    opacity: 1;
    -webkit-transform: translateX(0);
    -webkit-transition: all 1.5s .5s;

}


/**
 * dad animate
 */

@-webkit-keyframes boingInUp {
    0% {
        opacity: 0;
        -webkit-transform-origin: 50% 0%;
        -webkit-transform: perspective(800px) rotateX(-90deg);
    }

    50% {
        opacity: 1;
        -webkit-transform-origin: 50% 0%;
        -webkit-transform: perspective(800px) rotateX(50deg);
    }

    100% {
        opacity: 1;
        -webkit-transform-origin: 50% 0%;
        -webkit-transform: perspective(800px) rotateX(0deg);
    }
}

@keyframes boingInUp {
    0% {
        opacity: 0;
        transform-origin: 50% 0%;
        transform: perspective(800px) rotateX(-90deg);
    }

    50% {
        opacity: 1;
        transform-origin: 50% 0%;
        transform: perspective(800px) rotateX(50deg);
    }

    100% {
        opacity: 1;
        transform-origin: 50% 0%;
        transform: perspective(800px) rotateX(0deg);
    }
}

@-webkit-keyframes foolishIn {
    0% {
        opacity: 0;
        -webkit-transform-origin: 50% 50%;
        -webkit-transform: scale(0,0) rotate(360deg);
    }
    33% {
        opacity: 1;
        -webkit-transform-origin: 0% 100%;
        -webkit-transform: scale(0.5,0.5) rotate(0deg);
    }
    66% {
        opacity: 1;
        -webkit-transform-origin: 100% 100%;
        -webkit-transform: scale(0.5,0.5) rotate(0deg);
    }
    100% {
        opacity: 1;
        -webkit-transform-origin: 50% 50%;
        -webkit-transform: scale(1,1) rotate(0deg);
    }
}

@keyframes foolishIn {
    0% {
        opacity: 0;
        transform-origin: 50% 50%;
        transform: scale(0,0) rotate(360deg);
    }
    33% {
        opacity: 1;
        transform-origin: 0% 100%;
        transform: scale(0.5,0.5) rotate(0deg);
    }
    66% {
        opacity: 1;
        transform-origin: 100% 100%;
        transform: scale(0.5,0.5) rotate(0deg);
    }
    100% {
        opacity: 1;
        transform-origin: 50% 50%;
        transform: scale(1,1) rotate(0deg);
    }
}

@-webkit-keyframes bugfly {
    0% {
        transform: translate3d(-40px, 50px, 0);
        -webkit-transform: translate3d(-40px, 50px, 0);
    }
    100% {
        transform: translate3d(10px,0,0);
        -webkit-transform: translate3d(10px,0,0);
    }
}
@keyframes bugfly {
    0% {
        transform: translate3d(-40px, 50px, 0);
        -webkit-transform: translate3d(-40px, 50px, 0);
    }
    100% {
        transform: translate3d(10px,0,0);
        -webkit-transform: translate3d(10px,0,0);
    }
}
@-webkit-keyframes bugflyup {
    0% {
        transform: translate3d(-30px, 20px, 0);
        -webkit-transform: translate3d(-30px, 20px, 0);
    }
    100% {
        transform: translate3d(0,0,0);
        -webkit-transform: translate3d(0,0,0);
    }
}
@keyframes bugflyup {
    0% {
        transform: translate3d(-30px, 20px, 0);
        -webkit-transform: translate3d(-30px, 20px, 0);
    }
    100% {
        transform: translate3d(0,0,0);
        -webkit-transform: translate3d(0,0,0);
    }
}

@-webkit-keyframes dad_cover {
    0% {opacity: 1;}
    100% {opacity: 0}
}
@keyframes dad_cover {
    0% {opacity: 1;}
    100% {opacity: 0}
}
/**
 * END OF dad animate
 */

</style>