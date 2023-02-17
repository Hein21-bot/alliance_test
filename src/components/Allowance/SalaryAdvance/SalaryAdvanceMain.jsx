import React, { Component } from 'react';
import SalaryAdvanceRequestForm from './SalaryAdvanceRequestForm';
import SalaryAdvanceApprovalForm from './SalaryAdvanceApprovalForm';
import PageHeader from '../../layouts/PageHeader';
import SalaryAdvanceView from './SalaryAdvanceView';
import SalaryAdvanceList from './SalaryAdvanceList';
import { ToastContainer, toast } from 'react-toastify';
import { main_url,getUserId, getCookieData, getMainRole, havePermission, getPermissionStatus, getWorkFlowStatus, startSaving } from "../../../utils/CommonFunction";
class SalaryAdvanceMain extends Component {
    constructor() {
        super();
        this.state = {
            user_info: getCookieData("user_info"),
            user_id: getUserId("user_info"),
            isAddNew: false,
            isTable: true,
            isView: false,
            isEdit: false,
            data: [],
            permission_status: {},
            work_flow_status: {},
            pending_approve:"myrequest",
            dataList:[],
            active_tab :0

        }
    }

    async componentDidMount() {
        var permission_status = await getPermissionStatus(this.state.user_info.designations_id, 'Salary Advance', 'Allowance');

        //  var permission_status = await getPermissionStatus(this.state.user_info.role_id, 'Salary Advance', 'Allowance');
        // this.getSalaryAdvanceList();
        this.setState({
            permission_status: permission_status
        })
    }

    setupForm = () => {
        this.setState({
            isAddNew: true,
            isTable: false,
            isView: false
        });
    };

    goToTable = () => {
        this.setState({
            isAddNew: false,
            isTable: true,
            isView: false
        })
        window.location.reload();
    }
    changeTab(tab) {
        this.setState({ active_tab: tab},()=>{console.log(tab)})
    }
    goToViewForm = (data) => {
        this.setState({
            data: data,
            isAddNew: false,
            isView: true,
            isTable: false
        })
    }

    goToEditForm = async (data) => {
        var work_flow = await getWorkFlowStatus(data.user_id, this.state.user_info.user_id, 'Salary Advance', 'Allowance');
        this.setState({
            data: data,
            isAddNew: false,
            isView: false,
            isEdit: true,
            isTable: false,
            work_flow_status: work_flow
        })
    }
   
    getSalaryAdvanceList() {
        var user_id = this.state.user_info.user_id;
        fetch(`${main_url}salary_advance/getSalaryAdvanceList/user_id=${user_id}`)
            .then(res => res.json())
            .then(res => {
                this.setState({ 
                    data : res,
                    dataList: res.filter(v=>v.user_id != this.state.user_id),
                })
    })}
    approvedlist = async (data) => {
        if (data == 'myrequest') {          
          this.setState({
            dataList: this.state.data.filter(v=>v.user_id == this.state.user_id),
            pending_approve: 'myrequest',
           
          })
        } else {
          this.setState({
            dataList:data,
            dataList: this.state.data.filter(v=>v.user_id != this.state.user_id),
            pending_approve: 'allrequest'
          })
        }
      }     
    showToast = (status, text) => {

        if (status === 200) {
            toast.success(text);
            // alert("Hi hi hi")
            window.location.reload();
        }
        else {
            startSaving();
            toast.error(text);
        }
    }

    render() {
        
        return (
            <div className="wedding-benefit border-bottom white-bg dashboard-header">
                <ToastContainer position={toast.POSITION.TOP_RIGHT} />

                <PageHeader pageTitle="Salary Advance"
                    title="Allowance"
                    setupForm={this.setupForm} isAddNew={this.state.isAddNew}
                    isView={this.state.isView} isEdit={this.state.isEdit} permission={this.state.permission_status} />
                  
                {
                    this.state.isAddNew ? <SalaryAdvanceRequestForm goToTable={this.goToTable} data={this.state.data} showToast={this.showToast} /> : ''
                }
                {
                    this.state.isEdit ?
                        havePermission(this.state.work_flow_status) && this.state.data.status != 5 ?
                            <SalaryAdvanceApprovalForm goToTable={this.goToTable} data={this.state.data} showToast={this.showToast} work_flow_status={this.state.work_flow_status} /> :
                            <SalaryAdvanceRequestForm goToTable={this.goToTable} data={this.state.data} showToast={this.showToast} />
                        : ''
                }
                {
                    this.state.isView ? <SalaryAdvanceView data={this.state.data} /> : ''
                }
                {
                    this.state.isTable ?
                          <div>
                          <div className='' style={{marginTop:20}}>
                           <ul className="nav nav-tabs tab" role="tablist" id="tab-pane">
                          <li className="nav-item">
                           <a className="nav-link " href="#approve_list" role="tab" data-toggle="tab" aria-selected="true" onClick={() => this.changeTab(1)}>My Request</a>
                          </li>
                          <li className="nav-item1 active">
                          <a className="nav-link active" href="#approve_list" role="tab" data-toggle="tab" onClick={() => this.changeTab(0)}>All Request</a>
                          </li>
                          </ul>

                          </div>
                        <SalaryAdvanceList goToViewForm={this.goToViewForm} tab={this.state.active_tab} goToEditForm={this.goToEditForm} setupForm={this.setupForm} data={this.state.dataList} permission={this.state.permission_status} approvedlist={this.approvedlist}/></div> : ''
                }

            </div>
        )
    }
}

export default SalaryAdvanceMain;