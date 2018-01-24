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
            isMain: false,
            slideStyle: {}
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
                if (i == 0) {
                    this.datas[i].class['page-0'] = true;
                    this.datas[i].iclass= 0;
                } else {
                    this.datas[i].class['page-' + (((i - 1) % 4) + 1) ] = true;
                    this.datas[i].iclass= (((i - 1) % 4) + 1);
                }

                if(i % 4 == 0){
                    this.datas[i].text = '你说的我都愿意去，小火车摆动的旋律';
                }else if(i % 4 == 1){
                    this.datas[i].text = '我想说其实你很好，你比自己更重要';
                }else if(i % 4 == 2){
                    this.datas[i].text = '我哼着歌，你自然就接下一段';
                }else if(i % 4 == 3){
                    this.datas[i].text = '我知道暖暖就在胸膛';
                }else{
                    this.datas[i].text = '打从心里暖暖的，我也希望变更好';
                }

                var itemWidth = this.datas[i].width;
                var itemHeight = this.datas[i].height;

                if(itemWidth * screenRatio >= itemHeight){
                    // 宽图                  
                    var moveing = -1 * (width / itemHeight * itemWidth * screenRatio - width * 1.2);
                    this.datas[i].defaultStyle = this.datas[i].imgStyle = { 'height' : '100%', };
                    this.datas[i].animateStyle = {
                        'height' : '100%',
                        'transform' : 'translate3d('+moveing+'px, 0px, 0px)'
                    }
                    this.datas[i].isWidth = true;
                }else{
                    // 长图
                    var moveing = -1 * (width / itemWidth * itemHeight - (width * screenRatio + 100));
                    this.datas[i].defaultStyle = this.datas[i].imgStyle = { 'width' : '100%' };
                    this.datas[i].animateStyle = {
                        'width' : '100%',
                        'transform' : 'translate3d(0px, '+moveing+'px, 0px)'
                    }
                    this.datas[i].isWidth = false;
                }

                if(i == 0){
                    this.cover = {
                        url : this.datas[i].url,
                        isActive : false,
                        class : this.datas[i].class,
                        imgStyle : this.datas[i].imgStyle,
                        animateStyle : this.datas[i].animateStyle,
                        text : this.datas[i].text,
                        iclass : this.datas[i].iclass,
                        isWidth : this.datas[i].isWidth
                    }
                }else{
                    this.items.push({
                        url : this.datas[i].url,
                        isActive : false,
                        class : this.datas[i].class,
                        imgStyle : this.datas[i].imgStyle,
                        animateStyle : this.datas[i].animateStyle,
                        text : this.datas[i].text,
                        iclass : this.datas[i].iclass,
                        isWidth : this.datas[i].isWidth
                    });
                }
            }

            var that = this;
            imgReady(this.datas[0].url, function(e) {
                that.$nextTick(function(){
                    that.isCover1 = true;
                });
                if (that.datas.length == 1) {
                    setTimeout(function(){
                        that.end();
                        that.$emit('playing');
                    }, 6000);
                } else {
                    setTimeout(function(){
                        that.isCover2 = true;
                        setTimeout(function(){
                            that.isMain = true;
                            that.isLoading = false;
                            that.play();
                            that.$emit('playing');
                        }, 500);
                    }, 6000);
                }
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
            
            this.items[this.curIndex].isActive = true;
            this.items[this.curIndex].class['animate-b'] = false;
            this.items[this.curIndex].class.animate = true;
            
            that.items[that.curIndex].imgStyle = that.items[that.curIndex].animateStyle;
            that.slideStyle = {
                'transform' : 'translateY(-' + that.curIndex + '00%)'
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

<section class="train-vue tpl-kid mod-os-ios">
    <div id="j-body">
        <div class="wrap j-wrap">
            <div class="mod-img-wrap">
                <div class="j-tpl-wrap">
                    <div class="wrap j-tpl-wrap">
                        <div class="mod-img-wrap">

                            <div v-bind:class="{ animate : isCover1 , 'animate-b' : isCover2}" class="tpl-cover j-mod-tpl-cover j-tpl-cover tpl-preview" style="display: block;">
                                <div class="cover-main">
                                    <!--相框-->
                                    <div class="cover-frame">
                                        <div class="cover-img j-cover-img j-img-page" id="img-cover" >
                                            <img v-bind:style="cover.imgStyle" v-bind:src="cover.url" class="j-page-inner-move-img" />
                                            <div class="mask-cover j-mask-cover mask-anim"></div>
                                        </div>
                                        <div class="frame-bg"></div>
                                    </div>
                                    <!--相框装饰-->
                                    <div class="cover-decorate" style="overflow: hidden;">
                                        <i class="line-bg"></i>
                                        <i class="nail tl"></i>
                                        <i class="nail tr"></i>
                                        <i class="nail bl"></i>
                                        <i class="nail br"></i>
                                        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" class="svg" baseProfile="full" height="672px" width="375px">
                                            <path class="path-box" display="inline" fill="none" stroke="#221714" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="M-123.743,94.5c0,0,1.205,190.001,1.177,208.001s-2.058,171.498-1.177,181.499s0,154,0,154s-0.369,173.499,0,179.5S-126,1062-126,1062l10.007,7.75"></path>
                                            <path class="path-box" display="inline" fill="none" stroke="#221714" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="M-39.5,0c0,0-0.699,39.94,0,50.5s0,42,0,42"></path>
                                            <path class="path-box" display="inline" fill="none" stroke="#221714" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="M421.5-1.5c0,0-1.158,37.023,0,47.75c1.157,10.727,2,53.25,2,53.25"></path>
                                            <path class="path-box" display="inline" fill="none" stroke="#221714" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="M-51.685-1.5c0,0,1.445,56.47,1,63.5c-0.444,7.03-1,33.792-1,33.792"></path>
                                            <path class="path-box" display="inline" fill="none" stroke="#221714" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="M409.315,0c0,0-1.207,40.06,0,50.5s0,49,0,49"></path>
                                            <path class="path-box" fill="none" stroke="#221714" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="M34.636,50.815c0,0,0.606,93.078,0.592,102.134c-0.014,9.056-1.035,86.284-0.592,91.316c0.443,5.032,0,77.48,0,77.48
                                            s-0.186,87.291,0,90.31c0.186,3.02-1.136,124.522-1.136,124.522l5.035,3.898"></path>
                                            <path class="path-box" fill="none" stroke="#221714" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="M346.818,56.584l-4.021-4.511c0,0-85.664-0.713-92.452-0.755s-104.655-0.302-110.944-0.554c-6.289-0.252-104.01-0.201-104.01-0.201l3.896,4.763"></path>
                                            <path class="path-box" fill="none" stroke="#221714" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="M39.286,55.327c0,0,0,129.57,0,135.104c0,5.534,0,121.755,0,126.283c0,4.528-1.502,67.921-0.751,70.94
                                            c0.751,3.019,0.751,71.945,0.751,75.971s-0.751,76.852-0.751,76.852s79.724,0.386,86.276,0.472s95.074,1.241,99.614,1.3s122.77,0.602,122.77,0.602s0.735-119.473,0.503-123.498c-0.23-4.026,0.702-125.718,0.702-125.718s-0.536-81.071-0.097-90.624c0.421-9.155-0.606-93.077-0.606-93.077l-0.88-53.347c0,0-156.849-0.801-167.665-0.99C168.337,55.406,39.286,55.327,39.286,55.327 z"></path>
                                        </svg>
                                    </div>
                                </div>
                                <!--相册名-->
                                <div class="cover-title">
                                    <b class="title-decorate">
                                        <svg version="1.1" id="svg-deco" xmlns="http://www.w3.org/2000/svg" width="300px" height="30px" viewBox="0 0 225 30" xml:space="preserve">
                                            <path class="svg-deco" fill="none" stroke="#221714" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="M16.106,35.103c0,0,179.202,2.764,189.829,0.993c10.627-1.771,13.395-7.859,12.509-9.852c-0.886-1.993-2.082-3.857-5.313-2.435c-2.768,1.218-2.103,3.875-2.103,3.875"></path>
                                            <path class="svg-deco" fill="none" stroke="#221714" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="M433.871,35.103c0,0-179.202,2.764-189.829,0.993c-10.627-1.771-13.395-7.859-12.509-9.852s2.082-3.857,5.314-2.435c2.768,1.218,2.103,3.875,2.103,3.875"></path>
                                        </svg>
                                    </b>
                                    <p class="title j-album-title">{{ title }}</p>
                                    <p class="author j-album-author j-lazy-load-nickname">{{ author }}</p>
                                    <b class="title-decorate reverse">
                                        <svg version="1.1" id="svg-deco-reverse" xmlns="http://www.w3.org/2000/svg" width="300px" height="30px" viewBox="0 0 225 30" xml:space="preserve">
                                            <path class="svg-deco" fill="none" stroke="#221714" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="M433.882,24.894c0,0-179.202-2.764-189.829-0.993c-10.627,1.771-13.395,7.859-12.509,9.852c0.886,1.993,2.082,3.857,5.314,2.435c2.768-1.218,2.103-3.875,2.103-3.875"></path>
                                            <path class="svg-deco" fill="none" stroke="#221714" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="M16.118,24.894c0,0,179.202-2.764,189.829-0.993c10.627,1.771,13.395,7.859,12.509,9.852c-0.886,1.993-2.082,3.857-5.314,2.435c-2.768-1.218-2.103-3.875-2.103-3.875"></path>
                                        </svg>
                                    </b>
                                </div>
                            </div>


                            <div v-bind:class="{ 'animate' : isMain }" class="img-list tpl-preview j-img-list " v-bind:style="slideStyle">

                                 <div v-for="(item, i) in items" v-bind:class="item.class" class="type-item item list-page j-img-item ">
                                    
                                    <div v-if="item.class['page-1'] == true" class="ele-page">
                                        <b class="goodTime"><i class="start-line"></i><i class="start-txt"></i></b>
                                        <b class="star"></b>
                                        <b class="horn"><i class="horn-l"></i><i class="horn-txt"></i></b>
                                    </div>

                                    <div v-if="item.class['page-2'] == true" class="ele-page">
                                        <b class="book"></b>
                                        <b class="star"></b>
                                        <b class="person">
                                            <i class="boy"></i>
                                            <i class="girl"></i>
                                            <i class="line"></i>
                                        </b>
                                    </div>

                                    <div v-if="item.class['page-3'] == true" class="ele-page">
                                        <b class="bell"></b>
                                        <b class="welcome"></b>
                                        <b class="cloud"></b>
                                        <b class="cloud-b"></b>
                                    </div>

                                    <div v-if="item.class['page-4'] == true" class="ele-page">
                                        <b class="symbol"></b>
                                    </div>

                                    <div class="img-page">
                                        <div class="cover-frame">
                                            <div class="cover-img j-img-page">
                                                <img v-bind:style="item.imgStyle" v-bind:class="[item.isWidth ? 'isWidth' : 'isHeight']" v-bind:src="item.url" class="j-page-inner-move-img" />
                                                <!--<canvas id="canvas-page3" width="414" height="736"></canvas>-->
                                                <div class="mask-cover j-mask-cover mask-anim"></div>
                                            </div>
                                            <div class="frame-bg"></div>
                                        </div>
                                        <div class="cover-decorate" style="overflow: hidden;">
                                            <b class="flag"></b>

                                            <svg v-if="item.class['page-1'] == true" xmlns="http://www.w3.org/2000/svg" version="1.1" class="svg" baseProfile="full" height="405px" width="363px" style="overflow: hidden;">
                                                <path class="path-box" fill-rule="evenodd" d="M177.601,11.130 C177.601,11.130 -3.653,19.899 11.939,217.671 C27.530,415.444 6.508,699.941 88.364,764.241 C170.221,828.542 551.271,798.449 603.898,790.465 C733.689,770.776 718.537,364.783 708.792,258.590 C699.047,152.397 719.511,73.482 541.181,32.564 C362.850,-8.355 177.601,11.130 177.601,11.130 Z"></path>
                                            </svg>

                                            <svg v-if="item.class['page-2'] == true" xmlns="http://www.w3.org/2000/svg" version="1.1" class="svg" baseProfile="full" height="335px" width="368px">
                                                <path class="path-box" fill-rule="evenodd" d="M177.601,11.130 C177.601,11.130 -3.653,19.899 11.939,217.671 C27.530,415.444 6.508,530.941 88.364,595.241 C170.221,659.542 549.271,629.449 601.898,621.465 C731.689,601.776 716.537,364.783 706.792,258.590 C697.047,152.397 717.511,73.482 539.181,32.564 C360.850,-8.355 177.601,11.130 177.601,11.130 Z"></path>
                                            </svg>

                                            <section v-if="item.class['page-3'] == true">
                                                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" class="svg" baseProfile="full" height="276px" width="375px">
                                                                <path class="path-box" fill="none" stroke="#211613" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
                                                M358.267,18.48c0.817,1.68-0.979,84.21-0.004,91.042c0.979,6.843-2.4,32.655-1.013,38.808c1.389,6.154-1.475,106.684-2.024,106.971
                                                s3.121,3.359-37.968,2.986c-41.09-0.374-75.894-2.908-79.985-1.493c-4.093,1.414-56.23-2.775-60.749-1.493
                                                c-4.519,1.282-49.094-2.503-65.811,0.498c-16.718,3-93.712-4.399-92.642-0.995c1.07,3.404-1.07-110.054,0-120.405
                                                c1.07-10.351,2.007-70.17,1.013-75.128c-0.995-4.958,0.506-43.784,0.506-43.784s7.485-0.186,15.693-0.995
                                                s30.261,0.731,38.474,0.995c8.213,0.264,37.043-1.446,42.018,0c4.975,1.446,87.56-1.633,94.667,0.498
                                                c7.106,2.13,49.765,0.504,70.874,1.492C293.718,18.059,358.267,18.48,358.267,18.48z"></path>
                                                                <path class="path-box" fill="none" stroke="#211613" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
                                                M362.819,12.502c0,0,0.217,37.84-0.08,49.757c-0.298,11.918-0.617,49.019-0.72,54.228s-0.325,34.331-0.479,37.814
                                                c-0.155,3.484,0.615,37.315,0.677,44.281c0.063,6.966-1.423,65.178-1.423,65.178s-44.53,1.46-57.698,0.78
                                                c-13.169-0.68-75.946-1.402-84.555-1.527c-8.606-0.125-94.666-0.645-116.181-0.695c-21.515-0.053-83.276-2.538-89.351-2.04
                                                c0,0-1.973-43.789-1.017-57.965c0.957-14.175,1.612-51.985,2.044-61.445c0.431-9.459,2.067-54.767,1.797-61.953
                                                s-1.306-52.978-1.306-68.402c0,0,36.195-0.506,45.562-0.498c9.367,0.008,39.212,1.076,45.804,1.27
                                                c6.592,0.194,48.6-0.387,60.247-0.564c11.647-0.177,55.187,1.24,60.755,1.164c5.568-0.076,34.93-0.626,43.535-0.128
                                                c6.462,0.373,32.111,0.265,45.159,0.746S362.819,12.502,362.819,12.502z"></path>
                                                                <path class="path-box  path-line" fill="none" stroke="#211613" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="M358.267,18.48
                                                c0,0,1.899-2.328,2.316-3.078s2.236-2.9,2.236-2.9"></path>
                                                                <path class="path-box  path-line" fill="none" stroke="#211613" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="M354.491,256.173
                                                c0,0,1.98,1.591,2.911,2.91s3.392,4.677,3.392,4.677"></path>
                                                                <path class="path-box path-line" fill="none" stroke="#211613" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="M18.071,254.804
                                                c0,0-1.738,1.932-2.071,2.515s-2.676,2.938-2.676,2.938"></path>
                                                                <path class="path-box path-line" fill="none" stroke="#211613" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="M19.583,15.656
                                                c0,0-1.25-1.836-1.917-2.503s-3.139-2.641-3.139-2.641"></path>
                                                            </svg>
                                                            <i class="nail-l"></i>
                                                            <i class="nail-r"></i>
                                                            <i class="nail-t"></i>
                                                            <i class="nail-line"></i>
                                            </section>


                                            <svg v-if="item.class['page-4'] == true" xmlns="http://www.w3.org/2000/svg" version="1.1" class="svg" baseProfile="full" height="500px" width="369px">
                                                <path class="path-box" fill-rule="evenodd" d="M177.663,11.130 C177.663,11.130 -3.591,9.899 12.001,207.671 C27.593,405.444 6.570,861.941 88.427,926.241 C170.283,990.542 539.334,960.449 591.961,952.465 C626.392,947.242 669.725,949.569 686.563,882.516 C733.196,696.803 704.014,326.612 696.854,248.590 C687.110,142.397 707.574,73.482 529.243,32.564 C350.913,-8.355 177.663,11.130 177.663,11.130 Z"></path>
                                            </svg>

                                            <svg v-if="item.class['page-5'] == true" xmlns="http://www.w3.org/2000/svg" version="1.1" class="svg" baseProfile="full" height="512px" width="375px">
                                                <path class="path-box" fill="none" stroke="#211613" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
                                    M28.471,29.829c0,0,7.306-0.185,15.317-0.988c8.011-0.804,29.536,0.726,37.552,0.988c8.016,0.262,36.155-1.436,41.011,0
                                    c4.855,1.436,85.46-1.622,92.397,0.494c6.937,2.116,48.671-0.765,69.174,1.482c20.504,2.248,69.355-0.417,70.163,0.989
                                    c0.808,1.405-0.955,83.624,0,90.42c0.954,6.796-2.344,32.429-0.989,38.54c1.356,6.111-1.283,317.452-2.066,317.452
                                    c-0.607,0-3.821,0.874-32.026,0.257c-40.096-0.879-74.074-2.888-78.067-1.482c-3.994,1.405-54.882-2.755-59.292-1.482
                                    c-4.411,1.273-47.916-2.485-64.234,0.494c-16.317,2.98-91.465-4.37-90.42-0.988c1.044,3.382-1.045-317.805,0-328.084
                                    c1.044-10.279,1.958-69.685,0.988-74.609C27.006,68.385,28.471,29.829,28.471,29.829z"></path>
                                                <path class="path-box" fill="none" stroke="#211613" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
                                    M357.544,26.864c0,0,0.011,116.114-0.242,133.161c-0.252,17.046-0.499,54.351,1.229,60.774c1.73,6.424-0.634,122.042-1.481,136.867
                                    c-0.85,14.825-0.724,129.749-0.724,129.749s-88.981-1.445-110.696-1.771c-21.716-0.326-119.573,0.339-127.973-0.18
                                    s-95.609-2.544-95.609-2.544S21.02,388.3,21.02,344.818c0-43.48,2.248-135.384,2.013-157.619
                                    c-0.235-22.234,0.79-77.032,0.498-93.385c-0.293-16.353,0.988-68.927,0.988-68.927s70.417-0.777,84.25-0.384
                                    c13.833,0.392,75.806,2.272,91.257,1.467c15.452-0.805,72.399,0.269,83.547,0.893C294.721,27.488,357.544,26.864,357.544,26.864z"></path>
                                                <path class="path-box path-line" fill="none" stroke="#211613" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
                                    M357.544,26.864c0,0-1.544,2.506-2.044,3.256s-1.917,2.917-1.917,2.917"></path>
                                                <path class="path-box path-line" fill="none" stroke="#211613" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
                                    M356.326,487.415c0,0-2.827-3.796-3.493-4.796s-2.166-4.083-2.166-4.083"></path>
                                                <path class="path-box path-line" fill="none" stroke="#211613" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
                                    M22.048,482.921c0,0,2.035-3.385,2.368-4.135s2.671-3.59,2.671-3.59"></path>
                                                <path class="path-box path-line" fill="none" stroke="#211613" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
                                    M24.519,24.888c0,0,1.981,2.981,2.314,3.314s1.624,2.001,1.624,2.001"></path>
                                            </svg>
                                        </div>
                                        <p class="img-describe">{{ item.text }}</p>
                                    </div>
                                    <div class="train-page ">
                                        <b class="way"></b>
                                        <b class="train">
                                            <i class="smoke1"></i>
                                            <i class="smoke2"></i>
                                            <i class="smoke3"></i>
                                        </b>
                                        <b class="train train-top">
                                            <i class="smoke1"></i>
                                            <i class="smoke2"></i>
                                            <i class="smoke3"></i>
                                        </b>
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
.train-vue{
    width: 100%;
    height: 100%;
}
.mod-tpl-over {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 20;
    overflow: hidden
}

.mod-tpl-over .bg-border {
    width: 900px;
    height: 900px;
    background-color: #fff;
    position: absolute;
    border-radius: 9999px;
    margin: -450px 0 0 -450px;
    top: 50%;
    left: 50%;
    opacity: .2;
    -webkit-transform: scale(.1);
    -webkit-transform-origin: 50% 50%;
}

.mod-tpl-over .page {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%
}

.mod-tpl-over .page .inner {
    width: 100%;
    text-align: center;
    position: absolute;
    top: 50%;
    -webkit-transform-origin: 50%;
    -webkit-transform: translate3d(0, -50%, 0);
    margin-top: -30px
}

.mod-tpl-over .page .author {
    margin: 0 auto 58px;
    text-align: center
}

.mod-tpl-over .page .author .avatar-w {
    width: 90px;
    height: 90px;
    margin: 0 auto;
    position: relative
}

.mod-tpl-over .page .author .avatar {
    width: 90px;
    border-radius: 100%;
    -webkit-transform: scale(.1);
    opacity: 0
}

.mod-tpl-over .page .author .name {
    display: block;
    text-align: center;
    font-size: 16px;
    padding-top: 16px;
    opacity: 0
}

.mod-tpl-over .page .title {
    width: 120px;
    height: 40px;
    overflow: hidden;
    font-size: 27px;
    margin: 0 auto 5px;
    text-align: center;
    color: #fff;
    position: relative
}

.mod-tpl-over .page .title .anim {
    position: absolute;
    display: inline-block;
    top: 0;
    left: 50%;
    width: 120px;
    color: #000;
    -webkit-transform: translate3d(-50%, -100%, 0);
}

.mod-tpl-over .page .text {
    height: 24px;
    overflow: hidden;
    font-size: 16px;
    margin-bottom: 35px;
    color: rgba(0, 0, 0, .7);
    position: relative
}

.mod-tpl-over .page .text .anim {
    width: 100%;
    position: absolute;
    display: inline-block;
    top: 0;
    left: 50%;
    -webkit-transform: translate3d(-50%, -100%, 0);
}

.mod-tpl-over .page .btn {
    position: relative;
    margin-bottom: 30px
}

.mod-tpl-over .page .btn .svg-wrap {
    width: 165px;
    height: 40px;
    position: absolute;
    top: 0;
    left: 50%;
    margin-left: -79px
}

.mod-tpl-over .page .make-btn,
.mod-tpl-over .page .share-btn {
    width: 150px;
    font-size: 16px;
    color: #00A3FF;
    position: relative;
    z-index: 10;
    display: inline-block;
    opacity: 0
}

.mod-tpl-over .page .make-btn {
    height: 36px;
    line-height: 36px
}

.mod-tpl-over .page .share-btn {
    height: 40px;
    line-height: 40px
}

.mod-tpl-over .tpl-over-logo {
    position: absolute;
    bottom: 8px;
    left: 50%;
    margin-left: -45px;
    width: 91px;
    height: 41px
}

.mod-tpl-over .tpl-over-logo .logo-star {
    width: 28px;
    height: 27px;
    position: absolute;
    top: 0;
    right: -14px;
    background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-public-yog160926104113.32@2x.png);
    background-position: -160px 0;
    background-size: 188px 138px;
    z-index: 2;
    -webkit-transform: translate3d(0, 0, 0);
    opacity: 0
}

.mod-tpl-over .tpl-over-logo .logo-qzone {
    height: 16px;
    position: absolute;
    top: 7px;
    left: 32px;
    background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/img/tpl-over-logo-qzone.32@2x.png);
    background-position: right 0;
    background-size: cover;
    width: 54px;
    opacity: 0;
    -webkit-transform: translate3d(90px, 0, 0);
}

.mod-music-switch .music-off .icon-music,
.mod-music-switch .music-on .icon-music,
.mod-tpl-over .tpl-over-logo .logo-text .dong,
.mod-tpl-over .tpl-over-logo .logo-text .fen,
.mod-tpl-over .tpl-over-logo .logo-text .gan,
.mod-tpl-over .tpl-over-logo .logo-text .huo,
.mod-tpl-over .tpl-over-logo .logo-text .sheng,
.mod-tpl-over .tpl-over-logo .logo-text .xiang,
.mod-tpl-over .tpl-over-logo .logo-text .zhu {
    background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-public-yog160926104113.32@2x.png);
    background-size: 188px 138px
}

.mod-tpl-over .tpl-over-logo .logo-text span {
    display: inline-block;
    width: 8px;
    height: 8px;
    position: absolute;
    top: 33px;
    -webkit-transform: translate3d(12px, 0, 0);
    opacity: 0
}

.mod-tpl-over .tpl-over-logo .logo-text .fen {
    left: 5px;
    background-position: -160px -66px
}

.mod-tpl-over .tpl-over-logo .logo-text .xiang {
    left: 14px;
    background-position: -179px -28px
}

.mod-tpl-over .tpl-over-logo .logo-text .sheng {
    left: 24px;
    background-position: -179px -37px
}

.mod-tpl-over .tpl-over-logo .logo-text .huo {
    left: 33px;
    background-position: -179px -47px
}

.mod-tpl-over .tpl-over-logo .logo-text .liu {
    left: 53px;
    background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-public-yog160926104113.32@2x.png);
    background-position: -179px -56px;
    background-size: 188px 138px
}

.mod-tpl-over .tpl-over-logo .logo-text .zhu {
    left: 63px;
    background-position: -160px -75px
}

.mod-tpl-over .tpl-over-logo .logo-text .gan {
    left: 73px;
    background-position: -169px -66px
}

.mod-tpl-over .tpl-over-logo .logo-text .dong {
    left: 83px;
    background-position: -178px -66px
}

.path {
    stroke-dasharray: 788;
    stroke-dashoffset: 0;
    stroke-opacity: 0
}

.mod-tpl-over.tpl-over-anim .bg-border {
    -webkit-animation: border-zoom-out 1s ease-out forwards;
}

.mod-tpl-over.tpl-over-anim .page .author .avatar {
    -webkit-animation: avatar-zoom-out .5s ease .7s forwards
}

.mod-tpl-over.tpl-over-anim .page .author .name {
    -webkit-animation: name-fade-in .5s cubic-bezier(.38, .68, .56, 1.01) .7s forwards
}

.mod-tpl-over.tpl-over-anim .page .author .name img {
    vertical-align: -4px
}

.mod-tpl-over.tpl-over-anim .page .title .anim {
    -webkit-animation: train-move-in .5s ease .8s forwards
}

.mod-tpl-over.tpl-over-anim .page .text .anim {
    -webkit-animation: train-move-in .5s ease 1.2s forwards
}

.mod-tpl-over.tpl-over-anim .page .path {
    -webkit-animation: line-draw 3s cubic-bezier(.25, .02, .5, 1) forwards
}

.mod-tpl-over.tpl-over-anim .page .path.active {
    fill: #E4F5FF
}

.mod-tpl-over.tpl-over-anim .page .make-btn {
    -webkit-animation: fade-in .8s ease 1.8s forwards
}

.mod-tpl-over.tpl-over-anim .page .share-btn {
    -webkit-animation: fade-in .8s ease 2s forwards
}

.mod-tpl-over.tpl-over-anim .tpl-over-logo .logo-star {
    -webkit-animation: logo-star-zoom .6s cubic-bezier(.3, .01, 0, .99) 2.1s forwards
}

.mod-tpl-over.tpl-over-anim .tpl-over-logo .logo-qzone {
    -webkit-animation: logo-qzone-in .8s cubic-bezier(0, .27, 0, .99) 2.3s forwards
}

.mod-tpl-over.tpl-over-anim .tpl-over-logo .logo-text {
    display: none
}

.mod-tpl-over.tpl-over-anim .tpl-over-logo .logo-text .fen {
    -webkit-animation: logo-text-in .8s cubic-bezier(.42, .01, 0, 1.08) 2.4s forwards, fade-in .2s ease 2.4s forwards
}

.mod-tpl-over.tpl-over-anim .tpl-over-logo .logo-text .xiang {
    -webkit-animation: logo-text-in .8s cubic-bezier(.42, .01, 0, 1.08) 2.45s forwards, fade-in .2s ease 2.45s forwards
}

.mod-tpl-over.tpl-over-anim .tpl-over-logo .logo-text .sheng {
    -webkit-animation: logo-text-in .8s cubic-bezier(.42, .01, 0, 1.08) 2.5s forwards, fade-in .2s ease 2.5s forwards
}

.mod-tpl-over.tpl-over-anim .tpl-over-logo .logo-text .huo {
    -webkit-animation: logo-text-in .8s cubic-bezier(.42, .01, 0, 1.08) 2.55s forwards, fade-in .2s ease 2.55s forwards
}

.mod-tpl-over.tpl-over-anim .tpl-over-logo .logo-text .liu {
    -webkit-animation: logo-text-in .8s cubic-bezier(.42, .01, 0, 1.08) 2.6s forwards, fade-in .2s ease 2.6s forwards
}

.mod-tpl-over.tpl-over-anim .tpl-over-logo .logo-text .zhu {
    -webkit-animation: logo-text-in .8s cubic-bezier(.42, .01, 0, 1.08) 2.65s forwards, fade-in .2s ease 2.65s forwards
}

.mod-tpl-over.tpl-over-anim .tpl-over-logo .logo-text .gan {
    -webkit-animation: logo-text-in .8s cubic-bezier(.42, .01, 0, 1.08) 2.7s forwards, fade-in .2s ease 2.7s forwards
}

.mod-tpl-over.tpl-over-anim .tpl-over-logo .logo-text .dong {
    -webkit-animation: logo-text-in .8s cubic-bezier(.42, .01, 0, 1.08) 2.75s forwards, fade-in .2s ease 2.75s forwards
}


.mod-music-switch {
    position: absolute;
    top: 0;
    right: 0;
    padding: 15px;
    z-index: 100
}

.mod-music-switch .music-off,
.mod-music-switch .music-on {
    display: inline-block;
    height: 27px;
    min-width: 17px;
    border-radius: 18px;
    padding: 0 5px;
    text-align: center;
    font-size: 14px;
    color: #fff;
    line-height: 27px;
    background-color: rgba(0, 0, 0, .6);
    -webkit-transition: width 1s ease;
    overflow: hidden
}

.mod-music-switch .music-off .icon-music,
.mod-music-switch .music-on .icon-music {
    display: inline-block;
    width: 18px;
    height: 18px;
    vertical-align: middle;
    margin: -3px 0 0
}

.mod-music-switch .music-off .icon-music {
    background-position: -160px -28px
}

.mod-music-switch .music-on .icon-music {
    background-position: -160px -47px
}

.mod-music-switch .music-off .text,
.mod-music-switch .music-on .text {
    display: inline-block;
    width: 86px;
    height: 18px;
    line-height: 17px;
    overflow: hidden;
    margin-left: 5px;
    vertical-align: middle
}

.mod-music-switch .music-off .text-anim,
.mod-music-switch .music-on .text-anim {
    -webkit-animation: text-none .3s ease 5s forwards
}

.mod-music-switch .music-off .text-manually-anim,
.mod-music-switch .music-on .text-manually-anim {
    -webkit-animation: text-none .3s ease forwards
}


.bBor:after,
.tBor:before {
    position: absolute;
    content: "";
    height: 1px;
    left: 0;
    right: 0;
    background: #ccc
}

.tBor:before {
    top: 0
}

.bBor:after {
    bottom: 0
}

.lBor:before,
.rBor:after {
    position: absolute;
    content: "";
    width: 1px;
    top: 0;
    bottom: 0;
    background: #ccc
}

.lBor:before {
    left: 0
}

.rBor:after {
    right: 0
}

.trblBor:after {
    position: absolute;
    content: "";
    top: 0;
    left: 0;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    point-events: none;
    border: 1px solid #ccc
}

@media (-moz-min-device-pixel-ratio:1.5),
(-webkit-min-device-pixel-ratio:1.5),
(min-device-pixel-ratio:1.5),
(min-resolution:144dpi),
(min-resolution:1.5dppx),
(-ms-high-contrast:active),
(-ms-high-contrast:none) {
    .bBor:after,
    .tBor:before {
        -webkit-transform: scaleY(.5);
    }
    .lBor:before,
    .rBor:after {
        -webkit-transform: scaleX(.5);
    }
    .trblBor:after {
        width: 200%;
        height: 200%;
        -webkit-transform: scale(.5);
    }
    .lBor:before,
    .tBor:before,
    .trblBor:after {
        -webkit-transform-origin: 0 0;
    }
    .bBor:after,
    .rBor:after {
        -webkit-transform-origin: 100% 100%;
    }
}

@media (-webkit-device-pixel-ratio:1.5) {
    .bBor:after,
    .tBor:before {
        -webkit-transform: scaleY(.6666);
    }
    .lBor:before,
    .rBor:after {
        -webkit-transform: scaleX(.6666);
    }
    .trblBor:after {
        width: 150%;
        height: 150%;
        -webkit-transform: scale(.6666);
    }
}

@media (-webkit-device-pixel-ratio:3) {
    .bBor:after,
    .tBor:before {
        -webkit-transform: scaleY(.3333);
    }
    .lBor:before,
    .rBor:after {
        -webkit-transform: scaleX(.3333);
    }
    .trblBor:after {
        width: 300%;
        height: 300%;
        -webkit-transform: scale(.3333);
    }
}

.mod-hybrid {
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none
}

.mod-mask-share {
    background-color: rgba(0, 0, 0, .5);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1000
}

.mod-mask-share .share-tips {
    width: 159px;
    height: 138px;
    display: inline-block;
    position: absolute;
    top: 15px;
    right: 15px;
    background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-public-yog160926104113.32@2x.png);
    background-position: 0 0;
    background-size: 188px 138px
}

.mod-guide-bar .bar-op .op-close .inner,
.mod-guide-bar .logo .icon-logo {
    background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-public-yog160926104113@2x.png);
    background-size: 59px 40px;
    display: inline-block
}

.mod-guide-bar {
    width: 100%;
    height: 55px;
    overflow: hidden;
    background-color: rgba(255, 255, 255, .9);
    position: absolute;
    left: 0;
    bottom: 0;
    z-index: 99999
}

.mod-guide-bar.tBor:before {
    background-color: #e0e0e0
}

.mod-guide-bar .logo {
    width: 40px;
    height: 40px;
    float: left;
    margin: 7px 2px 0 10px
}

.mod-guide-bar .logo .icon-logo {
    width: 40px;
    height: 40px;
    background-position: 0 0
}

.mod-guide-bar .bar-info {
    padding-top: 8px
}

.mod-guide-bar .bar-info .title {
    font-size: 15px;
    color: #000;
    font-weight: 500
}

.mod-guide-bar .bar-info .sub {
    color: #777;
    font-size: 12px
}

.mod-guide-bar .bar-op {
    float: right
}

.mod-guide-bar .bar-op .op-close {
    width: 18px;
    height: 18px;
    display: inline-block;
    padding: 18px 10px;
    vertical-align: middle
}

.mod-guide-bar .bar-op .op-close .inner {
    width: 18px;
    height: 18px;
    background-position: -41px 0;
    overflow: hidden;
    text-indent: -50px
}

.mod-guide-bar .bar-op .op-btn {
    display: inline-block;
    width: 79px;
    height: 28px;
    line-height: 28px;
    text-align: center;
    color: #00a3ff;
    font-size: 14px;
    border: 1px solid #00a3ff;
    vertical-align: middle;
    border-radius: 2px
}

.mod-guide-bar .bar-op .op-btn:active {
    background-color: #E4F5FF
}

@media only screen and (max-device-height:480px) and (max-device-width:414px) {
    .mod-guide-bar .bar-info .title {
        font-size: 14px
    }
    .mod-guide-bar .bar-info .sub {
        font-size: 11px
    }
}

@media only screen and (min-device-height:568px) and (max-device-width:414px) and (-webkit-device-pixel-ratio:2) {
    .mod-guide-bar .bar-info .title {
        font-size: 14px
    }
    .mod-guide-bar .bar-info .sub {
        font-size: 11px
    }
}

@media only screen and (min-device-height:667px) and (max-device-width:414px) and (-webkit-device-pixel-ratio:2) {
    .mod-guide-bar .bar-info .title {
        font-size: 15px
    }
    .mod-guide-bar .bar-info .sub {
        font-size: 12px
    }
}

html,
body,
div,
span,
iframe,
h1,
h2,
h3,
h4,
h5,
h6,
p,
blockquote,
a,
address,
em,
img,
ol,
ul,
li,
fieldset,
form,
label,
legend,
table,
tbody,
tfoot,
thead,
tr,
th,
td,
i,
b,
s {
    margin: 0;
    padding: 0;
    border: 0;
    font-weight: inherit;
    font-style: inherit;
    font-size: 100%;
    font-family: Helvetica, 'microsoft yahei', Arial
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

.mod-inner-loading {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    overflow: hidden;
    background: #fff
}

.mod-inner-loading .loading-wrap {
    width: 82px;
    height: 82px;
    position: absolute;
    top: 50%;
    left: 50%;
    overflow: hidden;
    margin: -53px 0 0 -43px;
    background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/loading.32-yog150907124958.png?max_age=19830212&d=20150907180141);
    background-position: 0 0
}

.mod-inner-loading .loading-inner {
    width: 225px;
    height: 34px;
    display: inline-block;
    position: absolute;
    top: 50%;
    left: 0;
    -webkit-transform: translate3d(-0px, -50%, 0);
    background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/img/loading-item.32@2x.png?max_age=19830212&d=20150907180141);
    background-size: cover;
    -webkit-animation: loading-anim 1.5s linear infinite
}

.mod-inner-loading .text {
    display: block;
    width: 100%;
    font-size: 16px;
    color: #000;
    text-align: center;
    position: absolute;
    top: 50%;
    left: 0;
    margin-top: 40px
}


.mod-light-loading {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    overflow: hidden;
    background: rgba(0, 0, 0, 0);
    z-index: 500
}

.mod-light-loading .light-loading {
    display: inline-block;
    padding: 0 25px;
    font-size: 14px;
    border-radius: 5px;
    width: auto;
    height: 50px;
    line-height: 50px;
    background: rgba(0, 0, 0, .6);
    color: #fff;
    position: absolute;
    top: 50%;
    left: 50%;
    -webkit-transform: translate3d(-50%, -50%, 0)
}

.mod-light-loading .light-loading .img {
    width: 15px;
    vertical-align: middle;
    margin-right: 14px
}

html,
body {
    /*width: 100%;
    height: 100%*/
}

@media only screen and (-webkit-min-device-pixel-ratio:1.25),
only screen and (min-resolution:120dpi),
only screen and (min-resolution:1.25dppx) {
    .mod-inner-loading .loading-wrap {
        background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/loading.32-yog150907124958@2x.png?max_age=19830212&d=20150907180141);
        background-size: 82px 82px;
        background-position: 0 0
    }
}

html,
body,
div,
span,
iframe,
h1,
h2,
h3,
h4,
h5,
h6,
p,
blockquote,
a,
address,
em,
img,
ol,
ul,
li,
fieldset,
form,
label,
legend,
table,
tbody,
tfoot,
thead,
tr,
th,
td,
i,
b,
s {
    margin: 0;
    padding: 0;
    border: 0;
    font-weight: inherit;
    font-style: inherit;
    font-size: 100%;
    font-family: Helvetica, 'microsoft yahei', Arial
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

.tpl-kid .wrap {
    background: #fff;
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: absolute
}

.tpl-kid .mod-img-wrap {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden
}

.tpl-kid .mod-img-wrap .img-list {
    width: 100%;
    height: 100%;
    overflow: hidden
}

.tpl-kid .mod-img-wrap .img-list .list-page {
    width: 100%;
    height: 100%;
    position: relative
}

.tpl-kid .cover-main {
    height: 540px;
    width: 100%;
    position: relative;
    overflow: hidden;
    margin-top: -20px
}

.tpl-kid .cover-decorate {
    width: 375px;
    height: 540px;
    background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/img/tpl-kid/cover-deco.png?max_age=19830212&d=20151102143706);
    position: absolute;
    top: 0;
    left: 50%;
    margin-left: -187px;
    background-repeat: no-repeat
}

.tpl-kid .cover-frame {
    width: 375px;
    height: 500px;
    margin: 0 auto;
    overflow: hidden;
    position: relative;
    top: 40px
}

.tpl-kid .cover-frame .frame-bg {
    width: 100%;
    height: 100%;
    margin: 0 auto;
    background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/img/tpl-kid/frame-1.png?max_age=19830212&d=20151102143706);
    position: absolute;
    top: 0px;
    left: 0px;
    padding: 2px
}
.tpl-kid #img-cover img {
    -webkit-transition: all 2s 2s;
}
.tpl-kid .cover-img {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-size: 100% auto;
    background-position: 50% 50%;
    background-repeat: no-repeat
}
.tpl-kid .nail {
    display: block;
    position: absolute;
    width: 7px;
    height: 7px;
    background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-kid.32-yog151102141400.png?max_age=19830212&d=20151102143706);
    background-position: -1909px 0
}

.tpl-kid .nail.tl {
    top: 52px;
    left: 48px
}

.tpl-kid .nail.tr {
    top: 55px;
    right: 35px
}

.tpl-kid .nail.bl {
    bottom: 16px;
    left: 48px
}

.tpl-kid .nail.br {
    bottom: 12px;
    right: 34px
}

.tpl-kid .line-bg {
    width: 250px;
    height: 45px;
    background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-kid.32-yog151102141400.png?max_age=19830212&d=20151102143706);
    background-position: -1657px -204px;
    position: absolute;
    top: 0;
    left: 50%;
    margin-left: -125px
}

.tpl-kid .cover-title {
    font-size: 20px;
    text-align: center;
    line-height: 38px;
    padding-top: 16px;
    position: relative
}

.tpl-kid .title-decorate {
    display: block;
    height: 10px;
    width: 240px;
    margin: 0 auto;
    position: relative;
    padding-bottom: 9px;
    overflow: hidden
}

.tpl-kid .title-decorate b {
    display: block;
    height: 10px;
    width: 119px;
    position: absolute;
    top: 0;
    background-repeat: no-repeat
}

.tpl-kid .title-decorate .t-deco-l {
    left: 0;
    background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-kid.32-yog151102141400.png?max_age=19830212&d=20151102143706);
    background-position: -963px -239px
}

.tpl-kid .title-decorate .t-deco-r {
    right: 0;
    background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-kid.32-yog151102141400.png?max_age=19830212&d=20151102143706);
    background-position: -1484px -221px
}

.tpl-kid .title-decorate.reverse {
    -webkit-transform: rotateX(180deg);
}

.tpl-kid .author {
    font-size: 14px;
    line-height: 23px
}

.tpl-kid .page-1 .img-page {
    position: relative;
    top: 164px;
    height: 465px;
    width: 375px;
    left: 50%;
    margin-left: -187px
}

.tpl-kid .page-1 .cover-decorate {
    width: 375px;
    height: 465px;
    background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/img/tpl-kid/deco-2.32.png?max_age=19830212&d=20151102143706);
    top: -10px;
    left: auto;
    margin-left: 0;
    right: 0
}

.tpl-kid .page-1 .cover-frame {
    width: 375px;
    height: 430px;
    position: absolute;
    right: 6px
}

.tpl-kid .page-1 .cover-frame .frame-bg {
    background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/img/tpl-kid/frame-2.png?max_age=19830212&d=20151102143706)
}

.tpl-kid .page-1 .img-describe {
    width: 100%;
    position: absolute;
    height: 20px;
    line-height: 20px;
    font-size: 16px;
    text-align: center;
    bottom: -20px
}

.tpl-kid .page-1 .ele-page {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 210px
}

.tpl-kid .page-1 .goodTime {
    display: block;
    position: absolute;
    width: 128px;
    height: 89px;
    left: 18px;
    top: -10px;
    background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-kid.32-yog151102141400.png?max_age=19830212&d=20151102143706);
    background-position: -833px -152px;
    background-repeat: no-repeat
}

.tpl-kid .page-1 .goodTime .start-txt {
    display: block;
    position: absolute;
    top: 55px;
    right: 0;
    width: 128px;
    height: 20px;
    background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-kid.32-yog151102141400.png?max_age=19830212&d=20151102143706);
    background-position: -1224px -221px;
    background-repeat: no-repeat
}

.tpl-kid .page-1 .goodTime .start-line {
    display: block;
    position: absolute;
    top: 55px;
    right: 0;
    width: 128px;
    height: 20px;
    background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-kid.32-yog151102141400.png?max_age=19830212&d=20151102143706);
    background-position: -1354px -221px;
    background-repeat: no-repeat
}

.tpl-kid .page-1 .horn {
    display: block;
    position: absolute;
    width: 229px;
    height: 85px;
    left: 9px;
    top: 110px;
    z-index: 2
}

.tpl-kid .page-1 .horn .horn-l {
    display: block;
    position: absolute;
    width: 115px;
    height: 85px;
    left: 0;
    top: 0;
    background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-kid.32-yog151102141400.png?max_age=19830212&d=20151102143706);
    background-position: -963px -152px
}

.tpl-kid .page-1 .horn .horn-txt {
    display: block;
    position: absolute;
    width: 114px;
    height: 50px;
    left: 114px;
    top: 0;
    background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-kid.32-yog151102141400.png?max_age=19830212&d=20151102143706);
    background-position: 0 -202px
}

.tpl-kid .page-1 .star {
    display: block;
    position: absolute;
    width: 74px;
    height: 65px;
    background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-kid.32-yog151102141400.png?max_age=19830212&d=20151102143706);
    background-position: -1499px -152px;
    right: 38px;
    top: 80px
}

.tpl-kid .page-1 .flag {
    width: 130px;
    height: 160px;
    display: block;
    position: absolute;
    right: 0;
    top: 9px;
    background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-kid.32-yog151102141400.png?max_age=19830212&d=20151102143706);
    background-position: 0 0;
    background-repeat: no-repeat;
    width: 213px;
    height: 200px;
    right: -80px;
    top: 5px
}

.tpl-kid .page-1 .path-box,
.tpl-kid .page-2 .path-box,
.tpl-kid .page-4 .path-box {
    fill: #fff;
    stroke: #231815;
    stroke-linejoin: round;
    stroke-width: 3px;
    fill-opacity: 0;
    -webkit-transform: scale(.5);
}

.tpl-kid .tpl-cover .path-box {
    fill: #fff;
    stroke: #000;
    stroke-linejoin: round;
    stroke-width: 2px;
    fill-opacity: 0
}

.tpl-kid .page-3 .path-box {
    fill: #fff;
    stroke: #000;
    stroke-linejoin: round;
    stroke-width: 1.5px;
    fill-opacity: 0
}

.tpl-kid .page-5 .path-box {
    fill: #fff;
    stroke: #000;
    stroke-linejoin: round;
    stroke-width: 2px;
    fill-opacity: 0
}

.tpl-kid .page-3 .path-box.path-line,
.tpl-kid .page-5 .path-box.path-line {
    stroke-dasharray: 20;
    stroke-dashoffset: 20
}

.tpl-kid .page-2 .img-page {
    position: relative;
    top: 30px
}

.tpl-kid .page-2 .cover-decorate {
    width: 375px;
    height: 315px;
    background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/img/tpl-kid/deco-3.32.png?max_age=19830212&d=20151102143706);
    top: -10px
}

.tpl-kid .page-2 .cover-frame {
    width: 375px;
    height: 315px;
    top: 0
}

.tpl-kid .page-2 .cover-frame .frame-bg {
    background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/img/tpl-kid/frame-3.png?max_age=19830212&d=20151102143706)
}

.tpl-kid .page-2 .img-describe {
    width: 270px;
    position: absolute;
    line-height: 26px;
    font-size: 16px;
    text-align: left;
    bottom: -80px;
    right: 50%;
    margin-right: -160px;
    height: 78px
}

.tpl-kid .page-2 .ele-page {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 135px
}

.tpl-kid .page-2 .book {
    display: block;
    position: absolute;
    width: 110px;
    height: 100px;
    background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-kid.32-yog151102141400.png?max_age=19830212&d=20151102143706);
    background-position: -215px -152px;
    bottom: 24px;
    right: 32px
}

.tpl-kid .page-2 .person {
    display: block;
    position: absolute;
    width: 172px;
    height: 143px;
    bottom: -30px;
    left: 44px
}

.tpl-kid .page-2 .person .boy {
    display: block;
    position: absolute;
    width: 65px;
    height: 95px;
    background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-kid.32-yog151102141400.png?max_age=19830212&d=20151102143706);
    background-position: -327px -152px;
    bottom: -3px;
    left: 2px
}

.tpl-kid .page-2 .person .girl {
    display: block;
    position: absolute;
    width: 60px;
    height: 90px;
    background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-kid.32-yog151102141400.png?max_age=19830212&d=20151102143706);
    background-position: -771px -152px;
    bottom: 34px;
    left: 113px
}

.tpl-kid .page-2 .person .line {
    display: block;
    position: absolute;
    width: 110px;
    height: 50px;
    background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-kid.32-yog151102141400.png?max_age=19830212&d=20151102143706);
    background-position: -1657px -152px;
    bottom: 92px;
    left: 36px
}

.tpl-kid .page-2 .star {
    display: block;
    position: absolute;
    width: 60px;
    height: 50px;
    background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-kid.32-yog151102141400.png?max_age=19830212&d=20151102143706);
    background-position: -116px -202px;
    left: 23px;
    bottom: 88px
}

.tpl-kid .page-3 .img-page {
    position: relative;
    top: 120px;
    height: 325px
}

.tpl-kid .page-3 .cover-decorate {
    width: 375px;
    height: 325px;
    background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/img/tpl-kid/deco-4.32.png?max_age=19830212&d=20151102143706);
    top: -10px
}

.tpl-kid .page-3 .cover-frame {
    width: 375px;
    height: 270px;
    top: 50px
}

.tpl-kid .page-3 .cover-frame .frame-bg {
    background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/img/tpl-kid/frame-4.png?max_age=19830212&d=20151102143706)
}

.tpl-kid .page-3 .img-describe {
    width: 315px;
    left: 50%;
    margin-left: -157px;
    position: absolute;
    line-height: 28px;
    font-size: 16px;
    text-align: left;
    bottom: -97px;
    height: 84px
}

.tpl-kid .page-3 .ele-page {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100px
}

.tpl-kid .page-3 .bell {
    display: block;
    position: absolute;
    width: 90px;
    height: 80px;
    background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-kid.32-yog151102141400.png?max_age=19830212&d=20151102143706);
    background-position: -1080px -152px;
    left: -10px;
    background-repeat: no-repeat
}

.tpl-kid .page-3 .cloud {
    display: block;
    position: absolute;
    width: 50px;
    height: 29px;
    background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-kid.32-yog151102141400.png?max_age=19830212&d=20151102143706);
    background-position: -1172px -221px;
    right: 35px;
    top: 75px
}

.tpl-kid .page-3 .cloud-b {
    display: block;
    position: absolute;
    width: 50px;
    height: 29px;
    background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-kid.32-yog151102141400.png?max_age=19830212&d=20151102143706);
    background-position: -1172px -221px;
    right: -30px;
    top: 100px
}

.tpl-kid .page-3 .welcome {
    display: block;
    position: absolute;
    width: 375px;
    height: 94px;
    background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-kid.32-yog151102141400.png?max_age=19830212&d=20151102143706);
    background-position: -394px -152px;
    left: 50%;
    margin-left: -187px;
    top: -6px;
    background-repeat: no-repeat
}

.tpl-kid .page-3 .nail-t {
    display: block;
    position: absolute;
    width: 12px;
    height: 10px;
    background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-kid.32-yog151102141400.png?max_age=19830212&d=20151102143706);
    background-position: -1909px -18px;
    left: 50%;
    margin-left: -9px;
    top: 0
}

.tpl-kid .page-3 .nail-l {
    display: block;
    position: absolute;
    width: 7px;
    height: 7px;
    background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-kid.32-yog151102141400.png?max_age=19830212&d=20151102143706);
    background-position: -1909px -36px;
    top: 60px;
    left: 24px
}

.tpl-kid .page-3 .nail-r {
    display: block;
    position: absolute;
    width: 7px;
    height: 7px;
    background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-kid.32-yog151102141400.png?max_age=19830212&d=20151102143706);
    background-position: -1909px -36px;
    right: 22px;
    top: 63px
}

.tpl-kid .page-3 .nail-line {
    display: block;
    position: absolute;
    width: 325px;
    height: 67px;
    background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-kid.32-yog151102141400.png?max_age=19830212&d=20151102143706);
    background-position: -1172px -152px;
    left: 26px;
    top: 2px
}

.tpl-kid .page-4 .img-page {
    position: relative;
    top: 167px
}

.tpl-kid .page-4 .cover-decorate {
    width: 375px;
    height: 490px;
    background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/img/tpl-kid/deco-5.32.png?max_age=19830212&d=20151102143706);
    top: -10px
}

.tpl-kid .page-4 .cover-frame {
    width: 375px;
    height: 495px;
    top: -4px
}

.tpl-kid .page-4 .cover-frame .frame-bg {
    background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/img/tpl-kid/frame-5.png?max_age=19830212&d=20151102143706)
}

.tpl-kid .page-4 .img-describe {
    width: 208px;
    position: absolute;
    line-height: 28px;
    font-size: 16px;
    text-align: left;
    top: -70px;
    right: 53%;
    margin-right: -200px;
    height: 56px
}

.tpl-kid .page-5 .img-page {
    position: relative;
    top: 20px
}

.tpl-kid .page-5 .cover-decorate {
    width: 375px;
    height: 490px;
    background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/img/tpl-kid/deco-6.32.png?max_age=19830212&d=20151102143706);
    top: 0;
    background-repeat: no-repeat
}

.tpl-kid .page-5 .cover-frame {
    width: 375px;
    height: 495px;
    top: 0
}

.tpl-kid .page-5 .cover-frame .frame-bg {
    background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/img/tpl-kid/frame-6.png?max_age=19830212&d=20151102143706)
}

.tpl-kid .page-5 .cover-img {
    width: 330px;
    height: 450px;
    position: relative;
    top: 14px;
    left: 22px
}

.tpl-kid .page-5 .img-describe {
    padding: 0 19px;
    position: absolute;
    line-height: 28px;
    font-size: 16px;
    text-align: left;
    bottom: -24px;
    left: 50%;
    margin-left: -190px;
    height: 28px
}

.tpl-kid .page-5 .ele-page {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 80px;
    z-index: 2
}

.tpl-kid .page-5 .symbol {
    display: block;
    position: absolute;
    width: 80px;
    height: 65px;
    background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-kid.32-yog151102141400.png?max_age=19830212&d=20151102143706);
    background-position: -1575px -152px;
    left: 33px;
    bottom: 50px
}

.tpl-kid .train-page {
    position: absolute;
    width: 100%;
    height: 150px;
    top: 12%;
    left: 0
}

.tpl-kid .page-2 .train-page {
    top: 43%
}

.tpl-kid .page-3 .train-page {
    top: auto;
    bottom: 20px
}

.tpl-kid .page-4 .train-page {
    top: 11%
}

.tpl-kid .page-5 .train-page {
    top: auto;
    bottom: -100px
}

.tpl-kid .way {
    width: 100%;
    height: 150px;
    background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-kid.32-yog151102141400.png?max_age=19830212&d=20151102143706);
    background-position: -215px 0;
    position: absolute;
    z-index: 19;
    background-repeat: no-repeat;
    top: -50px;
    left: 0
}

.tpl-kid .train {
    display: block;
    position: absolute;
    height: 41px;
    top: 0;
    width: 129px;
    left: 0;
    background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/img/tpl-kid/train4.32.png?max_age=19830212&d=20151102143706)
}

.tpl-kid .smoke1 {
    -webkit-transform: translate3d(5px, 5px, 0);
    opacity: 0;
    display: block;
    position: absolute;
    width: 16px;
    height: 8px;
    background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-kid.32-yog151102141400.png?max_age=19830212&d=20151102143706);
    background-position: -1909px -54px;
    right: 26px;
    top: -8px
}

.tpl-kid .smoke2 {
    -webkit-transform: translate3d(5px, 5px, 0);
    opacity: 0;
    display: block;
    position: absolute;
    width: 11px;
    height: 8px;
    background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-kid.32-yog151102141400.png?max_age=19830212&d=20151102143706);
    background-position: -1909px -72px;
    right: 38px;
    top: -15px
}

.tpl-kid .smoke3 {
    -webkit-transform: translate3d(5px, 5px, 0);
    opacity: 0;
    display: block;
    position: absolute;
    width: 10px;
    height: 8px;
    background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-kid.32-yog151102141400.png?max_age=19830212&d=20151102143706);
    background-position: -1909px -90px;
    right: 50px;
    top: -23px
}

.tpl-kid .page-1 .train,
.tpl-kid .page-4 .train,
.tpl-kid .page-5 .train,
.tpl-kid .page-3 .train {
    background-position: 38px 100%;
    background-repeat: no-repeat
}

.tpl-kid .page-1 .train-top,
.tpl-kid .page-4 .train-top,
.tpl-kid .page-5 .train-top,
.tpl-kid .page-3 .train-top {
    width: 91px;
    background-position: -91px 0;
    background-repeat: no-repeat
}

.tpl-kid .page-1 .smoke1,
.tpl-kid .page-1 .smoke2,
.tpl-kid .page-1 .smoke3,
.tpl-kid .page-3 .smoke1,
.tpl-kid .page-3 .smoke2,
.tpl-kid .page-3 .smoke3,
.tpl-kid .page-4 .smoke1,
.tpl-kid .page-4 .smoke2,
.tpl-kid .page-4 .smoke3,
.tpl-kid .page-5 .smoke1,
.tpl-kid .page-5 .smoke2,
.tpl-kid .page-5 .smoke3 {
    display: none
}

.tpl-kid .page-1 .train-top .smoke1,
.tpl-kid .page-1 .train-top .smoke2,
.tpl-kid .page-1 .train-top .smoke3 {
    display: block;
    left: -5px;
    right: auto
}

.tpl-kid .page-1 .train-top .smoke2 {
    left: -10px
}

.tpl-kid .page-1 .train-top .smoke3 {
    left: -15px
}

.tpl-kid .page-3 .train-top .smoke1,
.tpl-kid .page-3 .train-top .smoke2,
.tpl-kid .page-3 .train-top .smoke3 {
    display: block;
    left: -5px;
    right: auto
}

.tpl-kid .page-3 .train-top .smoke2 {
    left: -10px
}

.tpl-kid .page-3 .train-top .smoke3 {
    left: -15px
}

.tpl-kid .page-4 .train-top .smoke1,
.tpl-kid .page-4 .train-top .smoke2,
.tpl-kid .page-4 .train-top .smoke3 {
    display: block;
    left: -5px;
    right: auto
}

.tpl-kid .page-4 .train-top .smoke2 {
    left: -10px
}

.tpl-kid .page-4 .train-top .smoke3 {
    left: -15px
}

.tpl-kid .page-5 .train-top .smoke1,
.tpl-kid .page-5 .train-top .smoke2,
.tpl-kid .page-5 .train-top .smoke3 {
    display: block;
    left: -5px;
    right: auto
}

.tpl-kid .page-5 .train-top .smoke2 {
    left: -10px
}

.tpl-kid .page-5 .train-top .smoke3 {
    left: -15px
}

.tpl-kid .page-2 .way {
    height: 150px;
    background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-kid.32-yog151102141400.png?max_age=19830212&d=20151102143706);
    background-position: -763px 0;
    top: 80px
}

.tpl-kid .page-2 .train {
    width: 91px
}

.tpl-kid .page-2 .train-top {
    width: 91px;
    background-position: -91px 0;
    background-repeat: no-repeat
}

.tpl-kid .page-2 .smoke1,
.tpl-kid .page-2 .smoke2,
.tpl-kid .page-2 .smoke3 {
    display: none
}

.tpl-kid .page-2 .train-top .smoke1,
.tpl-kid .page-2 .train-top .smoke2,
.tpl-kid .page-2 .train-top .smoke3 {
    display: block;
    left: -5px;
    right: auto
}

.tpl-kid .page-2 .train-top .smoke2 {
    left: -10px
}

.tpl-kid .page-2 .train-top .smoke3 {
    left: -15px
}

.tpl-kid .page-3 .way {
    height: 150px;
    background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-kid.32-yog151102141400.png?max_age=19830212&d=20151102143706);
    background-position: -1311px 0;
    top: 20px
}

html,
body {
    /*width: 100%;
    height: 100%*/
}

.tpl-kid .hide {
    display: none!important
}

.tpl-kid .clearfix:after {
    content: ".";
    height: 0;
    visibility: hidden;
    display: block;
    clear: both;
    font-size: 0;
    line-height: 0
}

.tpl-kid .clearfix {
    *zoom: 1
}

.tpl-kid .textoverflow {
    display: inline-block;
    white-space: nowrap;
    word-wrap: normal;
    word-break: break-all;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
    _width: 100%
}

.tpl-kid .noOp {
    opacity: 0!important
}

.tpl-kid .tpl-preview {
    height: 100%
}

.tpl-kid .tpl-preview .cover-main {
    -webkit-transform: translate3d(0, -600px, 0);
}

.tpl-kid .tpl-preview .t-deco-l {
    -webkit-transform: translate3d(-122px, 0, 0);
}

.tpl-kid .tpl-preview .t-deco-r {
    -webkit-transform: translate3d(122px, 0, 0);
}

.tpl-kid .tpl-preview .title {
    opacity: 0;
    -webkit-transform: scale(1);
    height: 38px;
    line-height: 38px;
    font-size: 30px;
    text-align: center;
    width: 260px;
    margin: 0 auto;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap
}

.tpl-kid .tpl-preview .author {
    opacity: 0;
    line-height: 23px;
    text-align: center;
    width: 260px;
    margin: 0 auto;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap
}

.tpl-kid .tpl-preview .tpl-cover .nail {}

.tpl-kid .title-decorate.reverse {
    overflow: visible;
    -webkit-transform: none;
}

.tpl-kid .svg-deco {
    -webkit-transform: scale(.57);
}

.tpl-kid .tpl-cover #svg-deco {
    enable-background: new 0 0 440 172;
    position: absolute;
    left: -47px;
    top: -12px;
    stroke-dasharray: 220;
    stroke-dashoffset: 220;
    -webkit-transition: all 1.5s 1s cubic-bezier(0.075, .82, .165, 1);
}

.tpl-kid .tpl-cover #svg-deco-reverse {
    enable-background: new 0 0 440 172;
    position: absolute;
    left: -47px;
    top: -3px;
    stroke-dasharray: 220;
    stroke-dashoffset: 220;
    -webkit-transition: all 1.5s 1.5s cubic-bezier(0.075, .82, .165, 1);
}

.tpl-kid .tpl-cover.animate #svg-deco {
    stroke-dashoffset: 0
}

.tpl-kid .tpl-cover.animate #svg-deco-reverse {
    stroke-dashoffset: 0
}

.tpl-kid .tpl-preview.tpl-cover {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 5;
    width: 100%
}

.tpl-kid .tpl-preview.img-list {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 4;
    width: 100%;
    overflow: visible;
    -webkit-transform: translateX(-100%);
    -webkit-transition: all 1.3s .4s cubic-bezier(0.165, .84, .44, 1);
}

.tpl-kid .mod-img-wrap .tpl-preview.img-list .list-page {
    overflow: hidden
}

.tpl-kid .tpl-preview .cover-title {
    -webkit-transform: translateY(-250%);
}

.tpl-kid .tpl-cover .cover-decorate {
    background-image: none!important
}

.tpl-kid .tpl-cover .svg {
    position: absolute;
    top: -8px;
    left: -1px;
    stroke-dasharray: 7000;
    stroke-dashoffset: 7000;
    -webkit-transition: all 10s 4s cubic-bezier(0.215, .61, .355, 1);
}

.tpl-kid .tpl-cover.animate .cover-decorate .svg {
    stroke-dashoffset: 0
}

.tpl-kid .tpl-preview .cover-img {
    -webkit-transition: all 2s 2s;
}

.tpl-kid .animate.item .cover-img {
    /*-webkit-transform: scale(1.05);*/
    /*transform: scale(1.05);*/
    opacity: 1;
}

.tpl-kid .tpl-preview.animate .cover-main {
    -webkit-animation: cover-slidedown 2s 3s cubic-bezier(0.77, 0, .175, 1) both;
}


.tpl-kid .tpl-preview.animate .t-deco-l,
.tpl-kid .tpl-preview.animate .t-deco-r {
    -webkit-animation: t-deco-show 1s .6s cubic-bezier(0.215, .61, .355, 1) both;
}


.tpl-kid .tpl-preview.animate .author {
    -webkit-animation: opacity-show 1s 1.5s linear both;
}


.tpl-kid .tpl-preview.animate .title {
    -webkit-animation: title-show 1s 1.2s linear both;

}


.tpl-kid .tpl-preview.animate .cover-title {
    -webkit-animation: title-down 2s 2s cubic-bezier(0.77, 0, .175, 1) both;
}

.tpl-kid .tpl-cover.animate-b {
    -webkit-animation: cover-hide 1s cubic-bezier(0.6, .04, .98, .335) both;
}

.tpl-kid .img-list.animate {
    -webkit-transform: translateX(0%);
}

.tpl-kid .tpl-preview .horn .horn-txt {
    -webkit-transform: translateX(-30px) scale(0);
    -webkit-transform-origin: 0 100%;
    -webkit-transition: all 1s 1.5s ease-out;
}

.tpl-kid .tpl-preview .page-1 .star {
    -webkit-transform: scale(0);
    -webkit-transition: all 1s 1.3s ease-out;
}

.tpl-kid .tpl-preview .page-1 .goodTime {
    overflow: hidden;
    -webkit-transform: translateY(-90px);
    -webkit-transition: all .3s 2s;
}

.tpl-kid .tpl-preview .page-1 .goodTime .start-txt {
    opacity: 0;
    -webkit-transform: translateX(100px);
    -webkit-transition: all .5s 2.6s, opacity .1s 2.4s;
}

.tpl-kid .tpl-preview .page-1 .goodTime .start-line {
    opacity: 0;
    -webkit-transform: translateX(100px);
    -webkit-transition: all .5s 2.3s, opacity .1s 2.4s;
}

.tpl-kid .page-1 .cover-decorate {
    background-image: none!important
}

.tpl-kid .page-1 .svg {
    position: absolute;
    top: 52px;
    left: 3px;
    stroke-dasharray: 5000;
    stroke-dashoffset: 5000;
    -webkit-transition: all 3s .8s ease-out;
}

.tpl-kid .page-1.animate .svg {
    stroke-dashoffset: 0
}

.tpl-kid .tpl-preview .page-1 .flag {
    -webkit-transform: translateX(200px);
    -webkit-transition: all .9s 2.5s ease-out;
}

.tpl-kid .page-1.animate .horn .horn-txt {
    -webkit-transform: translateX(0px) scale(1);
}

.tpl-kid .page-1.animate .star {
    -webkit-transform: scale(1);
}

.tpl-kid .tpl-preview .page-1.animate .goodTime {
    -webkit-transform: translateY(0);
}

.tpl-kid .tpl-preview .page-1.animate .start-line {
    -webkit-transform: translateX(0);
    opacity: 1
}

.tpl-kid .tpl-preview .page-1.animate .start-txt {
    -webkit-transform: translateX(0);
    opacity: 1
}

.tpl-kid .tpl-preview .page-1.animate .flag {
    -webkit-transform: translateX(0px);
}


.tpl-kid .page-1.animate .horn {
    -webkit-animation: horn-scale .5s 1s linear forwards;
}


.tpl-kid .page-1.animate .horn-l {
    -webkit-animation: horn-l-scale .5s 1.5s linear infinite both;
}

.tpl-kid .page-1.animate .train {
    -webkit-animation: train-bounce 2.6s 1s linear 1 both;
}

.tpl-kid .page-1.animate .train-top {
    -webkit-animation: train-bounce-top 2.6s 1s linear 1 both;
}

.tpl-kid .tpl-preview .page-2 .star,
.tpl-kid .tpl-preview .page-2 .book {
    -webkit-transform: scale(0);
    -webkit-transition: all 1s 1s ease;
}

.tpl-kid .tpl-preview .page-2 .girl {
    -webkit-transform: translateY(100px);
    -webkit-transition: all 3s 1.3s ease;
}

.tpl-kid .tpl-preview .page-2 .boy {
    -webkit-transform: translateY(70px);
    -webkit-transition: all 1s 1s ease;
}

.tpl-kid .tpl-preview .page-2.animate .girl {
    -webkit-transform: translateY(0px);
}

.tpl-kid .tpl-preview .page-2.animate .boy {
    -webkit-transform: translateY(0px);
}

.tpl-kid .tpl-preview .page-2.animate .book {
    -webkit-transform: scale(1);
}

.tpl-kid .tpl-preview .page-2.animate .star {
    -webkit-transform: scale(1);
}

.tpl-kid .tpl-preview .page-2 .line {
    width: 0;
    -webkit-transition: all 1.3s 2.3s linear;
}

.tpl-kid .tpl-preview .page-2.animate .line {
    width: 110px
}

.tpl-kid .page-2 .cover-decorate {
    background-image: none!important
}

.tpl-kid .page-2 .svg {
    position: absolute;
    top: -3px;
    left: 5px;
    stroke-dasharray: 5000;
    stroke-dashoffset: 5000;
    -webkit-transition: all 3s 1s ease-out;
}

.tpl-kid .page-2.animate .svg {
    stroke-dashoffset: 0
}

.tpl-kid .page-2.animate .train {
    -webkit-animation: train-bounce2 2.6s 1s linear 1 both;
}

.tpl-kid .page-2.animate .train-top {
    -webkit-animation: train-bounce2-top 2.6s 1s linear 1 both;
}

.tpl-kid .tpl-preview .page-3 .nail-l,
.tpl-kid .tpl-preview .page-3 .nail-r,
.tpl-kid .tpl-preview .page-3 .nail-t {
    -webkit-transform: scale(0);
    -webkit-transition: all .5s 2.5s linear;
}

.tpl-kid .tpl-preview .page-3.animate .nail-l,
.tpl-kid .tpl-preview .page-3.animate .nail-r,
.tpl-kid .tpl-preview .page-3.animate .nail-t {
    -webkit-transform: scale(1);
}

.tpl-kid .tpl-preview .page-3 .nail-line {
    width: 0;
    -webkit-transition: all 1s 2s linear;
}

.tpl-kid .tpl-preview .page-3.animate .nail-line {
    width: 325px
}

.tpl-kid .page-3 .cover-decorate {
    background-image: none!important
}

.tpl-kid .page-3 .svg {
    position: absolute;
    top: 56px;
    left: -2px;
    stroke-dasharray: 2000;
    stroke-dashoffset: 2000;
    -webkit-transition: all 2s 1s ease-out;
}

.tpl-kid .page-3.animate .svg {
    stroke-dashoffset: 0
}

.tpl-kid .tpl-preview .page-3 .welcome {
    -webkit-transform: translateY(-90px);
    -webkit-transition: all 1s 2.5s ease-out;
}

.tpl-kid .tpl-preview .page-3 .bell {
    -webkit-transform: translateY(-90px);
    -webkit-transition: all 1s 2.8s ease-out;
}

.tpl-kid .tpl-preview .page-3 .cloud {
    -webkit-transform: translateX(100px);
    -webkit-transition: all 20s 1s cubic-bezier(0.445, .05, .55, .95);
}

.tpl-kid .tpl-preview .page-3 .cloud-b {
    -webkit-transform: translateX(100px);
    -webkit-transition: all 20s 1s cubic-bezier(0.445, .05, .55, .95);
}

.tpl-kid .tpl-preview .page-3.animate .welcome {
    -webkit-transform: translateX(0px);
}

.tpl-kid .tpl-preview .page-3.animate .bell {
    -webkit-transform: translateX(0px);
}

.tpl-kid .tpl-preview .page-3.animate .cloud-b,
.tpl-kid .tpl-preview .page-3.animate .cloud {
    -webkit-transform: translateX(-500px);
}

.tpl-kid .page-3.animate .train {
    -webkit-animation: train-bounce3 2.6s 1s linear 1 both;
}

.tpl-kid .page-3.animate .train-top {
    -webkit-animation: train-bounce3-top 2.6s 1s linear 1 both;
}

.tpl-kid .page-4 .cover-decorate {
    background-image: none!important
}

.tpl-kid .page-4 .svg {
    position: absolute;
    top: -3px;
    left: 5px;
    stroke-dasharray: 5000;
    stroke-dashoffset: 5000;
    -webkit-transition: all 3s 1s ease-out;
}

.tpl-kid .page-4.animate .svg {
    stroke-dashoffset: 0
}

.tpl-kid .page-4.animate .train {
    -webkit-animation: train-bounce 2.6s 1s linear 1 both;
}

.tpl-kid .page-4.animate .train-top {
    -webkit-animation: train-bounce-top 2.6s 1s linear 1 both;
}

.tpl-kid .page-5.animate .train {
    -webkit-animation: train-bounce 2.6s 1s linear 1 both;
}

.tpl-kid .page-5.animate .train-top {
    -webkit-animation: train-bounce-top 2.6s 1s linear 1 both;
}

.tpl-kid .page-5 .cover-decorate {
    background-image: none!important
}

.tpl-kid .page-5 .svg {
    position: absolute;
    top: -20px;
    left: -4px;
    stroke-dasharray: 7000;
    stroke-dashoffset: 7000;
    -webkit-transition: all 5s 1s ease-out;
}

.tpl-kid .page-5.animate .svg {
    stroke-dashoffset: 0
}

.tpl-kid .page-3.animate .path-box.path-line,
.tpl-kid .page-5.animate .path-box.path-line {
    -webkit-transition: all 2s 2s ease-out;
    stroke-dashoffset: 0
}

.tpl-kid .train-page {
    position: absolute;
    width: 100%;
    height: 150px;
    top: 12%;
    left: 0
}

.tpl-kid .page-2 .train-page {
    top: 43%
}

.tpl-kid .page-3 .train-page {
    top: auto;
    bottom: 20px
}

.tpl-kid .page-1 .train-page {
    top: 11%;
    -webkit-transform: rotate(12deg);
}

.tpl-kid .page-4 .train-page {
    top: 11%;
    -webkit-transform: rotate(8deg);
}

.tpl-kid .page-5 .train-page {
    top: auto;
    bottom: -110px;
    -webkit-transform: rotate(10deg);
}

.tpl-kid .way {
    width: 100%;
    height: 150px;
    background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-kid.32-yog151102141400.png?max_age=19830212&d=20151102143706);
    background-position: -215px 0;
    position: absolute;
    z-index: 19;
    background-repeat: no-repeat;
    top: -50px;
    left: 0
}

.tpl-kid .train {
    display: block;
    position: absolute;
    height: 41px;
    top: 0;
    width: 129px;
    left: 0;
    background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/img/tpl-kid/train4.32.png?max_age=19830212&d=20151102143706)
}

.tpl-kid .smoke1 {
    -webkit-transform: translate3d(5px, 5px, 0);
    opacity: 0;
    display: block;
    position: absolute;
    width: 16px;
    height: 8px;
    background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-kid.32-yog151102141400.png?max_age=19830212&d=20151102143706);
    background-position: -1909px -54px;
    right: 26px;
    top: -8px
}

.tpl-kid .smoke2 {
    -webkit-transform: translate3d(5px, 5px, 0);
    opacity: 0;
    display: block;
    position: absolute;
    width: 11px;
    height: 8px;
    background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-kid.32-yog151102141400.png?max_age=19830212&d=20151102143706);
    background-position: -1909px -72px;
    right: 38px;
    top: -15px
}

.tpl-kid .smoke3 {
    -webkit-transform: translate3d(5px, 5px, 0);
    opacity: 0;
    display: block;
    position: absolute;
    width: 10px;
    height: 8px;
    background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-kid.32-yog151102141400.png?max_age=19830212&d=20151102143706);
    background-position: -1909px -90px;
    right: 50px;
    top: -23px
}

.tpl-kid .page-1 .train,
.tpl-kid .page-4 .train,
.tpl-kid .page-5 .train,
.tpl-kid .page-3 .train {
    background-position: 38px 100%;
    background-repeat: no-repeat
}

.tpl-kid .page-1 .train-top,
.tpl-kid .page-4 .train-top,
.tpl-kid .page-5 .train-top,
.tpl-kid .page-3 .train-top {
    width: 91px;
    background-position: -91px 0;
    background-repeat: no-repeat
}

.tpl-kid .page-1 .smoke1,
.tpl-kid .page-1 .smoke2,
.tpl-kid .page-1 .smoke3,
.tpl-kid .page-3 .smoke1,
.tpl-kid .page-3 .smoke2,
.tpl-kid .page-3 .smoke3,
.tpl-kid .page-4 .smoke1,
.tpl-kid .page-4 .smoke2,
.tpl-kid .page-4 .smoke3,
.tpl-kid .page-5 .smoke1,
.tpl-kid .page-5 .smoke2,
.tpl-kid .page-5 .smoke3 {
    display: none
}

.tpl-kid .page-1 .train-top .smoke1,
.tpl-kid .page-1 .train-top .smoke2,
.tpl-kid .page-1 .train-top .smoke3 {
    display: block;
    left: -5px;
    right: auto
}

.tpl-kid .page-1 .train-top .smoke2 {
    left: -10px
}

.tpl-kid .page-1 .train-top .smoke3 {
    left: -15px
}

.tpl-kid .page-3 .train-top .smoke1,
.tpl-kid .page-3 .train-top .smoke2,
.tpl-kid .page-3 .train-top .smoke3 {
    display: block;
    left: -5px;
    right: auto
}

.tpl-kid .page-3 .train-top .smoke2 {
    left: -10px
}

.tpl-kid .page-3 .train-top .smoke3 {
    left: -15px
}

.tpl-kid .page-4 .train-top .smoke1,
.tpl-kid .page-4 .train-top .smoke2,
.tpl-kid .page-4 .train-top .smoke3 {
    display: block;
    left: -5px;
    right: auto
}

.tpl-kid .page-4 .train-top .smoke2 {
    left: -10px
}

.tpl-kid .page-4 .train-top .smoke3 {
    left: -15px
}

.tpl-kid .page-5 .train-top .smoke1,
.tpl-kid .page-5 .train-top .smoke2,
.tpl-kid .page-5 .train-top .smoke3 {
    display: block;
    left: -5px;
    right: auto
}

.tpl-kid .page-5 .train-top .smoke2 {
    left: -10px
}

.tpl-kid .page-5 .train-top .smoke3 {
    left: -15px
}

.tpl-kid .page-2 .way {
    height: 150px;
    background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-kid.32-yog151102141400.png?max_age=19830212&d=20151102143706);
    background-position: -763px 0;
    top: 80px
}

.tpl-kid .page-2 .train {
    width: 91px
}

.tpl-kid .page-2 .train-top {
    width: 91px;
    background-position: -91px 0;
    background-repeat: no-repeat
}

.tpl-kid .page-2 .smoke1,
.tpl-kid .page-2 .smoke2,
.tpl-kid .page-2 .smoke3 {
    display: none
}

.tpl-kid .page-2 .train-top .smoke1,
.tpl-kid .page-2 .train-top .smoke2,
.tpl-kid .page-2 .train-top .smoke3 {
    display: block;
    left: -5px;
    right: auto
}

.tpl-kid .page-2 .train-top .smoke2 {
    left: -10px
}

.tpl-kid .page-2 .train-top .smoke3 {
    left: -15px
}

.tpl-kid .page-3 .way {
    height: 150px;
    background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-kid.32-yog151102141400.png?max_age=19830212&d=20151102143706);
    background-position: -1311px 0;
    top: 20px
}

.tpl-kid .smoke1 {
    -webkit-animation: smoke-1 2s 1.1s linear infinite both;
}

.tpl-kid .smoke2 {
    -webkit-animation: smoke-2 2s 1.1s linear infinite both;
}

.tpl-kid .smoke3 {
    -webkit-animation: smoke-3 2s 1.1s linear infinite both;
}

.tpl-kid .item .way {
    opacity: 0
}

.tpl-kid .item.animate .way {
    -webkit-animation: way 1s 1s linear 1 both;
    -webkit-transition: opacity .1s 1s;
    opacity: 1
}

.tpl-kid .item .train,
.tpl-kid .item .train-top {
    opacity: 0
}

.tpl-kid .item.animate .train,
.tpl-kid .item.animate .train-top {
    -webkit-transition: opacity .1s 1s;
    opacity: 1
}


.tpl-kid .tpl-cover .mask-cover,
.tpl-kid .list-page .img-page .mask-cover {
    width: 100%;
    height: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    background-color: rgba(255, 255, 255, 1);
    opacity: 1;
    z-index: 1;
}

.tpl-kid .tpl-cover .mask-anim,
.tpl-kid .list-page .img-page .mask-anim {
    -webkit-animation: mask-fade-in 1.3s ease forwards
}
/*.cover-main .mask-anim {
    -webkit-animation: mask-fade-in 1.5s 7.5s ease forwards !important
}*/
.tpl-kid .cover-main img {
    opacity: 0;
    -webkit-animation: mask-fade-out 2s 4.5s ease forwards !important;
}
.train-vue .j-page-inner-move-img{
    max-width: inherit;
    -webkit-transform : translate3d(0px, 0px, 0px);
    -webkit-transition: -webkit-transform 4s ease 3s;
    -webkit-animation-fill-mode:forwards;
}
.tpl-kid .item .cover-img {
    opacity: 0;
}


@media only screen and (max-height:626px) {
    .tpl-kid .tpl-cover {
        zoom: .95
    }
    .tpl-kid .img-list .ele-page,
    .tpl-kid .img-list .img-page {
        zoom: .85
    }
}

@media only screen and (max-height:603px) {
    .tpl-kid .img-list .ele-page,
    .tpl-kid .img-list .img-page {
        zoom: .9
    }
    .tpl-kid .img-list .page-3 .img-page .img-describe,
    .tpl-kid .img-list .page-4 .img-page .img-describe,
    .tpl-kid .img-list .page-5 .img-page .img-describe {
        zoom: 1.1
    }
    .tpl-kid .tpl-preview .cover-main {
        zoom: .95
    }
    .tpl-kid .page-2 .img-page {
        zoom: 1
    }
    .tpl-kid .page-1 .img-page {
        zoom: .98
    }
    .tpl-kid .page-1 .img-page {
        top: 120px
    }
    .tpl-kid .page-1 .horn {
        top: 95px
    }
}

@media only screen and (max-height:602px) {
    .tpl-kid .tpl-cover {
        zoom: .9
    }
    .tpl-kid .img-list .page-3 .img-page .img-describe,
    .tpl-kid .img-list .page-4 .img-page .img-describe,
    .tpl-kid .img-list .page-5 .img-page .img-describe {
        zoom: 1
    }
    .tpl-kid .img-list .ele-page,
    .tpl-kid .img-list .img-page {
        zoom: .86
    }
    .tpl-kid .page-1 .horn {
        top: 110px
    }
    .tpl-kid .page-1 .img-page {
        top: 160px
    }
}

@media only screen and (max-height:568px) {
    .tpl-kid .tpl-cover {
        zoom: .85
    }
    .tpl-kid .img-list .ele-page,
    .tpl-kid .img-list .img-page {
        zoom: .8
    }
}

@media only screen and (max-height:504px) {
    .tpl-kid .tpl-cover {
        zoom: .75
    }
    .tpl-kid .img-list .ele-page,
    .tpl-kid .img-list .img-page {
        zoom: .75
    }
    .tpl-kid .page-2 .train-page {
        top: 36%
    }
    .tpl-kid .page-3 .train-page {
        bottom: 0
    }
}

@media only screen and (max-height:458px) {
    .tpl-kid .tpl-cover {
        zoom: .7
    }
    .tpl-kid .img-list .ele-page,
    .tpl-kid .img-list .img-page {
        zoom: .7
    }
    .tpl-kid .page-1 .horn {
        display: none
    }
    .tpl-kid .page-1 .img-page {
        top: 140px
    }
    .tpl-kid .tpl-preview .page-1 .star {
        top: 90px
    }
    .tpl-kid .page-3 .img-describe {
        bottom: -80px
    }
}

@media only screen and (max-height:416px) {
    .tpl-kid .tpl-cover {
        zoom: .64
    }
    .tpl-kid .img-list .ele-page,
    .tpl-kid .img-list .img-page {
        zoom: .64
    }
    .tpl-kid .page-2 .train-page {
        top: 33%
    }
}

@media only screen and (max-height:370px) {
    .tpl-kid .page-1 .img-page {
        top: 80px
    }
    .tpl-kid .tpl-preview .page-1 .star {
        display: none
    }
    .tpl-kid .page-1 .train-page {
        top: 10%
    }
}

@media \0screen\,
screen\9 {
    .tpl-kid .tpl-cover .mask-cover,
    .tpl-kid .list-page .img-page .mask-cover {
        background-color: transparent;
        filter: progid: DXImageTransform.Microsoft.gradient(startColorstr=#FFFFFFFF, endColorstr=#FFFFFFFF);
        #zoom: 1
    }
}

@media only screen and (-webkit-min-device-pixel-ratio:1.25),
only screen and (min-resolution:120dpi),
only screen and (min-resolution:1.25dppx) {
    .tpl-kid .cover-decorate {
        background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/img/tpl-kid/cover-deco@2x.png?max_age=19830212&d=20151102143706);
        background-size: 375px 540px
    }
    .tpl-kid .cover-frame .frame-bg {
        background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/img/tpl-kid/frame-1@2x.png?max_age=19830212&d=20151102143706);
        background-size: 375px 500px
    }
    .tpl-kid .nail {
        background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-kid.32-yog151102141400@2x.png?max_age=19830212&d=20151102143706);
        background-size: 1925px 252px;
        background-position: -1909px 0
    }
    .tpl-kid .line-bg {
        background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-kid.32-yog151102141400@2x.png?max_age=19830212&d=20151102143706);
        background-size: 1925px 252px;
        background-position: -1657px -204px
    }
    .tpl-kid .title-decorate .t-deco-l {
        background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-kid.32-yog151102141400@2x.png?max_age=19830212&d=20151102143706);
        background-size: 1925px 252px;
        background-position: -963px -239px
    }
    .tpl-kid .title-decorate .t-deco-r {
        background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-kid.32-yog151102141400@2x.png?max_age=19830212&d=20151102143706);
        background-size: 1925px 252px;
        background-position: -1484px -221px
    }
    .tpl-kid .page-1 .cover-decorate {
        background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/img/tpl-kid/deco-2.32@2x.png?max_age=19830212&d=20151102143706);
        background-size: 375px 465px
    }
    .tpl-kid .page-1 .cover-frame .frame-bg {
        background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/img/tpl-kid/frame-2@2x.png?max_age=19830212&d=20151102143706);
        background-size: 375px 430px
    }
    .tpl-kid .page-1 .goodTime {
        background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-kid.32-yog151102141400@2x.png?max_age=19830212&d=20151102143706);
        background-size: 1925px 252px;
        background-position: -833px -152px
    }
    .tpl-kid .page-1 .goodTime .start-txt {
        background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-kid.32-yog151102141400@2x.png?max_age=19830212&d=20151102143706);
        background-size: 1925px 252px;
        background-position: -1224px -221px
    }
    .tpl-kid .page-1 .goodTime .start-line {
        background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-kid.32-yog151102141400@2x.png?max_age=19830212&d=20151102143706);
        background-size: 1925px 252px;
        background-position: -1354px -221px
    }
    .tpl-kid .page-1 .horn .horn-l {
        background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-kid.32-yog151102141400@2x.png?max_age=19830212&d=20151102143706);
        background-size: 1925px 252px;
        background-position: -963px -152px
    }
    .tpl-kid .page-1 .horn .horn-txt {
        background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-kid.32-yog151102141400@2x.png?max_age=19830212&d=20151102143706);
        background-size: 1925px 252px;
        background-position: 0 -202px
    }
    .tpl-kid .page-1 .star {
        background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-kid.32-yog151102141400@2x.png?max_age=19830212&d=20151102143706);
        background-size: 1925px 252px;
        background-position: -1499px -152px
    }
    .tpl-kid .page-1 .flag {
        background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-kid.32-yog151102141400@2x.png?max_age=19830212&d=20151102143706);
        background-size: 1925px 252px;
        background-position: 0 0
    }
    .tpl-kid .page-2 .cover-decorate {
        background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/img/tpl-kid/deco-3.32@2x.png?max_age=19830212&d=20151102143706);
        background-size: 375px 310px
    }
    .tpl-kid .page-2 .cover-frame .frame-bg {
        background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/img/tpl-kid/frame-3@2x.png?max_age=19830212&d=20151102143706);
        background-size: 375px 315px
    }
    .tpl-kid .page-2 .book {
        background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-kid.32-yog151102141400@2x.png?max_age=19830212&d=20151102143706);
        background-size: 1925px 252px;
        background-position: -215px -152px
    }
    .tpl-kid .page-2 .person .boy {
        background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-kid.32-yog151102141400@2x.png?max_age=19830212&d=20151102143706);
        background-size: 1925px 252px;
        background-position: -327px -152px
    }
    .tpl-kid .page-2 .person .girl {
        background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-kid.32-yog151102141400@2x.png?max_age=19830212&d=20151102143706);
        background-size: 1925px 252px;
        background-position: -771px -152px
    }
    .tpl-kid .page-2 .person .line {
        background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-kid.32-yog151102141400@2x.png?max_age=19830212&d=20151102143706);
        background-size: 1925px 252px;
        background-position: -1657px -152px
    }
    .tpl-kid .page-2 .star {
        background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-kid.32-yog151102141400@2x.png?max_age=19830212&d=20151102143706);
        background-size: 1925px 252px;
        background-position: -116px -202px
    }
    .tpl-kid .page-3 .cover-decorate {
        background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/img/tpl-kid/deco-4.32@2x.png?max_age=19830212&d=20151102143706);
        background-size: 375px 325px
    }
    .tpl-kid .page-3 .cover-frame .frame-bg {
        background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/img/tpl-kid/frame-4@2x.png?max_age=19830212&d=20151102143706);
        background-size: 375px 270px
    }
    .tpl-kid .page-3 .bell {
        background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-kid.32-yog151102141400@2x.png?max_age=19830212&d=20151102143706);
        background-size: 1925px 252px;
        background-position: -1080px -152px
    }
    .tpl-kid .page-3 .cloud {
        background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-kid.32-yog151102141400@2x.png?max_age=19830212&d=20151102143706);
        background-size: 1925px 252px;
        background-position: -1172px -221px
    }
    .tpl-kid .page-3 .cloud-b {
        background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-kid.32-yog151102141400@2x.png?max_age=19830212&d=20151102143706);
        background-size: 1925px 252px;
        background-position: -1172px -221px
    }
    .tpl-kid .page-3 .welcome {
        background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-kid.32-yog151102141400@2x.png?max_age=19830212&d=20151102143706);
        background-size: 1925px 252px;
        background-position: -394px -152px
    }
    .tpl-kid .page-3 .nail-t {
        background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-kid.32-yog151102141400@2x.png?max_age=19830212&d=20151102143706);
        background-size: 1925px 252px;
        background-position: -1909px -18px
    }
    .tpl-kid .page-3 .nail-l {
        background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-kid.32-yog151102141400@2x.png?max_age=19830212&d=20151102143706);
        background-size: 1925px 252px;
        background-position: -1909px -36px
    }
    .tpl-kid .page-3 .nail-r {
        background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-kid.32-yog151102141400@2x.png?max_age=19830212&d=20151102143706);
        background-size: 1925px 252px;
        background-position: -1909px -36px
    }
    .tpl-kid .page-3 .nail-line {
        background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-kid.32-yog151102141400@2x.png?max_age=19830212&d=20151102143706);
        background-size: 1925px 252px;
        background-position: -1172px -152px
    }
    .tpl-kid .page-4 .cover-decorate {
        background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/img/tpl-kid/deco-5.32@2x.png?max_age=19830212&d=20151102143706);
        background-size: 375px 490px
    }
    .tpl-kid .page-4 .cover-frame .frame-bg {
        background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/img/tpl-kid/frame-5@2x.png?max_age=19830212&d=20151102143706);
        background-size: 375px 495px
    }
    .tpl-kid .page-5 .cover-decorate {
        background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/img/tpl-kid/deco-6.32@2x.png?max_age=19830212&d=20151102143706);
        background-size: 375px 485px
    }
    .tpl-kid .page-5 .cover-frame .frame-bg {
        background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/img/tpl-kid/frame-6@2x.png?max_age=19830212&d=20151102143706);
        background-size: 375px 475px
    }
    .tpl-kid .page-5 .symbol {
        background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-kid.32-yog151102141400@2x.png?max_age=19830212&d=20151102143706);
        background-size: 1925px 252px;
        background-position: -1575px -152px
    }
    .tpl-kid .way {
        background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-kid.32-yog151102141400@2x.png?max_age=19830212&d=20151102143706);
        background-size: 1925px 252px;
        background-position: -215px 0
    }
    .tpl-kid .train {
        background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/img/tpl-kid/train4.32@2x.png?max_age=19830212&d=20151102143706);
        background-size: 129px 41px
    }
    .tpl-kid .smoke1 {
        background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-kid.32-yog151102141400@2x.png?max_age=19830212&d=20151102143706);
        background-size: 1925px 252px;
        background-position: -1909px -54px
    }
    .tpl-kid .smoke2 {
        background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-kid.32-yog151102141400@2x.png?max_age=19830212&d=20151102143706);
        background-size: 1925px 252px;
        background-position: -1909px -72px
    }
    .tpl-kid .smoke3 {
        background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-kid.32-yog151102141400@2x.png?max_age=19830212&d=20151102143706);
        background-size: 1925px 252px;
        background-position: -1909px -90px
    }
    .tpl-kid .page-2 .way {
        background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-kid.32-yog151102141400@2x.png?max_age=19830212&d=20151102143706);
        background-size: 1925px 252px;
        background-position: -763px 0
    }
    .tpl-kid .page-3 .way {
        background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-kid.32-yog151102141400@2x.png?max_age=19830212&d=20151102143706);
        background-size: 1925px 252px;
        background-position: -1311px 0
    }
    .tpl-kid .way {
        background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-kid.32-yog151102141400@2x.png?max_age=19830212&d=20151102143706);
        background-size: 1925px 252px;
        background-position: -215px 0
    }
    .tpl-kid .train {
        background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/img/tpl-kid/train4.32@2x.png?max_age=19830212&d=20151102143706);
        background-size: 129px 41px
    }
    .tpl-kid .smoke1 {
        background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-kid.32-yog151102141400@2x.png?max_age=19830212&d=20151102143706);
        background-size: 1925px 252px;
        background-position: -1909px -54px
    }
    .tpl-kid .smoke2 {
        background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-kid.32-yog151102141400@2x.png?max_age=19830212&d=20151102143706);
        background-size: 1925px 252px;
        background-position: -1909px -72px
    }
    .tpl-kid .smoke3 {
        background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-kid.32-yog151102141400@2x.png?max_age=19830212&d=20151102143706);
        background-size: 1925px 252px;
        background-position: -1909px -90px
    }
    .tpl-kid .page-2 .way {
        background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-kid.32-yog151102141400@2x.png?max_age=19830212&d=20151102143706);
        background-size: 1925px 252px;
        background-position: -763px 0
    }
    .tpl-kid .page-3 .way {
        background-image: url(//qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-kid.32-yog151102141400@2x.png?max_age=19830212&d=20151102143706);
        background-size: 1925px 252px;
        background-position: -1311px 0
    }
}

.dialog-end-vue {
    z-index: 9 !important;
}
.play-vue .zan-icon, .play-vue .edit {
    z-index: 7 !important;
}



/**
 * train animate
 */
@-webkit-keyframes cover-hide {
    0% {
        -webkit-transform: translateX(0%)
    }
    50% {
        -webkit-transform: translateX(-5%)
    }
    60% {
        -webkit-transform: translateX(-5%)
    }
    100% {
        -webkit-transform: translateX(100%)
    }
}

@-webkit-keyframes logo-star-zoom {
    0% {
        -webkit-transform: scale(.1);
        opacity: 1
    }
    30% {
        -webkit-transform: scale(1);
        opacity: 1
    }
    100% {
        -webkit-transform: scale(1) translate3d(-76px, 0, 0);
        opacity: 1
    }
}

@-webkit-keyframes logo-star-in {
    100% {
        -webkit-transform: translate3d(-76px, 0, 0)
    }
}

@-webkit-keyframes logo-qzone-in {
    0% {
        -webkit-transform: translate3d(30px, 0, 0);
        opacity: 0
    }
    100% {
        -webkit-transform: translate3d(0, 0, 0);
        opacity: 1
    }
}

@-webkit-keyframes logo-text-in {
    100% {
        -webkit-transform: translate3d(0, 0, 0)
    }
}

@-webkit-keyframes name-fade-in {
    0% {
        -webkit-transform: translate3d(0, -5px, 0)
    }
    100% {
        -webkit-transform: translate3d(0, 0, 0);
        opacity: 1
    }
}

@-webkit-keyframes avatar-zoom-out {
    10% {
        opacity: 1
    }
    60% {
        -webkit-transform: scale(1.1)
    }
    100% {
        -webkit-transform: scale(1);
        opacity: 1
    }
}

@-webkit-keyframes border-zoom-out {
    0% {
        opacity: .2;
        -webkit-transform: scale(.01);
        transform: scale(.01)
    }
    100% {
        opacity: .95;
        -webkit-transform: scale(1);
        transform: scale(1)
    }
}

@-webkit-keyframes train-move-in {
    100% {
        -webkit-transform: translate3d(-50%, 0, 0)
    }
}

@-webkit-keyframes fade-in {
    0% {
        opacity: 0
    }
    100% {
        opacity: 1
    }
}

@-webkit-keyframes line-draw {
    0%,
    30% {
        stroke-opacity: 1;
        stroke-dashoffset: 788
    }
    100% {
        stroke-dashoffset: 3152;
        stroke-opacity: 1
    }
}

@-webkit-keyframes fill {
    0% {
        fill-opacity: 0
    }
    100% {
        fill-opacity: 1
    }
}

@-webkit-keyframes text-none {
    99% {
        width: 0;
        margin-left: 0
    }
    100% {
        width: 0;
        margin-left: 0;
        opacity: 0
    }
}

@-webkit-keyframes loading-anim {
    0% {
        background-position: 0 0
    }
    100% {
        background-position: 225px 0
    }
}


@-webkit-keyframes cover-slidedown {
    0% {
        -webkit-transform: translate3d(0, -600px, 0)
    }
    100% {
        -webkit-transform: translate3d(0, 0px, 0)
    }
}

@keyframes cover-slidedown {
    0% {
        transform: translate3d(0, -600px, 0)
    }
    100% {
        transform: translate3d(0, 0px, 0)
    }
}

@-webkit-keyframes t-deco-show {
    to {
        -webkit-transform: translate3d(0, 0px, 0)
    }
}

@keyframes t-deco-show {
    to {
        transform: translate3d(0, 0px, 0)
    }
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

@-webkit-keyframes title-show {
    to {
        opacity: 1;
        -webkit-transform: scale(1)
    }
}

@keyframes title-show {
    to {
        opacity: 1;
        transform: scale(1)
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


@-webkit-keyframes horn-scale {
    0% {
        -webkit-transform: scale(.9)
    }
    33.33% {
        -webkit-transform: scale(1)
    }
    66.66% {
        -webkit-transform: scale(.9)
    }
    100% {
        -webkit-transform: scale(1)
    }
}


@-webkit-keyframes horn-l-scale {
    0% {
        -webkit-transform: scale(1)
    }
    50% {
        -webkit-transform: scale(1.02)
    }
    100% {
        -webkit-transform: scale(1)
    }
}

@-webkit-keyframes way {
    0% {
        width: 10%
    }
    100% {
        width: 100%
    }
}

@-webkit-keyframes smoke-1 {
    0% {
        opacity: 0;
        -webkit-transform: translate3d(5px, 5px, 0)
    }
    25% {
        opacity: 1;
        -webkit-transform: translate3d(0px, 0px, 0)
    }
    50% {
        opacity: 1;
        -webkit-transform: translate3d(0px, 0px, 0)
    }
    75% {
        opacity: 1;
        -webkit-transform: translate3d(0px, 0px, 0)
    }
    100% {
        opacity: 0;
        -webkit-transform: translate3d(0px, 0px, 0)
    }
}

@-webkit-keyframes smoke-2 {
    0% {
        opacity: 0;
        -webkit-transform: translate3d(5px, 5px, 0)
    }
    25% {
        opacity: 0;
        -webkit-transform: translate3d(5px, 5px, 0)
    }
    50% {
        opacity: 1;
        -webkit-transform: translate3d(0px, 0px, 0)
    }
    75% {
        opacity: 1;
        -webkit-transform: translate3d(0px, 0px, 0)
    }
    100% {
        opacity: 0;
        -webkit-transform: translate3d(0px, 0px, 0)
    }
}

@-webkit-keyframes smoke-3 {
    0% {
        opacity: 0;
        -webkit-transform: translate3d(5px, 5px, 0)
    }
    25% {
        opacity: 0;
        -webkit-transform: translate3d(5px, 5px, 0)
    }
    50% {
        opacity: 0;
        -webkit-transform: translate3d(5px, 5px, 0)
    }
    75% {
        opacity: 1;
        -webkit-transform: translate3d(0px, 0px, 0)
    }
    100% {
        opacity: 0;
        -webkit-transform: translate3d(0px, 0px, 0)
    }
}

@-webkit-keyframes train-bounce {
    0% {
        -webkit-transform: translate(-100px, 56px) rotate(-32deg)
    }
    2.43% {
        -webkit-transform: translate(-85px, 50px) rotate(-32deg)
    }
    4.86% {
        -webkit-transform: translate(-70px, 40px) rotate(-30deg)
    }
    7.29% {
        -webkit-transform: translate(-55px, 31px) rotate(-30deg)
    }
    9.72% {
        -webkit-transform: translate(-40px, 24px) rotate(-30deg)
    }
    12.15% {
        -webkit-transform: translate(-25px, 15px) rotate(-30deg)
    }
    14.58% {
        -webkit-transform: translate(-10px, 7px) rotate(-30deg)
    }
    17.01% {
        -webkit-transform: translate(5px, -1px) rotate(-30deg)
    }
    19.44% {
        -webkit-transform: translate(20px, -10px) rotate(-30deg)
    }
    21.87% {
        -webkit-transform: translate(35px, -18px) rotate(-28deg)
    }
    24.3% {
        -webkit-transform: translate(50px, -26px) rotate(-26deg)
    }
    26.73% {
        -webkit-transform: translate(65px, -33px) rotate(-24deg)
    }
    29.16% {
        -webkit-transform: translate(80px, -40px) rotate(-22deg)
    }
    31.59% {
        -webkit-transform: translate(95px, -45px) rotate(-22deg)
    }
    34.02% {
        -webkit-transform: translate(110px, -50px) rotate(-21deg)
    }
    36.45% {
        -webkit-transform: translate(125px, -57px) rotate(-19deg)
    }
    38.88% {
        -webkit-transform: translate(140px, -61px) rotate(-17deg)
    }
    41.31% {
        -webkit-transform: translate(155px, -65px) rotate(-16deg)
    }
    43.74% {
        -webkit-transform: translate(170px, -69px) rotate(-14deg)
    }
    46.17% {
        -webkit-transform: translate(185px, -73px) rotate(-13deg)
    }
    48.60% {
        -webkit-transform: translate(200px, -76px) rotate(-11deg)
    }
    51.03% {
        -webkit-transform: translate(215px, -78px) rotate(-9deg)
    }
    53.46% {
        -webkit-transform: translate(230px, -81px) rotate(-7deg)
    }
    55.89% {
        -webkit-transform: translate(245px, -82px) rotate(-6deg)
    }
    58.32% {
        -webkit-transform: translate(260px, -83px) rotate(-4deg)
    }
    60.75% {
        -webkit-transform: translate(275px, -86px) rotate(-1deg)
    }
    63.18% {
        -webkit-transform: translate(290px, -86px) rotate(1deg)
    }
    65.61% {
        -webkit-transform: translate(315px, -86px) rotate(2deg)
    }
    68.04% {
        -webkit-transform: translate(330px, -86px) rotate(2deg)
    }
    70.47% {
        -webkit-transform: translate(345px, -86px) rotate(2deg)
    }
    72.90% {
        -webkit-transform: translate(360px, -85px) rotate(2deg)
    }
    75.33% {
        -webkit-transform: translate(375px, -83px) rotate(2deg)
    }
    77.76% {
        -webkit-transform: translate(390px, -82px) rotate(2deg)
    }
    80.19% {
        -webkit-transform: translate(405px, -81px) rotate(2deg)
    }
    82.62% {
        -webkit-transform: translate(420px, -80px) rotate(2deg)
    }
    85.05% {
        -webkit-transform: translate(435px, -79px) rotate(4deg)
    }
    87.48% {
        -webkit-transform: translate(450px, -79px) rotate(3deg)
    }
    89.91% {
        -webkit-transform: translate(465px, -79px) rotate(4deg)
    }
    92.34% {
        -webkit-transform: translate(480px, -78px) rotate(3deg)
    }
    94.77% {
        -webkit-transform: translate(495px, -78px) rotate(4deg)
    }
    97.20% {
        -webkit-transform: translate(510px, -75px) rotate(4deg)
    }
    100% {
        -webkit-transform: translate(525px, -75px) rotate(5deg)
    }
}

@-webkit-keyframes train-bounce-top {
    0% {
        -webkit-transform: translate(15px, 0px) rotate(-30deg)
    }
    2.43% {
        -webkit-transform: translate(30px, -6px) rotate(-30deg)
    }
    4.86% {
        -webkit-transform: translate(45px, -14px) rotate(-30deg)
    }
    7.29% {
        -webkit-transform: translate(62px, -23px) rotate(-30deg)
    }
    9.72% {
        -webkit-transform: translate(77px, -30px) rotate(-28deg)
    }
    12.15% {
        -webkit-transform: translate(92px, -39px) rotate(-28deg)
    }
    14.58% {
        -webkit-transform: translate(107px, -45px) rotate(-28deg)
    }
    17.01% {
        -webkit-transform: translate(123px, -52px) rotate(-24deg)
    }
    19.44% {
        -webkit-transform: translate(140px, -57px) rotate(-23deg)
    }
    21.87% {
        -webkit-transform: translate(156px, -65px) rotate(-23deg)
    }
    24.3% {
        -webkit-transform: translate(172px, -68px) rotate(-20deg)
    }
    26.73% {
        -webkit-transform: translate(188px, -71px) rotate(-18deg)
    }
    29.16% {
        -webkit-transform: translate(205px, -76px) rotate(-18deg)
    }
    31.59% {
        -webkit-transform: translate(221px, -77px) rotate(-15deg)
    }
    34.02% {
        -webkit-transform: translate(237px, -80px) rotate(-12deg)
    }
    36.45% {
        -webkit-transform: translate(253px, -84px) rotate(-9deg)
    }
    38.88% {
        -webkit-transform: translate(268px, -83px) rotate(-7deg)
    }
    41.31% {
        -webkit-transform: translate(284px, -86px) rotate(-7deg)
    }
    43.74% {
        -webkit-transform: translate(299px, -87px) rotate(-3deg)
    }
    46.17% {
        -webkit-transform: translate(315px, -86px) rotate(-3deg)
    }
    48.60% {
        -webkit-transform: translate(330px, -87px) rotate(-1deg)
    }
    51.03% {
        -webkit-transform: translate(345px, -86px) rotate(-1deg)
    }
    53.46% {
        -webkit-transform: translate(361px, -86px) rotate(-1deg)
    }
    55.89% {
        -webkit-transform: translate(375px, -85px) rotate(0deg)
    }
    58.32% {
        -webkit-transform: translate(391px, -84px) rotate(1deg)
    }
    60.75% {
        -webkit-transform: translate(405px, -83px) rotate(2deg)
    }
    63.18% {
        -webkit-transform: translate(420px, -82px) rotate(3deg)
    }
    65.61% {
        -webkit-transform: translate(444px, -81px) rotate(4deg)
    }
    68.04% {
        -webkit-transform: translate(460px, -79px) rotate(5deg)
    }
    70.47% {
        -webkit-transform: translate(475px, -79px) rotate(5deg)
    }
    72.90% {
        -webkit-transform: translate(490px, -78px) rotate(6deg)
    }
    75.33% {
        -webkit-transform: translate(505px, -76px) rotate(6deg)
    }
    77.76% {
        -webkit-transform: translate(520px, -75px) rotate(6deg)
    }
    80.19% {
        -webkit-transform: translate(535px, -73px) rotate(7deg)
    }
    82.62% {
        -webkit-transform: translate(550px, -70px) rotate(8deg)
    }
    85.05% {
        -webkit-transform: translate(564px, -67px) rotate(8deg)
    }
    87.48% {
        -webkit-transform: translate(580px, -67px) rotate(8deg)
    }
    89.91% {
        -webkit-transform: translate(595px, -67px) rotate(8deg)
    }
    92.34% {
        -webkit-transform: translate(595px, -67px) rotate(8deg)
    }
    94.77% {
        -webkit-transform: translate(595px, -67px) rotate(8deg)
    }
    97.20% {
        -webkit-transform: translate(595px, -67px) rotate(8deg)
    }
    100% {
        -webkit-transform: translate(595px, -67px) rotate(8deg)
    }
}

@-webkit-keyframes train-bounce2 {
    0% {
        -webkit-transform: translate(-33px, 60px) rotate(70deg)
    }
    2.32% {
        -webkit-transform: translate(-25px, 75px) rotate(70deg)
    }
    4.64% {
        -webkit-transform: translate(-20px, 90px) rotate(68deg)
    }
    6.96% {
        -webkit-transform: translate(-11px, 105px) rotate(62deg)
    }
    9.28% {
        -webkit-transform: translate(-2px, 124px) rotate(55deg)
    }
    11.6% {
        -webkit-transform: translate(2px, 128px) rotate(48deg)
    }
    13.92% {
        -webkit-transform: translate(5px, 132px) rotate(42deg)
    }
    16.24% {
        -webkit-transform: translate(10px, 139px) rotate(33deg)
    }
    18.56% {
        -webkit-transform: translate(19px, 144px) rotate(30deg)
    }
    20.88% {
        -webkit-transform: translate(28px, 150px) rotate(25deg)
    }
    23.20% {
        -webkit-transform: translate(41px, 151px) rotate(20deg)
    }
    25.52% {
        -webkit-transform: translate(55px, 156px) rotate(13deg)
    }
    27.84% {
        -webkit-transform: translate(70px, 158px) rotate(7deg)
    }
    30.16% {
        -webkit-transform: translate(85px, 158px) rotate(4deg)
    }
    32.48% {
        -webkit-transform: translate(100px, 159px) rotate(0deg)
    }
    34.80% {
        -webkit-transform: translate(115px, 159px) rotate(0deg)
    }
    37.12% {
        -webkit-transform: translate(130px, 158px) rotate(-2deg)
    }
    39.44% {
        -webkit-transform: translate(145px, 156px) rotate(-3deg)
    }
    41.76% {
        -webkit-transform: translate(160px, 154px) rotate(-6deg)
    }
    44.08% {
        -webkit-transform: translate(175px, 154px) rotate(-6deg)
    }
    46.40% {
        -webkit-transform: translate(190px, 151px) rotate(-10deg)
    }
    48.72% {
        -webkit-transform: translate(205px, 148px) rotate(-12deg)
    }
    51.04% {
        -webkit-transform: translate(220px, 145px) rotate(-12deg)
    }
    53.36% {
        -webkit-transform: translate(235px, 140px) rotate(-12deg)
    }
    55.68% {
        -webkit-transform: translate(250px, 137px) rotate(-13deg)
    }
    58.00% {
        -webkit-transform: translate(265px, 133px) rotate(-13deg)
    }
    60.32% {
        -webkit-transform: translate(280px, 129px) rotate(-13deg)
    }
    62.64% {
        -webkit-transform: translate(295px, 125px) rotate(-13deg)
    }
    64.96% {
        -webkit-transform: translate(310px, 122px) rotate(-13deg)
    }
    67.28% {
        -webkit-transform: translate(325px, 118px) rotate(-13deg)
    }
    69.60% {
        -webkit-transform: translate(340px, 114px) rotate(-13deg)
    }
    71.92% {
        -webkit-transform: translate(355px, 111px) rotate(-13deg)
    }
    74.24% {
        -webkit-transform: translate(370px, 107px) rotate(-13deg)
    }
    76.56% {
        -webkit-transform: translate(385px, 104px) rotate(-13deg)
    }
    78.88% {
        -webkit-transform: translate(400px, 100px) rotate(-13deg)
    }
    81.20% {
        -webkit-transform: translate(415px, 96px) rotate(-13deg)
    }
    83.52% {
        -webkit-transform: translate(430px, 92px) rotate(-13deg)
    }
    85.84% {
        -webkit-transform: translate(445px, 89px) rotate(-13deg)
    }
    88.16% {
        -webkit-transform: translate(460px, 85px) rotate(-13deg)
    }
    90.48% {
        -webkit-transform: translate(475px, 81px) rotate(-13deg)
    }
    92.80% {
        -webkit-transform: translate(490px, 78px) rotate(-13deg)
    }
    95.12% {
        -webkit-transform: translate(505px, 74px) rotate(-13deg)
    }
    97.44% {
        -webkit-transform: translate(520px, 69px) rotate(-13deg)
    }
    100% {
        -webkit-transform: translate(535px, 66px) rotate(-13deg)
    }
}

@-webkit-keyframes train-bounce2-top {
    0% {
        -webkit-transform: translate(-4px, 147px) rotate(72deg)
    }
    2.32% {
        -webkit-transform: translate(6px, 161px) rotate(69deg)
    }
    4.64% {
        -webkit-transform: translate(20px, 172px) rotate(65deg)
    }
    6.96% {
        -webkit-transform: translate(45px, 169px) rotate(38deg)
    }
    9.28% {
        -webkit-transform: translate(69px, 172px) rotate(26deg)
    }
    11.6% {
        -webkit-transform: translate(79px, 168px) rotate(20deg)
    }
    13.92% {
        -webkit-transform: translate(88px, 168px) rotate(15deg)
    }
    16.24% {
        -webkit-transform: translate(96px, 167px) rotate(13deg)
    }
    18.56% {
        -webkit-transform: translate(107px, 164px) rotate(8deg)
    }
    20.88% {
        -webkit-transform: translate(116px, 162px) rotate(3deg)
    }
    23.20% {
        -webkit-transform: translate(131px, 162px) rotate(3deg)
    }
    25.52% {
        -webkit-transform: translate(147px, 160px) rotate(1deg)
    }
    27.84% {
        -webkit-transform: translate(162px, 160px) rotate(1deg)
    }
    30.16% {
        -webkit-transform: translate(177px, 156px) rotate(-1deg)
    }
    32.48% {
        -webkit-transform: translate(192px, 156px) rotate(-1deg)
    }
    34.80% {
        -webkit-transform: translate(206px, 151px) rotate(-5deg)
    }
    37.12% {
        -webkit-transform: translate(222px, 145px) rotate(-9deg)
    }
    39.44% {
        -webkit-transform: translate(237px, 140px) rotate(-13deg)
    }
    41.76% {
        -webkit-transform: translate(251px, 136px) rotate(-13deg)
    }
    44.08% {
        -webkit-transform: translate(264px, 132px) rotate(-15deg)
    }
    46.40% {
        -webkit-transform: translate(279px, 127px) rotate(-14deg)
    }
    48.72% {
        -webkit-transform: translate(294px, 123px) rotate(-14deg)
    }
    51.04% {
        -webkit-transform: translate(309px, 118px) rotate(-14deg)
    }
    53.36% {
        -webkit-transform: translate(324px, 115px) rotate(-12deg)
    }
    55.68% {
        -webkit-transform: translate(339px, 111px) rotate(-13deg)
    }
    58.00% {
        -webkit-transform: translate(354px, 108px) rotate(-13deg)
    }
    60.32% {
        -webkit-transform: translate(369px, 105px) rotate(-13deg)
    }
    62.64% {
        -webkit-transform: translate(384px, 102px) rotate(-13deg)
    }
    64.96% {
        -webkit-transform: translate(399px, 99px) rotate(-13deg)
    }
    67.28% {
        -webkit-transform: translate(414px, 96px) rotate(-13deg)
    }
    69.60% {
        -webkit-transform: translate(429px, 93px) rotate(-13deg)
    }
    71.92% {
        -webkit-transform: translate(444px, 90px) rotate(-13deg)
    }
    74.24% {
        -webkit-transform: translate(459px, 87px) rotate(-13deg)
    }
    76.56% {
        -webkit-transform: translate(474px, 84px) rotate(-13deg)
    }
    78.88% {
        -webkit-transform: translate(489px, 81px) rotate(-13deg)
    }
    81.20% {
        -webkit-transform: translate(504px, 78px) rotate(-13deg)
    }
    83.52% {
        -webkit-transform: translate(519px, 75px) rotate(-13deg)
    }
    85.84% {
        -webkit-transform: translate(534px, 72px) rotate(-13deg)
    }
    88.16% {
        -webkit-transform: translate(549px, 69px) rotate(-13deg)
    }
    90.48% {
        -webkit-transform: translate(564px, 66px) rotate(-13deg)
    }
    92.80% {
        -webkit-transform: translate(579px, 63px) rotate(-13deg)
    }
    95.12% {
        -webkit-transform: translate(594px, 60px) rotate(-13deg)
    }
    97.44% {
        -webkit-transform: translate(609px, 57px) rotate(-13deg)
    }
    100% {
        -webkit-transform: translate(624px, 54px) rotate(-13deg)
    }
}

@-webkit-keyframes train-bounce3 {
    0% {
        -webkit-transform: translate(-95px, 5px) rotate(15deg)
    }
    2.43% {
        -webkit-transform: translate(-80px, 9px) rotate(15deg)
    }
    4.86% {
        -webkit-transform: translate(-65px, 13px) rotate(15deg)
    }
    7.29% {
        -webkit-transform: translate(-50px, 18px) rotate(15deg)
    }
    9.72% {
        -webkit-transform: translate(-35px, 21px) rotate(15deg)
    }
    12.15% {
        -webkit-transform: translate(-20px, 26px) rotate(15deg)
    }
    14.58% {
        -webkit-transform: translate(-5px, 30px) rotate(15deg)
    }
    17.01% {
        -webkit-transform: translate(10px, 34px) rotate(15deg)
    }
    19.44% {
        -webkit-transform: translate(25px, 38px) rotate(15deg)
    }
    21.87% {
        -webkit-transform: translate(40px, 43px) rotate(15deg)
    }
    24.3% {
        -webkit-transform: translate(55px, 47px) rotate(15deg)
    }
    26.73% {
        -webkit-transform: translate(70px, 51px) rotate(15deg)
    }
    29.16% {
        -webkit-transform: translate(85px, 56px) rotate(15deg)
    }
    31.59% {
        -webkit-transform: translate(100px, 58px) rotate(15deg)
    }
    34.02% {
        -webkit-transform: translate(115px, 61px) rotate(13deg)
    }
    36.45% {
        -webkit-transform: translate(130px, 68px) rotate(16deg)
    }
    38.88% {
        -webkit-transform: translate(145px, 71px) rotate(15deg)
    }
    41.31% {
        -webkit-transform: translate(160px, 75px) rotate(15deg)
    }
    43.74% {
        -webkit-transform: translate(175px, 79px) rotate(15deg)
    }
    46.17% {
        -webkit-transform: translate(190px, 83px) rotate(14deg)
    }
    48.60% {
        -webkit-transform: translate(205px, 86px) rotate(12deg)
    }
    51.03% {
        -webkit-transform: translate(220px, 90px) rotate(9deg)
    }
    53.46% {
        -webkit-transform: translate(235px, 91px) rotate(8deg)
    }
    55.89% {
        -webkit-transform: translate(250px, 93px) rotate(6deg)
    }
    58.32% {
        -webkit-transform: translate(265px, 95px) rotate(3deg)
    }
    60.75% {
        -webkit-transform: translate(280px, 96px) rotate(-3deg)
    }
    63.18% {
        -webkit-transform: translate(295px, 97px) rotate(-8deg)
    }
    65.61% {
        -webkit-transform: translate(310px, 95px) rotate(-14deg)
    }
    68.04% {
        -webkit-transform: translate(325px, 93px) rotate(-18deg)
    }
    70.47% {
        -webkit-transform: translate(340px, 87px) rotate(-23deg)
    }
    72.90% {
        -webkit-transform: translate(355px, 81px) rotate(-27deg)
    }
    75.33% {
        -webkit-transform: translate(370px, 74px) rotate(-27deg)
    }
    77.76% {
        -webkit-transform: translate(385px, 64px) rotate(-29deg)
    }
    80.19% {
        -webkit-transform: translate(400px, 56px) rotate(-30deg)
    }
    82.62% {
        -webkit-transform: translate(415px, 45px) rotate(-31deg)
    }
    85.05% {
        -webkit-transform: translate(430px, 37px) rotate(-31deg)
    }
    87.48% {
        -webkit-transform: translate(445px, 28px) rotate(-31deg)
    }
    89.91% {
        -webkit-transform: translate(460px, 20px) rotate(-31deg)
    }
    92.34% {
        -webkit-transform: translate(475px, 11px) rotate(-31deg)
    }
    94.77% {
        -webkit-transform: translate(490px, 4px) rotate(-31deg)
    }
    97.20% {
        -webkit-transform: translate(505px, -8px) rotate(-31deg)
    }
    100% {
        -webkit-transform: translate(520px, -16px) rotate(-31deg)
    }
}

@-webkit-keyframes train-bounce3-top {
    0% {
        -webkit-transform: translate(32px, 35px) rotate(16deg)
    }
    2.43% {
        -webkit-transform: translate(46px, 39px) rotate(16deg)
    }
    4.86% {
        -webkit-transform: translate(61px, 44px) rotate(16deg)
    }
    7.29% {
        -webkit-transform: translate(76px, 48px) rotate(16deg)
    }
    9.72% {
        -webkit-transform: translate(91px, 52px) rotate(16deg)
    }
    12.15% {
        -webkit-transform: translate(105px, 57px) rotate(17deg)
    }
    14.58% {
        -webkit-transform: translate(121px, 62px) rotate(17deg)
    }
    17.01% {
        -webkit-transform: translate(136px, 65px) rotate(17deg)
    }
    19.44% {
        -webkit-transform: translate(151px, 69px) rotate(18deg)
    }
    21.87% {
        -webkit-transform: translate(165px, 74px) rotate(18deg)
    }
    24.3% {
        -webkit-transform: translate(180px, 78px) rotate(19deg)
    }
    26.73% {
        -webkit-transform: translate(195px, 84px) rotate(19deg)
    }
    29.16% {
        -webkit-transform: translate(210px, 88px) rotate(19deg)
    }
    31.59% {
        -webkit-transform: translate(225px, 91px) rotate(19deg)
    }
    34.02% {
        -webkit-transform: translate(240px, 94px) rotate(20deg)
    }
    36.45% {
        -webkit-transform: translate(256px, 98px) rotate(18deg)
    }
    38.88% {
        -webkit-transform: translate(271px, 100px) rotate(16deg)
    }
    41.31% {
        -webkit-transform: translate(286px, 100px) rotate(12deg)
    }
    43.74% {
        -webkit-transform: translate(303px, 101px) rotate(10deg)
    }
    46.17% {
        -webkit-transform: translate(319px, 100px) rotate(7deg)
    }
    48.60% {
        -webkit-transform: translate(334px, 100px) rotate(4deg)
    }
    51.03% {
        -webkit-transform: translate(349px, 99px) rotate(2deg)
    }
    53.46% {
        -webkit-transform: translate(365px, 94px) rotate(-3deg)
    }
    55.89% {
        -webkit-transform: translate(379px, 87px) rotate(-8deg)
    }
    58.32% {
        -webkit-transform: translate(393px, 80px) rotate(-14deg)
    }
    60.75% {
        -webkit-transform: translate(406px, 68px) rotate(-24deg)
    }
    63.18% {
        -webkit-transform: translate(418px, 61px) rotate(-27deg)
    }
    65.61% {
        -webkit-transform: translate(431px, 53px) rotate(-28deg)
    }
    68.04% {
        -webkit-transform: translate(443px, 44px) rotate(-29deg)
    }
    70.47% {
        -webkit-transform: translate(457px, 34px) rotate(-31deg)
    }
    72.90% {
        -webkit-transform: translate(471px, 25px) rotate(-30deg)
    }
    75.33% {
        -webkit-transform: translate(484px, 16px) rotate(-32deg)
    }
    77.76% {
        -webkit-transform: translate(499px, 7px) rotate(-32deg)
    }
    80.19% {
        -webkit-transform: translate(515px, -1px) rotate(-30deg)
    }
    82.62% {
        -webkit-transform: translate(532px, -8px) rotate(-27deg)
    }
    85.05% {
        -webkit-transform: translate(547px, -16px) rotate(-27deg)
    }
    87.48% {
        -webkit-transform: translate(563px, -24px) rotate(-27deg)
    }
    89.91% {
        -webkit-transform: translate(576px, -34px) rotate(-27deg)
    }
    92.34% {
        -webkit-transform: translate(591px, -43px) rotate(-27deg)
    }
    94.77% {
        -webkit-transform: translate(607px, -49px) rotate(-27deg)
    }
    97.20% {
        -webkit-transform: translate(622px, -61px) rotate(-27deg)
    }
    100% {
        -webkit-transform: translate(636px, -70px) rotate(-27deg)
    }
}


@keyframes mask-fade-out {
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
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
/**
 * END OF train animate
 */
</style>