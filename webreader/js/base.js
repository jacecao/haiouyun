(function(){

	var util = (function(){
		var prefix = "html5_reader_";
		var storageGetter = function(key){
			return localStorage.getItem(prefix + key);
		};
		var storageSetter = function(key,value){
			return localStorage.setItem(prefix + key,value);
		};
		var getJSONP = function( url, callback ){
			return $.jsonp({
				url : url,
				cache : true,
				callback : 'duokan_fiction_chapter',
				success : function( result )
							{ 
								// debugger
								var data = $.base64.decode(result);
								var json = decodeURIComponent(escape(data));
								callback(json);
							}
			});
		};
		return {
			storageGetter : storageGetter,
			storageSetter : storageSetter,
			getJSONP : getJSONP
		};
	})();
	var Dom = {
		win : $(window),
		doc : $(document),
		topNav : $("#top_nav"),
		botNav : $("#bottom_nav"),
		setNav : $(".font_control"),
		root : $("#root"),
		h4 : $("#chapter_content h4"),
		content : $("#chapter_content"),
		lineHeight : $('#chapter_content p'),
		fontInfo : $('#font_info'),
		initTitleSize: 20,
		initContentSize: 14,
		initLineHeight: 24
	};
	function main(){
		readerBaseFrame();
		var dataModel = readerModel();
		var reader = readerData( Dom.content );
		dataModel.init( function(data)
			{ 
				reader(data); 
			});
		eventHandler();
	}
	function readerModel(){
		//获取阅读器设置样式信息
		if( util.storageGetter('h4FontSize') != 'undefined' )
		{
			//初始化字体模块
			Dom.initTitleSize = parseInt( util.storageGetter('h4FontSize') );
			Dom.initContentSize = parseInt( util.storageGetter('contentFontSize') );
			Dom.initLineHeight = parseInt( util.storageGetter('lineHeight') );
			Dom.h4.css('font-size', Dom.initTitleSize + 'px');
			Dom.content.css('font-size', Dom.initContentSize + 'px');
			Dom.lineHeight.css('line-height', Dom.initLineHeight + 'px');
			//初始化背景模块
			var getbg = util.storageGetter( 'rootBg');
			var getcolor = util.storageGetter( 'contentColor' );
			Dom.content.css('color',getcolor);
			Dom.root.css('background-color',getbg);
		}
		
		var chapter_Id;
		var init = function( callback ){
			getChapterInfo( function(){
				getChapterContent(chapter_Id,function( data ){
					callback( data );
				});
			} );
		};
		// 实现阅读器相关的数据交互方法
		var getChapterInfo = function( callback ){
			$.get('data/chapter.json',function( data ){
				//获取章节信息后执行什么
				chapter_Id = data.chapters[1].chapter_id;
				callback && callback();
			},'json');
		};
		var getChapterContent = function( chapterId , callback ){
			$.get('data/data'+chapterId+'.json',function( data ){
				if( data.result == 0 )
				{
					var url = data.jsonp;
					util.getJSONP( url , function( data ){
						// debugger
						callback && callback(data);
					});
				}
			},'json');
		};
		return { init : init };	
	}

	function readerData( contentbox ){
		//  渲染数据基本的UI结构
		function parseChapterDta( json_data ){
			var jsonData = JSON.parse( json_data );
			var html = '<h4>'+jsonData.t+'</h4>';
			for( var i = 0; i < jsonData.p.length; i++ )
			{
				html += '<p>'+jsonData.p[i]+'</p>';
			}
			return html;
		}

		return function( data ){
			contentbox.html( parseChapterDta( data ) );
			// 锁定父体的高度
			if( $('#root').offset().height < screen.availHeight)
			{
				$('#root').css('height',screen.availHeight +'px');
			}
		};

	}

	function readerBaseFrame(){

		if( $('.bottom_btn .fontset').hasClass('fontset_active') )
		{
			$('.bottom_btn .fontset').removeClass('fontset_active');
		}
		if( Dom.setNav.css('display') == 'block')
		{
			Dom.setNav.hide();
		}
		// bottom_nav click handler button
		function active( obj, className ){
			obj.mousedown(function(){
				$(this).addClass(className);
			});
			obj.mouseup(function(){
				var _this = $(this);
				setTimeout(function(){
					//注意这里就不能直接使用this，因为这里的作用域已经发送变法
					_this.removeClass(className);
				},350);
			});
		}
		active( $('.bottom_btn li span'), 'bot_active' );
		active( $('.top_nav .nav_title'), 'bot_active' );
		active( $('.set_btn'), 'setbutton_active' );
	}

	function eventHandler(){	
		// 交互事件的绑定
		$("#model_action .mid_action").click(function(){		
			readerBaseFrame();
			if(Dom.topNav.css('display') == 'none'){
				Dom.topNav.show();
				Dom.botNav.show();
			}else{
				Dom.topNav.hide();
				Dom.botNav.hide();
			}
		});
		// titleshow **********************
		$(".titleshow").click(function(){
			readerBaseFrame();
		});
		//font_set************************
		$('.bottom_btn .fontset').click(function(){
			if(Dom.setNav.css('display') == 'none')
			{
				$(this).addClass('fontset_active');
				Dom.setNav.show();
			}else{
				Dom.setNav.hide();
				$(this).removeClass('fontset_active');
			}
		});

			// set font-size 字体大小设置
			var setFontSize = function( obj ){
				Dom.initTitleSize += obj.num;
				Dom.initContentSize += obj.num;
				Dom.initLineHeight += obj.num;
				var max = false, min = false;
				if( Dom.initTitleSize >= 28 )
				{
					Dom.initTitleSize = 28;
					max = true;
				}else if( Dom.initTitleSize <= 18){
					Dom.initTitleSize = 18;
					min = true;
				}else{
					max = false;
					min = false;
				}	
				
				if( Dom.initContentSize >= 34 )
				{
					Dom.initContentSize = 34;
					Dom.initLineHeight = 44;
					max = true;
				}else if( Dom.initContentSize <= 14 ){
					Dom.initContentSize = 14;
					Dom.initLineHeight = 24;
					min = true;
				}else{
					max = false;
					min = false;
				}

				if( max || min ){
					Dom.fontInfo.show().html(obj.info);
					setTimeout(function(){
						Dom.fontInfo.hide();
					},1000);
				}
				Dom.h4.css('font-size', Dom.initTitleSize + 'px');
				Dom.content.css('font-size', Dom.initContentSize + 'px');
				Dom.lineHeight.css('line-height', Dom.initLineHeight + 'px');
				
				util.storageSetter( 'h4FontSize',Dom.initTitleSize);
				util.storageSetter( 'contentFontSize',Dom.initContentSize);
				util.storageSetter( 'lineHeight',Dom.initLineHeight);
			};
			$('#lg_font').click(function(){
				setFontSize({
					num: 2,
					info: '爷！不能再大啦'
				});
			});

			$('#sm_font').click(function(){
				setFontSize({
					num: -2,
					info: '爷！不能再小啦'
				});
			});
			// 背景设置
			$('.bg_type').click(function(){
				var bg = $(this).css('background-color');
				if( bg == 'rgb(85, 85, 85)' )
				{
					Dom.content.css('color','#a3a3a3');
				}else{
					Dom.content.css('color','rgb(0, 0, 0)');
				}
				Dom.root.css('background-color',bg);
				util.storageSetter( 'rootBg',bg);
				util.storageSetter( 'contentColor',Dom.content.css('color'));
			});
		//readtype_set************************
		$('.bottom_btn .readtype').click(function(){
			readerBaseFrame();
			if( $(this).hasClass('readtype_day') ){
				$(this).removeClass('readtype_day');
				$(this).html('夜间');
				//在切换时需要重新设定背景和字色，如果用户有设置那么就取用设置值
				if( util.storageGetter( 'rootBg') != 'undefined' ){
					Dom.root.css('background-color',util.storageGetter( 'rootBg'));
					Dom.content.css('color',util.storageGetter( 'contentColor'));
				}else{
					Dom.root.css('background-color','rgb(233, 223, 199)');
					Dom.content.css('color','rgb(0, 0, 0)');
				}
			}else{
				$(this).addClass('readtype_day');
				$(this).html('昼间');
				Dom.root.css('background-color','rgb(15, 20, 16)');
				Dom.content.css('color','rgb(0, 0, 0)');
			}	
		});

		Dom.win.scroll(function(){
			readerBaseFrame();
			Dom.topNav.hide();
			Dom.botNav.hide();
		});
	}
	main();
})();