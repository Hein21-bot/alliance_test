import React, { Component } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import PermissionAddNew from './PermissionAddNew';
import PermissionTable from './PermissionTable';
import PermissionEdit from './PermissionEdit';
import { main_url, getMainRole, getUserId } from "../../utils/CommonFunction";
class WorkFlowMain extends Component {
    constructor() {
        super();
        this.state = {
            isAddNew: false,
            isTable: true,
            isView: false,
            isEdit: false,
            data: [],
            user_id: getUserId("user_info"),
            is_main_role: getMainRole()
        }
    }


    setupForm = () => {
        fetch(main_url + "permission/getPermissionTypeAndPermissionTitle")
            .then(response => {
                if (response.ok) return response.json()
            })
            .then(res => {

                this.setState({
                    isAddNew: true,
                    isTable: false,
                    isView: false,
                    data: res
                });


            })
            .catch(error => console.error(`Fetch Error =\n`, error));


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

    goBack = () => {
        this.setState({
            isAddnew: false,
            isTable: true,
            isView: false,
            isEdit: false
        })
        window.location.reload();
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
    showToast = (text) => {

        toast.error(text);

    }

    render() {

        return (

            <div>

                {
                    this.state.isAddNew ?
                        <PermissionAddNew goToTable={this.goToTable} data={this.state.data} showToast={this.showToast} goBack={this.goBack} /> : ''
                }

                {
                    this.state.isTable ?
                        <PermissionTable setupForm={this.setupForm} goToViewForm={this.goToViewForm} goToEditForm={this.goToEditForm} /> : ' '

                }
                {
                    this.state.isEdit ?
                        <PermissionEdit data={this.state.data} goBack={this.goBack} showToast={this.showToast} /> : ''
                }

            </div>
        )
    }
}

export default WorkFlowMain;