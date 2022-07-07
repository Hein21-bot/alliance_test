import React, { Component } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import StaffComplainTable from './StaffComplainTable';
import StaffComplainAddNew from './StaffComplainAddNew';
import StaffComplainView from './StaffComplainView';
import StaffComplainEdit from './StaffComplainEdit'
import { main_url, getUserId, checkForStaffComplain, stopSaving } from "../../utils/CommonFunction";

class StaffComplainMain extends Component {
    constructor() {
        super();
        this.state = {
            isAddNew: false,
            isTable: true,
            isView: false,
            isEdit: false,
            check_staff_complain: false,
            data: []
        }
    }

    async componentDidMount() {
        var user_id = getUserId("user_info");
        // var check = await checkForStaffComplain(user_id);
        // var id = 0;
        // if (check.length > 0) {
        //     this.setState({ check_staff_complain: true })
        // }
        // else { id = user_id }
        this.getStaffComplain(user_id);

    }
    goBack = () => {
        window.location.reload();
    }

    getStaffComplain(id) {
        fetch(main_url + "staff_complain/getStaffComplain/" + id)
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

    addStaffComplain = () => {
        this.setState({
            isAddNew: true,
            isEdit: false,
            isTable: false,
            isView: false
        });
    };

    goToTable = () => {
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
            stopSaving();
            toast.error(text);
        }
    }

    render() {
        return (
            <div className="wedding-benefit border-bottom white-bg dashboard-header">
                <ToastContainer position={toast.POSITION.TOP_RIGHT} />

                {
                    this.state.isAddNew ? <StaffComplainAddNew goBack={this.goBack} goToTable={this.goToTable} showToast={this.showToast} /> : ''
                }
                {
                    this.state.isView ? <StaffComplainView data={this.state.data} goBack={this.goBack} /> : ''
                }
                {
                    this.state.isEdit ? <StaffComplainEdit edit={this.edit} goBack={this.goBack} goToTable={this.goToTable} data={this.state.data} showToast={this.showToast} /> : ''
                }
                {
                    this.state.isTable ?
                        <StaffComplainTable goToViewForm={this.goToViewForm} addStaffComplain={this.addStaffComplain} goToEditForm={this.goToEditForm} data={this.state.data} check_staff_complain={this.check_staff_complain} /> : ''
                }

            </div>
        )
    }
}

export default StaffComplainMain;