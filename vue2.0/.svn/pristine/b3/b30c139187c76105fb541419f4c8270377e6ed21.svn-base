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
        stars: [],
        lines: []
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
        this.datas = this.photos.concat();

        for(var i = 0; i < this.datas.length; i++){
          this.datas[i].class = {};
          this.datas[i].class['animate'] = false;
          this.datas[i].class['page-' + ((i % 4) + 1) ] = true;
          this.datas[i].iclass= ((i % 4) + 1);

          var itemWidth = this.datas[i].width,
            itemHeight = this.datas[i].height,
            boxWidth = width,
            boxHeight = width * 0.80,
            picWidth = 0,
            picHeight = 0;

          var picWidth = boxWidth,    //照片width
              picHeight = itemHeight * picWidth / itemWidth; //照片height

          if (picHeight >= boxHeight) {
            this.datas[i].defaultStyle = this.datas[i].imgStyle = { 'width' : '100%' };
            this.datas[i].animateStyle = {
              'width' : '100%',
              'transform' : 'translate3d(0px, '+ -1 * (picHeight - boxHeight) +'px, 0px)'
            };
            this.datas[i].isWidth = false;
          } else {
            picHeight = boxHeight;
            picWidth = itemWidth * picHeight / itemHeight;
            this.datas[i].defaultStyle = this.datas[i].imgStyle = { 'height' : '100%' };
            this.datas[i].animateStyle = {
              'height' : '100%',
              'transform' : 'translate3d('+ -1 * (picWidth - boxWidth) +'px, 0px, 0px)'
            };
            this.datas[i].isWidth = true;
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

        for (var i = 1; i <= 8; i++) {
          this.lines.push({
            class : "line-"+ i
          });
        }

        var limit = 40;
        for (var i = 0; i <= limit; i++) {
          var iclass = parseInt(Math.random() * (2 - 1 + 1) + 1);
          this.stars.push({
            class : "star-"+ iclass + " delay-"+ iclass,
            style : "top: "+ Math.random() * 100 + "%" +"; left: "+ Math.random() * 100 + "%"
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

  <section class="mod-os-pc tpl-mv mod-os-ios tpl-xmas">
    <div id="j-body">
      <div class="wrap j-wrap">
        <div class="mod-img-wrap">
          <div class="j-tpl-wrap">
                <div class="mod-bg-star j-mod-bg-star">
                  <div v-for="(star, i) in stars" class="mod-star" :class=[star.class] v-bind:style="star.style"></div>
                </div>
                <div v-if="isLoading" v-bind:class="{ animate : isLoading }" class="mod-tpl-cover j-tpl-cover">
                    <div class="top-lines">
                      <span v-for="(line, i) in lines" class="line" :class=[line.class]><span class="inner"></span></span>
                    </div>
                    <div class="title-info">
                      <h1 class="title text-overflow j-album-title">{{ title }}</h1>
                      <span class="user text-overflow j-lazy-load-nickname">{{ author }}</span>
                    </div>
                    <div class="gift-wrap">
                      <div class="big-tree">
                        <div class="gingerbread"></div>
                        <div class="tree"></div>
                      </div>
                      <div class="small-tree"></div>
                      <div class="gift-box-r"></div>
                      <div class="gift-box-l"></div>
                      <div class="penguin"></div>
                    </div>
                </div>
                <div v-if="!isLoading" class="mod-img-list j-img-list">
                  <div v-for="(item, i) in items" v-bind:class="item.class" v-bind:style="{'display' : (item.isActive ? 'block' : 'none') }" class="item j-img-item animate">

                    <div v-if="item.class['page-1'] == true">
                      <div class="bg-img">
                        <div class="img-w j-img-page">
                          <img v-bind:style="item.imgStyle" v-bind:src="item.url" class="j-page-inner-move-img" />
                        </div>
                        <div class="cloud-up"><span class="inner"></span></div>
                        <div class="cloud-down"><span class="inner"></span></div>
                        <div class="text-area"><img src="/static/photo/tmpl/christmas/page1.png"></div>
                      </div>
                      <div class="decoration">
                        <div class="gift-box-c"></div>
                        <div class="xmas-man">
                          <span class="arm"></span>
                        </div>
                        <div class="tree-right"></div>
                        <div class="tree-left"></div>
                        <div class="gift-box-r"></div>
                      </div>
                    </div>

                    <div v-if="item.class['page-2'] == true">
                        <div class="bg-img">
                          <div class="img-w j-img-page">
                            <img v-bind:style="item.imgStyle" v-bind:src="item.url" class="j-page-inner-move-img" />
                          </div>
                          <div class="bell">
                            <div class="bell-r"></div>
                            <div class="bell-l"></div>
                            <div class="text-area"><img src="/static/photo/tmpl/christmas/page2.png"></div>
                          </div>
                        </div>

                      <div class="decoration">
                        <div class="moon"></div>
                        <div class="tree-left"></div>
                        <div class="tree-right"></div>
                        <div class="ground-back"></div>
                        <div class="penguin-l"><span class="inner"></span></div>
                        <div class="penguin-r"><span class="inner"></span></div>
                        <div class="penguin-c"><span class="inner"></span></div>
                        <div class="ground-font"></div>
                        <div class="star star-1"></div>
                        <div class="star star-2"></div>
                        <div class="star star-3"></div>
                        <div class="star star-4"></div>
                        <div class="star star-5"></div>
                      </div>
                    </div>

                    <div v-if="item.class['page-3'] == true">
                        <div class="bg-img">
                          <div class="img-w j-img-page">
                            <img v-bind:style="item.imgStyle" v-bind:src="item.url" class="j-page-inner-move-img" />
                          </div>
                          <div class="text-area"><img src="/static/photo/tmpl/christmas/page3.png"></div>
                        </div>
                        <div class="top-lines">
                          <span v-for="(line, i) in lines" class="line" :class=[line.class]><span class="inner"></span></span>
                        </div>
                        <div class="decoration">
                          <div class="gift-box"></div>
                          <div class="tree-back"></div>
                          <div class="tree"></div>
                          <div class="tree-font"></div>
                        </div>
                    </div>

                    <div v-if="item.class['page-4'] == true">
                      <div class="bg-img">
                        <div class="img-w j-img-page">
                          <img v-bind:style="item.imgStyle" v-bind:src="item.url" class="j-page-inner-move-img" />
                        </div>
                        <div class="text-area"><img src="/static/photo/tmpl/christmas/page4.png"></div>
                        <div class="bell">
                          <div class="bell-l"></div>
                        </div>
                      </div>
                      <div class="top-stars">
                        <span class="star star-1"></span>
                        <span class="star star-2"></span>
                        <span class="star star-3"></span>
                        <span class="star star-4"></span>
                        <span class="star star-5"></span>
                      </div>
                      <div class="decoration">
                        <div class="tree-back"></div>
                        <div class="deer"></div>
                        <div class="tree-font"></div>
                        <div class="star star-1"></div>
                        <div class="star star-2"></div>
                        <div class="star star-3"></div>
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

  .tpl-xmas .mod-tpl-cover {
    width: 100%;
    height: 100%
  }

  .tpl-xmas .mod-tpl-cover .top-lines {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 0;
    padding-top: 26.7%;
    background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/img/tpl-xmas/cover-top-line-bg.32@2x.png?max_age=19830212&d=20151224112832);
    background-size: 100% auto;
    background-repeat: no-repeat
  }

  .tpl-xmas .mod-tpl-cover .top-lines .line {
    display: block;
    position: absolute;
    top: 0
  }

  .tpl-xmas .mod-tpl-cover .top-lines .line .inner {
    display: block;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0
  }

  .tpl-xmas .mod-tpl-cover .top-lines .line-1 {
    width: 25px;
    height: 145px;
    left: 14.8%
  }

  .tpl-xmas .mod-tpl-cover .top-lines .line-1 .inner {
    background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas-cover-imp.32-yog151221161935.png?max_age=19830212&d=20151224112832);
    background-position: -645px -167px
  }

  .tpl-xmas .mod-tpl-cover .top-lines .line-2 {
    width: 24px;
    height: 104px;
    left: 26%
  }

  .tpl-xmas .mod-tpl-cover .top-lines .line-2 .inner {
    background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas-cover-imp.32-yog151221161935.png?max_age=19830212&d=20151224112832);
    background-position: -268px -182px
  }

  .tpl-xmas .mod-tpl-cover .top-lines .line-3 {
    width: 34px;
    height: 93px;
    left: 33%
  }

  .tpl-xmas .mod-tpl-cover .top-lines .line-3 .inner {
    background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas-cover-imp.32-yog151221161935.png?max_age=19830212&d=20151224112832);
    background-position: -368px -182px
  }

  .tpl-xmas .mod-tpl-cover .top-lines .line-4 {
    width: 23px;
    height: 96px;
    right: 29%
  }

  .tpl-xmas .mod-tpl-cover .top-lines .line-4 .inner {
    background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas-cover-imp.32-yog151221161935.png?max_age=19830212&d=20151224112832);
    background-position: -343px -182px
  }

  .tpl-xmas .mod-tpl-cover .top-lines .line-5 {
    width: 47px;
    height: 100px;
    right: 14.4%;
    z-index: 1
  }

  .tpl-xmas .mod-tpl-cover .top-lines .line-5 .inner {
    background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas-cover-imp.32-yog151221161935.png?max_age=19830212&d=20151224112832);
    background-position: -294px -182px;
    z-index: 1
  }

  .tpl-xmas .mod-tpl-cover .top-lines .line-6 {
    width: 24px;
    height: 135px;
    right: 14.4%
  }

  .tpl-xmas .mod-tpl-cover .top-lines .line-6 .inner {
    background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas-cover-imp.32-yog151221161935.png?max_age=19830212&d=20151224112832);
    background-position: -242px -182px
  }

  .tpl-xmas .mod-tpl-cover .top-lines .line-7 {
    width: 25px;
    height: 165px;
    right: 9.4%
  }

  .tpl-xmas .mod-tpl-cover .top-lines .line-7 .inner {
    background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas-cover-imp.32-yog151221161935.png?max_age=19830212&d=20151224112832);
    background-position: -645px 0
  }

  .tpl-xmas .mod-tpl-cover .top-lines .line-8 {
    width: 31px;
    height: 85px;
    right: 0
  }

  .tpl-xmas .mod-tpl-cover .top-lines .line-8 .inner {
    background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas-cover-imp.32-yog151221161935.png?max_age=19830212&d=20151224112832);
    background-position: -404px -182px
  }

  .tpl-xmas .mod-tpl-cover .title-info {
    width: 268px;
    height: 168px;
    padding-top: 84px;
    position: absolute;
    top: 102px;
    left: 50%;
    margin-left: -134px;
    background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas-cover-imp.32-yog151221161935.png?max_age=19830212&d=20151224112832);
    background-position: -242px 0;
  }

  .tpl-xmas .mod-tpl-cover .title-info .title {
    width: 125px;
    margin: 0 auto 15px;
    color: #fff;
    font-size: 16px;
    text-align: center;
    border: 1px solid transparent
  }

  .tpl-xmas .mod-tpl-cover .title-info .user {
    width: 120px;
    display: block;
    margin: 0 auto;
    color: #04260c;
    text-align: center;
    border: 1px solid transparent
  }

  .tpl-xmas .mod-tpl-cover .gift-wrap {
    width: 100%;
    position: absolute;
    left: 0;
    bottom: 0
  }

  .tpl-xmas .mod-tpl-cover .gift-wrap .big-tree {
    width: 240px;
    height: 312px;
    position: absolute;
    bottom: 0;
    left: 50%;
    margin-left: -120px
  }

  .tpl-xmas .mod-tpl-cover .gift-wrap .big-tree .tree {
    width: 240px;
    height: 312px;
    position: absolute;
    bottom: 0;
    left: 0;
    background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas-cover-imp.32-yog151221161935.png?max_age=19830212&d=20151224112832);
    background-position: 0 0
  }

  .tpl-xmas .mod-tpl-cover .gift-wrap .big-tree .gingerbread {
    width: 55px;
    height: 62px;
    position: absolute;
    top: 105px;
    left: 34px;
    background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas-cover-imp.32-yog151221161935.png?max_age=19830212&d=20151224112832);
    background-position: -437px -254px
  }

  .tpl-xmas .mod-tpl-cover .gift-wrap .small-tree {
    width: 131px;
    height: 175px;
    position: absolute;
    bottom: 0;
    left: 0;
    background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas-cover-imp.32-yog151221161935.png?max_age=19830212&d=20151224112832);
    background-position: -512px 0
  }

  .tpl-xmas .mod-tpl-cover .gift-wrap .gift-box-r {
    width: 121px;
    height: 70px;
    position: absolute;
    bottom: 0;
    right: 0;
    background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas-cover-imp.32-yog151221161935.png?max_age=19830212&d=20151224112832);
    background-position: -437px -182px
  }

  .tpl-xmas .mod-tpl-cover .gift-wrap .penguin {
    width: 81px;
    height: 65px;
    position: absolute;
    bottom: 0;
    right: 31.2%;
    background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas-cover-imp.32-yog151221161935.png?max_age=19830212&d=20151224112832);
    background-position: -560px -177px
  }

  .tpl-xmas .mod-tpl-cover .gift-wrap .gift-box-l {
    width: 108px;
    height: 54px;
    position: absolute;
    bottom: 0;
    left: 20%;
    background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas-cover-imp.32-yog151221161935.png?max_age=19830212&d=20151224112832);
    background-position: -494px -254px
  }

  @media only screen and (-webkit-min-device-pixel-ratio: 1.25),only screen and (min-resolution:120dpi),only screen and (min-resolution:1.25dppx) {
    .tpl-xmas .mod-tpl-cover .top-lines .line-1 .inner {
      background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas-cover-imp.32-yog151221161935@2x.png?max_age=19830212&d=20151224112832);
      background-size: 373px 566px;
      background-position: -270px -344px
    }

    .tpl-xmas .mod-tpl-cover .top-lines .line-2 .inner {
      background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas-cover-imp.32-yog151221161935@2x.png?max_age=19830212&d=20151224112832);
      background-size: 373px 566px;
      background-position: -297px -177px
    }

    .tpl-xmas .mod-tpl-cover .top-lines .line-3 .inner {
      background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas-cover-imp.32-yog151221161935@2x.png?max_age=19830212&d=20151224112832);
      background-size: 373px 566px;
      background-position: -322px -385px
    }

    .tpl-xmas .mod-tpl-cover .top-lines .line-4 .inner {
      background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas-cover-imp.32-yog151221161935@2x.png?max_age=19830212&d=20151224112832);
      background-size: 373px 566px;
      background-position: -297px -385px
    }

    .tpl-xmas .mod-tpl-cover .top-lines .line-5 .inner {
      background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas-cover-imp.32-yog151221161935@2x.png?max_age=19830212&d=20151224112832);
      background-size: 373px 566px;
      background-position: -297px -283px
    }

    .tpl-xmas .mod-tpl-cover .top-lines .line-6 .inner {
      background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas-cover-imp.32-yog151221161935@2x.png?max_age=19830212&d=20151224112832);
      background-size: 373px 566px;
      background-position: -242px -177px
    }

    .tpl-xmas .mod-tpl-cover .top-lines .line-7 .inner {
      background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas-cover-imp.32-yog151221161935@2x.png?max_age=19830212&d=20151224112832);
      background-size: 373px 566px;
      background-position: -270px -177px
    }

    .tpl-xmas .mod-tpl-cover .top-lines .line-8 .inner {
      background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas-cover-imp.32-yog151221161935@2x.png?max_age=19830212&d=20151224112832);
      background-size: 373px 566px;
      background-position: -323px -177px
    }

    .tpl-xmas .mod-tpl-cover .title-info {
      background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas-cover-imp.32-yog151221161935@2x.png?max_age=19830212&d=20151224112832);
      background-size: 373px 566px;
      background-position: 0 -314px
    }

    .tpl-xmas .mod-tpl-cover .gift-wrap .big-tree .tree {
      background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas-cover-imp.32-yog151221161935@2x.png?max_age=19830212&d=20151224112832);
      background-size: 373px 566px;
      background-position: 0 0
    }

    .tpl-xmas .mod-tpl-cover .gift-wrap .big-tree .gingerbread {
      background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas-cover-imp.32-yog151221161935@2x.png?max_age=19830212&d=20151224112832);
      background-size: 373px 566px;
      background-position: -206px -496px
    }

    .tpl-xmas .mod-tpl-cover .gift-wrap .small-tree {
      background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas-cover-imp.32-yog151221161935@2x.png?max_age=19830212&d=20151224112832);
      background-size: 373px 566px;
      background-position: -242px 0
    }

    .tpl-xmas .mod-tpl-cover .gift-wrap .gift-box-r {
      background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas-cover-imp.32-yog151221161935@2x.png?max_age=19830212&d=20151224112832);
      background-size: 373px 566px;
      background-position: 0 -496px
    }

    .tpl-xmas .mod-tpl-cover .gift-wrap .penguin {
      background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas-cover-imp.32-yog151221161935@2x.png?max_age=19830212&d=20151224112832);
      background-size: 373px 566px;
      background-position: -123px -496px
    }

    .tpl-xmas .mod-tpl-cover .gift-wrap .gift-box-l {
      background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas-cover-imp.32-yog151221161935@2x.png?max_age=19830212&d=20151224112832);
      background-size: 373px 566px;
      background-position: -263px -496px
    }
  }

  .text-overflow {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap
  }

  .tpl-xmas .wrap {
    width: 100vw;
    height: 100vh;
    background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/img/tpl-xmas/cover-bg.jpg?max_age=19830212&d=20151224112832);
    background-size: 100% auto;
    background-repeat: repeat-y
  }

  .tpl-xmas .mod-img-list {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: absolute;
    top: 0;
    left: 0
  }

  .tpl-xmas .mod-img-list .item {
    height: 100%;
    width: 100%;
    position: absolute;
    overflow: hidden;
    z-index: 1
  }

  .tpl-xmas .mod-img-list .item .bg-img {
    height: 100%;
    width: 100%;
    position: absolute;
    background-size: 100% auto;
    background-position: 50% 50%;
    background-repeat: no-repeat;
    overflow: hidden
  }

  .tpl-xmas .mod-img-list .item .bg-img .img-w {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: absolute;
    top: 0;
    left: 0
  }
  .tpl-xmas .mod-img-list .item .bg-img .img-w .j-page-inner-move-img{
    max-width: inherit;
    -webkit-transform : translate3d(0px, 0px, 0px);
    position: absolute;
    left: 0;
    top: 0;
    -webkit-transition: -webkit-transform 3.5s;
    -webkit-transform-origin:0 0;
  }
  .tpl-xmas .mod-img-list .item .bg-img .text-area {
    font-size: 14px;
    color: #fff;
    border: 1px solid transparent
  }

  .tpl-xmas .mod-img-list .item .decoration {
    position: absolute;
    width: 100%;
    bottom: 0;
    left: 0
  }

  .tpl-xmas .mod-img-list .page-1 .bg-img {
    width: 100%;
    height: 0;
    padding-top: 80%;
    background-size: cover;
    overflow: visible
  }

  .tpl-xmas .mod-img-list .page-1 .bg-img .cloud-up {
    width: 53px;
    height: 24px;
    position: absolute;
    bottom: -12px;
    right: 98px;
    background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas.32-yog151221161935.png?max_age=19830212&d=20151224112832);
    background-position: -244px -388px
  }

  .tpl-xmas .mod-img-list .page-1 .bg-img .cloud-down {
    width: 66px;
    height: 29px;
    position: absolute;
    bottom: -40px;
    right: 37px;
    background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas.32-yog151221161935.png?max_age=19830212&d=20151224112832);
    background-position: -935px -294px;
    z-index: -1
  }

  .tpl-xmas .mod-img-list .page-1 .bg-img .text-area {
    width: 33%;
    margin: 50px 10px 0 auto
  }

  .tpl-xmas .mod-img-list .page-1 .decoration {
  }

  .tpl-xmas .mod-img-list .page-1 .decoration .tree-right {
    width: 161px;
    height: 233px;
    position: absolute;
    bottom: -4px;
    left: 49px;
    background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas.32-yog151221161935.png?max_age=19830212&d=20151224112832);
    background-position: -203px 0
  }

  .tpl-xmas .mod-img-list .page-1 .decoration .tree-left {
    width: 201px;
    height: 327px;
    position: absolute;
    bottom: -19px;
    left: -54px;
    background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas.32-yog151221161935.png?max_age=19830212&d=20151224112832);
    background-position: 0 0
  }

  .tpl-xmas .mod-img-list .page-1 .decoration .gift-box-r {
    width: 146px;
    height: 104px;
    position: absolute;
    bottom: -46px;
    right: -12px;
    background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas.32-yog151221161935.png?max_age=19830212&d=20151224112832);
    background-position: -738px -308px
  }

  .tpl-xmas .mod-img-list .page-1 .decoration .gift-box-c {
    width: 146px;
    height: 104px;
    position: absolute;
    bottom: -17px;
    right: 94px;
    background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas.32-yog151221161935.png?max_age=19830212&d=20151224112832);
    background-position: -738px -308px
  }

  .tpl-xmas .mod-img-list .page-1 .decoration .xmas-man {
    width: 78px;
    height: 118px;
    position: absolute;
    bottom: 22px;
    left: 159px;
    background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas.32-yog151221161935.png?max_age=19830212&d=20151224112832);
    background-position: -845px -121px
  }

  .tpl-xmas .mod-img-list .page-1 .decoration .xmas-man .arm {
    width: 65px;
    height: 57px;
    background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas.32-yog151221161935.png?max_age=19830212&d=20151224112832);
    background-position: -760px -121px;
    position: absolute;
    top: 17px;
    right: -52px
  }

  .tpl-xmas .mod-img-list .page-2 .bg-img {
    width: 100%;
    height: 0;
    padding-top: 80%;
    background-size: cover;
    overflow: visible
  }

  .tpl-xmas .mod-img-list .page-2 .bg-img .bell-l {
    width: 59px;
    height: 76px;
    background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas.32-yog151221161935.png?max_age=19830212&d=20151224112832);
    background-position: -935px -216px;
    position: absolute;
    bottom: -27px;
    left: 14px
  }

  .tpl-xmas .mod-img-list .page-2 .bg-img .bell-r {
    width: 62px;
    height: 56px;
    background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas.32-yog151221161935.png?max_age=19830212&d=20151224112832);
    background-position: -943px -59px;
    position: absolute;
    bottom: -27px;
    left: 33px
  }

  .tpl-xmas .mod-img-list .page-2 .bg-img .text-area {
    max-width: 50%;
    margin: 30px auto 0 10px
  }

  .tpl-xmas .mod-img-list .page-2 .decoration {
  }

  .tpl-xmas .mod-img-list .page-2 .decoration .moon {
    width: 192px;
    height: 203px;
    background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas.32-yog151221161935.png?max_age=19830212&d=20151224112832);
    background-position: -366px -211px;
    position: absolute;
    bottom: 68px;
    right: -22px
  }

  .tpl-xmas .mod-img-list .page-2 .decoration .tree-right {
    width: 116px;
    height: 196px;
    background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas.32-yog151221161935.png?max_age=19830212&d=20151224112832);
    background-position: -533px 0;
    position: absolute;
    bottom: 44px;
    right: 0
  }

  .tpl-xmas .mod-img-list .page-2 .decoration .tree-left {
    width: 164px;
    height: 86px;
    background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas.32-yog151221161935.png?max_age=19830212&d=20151224112832);
    background-position: 0 -329px;
    position: absolute;
    bottom: 64px;
    right: 69px
  }

  .tpl-xmas .mod-img-list .page-2 .decoration .ground-back {
    width: 100%;
    height: 0;
    padding-top: 26.4%;
    background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/img/tpl-xmas/p2-ground-back.32@2x.png?max_age=19830212&d=20151224112832);
    position: absolute;
    bottom: 22px;
    left: 0;
    right: 0;
    background-size: cover
  }

  .tpl-xmas .mod-img-list .page-2 .decoration .ground-font {
    width: 100%;
    height: 0;
    padding-top: 13.9%;
    background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/img/tpl-xmas/p2-ground-font.32@2x.png?max_age=19830212&d=20151224112832);
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background-size: cover
  }

  .tpl-xmas .mod-img-list .page-2 .decoration .penguin-l {
    width: 113px;
    height: 151px;
    position: absolute;
    bottom: 20px;
    left: 8px
  }

  .tpl-xmas .mod-img-list .page-2 .decoration .penguin-l .inner {
    display: block;
    width: 100%;
    height: 100%;
    background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas.32-yog151221161935.png?max_age=19830212&d=20151224112832);
    background-position: -244px -235px
  }

  .tpl-xmas .mod-img-list .page-2 .decoration .penguin-r {
    width: 105px;
    height: 123px;
    position: absolute;
    bottom: 15px;
    left: 80px
  }

  .tpl-xmas .mod-img-list .page-2 .decoration .penguin-r .inner {
    display: block;
    width: 100%;
    height: 100%;
    background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas.32-yog151221161935.png?max_age=19830212&d=20151224112832);
    background-position: -738px -183px
  }

  .tpl-xmas .mod-img-list .page-2 .decoration .penguin-c {
    width: 65px;
    height: 57px;
    position: absolute;
    bottom: 24px;
    left: 49px
  }

  .tpl-xmas .mod-img-list .page-2 .decoration .penguin-c .inner {
    display: block;
    width: 100%;
    height: 100%;
    background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas.32-yog151221161935.png?max_age=19830212&d=20151224112832);
    background-position: -943px 0
  }

  .tpl-xmas .mod-img-list .page-2 .decoration .star-1 {
    width: 14px;
    height: 13px;
    background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas.32-yog151221161935.png?max_age=19830212&d=20151224112832);
    background-position: -1010px 0;
    position: absolute;
    bottom: 140px;
    left: 6px
  }

  .tpl-xmas .mod-img-list .page-2 .decoration .star-2 {
    width: 18px;
    height: 18px;
    background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas.32-yog151221161935.png?max_age=19830212&d=20151224112832);
    background-position: -325px -388px;
    position: absolute;
    bottom: 142px;
    left: 130px
  }

  .tpl-xmas .mod-img-list .page-2 .decoration .star-3 {
    width: 13px;
    height: 13px;
    background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas.32-yog151221161935.png?max_age=19830212&d=20151224112832);
    background-position: -1010px -18px;
    position: absolute;
    bottom: 200px;
    left: 165px
  }

  .tpl-xmas .mod-img-list .page-2 .decoration .star-4 {
    width: 24px;
    height: 24px;
    background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas.32-yog151221161935.png?max_age=19830212&d=20151224112832);
    background-position: -299px -388px;
    position: absolute;
    bottom: 155px;
    left: 160px
  }

  .tpl-xmas .mod-img-list .page-2 .decoration .star-5 {
    width: 13px;
    height: 13px;
    background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas.32-yog151221161935.png?max_age=19830212&d=20151224112832);
    background-position: -1010px -36px;
    position: absolute;
    bottom: 130px;
    left: 185px
  }

  .tpl-xmas .mod-img-list .page-3 {
  }

  .tpl-xmas .mod-img-list .page-3 .bg-img {
    width: 100%;
    height: 0;
    padding-top: 80%;
    top: 15%;
    background-size: cover;
    overflow: visible
  }

  .tpl-xmas .mod-img-list .page-3 .bg-img .text-area {
    max-width: 55%;
    margin: -15px -1px 0 auto
  }

  .tpl-xmas .mod-img-list .page-3 .top-lines {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 0;
    padding-top: 26.7%;
    background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/img/tpl-xmas/cover-top-line-bg.32@2x.png?max_age=19830212&d=20151224112832);
    background-size: 100% auto;
    background-repeat: no-repeat
  }

  .tpl-xmas .mod-img-list .page-3 .top-lines .line {
    display: block;
    position: absolute;
    top: 0
  }

  .tpl-xmas .mod-img-list .page-3 .top-lines .line .inner {
    display: block;
    width: 100%;
    height: 100%
  }

  .tpl-xmas .mod-img-list .page-3 .top-lines .line-1 {
    width: 25px;
    height: 145px;
    top: -45px;
    left: 10.8%
  }

  .tpl-xmas .mod-img-list .page-3 .top-lines .line-1 .inner {
    background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas.32-yog151221161935.png?max_age=19830212&d=20151224112832);
    background-position: -685px -183px
  }

  .tpl-xmas .mod-img-list .page-3 .top-lines .line-2 {
    width: 24px;
    height: 135px;
    left: 26%
  }

  .tpl-xmas .mod-img-list .page-3 .top-lines .line-2 .inner {
    background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas.32-yog151221161935.png?max_age=19830212&d=20151224112832);
    background-position: -712px -183px
  }

  .tpl-xmas .mod-img-list .page-3 .top-lines .line-3 {
    width: 34px;
    height: 93px;
    left: 33%
  }

  .tpl-xmas .mod-img-list .page-3 .top-lines .line-3 .inner {
    background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas.32-yog151221161935.png?max_age=19830212&d=20151224112832);
    background-position: -925px -121px
  }

  .tpl-xmas .mod-img-list .page-3 .top-lines .line-4 {
    width: 37px;
    height: 78px;
    right: 29%
  }

  .tpl-xmas .mod-img-list .page-3 .top-lines .line-4 .inner {
    background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas.32-yog151221161935.png?max_age=19830212&d=20151224112832);
    background-position: -685px -330px
  }

  .tpl-xmas .mod-img-list .page-3 .top-lines .line-5 {
    width: 47px;
    height: 100px;
    right: 14.4%;
    z-index: 1
  }

  .tpl-xmas .mod-img-list .page-3 .top-lines .line-5 .inner {
    background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas.32-yog151221161935.png?max_age=19830212&d=20151224112832);
    background-position: -886px -241px
  }

  .tpl-xmas .mod-img-list .page-3 .top-lines .line-6 {
    width: 20px;
    height: 190px;
    right: 14.4%
  }

  .tpl-xmas .mod-img-list .page-3 .top-lines .line-6 .inner {
    background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas.32-yog151221161935.png?max_age=19830212&d=20151224112832);
    background-position: -651px 0
  }

  .tpl-xmas .mod-img-list .page-3 .top-lines .line-7 {
    width: 39px;
    height: 173px;
    right: 9.4%
  }

  .tpl-xmas .mod-img-list .page-3 .top-lines .line-7 .inner {
    background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas.32-yog151221161935.png?max_age=19830212&d=20151224112832);
    background-position: -203px -235px
  }

  .tpl-xmas .mod-img-list .page-3 .top-lines .line-8 {
    width: 31px;
    height: 85px;
    right: 0
  }

  .tpl-xmas .mod-img-list .page-3 .top-lines .line-8 .inner {
    background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas.32-yog151221161935.png?max_age=19830212&d=20151224112832);
    background-position: -166px -329px
  }

  .tpl-xmas .mod-img-list .page-3 .top-lines .line-9 {
    width: 85px;
    height: 181px;
    left: 42%
  }

  .tpl-xmas .mod-img-list .page-3 .top-lines .line-9 .inner {
    background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas.32-yog151221161935.png?max_age=19830212&d=20151224112832);
    background-position: -673px 0
  }

  .tpl-xmas .mod-img-list .page-3 .decoration {
  }

  .tpl-xmas .mod-img-list .page-3 .decoration .tree-font {
    width: 100%;
    height: 0;
    padding-top: 35%;
    position: absolute;
    bottom: -1px;
    left: 0;
    background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/img/tpl-xmas/p3-tree-font.32@2x.png?max_age=19830212&d=20151224112832);
    background-size: 100% auto
  }

  .tpl-xmas .mod-img-list .page-3 .decoration .tree-back {
    width: 100%;
    height: 0;
    padding-top: 43%;
    position: absolute;
    bottom: 0;
    left: 0;
    background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/img/tpl-xmas/p3-tree-back.32@2x.png?max_age=19830212&d=20151224112832);
    background-size: 100% auto
  }

  .tpl-xmas .mod-img-list .page-3 .decoration .tree {
    width: 123px;
    height: 194px;
    position: absolute;
    bottom: 16px;
    left: 7%;
    background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas.32-yog151221161935.png?max_age=19830212&d=20151224112832);
    background-position: -560px -198px
  }

  .tpl-xmas .mod-img-list .page-3 .decoration .gift-box {
    width: 181px;
    height: 119px;
    position: absolute;
    bottom: 40px;
    left: 35%;
    background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas.32-yog151221161935.png?max_age=19830212&d=20151224112832);
    background-position: -760px 0;
    z-index: -1
  }

  .tpl-xmas .mod-img-list .page-4 {
  }

  .tpl-xmas .mod-img-list .page-4 .bg-img {
    width: 100%;
    height: 0;
    padding-top: 80%;
    top: 18%;
    background-size: cover;
    overflow: visible
  }

  .tpl-xmas .mod-img-list .page-4 .bg-img .text-area {
    max-width: 20%;
    margin: 10px 10px 0 auto
  }

  .tpl-xmas .mod-img-list .page-4 .bg-img .bell-l {
    width: 79px;
    height: 67px;
    position: absolute;
    top: -23px;
    left: 18px;
    background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas.32-yog151221161935.png?max_age=19830212&d=20151224112832);
    background-position: -886px -343px
  }

  .tpl-xmas .mod-img-list .page-4 .top-stars {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%
  }

  .tpl-xmas .mod-img-list .page-4 .top-stars .star-1 {
    width: 14px;
    height: 13px;
    background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas.32-yog151221161935.png?max_age=19830212&d=20151224112832);
    background-position: -1010px 0;
    position: absolute;
    top: 25px;
    left: 28.8%
  }

  .tpl-xmas .mod-img-list .page-4 .top-stars .star-2 {
    width: 18px;
    height: 18px;
    background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas.32-yog151221161935.png?max_age=19830212&d=20151224112832);
    background-position: -325px -388px;
    position: absolute;
    top: 50px;
    left: 32%
  }

  .tpl-xmas .mod-img-list .page-4 .top-stars .star-3 {
    width: 13px;
    height: 13px;
    background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas.32-yog151221161935.png?max_age=19830212&d=20151224112832);
    background-position: -1010px -18px;
    position: absolute;
    top: 40px;
    left: 37.7%
  }

  .tpl-xmas .mod-img-list .page-4 .top-stars .star-4 {
    width: 13px;
    height: 13px;
    background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas.32-yog151221161935.png?max_age=19830212&d=20151224112832);
    background-position: -1010px -18px;
    position: absolute;
    top: 80px;
    right: 22.8%
  }

  .tpl-xmas .mod-img-list .page-4 .top-stars .star-5 {
    width: 24px;
    height: 24px;
    background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas.32-yog151221161935.png?max_age=19830212&d=20151224112832);
    background-position: -299px -388px;
    position: absolute;
    top: 48px;
    right: 15.6%
  }

  .tpl-xmas .mod-img-list .page-4 .decoration .tree-back {
    width: 100%;
    height: 0;
    padding-top: 70%;
    position: absolute;
    bottom: 0;
    left: 0;
    background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/img/tpl-xmas/p4-tree-back.32@2x.png?max_age=19830212&d=20151224112832);
    background-size: 100% auto;
    z-index: -1
  }

  .tpl-xmas .mod-img-list .page-4 .decoration .deer {
    width: 165px;
    height: 209px;
    background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas.32-yog151221161935.png?max_age=19830212&d=20151224112832);
    background-position: -366px 0;
    position: absolute;
    bottom: 10px;
    left: 40px
  }

  .tpl-xmas .mod-img-list .page-4 .decoration .tree-font {
    width: 100%;
    height: 0;
    padding-top: 29.6%;
    position: absolute;
    bottom: 0;
    left: 0;
    background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/img/tpl-xmas/p4-tree-font.32@2x.png?max_age=19830212&d=20151224112832);
    background-size: 100% auto
  }

  .tpl-xmas .mod-img-list .page-4 .decoration .star-1 {
    width: 24px;
    height: 24px;
    background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas.32-yog151221161935.png?max_age=19830212&d=20151224112832);
    background-position: -299px -388px;
    position: absolute;
    bottom: 160px;
    left: 60px
  }

  .tpl-xmas .mod-img-list .page-4 .decoration .star-2 {
    width: 24px;
    height: 24px;
    background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas.32-yog151221161935.png?max_age=19830212&d=20151224112832);
    background-position: -299px -388px;
    position: absolute;
    bottom: 135px;
    right: 27.6%
  }

  .tpl-xmas .mod-img-list .page-4 .decoration .star-3 {
    width: 13px;
    height: 13px;
    background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas.32-yog151221161935.png?max_age=19830212&d=20151224112832);
    background-position: -1010px -36px;
    position: absolute;
    bottom: 120px;
    right: 22%
  }

  @media only screen and (max-device-height: 480px) and (max-device-width:414px) {
    .tpl-xmas .mod-tpl-cover .title-info {
      top:70px
    }

    .tpl-xmas .mod-tpl-cover .top-lines,.tpl-xmas .mod-tpl-cover .gift-wrap .big-tree,.tpl-xmas .mod-tpl-cover .gift-wrap .small-tree,.tpl-xmas .mod-tpl-cover .gift-wrap .gift-box-r,.tpl-xmas .mod-tpl-cover .gift-wrap .gift-box-l,.tpl-xmas .mod-tpl-cover .gift-wrap .penguin {
      zoom:.6}

    .tpl-xmas .mod-img-list .page-1 .decoration .tree-left,.tpl-xmas .mod-img-list .page-1 .decoration .tree-right,.tpl-xmas .mod-img-list .page-1 .decoration .xmas-man,.tpl-xmas .mod-img-list .page-1 .decoration .gift-box-r,.tpl-xmas .mod-img-list .page-1 .decoration .gift-box-c {
      zoom:.6}

    .tpl-xmas .mod-img-list .page-1 .bg-img .text-area {
      margin-top: 40px
    }

    /*.tpl-xmas .mod-img-list .page-1 .bg-img,.tpl-xmas .mod-img-list .page-2 .bg-img {
      padding-top: 75%
    }*/

    .tpl-xmas .mod-img-list .page-2 .bg-img .text-area {
      margin-top: 25px
    }

    .tpl-xmas .mod-img-list .page-2 .decoration .ground-font {
      bottom: -10px
    }

    .tpl-xmas .mod-img-list .page-2 .decoration .ground-back {
      bottom: 10px
    }

    .tpl-xmas .mod-img-list .page-2 .decoration .penguin-l,.tpl-xmas .mod-img-list .page-2 .decoration .penguin-c,.tpl-xmas .mod-img-list .page-2 .decoration .penguin-r,.tpl-xmas .mod-img-list .page-2 .decoration .tree-right,.tpl-xmas .mod-img-list .page-2 .decoration .tree-left,.tpl-xmas .mod-img-list .page-2 .decoration .moon {
      zoom:.7}

    /*.tpl-xmas .mod-img-list .page-3 .bg-img {
      padding-top: 65%;
      top: 18%
    }*/

    .tpl-xmas .mod-img-list .page-3 .top-lines {
      zoom:.7}

    .tpl-xmas .mod-img-list .page-3 .decoration .tree-font,.tpl-xmas .mod-img-list .page-3 .decoration .tree-back {
      bottom: -15px
    }

    .tpl-xmas .mod-img-list .page-3 .decoration .tree {
      zoom:.7;left: 10%
    }

    .tpl-xmas .mod-img-list .page-3 .decoration .gift-box {
      zoom:.7;bottom: 25px
    }

    /*.tpl-xmas .mod-img-list .page-4 .bg-img {
      padding-top: 65%;
      top: 18%
    }*/

    .tpl-xmas .mod-img-list .page-4 .decoration .tree-back {
      bottom: -30px
    }

    .tpl-xmas .mod-img-list .page-4 .decoration .tree-font {
      bottom: -5px
    }

    .tpl-xmas .mod-img-list .page-4 .decoration .deer {
      bottom: -5px;
      zoom:.8}
  }

  @media only screen and (-webkit-device-pixel-ratio: 2) and (max-device-width: 414px) and (min-device-height: 500px) {
    .tpl-xmas .mod-tpl-cover .title-info {
      top:102px;
      padding-top: 81px;
    }

    .tpl-xmas .mod-tpl-cover .top-lines,.tpl-xmas .mod-tpl-cover .gift-wrap .big-tree,.tpl-xmas .mod-tpl-cover .gift-wrap .small-tree,.tpl-xmas .mod-tpl-cover .gift-wrap .gift-box-r,.tpl-xmas .mod-tpl-cover .gift-wrap .gift-box-l,.tpl-xmas .mod-tpl-cover .gift-wrap .penguin {
      zoom:.8}

    .tpl-xmas .mod-img-list .page-1 .decoration .tree-left,.tpl-xmas .mod-img-list .page-1 .decoration .tree-right,.tpl-xmas .mod-img-list .page-1 .decoration .xmas-man,.tpl-xmas .mod-img-list .page-1 .decoration .gift-box-r,.tpl-xmas .mod-img-list .page-1 .decoration .gift-box-c {
      zoom:.8}

    .tpl-xmas .mod-img-list .page-1 .bg-img,.tpl-xmas .mod-img-list .page-2 .bg-img {
      padding-top: 80%
    }

    .tpl-xmas .mod-img-list .page-2 .bg-img .text-area {
      max-width: 43%
    }

    .tpl-xmas .mod-img-list .page-3 .top-lines {
      zoom:.8}

    .tpl-xmas .mod-img-list .page-3 .decoration .tree-font,.tpl-xmas .mod-img-list .page-3 .decoration .tree-back {
      bottom: -15px
    }

    .tpl-xmas .mod-img-list .page-3 .decoration .tree {
      bottom: 0
    }

    .tpl-xmas .mod-img-list .page-3 .decoration .gift-box {
      bottom: 25px;
      zoom:.8}

    .tpl-xmas .mod-img-list .page-4 .bg-img {
      top: 18%;
      padding-top: 78%
    }
  }

  @media only screen and (min-device-height: 667px) and (max-device-width:414px) and (-webkit-device-pixel-ratio:2) {
    .tpl-xmas .mod-tpl-cover .top-lines,.tpl-xmas .mod-tpl-cover .gift-wrap .big-tree,.tpl-xmas .mod-tpl-cover .gift-wrap .small-tree,.tpl-xmas .mod-tpl-cover .gift-wrap .gift-box-r,.tpl-xmas .mod-tpl-cover .gift-wrap .gift-box-l,.tpl-xmas .mod-tpl-cover .gift-wrap .penguin,.tpl-xmas .mod-img-list .page-1 .decoration .tree-left,.tpl-xmas .mod-img-list .page-1 .decoration .tree-right,.tpl-xmas .mod-img-list .page-1 .decoration .xmas-man,.tpl-xmas .mod-img-list .page-1 .decoration .gift-box-r,.tpl-xmas .mod-img-list .page-1 .decoration .gift-box-c {
      zoom:1
    }

    .tpl-xmas .mod-img-list .page-3 .top-lines {
      zoom:1}

    .tpl-xmas .mod-img-list .page-4 .bg-img {
      top: 18%
    }
  }

  @media only screen and (min-device-height: 690px) and (max-device-width:414px) and (-webkit-device-pixel-ratio:3) {
    .tpl-xmas .mod-tpl-cover .title-info{
      padding-top: 81px;
    }
  }

  @media only screen and (min-device-height: 799px) and (min-device-width:400px) {
    .tpl-xmas .mod-tpl-cover .title-info {
      top:70px
    }

    .tpl-xmas .mod-tpl-cover .top-lines,.tpl-xmas .mod-tpl-cover .gift-wrap .big-tree,.tpl-xmas .mod-tpl-cover .gift-wrap .small-tree,.tpl-xmas .mod-tpl-cover .gift-wrap .gift-box-r,.tpl-xmas .mod-tpl-cover .gift-wrap .gift-box-l,.tpl-xmas .mod-tpl-cover .gift-wrap .penguin {
      zoom:.7}

    .tpl-xmas .mod-img-list .page-1 .decoration .tree-left,.tpl-xmas .mod-img-list .page-1 .decoration .tree-right,.tpl-xmas .mod-img-list .page-1 .decoration .xmas-man,.tpl-xmas .mod-img-list .page-1 .decoration .gift-box-r,.tpl-xmas .mod-img-list .page-1 .decoration .gift-box-c {
      zoom:.7}

    .tpl-xmas .mod-img-list .page-1 .bg-img,.tpl-xmas .mod-img-list .page-2 .bg-img {
      padding-top: 80%
    }

    .tpl-xmas .mod-img-list .page-3 .top-lines {
      zoom:.8}

    .tpl-xmas .mod-img-list .page-4 .bg-img {
      padding-top: 68%;
      top: 18%
    }
  }

  @media only screen and (min-device-width: 720px) {
    .tpl-xmas .mod-tpl-cover .title-info {
      top:102px
    }

    .tpl-xmas .mod-tpl-cover .top-lines,.tpl-xmas .mod-tpl-cover .gift-wrap .big-tree,.tpl-xmas .mod-tpl-cover .gift-wrap .small-tree,.tpl-xmas .mod-tpl-cover .gift-wrap .gift-box-r,.tpl-xmas .mod-tpl-cover .gift-wrap .gift-box-l,.tpl-xmas .mod-tpl-cover .gift-wrap .penguin {
      zoom:.8}

    .tpl-xmas .mod-img-list .page-1 .decoration .tree-left,.tpl-xmas .mod-img-list .page-1 .decoration .tree-right,.tpl-xmas .mod-img-list .page-1 .decoration .xmas-man,.tpl-xmas .mod-img-list .page-1 .decoration .gift-box-r,.tpl-xmas .mod-img-list .page-1 .decoration .gift-box-c {
      zoom:.8}

    .tpl-xmas .mod-img-list .page-1 .bg-img,.tpl-xmas .mod-img-list .page-2 .bg-img {
      padding-top: 80%
    }

    .tpl-xmas .mod-img-list .page-3 .top-lines {
      zoom:.7}

    .tpl-xmas .mod-img-list .page-3 .bg-img {
      top: 18%;
      padding-top: 75%
    }

    .tpl-xmas .mod-img-list .page-3 .decoration .tree-font,.tpl-xmas .mod-img-list .page-3 .decoration .tree-back {
      bottom: -15px
    }

    .tpl-xmas .mod-img-list .page-3 .decoration .gift-box {
      bottom: 25px;
      zoom:.8}

    .tpl-xmas .mod-img-list .page-4 .bg-img {
      top: 18%;
      padding-top: 78%
    }
  }

  html,body {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: #fff
  }

  .hide {
    display: none!important
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
    *zoom:1}

  .textoverflow {
    display: inline-block;
    white-space: nowrap;
    word-wrap: normal;
    word-break: break-all;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
    _width: 100%
  }

  .tpl-xmas .wrap {
    overflow: hidden
  }

  .tpl-xmas .mod-img-wrap {
    width: 100%;
    height: 100%
  }

  .tpl-xmas .mod-tpl-cover .top-lines,.tpl-xmas .mod-tpl-cover .top-lines .line {
    -webkit-transform: translate3d(0,-100%,0)
  }

  .tpl-xmas .mod-tpl-cover .top-lines .line .inner {
    -webkit-transform-origin: center top;
    -webkit-transform: rotate(-2deg)
  }

  .tpl-xmas .mod-tpl-cover .gift-wrap .big-tree,.tpl-xmas .mod-tpl-cover .gift-wrap .small-tree,.tpl-xmas .mod-tpl-cover .gift-wrap .gift-box-r,.tpl-xmas .mod-tpl-cover .gift-wrap .penguin,.tpl-xmas .mod-tpl-cover .gift-wrap .gift-box-l {
    -webkit-transform: translate3d(0,100%,0)
  }

  .tpl-xmas .mod-tpl-cover .gift-wrap .big-tree .gingerbread {
    -webkit-transform: translate3d(78%,31%,0)
  }

  .tpl-xmas .mod-tpl-cover .title-info .title,.tpl-xmas .mod-tpl-cover .title-info .user {
    opacity: 0
  }

  .tpl-xmas .mod-tpl-cover.animate .title-info {
    -webkit-transform: translate3d(0,10px,0);
    -webkit-animation: float 1.5s ease infinite alternate
  }

  .tpl-xmas .mod-tpl-cover.animate .title-info .title {
    -webkit-animation: fade-in .8s ease .3s forwards
  }

  .tpl-xmas .mod-tpl-cover.animate .title-info .user {
    -webkit-animation: fade-in .8s ease .5s forwards
  }

  .tpl-xmas .mod-tpl-cover.animate .top-lines {
    -webkit-animation: move-in .5s ease forwards
  }

  .tpl-xmas .mod-tpl-cover.animate .top-lines .line .inner {
    -webkit-animation: swing 1.5s cubic-bezier(0.645,.045,.355,1.000) 1s infinite alternate
  }

  .tpl-xmas .mod-tpl-cover.animate .top-lines .line-2 .inner,.tpl-xmas .mod-tpl-cover.animate .top-lines .line-5 .inner,.tpl-xmas .mod-tpl-cover.animate .top-lines .line-7 .inner {
    -webkit-transform: rotate(2deg);
    -webkit-animation: swing-reverse 1.5s cubic-bezier(0.645,.045,.355,1.000) 1s infinite alternate
  }

  .tpl-xmas .mod-tpl-cover.animate .top-lines .line-1 {
    -webkit-animation: line-move-in .5s ease 1s forwards
  }

  .tpl-xmas .mod-tpl-cover.animate .top-lines .line-1 .inner {
    -webkit-animation-delay: 1s
  }

  .tpl-xmas .mod-tpl-cover.animate .top-lines .line-2 {
    -webkit-animation: line-move-in .5s ease 1.2s forwards
  }

  .tpl-xmas .mod-tpl-cover.animate .top-lines .line-2 .inner {
    -webkit-animation-delay: .5s
  }

  .tpl-xmas .mod-tpl-cover.animate .top-lines .line-3 {
    -webkit-animation: line-move-in .5s ease 1s forwards
  }

  .tpl-xmas .mod-tpl-cover.animate .top-lines .line-3 .inner {
    -webkit-animation-delay: 1.5s
  }

  .tpl-xmas .mod-tpl-cover.animate .top-lines .line-4 {
    -webkit-animation: line-move-in .5s ease 1.2s forwards
  }

  .tpl-xmas .mod-tpl-cover.animate .top-lines .line-4 .inner {
    -webkit-animation-delay: 1s
  }

  .tpl-xmas .mod-tpl-cover.animate .top-lines .line-5 {
    -webkit-animation: line-move-in .5s ease .9s forwards
  }

  .tpl-xmas .mod-tpl-cover.animate .top-lines .line-5 .inner {
    -webkit-animation-delay: 1.1s
  }

  .tpl-xmas .mod-tpl-cover.animate .top-lines .line-6 {
    -webkit-animation: line-move-in .5s ease 1.1s forwards
  }

  .tpl-xmas .mod-tpl-cover.animate .top-lines .line-6 .inner {
    -webkit-animation-delay: .8s
  }

  .tpl-xmas .mod-tpl-cover.animate .top-lines .line-7 {
    -webkit-animation: line-move-in .5s ease 1.1s forwards
  }

  .tpl-xmas .mod-tpl-cover.animate .top-lines .line-7 .inner {
    -webkit-animation-delay: 1.1s
  }

  .tpl-xmas .mod-tpl-cover.animate .top-lines .line-8 {
    -webkit-animation: line-move-in .5s ease 1.1s forwards
  }

  .tpl-xmas .mod-tpl-cover.animate .top-lines .line-8 .inner {
    -webkit-animation-delay: 1s
  }

  .tpl-xmas .mod-tpl-cover.animate .gift-wrap .big-tree {
    -webkit-animation: move-in 1.2s ease .2s forwards
  }

  .tpl-xmas .mod-tpl-cover.animate .gift-wrap .big-tree .gingerbread {
    -webkit-animation: move-in 1.2s ease 1.2s forwards
  }

  .tpl-xmas .mod-tpl-cover.animate .gift-wrap .small-tree {
    -webkit-animation: move-in 1.1s ease .4s forwards
  }

  .tpl-xmas .mod-tpl-cover.animate .gift-wrap .gift-box-r {
    -webkit-animation: cover-movein-elasticity .4s ease 1s forwards
  }

  .tpl-xmas .mod-tpl-cover.animate .gift-wrap .penguin {
    -webkit-animation: cover-movein-elasticity .5s ease 1s forwards
  }

  .tpl-xmas .mod-tpl-cover.animate .gift-wrap .gift-box-l {
    -webkit-animation: cover-movein-elasticity .5s ease 1.4s forwards
  }

  .tpl-xmas .mod-tpl-cover.animate-b {
    -webkit-animation: fade-out .8s ease forwards
  }

  @-webkit-keyframes float {
    0% {
      -webkit-transform: translate3d(0,5px,0)
    }

    100% {
      -webkit-transform: translate3d(0,-5px,0)
    }
  }

  @-webkit-keyframes line-move-in {
    100% {
      -webkit-transform: translate3d(0,0,0)
    }
  }

  @-webkit-keyframes cover-movein-elasticity {
    90% {
      -webkit-transform: translate3d(0,0%,0)
    }

    100% {
      -webkit-transform: translate3d(0,5%,0)
    }
  }

  .tpl-xmas .mod-img-list .page-1 .bg-img {
    opacity: 0
  }

  .tpl-xmas .mod-img-list .page-1 .bg-img .cloud-up {
    -webkit-transform: translate3d(150px,0,0)
  }

  .tpl-xmas .mod-img-list .page-1 .bg-img .cloud-down {
    -webkit-transform: translate3d(110px,0,0)
  }

  .tpl-xmas .mod-img-list .page-1 .decoration .tree-right,.tpl-xmas .mod-img-list .page-1 .decoration .gift-box-r,.tpl-xmas .mod-img-list .page-1 .decoration .gift-box-c {
    -webkit-transform: translate3d(0,120%,0)
  }

  .tpl-xmas .mod-img-list .page-1 .decoration .tree-left {
    -webkit-transform: translate3d(-100%,0,0)
  }

  .tpl-xmas .mod-img-list .page-1 .decoration .xmas-man {
    -webkit-transform: translate3d(-110%,120%,0)
  }

  .tpl-xmas .mod-img-list .page-1 .decoration .xmas-man .arm {
    -webkit-transform: rotate(-5deg);
    -webkit-transform-origin: left bottom
  }

  .tpl-xmas .mod-img-list .page-1.animate .bg-img {
    -webkit-animation: fade-in .8s ease forwards
  }

  .tpl-xmas .mod-img-list .page-1.animate .decoration .tree-right {
    -webkit-animation: move-in .8s ease .3s forwards
  }

  .tpl-xmas .mod-img-list .page-1.animate .decoration .tree-left {
    -webkit-animation: move-in .8s ease .4s forwards
  }

  .tpl-xmas .mod-img-list .page-1.animate .decoration .gift-box-c {
    -webkit-animation: p1-movein-elasticity .4s ease .7s forwards
  }

  .tpl-xmas .mod-img-list .page-1.animate .decoration .gift-box-r {
    -webkit-animation: p1-movein-elasticity .4s ease .8s forwards
  }

  .tpl-xmas .mod-img-list .page-1.animate .decoration .xmas-man {
    -webkit-animation: move-in .8s ease .5s forwards
  }

  .tpl-xmas .mod-img-list .page-1.animate .decoration .xmas-man .arm {
    -webkit-animation: p1-arm-wave 1s linear 1.1s infinite alternate
  }

  .tpl-xmas .mod-img-list .page-1.animate .bg-img .cloud-up {
    -webkit-animation: move-in 1.5s ease .5s forwards
  }

  .tpl-xmas .mod-img-list .page-1.animate .bg-img .cloud-down {
    -webkit-animation: move-in 1.5s ease .8s forwards
  }

  .tpl-xmas .mod-img-list .page-1.animate-b .bg-img {
    -webkit-animation: fade-out .5s ease forwards
  }

  .tpl-xmas .mod-img-list .page-1.animate-b .decoration {
    -webkit-animation: fade-out .5s ease forwards
  }

  @-webkit-keyframes p1-movein-elasticity {
    90% {
      -webkit-transform: translate3d(0,0%,0)
    }

    100% {
      -webkit-transform: translate3d(0,2%,0)
    }
  }

  @-webkit-keyframes p1-arm-wave {
    0% {
      -webkit-transform: rotate(-5deg)
    }

    100% {
      -webkit-transform: rotate(5deg)
    }
  }

  .tpl-xmas .mod-img-list .page-2 .bg-img,.tpl-xmas .mod-img-list .page-2 .bg-img .bell {
    opacity: 0
  }

  .tpl-xmas .mod-img-list .page-2 .decoration .moon,.tpl-xmas .mod-img-list .page-2 .decoration .tree-right {
    -webkit-transform: translate3d(100%,0,0)
  }

  .tpl-xmas .mod-img-list .page-2 .decoration .ground-font,.tpl-xmas .mod-img-list .page-2 .decoration .penguin-l,.tpl-xmas .mod-img-list .page-2 .decoration .penguin-r,.tpl-xmas .mod-img-list .page-2 .decoration .penguin-c {
    -webkit-transform: translate3d(0,130%,0)
  }

  .tpl-xmas .mod-img-list .page-2 .decoration .ground-back {
    -webkit-transform: translate3d(0,130%,0)
  }

  .tpl-xmas .mod-img-list .page-2 .decoration .tree-left {
    -webkit-transform: translate3d(0,150px,0)
  }

  .tpl-xmas .mod-img-list .page-2 .decoration .star {
    opacity: 0
  }

  .tpl-xmas .mod-img-list .page-2.animate .bg-img {
    -webkit-animation: fade-in .8s ease forwards
  }

  .tpl-xmas .mod-img-list .page-2.animate .bg-img .bell {
    -webkit-animation: fade-in .8s ease .5s forwards
  }

  .tpl-xmas .mod-img-list .page-2.animate .bg-img .bell-l {
    -webkit-transform: rotate(-2deg);
    -webkit-animation: p2-bell-wave 1s linear .55s infinite alternate
  }

  .tpl-xmas .mod-img-list .page-2.animate .bg-img .bell-r {
    -webkit-transform: rotate(-2deg);
    -webkit-animation: p2-bell-wave 1s linear infinite alternate
  }

  .tpl-xmas .mod-img-list .page-2.animate .decoration .moon {
    -webkit-animation: move-in .8s ease .5s forwards
  }

  .tpl-xmas .mod-img-list .page-2.animate .decoration .tree-right {
    -webkit-animation: move-in .8s ease .5s forwards
  }

  .tpl-xmas .mod-img-list .page-2.animate .decoration .tree-left {
    -webkit-animation: move-in .8s ease .6s forwards
  }

  .tpl-xmas .mod-img-list .page-2.animate .decoration .ground-back {
    -webkit-animation: move-in .8s ease .5s forwards
  }

  .tpl-xmas .mod-img-list .page-2.animate .decoration .ground-font {
    -webkit-animation: move-in .8s ease .5s forwards
  }

  .tpl-xmas .mod-img-list .page-2.animate .decoration .penguin-l {
    -webkit-animation: move-in .8s cubic-bezier(.01,.72,.49,.99) .5s forwards
  }

  .tpl-xmas .mod-img-list .page-2.animate .decoration .penguin-l .inner {
    -webkit-transform: rotate(-2deg);
    -webkit-transform-origin: center bottom;
    -webkit-animation: p2-penguin-wave 1.5s linear 1.5s infinite alternate
  }

  .tpl-xmas .mod-img-list .page-2.animate .decoration .penguin-c {
    -webkit-animation: move-in .8s cubic-bezier(.01,.72,.49,.99) .6s forwards
  }

  .tpl-xmas .mod-img-list .page-2.animate .decoration .penguin-c .inner {
    -webkit-transform: rotate(-2deg);
    -webkit-transform-origin: center bottom;
    -webkit-animation: p2-penguin-wave 1.5s linear 1s infinite alternate
  }

  .tpl-xmas .mod-img-list .page-2.animate .decoration .penguin-r {
    -webkit-animation: move-in .8s cubic-bezier(.01,.72,.49,.99) .5s forwards
  }

  .tpl-xmas .mod-img-list .page-2.animate .decoration .penguin-r .inner {
    -webkit-transform: rotate(-2deg);
    -webkit-transform-origin: center bottom;
    -webkit-animation: p2-penguin-wave 1.5s linear .5s infinite alternate
  }

  .tpl-xmas .mod-img-list .page-2.animate .decoration .star-1 {
    -webkit-animation: p2-star-buling 1s ease .5s infinite alternate
  }

  .tpl-xmas .mod-img-list .page-2.animate .decoration .star-2 {
    -webkit-animation: p2-star-buling 1s ease .8s infinite alternate
  }

  .tpl-xmas .mod-img-list .page-2.animate .decoration .star-3 {
    -webkit-animation: p2-star-buling 1s ease .6s infinite alternate
  }

  .tpl-xmas .mod-img-list .page-2.animate .decoration .star-4 {
    -webkit-animation: p2-star-buling 1s ease .9s infinite alternate
  }

  .tpl-xmas .mod-img-list .page-2.animate .decoration .star-5 {
    -webkit-animation: p2-star-buling 1s ease .55s infinite alternate
  }

  .tpl-xmas .mod-img-list .page-2.animate-b {
    -webkit-animation: fade-out .8s ease forwards
  }

  @-webkit-keyframes p2-bell-wave {
    0% {
      -webkit-transform: rotate(-2deg)
    }

    100% {
      -webkit-transform: rotate(2deg)
    }
  }

  @-webkit-keyframes p2-penguin-wave {
    0% {
      -webkit-transform: rotate(-2deg)
    }

    100% {
      -webkit-transform: rotate(2deg)
    }
  }

  @-webkit-keyframes p2-star-buling {
    0% {
      opacity: .3;
      -webkit-transform: scale(0.9)
    }

    100% {
      opacity: 1
    }
  }

  .tpl-xmas .mod-img-list .page-3 .bg-img {
    opacity: 0
  }

  .tpl-xmas .mod-img-list .page-3 .decoration .tree-font,.tpl-xmas .mod-img-list .page-3 .decoration .tree-back,.tpl-xmas .mod-img-list .page-3 .decoration .tree {
    -webkit-transform: translate3d(0,100%,0)
  }

  .tpl-xmas .mod-img-list .page-3 .decoration .gift-box {
    -webkit-transform: translate3d(0,160px,0)
  }

  .tpl-xmas .mod-img-list .page-3 .top-lines,.tpl-xmas .mod-img-list .page-3 .top-lines .line {
    -webkit-transform: translate3d(0,-100%,0)
  }

  .tpl-xmas .mod-img-list .page-3 .top-lines .line .inner {
    -webkit-transform-origin: center top;
    -webkit-transform: rotate(-2deg)
  }

  .tpl-xmas .mod-img-list .page-3.animate .bg-img {
    -webkit-animation: fade-in .8s ease forwards
  }

  .tpl-xmas .mod-img-list .page-3.animate .top-lines {
    -webkit-animation: move-in .5s ease .4s forwards
  }

  .tpl-xmas .mod-img-list .page-3.animate .top-lines .line .inner {
    -webkit-animation: swing 1.5s linear 1s infinite alternate
  }

  .tpl-xmas .mod-img-list .page-3.animate .top-lines .line-2 .inner,.tpl-xmas .mod-img-list .page-3.animate .top-lines .line-5 .inner,.tpl-xmas .mod-img-list .page-3.animate .top-lines .line-7 .inner,.tpl-xmas .mod-img-list .page-3.animate .top-lines .line-9 .inner {
    -webkit-transform: rotate(2deg);
    -webkit-animation: swing-reverse 1.5s linear 1s infinite alternate
  }

  .tpl-xmas .mod-img-list .page-3.animate .top-lines .line-1 {
    -webkit-animation: move-in .8s ease .55s forwards
  }

  .tpl-xmas .mod-img-list .page-3.animate .top-lines .line-2 {
    -webkit-animation: move-in .5s ease .7s forwards
  }

  .tpl-xmas .mod-img-list .page-3.animate .top-lines .line-3 {
    -webkit-animation: move-in .8s ease .55s forwards
  }

  .tpl-xmas .mod-img-list .page-3.animate .top-lines .line-4 {
    -webkit-animation: move-in .6s ease .7s forwards
  }

  .tpl-xmas .mod-img-list .page-3.animate .top-lines .line-5 {
    -webkit-animation: move-in .7s ease .5s forwards
  }

  .tpl-xmas .mod-img-list .page-3.animate .top-lines .line-6 {
    -webkit-animation: move-in .5s ease .7s forwards
  }

  .tpl-xmas .mod-img-list .page-3.animate .top-lines .line-7 {
    -webkit-animation: move-in .8s ease .55s forwards
  }

  .tpl-xmas .mod-img-list .page-3.animate .top-lines .line-8 {
    -webkit-animation: move-in .5s ease .7s forwards
  }

  .tpl-xmas .mod-img-list .page-3.animate .top-lines .line-9 {
    -webkit-animation: move-in .8s ease .7s forwards
  }

  .tpl-xmas .mod-img-list .page-3.animate .top-lines .line-1 .inner {
    -webkit-animation-delay: 1s
  }

  .tpl-xmas .mod-img-list .page-3.animate .top-lines .line-2 .inner {
    -webkit-animation-delay: .6s
  }

  .tpl-xmas .mod-img-list .page-3.animate .top-lines .line-3 .inner {
    -webkit-animation-delay: 1.5s
  }

  .tpl-xmas .mod-img-list .page-3.animate .top-lines .line-4 .inner {
    -webkit-animation-delay: 1.2s
  }

  .tpl-xmas .mod-img-list .page-3.animate .top-lines .line-5 .inner {
    -webkit-animation-delay: .5s
  }

  .tpl-xmas .mod-img-list .page-3.animate .top-lines .line-6 .inner {
    -webkit-animation-delay: .8s
  }

  .tpl-xmas .mod-img-list .page-3.animate .top-lines .line-7 .inner {
    -webkit-animation-delay: .7s
  }

  .tpl-xmas .mod-img-list .page-3.animate .top-lines .line-8 .inner {
    -webkit-animation-delay: 1.1s
  }

  .tpl-xmas .mod-img-list .page-3.animate .decoration .tree {
    -webkit-animation: move-in .8s ease .1s forwards
  }

  .tpl-xmas .mod-img-list .page-3.animate .decoration .tree-font {
    -webkit-animation: move-in .8s ease forwards
  }

  .tpl-xmas .mod-img-list .page-3.animate .decoration .tree-back {
    -webkit-animation: move-in .8s ease .3s forwards
  }

  .tpl-xmas .mod-img-list .page-3.animate .decoration .gift-box {
    -webkit-animation: move-in .8s ease .5s forwards
  }

  .tpl-xmas .mod-img-list .page-3.animate-b {
    -webkit-animation: fade-out .8s ease forwards
  }

  .tpl-xmas .mod-img-list .page-4 .bg-img .bell {
    opacity: 0
  }

  .tpl-xmas .mod-img-list .page-4 .bg-img .bell-l {
    -webkit-transform: rotate(-2deg)
  }

  .tpl-xmas .mod-img-list .page-4 .decoration .deer {
    -webkit-transform: translate3d(-40%,100%,0)
  }

  .tpl-xmas .mod-img-list .page-4 .top-stars .star,.tpl-xmas .mod-img-list .page-4 .decoration .star {
    opacity: 0
  }

  .tpl-xmas .mod-img-list .page-4.animate .bg-img .bell {
    -webkit-animation: fade-in .5s ease .2s forwards
  }

  .tpl-xmas .mod-img-list .page-4.animate .bg-img .bell-l {
    -webkit-animation: swing 1s linear .5s infinite alternate
  }

  .tpl-xmas .mod-img-list .page-4.animate .decoration .deer {
    -webkit-animation: move-in .8s ease 1s forwards
  }

  .tpl-xmas .mod-img-list .page-4.animate .top-stars .star,.tpl-xmas .mod-img-list .page-4.animate .decoration .star {
    -webkit-animation: p4-star-buling .8s ease infinite alternate
  }

  .tpl-xmas .mod-img-list .page-4.animate .top-stars .star-1 {
    -webkit-animation-delay: .5s
  }

  .tpl-xmas .mod-img-list .page-4.animate .top-stars .star-2 {
    -webkit-animation-delay: .3s
  }

  .tpl-xmas .mod-img-list .page-4.animate .top-stars .star-3 {
    -webkit-animation-delay: .6s
  }

  .tpl-xmas .mod-img-list .page-4.animate .top-stars .star-4 {
    -webkit-animation-delay: .8s
  }

  .tpl-xmas .mod-img-list .page-4.animate .top-stars .star-5 {
    -webkit-animation-delay: .5s
  }

  .tpl-xmas .mod-img-list .page-4.animate .decoration .star-1 {
    -webkit-animation-delay: .8s
  }

  .tpl-xmas .mod-img-list .page-4.animate .decoration .star-2 {
    -webkit-animation-delay: .5s
  }

  .tpl-xmas .mod-img-list .page-4.animate .decoration .star-3 {
    -webkit-animation-delay: .6s
  }

  .tpl-xmas .mod-img-list .page-4.animate-b {
    -webkit-animation: fade-out .8s ease forwards
  }

  @-webkit-keyframes p4-star-buling {
    0% {
      opacity: .5
    }

    100% {
      opacity: 1;
      -webkit-transform: scale(0.9)
    }
  }

  @-webkit-keyframes move-in {
    100% {
      -webkit-transform: translate3d(0,0,0)
    }
  }

  @-webkit-keyframes fade-out {
    100% {
      opacity: 0
    }
  }

  @-webkit-keyframes fade-in {
    100% {
      opacity: 1
    }
  }

  @-webkit-keyframes swing {
    0% {
      -webkit-transform: rotate(-2deg)
    }

    100% {
      -webkit-transform: rotate(2deg)
    }
  }

  @-webkit-keyframes swing-reverse {
    0% {
      -webkit-transform: rotate(2deg)
    }

    100% {
      -webkit-transform: rotate(-2deg)
    }
  }

  @-webkit-keyframes movein-elasticity {
    90% {
      -webkit-transform: translate3d(0,0%,0)
    }

    100% {
      -webkit-transform: translate3d(0,3%,0)
    }
  }

  .mod-star {
    display: block;
    position: absolute;
    top: 25%;
    left: 25%;
    width: 8px;
    height: 8px;
    overflow: hidden;
    animation: glitter 4.5s linear 0s infinite normal;
    -webkit-animation: glitter 4.5s linear 0s infinite normal;
    -moz-animation: glitter 4.5s linear 0s infinite normal;
    -ms-animation: glitter 4.5s linear 0s infinite normal;
    -o-animation: glitter 4.5s linear 0s infinite normal
  }

  .star-1 {
    background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas.32-yog151221161935.png?max_age=19830212&d=20151224112832);
    background-position: -1010px -54px
  }

  .star-2 {
    background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas.32-yog151221161935.png?max_age=19830212&d=20151224112832);
    background-position: -1010px -72px
  }

  .delay-1 {
    -webkit-animation-delay: .29388s
  }

  .delay-2 {
    -webkit-animation-delay: .38514s
  }

  .delay-3 {
    -webkit-animation-delay: .52543s
  }

  .delay-4 {
    -webkit-animation-delay: .79258s
  }

  .delay-5 {
    -webkit-animation-delay: .92544s
  }

  @-webkit-keyframes glitter {
    0% {
      -webkit-transform: scale(1.0);
      opacity: 1
    }

    25% {
      -webkit-transform: scale(0.5);
      opacity: 0
    }

    50% {
      -webkit-transform: scale(1.0);
      opacity: 1
    }

    75% {
      -webkit-transform: scale(0.5);
      opacity: 0
    }

    100% {
      -webkit-transform: scale(1.0);
      opacity: 1
    }
  }

  @-moz-keyframes glitter {
    0% {
      -moz-transform: scale(1.0);
      opacity: 1
    }

    25% {
      -moz-transform: scale(0.5);
      opacity: 0
    }

    50% {
      -moz-transform: scale(1.0);
      opacity: 1
    }

    75% {
      -moz-transform: scale(0.5);
      opacity: 0
    }

    100% {
      -moz-transform: scale(1.0);
      opacity: 1
    }
  }

  @media only screen and (max-device-height: 480px) and (max-device-width:414px) {
  }

  @media only screen and (min-device-height: 568px) and (max-device-width:414px) and (-webkit-device-pixel-ratio:2) {
  }

  @media only screen and (min-device-height: 667px) and (max-device-width:414px) and (-webkit-device-pixel-ratio:2) {
  }

  @media only screen and (min-device-height: 736px) and (max-device-width:414px) and (-webkit-device-pixel-ratio:3) {
    .tpl-xmas .mod-tpl-cover .title-info {
      top:150px
    }
  }

  @media only screen and (min-device-height: 800px) and (min-device-width:400px) {
  }

  @media only screen and (min-device-width: 720px) {
  }

  @media only screen and (-webkit-min-device-pixel-ratio: 1.25),only screen and (min-resolution:120dpi),only screen and (min-resolution:1.25dppx) {
    .tpl-xmas .mod-img-list .page-1 .bg-img .cloud-up {
      background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas.32-yog151221161935@2x.png?max_age=19830212&d=20151224112832);
      background-size: 801px 538px;
      background-position: -730px -246px
    }

    .tpl-xmas .mod-img-list .page-1 .bg-img .cloud-down {
      background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas.32-yog151221161935@2x.png?max_age=19830212&d=20151224112832);
      background-size: 801px 538px;
      background-position: -710px -480px
    }

    .tpl-xmas .mod-img-list .page-1 .decoration .tree-right {
      background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas.32-yog151221161935@2x.png?max_age=19830212&d=20151224112832);
      background-size: 801px 538px;
      background-position: -203px 0
    }

    .tpl-xmas .mod-img-list .page-1 .decoration .tree-left {
      background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas.32-yog151221161935@2x.png?max_age=19830212&d=20151224112832);
      background-size: 801px 538px;
      background-position: 0 0
    }

    .tpl-xmas .mod-img-list .page-1 .decoration .gift-box-r {
      background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas.32-yog151221161935@2x.png?max_age=19830212&d=20151224112832);
      background-size: 801px 538px;
      background-position: -582px -246px
    }

    .tpl-xmas .mod-img-list .page-1 .decoration .gift-box-c {
      background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas.32-yog151221161935@2x.png?max_age=19830212&d=20151224112832);
      background-size: 801px 538px;
      background-position: -582px -246px
    }

    .tpl-xmas .mod-img-list .page-1 .decoration .xmas-man {
      background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas.32-yog151221161935@2x.png?max_age=19830212&d=20151224112832);
      background-size: 801px 538px;
      background-position: -396px -394px
    }

    .tpl-xmas .mod-img-list .page-1 .decoration .xmas-man .arm {
      background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas.32-yog151221161935@2x.png?max_age=19830212&d=20151224112832);
      background-size: 801px 538px;
      background-position: -710px -421px
    }

    .tpl-xmas .mod-img-list .page-2 .bg-img .bell-l {
      background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas.32-yog151221161935@2x.png?max_age=19830212&d=20151224112832);
      background-size: 801px 538px;
      background-position: -649px -454px
    }

    .tpl-xmas .mod-img-list .page-2 .bg-img .bell-r {
      background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas.32-yog151221161935@2x.png?max_age=19830212&d=20151224112832);
      background-size: 801px 538px;
      background-position: -714px -59px
    }

    .tpl-xmas .mod-img-list .page-2 .decoration .moon {
      background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas.32-yog151221161935@2x.png?max_age=19830212&d=20151224112832);
      background-size: 801px 538px;
      background-position: 0 -329px
    }

    .tpl-xmas .mod-img-list .page-2 .decoration .tree-right {
      background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas.32-yog151221161935@2x.png?max_age=19830212&d=20151224112832);
      background-size: 801px 538px;
      background-position: -366px 0
    }

    .tpl-xmas .mod-img-list .page-2 .decoration .tree-left {
      background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas.32-yog151221161935@2x.png?max_age=19830212&d=20151224112832);
      background-size: 801px 538px;
      background-position: -194px -446px
    }

    .tpl-xmas .mod-img-list .page-2 .decoration .penguin-l .inner {
      background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas.32-yog151221161935@2x.png?max_age=19830212&d=20151224112832);
      background-size: 801px 538px;
      background-position: -495px -375px
    }

    .tpl-xmas .mod-img-list .page-2 .decoration .penguin-r .inner {
      background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas.32-yog151221161935@2x.png?max_age=19830212&d=20151224112832);
      background-size: 801px 538px;
      background-position: -574px 0
    }

    .tpl-xmas .mod-img-list .page-2 .decoration .penguin-c .inner {
      background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas.32-yog151221161935@2x.png?max_age=19830212&d=20151224112832);
      background-size: 801px 538px;
      background-position: -714px 0
    }

    .tpl-xmas .mod-img-list .page-2 .decoration .star-1 {
      background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas.32-yog151221161935@2x.png?max_age=19830212&d=20151224112832);
      background-size: 801px 538px;
      background-position: -785px 0
    }

    .tpl-xmas .mod-img-list .page-2 .decoration .star-2 {
      background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas.32-yog151221161935@2x.png?max_age=19830212&d=20151224112832);
      background-size: 801px 538px;
      background-position: -396px -514px
    }

    .tpl-xmas .mod-img-list .page-2 .decoration .star-3 {
      background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas.32-yog151221161935@2x.png?max_age=19830212&d=20151224112832);
      background-size: 801px 538px;
      background-position: -785px -18px
    }

    .tpl-xmas .mod-img-list .page-2 .decoration .star-4 {
      background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas.32-yog151221161935@2x.png?max_age=19830212&d=20151224112832);
      background-size: 801px 538px;
      background-position: -547px -147px
    }

    .tpl-xmas .mod-img-list .page-2 .decoration .star-5 {
      background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas.32-yog151221161935@2x.png?max_age=19830212&d=20151224112832);
      background-size: 801px 538px;
      background-position: -785px -36px
    }

    .tpl-xmas .mod-img-list .page-3 .top-lines .line-1 .inner {
      background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas.32-yog151221161935@2x.png?max_age=19830212&d=20151224112832);
      background-size: 801px 538px;
      background-position: -547px 0
    }

    .tpl-xmas .mod-img-list .page-3 .top-lines .line-2 .inner {
      background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas.32-yog151221161935@2x.png?max_age=19830212&d=20151224112832);
      background-size: 801px 538px;
      background-position: -370px -394px
    }

    .tpl-xmas .mod-img-list .page-3 .top-lines .line-3 .inner {
      background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas.32-yog151221161935@2x.png?max_age=19830212&d=20151224112832);
      background-size: 801px 538px;
      background-position: -659px -352px
    }

    .tpl-xmas .mod-img-list .page-3 .top-lines .line-4 .inner {
      background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas.32-yog151221161935@2x.png?max_age=19830212&d=20151224112832);
      background-size: 801px 538px;
      background-position: -610px -454px
    }

    .tpl-xmas .mod-img-list .page-3 .top-lines .line-5 .inner {
      background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas.32-yog151221161935@2x.png?max_age=19830212&d=20151224112832);
      background-size: 801px 538px;
      background-position: -610px -352px
    }

    .tpl-xmas .mod-img-list .page-3 .top-lines .line-6 .inner {
      background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas.32-yog151221161935@2x.png?max_age=19830212&d=20151224112832);
      background-size: 801px 538px;
      background-position: -484px 0
    }

    .tpl-xmas .mod-img-list .page-3 .top-lines .line-7 .inner {
      background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas.32-yog151221161935@2x.png?max_age=19830212&d=20151224112832);
      background-size: 801px 538px;
      background-position: -506px 0
    }

    .tpl-xmas .mod-img-list .page-3 .top-lines .line-8 .inner {
      background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas.32-yog151221161935@2x.png?max_age=19830212&d=20151224112832);
      background-size: 801px 538px;
      background-position: -681px 0
    }

    .tpl-xmas .mod-img-list .page-3 .top-lines .line-9 .inner {
      background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas.32-yog151221161935@2x.png?max_age=19830212&d=20151224112832);
      background-size: 801px 538px;
      background-position: -495px -192px
    }

    .tpl-xmas .mod-img-list .page-3 .decoration .tree {
      background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas.32-yog151221161935@2x.png?max_age=19830212&d=20151224112832);
      background-size: 801px 538px;
      background-position: -370px -198px
    }

    .tpl-xmas .mod-img-list .page-3 .decoration .gift-box {
      background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas.32-yog151221161935@2x.png?max_age=19830212&d=20151224112832);
      background-size: 801px 538px;
      background-position: -582px -125px
    }

    .tpl-xmas .mod-img-list .page-4 .bg-img .bell-l {
      background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas.32-yog151221161935@2x.png?max_age=19830212&d=20151224112832);
      background-size: 801px 538px;
      background-position: -695px -352px
    }

    .tpl-xmas .mod-img-list .page-4 .top-stars .star-1 {
      background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas.32-yog151221161935@2x.png?max_age=19830212&d=20151224112832);
      background-size: 801px 538px;
      background-position: -785px 0
    }

    .tpl-xmas .mod-img-list .page-4 .top-stars .star-2 {
      background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas.32-yog151221161935@2x.png?max_age=19830212&d=20151224112832);
      background-size: 801px 538px;
      background-position: -396px -514px
    }

    .tpl-xmas .mod-img-list .page-4 .top-stars .star-3 {
      background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas.32-yog151221161935@2x.png?max_age=19830212&d=20151224112832);
      background-size: 801px 538px;
      background-position: -785px -18px
    }

    .tpl-xmas .mod-img-list .page-4 .top-stars .star-4 {
      background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas.32-yog151221161935@2x.png?max_age=19830212&d=20151224112832);
      background-size: 801px 538px;
      background-position: -785px -18px
    }

    .tpl-xmas .mod-img-list .page-4 .top-stars .star-5 {
      background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas.32-yog151221161935@2x.png?max_age=19830212&d=20151224112832);
      background-size: 801px 538px;
      background-position: -547px -147px
    }

    .tpl-xmas .mod-img-list .page-4 .decoration .deer {
      background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas.32-yog151221161935@2x.png?max_age=19830212&d=20151224112832);
      background-size: 801px 538px;
      background-position: -203px -235px
    }

    .tpl-xmas .mod-img-list .page-4 .decoration .star-1 {
      background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas.32-yog151221161935@2x.png?max_age=19830212&d=20151224112832);
      background-size: 801px 538px;
      background-position: -547px -147px
    }

    .tpl-xmas .mod-img-list .page-4 .decoration .star-2 {
      background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas.32-yog151221161935@2x.png?max_age=19830212&d=20151224112832);
      background-size: 801px 538px;
      background-position: -547px -147px
    }

    .tpl-xmas .mod-img-list .page-4 .decoration .star-3 {
      background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas.32-yog151221161935@2x.png?max_age=19830212&d=20151224112832);
      background-size: 801px 538px;
      background-position: -785px -36px
    }

    .star-1 {
      background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas.32-yog151221161935@2x.png?max_age=19830212&d=20151224112832);
      background-size: 801px 538px;
      background-position: -785px -54px
    }

    .star-2 {
      background-image: url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-xmas.32-yog151221161935@2x.png?max_age=19830212&d=20151224112832);
      background-size: 801px 538px;
      background-position: -785px -72px
    }
  }


</style>
