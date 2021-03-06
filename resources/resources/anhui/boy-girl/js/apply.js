(function($) {
	
	H.form = {
		init:function  () {
			$('.on-check').click(function(){
				$('.no-check b').removeClass('checked');
				$('.on-check b').addClass('checked');
			});
			$('.no-check').click(function(){
				$('.no-check b').addClass('checked');
				$('.on-check b').removeClass('checked');
			});
			$('.heart-check').click(function(){
				$('.noheart-check b').removeClass('checked');
				$('.heart-check b').addClass('checked');
			});
			$('.noheart-check').click(function(){
				$('.noheart-check b').addClass('checked');
				$('.heart-check b').removeClass('checked');
			});
			//婚恋
			$('.dating-check').click(function(){
				$('.dating-check2 b').removeClass('checked');
				$('.dating-check3 b').removeClass('checked');
				$('.dating-check b').addClass('checked');
			});
			$('.dating-check2').click(function(){
				$('.dating-check2 b').addClass('checked');
				$('.dating-check3 b').removeClass('checked');
				$('.dating-check b').removeClass('checked');
			});
			$('.dating-check3').click(function(){
				$('.dating-check2 b').removeClass('checked');
				$('.dating-check3 b').addClass('checked');
				$('.dating-check b').removeClass('checked');
			});
			//首次冲关
			$('.firstP1').click(function(){
				$('.firstP2 b').removeClass('checked');
				$('.firstP1 b').addClass('checked');
			});
			$('.firstP2').click(function(){
				$('.firstP2 b').addClass('checked');
				$('.firstP1 b').removeClass('checked');
			});
			//是否愿意参加决赛
			$('.finalsP1').click(function(){
				$('.finalsP2 b').removeClass('checked');
				$('.finalsP1 b').addClass('checked');
			});
			$('.finalsP2').click(function(){
				$('.finalsP2 b').addClass('checked');
				$('.finalsP1 b').removeClass('checked');
			});
			//地区默认值
			addressInit('cmbProvince', 'cmbCity', 'cmbArea', '', '', '');
			
			H.form.event();
		}
		,event:function  () {
			var me=this;
			$(".sign").height("100%");
			$(".sign").css("display","block");
			$(".psubmit").click(function  () {
				var res=formSerializable($("#form1"));
				var detailInfo=[];
				var phone=encodeURIComponent(res.phone); // 手机号
				var name=encodeURIComponent(res.name);   //姓名 
				var profession=encodeURIComponent(res.profession); //职业
				var address=encodeURIComponent(res.province+res.city); //地区
				var images=""; //暂无
				var remark=encodeURIComponent(res.remark); //简介(500字以内) 
				var age=encodeURIComponent(!res.age?0:res.age); //年龄
				var sex=encodeURIComponent(res.sex); //性别：0未知  1男  2女 
				detailInfo.push({
					zodiac:res.zodiac, //生肖
					national:res.national, //民族
					native:res.native,	//籍贯
					live:res.live,	//居住时间
					record:res.record,	//最高学历
					school:res.school,	//毕业院校
					major:res.major,	 //专业
					shengao:res.shengao,	//身高
					tizhong:res.tizhong,	//体重
					identity:res.identity,	//心脏病史
					shenfen:res.shenfen,	//身份证号
					marriage:res.marriage,	//婚恋状况 0单身 1热恋 2已婚
					forTheFirstTime:res.forTheFirstTime,	//首次冲关 1是  0否
					promotion:res.promotion    //晋级后是否愿意参加晋级赛、决赛 1是 0否
				});
				detailInfo=JSON.stringify(res);	// 传入json字符串
				detailInfo=encodeURIComponent(detailInfo);
				me.getActiveEntryInfoSaveHandler(phone,name,profession,address,images,remark,age,sex,detailInfo);
			});
		}
		,getActiveEntryInfoSaveHandler:function  (phone,name,profession,address,images,remark,age,sex,detailInfo) { //活动报名信息接口
			if(age!=null){
				if(parseInt(age)<0||!/\d/g.test(age)){
					alert("年龄输入格式不正确");
//					$("#age").val("");
//					$("#age").css("border","1px solid red");
					return;
				}
			}
			if(!phone){
				alert("手机号码不能为空");
				return;
			}else if(!/^(13[0-9]|14[0-9]|15[0-9]|18[0-9])\d{8}$/i.test(phone)){
			    alert('手机号码格式不正确');
			    return;
			}
			getResult("api/entryinfo/save",{
				openid:openid,  // 必填
				phone:phone, // 必填
				name:name,
				profession:profession,
				address:address,
				images:images,
				remark:remark,
				age:age,
				sex:sex,
				detailInfo:detailInfo
			},"callbackActiveEntryInfoSaveHandler",true, null, true);
		}
	
	};
	
	W.callbackActiveEntryInfoSaveHandler=function  (data) { //活动报名信息接口
		if(data.code==0){
			alert("报名成功");
			location.href="index.html"; 
		}else{
			alert("报名失败");
			return;
		}
	}
	
	H.form.init();
})(Zepto);