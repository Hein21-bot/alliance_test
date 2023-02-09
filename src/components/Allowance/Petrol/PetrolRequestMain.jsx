import React, { Component } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { getCookieData, getWorkFlowStatus, getPermissionStatus, startSaving } from '../../../utils/CommonFunction';
import PetrolRequestParentTable from "./PetrolRequestParentTable";
import PetrolRequestSelectType from "./PetrolRequestSelectType";
import PageHeader from '../../layouts/PageHeader';
import PetrolRequestByBmEdit from './PetrolRequestByBmEdit';
import PetrolRequestByBmView from './PetrolRequestByBmView';
import PetrolRequestByEmployeeView from './PetrolRequestByEmployeeView';
import PetrolRequestByEmployee from './PetrolRequestByEmployee';

class PetrolRequestMain extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user_info: getCookieData("user_info"),
            PetrolOptions: [
                { value: 1, label: 'Petrol By BM' },
                { value: 2, label: 'Petrol By Staff' }
            ],

            isBM: false,
            isEmployee: false,
            isAddNew: false,
            isTable: true,
            isBMView: false,
            isBMEdit: false,
            isEmployeeView: false,
            isEmployeeEdit: false,
            data: [],
            isView: false,
            isEdit: false,
            permission_status_bm: {},
            permission_status_staff: {}
        };
        this.handlePetrolRequestType = this.handlePetrolRequestType.bind(this);
    }

    async componentDidMount() {
        var permission_bm = await getPermissionStatus(this.state.user_info.designations_id, 'Petrol By BM', 'Allowance');
        var permission_staff = await getPermissionStatus(this.state.user_info.designations_id, 'Petrol By Staff', 'Allowance');
        // var permission_bm = await getPermissionStatus(this.state.user_info.role_id, 'Petrol By BM', 'Allowance');
        // var permission_staff = await getPermissionStatus(this.state.user_info.role_id, 'Petrol By Staff', 'Allowance');
        this.setState({
            permission_status_bm: permission_bm,
            permission_status_staff: permission_staff
        })
    }

    handlePetrolRequestType(event) {
        if (event.value == 1) {
            this.setState({
                isBM: true,
                isEmployee: false,
                data: []

            });

        } else {
            this.setState({
                isEmployee: true,
                isBM: false
            })
        }

    }

    goToBMViewForm = (data) => {
        this.setState({
            data: data,
            isBMView: true,
            isTable: false,
            isAddNew: false,
            isBMEdit: false,
            isView: true
        })
    }

    goToBMEditForm = (data) => {
        this.setState({
            data: data,
            isBMEdit: true,
            isAddNew: false,
            isBMView: false,
            isTable: false,
            isEdit: true
        })
    }

    goToEmployeeViewForm = (data) => {
        this.setState({
            data: data,
            isEmployeeView: true,
            isTable: false,
            isAddNew: false,
            isEmployeeEdit: false,
            isView: true
        })
    }

    goToEmployeeEditForm = (data) => {
        this.setState({
            data: data,
            isEmployeeEdit: true,
            isAddNew: false,
            isEmployeeView: false,
            isTable: false,
            isEdit: true
        })
    }

    setupForm = () => {
        this.setState({
            isAddNew: true,
            isTable: false,
            isEdit: false,
            isView: false

        });
    };

    goBack = () => {
        this.setState({
            isAddNew: false,
            isTable: true,
            isEdit: false,
            isView: false
        });

        window.location.reload();
    };

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
            <div className="border-bottom white-bg dashboard-header">
                <ToastContainer position={toast.POSITION.TOP_RIGHT} />

                <PageHeader pageTitle="Petrol Request"
                    title="Allowance"
                    setupForm={this.setupForm} isAddNew={this.state.isAddNew}
                    isView={this.state.isView} isEdit={this.state.isEdit} permission={this.state.isBM ? this.state.permission_status_bm : this.state.permission_status_staff} />
                {
                    this.state.isAddNew ?
                        <PetrolRequestSelectType goBack={this.goBack} add={this.add} showToast={this.showToast} work_flow_status={this.state.work_flow_status_staff} /> : ''
                }

                {
                    this.state.isTable ?
                        <PetrolRequestParentTable
                            data={this.state.data}
                            setupForm={this.setupForm}
                            goToBMViewForm={this.goToBMViewForm}
                            goToBMEditForm={this.goToBMEditForm}
                            goToEmployeeViewForm={this.goToEmployeeViewForm}
                            goToEmployeeEditForm={this.goToEmployeeEditForm}
                            permission_bm={this.state.permission_status_bm}
                            permission_staff={this.state.permission_staff}
                        /> : ''
                }
                <div className="wrapper wrapper-content animated fadeInRight">
                    <div className="row">
                        <div className="form-horizontal" name="demo-form">
                            {
                                this.state.isBMView ?
                                    <PetrolRequestByBmView data={this.state.data} /> : ''
                            }
                            {
                                this.state.isBMEdit ?
                                    <PetrolRequestByBmEdit data={this.state.data} showToast={this.showToast} /> : ''
                            }

                            {
                                this.state.isEmployeeView ?
                                    <PetrolRequestByEmployeeView data={this.state.data} /> : ''
                            }

                            {
                                this.state.isEmployeeEdit ?
                                    <PetrolRequestByEmployee data={this.state.data} showToast={this.showToast} /> : ''
                            }
                        </div>
                    </div>
                </div>
            </div>

        )

    }
}

export default PetrolRequestMain;
