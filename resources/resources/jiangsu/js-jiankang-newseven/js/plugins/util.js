/*
* 工具方法以及素材全局方法
*/
//时间转换
var str2date = function(str) {
    str = str.replace(/-/g, '/');
    return new Date(str);
};
var timestamp = function(str) {
    return Date.parse(str2date(str));
};