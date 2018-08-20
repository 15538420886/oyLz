import React from 'react';

import {Form, Input, Select, Radio, DatePicker} from 'antd';
const {MonthPicker, RangePicker} = DatePicker;
const Search = Input.Search;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
var Common = require('../../public/script/common');
var Utils = require('../../public/script/utils');
import DictRadio from '../../lib/Components/DictRadio';
import DictSelect from '../../lib/Components/DictSelect';

import SearchEmployee from '../../hr/lib/Components/SearchEmployee';

module.exports = function(objName, isQueryForm){
	return {
        getField: function(field, layout, params){
            var itemOpts = {colon: true};
            if (layout !== undefined && layout !== null) {
                itemOpts['label'] = field.desc;
                if (isQueryForm !== true) {
                    itemOpts['required'] = (field.required === true) ? true : false;
                }
			}

            var hints = this.state.hints;
            if (hints !== undefined) {
                itemOpts['help'] = hints[field.id + 'Hint'];
                itemOpts['validateStatus'] = hints[field.id + 'Status'];
            }

			// 创建对象
			var obj = null;
            if(field.type === 'text'){
                obj = this.getTextField(field, params);
            }
			else if(field.type === 'month'){
                obj = this.getMonthField(field, params);
            }
			else if(field.type === 'date'){
                obj = this.getDateField(field, params);
            }
			else if(field.type === 'radio'){
				var opts = field.opts;
				if(opts !== undefined && opts !== null && opts !== ''){
					if(opts.charAt(0) !== '#'){
                		obj = this.getRadioField(field, params);
					}
					else{
						obj = this.getDictRadioField(field, params);
					}
				}
            }else if(field.type === 'select'){
				var opts = field.opts;
				if(opts !== undefined && opts !== null && opts !== ''){
					if(opts.charAt(0) !== '#'){
                		obj = this.getSelectField(field, params);
					}
					else{
						obj = this.getDictSelectField(field, params);
					}
				}
            }


			// 包装
			if(obj !== null){
	            return(
	                <FormItem {...layout} {...itemOpts}>
	                    {obj}
	                </FormItem>
	            );
			}
        },
        getTextField: function(field, params){
            var fieldOpts = {name: field.id, id: field.id, onChange:this.handleOnChange};
            var obj = this.state[objName];
            fieldOpts['value'] = obj[field.id];

            if(params !== undefined && params !== null){
        		for(var name in params){
                    try {
        				fieldOpts[name] = params[name];
        			}catch(E){}
        		}
            }

            return <Input type="text" {...fieldOpts}/>;
        },
        getMonthField: function(field, params){
            var fieldOpts = {name: field.id, id: field.id, format:Common.monthFormat};
            var obj = this.state[objName];
            fieldOpts['value'] = this.formatMonth(obj[field.id], Common.monthFormat);
			fieldOpts.style = {width:'100%'};
			fieldOpts.onChange = this.handleOnSelMonth.bind(this, field.id, Common.monthFormat)

            if(params !== undefined && params !== null){
        		for(var name in params){
                    try {
        				fieldOpts[name] = params[name];
        			}catch(E){}
        		}
            }

            return <MonthPicker {...fieldOpts}/>;
		},
        getDateField: function(field, params){
            var fieldOpts = {name: field.id, id: field.id, format:Common.dateFormat};
            var obj = this.state[objName];
            fieldOpts['value'] = this.formatDate(obj[field.id], Common.dateFormat);
			fieldOpts.style = {width:'100%'};
			fieldOpts.onChange = this.handleOnSelDate.bind(this, field.id, Common.dateFormat)

            if(params !== undefined && params !== null){
        		for(var name in params){
                    try {
        				fieldOpts[name] = params[name];
        			}catch(E){}
        		}
            }

            return <DatePicker {...fieldOpts}/>;
		},
        getDictRadioField: function(field, params){
            var fieldOpts = {name: field.id, id: field.id};
            var obj = this.state[objName];
            fieldOpts['value'] = obj[field.id];
			fieldOpts.onChange = this.onRadioChange;

			var opts = field.opts.substr(1);
			var pos = opts.indexOf('.');
			if(pos <= 0){
				return;
			}

			fieldOpts.appName = opts.substr(0, pos);
			fieldOpts.optName = opts.substr(1+pos);

            if(params !== undefined && params !== null){
        		for(var name in params){
                    try {
        				fieldOpts[name] = params[name];
        			}catch(E){}
        		}
            }

            return <DictRadio {...fieldOpts}/>;
		},

        getRadioField: function(field, params){
            var fieldOpts = {name: field.id, id: field.id};
            var obj = this.state[objName];
            fieldOpts['value'] = obj[field.id];
			fieldOpts.onChange = this.onRadioChange;

            if(params !== undefined && params !== null){
        		for(var name in params){
                    try {
        				fieldOpts[name] = params[name];
        			}catch(E){}
        		}
            }

			// 选择项
			var radioList = [];
			var opts = field.opts.split(';');
			opts.map((opt, i) => {
	            var pos = opt.indexOf('=');
				if(pos > 0){
					var value = opt.substr(0, pos);
					var name = opt.substr(1+pos);
					radioList.push( <Radio value={value}>{name}</Radio> );
				}
				else{
					radioList.push( <Radio value={opt}>{opt}</Radio> );
				}
	        });

            return <RadioGroup {...fieldOpts}>{radioList}</RadioGroup>;
		},

		getDictSelectField : function(field, params){
			var fieldOpts = {name: field.id, id: field.id};
            var obj = this.state[objName];
            fieldOpts['value'] = obj[field.id];
			fieldOpts.onSelect = this.handleOnSelected.bind(this, field.id);

			var opts = field.opts.substr(1);
			var pos = opts.indexOf('.');
			if(pos <= 0){
				return;
			}

			fieldOpts.appName = opts.substr(0, pos);
			fieldOpts.optName = opts.substr(1+pos);

            if(params !== undefined && params !== null){
        		for(var name in params){
                    try {
        				fieldOpts[name] = params[name];
        			}catch(E){}
        		}
            }

            return <DictSelect {...fieldOpts}/>;

		},

		getSelectField : function(field, params){
			var fieldOpts = {name: field.id, id: field.id};
            var obj = this.state[objName];
            fieldOpts['value'] = obj[field.id];
			fieldOpts.onSelect = this.handleOnSelected.bind(this, field.id);

            if(params !== undefined && params !== null){
        		for(var name in params){
                    try {
        				fieldOpts[name] = params[name];
        			}catch(E){}
        		}
            }

			// 选择项
			var selectList = [];
			var opts = field.opts.split(';');
			opts.map((opt, i) => {
	            var pos = opt.indexOf('=');
				if(pos > 0){
					var value = opt.substr(0, pos);
					var desc = opt.substr(1+pos);
					if(value === desc){
						selectList.push( <Option key={value} value={value}>{desc}</Option> );
					}else{
						selectList.push( <Option key={value} value={value}>{value}-{desc}</Option> );
					}
				}
				else{
					selectList.push( <Option key={opt} value={opt}>{opt}</Option> );
				}
	        });


            return <Select {...fieldOpts}>{selectList}</Select>;

		},

        getOptionName2: function (opts, value, showCode){
			var text = '';
			var optsObj = {};
			var opts = opts.split(';');
			opts.map((opt, i) => {
	            var pos = opt.indexOf('=');
				if(pos > 0){
					var value = opt.substr(0, pos);
					var desc = opt.substr(1+pos);
                    if (showCode && value !== desc) {
                        text = value + '-' + desc;		
                    }
                    else {
                        text = value;			
					}
				}
				else{
					text = value;
				}
	        });

			return text;
		},

        getColumn: function(field, width, render){
			var obj = {
				title: field.desc,
				dataIndex: field.id,
				key: field.id,
				width: width,
			};

			if(render !== undefined && render !== null){
				obj.render = render;
				return obj;
			}

			else if(field.type === 'month'){
                obj.render = (text, record) => (Common.formatMonth(text, Common.monthFormat));
            }
			else if(field.type === 'date'){
                obj.render = (text, record) => (Common.formatDate(text, Common.dateFormat));
            }
			else if(field.type === 'radio' || field.type === 'select'){
                var opts = field.opts;
                var showCode = field.showCode;
                if (showCode !== false) {
                    showCode = true;
                }

				if(opts !== undefined && opts !== null && opts !== ''){
					if(opts.charAt(0) !== '#'){
                        obj.render = (text, record) => (this.getOptionName2(opts, record[field.id], showCode));
					}
					else{
						opts = opts.substr(1);
						var pos = opts.indexOf('.');
						if(pos > 0){
							var appName = opts.substr(0, pos);
							var optName = opts.substr(1+pos);
                            obj.render = (text, record) => (Utils.getOptionName(appName, optName, record[field.id], showCode, this));
						}
					}
				}
            }

			return obj;
        },
	};
};
