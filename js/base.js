
// 基本功能组件开发
define(['jquery','renderUI'],function($,renderUI){

  function Base(){
    
    this.render = new renderUI.renderUI();

    this.config = {
      time : 100,
      _mobile_nav : $('.mobile-nav'),
      _local : $(".local")
    };
    var config = this.config;
    var reset = false; //防止动画被多次触发
    this.show_nav_bar = function( callback ){ 
      if( config._mobile_nav.css('display') == 'none' && !reset )
      {
        config._local.show();
        config._mobile_nav.animate({
          'top' : ( $(window).height() - config._mobile_nav.height() ) / 2,
          'opacity' : 1
        },config._time,function(){
          reset = true;
          if( callback ){ callback(); }
        }).show();//注意需要把.show()要放在.animate()后面这样防止菜单不出现的BUG
      }
    };  
    this.close_nav_bar = function( callback ){
      if( config._mobile_nav.css('display') == 'block' && reset ){
         config._mobile_nav.animate({
          'top' : - config._mobile_nav.height(),
          'opacity' : 0
         }, config._time, function(){
          reset = false;
          config._mobile_nav.hide();
          if( callback ){ callback(); }
         });
         config._local.hide();
      } 
    };
  }    

  Base.prototype={
    bottom_bar_hander : function(){
  
      this.render.set_bottom_bar();
      this.render.set_side_bar();

      var _this = this;
      var _local = this.config._local;
      var _menu_a = $('.mobile-nav li a');

      var mobile_hander = function(){
        // 兼容手机横屏状态时，无法启动resize事件
        $('.mobile-nav').css('left', ( $(window).width() - $('.mobile-nav').width() )/2);
        // 再执行动画
        _this.show_nav_bar();
      };

      var pc_hander = function(){
        if( $('body').hasClass('padding') )
        {
          $('body').removeClass('padding');
          $('.side-bar').removeClass('side-bar-active');
          $(this).html('&#xe9ba;');
        }else{
          $('body').addClass('padding');
          $('.side-bar').addClass('side-bar-active');
          $(this).html('&#xea0f;');
        }
      };
      // 显示菜单栏
      var evt = ( 'ontouchend' in window ) ? 'touchend' : 'click';
      if( $(window).width() <= 623 && $('.header-nav').css('display') == 'none' ){
        //先移除PC端的事件再加载移动端事件
        //尽管这里是先判断当前窗口大小，但只要两个情况都出现后就会出现绑定2个事件函数
        //由于该元素唯一并多用于所以这里必须要全部移除该元素绑定的事件才有效。
        $('.nav-bar').unbind( evt );
        $('.nav-bar').bind( evt , mobile_hander);
      }else if( $(window).width() > 623 && $('.header-nav').css('display') == 'block' ){
        $('.nav-bar').unbind( evt );
        $('.nav-bar').bind( evt , pc_hander);
      }
      //关闭菜单栏
      _local.bind( evt, function(){
        _this.close_nav_bar();
      });
      _menu_a.bind( evt, function(){
        _this.close_nav_bar();
      }); 
    }
  };

  return {
    Base : Base
  };


});
