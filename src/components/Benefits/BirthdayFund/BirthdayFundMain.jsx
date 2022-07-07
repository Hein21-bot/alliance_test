import React, { Component } from 'react';
import BenefitPageHeader from '../BenefitPageHeader';
import BirthdayFundTable from './BirthdayFundTable';
import BirthdayFundAddNew from './BirthdayFundAddNew';
import BirthdayFundView from './BirthdayFundView'
import BirthdayFundEdit from './BirthdayFundEdit';
import { main_url, getCookieData, getUserId, getMainRole, getPermissionStatus, startSaving } from "../../../utils/CommonFunction";
import { ToastContainer, toast } from 'react-toastify';

class BirthdayFundMain extends Component {
    constructor() {
        super();
        this.state = {
            user_id: getUserId("user_info"),
            is_main_role: getMainRole(),
            user_info: getCookieData("user_info"),
            isAddNew: false,
            isTable: true,
            isView: false,
            isEdit: false,
            data: [],
            permission_status: {}
        }
    }

    async componentDidMount() {
        var permission_status = await getPermissionStatus(this.state.user_info.designations_id, 'Birthday Benefit', 'Benefit');
        this._getBirthdayBenefit();
        this.setState({
            permission_status: permission_status
        })
    }

    _getBirthdayBenefit() {
        let id = this.state.user_id;

        fetch(`${main_url}birthday_benefit/getBirthdayBenefit/${id}`)
            .then(response => {
                if (response.ok) return response.json()
            })
            .then(res => {
                if (res) {
                    this.setState({ data: res })
                }
            })
            .catch(error => console.error(`Fetch Error =\n`, error));

    }


    setupForm = () => {
        this.setState({
            isAddNew: true,
            isTable: false,
            isView: false
        });
    };

    goToTable = () => {
        this.setState({
            isAddNew: false,
            isTable: true,
            isView: false
        })
        window.location.reload();
    }

    goToViewForm = (data) => {
        this.setState({
            data: data,
            isAddNew: false,
            isView: true,
            isTable: false
        })
    }

    goToEditForm = (data) => {
        this.setState({
            data: data,
            isAddNew: false,
            isView: false,
            isEdit: true,
            isTable: false
        })
    }

    showToast = (status, text) => {

        if (status === 200) {
            toast.success(text);
            window.location.reload();
        }
        else {
            startSaving();
            toast.error(text);
        }
    }

    render() {
        console.log("Designation ID >>",this.state.permission_status)
        return (
            <div className="wedding-benefit border-bottom white-bg dashboard-header">
                <ToastContainer position={toast.POSITION.TOP_RIGHT} />

                <BenefitPageHeader pageTitle="Birthday Fund" setupForm={this.setupForm}
                    isAddNew={this.state.isAddNew} isView={this.state.isView}
                    isEdit={this.state.isEdit} permission={this.state.permission_status} />

                <br />

                {
                    this.state.isTable ?
                        <BirthdayFundTable data={this.state.data} goToViewForm={this.goToViewForm} goToEditForm={this.goToEditForm} permission={this.state.permission_status} /> : ''

                }
                {
                    this.state.isAddNew ?
                        <BirthdayFundAddNew goToTable={this.goToTable} data={this.state.data} showToast={this.showToast} /> : ''
                }
                {
                    this.state.isEdit ?
                        <BirthdayFundEdit goToTable={this.goToTable} data={this.state.data} showToast={this.showToast} /> : ''
                }

                {
                    this.state.isView ?
                        <BirthdayFundView data={this.state.data} /> : ''
                }

            </div>
        )
    }
}

export default BirthdayFundMain;