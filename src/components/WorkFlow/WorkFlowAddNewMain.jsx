import React, { Component } from 'react';
import WorkFlowAddNew from './WorkFlowAddNew';
import WorkFlowAddNewForMore from './WorkFlowAddNewForMore';

export default class WorkFolwAddNewMain extends Component {
    constructor() {
        super();
        this.state = {
            work_flow_type: 1
        }
    }

    changeWorkFlow = event => {
        this.setState({
            work_flow_type: event.value
        })
    }

    render() {
        return (
            this.state.work_flow_type === 1 ? <WorkFlowAddNew type={this.state.work_flow_type} showToast={this.props.showToast} changeWorkFlow={this.changeWorkFlow} />
                : <WorkFlowAddNewForMore type={this.state.work_flow_type} showToast={this.props.showToast} changeWorkFlow={this.changeWorkFlow} />
        )
    }
}