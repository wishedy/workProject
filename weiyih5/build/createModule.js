var fs = require('fs');
var path = require('path');
var utils = require('./utils');
var chalk = require('chalk')
var moduleDataPath = path.resolve(__dirname+'/modules.json');
var moduleData = fs.readFileSync(moduleDataPath,'utf-8');
var moduleJson = JSON.parse(moduleData);
var fs=require("fs");
function readFile(op,tp,cb){
    fs.readFile(op, 'utf-8', function(err, data) {
        if (err) {
            console.log("读取失败");
        } else {
            //console.log(data);
            cb&&cb(data,tp);
            return data;
        }
    });
}

function writeFile(data,tp){
    fs.writeFile(tp,data,function(error){
        //console.log(data);
        if(error){
            throw error;
        }else{
            //console.log("文件已保存");
        }
    });
}
function copyFile(originalPath,targetPath){
    //console.log(originalPath);
    readFile(originalPath,targetPath,writeFile);

}
var createModule = function(createPath,createKeyName){
    var storeKey = false;
    var routerKey = false;
    var arrKey =[];
    if(createPath.indexOf('\/')>-1){
        arrKey = createPath.split('\/');
        if(!(utils.fsExistsSync(utils.resolve('src/modules/'+arrKey[0]+"/"+arrKey[1])))){
            fs.mkdirSync(utils.resolve('src/modules/'+arrKey[0]+"/"+arrKey[1]));
        }
        storeKey = moduleJson[arrKey[0]][arrKey[1]]['store'];
        routerKey = moduleJson[arrKey[0]][arrKey[1]]['router'];
    }else{
        storeKey = moduleJson[createKeyName]['store'];
        routerKey = moduleJson[createKeyName]['router'];
    }
    var createStoreFile = function(){
        if(!utils.fsExistsSync(utils.resolve('src/modules/'+createPath+"/"+'store'))){
            fs.mkdirSync(utils.resolve('src/modules/'+createPath+"/"+'store'));
            var storeFileName = ["store","mutaions","state","actions","getters"];
            for(var numStroe = 0;numStroe<storeFileName.length;numStroe++){
                copyFile(utils.resolve('src/commModule/store/'+storeFileName[numStroe]+'.js'),utils.resolve('src/modules/'+createPath+"/"+'store/'+storeFileName[numStroe]+'.js'));
            }
        }
    };
    var createRouterFile = function(){
        if(!utils.fsExistsSync(utils.resolve('src/modules/'+createPath+"/"+'router'))){
            fs.mkdirSync(utils.resolve('src/modules/'+createPath+"/"+'router'));
            copyFile(utils.resolve('src/commModule/router/router.config.js'),utils.resolve('src/modules/'+createPath+"/"+'router/router.config.js'));
        }
    };
    if(storeKey&&routerKey){
        copyFile(utils.resolve('src/commModule/mainAll.js'),utils.resolve('src/modules/'+createPath+'/main.js'));
        createRouterFile();
        createStoreFile();
    }else if(storeKey||routerKey){
        if(storeKey){
            createStoreFile();
            copyFile(utils.resolve('src/commModule/mainStore.js'),utils.resolve('src/modules/'+createPath+'/main.js'));
        }
        if(routerKey){
            createRouterFile();
            copyFile(utils.resolve('src/commModule/mainRouter.js'),utils.resolve('src/modules/'+createPath+'/main.js'));
        }

    }else if((!storeKey)&&(!routerKey)){
        copyFile(utils.resolve('src/commModule/default.js'),utils.resolve('src/modules/'+createPath+'/main.js'));
    }
    copyFile(utils.resolve('src/commModule/App.vue'),utils.resolve('src/modules/'+createPath+'/App.vue'));
    fs.mkdirSync(utils.resolve('scss/pages/'+createKeyName));
    copyFile(utils.resolve('src/commModule/scssDemo.scss'),utils.resolve('scss/pages/'+createKeyName+'/'+createKeyName+'.scss'));
    copyFile(utils.resolve('src/commModule/index.html'),utils.resolve('src/modules/'+createPath+'/'+createKeyName+'.html'));
    console.log(chalk.cyan('module创建完成.\n'));
    console.log(chalk.yellow(
        'scss代码输入在:scss/pages/'+createKeyName+'/'+createKeyName+'.scss中.\n' +
        'src/modules/'+createPath+'/App.vue中的demo/demo.scss更名为'+createKeyName+'/'+createKeyName+'.scss.\n'+
        'src/modules/'+createPath+'/'+createKeyName+'.html中的title内容需要修改.\n'+
        '如有疑问请与张恒联系\n'
    ))
};
for(var keyName in moduleJson){
    var index = 0;
        var isDirExist = utils.fsExistsSync(utils.resolve('src/modules/'+keyName));
    if(isDirExist){
        if(moduleJson[keyName]['author']){
            continue;
        }else{
            for(var innerKeyName in moduleJson[keyName]){
                var isInnerDirExist = utils.fsExistsSync(utils.resolve('src/modules/'+keyName+"/"+innerKeyName));
                if(isInnerDirExist){
                    continue;
                }else{
                    createModule(keyName+"/"+innerKeyName,innerKeyName)
                    //console.log(keyName+'不存在'+innerKeyName)
                }
            }
        }
    }else{
        fs.mkdir(utils.resolve('src/modules/'+keyName),{ recursive: false },function(error){
            if(error){
                console.log(error);
            }else{

                 if(moduleJson[keyName]['author']){
                     createModule(keyName,keyName);
                   }else{
                        for(var innerKeyName in moduleJson[keyName]){
                            var isInnerDirExist = utils.fsExistsSync(utils.resolve('src/modules/'+keyName+"/"+innerKeyName));
                            if(isInnerDirExist){
                                continue;
                            }else{
                                createModule(keyName+"/"+innerKeyName,innerKeyName);
                                //console.log(keyName+'不存在'+innerKeyName)
                            }
                        }
                 }
            }
        });
        //console.log('不存在'+keyName);
    }
}
