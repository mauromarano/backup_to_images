import wb from "web-bundle"
import async from "async"
import shell from "shelljs"
class Backup {
    constructor() {

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
    }
}

let backup = new Backup();
backup.encode('doc.ods.zip','immagine.png');
backup.decode('immagine.png', 'doc2.ods.zip', function() {
    console.log('done');
});