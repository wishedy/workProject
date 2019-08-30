/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here.
	// For the complete reference:
	// http://docs.ckeditor.com/#!/api/CKEDITOR.config


	// The toolbar groups arrangement, optimized for two toolbar rows.
	config.toolbarGroups = [
		// { name: 'clipboard',   groups: [ 'clipboard', 'undo' ] },
		// { name: 'editing',     groups: [ 'find', 'selection', 'spellchecker' ] },
		// { name: 'links' },
		// { name: 'insert' },
		// { name: 'tools' },
		// { name: 'document',	   groups: [ 'mode', 'document', 'doctools' ] },
		{ name: 'others' },
		{ name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
		{ name: 'paragraph',   groups: [ 'list', 'indent', 'blocks', 'align', 'bidi' ] },
		{ name: 'forms' },
		{ name: 'styles' }
		
		// { name: 'colors' },
		// { name: 'about' }
		
	];

	//定义皮肤 缺文件
	//config.skin = 'v2';
	//定义宽度
	config.width = 628;
	//定义高度
	config.height = 166;
	//字体默认大小 plugins/font/plugin.js
	config.fontSize_defaultLabel = '12px';
	//定义语言
	config.language = 'zh-cn';
	//配置背景色
	config.uiColor = '#ffffff';
	//移除下方的显示元素路径
	config.removePlugins='elementspath';
	//字体编辑时的字符集 可以添加常用的中文字符：宋体、楷体、黑体等 plugins/font/plugin.js
	config.font_names = '宋体;楷体;黑体;Arial;Times New Roman;Verdana';
    //文字的默认式样 plugins/font/plugin.js
	config.font_style = {
	element   : 'span',
	styles   : { 'font-family' : '#(family)' },
	overrides : [ { element : 'font', attributes : { 'face' : null } } ]
	};
	//工具栏是否收缩
	config.toolbarCanCollapse = false;
	//工具栏的位置
	config.toolbarLocation = 'top';//可选：bottom
    //工具栏默认是否展开
	config.toolbarStartupExpanded = true;
	// 取消 “拖拽以改变尺寸”功能 plugins/resize/plugin.js
	config.resize_enabled = false;
	//改变大小的最大高度
    config.resize_maxHeight = 3000;
    //改变大小的最大宽度
    config.resize_maxWidth = 3000;
    //改变大小的最小高度
    config.resize_minHeight = 300;
    //改变大小的最小宽度
    config.resize_minWidth = 750;
    // 当提交包含有此编辑器的表单时，是否自动更新元素内的数据
    config.autoUpdateElement = true;
    // 设置是使用绝对目录还是相对目录，为空为相对目录
    config.baseHref = '';
    // 编辑器的z-index值
    config.baseFloatZIndex = 8;
    //对address标签进行格式化 plugins/format/plugin.js
//    config.format_address = { element : 'address', attributes : { class : 'styledAddress' } };
    //载入时，以何种方式编辑 源码和所见即所得 "source"和"wysiwyg" plugins/editingblock/plugin.js.
    config.startupMode ='wysiwyg';
    //界面编辑框的背景色 plugins/dialog/plugin.js
    config.dialog_backgroundCoverColor = '#fffefd'; //可设置参考
    config.dialog_backgroundCoverColor = 'white' //默认
    //载入时，是否显示框体的边框 plugins/showblocks/plugin.js
    config.startupOutlineBlocks = false;
  //设置快捷键
    config.keystrokes = [
    [ CKEDITOR.ALT + 121 /*F10*/, 'toolbarFocus' ], //获取焦点
    [ CKEDITOR.ALT + 122 /*F11*/, 'elementsPathFocus' ], //元素焦点
    [ CKEDITOR.SHIFT + 121 /*F10*/, 'contextMenu' ], //文本菜单
    [ CKEDITOR.CTRL + 90 /*Z*/, 'undo' ], //撤销
    [ CKEDITOR.CTRL + 89 /*Y*/, 'redo' ], //重做
    [ CKEDITOR.CTRL + CKEDITOR.SHIFT + 90 /*Z*/, 'redo' ], //
    [ CKEDITOR.CTRL + 76 /*L*/, 'link' ], //链接
    [ CKEDITOR.CTRL + 66 /*B*/, 'bold' ], //粗体
    [ CKEDITOR.CTRL + 73 /*I*/, 'italic' ], //斜体
    [ CKEDITOR.CTRL + 85 /*U*/, 'underline' ], //下划线
    [ CKEDITOR.ALT + 109 /*-*/, 'toolbarCollapse' ]
    ];
    //背景的不透明度 数值应该在：0.0～1.0 之间 plugins/dialog/plugin.js
      config.dialog_backgroundCoverOpacity = 0.5;
    //使用搜索时的高亮色 plugins/find/plugin.js
      config.find_highlight = {
      element : 'span',
      styles : { 'background-color' : '#ff0', 'color' : '#00f' }
      };
    //是否使用完整的html编辑模式 如使用，其源码将包含：<html><body></body></html>等标签
      config.fullPage = false;
      
  //是否在选择颜色时显示“其它颜色”选项 plugins/colorbutton/plugin.js
    config.colorButton_enableMore = true;
    //撤销的记录步数 plugins/undo/plugin.js
    config.undoStackSize =20;
    //当从word里复制文字进来时，是否进行文字的格式化去除 plugins/pastefromword/plugin.js
    config.pasteFromWordIgnoreFontFace = true; //默认为忽略格式
	// Remove some buttons, provided by the standard plugins, which we don't
	// need to have in the Standard(s) toolbar.
	// config.removeButtons = 'Underline,Subscript,Superscript';

	// Se the most common block elements.
	// config.format_tags = 'p;h1;h2;h3;pre';

	// Make dialogs simpler.
	// config.removeDialogTabs = 'image:advanced;link:advanced';
	

};
