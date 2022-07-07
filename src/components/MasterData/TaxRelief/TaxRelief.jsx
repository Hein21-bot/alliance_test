import React, { Component } from 'react'
import { toast, ToastContainer } from 'react-toastify';
import { main_url } from '../../../utils/CommonFunction';
import SettingHeader from '../MasterDataHeader';
import TaxReliefTable from './TaxReliefTable';
import TaxReliefView from './TaxReliefView';
import TaxReliefEdit from './TaxReliefEdit';
import TaxReliefAddNew from './TaxReliefAddNew';

export default class TaxRelief extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAddNew: false,
            isView: false,
            isTable: true,
            isEdit: false,
            datasource: [],
            editData: {},
            allowance_reason_option: []
        }
    }

    async componentDidMount() {
        const allowance_reason_option = await this.getAllowanceReason();
        const datasource = await this.getTaxRelief();
        
        this.setState({
            datasource,
            allowance_reason_option
        })
    }

    getTaxRelief = async () => {
        var res = await fetch(`${main_url}taxRelief/getTaxRelief`);
        if (res.ok) return res.json();
        else return [];
    }

    getAllowanceReason = async () => {
        var res = await fetch(`${main_url}taxRelief/getAllowanceReason`);
        if (res.ok) return res.json()
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
        const { allowance_reason_option } = this.state;
        
        return (
            <div className='benefit-setup border-bottom white-bg dashboard-header'>
                <ToastContainer position={toast.POSITION.TOP_RIGHT} />
                <SettingHeader
                    pageTitle="Tax Relief"
                    setupForm={this.setupForm}
                    isAddNew={this.state.isAddNew}
                    isView={this.state.isView}
                    isEdit={this.state.isEdit}
                    permission={{ isAddNew: true }}
                />
                {
                    this.state.isTable ?
                        <TaxReliefTable
                            data={this.state.datasource}
                            goToEditForm={this.goToEditForm}
                            goToViewForm={this.goToViewForm}
                            allowance_reason_option={allowance_reason_option}
                        /> : ''
                }
                {
                    this.state.isAddNew ?
                        <TaxReliefAddNew
                            goToTable={this.goToTable}
                            data={this.state.datasource}
                            showToast={this.showToast}
                            allowance_reason_option={allowance_reason_option}
                        /> : ''
                }
                {
                    this.state.isEdit ?
                        <TaxReliefEdit
                            goToTable={this.goToTable}
                            data={this.state.editData}
                            showToast={this.showToast}
                            allowance_reason_option={allowance_reason_option}
                        /> : ''
                }
                {
                    this.state.isView ?
                        <TaxReliefView
                            goToTable={this.goToTable}
                            data={this.state.editData}
                            allowance_reason_option={allowance_reason_option}
                        /> : ''
                }
            </div>
        )
    }
}
