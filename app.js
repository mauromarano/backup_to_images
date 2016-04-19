"use strict";

var _async = require("async");

var _async2 = _interopRequireDefault(_async);

var _shelljs = require("shelljs");

var _shelljs2 = _interopRequireDefault(_shelljs);

var _readline = require("readline");

var _readline2 = _interopRequireDefault(_readline);

var _randomstring = require("randomstring");

var _randomstring2 = _interopRequireDefault(_randomstring);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

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

    this.split_and_compress = function (size, password, folder_name, archive_name, cb) {
        _shelljs2.default.exec("7z a -v" + size + "m -mx=0 -p" + password + " " + archive_name + ".7z " + folder_name, function () {
            cb();
        });
    };

    // async.series([
    //     (cb) => {
    //         this.ask("Type in the size (MB) of each block: ", (err, res) => {
    //             cb(null, res);
    //         });
    //     }, (cb) => {
    //         this.ask("Type in your password: ", (err, res) => {
    //             cb(null, res);
    //         });
    //     }, (cb) => {
    //         this.ask("How would you like to name the archive: ", (err, res) => {
    //             cb(null, res);
    //         });
    //     }, (cb) => {
    //         this.ask("Type in the name of the folder you want to split and compress: ", (err, res) => {
    //             cb(null, res);
    //         });
    //     }

    // ], (err, res)=> {
    //     let size = res[0]*1024;
    //     let password = res[1];
    //     let archive_name = res[2];
    //     let folder_name = res[3];
    //     console.log(`<==============================>\nThe size of each block will be ${size}KB\nYou password is ${password}\nThe name of the archive is ${archive_name}\nThe file you want to compress and split is ${folder_name}
    //     `);

    //     this.ask('Please press enter to continue',(err,res)=>{
    //         shell.exec(`rar a -v${size}k -df -hp${password} -m0 ${archive_name}.rar ${folder_name}`,()=>{
    //             console.log('done');
    //         });
    //     });
    // });
};

var backup = new Backup();
backup.split_and_compress(10, "ciccio", "to_backup", "new/archived", function () {
    _fs2.default.readdir('new/', function (err, files) {
        _async2.default.each(files, function (file, cb) {
            var input = __dirname + "/new/" + file;
            var output = input + ".png";
            backup.encode(input, output, function () {
                cb();
            });
        }, function (err, res) {});
    });
});
// backup.encode('doc.ods.zip','immagine.png');
// backup.decode('immagine.png', 'doc2.ods.zip', function() {
//     console.log('done');
// });
