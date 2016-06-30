function getName(ele,clazz)
{
	if(ele.getElementsByClassName)
	{
		return ele.getElementsByClassName(clazz);
	}else{
		var list=ele.getElementsByTagName("*"),
			result=[];
		for(var i=0;i<list.length;i++)
		{
			if( (' '+list[i].className+' ').indexOf(' '+clazz+' ')!=-1 )
			{
				result.push(list[i]);
			}	
		}
		return result;
	}
}
function getId(id)
{
	return document.getElementById(id)
}

//大图浏览动画
var hearder=getId("header"),
	main_imgs=getName(header,"main_imgs")[0],
	baseValue=12,//每次运行增长的量
	starValue=0;//动画的起始值
function imgMove()
{
	if(starValue>=-6000)
	{
		starValue-=baseValue;
		main_imgs.style.left=starValue+"px";
		if(starValue%1200==0)
		{
			return;
		}else{
			setTimeout(imgMove,10);
		}
	}else{
		backMove();
	}
}
// 图片返回到起点动画
function backMove()
{
	if(starValue<=0)
	{
		starValue+=baseValue*10;
		main_imgs.style.left=starValue+"px";
	}else{
		starValue=0; 
		return;
	}
	setTimeout(backMove,10);
}


// 浏览图进度条动画
var bar_run=getName(header,"bar_run"),
	bar_index=0,//进度条数组的下标起始值
	beginValue=0,//动画起始值
	base=2,//每次运行增长值
	nextValue=null;//储存下一个运动的目标值（鼠标点击时产生值）
function barRun()
{
	// 判断当前进度到在什么位置，如果已经进行到最后一个进度条那么下一个进度条必须返回0
	if(bar_index<=bar_run.length-1)
	{
		/* 读取大图的位置（这是为了点击时能准确定位图片的位置）
		同时增加图片前进或后退的动画 */
		main_imgs.style.left=starValue+"px";
		// 进度开始读取
		beginValue+=base;
		bar_run[bar_index].style.width=beginValue+"px";
		if(beginValue==200)
		{
			// 当进度条达到末端时运行imgMove()移动图片到下个位置
			imgMove();
			// 清除当前进度条的宽度
			bar_run[bar_index].style.width=0+"px";
			bar_index++;
			// 并让起始位置回到0
			beginValue=0;
			setTimeout(barRun,50);
		}else{
			setTimeout(barRun,50);
		}
	}else{
		bar_index=0;
		setTimeout(barRun,50);
	}
}
barRun();

// 点击时图片发生时检查当前运动位置和目标位置是否有差距（如果有差距那么产生移动动画）
function chengeValue()
{
	var tempValue;//临时增长（主要是正负的差别）
	if(starValue<nextValue)
	{
		tempValue=baseValue*10;
	}else{
		tempValue=-baseValue*10;
	}
	starValue+=tempValue;
	if(starValue!=nextValue)
	{
		main_imgs.style.left=starValue+"px";
		setTimeout(chengeValue,10);
	}else{
		main_imgs.style.left=starValue+"px";
		return;
	}
}

// 点击切换事件
var bar_img=getName(header,"s_img");
function addClick()
{
	for(var i=0;i<bar_img.length;i++)
	{
		// 每个小浏览图增加index属性其目的是为了储存下标值并在后面返回给进度条（使其两则达到同步）
		bar_img[i].index=i;
		bar_img[i].onclick=function()
		{
			// 点击时首先需要清除掉所有进度条的宽度
			for(var j=0;j<bar_run.length;j++)
			{
				bar_run[j].style.width=0+"px";
			}
			// 并把鼠标点击的当前位置作为起始位置
			bar_index=this.index;
			beginValue=0;
			nextValue=this.index*(-1200);
			// nextValue赋值后开始与图片的当前位置做比较
			if(nextValue!=starValue)
			{
				chengeValue();
			}else if(nextValue==starValue){
				main_imgs.style.left=starValue+"px";
			}
		}
	}
}
addClick();