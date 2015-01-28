define(["exports", "fxos-mvc/dist/mvc"], function (exports, _fxosMvcDistMvc) {
  "use strict";

  var _classProps = function (child, staticProps, instanceProps) {
    if (staticProps) Object.defineProperties(child, staticProps);
    if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
  };

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

  var Service = _fxosMvcDistMvc.Service;


  var singletonGuard = {};
  var instance;

  var DeviceNameService = (function (Service) {
    var DeviceNameService = function DeviceNameService(guard) {
      var _this = this;
      if (guard !== singletonGuard) {
        console.error("Cannot create singleton class");
        return;
      }

      Service.call(this);

      navigator.mozSettings.addObserver("lightsaber.device_name", function (e) {
        _this._dispatchEvent("devicenamechange", { deviceName: e.settingValue });
      });

      var request = navigator.mozSettings.createLock().get("lightsaber.device_name");

      request.onsuccess = function () {
        var result = request.result["lightsaber.device_name"];

        if (result) {
          _this.deviceName = result;
        } else {
          _this._setDeviceNameToDefault();
        }
      };

      request.onerror = function (e) {
        console.error("error getting lightsaber.device_name: " + e);
      };
    };

    _extends(DeviceNameService, Service);

    DeviceNameService.prototype._setDeviceNameToDefault = function () {
      var _this2 = this;
      var request = navigator.mozSettings.createLock().get("deviceinfo.product_model");

      request.onsuccess = function () {
        _this2.deviceName = request.result["deviceinfo.product_model"];
      };

      request.onerror = function (e) {
        console.error("error getting deviceinfo.product_model", e);
      };
    };

    _classProps(DeviceNameService, {
      instance: {
        get: function () {
          if (!instance) {
            instance = new this(singletonGuard);
          }
          return instance;
        }
      }
    }, {
      deviceName: {
        set: function (deviceName) {
          var _this3 = this;
          var request = navigator.mozSettings.createLock().set({
            "lightsaber.device_name": deviceName });

          request.onsuccess = function () {
            _this3._dispatchEvent("devicenamechange", { deviceName: deviceName });
          };

          request.onerror = function (e) {
            console.error("error setting lightsaber.device_name: " + e);
          };
        },
        get: function () {
          console.error("DONT USE ME LOL!");
        }
      }
    });

    return DeviceNameService;
  })(Service);

  exports["default"] = DeviceNameService;
});