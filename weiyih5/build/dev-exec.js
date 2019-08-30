const fs = require('fs');
const path = require('path')
const moduleDataPath = path.resolve(__dirname + '/modules.json');
const moduleData = fs.readFileSync(moduleDataPath, 'utf-8');
const moduleJson = JSON.parse(moduleData);

const inquirer = require('inquirer');
const _ = require('lodash');
const fuzzy = require('fuzzy');
const shell = require('shelljs');

const FRESH_MODULE_LIST = [];
const LEAF_MARKER = ['router', 'store', 'des', 'author', 'index'].toString();
const CLI_COMMAND = 'node --max_old_space_size=4096 build/dev-server.js';
let module_count = 0;
(handleModuleJson = (moduleJson) => {
    for (let x in moduleJson) {
        if (Object.keys(moduleJson[x]).toString() === LEAF_MARKER) {
            module_count ++;
            FRESH_MODULE_LIST.push('名称：' + x + '丨描述：' + moduleJson[x]['des'] + '丨开发者：' + moduleJson[x]['author']);
        }
        else {
            handleModuleJson(moduleJson[x]);
        };
    }
})(moduleJson);


module_list = (answers, input) => {
    input = input || '';
    return new Promise(function(resolve) {
        setTimeout(function() {
            let fuzzyResult = fuzzy.filter(input, FRESH_MODULE_LIST);
            resolve(
                fuzzyResult.map(function(el) {
                    return el.original;
                })
            );
        }, _.random(30, 500));
    });
}

mainAction = () => {
    inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));
    const options = [{
        name: 'exec',
        type: 'autocomplete',
        pageSize: 10,
        message: '请选择要运行的页面模块(共 ' + module_count + ' 个)：',
        source: module_list
    }];

    inquirer.prompt(options).then((answer) => {
        let moduleName = answer.exec.substring(3, answer.exec.split('丨')[0].length);
        shell.exec(CLI_COMMAND + ` ` + moduleName
            , (error, stdout, stderr) => {
                if (error) {
                    console.error(`exec error: ${error}`);
                    return;
                }
                console.log(`${stdout}`);
                console.log(`${stderr}`);
            })
    });
}

mainAction();