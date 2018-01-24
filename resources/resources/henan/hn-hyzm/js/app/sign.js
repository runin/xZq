;(function($){
    H.sign = {
        init: function(){
            this.event();
            this.signInfo();
        },
        signInfo: function(){
            getResult('api/entryinfo/info',{},'callbackActiveEntryInfoHandler');
        },
        event: function(){
            var me = H.sign;
            $(".back-btn").tap(function(e){
                e.preventDefault();
                me.btn_animate($(this));
                toUrl("index.html");
            });
            $('#upload-box').upload({
                url: domain_url + 'fileupload/image', 	// 图片上传路径
                numLimit: 3,							// 上传图片个数
                formCls: 'upload-form'					// 上传form的class
            });
            $("#btn-submit").tap(function(e){
                e.preventDefault();
                me.btn_animate($(this));
                //  必填信息
                var $name = $("input[name='name']"),
                    $phone = $("input[name='tel']"),
                    $profession = $("input[name='profession']"),
                    $describe = $("textarea[name='describe']"),
                    $card = $("input[name='card']");

                name = $.trim($name.val());
                phone = $.trim($phone.val());
                profession = $.trim($profession.val());
                describe = $.trim($describe.val());
                card = $.trim($card.val());

                if(name.length < 2 || name.length > 30){
                    showTips('姓名长度为2~30个字符');
                    $name.focus();
                    return false;
                }else if(!/^\d{11}$/.test(phone)){
                    showTips('这手机号，可打不通哦...');
                    $phone.focus();
                    return false;
                }else if(profession.length == 0) {
                    showTips('请输入职业');
                    $profession.focus();
                    return false;
                }

                if(!checkCard()){
                    $('#card_no').focus();
                    return false;
                }
                var $images = "";
                $(".img-preview").each(function(){
                    if($(this).attr('data-url')){
                        $images += $(this).attr('data-url') + ',';
                    }
                });

                if($images == ""){
                    showTips("请上传照片");
                    return false;
                }else{
                    $images = $images.substr(0,$images.length-1);
                }

                if(describe.length == 0){
                    showTips("介绍一下您的宝物吧");
                    $describe.focus();
                    return false;
                }

                $allData = {'card' : card};

                getResult('api/entryinfo/save', {
                    openid : openid,
                    phone : phone,
                    name : encodeURIComponent(name),
                    profession : encodeURIComponent(profession),
                    images : $images,
                    remark: encodeURIComponent(describe),
                    detailInfo : encodeURIComponent(JSON.stringify($allData))
                }, 'callbackActiveEntryInfoSaveHandler',true);

            });
        },
        btn_animate: function(str){
            str.addClass('flipInY');
            setTimeout(function(){
                str.removeClass('flipInY');
            },200);
        }
    };
    W.callbackActiveEntryInfoHandler = function(data){
        var me = H.sign;
        if(data.code == 0){
            $(".form").removeClass('none');
        }else{
            $(".not-start").removeClass('none');
        }
    };
    W.callbackActiveEntryInfoSaveHandler = function(data) {
        if (data.code == 0) {
            $(".form").addClass('none');
            $(".not-start").removeClass('none').html("恭喜您报名成功！<br/>报名成功后将会在华豫之门官方公众号里发起投票，每月票数最高的前四名将会被邀请参加节目录制。");
        } else {
            showTips("资料提交失败，请稍后重试");
        }
    };
})(Zepto);
$(function(){
    H.sign.init();
});


var vcity={ 11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",
    21:"辽宁",22:"吉林",23:"黑龙江",31:"上海",32:"江苏",
    33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",
    42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",
    51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",
    63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"
};

checkCard = function()
{
    var card = document.getElementById('card_no').value;
    //是否为空
    if(card === '')
    {
        showTips('请输入身份证号，身份证号不能为空');
        document.getElementById('card_no').focus;
        return false;
    }
    //校验长度，类型
    if(isCardNo(card) === false)
    {
        showTips('您输入的身份证号码不正确，请重新输入');
        document.getElementById('card_no').focus;
        return false;
    }
    //检查省份
    if(checkProvince(card) === false)
    {
        showTips('您输入的身份证号码不正确,请重新输入');
        document.getElementById('card_no').focus;
        return false;
    }
    //校验生日
    if(checkBirthday(card) === false)
    {
        showTips('您输入的身份证号码生日不正确,请重新输入');
        document.getElementById('card_no').focus();
        return false;
    }
    //检验位的检测
    if(checkParity(card) === false)
    {
        showTips('您的身份证校验位不正确,请重新输入');
        document.getElementById('card_no').focus();
        return false;
    }
    return true;
};


//检查号码是否符合规范，包括长度，类型
isCardNo = function(card)
{
    //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
    var reg = /(^\d{15}$)|(^\d{17}(\d|X)$)/;
    if(reg.test(card) === false)
    {
        return false;
    }

    return true;
};

//取身份证前两位,校验省份
checkProvince = function(card)
{
    var province = card.substr(0,2);
    if(vcity[province] == undefined)
    {
        return false;
    }
    return true;
};

//检查生日是否正确
checkBirthday = function(card)
{
    var len = card.length;
    //身份证15位时，次序为省（3位）市（3位）年（2位）月（2位）日（2位）校验位（3位），皆为数字
    if(len == '15')
    {
        var re_fifteen = /^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/;
        var arr_data = card.match(re_fifteen);
        var year = arr_data[2];
        var month = arr_data[3];
        var day = arr_data[4];
        var birthday = new Date('19'+year+'/'+month+'/'+day);
        return verifyBirthday('19'+year,month,day,birthday);
    }
    //身份证18位时，次序为省（3位）市（3位）年（4位）月（2位）日（2位）校验位（4位），校验位末尾可能为X
    if(len == '18')
    {
        var re_eighteen = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/;
        var arr_data = card.match(re_eighteen);
        var year = arr_data[2];
        var month = arr_data[3];
        var day = arr_data[4];
        var birthday = new Date(year+'/'+month+'/'+day);
        return verifyBirthday(year,month,day,birthday);
    }
    return false;
};

//校验日期
verifyBirthday = function(year,month,day,birthday)
{
    var now = new Date();
    var now_year = now.getFullYear();
    //年月日是否合理
    if(birthday.getFullYear() == year && (birthday.getMonth() + 1) == month && birthday.getDate() == day)
    {
        //判断年份的范围（3岁到100岁之间)
        var time = now_year - year;
        if(time >= 3 && time <= 100)
        {
            return true;
        }
        return false;
    }
    return false;
};

//校验位的检测
checkParity = function(card)
{
    //15位转18位
    card = changeFivteenToEighteen(card);
    var len = card.length;
    if(len == '18')
    {
        var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
        var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
        var cardTemp = 0, i, valnum;
        for(i = 0; i < 17; i ++)
        {
            cardTemp += card.substr(i, 1) * arrInt[i];
        }
        valnum = arrCh[cardTemp % 11];
        if (valnum == card.substr(17, 1))
        {
            return true;
        }
        return false;
    }
    return false;
};

//15位转18位身份证号
changeFivteenToEighteen = function(card)
{
    if(card.length == '15')
    {
        var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
        var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
        var cardTemp = 0, i;
        card = card.substr(0, 6) + '19' + card.substr(6, card.length - 6);
        for(i = 0; i < 17; i ++)
        {
            cardTemp += card.substr(i, 1) * arrInt[i];
        }
        card += arrCh[cardTemp % 11];
        return card;
    }
    return card;
};