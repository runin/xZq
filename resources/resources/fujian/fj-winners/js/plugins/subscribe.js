//注: 定义了appid 后 直接引用这个js文件就可以了
;(function (w,$) {   
   w.Subscribe =function(obj){
      this.appid = obj&&obj.appid ||appid;//apppid
      if(!this.appid){
         alert("请定义appid！");
         return;
      }
      this.selector = obj&&obj.selector||"div_subscribe_area";//选择器
      this.type = obj&&obj.type||2;//默认类型
      this.sub_contain =$('<div id="'+this.selector+'" class="'+this.selector+'"></div>');//插入文档的区域
   };
   Subscribe.prototype.setCss =function(cssObj){//设置样式
        this.cssObj ={
            'position': 'fixed',
            'bottom': '0',
            'left': '0',
            'width': '100%',
            'height': '50px',
            'overflow': 'hidden',
            'z-index': '9999999'
        };
      this.sub_contain.css(cssObj?cssObj:this.cssObj);
   };
   Subscribe.prototype.appendHtml =function(){//插入html
      $("body").append(this.sub_contain);
      this.setCss();
   };
   Subscribe.prototype.shaketv_subscribe =function(){//加上微信的注册事件 
      w.shaketv && shaketv.subscribe({
           appid: this.appid,
           selector: "#"+this.selector,
           type: this.type
        }, function (returnData) {
         // alert(JSON.stringify(returnData));
        });
   };
   Subscribe.prototype.switch_state =function(){//控制容器是否显示
       if (w.location.href.indexOf('cb41faa22e731e9b') == -1) {
            this.sub_contain.css('height', '0');
        } else {
           this.sub_contain.css('height', '50px');
        };
   };
   Subscribe.prototype.initEvent =function(){//初始化事件
       if(w.shaketv){
          this.shaketv_subscribe();
          this.switch_state();
       }else{
         var that =this;
         that.shaketvCount =0;
         w.shaketvInterval = setInterval(function(){
          that.shaketvCount++;
           if(w.shaketv){
              that.shaketv_subscribe();
              that.switch_state();
              clearInterval(w.shaketvInterval);
           }
           if(that.shaketvCount>10){
               clearInterval(w.shaketvInterval);
               that.shaketvCount=0;
           }
         },500);
       }
   };
   Subscribe.prototype.init=function(){
      this.appendHtml();
      this.initEvent();
   };
   w.subscribeObject = new Subscribe();
   w.subscribeObject.init();
})(window,Zepto);