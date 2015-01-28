define(["exports", "fxos-mvc/dist/mvc", "app/js/services/http_service", "gaia-list/gaia-list", "gaia-checkbox/gaia-checkbox", "gaia-sub-header/gaia-sub-header", "gaia-loading/gaia-loading"], function (exports, _fxosMvcDistMvc, _appJsServicesHttpService, _gaiaListGaiaList, _gaiaCheckboxGaiaCheckbox, _gaiaSubHeaderGaiaSubHeader, _gaiaLoadingGaiaLoading) {
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
  var ListView = (function (View) {
    var ListView = function ListView(options) {
      this.el = document.createElement("gaia-list");
      this.el.id = options.id;
      this.el.classList.add("app-list");
      if (options.disabled) {
        this.el.setAttribute("disabled", true);
      }

      this.title = options.title;
      this.type = options.type;
      this.attr = options.attr;
    };

    _extends(ListView, View);

    ListView.prototype.layout = function (template) {
      var loading = this.controller._everRendered ? "" : "<gaia-loading></gaia-loading>";
      var string = "\n      <gaia-sub-header>" + this.title + "</gaia-sub-header>\n      " + loading + "\n      " + template;
      return string;
    };

    ListView.prototype.template = function (app) {
      // Hack! Write this to the controller so that all categories lose the
      // loading indicator when we get any networked apps.
      this.controller._everRendered = true;

      var string = "\n      <li tabindex=\"0\">\n        <div class=\"description\" data-app=\"" + app.manifest.name + "\">\n          <h3>" + app.manifest.name + "</h3>\n          <h4>" + (app.owner || app.manifest.description) + "</h4>\n        </div>\n        " + this._control(app) + "\n      </li>";
      return string;
    };

    ListView.prototype.render = function (params) {
      var _this = this;
      View.prototype.render.call(this, params);

      setTimeout(function () {
        _this._controls = _this.$$(".control");
        for (var i = 0; i < _this._controls.length; i++) {
          var control = _this._controls[i];
          control.addEventListener("click", _this._handleControlClick.bind(_this));
        }

        // Bind click listeners to the description region if displaying a download
        // list.
        if (_this.type === "download") {
          var descriptions = _this.$$(".description");
          for (i = 0; i < descriptions.length; i++) {
            var description = descriptions[i];
            description.addEventListener("click", _this._handleDescriptionClick.bind(_this));
          }
        }
      });
    };

    ListView.prototype.toggle = function (enable) {
      if (enable) {
        this.el.setAttribute("disabled", "");
      } else {
        this.el.removeAttribute("disabled");
      }
    };

    ListView.prototype._control = function (app) {
      if (this.type === "toggle") {
        return "<gaia-checkbox class=\"control\"></gaia-checkbox>";
      } else if (this.type === "download") {
        var url = HttpService.instance.getAppDownloadUrl(app);
        var string = "\n        <a data-url=\"" + url + "\" class=\"control\">\n          Download\n        </a>";
        return string;
      }
    };

    ListView.prototype._handleControlClick = function (e) {
      this.controller.handleControlClick(e);
    };

    ListView.prototype._handleDescriptionClick = function (e) {
      this.controller.handleDescriptionClick(e);
    };

    return ListView;
  })(View);

  exports["default"] = ListView;
});