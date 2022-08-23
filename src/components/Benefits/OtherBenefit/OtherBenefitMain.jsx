import React, { Component } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import BenefitPageHeader from '../BenefitPageHeader';
import BenefitOtherTable from './BenefitOtherTable';
import BenefitOtherAddNew from './BenefitOtherAddNew';
import BenefitOtherView from './BenefitOtherView';
import BenefitOtheEdit from './BenefitOtherEdit';
import { main_url, getUserId, getMainRole, getCookieData, getPermissionStatus, startSaving } from "../../../utils/CommonFunction";
class OtherBenefitMain extends Component {
    constructor() {
        super();
        this.state = {
            user_id: getUserId("user_info"),
            user_info: getCookieData("user_info"),
            is_main_role: getMainRole(),
            isAddNew: false,
            isTable: true,
            isView: false,
            data: [],
            permission_status: {},
            requestData:[]
        }
    }

    async componentDidMount() {
        var permission_status = await getPermissionStatus(this.state.user_info.designations_id, 'Other Benefit', 'Benefit');
        this.getOtherBenefit();
        this.setState({
            permission_status: permission_status
        })
    }

    setupForm = () => {
        this.setState({
            isAddNew: true,
            isTable: false
        });
    };

    goToEditForm = (data) => {
        this.setState({
            data: data,
            isAddNew: false,
            isView: false,
            isEdit: true,
            isTable: false
        })
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
    getOtherBenefit() {
        let id = this.state.user_id;

        fetch(main_url + "benefit/getOtherBenefit/" + id)
            .then(response => {
                if (response.ok) return response.json()
            })
            .then(res => {

                if (res) {
                    this.setState({ data: res,requestData:res.filter(v=>v.createdBy ==this.state.user_id) })
                }
            })
            .catch(error => console.error(`Fetch Error =\n`, error));

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

                <BenefitPageHeader pageTitle="Other" setupForm={this.setupForm} isAddNew={this.state.isAddNew} isView={this.state.isView} isEdit={this.state.isEdit} permission={this.state.permission_status} />

                <br />
                <div>
          <ul className="nav nav-tabs tab" role="tablist" id="tab-pane">
            <li className="active">
              <a className="nav-link active" href="#wedding_benefit" role="tab" data-toggle="tab" aria-selected="true" onClick={() => this.requestlist('myrequest')}>My Request</a>
            </li>
            <li className="nav-item1">
              <a className="nav-link" href="#wedding_benefit" role="tab" data-toggle="tab" onClick={() => this.requestlist('allrequest')}>All Request</a>
            </li>
          </ul>
        </div>

                {
                    this.state.isTable ?
                        <BenefitOtherTable data={this.state.requestData} goToViewForm={this.goToViewForm} goToEditForm={this.goToEditForm} permission={this.state.permission_status} /> :
                        this.state.isAddNew ?
                            <BenefitOtherAddNew goToTable={this.goToTable} data={this.state.data} showToast={this.showToast} /> : ""
                }

                {
                    this.state.isView ?

                        <BenefitOtherView data={this.state.data} /> : ''

                }

                {
                    this.state.isEdit ?

                        <BenefitOtheEdit data={this.state.data} showToast={this.showToast} /> : ''

                }

            </div>
        )
    }
}

export default OtherBenefitMain;