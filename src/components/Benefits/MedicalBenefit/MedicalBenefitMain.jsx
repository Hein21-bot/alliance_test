import React, { Component } from 'react';
import BenefitPageHeader from '../BenefitPageHeader';
import BenefitMedicalTable from './BenefitMedicalTable';
import BenefitMedicalAddNew from './BenefitMedicalAddNew';
import BenefitMedicalView from './MedicalBenefitView';
import { ToastContainer, toast } from 'react-toastify';
import { getUserId, getCookieData, getPermissionStatus, main_url, startSaving, getEmployeeId } from "../../../utils/CommonFunction";
class MedicalBenefitMain extends Component {
    constructor() {
        super();
        this.state = {
            user_id: getUserId("user_info"),
            user_info: getCookieData("user_info"),
            isAddNew: false,
            isTable: true,
            isView: false,
            isEdit: false,
            data: [],
            permission_status: {},
           
            active_tab: 0,

        }
    }

    async componentDidMount() {
        var permission_status = await getPermissionStatus(this.state.user_info.designations_id, 'Medical Benefit', 'Benefit');

//        var permission_status = await getPermissionStatus(this.state.user_info.role_id, 'Medical Benefit', 'Benefit');
        // this._getMedicalBenefit();
        this._getEmployeeId();
        this.setState({
            permission_status: permission_status
        })
    }

    // _getMedicalBenefit() {
    //     let id = this.state.user_id;
    //     fetch(main_url + "medical_benefit/getMedicalBenefit/" + id)
    //         .then(response => {
    //             if (response.ok) return response.json()
    //         })
    //         .then(res => {
    //             this.setState({ data: res,requestData:res.filter(v=>v.createdBy != this.state.user_id) })
    //         })
    //         .catch(error => console.error(`Fetch Error =\n`, error));

    // }
    _getEmployeeId() {
        fetch(main_url + "benefit/getEmployeeList")
            .then(response => {
                if (response.ok) return response.json()
            })
            .then(res => {
                // var joined = this.state.data.push(res)
                this.setState({ data: [...this.state.data, res] })
            })
            .catch(error => console.error(`Fetch Error =\n`, error));

    }
    // getEmployeeId

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
            isAddnew: false,
            isTable: false,
            isView: false,
            isEdit: true,
            data: data
        })
    }
    changeTab(tab) {
        this.setState({ active_tab: tab},()=>{console.log(tab)})
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
    // requestlist = async (data) => {
    //     if (data == 'myrequest') {
    //       this.setState({
    //         requestData: this.state.data.filter(v => v.createdBy==this.state.user_id),
    //         requestType:"myrequest"
            
    //       })
    //     } else if (data == 'allrequest') {
    //       this.setState({
    //         requestData: this.state.data.filter(v => v.createdBy !=this.state.user_id),
    //         requestType:"allrequest"
            
    //       })
    //     }
    //   }

    render() {
        return (
            <div className="wedding-benefit border-bottom white-bg dashboard-header">
                <ToastContainer position={toast.POSITION.TOP_RIGHT} />
                <BenefitPageHeader pageTitle="Medical" setupForm={this.setupForm} isAddNew={this.state.isAddNew} isView={this.state.isView} isEdit={this.state.isEdit} permission={this.state.permission_status} />

                <br />
                
                {
                    this.state.isAddNew || this.state.isEdit ?
                        <BenefitMedicalAddNew data={this.state.data} goToTable={this.goToTable} showToast={this.showToast} /> : ''
                }

                {
                    this.state.isTable ?
                    <div>
                    <div>
                     <ul className="nav nav-tabs tab" role="tablist" id="tab-pane">
                    <li className="nav-item">
                     <a className="nav-link " href="#wedding_benefit" role="tab" data-toggle="tab" aria-selected="true" onClick={() => this.changeTab(1)}>My Request</a>
                    </li>
                    <li className="nav-item1 active">
                    <a className="nav-link active" href="#wedding_benefit" role="tab" data-toggle="tab" onClick={() => this.changeTab(0)}>All Request</a>
                    </li>
                    </ul>

                    </div>
                        <BenefitMedicalTable tab={this.state.active_tab} goToViewForm={this.goToViewForm} goToEditForm={this.goToEditForm} permission={this.state.permission_status} /></div> : ''
                }
                {
                    this.state.isView ?
                        <BenefitMedicalView data={this.state.data} /> : ''
                }

            </div>
        )
    }
}

export default MedicalBenefitMain;