import React, { Component } from 'react';
import { main_url, getUserId } from '../../utils/CommonFunction';
import LeaveManagementTable from './LeaveManagementTable';
import LeaveManagementView from './LeaveManagementView';
import LeaveManagementEdit from './LeaveManagementEdit';
import CancelLeaveEdit from './CancelLeaveEdit';
import NewLeave from './NewLeave';
import Rodal from "rodal";
import LeaveReport from './LeaveReport';
import LeaveBalance from './LeaveBalance';
import CalculateEarnLeave from './CalculateEarnLeave'
import { ToastContainer, toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
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
    componentDidUpdate(prevProps) {
        if (this.props.location !== prevProps.location) {
          this.onRouteChanged();
        }
      }
    
      onRouteChanged() {
        
        if(this.props.location== "/leave_management"){
            this.changeTab(0);
        }else if(this.props.location== "/new_leave"){
            this.changeTab(3)
        }else if(this.props.location== "/leave_report"){
            this.changeTab(4)
        }else{
            this.changeTab(5)
        }
        
       
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
            isCancel: false
        })
    }

    goToEditForm = (data) => {
        this.setState({
            data: data,
            isAddNew: false,
            isEdit: true,
            isView: false,
            isCancel: false
        })
    }

    goToCancelForm = (data) => {
        this.setState({
            data: data,
            isAddNew: false,
            isEdit: false,
            isView: false,
            isCancel: true
        })
    }
    hideEdit() {
        this.setState({ isEdit: false});
    }
    hideView() {
        this.setState({ isView: false});
    }



    render() {
        let { active_tab } = this.state;
        return (
            <div>
                  <ToastContainer />
                    <div className="row wrapper border-bottom white-bg page-heading">
                        <div className="col-lg-10">
                            
                            <ol className="breadcrumb" >
                                <li style={{marginTop:15}}>{active_tab === 2 ? "All Leave" : active_tab === 0 ?
                                    "My Leave" : active_tab ===3 ? "New Leave" : active_tab === 4 ? "Leave Report" : "Leave Balance"
                                }</li>
                            </ol>
                        </div>
                    </div>
                <div className="row mt20">
                    
                    <div className="col-sm-12" style={{ paddingRight: '20px' }}>
                        <div className="white-bg container" style={{ padding: '20px' }}>
                            {
                                (active_tab === 0  ||  active_tab === 2 || active_tab === 3 ?

                                    <ul className="nav nav-tabs tab" role="tablist" id="tab-pane">
                                        <li className="nav-item">
                                            <a className="nav-link active" href="#myLeave_list" role="tab" data-toggle="tab" aria-selected="true" onClick={() => this.changeTab(0)}>My Leave</a>
                                        </li>
                                        <li className="nav-item1 active">
                                        <a className="nav-link  active" href="#allLeave_list" role="tab" data-toggle="tab" aria-selected="true" onClick={() => this.changeTab(2)}>All Leave</a>
                                        </li>
                                        <li className="nav-item2 ">
                                        <a className="nav-link  active" href="#newLeave_list" role="tab" data-toggle="tab" aria-selected="true" onClick={() => this.changeTab(3)}>New Leave</a>
                                        </li>
                                    </ul> : active_tab === 4 ?
                                        <ul className="nav nav-tabs a2" role="tablist">
                                           
                                            <li className="nav-item1 white-bg">
                                                <a className="nav-link" href="#allLeave_create" role="tab" data-toggle="tab" onClick={() => this.changeTab(4)}>New Leave</a>
                                            </li>
                                        </ul> : active_tab === 5 ? '' : active_tab === 6 ? ''  : '')
                            }
                            {
                                this.state.isView ?
                                <Rodal
                                width={800}
                                height={613}
                                visible={this.state.isView}
                                onClose={this.hideView.bind(this)}>
                                    <LeaveManagementView data={this.state.data} />
                                    <div style={{float: 'right', paddingRight: '14px', paddingTop:'10px'}}>
                                        <button
                                        className="btn btn-danger"
                                        onClick={() => this.hideView()}
                                        >
                                        <span>Cancel</span>{" "}
                                        </button>
                                    </div>
                                </Rodal>: ''
                            }

                            {
                                this.state.isEdit ?
                                <Rodal
                                width={800}
                                height={613}
                                visible={this.state.isEdit}
                                onClose={this.hideEdit.bind(this)}
                              >
                                    <LeaveManagementEdit data={this.state.data}/>
                                </Rodal>: ''
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