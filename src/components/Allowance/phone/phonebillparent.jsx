import React, { Component } from 'react';
import PhoneBillRequestAddNew from './PhoneBillRequestAddNew';
import PageHeader from '../../layouts/PageHeader';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css'
import { main_url, getCookieData, getPermissionStatus, startSaving } from '../../../utils/CommonFunction';
import PhoneBillRequestTable from './phonebillrequesttable';
import PhoneBillRequestView from './PhoneBillRequestView';

class PhoneBillParent extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
        // var permission_status = await getPermissionStatus(this.state.user_info.designations_id, 'Phone Bill', 'Allowance');

        var permission_status = await getPermissionStatus(this.state.user_info.role_id, 'Phone Bill', 'Allowance');
        this._getPhoneBillRequest();
        this.setState({
            permission_status: permission_status
        })
    }

    _getPhoneBillRequest() {
        fetch(`${main_url}allowance/getPhoneBillRequest/${this.state.user_info.user_id}`)
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
            isTable: false
        })
    }

    goToViewForm = (data) => {
        this.setState({
            data: data,
            isAddNew: false,
            isTable: false,
            isView: true,
            isEdit: false
        })
    }

    goToEditForm = (data) => {
        this.setState({
            data: data,
            isAddNew: false,
            isTable: false,
            isView: false,
            isEdit: true
        })
    }

    goBack = () => {
        window.location.reload();
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
            <div>
                <ToastContainer position={toast.POSITION.TOP_RIGHT} />

                <PageHeader pageTitle="Phone Bill"
                    title="Allowance"
                    setupForm={this.setupForm} isAddNew={this.state.isAddNew} 
                    isView={this.state.isView} isEdit={this.state.isEdit} permission={this.state.permission_status} />

                {
                    this.state.isAddNew || this.state.isEdit ? <PhoneBillRequestAddNew data={this.state.data} goBack={this.goBack} showToast={this.showToast} /> : ''
                }
                {
                    this.state.isTable ? <PhoneBillRequestTable
                        setupForm={this.setupForm}
                        data={this.state.data}
                        goToEditForm={this.goToEditForm}
                        goToViewForm={this.goToViewForm}
                        permission={this.state.permission_status} /> : ''
                }
                {
                    this.state.isView ? <PhoneBillRequestView data={this.state.data} goBack={this.goBack} /> : ''
                }

            </div>
        )
    }
}
export default PhoneBillParent;