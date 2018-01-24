; (function (w) { 
 var obligate ={
    init:function(){
       this.initParam();
       this.initEvent();
    },
    initParam:function(){
      this.body = $("body");
      this.click_here =$(".click_here");
    },
    initEvent:function(){
      this.body.addClass("fadein");
      this.click_here.click(function(){
        window.location.href= "https://www.fjtv.net/3g/";
      });      
    }
 };
 obligate.init();
})(window)