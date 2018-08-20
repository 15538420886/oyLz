 import React from 'react';
 import { Table, Input, Icon, Button, Popconfirm } from 'antd';
 
 var EditableCell = React.createClass({
 	 getInitialState: function () {
 	 	 return{
 	 	 	 value: this.props.value,
             editable: false,
 	 	 }
          
      },
 
  handleChange:function(e){
    const value = e.target.value;
    this.setState({ value });
  },
  check:function() {
    this.setState({ editable: false });
    if (this.props.onChange) {
      this.props.onChange(this.state.value);
    }
  },
  edit:function(){
  
    this.setState({ editable: true });
  },
  render() {
   var value = this.state.value;
    const editable = this.state.editable;
    return (
      <div style={{position:'relative'}}>
        {
         this.state.editable ?
            <div style={{paddingRight: "24px"}}>
              <Input
                value={this.state.value}
                onChange={this.handleChange}
                onPressEnter={this.check}
                style={{width:'90%'}}
              />
              <Icon
                style={{cursor:'pointer',right:'0',width:'20px',position:'absolute',lineHeight:'2'}}
                type="check"
               
                onClick={this.check}
              />
            </div>
            :
            <div style={{paddingRight: "24px",padding:" 5px 24px 5px 5px"}} >
              {value || ' '}
              <Icon
                style={{cursor:'pointer'}}
                type="edit"
                style={{cursor:'pointer',right:'0',width:'20px',position:'absolute',lineHeight:'18px'}}
                onClick={this.edit}
              />
            </div>
        }
      </div>
    );
  }
});

export default EditableCell;
