define(["exports", "fxos-mvc/dist/mvc", "gaia-header/dist/gaia-header", "gaia-icons/gaia-icons"], function (exports, _fxosMvcDistMvc, _gaiaHeaderDistGaiaHeader, _gaiaIconsGaiaIcons) {
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

  var View = _fxosMvcDistMvc.View;
  var MainView = (function (View) {
    var MainView = function MainView() {
      View.apply(this, arguments);
    };

    _extends(MainView, View);

    MainView.prototype.template = function () {
      var string = "\n      <gaia-header id=\"sharing-header\" action=\"back\">\n        <h1>P2P Sharing</h1>\n      </gaia-header>";

      return string;
    };

    MainView.prototype.render = function () {
      View.prototype.render.call(this);

      var backButton = document.getElementById("sharing-header");
      backButton.addEventListener("action", this._handleAction.bind(this));
    };

    MainView.prototype._handleAction = function (e) {
      if (e.detail.type !== "back") {
        return;
      }

      this.controller.handleBack();
    };

    return MainView;
  })(View);

  exports["default"] = MainView;
});