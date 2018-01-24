$(function(){
  var W  = window;
  var isCanShake = true;
  var audioa = $("#audio-a");
  var audiob = $("#audio-b");
  //摇奖事件
  H.yao = {
       init : function(){
          var me = this;
  	      me.shake();
       },
       //监听摇奖事件
       shake: function() {
           W.addEventListener('shake', H.yao.shake_listener, false);
       },
       unshake: function() {  
       },
       //摇奖事件所发生的函数
       shake_listener: function() {
          if(isCanShake)
          {
  	    		 isCanShake = true;
          }
          else
          {
            return;
          }
          //添加震动效果和音乐
          $(".img-round").addClass("shaking");
          H.music.audioStart();
          var num = Math.random()*2+3;
          if(count>0)
          {
                  if(num > 4)
                  {
                    setTimeout(function(){
                    H.dialog.rockPize.open();
                    H.music.audioStop();
                    H.music.audioZj();
                    },700);
                  }
                  else
                  {
                    setTimeout(function(){
                      showTips("很可惜没有中奖");
                      $(".img-round").removeClass("shaking");
                    },700); 

                      count--;
                      $(".index-title span").text("还有"+count);         
                  }
          }else
          {
            $(".index-title").text("您今天摇奖机会已用完");
          }
        }
     };
    //摇奖音乐控制
  H.music = {
      audioStart:function() 
      {
          audioa.get(0).play();
      },
      audioStop:function() 
      {
          audioa.get(0).pause();
      },
      audioZj:function() 
      {
          audiob.get(0).play();
      }
    }
 });


// 初始函数
$(function(){
	setTimeout(function(){
		H.yao.init();
  }, 1000);

});