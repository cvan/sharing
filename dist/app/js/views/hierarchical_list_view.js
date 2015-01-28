define(["exports", "app/js/views/list_view"], function (exports, _appJsViewsListView) {
  "use strict";

  var _extends = function (child, parent) {
    child.prototype = Object.create(parent.prototype, {
      constructor: {
        value: child,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    child.__proto__ = parent;
  };

  var ListView = _appJsViewsListView["default"];
  var HierarchicalListView = (function (ListView) {
    var HierarchicalListView = function HierarchicalListView(options) {
      ListView.call(this, options);
    };

    _extends(HierarchicalListView, ListView);

    HierarchicalListView.prototype.template = function (peer) {
      var string = "";
      if (peer[this.attr] && peer[this.attr].length) {
        string = "\n        <li tabindex=\"0\" class=\"subheading\">\n          <p>" + peer.name + "</p>\n        </li>";

        for (var i = 0; i < peer[this.attr].length; i++) {
          var app = peer[this.attr][i];
          string += ListView.prototype.template.call(this, app);
        }
      }
      return string;
    };

    return HierarchicalListView;
  })(ListView);

  exports["default"] = HierarchicalListView;
});