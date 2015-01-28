define(["exports", "fxos-mvc/dist/mvc", "app/js/services/p2p_service", "app/js/services/apps_service", "app/js/services/device_name_service", "app/js/views/share_settings_view", "app/js/views/list_view", "app/js/controllers/device_name_controller"], function (exports, _fxosMvcDistMvc, _appJsServicesP2pService, _appJsServicesAppsService, _appJsServicesDeviceNameService, _appJsViewsShareSettingsView, _appJsViewsListView, _appJsControllersDeviceNameController) {
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
  var P2pService = _appJsServicesP2pService["default"];
  var AppsService = _appJsServicesAppsService["default"];
  var DeviceNameService = _appJsServicesDeviceNameService["default"];
  var ShareSettingsView = _appJsViewsShareSettingsView["default"];
  var ListView = _appJsViewsListView["default"];
  var DeviceNameController = _appJsControllersDeviceNameController["default"];
  var ShareController = (function (Controller) {
    var ShareController = function ShareController() {
      this.deviceNameController = new DeviceNameController();

      this.shareSettingsView = new ShareSettingsView();
      this.shareSettingsView.init(this);
      this.sharedAppsView = new ListView({
        id: "shared-apps",
        title: "My apps",
        type: "toggle",
        disabled: true
      });
      this.sharedAppsView.init(this);
      this.sharedAddonsView = new ListView({
        id: "shared-addons",
        title: "My addons",
        type: "toggle",
        disabled: true
      });
      this.sharedAddonsView.init(this);
      this.sharedThemesView = new ListView({
        id: "shared-themes",
        title: "My themes",
        type: "toggle",
        disabled: true
      });
      this.sharedThemesView.init(this);

      this._broadcastChangedWrapped = this.broadcastChanged.bind(this);
      this._deviceNameChangedWrapped = this.deviceNameChanged.bind(this);
    };

    _extends(ShareController, Controller);

    ShareController.prototype.main = function () {
      var _this = this;
      AppsService.instance.getInstalledApps().then(function (apps) {
        _this.shareSettingsView.render();
        document.body.appendChild(_this.shareSettingsView.el);

        _this.sharedAppsView.render(apps);
        document.body.appendChild(_this.sharedAppsView.el);

        AppsService.instance.getInstalledAddons().then(function (addons) {
          _this.sharedAddonsView.render(addons);
          document.body.appendChild(_this.sharedAddonsView.el);

          AppsService.instance.getInstalledThemes().then(function (themes) {
            _this.sharedThemesView.render(themes);
            document.body.appendChild(_this.sharedThemesView.el);
          });
        });
      });

      P2pService.instance.addEventListener("broadcast", this._broadcastChangedWrapped, true);

      DeviceNameService.instance.addEventListener("devicenamechange", this._deviceNameChangedWrapped, true);
    };

    ShareController.prototype.teardown = function () {
      document.body.removeChild(this.shareSettingsView.el);
      document.body.removeChild(this.sharedAppsView.el);
      document.body.removeChild(this.sharedAddonsView.el);
      document.body.removeChild(this.sharedThemesView.el);

      P2pService.instance.removeEventListener("broadcast", this._broadcastChangedWrapped);

      DeviceNameService.instance.removeEventListener("devicenamechange", this._deviceNameChangedWrapped);
    };

    ShareController.prototype.toggleBroadcasting = function (toggle) {
      P2pService.instance.broadcast = toggle;
    };

    ShareController.prototype.broadcastChanged = function () {
      var broadcast = P2pService.instance.broadcast;
      this.shareSettingsView.displayBroadcast(broadcast);
      this.sharedAppsView.toggle(!broadcast);
      this.sharedAddonsView.toggle(!broadcast);
      this.sharedThemesView.toggle(!broadcast);
    };

    ShareController.prototype.deviceNameChanged = function (e) {
      this.shareSettingsView.deviceName = e.deviceName;
    };

    ShareController.prototype.handleRenameDevice = function () {
      this.deviceNameController.main();
    };

    return ShareController;
  })(Controller);

  exports["default"] = ShareController;
});