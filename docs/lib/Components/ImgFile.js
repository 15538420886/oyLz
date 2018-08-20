import React, {PropTypes} from 'react'
var Utils = require('../../public/script/utils');

var ImgFile = React.createClass({
    getInitialState: function(){
        return {
            files:[],
            uploadHistory:[],
            multiple:true,
            lookShow:false
        }
    },
    handleChange: function(e){
        e.preventDefault();
        let target = e.target;
        let files = target.files;
        console.log('startInput',files);

        let count = this.state.multiple ? files.length : 1;
        for(let i = 0;i < count;i++){
            files[i].url = URL.createObjectURL(files[i]);
        }

        //转换为真正的数组
        files = Array.prototype.slice.call(files,0);
        files = files.filter(file=>{
            return /image/i.test(file.type);
        })

        console.log('files',files);
        this.setState({
            files:this.state.files.concat(files)
        })
    },

    watchImageInServer: function(index){
    	console.log('watchImageInServer');
        this.setState({
            lookShow:true,
            imgIndex:index
        })
    },
    handleDragHover: function(e){
        e.stopPropagation()
        e.preventDefault()
    },
    handleDrop: function(e){
        this.handleDragHover(e);
        let files = e.target.files || e.dataTransfer.files;
        let count = this.state.multiple ? files.length : 1;

        for(let i = 0;i < count;i++){
            files[i].url = URL.createObjectURL(files[i]);
        }

        files = Array.prototype.slice.call(files,0);
        files = files.filter(file => {
            return /image/i.test(file.type)
        })

        this.setState({files:this.state.files.concat(files)});
    },
    renderImages: function(){
        const {files} = this.state
        if (files.length > 0){
            return files.map((item,index)=>{
                return(
                    <div className='selectImagesDiv' key={index}>
                    <div>{item.name}</div>
                    <img src={item.url} style={{width:100,marginLeft:15,height:100}}/>
                    </div>
                )
            })
        }else{
            return false
        }
    },
    renderUploadInfo: function(){
        const {uploadHistory} = this.state
        console.log(uploadHistory);
        if(uploadHistory.length > 0){
            return uploadHistory.map((item,index)=>{
                return (
                    <div className='uploadHistoryDiv' key={index}>
                    上传成功，图片地址是
                    <div className='uploadUrlDiv'>
                    {item}
                    </div>
                    <button style={{marginLeft:4}} type='button' onClick={()=>this.watchImageInServer(index)}>查看</button>
                    </div>
                )
            })
        }

        return false
    },
    handleUpload: function(e,hl){
    	var data={uuid: '12345678'};
    	Utils.doUploadService('http://127.0.0.1:23801/fileService/upload', data, this.state.files).then(function(result) {
			console.log('data',data);
            if(data.code == 0){
                hl.setState({
                    uploadHistory:data.result.urls
                })
            }
		}, function(value){
			console.log(value);
		});
    },

    render: function(){
        return(
            <div ref='head' className='uploadContainer' style={{backgroundColor:'white'}}>
                <div className='uploadBox'>
                    <input type='file' onChange={(v)=>this.handleChange(v)} accept='image/*' name='fileSelect' multiple={this.state.multiple}/>
                    <span ref='dragBox' onDragOver={(e)=>this.handleDragHover(e)} onDragLeave={(e)=>this.handleDragHover(e)} onDrop={(e)=>this.handleDrop(e)} className='dragBox'>
                        或将图片拖到此处
                    </span>
                </div>
                <div className={this.state.files.length > 0 ? "showImage":"none"}>
                    {this.renderImages()}
                </div>
                <div className={this.state.files.length > 0 ? "uploadBtnBox":"none"}>
                    <button type='button' onClick={(e)=>this.handleUpload(e,this)}>确认上传图片</button>
                </div>
                <div>
                    {this.state.uploadHistory.length > 0 ? this.renderUploadInfo():false}
                </div>

                {this.state.lookShow && this.state.uploadHistory.length > 0 ?
                    <div className='lookImageBack' onClick={()=>this.setState({lookShow:false})}>
                    <div className='lookImageDiv'></div>
                    <img className={this.state.lookShow && this.state.uploadHistory.length > 0 ? 'lookImage imgScale':'lookImage'} src={this.state.uploadHistory[this.state.imgIndex]}/>
                    </div>
                : false}
            </div>
        )
    }

});

module.exports = ImgFile;

