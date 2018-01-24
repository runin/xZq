
wx.ready(function () {
  var shareData = {
    title: '新掌趣-所摇即所得',
    desc: '全国首批微信摇电视服务机构',
    link: 'http://yao.holdfun.cn/xzq/index.html',
    imgUrl: 'http://cdn.holdfun.cn/xzq/image/xzq_logo.png'
  };
  wx.onMenuShareAppMessage(shareData);
  wx.onMenuShareTimeline(shareData);
});

wx.error(function (res) {
  //alert(res.errMsg);
});
