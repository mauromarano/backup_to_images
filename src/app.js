import async from "async"
import shell from "shelljs"
import readline from "readline"
import randomstring from "randomstring"

class Backup {
    constructor() {

        // VARIABLES
        const self = this;



        // FUNCTIONS
        this.ask = (question, cb) => {
            const self = this;
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
            shell.exec(`node node_modules/web-bundle/tool/wb.js encode ${input} -o ${output} `),
            function() {
                cb();
            };
        }

        this.decode = (input, output, cb) => {
            shell.exec(`node node_modules/web-bundle/tool/wb.js decode ${input} -o ${output} `),
            function() {
                cb();
            };
        }

        async.series([
            (cb) => {
                this.ask("Type in the size (MB) of each block: ", (err, res) => {
                    cb(null, res);
                });
            }, (cb) => {
                this.ask("Type in your password: ", (err, res) => {
                    cb(null, res);
                });
            }, (cb) => {
                this.ask("How would you like to name the archive: ", (err, res) => {
                    cb(null, res);
                });
            }, (cb) => {
                this.ask("Type in the name of the folder you want to split and compress: ", (err, res) => {
                    cb(null, res);
                });
            }

        ], (err, res)=> {
            let size = res[0]*1024;
            let password = res[1];
            let archive_name = res[2];
            let folder_name = res[3];
            console.log(`<==============================>\nThe size of each block will be ${size}KB\nYou password is ${password}\nThe name of the archive is ${archive_name}\nThe file you want to compress and split is ${folder_name}
            `);

            this.ask('Please press enter to continue',(err,res)=>{
                shell.exec(`rar a -v${size}k -df -hp${password} -m0 ${archive_name}.rar ${folder_name}`,()=>{
                    console.log('done');
                });
            });
        });
    }
}

let backup = new Backup();
// backup.encode('doc.ods.zip','immagine.png');
// backup.decode('immagine.png', 'doc2.ods.zip', function() {
//     console.log('done');
// });