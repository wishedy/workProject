var gulp=require("gulp"),
	sass=require("gulp-sass"),
	autoprefixer=require("gulp-autoprefixer"),
	//imagemin = require("gulp-imagemin"),
    cleancss = require("gulp-clean-css");
    //browserSync=require("browser-sync").create();
    uglify = require("gulp-uglify"),//压缩js
    concat = require("gulp-concat"),//合并
    cssnano = require("gulp-cssnano"),//压缩css
//image = require("gulp-imagemin"),//图片压缩
//cache = require('gulp-cache'),//只压缩修改的图片 没有修改的图片直接从缓存文件读取
//htmlreplace = require("gulp-html-replace"),//替换js,css路径
    rev = require("gulp-rev"),//添加版本号
//revAll = require("gulp-rev-all"),
    revCollector = require('gulp-rev-collector'),//替换文件版本
    runSequence = require('run-sequence'),//顺序执行gulp任务
    useref = require('gulp-useref'),//合并html中应用的css和js
//gulpIf = require('gulp-if'),//gulp的if判断
    utf8 = require('gulp-utf8-convert'),
    encode = require('gulp-convert-encoding'),
    clean = require("gulp-clean"),//删除
    sourcemaps = require('gulp-sourcemaps'), //线下环境需新增
    request = require('request');
//Ψҽpc
gulp.task("watch-pc", function() {
    gulp.watch("./scss/**/*.scss", ['sass-pc']);
});

gulp.task("sass-pc", function() {
    return gulp.src("./scss/**/*.scss").
    pipe(sass({ outputStyle: "expanded" ,indentWidth:4,indentType:'space'})).
    // pipe(cleancss({
        // advanced: false,
        // compatibility: 'ie8',
        // keepBreaks: false,
        // keepSpecialComments: '*'
    // })).
    pipe(autoprefixer({
        browsers:['Android >= 3.5','last 4 versions', 'ie >= 8', 'ie_mob >= 10', 'ff >= 30', 'chrome >= 34', 'safari >= 6', 'opera >= 12.1', 'ios >= 6', 'bb >= 10'],
        cascode:true
    }
)).
    pipe(gulp.dest("./css/"));
});

//Ψҽh5
gulp.task("watch-h5", function() {
    gulp.watch("./scss/**/*.scss", ['sass-h5']);
});

gulp.task("sass-h5", function() {
    return gulp.src("./scss/**/*.scss").
    pipe(sass({ outputStyle: "expanded" ,indentWidth:4,indentType:'space'})).
    // pipe(cleancss({
        // advanced: false,
        // keepBreaks: false,
        // keepSpecialComments: '*'，
		// format:{
			// indentBy:4,
			// indentWith:'tab'
		// }
    // })).
    pipe(autoprefixer({
        browsers:['Android >= 3.5','last 4 versions', 'ie >= 8', 'ie_mob >= 10', 'ff >= 30', 'chrome >= 34', 'safari >= 6', 'opera >= 12.1', 'ios >= 6', 'bb >= 10'],
        cascode:true
    }
)).
    pipe(gulp.dest("./css"));
});

gulp.task('default', ['watch-pc','watch-h5']);
//gulp.task('bs',function(){
//	var files=['*.html','**/*.css'];
//	browserSync.init(files,{
//		server:{
//			baseDir:"./"
//		}
//	});
//});


/*research gulp*/
//var destResearch='/data/research/';//服务器
var destResearch='../workspaces/allin_researchPlatform/';//服务器
//删除文件
gulp.task('clearResearch',function(){
    return gulp.src([destResearch+'dest'],{read:false})
        .pipe(clean());
});

//找到html中引用的css,js进行合并
gulp.task('userefResearch',function(){
    return gulp.src([destResearch+'**/*.html','!'+destResearch+'design-html/**/*.html','!'+destResearch+'html/**/*.html'])
        .pipe(useref({
            searchPath:destResearch
        }))
        .pipe(encode({to:'utf8'}))
        .pipe(gulp.dest(destResearch))
});
//合并后的css进行压缩
gulp.task('cssnanoResearch',function(){
    return gulp.src(destResearch+'dest/**/*.css')
        .pipe(cssnano())
        .pipe(encode({to:'utf8'}))
        .pipe(gulp.dest(destResearch+'dest'))
});
//合并后的js进行压缩//线下环境需新增
gulp.task('uglifyResearch',function(){
    return gulp.src(destResearch+'dest/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(encode({to:'utf8'}))
        .pipe(sourcemaps.write('../allinmd_Research_maps',{
            sourceMappingURLPrefix:'http://192.168.1.173:7000/load?src='
        }))
        .pipe(gulp.dest(destResearch+'dest'))
});
//添加版本号
gulp.task('revResearch',function(){
    return gulp.src([destResearch+'dest/**/*.js',destResearch+'dest/**/*.css'])
        .pipe(rev())
        .pipe(gulp.dest(destResearch+'dest'))
        .pipe(rev.manifest())
        .pipe(gulp.dest(destResearch+'dest'))
});
//映射替换html中的引用
gulp.task("revHtmlResearch",function(){
    return gulp.src([destResearch+'dest/**/*.json',destResearch+'**/*.html','!'+destResearch+'html/**/*.html'])
        .pipe(revCollector())
        .pipe(gulp.dest(destResearch));
});
//线下环境需新增
gulp.task("sendSourceMapFileResearch",function(){
    var options = {
        from:destResearch+'allinmd_Research_maps/',
        to:'allinmd_Research_maps',
        match:'**/*.map',
        server:'http://192.168.1.173:7000/upload'
    };
    //先请求一次文件服务器，如果不可以正常请求，则不执行发送操作
    try{
        request(options.server,function(err,res,body){
            if(!err){
                require('badjs-sourcemap')(options);
            } else{
                console.log('SourceMap文件服务器异常：',err);
            }
        });
    }catch (e){
        console.log('SourceMap文件服务器异常：',e)
    }
});
//默认命令，在cmd中输入gulp后，执行的就是这个命令//线下环境需新增
gulp.task('gulpResearch', function(done) {
    // 将你的默认的任务代码放在这
    runSequence('clearResearch','userefResearch',['cssnanoResearch','uglifyResearch'],'sendSourceMapFileResearch','revResearch','revHtmlResearch',done);
});

