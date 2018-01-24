
;(function(){

 //ststime


     loadData({url: domain_url+"common/time",callbackTimeHandler:function(data){
       W.sysytemTime = data.t;//获取系统时间
     
      $.ajax({ url:domain_url+"ceremony/period",type : "get", async : false,dataType : "jsonp",jsonp : "callback",jsonpCallback : "callbackPeriodHandler",
      success:function(){},error:function(){}});
    }});
       W.callbackPeriodHandler =function(data){
              var st = timestamp(data.sa);
              var et = timestamp(data.ea);
              if(W.sysytemTime<st){
                $("#notstart-btn").removeClass("none");
                $("#nstat-btn").addClass("none");
                $("#stop-btn").addClass("none");
                
              }
              if(W.sysytemTime>st&& W.sysytemTime<et){
                $("#nstat-btn").removeClass("none");
                $("#notstart-btn").addClass("none");
                $("#stop-btn").addClass("none");
              }
              if(W.sysytemTime>et){
                $("#stop-btn").removeClass("none");
                $("#nstat-btn").addClass("none");
                $("#notstart-btn").addClass("none");
                
              }

       }

})();