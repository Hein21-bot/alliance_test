import React, { Component } from 'react';
import SalaryAdvanceRequestForm from './SalaryAdvanceRequestForm';
import SalaryAdvanceApprovalForm from './SalaryAdvanceApprovalForm';
import PageHeader from '../../layouts/PageHeader';
import SalaryAdvanceView from './SalaryAdvanceView';
import SalaryAdvanceList from './SalaryAdvanceList';
import { ToastContainer, toast } from 'react-toastify';
import { main_url, getCookieData, getMainRole, havePermission, getPermissionStatus, getWorkFlowStatus, startSaving } from "../../../utils/CommonFunction";
class SalaryAdvanceMain extends Component {
    constructor() {
        super();
        this.state = {
            user_info: getCookieData("user_info"),
            isAddNew: false,
            isTable: true,
            isView: false,
            isEdit: false,
            data: [],
            permission_status: {},
            work_flow_status: {}
        }
    }

    async componentDidMount() {
        var permission_status = await getPermissionStatus(this.state.user_info.designations_id, 'Salary Advance', 'Allowance');
        this.getSalaryAdvanceList();
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
            .then(data => {
                if (this.state.pending_approve == 'myrequest') {
                this.setState({
                    data:data.filter(v=>v.user_id === this.state.user_id)
                })
            } else if (this.state.pending_approve == 'allrequest') {
                this.setState({
                    data:data.filter(v=>v.user_id !== this.state.user_id)})
    }})}
            
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
            <div >
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
                        havePermission(this.state.work_flow_status) ?
                            <SalaryAdvanceApprovalForm goToTable={this.goToTable} data={this.state.data} showToast={this.showToast} work_flow_status={this.state.work_flow_status} /> :
                            <SalaryAdvanceRequestForm goToTable={this.goToTable} data={this.state.data} showToast={this.showToast} />
                        : ''
                }
                {
                    this.state.isView ? <SalaryAdvanceView data={this.state.data} /> : ''
                }
                {
                    this.state.isTable ?
                        <SalaryAdvanceList goToViewForm={this.goToViewForm} goToEditForm={this.goToEditForm} setupForm={this.setupForm} data={this.state.data} permission={this.state.permission_status} /> : ''
                }

            </div>
        )
    }
}

export default SalaryAdvanceMain;