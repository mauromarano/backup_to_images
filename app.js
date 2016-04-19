"use strict";

var _async = require("async");

var _async2 = _interopRequireDefault(_async);

var _readline = require("readline");

var _readline2 = _interopRequireDefault(_readline);

var _randomstring = require("randomstring");

var _randomstring2 = _interopRequireDefault(_randomstring);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _child_process = require("child_process");

var _child_process2 = _interopRequireDefault(_child_process);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Backup = function Backup(input, output, prefix) {
    var _this = this;

    _classCallCheck(this, Backup);

    // VARIABLES
    this.input = input;
    this.output = output;
    this.prefix = prefix;
    this.compression = 0;

    // FUNCTIONS
    this.ask = function (question, cb) {
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
        var command = "node node_modules/web-bundle/tool/wb.js encode " + input + " -o " + output;
        _child_process2.default.exec(command, function (err, stdout, stderr) {
            if (err) throw err;
            cb();
        });
    };

    this.decode = function (input, output, cb) {
        _child_process2.default.exec("node node_modules/web-bundle/tool/wb.js decode " + input + " -o " + output + " ", function (err, stdout, stderr) {
            if (err) throw err;
            cb();
        });
    };

    this.split_and_compress = function (size, password, cb) {

        _child_process2.default.exec("7z a -v" + size + "m -mx=" + _this.compression + " -p" + password + " " + _this.output + "/" + _this.prefix + ".7z " + _this.input, function (err, stdout, stderr) {
            if (err) throw err;
            cb();
        });
    };

    this.to_images = function (cb) {
        _fs2.default.readdir(_this.output + "/", function (err, files) {

            _async2.default.each(files, function (file, callback) {
                var input = __dirname + "/" + _this.output + "/" + file;
                var output = input + ".png";
                _this.encode(input, output, function () {
                    _child_process2.default.exec("rm " + input, function (code, stdin, stdout) {
                        callback(null, null);
                    });
                });
            }, function (err, res) {
                if (err) throw err;
                cb(null, null);
            });
        });
    };

    this.to_archives = function (input, output, cb) {
        _this.check_dir(output, function () {
            _fs2.default.readdir(input, function (err, files) {
                if (err) throw err;
                _async2.default.each(files, function (file, callback) {
                    var inp = __dirname + "/" + input + "/" + file;
                    var out = (__dirname + "/" + output + "/" + file).split('.png')[0];
                    _this.decode(inp, out, function () {
                        callback(null);
                    });
                }, function (err, res) {
                    if (err) throw err;
                    cb();
                });
            });
        });
    };

    this.check_dir = function (dirname, cb) {
        if (!_fs2.default.existsSync(dirname)) {
            _fs2.default.mkdir(dirname, function () {
                cb();
            });
        }
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

var backup = new Backup('to_backup', 'new', "archived");
// backup.split_and_compress(10, "ciccio", () => {
//     backup.to_images(() => {
//         console.log('done');
//     });

// });
backup.to_archives('new', 'extracted', function () {
    console.log('extracted');
});
