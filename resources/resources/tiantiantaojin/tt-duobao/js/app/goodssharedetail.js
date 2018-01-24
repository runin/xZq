
var uuid=getQueryString("goods_id");
(function($) {
	H.goodssharedetail = {
		init:function()
		{
			var me = this;
				me.event();
				// me.getShareDate();
				me.getShareDetail();
		},
		getShareDetail:function()
		{
			getResult("indianaShareOrder/details",{suid:uuid},"indianaShareOneOrderCallBackHandler",true)
		},
		shareList:function(data)
		{
			var t = simpleTpl();
			var t1 = simpleTpl();
			var t2 = simpleTpl();
			var length = data.length;
			var imgList = data.si.split(";");

			t._('<div class="share-detail">')
			._(' <p class="title">'+data.sb+'</p>')
			._(' <p class="author"><span class="nickname txt-red" data-cid="">'+data.nk+'</span><span class="time">'+data.rtb+'</span></p>')
            ._(' <div class="goods ">')
            ._(' <p>获奖商品：<span class="goodsName" >'+data.pn+'</span></p>')
            ._(' <p>商品期号：'+data.per+'</p>')
            ._(' <p>本期参与：<span class="txt-red">'+(data.ct?data.ct:"1")+'</span>人次</p>')
            ._(' <p>幸运号码：<span class="txt-red">'+data.winn+'</span></p>')
            ._(' <p>揭晓时间：'+data.lt+'</p> </div>')
            ._(' <div class="all txt-grey">')
            ._('<div class="txt">'+data.sm.replace(/<.*?>/ig,"")+'<div>')
            
			for(var i = 0;i<imgList.length;i++)
			{
				t1._('<p><img src="'+imgList[i]+ '" class=""></p>')
			}

            t2._('</div>')  
            ._('</div>')   
            ._('</div>')   
			$(".share-detail-content").append(t.toString()+t1.toString()+t2.toString());
		},

		event:function()
		{
			
		},
	}
		  

	W.indianaShareOneOrderCallBackHandler=function(data)
	{
		if(data.result)
		{
			H.goodssharedetail.shareList(data);
		}
		else
		{

		}
	}
})(Zepto);

$(function() {
	H.goodssharedetail.init();
});