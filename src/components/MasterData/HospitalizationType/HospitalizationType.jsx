import React, { Component } from 'react'
import { toast, ToastContainer } from 'react-toastify';
import { main_url } from '../../../utils/CommonFunction';
import SettingHeader from '../MasterDataHeader';
import HospitalizationTypeTable from './HospitalizationTypeTable';
import HospitalizationTypeAddNew from './HospitalizationTypeAddNew';
import HospitalizationEdit from './HospitalizationTypeEdit';
import HospitalizationTypeView from './HospitalizationTypeView';

export default class HospitalizationType extends Component {
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
        const datasource = await this.getHospitalizationType();

        this.setState({
            datasource
        })
    }

    getHospitalizationType = async () => {
        var res = await fetch(`${main_url}hospitalizationType/getHospitalizationType`);
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
                    pageTitle="Hospitalization Type"
                    setupForm={this.setupForm}
                    isAddNew={this.state.isAddNew}
                    isView={this.state.isView}
                    isEdit={this.state.isEdit}
                    permission={{ isAddNew: true }}
                />
                {
                    this.state.isTable ?
                        <HospitalizationTypeTable
                            data={this.state.datasource}
                            goToEditForm={this.goToEditForm}
                            goToViewForm={this.goToViewForm}
                        /> : ''
                }
                {
                    this.state.isAddNew ?
                        <HospitalizationTypeAddNew
                            goToTable={this.goToTable}
                            data={this.state.datasource}
                            showToast={this.showToast}
                        /> : ''
                }
                {
                    this.state.isEdit ?
                        <HospitalizationEdit
                            goToTable={this.goToTable}
                            data={this.state.editData}
                            showToast={this.showToast}
                        /> : ''
                }
                {
                    this.state.isView ?
                        <HospitalizationTypeView
                            goToTable={this.goToTable}
                            data={this.state.editData}
                        /> : ''
                }
            </div>
        )
    }
}
