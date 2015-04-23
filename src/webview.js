function WebView(options) {
  var container = options.container;

  if (!container) {
    throw new Error('container can not be empty!');
  }

  if (typeof(options.container) != 'object') {
    container = document.querySelector(container);
  }


  this.container = container;
  this.items = [];

  this.transitionPrefix = WebView.getTransitionPrefix();
  this.prefix = 'wv-';
  this.width = container.clientWidth;
  this.height = container.clientHeight;
  this.axis = "X";
  this.scale = options.isVertical ? this.height : this.width;
  this._animateFunc = (options.animateType in this._animateFuncs)
    ? this._animateFuncs[options.animateType]
    : this._animateFuncs['default'];

  this.init();

}


WebView.format = function () {
  var args = Array.prototype.slice.call(arguments);
  var str = args[0];
  var i = 1;

  return str.replace(/%s/g, function () {
    return args[i++]
  })
}

WebView.getTransitionPrefix = function () {
  var el = document.createElement("div");
  var prefixes = ["Webkit", "Moz", "O", "ms"];
  for (var i = 0; i < prefixes.length; i++) {
    if (prefixes[i] + "Transition" in el.style) {
      return prefixes[i];
    }
  }
  return "transition" in el.style ? "" : false;
}


WebView.prototype.init = function () {
  var self = this;
  var cssText = 'position:relative;padding:0;margin:0;overflow:hidden;width:' + self.width + 'px;height:' + self.height + 'px;';
  var wrap = document.createElement("div");

  wrap.className = self.prefix + 'wrapper';
  wrap.style.cssText = cssText;

  for (var i = 0; i < 3; i++) {
    var item = document.createElement("div");
    item.className = self.prefix + 'item';
    item.style.cssText = cssText + 'position:absolute;top:0;left:0;';

    self._animateFunc(item, self.axis, self.scale, i, 0)
    self.items.push(item);
    self._renderItem(item, i - 1 + this.current);
    wrap.appendChild(item);
  }

  self.container.appendChild(wrap);
}

WebView.prototype._renderItem = function(dom,i){

}


//  口 口 口
//  [] [] [] [] []

WebView.prototype.switchTo = function(index){
  var self = this;
  var data = self.data;
  var items = self.items;
  var idx = index;
  var n = index - self.current;

  if(!data[idx]){
    return;
  }


  if (Math.abs(n) > 1) {
    var nextEls = n > 0 ? items[2] : items[0];
    //this._renderItem(nextEls, idx);
  }


  // keep the right order of items
  var sEle;
  if (this.isVertical) {
    if (n > 0) {
      sEle = els.pop();
      els.unshift(sEle);
    } else if (n < 0) {
      sEle = els.shift();
      els.push(sEle);
    }
  } else {
    if (n > 0) {
      sEle = els.shift();
      els.push(sEle);
    } else if (n < 0) {
      sEle = els.pop();
      els.unshift(sEle);
    }
  }




}


WebView.prototype.push = function (id, body) {

}

WebView.prototype.back = function () {

}

WebView.prototype.forward = function () {

}


WebView.prototype._animateFuncs = {
  'default': function (dom, axis, scale, i, offset) {
    dom.style.webkitTransform = WebView.format('translateZ(0) translate%s(%spx)', axis, offset + scale * (i - 1));
  }
};
