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
            permission_status: {},
            requestData:[],
            active_tab: 0,
        }
    }

    async componentDidMount() {
        var permission_status = await getPermissionStatus(this.state.user_info.designations_id, 'Birthday Benefit', 'Benefit');

        //  var permission_status = await getPermissionStatus(this.state.user_info.role_id, 'Birthday Benefit', 'Benefit');
        // this._getBirthdayBenefit();
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
                    this.setState({ 
                        data: res,
                        requestData:res.filter(v=>v.createdBy !=this.state.user_id)
                    })
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
    changeTab(tab) {
        this.setState({ active_tab: tab},()=>{console.log(tab)})
    }
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
    requestlist = async (data) => {
        if (data == 'myrequest') {
          this.setState({
            requestData: this.state.data.filter(v => v.createdBy==this.state.user_id),
            requestType:"myrequest"
            
          })
        } else if (data == 'allrequest') {
          this.setState({
            requestData: this.state.data.filter(v => v.createdBy !=this.state.user_id),
            requestType:"allrequest"
            
          })
        }
      }

    render() {
        return (
            <div className="wedding-benefit border-bottom white-bg dashboard-header">
                <ToastContainer position={toast.POSITION.TOP_RIGHT} />

                <BenefitPageHeader pageTitle="Birthday Fund" setupForm={this.setupForm}
                    isAddNew={this.state.isAddNew} isView={this.state.isView}
                    isEdit={this.state.isEdit} permission={this.state.permission_status} />

                <br />
               

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
                        <BirthdayFundTable data={this.state.requestData} tab={this.state.active_tab} requestlist={this.requestlist} goToViewForm={this.goToViewForm} goToEditForm={this.goToEditForm} requestType={this.state.requestType} permission={this.state.permission_status} /> </div>: ''

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