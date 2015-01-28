define(["exports", "fxos-mvc/dist/mvc", "app/js/views/app_view", "app/js/controllers/progress_dialog_controller", "app/js/services/http_client_service", "app/js/services/p2p_service"], function (exports, _fxosMvcDistMvc, _appJsViewsAppView, _appJsControllersProgressDialogController, _appJsServicesHttpClientService, _appJsServicesP2pService) {
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

  var Controller = _fxosMvcDistMvc.Controller;
  var AppView = _appJsViewsAppView["default"];
  var ProgressDialogController = _appJsControllersProgressDialogController["default"];
  var HttpClientService = _appJsServicesHttpClientService["default"];
  var P2pService = _appJsServicesP2pService["default"];
  var AppController = (function (Controller) {
    var AppController = function AppController() {
      this.view = new AppView();
      this.view.init(this);

      this.progressDialogController = new ProgressDialogController();
    };

    _extends(AppController, Controller);

    AppController.prototype.main = function () {
      var appName = window.history.state;

      var app = P2pService.instance.getProximityApp(appName);
      this.view.render(app);
      document.body.appendChild(this.view.el);
    };

    AppController.prototype.teardown = function () {
      document.body.removeChild(this.view.el);
    };

    AppController.prototype._handleClick = function (e) {
      var url = e.target.dataset.url;
      this.progressDialogController.main();
      HttpClientService.instance.downloadApp(url).then(this.progressDialogController.success.bind(this.progressDialogController), this.progressDialogController.error.bind(this.progressDialogController));
    };

    return AppController;
  })(Controller);

  exports["default"] = AppController;
});