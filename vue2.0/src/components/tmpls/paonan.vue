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
            slideStyle: {},
            windowSize: {},
            curItem: -1,
            img: [
                    "/static/photo/tmpl/paonan/rm_film.png",
                    "/static/photo/tmpl/paonan/rm_bg.jpg",
                    "/static/photo/tmpl/paonan/rm_mm.png",
                    "/static/photo/tmpl/paonan/rm_11.png",
                    "/static/photo/tmpl/paonan/rm_11.png",
                    "/static/photo/tmpl/paonan/rm_12.png",
                    "/static/photo/tmpl/paonan/rm_21.png",
                    "/static/photo/tmpl/paonan/rm_22.png",
                    "/static/photo/tmpl/paonan/rm_31.png",
                    "/static/photo/tmpl/paonan/rm_32.png",
                    "/static/photo/tmpl/paonan/rm_41.png",
                    "/static/photo/tmpl/paonan/rm_42.png",
                    "/static/photo/tmpl/paonan/rm_51.png",
                    "/static/photo/tmpl/paonan/rm_52.png",
                    "/static/photo/tmpl/paonan/rm_61.png",
                    "/static/photo/tmpl/paonan/rm_62.png",
                    "/static/photo/tmpl/paonan/rm_71.png",
                    "/static/photo/tmpl/paonan/rm_72.png"
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

                this.datas[i].class['page-' + ((i % 7) + 1) ] = true;
                this.datas[i].iclass= ((i % 7) + 1);

                var itemWidth = this.datas[i].width,
                    itemHeight = this.datas[i].height,
                    boxWidth = 0,
                    boxHeight = 0,
                    picWidth = 0,
                    picHeight = 0;

                var num = ((i % 7) + 1);
                switch (num) {
                    case 1:
                        boxWidth = width * 1;
                        boxHeight = height * 0.66;
                        break;
                    case 2:
                        boxWidth = width * 1;
                        boxHeight = height * 0.66;
                        break;
                    case 3:
                        boxWidth = width * 1;
                        boxHeight = height * 0.66;
                        break;
                    case 4:
                        boxWidth = width * 1;
                        boxHeight = height * 0.66;
                        break;
                    case 5:
                        boxWidth = width * 1;
                        boxHeight = height * 0.66;
                        break;
                    case 6:
                        boxWidth = width * 1;
                        boxHeight = height * 0.66;
                        break;
                    case 7:
                        boxWidth = width * 1;
                        boxHeight = height * 0.66;
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
                    isActive : false,
                    class : this.datas[i].class,
                    imgStyle : this.datas[i].imgStyle,
                    animateStyle : this.datas[i].animateStyle,
                    iclass : this.datas[i].iclass,
                    isWidth : this.datas[i].isWidth
                });
            }

            
            imgReady(this.datas[0].url, function(e) {
                that.$nextTick(function(){
                    that.isCover1 = true;
                    setTimeout(function(){
                        that.isCover2 = true;
                        that.isMain = true;
                        that.isLoading = false;
                        that.$emit('playing');
                        setTimeout(function(){
                            that.play();
                        }, 2000);
                    }, 8000);
                });
            });
        },

        play: function(){
            var that = this;
            var theIndex = this.curIndex;
            var width = $(window).width();
            var height = $(window).height();

            if(this.items.length <= 0) return false;
            this.curIndex++;

            if(this.curIndex >= this.items.length){
                this.end();
                return false;
            }

            setTimeout(function(){
                that.curItem = (((that.curIndex - 1) % 6) + 1);
            }, 1e3);
            
            this.items[this.curIndex].isActive = true;
            this.items[this.curIndex].class['animate-b'] = false;
            this.items[this.curIndex].class.animate = true;
            
            that.items[that.curIndex].imgStyle = that.items[that.curIndex].animateStyle;
            that.slideStyle = {
                'width' : width * this.items.length + 'px',
                'transform' : 'translateX(-' + (that.curIndex * width + 0) + 'px)'
            };
            setTimeout(function(){
                that.resetItem(theIndex);
                if(that.curIndex > 0) that.items[that.curIndex - 1].class.animate = false;
            }, 2000);
            
            setTimeout(function(){
                that.play();
            }, 7000);
        },

        resetItem: function(index){
            if(this.items[index]){
                this.items[index].isActive = false;
                this.items[index].class.animate = false;
                this.items[index].class['animate-b'] = true;
                this.items[index].imgStyle = this.items[index].defaultStyle;
            }
        },
        end: function(){
            if(this.preview){
                // 循环播放
                if(this.curIndex > 0){
                    if(this.photos.length > 1) this.resetItem(this.curIndex - 1);    
                }
                this.curIndex = -1;
                this.play();
            }else{
                // 结束界面
                this.$emit('end');
            }
        }
    },
    route: {
        activate: function (transition) {
            setTitle('奔跑吧兄弟');
            transition.next();
        }
    },
    created: function(){
        this.init();
    }
}

</script>

<template>

<section class="paonan-vue mod-os-ios">
    <div id="j-body">
        <div class="wrap j-wrap">
            <div class="mod-img-wrap">
                <div class="j-tpl-wrap">
                    <div class="wrap j-tpl-wrap">
                        <div class="mod-img-wrap">
                            <div v-bind:class="{ animate : isCover1 , 'animate-b' : isCover2}" class="tpl-cover j-mod-tpl-cover j-tpl-cover tpl-preview" style="display: block;">
                                <div class="paonan-cover" v-bind:style="windowSize">
                                    <div class="rm_film">
                                        <img src="/static/photo/tmpl/paonan/rm_film.png">
                                        <p class="title j-album-title">{{ title }}</p>
                                        <p class="author j-album-author j-lazy-load-nickname">{{ author }}</p>
                                        <b class="rm_baby"><img src="/static/photo/tmpl/paonan/rm_baby.png"></b>
                                        <b class="rm_wzl"><img src="/static/photo/tmpl/paonan/rm_wzl.png"></b>
                                        <b class="rm_zk"><img src="/static/photo/tmpl/paonan/rm_zk.png"></b>
                                        <b class="rm_dc"><img src="/static/photo/tmpl/paonan/rm_dc.png"></b>
                                        <b class="rm_lc"><img src="/static/photo/tmpl/paonan/rm_lc.png"></b>
                                    </div>
                                    <b class="rm_logo"><img src="/static/photo/tmpl/paonan/rm_logo.png"></b>
                                    <b class="rm_ball1"><img src="/static/photo/tmpl/paonan/rm_ball1.png"></b>
                                    <b class="rm_ball2"><img src="/static/photo/tmpl/paonan/rm_ball2.png"></b>
                                </div>
                            </div>

                            <div v-bind:class="{ 'animate' : isMain }" class="tpl-lists">
                                <div class="fix-list" v-bind:style="windowSize">
                                    <div class="tpl-top"><img class="rm_logo" src="/static/photo/tmpl/paonan/rm_logo.png"></div>
                                    <div class="tpl-center"><div class="rm_film"><img src="/static/photo/tmpl/paonan/rm_film.png"></div><p class="rm_mask"></p><i class="rm_mask_shadow"></i></div>
                                </div>
                                <div class="img-list tpl-preview j-img-list" v-bind:style="slideStyle">
                                    <div v-for="(item, i) in items" v-bind:class="item.class" class="type-item item list-page j-img-item" v-bind:style="windowSize">
                                        <div v-if="item.class['page-1'] == true" class="rm_hightop rm_top1">
                                            <div class="rm_m1">
                                                <b class="rm_m1_mo"><img src="/static/photo/tmpl/paonan/rm_mo.png"></b>
                                                <b class="rm_m1_box"><img src="/static/photo/tmpl/paonan/rm_box.png"></b>
                                            </div>
                                        </div>
                                        <div v-if="item.class['page-2'] == true" class="rm_hightop rm_top2">
                                            <div class="rm_m2">
                                                <b class="rm_m2_coin"><img src="/static/photo/tmpl/paonan/rm_coin.png"></b>
                                                <b class="rm_m2_coin"><img src="/static/photo/tmpl/paonan/rm_coin.png"></b>
                                                <b class="rm_m2_coin"><img src="/static/photo/tmpl/paonan/rm_coin.png"></b>
                                            </div>
                                            <div class="rm_m3">
                                                <b class="rm_m3_guan"><img src="/static/photo/tmpl/paonan/rm_guan.png"></b>
                                                <b class="rm_m3_mo"><img src="/static/photo/tmpl/paonan/rm_mo2.png"></b>
                                            </div>
                                        </div>
                                        <div v-if="item.class['page-3'] == true" class="rm_hightop rm_top3">
                                            <div class="rm_m4"><img src="/static/photo/tmpl/paonan/rm_baby.png"></div>
                                            <div class="rm_m5">
                                                <b class="rm_m5_gui"><img src="/static/photo/tmpl/paonan/rm_gui.png"></b>
                                                <b class="rm_m5_box"><img src="/static/photo/tmpl/paonan/rm_box2.png"></b>
                                            </div>
                                        </div>
                                        <div v-if="item.class['page-4'] == true" class="rm_hightop rm_top4">
                                            <div class="rm_m6">
                                                <b class="rm_m6_coin rm_m6_coin1">
                                                    <img src="/static/photo/tmpl/paonan/rm_coin.png">
                                                    <img src="/static/photo/tmpl/paonan/rm_coin.png">
                                                </b>
                                                <b class="rm_m6_coin"><img src="/static/photo/tmpl/paonan/rm_coin.png"></b>
                                                <b class="rm_m6_box"><img src="/static/photo/tmpl/paonan/rm_box2.png"></b>
                                            </div>
                                        </div>
                                        <div v-if="item.class['page-5'] == true" class="rm_hightop rm_top5">
                                            <div class="rm_m7">
                                                <b class="rm_m7_hua"><img src="/static/photo/tmpl/paonan/rm_hua.png"></b>
                                            </div>
                                            <div class="rm_m8">
                                                <b class="rm_m8_mo"><img src="/static/photo/tmpl/paonan/rm_mo2.png"></b>
                                                <b class="rm_m8_gui"><img src="/static/photo/tmpl/paonan/rm_gui.png"></b>
                                            </div>
                                        </div>
                                        <div v-if="item.class['page-6'] == true" class="rm_hightop rm_top6">
                                            <div class="rm_m9"><img src="/static/photo/tmpl/paonan/rm_wzl.png"></div>
                                            <div class="rm_m10">
                                                <b class="rm_m10_cloud"><img src="/static/photo/tmpl/paonan/rm_cloud.png"></b>
                                                <b class="rm_m10_coin rm_m10_coin1">
                                                    <img src="/static/photo/tmpl/paonan/rm_coin.png">
                                                    <img src="/static/photo/tmpl/paonan/rm_coin.png">
                                                </b>
                                                <b class="rm_m10_coin rm_m10_coin2">
                                                    <img src="/static/photo/tmpl/paonan/rm_coin.png">
                                                    <img src="/static/photo/tmpl/paonan/rm_coin.png">
                                                </b>
                                                <b class="rm_m10_guan"><img src="/static/photo/tmpl/paonan/rm_guan2.png"></b>
                                            </div>
                                        </div>
                                        <div v-if="item.class['page-7'] == true" class="rm_hightop rm_top7">
                                            <div class="rm_m11">
                                                <b class="rm_m11_guan"><img src="/static/photo/tmpl/paonan/rm_guan.png"></b>
                                                <b class="rm_m11_ju"><img src="/static/photo/tmpl/paonan/rm_ju.png"></b>
                                            </div>
                                            <div class="rm_m12"><img src="/static/photo/tmpl/paonan/rm_lh.png"></div>
                                        </div>

                                        <div class="img-page">
                                            <div class="cover-frame">
                                                <div class="cover-img j-img-page">
                                                    <img v-bind:style="item.imgStyle" v-bind:class="[item.isWidth ? 'isWidth' : 'isHeight']" v-bind:src="item.url" class="j-page-inner-move-img" />
                                                    <div class="mask-cover j-mask-cover mask-anim"><i></i></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="ele-list" v-bind:style="windowSize">
                                    <div v-if="curItem == 0" class="ele-page ele1">
                                        <div class="rm_bottom">
                                            <b class="rm_1"><img src="/static/photo/tmpl/paonan/rm_11.png"></b>
                                            <b class="rm_2"><img src="/static/photo/tmpl/paonan/rm_12.png"></b>
                                        </div>
                                    </div>

                                    <div v-if="curItem == 1" class="ele-page ele2">
                                        <div class="rm_bottom">
                                            <b class="rm_1"><img src="/static/photo/tmpl/paonan/rm_21.png"></b>
                                            <b class="rm_2"><img src="/static/photo/tmpl/paonan/rm_22.png"></b>
                                        </div>
                                    </div>

                                    <div v-if="curItem == 2" class="ele-page ele3">
                                        <div class="rm_bottom">
                                            <b class="rm_1"><img src="/static/photo/tmpl/paonan/rm_31.png"></b>
                                            <b class="rm_2"><img src="/static/photo/tmpl/paonan/rm_32.png"></b>
                                        </div>
                                    </div>

                                    <div v-if="curItem == 3" class="ele-page ele4">
                                        <div class="rm_bottom">
                                            <b class="rm_1"><img src="/static/photo/tmpl/paonan/rm_41.png"></b>
                                            <b class="rm_2"><img src="/static/photo/tmpl/paonan/rm_42.png"></b>
                                        </div>
                                    </div>

                                    <div v-if="curItem == 4" class="ele-page ele5">
                                        <div class="rm_bottom">
                                            <b class="rm_1"><img src="/static/photo/tmpl/paonan/rm_51.png"></b>
                                            <b class="rm_2"><img src="/static/photo/tmpl/paonan/rm_52.png"></b>
                                        </div>
                                    </div>

                                    <div v-if="curItem == 5" class="ele-page ele6">
                                        <div class="rm_bottom">
                                            <b class="rm_1"><img src="/static/photo/tmpl/paonan/rm_61.png"></b>
                                            <b class="rm_2"><img src="/static/photo/tmpl/paonan/rm_62.png"></b>
                                        </div>
                                    </div>

                                    <div v-if="curItem == 6" class="ele-page ele7">
                                        <div class="rm_bottom">
                                            <b class="rm_1"><img src="/static/photo/tmpl/paonan/rm_71.png"></b>
                                            <b class="rm_2"><img src="/static/photo/tmpl/paonan/rm_72.png"></b>
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

.paonan-vue .wrap {
    background: #fff;
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: absolute;
    background: url(/static/photo/tmpl/paonan/rm_bg.jpg) no-repeat;
    background-size: 100% 100%;
}

.paonan-vue .mod-img-wrap {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden
}

.paonan-vue .mod-img-wrap .img-list {
    width: 100%;
    height: 100%;
    overflow: hidden
}

.paonan-vue .mod-img-wrap .img-list .list-page {
    width: 100%;
    height: 100%;
    position: relative;
    display: inline-block;
    overflow: hidden;
}

.paonan-vue .img-page {
    position: absolute;
    width: 100%;
    height: 66%;
    margin: 0 auto;
    overflow: hidden;
    top: 22%;
    z-index: 1;
}

.paonan-vue .tpl-top {
    position: absolute;
    overflow: hidden;
    width: 100%;
    height: 22%;
    top: 0;
    left: 0;
    text-align: center;
}
.paonan-vue .tpl-top .rm_logo {
    position: relative;
    display: inline-block;
    height: 65%;
    top: 22%;

    -webkit-transform: translateY(-250%) scale(0.8);
    -webkit-transform-origin: top center;
    -webkit-transition: all .5s 1s;
}
.paonan-vue .animate .tpl-top .rm_logo {
    -webkit-transform: translateY(0) scale(1);
    -webkit-transition: all .5s 1s;
}
.paonan-vue .tpl-center {
    position: absolute;
    width: 100%;
    height: 66%;
    margin: 0 auto;
    top: 22%;
}
.paonan-vue .tpl-center .rm_film {
    position: absolute;
    height: 117%;
    top: -12%;
    left: -48%;

    -webkit-transform: translateX(-180%);
    -webkit-transition: -webkit-transform .3s 0s;

    z-index: 9;
}
.paonan-vue .animate .tpl-center .rm_film {
    -webkit-transform: translateY(0);
    -webkit-transition: -webkit-transform .3s 0s;
}

.paonan-vue .film-mask {
    position: absolute !important;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 18;
    pointer-events: none;
    overflow: hidden;
}
.paonan-vue .paonan-cover {
    text-align: center;
}
.paonan-vue .rm_film {
    display: inline-block;
    position: relative;
    height: 65%;
    top: 14%;
}
.paonan-vue .rm_film > img {
    opacity: 0;
    height: 100%;
    -webkit-transform: scale(0.3,0.3);
    -webkit-transition: all 1s 1s cubic-bezier(0.165, .84, .44, 1);
}
.paonan-vue .animate .rm_film > img {
    opacity: 1;
    -webkit-transform: scale(1,1);
    -webkit-transition: all 1s 1s cubic-bezier(0.165, .84, .44, 1);
}
.paonan-vue .paonan-cover b {
    position: absolute;
    z-index: 2;
}
.paonan-vue .tpl-cover .rm_logo {
    position: absolute;
    width: 100%;
    height: 18%;
    left: 0;
    bottom: 0;
    text-align: center;
    -webkit-transform: translateY(-250%) scale(1.3);
    -webkit-transition: all 1s 1s cubic-bezier(0.165, .84, .44, 1);
}
.paonan-vue .tpl-cover.animate .rm_logo {
    -webkit-transform: translateY(0) scale(1);
    -webkit-transition: all 1s 1s cubic-bezier(0.165, .84, .44, 1);

}
.paonan-vue .tpl-cover .rm_logo img {
    position: relative;
    display: inline-block;
    height: 88%;
    top: 6%;
}
.paonan-vue .rm_ball1 {
    width: 11%;
    left: -4%;
    top: 46%;
}
.paonan-vue .rm_ball2 {
    width: 20%;
    right: -7%;
    top: 23%;
}
.paonan-vue .rm_baby {
    opacity: 0;
    bottom: -8%;
    width: 44%;
    left: 28%;

    -webkit-transform-origin: top center;
    transform: translate(0,0) scale(0.5,0.5);
}
.paonan-vue .rm_wzl {
    opacity: 0;
    width: 40%;
    top: -15%;
    left: -5%;

    -webkit-transform: translate(60px,60px);
}
.paonan-vue .rm_zk {
    opacity: 0;
    width: 42%;
    top: -18%;
    right: -26%;
    
    -webkit-transform: translate(-60px,60px);
}
.paonan-vue .rm_dc {
    opacity: 0;
    width: 55%;
    bottom: -14%;
    left: -36%;
    
    -webkit-transform: translate(60px,-60px);
}
.paonan-vue .rm_lc {
    opacity: 0;
    width: 60%;
    bottom: -6%;
    right: -30%;
    
    -webkit-transform: translate(-60px,-60px);
}

.paonan-vue .animate .rm_film b {
    opacity: 1;
    -webkit-transform: translate(0,0) scale(1,1);

    -webkit-transition: all 1s 2.5s;
}

.paonan-vue .animate-b .rm_film b {
    opacity: 0 !important;
    -webkit-transform: translate(0,0) scale(0, 0) !important;

    -webkit-transition: all 1s 0s !important;
}
.paonan-vue .animate-b .rm_film .rm_wzl {
    -webkit-transform-origin: right bottom;
}
.paonan-vue .animate-b .rm_film .rm_zk {
    -webkit-transform-origin: left bottom;
}
.paonan-vue .animate-b .rm_film .rm_dc {
    -webkit-transform-origin: right top;
}
.paonan-vue .animate-b .rm_film .rm_lc {
    -webkit-transform-origin: left top;
}


.paonan-vue .animate-b .rm_logo, .paonan-vue .animate-b .rm_ball1, .paonan-vue .animate-b .rm_ball2 {
    opacity: 0 !important;
    -webkit-transform: translate(0,0) scale(0, 0) !important;
    -webkit-transition: all 1s 0s !important;
}

.paonan-vue .animate-b .rm_film {
    -webkit-animation: film_hide .2s 1s 1 linear both;
}



.paonan-vue #img-cover img {
    -webkit-transition: all 2s 2s;
    transition: all 2s 2s;
}
.paonan-vue .cover-img {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-size: 100% auto;
    background-position: 50% 50%;
    background-repeat: no-repeat
}

.paonan-vue .cover-title {
    font-size: 20px;
    text-align: center;
    line-height: 38px;
    padding-top: 16px;
    position: relative
}

.paonan-vue .title-decorate {
    display: block;
    height: 10px;
    width: 240px;
    margin: 0 auto;
    position: relative;
    padding-bottom: 9px;
    overflow: hidden
}

.paonan-vue .title-decorate b {
    display: block;
    height: 10px;
    width: 119px;
    position: absolute;
    top: 0;
    background-repeat: no-repeat
}

.paonan-vue .title-decorate.reverse {
    -webkit-transform: rotateX(180deg);
}

.paonan-vue .author {
    font-size: 14px;
    line-height: 23px
}

.paonan-vue .cover-frame {
    width: 100% !important;
    height: 100% !important;
    position: absolute;
    left: 0;
    right: 0;
}
.paonan-vue .fix-list {
    position: fixed;
    pointer-events: none;
    top: 0;
    left: 0;
    z-index: 5;
}
.paonan-vue .tpl-lists {
    position: relative;
    width: 100%;
    height: 100%;
    z-index: 1;
}
.paonan-vue .isWidth {
    height: 100% !important;
}
.paonan-vue .isHeight {
    width: 100% !important;
}

.paonan-vue .hide {
    display: none!important
}

.paonan-vue .clearfix:after {
    content: ".";
    height: 0;
    visibility: hidden;
    display: block;
    clear: both;
    font-size: 0;
    line-height: 0
}

.paonan-vue .clearfix {
    *zoom: 1
}

.paonan-vue .textoverflow {
    display: inline-block;
    white-space: nowrap;
    word-wrap: normal;
    word-break: break-all;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
    _width: 100%
}

.paonan-vue .noOp {
    opacity: 0!important
}

.paonan-vue .tpl-preview {
    height: 100%
}

.paonan-vue .tpl-preview .cover-main {
    -webkit-transform: translate3d(0, -600px, 0);
}

.paonan-vue .tpl-preview .title {
    position: absolute;
    top: 25%;
    left: 6%;
    -webkit-transform: scale(1,1);
    font-size: 5vw;
    text-align: left;
    margin: 0 auto;
    height: 0%;
    letter-spacing: 2px;
    /*text-overflow: ellipsis;*/
    overflow: hidden;
    white-space: nowrap;
    
    -webkit-transition: all 4s 4s ease;
    transition: all 4s 4s ease
}

.paonan-vue .tpl-preview.animate .title {
    height: 40%;

    -webkit-transition: all 4s 4s ease;
    transition: all 4s 4s ease
}

.paonan-vue .tpl-preview .author {
    position: absolute;
    opacity: 0;
    text-align: right;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    bottom: 10%;
    left: 6%;
    font-size: 3vw;
    height: 20%;
    letter-spacing: 1px;
}

.paonan-vue .tpl-preview .title, .paonan-vue .tpl-preview .author {
    width: 100%;
    /*white-space: nowrap; */
    /*text-overflow: ellipsis;*/
    overflow: hidden;
    -webkit-writing-mode: vertical-lr; 
    writing-mode: vertical-lr; 

}


.paonan-vue .rm_ball1 {
    -webkit-animation: ball 8s 0s infinite linear both;
}
.paonan-vue .rm_ball2 {
    -webkit-animation: ball 12s 0s infinite linear both;
}

.paonan-vue .tpl-preview.tpl-cover {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 5;
    width: 100%;
    /*background: url(/static/photo/tmpl/paonan/rm_bg.jpg) no-repeat;*/
    /*background-size: 100% 100%;*/
    z-index: 2;
    pointer-events: none;
}

.paonan-vue .tpl-preview.img-list {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 4;
    width: 100%;
    overflow: visible;
    -webkit-transform: translateX(100%);
    -webkit-transition: all 1.3s .4s cubic-bezier(0.165, .84, .44, 1);
    transition: all 1.3s .4s cubic-bezier(0.165, .84, .44, 1)
}

/*.paonan-vue .mod-img-wrap .tpl-preview.img-list .list-page {
    overflow: hidden
}*/

.paonan-vue .tpl-preview .cover-title {
    -webkit-transform: translateY(-250%);
}


.paonan-vue .tpl-preview.animate .author {
    -webkit-animation: opacity-show 1s 5s linear both;
}


.paonan-vue .tpl-preview.animate .cover-title {
    -webkit-animation: title-down 2s 2s cubic-bezier(0.77, 0, .175, 1) both;
}

.paonan-vue .tpl-cover.animate-b {
    -webkit-animation: cover-hide .2s 2.8s cubic-bezier(0.6, .04, .98, .335) both;
    z-index: 0;
}


.paonan-vue .img-list.animate {
    -webkit-transform: translateX(0%);
}
.paonan-vue .tpl-cover {
    overflow: hidden;
}
.paonan-vue .mask-cover {
    position: absolute;
    z-index: 10;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
}
.paonan-vue .mask-cover i {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: 3;
    opacity: 1 !important;
}
/*.paonan-vue .mask-cover i:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url(/static/photo/tmpl/paonan/rm_mm.png) no-repeat !important;
    background-size: 100% 100% !important;
    z-index: 0;
}*/
.paonan-vue .animate .mask-cover i:before {
    opacity: 1;
}
.paonan-vue .animate-b .mask-cover i:before {
    opacity: 1;
}

.paonan-vue .rm_mask {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background: url(/static/photo/tmpl/paonan/rm_mm.png) no-repeat !important;
    background-size: 100% 100% !important;

    -webkit-transform: translateX(180%);
    -webkit-transition: all .6s 2.5s;
    z-index: 5;
}
.paonan-vue .animate .rm_mask {
    -webkit-transform: translateX(0);
    -webkit-transition: all .6s 2.5s;
}
.paonan-vue .rm_mask:after {
    content: '';
    position: absolute;
    top: 7%;
    right: -4.5%;
    width: 36px;
    height: 86%;
    background: url(/static/photo/tmpl/paonan/rm_line.png) no-repeat;
    background-size: 100% 100%;
    z-index: 3;
}
.paonan-vue .rm_mask_shadow {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;

    -webkit-transform: translateX(180%);
    -webkit-transition: all .6s 2.5s;
}
.paonan-vue .animate .rm_mask_shadow {
    -webkit-transform: translateX(0);
    -webkit-transition: all .6s 2.5s;
}
.paonan-vue .rm_mask_shadow:before {
    content: '';
    width: 100%;
    height: 6%;
    position: absolute;
    top: 0;
    left: 0;
    background: #B2ABA3;
}
.paonan-vue .rm_mask_shadow:after {
    content: '';
    width: 100%;
    height: 6%;
    position: absolute;
    bottom: 0;
    left: 0;
    background: #B2ABA3;
}

.j-page-inner-move-img{
    max-width: inherit;
    -webkit-transform : translate3d(0px, 0px, 0px);
    -webkit-transition: -webkit-transform 4s ease 3s;
    -webkit-animation-fill-mode:forwards;
    z-index: 5;
}


.dialog-end-vue {
    z-index: 9 !important;
}
.play-vue .zan-icon, .play-vue .edit {
    z-index: 7 !important;
}


.paonan-vue .ele-list {
    position: fixed;
    width: 100%;
    height: 100%;
    bottom: 0;
    left: 0;
    z-index: 6;
}
.paonan-vue .rm_bottom {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    bottom: 0;
    -webkit-perspective: 600px;
    perspective: 600px;
    -webkit-transform: translateZ(0);
    -webkit-transform-origin: bottom;

    -webkit-animation: ele-hide2 .5s 6.3s linear both;
}
.paonan-vue .rm_1, .paonan-vue .rm_2 {
    position: absolute;
    bottom: 0;
    font-size: 0;

    -webkit-transform: rotate3d(1, 0, 0, -100deg);
    -webkit-transform-style: preserve-3d;
    -webkit-backface-visibility: hidden;
    -webkit-transform-origin: bottom;

    -webkit-animation: ele-show .6s .3s linear both;
}
.paonan-vue .rm_bottom .rm_1 {
    z-index: 2;
    -webkit-animation-delay: .3s;
}
.paonan-vue .rm_bottom .rm_2 {
    z-index: 1;
    -webkit-animation-delay: .6s;
}

.paonan-vue .ele1 .rm_1 {
    width: 66%;
    right: 0;
}
.paonan-vue .ele1 .rm_2 {
    width: 42%;
    left: 0;
}
.paonan-vue .ele2 .rm_1 {
    width: 60%;
    left: 0;
    z-index: 1;
}
.paonan-vue .ele2 .rm_2 {
    width: 48%;
    left: 44%;
    bottom: 4%;
    z-index: 2;
}
.paonan-vue .ele3 .rm_1 {
    width: 62%;
    right: -12%;
}
.paonan-vue .ele3 .rm_2 {
    width: 28%;
    right: 40.8%;
}
.paonan-vue .ele4 .rm_1 {
    width: 60%;
    left: 5%;
}
.paonan-vue .ele4 .rm_2 {
    width: 48%;
    left: 52%;
}
.paonan-vue .ele5 .rm_1 {
    width: 56%;
    right: 0;
}
.paonan-vue .ele5 .rm_2 {
    width: 38%;
    right: 36%;
}
.paonan-vue .ele6 .rm_1 {
    width: 52%;
    left: 0;
}
.paonan-vue .ele6 .rm_2 {
    width: 38%;
    left: 38%;
}
.paonan-vue .ele7 .rm_1 {
    width: 50%;
    right: 0;
}
.paonan-vue .ele7 .rm_2 {
    width: 54%;
    right: 29%;
}

.paonan-vue .rm_hightop {
    position: absolute;
    width: 100%;
    height: 22%;
    top: 0;
    left: 0;
    font-size: 0;
}
.paonan-vue .rm_m1 {
    position: relative;
    top: 25%;
    left: 10%;
}

.paonan-vue .rm_m1 .rm_m1_mo {
    display: block;
    width: 6%;
    -webkit-animation: rm_m1 1s 0s infinite linear alternate;
}
.paonan-vue .rm_m1 .rm_m1_box {
    display: block;
    width: 8%;
}

.paonan-vue .rm_m2 {
    position: relative;
    top: 26%;
    left: 9%;

    -webkit-transform: skew(9deg);
}
.paonan-vue .rm_m2 .rm_m2_coin {
    position: relative;
    display: inline-block;
    width: 3.5%;
}

.paonan-vue .rm_m2 .rm_m2_coin:nth-child(1) {
    top: 8px;
    margin-right: 8px;

    -webkit-animation: rm_m2 2s 0s infinite ease-in-out alternate;
}
.paonan-vue .rm_m2 .rm_m2_coin:nth-child(2) {
    top: 0px;
    margin-right: 10px;

    -webkit-animation: rm_m2 2s .7s infinite ease-in-out alternate;
}
.paonan-vue .rm_m2 .rm_m2_coin:nth-child(3) {
    top: 10px;

    -webkit-animation: rm_m2 2s 1.4s infinite ease-in-out alternate;
}

.paonan-vue .rm_m3 {
    position: absolute;
    top: 0;
    right: 0;
    width: 28%;
    text-align: center;
}
.paonan-vue .rm_m3 .rm_m3_guan {
    position: relative;
    display: block;
    margin: 0 auto;
    width: 38%;
    z-index: 2;
}

.paonan-vue .rm_m3 .rm_m3_mo {
    position: relative;
    display: block;
    margin: 6px auto 0;
    width: 23%;
    z-index: 1;

    -webkit-animation: rm_m3 1.5s 0s infinite steps(3, end);
}

.paonan-vue .rm_m4 {
    position: absolute;
    top: 0;
    left: 0;
    width: 26%;
    text-align: center;
}
.paonan-vue .rm_m5 {
    position: absolute;
    top: 23%;
    right: 0;
    width: 26%;
    text-align: right;
    font-size: 0;
}

.paonan-vue .rm_m5 .rm_m5_gui {
    position: absolute;
    display: block;
    width: 22%;
    top: 0;
    left: 45%;
    -webkit-transform: rotate(30deg);
    -webkit-animation: rm_m5 1s 0s infinite steps(2, start);
}

.paonan-vue .rm_m5 .rm_m5_box {
    display: block;
    width: 32%;
    margin: 32% 0 0 25%;
    -webkit-transform: rotate(-40deg);
    -webkit-animation: rm_m51 1s 1s infinite steps(2, start);
}

.paonan-vue .rm_m6 {
    position: absolute;
    top: 15%;
    right: 0;
    width: 26%;
    text-align: right;
    font-size: 0;
}
.paonan-vue .rm_m6 .rm_m6_box {
    display: block;
    width: 33%;
    -webkit-transform: rotate(-10deg);
    margin-left: 25%;
}
.paonan-vue .rm_m6 .rm_m6_coin img {
    width: 13px;
    margin-right: 3px;
}
.paonan-vue .rm_m6 .rm_m6_coin:nth-of-type(1) {
    display: block;
    text-align: left;
    margin-bottom: 3px;
    margin-left: 22%;

    -webkit-transform: rotate(-10deg);
}
.paonan-vue .rm_m6 .rm_m6_coin1 img {
    opacity: 0;
}
.paonan-vue .rm_m6 .rm_m6_coin:nth-of-type(2) {
    display: block;
    text-align: left;
    margin-left: 28%;

    -webkit-transform: rotate(-10deg);
    margin-bottom: 10px;
}
.paonan-vue .rm_m6 .rm_m6_coin:nth-of-type(2) img {
    -webkit-animation: rm_m2 1s 1.5s infinite linear alternate;
}
.paonan-vue .rm_m6 .rm_m6_coin1 img:nth-child(1) {
    -webkit-animation: rm_m2 1s 1s infinite linear alternate;
}
.paonan-vue .rm_m6 .rm_m6_coin1 img:nth-child(2) {
    -webkit-animation: rm_m2 1s 2s infinite linear alternate;
}

.paonan-vue .rm_m7 {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 15%;
    font-size: 0;
    -webkit-transform: translate(-10px,0);
    -webkit-animation: rm_m7 1s 2s infinite linear alternate;
}
.paonan-vue .rm_m8 {
    position: absolute;
    bottom: 0;
    right: 8px;
    width: 120px;
    text-align: right;
    font-size: 0;
}

.paonan-vue .rm_m8 b {
    display: inline-block;
    width: 24px;
    -webkit-transform: translateX(0);
    -webkit-animation: rm_m8 3s 2s infinite linear alternate;
}
.paonan-vue .rm_m8 b:nth-child(1) {
    margin-right: 16px;
}

.paonan-vue .rm_m9 {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 20%;
    text-align: center;
}
.paonan-vue .rm_m10 {
    position: absolute;
    top: 0;
    right: 0;
    width: 26%;
    height: 100%;
    text-align: right;
    font-size: 0;
}
.paonan-vue .rm_m10 .rm_m10_guan {
    position: absolute;
    width: 46%;
    bottom: 0;
    left: 27%;
}

.paonan-vue .rm_m10 .rm_m10_cloud {
    position: absolute;
    width: 30%;
    top: 10%;
    left: 40%;

    -webkit-transform: translateX(20px);
    -webkit-animation: rm_m101 3s 2s infinite linear alternate;
}
.paonan-vue .rm_m10 .rm_m10_coin {
    display: block;
    margin-bottom: 5px;
    text-align: center;
    width: 100%;
}
.paonan-vue .rm_m10 .rm_m10_coin:nth-child(2) {
    margin: 50% auto 4px;
}
.paonan-vue .rm_m10 .rm_m10_coin img {
    opacity: 0;
    width: 13%;

    -webkit-transform: scale(0.5,0.5) skew(-15deg);
}
.paonan-vue .rm_m10 .rm_m10_coin img:nth-child(1) {
    margin-right: 5px;
}

.paonan-vue .rm_m10 .rm_m10_coin1 img:nth-child(1) {
    -webkit-animation: rm_m102 1.5s 0s infinite linear alternate;
}
.paonan-vue .rm_m10 .rm_m10_coin1 img:nth-child(2) {
    -webkit-animation: rm_m102 1.5s .25s infinite linear alternate;
}
.paonan-vue .rm_m10 .rm_m10_coin2 img:nth-child(1) {
    -webkit-animation: rm_m102 1.5s .5s infinite linear alternate;
}
.paonan-vue .rm_m10 .rm_m10_coin2 img:nth-child(2) {
    -webkit-animation: rm_m102 1.5s .75s infinite linear alternate;
}

.paonan-vue .rm_m11 {
    position: absolute;
    top: 0;
    left: 0;
    width: 20%;
    height: 100%;
    text-align: center;
}
.paonan-vue .rm_m11 .rm_m11_guan {
    position: absolute;
    width: 66%;
    left: 25%;
    top: -20%;
}

.paonan-vue .rm_m11 .rm_m11_ju {
    position: relative;
    display: block;
    margin: 70% auto 0;
    width: 90%;
    left: 10%;

    -webkit-animation: rm_m11 1s 1s infinite steps(2, end);
}
.paonan-vue .rm_m12 {
    position: absolute;
    bottom: -15%;
    right: -2%;
    width: 23%;
    text-align: right;
    font-size: 0;
}

/**
 * paonan animate
 */
@-webkit-keyframes rm_m2 {
    0% {
        opacity: 1;
        transform: rotateY(180deg) scale(1);
        -webkit-transform: rotateY(180deg) scale(1);
    }
    22% {
        opacity: 1;
        transform: scale(1.1);
        -webkit-transform: scale(1.1);
    }
    33% {
        opacity: 1;
        transform: rotateY(360deg) scale(1);
        -webkit-transform: rotateY(360deg) scale(1);
    }
    100% {
        opacity: 1;
        transform: rotateY(360deg) scale(1);
        -webkit-transform: rotateY(360deg) scale(1);
    }
}
@-webkit-keyframes rm_m2 {
    0% {
        opacity: 1;
        transform: rotateY(180deg) scale(1);
        -webkit-transform: rotateY(180deg) scale(1);
    }
    25% {
        opacity: 1;
        transform: scale(1.1);
        -webkit-transform: scale(1.1);
    }
    50% {
        opacity: 1;
        transform: rotateY(360deg) scale(1);
        -webkit-transform: rotateY(360deg) scale(1);
    }
    100% {
        opacity: 1;
        transform: rotateY(360deg) scale(1);
        -webkit-transform: rotateY(360deg) scale(1);
    }
}

@-webkit-keyframes film_hide {
    0% {
        opacity: 1;
        height: 65%;
        -webkit-transform: translateX(0)
    }
    100% {
        opacity: 0;
        height: 77%;
        -webkit-transform: translateX(-150%)
    }
}

@keyframes film_hide {
    0% {
        height: 65%;
        transform: translateX(0)
    }
    100% {
        height: 77%;
        transform: translateX(-150%)
    }
}

@keyframes ball {
    0%, 100% {transform:translateY(0);}
    30%{transform:translateY(-30px);}
    60%{transform:translateY(20px);}
}
@-webkit-keyframes ball {
    0%, 100% {-webkit-transform:translateY(0);}
    30%{-webkit-transform:translateY(-30px);}
    60%{-webkit-transform:translateY(20px);}
}

@-webkit-keyframes opacity-show {
    to {
        opacity: 1
    }
}

@keyframes opacity-show {
    to {
        opacity: 1
    }
}

@-webkit-keyframes title-down {
    to {
        -webkit-transform: translateY(0)
    }
}

@keyframes title-down {
    to {
        transform: translateY(0)
    }
}

@-webkit-keyframes cover-hide {
    0% {opacity: 1;}
    100% {opacity: 0}
}
@keyframes cover-hide {
    0% {opacity: 1;}
    100% {opacity: 0}
}
@-webkit-keyframes mask-fade-in {
    0% {
        opacity: 1;
    }
    100% {
        opacity: 0;
    }
}
@keyframes mask-fade-in {
    0% {
        opacity: 1;
    }
    100% {
        opacity: 0;
    }
}

@-webkit-keyframes ele-show {
    0% {
        -webkit-transform: rotate3d(1, 0, 0, -100deg);
        transform: rotate3d(1, 0, 0, -100deg);
    }
    100% {
        -webkit-transform: rotate3d(1, 0, 0, 0);
        transform: rotate3d(1, 0, 0, 0);
    }
}
@keyframes ele-show {
    0% {
        -webkit-transform: rotate3d(1, 0, 0, -100deg);
        transform: rotate3d(1, 0, 0, -100deg);
    }
    100% {
        -webkit-transform: rotate3d(1, 0, 0, 0);
        transform: rotate3d(1, 0, 0, 0);
    }
}

@-webkit-keyframes ele-hide2 {
    0% {
        -webkit-transform: rotate3d(1, 0, 0, 0);
        transform: rotate3d(1, 0, 0, 0);
    }
    100% {
        -webkit-transform: rotate3d(1, 0, 0, -100deg);
        transform: rotate3d(1, 0, 0, -100deg);
    }
}
@keyframes ele-hide2 {
    0% {
        -webkit-transform: rotate3d(1, 0, 0, 0);
        transform: rotate3d(1, 0, 0, 0);
    }
    100% {
        -webkit-transform: rotate3d(1, 0, 0, -100deg);
        transform: rotate3d(1, 0, 0, -100deg);
    }
}

@-webkit-keyframes ele-hide {
    0% {
        opacity: 1;
        -webkit-transform: scale(1,1);
        transform: scale(1,1);

        /*-webkit-transform: translateY(0);*/
        /*transform: translateY(0);*/
    }
    100% {
        opacity: 0;
        -webkit-transform: scale(2,2);
        transform: scale(2,2);
        /*-webkit-transform: translateY(100%);*/
        /*transform: translateY(100%);*/
    }
}
@keyframes ele-hide {
    0% {
        opacity: 1;
        -webkit-transform: scale(1,1);
        transform: scale(1,1);
        /*-webkit-transform: translateY(0);*/
        /*transform: translateY(0);*/
    }
    100% {
        opacity: 0;
        -webkit-transform: scale(2,2);
        transform: scale(2,2);
        /*-webkit-transform: translateY(100%);*/
        /*transform: translateY(100%);*/
    }
}
@-webkit-keyframes rm_m1 {
    0% {
        -webkit-transform: translateX(0);
        transform: translateX(0);
    }
    100% {
        -webkit-transform: translateX(60%);
        transform: translateX(60%);
    }
}
@keyframes rm_m1 {
    0% {
        -webkit-transform: translateX(0);
        transform: translateX(0);
    }
    100% {
        -webkit-transform: translateX(60%);
        transform: translateX(60%);
    }
}
@-webkit-keyframes rm_m3 {
    0% {
        -webkit-transform: rotate(-30deg);
        transform: rotate(-30deg);
    }
    100% {
        -webkit-transform: rotate(60deg);
        transform: rotate(60deg);
    }
}
@keyframes rm_m3 {
    0% {
        -webkit-transform: rotate(-30deg);
        transform: rotate(-30deg);
    }
    100% {
        -webkit-transform: rotate(60deg);
        transform: rotate(60deg);
    }
}
@-webkit-keyframes rm_m5 {
    0% {
        -webkit-transform: rotate(30deg);
        transform: rotate(30deg);
    }
    100% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
    }
}
@keyframes rm_m5 {
    0% {
        -webkit-transform: rotate(30deg);
        transform: rotate(30deg);
    }
    100% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
    }
}
@-webkit-keyframes rm_m51 {
    0% {
        -webkit-transform: rotate(-40deg);
        transform: rotate(-40deg);
    }
    100% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
    }
}
@keyframes rm_m51 {
    0% {
        -webkit-transform: rotate(-40deg);
        transform: rotate(-40deg);
    }
    100% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
    }
}

@-webkit-keyframes rm_m7 {
    0% {
        -webkit-transform: translate(-10px,0px);
        transform: translate(-10px,0px);
    }
    100% {
        -webkit-transform: translate(0px,-10px);
        transform: translate(0px,-10px);
    }
}
@keyframes rm_m7 {
    0% {
        -webkit-transform: translate(-10px,0px);
        transform: translate(-10px,0px);
    }
    100% {
        -webkit-transform: translate(0px,-10px);
        transform: translate(0px,-10px);
    }
}
@-webkit-keyframes rm_m8 {
    0% {
        -webkit-transform: translateX(0);
        transform: translateX(0);
    }
    100% {
        -webkit-transform: translateX(-120px);
        transform: translateX(-120px);
    }
}
@keyframes rm_m8 {
    0% {
        -webkit-transform: translateX(0);
        transform: translateX(0);
    }
    100% {
        -webkit-transform: translateX(-120px);
        transform: translateX(-120px);
    }
}
@-webkit-keyframes rm_m101 {
    0% {
        -webkit-transform: translateX(20px);
        transform: translateX(20px);
    }
    100% {
        -webkit-transform: translateX(-20px);
        transform: translateX(-20px);
    }
}
@keyframes rm_m101 {
    0% {
        -webkit-transform: translateX(20px);
        transform: translateX(20px);
    }
    100% {
        -webkit-transform: translateX(-20px);
        transform: translateX(-20px);
    }
}
@-webkit-keyframes rm_m102 {
    0% {
        opacity: 0;
        -webkit-transform: scale(0.5,0.5) skew(-15deg);
        transform: scale(0.5,0.5) skew(-15deg);
    }
    100% {
        opacity: 1;
        -webkit-transform: scale(1.1,1.1) skew(-15deg);
        transform: scale(1.1,1.1) skew(-15deg);
    }
}
@keyframes rm_m102 {
    0% {
        opacity: 0;
        -webkit-transform: scale(0.5,0.5) skew(-15deg);
        transform: scale(0.5,0.5) skew(-15deg);
    }
    100% {
        opacity: 1;
        -webkit-transform: scale(1.1,1.1) skew(-15deg);
        transform: scale(1.1,1.1) skew(-15deg);
    }
}
@-webkit-keyframes rm_m11 {
    0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
    }
    100% {
        -webkit-transform: rotate(90deg);
        transform: rotate(90deg);
    }
}
@keyframes rm_m11 {
    0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
    }
    100% {
        -webkit-transform: rotate(90deg);
        transform: rotate(90deg);
    }
}
/**
 * END OF paonan animate
 */

</style>