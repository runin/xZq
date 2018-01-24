/**
 * Created by Chris on 2016/9/13.
 */

//通用脚本
window["_BFD"] = window["_BFD"] || {};
_BFD.client_id = "Cctv";    //视不同布码页该值不同 ，由洋河提供
_BFD.BFD_USER = {
    "user_id" : "0"    //网站当前用户标识，如果未登录就为0或空字符串 ，非必填
};
_BFD.script = document.createElement("script");
_BFD.script.type = "text/javascript";
_BFD.script.async = true;
_BFD.script.charset = "utf-8";
_BFD.script.src=(('https:'==document.location.protocol?'https://':'http://')+'bigdata.chinayanghe.com/api/2.0/cctv.js');           // 具体JS由洋河提供
document.getElementsByTagName("head")[0].appendChild(_BFD.script);

//各变量赋值
var param_p_p ='null';   //可不填
var param_p_s = '叮咯咙咚呛摇一摇首页';
var param_p_t = 'np';
var param_uid = '0';    //填0即可
var param_cat_id = [];   //可不填
var param_cat_name = [];  //可不填
var param_cb = '';       //可不填
var param_lt = 0.1;
var param_p_id = 'YH20160914000027';          //同广告页洋河编号即可
var param_ptime = new Date().getTime();
var param_adCode  = 'YH20160914000027';      //广告页洋河编号，由洋河提供
var param_page_type = "1";                        //1广告页面、2落地页、3注册页
var param_unionID = "";                           //可不填
var param_media_cookie = getCookieb('ptcz');   //取CCTV的媒体cookie

//调用执行语句
_BFD.clock = function(){
    var stdid = '';
    var scripts = document.getElementsByTagName("head")[0].getElementsByTagName("script");
    for(var i=0;i<scripts.length;i++){
        stdid += scripts[i].src;
        if(stdid.indexOf("StdID.do")!=-1){
            clearInterval(time);
            _BFD.PageView(param_p_p, param_p_s, param_p_t, param_uid, param_cat_id, param_cat_name, param_cb, param_lt, param_p_id, param_ptime, param_unionID,param_adCode,param_media_cookie,param_page_type);

        }
    }
};
var time = setInterval("_BFD.clock()",500);
function getCookieb(name) {
    var arr = document.cookie.split("; ");
    for (var i = 0, len = arr.length; i < len; i++) {
        var item = arr[i].split("=");
        if (item[0] == name) return item[1];
    }
    return "";
}