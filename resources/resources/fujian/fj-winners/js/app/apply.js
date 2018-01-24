
var N = {
    showPage: function (pageName, fn, pMoudel) {
        var mps = $(".page");
        mps.addClass("none");
        mps.each(function (i, item) {
            var t = $(item);
            if (t.attr("id") == pageName) {
                t.removeClass("none");
                N.currentPage = t;
                if (fn) {
                    fn(t);
                };
                return false;
            }
        });
    },

    loadData: function (param) {
        var p = $.extend({ url: "", type: "get", async: false, dataType: "jsonp", showload: true }, param);
        if (p.showload) {
            W.showNewLoading();
        }
        var connt = 0;
        var cbName = "";
        var cbFn = null;
        for (var i in param) {
            connt++;
            if (connt == 2) {
                cbName = i;
                cbFn = param[i];
                break;
            }
        }
        if (/test/.test(domain_url)) {
            if (!param.data) {
                param.data = {};
            }
            param.data.dev = "jiawei";
        }
        $.ajax({ type: p.type, data: param.data, async: p.async, url: p.url, dataType: p.dataType, jsonpCallback: cbName,
            success: function (data) {

                W.hideNewLoading();
                cbFn(data);

            },
            error: function () {
                if (param.error) { param.error() };
                W.hideNewLoading();
                // H.dialog.showWin.open("抱歉网络延迟，请稍后再试！");
            }
        });
    },
    loadImg: function (img) {
        if (!this.images) {
            this.images = [];
        }
        if (img && !(img instanceof Array)) {
            img.isLoad = false;
            this.images.push(img);
        } else if ((img instanceof Array)) {
            for (var i = 0; i < img.length; i++) {
                img[i].isLoad = false;
                this.images.push(img[i]);
            }
        }
        for (var j = 0; j < this.images.length; j++) {
            var that = this;
            if (!this.images[j].isLoad) {
                var im = new Image();
                im.src = this.images[j].src;
                this.images[j].isLoad = true;
                im.onload = function () {

                }
            }
        }
    },
    showWin: function (obj) {

        var p = $.extend({
            html: "", //内部html
            beforeOpenFn: null, //打开之前
            afterOpenFn: null//打开之后执行的函数
        }, obj || {});
        this.winObj = $('<div class="win"><div class="win_model"></div><div class="win_contain"><div class="win_html"></div></div></div>');
        this.close = function (fn) {
            this.winObj.remove();
            if (fn) {
                fn()
            }
            if (this.closeFn) {
                this.closeFn();
            }
        }
        this.setWidth = function (w) {
            this.winObj.css("width", w);
        }
        this.setHeight = function (h) {
            this.winObj.css("height", h);
        }
        this.setHtml = function (html) {
            this.winObj.find(".win_html").append(html || p.html);

        }

        this.initEvent = function () {
            var that = this;
            this.winObj.find(".win_close").unbind("click").click(function () {
                that.close();
            });
        }
        this.init = function (fn) {
            this.setHtml();
            if (p.beforeOpenFn) {
                p.beforeOpenFn(this.winObj, this);
            }
            $("body").append(this.winObj);
            this.initEvent();
            this.winObj.find(".win_contain").addClass("show_slow");
            if (p.afterOpenFn) {
                p.afterOpenFn(this.winObj, this);
            }
            if (fn) {
                fn();
            }
        }
    },
    module: function (mName, fn, fn2) {
        !N[mName] && (N[mName] = new fn());
        if (fn2) {
            $(function () {
                fn2();
            });
        }
    }
};

; (function (w) { 
   var apply={
    initEvent:function(){
      var that =this;
      this.come_backs.click(function(){
         window.location.href =  "main.html"
      });
      this.submit.click(function(e){
         e.preventDefault();
         if(that.checkFn()){
            that.submitFn();
         }
      });
      this.apply_back.click(function(){
          window.location.href ="main.html";
      });
   },
   checkFn:function(){//检查合法性
       var name = this.apply_form.find("[name='name']").val();//姓名
       var sex = this.apply_form.find("[name='sex']:checked").val();//性别
       var age = this.apply_form.find("[name='age']").val();//年龄
       var profession = this.apply_form.find("[name='profession']").val();//职业
       var remark = this.apply_form.find("[name='remark']").val();//才艺
       var phone = this.apply_form.find("[name='phone']").val();//电话
       if(!name){
          alert("请填写名字");
          return false;
       }
       if(name.length>15){
         alert("名字过长了");
         return false;
       }
	   
       /*if(!(/^[0-9]*$/.test(age)&&(age>10&&age<120))){
         alert("请正确填写年龄");
         return false;
       }
       if(!profession){
        alert("请填写职业");
        return false;
       }
       if(!remark){
        alert("请填写才艺");
        return false;
       }*/
	   
       if(!(phone&&/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/.test(phone))){
        alert("请填写正确电话号码");
        return false;
       }
       return true;
   },
   submitFn:function(){//提交逻辑
    var that =this;
    function turnJson(str){
           var strArr = str.split("&");
           var resultJson ={};
           for (var i = 0, l = strArr.length; i < l; i++) {
                var sindex = strArr[i].search("=");
                var tname = strArr[i].substring(0, sindex);
                var tval = strArr[i].substring(sindex + 1, strArr[i].length);
                resultJson[tname] = tval
            }
            return resultJson;
     };     
   var resultJson = turnJson(this.apply_form.serialize());
    if(!openid){
       alert("抱歉提交失败");
       return;
    }
    openid && (resultJson.openid =openid);
    headimgurl && (resultJson.images =headimgurl);
    N.loadData({url:domain_url+"api/entryinfo/save",callbackActiveEntryInfoSaveHandler:function(data){
     if(data.code==0){
        //todo
        that.main.addClass("none");
        that.submit_success.removeClass("none");
     }else{
        alert("抱歉提交失败");
     }  
    },data:resultJson,error:function(){
        alert("抱歉提交失败");
    }});
   },
   initParam:function(){
       this.come_backs =$(".come_backs");
       this.submit =$(".submit");
       this.apply_form =$(".apply-form");//表单
       this.apply_back =$(".apply_back");
       this.main =$(".main");
       this.submit_success =$(".submit_success");
   },
   init:function(){
       this.initParam();
       this.initEvent();
   }

 };
  apply.init();

})(window)