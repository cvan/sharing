define(["exports", "fxos-mvc/dist/mvc", "app/js/views/main_view", "app/js/controllers/proximity_apps_controller", "app/js/controllers/share_controller", "app/js/controllers/app_controller"], function (exports, _fxosMvcDistMvc, _appJsViewsMainView, _appJsControllersProximityAppsController, _appJsControllersShareController, _appJsControllersAppController) {
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

  var RoutingController = _fxosMvcDistMvc.RoutingController;
  var MainView = _appJsViewsMainView["default"];
  var ProximityAppsController = _appJsControllersProximityAppsController["default"];
  var ShareController = _appJsControllersShareController["default"];
  var AppController = _appJsControllersAppController["default"];
  var MainController = (function (RoutingController) {
    var MainController = function MainController() {
      this.view = new MainView({ el: document.body });

      RoutingController.call(this, {
        "": new ProximityAppsController(),
        share: new ShareController(),
        app: new AppController()
      });
    };

    _extends(MainController, RoutingController);

    MainController.prototype.main = function () {
      this.view.render();
      RoutingController.prototype.main.call(this);
      this.route();
      document.body.classList.remove("loading");
    };

    MainController.prototype.handleBack = function () {
      window.location.hash = "";
    };

    return MainController;
  })(RoutingController);

  exports["default"] = MainController;
});