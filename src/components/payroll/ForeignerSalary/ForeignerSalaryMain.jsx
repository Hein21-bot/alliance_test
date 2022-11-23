import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import PayrollPageHeader from '../payrollHeader';
import { main_url, getUserId, getMainRole, getWorkFlowStatus, getCookieData, getPermissionStatus, startSaving } from "../../../utils/CommonFunction";
// import ForeignerSalaryTable from './ForeignerSalaryTable';
// import ForeignerSalaryAddNew from './ForeignerSalaryAddNew';
import ForeignerSalaryAddNew from './ForeignerSalaryAddNew';
import ForeignerSalaryTable from './ForeignerSalaryTable';
import ForeignerSalaryView from './ForeignerSalaryView';
import ForeignerSalaryEdit from './ForeignerSalaryEdit';
class ForeignerSalaryMain extends Component {
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
            permission_status: { isAddNew: true},
            requestType: '',
        }
    }
    async componentDidMount() {
       await this._getForeginerSalary();  
    }
    
    _getForeginerSalary() {
        let id = this.state.user_id;

        fetch(`${main_url}foreigner_salary/get_foreigner_salary/${id}`)
            .then(response => {
                if (response.ok) return response.json()
            })
            .then(res => {
                if (res) {
                    this.setState({ 
                        datasource: res,
                    })
                }
            })
            .catch(error => console.error(`Fetch Error =\n`, error));

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
            datasource:data
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

                <PayrollPageHeader pageTitle="Foreigner Salary" setupForm={this.setupForm}
                    isAddNew={this.state.isAddNew} isView={this.state.isView}
                    isEdit={this.state.isEdit} permission={this.state.permission_status} />

                <br />

                {this.state.isTable ? (
                    <ForeignerSalaryTable view={this.state.isView} goToViewForm={this.goToViewForm}  goToEditForm={this.goToEditForm} dataSource={this.state.datasource}/>
                ) :  this.state.isView ? (
                    <ForeignerSalaryView
                      view={this.state.isView}
                      dataSource={this.state.datasource}
                    />
                  ) :this.state.isAddNew ? (
                    <ForeignerSalaryAddNew />
                )  :this.state.isEdit ? (
                    <ForeignerSalaryEdit  dataSource={this.state.datasource}/>
                ): null}
            </div>
        )

    }
}


export default ForeignerSalaryMain;