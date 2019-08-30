;(function ($) {
    $.fn.compressUploadImage = function (options) {
        var inputElement = $(this);
        var fnObj = {
            allLen:0,
            submitBtn:$(options.upLoadBtn+''),
            inputId:options.inputId,
            previewOpt:options.previewOpt?options.previewOpt:-1,
            allInputFiles:[],
            previewOnOff:options.previewOnOff,
            allInputFilesInfo:{},
            nowInputFiles:null,//是一个对象
            upDateNowFiles:function(){
                var t = this;
                for(var key in t.nowInputFiles){
                    if(!isNaN(parseInt(key))){
                        var timestamp = Date.parse(new Date());
                        function getRandom(num){
                            var random = Math.floor((Math.random()+Math.floor(Math.random()*9+1))*Math.pow(10,num-1));
                            return random;
                        }
                        var previewId = timestamp+getRandom(4);
                        t.nowInputFiles[key].removeOnOff = false;
                        t.nowInputFiles[key].previewId = previewId;
                        t.allLen++;
                    }
                }
            },
            upDateAllFiles:function(){
                var t = this;
                for(var num = 0;num<t.allInputFiles.length;num++){
                    for(var key in t.allInputFiles[num]){
                        if(!isNaN(parseInt(key))){
                            t.allInputFilesInfo[t.allInputFiles[num][key]['previewId']] = t.allInputFiles[num][key];
                        }
                    }
                }

            },
            init:function(){
                var t = this;
                t.onChangeInput();//.submitImage();
            },
            convertBase64UrlToBlob:function(urlData){
                var arr = urlData.split(','), mime = arr[0].match(/:(.*?);/)[1],
                    bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
                while(n--){
                    u8arr[n] = bstr.charCodeAt(n);
                }
                return new Blob([u8arr], {type:mime});
            },
            submitImageData:function(){
              var t = this;
                var upLoadNewNum = 0;
                var previewId = 0;
                options.beforeunload&&options.beforeunload();
                var dynamicData = options.attachmentRelated&&options.attachmentRelated();
                var hasData = true;
                for(var preKey in t.allInputFilesInfo){
                    (function(preKeyId){
                        if(!(t.allInputFilesInfo.removeOnOff)){
                            var formdata=new FormData();
                            hasData = false;
                            for(var key in dynamicData){
                                formdata.append(key,dynamicData[key]);
                            }
                            formdata.append("file", t.convertBase64UrlToBlob(t.allInputFilesInfo[preKeyId].baseData), "file_"+t.allInputFilesInfo[preKeyId].previewId+".jpg"); // 文件对象
                            if(t.previewOnOff){
                                var item = $('[data-previewid="'+t.allInputFilesInfo[preKeyId].previewId+'"]');
                                var loadingMask = item.find(".mask");
                                 loadingMask.show();
                            }
                            $.ajax({
                                type: "POST",
                                url: options.url,
                                data: formdata,
                                cache: false,
                                processData: false,
                                contentType: false,
                                beforeSend:function(){
                                },
                                complete:function(){
                                },
                                success: function (data) {

                                    options.singleUpload&&options.singleUpload(data);
                                    if(t.previewOnOff){
                                        loadingMask&&loadingMask.hide();
                                        item.find(".uploadSureBtn").show();
                                        item.find('.uploadCancelBtn').hide();
                                    }

                                    upLoadNewNum++;
                                    if(t.allLen===upLoadNewNum){
                                        upLoadNewNum = 0;
                                        options.allUpload&&options.allUpload(data);
                                    }

                                },
                                error: function(data) {

                                }
                            });
                        }
                    })(preKey);//调用时参数



                }
                if(hasData){
                    alert("请选择您要上传图片!");
                }
            },
            submitImage:function(){
                var t = this;
                t.submitBtn.on("mousedown",function(){
                    t.submitImageData();
                });
            },
            imgSizeFn: function (w, h) { //图片压缩后宽高
                if (w <= 1280 && h <= 1280) {
                    return {w: w, h: h};
                } else if (w / h <= 2 && (w > 1280 || h > 1280)) {
                    //opt.ratio = 1;
                    if (w > h) {
                        return {w: 1280, h: parseInt(h / w * 1280)};
                    } else {
                        return {w: parseInt(w / h * 1280), h: 1280};
                    }

                } else if (w / h > 2) {
                    if (w > 1280 && h > 1280) {
                        //opt.ratio = 1;
                        if (w > h) { //压缩规则第4条，宽高都大于1280时，取较小值为1280，经多次测试数据过大造成浏览器卡死崩溃，故更改为取较大值为1280，小值等比压缩
                            if(h/w*1280>500){   //如果h较小，但长度大于500，按宽1280等比压缩   （小值按1280算，ajax上传时报413 Request Entity Too Large）
                                return {w: 1280, h: parseInt(h / w * 1280)};
                            }else{//如果h小于500，按H500等比压缩
                                return {w: w*500/h, h: 500};
                            }
                        } else {
                            if(w/h*1280>500){   //如果h较小，但长度大于500，按宽1280等比压缩
                                return {w: parseInt(w / h * 1280), h: 1280};
                            }else{//如果h小于500，按H500等比压缩
                                return {w: 500, h: h*500/w};
                            }
                        }
                    } else {
                        //opt.ratio = 1;
                        return {w: w, h: h};
                    }
                }
            },
            canvasDataURL:function(path, dataCallBack){
                var img = new Image();
                img.src = path;
                img.onload = function(){
                    var that = this;
                    // 默认按比例压缩
                    var w = that.width;
                    var   h = that.height;
                    //scale = w / h;
                    //w = obj.width || w;
                    //h = obj.height || (w / scale);
                    var quality = 0.7;  // 默认图片质量为0.7
                    //生成canvas
                    var canvas = document.createElement('canvas');
                    var ctx = canvas.getContext('2d');
                    // 创建属性节点
                    var compressRect = fnObj.imgSizeFn(w, h);
                    canvas.width = compressRect.w;
                    canvas.height = compressRect.h;
                    ctx.drawImage(that, 0, 0, compressRect.w, compressRect.h);
                    // 图像质量
                    // quality值越小，所绘制出的图像越模糊
                    var base64 = canvas.toDataURL('image/jpeg',.7);
                    // 回调函数返回base64的值
                    dataCallBack&&dataCallBack(base64);
                    return base64;
                }
            },
            templateImages:function(files,callBack){
                var t = this;
                for(var num = 0;num<files.length;num++){
                    var ready=new FileReader();
                    ready.loadId = files[num].previewId;
                    ready.readAsDataURL(files[num]);
                    ready.onload=function(){
                        var _this = this;
                        var re=_this.result;
                        t.canvasDataURL(re,function(baseData){
                            t.allInputFilesInfo[_this.loadId].baseData = baseData;
                            if(t.previewOnOff){
                                t.previewOpt.listContainer.append(t.visualization(t.allInputFilesInfo[_this.loadId]));
                                t.previewOpt.listContainer.addClass("uploadContainer");
                                t.deleteImgItem();
                            }
                            if(!options.initOnOff){
                                t.submitImageData();
                            }
                        });

                    }
                }

            },
            deleteImgItem:function(){
                var t = this;
                $(".uploadCancelBtn").off("click").on("click",function(){
                    var _this = $(this);
                    var previewImageItem = _this.parents(".uploadImagePanel");
                    var previewId = previewImageItem.attr("data-previewId");
                    t.allInputFilesInfo[previewId].removeOnOff = true;
                    previewImageItem.remove();
                    t.allLen--;
                });
            },
            visualization:function(data){
                var imageListStr = '';
                var t = fnObj;
                if(t.previewOpt.individuationFn){
                    return t.previewOpt.individuationFn(data);
                }
                var imageBaseData = data;
                function imageTitle(str){
                    var strFirst = str.split(".");
                    var s = '';
                    if(strFirst[0].length>10){
                        s=strFirst[0].substring(0,10)+"***";
                    }else{
                        s = strFirst[0]
                    }
                    return s+'.'+strFirst[1];
                }
                var size = ((imageBaseData.size/1024/1024)>.01)?(imageBaseData.size/1024/1024).toFixed(2)+'Mb':imageBaseData.size+'Kb';
                imageListStr += '<div class="uploadImagePanel" data-previewId="'+imageBaseData.previewId+'">' +
                    '            <div class="title">' + imageTitle(imageBaseData.name) + '</div>' +
                    '<div class="uploadImage">'+
                    '                <div class="mask">'+
                    '                    <div class="loadEffect">'+
                    '                        <span></span>'+
                    '                        <span></span>'+
                    '                        <span></span>'+
                    '                        <span></span>'+
                    '                        <span></span>'+
                    '                        <span></span>'+
                    '                        <span></span>'+
                    '                        <span></span>'+
                    '                    </div>'+
                    '</div>'+
                    '            <img class="uploadImage" src="' + imageBaseData.baseData + '"/></div>' +
                    '            <div class="uploadControlBar">' +

                    '<i>' + size + '</i>' +
                    '                <span class="uploadSureBtn" style="display: none;">完成</span>' +
                    '                <span class="uploadCancelBtn">取消</span>' +
                    '            </div>' +
                    '        </section>';
                return imageListStr;
            },
            submitAttachment:function(){
              var t = this;
                t.upLoadAttachment();
            },
            upLoadAttachment:function(){
                var t = fnObj;
                t.nowInputFiles = document.getElementById(t.inputId).files;
                t.upDateNowFiles();
                if(t.previewOpt.updateType===0){
                    //0代表每次选择完新增展示
                    t.allInputFiles.push(t.nowInputFiles);

                }else if(t.previewOpt.updateType===1){
                    //1代表每次选择完更新展示
                    t.allInputFilesInfo = [];
                    t.allInputFiles =[];
                    t.allInputFiles.push(t.nowInputFiles);
                }else{
                    t.allInputFiles.push(t.nowInputFiles);
                }
                t.upDateAllFiles();
                t.templateImages(t.nowInputFiles)
            },
            onChangeInput:function(){
                var t = this;
                inputElement.off("change").on("change",function(){
                    t.upLoadAttachment();
                });
                return t;
            }
        };
        console.log(options.upLoadBtn);
        if(options.upLoadBtn){
            fnObj.init();
        }else{
            if(options.previewOnOff){
                fnObj.init();
            }else{
                fnObj.submitAttachment();
            }

        }
        return fnObj;
    }
})(jQuery);