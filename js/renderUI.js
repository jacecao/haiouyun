define(['jquery','base'],function($,base){
  function renderUI(){
    this.base = new base.Base();
    // 加入底部按钮
    var side_bar = $('<div class="side-bar"><ul class="menu-ul"><li class="nav-bar"></li></ul></div>').appendTo('body');
    // 加入遮罩
    var local = $('<div class="local"></div>').appendTo('body');
    this.base.set_side_bar();

  }
  renderUI.prototype = {
    changeBar : function(){
      this.base.set_side_bar();
    }
  };

  return {
    renderUI : renderUI
  };
});