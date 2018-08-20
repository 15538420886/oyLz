import React from 'react';
var Utils = require('../../public/script/utils');

import {Radio, Spin} from 'antd';
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

const verticalStyle = {
	display: 'block',
	height: '30px',
	lineHeight: '30px',
};
var DictRadio = React.createClass({
    getInitialState : function() {
        return {
            opts: [],
            loading: false
        }
    },

    showOptions: function(opts){
        var values = opts.codeData;
        if(values === null || typeof(values) === 'undefined'){
            values = [];
        }

        this.setState( {
            opts: values,
            loading: false
        } );
    },
    componentWillMount : function(){
        const {
            appName,
            optName,
        } = this.props;

        this.state.loading = true;
        Utils.loadOptions(appName, optName, this.showOptions);
        console.log('1111111111111111')
        console.log(Utils.loadOptions(appName, optName, this.showOptions))
    },
    render : function(){
        const {
            appName,
            optName,
            showCode,
            layout,
            radioStyle,
			type,
            id,
            ...attributes,
        } = this.props;

        var rStyle = radioStyle;
        if(layout === 'vertical'){
            if(rStyle === null || typeof(rStyle) === 'undefined'){
                rStyle = verticalStyle;
            }
        }

        var opts;
        if(showCode){
            opts = this.state.opts.map((item, i) => {
                return (type === 'button') ?
					<RadioButton id={id} key={item.codeValue} style={rStyle} value={item.codeValue}>{item.codeValue}-{item.codeDesc}</RadioButton>
					: <Radio id={id} key={item.codeValue} style={rStyle} value={item.codeValue}>{item.codeValue}-{item.codeDesc}</Radio>
            });
        }
        else{
            opts = this.state.opts.map((item, i) => {
                return (type === 'button') ?
					<RadioButton id={id} key={item.codeValue} style={rStyle} value={item.codeValue}>{item.codeDesc}</RadioButton>
					: <Radio id={id} key={item.codeValue} style={rStyle} value={item.codeValue}>{item.codeDesc}</Radio>
            });
        }

        var obj = <RadioGroup id={id} {...attributes}>
            {opts}
          </RadioGroup>

        return this.state.loading ? <Spin>{obj}</Spin> : obj;
  }
});

export default DictRadio;
