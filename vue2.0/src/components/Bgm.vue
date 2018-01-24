<template>
	<section v-tap="{methods : toggerBgm}"  class="bgm-vue">
        <section v-if="isPlaying" class="bgm-control bgm-no"></section>
        <section v-if="!isPlaying" class="bgm-control bgm-yes"></section>
	</section>
</template>

<script>

export default{
    name: 'Bgm',
    props: {
        musicData: Object
    },

    data(){
        return {
            music: null,
            isPlaying: true,
            musicObj: null
        }
    },

    methods: {
        init: function(){
            $('audio').remove();
            this.musicObj = document.createElement("audio");
			this.musicObj.src = this.music.url;
			this.musicObj.loop = "loop";
			this.musicObj.autoplay = false;
			document.body.appendChild(this.musicObj);

			this.musicObj.play();
			if(this.musicObj.paused){
				document.addEventListener('touchstart', this.touchplay, false);
			}
        },

        touchplay: function(){
			this.musicObj.play();
			document.removeEventListener('touchstart', this.touchplay, false);
        },

        toggerBgm: function(){
        	if(!this.isPlaying){
        		this.isPlaying = true;
        		this.musicObj.play();
        	}else{
        		this.isPlaying = false;
        		this.musicObj.pause();
        	}
        }
    },

    created: function(){
        this.music = this.musicData;
        this.init();
        var that = this;
        eventHub.$on('stopMusic', function(){
            setTimeout(function(){
                that.musicObj.pause();
                that.isPlaying = false;
                document.removeEventListener('touchstart', that.touchplay, false);
            }, 100);
        })

        eventHub.$on('updateMusic', function(music){
            that.music = music;
            that.musicObj.pause();
            that.init();
        });
    }
}
</script>

<style scoped>
.bgm-vue{
	position: fixed;
	right: 12px;
	top: 12px;
	width: 30px;
	height: 30px;
	
	z-index: 101;
	border-radius: 50%;
	padding: 6px;
    background: rgba(0,0,0,.6);
}
.bgm-vue .bgm-control{
    width: 18px;
    height: 18px;
    background: url(/static/photo/icon-music@2x.png) no-repeat;
    background-size: 19px 36px;
    margin-left: 0px;
    margin-top: 1px;
}
.bgm-vue .bgm-control.bgm-yes{
    background-position: 0 0
}
.bgm-vue .bgm-control.bgm-no{
    background-position: 0 -19px
}
</style>