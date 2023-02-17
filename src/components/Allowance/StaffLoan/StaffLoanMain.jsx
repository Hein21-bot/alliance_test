import React, { Component } from 'react';
import ApplyForm from './ApplyForm';
import StaffLoanList from './StaffLoanList';
import StaffLoanView from './StaffLoanView';
import StaffLoanApproval from './StaffLoanApproval';
import PageHeader from '../../layouts/PageHeader';
import { ToastContainer, toast } from 'react-toastify';
import { main_url, getCookieData, getWorkFlowStatus, getPermissionStatus, havePermission, startSaving } from "../../../utils/CommonFunction";
class StaffLoanMain extends Component {
    constructor() {
        super();
        this.state = {
            user_info: getCookieData("user_info"),
            isAddNew: false,
            isTable: true,
            isView: false,
            isEdit: false,
            data: [],
            permission_status: {}
        }
    }

    async componentDidMount() {
        //var permission_status = await getPermissionStatus(this.state.user_info.designations_id, 'Staff Loan', 'Allowance');

        var permission_status = await getPermissionStatus(this.state.user_info.role_id, 'Staff Loan', 'Allowance');
        this.getStaffLoanList();
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
        var work_flow = await getWorkFlowStatus(data.applicant_id, this.state.user_info.user_id, 'Staff Loan', 'Allowance');
        this.setState({
            data: data,
            isAddNew: false,
            isView: false,
            isEdit: true,
            isTable: false,
            work_flow_status: work_flow
        })
    }

    getStaffLoanList() {
        var user_id = this.state.user_info.user_id;
        fetch(`${main_url}staff_loan/getStaffLoanList/user_id=${user_id}`)
            .then(res => res.json())
            .then(data => {
                this.setState({
                    data: data
                })
            })
    }

    showToast = (status, text) => {

        if (status === 200) {
            toast.success(text);
            window.location.reload();
        }
        else {
            startSaving();
            toast.error(text);
        }

    }

    render() {
        return (
            <div>
                <ToastContainer position={toast.POSITION.TOP_RIGHT} />

                <PageHeader pageTitle="Staff Loan"
                    title="Allowance"
                    setupForm={this.setupForm} isAddNew={this.state.isAddNew}
                    isView={this.state.isView} isEdit={this.state.isEdit} permission={this.state.permission_status} />
                {
                    this.state.isAddNew ? <ApplyForm goToTable={this.goToTable} data={this.state.data} showToast={this.showToast} work_flow_status={this.state.work_flow_status} /> : ''
                }
                {
                    this.state.isEdit ?
                        havePermission(this.state.work_flow_status) ?
                            <StaffLoanApproval goToTable={this.goToTable} data={this.state.data} showToast={this.showToast} work_flow_status={this.state.work_flow_status} /> :
                            <ApplyForm goToTable={this.goToTable} data={this.state.data} showToast={this.showToast} work_flow_status={this.state.work_flow_status} />
                        : ''
                }
                {
                    this.state.isView ? <StaffLoanView data={this.state.data} /> : ''
                }
                {
                    this.state.isTable ?
                        <StaffLoanList data={this.state.data} goToViewForm={this.goToViewForm} goToEditForm={this.goToEditForm} setupForm={this.setupForm} permission={this.state.permission_status} /> : ''
                }

            </div>
        )
    }
}

export default StaffLoanMain;