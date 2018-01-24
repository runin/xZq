; (function (w) { 
 var twocode ={
    init:function(){
       this.initParam();
       this.initEvent();
    },
    initParam:function(){
       this.body = $("body");
    },
    initEvent:function(){
      this.body.addClass("fadein");
      var value = getQueryString("cb41faa22e731e9b");
      setTimeout(function(){
          if(value){
             window.location.href="main.html?cb41faa22e731e9b="+value;
          }else{
             window.location.href="main.html";
          }
      },3000); 
    }
 
 };
 twocode.init();
})(window)