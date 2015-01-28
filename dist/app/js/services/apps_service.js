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

  var AppsService = (function (Service) {
    var AppsService = function AppsService(guard) {
      if (guard !== singletonGuard) {
        console.error("Cannot create singleton class");
        return;
      }

      Service.call(this);
    };

    _extends(AppsService, Service);

    AppsService.prototype.getInstalledApps = function () {
      var excludedApps = ["Marketplace", "In-app Payment Tester", "Membuster", "Share Receiver", "Template", "Test Agent", "Test receiver#1", "Test Receiver#2", "Test receiver (inline)", "Test Shared CSS", "UI tests - Privileged App", "Sheet app 1", "Sheet app 2", "Sheet app 3"];

      return this._getAppsSubset(function (app) {
        return app.manifest.role !== "system" && app.manifest.role !== "addon" && app.manifest.role !== "theme" && app.manifest.type !== "certified" && excludedApps.indexOf(app.manifest.name) === -1;
      });
    };

    AppsService.prototype.getInstalledAddons = function () {
      return this._getAppsSubset(function (app) {
        return app.manifest.role === "addon";
      });
    };

    AppsService.prototype.getInstalledThemes = function () {
      var excludedThemes = ["Default Theme", "Test theme 1", "Test theme 2", "Broken theme 3"];

      return this._getAppsSubset(function (app) {
        return app.manifest.role === "theme" && excludedThemes.indexOf(app.manifest.name) === -1;
      });
    };

    AppsService.prototype.getInstalledAppsAndAddons = function () {
      return this._getAppsSubset(function (app) {
        return true;
      });
    };

    AppsService.prototype.installAppBlob = function (appData) {
      return new Promise(function (resolve, reject) {
        var sdcard = navigator.getDeviceStorage("sdcard");
        if (!sdcard) {
          console.error("No SD card!");
          reject({ name: "No SD card!" });
          return;
        }

        var fileName = "temp-app.zip";
        var delReq = sdcard["delete"](fileName);
        delReq.onsuccess = delReq.onerror = function () {
          var req = sdcard.addNamed(new Blob([appData], { type: "application/openwebapp+zip" }), fileName);

          req.onsuccess = function () {
            var getReq = sdcard.get(fileName);

            getReq.onsuccess = function () {
              var file = getReq.result;
              navigator.mozApps.mgmt["import"](file).then(function (app) {
                resolve(app);
              }, function (e) {
                console.error("error installing app", e);
                reject(e);
              });
            };

            getReq.onerror = function () {
              console.error("error getting file", getReq.error.name);
              reject(getReq.error);
            };
          };

          req.onerror = function (e) {
            console.error("error saving blob", e);
            reject(e);
          };
        };
      });
    };

    AppsService.prototype.getInstalledApp = function (appName) {
      var _this = this;
      return new Promise(function (resolve, reject) {
        _this.getInstalledAppsAndAddons().then(function (apps) {
          for (var i in apps) {
            var app = apps[i];
            if (app.manifest.name === appName) {
              resolve(app);
              return;
            }
          }
          console.error("No app found by name", appName);
          reject();
          return;
        }, reject);
      });
    };

    AppsService.prototype.stripInstalledAppsFromProximityApps = function (peers) {
      var _this2 = this;
      return new Promise(function (resolve, reject) {
        _this2.getInstalledAppsAndAddons().then(function (installedApps) {
          for (var peerIndex in peers) {
            var peer = peers[peerIndex];

            ["apps", "addons", "themes"].forEach(function (appType) {
              if (!peer[appType]) {
                return;
              }

              for (var i = peer[appType].length - 1; i >= 0; i--) {
                var app = peer[appType][i];
                var matchingApp = installedApps.find(function (installedApp) {
                  return installedApp.manifest.name === app.manifest.name;
                });

                if (matchingApp) {
                  peer[appType].splice(i, 1);
                }
              }
            });
          }
          resolve(peers);
        });
      });
    };

    AppsService.prototype.pretty = function (apps) {
      var prettyApps = [];
      apps.forEach(function (app) {
        prettyApps.push({
          type: app.type,
          manifest: {
            name: app.manifest.name,
            description: app.manifest.description
          }
        });
      });
      return prettyApps;
    };

    AppsService.prototype.flatten = function (addresses, attr) {
      for (var address in addresses) {
        var apps = addresses[address][attr];
        var peerName = addresses[address].name;
        for (var i = 0; i < apps.length; i++) {
          var app = apps[i];
          app.address = address;
          app.peerName = peerName;
        }
      }
      return addresses;
    };

    AppsService.prototype._getAppsSubset = function (subsetCallback) {
      return new Promise(function (resolve, reject) {
        var installedApps = [];

        var req = navigator.mozApps.mgmt.getAll();

        req.onsuccess = function () {
          var result = req.result;

          // Strip out apps that we shouldn't share.
          for (var index in result) {
            var app = result[index];
            if (subsetCallback(app)) {
              installedApps.push(app);
            }
          }

          resolve(installedApps);
        };

        req.onerror = function (e) {
          console.error("error fetching installed apps: ", e);
          reject(e);
        };
      });
    };

    _classProps(AppsService, {
      instance: {
        get: function () {
          if (!instance) {
            instance = new this(singletonGuard);
          }
          return instance;
        }
      }
    });

    return AppsService;
  })(Service);

  exports["default"] = AppsService;
});