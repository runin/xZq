; (function () {
    window.Impower = function () {
        this.mpappid = mpappid;
        this.serviceNo = serviceNo;
        this.scope = "snsapi_userinfo";
        this.redirect_uri = domain_url + "api/mp/auth/snsapi_userinfo";
    }
    Impower.prototype.authorize = function (fn) {

         if (!this.checkIsAuthorize()){
            window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + this.mpappid + "&redirect_uri=" + encodeURIComponent(this.redirect_uri) + "&response_type=code&scope=" + this.scope + "&state=" + this.serviceNo + "#wechat_redirect ";
        } else {
            if (fn) {
                fn();
            }
        }
    }
    Impower.prototype.checkIsAuthorize = function () {
  
      if($.fn.cookie(mpappid + '_openid')){
               return true;
         }else{
            return false;
         }
    }

})();
