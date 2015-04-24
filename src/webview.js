function format() {
  var args = Array.prototype.slice.call(arguments);
  var str = args[0];
  var i = 1;

  return str.replace(/%s/g, function () {
    return args[i++]
  })
}


function WebView(options) {
  var container = options.container;

  if (!container) {
    throw new Error('container can not be empty!');
  }

  if (typeof(options.container) != 'object') {
    container = document.querySelector(container);
  }

  this.container = container;
  // 滚动项
  this.data = options.data || [];
  // 当前显示的数据
  this.current = 1;
  // 滚动的3个dom对象
  this.items = [];

  // class前缀
  this.cssPrefix = 'wv-';

  // 滚动方向
  this.vertical = options.vertical !== undefined ? options.vertical : false;
  this.axis = this.vertical ? 'Y' : 'X';

  // 对象尺寸
  this.width = container.clientWidth;
  this.height = container.clientHeight;
  // 滚动距离
  this.scale = this.vertical ? this.height : this.width;

  this._animateFunc = (options.animateType in this._animateFuncs)
    ? this._animateFuncs[options.animateType]
    : this._animateFuncs['default'];


  this.init();

}


WebView.prototype.init = function () {
  var self = this;

  self._reanderWrapper();
}

WebView.prototype._reanderWrapper = function () {
  var self = this;
  var wrap = document.createElement("div");
  var cssText = 'position:%s;' +
    'left:0;' +
    'top:0;' +
    'width:%s;' +
    'height:%s' +
    'padding:0;' +
    'margin:0;' +
    'overflow:hidden;';

  wrap.className = self.cssPrefix + 'wrapper';
  wrap.style.cssText = format(cssText, 'relative', self.width, self.height);

  for (var i = 0; i < 3; i++) {
    var item = document.createElement("div");
    item.className = self.prefix + 'item';
    item.style.cssText = cssText + format(cssText, 'absolute', self.width, self.height);

    self._animateFunc(item, self.axis, self.scale, i, 0)
    self.items.push(item);
    self._renderItem(item, i - 1 + this.current);
    wrap.appendChild(item);
  }

  self.container.appendChild(wrap);
}


WebView.prototype._renderItem = function (dom, i) {

}



WebView.prototype.switch = function (index) {
  var self = this;
  var data = self.data;
  var items = self.items;
  var direction = index - self.current;
  var tmp;

  if (!data[index]) {
    return;
  }

  if (Math.abs(direction) > 1) {
    //var nextEls = n > 0 ? items[2] : items[0];
    //this._renderItem(nextEls, idx);
  }

  if (direction > 0) {
    tmp = items.pop();
    items.unshift(tmp);
  } else {
    tmp = items.shift();
    items.push(tmp);
  }


  // do the trick animation
  for (var i = 0; i < 3; i++) {
    if (items[i] !== tmp) {
      items[i].style.webkitTransition = 'all .3s ease';
    }
    this._animateFunc(items[i], this.axis, this.scale, i, 0);
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
    dom.style.webkitTransform = format('translateZ(0) translate%s(%spx)', axis, offset + scale * (i - 1));
  }
};


/**
 * css3属性兼容性
 * @param property
 * @returns {*}
 */
WebView.getCssPrefix = function (property) {
  var body = document.body;
  var prefixes = ["webkit", "moz", "o", "ms"];
  var tmp;

  if (property in body.style) {
    return property;
  }

  tmp = name.replace(/^\w/, function (l) {
    return l.toUpperCase();
  })

  for (var i = 0; i < prefixes.length; i++) {
    if (prefixes[i] + tmp in el.style) {
      return prefixes[i];
    }
  }

  return property;
}
