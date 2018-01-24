//点击地图显示关闭
		var mBtn = document.getElementById('map_btn');
		var mclosd = true;
		var mcBtn1 = document.getElementById('sctck');

		if (mcBtn1) {
			mcBtn1.onclick = function() {
				if (sctck.style.display == 'block') {
					sctck.style.display = 'none';
				} else {
					sctck.style.display = 'block';
				}
			}
		}

		if (mBtn) {
			mBtn.onclick = function() {
				cc();
			}
		}

		function cc() {

		}

		function csyd() {
			sctck.innerHTML = "活动规则：<br/>&nbsp;&nbsp;2015年2月13、14日参加《有一个地方只有我们知道宜佳购物情人节》的朋友在活动页面回答3个小问题，答对将“即时”获得由宜佳购物为您准备的滴滴打车红包一个，并将进入情人节大奖的抽取环节。参与者按参与活动顺序排名，在每千人的中的第214位的为一等奖、第520位的为二等奖、第921位的为三等奖，每个奖项奖品100组。中奖名单将在2月16在“宜佳网上商城”微信服务号公布，您可微信搜索并关注“yijiagouwu”，用参与活动的微信号领取奖品。<br/>用你小手赢得大奖吧， 宜佳购物送有情人一个难忘的情人节。<br/>一等奖：凯悦挂烫机。<br/>二等奖：床品四件套 <br/>三等奖：3M防雾霾口罩<br/>宜佳购物拥有活动最终解释权！";
			//       sctck.style.marginLeft="-159px";
			sctck.style.display = "block";
			setTimeout(function() {
				sctck.style.display = "none";
				cc();
			}, 60000000);

		}
		
		function showImg() {
			if (imgId.style.visibility == "visible")
				//如果可见，则隐藏
				imgId.style.visibility = "hidden";
			else
				imgId.style.visibility = "visible";
			//设置图像可见
			setTimeout('showImg()', 500);
			//间隔的毫秒
		}
		showImg();