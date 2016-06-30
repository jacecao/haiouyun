$(window).bind('load',function(){
	//刷新后表单重置
	$('#reg').elements[0].reset();
	//*****************************用户名检验**************************
	var _check_user = function(){
		var getValue = dele_spce( $('#reg').form('reg_user').value() );
		return ( /\w{2,20}/.test( getValue ) && !/\W+/.test( getValue ) )?true:false;
	};
	$('#reg').form('reg_user').bind( 'focus',function(){
		$('#reg .info_user').show();
		$('#reg .error_user').hide();
		$('#reg .right_user').hide();
	}).bind( 'blur',function(){
		var getValue = dele_spce( $(this).value() );
		if( getValue  == '' ){//如果值为空那么全部隐藏
			$('#reg .info_user').hide();
			$('#reg .error_user').hide();
			$('#reg .right_user').hide();
		}else if( _check_user() ){
			//********************检查用户名是否占用***********************
			$('#reg .info_user').hide();
			$('#reg .error_user').html('用户名不合法！');
			$('#reg .check_user').show();
			$().ajax({
				method:'post',
				url:'php/check_user.php',
				data: $('#reg').find(0).serialize(),
				success:function(text){
					if( text == 1 )
					{
						$('#reg .check_user').hide();
						$('#reg .error_user').html('用户名已存在！');
						$('#reg .error_user').show();
					}else{
						$('#reg .check_user').hide();
						$('#reg .error_user').hide();
						$('#reg .right_user').show();
					}
				},
				async:true 
			});
		}else{
			$('#reg .info_user').hide();
			$('#reg .error_user').hide();
			$('#reg .right_user').show();
		}
	});	
	
	//*****************************密码检验******************************
	//密码检验FN
	var check_pass = function( )
	{
		var value = dele_spce( $('#reg').form('reg_pass').value() );
		//满足6-20条件
		if( value.length >= 6 && value.length <= 20 )
		{
			$('#reg .info_pass .tip1').css('backgroundColor','#73FF00');
		}else{
			$('#reg .info_pass .tip1').css('backgroundColor','#eee');
		}
		//满足非控字符条件
		if( value.length > 0 && !/\s/.test(value) )
		{
			$('#reg .info_pass .tip2').css('backgroundColor','#73FF00');
		}else{
			$('#reg .info_pass .tip2').css('backgroundColor','#eee');
		}
		//大小写字母-数字-非空字符2种以上
		var code_length = 0;
		if( /[0-9]/.test(value) )
		{
			code_length++;
		}
		if( /[a-z]/.test(value) )
		{
			code_length++;
		}
		if( /[A-Z]/.test(value) )
		{
			code_length++;
		}
		if( /[^\b\w]/.test(value) )
		{
			code_length++;
		}
		if( code_length >= 2 )
		{
			$('#reg .info_pass .tip3').css('backgroundColor','#73FF00');
		}else{
			$('#reg .info_pass .tip3').css('backgroundColor','#eee');
		}
		//安全级别的判定
		//高：大于等于10个字符，3种不同类别的字符混拼
		//中：大于等于8个字符，2种不同类别的字符混拼
		//低：大于等于1个字符
		//无：没有字符
		//判断的时候务必从高到低判断，防止高级别无法执行到
		if( value.length >= 10 && code_length >=3 )
		{
			$('#reg .info_pass .s1').css('color','#73FF00');
			$('#reg .info_pass .s2').css('color','#73FF00');
			$('#reg .info_pass .s3').css('color','#73FF00');
			$('#reg .info_pass .s4').html('高');
		}else if( value.length >= 8 && code_length >=2 )
		{
			$('#reg .info_pass .s1').css('color','#73FF00');
			$('#reg .info_pass .s2').css('color','#73FF00');
			$('#reg .info_pass .s3').css('color','#eee');
			$('#reg .info_pass .s4').html('中');
		}else if( value.length >= 1 )
		{
			$('#reg .info_pass .s1').css('color','#73FF00');
			$('#reg .info_pass .s2').css('color','#eee');
			$('#reg .info_pass .s3').css('color','#eee');
			$('#reg .info_pass .s4').html('低');
		}else{
			$('#reg .info_pass .s1').css('color','#eee');
			$('#reg .info_pass .s2').css('color','#eee');
			$('#reg .info_pass .s3').css('color','#eee');
			$('#reg .info_pass .s4').html('');
		}
		return ( value.length >= 6 && value.length <= 20 && !/\s/.test(value) && code_length >=2 )?true:false;
	};

	$('#reg').form('reg_pass').bind( 'focus',function(){
		$('#reg .info_pass').show();
		$('#reg .error_pass').hide();
		$('#reg .right_pass').hide();
	}).bind('blur',function(){
		if( dele_spce( $(this).value() ) == '' )
		{
			$('#reg .info_pass').hide();
			$('#reg .error_pass').hide();
			$('#reg .right_pass').hide();
		}else{
			$('#reg .info_pass').hide();
			if( check_pass() )
			{
				$('#reg .error_pass').hide();
				$('#reg .right_pass').show();
			}else{
				$('#reg .error_pass').show();
				$('#reg .right_pass').hide();
			}
		}
	});
	//密码强度验证
	$('#reg').form('reg_pass').bind('keyup',function(){
		check_pass( this );
	});
	//密码确认
	var _check_pass = function(){
		var _pass_a = dele_spce( $('#reg').form('reg_check').value() ),
			_pass_b = dele_spce( $('#reg').form('reg_pass').value() );
		return ( _pass_a === _pass_b )? true : false;
	};
	$('#reg').form('reg_check').bind( 'focus',function(){
		$('#reg .info_check').show();
		$('#reg .error_check').hide();
		$('#reg .right_check').hide();
	}).bind('blur',function(){
		if( dele_spce( $(this).value() ) == '' )
		{
			$('#reg .info_check').hide();
			$('#reg .error_check').hide();
			$('#reg .right_check').hide();
		}else{
			$('#reg .info_check').hide();
			if( _check_pass() )
			{
				$('#reg .error_check').hide();
				$('#reg .right_check').show();
			}else{
				$('#reg .error_check').show();
				$('#reg .right_check').hide();
			}
		}
	});

	//**********************************************回答验证*****************************
	var _check_ques = function(){
		return $('#reg').form('reg_ques').value()!= 0 ? true : false; 
	};
	$('#reg').form('reg_ques').bind('change',function(){
		if( _check_ques() )
		{
			$('#reg .error_ques').hide();
		}
	});
	
	var _check_ans = function(){
		var _len = dele_spce( $('#reg').form('reg_ans').value() ).length;
		return _len >= 2 && _len<= 32? true:false;
	};
	$('#reg').form('reg_ans').bind( 'focus',function(){
		$('#reg .info_ans').show();
		$('#reg .error_ans').hide();
		$('#reg .right_ans').hide();
		$('#reg .error_ques').hide();
	}).bind('blur',function(){
		if( dele_spce( $(this).value() ) == '' )
		{
			$('#reg .info_ans').hide();
			$('#reg .error_ans').hide();
			$('#reg .right_ans').hide();
		}else{
			$('#reg .info_ans').hide();
			if( _check_ques() )
			{
				if( _check_ans() )
				{
					$('#reg .error_ans').hide();
					$('#reg .right_ans').show();
				}else{
					$('#reg .error_ans').show();
					$('#reg .right_ans').hide();
				}
			}else{
				$('#reg .error_ques').show();
			}	
			
		}
	});

	//*******************************************电子邮件验证*************************
	var _check_email = function(){
		var _value = dele_spce( $('#reg').form('reg_email').value() );
		return /^\w+@\w+(\.[a-z]{2,4}){1,2}$/i.test( _value )?true:false;
	};
	$('#reg').form('reg_email').bind( 'focus',function(){
		
		$('#reg .info_email').show();
		$('#reg .error_email').hide();
		$('#reg .right_email').hide();
	}).bind('blur',function(){
		$('#reg .email_tip').hide();
		this.index = 0;
		if( dele_spce( $(this).value() ) == '' )
		{
			$('#reg .info_email').hide();
			$('#reg .error_email').hide();
			$('#reg .right_email').hide();
		}else{
			$('#reg .info_email').hide();
			if( _check_email() )
			{
				$('#reg .error_email').hide();
				$('#reg .right_email').show();
			}else{
				$('#reg .error_email').show();
				$('#reg .right_email').hide();
			}
		}
	});
	//电子邮件补全系统
	$('#reg').form('reg_email').bind('keydown',function(){
		//在表单中input中有type="submit"时，无论有几个type="text"输入框，回车均表示提交。
		//所以在这里需要早按键时阻止默认事件。
		if( event.keyCode == 13 )
		{
			preDef();
		}
	}).bind('keyup',function(){
		var _value = dele_spce( $(this).value() );
		$('.email_tip span').html( _value );
		if( _value.indexOf('@') != -1 || _value == '' )
		{
			$('#reg .email_tip').hide();
		}else{
			$('#reg .email_tip').show();
			//键盘获取补全
			if( event.keyCode == 40 )//向下
			{
				if( this.index == undefined || this.index >= $('#reg li').length()-1 )
				{
					this.index = 0;
				}else{
					this.index ++;
				}
				$('#reg .email_tip li').removeClass('keychoose');
				$('#reg .email_tip li').find(this.index).class('keychoose');
			}
			if( event.keyCode == 38 )//向上
			{
				if( this.index == 'undefined' || this.index <= 0 )
				{
					this.index = $('#reg li').length()-1;
				}else{
					this.index --;
				}
				$('#reg .email_tip li').removeClass('keychoose');
				$('#reg .email_tip li').find(this.index).class('keychoose');
			}
			if( event.keyCode == 13 )//回车
			{
				//注意在form表单中如果默认情况下，单个输入框，无论按钮的type="submit"还是type="button"类型，回车即提交。
				//1.当type="submit"时，无论有几个type="text"输入框，回车均表示提交。（submit）
				//2.当type="button"时，且存在多个输入框，回车不提交。（button）
				$(this).value( $('#reg .email_tip li').find(this.index).text() );
				$('#reg .email_tip').hide();
				this.index = 0;
			}
		}
	});
	//点击补全
	$('.email_tip li').bind('mousedown',function(){
		//注意这里不能是使用click事件
		//click事件是点击弹起后触发的，而blur失去焦点后，没有弹起元素，导致这里的click事件无法触发
		var _value = $(this).text();
		$('#reg').form('reg_email').value(_value);
	});

	//****************************生日 日期注入********************************
	var year = $('#reg').form('reg_year'),
		month = $('#reg').form('reg_month'),
		day = $('#reg').form('reg_day'),
		day30 = [4,6,9,11],
		day31 = [1,3,5,7,8,10,12];
	//注入年
	for( var i = 1980; i <= 2016; i++ )
	{
		//add()方法用于向select元素中添加一个option元素
		//语法为 selectObj.add(option,before)
		//option:要添加选项的元素，必须是option或optgroup（通过 <optgroup> 标签把相关的选项组合在一起）.
		//before:添加位置，before就是在该元素之前添加元素，如果参数为null那就是在末尾添加
		//Option()对象代表HTML中下拉列表的一个选项
		//new Option("文本","值",true,true)后面两个true分别表示默认被选中和有效!
		year.elements[0].add( new Option(i,i),undefined );
	}	
	//注入月
	for( var i = 1; i <= 12; i++ )
	{
		month.elements[0].add( new Option(i,i),undefined );
	}
	//注入日
	var select_day = function(){
		if( year.value() != 0 && month.value() != 0 )
		{
			//清理之前注入的日
			day.elements[0].options.length = 1;
			//注入日
			var _day = 0;
			if( inArray( day31, parseInt( month.value() ) ) )
			{
				_day = 31;
			}else if( inArray( day30, parseInt( month.value() ) ) ){
				_day = 30;
			}else{
				var _year = parseInt( year.value() );
				if( (_year % 4 == 0 && _year % 100 != 0) || _year % 400 == 0 )
				{
					_day = 29;
				}else{
					_day = 28;
				}
			}
			for( var i = 1; i <= _day; i++ )
			{
				day.elements[0].add( new Option(i,i),undefined );
			}
		}else{
			//清理之前的注入
			day.elements[0].options.length = 1;
		}
	};
	year.bind('change',select_day);
	month.bind('change',select_day);

	//***************************************备注***************************
	var check_ps = function(){
		var _num = 100 - $('#reg').form('reg_ps').value().length;
		if( _num <= 100 && _num >= 0 )
		{
			$('#reg .text_number_1').show();
			$('#reg .text_number_2').hide();
			$('#reg .text_number_1 span').html(_num);
			return true;
		}else{
			$('#reg .text_number_1').hide();
			$('#reg .text_number_2').show();
			$('#reg .text_number_2 span').find(0).html( Math.abs(_num) );
			return false;
		}
	};
	
	$('#reg').form('reg_ps').bind('keyup',check_ps).bind('blur',function(){
		if( $('#reg').form('reg_ps').value()=='' )
		{
			$('#reg .text_number_1').hide();
		}
	}).bind('focus',function(){
		$('#reg .error_ps').hide();
	});
	//加入粘贴事件
	$('#reg').form('reg_ps').bind('paste',function(){
		//注意粘贴事件会在内容粘贴到文本框之前触发
		//这里需要通过延迟操作来解决这个问题
		//新版本的浏览已经支持在粘贴事件中同时触发keyup事件
		//所以这里即使不需要也能运行
		setTimeout(check_ps,50);
	});
	//清尾
	$('#reg .text_clear').click(function(){
		var _value = $('#reg').form('reg_ps').value().substring(0,100);
		$('#reg').form('reg_ps').value( _value );
		check_ps();
	});

	//**************************************提交*************************
	//检测是否满足提交条件
	var _check_from = function(){
		var flag = true;
		if( !_check_user() )
		{
			// $('#reg .error_user').show();
			flag = false;
		}
		if( !check_pass() )
		{
			// $('#reg .error_pass').show();
			flag = false;
		}
		if( !_check_pass() )
		{
			// $('#reg .error_check').show();
			flag = false;
		}
		if( !_check_ques() )
		{
			// $('#reg .error_ques').show();
			flag = false;
		}
		if( !_check_ans() )
		{
			// $('#reg .error_ans').show();
			flag = false;
		}
		if( !_check_email() )
		{
			// $('#reg .error_email').show();
			flag = false;
		}
		if( !check_ps() )
		{
			// $('#reg .error_ps').show();
			flag = false;
		}
		return flag;
	};
	$('#reg').bind('keyup',function(){ 
		if( _check_from() )
		{
			$('#reg .reg_reg').elements[0].disabled = false;
			$('#reg .reg_reg').class('mouse').class('reg_active');
		}
	});
	//点击注册按钮********************************
	$('#reg .reg_reg').click( function(){
		if( _check_from() )
		{
			$('#reg .reg_reg').elements[0].disabled = true;
			$('#reg .reg_reg').removeClass('reg_active').removeClass('mouse');
			$('#loading').show().center(200,60);
			$().ajax({
				method:'post',
				url:'php/config.php',
				data: $('#reg').find(0).serialize(),
				success:function(text){
					if( text == 1 )
					{
						$('#loading').hide();
						$('#load_success').show().center(160,90);
						$('#load_success .load_info').html('注册成功请登录！');
						setTimeout(hide_reg,1500);
					}
				},
				async:true
			});
		}
	

	} );

	//************************************ 登录账户 *************************************
	var reset_login = function(){
		$('#login .login_info').html('');
		$('#login .login_sub').elements[0].disabled = false;
		$('#login .login_sub').class('mouse');
	};
	$('#user').bind('focus',reset_login);
	$('#pass').bind('focus',reset_login);
	var check_login_user = function(){
		var getValue = dele_spce( $('#login').form('login_user').value() );
		return ( /\w{2,20}/.test( getValue ) && !/\W+/.test( getValue ) )?true:false;
	};
	var check_login_pass = function( )
	{
		var value = dele_spce( $('#login').form('login_pass').value() );
		var code_length = 0;
		if( /[0-9]/.test(value) )
		{
			code_length++;
		}
		if( /[a-z]/.test(value) )
		{
			code_length++;
		}
		if( /[A-Z]/.test(value) )
		{
			code_length++;
		}
		if( /[^\b\w]/.test(value) )
		{
			code_length++;
		}
		return ( value.length >= 6 && value.length <= 20 && !/\s/.test(value) && code_length >=2 )?true:false;
	};
	$('#login .login_sub').click(
		function(){
			if( check_login_user() && check_login_pass() )
			{
				$(this).elements[0].disabled = true;
				$(this).removeClass('mouse');
				$('#login .login_info').html('正在提交数据').class('load_info');
				$().ajax({
					method:'post',
					url:'php/check_login.php',
					data: $('#login').find(0).serialize(),
					success:function(text){
						$('#login .login_info').removeClass('load_info');
						if( text == 1 )
						{
							var _user = dele_spce( $('#login').form('login_user').value() );
							$().cookie('user',_user);
							setTimeout(function(){
								hide_login();
								//登陆成功后隐藏登陆和注册按钮 显示登陆用户名
								$('#header .login').hide();
								$('#header .regiter').hide();
								$('#header .login_success').css('display','inline-block').html( $().cookie('user') );
							},1500);	
						}else{
							$('#login .login_info').html('用户名不存在或密码错误');
						}
					},
					async:true
				});
			}else{
				$('#login .login_info').html('用户名或密码不合法');
			}

	});
	/******************** 发微博 ********************************/
	//打开发文弹出*********************
	$('#control_bar .blog').click(
		function()
		{
			out();
			show_fun( $('#write_blog'),$('#blog_h2') );
		}	
	);
	//**********************发送内容***********************
	var check_blog = function(){
		var _flag = null;
		var blog_title = dele_spce( $('#write_blog').form('blog_title').value() );
		var blog_cont = dele_spce( $('#write_blog').form('blog_content').value() );
		if( blog_title.length == 0 || blog_cont.length == 0 )
		{
			$('#write_blog .blog_sub').removeClass('reg_active').removeClass('mouse');
			_flag = false;
		}else{
			_flag = true;
			$('#write_blog .blog_sub').elements[0].disabled = false;
			$('#write_blog .blog_sub').class('reg_active').class('mouse');
		}
		return _flag;
	};
	$('#write_blog .title').bind('keyup',check_blog);
	$('#blog_content').bind('keyup',check_blog);

	$('#write_blog .blog_sub').click(function(){
		//发送博文还需要判断是否登陆账户，如果没有登陆账户，那么点击发送时应该弹出登录框
		//这还没有做？
		if( check_blog() )
		{
			$(this).elements[0].disabled = true;
			$(this).removeClass('reg_active').removeClass('mouse');
			$('#loading').show().center(200,60);
			$().ajax({
				method:'post',
				url:'php/add_blog.php',
				data: $('#write_blog').find(0).serialize(),
				success:function(text){
					if( text == 1 )
					{
						$('#loading').hide();
						$('#load_success').show().center(160,90);
						$('#load_success .load_info').html('发文成功！');
						setTimeout(function(){
							$('#write_blog').elements[0].reset();
							$('#load_success').hide();
							closed_fun( $('#write_blog') );
						},1500);
					}
				},
				async:true
			});
		}	
	});
	//关闭发文弹出*********************
	$('#write_blog .blog_closed').click(function(){
		$('#loading').hide();
		$('#load_success').hide();
		$('#write_blog').elements[0].reset();
		closed_fun( $('#write_blog') );
	});

});

