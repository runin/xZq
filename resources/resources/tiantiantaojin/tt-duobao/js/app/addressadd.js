/**
 * Created by E on 2015/11/9.
 */
$(document).ready(function () {
    S.adsadd.init();
});
S.adsadd = {
    init: function () {
        var me = S.adsadd;
        me.el.labelProvince = $(".label-province");
        me.el.labelCity = $(".label-city");
        me.el.section = $(".section");
        me.el.black = $(".black");
        me.el.address = $(".address");
        me.el.chkboxYes = $(".chkbox-yes");
        me.el.chkboxNo = $(".chkbox-no");
        me.el.outsec = $(".outsec");
        me.el.imgYes = $(".img-yes");
        me.el.imgNo = $(".img-no");
        me.el.addressCancel = $(".address-cancel");
        me.el.addressSave = $(".address-save");
        me.el.addressName = $(".address-name");
        me.el.addressID = $(".address-ID");
        me.el.addressTel = $(".address-tel");
        me.el.addressPost = $(".address-post");
        me.el.addressArea = $(".address-area");
        me.el.addressHeadp = $(".address-head>p");
        me.el.addressWholeadds = $(".address-wholeadds");
        me.el.btnBacktohome = $(".btn-backtohome");
        me.el.addressBody = $(".address-body");
        S.adsadd.el.imgYes.css("display","block");
        me.el.jumpType = getQueryString("type");
        me.el.fixid = getQueryString("fixid");
        me.even();
    },
    el:{
        labelProvince:null,
        labelCity:null,
        section:null,
        black:null,
        address:null,
        province:null,
        city:null,
        chkboxYes:null,
        chkboxNo:null,
        chkobxPick:"1",
        outsec:null,
        imgYes:null,
        imgNo:null,
        addressCancel:null,
        addressSave:null,
        addressName:null,
        addressID:null,
        addressTel:null,
        addressPost:null,
        addressArea:null,
        addressWholeadds:null,
        jumpType:null,
        btnBacktohome:null,
        addressHeadp:null,
        fixid:null,
        addressBody:null
    },
    even: function () {
        S.adsadd.el.btnBacktohome.on("click", function () {
            toUrl("personcenter.html");
        });
        S.adsadd.el.labelProvince.on("click", function () {
            S.adsadd.el.black.css({"display":"block","-webkit-animation":"secup 0.3s","animation-timing-function":"ease-out","-webkit-animation-timing-function":"ease-out"}).one("webkitAnimationEnd", function () {
                S.adsadd.el.black.css({"opacity":"0.5","-webkit-animation":""});
                S.adsadd.chooseprovince();
            });
            S.adsadd.el.outsec.css({"display":"block","-webkit-animation":"popup 0.3s","animation-timing-function":"ease-out","-webkit-animation-timing-function":"ease-out"}).one("webkitAnimationEnd", function () {
                S.adsadd.el.outsec.css({"-webkit-animation":""})
            });
        });
        S.adsadd.el.black.on("click", function () {
            S.adsadd.chooseover();
        });
        S.adsadd.el.labelCity.on("click", function () {
            if(S.adsadd.el.province == null){
                showTips("请先选择省份");
            }else{
                S.adsadd.el.black.css({"display":"block","-webkit-animation":"secup 0.3s","animation-timing-function":"ease-out","-webkit-animation-timing-function":"ease-out"}).one("webkitAnimationEnd", function () {
                    S.adsadd.el.black.css({"opacity":"0.5","-webkit-animation":""});
                    S.adsadd.choosecity();
                });
                S.adsadd.el.outsec.css({"display":"block","-webkit-animation":"popup 0.3s","animation-timing-function":"ease-out","-webkit-animation-timing-function":"ease-out"}).one("webkitAnimationEnd", function () {
                    S.adsadd.el.outsec.css({"-webkit-animation":""})
                });
            }
        });
        S.adsadd.el.chkboxYes.on("click", function () {
            S.adsadd.chkboxchoose(0);
        });
        S.adsadd.el.chkboxNo.on("click", function () {
            S.adsadd.chkboxchoose(1);
        });
        S.adsadd.el.addressCancel.on("click", function () {
            if(S.adsadd.el.jumpType == null || (S.adsadd.el.jumpType == "")){
                toUrl("personinfo.html");
            }else{
                toUrl("chkaddress.html?rid="+S.adsadd.el.jumpType);
            }
        });
        S.adsadd.el.addressSave.on("click", function () {
            S.adsadd.chkinfo();
        });
        if(S.adsadd.el.fixid !== ''){
            S.adsadd.applydata();
            S.adsadd.el.addressHeadp.html("修改收货地址");
        }
        S.adsadd.el.addressHeadp.css("width",($(window).width()-102)+"px");
        S.adsadd.el.addressBody.css("height",($(window).height()-50)+"px");
    },
    applydata: function () {
        getResult('consignee/queryunique/'+S.adsadd.el.fixid, {},'callBackQueryuniqueAddressHandler');
    },
    chooseprovince: function () {
        S.adsadd.el.section.text("");
        for(var a in S.adsadd.data){
            S.adsadd.el.section.append('<p onclick="S.adsadd.pickprovince(this)">' + a + '</p>');
        }
    },
    pickprovince: function (data) {
        var me = $(data);
        S.adsadd.el.province = me.text();
        //console.log(me.text());
        S.adsadd.el.labelProvince.text(S.adsadd.el.province);
        S.adsadd.el.city = null;
        S.adsadd.el.labelCity.text("请选择");
        S.adsadd.el.addressArea.val("");
        S.adsadd.chooseover();
    },
    choosecity: function () {
        S.adsadd.el.section.text("");
        for(var a = 0;a < S.adsadd.data[S.adsadd.el.province].length; a++){
            S.adsadd.el.section.append('<p onclick="S.adsadd.pickcity(this)">' + S.adsadd.data[S.adsadd.el.province][a] + '</p>');
        }
    },
    pickcity: function (data) {
        var me = $(data);
        S.adsadd.el.city = me.text();
        //console.log(me.text());
        S.adsadd.el.labelCity.text(S.adsadd.el.city);
        S.adsadd.el.addressArea.val("");
        S.adsadd.chooseover();
    },
    chooseover: function () {
        S.adsadd.el.black.css({"-webkit-animation":"secdown 0.3s","animation-timing-function":"ease-out","-webkit-animation-timing-function":"ease-out"}).one("webkitAnimationEnd", function () {
            S.adsadd.el.black.css({"display":"none","-webkit-animation":""});
        });
        S.adsadd.el.outsec.css({"display":"block","-webkit-animation":"popdown 0.3s","animation-timing-function":"ease-out","-webkit-animation-timing-function":"ease-out"}).one("webkitAnimationEnd", function () {
            S.adsadd.el.outsec.css({"display":"none","-webkit-animation":""})
        });
    },
    chkboxchoose: function (data) {
        if(data == 0){
            S.adsadd.el.chkobxPick = "1";
            S.adsadd.el.imgYes.css("display","block");
            S.adsadd.el.imgNo.css("display","none");
        }else{
            S.adsadd.el.chkobxPick = "0";
            S.adsadd.el.imgYes.css("display","none");
            S.adsadd.el.imgNo.css("display","block");
        }
    },
    chkinfo: function () {
        var userName = S.adsadd.el.addressName.val();
        var userID = S.adsadd.el.addressID.val();
        var userTel = S.adsadd.el.addressTel.val();
        var userPost = S.adsadd.el.addressPost.val();
        var userArea = S.adsadd.el.addressArea.val();
        var userWholeadds = S.adsadd.el.addressWholeadds.val();
        if (userName.match("<") || userID.match("<") || userTel.match("<") || userPost.match("<") || userArea.match("<") || userWholeadds.match("<")) {
            showTips('含有非法字符');
            return false;
        }else if (userName.length > 20 || userName.length == 0) {
            showTips('请输入您的姓名，不要超过20字哦!');
            return false;
        }else if (userID.length !== 18 && userID !== "") {
            showTips('请输入正确的身份证号');
            return false;
        }else if (!/^\d{11}$/.test(userTel)) {
            showTips('这手机号，可打不通...');
            return false;
        }else if(!/^\d{6}$/.test(userPost)){
            showTips('请填写正确的邮政编码');
            return false;
        }else if(userArea.length < 3 || userArea.length > 30){
            showTips('请填写正确的地区');
            return false;
        }else if(userWholeadds.length < 3 || userWholeadds.length > 30){
            showTips('请填写正确的详细地址');
            return false;
        }else if(S.adsadd.el.province == null){
            showTips('请选择省份');
            return false;
        }else if(S.adsadd.el.city == null){
            showTips('请选择城市');
            return false;
        }else{
            showLoading();
            if(S.adsadd.el.fixid !== ''){
                getResult('consignee/add',
                    {
                        appId:busiAppId,
                        openId:openid,
                        id:S.adsadd.el.fixid,
                        consignee: encodeURIComponent(userName),
                        cardId: encodeURIComponent(userID),
                        telphone: userTel,
                        postCode: userPost,
                        province: encodeURIComponent(S.adsadd.el.province),
                        city: encodeURIComponent(S.adsadd.el.city),
                        county: encodeURIComponent(userArea),
                        address: encodeURIComponent(userWholeadds),
                        isDefault: S.adsadd.el.chkobxPick
                    },'callBackAddConsigneeHandler');
            }else{
                getResult('consignee/add',
                    {
                        appId:busiAppId,
                        openId:openid,
                        consignee: encodeURIComponent(userName),
                        cardId: encodeURIComponent(userID),
                        telphone: userTel,
                        postCode: userPost,
                        province: encodeURIComponent(S.adsadd.el.province),
                        city: encodeURIComponent(S.adsadd.el.city),
                        county: encodeURIComponent(userArea),
                        address: encodeURIComponent(userWholeadds),
                        isDefault: S.adsadd.el.chkobxPick
                    },'callBackAddConsigneeHandler');
            }
            //console.log(userName + "  " + userID + "  "+userTel+"  "+userPost+"  "+userArea+"  "+userWholeadds+"  "+S.adsadd.el.province+"  "+S.adsadd.el.city+"  "+S.adsadd.el.chkobxPick);
        }
    },
    data : {
        '北京市': ['北京市'],
        '天津市': ['天津市'],
        '上海市': ['上海市'],
        '重庆市': ['重庆市'],
        '河北省': ['石家庄市','唐山市','秦皇岛市','邯郸市','邢台市','保定市','张家口市','承德市','沧州市','廊坊市','衡水市'],
        '山西省': ['太原市','大同市','阳泉市','长治市','晋城市','朔州市','晋中市','运城市','忻州市','临汾市','吕梁市'],
        '台湾省': ['台北市','高雄市','基隆市','台中市','台南市','新竹市','嘉义市','台北县','宜兰县','桃园县','新竹县','苗栗县','台中县','彰化县','南投县','云林县','嘉义县','台南县','高雄县','屏东县','澎湖县','台东县','花莲县'],
        '辽宁省': ['沈阳市','大连市','鞍山市','抚顺市','本溪市','丹东市','锦州市','营口市','阜新市','辽阳市','盘锦市','铁岭市','朝阳市','葫芦岛市'],
        '吉林省': ['长春市','吉林市','四平市','辽源市','通化市','白山市','松原市','白城市','延边朝鲜族自治州'],
        '黑龙江省': ['哈尔滨市','齐齐哈尔市','鹤 岗 市','双鸭山市','鸡 西 市','大 庆 市','伊 春 市','牡丹江市','佳木斯市','七台河市','黑 河 市','绥 化 市','大兴安岭地区'],
        '江苏省': ['南京市','无锡市','徐州市','常州市','苏州市','南通市','连云港市','淮安市','盐城市','扬州市','镇江市','泰州市','宿迁市'],
        '浙江省': ['杭州市','宁波市','温州市','嘉兴市','湖州市','绍兴市','金华市','衢州市','舟山市','台州市','丽水市'],
        '安徽省': ['合肥市','芜湖市','蚌埠市','淮南市','马鞍山市','淮北市','铜陵市','安庆市','黄山市','滁州市','阜阳市','宿州市','巢湖市','六安市','亳州市','池州市','宣城市'],
        '福建省': ['福州市','厦门市','莆田市','三明市','泉州市','漳州市','南平市','龙岩市','宁德市'],
        '江西省': ['南昌市','景德镇市','萍乡市','九江市','新余市','鹰潭市','赣州市','吉安市','宜春市','抚州市','上饶市'],
        '山东省': ['济南市','青岛市','淄博市','枣庄市','东营市','烟台市','潍坊市','济宁市','泰安市','威海市','日照市','莱芜市','临沂市','德州市','聊城市','滨州市','菏泽市'],
        '河南省': ['郑州市','开封市','洛阳市','平顶山市','安阳市','鹤壁市','新乡市','焦作市','濮阳市','许昌市','漯河市','三门峡市','南阳市','商丘市','信阳市','周口市','驻马店市','济源市'],
        '湖北省': ['武汉市','黄石市','十堰市','荆州市','宜昌市','襄樊市','鄂州市','荆门市','孝感市','黄冈市','咸宁市','随州市','仙桃市','天门市','潜江市','神农架林区','恩施土家族苗族自治州'],
        '湖南省': ['长沙市','株洲市','湘潭市','衡阳市','邵阳市','岳阳市','常德市','张家界市','益阳市','郴州市','永州市','怀化市','娄底市','湘西土家族苗族自治州'],
        '广东省': ['广州市','深圳市','珠海市','汕头市','韶关市','佛山市','江门市','湛江市','茂名市','肇庆市','惠州市','梅州市','汕尾市','河源市','阳江市','清远市','东莞市','中山市','潮州市','揭阳市','云浮市'],
        '甘肃省': ['兰州市','金昌市','白银市','天水市','嘉峪关市','武威市','张掖市','平凉市','酒泉市','庆阳市','定西市','陇南市','临夏回族自治州','甘南藏族自治州'],
        '四川省': ['成都市','自贡市','攀枝花市','泸州市','德阳市','绵阳市','广元市','遂宁市','内江市','乐山市','南充市','眉山市','宜宾市','广安市','达州市','雅安市','巴中市','资阳市','阿坝藏族羌族自治州','甘孜藏族自治州','凉山彝族自治州'],
        '贵州省': ['贵阳市','六盘水市','遵义市','安顺市','铜仁地区','毕节地区','黔西南布依族苗族自治州','黔东南苗族侗族自治州','黔南布依族苗族自治州'],
        '海南省': ['海口市','三亚市','五指山市','琼海市','儋州市','文昌市','万宁市','东方市','澄迈县','定安县','屯昌县','临高县','白沙黎族自治县','昌江黎族自治县','乐东黎族自治县','陵水黎族自治县','保亭黎族苗族自治县','琼中黎族苗族自治县'],
        '云南省': ['昆明市','曲靖市','玉溪市','保山市','昭通市','丽江市','思茅市','临沧市','文山壮族苗族自治州','红河哈尼族彝族自治州','西双版纳傣族自治州','楚雄彝族自治州','大理白族自治州','德宏傣族景颇族自治州','怒江傈傈族自治州','迪庆藏族自治州'],
        '青海省': ['西宁市','海东地区','海北藏族自治州','黄南藏族自治州','海南藏族自治州','果洛藏族自治州','玉树藏族自治州','海西蒙古族藏族自治州'],
        '陕西省': ['西安市','铜川市','宝鸡市','咸阳市','渭南市','延安市','汉中市','榆林市','安康市','商洛市'],
        '广西壮族自治区': ['南宁市','柳州市','桂林市','梧州市','北海市','防城港市','钦州市','贵港市','玉林市','百色市','贺州市','河池市','来宾市','崇左市'],
        '西藏自治区': ['拉萨市','那曲地区','昌都地区','山南地区','日喀则地区','阿里地区','林芝地区'],
        '宁夏回族自治区': ['银川市','石嘴山市','吴忠市','固原市','中卫市'],
        '维吾尔自治区': ['乌鲁木齐市','克拉玛依市','石河子市　','阿拉尔市','图木舒克市','五家渠市','吐鲁番市','阿克苏市','喀什市','哈密市','和田市','阿图什市','库尔勒市','昌吉市　','阜康市','米泉市','博乐市','伊宁市','奎屯市','塔城市','乌苏市','阿勒泰市'],
        '内蒙古自治区': ['呼和浩特市','包头市','乌海市','赤峰市','通辽市','鄂尔多斯市','呼伦贝尔市','巴彦淖尔市','乌兰察布市','锡林郭勒盟','兴安盟','阿拉善盟'],
        '澳门特别行政区': ['澳门特别行政区'],
        '香港特别行政区': ['香港特别行政区']
    }
};

function callBackAddConsigneeHandler(data){
    if(data.result == true){
        if(S.adsadd.el.jumpType == null || (S.adsadd.el.jumpType == "")){
            toUrl("address.html");
        }else{
            toUrl("chkaddress.html?rid="+S.adsadd.el.jumpType);
        }
    }else{

    }
}

function callBackQueryuniqueAddressHandler(data){
    S.adsadd.el.addressName.val(data.pi);
    S.adsadd.el.addressID.val(data.cd);
    S.adsadd.el.addressTel.val(data.ph);
    S.adsadd.el.addressPost.val(data.pd);
    S.adsadd.el.province = data.pv;
    S.adsadd.el.labelProvince.text(data.pv);
    S.adsadd.el.city = data.cy;
    S.adsadd.el.labelCity.text(data.cy);
    S.adsadd.el.addressArea.val(data.ct);
    S.adsadd.el.addressWholeadds.val(data.ad);
    if(data.de == 0){
        S.adsadd.chkboxchoose(1);
    }else{
        S.adsadd.chkboxchoose(0);
    }
}