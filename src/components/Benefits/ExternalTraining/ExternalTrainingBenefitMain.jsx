import React, { Component } from 'react';
import BenefitPageHeader from '../BenefitPageHeader';
import { toast, ToastContainer } from 'react-toastify';
import BenefitExternalTrainingTable from './BenefitExternalTrainingTable';
import BenefitExternalTrainingAddNew from './BenefitExternalTrainingAddNew';
import BenefitExternalTrainingView from './BenefitExternalTrainingView';
import BenefitExternalTrainingEdit from './BenefitExternalTrainingEdit';
//import { timingSafeEqual } from 'crypto';
import { main_url, getMainRole, getUserId, getCookieData, getPermissionStatus, startSaving } from "../../../utils/CommonFunction";
class ExternalTrainingBenefitMain extends Component {
    constructor() {
        super();
        this.state = {
            isAddNew: false,
            isTable: true,
            isView: false,
            isEdit: false,
            data: [],
            user_id: getUserId("user_info"),
            user_info: getCookieData("user_info"),
            is_main_role: getMainRole(),
            permission_status: {},
            requestData:[],
            active_tab: 0,
            
        }
    }

    async componentDidMount() {
        var permission_status = await getPermissionStatus(this.state.user_info.designations_id, 'External Training Benefit', 'Benefit');

        // var permission_status = await getPermissionStatus(this.state.user_info.role_id, 'External Training Benefit', 'Benefit');
        // this._getExternalBenefit();
        this.setState({
            permission_status: permission_status
        })
    }

    // _getExternalBenefit() {
    //     let id = this.state.user_id;

    //     fetch(main_url + "external_benefit/getExternalBenefit/" + id)
    //         .then(response => {
    //             if (response.ok) return response.json()
    //         })
    //         .then(res => {

    //             if (res) {

    //                 this.setState({ data: res,requestData:res.filter(v=>v.createdBy !=this.state.user_id) })
    //             }
    //         })
    //         .catch(error => console.error(`Fetch Error =\n`, error));

    // }


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
    //     if (data == 'allrequest') {
    //         this.setState({
    //           requestData: this.state.data.filter(v => v.createdBy !=this.state.user_id),
    //           requestType:"allrequest"
              
    //         })
    //       }else if (data == 'myrequest') {
    //         this.setState({
    //           requestData: this.state.data.filter(v => v.createdBy == this.state.user_id),
    //           requestType:"myrequest"
              
    //         })
    //       }
         
        
    //   }

    render() {
        return (
            <div className="wedding-benefit border-bottom white-bg dashboard-header">
                <ToastContainer position={toast.POSITION.TOP_RIGHT} />
                <BenefitPageHeader pageTitle="External Training" setupForm={this.setupForm} 
                isAddNew={this.state.isAddNew} isView={this.state.isView} isEdit={this.state.isEdit} 
                permission={this.state.permission_status} />

                <br />
                
                {
                    this.state.isAddNew ?
                        <BenefitExternalTrainingAddNew goToTable={this.goToTable} data={this.state.data} showToast={this.showToast} /> : ''
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
                        <BenefitExternalTrainingTable tab={this.state.active_tab}  goToViewForm={this.goToViewForm} goToEditForm={this.goToEditForm} permission={this.state.permission_status} /></div> : ' '
                }
                {
                    this.state.isView ?
                        <BenefitExternalTrainingView data={this.state.data} /> : ''
                }
                {
                    this.state.isEdit ?
                        <BenefitExternalTrainingEdit data={this.state.data} showToast={this.showToast} /> : ''
                }
            </div>
        )
    }
}

export default ExternalTrainingBenefitMain;