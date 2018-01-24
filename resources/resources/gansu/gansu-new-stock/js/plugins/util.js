/*
 * 工具方法以及素材全局方法
 */
/*
 * 字符串 -> Date对象
 */
var str2date = function (str) {
    str = str.replace(/-/g, '/');
    return new Date(str);
};

/*
 * 字符串 -> 毫秒数
 */
var timestamp = function (str) {
    return str2date(str).getTime();
};

/*
 * Date对象 -> 字符串
 *
 * @param format 例:yyyy年MM月dd日 hh:mm:ss
 */
var dateformat = function (date, format) {
    var z = {
        M: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        m: date.getMinutes(),
        s: date.getSeconds()
    };
    format = format.replace(/(M+|d+|h+|m+|s+)/g, function (v) {
        return ((v.length > 1 ? "0" : "") + eval('z.' + v.slice(-1))).slice(-2);
    });
    return format.replace(/(y+)/g, function (v) {
        return date.getFullYear().toString().slice(-v.length)
    });
}