

//$(function () {


//   

//    window.orientation = 0;
//    window.isVScreen = function () {
//        if (orientation == 0) {
//            return true;
//        } else {
//            return false;
//        }
//    }
//    window.innerWidthTmp = window.innerWidth;
//    //横竖屏事件监听方法
//    function screenOrientationListener() {
//       
//        try {
//            var iw = window.innerWidth;
//            //屏幕方向改变处理
//            if (iw != innerWidthTmp) {
//                if (iw > window.innerHeight) orientation = 90;
//                else orientation = 0;
//                //调用转屏事件

//                innerWidthTmp = iw;
//            }
//        } catch (e) { alert(e); };
//        //间隔固定事件检查是否转屏，默认500毫秒
//        setTimeout("screenOrientationListener()", 500);
//    }
//    //启动横竖屏事件监听
//    if (is_android && !is_android()) {
//        screenOrientationListener();
//    }
//})

//function isVScreen() {
//    if (window.orientation == 0 || window.orientation == 180) {//竖屏
//        window.isVScreenOP = true;
//    } else { //横屏
//    window.isVScreenOP = false;
//    }

//}
//window.orientation = 0;
//isVScreen();
//window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", orientationChange, false);   


















