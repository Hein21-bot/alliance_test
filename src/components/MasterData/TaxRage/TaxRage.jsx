import React, { Component } from 'react'
import { toast, ToastContainer } from 'react-toastify';
import { main_url } from '../../../utils/CommonFunction';
import SettingHeader from '../MasterDataHeader';
import TaxRageTable from './TaxRageTable';
import TaxRageView from './TaxRageView';
import TaxRageEdit from './TaxRageEdit';
import TaxRageAddNew from './TaxRageAddNew';

export default class TaxRage extends Component {
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
        const datasource = await this.getTaxRage();

        this.setState({
            datasource
        })
    }

    getTaxRage = async () => {
        var res = await fetch(`${main_url}taxRage/getTaxRage`);
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
        return (
            <div className='benefit-setup border-bottom white-bg dashboard-header'>
                <ToastContainer position={toast.POSITION.TOP_RIGHT} />
                <SettingHeader
                    pageTitle="Tax Range"
                    setupForm={this.setupForm}
                    isAddNew={this.state.isAddNew}
                    isView={this.state.isView}
                    isEdit={this.state.isEdit}
                    permission={{ isAddNew: true }}
                />
                {
                    this.state.isTable ?
                        <TaxRageTable
                            data={this.state.datasource}
                            goToEditForm={this.goToEditForm}
                            goToViewForm={this.goToViewForm}
                        /> : ''
                }
                {
                    this.state.isAddNew ?
                        <TaxRageAddNew
                            goToTable={this.goToTable}
                            data={this.state.datasource}
                            showToast={this.showToast}
                        /> : ''
                }
                {
                    this.state.isEdit ?
                        <TaxRageEdit
                            goToTable={this.goToTable}
                            data={this.state.editData}
                            showToast={this.showToast}
                        /> : ''
                }
                {
                    this.state.isView ?
                        <TaxRageView
                            goToTable={this.goToTable}
                            data={this.state.editData}
                        /> : ''
                }
            </div>
        )
    }
}
