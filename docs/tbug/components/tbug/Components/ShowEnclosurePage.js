﻿import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
var $ = require('jquery');
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
var Utils = require('../../../../public/script/utils');
var Common = require('../../../../public/script/common');

import { Form, Modal, Button, Input, Select, Row, Col, Icon, Upload, message, Checkbox } from 'antd';
import ColumnGroup from 'antd/lib/table/ColumnGroup';
const Search = Input.Search;
const FormItem = Form.Item;
const Option = Select.Option;

var TmBugStore = require('../data/TmBugStore.js');
var TmBugActions = require('../action/TmBugActions');


var ShowEnclosurePage = React.createClass({
	getInitialState : function() {
		return {
			tmBugSet: {
				operation : '',
				errMsg : ''
			},
			loading: false,
			modal: false,
			visible:false,
			tmBug: {},//全部数据
			InTmBug:'',//"传入的数据"
			isHTML:'',//是否显示选择框
			hints: {},
			tmBugPice:[],//大图路径
			tmBugPiceList:[],//大图路径列表
			BigpriceUrl:'',//全屏大图路径
			Bigprice:"预览失败",
			BigpriceName:{},//大图文件名
			validRules: [],
			AllDownLoad:[]//全部下载文件列表
		}
	},

	mixins: [Reflux.listenTo(TmBugStore, "onServiceComplete"), ModalForm('tmBug')],
	onServiceComplete: function(data) {
	  if(this.state.modal && data.operation === 'create'){
	      if( data.errMsg === ''){
	          // 成功，关闭窗口
	          this.setState({
	              modal: false
	          });
	      }
	      else{
	          // 失败
	          this.setState({
	              loading: false,
	              tmBugSet: data
	          });
	      }
	  }
	},

	initPage: function(tmBug)
	{
		this.setState({
			Bigprice:"",
			tmBug:"",
			BigpriceName:""
		})

		this.state.InTmBug = tmBug;

		var self = this;
		this.state.hints = {};
		this.state.loading = false;
		this.state.tmBugSet.operation='';
		if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
			this.refs.mxgBox.clear();
		}
		var url = "http://10.10.10.201:8082/defect_s/bug-attach-upload/findpicbyid3?uuid="+tmBug.uuid;
		$.get(url).done(function(data){
			var temp = data.list;
			if (temp.length != 0){
				//图片渲染

				//假图片
				var url = "http://icons.iconarchive.com/icons/zhoolego/material/512/Folder-Doc-icon.png";
				var name = temp[0].name;
				var length = temp[0].length;
				var index = name.lastIndexOf(".");
				var str = name.slice(index + 1, length);

				if (str == "jpeg" || str == "jpg"){
					var html = <a title="点击下载"><img name={temp[0].name} data-uid={temp[0].uid} data-downloadUrl={temp[0].downloadUrl} id="Pice" data-index="0" data-fullPath={temp[0].fullPath} src={temp[0].url} style={{ height: "100%" }} onClick={self.fileDwonLoad} /></a>;
				}else{
					var html = <a title="点击下载"><img name={temp[0].name} data-uid={temp[0].uid} data-downloadUrl={temp[0].downloadUrl} id="Pice" data-index="0" data-fullPath={temp[0].fullPath} src={url} style={{ height: "100%" }} onClick={self.fileDwonLoad} /></a>;
				}
				
				var name = temp[0].name;
				self.setState({
					tmBug: temp,
					Bigprice: html,
					BigpriceName: name
				})
				var list = [];
				for (var i = 0; i < temp.length; i++) {
					var name = temp[i].name;
					var length = temp[i].length;
					var index = name.lastIndexOf(".");
					var str = name.slice(index + 1, length);
					if(str == "jpeg" || str == "jpg"){
						list.push({ url: temp[i].url, load: temp[i].url, name: temp[i].name, uid: temp[i].uid, fullPath: temp[i].fullPath, downloadUrl:temp[i].downloadUrl });
					}else{
						list.push({ url: url, load: temp[i].url, name: temp[i].name, uid: temp[i].uid, fullPath: temp[i].fullPath, downloadUrl: temp[i].downloadUrl });
					}
				};
				self.setState({
					tmBugPiceList: list,
					tmBugPiceList2: list
				})
			} else if (temp.length  == 0){
				self.setState({
					tmBugPiceList: [],
					tmBugPiceList2: null
				})
			}
		})
	},
	//单文件点击下
	fileDwonLoad:function(e) {
		var url = e.target.getAttribute("data-downloadurl");
		var el = document.createElement("a");
		el.href = url;
		el.click();
	},
	//点击显示大图
	showImage: function(e){
		var target = e.target;
		var name = target.name;
		var load = target.getAttribute("data-load");
		var fullPath = target.getAttribute("data-fullpath");
		var downloadUrl = target.getAttribute("data-downloadUrl")
		var index = target.getAttribute("data-index")
		var html = <a title="点击下载"><img id="Pice" name={name} data-fullPath={fullPath} data-downloadUrl={downloadUrl} data-load={load} data-index={index} src={target.src} style={{height:"100%"}} onClick={this.fileDwonLoad}/></a>;
		this.setState({
			Bigprice:html,
			BigpriceName:name
		})
	},
	
	//删除
	deleImage:function(e){
		var self = this;
		var target = e.target;
		var uid = target.previousSibling.getAttribute("data-uid");
		var url = "http://10.10.10.201:8082/defect_s/bug-attach-upload/delpicbyid?uuid="+uid;
		$.get(url,'').done(function () {
			message.success("删除成功");
			self.initPage(self.state.InTmBug);
		})
	},
	//上一张
	UpPice:function(e){
		var Pice = document.querySelector("#Pice");
		var index = Pice.getAttribute("data-index");
		var fullPath = Pice.getAttribute("data-fullpath");
		var UpPiceindex = parseInt(index - 1);
		var UpPice = 0;
		if (this.state.tmBug.length != this.state.tmBugPiceList.length) {
			UpPice = this.state.tmBugPiceList[UpPiceindex];
		} else {
			UpPice = this.state.tmBug[UpPiceindex];
		}
		
		if (UpPice == undefined){
			message.warning("已经是第一张了");
		} else{
			//假图片
			var url = "http://icons.iconarchive.com/icons/zhoolego/material/512/Folder-Doc-icon.png";
			var length = UpPice.name.length;
			var index = UpPice.name.lastIndexOf(".");
			var str = UpPice.name.slice(index + 1, length);
			var html = '';
			if (str == "jpeg" || str == "jpg") {
				html = <a title="点击下载"><img id="Pice" name={UpPice.name} data-fullPath={fullPath} data-downloadUrl={UpPice.downloadUrl} data-load={UpPice.url} data-index={UpPiceindex} src={UpPice.url} style={{ height: "100%" }} onClick={this.fileDwonLoad} /></a>;
			}else{
				html = <a title="点击下载"><img id="Pice" name={UpPice.name} data-fullPath={fullPath} data-downloadUrl={UpPice.downloadUrl} data-load={UpPice.url} data-index={UpPiceindex} src={url} style={{ height: "100%" }} onClick={this.fileDwonLoad} /></a>;
			}
			
			this.setState({
				Bigprice: html,
				BigpriceName: UpPice.name
			})
		}
	},
	//下一张
	DownPice:function(e){
		var Pice = document.querySelector("#Pice");
		var index = Pice.getAttribute("data-index");
		var UpPiceindex = parseInt(index)+1;
		var UpPice = 0;
		if(this.state.tmBug.length != this.state.tmBugPiceList.length){
			UpPice = this.state.tmBugPiceList[UpPiceindex];
		}else{
			UpPice = this.state.tmBug[UpPiceindex];
		}
	
		if (UpPice == undefined) {
			message.warning("已经是最后一张了");
		} else {
			var fullPath = UpPice.fullPath;
			var url = "http://icons.iconarchive.com/icons/zhoolego/material/512/Folder-Doc-icon.png";
			var length = UpPice.name.length;
			var index = UpPice.name.lastIndexOf(".");
			var str = UpPice.name.slice(index + 1, length);
			var html = '';
			if (str == "jpeg" || str == "jpg") {
				html = <a title="点击下载"><img id="Pice" name={UpPice.name} data-fullPath={fullPath} data-downloadUrl={UpPice.downloadUrl} data-load={UpPice.url} data-index={UpPiceindex} src={UpPice.url} style={{ height: "100%" }} onClick={this.fileDwonLoad} /></a>;
			} else {
				html = <a title="点击下载"><img id="Pice" name={UpPice.name} data-fullPath={fullPath} data-downloadUrl={UpPice.downloadUrl} data-load={UpPice.url} data-index={UpPiceindex} src={url} style={{ height: "100%" }} onClick={this.fileDwonLoad} /></a>;
			}
			this.setState({
				Bigprice: html,
				BigpriceName: UpPice.name
			})
		}
	},
	
	//大图预览
	Enlarge:function(){
		var el = document.querySelector("#Pice")
		var url = el.src;
		var length = el.name.length;
		var index = el.name.lastIndexOf(".");
		var str = el.name.slice(index + 1, length);
		if(str == "jpeg" || str == "jpg"){
			this.setState({
				visible:true,
				BigpriceUrl:url
			})
		}else{
			message.error("暂不支持此类行文件预览");
		}
	},
	//是否选中
	isActive: function (e, index) {
		e.preventDefault();
		var el = e.target;
		var index = el.getAttribute("data-index") || index;
		var fullpath = el.getAttribute("data-fullpath");
		var checked = el.getAttribute("data-checked");
		if (el.nodeName != "I") {
			if (checked) {
				$(".checkDownLoad")[index].style.display = "block";
				this.state.AllDownLoad.push(this.state.tmBug[index].fullPath);
			} else {
				$(".checkDownLoad")[index].style.display = "none";
				this.state.AllDownLoad.splice(this.state.tmBug[index].fullPath, 1);
			}
		}
	},
	//全选
	isAllDownLoad:function(e) {
		e.stopPropagation();
		var check = e.target.checked;
		var temp = $(".checkDownLoad");
		if(check){
			for (let i = 0; i < temp.length; i++) {
				$(".checkDownLoad")[i].style.display = "block";
			}
			this.state.tmBug.forEach((tmBug,index) => {
				this.state.AllDownLoad.push(tmBug.fullPath);
			});
		}else{
			for (let i = 0; i < temp.length; i++) {
				$(".checkDownLoad")[i].style.display = "none";
			}
			this.state.AllDownLoad = [];
		}
	
	},
	//多附件下载
	AllDownLoad:function() {
		var self = this;
		var url = "http://10.10.10.201:8082/defect_s/bug-attach-upload/batchdownloadfile";
		var AllDownLoad = this.state.AllDownLoad;
		if(AllDownLoad.length < 1){
			message.info("最少选中一个附件");
		}else{
			var data = { flowNo: "1", object: AllDownLoad }
			$.ajax({
				type: "POST",
				url: url,
				data: JSON.stringify(data),
				crossDomain:true,
				contentType: "application/json",
			}).done(function (data) {
				self.loadZip(data);
			});
		}
	},
	//zip包下载
	loadZip: function (data){
		var url = "http://10.10.10.201:8082/defect_s/bug-attach-upload/dowanloadmore?filepath=" + data; 
		var el = document.createElement("a");
		var str = url.toString();
		el.href = str;
		el.click();
	},
	handleCancel: function () {
		this.setState({
			visible: false
		})
	},
	//搜索
	Search:function(e){
		var el = e || e.target;
		var List = this.state.tmBugPiceList;
		if(!el){
			this.setState({
				tmBugPiceList: this.state.tmBugPiceList2
			})
		}else{
			var newList = [];
			List.forEach((item, index) => {
				if (item.name.indexOf(el) != -1) {
					newList.push(item);
				}
			});
			if(newList.length > 0){
				var name = newList[0].name;
				var fullpath = newList[0].fullPath;
				var downloadUrl = newList[0].downloadUrl;
				var load = newList[0].downloadUrl.load;
				var url = newList[0].url;
				var html = <a title="点击下载"><img id="Pice" name={name} data-fullPath={fullpath} data-downloadUrl={downloadUrl} data-load={url} data-index="0" src={url} style={{ height: "100%" }} onClick={this.fileDwonLoad} /></a>;
				this.state.tmBugPiceList = newList;
				this.setState({
					Bigprice:html,
					BigpriceName:name
				})			
			}
		};
	},
	render : function(){
		//个别自定样式
		var circle1 = {
			position: "absolute",
			border: "1px solid rgb(153, 153, 153)",
			top: "50%",
			width: "36px",
			left:"10px",
			marginTop: "-18px",
			height: "36px",
			borderRadius: "50%",
			outline: "none",
			borderRadius: "50%",
			background: "rgb(255, 255, 255)",
			cursor: "pointer",
		}
		var circle2 = {
			position: "absolute", 
			border: "1px solid rgb(153, 153, 153)",
			top: "50%",
			width: "36px", 
			right:"10px",
			marginTop:"-18px",
			height: "36px",
			borderRadius: "50%",
			outline: "none",
			borderRadius: "50%",
			background: "rgb(255, 255, 255)",
			cursor: "pointer",
		}

		var self = this;
		var list = this.state.tmBugPiceList;
		this.state.tmBugPice = list.map(function (item,index) {
			return (<li data-index={index} data-checked='true' onClick={self.isActive} style={{ overflow: "hidden", position: "relative", padding: "0", margin: "10px", textAlign: "center" }} >
				<img src={item.url} name={item.name} data-checked='true' data-downloadUrl={item.downloadUrl} data-load={item.load} data-uid={item.uid} data-index={index} data-fullPath={item.fullPath} style={{ paddingTop: "8px", width: "80%", display: "inline-block" }} onClick={self.showImage} />
				<Icon style={{ position: "absolute", color: "red", right: "4px", top: "2px", fontSize: "16px" }} type="minus-circle" onClick={self.deleImage} />
				<p style={{position:"relative",textAlign:"center"}}>
					<span style={{paddingLeft:"10px"}}>{item.name}</span>
				</p>
				<div className="checkDownLoad" data-index={index} style={{position:"absolute",display:"none",left:"0",right:"0",top:"0",bottom:"0"}}>
					<span style={{position:"absolute",top:"0",bottom:"0",right:"0",left:"0",margin:"auto",width:"32px",height:"32px",display:"block"}}><Icon type="check-circle" style={{fontSize:"32px",color:"green"}}/></span>
				</div>
			</li>);
		})

		var layout='horizontal';
		var layoutItem='form-item-'+layout;
		const formItemLayout = {
            labelCol: ((layout == 'vertical') ? null : { span: 8 }),
            wrapperCol: ((layout == 'vertical') ? null : { span: 16 }),
        };
		const formItemLayout2 = {
            labelCol: ((layout == 'vertical') ? null : { span: 4}),
            wrapperCol: ((layout == 'vertical') ? null : { span: 20 }),
		};
		

		var hints=this.state.hints;
		
		//附件上传
		const props = {
			name: 'file',
			multiple: true,
			action: 'http://10.10.10.201:8082/defect_s/bug-attach-upload/upload?uuid='+this.state.InTmBug.uuid,
			onChange(info) {
				if (info.file.status !== 'uploading') {
					var el = document.querySelector('.ant-upload-list.ant-upload-list-text');
					$(el).remove();
					self.initPage(self.state.InTmBug);
				}
				if (info.file.status === 'done') {
					message.success(`${info.file.name} file uploaded successfully`);
				} else if (info.file.status === 'error') {
					message.error(`${info.file.name} file upload failed.`);
				}
			},
		};
		return (
			<Modal visible={this.state.modal} width='840px' title="附件预览" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
			  footer={[
			  	<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
			   		<Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
			   </div>
			  ]}
			>
		   	<div style={{width:"100%",height:"100%",display:"flex","marign":"0","padding":"0"}}>
					<div style={{ flex: "1", height: "380px", overflow: "auto",position:"relative"}}>
						<div style={{ overflow: "hidden", background: "#fff",zIndex:"999",position:"absolute"}}>
			  				<span style={{lineHeight:"30px"}}>缩略图</span>
							<span style={{ float: "right" }}>
								<Checkbox onChange={this.isAllDownLoad} style={{ marginLeft:"6px"}}></Checkbox>
								<Button icon="download" onClick={this.AllDownLoad} title="多附件下载"/>
							</span>
			  				<span style={{float:"right"}}>
								<div style={{ float: "left" }}>
									<Upload {...props}  style={{ marginLeft: '4px', float: 'right'}} >
										<Button icon={Common.iconAdd} type="primary" shape="circle" title="上传附件" style={{ float: 'right'}} ></Button>
									</Upload>
								</div>
							</span>
						
							<Search
								placeholder="input search text"
								onSearch={this.Search}
								onChange={this.Search}
								style={{ width: "100%", paddingTop: "2px"}}
							/>
						</div>
							<ul className="am-pre-scrollable" style={{ height: "380px", overflow: "auto", paddingTop: "80px"}}>
								{this.state.tmBugPice ? this.state.tmBugPice:"暂无附件"}
							</ul>
				    </div>
					<div style={{ flex: "4", overflow:"hidden",textAlign:"center",height:"380px",display:"flex",flexDirection:"column"}}>
						<div style={{ flexBasis: "38px", margin: "4px 2px", position: "relative", textAlign:"left",paddingLeft:"20px"}}>
							<span style={{lineHeight: "30px", width: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace:"nowrap"}}>文件名:{this.state.BigpriceName}</span>
							<div style={{position:"absolute",right:"40%",top:"0"}}>
								<Button icon="eye" onClick={this.Enlarge} title="查看大图" style={{ fontSize: "18px" }}></Button>
							</div>
					   </div>
						<div style={{ flex: 1, overflow:"hidden",position:"relative"}}>
							<button title="上一张" style={circle1} onClick={this.UpPice}><Icon type="left" /></button>
							{this.state.Bigprice?this.state.Bigprice:""}
							<button title="下一张" style={circle2} onClick={this.DownPice}><Icon type="right" /></button>
							<Modal
								title={null}
								visible={this.state.visible}
								width="860px"
								footer={null}
								onCancel={this.handleCancel}
							>
								<div style={{width:"100%",height:"100%"}}>
			  						<img src={this.state.BigpriceUrl} style={{width:"100%",height:"100%"}}/>
								</div>	
							</Modal>
					   </div>
				   </div>
			</div>
			</Modal>
		);
	}
});

export default ShowEnclosurePage;