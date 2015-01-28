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

  var HttpClientService = (function (Service) {
    var HttpClientService = function HttpClientService(guard) {
      if (guard !== singletonGuard) {
        console.error("Cannot create singleton class");
        return;
      }

      Service.call(this);
    };

    _extends(HttpClientService, Service);

    HttpClientService.prototype.getPeerUrl = function (address) {
      return "http://" + address + ":8080";
    };

    HttpClientService.prototype.getAppDownloadUrl = function (app) {
      return "http://" + app.address + ":8080/download?app=" + app.manifest.name;
    };

    HttpClientService.prototype.getAppManifestUrl = function (app) {
      return "http://" + app.address + ":8080/manifest?app=" + app.manifest.name;
    };

    _classProps(HttpClientService, {
      instance: {
        get: function () {
          if (!instance) {
            instance = new this(singletonGuard);
          }
          return instance;
        }
      }
    });

    return HttpClientService;
  })(Service);

  exports["default"] = HttpClientService;
});