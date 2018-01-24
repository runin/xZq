/**
 * Created by Administrator on 2015/7/28.
 */
//var dev = "?dev=Exio";
function applydata(url,callback,istest){
    if(istest == false){
        $.ajax({
            type:"GET",
            url:domain_url+url,
            dataType:"jsonp",
            jsonp: "callback",
            jsonpCallback:callback,
            async: false,
            error: function () {
                //alert("请求数据失败，请刷新页面");
            }
        });
    }else{
        $.ajax({
            type:"GET",
            url:domain_url+url,
            dataType:"jsonp",
            jsonp: "callback",
            jsonpCallback:callback,
            async: false,
            error: function () {
                //alert("请求数据失败，请刷新页面");
            }
        });
    }
}