import React, { Component } from 'react';
import { main_url, getUserId } from '../../utils/CommonFunction';
import LeaveManagementTable from './LeaveManagementTable';
import LeaveManagementView from './LeaveManagementView';
import LeaveManagementEdit from './LeaveManagementEdit';
import CancelLeaveEdit from './CancelLeaveEdit';
import NewLeave from './NewLeave';
import LeaveReport from './LeaveReport';
import LeaveBalance from './LeaveBalance';
import CalculateEarnLeave from './CalculateEarnLeave'
// import {LeaveView} from './LeaveView';
const $ = require('jquery');
export default class LeaveManagementMain extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user_id: getUserId('user_info'),
            leaveCategory: [],
            verifyBy: [],
            approvedBy: [],
            isTable: true,
            // data: [],
            active_tab: 2, // 0 for myleave list, 1 for newmyleave, 2 for allleave list, 3 for new allleave, 4 for leave reprot, 5 for leave balance
            isHR: '',
           
        }
    }

    componentDidMount() {
        // this.getEmployeeList();

        fetch(`${main_url}leave/getHR`)
            .then(response => response.json())
            .then(data =>
                this.setState({ isHR: data.map(v => v.user_id).find(v => v === this.state.user_id) }));
    }



    changeTab(tab) {
        this.setState({ active_tab: tab, isView: false, isEdit: false, isCancel: false })
    }

    goToViewForm = (data) => {
        this.setState({
            data: data,
            isAddNew: false,
            isEdit: false,
            isView: true,
            isTable: false,
            isCancel: false
        })
    }

    goToEditForm = (data) => {
        this.setState({
            data: data,
            isAddNew: false,
            isEdit: true,
            isView: false,
            isTable: false,
            isCancel: false
        })
    }

    goToCancelForm = (data) => {
        this.setState({
            data: data,
            isAddNew: false,
            isEdit: false,
            isView: false,
            isTable: false,
            isCancel: true
        })
    }



    render() {
        let { active_tab } = this.state;
        return (
            <div>
                {this.state.isTable ?
                    <div className="row wrapper border-bottom white-bg page-heading">
                        <div className="col-lg-10">
                            <h2>HR Management System</h2>
                            <ol className="breadcrumb">
                                <li>{active_tab === 2 ? "All Leave" : active_tab === 0 ?
                                    "My Leave" : active_tab === 4 ? "Leave Report" : "Leave Balance"
                                }</li>
                            </ol>
                        </div>
                    </div> :
                    <div className="row wrapper border-bottom white-bg page-heading">
                        <div className="col-lg-10">
                            <h2>HR Management System</h2>
                            <ol className="breadcrumb">
                                <li>Leave Management</li>
                            </ol>
                        </div>
                        <div className="col-lg-2" style={{ marginTop: '2%' }}>
                            <a href={window.location.pathname} className="btn btn-primary" >Back To List</a>
                        </div>
                    </div>}
                <div className="row mt20">
                    <div className="col-sm-2">
                        <div className="list-group leave-list-group tab" role="tabList" >
                            <a className="list-group-item list-group-item-action" aria-selected='true' id='myleave' href="#myLeave_list" role="tab" onClick={() => this.changeTab(0)} >Leave Management</a>
                            <a className="list-group-item list-group-item-action " id='all_leave' href="#allLeave_list" role="tab" onClick={() => this.changeTab(3)} >New Leave</a>
                            <a className="list-group-item list-group-item-action" id='leave_report' href="#leaveReport" role="tab" onClick={() => this.changeTab(4)} >Leave Report</a>
                            <a className="list-group-item list-group-item-action" id='leave_balance' href="#leaveBalance" role="tab" onClick={() => this.changeTab(5)} >Leave Balance</a>
                            {this.state.user_id == 1 ? <a className="list-group-item list-group-item-action" id='calculate_leave' href="#calculateLeave" role="tab" onClick={() => this.changeTab(6)} >Calculate Leave Balance</a> : ""}
                        </div>
                    </div>
                    <div className="col-sm-10" style={{ paddingRight: '20px' }}>
                        <div className="white-bg container" style={{ padding: '20px' }}>
                            {
                                (active_tab === 0  ||  active_tab === 2 ?

                                    <ul className="nav nav-tabs tab" role="tablist" id="tab-pane">
                                        <li className="nav-item">
                                            <a className="nav-link active" href="#myLeave_list" role="tab" data-toggle="tab" aria-selected="true" onClick={() => this.changeTab(0)}>My Leave</a>
                                        </li>
                                        <li className="nav-item1">
                                        <a className="nav-link  active" href="#allLeave_list" role="tab" data-toggle="tab" aria-selected="true" onClick={() => this.changeTab(2)}>All Leave</a>
                                        </li>
                                    </ul> : active_tab === 3 ?
                                        <ul className="nav nav-tabs a2" role="tablist">
                                           
                                            <li className="nav-item1 white-bg">
                                                <a className="nav-link" href="#allLeave_create" role="tab" data-toggle="tab" onClick={() => this.changeTab(3)}>New Leave</a>
                                            </li>
                                        </ul> : active_tab === 4 ? '' : active_tab === 5 ? '' : active_tab === 6 ? '' : '')
                            }
                            {
                                this.state.isView ? <LeaveManagementView data={this.state.data} /> : ''
                            }

                            {
                                this.state.isEdit ? <LeaveManagementEdit data={this.state.data} /> : ''
                            }

                            {
                                this.state.isCancel ? <CancelLeaveEdit data={this.state.data} /> : ''
                            }

                            {
                                // this.state.isTable  ?

                                (active_tab === 0 || active_tab === 2 ?
                                    < LeaveManagementTable tab={active_tab} goToViewForm={this.goToViewForm} goToEditForm={this.goToEditForm} goToCancelForm={this.goToCancelForm} isHR={this.state.isHR} />
                                    :  active_tab === 3 ?
                                        <NewLeave tab={active_tab} />
                                        : active_tab === 4 ? <LeaveReport />
                                            : active_tab === 5 ? <LeaveBalance />
                                                : active_tab === 6 ? <CalculateEarnLeave /> : '')
                                // : ''

                            }
                            <br />



                            {/* {
                            this.state.isEdit ? <LeaveManagementEdit data={this.state.data} showToast={this.showToast} /> : ''
                        } */}
                            {/* {
                            this.state.isTable ?
                                <LeaveManagementTable goToViewForm={this.goToViewForm} goToEditForm={this.goToEditForm} data={this.state.data} permission={this.state.permission_status} /> : ''
                        } */}
                        </div>
                    </div>
                </div>
                {/* <div className="row">
                    <LeaveView />
                </div> */}
            </div>
        )
    }
}