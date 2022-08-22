import React, { Component } from 'react';
import BenefitPageHeader from '../BenefitPageHeader';
import TeamBuildingTable from './TeamBuildingTable';
import TeamBuildingAddNew from './TeamBuildingAddNew';
import TeamBuildingEdit from './TeamBuildingEdit';
import TeamBuildingView from './TeamBuildingView';
import { ToastContainer, toast } from 'react-toastify';
import { main_url, getUserId, getMainRole, getWorkFlowStatus, getCookieData, getPermissionStatus, startSaving } from "../../../utils/CommonFunction";

class TeamBuildingMain extends Component {
    constructor() {
        super();
        this.state = {
            isAddNew: false,
            isTable: true,
            isView: false,
            isEdit: false,
            datasource: [],
            user_info: getCookieData("user_info"),
            user_id: getUserId("user_info"),
            is_main_role: getMainRole(),
            permission_status: {},
            requestData:[]
        }
    }

    async componentDidMount() {
        var permission_status = await getPermissionStatus(this.state.user_info.designations_id, 'Team Building', 'Benefit');
        this._getTeamBuildingBenefit();
        this.setState({
            permission_status: permission_status
        })
    }

    _getTeamBuildingBenefit() {
        let id = this.state.user_id;
        fetch(main_url + "team_building/getTeamBuildingBenefit/" + id)
            .then(response => {
                if (response.ok) return response.json()
            })
            .then(res => {
                if (res) {
                    this.setState({ datasource: res, requestData:res.filter(v=>v.createdBy ==this.state.user_id) })
                }
            })
            .catch(error => console.error(`Fetch Error =\n`, error));

    }

    setupForm = () => {
        this.setState({
            isAddNew: true,
            isEdit: false,
            isTable: false
        });
    };

    goToTable = () => {
        this.setState({
            isAddNew: false,
            isEdit: false,
            isTable: true
        })
        window.location.reload();
    }

    goToViewForm = (data) => {
        this.setState({
            isAddNew: false,
            isTable: false,
            isEdit: false,
            isView: true,
            datasource: data
        })
    }

    goToEditForm = (data) => {
        this.setState({
            isAddnew: false,
            isTable: false,
            isView: false,
            isEdit: true,
            datasource: data
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
            requestData: this.state.datasource.filter(v => v.createdBy==this.state.user_id),
            requestType:"myrequest"
            
          })
        } else if (data == 'allrequest') {
          this.setState({
            requestData: this.state.datasource.filter(v => v.createdBy !=this.state.user_id),
            requestType:"allrequest"
            
          })
        }
      }


    render() {
        return (
            <div className="wedding-benefit border-bottom white-bg dashboard-header">
                <ToastContainer position={toast.POSITION.TOP_RIGHT} />

                <BenefitPageHeader pageTitle="Team Building" setupForm={this.setupForm} isAddNew={this.state.isAddNew} isView={this.state.isView} isEdit={this.state.isEdit} permission={this.state.permission_status} />

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
                    this.state.isAddNew ?
                        <TeamBuildingAddNew goToTable={this.goToTable} data={this.state.datasource} showToast={this.showToast} /> : ''
                }

                {
                    this.state.isEdit ?
                        <TeamBuildingEdit goToTable={this.goToTable} data={this.state.datasource} showToast={this.showToast} /> : ''
                }

                {
                    this.state.isTable ?
                        <TeamBuildingTable data={this.state.requestData} goToViewForm={this.goToViewForm} goToEditForm={this.goToEditForm} permission={this.state.permission_status} /> : ''

                }
                {
                    this.state.isView ?
                        <TeamBuildingView data={this.state.datasource} isView={this.state.isView} /> : ''

                }


            </div>
        )

    }
}



export default TeamBuildingMain;