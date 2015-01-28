define(["exports", "fxos-mvc/dist/mvc", "app/js/services/apps_service", "app/js/services/http_client_service", "app/js/services/p2p_service", "app/js/controllers/progress_dialog_controller", "app/js/views/share_summary_view", "app/js/views/hierarchical_list_view"], function (exports, _fxosMvcDistMvc, _appJsServicesAppsService, _appJsServicesHttpClientService, _appJsServicesP2pService, _appJsControllersProgressDialogController, _appJsViewsShareSummaryView, _appJsViewsHierarchicalListView) {
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
  var AppsService = _appJsServicesAppsService["default"];
  var HttpClientService = _appJsServicesHttpClientService["default"];
  var P2pService = _appJsServicesP2pService["default"];
  var ProgressDialogController = _appJsControllersProgressDialogController["default"];
  var ShareSummaryView = _appJsViewsShareSummaryView["default"];
  var HierarchicalListView = _appJsViewsHierarchicalListView["default"];
  var ProximityAppsController = (function (Controller) {
    var ProximityAppsController = function ProximityAppsController() {
      this.shareSummaryView = new ShareSummaryView();
      this.shareSummaryView.init(this);
      this.proximityAppsView = new HierarchicalListView({
        id: "proximity-apps",
        title: "Available apps",
        type: "download",
        attr: "apps"
      });
      this.proximityAppsView.init(this);
      this.proximityAddonsView = new HierarchicalListView({
        id: "proximity-addons",
        title: "Available addons",
        type: "download",
        attr: "addons"
      });
      this.proximityAddonsView.init(this);
      this.proximityThemesView = new HierarchicalListView({
        id: "proximity-themes",
        title: "Available themes",
        type: "download",
        attr: "themes"
      });
      this.proximityThemesView.init(this);

      this.progressDialogController = new ProgressDialogController();

      P2pService.instance.addEventListener("proximity", this.proximityChanged.bind(this));

      this._broadcastChangedWrapped = this.broadcastChanged.bind(this);
    };

    _extends(ProximityAppsController, Controller);

    ProximityAppsController.prototype.main = function () {
      this.shareSummaryView.render();
      document.body.appendChild(this.shareSummaryView.el);

      this.proximityChanged();
      document.body.appendChild(this.proximityAppsView.el);
      document.body.appendChild(this.proximityAddonsView.el);
      document.body.appendChild(this.proximityThemesView.el);

      P2pService.instance.addEventListener("broadcast", this._broadcastChangedWrapped, true);
    };

    ProximityAppsController.prototype.teardown = function () {
      document.body.removeChild(this.shareSummaryView.el);
      document.body.removeChild(this.proximityAppsView.el);
      document.body.removeChild(this.proximityAddonsView.el);
      document.body.removeChild(this.proximityThemesView.el);

      P2pService.instance.removeEventListener("broadcast", this._broadcastChangedWrapped);
    };

    ProximityAppsController.prototype.broadcastChanged = function () {
      this.shareSummaryView.displayBroadcast(P2pService.instance.broadcast);
    };

    ProximityAppsController.prototype.proximityChanged = function () {
      var _this = this;
      var proximityApps = P2pService.instance.getProximityApps();
      AppsService.instance.stripInstalledAppsFromProximityApps(proximityApps).then(function (apps) {
        _this.proximityAppsView.render(AppsService.instance.flatten(apps, "apps"));
      });
      var proximityAddons = P2pService.instance.getProximityAddons();
      AppsService.instance.stripInstalledAppsFromProximityApps(proximityAddons).then(function (addons) {
        _this.proximityAddonsView.render(AppsService.instance.flatten(addons, "addons"));
      });
      var proximityThemes = P2pService.instance.getProximityThemes();
      AppsService.instance.stripInstalledAppsFromProximityApps(proximityThemes).then(function (themes) {
        _this.proximityThemesView.render(AppsService.instance.flatten(themes, "themes"));
      });
    };

    ProximityAppsController.prototype.handleControlClick = function (e) {
      var url = e.target.dataset.url;
      this.progressDialogController.main();
      HttpClientService.instance.downloadApp(url).then(this.progressDialogController.success.bind(this.progressDialogController), this.progressDialogController.error.bind(this.progressDialogController));
    };

    ProximityAppsController.prototype.handleDescriptionClick = function (e) {
      // In case the tap hit a child node of the <div> element with the data-app
      // attribute set.
      var appName = e.target.dataset.app || e.target.parentNode.dataset.app;
      window.location.hash = "app";
      window.history.pushState(appName, appName);
    };

    ProximityAppsController.prototype.openSharePanel = function () {
      window.location.hash = "share";
    };

    return ProximityAppsController;
  })(Controller);

  exports["default"] = ProximityAppsController;
});