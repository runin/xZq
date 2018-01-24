; (function (w, $) { 
   
   /***********游戏对象***********/
   {
     w.Game =function(){
        this.score =0;//用户得到的分数
        this.maxScore =0;//最大分数
        this.gameTime =10;//游戏时间 10秒
        this.dowmCorps = [];//下落物体集合
        this.getScoreCallBack=null;//获得的积分
    };
    Game.prototype.init =function(){
        this.initParm();
        this.initMove();
    };
    Game.prototype.initParm =function(){
         this.stage_main = $("#stage_main");//总容器
         this.renderer = PIXI.autoDetectRenderer($(window).width(), $(window).height());//渲染器
         this.stage =  new PIXI.Container();//分容器
    };
    Game.prototype.initMove=function(){
           this.setBg();//设置背景
           this.pop();//设置弹框pop
           this.initBucket();//初始化爆米花桶
           this.downCountFn();//游戏倒计时
           this.stage_main.append(this.renderer.view);//所有东西放到容器下
    };
    Game.prototype.setBg =function(){//画背景
       this.stage_main.css({width:this.renderer.width,height:this.renderer.height});
       this.background = PIXI.Sprite.fromImage('./images/bg-game.jpg');
       this.background.width = this.renderer.width;
       this.background.height = this.renderer.height;
       this.stage.addChild(this.background);
    };
    Game.prototype.pop =function(){//开始的时候弹出文字
       this.popIcon = PIXI.Texture.fromImage('');
       this.popdude = new PIXI.Sprite(this.popIcon);
       this.popdude.scale.set(0.1);
       this.popdude.anchor.x = 0.5;
       this.popdude.anchor.y = 0.5;
       this.popdude.position.x = this.renderer.width/2;
       this.popdude.position.y = this.renderer.height*0.2;
       this.stage.addChild(this.popdude);
    };
    Game.prototype.initBucket =function(){
        this.Bucket = new Bucket(this);
    };
    Game.prototype.initCorps =function(){
       this.setEachCorpsNum(this);
       this.Corps = new Corps(this).getCorps();
        
    };
    Game.prototype.setEachCorpsNum =function(that){//根据最大分值计算每个物体的数量
          this.person1 ={ name:"person1", count:1,url:"images/game-head/person1.png",rotation:0.01,speed:4,score:1,percent:0.05,setCount:function(){ this.count = Math.ceil(that.maxScore*this.percent/this.score) } };//美女1
          this.person2={ name:"person2", count:1,url:"images/game-head/person2.png",rotation:0.01,speed:5,score:2 ,percent:0.05,setCount:function(){ this.count = Math.ceil(that.maxScore*this.percent/this.score)}};//美女2
          this.person3={ name:"person3", count:1,url:"images/game-head/person3.png",rotation:0.01,speed:6,score:3,percent:0.05,setCount:function(){ this.count = Math.ceil(that.maxScore*this.percent/this.score) }};//美女3
          this.person4 ={ name:"person4", count:1,url:"images/game-head/person4.png",rotation:0.01,speed:7,score:5,percent:0.1,setCount:function(){ this.count = Math.ceil(that.maxScore*this.percent/this.score) } };//美女4
          this.person5={ name:"person5", count:1,url:"images/game-head/person5.png",rotation:0.01,speed:4,score:1 ,percent:0.05,setCount:function(){ this.count = Math.ceil(that.maxScore*this.percent/this.score)}};//美女5
          this.person6={ name:"person6", count:1,url:"images/game-head/person6.png",rotation:0.01,speed:5,score:2,percent:0.05,setCount:function(){ this.count = Math.ceil(that.maxScore*this.percent/this.score) }};//美女6
          this.person7 ={ name:"person7", count:1,url:"images/game-head/person7.png",rotation:0.01,speed:6,score:3,percent:0.05,setCount:function(){ this.count = Math.ceil(that.maxScore*this.percent/this.score) } };//美女7
          this.person8={ name:"person8", count:1,url:"images/game-head/person8.png",rotation:0.01,speed:7,score:5 ,percent:0.01,setCount:function(){ this.count = Math.ceil(that.maxScore*this.percent/this.score)}};//美女8
          this.person9={ name:"person9", count:1,url:"images/game-head/person9.png",rotation:0.01,speed:4,score:1,percent:0.05,setCount:function(){ this.count = Math.ceil(that.maxScore*this.percent/this.score) }};//美女9
          this.person10={ name:"person10", count:1,url:"images/game-head/person10.png",rotation:0.01,speed:5,score:2,percent:0.05,setCount:function(){ this.count = Math.ceil(that.maxScore*this.percent/this.score) }};//美女10
          this.person11 ={ name:"person11", count:1,url:"images/game-head/person11.png",rotation:0.01,speed:6,score:3,percent:0.05,setCount:function(){ this.count = Math.ceil(that.maxScore*this.percent/this.score) } };//美女11
          this.person12={ name:"person12", count:1,url:"images/game-head/person12.png",rotation:0.01,speed:7,score:5 ,percent:0.05,setCount:function(){ this.count = Math.ceil(that.maxScore*this.percent/this.score)}};//美女12
          this.evil ={ name:"evil", count:1,url:"images/game-head/icon-evil.png",rotation:0.01,speed:6,score:-5 ,percent:0.05,setCount:function(){ this.count = -(Math.ceil(that.maxScore*this.percent/this.score))}};//男主持，扣分的
          this.boom ={ name:"boom", count:1,url:"images/game-head/icon-boom.png",rotation:0.01,speed:8,score:-5 ,percent:0.9,setCount:function(){ this.count = -(Math.ceil(that.maxScore*this.percent/this.score))}};//炸弹，直接结束游戏
         //总分
          this.person1.count = 30;//美女1*1
          this.person5.count = 30;//美女5*1
          this.person9.count = 30;//美女9*1
		  this.person2.count = 30;//美女2*2
          this.person6.count = 30;//美女6*2
          this.person10.count = 20;//美女10*2
          this.person3.count = 20;//美女3*3
          this.person7.count = 20;//美女7*3
          this.person11.count = 20;//美女11*3
          this.person4.count = 5;//美女4*5
          this.person8.count = 5;//美女8*5
          this.person12.count = 15;//美女12*5
          this.evil.count= 40;   //男主持
          this.boom.setCount();
          var that =this;
          function setSpeed(){
              var h = $(window).height();
              that.person1.speed =that.person1.speed*h/568; 
              that.person2.speed =that.person2.speed*h/568;
              that.person3.speed =that.person3.speed*h/568;
              that.person4.speed =that.person4.speed*h/568;
              that.person5.speed =that.person5.speed*h/568;
              that.person6.speed =that.person6.speed*h/568;
              that.person7.speed =that.person7.speed*h/568;
              that.person8.speed =that.person8.speed*h/568;
              that.person9.speed =that.person9.speed*h/568;
              that.person10.speed =that.person10.speed*h/568;
              that.person11.speed =that.person11.speed*h/568;
              that.person12.speed =that.person12.speed*h/568;
              that.evil.speed=that.evil.speed*h/568;   //恶魔
              that.boom.speed=that.boom.speed*h/568;
          };
          setSpeed(); 
    };
     Game.prototype.reStart =function(obj){
         this.stage_main.empty();
         this.isEnd =false;
         this.pCount =null;
         this.score =0;//用户得到的分数
         this.maxScore =0;//最大分数
         this.gameTime =10;//游戏时间 10秒
         this.dowmCorps = [];//下落物体集合
         this.getScoreCallBack=null;//获得的积分
         this.popdude.visible =true;
         this.popdude.visible =true;
         this.Corps =[];
         this.Bucket =[];
         this.renderer =null;
         this.stage =null;
         this.BucketDude =null;
         this.background =null;
         this.person1 =null;
         this.person2=null;
         this.person3=null;
         this.person4 =null;
         this.person5 =null;
         this.person6=null;
         this.person7=null;
         this.person8 =null;
         this.person9 =null;
         this.person10=null;
         this.person11=null;
         this.person12 =null;
         this.evil =null;///恶魔，扣分的
         this.boom =null;///炸弹
         this.popIcon =null;
         this.popdude =null;
         this.downContainer =null;
         this.downCount =null;
         this.downText =null;
         window.corpsItem  =null;
         window.GameDownCount&& clearInterval(window.GameDownCount);
         window.GameTimeOver&& clearTimeout(window.GameTimeOver);
         this.start(obj||this.object);
     };
    Game.prototype.start =function(object){//开始游戏
         var that =this;
         this.object =$.extend({
            maxScore:199,
            getScoreCallBack:null
         },object||{});
         $.extend(this,object);
         this.gameTimeTemp =this.gameTime;
         var allHeight = $(window).height();//总高度
         var allWidth =$(window).width();
         this.init();
         this.initCorps();//掉落物初始化
         function popdudeAnimate(){//pop文字的动画
              if(that.pCount>0.5) return;
              if(!that.pCount) that.pCount=0.1;
              that.pCount+=0.02;
              that.popdude.scale.set(that.pCount>=0.5?0.5:that.pCount);
              if(that.pCount>=0.5){
                downCountAnimate();
                setTimeout(function(){
                    that.popdude.visible =false;
                },1000);
              }
         };
          {//动态加上云朵
             var addCorpsNum =1;
             var lastCorps =null;
             function downCountAnimate(){
             	 var tag =false;
             	window.GameTimeOver = setTimeout(function(){
             		 that.end();
             	},gameTime);
                window.GameDownCount = setInterval(function(){
                	
                    var item =RandomCorps();
                    if(item!=false){
                        EachArr.push(item);
                        lastCorps = item;
                        addCorpsNum++;
                    }else{ 
                        if((addCorpsNum==that.Corps.length-1)&&(lastCorps.dude.position.y>allHeight)){
                            for(var i=EachArr.length-20;i<EachArr.length;i++){
                                if(EachArr[i].dude.position.y<allHeight){
                                    tag=false;
                                }
                            }
                            if(tag){
                              that.end();
                            }
                        }
                     }   
               },300);
             }
        }
        {//掉落物的功能模块
            window.CorpsObj =  getRandomCorps();
            var RandomCorps = CorpsObj.getCorps;
            var EachArr =[];
            EachArr.push(RandomCorps());

	        function getRandomCorps(){//取出随机不重复掉落物
	            var arrRandom=[];
	            var min =0;
	            var max = that.Corps.length-1;
	            function random(min,max){
	                return Math.floor(min+Math.random()*(max-min));
	            }
	
	            return {  
	            	getCorps: function(){
	                    var randomIndex = random(min,max);
	                    var tag = false;
	                    var l =  that.Corps.length;
	                    while(l>0){
	                        l--;
	                        if(arrRandom.indexOf(randomIndex) ==-1){
	                            tag =true;
	                            arrRandom.push(randomIndex);
	                            break;
	                        }else{
	                            randomIndex = random(min,max);
	                        }
	                    }
	                    if(tag){
	                        return that.Corps[randomIndex];
	                    }else{
	                        return false;
	                    }    
		            },clear:function(){
		               arrRandom=null;  
		            } 
	           	}
			};
            function getEachArr(){
            	var arr =[];
            	that.perSecondLen = that.Corps.length%that.gameTimeTemp==0?that.Corps.length/that.gameTimeTemp:(that.Corps.length/that.gameTimeTemp+1); 
               	for(var i=0;i< that.perSecondLen;i++){
                  	var item =RandomCorps();
                  	if(item!=false){
	                    arr.push(RandomCorps());
	                }
            	}
            	return arr;
        	};
           function corpsAnimate(){//云朵动画
            if(that.popdude.visible==false){
               for(var i=0;i<EachArr.length;i++){
                   if((!EachArr[i])||EachArr[i].isCompleter==true){
                       continue;
                   }
                   EachArr[i].dude.position.y +=  EachArr[i].speed;
                   EachArr[i].dude.rotation +=EachArr[i].rotation;
                   if(window.smallCorpsSpecial){
                         that.Bucket.removeChild();
                         for(var k=0;k<window.smallCorpsSpecial.length;k++){
                            var sm= smallCorpsSpecial[k];
                             sm.setPlace();
                             sm.dude.rotation+=sm.rotation;
                             sm.dude.visible = true;
                         }
                   }
                   EachArr[i].calculateTarget(function(ishit,target){
                        if(ishit&&!target.ishit){//表示命中
                           target.ishit =true;//标记已经命中
                           if(target.classify.name=="boom"){//命中炸弹
                              target.setSpecialEffects(function(){
                                    
                                    that.end(); 
                                    // that.fail();   
                              });
                              return;
                           }
                           target.dude.visible =false;//隐藏
                           if(that.score==0){
                              that.Bucket.addChild();
                           }
                           that.score +=  target.classify.score;//累加分数
                           if(that.score<=0) {
                              that.downText.text = "0分";
                           } else if(that.score<10){
                               that.downText.text = "0" + that.score+"分";
                           }else{
                               that.downText.text =  that.score+"分";
                           }
                           if(that.score>99){
                             that.downText.position.x = allWidth - 68;
                           }
                           if(that.getScoreCallBack){
                              that.getScoreCallBack(that.score);
                           }
                        }else{
                        }
                    });
                   if(EachArr[i].dude.position.y>allHeight){
                      EachArr[i].dude.visible =false;
                      EachArr[i].isCompleter = true;
                  
                   }
               }
            }
         };
        } 
         that.isEnd =false;

         function animate() {
              if(that.isEnd) {
                return;
              }
              popdudeAnimate();
              corpsAnimate();
              window.game_re = requestAnimationFrame(animate);
              that.renderer.render(that.stage);//重新渲染
         };
        animate();//开始
        object&&object.callBack&&object.callBack(that);//回调函数
    };
    Game.prototype.fail =function(object){//碰到炸弹结束游戏
          this.isEnd =true;
          for(var i=0;i<this.Corps.length;i++){
              this.Corps[i].dude.visible =false;
          }
          this.Corps =[];
          if(object&&object.getScoreCallBack){
             object.getScoreCallBack(this.score);
          };
         this.failCallBack && this.failCallBack(this.score);
         window.GameDownCount && clearInterval(window.GameDownCount);
         window.GameTimeOver && clearTimeout(window.GameTimeOver);
         window.cancelAnimationFrame(window.game_re);
         window.smallCorpsSpecial =null;
         window.CorpsObj.clear();
    };
    Game.prototype.end =function(object){//结束游戏
          this.isEnd =true;
          for(var i=0;i<this.Corps.length;i++){
              this.Corps[i].dude.visible =false;
          }
          this.Corps =[];
          if(object&&object.getScoreCallBack){
             object.getScoreCallBack(this.score);
          };
         this.endCallBack && this.endCallBack(this.score);
         window.GameDownCount && clearInterval(window.GameDownCount);
         window.GameTimeOver && clearTimeout(window.GameTimeOver);
         window.cancelAnimationFrame(window.game_re);
         window.smallCorpsSpecial =null;
         window.CorpsObj.clear();
    };
    Game.prototype.getScore =function(){//获取游戏
         return this.score;
    };
    Game.prototype.downCountFn = function(){
             
              this.downContainer = new PIXI.Container();
              var d_bg = PIXI.Texture.fromImage('images/s-bg.png');
              this.downCount = new PIXI.Sprite(d_bg);
              this.downCount.scale.set(0.7);
              this.downCount.position.x = $(window).width()- 75;
              this.downCount.position.y = 10;
              this.downCount.anchor.x = 0;
              this.downCount.anchor.y = 0;
              this.downContainer.addChild(this.downCount);
   				var style = {
				    font : '26px Arial',
				    fill : '#fff',
				    stroke : '#4a1850',
				    strokeThickness : 5,
				    dropShadow : true,
				    dropShadowColor : '#000000',
				};
              this.downText = new PIXI.Text("0"+this.score + "分",style);
              this.downText.style.align ="center";
              this.downText.width=120;
              this.downText.height =40;
              this.downText.scale.set(0.7);
              this.downText.position.x = $(window).width()-  64;
              this.downText.position.y = 30;
              this.downText.anchor.x = 0;
              this.downText.anchor.y = 0;
              this.downContainer.addChild(this.downText);
              this.stage.addChild(this.downContainer);
    };
   }
   /***********游戏对象结束***********/


  /***********下落的物体/***********/
   {
       function Corps(that){
            function random(min,max){
                return Math.floor(min+Math.random()*(max-min));
            }
          this.itemArr =[];
          window.corpsItem  =  function(that,url,classify,isHide){
              this.classify = classify;
              this.speed= classify.speed+Math.random()*2;
              var r = classify.rotation+(Math.random()/100);
              if(random(0,10)%2==0){
                 r =-r;
              }else{
                
              }
              this.rotation =r;
              this.tt = PIXI.Texture.fromImage(url);
              this.dude = new PIXI.Sprite(this.tt);
              if(isHide){
                 this.dude.visible =false;
              }
              this.px=random(40,$(window).width()-40);
              this.py=-100;
              this.dude.position.x = this.px;
              this.dude.position.y = this.py;
              this.dude.anchor.x = 0.5;
              this.dude.anchor.y = 0.5;
              that.stage.addChild(this.dude);
          };
          corpsItem.prototype.calculateTarget =function(fn){//计算是否命中
                    var width = that.BucketDude.width;
                    var height =  that.BucketDude.height;
                    var width2 = this.dude.width;
                    var b_x  =that.BucketDude.x;
                    var b_y  =that.BucketDude.y;
                    var t_x =  this.dude.position.x;
                    var t_y =  this.dude.position.y;
                    var dis_x_right = b_x + width/2;
                    var dis_x_left = b_x -width/2;
                    if(t_y<0){ return;};
                    if(t_x<dis_x_right&&t_x>dis_x_left&& Math.abs(t_y-(b_y-height/2))<5){
                        fn&&fn(true,this);
                    }
          };

         corpsItem.prototype.setSpecialEffects =function(fn){//爆炸特效
            for(var i=0;i<that.Corps.length;i++){
              that.Corps[i].dude.visible =false;
              that.Corps[i].ishit =true;
            }
            window.smallCorpsSpecial=[];//爆炸散开的云朵
            for(var i=0,len=30;i<len;i++){
              var item = new corpsItem(that,that.person4.url,that.person1.url,that.person2.url,that.person3.url,true);
                 item.dude.position.x = that.BucketDude.position.x;
                 item.dude.position.y = that.BucketDude.position.y;
                 var randomNum = Math.random();
                 var r = (randomNum > .3) ? 8 * Math.random() : 8;
                 item.angle = 2 * Math.PI * Math.random();
                 item.dx = r * Math.sin(item.angle);
                 item.dy = r * Math.cos(item.angle) - 4;
                 item.setPlace =function(){
                    this.dude.position.x+=this.dx/3.5;
                    this.dude.position.y+=this.dy/3.5;
                 };
              smallCorpsSpecial.push(item);  
            }
             setTimeout(function(){
                 fn&&fn();
             },1000);
          };

          for(var i=0,len=that.person1.count;i<len;i++){
              this.itemArr.push(new corpsItem(that,that.person1.url,that.person1));
          }
          for(i=0,len=that.person2.count;i<len;i++){
               this.itemArr.push(new corpsItem(that,that.person2.url,that.person2));  
          }
        
          for(i=0,len=that.person3.count;i<len;i++){
               this.itemArr.push(new corpsItem(that,that.person3.url,that.person3));     
          }
          for(i=0,len=that.person4.count;i<len;i++){
               this.itemArr.push(new corpsItem(that,that.person4.url,that.person4));     
          }
          for(var i=0,len=that.person5.count;i<len;i++){
              this.itemArr.push(new corpsItem(that,that.person5.url,that.person5));
          }
          for(var i=0,len=that.person6.count;i<len;i++){
              this.itemArr.push(new corpsItem(that,that.person6.url,that.person6));
          }
          for(var i=0,len=that.person7.count;i<len;i++){
              this.itemArr.push(new corpsItem(that,that.person7.url,that.person7));
          }
          for(var i=0,len=that.person8.count;i<len;i++){
              this.itemArr.push(new corpsItem(that,that.person8.url,that.person8));
          }
          for(var i=0,len=that.person9.count;i<len;i++){
              this.itemArr.push(new corpsItem(that,that.person9.url,that.person9));
          }
          for(var i=0,len=that.person10.count;i<len;i++){
              this.itemArr.push(new corpsItem(that,that.person10.url,that.person10));
          }
           for(var i=0,len=that.person11.count;i<len;i++){
              this.itemArr.push(new corpsItem(that,that.person11.url,that.person11));
          }
          for(var i=0,len=that.person12.count;i<len;i++){
              this.itemArr.push(new corpsItem(that,that.person12.url,that.person12));
          }
          for(i=0,len=that.boom.count;i<len;i++){
               this.itemArr.push(new corpsItem(that,that.boom.url,that.boom));   
          }
          for(i=0,len=that.evil.count;i<len;i++){
               this.itemArr.push(new corpsItem(that,that.evil.url,that.evil));   
          }
       };
      Corps.prototype.getCorps =function(){
          return this.itemArr;
      };




    }
  /***********下落的物体结束***********/


   /***********爆米花桶***********/
   {
      function Bucket(that){
           var this_Bucket =this;
           var  loader =  PIXI.loader.add('images/icon-bag.png').load(function(){
                this_Bucket.Bucket = PIXI.Texture.fromImage('images/icon-bag.png');
                that.BucketDude = new PIXI.Sprite(this_Bucket.Bucket);
                that.BucketDude.scale.set(0.6);
                that.BucketDude.anchor.x = 0.5;
                that.BucketDude.anchor.y = 0.5;
                that.BucketDude.position.x = that.renderer.width/2;
                that.BucketDude.position.y = that.renderer.height-that.BucketDude.height/2-5;
                that.stage.addChild(that.BucketDude);
                this_Bucket.BucketDude= that.BucketDude;
                this_Bucket.dragging(that);
                loader.resources['images/icon-bag.png'] =null;
            });

      };
      Bucket.prototype.getBucket =function(){
          return this.BucketDude;
      };
      Bucket.prototype.dragging =function(that){//桶拖动
        that.BucketDude.interactive = true;
        that.BucketDude.buttonMode = true;
        that.BucketDude.on('mousedown', onDragStart).on('touchstart', onDragStart)
        .on('mouseup', onDragEnd)
        .on('mouseupoutside', onDragEnd)
        .on('touchend', onDragEnd)
        .on('touchendoutside', onDragEnd)
        .on('mousemove', onDragMove)
        .on('touchmove', onDragMove);
        function onDragStart(event){
            this.data = event.data;
            this.dragging = true;
        };
        function onDragEnd(){
            this.dragging = false;
            this.data = null;
        };
        function onDragMove(){
            if (this.dragging){
                var newPosition = this.data.getLocalPosition(this.parent);
                var x = newPosition.x;
                if(x<that.BucketDude.width/2){
                   x=that.BucketDude.width/2;
                }
                if(x> that.renderer.width - that.BucketDude.width/2){
                  x = that.renderer.width - that.BucketDude.width/2;
                }
                this.position.x = x;

            }
        }
      };
      Bucket.prototype.addChild =function(){
              var sm = PIXI.Texture.fromImage('images/game-head/person1.png');
              var sms = new PIXI.Sprite(sm);
              sms.scale.set(1);
              sms.anchor.x = 0;
              sms.anchor.y = 0;
              sms.position.x =  - this.BucketDude.width+50;
              sms.position.y =  - this.BucketDude.height-30;
              this.sms = sms;
              this.BucketDude.addChild(this.sms);

              var sm = PIXI.Texture.fromImage('images/game-head/person2.png');
              var sms = new PIXI.Sprite(sm);
              sms.scale.set(1);
              sms.anchor.x = 0;
              sms.anchor.y = 0;
              sms.position.x =  - this.BucketDude.width+100;
              sms.position.y =  - this.BucketDude.height-50;
              this.sms2 =sms;
              this.BucketDude.addChild(this.sms2);
		      var sm = PIXI.Texture.fromImage('images/game-head/person3.png');
              var sms = new PIXI.Sprite(sm);
              sms.scale.set(1);
              sms.anchor.x = 0;
              sms.anchor.y = 0;
              sms.position.x =  - this.BucketDude.width+100;
              sms.position.y =  - this.BucketDude.height-10;
              this.sms2 =sms;
              this.BucketDude.addChild(this.sms2);
              var sm = PIXI.Texture.fromImage('images/icon-bag.png');
              var sms = new PIXI.Sprite(sm);
              sms.anchor.x = 0.5;
              sms.anchor.y = 0.5;
              this.sms3 =sms;
              this.BucketDude.addChild(this.sms3);
              
        };
         Bucket.prototype.removeChild =function(){
              
              this.BucketDude.removeChildren();
             
         }

   }
   /***********爆米花桶结束***********/
  
})(window,Zepto);