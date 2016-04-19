import async from "async"
import readline from "readline"
import randomstring from "randomstring"
import fs from "fs"
import child_process from "child_process"

class Backup {
    constructor(input, output, prefix) {

        // VARIABLES
        this.input = input;
        this.output = output;
        this.prefix = prefix;
        this.compression = 0;



        // FUNCTIONS
        this.ask = (question, cb) => {
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });
            rl.question(question, (answer) => {
                rl.close();
                cb(null, answer);
            });
        }

        this.encode = (input, output, cb) => {
            let command = `node node_modules/web-bundle/tool/wb.js encode ${input} -o ${output}`
            child_process.exec(command, (err, stdout, stderr) => {
                if (err) throw err;
                cb();
            });
        }

        this.decode = (input, output, cb) => {
            child_process.exec(`node node_modules/web-bundle/tool/wb.js decode ${input} -o ${output} `, (err, stdout, stderr) => {
                if (err) throw err;
                cb();
            });
        }

        // Takes the file contained inside the global var input
        // split them into file of <size> MB and compress them
        // if you set this.compression=9 it will be ultra compressed
        // if you this.compression=0 means no compression at all
        this.split_and_compress = (size, password, cb) => {

            child_process.exec(`7z a -v${size}m -mx=${this.compression} -p${password} ${this.output}/${this.prefix}.7z ${this.input}`, (err, stdout, stderr) => {
                if (err) throw err;
                cb();
            });

        }


        // Takes all the files inside the global var output
        // iterates each file inside the encode function
        // once a file is encoded it deletes the origin 7zip file
        this.to_images = (cb) => {
            fs.readdir(`${this.output}/`, (err, files) => {

                async.each(files, (file, callback) => {
                    let input = `${__dirname}/${this.output}/${file}`;
                    let output = `${input}.png`;
                    this.encode(input, output, () => {
                        child_process.exec(`rm ${input}`, (code, stdin, stdout) => {
                            callback(null, null);
                        });
                    });

                }, (err, res) => {
                    if (err) throw err;
                    cb(null, null);
                });
            });
        }

        // Sames as to_image but reversed
        this.to_archives = (input, output, cb) => {
            this.check_dir(output, () => {
                fs.readdir(input, (err, files) => {
                    if (err) throw err;
                    async.each(files, (file, callback) => {
                        let inp = `${__dirname}/${input}/${file}`;
                        let out = `${__dirname}/${output}/${file}`.split('.png')[0];
                        this.decode(inp, out, () => {
                            callback(null);
                        });
                    }, (err, res) => {
                        if (err) throw err;
                        cb();
                    });

                });
            });
        }

        // Check if a dir exists, if not it creates it
        this.check_dir = (dirname, cb) => {
            if (!fs.existsSync(dirname)) {
                fs.mkdir(dirname, () => {
                    cb();
                });
            }
        }

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
    }
}

let backup = new Backup('to_backup', 'new', "archived");
// backup.split_and_compress(10, "ciccio", () => {
//     backup.to_images(() => {
//         console.log('done');
//     });

// });
backup.to_archives('new', 'extracted', () => {
    console.log('extracted');
});