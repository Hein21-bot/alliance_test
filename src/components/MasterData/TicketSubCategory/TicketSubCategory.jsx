import React, { Component } from 'react'
import { toast, ToastContainer } from 'react-toastify';
import { main_url } from '../../../utils/CommonFunction';
import SettingHeader from '../MasterDataHeader';
import TicketSubCategoryTable from './TicketSubCategoryTable';
import TicketSubCategoryEdit from './TicketSubCategoryEdit';
import TicketSubCategoryView from './TicketSubCategoryView';
import TicketSubCategoryAddNew from './TicketSubCategoryAddNew';

export default class TicketSubCategory extends Component {
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
            main_category_option: [],
            getPriorityOption: [],
            getSeverityOption: []
        }
    }

    async componentDidMount() {
        // const datasource = await this.getTicketSubCategory();
        const department_type_option = await this.getDepartmentOption();
        // const main_category = await this.getTicketMainCategoryOption();
        const getPriorityOption = await this.getPriorityOption();
        const getSeverityOption = await this.getSeverityOption();

        // const main_category_option = main_category.map(v => (
        //     {
        //         ...v,
        //         label: v.category_name,
        //         value: v.main_category_id
        //     }
        // ))
        this.setState({
            // datasource,
            department_type_option,
            // main_category_option,
            getPriorityOption,
            getSeverityOption
        })
    }

    // getTicketSubCategory = async () => {
    //     var res = await fetch(`${main_url}subCategory/getSubCategory`);
    //     if (res.ok) return res.json();
    //     else return [];
    // }

    getDepartmentOption = async () => {
        var res = await fetch(`${main_url}main/getDepartment`);
        if (res.ok) return res.json();
        else return [];
    }

    // getTicketMainCategoryOption = async () => {
    //     var res = await fetch(`${main_url}mainCategory/getMainCategory`);
    //     if (res.ok) return res.json();
    //     else return [];
    // }

    getPriorityOption = async () => {
        var res = await fetch(`${main_url}helpDesk/getPriority`);
        if (res.ok) return res.json();
        else return [];
    }

    getSeverityOption = async () => {
        var res = await fetch(`${main_url}helpDesk/getSeverity`);
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
        const { datasource, department_type_option, main_category_option, getPriorityOption, getSeverityOption } = this.state;
        return (
            <div className='benefit-setup border-bottom white-bg dashboard-header'>
                <ToastContainer position={toast.POSITION.TOP_RIGHT} />
                <SettingHeader
                    pageTitle="Ticket Sub Category"
                    setupForm={this.setupForm}
                    isAddNew={this.state.isAddNew}
                    isView={this.state.isView}
                    isEdit={this.state.isEdit}
                    permission={{ isAddNew: true }}
                />
                {
                    this.state.isTable ?
                        <TicketSubCategoryTable
                            // data={this.state.datasource}
                            department_type_option={department_type_option}
                            main_category_option={main_category_option}
                            getPriorityOption={getPriorityOption}
                            getSeverityOption={getSeverityOption}
                            goToEditForm={this.goToEditForm}
                            goToViewForm={this.goToViewForm}
                        /> : ''
                }
                {
                    this.state.isAddNew ?
                        <TicketSubCategoryAddNew
                            goToTable={this.goToTable}
                            data={this.state.datasource}
                            showToast={this.showToast}
                            department_type_option={department_type_option}
                            main_category_option={main_category_option}
                            getPriorityOption={getPriorityOption}
                            getSeverityOption={getSeverityOption}
                        /> : ''
                }
                {
                    this.state.isEdit ?
                        <TicketSubCategoryEdit
                            goToTable={this.goToTable}
                            data={this.state.editData}
                            showToast={this.showToast}
                            department_type_option={department_type_option}
                            main_category_option={main_category_option}
                            getPriorityOption={getPriorityOption}
                            getSeverityOption={getSeverityOption}
                        /> : ''
                }
                {
                    this.state.isView ?
                        <TicketSubCategoryView
                            goToTable={this.goToTable}
                            data={this.state.editData}
                            department_type_option={department_type_option}
                            main_category_option={main_category_option}
                            getPriorityOption={getPriorityOption}
                            getSeverityOption={getSeverityOption}
                        /> : ''
                }
            </div>
        )
    }
}
