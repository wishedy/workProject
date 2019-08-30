const fs = require('fs')
const path = require('path')
const stipulateEntry = require('./stipulateEntry');
// console.log(stipulateEntry)
const entryPath = path.resolve(__dirname, '../src/modules')

const entris = fs.readdirSync(entryPath).reduce(function(o, dirname) {
    //console.log(entryPath,dirname);
    if(stipulateEntry.developPageName==='/'){
        o[dirname] = path.join(entryPath, dirname)
    }else{
        if(stipulateEntry.developPageName===dirname){
            o[dirname] = path.join(entryPath, dirname)
        }
    }
    return o
}, {})
// console.log(entris)
module.exports = entris
