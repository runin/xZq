/**
 * Created by Administrator on 2015/7/29.
 */
var gdmissi;
var apptype = 7;
$(document).ready(function () {
    gdmissi = $(".gdmissi");
    askrl();
});

function askrl(){
    $.ajax({
        type:"GET",
        dataType:"jsonp",
        jsonp: "callback",
        jsonpCallback:"callGoldTaskInfoHandler",
        url: business_url+"mpAccount/mobile/userSign/goldTask/info/"+busiAppId+"/"+apptype,
        error: function () {
            askrl();
        }
    })
}

function callGoldTaskInfoHandler(data){
    if(data.code == 0){
        var inr = "";
        $.each(data.result, function (index,el) {
            var num = index;
            inr += '<div><div>'+ (index+1) +'</div><h4>'+ el[index+1] +'</h4></div></br>'
        });
        gdmissi.html(inr);
    }else{

    }
}
