"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var geo_coder_1 = require("geo-coder");
var rxjs_1 = require("rxjs");
var js_data_1 = require("js-data");
var GeoLocationService = /** @class */ (function () {
    function GeoLocationService() {
        this.geoCoder = new geo_coder_1.GeoCoder({ provider: 'osm', lang: 'de-DE' });
    }
    GeoLocationService.prototype.getCurrentPosition = function () {
        return new rxjs_1.Observable(function (observer) {
            navigator.geolocation.getCurrentPosition(function (position) {
                observer.next(position);
                observer.complete();
            }, function (error) {
                // console.log('Geolocation service: ' + error.message);
                observer.error(error);
            });
        });
    };
    GeoLocationService.prototype.doReverseLookup = function (lat, lon) {
        if (!(lat && lon)) {
            return Promise.reject('no coordinates - lat:' + lat + ' lon:' + lon);
        }
        return this.geoCoder.reverse(lat, lon).then(function (result) {
            return Promise.resolve(result);
        });
    };
    GeoLocationService.prototype.doLocationSearch = function (selector, value) {
        var inputEl = document.querySelector(selector);
        if (!inputEl || inputEl === undefined || inputEl === null) {
            return js_data_1.utils.reject('element not found');
        }
        var listEl = this.prepareResultList(inputEl);
        return this.doSearch(inputEl, listEl, value);
    };
    GeoLocationService.prototype.prepareResultList = function (inputEl) {
        var listEl;
        if (inputEl.nextSibling && inputEl.nextSibling.className === 'geocode-autocomplete') {
            listEl = inputEl.nextSibling;
        }
        else {
            listEl = document.createElement('ul');
            listEl.className = 'geocode-autocomplete';
            inputEl.parentNode.insertBefore(listEl, inputEl.nextSibling);
        }
        return listEl;
    };
    GeoLocationService.prototype.doSearch = function (inputEl, listEl, value) {
        listEl.style.display = '';
        while (listEl.firstChild) {
            listEl.removeChild(listEl.firstChild);
        }
        var me = this;
        return new Promise(function (resolve, reject) {
            me.geoCoder.geocode(value).then(function (result) {
                result.forEach(function (el) {
                    var liEl = document.createElement('li');
                    liEl.addEventListener('click', function (clickEvent) {
                        var customEvent = new CustomEvent('place_changed', {
                            detail: el,
                            bubbles: true,
                            cancelable: true
                        });
                        inputEl.value = el.formatted;
                        listEl.style.display = 'none';
                        return resolve(customEvent);
                    });
                    liEl.innerHTML = el.formatted;
                    listEl.appendChild(liEl);
                });
            });
        });
    };
    return GeoLocationService;
}());
exports.GeoLocationService = GeoLocationService;
//# sourceMappingURL=geolocation.service.js.map