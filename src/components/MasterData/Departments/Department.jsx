import React, { Component } from 'react'
import { toast, ToastContainer } from 'react-toastify';
import { main_url } from '../../../utils/CommonFunction';
import SettingHeader from '../MasterDataHeader';
import DepartmentTable from './DepartmentTable';
import DepartmentView from './DepartmentView';
import DepartmentEdit from './DepartmentEdit';
import DepartmentAddNew from './DepartmentAddNew';

export default class Department extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAddNew: false,
            isView: false,
            isTable: true,
            isEdit: false,
            datasource: [],
            editData: {},
        }
    }

    async componentDidMount() {
       const datasource = await this.getDepartment();
        this.setState({
            datasource,       
        })
    }

    getDepartment = async () => {
        var res = await fetch(`${main_url}departments/getDepartment`);
        if (res.ok) return res.json();
        else return [];
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

    goToEditForm = (data) => {
        this.setState({
            isAddnew: false,
            isTable: false,
            isView: false,
            isEdit: true,
            editData: data
        })
    }

    goToViewForm = (data) => {
        this.setState({
            isAddnew: false,
            isTable: false,
            isView: true,
            isEdit: false,
            editData: data
        })
    }

    showToast = (status, text) => {

        if (status === 200) {
            toast.success(text);
            window.location.reload();
        }
        else {
            toast.error(text);
        }

    }

    render() {
        const { department_type_option, level_options } = this.state;
        return (
            <div className='benefit-setup border-bottom white-bg dashboard-header'>
                <ToastContainer position={toast.POSITION.TOP_RIGHT} />
                <SettingHeader
                    pageTitle="Department"
                    setupForm={this.setupForm}
                    isAddNew={this.state.isAddNew}
                    isView={this.state.isView}
                    isEdit={this.state.isEdit}
                    permission={{ isAddNew: true }}
                />
                {
                    this.state.isTable ?
                        <DepartmentTable
                            data={this.state.datasource}
                            goToEditForm={this.goToEditForm}
                            goToViewForm={this.goToViewForm}
                        /> : ''
                }
                {
                    this.state.isAddNew ?
                        <DepartmentAddNew
                            goToTable={this.goToTable}
                            data={this.state.datasource}
                            showToast={this.showToast}
                        /> : ''
                }
                {
                    this.state.isEdit ?
                        <DepartmentEdit
                            goToTable={this.goToTable}
                            data={this.state.editData}
                            showToast={this.showToast}                        
                        /> : ''
                }
                {
                    this.state.isView ?
                        <DepartmentView
                            goToTable={this.goToTable}
                            data={this.state.editData}
                        
                        /> : ''
                }
            </div>
        )
    }
}
