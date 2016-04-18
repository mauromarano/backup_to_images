"use strict";

var _webBundle = require("web-bundle");

var _webBundle2 = _interopRequireDefault(_webBundle);

var _async = require("async");

var _async2 = _interopRequireDefault(_async);

var _shelljs = require("shelljs");

var _shelljs2 = _interopRequireDefault(_shelljs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Backup = function Backup() {
    _classCallCheck(this, Backup);

    this.encode = function (input, output, cb) {
        _shelljs2.default.exec("node node_modules/web-bundle/tool/wb.js encode " + input + " -o " + output + " "), function () {
            cb();
        };
    };

    this.decode = function (input, output, cb) {
        _shelljs2.default.exec("node node_modules/web-bundle/tool/wb.js decode " + input + " -o " + output + " "), function () {
            cb();
        };
    };
};

var backup = new Backup();
backup.encode('doc.ods.zip', 'immagine.png');
backup.decode('immagine.png', 'doc2.ods.zip', function () {
    console.log('done');
});
