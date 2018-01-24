<template>
  <div class="cor-nav">
    <div class="list" v-show="!isBtnShow">
      <a href="javascript:void(0);" class="nav-btn dt" v-tap="{ methods:toNav, nav:'map' }"><span></span></a>
      <a href="javascript:void(0);" class="nav-btn jz" v-tap="{ methods:toNav, nav:'matrix' }"><span></span></a>
      <a href="javascript:void(0);" class="nav-btn xs" v-tap="{ methods:toNav, nav:'clue' }"><span></span></a>
    </div>
    <a class="nav-btn" v-tap="{ methods: navBtn }">
      <span class="add" v-if="isBtnShow"></span>
      <span class="minus" v-if="!isBtnShow"></span>
    </a>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        isBtnShow: true,
        eu: null,
        isHome: false,
        isMap: false,
        isMatrix: false,
        isClue: false
      }
    },
    created: function() {
      if (this.$route.path.indexOf(';H5') >= 0) {
        this.eu = this.$route.params.eu.slice(0,-3);
      }else {
        this.eu = this.$route.params.eu;
      }
      if (this.$route.path.indexOf('/map') >= 0) {
        this.isMap = true;
      } else if (this.$route.path.indexOf('/matrix') >= 0) {
        this.isMatrix = true;
      } else if (this.$route.path.indexOf('/clue') >= 0) {
        this.isClue = true;
      } else {
        this.isHome = true;
      }
    },
    methods: {
      navBtn: function () {
        this.isBtnShow = !this.isBtnShow
        this.$emit('isOpenChild', !this.isBtnShow)
      },
      toNav: function(result){
        this.$router.push('/' + this.eu + '/' + result.nav);
      }
    }
  }
</script>

<style scoped>
  .cor-nav{
    display: block;
    position: absolute;
    bottom: 10px;
    right: 10px;
  }
  .cor-nav .nav-btn{
    display: block;
    width: 50px;
    height: 50px;
    font-size: 35px;
    line-height: 50px;
    text-align: center;
    color: #fff;
    background-color: #7ca8d5;
    border-radius: 100%;
    margin-bottom: 15px;
  }
  .cor-nav .nav-btn span{
    position: relative;
    top: -2px;
    right: 0px;
    margin: 0 auto;
    display: inline-block;
    width: 18px;
    height: 18px;
    z-index: 1001;
    background: url(../../assets/img/icon-plus.png) no-repeat;
    background-size: 32px auto;
  }
  .cor-nav .nav-btn span.add{
    background-position: 0px 0px;
  }
  .cor-nav .nav-btn span.minus{
    background-position: -16px 0px;
  }
  .cor-nav .list{
    position: relative;
    z-index: 1001;
  }
  .cor-nav .list .nav-btn span{
    right: 13px;
  }
  .cor-nav .list .nav-btn span{
    width: 22px;
    height: 22px;
    background: url(../../assets/img/icon-nav1.png) no-repeat transparent;
    background-size: 88px auto;
  }
  .cor-nav .list .nav-btn:before{
    content: '';
    display: inline-block;
    color: #FFF;
    font-size: 13px;
    position: relative;
    left: -35px;
    top: -8px;
  }
  .cor-nav .list .nav-btn.xs:before{
    content: '线索';
  }
  .cor-nav .list .nav-btn.dt:before{
    content: '地图';
  }
  .cor-nav .list .nav-btn.jz:before{
    content: '矩阵';
  }
  .cor-nav .list .nav-btn.xs span{
    background-position: -66px -22px;
  }
  .cor-nav .list .nav-btn.dt span{
    background-position: -22px -22px;
  }
  .cor-nav .list .nav-btn.jz span{
    background-position: -44px -22px;
  }
</style>
