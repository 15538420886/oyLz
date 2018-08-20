﻿import React from 'react';

import { Table, Input } from 'antd';

class EditableCell extends React.Component {
  state = {
    value: this.props.value,
    editable: this.props.editable || false,
  }
    componentWillReceiveProps(nextProps) {
        if (nextProps.editable !== this.state.editable) {
            this.setState({ editable: nextProps.editable });
            if (nextProps.editable) {
                this.cacheValue = this.state.value;
            }
        }

        // console.log('nextProps=', nextProps, this.props)
        if (nextProps.status && nextProps.status !== this.props.status) {
            if (nextProps.status === 'cancel') {
                this.setState({ value: this.cacheValue });
            }
            else if (nextProps.status !== 'save') {
                this.setState({ value: nextProps.value });
            }

            if (nextProps.status === 'save') {
                this.props.onChange(this.state.value, nextProps.status);
            } else if (nextProps.status === 'cancel') {
                this.props.onChange(this.cacheValue, nextProps.status);
            }
        }
        else if( nextProps.isRefresh ){
            this.setState({ value: nextProps.value });
        }
    }
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.editable !== this.state.editable ||
           nextState.value !== this.state.value;
  }
  handleChange(e) {
    const value = e.target.value;
    this.setState({ value });
  }
  render() {
    //  console.log('this.state.value='+this.state.value);
    return (
      <div>
        {
          this.state.editable ?
            <div>
              <Input
                value={this.state.value}
                onChange={e => this.handleChange(e)}
              />
            </div>
            :
            <div className="editable-row-text">
              {this.state.value || ' '}
            </div>
        }
      </div>
    );
  }
}

export default EditableCell;
