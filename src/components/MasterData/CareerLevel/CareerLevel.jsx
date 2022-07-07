import React, { Component } from 'react'
import { toast, ToastContainer } from 'react-toastify';
import { main_url } from '../../../utils/CommonFunction';
import MasterDataHeader from '../MasterDataHeader';
import CareerLevelTable from './CareerLevelTable'
import CareerLevelView from './CareerLevelView'
import CareerLevelEdit from './CareerLevelEdit';
import CareerLevelAddNew from './CareerLevelAddNew'

export default class Benefit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAddNew: false,
            isView: false,
            isTable: true,
            isEdit: false,
            datasource: [],
            editData: {},
            benefit_type_options: [],
            level_options: []
        }
    }

    async componentDidMount() {
        const datasource = await this.getCareerLevel();
        this.setState({
            datasource
        })
    }

    getCareerLevel = async () => {
        var res = await fetch(`${main_url}careerLevel/getCareerLevel`);
        if (res.ok) return res.json();
        else return [];
    }

    // getBenefitTypeOptions = async () => {
    //     var res = await fetch(`${main_url}benefitType/getBenefit`);
    //     if (res.ok) return res.json();
    //     else return [];
    // }

    // getLevelOptions = async () => {
    //     var res = await fetch(`${main_url}allowLevel/getLevel`);
    //     if (res.ok) return res.json();
    //     else return [];
    // }

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
            <div className='career-level-setup border-bottom white-bg dashboard-header'>
                <ToastContainer position={toast.POSITION.TOP_RIGHT} />
                <MasterDataHeader
                    pageTitle="Career Level"
                    setupForm={this.setupForm}
                    isAddNew={this.state.isAddNew}
                    isView={this.state.isView}
                    isEdit={this.state.isEdit}
                    permission={{ isAddNew: true }}
                />
                {
                    this.state.isTable ?
                        <CareerLevelTable
                            data={this.state.datasource}
                            goToEditForm={this.goToEditForm}
                            goToViewForm={this.goToViewForm}
                        /> : ''
                }
                {
                    this.state.isAddNew ?
                        <CareerLevelAddNew
                            goToTable={this.goToTable}
                            data={this.state.datasource}
                            showToast={this.showToast}
                        /> : ''
                }
                {
                    this.state.isEdit ?
                        <CareerLevelEdit
                            goToTable={this.goToTable}
                            data={this.state.editData}
                            showToast={this.showToast}
                        /> : ''
                }
                {
                    this.state.isView ?
                        <CareerLevelView
                            goToTable={this.goToTable}
                            data={this.state.editData}
                            showToast={this.showToast}
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