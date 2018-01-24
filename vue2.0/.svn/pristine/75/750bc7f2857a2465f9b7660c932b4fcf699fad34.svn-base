<script>

import '../../assets/tmplCommon.css'
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
            serverIds: []
        }
    },

    methods: {

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
            }
            this.wxLoadPhotos();
        },

        wxLoadPhotos: function(){

            if(this.serverIds.length == 0){
                this.resizePhotos();
                return false;
            }

            var serverObj = this.serverIds.pop();
            var that = this;
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
            var width = $(window).width();
            var height = $(window).height();
            var items = [];
            var screenRatio = this.getScreenRatio();
            this.datas = this.photos.concat();
           
            for(var i = 0; i < this.datas.length; i++){
                this.datas[i].class = {};
                this.datas[i].class['animate'] = false;
                this.datas[i].class['type-class-' + ((i % 4) + 1) ] = true;
                this.datas[i].iclass= ((i % 4) + 1);

                var itemWidth = this.datas[i].width;
                var itemHeight = this.datas[i].height;

                if(itemWidth * screenRatio >= itemHeight){
                    // 宽图                  
                    var moveing = -1 * (width / itemHeight * itemWidth * screenRatio - width);
                    this.datas[i].defaultStyle = this.datas[i].imgStyle = { 'height' : '100%', };
                    this.datas[i].animateStyle = {
                        'height' : '100%',
                        'transform' : 'translate3d('+moveing+'px, 0px, 0px)'
                    }
                }else{
                    // 长图
                    var moveing = -1 * (width / itemWidth * itemHeight - width * screenRatio);
                    this.datas[i].defaultStyle = this.datas[i].imgStyle = { 'width' : '100%' };
                    this.datas[i].animateStyle = {
                        'width' : '100%',
                        'transform' : 'translate3d(0px, '+moveing+'px, 0px)'
                    }
                }

                this.items.push({
                    url : this.datas[i].url,
                    isActive : false,
                    class : this.datas[i].class,
                    imgStyle : this.datas[i].imgStyle,
                    animateStyle : this.datas[i].animateStyle,
                    text : this.datas[i].text,
                    iclass : this.datas[i].iclass
                });
            }

            var that = this;
            imgReady(this.datas[0].url, function(e) {
                setTimeout(function(){
                    that.isLoading = false;
                    that.play();    
                    that.$emit('hideEdit');
                }, 3000);
            });
            
            
        },

        play: function(){
            var theIndex = this.curIndex;
            var that = this;

            if(this.items.length <= 0){
                return false;
            }
            
            this.curIndex++
            if(this.curIndex >= this.items.length){
                this.end();
                return false;
            }
            this.resetItem(theIndex);
            this.items[this.curIndex].isActive = true;
            this.items[this.curIndex].class['animate-b'] = false;
            this.items[this.curIndex].class.animate = true;
            
            setTimeout(function(){
                that.items[that.curIndex].imgStyle = that.items[that.curIndex].animateStyle;
            }, 100);
            
            setTimeout(function(){
                that.play();
            },4500);
        },

        resetItem: function(index){
            if(this.items[index]){
                this.items[index].isActive = false;
                this.items[index].class.animate = false;
                this.items[index].class['animate-b'] = true;
                this.items[index].imgStyle = this.items[index].defaultStyle;
            }
        },

        getScreenRatio: function(){
            var width = window.screen.width;
            var height = window.screen.height;
            var pixRatio = window.devicePixelRatio;
            var ratio = 1;
            if(width <= 414 && height <= 480 ){
                ratio = 0.75;
            }

            if(width <= 414 && height >= 568 && pixRatio == 2){
                ratio = 0.95;
            }

            if(width <= 414 && height >= 667 && pixRatio == 2){
                ratio = 1;
            }

             if(width >= 384 && width <= 384 && pixRatio >= 3){
                ratio = 0.85;
            }
            return ratio;
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

                var that = this;
                this.play();
            }else{
                // 结束界面
                this.$emit('end');
            }
        }
    },

    created: function(){
        this.init();
    }
}

</script>

<template>

<section class="yaqu-vue tpl-self-time mod-os-ios">
    <div id="j-body">
        <div class="wrap j-wrap">
            <div class="mod-img-wrap">
                <div class="j-tpl-wrap">
                    <div class="wrap j-tpl-wrap">
                        <div class="mod-img-wrap">
                            <div v-if="isLoading" transition="fadein" v-bind:class="{ animate : isLoading }" class="mod-tpl-cover j-tpl-cover" style="position:absolute;top:0px;left:0px;">
                                <div class="album-title">
                                    <p class="title j-album-title">{{ title }}</p>
                                    <p class="author j-album-author j-lazy-load-nickname">{{ author }}</p>
                                </div>
                                <div class="cover-bottom"></div>
                            </div>
                            <div v-if="!isLoading" class="mod-img-list j-img-list">
                                <div v-for="(item, i) in items" v-bind:class="item.class" v-bind:style="{'display' : (item.isActive ? 'block' : 'none') }" class="type-item item j-img-item">
                                    <div class="bg-img">
                                        <div class="img-w">
                                            <p class="j-page-inner-move-img" style=" width: 100%; height:100%;" data-bordercalclass="img-w" data-imgwidth="600" data-imgheight="534" data-imghdwidth="0" data-imghdheight="0">
                                                <img v-bind:style="item.imgStyle" v-bind:src="item.url" class="j-page-inner-move-img" />
                                            </p>
                                        </div>
                                    </div>
                                    <div :class="'p' + item.iclass + '-top'" class="item-top">
                                        <div class="top-item"><span class="inner"></span></div>
                                    </div>
                                    <div :class="'p' + item.iclass + '-bottom'" class="item-bottom">
                                        <div class="bottom-bg"></div>
                                        <div class="decoration-right"><span class="inner"></span></div>
                                        <div class="decoration-left"><span class="inner"></span></div>
                                        <div class="text-area">{{ item.text }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
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
    .yaqu-vue{
        width: 100%;
        height: 100%;
    }
    .yaqu-vue .j-page-inner-move-img{
        max-width: inherit;
        -webkit-transform : translate3d(0px, 0px, 0px);
        position: absolute;
        left: 0; 
        top: 0;
        -webkit-transition: -webkit-transform 3.5s;
        -webkit-transform-origin:0 0;
    }

    .yaqu-vue.tpl-self-time .mod-tpl-cover {
        width: 100%;
        height: 100%;
        background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/tpl-yaqu/img/cover-bg.jpg);
        background-size: cover;
        background-position: center
    }
    
    .yaqu-vue.tpl-self-time .mod-tpl-cover .album-title {
        width: 320px;
        height: 275px;
        background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/tpl-yaqu/sprite/tpl-standard-1-160908113443@2x.png);
        background-position: 0 0;
        background-size: 722px 526px;
        position: absolute;
        top: 14%;
        left: 50%;
        margin-left: -160px
    }
    
    .yaqu-vue.tpl-self-time .mod-tpl-cover .album-title .author,
    .yaqu-vue.tpl-self-time .mod-tpl-cover .album-title .title {
        width: 100%;
        left: 0%;
        color: #000;
        text-align: center;
        font-size: 20px;
        position: absolute;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden
    }
    
    .yaqu-vue.tpl-self-time .mod-tpl-cover .album-title .title {
        top: 210px;
        font-size: 24px;
    }
    
    .yaqu-vue.tpl-self-time .mod-tpl-cover .album-title .author {
        top: 245px;
        font-size: 18px;
    }

    .yaqu-vue.tpl-self-time .mod-tpl-cover .cover-bottom {
        width: 100%;
        height: 0;
        padding-top: 47.7%;
        position: absolute;
        left: 0;
        bottom: 0;
        background-size: cover;
        background-position: center;
        background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/tpl-yaqu/img/cover-bottom-bg.png);
        background-repeat: no-repeat
    }

    
    .yaqu-vue.tpl-self-time .mod-img-list,
    .yaqu-vue.tpl-self-time .type-item {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        overflow: hidden;
        background-size: cover
    }
    
    .yaqu-vue.tpl-self-time .type-item .bg-img {
        width: 100%;
        height: 0;
        padding-top: 100%;
        overflow: hidden;
        position: absolute;
        background-color: #fff;
        opacity: 0
    }
    
    .yaqu-vue.tpl-self-time .type-item .bg-img .img-w {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0
    }
    
    .yaqu-vue.tpl-self-time .type-item .item-top {
        position: absolute;
        top: 0;
        width: 100%;
        height: auto
    }
    
    .yaqu-vue.tpl-self-time .type-item .item-bottom {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 0
    }
    
    .yaqu-vue.tpl-self-time .type-item .item-bottom .bottom-bg {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-size: cover
    }
    
    .yaqu-vue.tpl-self-time .type-item .item-bottom .text-area {
        height: 100%;
        position: absolute;
        font-size: 14px;
        color: #63b1bb;
        border: 1px dashed transparent!important;
        background: url(/static/photo/tmpl/yaqu/kong.png) no-repeat center top;
        background-size: contain;
        text-indent: -1000em;
    }
    
    .yaqu-vue.tpl-self-time .mod-img-list .type-class-1 {
        background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/tpl-yaqu/img/p1-bg.jpg)
    }
    
    .yaqu-vue.tpl-self-time .type-class-1 .bg-img {
        top: 8.5%
    }
    
    .yaqu-vue.tpl-self-time .type-class-1 .p1-top {
        position: absolute;
        top: 0;
        width: 100%;
        height: auto
    }
    
    .yaqu-vue.tpl-self-time .type-class-1 .p1-top .top-item {
        width: 125px;
        height: 70px;
        position: absolute;
        top: 12px;
        left: 0
    }
    
    .yaqu-vue.tpl-self-time .type-class-1 .p1-top .top-item .inner {
        width: 100%;
        height: 100%;
        display: inline-block;
        background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/tpl-yaqu/sprite/tpl-standard-1-160908113443@2x.png);
        background-position: -532px -191px;
        background-size: 722px 526px
    }
    
    .yaqu-vue.tpl-self-time .type-class-1 .p1-bottom {
        padding-top: 50.6%
    }
    
    .yaqu-vue.tpl-self-time .type-class-1 .p1-bottom .bottom-bg {
        width: 100%;
        height: 100%;
        background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/tpl-yaqu/img/p1-bottom-bg.png);
        background-size: cover;
        position: absolute;
        top: 0;
        left: 0
    }
    
    .yaqu-vue.tpl-self-time .type-class-1 .p1-bottom .decoration-right {
        width: 190px;
        height: 190px;
        position: absolute;
        right: 0;
        bottom: 0
    }
    
    .yaqu-vue.tpl-self-time .type-class-1 .p1-bottom .decoration-right .inner {
        display: inline-block;
        width: 100%;
        height: 100%;
        background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/tpl-yaqu/sprite/tpl-standard-1-160908113443@2x.png);
        background-position: -211px -276px;
        background-size: 722px 526px
    }
    
    .yaqu-vue.tpl-self-time .type-class-1 .p1-bottom .text-area {
        width: 50%;
        top: 40%;
        left: 5%;
    }
    
    .yaqu-vue.tpl-self-time .mod-img-list .type-class-2 {
        background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/tpl-yaqu/img/p2-bg.jpg)
    }
    
    .yaqu-vue.tpl-self-time .mod-img-list .type-class-2 .bg-img {
        top: 0
    }
    
    .yaqu-vue.tpl-self-time .type-class-2 .item-bottom {
        padding-top: 66.7%
    }
    
    .yaqu-vue.tpl-self-time .type-class-2 .item-bottom .bottom-bg {
        background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/tpl-yaqu/img/p2-bottom-bg.png)
    }
    
    .yaqu-vue.tpl-self-time .type-class-2 .item-bottom .decoration-left {
        width: 210px;
        height: 250px;
        position: absolute;
        bottom: 0;
        left: 0
    }
    
    .yaqu-vue.tpl-self-time .type-class-2 .item-bottom .decoration-left .inner {
        display: inline-block;
        width: 100%;
        height: 100%;
        background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/tpl-yaqu/sprite/tpl-standard-1-160908113443@2x.png);
        background-position: -321px 0;
        background-size: 722px 526px
    }
    
    .yaqu-vue.tpl-self-time .type-class-2 .item-bottom .decoration-right {
        width: 125px;
        height: 70px;
        position: absolute;
        top: 0;
        right: 0
    }
    
    .yaqu-vue.tpl-self-time .type-class-2 .item-bottom .decoration-right .inner {
        display: inline-block;
        width: 100%;
        height: 100%;
        background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/tpl-yaqu/sprite/tpl-standard-1-160908113443@2x.png);
        background-position: -532px -262px;
        background-size: 722px 526px
    }
    
    .yaqu-vue.tpl-self-time .type-class-2 .item-bottom .text-area {
        height: 60%;
        top: 30%;
        right: 5%;
        width: 45%;
        background-image: url(/static/photo/tmpl/yaqu/tian.png);
        background-position: left;
    }
    
    .yaqu-vue.tpl-self-time .mod-img-list .type-class-3 {
        background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/tpl-yaqu/img/p3-bg.jpg)
    }
    
    .yaqu-vue.tpl-self-time .type-class-3 .bg-img {
        top: 8.3%
    }
    
    .yaqu-vue.tpl-self-time .type-class-3 .item-top .top-item {
        width: 125px;
        height: 70px;
        position: absolute;
        top: 5px;
        right: 0
    }
    
    .yaqu-vue.tpl-self-time .type-class-3 .item-top .top-item .inner {
        width: 100%;
        height: 100%;
        display: inline-block;
        background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/tpl-yaqu/sprite/tpl-standard-1-160908113443@2x.png);
        background-position: -532px -333px;
        background-size: 722px 526px;

    }
    
    .yaqu-vue.tpl-self-time .type-class-3 .item-bottom {
        padding-top: 50.6%
    }
    
    .yaqu-vue.tpl-self-time .type-class-3 .item-bottom .bottom-bg {
        background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/tpl-yaqu/img/p3-bottom-bg.png);
        background-size: cover
    }
    
    .yaqu-vue.tpl-self-time .type-class-3 .item-bottom .decoration-left {
        width: 190px;
        height: 190px;
        position: absolute;
        bottom: 0;
        left: 0
    }
    
    .yaqu-vue.tpl-self-time .type-class-3 .item-bottom .decoration-left .inner {
        display: inline-block;
        width: 100%;
        height: 100%;
        background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/tpl-yaqu/sprite/tpl-standard-1-160908113443@2x.png);
        background-position: -532px 0;
        background-size: 722px 526px
    }
    
    .yaqu-vue.tpl-self-time .type-class-3 .item-bottom .text-area {
        height: 60%;
        top: 30%;
        right: 5%;
        width: 45%;
        background-image: url(/static/photo/tmpl/yaqu/jin.png);
    }
    
    .yaqu-vue.tpl-self-time .mod-img-list .type-class-4 {
        background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/tpl-yaqu/img/p4-bg.jpg)
    }
    
    .yaqu-vue.tpl-self-time .mod-img-list .type-class-4 .bg-img {
        top: 0
    }
    
    .yaqu-vue.tpl-self-time .type-class-4 .item-bottom {
        padding-top: 66.7%
    }
    
    .yaqu-vue.tpl-self-time .type-class-4 .item-bottom .bottom-bg {
        background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/tpl-yaqu/img/p4-bottom-bg.png)
    }
    
    .yaqu-vue.tpl-self-time .type-class-4 .item-bottom .decoration-left {
        width: 125px;
        height: 70px;
        position: absolute;
        top: 0;
        left: 0
    }
    
    .yaqu-vue.tpl-self-time .type-class-4 .item-bottom .decoration-left .inner {
        display: inline-block;
        width: 100%;
        height: 100%;
        background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/tpl-yaqu/sprite/tpl-standard-1-160908113443@2x.png);
        background-position: -532px -404px;
        background-size: 722px 526px
    }
    
    .yaqu-vue.tpl-self-time .type-class-4 .item-bottom .decoration-right {
        width: 210px;
        height: 250px;
        position: absolute;
        bottom: 0;
        right: 0
    }
    
    .yaqu-vue.tpl-self-time .type-class-4 .item-bottom .decoration-right .inner {
        display: inline-block;
        width: 100%;
        height: 100%;
        background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/tpl-yaqu/sprite/tpl-standard-1-160908113443@2x.png);
        background-position: 0 -276px;
        background-size: 722px 526px
    }
    
    .yaqu-vue.tpl-self-time .type-class-4 .item-bottom .text-area {
        top:25%;
        left: 5%;
        width: 50%;
        height: 60%;
        background-image: url(/static/photo/tmpl/yaqu/bu.png);
    }

    @media only screen and (max-device-height:480px) and (max-device-width:414px) {
        .yaqu-vue.tpl-self-time .mod-tpl-cover .album-title {
            zoom: .7;
            top: 10%
        }
        .yaqu-vue.tpl-self-time .type-item .bg-img {
            padding-top: 75%
        }
        .yaqu-vue.tpl-self-time .type-class-1 .p1-top .top-item {
            zoom: .7
        }
        .yaqu-vue.tpl-self-time .type-class-1 .p1-bottom .decoration-right {
            zoom: .8
        }
        .yaqu-vue.tpl-self-time .type-class-1 .p1-bottom .text-area {
            width: 50%;
            top: 35%
        }
        .yaqu-vue.tpl-self-time .type-class-2 .item-bottom .decoration-left,
        .yaqu-vue.tpl-self-time .type-class-2 .item-bottom .decoration-right {
            zoom: .6
        }
        .yaqu-vue.tpl-self-time .type-class-3 .p1-top .top-item {
            zoom: .7
        }
        .yaqu-vue.tpl-self-time .type-class-3 .item-bottom .decoration-left {
            zoom: .8
        }
        .yaqu-vue.tpl-self-time .type-class-4 .item-bottom .decoration-left {
            zoom: .7
        }
        .yaqu-vue.tpl-self-time .type-class-4 .item-bottom .decoration-right {
            zoom: .8
        }
    }
    
    @media only screen and (min-device-height:568px) and (max-device-width:414px) and (-webkit-device-pixel-ratio:2) {

        .yaqu-vue.tpl-self-time .mod-tpl-cover .album-title {
            zoom: .85
        }
        .yaqu-vue.tpl-self-time .type-item .bg-img {
            padding-top: 95%
        }
        .yaqu-vue.tpl-self-time .type-class-1 .p1-top .top-item {
            zoom: .7
        }
        .yaqu-vue.tpl-self-time .type-class-1 .p1-bottom .decoration-right,
        .yaqu-vue.tpl-self-time .type-class-2 .item-bottom .decoration-left,
        .yaqu-vue.tpl-self-time .type-class-2 .item-bottom .decoration-right {
            zoom: .8
        }
        .yaqu-vue.tpl-self-time .type-class-1 .p1-bottom .text-area {
            width: 50%;
            top: 35%
        }
        .yaqu-vue.tpl-self-time .type-class-3 .p1-top .top-item {
            zoom: .7
        }
        .yaqu-vue.tpl-self-time .type-class-3 .item-bottom .decoration-left,
        .yaqu-vue.tpl-self-time .type-class-4 .item-bottom .decoration-left,
        .yaqu-vue.tpl-self-time .type-class-4 .item-bottom .decoration-right {
            zoom: .8
        }
    }
    
    @media only screen and (min-device-height:667px) and (max-device-width:414px) and (-webkit-device-pixel-ratio:2) {
        .yaqu-vue.tpl-self-time .mod-tpl-cover .album-title,
        .yaqu-vue.tpl-self-time .type-class-1 .p1-bottom .decoration-right,
        .yaqu-vue.tpl-self-time .type-class-1 .p1-top .top-item,
        .yaqu-vue.tpl-self-time .type-class-2 .item-bottom .decoration-left,
        .yaqu-vue.tpl-self-time .type-class-2 .item-bottom .decoration-right,
        .yaqu-vue.tpl-self-time .type-class-3 .item-bottom .decoration-left,
        .yaqu-vue.tpl-self-time .type-class-3 .p1-top .top-item,
        .yaqu-vue.tpl-self-time .type-class-4 .item-bottom .decoration-left,
        .yaqu-vue.tpl-self-time .type-class-4 .item-bottom .decoration-right {
            zoom: 1
        }
        .yaqu-vue.tpl-self-time .type-item .bg-img {
            padding-top: 100%
        }
        .yaqu-vue.tpl-self-time .type-class-1 .p1-bottom .text-area {
            width: 50%;
            top: 20%
        }
    }
    
    @media only screen and (min-device-width:384px) and (max-device-width:384px) and (-webkit-min-device-pixel-ratio:3) {

        .yaqu-vue.tpl-self-time .mod-tpl-cover .album-title {
            zoom: .95
        }
        .yaqu-vue.tpl-self-time .mod-img-list .type-item .bg-img {
            padding-top: 85%
        }
    }
    
    
    
    
</style>