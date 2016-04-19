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

        this.split_and_compress = (size, password, cb) => {

            child_process.exec(`7z a -v${size}m -mx=${this.compression} -p${password} ${this.output}/${this.prefix}.7z ${this.input}`, (err, stdout, stderr) => {
                if (err) throw err;
                cb();
            });

        }


        this.to_images = (cb) => {
            fs.readdir(`${this.output}/`, (err, files) => {

                async.each(files, (file, callback) => {
                    let input = `${__dirname}/${this.output}/${file}`;
                    let output = `${input}.png`;
                    this.encode(input, output, () => {
                        child_process.exec(`rm ${input}`, (code,stdin,stdout) => {
                            callback(null, null);
                        });
                    });

                }, (err, res) => {
                    if (err) console.log(err);
                    cb(null, null);
                });
            });
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
backup.split_and_compress(10, "ciccio", () => {
    backup.to_images(() => {
        console.log('done');
    });

});