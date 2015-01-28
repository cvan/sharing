define(["exports", "fxos-mvc/dist/mvc", "app/js/services/http_service", "gaia-button/gaia-button"], function (exports, _fxosMvcDistMvc, _appJsServicesHttpService, _gaiaButtonGaiaButton) {
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
  var HttpService = _appJsServicesHttpService["default"];
  var AppView = (function (View) {
    var AppView = function AppView() {
      this.el = document.createElement("div");
      this.el.id = "appView";
    };

    _extends(AppView, View);

    AppView.prototype.template = function () {
      var string = "\n      <h1 id=\"appName\"></h1>\n      <h3 id=\"appOwner\"></h3>\n      <p id=\"appDescription\"></p>\n      <gaia-button id=\"appDownload\">Download</gaia-button>\n    ";
      return string;
    };

    AppView.prototype.render = function (app) {
      var _this = this;
      View.prototype.render.call(this);

      setTimeout(function () {
        var appNameEl = document.getElementById("appName");
        var appOwnerEl = document.getElementById("appOwner");
        var appDescriptionEl = document.getElementById("appDescription");
        var downloadButtonEl = document.getElementById("appDownload");

        appNameEl.textContent = app.manifest.name;
        appOwnerEl.textContent = "Provided by " + app.peerName;
        appDescriptionEl.textContent = app.manifest.description;
        downloadButtonEl.dataset.url = HttpService.instance.getAppDownloadUrl(app);
        downloadButtonEl.addEventListener("click", _this._handleClick.bind(_this));
      });
    };

    AppView.prototype._handleClick = function (e) {
      this.controller._handleClick(e);
    };

    return AppView;
  })(View);

  exports["default"] = AppView;
});