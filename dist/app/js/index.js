define(["exports", "app/js/globals", "app/js/controllers/main_controller"], function (exports, _appJsGlobals, _appJsControllersMainController) {
  "use strict";

  var MainController = _appJsControllersMainController["default"];


  var mainController = new MainController();
  mainController.main();
});