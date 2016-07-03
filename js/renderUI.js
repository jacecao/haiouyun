define(['jquery','base'],function($,base){
  function renderUI(){
    this.base = new base.Base();
    // 加入底部按钮
    this.side_bar = $('<div class="side-bar"><ul class="menu-ul"><li class="nav-bar"></li></ul></div>').appendTo('body');
    // 加入mobile-nav 移动端菜单
    var nav = $('.header-nav').html();
    this.mobile_nav = $('<ul class="mobile-nav"></ul>').appendTo('body');
    this.mobile_nav.html( nav );
    // 加入遮罩
    this.local = $('<div class="local"></div>').appendTo('body');
    // this.base.set_side_bar();
  }
  renderUI.prototype = {
    set_side_bar : function(){
      var nav_bar = $('.nav-bar');
      if( $(window).width() <= 600 ){
        // 初始移动端菜单按钮的基本样式
        nav_bar.html('&#xe9bd;');
        this.mobile_nav.css({
          "top" : - this.mobile_nav.height(),
          "left" : ( $(window).width() - this.mobile_nav.width() )/2
        });
      }else{
        nav_bar.html('&#xe9ba;');
        this.mobile_nav.hide();
      }
    }
  };

  return {
    renderUI : renderUI
  };
});