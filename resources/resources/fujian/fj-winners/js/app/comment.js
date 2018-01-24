; (function (w) { 
  H.comment={
      init:function(){
        this.initParam();
        this.initEvent();
      },
      initParam:function(){

          this.headimg =$(".headimg");
          if(headimgurl){
             this.headimg.attr('src',headimgurl+"/64");
          }
      },
      initEvent:function(){
        
      }
  
  };
  H.comment.init();

})(window)