import React, { Component } from 'react';
import BenefitPageHeader from '../BenefitPageHeader';
import { toast, ToastContainer } from 'react-toastify';
import BenefitChildTable from './BenefitChildTable';
import BenefitChildAddNew from './BenefitChildAddNew';
import BenefitChildView from './BenefitChildView';
import BenefitChildEdit from './BenefitChildEdit'
import { main_url, getUserId, getMainRole, getCookieData, getPermissionStatus, startSaving } from "../../../utils/CommonFunction";

class ChildBenefitMain extends Component {
    constructor() {
        super();
        this.state = {
            user_id: getUserId("user_info"),
            user_info: getCookieData("user_info"),
            is_main_role: getMainRole(),
            isAddNew: false,
            isTable: true,
            isView: false,
            isEdit: false,
            data: [],
            permission_status: {}
        }
    }

    async componentDidMount() {
        var permission_status = await getPermissionStatus(this.state.user_info.designations_id, 'Child Benefit', 'Benefit');
        this._getChildBenefit();
        this.setState({
            permission_status: permission_status
        })

    }

    _getChildBenefit() {
        let id = this.state.user_id;

        fetch(main_url + "child_benefit/getChildBenefit/" + id)
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
            isEdit: false,
            isTable: false,
            isView: false
        });
    };

    goToTable = () => {
        this.setState({
            isAddNew: false,
            isEdit: false,
            isTable: true,
            isView: false
        })
        window.location.reload();
    }

    goToViewForm = (data) => {
        this.setState({
            data: data,
            isAddNew: false,
            isEdit: false,
            isView: true,
            isTable: false
        })
    }

    goToEditForm = (data) => {
        this.setState({
            data: data,
            isAddNew: false,
            isEdit: true,
            isView: false,
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
        return (
            <div className="wedding-benefit border-bottom white-bg dashboard-header">
                <ToastContainer position={toast.POSITION.TOP_RIGHT} />
                <BenefitPageHeader pageTitle="Child" setupForm={this.setupForm} isAddNew={this.state.isAddNew} isView={this.state.isView}
                    isEdit={this.state.isEdit} permission={this.state.permission_status} />

                <br />

                {
                    this.state.isAddNew ? <BenefitChildAddNew goToTable={this.goToTable} showToast={this.showToast} /> : ''
                }
                {
                    this.state.isView ? <BenefitChildView data={this.state.data} /> : ''
                }
                {
                    this.state.isEdit ? <BenefitChildEdit data={this.state.data} showToast={this.showToast} /> : ''
                }
                {
                    this.state.isTable ?
                        <BenefitChildTable goToViewForm={this.goToViewForm} goToEditForm={this.goToEditForm} data={this.state.data} permission={this.state.permission_status} /> : ''
                }

            </div>
        )
    }
}

export default ChildBenefitMain;