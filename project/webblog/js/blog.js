//显示弹出框和遮罩
//需要传入两个参数obj:需要显示的弹出框 ele:实现拖拽的元素
var show_fun = function( obj, ele )
{
    obj.show();
    $("#local_screen").local( 1000 ).animate(
    	{
    		attr: 'opacity',
    		target: 100,
    		time: 30
    	});
    //拖拽登录框
    if( arguments.length == 2 )
    {
		obj.drag( [ele] );
    }
    //注意元素处于不可见display:none时是无法获取自身高度、宽度的，所以这里先显示元素再获取元素尺寸
    var w = obj.offset().width,
    	h = obj.offset().height;
    obj.center( w, h ).resize(
    	function()
	 	{
	 		//在登录框居中后再执行resize()，注意这里发生拖动后登录框不再居中
	 		//因为这里不再执行.center()
	 		//由于local()中每执行一次那么就会让遮罩显示出来，
	 		//所以这里需要判断一下登录框是否在显示
	 		if( obj.css("display") == "block" )
	 		{
	 			$("#local_screen").local( 1000 );
	 		}
	 	}
	);
};
//点击弹出关闭按钮后 注意如果这里直接使用closed作为变量名会出错
//参数obj为需要关闭的弹出元素
var closed_fun = function( obj )
{
	obj.hide();
	$('#loading').hide();
	$('#load_success').hide();
	$("#local_screen").animate({
		attr:'opacity',
		target:0,
		time:30,
		fn:function(){
			$("#local_screen").hide();
		}
	});			
};

//隐藏注册框 ***************************************************
var hide_reg = function(){
	//关闭后表单重置
	$('#reg').elements[0].reset();
	$('#reg .reg_reg').elements[0].disabled = true;
	$('#reg .reg_reg').removeClass('mouse').removeClass('reg_active');
	//关闭注册框强制隐藏所有提示信息
	$('#reg .info').hide();
	closed_fun( $('#reg') );
};
//隐藏登录框 ***************************************************
var hide_login = function(){
	$('#login').elements[0].reset();
	$('#login .login_sub').elements[0].disabled = false;
	$('#login .login_sub').removeClass('mouse');
	$('#login .login_info').html('');
	closed_fun( $("#login") ); 
};
//列表鼠标移入移出*************************************
var over = function()
	{
		$("#header .bar_ul").show().animate({
			time:30,
			mix:{'height':122,'opacity':100}
		});
	},
	out = function()
	{
		$("#header .bar_ul").animate({
			mix:{'height':0,'opacity':0},
			time:30,
			fn: function(){
				$("#header .bar_ul").hide();
			}
		});
	};
//***************************** 透明度变化 **************************
var _opacity = function( obj ,target )
	{
		obj.animate({
			attr: 'opacity',
			target: target,
			time: 50
		});
	};	
$(function(){
	//个人中心鼠标移入移出事件 ***************************************************
	$("#header .set_bar").hover( over,out ).class("click");
    //登录框和遮罩设置 ***************************************************
	$("#header .login").click( 
		function()
		{ 
			show_fun( $('#login'), $('#login_h2') );	
		});
	//隐藏登录框
	$("#login .login_closed").click(
		//由于closed_fun()需要传参所以这里不能直接写closed_fun( $("#login")
		//而需要一个匿名函数来调用该函数，否则不能执行
		// function()
		// { 
		// 	$('#login').elements[0].reset();
		// 	$('#login .login_info').html('');
		// 	closed_fun( $("#login") ); 
		// }
		hide_login
	);
	//点击登陆框注册按钮 ***************************************************
	//点击注册框登陆按钮
	var reg_show = function()
	{
		show_fun( $('#reg'), $('#reg_h2') );
	};
	$("#login .login_reg").click(function(){
		$("#login").hide();
		reg_show();
	});
	$("#reg .reg_log").click(function(){
		hide_reg();
		show_fun( $('#login'), $('#login_h2') );
	});
	//点击注册后显示注册框和遮罩 ***************************************************
	$("#header .regiter").click( reg_show );
	$("#reg .reg_closed").click(
		//隐藏注册框
		hide_reg
	);
	//share分享栏控制 ***************************************************
	var share_icon_hover = function()
	{
		$(this).animate({
			attr:'top',
			start:40,
			target:0
		});
	};
	var share_icon_out = function()
	{
		$(this).animate({
			attr:'top',
			target:0
		});
	};
	var _share_click = true;
	$('#share .weixin').hover( share_icon_hover, share_icon_out );
	$('#share .weibo').hover( share_icon_hover, share_icon_out );
	$('#share').click(
		 function()
		 {
		 	if( _share_click )
		 	{
		 		$(this).animate({
					attr:'right',
					target:0
				});
				_share_click = false;
		 	}else{
		 		$(this).animate({
					attr:'right',
					target:-50
				});
				_share_click = true;
		 	}
		 }
	);
	//主体底部菜单栏 ***************************************************
	$('#main .clear_bug li').hover(function(){
		var target = $(this).offset().left;
		$('#main .chose_box').animate(
			{
				attr:'left',
				target:target+20,
				fn:function(){
					$('#main .main_white').animate(
						{
							attr:'left',
							target:-target
						});
				}
			});	
	},function(){
		$('#main .chose_box').animate(
			{
				attr:'left',
				target:20,
				fn:function(){
					$('#main .main_white').animate(
						{
							attr:'left',
							target:0
						});
				}
			});
	});
	//主体点击标题滑动菜单	***************************************************
	//上下滑动函数 ********************?????????????????????????????************
	//为什么这里作为参数传入target的值就不呢？？？？？？？？？？？？？？************
	var main_tog_0 = function()
	{
		$(this).next().animate({
			mix:{'height':0,'opacity':0}
		});
	};
	var main_tog_1 = function(obj,target)
	{
		obj.next().animate({
			mix:{'height':target ,'opacity':100}
		});
	};
	$('#main .side_bar h2').toggle(main_tog_0,function(){main_tog_1($(this),148);});

	//bannner 轮播广告部分***************************************************
	//轮播初始状态
	$('#banner img').opacity(0);
	$('#banner img').find(0).opacity(100);
	$('#banner span').html($('#banner img').find(0).attr('alt'));
	//轮播器样式设置
	var banner_type = 1; //1:渐变切换 2：上下滚动切换
	//计数器
	var banner_index = 1;
	//主体fun
	var banner_run = function( obj , pref ){
		// $('#banner img').hide();
		$('#banner li').removeClass('choose');
		// $('#banner img').find( $(obj).index() ).show();
		$(obj).class('choose');
		$('#banner span').html($('#banner img').find( $(obj).index() ).attr('alt'));
		if( banner_type == 1 )
		{
			//注意如果动画执行时间超过自动播放切换时间，动画就会出发失误
			$('#banner img').find( pref ).animate({
				attr:'opacity',
				target: 0,
				time: 70,
				step:10
			}).css('zIndex',1);
			$('#banner img').find( $(obj).index() ).animate({
				attr:'opacity',
				target: 100,
				time: 70,
				step:10
			}).css('zIndex',2);
		}
		if( banner_type == 2 )
		{
			$('#banner img').find( pref ).animate({
				attr:'top',
				target: 200,
				time: 70,
				step:10
			}).opacity(100);
			$('#banner img').find( $(obj).index() ).animate({
				attr:'top',
				target: 0,
				time: 70,
				step:10
			}).css('top','-200px').opacity(100);
		}
	};
	//计数变动fun
	var banner_fn = function(){
		if( banner_index >= $('#banner li').length() )
		{
			banner_index = 0;
		}
		//理解这里的传参，要符合base.js库中$()操作
		var pref_index = banner_index == 0 ? $('#banner li').length()-1:banner_index-1;
		banner_run( $('#banner li').elements[banner_index], pref_index );
		banner_index ++;
	};
	//自动播放部分
	var banner_timer = setInterval( banner_fn, 3000);
	//手动滚动部分
	$('#banner li').hover(function(){
		clearInterval( banner_timer );
		//避免重复加载，所以在非当前加载的情况下才执行加载
		if( $(this).css('backgroundColor')!='rgb(255, 165, 0)' )
		{
			var pref_index = banner_index == 0 ? $('#banner li').length()-1:banner_index-1;
			banner_run( this, pref_index );
		}
	},function(){
		//离开鼠标后 重新计算索引和再次加入定时器
		banner_index = $(this).index()+1;
		banner_timer = setInterval( banner_fn, 3000);
	});

	//*******************************************photo延迟加载********************************
	//先储存img元素，减少下面for循环的计算
	var _imgs = $('#photo dt img');
	//初始状态
	_imgs.opacity(0);
	//延迟加载函数
	var _wait_load = function()
	{
		for( var i = 0; i < _imgs.length(); i++ )
		{
			//注意这里必须获得的是单个元素
			//而不能是一个对象如果这里换成_imgs.find(i)就不可以了
			var _this = _imgs.elements[i];		
			if( View_Y + scroll().top >= $(_this).offset().top - 30 )
			{
				var value = $(_this).attr('_src');
				$(_this).attr('src',value).animate({
					attr: 'opacity',
					target: 100,
					time: 70
				});
			}
		}
	};
	//滚动事件中判定是否加载图片
	//防止滚动事件触发时不停的执行该函数，所以使用setTimeout()
	//来延迟函数的执行
	$(window).bind( 'scroll', function(){setTimeout(_wait_load,100);} );
	//在窗口发生变化时也要执行缓存加载函数
	$(window).resize( _wait_load );
	// ************************************************* 点击图片显示大图 **************************
	var _show_big_img = function()
	{ 
		show_fun( $('#show_img'), $('#show_img_h2') ); 
		//阻止鼠标默认的拖动选择文字事件
		addEvent(document,'mousedown',preDef);
		addEvent(document,'mouseup',preDef);
		addEvent(document,'selectstart',preDef);
	};
	var children,prev,next,up,down,_index;
	_imgs.click( 
		function()
		{
			_show_big_img(); 
			//预加载放法一********************************** 图片预加载 ***************************
			// var _temp_img = new Image();
			// _temp_img.src = 'http://p18.qhimg.com/t014811f86312fad868.jpg';
			// $(_temp_img).bind('load',function(){
			// 	$('#show_img .show_loading').hide();
			// 	$('#show_img .show_img_img').show().attr('src',_temp_img.src).opacity(0).animate({
			// 		attr:'opacity',
			// 		target: 100,
			// 		time: 150
			// 	});
			// });
			//预加载放法二*****
			// var _src_url = 'http://p18.qhimg.com/t014811f86312fad868.jpg';
			var _src_url = $(this).attr('_big_src');
			$('#show_img .show_img_img').attr('src', _src_url);
			$('#show_img .show_img_img').bind('load',function(){
				$('#show_img .show_loading').hide();
				$(this).show().opacity(0).animate({
					attr:'opacity',
					target: 100,
					time: 150
				});
			});
			//********************************显示 控制上下张 按钮*******************************************
			var _hover = function( obj ,target )
			{
				obj.animate({
					attr: 'opacity',
					target: target,
					time: 50
				});
			};
			$('#show_img .show_left').hover(
				function(){_opacity($('#show_img .sl'),40);},
				function(){_opacity($('#show_img .sl'),0);}
				);
			$('#show_img .show_right').hover(
				function(){_opacity($('#show_img .sr'),40);},
				function(){_opacity($('#show_img .sr'),0);}
				);
			//*****************************预加载上一张和下一张****************************
			children = this.parentNode.parentNode;
			prev = prevIndex( $(children).index(),$('#photo dl').length() );
			next = nextIndex( $(children).index(),$('#photo dl').length() );
			$('#show_img .show_index').html( $(children).index() + 1 + '/' + $('#photo dl').length() );
			// console.log(_imgs.find( prev ).elements[0],_imgs.find( next ).elements[0]);
			// console.log(prev_e,next_e);
			//创建临时图片加载，注意这里使用临时图片对象进行上一张和下一张进行预加载
			// var prev_img = new Image();
			// var next_img = new Image();
			// prev_img.src = _imgs.find( prev ).attr('_big_src');
			// next_img.src = _imgs.find( next ).attr('_big_src');	
			up = _imgs.find( prev ).attr('_big_src');
			$('#show_img .show_left').attr('src',up);
			//在左右按钮元素中加入一个index属性来记录上一张和下一张的索引，很关键！！！
			$('#show_img .show_left').attr('index',prev);
			down = _imgs.find( next ).attr('_big_src');
			$('#show_img .show_right').attr('src',down);
			$('#show_img .show_right').attr('index',next);

		});
	//******************************* 点击左右按钮加载图片 ********************************
	//为左右 按钮添加一个 src 属性用于存放上一张和下一张图片的地址
	//注意将左右加载功能放入上面_imgs.click()函数中就会出现误操作，其原因如下：
	//在a.click()事件中嵌套一个click事件函数，并在a.click()函数中定义一个新的test()函数
	//a.click( function()
	//	{ 
	//		var test = funtion(){}；
	//		b.click( test ) 
	//	});
	//那么会出现一个情况,那就是在a.click()执行过程中会缓存test()函数执行次数
	//及a.click()执行多少次那么test()会被要求执行多少次，但不是立马执行
	//而是在test()函数在被触发时同时执行。
	//如果将test()函数移除a.click()函数中，那么就不会出现这种情况；
	//( 参考demo文件夹中 event.js代码中的示例 )
	//所以这里将左右加载图片单独放在外面来执行
	var changeImg = function( )
	{
		//图片未完成加载前显示加载动态
		//注意在$('#show_img .show_img_img')的load()中我们已经要求，加载成功$('#show_img .show_loading').hide();
		//所以这里我们只需要让加载动态显示即可
		$('#show_img .show_loading').show();
		$('#show_img .show_img_img').attr('src', $(this).attr('src'));
		_index = parseInt( $(this).attr('index') );//转换数据类型
		$('#show_img .show_index').html( _index + 1 + '/'+ $('#photo dl').length() );
		prev = prevIndex( _index, $('#photo dl').length() );
		next = nextIndex( _index, $('#photo dl').length() );
		up = _imgs.find( prev ).attr('_big_src');
		$('#show_img .show_left').attr('src',up);
		$('#show_img .show_left').attr('index',prev);
		down = _imgs.find( next ).attr('_big_src');
		$('#show_img .show_right').attr('src',down);
		$('#show_img .show_right').attr('index',next);
	};
	$('#show_img .show_left').click( changeImg );
	$('#show_img .show_right').click( changeImg );

	//关闭大图
	$('#show_img .show_img_closed').click( 
	function()
	{ 
		closed_fun( $('#show_img') );
		children = prev = next = up = down = _index = null;
		//在关闭遮罩时需要移除阻止函数
		removeEvent(document,'mousedown',preDef);
		removeEvent(document,'mouseup',preDef);
		removeEvent(document,'selectstart',preDef);	
	} );
	
	//*************************************调用ajax获取最新博文内容***********************************
	$('#main .blog_loading').show();
	$().ajax({
		method:'get',
		url:'php/get_blog.php',
		success:function(text){
			$('#main .blog_loading').hide();
			var json = JSON.parse(text);
			var html = '';
			for( var i = 0; i < json.length; i++ ){
				html += '<div class="blog_content"><h2 class="mouse">'+json[i].title+'<em>'+json[i].date+'</em></h2><p>'+json[i].content+'</p></div>';
			}
			$('#main .main_content').html(html);
			for( var i = 0; i < $('#main .blog_content').length(); i++ )
			{
				//animate()无法支持多个对象同时实现动画，所以只能单个加载
				$('#main .blog_content').find(i).animate({
					attr:'opacity',
					target: 100,
					time:100
				});
			}
			//由于此处DOM结构改变，所以需要再一次点击滑动函数
			$('#main .main_content h2').toggle(main_tog_0,function(){main_tog_1($(this),138);});
		},
		async:true
	});
//************************************ 换肤 ********************************************
	//全局变量
	var skin_target = 0;
	var skin_index = 0;
	var skin_length = $('#show_skin .show_skin_img').length();
	var skin_text;
	//获取已经设置的皮肤******************************
	$().ajax({
		method:'post',
		data:{'type':'recall'},
		url:'php/get_skin.php',
		success:function(text){
			if( text != 'null' )
			{
				var json = JSON.parse(text);
				$('body').css('backgroundImage','url('+json.big_bg+')');
				$('body').css('backgroundColor',json.bg_color);
			}
		},
		async:true
	});	
	//点击换肤程序********************************
	var change_skin = function()
	{
		var big_src = $(this).attr('big_src');
		var bg_color = $(this).attr('bg_color');
		$('body').css('backgroundImage','url('+big_src+')');
		$('body').css('backgroundColor',bg_color);
		//这里同时将选择的背景图片数据发送给数据库，记录下我们已经设置好的背景
		//这里应该判断是否已经登陆账户，登陆账户后点击才会发送设置的背景数据
		$().ajax({
			method:'post',
			data:{
				'type':'set',
				'big_bg':big_src 
			},
			url:'php/get_skin.php',
			success:function(text){
				if( text == 1 )
				{
					setTimeout(closed_fun( $('#show_skin') ),1500);
				}
			},
			async:true
		});	
	};
	//打开换肤弹出*********************
	$('#control_bar .skin').click(
	function()
	{
		skin_length = $('#show_skin .show_skin_img').length();
		out();
		show_fun( $('#show_skin'));
		if( $('.show_skin_img').length() == 0 )
		{
			$().ajax({
				method:'post',
				data:{'type':'all'},
				url:'php/get_skin.php',
				success:function(text){
					$('#show_skin .show_loading').hide();
					var json = JSON.parse(text);
					var html = '';
					for( var i = 0; i < json.length; i++ ){
						html += '<img class="show_skin_img" src="'+json[i].small_bg+'" bg_color="'+json[i].bg_color+'" big_src="'+json[i].big_bg+'" alt="'+json[i].bg_text+'">';
					}
					$('#show_skin .skin_img').html(html);
					$('#show_skin .skin_img').css('left',skin_target);
					//只需要第一张渐变显示出来
					skin_length = $('#show_skin .show_skin_img').length();
					$('#show_skin .show_skin_img').find(skin_index).animate({
						attr:'opacity',
						target: 100,
						time:60
					});
					var bg_text = $('#show_skin .show_skin_img').find(0).attr('alt');
					$('.skin_box span').html(bg_text);
					//******************* 点击图片切换背景 *********************
					//******************* 注意只有在这里加入点击事件才有用 ******
					$('#show_skin .show_skin_img').click(change_skin);
				},
				async:true
			});		
		}else{
			$('#show_skin .show_skin_img').click(change_skin);
		}
	});
	//****************** 显示左右切换按钮 *****************
	$('#show_skin .show_left').hover(
		function(){_opacity($('#show_skin .sl'),100);},
		function(){_opacity($('#show_skin .sl'),40);}
		);
	$('#show_skin .show_right').hover(
		function(){_opacity($('#show_skin .sr'),100);},
		function(){_opacity($('#show_skin .sr'),40);}
		);

	//***************** 点击左右按钮 ********************
	$('#show_skin .show_left').click(function(){
		$('#show_skin .show_skin_img').opacity(0);
		skin_target -= 500;
		skin_index--;
		// console.log(skin_target+','+skin_index+','+skin_length);
		if( skin_index < 0 )
		{
			// console.log(skin_target+'...'+skin_index);
			skin_index = skin_length - 1;
			skin_target = 1000;
		}
		if( skin_target < 0 )
		{
			// console.log(skin_target+'.x.'+skin_index);
			skin_target = 1000;
			skin_index = skin_length - 1;
		}
		$('#show_skin .show_skin_img').find(skin_index).animate({
			attr:'opacity',
			target: 100,
			time:150
		});
		$('#show_skin .skin_img').animate({
			attr:'left',
			target:-skin_target
		});
		skin_text = $('#show_skin .show_skin_img').find(skin_index).attr('alt');
		$('.skin_box span').html(skin_text);
	});
	$('#show_skin .show_right').click(function(){
		$('#show_skin .show_skin_img').opacity(0);
		skin_target += 500;
		skin_index++;
		// console.log(skin_target+','+skin_index+','+skin_length);
		if( skin_index >= skin_length )
		{
			// console.log(skin_target+'...'+skin_index);
			skin_index = 0;
			skin_target = 0;
		}
		if( skin_target >= 1500 ){
			// console.log(skin_target+'.x.'+skin_index);
			skin_target = 0;
			skin_index = 0;
		}
		$('#show_skin .show_skin_img').find(skin_index).animate({
			attr:'opacity',
			target: 100,
			time:150
		});
		$('#show_skin .skin_img').animate({
			attr:'left',
			target:-skin_target
		});
		skin_text = $('#show_skin .show_skin_img').find(skin_index).attr('alt');
		$('.skin_box span').html(skin_text);
	});
	//***************** 点击默认按钮 ********************
	$('.show_skin_h2 span').click(function(){
		$().ajax({
			method:'post',
			data:{'type':'default'},
			url:'php/get_skin.php',
			success:function(text){
				if( text == 1 )
				{
					$('body').css('backgroundColor','#eaeaea');
					$('body').css('backgroundImage','');
					setTimeout(closed_fun( $('#show_skin') ),1500);
				}else{
					setTimeout(closed_fun( $('#show_skin') ),1500);
				}
			},
			async:true
		});
	});
	//关闭换肤弹出*********************
	$('#show_skin .show_skin_closed').click(function(){
		$('.show_loading').hide();
		closed_fun( $('#show_skin') );
	});

//**************返回顶部按钮*******************************
	var _scroll_run = true;
	var _timer = null;
	$(".back_top").click(function(){
		_timer = setInterval(function(){
			_scroll_run = true;
			var _scroll_top = Math.floor( scroll().top/5 );
			var _value = scroll().top - _scroll_top;
			//注意这里的判定，取值不对就会出现scrollTop!=0的情况
			//(可能是一个很少的值，肉眼看不出滚动条是否已经回到顶部)或无法停止ssetInterval()
			if( _scroll_top <= 1 )
			{
				clearInterval(_timer);
				scroll({top:0});
			}else{
				scroll({top:_value });
			}
		},30);
	});
	$(window).bind('scroll',function(){
		//注意这里不能直接清除定时器，一旦直接清理掉定时器，那么返回顶部的定时器就没办法运行
		//因为在返回顶部这个过程中也触发到scroll事件，所以必须给一个判定值_scroll_run来判定
		!_scroll_run?clearInterval(_timer) : _scroll_run = false;
		if( scroll().top >= View_Y )
		{
			$('.back_top').show();

		}else{
			$('.back_top').hide();
		}
		//判定返回按钮一旦到达底部，那么距离底部的距离应该是一个固定的值
		var footer_top = $('footer').offset().top + 40;
		var _scroll_height = View_Y + scroll().top;
		if( _scroll_height >= footer_top ){
			$('.back_top').css('bottom',$('footer').offset().height+10+'px');
		}else{
			$('.back_top').css('bottom',10+'px');
		}
	});









});