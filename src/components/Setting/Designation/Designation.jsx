import React, { Component } from 'react'
import SettingHeader from '../SettingHeader';
import DesignationAddNew from './DesignationAddNew';
import DesignationEdit from './DesignationEdit';
import DesignationTable from './DesignationTable';

export default class Designation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAddNew: false,
            isView: false,
            isTable: true,
            isEdit: false,
            datasource: [],
            editData:{}
        }
    }

    componentDidMount() {
        this.setState({
            datasource: tableData
        })
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



    render() {
        return (
            <div className='designation border-bottom white-bg dashboard-header'>
                <SettingHeader 
                    pageTitle="Designation" 
                    setupForm={this.setupForm}
                    isAddNew={this.state.isAddNew} 
                    isView={this.state.isView}
                    isEdit={this.state.isEdit}
                    permission={{isAddNew: true}}
                />
                {
                    this.state.isTable ?
                        <DesignationTable data={this.state.datasource} goToEditForm={this.goToEditForm} /> : ''
                }
                {
                    this.state.isAddNew ?
                        <DesignationAddNew goToTable={this.goToTable} data={this.state.datasource} showToast={this.showToast} /> : ''
                }
                {
                    this.state.isEdit ?
                        <DesignationEdit goToTable={this.goToTable} data={this.state.editData} showToast={this.showToast} /> : ''
                }
            </div>
        )
    }
}

const tableData = [
    {
       designation: 'IT Assiatan', level: 'Level 2 or above', department:'IT', remark: 'remark', active: 1
    },
    {
        designation: 'IT Office', level: 'Level 3 or above', department:'IT', remark: '', active: 0
    },
]