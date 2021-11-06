"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var AppState;
(function (AppState) {
    AppState[AppState["Starting"] = 1] = "Starting";
    AppState[AppState["Ready"] = 5] = "Ready";
    AppState[AppState["Failed"] = 10] = "Failed";
})(AppState = exports.AppState || (exports.AppState = {}));
var AppOnlineState;
(function (AppOnlineState) {
    AppOnlineState[AppOnlineState["Online"] = 1] = "Online";
    AppOnlineState[AppOnlineState["Offline"] = 2] = "Offline";
})(AppOnlineState = exports.AppOnlineState || (exports.AppOnlineState = {}));
var BrowserOnlineState;
(function (BrowserOnlineState) {
    BrowserOnlineState[BrowserOnlineState["Online"] = 1] = "Online";
    BrowserOnlineState[BrowserOnlineState["Offline"] = 2] = "Offline";
})(BrowserOnlineState = exports.BrowserOnlineState || (exports.BrowserOnlineState = {}));
var GenericAppService = /** @class */ (function () {
    function GenericAppService() {
        this.appState = AppState.Starting;
        this.appStateObservable = new rxjs_1.ReplaySubject();
        this.appOnlineStateObservable = new rxjs_1.BehaviorSubject(AppOnlineState.Online);
        this.browserOnlineStateObservable = new rxjs_1.BehaviorSubject(BrowserOnlineState.Online);
        this.appStateObservable.next(this.appState);
        this.initBrowserOnlineStateLoader();
    }
    GenericAppService.prototype.getAppState = function () {
        return this.appStateObservable;
    };
    GenericAppService.prototype.getAppOnlineState = function () {
        return this.appOnlineStateObservable;
    };
    GenericAppService.prototype.getBrowserOnlineState = function () {
        return this.browserOnlineStateObservable;
    };
    GenericAppService.prototype.setAppState = function (appState) {
        this.appState = appState;
        this.appStateObservable.next(appState);
    };
    GenericAppService.prototype.initBrowserOnlineStateLoader = function () {
        var me = this;
        window.addEventListener('online', function () {
            me.browserOnlineStateObservable.next(BrowserOnlineState.Online);
        });
        window.addEventListener('offline', function () {
            me.browserOnlineStateObservable.next(BrowserOnlineState.Offline);
        });
        if (navigator.onLine !== undefined && navigator.onLine === false) {
            me.browserOnlineStateObservable.next(BrowserOnlineState.Offline);
        }
    };
    GenericAppService.ERROR_APP_NOT_INITIALIZED = 'ERROR_APP_NOT_INITIALIZED';
    return GenericAppService;
}());
exports.GenericAppService = GenericAppService;
//# sourceMappingURL=generic-app.service.js.map