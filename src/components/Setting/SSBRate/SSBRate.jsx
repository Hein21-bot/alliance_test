import React, { Component } from 'react'
import { toast, ToastContainer } from 'react-toastify';
import { main_url } from '../../../utils/CommonFunction';
import SettingHeader from '../SettingHeader';
import SSBRateEdit from './SSBRateEdit';
import SSBRateTable from './SSBRateTable';
import SSBRateView from './SSBRateView';

export default class SSBRate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isEdit: false,
            isTable: true,
            datasource: [],
            editData: {}
        }
    }

    async componentDidMount() {
        const datasource = await this.getSSBRate();
        // console.log('>>', datasource)
        this.setState({
            datasource
        })
    }

    getSSBRate = async () => {
        var res = await fetch(`${main_url}sscSetting/getSscSetting`);
        if (res.ok) return res.json();
        else return [];
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

    goToTable = () => {
        this.setState({
            isAddNew: false,
            isEdit: false,
            isTable: true
        })
        window.location.reload();
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
            <div className='ssb-rate border-bottom white-bg dashboard-header'>
                <ToastContainer position={toast.POSITION.TOP_RIGHT} />
                <SettingHeader
                    pageTitle="SSB Rate"
                    setupForm={this.setupForm}
                    isEdit={this.state.isEdit}
                    isView={this.state.isView}
                    permission={{ isAddNew: false }}
                />
                {
                    this.state.isTable ?
                        <SSBRateTable
                            data={this.state.datasource}
                            goToEditForm={this.goToEditForm}
                            goToViewForm={this.goToViewForm}
                        />
                        : ''
                }
                {
                    this.state.isEdit ?
                        <SSBRateEdit
                            data={this.state.editData}
                            goToTable={this.goToTable}
                            showToast={this.showToast}
                        />
                        : ''
                }
                {
                    this.state.isView ?
                        <SSBRateView
                            data={this.state.editData}
                            goToTable={this.goToTable}
                            showToast={this.showToast}
                        />
                        : ''
                }
            </div>
        )
    }
}

const dummydata = [
    { ssb_rate: 'SSC pay rate by Employee', percentage: 2 },
    { ssb_rate: 'SSC pay rate by Alliance', percentage: 2 },
    { ssb_rate: 'SSC pay rate by Alliance', percentage: 1 }
]