var path = "D:/yaotv/zq-tv-resources/resources/cctv/cctv7-dajihe";

var srcJs = [
	path + '/js/plugins/md5.js',
	path + '/js/plugins/core.js',
	path + '/js/plugins/authorize_userinfo.js',
	path + '/js/plugins/util.js',
	path + '/js/diy/event.js',
	path + '/js/diy/resize.js',
	path + '/js/diy/dialog.js',
	path + '/js/app/yao.js',
	path + '/js/app/countdown.js',
	path + '/js/app/pv.js',
	path + '/js/app/wailian.js',
	path + '/js/app/cash.js',
	path + '/js/app/shiwu.js',
	path + '/js/app/chadiandian.js',
	path + '/js/app/chediandian.js',
	path + '/js/app/rollingrecord.js',
	path + '/js/app/tiantianyao.js'
];

var targetJs = path + '/js/yao.min.js';

var srcCss = [
	path + '/css/core.css',
	path + '/css/util.css',
	path + '/css/resize.css',
	path + '/css/reserve.css',
	path + '/css/rule.css'
];

var targetCss = path + '/css/style.min.css'



module.exports = function(grunt) {

  grunt.initConfig({
    
    concat: {
		options: {
			separator: ';',
		},
		js: {
			src: srcJs,
			dest: path + '/_build/index.concat.js'
		},
		css: {
			options: {
				separator: '\n',
			},
			src: srcCss,
			dest: path + '/_build/style.concat.css'
		}
    },
	
    uglify: {
      dist: {
        src: path + '/_build/index.concat.js',
        dest: targetJs
      }
    },
	
	cssmin: {
        my_target: {
            src: path + '/_build/style.concat.css',
            dest: targetCss
        }
    },
	
	watch: {
		js: {
			files: srcJs,
			tasks: ['js'],
		},
		css: {
			files: srcCss,
			tasks: ['css'],
		}
	}
   
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-css');
  grunt.loadNpmTasks('grunt-contrib-watch');


  grunt.registerTask('css', ['concat','cssmin']);
  
  grunt.registerTask('js', ['concat','uglify']);

  grunt.registerTask('default', function(){
	  grunt.task.run(['js', 'css']);
  });

};