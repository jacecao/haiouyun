

define(['jquery'],function($){
  function renderUI(){
    // 加入底部按钮
    this.bottom_bar = $('<div class="bottom-bar"><ul class="menu-ul"><li class="nav-bar"></li></ul></div>').appendTo('body');
    // 加入mobile-nav 移动端菜单
    var nav = $('.header-nav').html();
    this.mobile_nav = $('<ul class="mobile-nav"></ul>').appendTo('body');
    this.mobile_nav.html( nav );
    // 加入遮罩
    this.local = $('<div class="local"></div>').appendTo('body');
    // 居中侧边栏
    this.set_side_bar();
  }
  renderUI.prototype = {
    set_bottom_bar : function(){
      var nav_bar = $('.nav-bar');
      if( $(window).width() <= 623 ){
        // 初始移动端菜单按钮的基本样式
        nav_bar.html('&#xe9bd;');
        this.mobile_nav.css({
          "top" : - this.mobile_nav.height(),
          "left" : ( $(window).width() - this.mobile_nav.width() )/2
        });
      }else{
        nav_bar.html('&#xe9ba;');
        // this.mobile_nav.hide();
        // this.local.hide();
      }
    },
    set_side_bar : function(){
      // 居中侧边栏
      $('.list').css({
        'left': ( $('.side-bar').width() - $('.list').width() )/2 ,
        'top': ( $(window).height() - $('.list').height() )/2 
      });
    }
  };

  return {
    renderUI : renderUI
  };
});