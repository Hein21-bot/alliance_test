import React, { Component } from 'react'
import { toast, ToastContainer } from 'react-toastify';
import { main_url } from '../../../utils/CommonFunction';
import SettingHeader from '../SettingHeader';
import CareerPathAddNew from './CareerPathAddNew';
import CareerPathEdit from './CareerPathEdit';
import CareerPathTable from './CareerPathTable';
import CareerPathView from './CareerPathView';

export default class CareerPath extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isEdit: false,
            isTable: true,
            isAddNew: false,
            isView: false,
            datasource: [],
            editData: {},
            level_options: [],
            sub_level_options: []
        }
    }

    async componentDidMount() {
        const datasource = await this.getCareerPath();
        console.log('data source ', datasource)
        const level = await this.getLevelOptions();
        const sub_level = await this.getCareerSubLevelOptions();
        const level_options = level.map(v => (
            {
                ...v,
                label: v.career_level,
                value: v.career_level
            }
        ))
        const sub_level_options = sub_level.map(v => (
            {
                ...v,
                label: v.career_sub_level,
                value: v.career_sub_level
            }
        ))
        this.setState({
            datasource,
            level_options,
            sub_level_options
        })
    }

    getCareerPath = async () => {
        var res = await fetch(`${main_url}careerPathSetting/getCareerPath`);
        if (res.ok) return res.json();
        else return [];
    }

    getLevelOptions = async () => {
        var res = await fetch(`${main_url}allowLevel/getLevel`);
        if (res.ok) return res.json();
        else return [];
    }

    getCareerSubLevelOptions = async () => {
        var res = await fetch(`${main_url}allowLevel/getCareerSubLevel`);
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
        const { level_options, sub_level_options } = this.state;
        return (
            <div className='career-path border-bottom white-bg dashboard-header'>
                <ToastContainer position={toast.POSITION.TOP_RIGHT} />
                <SettingHeader
                    pageTitle="Career Path"
                    setupForm={this.setupForm}
                    isAddNew={this.state.isAddNew}
                    isView={this.state.isView}
                    isEdit={this.state.isEdit}
                    permission={{ isAddNew: true }}
                />
                {
                    this.state.isTable ?
                        <CareerPathTable
                            data={this.state.datasource}
                            level_options={level_options}
                            sub_level_options={sub_level_options}
                            goToEditForm={this.goToEditForm}
                            goToViewForm={this.goToViewForm}
                        />
                        : ''
                }
                {
                    this.state.isEdit ?
                        <CareerPathEdit
                            goToTable={this.goToTable}
                            data={this.state.editData}
                            showToast={this.showToast}
                            level_options={level_options}
                            sub_level_options={sub_level_options}
                        />
                        : ''
                }
                {
                    this.state.isAddNew ?
                        <CareerPathAddNew
                            goToTable={this.goToTable}
                            data={this.state.datasource}
                            showToast={this.showToast}
                            level_options={level_options}
                            sub_level_options={sub_level_options}
                        /> : ''
                }
                {
                    this.state.isView ?
                        <CareerPathView
                            goToTable={this.goToTable}
                            data={this.state.editData}
                            level_options={level_options}
                            sub_level_options={sub_level_options}
                        /> : ''
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