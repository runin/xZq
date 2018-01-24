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
        flowers: []
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

      starFall: function(num){
        var self = this;
        self.density = num;
        for (var i = 0; i < self.density; i++) {
          var iclass = ((i % 5) + 1);
          this.flowers.push({
            class : "flower-"+ iclass
          })
        }
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
           console.warn('boxWidth: ' + boxWidth +'   boxHeight: ' + boxHeight +'   picWidth: ' + picWidth +'   picHeight: ' + picHeight);

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

        that.starFall(20);
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

  <section class="tpl-mv mod-os-ios tpl-new-year">
    <div id="j-body">
      <div class="wrap j-wrap">
        <div class="mod-img-wrap">
          <div class="j-tpl-wrap">
            <div v-if="isLoading" v-bind:class="{ animate : isLoading }" class="mod-tpl-cover j-mod-tpl-cover tpl-cover-anim">
                <div class="top-lines">
                  <div class="line pala-1"><div class="inner"></div></div>
                  <div class="line pala-2"><div class="inner"></div></div>
                  <div class="line lantern-3"><div class="inner"></div></div>
                  <div class="line lantern-4"><div class="inner"></div></div>
                  <div class="line pala-5"><div class="inner"></div></div>
                  <div class="line lantern-6"><div class="inner"></div></div>
                  <div class="curtain curtain-1"><div class="inner"></div></div>
                  <div class="curtain curtain-2"><div class="inner"></div></div>
                  <div class="curtain curtain-3"><div class="inner"></div></div>
                  <div class="curtain curtain-4"><div class="inner"></div></div>
                </div>
                <div class="title-info">
                  <div class="happy-new-year">
                    <i class="happy"></i>
                    <i class="new"></i>
                    <i class="year"></i>
                  </div>
                  <div class="infos">
                    <h1 class="title text-overflow j-album-title">{{ title }}</h1>
                    <span class="user text-overflow j-lazy-load-nickname">{{ author }}</span>
                  </div>
                </div>
                <div class="wealth-god">
                  <div class="hand l-hand"></div>
                  <div class="hand r-hand"></div>
                  <div class="body"></div>
                </div>
                <div class="bottom-decoration">
                  <div class="cloud cloud-1"></div>
                  <div class="cloud cloud-2"></div>
                  <div class="cloud cloud-3"></div>
                  <div class="cloud cloud-4"></div>
                </div>
            </div>
            <div v-if="!isLoading" class="mod-img-list j-img-list">
              <div v-for="(item, i) in items" v-bind:class="item.class" v-bind:style="{'display' : (item.isActive ? 'block' : 'none') }" class="item j-img-item animate">

                <div v-if="item.class['page-1'] == true">
                    <div class="bg-img">
                      <div class="img-w j-img-page" >
                        <img v-bind:style="item.imgStyle" v-bind:src="item.url" class="j-page-inner-move-img" />
                      </div>
                      <div class="text-area"><div class="inner"><img src="/static/photo/tmpl/newyear/page1.png"></div></div>
                    </div>
                    <div class="top-lines">
                      <span class="line line-1"><span class="inner"></span></span>
                      <span class="line line-2"><span class="inner"></span></span>
                      <span class="line lantern-1"><span class="inner"></span></span>
                      <span class="line lantern-2"><span class="inner"></span></span>
                    </div>
                    <div class="decoration">
                      <div class="cloud cloud-1"></div>
                      <div class="cloud cloud-2"></div>
                      <div class="cloud cloud-3"></div>
                      <div class="d-i fan"><div class="inner"></div></div>
                      <div class="d-i coins coins-1"><div class="inner"></div></div>
                      <div class="d-i coins coins-2"><div class="inner"></div></div>
                      <div class="d-i monkey">
                        <span class="body"></span>
                        <span class="l-hand"></span>
                        <span class="r-hand"></span>
                      </div>
                      <div class="d-i fukubukuro"></div>
                      <div class="d-i bullion"></div>
                      <div class="cloud cloud-4"></div>
                      <div class="d-i pala"><div class="inner"></div></div>
                    </div>
                </div>

                <div v-if="item.class['page-2'] == true">
                    <div class="bg-img">
                      <div class="img-w j-img-page" >
                        <img v-bind:style="item.imgStyle" v-bind:src="item.url" class="j-page-inner-move-img" />
                      </div>
                      <div class="text-area"><div class="inner"><img src="/static/photo/tmpl/newyear/page2.png"></div></div>
                    </div>
                    <div class="top-lines">
                      <span class="line line-1"><span class="inner"></span></span>
                      <span class="line lantern-3"><span class="inner"></span></span>
                      <span class="line pala-4"><span class="inner"></span></span>
                    </div>
                    <div class="decoration">
                      <div class="cloud cloud-1"></div>
                      <div class="red-bag bag-1"><div class="inner"></div></div>
                      <div class="cloud cloud-2"></div>
                      <div class="wealth-god">
                        <div class="inner">
                          <div class="hand l-hand"></div>
                          <div class="hand r-hand"></div>
                          <div class="body"></div>
                        </div>
                      </div>
                      <div class="red-bag bag-3"><div class="inner"></div></div>
                      <div class="red-bag bag-2"><div class="inner"></div></div>
                      <div class="cloud cloud-3"></div>
                    </div>
                </div>

                <div v-if="item.class['page-3'] == true">
                    <div class="bg-img">
                      <div class="img-w j-img-page" >
                        <img v-bind:style="item.imgStyle" v-bind:src="item.url" class="j-page-inner-move-img" />
                      </div>
                      <div class="text-area"><div class="inner"><img src="/static/photo/tmpl/newyear/page3.png"></div></div>
                    </div>
                    <div class="top-lines">
                      <div class="line pala-1"><div class="inner"></div></div>
                      <div class="line lantern-2"><div class="inner"></div></div>
                      <div class="line lantern-3"><div class="inner"></div></div>
                      <div class="line pala-4"><div class="inner"></div></div>
                      <div class="line lantern-5"><div class="inner"></div></div>
                    </div>
                    <div class="decoration">
                      <div class="cloud cloud-1"></div>
                      <div class="cloud cloud-2"></div>
                      <div class="cloud cloud-3"></div>
                      <div class="wealth-god">
                        <div class="inner">
                          <div class="hand l-hand"></div>
                          <div class="hand r-hand"></div>
                          <div class="body"></div>
                        </div>
                      </div>
                      <div class="d-i coins coins-1"><div class="inner"></div></div>
                      <div class="d-i coins coins-2"><div class="inner"></div></div>
                      <div class="d-i coins coins-3"><div class="inner"></div></div>
                      <div class="cloud cloud-4"></div>
                    </div>
                </div>

                <div v-if="item.class['page-4'] == true">
                    <div class="bg-img">
                      <div class="img-w j-img-page" >
                        <img v-bind:style="item.imgStyle" v-bind:src="item.url" class="j-page-inner-move-img" />
                      </div>
                      <div class="lantern"><div class="inner"></div></div>
                    </div>
                    <div class="decoration">
                      <div class="cloud cloud-1"></div>
                      <div class="d-i coins coins-1"><div class="inner"></div></div>
                      <div class="d-i coins coins-2"><div class="inner"></div></div>
                      <div class="d-i red-bag bag-2"><div class="inner"></div></div>
                      <div class="d-i red-bag bag-1"><div class="inner"></div></div>
                      <div class="d-i plum-tree">
                        <div class="inner"></div>
                        <div class="text-area"><div class="inner"><img src="/static/photo/tmpl/newyear/page4.png"></div>
                        </div>
                      </div>
                      <div class="d-i couplet">
                        <div class="inner"></div>
                      </div>
                      <div class="d-i bullion bullion-1"><div class="inner"></div></div>
                      <div class="d-i bullion bullion-2"><div class="inner"></div></div>
                      <div class="d-i chinese-knot"><div class="inner"></div></div>
                      <div class="cloud cloud-3"></div>
                    </div>
                </div>

              </div>
            </div>
            <div class="mod-flowers">
              <div v-for="(flower, i) in flowers" v-bind:id="flower.id" v-bind:class="flower.class" class="particle flower "></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
  html,body,div,span,iframe,h1,h2,h3,h4,h5,h6,p,blockquote,a,address,em,img,ol,ul,li,fieldset,form,label,legend,table,tbody,tfoot,thead,tr,th,td,i,b,s {
    margin:0;
    padding:0;
    border:0;
    font-weight:inherit;
    font-style:inherit;
    font-size:100%;
    font-family:Helvetica,'microsoft yahei',Arial
  }
  ul,ol {
    list-style:none
  }
  a img {
    border:none;
    vertical-align:top
  }
  a {
    text-decoration:none
  }
  button {
    overflow:visible;
    padding:0;
    margin:0;
    border:0 none;
    background-color:transparent
  }
  button::-moz-focus-inner {
    padding:0
  }
  textarea,input {
    background:none;
    padding:0;
    -webkit-border-radius:0;
    -moz-border-radius:0;
    border-radius:0;
    -webkit-appearance:none
  }
  input[type=password] {
    -webkit-text-security:disc
  }
  textarea:focus,input:focus,button:focus {
    outline:none
  }
  body {
    word-wrap:break-word
  }
  * {
    -webkit-tap-highlight-color:rgba(0,0,0,0)
  }
  .tpl-new-year .mod-tpl-cover {
  }
  .tpl-new-year .mod-img-list .item .bg-img .img-w .j-page-inner-move-img{
    max-width: inherit;
    -webkit-transform : translate3d(0px, 0px, 0px);
    position: absolute;
    left: 0;
    top: 0;
    -webkit-transition: -webkit-transform 3.5s;
    -webkit-transform-origin:0 0;
  }
  .tpl-new-year .mod-tpl-cover .top-lines {
     position:absolute;
     top:0;
     left:0;
     width:100%
   }
  .tpl-new-year .mod-tpl-cover .top-lines .curtain,.tpl-new-year .mod-tpl-cover .top-lines .line {
    position:absolute;
    top:0;
    left:0;
    width:100%
  }
  .tpl-new-year .mod-tpl-cover .top-lines .curtain .inner,.tpl-new-year .mod-tpl-cover .top-lines .line .inner {
    width:100%;
    background-size:100% auto;
    background-repeat:no-repeat
  }
  .tpl-new-year .mod-tpl-cover .top-lines .line .inner {
    width:100%;
    height:100%
  }
  .tpl-new-year .mod-tpl-cover .top-lines .curtain-1 .inner {
    background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/img/tpl-new-year/cover-top-1.32@2x.png?max_age=19830212&d=20160201145310);
    padding-top:18.7%
  }
  .tpl-new-year .mod-tpl-cover .top-lines .curtain-2 .inner {
    background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/img/tpl-new-year/cover-top-2.32@2x.png?max_age=19830212&d=20160201145310);
    padding-top:12.8%
  }
  .tpl-new-year .mod-tpl-cover .top-lines .curtain-3 .inner {
    background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/img/tpl-new-year/cover-top-3.32@2x.png?max_age=19830212&d=20160201145310);
    padding-top:14.9%
  }
  .tpl-new-year .mod-tpl-cover .top-lines .curtain-4 .inner {
    background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/img/tpl-new-year/cover-top-4.32@2x.png?max_age=19830212&d=20160201145310);
    padding-top:6.1%
  }
  .tpl-new-year .mod-tpl-cover .top-lines .pala-1 {
    width:46px;
    height:95px;
    top:55px;
    left:-10px
  }
  .tpl-new-year .mod-tpl-cover .top-lines .pala-1 .inner {
    background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year-cover-imp.32-yog160201145242.png?max_age=19830212&d=20160201145310);
    background-position:-347px 0
  }
  .tpl-new-year .mod-tpl-cover .top-lines .pala-2 {
    width:59px;
    height:154px;
    left:11%
  }
  .tpl-new-year .mod-tpl-cover .top-lines .pala-2 .inner {
    background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year-cover-imp.32-yog160201145242.png?max_age=19830212&d=20160201145310);
    background-position:-286px 0;
    width:59px;
    height:154px;
    left:11%
  }
  .tpl-new-year .mod-tpl-cover .top-lines .pala-5 {
    width:49px;
    height:158px;
    left:auto;
    right:8.2%
  }
  .tpl-new-year .mod-tpl-cover .top-lines .pala-5 .inner {
    background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year-cover-imp.32-yog160201145242.png?max_age=19830212&d=20160201145310);
    background-position:-235px 0;
    width:49px;
    height:158px;
    left:auto;
    right:8.2%
  }
  .tpl-new-year .mod-tpl-cover .top-lines .lantern-3 {
    width:23px;
    height:79px;
    left:36%
  }
  .tpl-new-year .mod-tpl-cover .top-lines .lantern-3 .inner {
    background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year-cover-imp.32-yog160201145242.png?max_age=19830212&d=20160201145310);
    background-position:-425px 0;
    width:23px;
    height:79px;
    left:36%
  }
  .tpl-new-year .mod-tpl-cover .top-lines .lantern-4 {
    width:28px;
    height:87px;
    left:auto;
    right:31%
  }
  .tpl-new-year .mod-tpl-cover .top-lines .lantern-4 .inner {
    background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year-cover-imp.32-yog160201145242.png?max_age=19830212&d=20160201145310);
    background-position:-395px 0;
    width:28px;
    height:87px;
    left:auto;
    right:31%
  }
  .tpl-new-year .mod-tpl-cover .top-lines .lantern-6 {
    width:38px;
    height:135px;
    left:auto;
    right:-10px
  }
  .tpl-new-year .mod-tpl-cover .top-lines .lantern-6 .inner {
    background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year-cover-imp.32-yog160201145242.png?max_age=19830212&d=20160201145310);
    background-position:-235px -160px
  }
  .tpl-new-year .mod-tpl-cover .title-info {
    position:absolute;
    top:24%;
    left:0;
    width:100%;
    text-align:center
  }
  .tpl-new-year .mod-tpl-cover .title-info .happy {
    display:block;
    width:180px;
    height:39px;
    margin:0 auto;
    background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year-cover-imp.32-yog160201145242.png?max_age=19830212&d=20160201145310);
    background-position:-275px -258px
  }
  .tpl-new-year .mod-tpl-cover .title-info .new {
    display:inline-block;
    width:91px;
    margin-right:10px;
    height:30px;
    background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year-cover-imp.32-yog160201145242.png?max_age=19830212&d=20160201145310);
    background-position:-450px 0
  }
  .tpl-new-year .mod-tpl-cover .title-info .year {
    display:inline-block;
    margin-right:-10px;
    width:110px;
    height:31px;
    background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year-cover-imp.32-yog160201145242.png?max_age=19830212&d=20160201145310);
    background-position:-347px -97px
  }
  .tpl-new-year .mod-tpl-cover .title-info .infos {
    margin:-20px auto 0;
    background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year-cover-imp.32-yog160201145242.png?max_age=19830212&d=20160201145310);
    background-position:-275px -160px;
    width: 266px;
    height: 97px;
    padding:26px 20px 0
  }
  .tpl-new-year .mod-tpl-cover .title-info .title {
    width:100%;
    text-align:center;
    border:1px solid transparent
  }
  .tpl-new-year .mod-tpl-cover .title-info .user {
    width:100%;
    display:block;
    border:1px solid transparent
  }
  .tpl-new-year .mod-tpl-cover .wealth-god {
    width:233px;
    height:247px;
    position:absolute;
    left:50%;
    margin-left:-116px;
    bottom:12%
  }
  .tpl-new-year .mod-tpl-cover .wealth-god .body {
    background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year-cover-imp.32-yog160201145242.png?max_age=19830212&d=20160201145310);
    background-position:0 0;
    width:233px;
    height:247px;
    margin:0 auto;
    z-index:2;
    position:absolute
  }
  .tpl-new-year .mod-tpl-cover .wealth-god .l-hand,.tpl-new-year .mod-tpl-cover .wealth-god .r-hand {
    position:absolute;
    top:45px;
    width:105px;
    height:51px
  }
  .tpl-new-year .mod-tpl-cover .wealth-god .l-hand {
    background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year-cover-imp.32-yog160201145242.png?max_age=19830212&d=20160201145310);
    background-position:0 -249px;
    left:-60px
  }
  .tpl-new-year .mod-tpl-cover .wealth-god .r-hand {
    background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year-cover-imp.32-yog160201145242.png?max_age=19830212&d=20160201145310);
    background-position:-107px -249px;
    right:-46px
  }
  .tpl-new-year .mod-tpl-cover .bottom-decoration {
    width:100%;
    position:absolute;
    bottom:0;
    left:0
  }
  .tpl-new-year .mod-tpl-cover .bottom-decoration .cloud {
    width:100%;
    position:absolute;
    bottom:0;
    left:0;
    background-size:100% auto;
    background-repeat:no-repeat
  }
  .tpl-new-year .mod-tpl-cover .bottom-decoration .cloud-1 {
    background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/img/tpl-new-year/cover-bottom-1.32@2x.png?max_age=19830212&d=20160201145310);
    padding-top:33.9%
  }
  .tpl-new-year .mod-tpl-cover .bottom-decoration .cloud-2 {
    background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/img/tpl-new-year/cover-bottom-2.32@2x.png?max_age=19830212&d=20160201145310);
    padding-top:18.7%
  }
  .tpl-new-year .mod-tpl-cover .bottom-decoration .cloud-3 {
    background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/img/tpl-new-year/cover-bottom-3.32@2x.png?max_age=19830212&d=20160201145310);
    padding-top:29.1%
  }
  .tpl-new-year .mod-tpl-cover .bottom-decoration .cloud-4 {
    background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/img/tpl-new-year/cover-bottom-4.32@2x.png?max_age=19830212&d=20160201145310);
    padding-top:19.5%
  }
  @media only screen and (-webkit-min-device-pixel-ratio:1.25),only screen and (min-resolution:120dpi),only screen and (min-resolution:1.25dppx) {
    .tpl-new-year .mod-tpl-cover .top-lines .pala-1 .inner {
      background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year-cover-imp.32-yog160201145242@2x.png?max_age=19830212&d=20160201145310);
      background-size:541px 300px;
      background-position:-347px 0
    }
    .tpl-new-year .mod-tpl-cover .top-lines .pala-2 .inner {
      background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year-cover-imp.32-yog160201145242@2x.png?max_age=19830212&d=20160201145310);
      background-size:541px 300px;
      background-position:-286px 0
    }
    .tpl-new-year .mod-tpl-cover .top-lines .pala-5 .inner {
      background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year-cover-imp.32-yog160201145242@2x.png?max_age=19830212&d=20160201145310);
      background-size:541px 300px;
      background-position:-235px 0
    }
    .tpl-new-year .mod-tpl-cover .top-lines .lantern-3 .inner {
      background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year-cover-imp.32-yog160201145242@2x.png?max_age=19830212&d=20160201145310);
      background-size:541px 300px;
      background-position:-425px 0
    }
    .tpl-new-year .mod-tpl-cover .top-lines .lantern-4 .inner {
      background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year-cover-imp.32-yog160201145242@2x.png?max_age=19830212&d=20160201145310);
      background-size:541px 300px;
      background-position:-395px 0
    }
    .tpl-new-year .mod-tpl-cover .top-lines .lantern-6 .inner {
      background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year-cover-imp.32-yog160201145242@2x.png?max_age=19830212&d=20160201145310);
      background-size:541px 300px;
      background-position:-235px -160px
    }
    .tpl-new-year .mod-tpl-cover .title-info .happy {
      background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year-cover-imp.32-yog160201145242@2x.png?max_age=19830212&d=20160201145310);
      background-size:541px 300px;
      background-position:-275px -258px
    }
    .tpl-new-year .mod-tpl-cover .title-info .new {
      background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year-cover-imp.32-yog160201145242@2x.png?max_age=19830212&d=20160201145310);
      background-size:541px 300px;
      background-position:-450px 0
    }
    .tpl-new-year .mod-tpl-cover .title-info .year {
      background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year-cover-imp.32-yog160201145242@2x.png?max_age=19830212&d=20160201145310);
      background-size:541px 300px;
      background-position:-347px -97px
    }
    .tpl-new-year .mod-tpl-cover .title-info .infos {
      background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year-cover-imp.32-yog160201145242@2x.png?max_age=19830212&d=20160201145310);
      background-size:541px 300px;
      background-position:-275px -160px
    }
    .tpl-new-year .mod-tpl-cover .wealth-god .body {
      background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year-cover-imp.32-yog160201145242@2x.png?max_age=19830212&d=20160201145310);
      background-size:541px 300px;
      background-position:0 0
    }
    .tpl-new-year .mod-tpl-cover .wealth-god .l-hand {
      background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year-cover-imp.32-yog160201145242@2x.png?max_age=19830212&d=20160201145310);
      background-size:541px 300px;
      background-position:0 -249px
    }
    .tpl-new-year .mod-tpl-cover .wealth-god .r-hand {
      background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year-cover-imp.32-yog160201145242@2x.png?max_age=19830212&d=20160201145310);
      background-size:541px 300px;
      background-position:-107px -249px
    }
  }* {
     background-repeat:no-repeat
   }
  .tpl-new-year .mod-img-wrap {
    background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/img/tpl-new-year/bg.jpg?max_age=19830212&d=20160201145310);
    background-size:cover
  }
  .text-overflow {
    display:block;
    white-space:nowrap;
    word-wrap:normal;
    word-break:break-all;
    overflow:hidden;
    text-overflow:ellipsis;
    max-width:100%;
    _width:100%
  }
  .tpl-new-year .mod-img-list {
    width:100%;
    height:100%;
    overflow:hidden;
    position:absolute;
    top:0;
    left:0
  }
  .tpl-new-year .mod-img-list .item {
    height:100%;
    width:100%;
    position:absolute;
    overflow:hidden;
    z-index:1
  }
  .tpl-new-year .mod-img-list .item .top-lines {
    position:absolute;
    top:0;
    left:0;
    width:100%
  }
  .tpl-new-year .mod-img-list .item .top-lines .line {
    position:absolute;
    top:0;
    right:0;
    display:block
  }
  .tpl-new-year .mod-img-list .item .top-lines .line .inner {
    width:100%;
    height:100%;
    display:block
  }
  .tpl-new-year .mod-img-list .item .bg-img {
    height:0;
    width:100%;
    position:absolute;
    background-size:100% auto;
    background-position:50% 50%;
    background-repeat:no-repeat
  }
  .tpl-new-year .mod-img-list .item .bg-img .img-w {
    width:100%;
    height:100%;
    overflow:hidden;
    position:absolute;
    top:0;
    left:0
  }
  .tpl-new-year .mod-img-list .item .bg-img .text-area {
    font-size:16px;
    color:#c13734;
    border:1px solid transparent;
    position:absolute
  }
  .tpl-new-year .mod-img-list .item .decoration {
    position:absolute;
    width:100%;
    bottom:0;
    left:0
  }
  .tpl-new-year .mod-img-list .item .top-lines {
    position:absolute;
    top:0;
    left:0;
    width:100%
  }
  .tpl-new-year .mod-img-list .page-1 .bg-img {
    padding-top:80%;
    top:14%
  }
  .tpl-new-year .mod-img-list .page-1 .bg-img .text-area {
    width:130px;
    right:10px;
    top:102%
  }
  .tpl-new-year .mod-img-list .page-1 .top-lines {
    top:-15px
  }
  .tpl-new-year .mod-img-list .page-1 .top-lines .line-1 {
    width:99px;
    height:151px;
    right:20%
  }
  .tpl-new-year .mod-img-list .page-1 .top-lines .line-1 .inner {
    background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year.32-yog160201145242.png?max_age=19830212&d=20160201145310);
    background-position:-1078px 0
  }
  .tpl-new-year .mod-img-list .page-1 .top-lines .line-2 {
    width:88px;
    height:172px;
    right:9%
  }
  .tpl-new-year .mod-img-list .page-1 .top-lines .line-2 .inner {
    background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year.32-yog160201145242.png?max_age=19830212&d=20160201145310);
    background-position:-772px 0
  }
  .tpl-new-year .mod-img-list .page-1 .top-lines .lantern-1 {
    width:53px;
    height:140px;
    left:12px
  }
  .tpl-new-year .mod-img-list .page-1 .top-lines .lantern-1 .inner {
    background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year.32-yog160201145242.png?max_age=19830212&d=20160201145310);
    background-position:-923px -160px
  }
  .tpl-new-year .mod-img-list .page-1 .top-lines .lantern-2 {
    width:33px;
    height:94px;
    left:31.6%
  }
  .tpl-new-year .mod-img-list .page-1 .top-lines .lantern-2 .inner {
    background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year.32-yog160201145242.png?max_age=19830212&d=20160201145310);
    background-position:-494px -203px
  }
  .tpl-new-year .mod-img-list .page-1 .decoration {
    position:absolute;
    bottom:0;
    left:0
  }
  .tpl-new-year .mod-img-list .page-1 .decoration .cloud {
    width:100%;
    height:0;
    position:absolute;
    bottom:0;
    left:0;
    background-size:100% auto;
    background-repeat:no-repeat
  }
  .tpl-new-year .mod-img-list .page-1 .decoration .cloud-1 {
    background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/img/tpl-new-year/p2-bottom-1.32@2x.png?max_age=19830212&d=20160201145310);
    padding-top:25.9%
  }
  .tpl-new-year .mod-img-list .page-1 .decoration .cloud-2 {
    background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/img/tpl-new-year/p2-bottom-2.32@2x.png?max_age=19830212&d=20160201145310);
    padding-top:17.9%
  }
  .tpl-new-year .mod-img-list .page-1 .decoration .cloud-3 {
    background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/img/tpl-new-year/p2-bottom-3.32@2x.png?max_age=19830212&d=20160201145310);
    padding-top:29.6%
  }
  .tpl-new-year .mod-img-list .page-1 .decoration .cloud-4 {
    background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/img/tpl-new-year/p2-bottom-4.32@2x.png?max_age=19830212&d=20160201145310);
    padding-top:17.6%
  }
  .tpl-new-year .mod-img-list .page-1 .decoration .d-i {
    position:absolute
  }
  .tpl-new-year .mod-img-list .page-1 .decoration .d-i .inner {
    width:100%;
    height:100%
  }
  .tpl-new-year .mod-img-list .page-1 .decoration .pala {
    width:99px;
    height:85px;
    position:absolute;
    right:-20px;
    bottom:50px
  }
  .tpl-new-year .mod-img-list .page-1 .decoration .pala .inner {
    background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year.32-yog160201145242.png?max_age=19830212&d=20160201145310);
    background-position:-1150px -153px
  }
  .tpl-new-year .mod-img-list .page-1 .decoration .fan {
    width:87px;
    height:58px;
    left:-35px;
    bottom:42px
  }
  .tpl-new-year .mod-img-list .page-1 .decoration .fan .inner {
    background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year.32-yog160201145242.png?max_age=19830212&d=20160201145310);
    background-position:-1084px -241px
  }
  .tpl-new-year .mod-img-list .page-1 .decoration .monkey {
    width:130px;
    height:201px;
    left:30px;
    bottom:0
  }
  .tpl-new-year .mod-img-list .page-1 .decoration .body {
    display:block;
    background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year.32-yog160201145242.png?max_age=19830212&d=20160201145310);
    background-position:-446px 0;
    width:130px;
    height:201px
  }
  .tpl-new-year .mod-img-list .page-1 .decoration .l-hand {
    background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year.32-yog160201145242.png?max_age=19830212&d=20160201145310);
    background-position:-1179px -72px;
    width:75px;
    height:68px;
    position:absolute;
    top:63px;
    left:-35px
  }
  .tpl-new-year .mod-img-list .page-1 .decoration .r-hand {
    background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year.32-yog160201145242.png?max_age=19830212&d=20160201145310);
    background-position:-1251px -142px;
    width:80px;
    height:65px;
    position:absolute;
    top:70px;
    right:-32px
  }
  .tpl-new-year .mod-img-list .page-1 .decoration .bullion {
    background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year.32-yog160201145242.png?max_age=19830212&d=20160201145310);
    background-position:-1251px -209px;
    width:90px;
    height:61px;
    left:26.6%;
    bottom:10px
  }
  .tpl-new-year .mod-img-list .page-1 .decoration .fukubukuro {
    background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year.32-yog160201145242.png?max_age=19830212&d=20160201145310);
    background-position:-1179px 0;
    width:70px;
    height:70px;
    left:50%;
    bottom:10px
  }
  .tpl-new-year .mod-img-list .page-1 .decoration .coins {
    width:47px;
    height:47px;
    background-repeat:no-repeat
  }
  .tpl-new-year .mod-img-list .page-1 .decoration .coins .inner {
    background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year.32-yog160201145242.png?max_age=19830212&d=20160201145310);
    background-position:-529px -203px;
    display:block;
    width:100%;
    height:100%
  }
  .tpl-new-year .mod-img-list .page-1 .decoration .coins-1 {
    bottom:84px;
    left:58%
  }
  .tpl-new-year .mod-img-list .page-1 .decoration .coins-1 .inner {
    -webkit-transform:scale(0.8)
  }
  .tpl-new-year .mod-img-list .page-1 .decoration .coins-2 {
    bottom:54px;
    left:45%
  }
  .tpl-new-year .mod-img-list .page-1 .decoration .coins-2 .inner {
    -webkit-transform:scale(0.5)
  }
  .tpl-new-year .mod-img-list .page-2 .bg-img {
    padding-top:80%;
    top:19%
  }
  .tpl-new-year .mod-img-list .page-2 .bg-img .text-area {
    width:150px;
    left:10px;
    top:102%
  }
  .tpl-new-year .mod-img-list .page-2 .top-lines .line-1 {
    width:80px;
    height:210px;
    left:9%;
    top:-40px
  }
  .tpl-new-year .mod-img-list .page-2 .top-lines .line-1 .inner {
    background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year.32-yog160201145242.png?max_age=19830212&d=20160201145310);
    background-position:-364px 0
  }
  .tpl-new-year .mod-img-list .page-2 .top-lines .lantern-3 {
    width:45px;
    height:103px;
    left:auto;
    right:32.4%
  }
  .tpl-new-year .mod-img-list .page-2 .top-lines .lantern-3 .inner {
    background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year.32-yog160201145242.png?max_age=19830212&d=20160201145310);
    background-position:-578px -197px
  }
  .tpl-new-year .mod-img-list .page-2 .top-lines .pala-4 {
    width:59px;
    height:167px;
    left:auto;
    right:9.6%;
    top:-10px
  }
  .tpl-new-year .mod-img-list .page-2 .top-lines .pala-4 .inner {
    background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year.32-yog160201145242.png?max_age=19830212&d=20160201145310);
    background-position:-862px 0
  }
  .tpl-new-year .mod-img-list .page-2 .decoration .wealth-god {
    width:233px;
    height:247px;
    position:absolute;
    right:-10px;
    bottom:12%;
    -webkit-transform:scale(0.8) rotate(-10deg)
  }
  .tpl-new-year .mod-img-list .page-2 .decoration .wealth-god .inner {
    position:absolute;
    width:100%;
    height:100%;
    top:0;
    left:0
  }
  .tpl-new-year .mod-img-list .page-2 .decoration .wealth-god .body {
    background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year.32-yog160201145242.png?max_age=19830212&d=20160201145310);
    background-position:-129px 0;
    width:233px;
    height:247px;
    margin:0 auto;
    z-index:2;
    position:absolute
  }
  .tpl-new-year .mod-img-list .page-2 .decoration .wealth-god .l-hand,.tpl-new-year .mod-img-list .page-2 .decoration .wealth-god .r-hand {
    position:absolute;
    top:45px;
    width:105px;
    height:51px
  }
  .tpl-new-year .mod-img-list .page-2 .decoration .wealth-god .l-hand {
    background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year.32-yog160201145242.png?max_age=19830212&d=20160201145310);
    background-position:-129px -249px;
    left:-60px
  }
  .tpl-new-year .mod-img-list .page-2 .decoration .wealth-god .r-hand {
    background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year.32-yog160201145242.png?max_age=19830212&d=20160201145310);
    background-position:-236px -249px;
    right:-46px
  }
  .tpl-new-year .mod-img-list .page-2 .decoration .red-bag {
    position:absolute
  }
  .tpl-new-year .mod-img-list .page-2 .decoration .red-bag .inner {
    width:100%;
    height:100%
  }
  .tpl-new-year .mod-img-list .page-2 .decoration .bag-1 {
    width:40px;
    height:47px;
    left:10px;
    bottom:50px
  }
  .tpl-new-year .mod-img-list .page-2 .decoration .bag-1 .inner {
    background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year.32-yog160201145242.png?max_age=19830212&d=20160201145310);
    background-position:-529px -252px
  }
  .tpl-new-year .mod-img-list .page-2 .decoration .bag-2 {
    width:64px;
    height:86px;
    left:68px;
    bottom:10px
  }
  .tpl-new-year .mod-img-list .page-2 .decoration .bag-2 .inner {
    background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year.32-yog160201145242.png?max_age=19830212&d=20160201145310);
    background-position:-1084px -153px
  }
  .tpl-new-year .mod-img-list .page-2 .decoration .bag-3 {
    width:50px;
    height:67px;
    left:125px;
    bottom:2px
  }
  .tpl-new-year .mod-img-list .page-2 .decoration .bag-3 .inner {
    background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year.32-yog160201145242.png?max_age=19830212&d=20160201145310);
    background-position:-394px -212px
  }
  .tpl-new-year .mod-img-list .page-2 .decoration .cloud {
    width:100%;
    height:0;
    position:absolute;
    bottom:-1px;
    left:0;
    background-size:100% auto;
    background-repeat:no-repeat
  }
  .tpl-new-year .mod-img-list .page-2 .decoration .cloud-1 {
    background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/img/tpl-new-year/p3-bottom-cloud-1.32@2x.png?max_age=19830212&d=20160201145310);
    padding-top:23.5%
  }
  .tpl-new-year .mod-img-list .page-2 .decoration .cloud-2 {
    background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/img/tpl-new-year/p3-bottom-cloud-2.32@2x.png?max_age=19830212&d=20160201145310);
    padding-top:19.5%
  }
  .tpl-new-year .mod-img-list .page-2 .decoration .cloud-3 {
    background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/img/tpl-new-year/p3-bottom-cloud-3.32@2x.png?max_age=19830212&d=20160201145310);
    padding-top:11.5%
  }
  .tpl-new-year .mod-img-list .page-3 .bg-img {
    padding-top:80%;
    top:13.8%
  }
  .tpl-new-year .mod-img-list .page-3 .bg-img .text-area {
    width:150px;
    right:10px;
    top:102%
  }
  .tpl-new-year .mod-img-list .page-3 .top-lines {
    top:-15px
  }
  .tpl-new-year .mod-img-list .page-3 .top-lines .pala-1 {
    width:46px;
    height:95px;
    top:15px;
    left:-10px
  }
  .tpl-new-year .mod-img-list .page-3 .top-lines .pala-1 .inner {
    background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year.32-yog160201145242.png?max_age=19830212&d=20160201145310);
    background-position:-446px -203px
  }
  .tpl-new-year .mod-img-list .page-3 .top-lines .pala-4 {
    width:49px;
    height:158px;
    left:auto;
    right:9.6%;
    top:-10px
  }
  .tpl-new-year .mod-img-list .page-3 .top-lines .pala-4 .inner {
    background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year.32-yog160201145242.png?max_age=19830212&d=20160201145310);
    background-position:-923px 0;
    width:49px;
    height:158px;
    left:auto;
    right:8.2%
  }
  .tpl-new-year .mod-img-list .page-3 .top-lines .lantern-2 {
    width:38px;
    height:135px;
    left:21%;
    top:-25px
  }
  .tpl-new-year .mod-img-list .page-3 .top-lines .lantern-2 .inner {
    background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year.32-yog160201145242.png?max_age=19830212&d=20160201145310);
    background-position:-978px -158px
  }
  .tpl-new-year .mod-img-list .page-3 .top-lines .lantern-3 {
    width:28px;
    height:87px;
    left:auto;
    right:32.4%
  }
  .tpl-new-year .mod-img-list .page-3 .top-lines .lantern-3 .inner {
    background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year.32-yog160201145242.png?max_age=19830212&d=20160201145310);
    background-position:-364px -212px
  }
  .tpl-new-year .mod-img-list .page-3 .top-lines .lantern-5 {
    width:38px;
    height:135px;
    left:auto;
    right:-4px
  }
  .tpl-new-year .mod-img-list .page-3 .top-lines .lantern-5 .inner {
    background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year.32-yog160201145242.png?max_age=19830212&d=20160201145310);
    background-position:-978px -158px
  }
  .tpl-new-year .mod-img-list .page-3 .decoration {
  }.tpl-new-year .mod-img-list .page-3 .decoration .cloud {
     width:100%;
     height:0;
     position:absolute;
     bottom:0;
     left:0;
     background-size:100% auto;
     background-repeat:no-repeat
   }
  .tpl-new-year .mod-img-list .page-3 .decoration .cloud-1 {
    background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/img/tpl-new-year/p2-bottom-1.32@2x.png?max_age=19830212&d=20160201145310);
    padding-top:25.9%
  }
  .tpl-new-year .mod-img-list .page-3 .decoration .cloud-2 {
    background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/img/tpl-new-year/p2-bottom-2.32@2x.png?max_age=19830212&d=20160201145310);
    padding-top:17.9%
  }
  .tpl-new-year .mod-img-list .page-3 .decoration .cloud-3 {
    background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/img/tpl-new-year/p2-bottom-3.32@2x.png?max_age=19830212&d=20160201145310);
    padding-top:29.6%
  }
  .tpl-new-year .mod-img-list .page-3 .decoration .cloud-4 {
    background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/img/tpl-new-year/p2-bottom-4.32@2x.png?max_age=19830212&d=20160201145310);
    padding-top:17.6%
  }
  .tpl-new-year .mod-img-list .page-3 .decoration .wealth-god {
    width:192px;
    height:195px;
    position:absolute;
    left:30px;
    bottom:10px
  }
  .tpl-new-year .mod-img-list .page-3 .decoration .wealth-god .inner {
    position:absolute;
    width:100%;
    height:100%;
    top:0;
    left:0
  }
  .tpl-new-year .mod-img-list .page-3 .decoration .wealth-god .body {
    background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year.32-yog160201145242.png?max_age=19830212&d=20160201145310);
    background-position:-578px 0;
    width:192px;
    height:195px;
    position:absolute
  }
  .tpl-new-year .mod-img-list .page-3 .decoration .wealth-god .l-hand,.tpl-new-year .mod-img-list .page-3 .decoration .wealth-god .r-hand {
    position:absolute;
    top:45px;
    width:105px;
    height:51px
  }
  .tpl-new-year .mod-img-list .page-3 .decoration .wealth-god .l-hand {
    background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year.32-yog160201145242.png?max_age=19830212&d=20160201145310);
    background-position:-129px -249px;
    left:-60px
  }
  .tpl-new-year .mod-img-list .page-3 .decoration .wealth-god .r-hand {
    background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year.32-yog160201145242.png?max_age=19830212&d=20160201145310);
    background-position:-236px -249px;
    right:-46px
  }
  .tpl-new-year .mod-img-list .page-3 .decoration .coins {
    position:absolute;
    width:47px;
    height:47px;
    background-repeat:no-repeat
  }
  .tpl-new-year .mod-img-list .page-3 .decoration .coins .inner {
    background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year.32-yog160201145242.png?max_age=19830212&d=20160201145310);
    background-position:-529px -203px;
    display:block;
    width:100%;
    height:100%
  }
  .tpl-new-year .mod-img-list .page-3 .decoration .coins-1 {
    bottom:85px;
    left:-10px
  }
  .tpl-new-year .mod-img-list .page-3 .decoration .coins-1 .inner {
    -webkit-transform:scale(0.8)
  }
  .tpl-new-year .mod-img-list .page-3 .decoration .coins-2 {
    bottom:36px;
    left:auto;
    right:27.7%
  }
  .tpl-new-year .mod-img-list .page-3 .decoration .coins-2 .inner {
  }.tpl-new-year .mod-img-list .page-3 .decoration .coins-3 {
     bottom:54px;
     left:auto;
     right:14.2%
   }
  .tpl-new-year .mod-img-list .page-3 .decoration .coins-3 .inner {
    -webkit-transform:scale(0.7)
  }
  .tpl-new-year .mod-img-list .page-4 .bg-img {
    padding-top:80%;
    top:0;
    z-index:1
  }
  .tpl-new-year .mod-img-list .page-4 .bg-img .lantern {
    position:absolute;
    right:25px;
    bottom:-25px;
    width:64px;
    height:100px
  }
  .tpl-new-year .mod-img-list .page-4 .bg-img .lantern .inner {
    background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year.32-yog160201145242.png?max_age=19830212&d=20160201145310);
    background-position:-1018px -158px;
    width:100%;
    height:100%
  }
  .tpl-new-year .mod-img-list .page-4 .bg-img .text-area {
    border:1px solid transparent;
    width:140px;
    right:10px;
    top:145%
  }
  .tpl-new-year .mod-img-list .page-4 .decoration {
    height:100%;
    z-index:1
  }
  .tpl-new-year .mod-img-list .page-4 .decoration .d-i {
    position:absolute
  }
  .tpl-new-year .mod-img-list .page-4 .decoration .cloud {
    width:100%;
    height:0;
    position:absolute;
    bottom:0;
    left:0;
    background-size:100% auto;
    background-repeat:no-repeat;
    -webkit-transform:rotateY(180deg)
  }
  .tpl-new-year .mod-img-list .page-4 .decoration .cloud-1 {
    background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/img/tpl-new-year/p3-bottom-cloud-1.32@2x.png?max_age=19830212&d=20160201145310);
    padding-top:23.5%;
    bottom:-22px
  }
  .tpl-new-year .mod-img-list .page-4 .decoration .cloud-3 {
    background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/img/tpl-new-year/p3-bottom-cloud-3.32@2x.png?max_age=19830212&d=20160201145310);
    padding-top:11.5%
  }
  .tpl-new-year .mod-img-list .page-4 .decoration .plum-tree {
    left:0;
    bottom:28%;
    width:276px;
    height:103px
  }
  .tpl-new-year .mod-img-list .page-4 .decoration .plum-tree .inner {
    width:276px;
    height:103px;
    background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year.32-yog160201145242.png?max_age=19830212&d=20160201145310);
    background-position:-625px -197px
  }
  .tpl-new-year .mod-img-list .page-4 .decoration .plum-tree .text-area {
    font-size:16px;
    width:120px;
    border:1px solid transparent;
    color:#e52a1a;
    position:absolute;
    left:180px;
    top:110px
  }
  .tpl-new-year .mod-img-list .page-4 .decoration .plum-tree .text-area .inner {
    height:auto;
    width:auto;
    background-image:none
  }
  .tpl-new-year .mod-img-list .page-4 .decoration .chinese-knot {
    right:-10px;
    bottom:-40px;
    width:102px;
    height:156px;
    background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year.32-yog160201145242.png?max_age=19830212&d=20160201145310);
    background-position:-974px 0
  }
  .tpl-new-year .mod-img-list .page-4 .decoration .bullion-1 {
    left:-18px;
    bottom:4%;
    width:97px;
    height:67px
  }
  .tpl-new-year .mod-img-list .page-4 .decoration .bullion-1 .inner {
    background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year.32-yog160201145242.png?max_age=19830212&d=20160201145310);
    background-position:-1251px 0;
    width:100%;
    height:100%
  }
  .tpl-new-year .mod-img-list .page-4 .decoration .bullion-2 {
    left:39%;
    bottom:0;
    width:79px;
    height:55px
  }
  .tpl-new-year .mod-img-list .page-4 .decoration .bullion-2 .inner {
    width:79px;
    height:55px;
    background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year.32-yog160201145242.png?max_age=19830212&d=20160201145310);
    background-position:-1256px -69px
  }
  .tpl-new-year .mod-img-list .page-4 .decoration .bag-1 {
    width:64px;
    height:86px;
    right:30%;
    bottom:10px
  }
  .tpl-new-year .mod-img-list .page-4 .decoration .bag-1 .inner {
    background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year.32-yog160201145242.png?max_age=19830212&d=20160201145310);
    background-position:-1084px -153px;
    width:100%;
    height:100%
  }
  .tpl-new-year .mod-img-list .page-4 .decoration .bag-2 {
    width:50px;
    height:67px;
    right:21%;
    bottom:10px
  }
  .tpl-new-year .mod-img-list .page-4 .decoration .bag-2 .inner {
    background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year.32-yog160201145242.png?max_age=19830212&d=20160201145310);
    background-position:-394px -212px;
    width:100%;
    height:100%
  }
  .tpl-new-year .mod-img-list .page-4 .decoration .coins {
    position:absolute;
    width:47px;
    height:47px;
    background-repeat:no-repeat
  }
  .tpl-new-year .mod-img-list .page-4 .decoration .coins .inner {
    background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year.32-yog160201145242.png?max_age=19830212&d=20160201145310);
    background-position:-529px -203px;
    display:block;
    width:100%;
    height:100%
  }
  .tpl-new-year .mod-img-list .page-4 .decoration .coins-1 {
    right:17%;
    bottom:55px
  }
  .tpl-new-year .mod-img-list .page-4 .decoration .coins-2 {
    right:44%;
    bottom:50px
  }
  .tpl-new-year .mod-img-list .page-4 .decoration .coins-2 .inner {
    -webkit-transform:scale(0.7)
  }
  .tpl-new-year .mod-img-list .page-4 .decoration .couplet {
    width:127px;
    height:278px;
    left:25px;
    bottom:25px
  }
  .tpl-new-year .mod-img-list .page-4 .decoration .couplet .inner {
    background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year.32-yog160201145242.png?max_age=19830212&d=20160201145310);
    background-position:0 0;
    width:127px;
    height:278px
  }
  @media only screen and (max-device-height:480px) and (max-device-width:414px) {
    .tpl-new-year .mod-tpl-cover .top-lines,.tpl-new-year .mod-tpl-cover .title-info .happy-new-year,.tpl-new-year .mod-tpl-cover .bottom-decoration .cloud {
      zoom:.7
    }
    .tpl-new-year .mod-tpl-cover .title-info .infos {
      zoom:.8
    }
    .tpl-new-year .mod-tpl-cover .wealth-god {
      zoom:.6
    }
    .tpl-new-year .mod-img-list .page-1 .bg-img {
      /*padding-top:70%;*/
      top:12%
    }
    .tpl-new-year .mod-img-list .page-1 .top-lines,.tpl-new-year .mod-img-list .page-1 .decoration .monkey,.tpl-new-year .mod-img-list .page-1 .decoration .bullion,.tpl-new-year .mod-img-list .page-1 .decoration .fukubukuro,.tpl-new-year .mod-img-list .page-1 .decoration .pala,.tpl-new-year .mod-img-list .page-1 .decoration .cloud {
      zoom:.7
    }
    .tpl-new-year .mod-img-list .page-1 .decoration .coins-1 {
      bottom:30px
    }
    .tpl-new-year .mod-img-list .page-1 .decoration .coins-2 {
      bottom:25px
    }
    .tpl-new-year .mod-img-list .page-2 .top-lines .line-1,.tpl-new-year .mod-img-list .page-2 .top-lines .pala-4 {
      zoom:.6
    }
    .tpl-new-year .mod-img-list .page-2 .bg-img {
      /*padding-top:65%;*/
      top:15%
    }
    .tpl-new-year .mod-img-list .page-2 .bg-img .text-area {
      width:130px
    }
    .tpl-new-year .mod-img-list .page-2 .decoration .wealth-god,.tpl-new-year .mod-img-list .page-2 .decoration .cloud,.tpl-new-year .mod-img-list .page-2 .decoration .red-bag {
      zoom:.7
    }
    .tpl-new-year .mod-img-list .page-3 .top-lines .line {
      zoom:.8
    }
    .tpl-new-year .mod-img-list .page-3 .bg-img {
      /*padding-top:65%*/
    }
    .tpl-new-year .mod-img-list .page-3 .bg-img .text-area {
      width:130px
    }
    .tpl-new-year .mod-img-list .page-3 .decoration .wealth-god,.tpl-new-year .mod-img-list .page-3 .decoration .cloud {
      zoom:.7
    }
    .tpl-new-year .mod-img-list .page-4 .decoration .couplet {
      zoom:.6
    }
    .tpl-new-year .mod-img-list .page-4 .decoration .plum-tree {
      bottom:22%
    }
    .tpl-new-year .mod-img-list .page-4 .decoration .plum-tree .inner {
      zoom:.7
    }
    .tpl-new-year .mod-img-list .page-4 .decoration .plum-tree .text-area {
      left:160px;
      top:70px
    }
    .tpl-new-year .mod-img-list .page-4 .decoration .plum-tree .text-area .inner {
      zoom:.9
    }
    .tpl-new-year .mod-img-list .page-4 .bg-img .lantern,.tpl-new-year .mod-img-list .page-4 .decoration .bullion,.tpl-new-year .mod-img-list .page-4 .decoration .red-bag,.tpl-new-year .mod-img-list .page-4 .decoration .coins,.tpl-new-year .mod-img-list .page-4 .decoration .chinese-knot {
      zoom:.7
    }
  }
  @media only screen and (-webkit-device-pixel-ratio:2) and (max-device-width:414px) and (min-device-height:500px) {
    .tpl-new-year .mod-tpl-cover .top-lines,.tpl-new-year .mod-tpl-cover .title-info .happy-new-year,.tpl-new-year .mod-tpl-cover .bottom-decoration .cloud {
      zoom:.8
    }
    .tpl-new-year .mod-tpl-cover .title-info .infos {
      zoom:.9
    }
    .tpl-new-year .mod-tpl-cover .wealth-god {
      zoom:.8
    }
    .tpl-new-year .mod-img-list .page-1 .bg-img {
      top:12%
    }
    .tpl-new-year .mod-img-list .page-1 .top-lines,.tpl-new-year .mod-img-list .page-1 .top-lines,.tpl-new-year .mod-img-list .page-1 .decoration .bullion,.tpl-new-year .mod-img-list .page-1 .decoration .fukubukuro,.tpl-new-year .mod-img-list .page-1 .decoration .pala,.tpl-new-year .mod-img-list .page-1 .decoration .cloud {
      zoom:.7
    }
    .tpl-new-year .mod-img-list .page-1 .decoration .monkey {
      zoom:.8
    }
    .tpl-new-year .mod-img-list .page-1 .decoration .coins-1 {
      bottom:44px
    }
    .tpl-new-year .mod-img-list .page-1 .decoration .coins-2 {
      bottom:34px
    }
    .tpl-new-year .mod-img-list .page-2 .top-lines .line-1,.tpl-new-year .mod-img-list .page-2 .top-lines .pala-4 {
      zoom:.7
    }
    .tpl-new-year .mod-img-list .page-2 .bg-img {
      /*padding-top:70%;*/
      top:15%
    }
    .tpl-new-year .mod-img-list .page-2 .bg-img .text-area {
      width:130px
    }
    .tpl-new-year .mod-img-list .page-2 .decoration .wealth-god {
      zoom:.7
    }
    .tpl-new-year .mod-img-list .page-2 .decoration .cloud,.tpl-new-year .mod-img-list .page-2 .decoration .red-bag {
      zoom:.8
    }
    .tpl-new-year .mod-img-list .page-3 .decoration .wealth-god,.tpl-new-year .mod-img-list .page-3 .decoration .cloud {
      zoom:.8
    }
    .tpl-new-year .mod-img-list .page-4 .decoration .couplet {
      zoom:.8
    }
    .tpl-new-year .mod-img-list .page-4 .bg-img .lantern,.tpl-new-year .mod-img-list .page-4 .decoration .bullion,.tpl-new-year .mod-img-list .page-4 .decoration .red-bag,.tpl-new-year .mod-img-list .page-4 .decoration .coins,.tpl-new-year .mod-img-list .page-4 .decoration .chinese-knot {
      zoom:.8
    }
  }@media only screen and (min-device-height:667px) and (max-device-width:414px) and (-webkit-device-pixel-ratio:2) {
    .tpl-new-year .mod-tpl-cover .top-lines,.tpl-new-year .mod-tpl-cover .title-info .happy-new-year,.tpl-new-year .mod-tpl-cover .bottom-decoration .cloud {
      zoom:1
    }
    .tpl-new-year .mod-tpl-cover .title-info .infos {
      zoom:1
    }
    .tpl-new-year .mod-tpl-cover .wealth-god {
      zoom:.9
    }
    .tpl-new-year .mod-img-list .page-1 .top-lines,.tpl-new-year .mod-img-list .page-1 .decoration .monkey,.tpl-new-year .mod-img-list .page-1 .decoration .bullion,.tpl-new-year .mod-img-list .page-1 .decoration .fukubukuro,.tpl-new-year .mod-img-list .page-1 .decoration .pala,.tpl-new-year .mod-img-list .page-1 .decoration .cloud {
      zoom:1
    }
    .tpl-new-year .mod-img-list .page-1 .decoration .coins-1 {
      bottom:44px
    }
    .tpl-new-year .mod-img-list .page-1 .decoration .coins-2 {
      bottom:34px
    }
    .tpl-new-year .mod-img-list .page-2 .bg-img {
      padding-top:80%;
      top:15%
    }
    .tpl-new-year .mod-img-list .page-2 .decoration .wealth-god,.tpl-new-year .mod-img-list .page-2 .decoration .cloud,.tpl-new-year .mod-img-list .page-2 .decoration .red-bag {
      zoom:.9
    }
    .tpl-new-year .mod-img-list .page-3 .decoration .wealth-god,.tpl-new-year .mod-img-list .page-3 .decoration .cloud {
      zoom:1
    }
    .tpl-new-year .mod-img-list .page-4 .decoration .couplet,.tpl-new-year .mod-img-list .page-4 .bg-img .lantern,.tpl-new-year .mod-img-list .page-4 .decoration .bullion,.tpl-new-year .mod-img-list .page-4 .decoration .red-bag,.tpl-new-year .mod-img-list .page-4 .decoration .coins,.tpl-new-year .mod-img-list .page-4 .decoration .chinese-knot {
      zoom:1
    }
  }@media only screen and (min-device-height:736px) and (max-device-width:414px) and (-webkit-device-pixel-ratio:3) {
  }@media only screen and (min-device-height:800px) and (min-device-width:400px) {
    .tpl-new-year .mod-tpl-cover .top-lines,.tpl-new-year .mod-tpl-cover .title-info .happy-new-year,.tpl-new-year .mod-tpl-cover .bottom-decoration .cloud {
      zoom:.7
    }
    .tpl-new-year .mod-tpl-cover .title-info .infos {
      zoom:.8;
      padding-top:31px;
      height:65px
    }
    .tpl-new-year .mod-tpl-cover .wealth-god {
      zoom:.6
    }
    .tpl-new-year .mod-img-list .page-1 .bg-img {
      /*padding-top:70%;*/
      top:12%
    }
    .tpl-new-year .mod-img-list .page-1 .top-lines,.tpl-new-year .mod-img-list .page-1 .decoration .monkey,.tpl-new-year .mod-img-list .page-1 .decoration .bullion,.tpl-new-year .mod-img-list .page-1 .decoration .fukubukuro,.tpl-new-year .mod-img-list .page-1 .decoration .pala,.tpl-new-year .mod-img-list .page-1 .decoration .cloud {
      zoom:.7
    }
    .tpl-new-year .mod-img-list .page-1 .decoration .coins-1 {
      bottom:30px
    }
    .tpl-new-year .mod-img-list .page-1 .decoration .coins-2 {
      bottom:25px
    }
    .tpl-new-year .mod-img-list .page-2 .top-lines .line-1,.tpl-new-year .mod-img-list .page-2 .top-lines .pala-4 {
      zoom:.7
    }
    .tpl-new-year .mod-img-list .page-2 .bg-img {
      /*padding-top:70%;*/
      top:15%
    }
    .tpl-new-year .mod-img-list .page-2 .bg-img .text-area {
      width:130px
    }
    .tpl-new-year .mod-img-list .page-2 .decoration .wealth-god,.tpl-new-year .mod-img-list .page-2 .decoration .cloud,.tpl-new-year .mod-img-list .page-2 .decoration .red-bag {
      zoom:.7
    }
    .tpl-new-year .mod-img-list .page-3 .top-lines .line {
      zoom:.7
    }
    .tpl-new-year .mod-img-list .page-3 .bg-img {
      /*padding-top:65%*/
    }
    .tpl-new-year .mod-img-list .page-3 .bg-img .text-area {
      width:130px
    }
    .tpl-new-year .mod-img-list .page-3 .decoration .wealth-god,.tpl-new-year .mod-img-list .page-3 .decoration .cloud {
      zoom:.7
    }
    .tpl-new-year .mod-img-list .page-4 .decoration .couplet {
      zoom:.6
    }
    .tpl-new-year .mod-img-list .page-4 .decoration .plum-tree {
      bottom:22%
    }
    .tpl-new-year .mod-img-list .page-4 .decoration .plum-tree .inner {
      zoom:.7
    }
    .tpl-new-year .mod-img-list .page-4 .decoration .plum-tree .text-area {
      left:160px;
      top:70px
    }
    .tpl-new-year .mod-img-list .page-4 .decoration .plum-tree .text-area .inner {
      zoom:.9
    }
    .tpl-new-year .mod-img-list .page-4 .bg-img .lantern,.tpl-new-year .mod-img-list .page-4 .decoration .bullion,.tpl-new-year .mod-img-list .page-4 .decoration .red-bag,.tpl-new-year .mod-img-list .page-4 .decoration .coins,.tpl-new-year .mod-img-list .page-4 .decoration .chinese-knot {
      zoom:.7
    }
  }@media only screen and (min-device-width:720px) {
    .tpl-new-year .mod-tpl-cover .wealth-god {
      zoom:.85
    }
    .tpl-new-year .mod-img-list .page-2 .decoration .wealth-god {
      zoom:.8
    }
    .tpl-new-year .mod-img-list .page-3 .decoration .wealth-god {
      zoom:.8
    }
    .tpl-new-year .mod-tpl-cover .top-lines,.tpl-new-year .mod-tpl-cover .title-info .happy-new-year,.tpl-new-year .mod-tpl-cover .bottom-decoration .cloud {
      zoom:1
    }
    .tpl-new-year .mod-tpl-cover .title-info .infos {
      zoom:1
    }
    .tpl-new-year .mod-img-list .page-1 .bg-img {
      padding-top:80%;
      top:14%
    }
    .tpl-new-year .mod-img-list .page-1 .top-lines,.tpl-new-year .mod-img-list .page-1 .decoration .monkey,.tpl-new-year .mod-img-list .page-1 .decoration .bullion,.tpl-new-year .mod-img-list .page-1 .decoration .fukubukuro,.tpl-new-year .mod-img-list .page-1 .decoration .pala,.tpl-new-year .mod-img-list .page-1 .decoration .cloud {
      zoom:.85
    }
    .tpl-new-year .mod-img-list .page-1 .decoration .coins-1 {
      bottom:84px
    }
    .tpl-new-year .mod-img-list .page-1 .decoration .coins-2 {
      bottom:54px
    }
    .tpl-new-year .mod-img-list .page-2 .top-lines .line-1,.tpl-new-year .mod-img-list .page-2 .top-lines .pala-4 {
      zoom:.7
    }
    .tpl-new-year .mod-img-list .page-2 .bg-img {
      padding-top:80%;
      top:15%
    }
    .tpl-new-year .mod-img-list .page-2 .bg-img .text-area {
      width:130px
    }
    .tpl-new-year .mod-img-list .page-2 .decoration .wealth-god {
      zoom:.85
    }
    .tpl-new-year .mod-img-list .page-2 .decoration .cloud,.tpl-new-year .mod-img-list .page-2 .decoration .red-bag {
      zoom:1
    }
    .tpl-new-year .mod-img-list .page-3 .top-lines .line {
      zoom:1
    }
    .tpl-new-year .mod-img-list .page-3 .bg-img {
      padding-top:80%
    }
    .tpl-new-year .mod-img-list .page-3 .bg-img .text-area {
      width:130px
    }
    .tpl-new-year .mod-img-list .page-3 .decoration .wealth-god,.tpl-new-year .mod-img-list .page-3 .decoration .cloud {
      zoom:.85
    }
    .tpl-new-year .mod-img-list .page-4 .decoration .couplet {
      zoom:1
    }
    .tpl-new-year .mod-img-list .page-4 .decoration .plum-tree {
      bottom:28%
    }
    .tpl-new-year .mod-img-list .page-4 .decoration .plum-tree .inner {
      zoom:1
    }
    .tpl-new-year .mod-img-list .page-4 .decoration .plum-tree .text-area {
      left:180px;
      top:110px
    }
    .tpl-new-year .mod-img-list .page-4 .decoration .plum-tree .text-area .inner {
      zoom:1
    }
    .tpl-new-year .mod-img-list .page-4 .bg-img .lantern,.tpl-new-year .mod-img-list .page-4 .decoration .bullion,.tpl-new-year .mod-img-list .page-4 .decoration .red-bag,.tpl-new-year .mod-img-list .page-4 .decoration .coins,.tpl-new-year .mod-img-list .page-4 .decoration .chinese-knot {
      zoom:1
    }
  }.mod-flowers {
     /* position:absolute;
       *//* width:100%;
       *//* height:100%;
       *//* z-index:10;
       */
   }
  .mod-flowers .flower {
    display:block;
    background-size:cover;
    position:absolute;
    top:0;
    left:0;
    z-index: 6;
    opacity: 0;
  }
  .mod-flowers .flower-1 {
    width: 27px;
    height: 30px;
    background: url(/static/photo/tmpl/newyear/flowe1.png) no-repeat;
    background-size: 100% 100%;
    -webkit-animation: hua1 5.6s 1s linear infinite;
  }
  .mod-flowers .flower-2 {
    width: 27px;
    height: 26px;
    background: url(/static/photo/tmpl/newyear/flowe2.png) no-repeat;
    background-size: 100% 100%;
    -webkit-animation: hua2 7s 1.5s ease infinite;
  }
  .mod-flowers .flower-3 {
    width: 27px;
    height: 24px;
    background: url(/static/photo/tmpl/newyear/flowe3.png) no-repeat;
    background-size: 100% 100%;
    -webkit-animation: hua3 6.5s 2s ease infinite;
  }
  .mod-flowers .flower-4 {
    width: 27px;
    height: 14px;
    background: url(/static/photo/tmpl/newyear/flowe4.png) no-repeat;
    background-size: 100% 100%;
    -webkit-animation: hua0 6.3s ease 0.5s  infinite;
  }
  @media only screen and (-webkit-min-device-pixel-ratio:1.25),only screen and (min-resolution:120dpi),only screen and (min-resolution:1.25dppx) {
    .mod-flowers .flower-1 {
      width: 27px;
      height: 30px;
      background: url(/static/photo/tmpl/newyear/flowe1.png) no-repeat;
      background-size: 100% 100%;
      -webkit-animation: hua1 5.6s 1s linear infinite;
    }
    .mod-flowers .flower-2 {
      width: 27px;
      height: 26px;
      background: url(/static/photo/tmpl/newyear/flowe2.png) no-repeat;
      background-size: 100% 100%;
      -webkit-animation: hua2 7s 1.5s ease infinite;
    }
    .mod-flowers .flower-3 {
      width: 27px;
      height: 24px;
      background: url(/static/photo/tmpl/newyear/flowe3.png) no-repeat;
      background-size: 100% 100%;
      -webkit-animation: hua3 6.5s 2s ease infinite;
    }
    .mod-flowers .flower-4 {
      width: 27px;
      height: 14px;
      background: url(/static/photo/tmpl/newyear/flowe4.png) no-repeat;
      background-size: 100% 100%;
      -webkit-animation: hua0 6.3s ease 0.5s  infinite;
    }
  }html,body {
     width:100%;
     height:100%;
     overflow:hidden;
     background-color:#fff
   }
  .clearfix:after {
    content:".";
    height:0;
    visibility:hidden;
    display:block;
    clear:both;
    font-size:0;
    line-height:0
  }
  .clearfix {
    *zoom:1
  }
  .textoverflow {
    display:inline-block;
    white-space:nowrap;
    word-wrap:normal;
    word-break:break-all;
    overflow:hidden;
    text-overflow:ellipsis;
    max-width:100%;
    _width:100%
  }
  .tpl-new-year .wrap {
    background:#fff;
    width:100%;
    height:100%;
    overflow:hidden
  }
  .tpl-new-year .mod-img-wrap {
    width: 100vw;
    height:100vh;
    overflow:hidden
  }
  .tpl-new-year .mod-tpl-cover .top-lines .line {
    opacity:0;
    -webkit-transform:translate3d(0,-110%,0)
  }
  .tpl-new-year .mod-tpl-cover .top-lines .line .inner {
    -webkit-transform-origin:center top
  }
  .tpl-new-year .mod-tpl-cover .top-lines .curtain {
    -webkit-transform:translate3d(0,-110%,0)
  }
  .tpl-new-year .mod-tpl-cover .title-info .happy,.tpl-new-year .mod-tpl-cover .title-info .new,.tpl-new-year .mod-tpl-cover .title-info .year {
    -webkit-transform:scale(0.2);
    opacity:0
  }
  .tpl-new-year .tpl-cover-anim .wealth-god .body {
    -webkit-transform-origin:center bottom
  }
  .tpl-new-year .tpl-cover-anim .wealth-god .l-hand {
    -webkit-transform-origin:right center;
    -webkit-transform:rotate(-3deg)
  }
  .tpl-new-year .tpl-cover-anim .wealth-god .r-hand {
    -webkit-transform-origin:left center;
    -webkit-transform:rotate(3deg)
  }
  .tpl-new-year .mod-tpl-cover .bottom-decoration .cloud {
    -webkit-transform:translate3d(0,110%,0);
    opacity:0
  }
  .tpl-new-year .tpl-cover-anim .top-lines .line {
    -webkit-animation:move-in .8s ease .5s forwards
  }
  .tpl-new-year .tpl-cover-anim .top-lines .line .inner {
    -webkit-animation:swing 1.2s linear .5s infinite alternate
  }
  .tpl-new-year .tpl-cover-anim .top-lines .curtain {
    -webkit-animation:curtain-move-in .8s cubic-bezier(.04,.29,.42,1.28) .5s forwards
  }
  .tpl-new-year .tpl-cover-anim .top-lines .curtain-1 {
    -webkit-animation-display:.5s
  }
  .tpl-new-year .tpl-cover-anim .top-lines .curtain-2 {
    -webkit-animation-display:.8s
  }
  .tpl-new-year .tpl-cover-anim .top-lines .curtain-3 {
    -webkit-animation-display:1s
  }
  .tpl-new-year .tpl-cover-anim .top-lines .curtain-4 {
    -webkit-animation-display:1.2s
  }
  .tpl-new-year .tpl-cover-anim .top-lines .pala-1 {
  }.tpl-new-year .tpl-cover-anim .top-lines .pala-2 .inner {
     -webkit-animation-name:swing-reverse
   }
  .tpl-new-year .tpl-cover-anim .top-lines .pala-5 .inner {
    -webkit-animation-name:swing-reverse;
    -webkit-animation-delay:.8s
  }
  .tpl-new-year .tpl-cover-anim .top-lines .lantern-3 .inner {
    -webkit-animation-delay:1s
  }
  .tpl-new-year .tpl-cover-anim .top-lines .lantern-4 .inner {
    -webkit-animation-name:swing-reverse;
    -webkit-animation-delay:1s
  }
  .tpl-new-year .tpl-cover-anim .top-lines .lantern-6 .inner {
    -webkit-animation-delay:.8s
  }
  .tpl-new-year .tpl-cover-anim .title-info .happy {
    -webkit-animation:hny-anim .5s cubic-bezier(0,.4,.7,1.28) forwards
  }
  .tpl-new-year .tpl-cover-anim .title-info .new {
    -webkit-animation:hny-anim .5s cubic-bezier(0,.4,.7,1.28) .1s forwards
  }
  .tpl-new-year .tpl-cover-anim .title-info .year {
    -webkit-animation:hny-anim .5s cubic-bezier(0,.4,.7,1.28) .1s forwards
  }
  .tpl-new-year .tpl-cover-anim .wealth-god .body {
    -webkit-animation:body-anim 1s linear infinite alternate
  }
  .tpl-new-year .tpl-cover-anim .wealth-god .l-hand {
    -webkit-animation:l-hands-anim 1s linear infinite alternate
  }
  .tpl-new-year .tpl-cover-anim .wealth-god .r-hand {
    -webkit-animation:r-hands-anim 1s linear infinite alternate
  }
  .tpl-new-year .tpl-cover-anim .bottom-decoration .cloud {
    -webkit-animation:move-in .8s ease .3s forwards
  }
  .tpl-new-year .tpl-cover-anim .bottom-decoration .cloud-1 {
    -webkit-animation-delay:.5s
  }
  .tpl-new-year .tpl-cover-anim .bottom-decoration .cloud-2 {
    -webkit-animation-delay:.3s
  }
  .tpl-new-year .tpl-cover-anim .bottom-decoration .cloud-3 {
    -webkit-animation-delay:.3s
  }
  .tpl-new-year .tpl-cover-anim .bottom-decoration .cloud-4 {
  }.tpl-new-year .mod-tpl-cover.animate-b {
     -webkit-animation:fade-out .5s ease forwards
   }
  @-webkit-keyframes curtain-move-in {
    100% {
      -webkit-transform:translate3d(0,-5%,0)
    }
  }@-webkit-keyframes curtain-move-in {
     100% {
       -webkit-transform:translate3d(0,-5%,0)
     }
   }@-webkit-keyframes hny-anim {
      20% {
        opacity:1
      }
      100% {
        opacity:1;
        -webkit-transform:scale(1)
      }
    }@-webkit-keyframes l-hands-anim {
       0% {
         -webkit-transform:rotate(3deg)
       }
       100% {
         -webkit-transform:rotate(-3deg)
       }
     }@-webkit-keyframes r-hands-anim {
        0% {
          -webkit-transform:rotate(-3deg)
        }
        100% {
          -webkit-transform:rotate(3deg)
        }
      }.tpl-new-year .mod-img-list .item .bg-img .text-area {
         -webkit-transform:scale(0.5);
         opacity:0
       }
  .tpl-new-year .mod-img-list .item.animate .bg-img .text-area {
    -webkit-animation:zoom-out .8s cubic-bezier(.15,.76,.36,1.19) .3s forwards
  }
  .tpl-new-year .mod-img-list .item.animate .bg-img .text-area .inner {
    -webkit-animation:swing-up 1.2s linear infinite 1.2s alternate
  }
  @-webkit-keyframes zoom-out {
    50% {
      opacity:1
    }
    100% {
      opacity:1;
      -webkit-transform:scale(1)
    }
  }.tpl-new-year .mod-img-list .item.animate-b {
     -webkit-animation:fade-out .5s ease forwards
   }
  .tpl-new-year .mod-img-list .page-1 .bg-img .img-w {
    opacity:0
  }
  .tpl-new-year .mod-img-list .page-1 .top-lines .line {
    opacity:0;
    -webkit-transform:translate3d(0,-110%,0)
  }
  .tpl-new-year .mod-img-list .page-1 .top-lines .line .inner {
    -webkit-transform-origin:right top
  }
  .tpl-new-year .mod-img-list .page-1 .top-lines .line-1 .inner,.tpl-new-year .mod-img-list .page-1 .top-lines .lantern-1 .inner {
    -webkit-transform:rotate(-2deg)
  }
  .tpl-new-year .mod-img-list .page-1 .top-lines .line-2 .inner,.tpl-new-year .mod-img-list .page-1 .top-lines .lantern-2 .inner {
    -webkit-transform:rotate(2deg)
  }
  .tpl-new-year .mod-img-list .page-1 .decoration .cloud,.tpl-new-year .mod-img-list .page-1 .decoration .monkey {
    opacity:0;
    -webkit-transform:translate3d(0,100%,0)
  }
  .tpl-new-year .mod-img-list .page-1 .decoration .body {
    -webkit-transform:scaleY(0.98);
    -webkit-transform-origin:center bottom
  }
  .tpl-new-year .mod-img-list .page-1 .decoration .l-hand {
    -webkit-transform-origin:right bottom;
    -webkit-transform:rotate(-2deg)
  }
  .tpl-new-year .mod-img-list .page-1 .decoration .r-hand {
    -webkit-transform-origin:left bottom;
    -webkit-transform:rotate(2deg)
  }
  .tpl-new-year .mod-img-list .page-1 .decoration .fukubukuro,.tpl-new-year .mod-img-list .page-1 .decoration .bullion {
    opacity:0;
    -webkit-transform:translate3d(0,100%,0)
  }
  .tpl-new-year .mod-img-list .page-1 .decoration .pala {
    opacity:0;
    -webkit-transform:translate3d(100%,0,0)
  }
  .tpl-new-year .mod-img-list .page-1 .decoration .pala .inner {
    -webkit-transform-origin:right top
  }
  .tpl-new-year .mod-img-list .page-1 .decoration .fan {
    opacity:0;
    -webkit-transform:translate3d(-100%,0,0)
  }
  .tpl-new-year .mod-img-list .page-1 .decoration .fan .inner {
    -webkit-transform-origin:center bottom
  }
  .tpl-new-year .mod-img-list .page-1 .decoration .coins {
    -webkit-transform:translate3d(0,300%,0)
  }
  .tpl-new-year .mod-img-list .page-1.animate .bg-img .img-w {
    -webkit-animation:fade-in .5s ease forwards
  }
  .tpl-new-year .mod-img-list .page-1.animate .top-lines .line {
    -webkit-animation:move-in .5s cubic-bezier(.3,.55,.63,1.17) .1s forwards
  }
  .tpl-new-year .mod-img-list .page-1.animate .top-lines .line-2 {
    -webkit-animation-delay:.2s
  }
  .tpl-new-year .mod-img-list .page-1.animate .top-lines .line-1 .inner,.tpl-new-year .mod-img-list .page-1.animate .top-lines .lantern-1 .inner {
    -webkit-animation:swing 1.5s linear .6s infinite alternate
  }
  .tpl-new-year .mod-img-list .page-1.animate .top-lines .line-2 .inner,.tpl-new-year .mod-img-list .page-1.animate .top-lines .lantern-2 .inner {
    -webkit-animation:swing-reverse 1.3s .6s linear infinite alternate
  }
  .tpl-new-year .mod-img-list .page-1.animate .decoration .cloud {
    -webkit-animation:move-in .8s ease .3s forwards
  }
  .tpl-new-year .mod-img-list .page-1.animate .decoration .cloud-1 {
    -webkit-animation-delay:.5s
  }
  .tpl-new-year .mod-img-list .page-1.animate .decoration .cloud-2 {
    -webkit-animation-delay:.3s
  }
  .tpl-new-year .mod-img-list .page-1.animate .decoration .cloud-3 {
    -webkit-animation-delay:.3s
  }
  .tpl-new-year .mod-img-list .page-1.animate .decoration .monkey,.tpl-new-year .mod-img-list .page-1.animate .decoration .pala,.tpl-new-year .mod-img-list .page-1.animate .decoration .fan {
    -webkit-animation:move-in .5s ease .3s forwards
  }
  .tpl-new-year .mod-img-list .page-1.animate .decoration .pala .inner,.tpl-new-year .mod-img-list .page-1.animate .decoration .fan .inner {
    -webkit-animation:swing 1.2s linear .6s infinite alternate
  }
  .tpl-new-year .mod-img-list .page-1.animate .decoration .body {
    -webkit-animation:body-anim 1.2s linear 1s infinite alternate
  }
  .tpl-new-year .mod-img-list .page-1.animate .decoration .l-hand {
    -webkit-animation:swing 1.2s linear .9s infinite alternate
  }
  .tpl-new-year .mod-img-list .page-1.animate .decoration .r-hand {
    -webkit-animation:swing-reverse 1.2s linear 1s infinite alternate
  }
  .tpl-new-year .mod-img-list .page-1.animate .decoration .fukubukuro {
    -webkit-animation:move-in .5s ease .4s forwards
  }
  .tpl-new-year .mod-img-list .page-1.animate .decoration .bullion,.tpl-new-year .mod-img-list .page-1.animate .decoration .coins {
    -webkit-animation:move-in .5s ease .5s forwards
  }
  .tpl-new-year .mod-img-list .page-1 .decoration .coins-2 {
    -webkit-animation-delay:.9s
  }
  .tpl-new-year .mod-img-list .page-2 .bg-img .img-w {
    opacity:0
  }
  .tpl-new-year .mod-img-list .page-2 .top-lines .line {
    opacity:0;
    -webkit-transform:translate3d(0,-110%,0)
  }
  .tpl-new-year .mod-img-list .page-2 .top-lines .line .inner {
    -webkit-transform-origin:left top;
    -webkit-transform:rotate(-2deg)
  }
  .tpl-new-year .mod-img-list .page-2 .top-lines .lantern-3 .inner {
    -webkit-transform:rotate(2deg)
  }
  .tpl-new-year .mod-img-list .page-2 .decoration .red-bag {
    opacity:0;
    -webkit-transform:translate3d(0,200%,0)
  }
  .tpl-new-year .mod-img-list .page-2 .decoration .cloud {
    opacity:0;
    -webkit-transform:translate3d(0,100%,0)
  }
  .tpl-new-year .mod-img-list .page-2 .wealth-god {
    opacity:0;
    -webkit-transform:translate3d(0,100%,0) scale(0.8) rotate(-10deg)
  }
  .tpl-new-year .mod-img-list .page-2 .wealth-god .inner {
    -webkit-transform:rotate(-2deg);
    -webkit-transform-origin:center bottom
  }
  .tpl-new-year .mod-img-list .page-2 .wealth-god .l-hand {
    -webkit-transform-origin:right center;
    -webkit-transform:rotate(-3deg)
  }
  .tpl-new-year .mod-img-list .page-2 .wealth-god .r-hand {
    -webkit-transform-origin:left center;
    -webkit-transform:rotate(3deg)
  }
  .tpl-new-year .mod-img-list .page-2.animate .bg-img .img-w {
    -webkit-animation:fade-in .5s ease forwards
  }
  .tpl-new-year .mod-img-list .page-2.animate .top-lines .line {
    -webkit-animation:move-in .5s cubic-bezier(.15,.76,.36,1.19) .1s forwards
  }
  .tpl-new-year .mod-img-list .page-2.animate .top-lines .line .inner {
    -webkit-animation:swing 1.2s linear .6s infinite alternate
  }
  .tpl-new-year .mod-img-list .page-2.animate .top-lines .lantern-3 .inner {
    -webkit-animation:swing-reverse 1.2s linear .6s infinite alternate
  }
  .tpl-new-year .mod-img-list .page-2.animate .decoration .cloud {
    -webkit-animation:move-in .5s cubic-bezier(.15,.76,.36,1.19) .3s forwards
  }
  .tpl-new-year .mod-img-list .page-2.animate .decoration .cloud-1 {
    -webkit-animation-delay:.4s
  }
  .tpl-new-year .mod-img-list .page-2.animate .decoration .cloud-2 {
    -webkit-animation-delay:.4s
  }
  .tpl-new-year .mod-img-list .page-2.animate .decoration .cloud-2 {
    -webkit-animation-timing-function:ease
  }
  .tpl-new-year .mod-img-list .page-2.animate .decoration .red-bag {
    -webkit-animation:move-in .5s cubic-bezier(.15,.76,.36,1.19) .3s forwards
  }
  .tpl-new-year .mod-img-list .page-2.animate .decoration .red-bag .inner {
    -webkit-animation:swing-up 1s linear .3s infinite alternate
  }
  .tpl-new-year .mod-img-list .page-2.animate .decoration .bag-2 .inner {
    -webkit-animation-delay:1.3s
  }
  .tpl-new-year .mod-img-list .page-2.animate .wealth-god {
    -webkit-animation:p3-god-anim .5s ease .3s forwards
  }
  .tpl-new-year .mod-img-list .page-2.animate .wealth-god .inner {
    -webkit-animation:swing 1.5s linear infinite 1s alternate
  }
  .tpl-new-year .mod-img-list .page-2.animate .wealth-god .l-hand {
    -webkit-animation:l-hands-anim 1.5s linear infinite alternate
  }
  .tpl-new-year .mod-img-list .page-2.animate .wealth-god .r-hand {
    -webkit-animation:r-hands-anim 1.5s linear infinite alternate
  }
  @-webkit-keyframes p3-god-anim {
    0% {
      opacity:1;
      -webkit-transform:translate3d(0,100%,0) scale(0.8) rotate(-10deg)
    }
    100% {
      opacity:1;
      -webkit-transform:translate3d(0,0,0) scale(0.8) rotate(-10deg)
    }
  }.tpl-new-year .mod-img-list .page-3 .bg-img .img-w {
     opacity:0
   }
  .tpl-new-year .mod-img-list .page-3 .top-lines .line {
    opacity:0;
    -webkit-transform:translate3d(0,-110%,0)
  }
  .tpl-new-year .mod-img-list .page-3 .top-lines .line .inner {
    -webkit-transform-origin:right top
  }
  .tpl-new-year .mod-img-list .page-3 .top-lines .pala-4 .inner,.tpl-new-year .mod-img-list .page-3 .top-lines .lantern-2 .inner {
    -webkit-transform:rotate(-2deg)
  }
  .tpl-new-year .mod-img-list .page-3 .top-lines .pala-1 .inner,.tpl-new-year .mod-img-list .page-3 .top-lines .lantern-3 .inner,.tpl-new-year .mod-img-list .page-3 .top-lines .lantern-5 .inner {
    -webkit-transform:rotate(2deg)
  }
  .tpl-new-year .mod-img-list .page-3 .decoration .cloud,.tpl-new-year .mod-img-list .page-3 .decoration .wealth-god {
    opacity:0;
    -webkit-transform:translate3d(0,100%,0)
  }
  .tpl-new-year .mod-img-list .page-3 .decoration .coins {
    opacity:0;
    -webkit-transform:translate3d(0,100px,0)
  }
  .tpl-new-year .mod-img-list .page-3 .decoration .body {
    -webkit-transform:scaleY(0.98);
    -webkit-transform-origin:center bottom
  }
  .tpl-new-year .mod-img-list .page-3 .decoration .l-hand {
    -webkit-transform-origin:right bottom;
    -webkit-transform:rotate(-2deg)
  }
  .tpl-new-year .mod-img-list .page-3 .decoration .r-hand {
    -webkit-transform-origin:left bottom;
    -webkit-transform:rotate(2deg)
  }
  .tpl-new-year .mod-img-list .page-3.animate .bg-img .img-w {
    -webkit-animation:fade-in .5s ease forwards
  }
  .tpl-new-year .mod-img-list .page-3.animate .top-lines .line {
    -webkit-animation:move-in .8s cubic-bezier(.15,.76,.36,1.19) .1s forwards
  }
  .tpl-new-year .mod-img-list .page-3.animate .top-lines .line .inner {
    -webkit-animation:swing 1.2s linear .6s infinite alternate
  }
  .tpl-new-year .mod-img-list .page-3.animate .top-lines .pala-1 .inner,.tpl-new-year .mod-img-list .page-3.animate .top-lines .lantern-3 .inner,.tpl-new-year .mod-img-list .page-3.animate .top-lines .lantern-5 .inner {
    -webkit-animation:swing-reverse 1.2s linear .6s infinite alternate
  }
  .tpl-new-year .mod-img-list .page-3.animate .decoration .cloud {
    -webkit-animation:move-in .8s ease .3s forwards
  }
  .tpl-new-year .mod-img-list .page-3.animate .decoration .wealth-god {
    -webkit-animation:move-in .8s ease .3s forwards
  }
  .tpl-new-year .mod-img-list .page-3.animate .decoration .wealth-god .body {
    -webkit-animation:body-anim 1.2s linear infinite alternate
  }
  .tpl-new-year .mod-img-list .page-3.animate .decoration .l-hand {
    -webkit-animation:swing 1.2s linear .9s infinite alternate
  }
  .tpl-new-year .mod-img-list .page-3.animate .decoration .r-hand {
    -webkit-animation:swing-reverse 1.2s linear 1s infinite alternate
  }
  .tpl-new-year .mod-img-list .page-3.animate .decoration .coins {
    -webkit-animation:move-in .8s cubic-bezier(.15,.76,.36,1.19) .5s forwards
  }
  .tpl-new-year .mod-img-list .page-3.animate .decoration .coins-2 {
    -webkit-animation-delay:.6s
  }
  .tpl-new-year .mod-img-list .page-3.animate .decoration .coins-1 {
    -webkit-animation-delay:.6s
  }
  @-webkit-keyframes p3-coins-in {
    0% {
      -webkit-transform:translateY(0)
    }
    100% {
      -webkit-transform:translateY(5px)
    }
  }.tpl-new-year .mod-img-list .page-4 .bg-img .img-w {
     opacity:0
   }
  .tpl-new-year .mod-img-list .page-4 .bg-img .lantern {
    -webkit-transform:scale(0.3);
    opacity:0
  }
  .tpl-new-year .mod-img-list .page-4 .bg-img .lantern .inner {
    -webkit-transform-origin:center top;
    -webkit-transform:rotate(-2deg)
  }
  .tpl-new-year .mod-img-list .page-4 .decoration .cloud {
    -webkit-transform:translate3d(0,100%,0) rotateY(180deg)
  }
  .tpl-new-year .mod-img-list .page-4 .decoration .chinese-knot,.tpl-new-year .mod-img-list .page-4 .decoration .bullion,.tpl-new-year .mod-img-list .page-4 .decoration .red-bag {
    -webkit-transform:translate3d(0,110%,0);
    opacity:0
  }
  .tpl-new-year .mod-img-list .page-4 .decoration .coins {
    -webkit-transform:translate3d(0,100px,0);
    opacity:0
  }
  .tpl-new-year .mod-img-list .page-4 .decoration .couplet {
    -webkit-transform:translate3d(-110%,0,0);
    opacity:0
  }
  .tpl-new-year .mod-img-list .page-4.animate .bg-img .img-w {
    -webkit-animation:fade-in .5s ease forwards
  }
  .tpl-new-year .mod-img-list .page-4.animate .bg-img .lantern {
    -webkit-animation:p5-fade-in .8s cubic-bezier(0.175,.885,.32,1.275) .3s forwards
  }
  .tpl-new-year .mod-img-list .page-4.animate .bg-img .lantern .inner {
    -webkit-animation:swing 1.2s linear 1.3s infinite alternate
  }
  .tpl-new-year .mod-img-list .page-4.animate .decoration .cloud {
    -webkit-animation:p5-move-in .5s cubic-bezier(.15,.76,.36,1.19) .3s forwards
  }
  .tpl-new-year .mod-img-list .page-4.animate .decoration .cloud-1 {
    -webkit-animation-delay:.4s
  }
  .tpl-new-year .mod-img-list .page-4.animate .decoration .cloud-3 {
    -webkit-animation-timing-function:ease
  }
  .tpl-new-year .mod-img-list .page-4.animate .decoration .bullion {
    -webkit-animation:move-in .5s cubic-bezier(.15,.76,.36,1.19) .5s forwards
  }
  .tpl-new-year .mod-img-list .page-4.animate .decoration .bullion .inner {
    -webkit-animation:swing-up 1.2s linear infinite 1.2s alternate
  }
  .tpl-new-year .mod-img-list .page-4.animate .decoration .bullion-1 {
    -webkit-animation-delay:.6s
  }
  .tpl-new-year .mod-img-list .page-4.animate .decoration .red-bag {
    -webkit-animation:move-in .5s cubic-bezier(.15,.76,.36,1.19) .55s forwards
  }
  .tpl-new-year .mod-img-list .page-4.animate .decoration .red-bag .inner {
    -webkit-animation:swing-up 1.2s linear infinite 1.2s alternate
  }
  .tpl-new-year .mod-img-list .page-4.animate .decoration .bag-1 .inner {
    -webkit-animation-delay:.7s
  }
  .tpl-new-year .mod-img-list .page-4.animate .decoration .coins {
    -webkit-animation:move-in .5s cubic-bezier(.15,.76,.36,1.19) .6s forwards
  }
  .tpl-new-year .mod-img-list .page-4.animate .decoration .coins-1 {
    -webkit-animation-delay:.66s
  }
  .tpl-new-year .mod-img-list .page-4.animate .decoration .chinese-knot {
    -webkit-animation:move-in .5s cubic-bezier(.15,.76,.36,1.19) .6s forwards
  }
  .tpl-new-year .mod-img-list .page-4.animate .decoration .couplet {
    -webkit-animation:move-in .5s cubic-bezier(.15,.76,.36,1.19) .4s forwards
  }
  @-webkit-keyframes p5-move-in {
    0% {
      opacity:1
    }
    100% {
      -webkit-transform:translate3d(0,0,0) rotateY(180deg);
      opacity:1
    }
  }@-webkit-keyframes p5-fade-in {
     10% {
       opacity:1
     }
     100% {
       -webkit-transform:scale(1);
       opacity:1
     }
   }@-webkit-keyframes body-anim {
      0% {
        -webkit-transform:scaleY(0.98)
      }
      100% {
        -webkit-transform:scaleY(1)
      }
    }@-webkit-keyframes move-in {
       0% {
         opacity:1
       }
       100% {
         -webkit-transform:translate3d(0,0,0);
         opacity:1
       }
     }@-webkit-keyframes swing {
        0% {
          -webkit-transform:rotate(-2deg)
        }
        100% {
          -webkit-transform:rotate(2deg)
        }
      }@-webkit-keyframes swing-reverse {
         0% {
           -webkit-transform:rotate(2deg)
         }
         100% {
           -webkit-transform:rotate(-2deg)
         }
       }@-webkit-keyframes swing-up {
          0% {
            -webkit-transform:translateY(0)
          }
          100% {
            -webkit-transform:translateY(5px)
          }
        }@-webkit-keyframes fade-in {
           0% {
             opacity:0
           }
           100% {
             opacity:1
           }
         }@-webkit-keyframes fade-out {
            100% {
              opacity:0
            }
          }@media only screen and (max-device-height:480px) and (max-device-width:414px) {
  }@media only screen and (min-device-height:568px) and (max-device-width:414px) and (-webkit-device-pixel-ratio:2) {
  }@media only screen and (min-device-height:667px) and (max-device-width:414px) and (-webkit-device-pixel-ratio:2) {
  }@media only screen and (min-device-height:736px) and (max-device-width:414px) and (-webkit-device-pixel-ratio:3) {
  }@media only screen and (min-device-height:800px) and (min-device-width:400px) {
  }@media only screen and (min-device-width:720px) {
  }@media only screen and (-webkit-min-device-pixel-ratio:1.25),only screen and (min-resolution:120dpi),only screen and (min-resolution:1.25dppx) {
    .tpl-new-year .mod-img-list .page-1 .top-lines .line-1 .inner {
      background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year.32-yog160201145242@2x.png?max_age=19830212&d=20160201145310);
      background-size:1348px 300px;
      background-position:-1078px 0
    }
    .tpl-new-year .mod-img-list .page-1 .top-lines .line-2 .inner {
      background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year.32-yog160201145242@2x.png?max_age=19830212&d=20160201145310);
      background-size:1348px 300px;
      background-position:-772px 0
    }
    .tpl-new-year .mod-img-list .page-1 .top-lines .lantern-1 .inner {
      background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year.32-yog160201145242@2x.png?max_age=19830212&d=20160201145310);
      background-size:1348px 300px;
      background-position:-923px -160px
    }
    .tpl-new-year .mod-img-list .page-1 .top-lines .lantern-2 .inner {
      background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year.32-yog160201145242@2x.png?max_age=19830212&d=20160201145310);
      background-size:1348px 300px;
      background-position:-494px -203px
    }
    .tpl-new-year .mod-img-list .page-1 .decoration .pala .inner {
      background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year.32-yog160201145242@2x.png?max_age=19830212&d=20160201145310);
      background-size:1348px 300px;
      background-position:-1150px -153px
    }
    .tpl-new-year .mod-img-list .page-1 .decoration .fan .inner {
      background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year.32-yog160201145242@2x.png?max_age=19830212&d=20160201145310);
      background-size:1348px 300px;
      background-position:-1084px -241px
    }
    .tpl-new-year .mod-img-list .page-1 .decoration .body {
      background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year.32-yog160201145242@2x.png?max_age=19830212&d=20160201145310);
      background-size:1348px 300px;
      background-position:-446px 0
    }
    .tpl-new-year .mod-img-list .page-1 .decoration .l-hand {
      background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year.32-yog160201145242@2x.png?max_age=19830212&d=20160201145310);
      background-size:1348px 300px;
      background-position:-1179px -72px
    }
    .tpl-new-year .mod-img-list .page-1 .decoration .r-hand {
      background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year.32-yog160201145242@2x.png?max_age=19830212&d=20160201145310);
      background-size:1348px 300px;
      background-position:-1251px -142px
    }
    .tpl-new-year .mod-img-list .page-1 .decoration .bullion {
      background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year.32-yog160201145242@2x.png?max_age=19830212&d=20160201145310);
      background-size:1348px 300px;
      background-position:-1251px -209px
    }
    .tpl-new-year .mod-img-list .page-1 .decoration .fukubukuro {
      background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year.32-yog160201145242@2x.png?max_age=19830212&d=20160201145310);
      background-size:1348px 300px;
      background-position:-1179px 0
    }
    .tpl-new-year .mod-img-list .page-1 .decoration .coins .inner {
      background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year.32-yog160201145242@2x.png?max_age=19830212&d=20160201145310);
      background-size:1348px 300px;
      background-position:-529px -203px
    }
    .tpl-new-year .mod-img-list .page-2 .top-lines .line-1 .inner {
      background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year.32-yog160201145242@2x.png?max_age=19830212&d=20160201145310);
      background-size:1348px 300px;
      background-position:-364px 0
    }
    .tpl-new-year .mod-img-list .page-2 .top-lines .lantern-3 .inner {
      background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year.32-yog160201145242@2x.png?max_age=19830212&d=20160201145310);
      background-size:1348px 300px;
      background-position:-578px -197px
    }
    .tpl-new-year .mod-img-list .page-2 .top-lines .pala-4 .inner {
      background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year.32-yog160201145242@2x.png?max_age=19830212&d=20160201145310);
      background-size:1348px 300px;
      background-position:-862px 0
    }
    .tpl-new-year .mod-img-list .page-2 .decoration .wealth-god .body {
      background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year.32-yog160201145242@2x.png?max_age=19830212&d=20160201145310);
      background-size:1348px 300px;
      background-position:-129px 0
    }
    .tpl-new-year .mod-img-list .page-2 .decoration .wealth-god .l-hand {
      background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year.32-yog160201145242@2x.png?max_age=19830212&d=20160201145310);
      background-size:1348px 300px;
      background-position:-129px -249px
    }
    .tpl-new-year .mod-img-list .page-2 .decoration .wealth-god .r-hand {
      background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year.32-yog160201145242@2x.png?max_age=19830212&d=20160201145310);
      background-size:1348px 300px;
      background-position:-236px -249px
    }
    .tpl-new-year .mod-img-list .page-2 .decoration .bag-1 .inner {
      background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year.32-yog160201145242@2x.png?max_age=19830212&d=20160201145310);
      background-size:1348px 300px;
      background-position:-529px -252px
    }
    .tpl-new-year .mod-img-list .page-2 .decoration .bag-2 .inner {
      background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year.32-yog160201145242@2x.png?max_age=19830212&d=20160201145310);
      background-size:1348px 300px;
      background-position:-1084px -153px
    }
    .tpl-new-year .mod-img-list .page-2 .decoration .bag-3 .inner {
      background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year.32-yog160201145242@2x.png?max_age=19830212&d=20160201145310);
      background-size:1348px 300px;
      background-position:-394px -212px
    }
    .tpl-new-year .mod-img-list .page-3 .top-lines .pala-1 .inner {
      background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year.32-yog160201145242@2x.png?max_age=19830212&d=20160201145310);
      background-size:1348px 300px;
      background-position:-446px -203px
    }
    .tpl-new-year .mod-img-list .page-3 .top-lines .pala-4 .inner {
      background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year.32-yog160201145242@2x.png?max_age=19830212&d=20160201145310);
      background-size:1348px 300px;
      background-position:-923px 0
    }
    .tpl-new-year .mod-img-list .page-3 .top-lines .lantern-2 .inner {
      background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year.32-yog160201145242@2x.png?max_age=19830212&d=20160201145310);
      background-size:1348px 300px;
      background-position:-978px -158px
    }
    .tpl-new-year .mod-img-list .page-3 .top-lines .lantern-3 .inner {
      background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year.32-yog160201145242@2x.png?max_age=19830212&d=20160201145310);
      background-size:1348px 300px;
      background-position:-364px -212px
    }
    .tpl-new-year .mod-img-list .page-3 .top-lines .lantern-5 .inner {
      background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year.32-yog160201145242@2x.png?max_age=19830212&d=20160201145310);
      background-size:1348px 300px;
      background-position:-978px -158px
    }
    .tpl-new-year .mod-img-list .page-3 .decoration .wealth-god .body {
      background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year.32-yog160201145242@2x.png?max_age=19830212&d=20160201145310);
      background-size:1348px 300px;
      background-position:-578px 0
    }
    .tpl-new-year .mod-img-list .page-3 .decoration .wealth-god .l-hand {
      background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year.32-yog160201145242@2x.png?max_age=19830212&d=20160201145310);
      background-size:1348px 300px;
      background-position:-129px -249px
    }
    .tpl-new-year .mod-img-list .page-3 .decoration .wealth-god .r-hand {
      background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year.32-yog160201145242@2x.png?max_age=19830212&d=20160201145310);
      background-size:1348px 300px;
      background-position:-236px -249px
    }
    .tpl-new-year .mod-img-list .page-3 .decoration .coins .inner {
      background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year.32-yog160201145242@2x.png?max_age=19830212&d=20160201145310);
      background-size:1348px 300px;
      background-position:-529px -203px
    }
    .tpl-new-year .mod-img-list .page-4 .bg-img .lantern .inner {
      background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year.32-yog160201145242@2x.png?max_age=19830212&d=20160201145310);
      background-size:1348px 300px;
      background-position:-1018px -158px
    }
    .tpl-new-year .mod-img-list .page-4 .decoration .plum-tree .inner {
      background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year.32-yog160201145242@2x.png?max_age=19830212&d=20160201145310);
      background-size:1348px 300px;
      background-position:-625px -197px
    }
    .tpl-new-year .mod-img-list .page-4 .decoration .chinese-knot {
      background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year.32-yog160201145242@2x.png?max_age=19830212&d=20160201145310);
      background-size:1348px 300px;
      background-position:-974px 0
    }
    .tpl-new-year .mod-img-list .page-4 .decoration .bullion-1 .inner {
      background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year.32-yog160201145242@2x.png?max_age=19830212&d=20160201145310);
      background-size:1348px 300px;
      background-position:-1251px 0
    }
    .tpl-new-year .mod-img-list .page-4 .decoration .bullion-2 .inner {
      background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year.32-yog160201145242@2x.png?max_age=19830212&d=20160201145310);
      background-size:1348px 300px;
      background-position:-1256px -69px
    }
    .tpl-new-year .mod-img-list .page-4 .decoration .bag-1 .inner {
      background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year.32-yog160201145242@2x.png?max_age=19830212&d=20160201145310);
      background-size:1348px 300px;
      background-position:-1084px -153px
    }
    .tpl-new-year .mod-img-list .page-4 .decoration .bag-2 .inner {
      background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year.32-yog160201145242@2x.png?max_age=19830212&d=20160201145310);
      background-size:1348px 300px;
      background-position:-394px -212px
    }
    .tpl-new-year .mod-img-list .page-4 .decoration .coins .inner {
      background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year.32-yog160201145242@2x.png?max_age=19830212&d=20160201145310);
      background-size:1348px 300px;
      background-position:-529px -203px
    }
    .tpl-new-year .mod-img-list .page-4 .decoration .couplet .inner {
      background-image:url(http://qzonestyle.gtimg.cn/touch/proj-qzone-app/album-magazine/sprite/tpl-new-year.32-yog160201145242@2x.png?max_age=19830212&d=20160201145310);
      background-size:1348px 300px;
      background-position:0 0
    }
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

  @-webkit-keyframes hua0
  {
    0% {opacity:1; -webkit-transform:translate(0px, 0px) scale(1) rotateX(46deg) rotateY(-58deg) rotateZ(0deg) translate(-50%, -50%);-webkit-animation-timing-function: cubic-bezier(.25,.25,.75,.75);}
    23.33% {opacity:1; -webkit-transform:translate(89px, 36px) scale(1) rotateX(10deg) rotateY(0deg) rotateZ(0deg) translate(-50%, -50%);-webkit-animation-timing-function: cubic-bezier(.25,.25,.75,.75);}
    53.33% {opacity:1; -webkit-transform:translate(167px, 161px) scale(1) rotateX(10deg) rotateY(0deg) rotateZ(0deg) translate(-50%, -50%);-webkit-animation-timing-function: cubic-bezier(.25,.25,.75,.75);}
    66.67% {opacity:.8; -webkit-transform:translate(241px, 231px) scale(1) rotateX(-20deg) rotateY(50deg) rotateZ(0deg) translate(-50%, -50%);-webkit-animation-timing-function: cubic-bezier(.25,.25,.75,.75);}
    100% {opacity:.5; -webkit-transform:translate(257px, 335px) scale(1) rotateX(10deg) rotateY(-40deg) rotateZ(0deg) translate(-50%, -50%);}
  }
</style>
