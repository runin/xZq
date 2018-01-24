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
            serverIds: [],
            flowerLength: 6,
            iclassFlower: [],
            img: [
                    "/static/photo/tmpl/huaqiangu/r1.png",
                    "/static/photo/tmpl/huaqiangu/r2.png",
                    "/static/photo/tmpl/huaqiangu/r3.png",
                    "/static/photo/tmpl/huaqiangu/r4.png",
                    "/static/photo/tmpl/huaqiangu/bottom3.png",
                    "/static/photo/tmpl/huaqiangu/bottom4.png",
                    "/static/photo/tmpl/huaqiangu/bottom5.png",
                    "/static/photo/tmpl/huaqiangu/rain.png",
                    "/static/photo/tmpl/huaqiangu/left4.png",
                    "/static/photo/tmpl/huaqiangu/fan2.png",
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
            for(var i = 1; i < 6; i++){
                this.img.push("/static/photo/tmpl/huaqiangu/mask"+ i +".png",);
            }
            var that = this;
            for (var i = 0; i < that.img.length; i++) {
                var img = new Image();
                img.src = that.img[i];
                img.onload = function () {console.log("IMG loaded successfully");}
            }
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
                this.datas[i].class['type-class-' + ((i % 5) + 1) ] = true;
                this.datas[i].iclass= ((i % 5) + 1);

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
                    var moveing = -1 * (width / itemWidth * itemHeight - (width * screenRatio + 100));
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

            for(var i = 0; i < this.flowerLength; i++){
                this.iclassFlower.push({
                    flower1: "hua"+i,
                    flower2: {
                                className: "iclass2-f"+i,
                                src: "/static/photo/tmpl/huaqiangu/f"+ i +".png"
                            },
                    flower3: "rain"+i,
                    flower4: {
                        className: "iclass4-f"+i,
                        src: "/static/photo/tmpl/huaqiangu/f4-"+ i +".png"
                    }
                });
            }

            var that = this;
            imgReady(this.datas[0].url, function(e) {
                setTimeout(function(){
                    that.isLoading = false;
                    that.play();
                    that.$emit('playing');
                }, 3000);
            });


        },

        play: function(){
            var theIndex = this.curIndex;
            var that = this;

            if(this.items.length <= 0){
                return false;
            }

            this.curIndex++;
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

    <section class="huaqiangu-vue tpl-self-time mod-os-ios">
        <div id="j-body">
            <div class="wrap j-wrap">
                <div class="mod-img-wrap">
                    <div class="j-tpl-wrap">
                        <div class="wrap j-tpl-wrap">
                            <div class="mod-img-wrap">
                                <div v-if="isLoading" transition="fadein" v-bind:class="{ animate : isLoading }" class="mod-tpl-cover j-tpl-cover" style="position:absolute;top:0px;left:0px;">
                                    <div class="fix-box">
                                        <div class="move-box">
                                            <img class="flower-2" src="/static/photo/tmpl/huaqiangu/flower.png"/>
                                            <img class="flower-3" src="/static/photo/tmpl/huaqiangu/flower.png"/>
                                            <img class="index-down-bg" src="/static/photo/tmpl/huaqiangu/home.jpg">
                                        </div>
                                    </div>
                                    <img class="icon-hua" src="/static/photo/tmpl/huaqiangu/icon-hua.png" />
                                    <div class="album-title">
                                        <p class="title j-album-title">{{ title }}</p>
                                        <p class="author j-album-author j-lazy-load-nickname">{{ author }}</p>
                                    </div>
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
                                        <div :class="'p' + item.iclass + '-top'"class="item-mask"></div>
                                        <div v-if="item.iclass == 1" >
                                            <div class="fix-box huabanmen">
                                                <img v-for="(flower, i) in iclassFlower" v-bind:class="[flower.flower1]" src="/static/photo/tmpl/huaqiangu/flower.png">
                                            </div>
                                            <div class="item-bottom p1-bottom">
                                                <img class="text1" src="/static/photo/tmpl/huaqiangu/text1.png"/>
                                                <img class="r1" src="/static/photo/tmpl/huaqiangu/r1.png"/>
                                            </div>
                                        </div>
                                        <div v-if="item.iclass == 2" >
                                            <div class="fix-box huabanmen">
                                                <img v-for="(flower, i) in iclassFlower" v-bind:class="[flower.flower2.className]" v-bind:src="flower.flower2.src">
                                            </div>
                                            <div class="item-bottom p2-bottom">
                                                <img class="fan" src="/static/photo/tmpl/huaqiangu/fan2.png"/>
                                                <img class="r2" src="/static/photo/tmpl/huaqiangu/r2.png"/>
                                                <img class="text2" src="/static/photo/tmpl/huaqiangu/text2.png"/>
                                            </div>
                                        </div>
                                        <div v-if="item.iclass == 3" >
                                            <div class="fix-box huabanmen">
                                                <img v-for="(flower, i) in iclassFlower" v-bind:class="[flower.flower3]" src="/static/photo/tmpl/huaqiangu/rain.png">
                                            </div>
                                            <div class="item-bottom p3-bottom">
                                                <img class="bottom" src="/static/photo/tmpl/huaqiangu/bottom3.png"/>
                                                <img class="r3" src="/static/photo/tmpl/huaqiangu/r3.png"/>
                                                <img class="text3" src="/static/photo/tmpl/huaqiangu/text2.png"/>
                                            </div>
                                        </div>
                                        <div v-if="item.iclass == 4" >
                                            <div class="fix-box huabanmen">
                                                <img v-for="(flower, i) in iclassFlower" v-bind:class="[flower.flower4.className]" v-bind:src="flower.flower4.src">
                                            </div>
                                            <div class="item-bottom p4-bottom">
                                                <img class="bottom" src="/static/photo/tmpl/huaqiangu/bottom4.png"/>
                                                <img class="left4" src="/static/photo/tmpl/huaqiangu/left4.png"/>
                                                <img class="r4" src="/static/photo/tmpl/huaqiangu/r4.png"/>
                                                <img class="text4" src="/static/photo/tmpl/huaqiangu/text2.png"/>
                                            </div>
                                        </div>
                                        <div v-if="item.iclass == 5" >
                                            <div class="fix-box huabanmen">
                                                <img v-for="(flower, i) in iclassFlower" v-bind:class="[flower.flower3]" src="/static/photo/tmpl/huaqiangu/rain.png">
                                            </div>
                                            <div class="item-bottom p5-bottom">
                                                <img class="r5" src="/static/photo/tmpl/huaqiangu/r3.png"/>
                                                <img class="bottom" src="/static/photo/tmpl/huaqiangu/bottom5.png"/>
                                                <img class="text5" src="/static/photo/tmpl/huaqiangu/text2.png"/>
                                            </div>
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
    .huaqiangu-vue {
        height: 100%;
    }
    .huaqiangu-vue .j-page-inner-move-img{
        max-width: inherit;
        -webkit-transform : translate3d(0px, 0px, 0px);
        position: absolute;
        left: 0;
        top: 0;
        -webkit-transition: -webkit-transform 3.5s;
        -webkit-transform-origin:0 0;
    }

    .huaqiangu-vue.tpl-self-time .mod-tpl-cover {
        width: 100%;
        height: 100%;
        background-image: url(/static/photo/tmpl/huaqiangu/home.jpg);
        background-size: cover;
        background-position: center
    }
    .huaqiangu-vue.tpl-self-time .mod-tpl-cover .fix-box{
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        overflow: hidden;
    }
    .huaqiangu-vue.tpl-self-time .mod-tpl-cover .fix-box .move-box {
        position: absolute;
        width: 120%;
        height: 100%;
        top: 0;
        left: 0;
        -webkit-animation: mm 25s ease infinite;
        animation: mm 25s ease infinite;
    }
    .huaqiangu-vue.tpl-self-time .mod-tpl-cover .fix-box .move-box .index-down-bg{
        position: absolute;
        width: 100%;
        height: 100%;
        max-width: 140%;
    }
    .huaqiangu-vue.tpl-self-time .mod-tpl-cover .fix-box .move-box .flower-1{
        position: absolute;
        width: 30px;
        height: 20px;
        left: 10%;
        top: 10%;
        z-index: 3;
        -webkit-animation:flower1 8s infinite;
    }
    .huaqiangu-vue.tpl-self-time .mod-tpl-cover .fix-box .move-box .flower-2{
        position: absolute;
        width: 30px;
        height: 20px;
        left: 50%;
        top: 30%;
        z-index: 3;
        -webkit-animation:flower2 12s infinite;
    }
    .huaqiangu-vue.tpl-self-time .mod-tpl-cover .fix-box .move-box .flower-3{
        position: absolute;
        width: 30px;
        height: 20px;
        left: 80%;
        top: 50%;
        z-index: 3;
        -webkit-animation:flower3 10s infinite;
    }
    .huaqiangu-vue.tpl-self-time .mod-tpl-cover .icon-hua{
        position: relative;
        display: block;
        margin: 12vh auto 0;
        width: 56px;
    }
    .huaqiangu-vue.tpl-self-time .mod-tpl-cover .album-title {
        position: absolute;
        left: 50%;
        margin-left: -18px;
    }

    .huaqiangu-vue.tpl-self-time .mod-tpl-cover .album-title .author,
    .huaqiangu-vue.tpl-self-time .mod-tpl-cover .album-title .title {
        width: 100%;
        left: 0%;
        text-align: center;
        font-size: 20px;
        /* white-space: nowrap; */
        text-overflow: ellipsis;
        overflow: hidden;
        /* -webkit-writing-mode: vertical-lr; */
        -ms-writing-mode: tb-lr;
        /* writing-mode: vertical-lr; */
    }

    .huaqiangu-vue.tpl-self-time .mod-tpl-cover .album-title .title {
        font-size: 15px;
        color: #F091B9;
        min-height: 35vh;
        max-height: 290px;
        margin: 10px auto;
        width: 15px;
    }

    .huaqiangu-vue.tpl-self-time .mod-tpl-cover .album-title .author {
        width: 30px;
        font-size: 12px;
        color: #FFF;
        background-image: url(/static/photo/tmpl/huaqiangu/icon-author.png);
        background-repeat: no-repeat;
        background-size: 100% 100%;
        padding: 5px 7px;
        max-height: 108px;
    }

    .huaqiangu-vue.tpl-self-time .mod-img-list,
    .huaqiangu-vue.tpl-self-time .type-item {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        overflow: hidden;
        background-size: cover;
    }

    .huaqiangu-vue.tpl-self-time .type-item .bg-img {
        width: 100%;
        height: 0;
        padding-top: 100%;
        overflow: hidden;
        position: absolute;
        background-color: #fff;
        opacity: 0;
    }

    .huaqiangu-vue.tpl-self-time .type-item .bg-img .img-w {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0
    }

    .huaqiangu-vue.tpl-self-time .type-class-1 .item-bottom {
        position: absolute;
        bottom: 0;
        width: 100%;
    }
    .huaqiangu-vue.tpl-self-time .type-class-1 .p1-bottom .text1,
    .huaqiangu-vue.tpl-self-time .type-class-1 .p1-bottom .r1{
        position: absolute;
        bottom: 0;
        opacity: 0;
    }
    .huaqiangu-vue.tpl-self-time .type-class-1 .p1-bottom .text1 {
        left: 11% ;
        width: 4%;
        margin-bottom: 20%;
    }
    .huaqiangu-vue.tpl-self-time .type-class-1 .p1-bottom .r1 {
        display: block;
        right: 0;
        width: 58%;
    }

    .tpl-self-time .type-class-1.animate .p1-bottom .text1{
        -webkit-animation: fadeInUp .7s ease .2s 1 both;
    }
    .tpl-self-time .type-class-1.animate .p1-bottom .r1 {
         -webkit-animation: right .8s ease .3s 1 forwards;
     }
    .huaqiangu-vue.tpl-self-time .type-item.type-class-1 .bg-img {
        padding-top: 0;
        height: 65%;
        top: 1%;
        width: 90%;
        right: 0;
    }
    .huaqiangu-vue.tpl-self-time .type-class-1 .p1-top {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        background: url(/static/photo/tmpl/huaqiangu/mask1.png) no-repeat;
        background-size: 100% 100%;
    }
    .huaqiangu-vue.tpl-self-time .type-class-1 .fix-box.huabanmen{
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        overflow: hidden;
    }
    .huaqiangu-vue.tpl-self-time .type-class-1 .fix-box.huabanmen img{
        position: absolute;
        width: 42px;
        height: 31px;
        opacity: 0;
    }
    .huaqiangu-vue.tpl-self-time .type-class-1 .fix-box.huabanmen .hua1{
        top: 3%;
        left: 10%;
    }
    .huaqiangu-vue.tpl-self-time .type-class-1 .fix-box.huabanmen .hua2
    {
        top: 10%;
        left: 3%;
    }
    .huaqiangu-vue.tpl-self-time .type-class-1 .fix-box.huabanmen .hua3{
        top: -1%;
        left: 12%;
    }
    .huaqiangu-vue.tpl-self-time .type-class-1 .fix-box.huabanmen .hua4{
        top: 15%;
        left: 2%;
    }
    .huaqiangu-vue.tpl-self-time .type-class-1 .fix-box.huabanmen .hua5{
        top: 22%;
        left: 1%;
    }
    .huaqiangu-vue.tpl-self-time .type-class-1 .fix-box.huabanmen .hua0{
        top: 7%;
        left: 1%;
    }
    .huaqiangu-vue.tpl-self-time .type-class-1.animate .fix-box.huabanmen .hua1{
        -webkit-animation: hua1 5.6s 1s linear infinite;
    }
    .huaqiangu-vue.tpl-self-time .type-class-1.animate .fix-box.huabanmen .hua2
    {
        -webkit-animation: hua2 7s 1.5s ease infinite;
    }
    .huaqiangu-vue.tpl-self-time .type-class-1.animate .fix-box.huabanmen .hua3{
        -webkit-animation: hua3 6.5s 2s ease infinite;
    }
    .huaqiangu-vue.tpl-self-time .type-class-1.animate .fix-box.huabanmen .hua4{
        -webkit-animation: hua4 7.3s 2.3s ease  infinite;
    }
    .huaqiangu-vue.tpl-self-time .type-class-1.animate .fix-box.huabanmen .hua5{
        -webkit-animation: hua5 8s 1s ease  infinite;
    }
    .huaqiangu-vue.tpl-self-time .type-class-1.animate .fix-box.huabanmen .hua0{
        -webkit-animation: hua0 6.3s ease 0.5s  infinite;
    }

    .huaqiangu-vue.tpl-self-time .mod-img-list .type-class-2 {

    }
    .huaqiangu-vue.tpl-self-time .type-class-2 .p2-top {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        background: url(/static/photo/tmpl/huaqiangu/mask2.png) no-repeat;
        background-size: 100% 100%;
    }
    .huaqiangu-vue.tpl-self-time .type-item.type-class-2 .bg-img{
        padding-top: 0;
        height: 65%;
        top: 0
    }
    .huaqiangu-vue.tpl-self-time .type-class-2 .item-bottom .fan,
    .huaqiangu-vue.tpl-self-time .type-class-2 .p2-bottom .r2,
    .huaqiangu-vue.tpl-self-time .type-class-2 .item-bottom .text2{
        position: absolute;
        bottom: 0;
        opacity: 0;
    }
    .huaqiangu-vue.tpl-self-time .type-class-2.animate .item-bottom .fan{
        -webkit-animation: fadeInUp .6s ease .2s forwards;
    }
    .huaqiangu-vue.tpl-self-time .type-class-2.animate .item-bottom .r2{
        -webkit-animation: left .7s ease .4s forwards;
    }
    .huaqiangu-vue.tpl-self-time .type-class-2.animate .item-bottom .text2{
        -webkit-animation: right .8s ease .1s forwards;
    }
    .huaqiangu-vue.tpl-self-time .type-class-2 .p2-bottom .r2{
        width: 65%;
        left: 0;
    }
    .huaqiangu-vue.tpl-self-time .type-class-2 .p2-bottom .text2{
        width: 15%;
        right: 13%;
        bottom: 5%;
    }
    .huaqiangu-vue.tpl-self-time .type-class-2 .fix-box{
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        overflow: hidden;
    }
    .huaqiangu-vue.tpl-self-time .type-class-2 .fix-box img{
        position: absolute;
        opacity: 0;
    }
    .huaqiangu-vue.tpl-self-time .type-class-2 .fix-box .iclass2-f1{
        width: 35px;
        left: 75%;
        top: 1%;
    }
    .huaqiangu-vue.tpl-self-time .type-class-2 .fix-box .iclass2-f2{
        width: 15px;
        left: 92%;
        top: 2%;
    }
    .huaqiangu-vue.tpl-self-time .type-class-2 .fix-box .iclass2-f3{
        width: 10px;
        left: 82%;
        top: 9%;
    }
    .huaqiangu-vue.tpl-self-time .type-class-2 .fix-box .iclass2-f4{
        width: 19px;
        left: 85%;
        top: 5%;
    }
    .huaqiangu-vue.tpl-self-time .type-class-2 .fix-box .iclass2-f5{
        width: 12px;
        left: 91%;
        top: 16%;
    }
    .huaqiangu-vue.tpl-self-time .type-class-2 .fix-box .iclass2-f0{
        width: 15px;
        left: 92%;
        top: 12%;
    }
    .huaqiangu-vue.tpl-self-time .type-class-2.animate .fix-box .iclass2-fl{
        -webkit-animation: iclass2-fl 9.5s 1s linear infinite;
    }
    .huaqiangu-vue.tpl-self-time .type-class-2.animate .fix-box .iclass2-f2{
        -webkit-animation: iclass2-f2 9.2s 1.5s linear infinite;
    }
    .huaqiangu-vue.tpl-self-time .type-class-2.animate .fix-box .iclass2-f3{
        -webkit-animation: iclass2-f3 11.5s 4s linear infinite;
    }
    .huaqiangu-vue.tpl-self-time .type-class-2.animate .fix-box .iclass2-f4{
        -webkit-animation: iclass2-f4 8.3s 2.5s linear  infinite;
    }
    .huaqiangu-vue.tpl-self-time .type-class-2.animate .fix-box .iclass2-f5{
        -webkit-animation: iclass2-f5 11.3s 2s linear  infinite;
    }
    .huaqiangu-vue.tpl-self-time .type-class-2.animate .fix-box .iclass2-f0{
        -webkit-animation: iclass2-f0 6.7s  3s linear  infinite;
    }
    .huaqiangu-vue.tpl-self-time .type-item.type-class-3 .bg-img{
        padding-top: 0;
        height: 65%;
        top: 3.3%;
    }
    .huaqiangu-vue.tpl-self-time .type-class-3 .fix-box{
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        overflow: hidden;
    }
    .huaqiangu-vue.tpl-self-time .type-class-3.animate .fix-box img{
        width: 100%;
        height: 100%;
        opacity: .6;
        position: absolute;
    }
    .huaqiangu-vue.tpl-self-time .type-class-3.animate .fix-box .rain1{
        left: 0;
        top: 0%;
        -webkit-animation: rainning 6s linear infinite;
    }
    .huaqiangu-vue.tpl-self-time .type-class-3.animate .fix-box .rain2{
        left:10%;
        top:-100%;
        -webkit-animation: rainning 6s linear infinite
    }
    .huaqiangu-vue.tpl-self-time .type-class-3.animate .fix-box .rain3{
        left: -100%;
        top:0;
        -webkit-animation: rainning1 6s linear infinite;
        -webkit-transform: scale(1,1);
    }
    .huaqiangu-vue.tpl-self-time .type-class-3.animate .fix-box .rain4{
        left:0;
        top:-100%;
        -webkit-animation: rainning 6s linear infinite;
        -webkit-transform: scale(1,1);
    }
    .huaqiangu-vue.tpl-self-time .type-class-3.animate .fix-box .rain5{
        left:100%;
        top:-100%;
        top:0;
        -webkit-animation: rainning1 6s linear infinite;
    }
    .huaqiangu-vue.tpl-self-time .type-class-3.animate .fix-box .rain0{
        left:-100%;
        top:0;
        -webkit-animation: rainning1 6s linear infinite;
    }
    .huaqiangu-vue.tpl-self-time .type-class-3 .item-bottom .bottom,
    .huaqiangu-vue.tpl-self-time .type-class-3 .p3-bottom .r3,
    .huaqiangu-vue.tpl-self-time .type-class-3 .item-bottom .text3{
        position: absolute;
        bottom: 0;
        opacity: 0;
    }
    .huaqiangu-vue.tpl-self-time .type-class-3.animate .item-bottom .bottom{
        -webkit-animation: fadeInUp .6s ease .2s forwards;
    }
    .huaqiangu-vue.tpl-self-time .type-class-3.animate .item-bottom .r3{
        -webkit-animation: left .7s ease .4s forwards;
    }
    .huaqiangu-vue.tpl-self-time .type-class-3.animate .item-bottom .text3{
        opacity: 0;
        -webkit-animation: fade-in .8s ease .8s forwards;
    }
    .huaqiangu-vue.tpl-self-time .type-class-3 .p3-bottom .r3{
        width: 52%;
        left: 0;
    }
    .huaqiangu-vue.tpl-self-time .type-class-3 .p3-bottom .text3{
        width: 13%;
        left: 13%;
        bottom: 5%;
    }

    .huaqiangu-vue.tpl-self-time .type-class-3 .p3-top {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        background: url(/static/photo/tmpl/huaqiangu/mask3.png) no-repeat;
        background-size: 100% 100%;
    }

    .huaqiangu-vue.tpl-self-time .mod-img-list .type-class-4 {

    }
    .huaqiangu-vue.tpl-self-time .type-class-4 .p4-top {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        background: url(/static/photo/tmpl/huaqiangu/mask4.png) no-repeat;
        background-size: 100% 100%;
    }
    .huaqiangu-vue.tpl-self-time .type-item.type-class-4 .bg-img{
        padding-top: 0;
        height: 65%;
        top: 3%;
    }
    .huaqiangu-vue.tpl-self-time .type-class-4 .item-bottom .bottom,
    .huaqiangu-vue.tpl-self-time .type-class-4 .p4-bottom .left4,
    .huaqiangu-vue.tpl-self-time .type-class-4 .p4-bottom .r4,
    .huaqiangu-vue.tpl-self-time .type-class-4 .item-bottom .text4{
        position: absolute;
        bottom: 0;
        opacity: 0;
    }
    .huaqiangu-vue.tpl-self-time .type-class-4.animate .item-bottom .bottom{
        -webkit-animation: fadeInUp .6s ease .2s forwards;
    }
    .huaqiangu-vue.tpl-self-time .type-class-4.animate .item-bottom .left4{
        -webkit-animation: left .7s ease .4s forwards;
    }
    .huaqiangu-vue.tpl-self-time .type-class-4.animate .item-bottom .r4{
        -webkit-animation: right .7s ease .4s forwards;
    }
    .huaqiangu-vue.tpl-self-time .type-class-4.animate .item-bottom .text4{
        opacity: 0;
        -webkit-animation: fade-in .8s ease .8s forwards;
    }
    .huaqiangu-vue.tpl-self-time .type-class-4 .p4-bottom .left4{
        width: 42%;
        left: 0;
    }
    .huaqiangu-vue.tpl-self-time .type-class-4 .p4-bottom .r4{
        width: 48%;
        right: 0;
    }
    .huaqiangu-vue.tpl-self-time .type-class-4 .p4-bottom .text4{
        width: 14%;
        left: 31%;
        bottom: 14%;
    }
    .huaqiangu-vue.tpl-self-time .type-class-4 .fix-box img{
        position: absolute;
        opacity: 0;
    }
    .huaqiangu-vue.tpl-self-time .type-class-4 .fix-box .iclass4-f1{
        width: 17px;
        left: 75%;
        top: 1%;
    }
    .huaqiangu-vue.tpl-self-time .type-class-4 .fix-box .iclass4-f2{
        width: 13px;
        left: 92%;
        top: 2%;
    }
    .huaqiangu-vue.tpl-self-time .type-class-4 .fix-box .iclass4-f3{
        width: 11px;
        left: 82%;
        top: 9%;
    }
    .huaqiangu-vue.tpl-self-time .type-class-4 .fix-box .iclass4-f4{
        width: 19px;
        left: 85%;
        top: 5%;
    }
    .huaqiangu-vue.tpl-self-time .type-class-4 .fix-box .iclass4-f5{
        width: 13px;
        left: 91%;
        top: 16%;
    }
    .huaqiangu-vue.tpl-self-time .type-class-4 .fix-box .iclass4-f0{
        width: 29px;
        left: 92%;
        top: 12%;
    }
    .huaqiangu-vue.tpl-self-time .type-class-4.animate .fix-box .iclass4-fl{
        -webkit-animation: iclass2-fl 9.5s 1s linear infinite;
    }
    .huaqiangu-vue.tpl-self-time .type-class-4.animate .fix-box .iclass4-f2{
        -webkit-animation: iclass2-f2 9.2s 1.5s linear infinite;
    }
    .huaqiangu-vue.tpl-self-time .type-class-4.animate .fix-box .iclass4-f3{
        -webkit-animation: iclass2-f3 11.5s 4s linear infinite;
    }
    .huaqiangu-vue.tpl-self-time .type-class-4.animate .fix-box .iclass4-f4{
        -webkit-animation: iclass2-f4 8.3s 2.5s linear  infinite;
    }
    .huaqiangu-vue.tpl-self-time .type-class-4.animate .fix-box .iclass4-f5{
        -webkit-animation: iclass2-f5 11.3s 2s linear  infinite;
    }
    .huaqiangu-vue.tpl-self-time .type-class-4.animate .fix-box .iclass4-f0{
        -webkit-animation: iclass2-f0 6.7s  3s linear  infinite;
    }

    .huaqiangu-vue.tpl-self-time .type-class-5 .fix-box{
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        overflow: hidden;
    }
    .huaqiangu-vue.tpl-self-time .type-class-5.animate .fix-box img{
        width: 100%;
        height: 100%;
        opacity: .6;
        position: absolute;
    }
    .huaqiangu-vue.tpl-self-time .type-class-5.animate .fix-box .rain1{
        left: 0;
        top: 0%;
        -webkit-animation: rainning 6s linear infinite;
    }
    .huaqiangu-vue.tpl-self-time .type-class-5.animate .fix-box .rain2{
        left:10%;
        top:-100%;
        -webkit-animation: rainning 6s linear infinite
    }
    .huaqiangu-vue.tpl-self-time .type-class-5.animate .fix-box .rain3{
        left: -100%;
        top:0;
        -webkit-animation: rainning1 6s linear infinite;
        -webkit-transform: scale(1,1);
    }
    .huaqiangu-vue.tpl-self-time .type-class-5.animate .fix-box .rain4{
        left:0;
        top:-100%;
        -webkit-animation: rainning 6s linear infinite;
        -webkit-transform: scale(1,1);
    }
    .huaqiangu-vue.tpl-self-time .type-class-5.animate .fix-box .rain5{
        left:100%;
        top:-100%;
        top:0;
        -webkit-animation: rainning1 6s linear infinite;
    }
    .huaqiangu-vue.tpl-self-time .type-class-5.animate .fix-box .rain0{
        left:-100%;
        top:0;
        -webkit-animation: rainning1 6s linear infinite;
    }
    .huaqiangu-vue.tpl-self-time .type-class-5 .p5-bottom{
        position: absolute;
        bottom: 0;
        width: 100vw;
    }
    .huaqiangu-vue.tpl-self-time .type-class-5 .item-bottom .bottom,
    .huaqiangu-vue.tpl-self-time .type-class-5 .item-bottom .text5{
        position: absolute;
        bottom: 0;
        opacity: 0;
    }
    .huaqiangu-vue.tpl-self-time .type-class-5.animate .item-bottom .bottom{
        -webkit-animation: fadeInUp .6s ease .2s forwards;
    }
    .huaqiangu-vue.tpl-self-time .type-class-5.animate .item-bottom .r5{
        -webkit-animation: left .7s ease .4s forwards;
    }
    .huaqiangu-vue.tpl-self-time .type-class-5.animate .item-bottom .text5{
        opacity: 0;
        -webkit-animation: fade-in .8s ease .8s forwards;
    }
    .huaqiangu-vue.tpl-self-time .type-class-5 .p5-bottom .r5{
        width: 50%;
        left: 0;
        opacity: 0;
    }
    .huaqiangu-vue.tpl-self-time .type-class-5 .p5-bottom .text5{
        width: 15%;
        left: 15%;
        bottom: 12%;
    }
    .huaqiangu-vue.tpl-self-time .type-class-5 .p5-bottom .bottom{
        width: 100vw;
        bottom: 0;
        right: 0;
    }
    .huaqiangu-vue.tpl-self-time .type-class-5 .p5-top {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        background: url(/static/photo/tmpl/huaqiangu/mask5.png) no-repeat;
        background-size: 100% 100%;
    }
    .huaqiangu-vue.tpl-self-time .type-item.type-class-5 .bg-img {
        width: 90%;
        padding-top: 0;
        height: 65%;
        top: 3.3%;
        right: 0;
    }
    

    .huaqiangu-vue.tpl-self-time .type-class-3.animate .fix-box .rain1{
        left: 0;
        top: 0%;
        -webkit-animation: rainning 6s linear infinite;
    }
    .huaqiangu-vue.tpl-self-time .type-class-3.animate .fix-box .rain2{
        left:10%;
        top:-100%;
        -webkit-animation: rainning 6s linear infinite
    }
    .huaqiangu-vue.tpl-self-time .type-class-3.animate .fix-box .rain3{
        left: -100%;
        top:0;
        -webkit-animation: rainning1 6s linear infinite;
        -webkit-transform: scale(1,1);
    }
    .huaqiangu-vue.tpl-self-time .type-class-3.animate .fix-box .rain4{
        left:0;
        top:-100%;
        -webkit-animation: rainning 6s linear infinite;
        -webkit-transform: scale(1,1);
    }
    .huaqiangu-vue.tpl-self-time .type-class-3.animate .fix-box .rain5{
        left:100%;
        top:-100%;
        top:0;
        -webkit-animation: rainning1 6s linear infinite;
    }
    .huaqiangu-vue.tpl-self-time .type-class-3.animate .fix-box .rain0{
        left:-100%;
        top:0;
        -webkit-animation: rainning1 6s linear infinite;
    }



</style>