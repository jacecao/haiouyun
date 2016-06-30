/** 全局 **/

/** 基础库 **/
var $ = function( selector )
	{
		return ( new Elements( selector ) );
	};

function Elements( selector )
{
	// 获取元素 
	this.elements = [];
	if( typeof selector == "string" )
	{
		if( typeof document.querySelectorAll != "undefined" )
		{
			var sumEle = document.querySelectorAll( selector );
			for( var i = 0; i < sumEle.length; i++ )
			{
				this.elements.push( sumEle[i] );
			}
			// return this;
		}else if( selector.indexOf(" ") != -1 ){ //兼容没有querySeclectorAll()的浏览器
			//css 模拟选择元素
			var _elements = selector.split(" "); //把css选择模式通过空格拆分成数组保存
			var childElements = []; //存放临时节点对象的数组，解决this.elements被覆盖的问题
			var _node = []; //用于存放父节点
			for( var i = 0; i < _elements.length; i++ )
			{
				if( _node.length == 0 )
				{
					_node.push( document );//如果一开始没有父节点存放，那么默认将document放入
				}
				switch( _elements[i].charAt(0) )
				{
					case "#":
						childElements = [];  //开始需要清理临时节点 让前一个范围节点失效 
						childElements.push( this.getId( _elements[i].substring(1) ) );
						_node = childElements;  //保存范围节点（父节点），childElements会再下一次清理掉；
						break; 
					case ".":
						childElements = [];
						for( var j = 0; j < _node.length; j++ )
						{
							var temps = this.getClass( _elements[i].substring(1), _node[j] );
							for( var k = 0; k < temps.length; k++ )
							{
								childElements.push( temps[k] );
							}
						}
						_node = childElements;
						break;
					default:
						childElements = [];
						for( var j = 0; j < _node.length; j++ )
						{
							var temps = this.getTagName( _elements[i], _node[j] );
							for( var k = 0; k < temps.length; k++ )
							{
								childElements.push( temps[k] );
							}
						}
						_node = childElements;
				}
			}
			this.elements = childElements;
		}else{
			//find方式选择元素
			switch( selector.charAt(0) )
			{
				case "#":
					this.elements.push( this.getId( selector.substring(1) ) );
					break; 
				case ".":
					this.elements = this.getClass( selector.substring(1) );
					break;
				default:
					this.elements = this.getTagName( selector );		
			}
			// return this;
		}
	}else if( typeof selector == "object" ){//主要实现$(this),window
		if( selector != "undefined" )
		{
			this.elements.push( selector );
			// return this;
		}
	}else if( typeof selector == "function" ){
		this.ready( selector );
	}
}

Elements.prototype = 
{
	//DOMLoaded
	ready:function( fn )
		{
			DomLoaded( fn );
		},
	//获取元素基础方法
	getId:function( id )
		{
			return document.getElementById( id );
		},
	getClass:function( className, parentNode )
		{
			var node = null, _arr = [];
			if( parentNode != 'undefined' )
			{
				node = parentNode;
			}else{
				node = document;
			}
			var tagArr = node.getElementsByTagName("*");
			for( var i = 0; i < tagArr.length; i++ )
			{
				if( ( new RegExp( '(\\s|^)' + className + '(\\s|$)') ).test( tagArr[i].className ) )
				{
					_arr.push( tagArr[i] );
				}
			}
			return _arr;
		},
	getTagName:function( tagName, parentNode )
		{
			var node = null, _arr = [];
			if( parentNode != 'undefined' )
			{
				node = parentNode;
			}else{
				node = document;
			}
			var tagArr = node.getElementsByTagName( tagName );
			for( var i = 0; i < tagArr.length; i++ )
			{
				_arr.push( tagArr[i] );
			}
			return _arr;
		},
	length:function()
		{
			return this.elements.length;
		},
	//获取某个节点的属性
	attr:function( attr, value ){
			for( var i = 0; i < this.elements.length; i++ )
			{
				if( arguments.length == 1 )
				{
					return this.elements[0].getAttribute(attr);
				}else if( arguments.length == 2 )
				{
					this.elements[i].setAttribute( attr, value );
				}
			}
			return this;
		},
	//获取索引值
	//注意使用obj.index()得到的索引是参考其上一级父元素下的所有children来确定
	//所以要明确自己obj的层次关系
	index:function(){
			var parent = this.elements[0].parentNode,
				childs = parent.children;
				//children只返回HTML节点,虽然不是标准的DOM属性，
				//但是得到了几乎所有浏览器的支持。
				//在W3C规范中，是通过childNodes来获取子节点的，它是一个标准属性，返回指定元素的子节点的集合，
				//包括HTML节点、文本节点、注释节点等，比children返回的节点类型更加广泛。
			for( var i = 0; i < childs.length;i++ )
			{
				if( this.elements[0] == childs[i] )
				{
					return i;
				}
			}
		},
	//查找指定元素
	find:function( cssSelector )
		{
			var _findElements = [];
			if( typeof cssSelector == 'number' )
			{
				//这段代码回出现错误，原因是直接改变了this.elements的数组
				//在同一对象下多次使用find()就会出现错误
				// _findElements.push( this.elements[cssSelector] );
				// this.elements = _findElements;//这部分代码在执行中会有冲突
				//解决办法就是在对象内部储存一个变量值来储存该对象初始的this.elements数据
				if( !this._tempEle )
				{
					this._tempEle = [];
					for( var i = 0; i < this.elements.length; i++ )
					{
						this._tempEle[i]=this.elements[i];
					}
					_findElements.push( this.elements[cssSelector] );
					this.elements = _findElements;
				}else{
					for( var i = 0; i < this._tempEle.length; i++ )
					{
						this.elements[i] = this._tempEle[i];
					}
					_findElements.push( this.elements[cssSelector] );
					this.elements = _findElements;
				}
				return this;
			}else{
				for( var i = 0; i < this.elements.length; i++ )
				{
					switch( cssSelector.charAt(0) )
					{
						case "#":
							_findElements.push( this.getId( cssSelector.substring(1) ) );
							break; 
						case ".":
							/*
							**var tagArr = this.elements[i].getElementsByTagName("*");
							**for( var j = 0; ij < tagArr.length; j++ )
							**{
							**	if( tagArr[j].className == cssSelector.substring(1) )
							**	{
							**		_findElements.push( tagArr[i] );
							**	}
							**}
							*/
							var temp = this.getClass( cssSelector.substring(1), this.elements[i] );
							for( var j = 0; j < temp.length; j++ )
							{
								_findElements.push( temp[j] );
							}
							break;
						default:
							var tags = this.getTagName( cssSelector, this.elements[i] );
							for( var j = 0; j < tags.length; j++ )
							{
								_findElements.push( tags[i] );
							}		
					}
				}
			}
			this.elements = _findElements;
			return this;
		},
	//查找上一个非文本节点	
	previous:function()
		{
			for( var i = 0; i < this.elements.length; i++ )
			{
				this.elements[i] = this.elements[i].previousElementSibling;
				if( this.elements[i] == null )
				{
					throw new Error('找不到上一个元素');
				}
			}
			return this;
		},		
	//查找下一个非文本节点	
	next:function()
		{
			for( var i = 0; i < this.elements.length; i++ )
			{
				this.elements[i] = this.elements[i].nextElementSibling;
				if( this.elements[i] == 'null' )
				{
					throw new Error('找不到下一个元素');
				}
			}
			return this;
		},
	//获取、设置css		
	css:function( attr, value )
		{
			for( var i = 0; i < this.elements.length; i++ )
			{
				var obj = this.elements[i];
				if( arguments.length == 1 ){
					// if( typeof window.getComputedStyle != "undefined" )//w3c
					// {
					// 	return parseInt( window.getComputedStyle( obj, null )[attr] );
					// }else if( typeof obj.currentStyle != "undefined" )//IE
					// {
					// 	return parseInt( obj.currentStyle[attr] );
					// }
					return getStyle( obj, attr );
				}else{
					obj.style[attr] = value;
					return this;
				}
			}
		},
	//兼容IE设置节点透明度
	opacity:function( num ){
		for( var i = 0; i < this.elements.length; i++ )
		{
			this.elements[i].style.opacity = num / 100;
			this.elements[i].style.filter = 'alpha(opacity=' + num +')';
		}
		return this;
	},
	//添加CLASSNAME
	class:function( classname )
		{
			for( var i = 0; i < this.elements.length; i++ )
			{
				/*注意1.这里的RegExp采用的是字符串创建方式，是因为需要加入参数值
				* 这里判断是为了防止相同className的重复加入
				* 也可以采用：if( (' '+this.elements[i].className+' ').indexOf( " "+classname+" ") == -1 )
				*/
				if( !this.elements[i].className.match( new RegExp( "(\\s|^)" + classname +"(\\s|$)") ) )
				{
					this.elements[i].className += " " + classname;
				}
			}
			return this;
		},
	//移除class	
	removeClass:function( classname )
		{
			for( var i = 0; i < this.elements.length; i++ )
			{
				if( (' '+this.elements[i].className+' ').indexOf( " "+classname+" ") != -1 )
				{
					//这里就需要正则表达式来移除new RegExp( "(\\s|^)" + classname +"(\\s|$)" )
					this.elements[i].className = this.elements[i].className.replace( new RegExp( "(\\s|^)" + classname +"(\\s|$)" )," ");
				}
			}
			return this;
		},
	//添加css规则样式表
	//document.styleSheets[0].insertRule insertRule(css语句，index) deleteRule(index)浏览已经全部支持
	//num:第几张样式表 slectorText: 需要添加样式的元素 cssText: css语句 index: 在该样式表中插入添加样式的索引位置
	rule:function( num, selectorText, cssText, index )
		{
			var sheet = document.styleSheets[num];
			sheet.insertRule( selectorText + "{" + cssText + "}", index );
			return this;
		},
	//移除css规则样式表,不常用 慎用	
	removeRule:function( num, index )
		{
			var sheet = document.styleSheets[num];
			sheet.deleteRule( index );
			return this;
		},
	//设置事件发生器
	bind:function( event, fn )
		{
			for( var i = 0; i < this.elements.length; i++ )
			{
				addEvent( this.elements[i], event, fn );
			}
			return this;
		},
	//设置鼠标移入移出事件,分别传入移入和移出对应的执行函数
	hover:function( over, out )
		{
			for( var i = 0; i < this.elements.length; i++ )
			{
				addEvent( this.elements[i], "mouseover", over);
				addEvent( this.elements[i], "mouseout", out);
			}
			return this;
		},
	//显示和隐藏
	show:function()
		{
			for( var i = 0; i < this.elements.length; i++ )
			{
				this.elements[i].style.display = "block";
			}
			return this;
		},
	hide:function()
		{
			for( var i = 0; i < this.elements.length; i++ )
				{
					this.elements[i].style.display = "none";
				}
			return this;
		},
	//获取元素自身高度和宽度，返回一个对象	
	offset:function()
		{
			var offset = {};
			for( var i = 0; i < this.elements.length; i++ )
			{
				offset.width = this.elements[i].offsetWidth;
				offset.height = this.elements[i].offsetHeight;
				offset.top = this.elements[i].offsetTop;
				offset.left = this.elements[i].offsetLeft;
			}
			return offset;
		},	
	//元素实现视窗居中 需要传入元素的自身高度
	center:function( width, height )
		{
			var top = View_Y - height,
				left = View_X - width;
			if( top <= 0 )
			{
				top = 40;
			}	
			for( var i = 0; i < this.elements.length; i++ )
			{
				var _height = document.documentElement.offsetHeight;
				//这里判断在浮动元素居中后如果整体高度大于页面自身高度，
				//top值就必须给予调整，防止遮罩出现BUG
				if( top/2 + scroll().top + height > _height )
				{
				 	//_cut值是计算出当前居中元素超出页面边界
				 	var _cut = Math.ceil( top/2 + scroll().top + height - _height );
				 	this.elements[i].style.top = top/2 + scroll().top - _cut + "px";
				}else{
				 	this.elements[i].style.top = top/2 + scroll().top + "px";
				}
				this.elements[i].style.left = left/2 + scroll().left + "px";
			}
			return this;
		},
	//点击事件	
	click:function( fn )
		{
			for( var i = 0; i < this.elements.length; i++ )
			{
				addEvent( this.elements[i], "click", fn);
			}
			return this;
		},
	//点击切换方法
	toggle:function(){
			//为了保证执行切换的独立性，即让count计数时不受其他元素执行的干扰。
			//保证每个元素在执行切换时都是使用自身的count计数。
			var _readyTog = function( ele, args )
			{
				var count = 0;
				addEvent( ele, 'click', function()
				{
					if( count == args.length )
					{
						count = 0;
					}
					//谁被点击谁就执行这个函数，而不是让所有元素都执行，理解这个很重要
					args[count++].call( this );
				});
			};
			for( var i = 0; i < this.elements.length; i++ )
			{
				_readyTog( this.elements[i], arguments );
				//这里也可以采用闭包方式来处理计数带来的bug
				/*
				*(function( ele, args ){
				*	var count = 0;
				*	addEvent( ele, 'click', function()
				*	{
				*		if( count == args.length )
				*		{
				*			count = 0;
				*		}
				*		args[count++].call( this );
				*	});
				*})( this.elements[i], arguments );
				*/
			}
			return this;
		},	
	//鼠标事件
	mousedown:function( fn )
		{
			for( var i = 0; i < this.elements.length; i++ )
			{
				addEvent( this.elements[i], "mousedown", fn);
			}
			return this;
		},
	//在resize事件中让拖拽元素始终显示在视窗范围内
	resize:function( fn )
		{
			for( var i = 0; i < this.elements.length; i++ )
			{
				var element = this.elements[i];
				addEvent( window, "resize", function(){
					//在窗口发生变化后重置View_X View_Y的值
					View_X = window.innerWidth || document.documentElement.clientWidth;
					View_Y = window.innerHeight || document.documentElement.clientHeight;
					if( arguments.length == 1 )
					{
						fn();
					}
					if( element.offsetLeft > View_X + scroll().left - element.offsetWidth )
					{
						element.style.left = View_X + scroll().left - element.offsetWidth - 10 + "px";
					}
					if( element.offsetTop > View_Y + scroll().top - element.offsetHeight )
					{
						element.style.top = View_Y + scroll().top - element.offsetHeight - 10 + "px";
					}
					if( element.offsetTop <= 0 + scroll().top )
					{
						element.style.top = scroll().top + 15 + "px";
					}
					if( element.offsetLeft <= 0 + scroll().left )
					{
						element.style.left = scroll().left + "px";
					}
				});
			}
			return this;
		},	
	//让遮罩元素锁定屏幕  mainbox数值参数是如果页面有最小限制，那么遮罩最小宽度应该与页面宽度一样而不是与视窗宽度一样
	local:function( minWidth )
		{
			var vw = View_X + scroll().left,
				vh = scroll().height || View_Y;
			if( !!minWidth && vw < minWidth )
			{
				vw = minWidth;//这里的minWidth参数是指页面的最小宽度，当视窗小于页面大小时遮罩的大小就应该和最小页面相等
			}else if( vw > document.body.offsetWidth ){
				vw = document.body.offsetWidth;
			}
			// if( vh < document.body.offsetHeight )
			// {
			// 	//document.body.offsetHeight 并不表示一个页面的完整高度，尤其是存在margin属性时
			// 	//所以document.documentElement.offsetHeight，这个值最完全。
			// 	//vh = document.documentElement.offsetHeight<scroll().height?scroll().height:document.documentElement.offsetHeight;
			// 	//这里有一个BUG需要修复，在浏览大图时遮罩会出现不能全部覆盖的情况
			// 	vh = scroll().height + 20 || document.documentElement.offsetHeight + 20;
			// }
			for( var i = 0; i < this.elements.length; i++ )
			{
				this.elements[i].style.width = vw + "px";
				this.elements[i].style.height = vh + "px";
				this.elements[i].style.display = "block";
			}
			return this;	
		},
	//动画设置，！！注意元素必须设定绝对定位，且需要设定左、上间距；
	animate:function( obj )
		{	
			for( var i = 0; i < this.elements.length; i++ )
			{
				var ele = this.elements[i],
					attr = obj.attr != 'undefined' ? obj.attr : 'left',// 可选 left\top
					start = obj.start != undefined ? obj.start : getStyle( ele, attr ), //可选 起始值 默认为元素left值
				    time = obj.time != undefined ? obj.time : 30, //可选 执行事件 毫秒
					step = obj.step != undefined ? obj.step : 7, // 可选 运动增长值
					alter = obj.alter, // 有target值那么该参数可选 否必选  移动值
					target = obj.target, // 有alter值那么该参数可选 否必选 目标值
					speed = obj.speed != undefined ? obj.speed : 6, //可选 缓冲速度值默认6
					mix = obj.mix, //同步动画对象 里面是属性和目标值的键值对 传值标准为{'attr':number[,...]}
					type = obj.type == 'constant' ? 'constant' : obj.type == 'buffer' ? 'buffer' : 'buffer'; //可选 默认为减速缓冲运动方式	
				//判断目标值
				if( alter != undefined && target == undefined ){
					target = alter + start;
				}else if( alter == undefined && target == undefined && mix == undefined ){
					throw new Error('在animate方法里传入的对象中alter增量值或target目标值得有一个');
				}
				if( mix == undefined ) //如果没有参数传入，那么创建该对象传入
				{
					mix = {};
					mix[attr] = target;
				}
				if( start > target )
				{
					step = -step;
				}
				//对属性判断
				switch( attr )
				{
					case 'opacity':
						start = obj.start != undefined ? obj.start : getStyle( ele, attr )*100;
						ele.style.opacity = parseInt( start )/100;
						ele.style.filter = 'alpha(opacity=' + parseInt( start ) + ')';
					break;

					default:
						ele.style[attr] = start + 'px';
				}
				clearInterval( ele.timer );
				//注意这里定时器的赋值很关键，即给每个元素一个单独的定时器，互不影响。很重要也很巧妙解决多个元素动画失效问题
				ele.timer = setInterval( function()
				{ 
					/* 当执行同步动画和列队动画时如果没有识别所有动画是否完成
					** 就会产生2个BUG
					** 1 同步动画会多次执行列队动画
					** 2 同步动画如果目标值不一样会让目标值大的动画无法完成定时器就被清理掉
					*/ 
					//这里创建一个布尔值来识别所有动画是否都执行完毕，这个非常重要。
					var over = true;
					for( var j in mix )//实现多个属性的同步动画
					{
						attr = j;
						target = mix[j];
						var value = getStyle( ele, attr );
						if( typeof value != 'number' )
						{
							throw new Error('value参数类型出错');
						}
						//缓冲运动的实现
						switch( attr )
						{
							case 'opacity':
								value = getStyle( ele, attr )*100;
							break;
							default:
								value = getStyle( ele, attr );
						}
						if( type == 'buffer' )
						{	
							step = ( target - value )/speed;
							//这里的取值需要注意ceil与floor方法在面对正负值时取得的值有所不同
							step = step > 0 ? Math.ceil( step ) : Math.floor( step );
						}
						switch( attr )
						{
							case 'opacity':
								//这里将保证在 增量过程中不会超过目标值
								if( step == 0 )
								{
									setOpacity();
								}else if( step > 0 && Math.abs( value - target ) <= step ){
									setOpacity();
								}else if( step < 0 && ( value - target ) <= Math.abs( step ) ){
									setOpacity();
								}else{
									ele.style.opacity = parseInt( value + step )/100;
									ele.style.filter = 'alpha(opacity=' + parseInt( value + step ) + ')';
								}
								if( target != parseInt( value ) )//判定所有动画是否执行完毕
								{
									over = false;
								}	
							break;
							default:
								if( step == 0 )
								{
									setTarget();
								}else if( step > 0 && Math.abs( value - target ) <= step ){
									setTarget();
								}else if( step < 0 && ( value - target ) <= Math.abs( step ) ){
									setTarget();
								}else{
									ele.style[attr] = value + step + 'px';
								}
								if( target != value )
								{
									over = false;
								}		
						}	
					}
					//这里识别是否所有动画已经完成，如果完成再执行列队动画
					if( over )
					{
						clearInterval( ele.timer );
						//实现列队动画
						if( obj.fn != undefined )
						{
							obj.fn();
						}
					}	
				}, time );
				function setTarget()
				{
					ele.style[attr] = target + 'px';
				}
				function setOpacity()
				{
					 ele.style.opacity = parseInt( target )/100;
					 ele.style.filter = 'alpha(opacity='+ parseInt( target ) + ')';
				}
			}
			return this;
		},
	//获取表单中有name属性的子元素
	form:function( name )
		{
			for( var i = 0; i < this.elements.length; i++ )
			{
				this.elements[i] = this.elements[i][name];
			}
			return this;
		},
	//表单序列化
	//******************表单序列化********************/
	//表单序列化要求：
	//1.不发送禁用字段，2.只发送勾选的复选框和单选按钮
	//3.不发送type是reset\submit\file\button以及字段集
	//4.多选择框中的每个选中的值单独一个条目
	//5.对于<selec>，如果有value值，就指定value作为发送的值
	//如果没有就指定text值。
	//form ： 明确指定的form表单
	serialize:function(){
			for( var i = 0; i < this.elements.length; i++ )
			{
				var form = this.elements[i];
				var parts = {};
				for( var i = 0; i < form.elements.length; i++ )//form.elements得到所有的表单子元素(label除外)
				{
					var filed = form.elements[i];
					switch( filed.type ){
						case undefined:
						case 'submit':
						case 'reset':
						case 'file':
						case 'button':
							break;
						case 'radio':
						case 'checkbox':
							if( !filed.selected ){ break; }
						case 'select-one': //单选
						case 'select-multiple':	 //多选
							for( var j = 0; j < filed.options.length; j++ )
							{
								var option = filed.options[j];
								if( option.selected ){
									var optValue = '';
									if( option.hasAttribute ){//IE8及之前是没有该方法的，用于判断某个元素是否拥有某个属性
										optValue = ( option.hasAttribute('value')? option.value : option.text );
									}else{
										//specified 查明是否已规定某个属性 返回布尔值：
										optValue = ( option.attribute('value').specified ? option.value : option.text );
									}
									parts[filed.name] = optValue;
								}
							}
						default:
							parts[filed.name] = filed.value;	
					}
				}
				return parts;
			}
		},	
	//获取表单元素的值
	value:function( v )
		{
			var eles = this.elements;
			for( var i = 0; i < eles.length; i++ )
			{
				if( arguments.length == 0 )
				{
					return eles[i].value;
				}else{
					eles[i].value = v;
				}
			}
			return this;
		},	
	//获取和添加innerHTML，不常用也需要慎用	
	html:function( str )
		{
			var eles = this.elements;
			var htmlArr = [];
			for( var i = 0; i < eles.length; i++ )
			{
				if( arguments.length == 0 )
				{
					htmlArr.push( eles[i].innerHTML );
					return htmlArr.toString();
				}else{
					eles[i].innerHTML = str;
				}
			}
			return this;
		},
	//获取和添加innerText，不常用也需要慎用
	text:function( str )
		{
			var eles = this.elements;
			for( var i = 0; i < eles.length; i++ )
			{
				if( arguments.length == 0 )
				{
					return getInnerText( eles[i] );
				}else{
					setInnerText( eles[i], str );
				}
			}
			return this;
		},
	//******************** 设置或获取cookie************************************	
	//参数说明 name\value 必须 构成键值对，如果只传入name一个参数那么表示获取cookie
	//expires：失效时间，_path:允许访问路径，设定指定访问该cookie的路径
	//_domain: 允许访问域名，只有设置的域名才可以方位该cookie
	//secure： 安全设置，指明必须通过安全的通信通道来传输（HTTPS）才能获取cooki
	cookie:function( name, value, expires, _path, _domain, secure )
		{
			if( arguments.length == 1 )
			{
				var cookieName = encodeURIComponent( name ) + "=";
				var cookieStart = document.cookie.indexOf( cookieName );
				var cookieValue = null;
				if( cookieStart > -1 )
				{
					var cookieEnd = document.cookie.indexOf(';',cookieStart);
					if( cookieEnd == -1 ){
						//name存在但没有值的情况
						cookieEnd = document.cookie.length;
					}
					var _value = document.cookie.substring(cookieStart+cookieName.length,cookieEnd);
					cookieValue = decodeURIComponent( _value );
					_value = null;
				}
				return cookieValue;
			}else{
				var cookieText = encodeURIComponent(name) + '=' + encodeURIComponent(value);
				if( expires instanceof Date )//是否是一个时间值
				{
					cookieText += ';expires=' + expires;
				}
				if( _path )
				{
					cookieText += ';path=' + _path;
				}
				if( _domain )
				{
					cookieText += ';domain=' + _domain;
				}
				if( secure )
				{
					cookieText += ';secure';
				}
				document.cookie = cookieText;
			}
		},	
	//********************* 自定义方法 ***************************	
	extend:function( name, fn )
		{
			Elements.prototype[name] = fn;
		},

	//ajax封装
	//obj对象属性有：
	//.url .data .method .async (布尔值) .scuccess (数据传递成功后执行的函数)
	ajax:function( obj )
		{
			var xhr = (function(){
				if( typeof XMLHttpRequest != 'undefined' )
				{
					return new XMLHttpRequest();
				}else if( typeof ActiveXObject != 'undefined' ){
					var version = [
						'MSXML2.XMLHttp.6.0',
						'MSXML2.XMLHttp.3.0',
						'MSXML2.XMLHttp'
					];
					for( var i = 0; version.length; i++ )
					{
						try{
							return new ActiveXObject( version[i] );
						}catch(e){
							//继续
						}
					}
				}else{
					throw new Error('浏览器版本不支持XHR对象！');
				}
			})();
			obj.url = obj.url + '?rand=' + Math.random();
			obj.data = (function( data ){
				var arr = [];
				for( var i in data )
				{
					arr.push( encodeURIComponent(i) + '=' + encodeURIComponent(data[i]) );
				}
				return arr.join('&');
			})( obj.data );
			if( obj.method === 'get')
			{
				obj.url += obj.url.indexOf('?') ? '?' + obj.data : '&' + obj.data;
			}
			if( obj.async === true )
			{
				xhr.onreadystatechange = function()
				{
					if( xhr.readyState == 4 )
					{
						ajax_callback();
					}
				};
			}
			xhr.open( obj.method, obj.url, obj.async );
			if( obj.method === 'post' )
			{
				xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
				xhr.send(obj.data);
			}else{
				xhr.send(null);
			}
			if( obj.async === false )
			{
				ajax_callback();
			}
			function ajax_callback(){
				if(xhr.status == 200 )
				{
					obj.success(xhr.responseText);
				}else{
					console.error('获取数据错误！错误代号：'+xhr.status+'错误信息：'+xhr.statusText);
					console.log('请检查服务器是否成功连接');
				}
			}
		}



};