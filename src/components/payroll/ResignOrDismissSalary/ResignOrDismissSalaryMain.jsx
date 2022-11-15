import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import PayrollPageHeader from '../payrollHeader';
import { main_url, getUserId, getMainRole, getWorkFlowStatus, getCookieData, getPermissionStatus, startSaving } from "../../../utils/CommonFunction";
import ResignOrDismissSalaryTable from './ResignOrDismissSalaryTable';
import ResignOrDismissSalaryAddNew from './ResignOrDismissSalaryAddNew';

class ResignOrDismissSalaryMain extends Component {
    constructor() {
        super();
        this.state = {
            isAddNew: false,
            user_info: getCookieData("user_info"),
            user_id: getUserId("user_info"),
            is_main_role: getMainRole(),
            isTable: true,
            isView: false,
            isEdit: false,
            datasource: [],
            requestData: [],
            permission_status: { isAddNew: true},
            requestType: '',
            active_tab: 0,
        }
    }

    async componentDidMount() {
    }

    changeTab(tab) {
        this.setState({ active_tab: tab }, () => { console.log(tab) })
    }
    setupForm = () => {
        this.setState({
            isAddNew: true,
            isEdit: false,
            isTable: false
        });
    };

    goToTable = () => {
        this.setState({
            isAddNew: false,
            isEdit: false,
            isTable: true
        })
        window.location.reload();
    }

    goToViewForm = (data) => {
        this.setState({
            isAddNew: false,
            isTable: false,
            isEdit: false,
            isView: true,
            datasource: data
        })
    }

    goToEditForm = (data) => {
        this.setState({
            isAddnew: false,
            isTable: false,
            isView: false,
            isEdit: true,
            datasource: data
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
            <div className="pay-roll border-bottom white-bg dashboard-header">

                <ToastContainer position={toast.POSITION.TOP_RIGHT} />

                <PayrollPageHeader pageTitle="Resign Or Dismisss Salary" setupForm={this.setupForm}
                    isAddNew={this.state.isAddNew} isView={this.state.isView}
                    isEdit={this.state.isEdit} permission={this.state.permission_status} />

                <br />

                {this.state.isTable ? (
                    <ResignOrDismissSalaryTable/>
                ) : this.state.isAddNew ? (
                    <ResignOrDismissSalaryAddNew/>
                ) : null}

                {/* {
                    this.state.isAddNew || this.state.isEdit ?
                        <BenefitWeddingAddNew goToTable={this.goToTable}  data={this.state.datasource} showToast={this.showToast} /> : ''
                }

                {
                    this.state.isTable ?
                    <div>
                          <div>
                           <ul className="nav nav-tabs tab" role="tablist" id="tab-pane">
                          <li className="nav-item">
                           <a className="nav-link " href="#wedding_benefit" role="tab" data-toggle="tab" aria-selected="true" onClick={() => this.changeTab(1)}>My Request</a>
                          </li>
                          <li className="nav-item1 active">
                          <a className="nav-link active" href="#wedding_benefit" role="tab" data-toggle="tab" onClick={() => this.changeTab(0)}>All Request</a>
                          </li>
                          </ul>

                          </div>
                        <BenefitWeddingTable  tab={this.state.active_tab} goToViewForm={this.goToViewForm} goToEditForm={this.goToEditForm} permission={this.state.permission_status} requestType={this.state.requestType} /> </div>: ''
                    
                }
                {
                    this.state.isView ?
                        <BenefitWeddingView data={this.state.datasource} isView={this.state.isView} /> : ''
                } */}

            </div>
        )

    }
}


export default ResignOrDismissSalaryMain;