import React, { Component } from 'react'
import { toast, ToastContainer } from 'react-toastify';
import { main_url } from '../../../utils/CommonFunction';
import SettingHeader from '../MasterDataHeader';
import DesignationTable from './DesignationTable';
import DesignationView from './DesignationView';
import DesignationEdit from './DesignationEdit';
import DesignationAddNew from './DesignationAddNew';

export default class Designations extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAddNew: false,
            isView: false,
            isTable: true,
            isEdit: false,
            datasource: [],
            editData: {},
            department_type_option: [],
            level_options: []
        }
    }

    async componentDidMount() {
        const datasource = await this.getDesignation();
        const department_type_option = await this.getDepartmentOption();
        const level = await this.getLevelOptions();

        const level_options = level.map(v => (
            {
                ...v,
                label: v.career_level,
                value: v.career_level_id
            }
        ))
        this.setState({
            datasource,
            department_type_option,
            level_options
        })
    }

    getDesignation = async () => {
        var res = await fetch(`${main_url}Designations/getDesignation`);
        if (res.ok) return res.json();
        else return [];
    }

    getDepartmentOption = async () => {
        var res = await fetch(`${main_url}main/getDepartment`);
        if (res.ok) return res.json();
        else return [];
    }

    getLevelOptions = async () => {
        var res = await fetch(`${main_url}careerLevel/getCareerLevel`);
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
                    pageTitle="Designation"
                    setupForm={this.setupForm}
                    isAddNew={this.state.isAddNew}
                    isView={this.state.isView}
                    isEdit={this.state.isEdit}
                    permission={{ isAddNew: true }}
                />
                {
                    this.state.isTable ?
                        <DesignationTable
                            data={this.state.datasource}
                            department_type_option={department_type_option}
                            level_options={level_options}
                            goToEditForm={this.goToEditForm}
                            goToViewForm={this.goToViewForm}
                        /> : ''
                }
                {
                    this.state.isAddNew ?
                        <DesignationAddNew
                            goToTable={this.goToTable}
                            data={this.state.datasource}
                            showToast={this.showToast}
                            department_type_option={department_type_option}
                            level_options={level_options}
                        /> : ''
                }
                {
                    this.state.isEdit ?
                        <DesignationEdit
                            goToTable={this.goToTable}
                            data={this.state.editData}
                            showToast={this.showToast}
                            department_type_option={department_type_option}
                            level_options={level_options}
                        /> : ''
                }
                {
                    this.state.isView ?
                        <DesignationView
                            goToTable={this.goToTable}
                            data={this.state.editData}
                            department_type_option={department_type_option}
                            level_options={level_options}
                        /> : ''
                }
            </div>
        )
    }
}
