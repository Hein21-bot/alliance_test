import React, { Component } from 'react'
import { toast, ToastContainer } from 'react-toastify';
import { main_url, getUserId } from '../../../utils/CommonFunction';
import SettingHeader from '../SettingHeader';
import BenefitAddNew from './BenefitAddNew';
import BenefitEdit from './BenefitEdit';
import BenefitTable from './BenefitTable';
import BenefitView from './BenefitView';

export default class Benefit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user_id: getUserId("user_info"),
            isAddNew: false,
            isView: false,
            isTable: true,
            isEdit: false,
            datasource: [],
            editData: {},
            benefit_type_options: [],
            level_options: [],
            doubleSalary: 0,
            hospitalizationTypeOptions: []
        }
    }

    async componentDidMount() {
        const datasource = await this.getBenefitSetup();
        const benefit_type = await this.getBenefitTypeOptions();
        const level = await this.getLevelOptions();
        const Salary = await this.getDoubleSalary();
        const hospitalizationType = await this.getHospitalizationType();
        const benefit_type_options = benefit_type.map(v => (
            {
                ...v,
                label: v.benefit_type,
                value: v.benefit_type
            }
        ))
        const level_options = level.map(v => (
            {
                ...v,
                label: v.career_level,
                value: v.career_level
            }
        ))
        const hospitalizationTypeOptions = hospitalizationType.map(v => (
            {
                ...v,
                label: v.hospitalization_type,
                value: v.hospitalization_type
            }
        ))
        this.setState({
            datasource,
            benefit_type_options,
            level_options,
            doubleSalary: Salary[0].salary,
            hospitalizationTypeOptions
        })
    }

    getBenefitSetup = async () => {
        var res = await fetch(`${main_url}benefitSetup/getBenefitSetup`);
        if (res.ok) return res.json();
        else return [];
    }

    getBenefitTypeOptions = async () => {
        var res = await fetch(`${main_url}benefitType/getBenefit`);
        if (res.ok) return res.json();
        else return [];
    }

    getLevelOptions = async () => {
        var res = await fetch(`${main_url}allowLevel/getLevel`);
        if (res.ok) return res.json();
        else return [];
    }

    getDoubleSalary = async () => {
        var res = await fetch(`${main_url}benefitSetup/getDoubleSalary/${this.state.user_id}`);
        if (res.ok) return res.json();
        else return [];
    }

    getHospitalizationType = async () => {
        var res = await fetch(`${main_url}hospitalizationType/getHospitalizationType`)
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
        const { benefit_type_options, level_options, doubleSalary, hospitalizationTypeOptions } = this.state;
        // console.log('hospitalizationTypeOptions >> ', hospitalizationTypeOptions)
        return (
            <div className='benefit-setup border-bottom white-bg dashboard-header'>
                <ToastContainer position={toast.POSITION.TOP_RIGHT} />
                <SettingHeader
                    pageTitle="Benefit"
                    setupForm={this.setupForm}
                    isAddNew={this.state.isAddNew}
                    isView={this.state.isView}
                    isEdit={this.state.isEdit}
                    permission={{ isAddNew: true }}
                />
                {
                    this.state.isTable ?
                        <BenefitTable
                            data={this.state.datasource}
                            benefit_type_options={benefit_type_options}
                            martial_status_options={martial_status_options}
                            level_options={level_options}
                            goToEditForm={this.goToEditForm}
                            goToViewForm={this.goToViewForm}
                            hospitalizationTypeOptions={hospitalizationTypeOptions}
                        /> : ''
                }
                {
                    this.state.isAddNew ?
                        <BenefitAddNew
                            goToTable={this.goToTable}
                            data={this.state.datasource}
                            showToast={this.showToast}
                            martial_status_options={martial_status_options}
                            benefit_type_options={benefit_type_options}
                            level_options={level_options}
                            doubleSalary={doubleSalary}
                            hospitalizationTypeOptions={hospitalizationTypeOptions}
                        /> : ''
                }
                {
                    this.state.isEdit ?
                        <BenefitEdit
                            goToTable={this.goToTable}
                            data={this.state.editData}
                            showToast={this.showToast}
                            martial_status_options={martial_status_options}
                            benefit_type_options={benefit_type_options}
                            level_options={level_options}
                            hospitalizationTypeOptions={hospitalizationTypeOptions}
                        /> : ''
                }
                {
                    this.state.isView ?
                        <BenefitView
                            goToTable={this.goToTable}
                            data={this.state.editData}
                            martial_status_options={martial_status_options}
                            benefit_type_options={benefit_type_options}
                            level_options={level_options}
                            hospitalizationTypeOptions={hospitalizationTypeOptions}
                        /> : ''
                }
            </div>
        )
    }
}

const tableData = [
    {
        date: '11-01-2021', benefit_type_id: 'Medical Benefit', martial_status: 'test', no_of_child: ' 1', amount: '50000', text: 'seine+hein couple code',
        description: 'Married Employee', allow_service_year: '6 months', allow_level: 'Level 2 or above', remark: 'Approve',
    },
    {
        date: '04-02-2021', benefit_type_id: 'Wedding Benefit', martial_status: 'test', no_of_child: '', amount: '200000',
        description: '', allow_service_year: '3 months', allow_level: 'Level 2 or above', remark: 'Approve',
    },
]

const martial_status_options = [
    { label: 'Single', value: 'Single', is_married: 0 },
    { label: 'Married', value: 'Married', is_married: 1 },
]