import React, { Component } from 'react'
import { toast, ToastContainer } from 'react-toastify';
import { main_url } from '../../../utils/CommonFunction';
import SettingHeader from '../MasterDataHeader';
import TicketMainCategoryTable from './TicketMainCateoryTable'
import TicketMainCategoryView from './TicketMainCategoryView';
import TicketMainCategoryEdit from './TicketMainCategoryEdit';
import TicketMainCategoryAddNew from './TicketMainCategoryAddNew';

export default class TicketMainCategory extends Component {
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
            ticket_type_option: []
        }
    }

    async componentDidMount() {
        const datasource = await this.getTicketMainCategory();
        const department_type_option = await this.getDepartmentOption();
        const ticket_type_option = await this.getTicketTypeOption();

        // const desiglnation_options = designation.map(v => (
        //     {
        //         ...v,
        //         label: v.designations,
        //         value: v.designations_id
        //     }
        // ))
        this.setState({
            datasource,
            department_type_option,
            ticket_type_option
        })
    }

    getTicketMainCategory = async () => {
        var res = await fetch(`${main_url}mainCategory/getMainCategory`);
        if (res.ok) return res.json();
        else return [];
    }

    getDepartmentOption = async () => {
        var res = await fetch(`${main_url}main/getDepartment`);
        if (res.ok) return res.json();
        else return [];
    }

    getTicketTypeOption = async () => {
        var res = await fetch(`${main_url}main/getTicketCategoryType`);
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
        const { department_type_option, ticket_type_option } = this.state;
        // console.log('datasource >> ', this.state.datasource)
        return (
            <div className='benefit-setup border-bottom white-bg dashboard-header'>
                <ToastContainer position={toast.POSITION.TOP_RIGHT} />
                <SettingHeader
                    pageTitle="Ticket Main Category"
                    setupForm={this.setupForm}
                    isAddNew={this.state.isAddNew}
                    isView={this.state.isView}
                    isEdit={this.state.isEdit}
                    permission={{ isAddNew: true }}
                />
                {
                    this.state.isTable ?
                        <TicketMainCategoryTable
                            data={this.state.datasource}
                            department_type_option={department_type_option}
                            ticket_type_option={ticket_type_option}
                            goToEditForm={this.goToEditForm}
                            goToViewForm={this.goToViewForm}
                        /> : ''
                }
                {
                    this.state.isAddNew ?
                        <TicketMainCategoryAddNew
                            goToTable={this.goToTable}
                            data={this.state.datasource}
                            showToast={this.showToast}
                            department_type_option={department_type_option}
                            ticket_type_option={ticket_type_option}
                        /> : ''
                }
                {
                    this.state.isEdit ?
                        <TicketMainCategoryEdit
                            goToTable={this.goToTable}
                            data={this.state.editData}
                            showToast={this.showToast}
                            department_type_option={department_type_option}
                            ticket_type_option={ticket_type_option}
                        /> : ''
                }
                {
                    this.state.isView ?
                        <TicketMainCategoryView
                            goToTable={this.goToTable}
                            data={this.state.editData}
                            department_type_option={department_type_option}
                            ticket_type_option={ticket_type_option}
                        /> : ''
                }
            </div>
        )
    }
}
