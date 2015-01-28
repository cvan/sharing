define(["exports", "fxos-mvc/dist/mvc", "app/js/services/device_name_service", "app/js/views/device_name_view"], function (exports, _fxosMvcDistMvc, _appJsServicesDeviceNameService, _appJsViewsDeviceNameView) {
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
  var DeviceNameService = _appJsServicesDeviceNameService["default"];
  var DeviceNameView = _appJsViewsDeviceNameView["default"];
  var DeviceNameController = (function (Controller) {
    var DeviceNameController = function DeviceNameController() {
      this.view = new DeviceNameView();
      // XXX/drs: Shouldn't have to do this?
      this.view.init(this);

      this._updateDeviceNameWrapped = this._updateDeviceName.bind(this);
    };

    _extends(DeviceNameController, Controller);

    DeviceNameController.prototype.main = function () {
      var _this = this;
      this.view.render();
      document.body.appendChild(this.view.el);

      setTimeout(function () {
        _this.view.el.open();
      });
    };

    DeviceNameController.prototype.handleOpened = function () {
      DeviceNameService.instance.addEventListener("devicenamechange", this._updateDeviceNameWrapped, true);
    };

    DeviceNameController.prototype.handleClosed = function () {
      DeviceNameService.instance.removeEventListener("devicenamechange", this._updateDeviceNameWrapped);

      document.body.removeChild(this.view.el);
    };

    DeviceNameController.prototype.handleSubmit = function () {
      DeviceNameService.instance.deviceName = this.view.value;
    };

    DeviceNameController.prototype._updateDeviceName = function (e) {
      this.view.value = e.deviceName;
    };

    return DeviceNameController;
  })(Controller);

  exports["default"] = DeviceNameController;
});