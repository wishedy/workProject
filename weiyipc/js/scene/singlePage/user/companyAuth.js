/**
 * @Desc： 企业认证  重新认证时，提示被拒绝
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Liuyutao on 2019/4/9.
 */
$(function () {
	var newAuth = {};
	newAuth = {
		path: {
			company:PC_CALL +"brand/search/companySearch/",//医院联想  // ?queryJson=%7b%22companyName%22%3a%22%e5%8c%97%e4%ba%ac%22%7d
			getCustomerUnite: PC_CALL + "customer/unite/getCustomerUnite/",     //获取当前登录用户信息
			getCustomerAuthInfo: PC_CALL + 'customer/auth/getAuthBycustomerId/',//获取用户认证信息
			companyAuthSubmit: PC_CALL + "customer/auth/createAuthCompany/",	//	厂商认证提交
			//getDataRoleConfigs: PC_CALL + "comm/data/roleconfig/getDataRoleConfigs/",//获取证件名称
			getDataRoleConfigs: PC_CALL + "comm/data/roleconfig/getSortList/",//获取证件名称
			// getAuthAttachments: PC_CALL + "customer/auth_attachment/getAuthAttachments/",//获取用户证件信息
			getAuthAttachments: PC_CALL + "customer/auth_attachment/getAuthAttachmentsV2/",//获取用户证件信息
			// getAuthAttachments: PC_CALL + "customer/auth_attachment/getMapList2/",//获取用户证件信息
			promptMessage: PC_CALL + "customer/unite/promptMessage/",//上传证件页面提示接口
			getCustomerUniteById: PC_CALL + 'customer/unite/getMapById/',//获取用户性别
			getRefuseReason: PC_CALL + 'customer/auth_process/getMapList/',//获取拒绝原因,
			getTips: PC_CALL + 'customer/customer/unite/promptMessage/'//获取页面的提示信息，包括标题与下面的提示,
		},
		formValid:false,
		delAttIdList:[],
		init: function () {
			$(".authentication").show();
			var t = this;
			this.para = comm.getpara();//解析URL参数
			this.getCustomerAuthInfo();//获取用户认证信息
			this.helpAuth();
			this.bindCompanyLenovo();
			this.dataRoleConfigs();
			t.checkName();
			t.submitCheck();
			t.bindSubmit();
			t.baseInfoAuthStep();
			var uid = $('#sesCustomerId').val(); //登录人id
			if (!uid) {
				user.login({
					callback: function () {
						location.reload();
					},
					scene: privilegeSceneConst.eSceneTypeLogin,
					onClose: function () {
						if (window.g_sps) {
							g_sps.jump(null, "/");
						} else {
							setTimeout(function () {
								g_sps.jump(null, "/");
							}, 300)
						}
					},
					noAuthReload: true
				});
				return false;
			}
			else {
				//获取当前登录用户信息，是为了更新 customerRole
				user.getCustomerUnit();
			}

		},

		//
		//获取用户认证信息
		getCustomerAuthInfo: function () {
			var t = this;
			if (comm.authInfo) {
				var data = comm.authInfo;
				if (data && data.responseObject) {
					var rspObj = data.responseObject;
					t.customerAuth = rspObj;
					t.name = rspObj.certificatesCode;//姓名
				}
			} else {
				$.ajax({
					url: t.path.getCustomerAuthInfo,
					dataType: "json",
					type: "post",
					async: false,
					success: function (data) {
						if (data && data.responseObject) {
							var rspObj = data.responseObject;
							t.customerAuth = rspObj;
							t.name = rspObj.certificatesCode;//姓名



						}
					}
				});

			}

			if (t.customerAuth.state === 0
				|| t.customerAuth.state === 1
				|| t.customerAuth.state === 2
				|| t.customerAuth.state === 7
				|| t.customerAuth.state === 8) {//0-二次提交认证、1-认证通过、2-运营确认
				setTimeout(function () {
					// g_sps.jump(null, "/"); TODO 临时截住流程，先显示出厂商补充认证界面来
				}, 500)
			}
			t.checkAuth();//检查用户认证状态
		},
		/**
		 * 功能描述：判断认证结果
		 * 参数说明：
		 * 认证状态值：cAuth.state
		 *  -1 - 无认证信息、0 - 二次提交认证、1 - V1认证申请、2 - 运营确认
		 *  3 - 认证拒绝、7 - 执业医师申请、8 - 执业医师确认、9 - 执业医师拒绝
		 * 注意事项：
		 *
		 * Create by YaoQiao on 2019/3/13
		 */
		checkAuth: function () {
			var t = this;
			if (t.customerAuth && !$.isEmptyObject(t.customerAuth)) {//有认证的信息
				var cAuth = t.customerAuth;
				t.cAuth = cAuth;
				// 显示认证拒绝提示
				if (cAuth.state === 3 || cAuth.state == 9) {
					t.isFirstAuth = 2;
					t.showRefuseReason();
				}
			}
		},
		// 显示拒绝原因
		showRefuseReason:function(){
			var t = this;
			var postData = {
				customerId: $("#sesCustomerId").val(),
				state: t.cAuth.state,
				sortType: 3,
				firstResult: 0,
				maxResult: 1,
				isCustomer: 1
			};
			postData = {
				paramJson: $.toJSON(postData)
			};
			$.ajax({
				url: t.path.getRefuseReason,
				data: postData,
				type: 'post',
				dataType: 'json',
				success: function (data) {
					if (data && data.responseObject.responseData
						&& data.responseObject.responseData.data_list
						&& data.responseObject.responseData.data_list.length > 0) {
						$('.ev-errorText').text(data.responseObject.responseData.data_list["0"].resourceName);
						$('.ev-firstError').show();
					}
				}
			});
		},
		/*绑定企业联想*/
		bindCompanyLenovo:function(){
			var t = this;
			//单位联想

			$("#company").lenovo({
				width: 292,
				url: t.path.company,
				showName: "companyName", //显示出的值
				id: "companyId",   //自定义属性值
				hiddenId: "companyId"    //自定义属性
			});

			var cpLock = true;
			$("#company").on({
				compositionstart: function () {//中文输入开始
					cpLock = false;
				},
				compositionend: function () {//中文输入结束
					cpLock = true;
				},
				input: function () {//input框中的值发生变化
					if (cpLock)
						$(this).val($(this).val().replace(/[^\u4e00-\u9fa5\dA-Za-z]/g, ''));
					if ($(this).attr('companyid')) {
						$(this).attr('companyid', '')
					}
					t.submitCheck();
				}
			});
		},

		/**
		 * 功能描述：获取基本信息
		 * 参数说明：
		 * 1、获取职称数据：需要传参 identity
		 *      identity:0 --表示获取所有职称数据
		 *      identity:1 --表示获取医生/医学生的职称数据
		 *      identity:2 --表示获取护士的职称数据
		 *
		 * 注意事项：
		 *
		 * Create by YaoQiao on 2019/3/15
		 */
		baseInfoAuthStep: function () {
			var t = this;
			var userRoleType = 1;
			var _customerRole = TempCache.getItem("customerRole");
			t.browType = 10001;
			var auth = t.customerAuth;
			$("#fullName").val(auth.fullName);//姓名
			$("#company").val(auth.company).attr('companyId', auth.companyId);//医院



			//清空单位和学校ID
			// $("#schoolName,#company").on('keyup', function () {
			//     $(this).val($(this).val().replace(/[^\u4e00-\u9fa5\dA-Za-z]/g, ''));
			//     if ($(this).attr('schoolid')) {
			//         $(this).attr('schoolid', '')
			//     } else if ($(this).attr('companyid')) {
			//         $(this).attr('companyid', '')
			//     }
			//
			// });


		},
		//名字实时校验
		checkName: function () {
			var t = this;
			var cpLock = true;
			$('#fullName').on({
				compositionstart: function () {//中文输入开始
					cpLock = false;
				},
				compositionend: function () {//中文输入结束
					cpLock = true;
				},
				input: function () {//input框中的值发生变化
					$('#name_error').hide();
					var thisVal = $(this).val();
					if (thisVal && cpLock) {
						$(this).val(thisVal.replace(/[^\u4e00-\u9fa5\sA-Za-z]/g, ''));
						$(this).val($(this).val().replace(/^[\s]/, ''));
						if (comm.getByteLen(thisVal) > 50) {
							$(this).val(thisVal.substring(0, 50));
						}
					}
					t.submitCheck();
				}
			});
		},

		//获取证件配置列表
		dataRoleConfigs: function () {
			var t = this;
			var demoImg = [];//存放示例图片
			// 1-身份证6-医师资格证8-医师执业证7-医学学位证11-工作证12-学生证10工作证(学生证)13-医师职称证书9-医学学历证
			// 15-护士执业证，16-专业技术资格证
			demoImg[8] = ['pic_zhiye1.png', 'pic_zhiye2.png'];
			demoImg[6] = ['pic_zige1.png', 'pic_zige2.png'];
			demoImg[13] = ['pic_zhicheng.png'];
			demoImg[10] = ['pic_work.png'];
			demoImg[11] = t.identity === 2 ? ['pic_work_nurse.png'] : ['pic_work.png'];//护士角色的工作证和医生的不一样
			demoImg[12] = ['pic_student.png'];
			demoImg[7] = ['pic_xuewei.png'];
			demoImg[9] = ['pic_xueli.png'];
			demoImg[1] = ['pic_id1.png', 'pic_id2.png'];
			demoImg[15] = ['pic_nurse_zhiye1.png', 'pic_nurse_zhiye2.png'];//护士执业证，正反两面
			demoImg[16] = ['pic_nurse_zige.png'];//护士专业技术资格证
			demoImg[17] = ['pic-namecard.png'];//工作证或名片
			demoImg[18] = ['pic_id1.png'];//身份证人像面
			var postData = {
				"isValid": 2,
				"visitSiteId": 1,
				medicalTitleId:-1
			};
			postData = {paramJson: $.toJSON(postData)};
			comm.LightBox.showloading();
			$.ajax({
				url: t.path.getDataRoleConfigs,
				dataType: "json",
				type: "post",
				data: postData,
				success: function (data) {
					comm.LightBox.hideloading();
					if (data && data.responseObject
						&& data.responseObject.responseData.data_list
						&& data.responseObject.responseData.data_list.length > 0) {
						var roleConfigsStr = '', roleIdStr = '';
						var len = data.responseObject.responseData.data_list.length;
						$.each(data.responseObject.responseData.data_list, function (index, ele) {
							var refId = ele.refId;
							if (refId == 6 || refId == 8 || refId == 1 || refId == 15) {//有证件编号
								roleConfigsStr += t.attcodeDom({
									refId: refId,
									refValue: ele.refValue,
									demoImg: demoImg
								});
							} else {
								roleConfigsStr += ' <div class="uploadPic clearFloat ev-attType ev-imgAtt' + refId + '">' +
									'                <h4>' + ele.refValue + '</h4>' +
									'            <section class="authInput ev-dataAttType" data-attType="' + refId + '">' +
									'                 <div class="typeTip" style="display: none"><i>!</i><span>未通过</span></div>' +
									'            </section>' +
									'                 <div class="tip-text">' +
									'						<span class="one">证件照片</span><span class="two">根据示例上传证件（必填）</span>' +
									'				  </div>' +
									'            <section class="img-box">' +
									'                <figure class="al-tableItemContent">' +
									'                    <aside class="uploadImg ev-cerUploadCon">' +
									'                        <input type="hidden" value="" name="certificatesPath" class="certificatesPath" />' +
									'                        <div class="img-box">' +
									'                            <figure class="demo">' +
									'								<img src="/images/img10/authentication/certificate/' + demoImg[refId][0] + '" width="216" height="150">' +
									'								<div class="text">示例</div>' +
									'							 </figure>' +
									'                            <!--上传后的图片 上传中添加类名 uploading-->' +
									'                            <figure class="uploadSuccess cer_upload">' +
									'                                <div class="czyx1">' +
									'                                    <div class="ev-upload hide">' +
									'                                        <!--蒙层-->' +
									'                                        <div class="uploadPopup">' +
									'                                            <p class="hide">上传失败<br/>' +
									'                                                请重新上传</p>' +
									'                                            <figure class="percentage loadingAnimate hide">' +
									'                                                <img src="//img10.allinmd.cn/v3/common/icon/icon_uploading.png">' +
									'                                                <span>0%</span>' +
									'                                            </figure>' +
									'                                        </div>' +
									'                                        <!--关闭按钮-->' +
									'                                        <div class="popupClose hide"></div>' +
									'                                    </div>' +
									// '                                    <input class="cer_po_input" type="file" name="file">' +
									'                                </div>' +
									'                            </figure>' +
									'                        </div>' +
									'                        <div class="l_warning photo_error"><img src="//img10.allinmd.cn/v3/common/icon/error_tips.png"><span><label>请上传证件照片！</label></span></div>' +
									'                    </aside>' +
									'                </figure>' +
									'            </section>' +
									((index==len-1)?'':'<div class="attLine"></div>') +
									'        </section>';

							}
							$('.ev-container').html(roleConfigsStr + roleIdStr);
						});
						t.secondInformation();
						t.uploadAtt();

						$("#secondStep .attLine").eq($("#secondStep .attLine").length - 1).hide();
						$("#secondStep .attCode").on("keyup", function () {
							t.secondSubmit();
							$(this).val($(this).val().replace(/[^0-9a-zA-Z]/g, ''));
							if (($(this).val()).length > 50) {
								$(this).val($(this).val().substr(0, 50));
							}
						});
					}
				}
			});
		},
		//有证件编号的DOM
		attcodeDom: function (option) {
			var str = '<section class="ev-attType ev-imgAtt' + option.refId + '">' +
				'            <section class="authInput ev-dataAttType" data-attType="' + option.refId + '">' +
				'                <span class="typeTitle">' + option.refValue + '</span>' +
				'                 <div class="typeTip" style="display: none"><i>!</i><span>未通过</span></div>' +
				'            </section>' +
				'            <section class="authInput ev-attCodePar padding108 certificatesNum">' +
				'                 <p class="typeAtt">证件照片<span>根据示例上传证件</span></p>' +
				'            </section>' +
				'            <section class="authInput padding108">' +
				'                <figure class="al-tableItemContent">' +
				'                    <aside class="uploadImg ev-cerUploadCon">' +
				'                        <input type="hidden" value="" name="certificatesPath" class="certificatesPath" />' +
				'                        <div class="photoCont">' +
				'                            <figure><img src="/images/img10/authentication/certificate/' + option.demoImg[option.refId][0] + '">' +
				'                                <div class="sample">' + ((option.refId == 6 || option.refId == 8) ? '第一页示例' : '示例') + '</div>' +
				'                            </figure>' +
				'                            <!--上传后的图片 上传中添加类名 uploading-->' +
				'                            <figure class="uploadSuccess cer_upload">' +
				'                                <div class="czyx1">' +
				'                                    <div class="ev-upload hide">' +
				'                                        <!--蒙层-->' +
				'                                        <div class="uploadPopup">' +
				'                                            <p class="hide">上传失败<br/>' +
				'                                            请重新上传</p>' +
				'                                            <figure class="percentage loadingAnimate hide">' +
				'                                                <img src="//img10.allinmd.cn/v3/common/icon/icon_uploading.png">' +
				'                                                <span>0%</span>' +
				'                                            </figure>' +
				'                                        </div>' +
				'                                        <!--关闭按钮-->' +
				'                                        <div class="popupClose hide"></div>' +
				'                                    </div>' +
				// '                                    <input class="cer_po_input" type="file" name="file">' +
				'                                </div>' +
				'                            </figure>' +
				'                        </div>' +
				'                        <figure class="uploadPhoto">' +
				'                            <i></i>' +
				'                            <p>上传证件照</p>' +
				'                        </figure>' +
				'                        <div class="l_warning photo_error"><img src="//img10.allinmd.cn/v3/common/icon/error_tips.png"><span><label>请上传证件照片！</label></span></div>' +
				'                    </aside>' +
				(function () {
					var str = '';
					if (option.refId == 6 || option.refId == 8 || option.refId == 1 || option.refId == 15) {
						str = '<aside class="uploadImg ev-cerUploadCon">' +
							'        <input type="hidden" value="" name="certificatesPath" class="certificatesPath" />' +
							'         <div class="photoCont">' +
							'             <figure><img src="/images/img10/authentication/certificate/' + option.demoImg[option.refId][1] + '"><div class="sample">' + ((option.refId == 6 || option.refId == 8) ? '第二页示例' : '示例') + '</div></figure>' +
							'             <!--上传后的图片 上传中添加类名 uploading-->' +
							'             <figure class="uploadSuccess cer_upload">' +
							'                 <div class="czyx1">' +
							'                     <div class="ev-upload hide">' +
							'                         <!--蒙层-->' +
							'                         <div class="uploadPopup">' +
							'                             <p class="hide">上传失败<br/>' +
							'                                 请重新上传</p>' +
							'                             <figure class="percentage loadingAnimate hide">' +
							'                                 <img src="//img10.allinmd.cn/v3/common/icon/icon_uploading.png">' +
							'                                 <!--<span>20%</span>-->' +
							'                             </figure>' +
							'                         </div>' +
							'                         <!--关闭按钮-->' +
							'                         <div class="popupClose hide"></div>' +
							'                     </div>' +
							// '                     <input class="cer_po_input" type="file" name="file">' +
							'                 </div>' +
							'             </figure>' +
							'         </div>' +
							'         <figure class="uploadPhoto">' +
							'             <i></i>' +
							'             <p>上传证件照</p>' +
							'         </figure>' +
							'         <div class="l_warning photo_error"><img src="//img10.allinmd.cn/v3/common/icon/error_tips.png"><span><label>请上传证件照片！</label></span></div>' +
							'   </aside>';
					}
					return str;
				}()) +
				'                </figure>' +
				'            </section>' +
				'              <div class="attLine"></div>' +
				'        </section>';
			return str;
		},
		//获取用户证件信息
		secondInformation: function () {
			var t = this;
			var postData = {
				pageIndex: 1,
				pageSize: 999
			};

			postData = {paramJson: $.toJSON(postData)};
			comm.LightBox.showloading();
			$.ajax({
				url: t.path.getAuthAttachments,
				dataType: "json",
				type: "post",
				data: postData,
				success: function (data) {
					comm.LightBox.hideloading();
					if (data && data.responseObject
						&& data.responseObject.responseData
						&& data.responseObject.responseData.data_list
						&& data.responseObject.responseData.data_list.length > 0) {
						var newData = [];
						var flag = false;
						$.each(data.responseObject.responseData.data_list, function (ni, nel) {
							if (newData.length == 0) {
								newData.push(nel);
							} else {
								$.each(newData, function (ji, jel) {
									flag = false;
									if (jel.attType == nel.attType && jel.attPositionType == nel.attPositionType) {
										flag = true;
										if (Date.parse(jel.createTime.substring(0, 19)) > Date.parse(nel.createTime.substring(0, 19))) {//新数组中同一位置 图片时间> 老的时间 ==为新
											newData.splice(ji, 1, jel);
										} else {
											newData.splice(ji, 1, nel);
										}
										return false;
									}
								});
								if (!flag) {
									newData.push(nel);
								}
							}
						});
						t.getAuthAttachments = newData;
						$.each(newData, function (indexm, elem) {
							$.each($('.ev-attType'), function (index, ele) {
								// elem.attType = (elem.attType == 10 ? (t.medicalID == '10' ? 12 : 11) : elem.attType);
								if (elem.attType && $('.ev-dataAttType', $(ele)).attr('data-attType') == elem.attType) {
									if (parseInt(elem.isRefuse)) {
										$('.ev-imgAtt' + elem.attType).find('.ev-dataAttType .typeTip').show();
									}
									if (elem.attCode) {
										$('.attCode', $(ele)).val(elem.attCode).attr('data-oldcode', elem.attCode);
									}
									// $('.certificatesPath', $(ele)).eq(elem.attPositionType - 1).val(elem.attPath.replace("https://img05.allinmd.cn/", "")).addClass('ev-upSuccess').attr('data-id', elem.id).attr('data-oldpath', elem.attPath.replace("https://img05.allinmd.cn/", ""));
									// $('.czyx1', $(ele)).eq(elem.attPositionType - 1).css("background-image", 'url(' + elem.attPath + ')');
									if (elem.attPath && (elem.attPath.indexOf('jpg') != -1 || elem.attPath.indexOf('jpeg') != -1 || elem.attPath.indexOf('png') != -1 || elem.attPath.indexOf('PNG') != -1 || elem.attPath.indexOf('JPEG') != -1 || elem.attPath.indexOf('JPG') != -1)) {
										$('.certificatesPath', $(ele)).eq(elem.attPositionType - 1).val(elem.attPath.replace("https://img05.allinmd.cn/", "")).addClass('ev-upSuccess').attr('data-id', elem.id).attr('data-oldpath', elem.attPath.replace("https://img05.allinmd.cn/", ""));
										$('.czyx1', $(ele)).eq(elem.attPositionType - 1).css("background-image", 'url(' + elem.attPath + ')');
										$('.czyx1 input', $(ele)).eq(elem.attPositionType - 1).hide();
									} else {
										$('.czyx1 input', $(ele)).eq(elem.attPositionType - 1).show();
									}
									t.addMask($('.czyx1', $(ele)).eq(elem.attPositionType - 1));
								}
							})
						});
						//t.submit();
					}
				}
			});
		},
		//上传证件照片
		uploadAtt: function () {
			var t = this, uploadTime;
			$('p', $('.ev-upload')).hide();
			$('.czyx1').each(function (index, ele) {
				var _t = $(ele);
				_t.uploadImg({
					ajaxData: {
						url: "/call/comm/upload_attachment/upload/?_=" + Math.random() //文件处理的URL,
					},
					multiple: false,
					fileName: 'file',
					inputStyle: {
						"z-index": '1'
					},
					formData: {
						paramJson: $.toJSON({imageType: "2", domain: location.hostname})
					},
					fileChange: function (data) {
						if (data.files.length > 1) {
							alert("最多上传1张");
							$("input", $(ele)).val("");
							return false;
						}
					},
					fileSelected: function (file) {
						var type = file.type;
						if ((/(jpg)|(jpeg)|(png)$/i.test(type))) {
							var fileSize = file.size;
							if (fileSize > 10 * 1048576) {
								alert('图片不能大于10M');
								$("input", $(ele)).val("");
								return false;
							}
						} else {
							alert('只允许上传.jpg .jpeg .png类型的图片文件');
							$("input", $(ele)).val("");
							return false;
						}
					},
					uploadBefore: function (file) {
						$('p', $('.ev-upload')).hide();
						var cerUploadCon = $(ele).parents('.ev-cerUploadCon'), $this = $(ele);
						$('.ev-upload,.loadingAnimate ,.uploadPopup', cerUploadCon).show();
						file.progress = 0;
						var node = $('.loadingAnimate span', cerUploadCon);
						//假进程
						var step = 10;
						var count = 90;
						if (file.size > 4 * 1024 * 1024) {
							step = 1;
							count = 99;
						} else if (file.size > 2 * 1024 * 1024) {
							step = 5;
							count = 90;
						}
						file.timer = setInterval(function () {
							if (file.progress < count) {
								file.progress += step;
								node.text(file.progress + "%");
							} else {
								clearInterval(file.timer);
							}
						}, 50);
						uploadTime = setTimeout(function () {
							if (!$('.certificatesPath', cerUploadCon).hasClass('ev-upSuccess')) {
								$('.ev-upload,.loadingAnimate', cerUploadCon).hide();
								$('.ev-upload,p,.popupClose', cerUploadCon).show();
								$('.popupClose', cerUploadCon).on('click', function () {

									$('.certificatesPath', cerUploadCon).val('');
									$this.val('');
									$('.ev-upload,p,.popupClose', cerUploadCon).hide();
									t.secondSubmit();
								});
							}
						}, 2 * 60 * 1000)
					},
					uploadSuccess: function (serverJson, file) {
						$('.ev-upload,.loadingAnimate', $(ele).parents('.ev-cerUploadCon')).hide();
						serverJson = $.parseJSON($(serverJson)[1].data);
						// //console.log(serverJson)
						if (serverJson && serverJson.responseObject
							&& serverJson.responseObject.responseMessage.path !== "") {
							clearTimeout(uploadTime)
							$('input', $(ele)).hide();
							$(ele).parents('.ev-cerUploadCon').find('.certificatesPath').val(serverJson.responseObject.responseMessage.path).addClass('ev-upSuccess');
							$(ele).css("background-image", 'url(' + serverJson.responseObject.responseMessage.url + ')');
							if (comm.browser.isIe8()) {
								$(ele).css("filter", 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src=' + serverJson.responseObject.responseMessage.url + ',sizingMethod="scale")');
							}
							if (t.delAttIdList) {//判断是否是修改图片
								var dataId = $(ele).parents('.ev-cerUploadCon').find('.certificatesPath').attr('data-id');
								if (dataId) {
									$.each(t.delAttIdList, function (i, e) {
										if (e == dataId) {
											t.delAttIdList.splice(i, 1);
										}
									})
								}
							}
							t.addMask($(ele));
							t.submitCheck()
						} else {
							if (serverJson.message) {
								alert(serverJson.message);
							} else {
								$('.ev-upload,p,.popupClose', $(ele).parents('.ev-cerUploadCon')).show();
								$('.popupClose', $(ele)).off('click').on('click', function () {
									$('input', $(ele)).val('');
									$('.ev-upload,p,.popupClose', $(ele).parents('.ev-cerUploadCon')).hide();
								});
							}
						}

					},
					uploadFail: function (data) {

					}
				});
			});
		},
		//图片上传成功后悬浮显示蒙层
		addMask: function (ele) {
			var t = this;
			ele.bind("mouseover", function () {
				var certificatesPath = $('.certificatesPath', ele.parents('.ev-cerUploadCon'));
				if (certificatesPath.val()) {
					if ($("p", $(this)).css('display') == 'none') {
						//上传成功，蒙层消失
						$(".uploadPopup", $(this)).hide();
					}
					$(".ev-upload,.popupClose", $(this)).show();
					$(".popupClose", $(this)).on('click', function () {
						ele.unbind('mouseover mouseout');
						if (certificatesPath.attr('data-id') && t.delAttIdList.indexOf(certificatesPath.attr('data-id')) == -1) {
							t.delAttIdList.push(certificatesPath.attr('data-id'));
						}
						$('.certificatesPath', ele.parents('.ev-cerUploadCon')).val('').removeClass('ev-upSuccess');
						$('input', ele).show().val('');
						ele.css("background-image", 'url()');
						ele.css("background-image", 'url(//img10.allinmd.cn/authentication/camera-company.png)');
						$(this).hide();
						$(this).parents('.ev-upload').hide();
						t.submitCheck();
					});
				}
			}).bind("mouseout", function () {
				if ($("p", $(this)).css('display') == 'none') {
					//上传成功，蒙层消失
					$(".ev-upload", $(this)).hide();
				}
			});

		},
		//提交按钮状态判断
		submitCheck: function () {
			var submit = true;
			//console.log("check")
			$("#ev-next").attr("submit", "false").removeClass("active");
			if (!$("#fullName").val() || $("#fullName").hasClass('error')) {
				submit = false;
			}
			if (!$("#company").val()) {
				submit = false;
			}
			var successCertifiLength = $('.ev-attType').find(".ev-upSuccess").length;	// 已上传个数
			var allCertifiLength = $('.ev-attType').find(".certificatesPath").length;	// 总需上传个数
			//console.log(successCertifiLength,allCertifiLength);
			if(successCertifiLength < allCertifiLength){
				submit = false;
			}
			if (submit) {
				this.formValid = true;
				$(".submit").attr("submit", "true").addClass("active");
			}
		},
		bindSubmit:function(){
			var t = this;
			//console.log(this.formValid)
			$(".submit").on("click",function(){
				if(t.formValid){
					//console.log("submit")
					var company, companyId,fullName;
					fullName = $('input[name=fullName]').val();
					company = $('input[name=company]').val();
					companyId = $('input[name=company]').attr("companyId");
					var data = {
						visitSiteId:1,
						company:company,
						customerId:$("#sesCustomerId").val(),
						fullName:fullName,
						delAttIdList: t.delAttIdList.join(',')
					};

					if(companyId){
						data.companyId=companyId;
					}
					if(t.customerAuth && t.customerAuth.state == 0){ // 二次提交
						data.isCompleted = 0	// 是否二次提交
					}

					var indexUp = 0;
					$.each($('.ev-upload .loadingAnimate'), function (i, ele) {
						if ($(ele).css('display') == 'block') {
							$.topTip({mark: "warn", content: "图片正在上传中，请稍后"});
							indexUp++;
						}
					});
					if (indexUp) {
						return false;
					}

					var authAttList = [];
					var ele = $('.ev-attType');
					$('.ev-attType').find('.certificatesPath').each(function (indexC, eleC) {
						if ($(eleC).val()) {
							authAttList.push({
								attType: $(ele).find('.ev-dataAttType').attr('data-attType'),
								attPath: $(eleC).val() != $(eleC).attr('data-oldpath') ? $(eleC).val() : '',
								// attCode: $(ele).find('.attCode').val() ? $(ele).find('.attCode').val() : '',//以后需要证件号时再打开
								attPositionType: indexC + 1,
								isUpdate: $(eleC).attr('data-id') ? 1 : 0,
								id: $(eleC).attr('data-id') ? $(eleC).attr('data-id') : '_'
							});
						}
					});

					data.authAttList = JSON.stringify(authAttList);

					$.ajax({
						url:t.path.companyAuthSubmit,
						data:{paramJson:$.toJSON(data)},
						type:"POST",
						success:function(data){
							if(data && data.responseObject && data.responseObject.responseStatus){
								t.end();	// 提示提交成功
							}
						}

					})
				}
			})
		},

		//帮助
		helpAuth: function () {
			var t = this;
			var _customerRole = TempCache.getItem("customerRole");
			$('body').on('click', function (e) {
				if (!$(e.target).parents('#ev-medicalPar').length) {
					$('.ev-medicalConer').hide();
					$('#ev-medicalPar').removeClass('selectForce');
				}
				if ($(e.target).hasClass('ev-help')) {
					$('.ev-helpInfo').show();
				} else {
					$('.ev-helpInfo').hide();
					if ($(e.target).hasClass('ev-equity')) {
						var gradeBar = $(".al-auth-grade");
						gradeBar.show();
						$(".al-auth-grade-close").off("click").on("click", function () {
							gradeBar.hide();
						});
					}
				}
			});

		},
		//结束
		end: function () {
			var t = this;
			var contentCss = "text-align:center;text-indent: initial";
			var title = "认证审核需要1-3个工作日,请耐心等待";

			comm.surePop({
				icon: 1, //需要图标吗
				title: '提交成功',
				content: title,
				contentCss: contentCss,
				sureClass: 'sureClass',
				success: function () {
					if (document.referrer) {
						if (document.referrer.lastIndexOf("html") > -1) {
							if (document.referrer.indexOf("pages/singlePage/upload-case.html") > -1) {//来源页为病例发布页面，跳转回首页
								// setTimeout(function () {
								g_sps.jump(null, "/");
								// }, 500);
							} else {
								 setTimeout(function () {
									g_sps.jump(null, document.referrer);
								 }, 500)
							}
						} else {
							history.go(-1);
						}
					} else {
						 setTimeout(function () {
							g_sps.jump(null, "/");
						 }, 500)
					}
				},
				close: function () {
					if (document.referrer) {
						if (document.referrer.lastIndexOf("html") > -1) {
							if (document.referrer.indexOf("pages/singlePage/upload-case.html") > -1) {//来源页为病例发布页面，跳转回首页
								// setTimeout(function () {
								g_sps.jump(null, "/");
								// }, 500);
							} else {
								// setTimeout(function () {
								g_sps.jump(null, document.referrer);
								// }, 500)
							}
						} else {
							history.go(-1);
						}
					} else {
						 setTimeout(function () {
						 	g_sps.jump(null, "/");
						 }, 500)
					}
				}
			});
		}
	};
	newAuth.init();
});
