"use strict";

var _async = require("async");

var _async2 = _interopRequireDefault(_async);

var _shelljs = require("shelljs");

var _shelljs2 = _interopRequireDefault(_shelljs);

var _readline = require("readline");

var _readline2 = _interopRequireDefault(_readline);

var _randomstring = require("randomstring");

var _randomstring2 = _interopRequireDefault(_randomstring);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Backup = function Backup() {
    var _this = this;

    _classCallCheck(this, Backup);

    // VARIABLES
    var self = this;

    // FUNCTIONS
    this.ask = function (question, cb) {
        var self = _this;
        var rl = _readline2.default.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl.question(question, function (answer) {
            rl.close();
            cb(null, answer);
        });
    };

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

    _async2.default.series([function (cb) {
        _this.ask("Type in the size (MB) of each block: ", function (err, res) {
            cb(null, res);
        });
    }, function (cb) {
        _this.ask("Type in your password: ", function (err, res) {
            cb(null, res);
        });
    }, function (cb) {
        _this.ask("How would you like to name the archive: ", function (err, res) {
            cb(null, res);
        });
    }, function (cb) {
        _this.ask("Type in the name of the folder you want to split and compress: ", function (err, res) {
            cb(null, res);
        });
    }], function (err, res) {
        var size = res[0] * 1024;
        var password = res[1];
        var archive_name = res[2];
        var folder_name = res[3];
        console.log("<==============================>\nThe size of each block will be " + size + "KB\nYou password is " + password + "\nThe name of the archive is " + archive_name + "\nThe file you want to compress and split is " + folder_name + "\n            ");

        _this.ask('Please press enter to continue', function (err, res) {
            _shelljs2.default.exec("rar a -v" + size + "k -df -hp" + password + " -m0 " + archive_name + ".rar " + folder_name, function () {
                console.log('done');
            });
        });
    });
};

var backup = new Backup();
// backup.encode('doc.ods.zip','immagine.png');
// backup.decode('immagine.png', 'doc2.ods.zip', function() {
//     console.log('done');
// });
