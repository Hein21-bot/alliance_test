import React, { Component } from 'react';
import BenefitPageHeader from '../BenefitPageHeader';
import TeamBuildingTable from './TeamBuildingTable';
import TeamBuildingAddNew from './TeamBuildingAddNew';
import TeamBuildingEdit from './TeamBuildingEdit';
import TeamBuildingView from './TeamBuildingView';
import { ToastContainer, toast } from 'react-toastify';
import moment from 'moment'
import  DatePicker  from 'react-datetime';
import { main_url, getUserId, getMainRole, getWorkFlowStatus, getCookieData, getPermissionStatus, startSaving, getFirstDayOfMonth } from "../../../utils/CommonFunction";

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
            requestData:[],
            active_tab: 0,
            start_date:new Date(getFirstDayOfMonth()),
            end_date:new Date()
        }
    }

    async componentDidMount() {
        var permission_status = await getPermissionStatus(this.state.user_info.designations_id, 'Team Building', 'Benefit');

        // var permission_status = await getPermissionStatus(this.state.user_info.role_id, 'Team Building', 'Benefit');
        // this._getTeamBuildingBenefit();
        this.setState({
            permission_status: permission_status
        })
    }

    // _getTeamBuildingBenefit() {
    //     let id = this.state.user_id;
    //     fetch(main_url + "team_building/getTeamBuildingBenefit/" + id)
    //         .then(response => {
    //             if (response.ok) return response.json()
    //         })
    //         .then(res => {
    //             if (res) {
    //                 this.setState({ datasource: res, requestData:res.filter(v=>v.createdBy != this.state.user_id) })
    //             }
    //         })
    //         .catch(error => console.error(`Fetch Error =\n`, error));

    // }

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
    getAllBenefits() {
        let id = this.state.user_id;
        fetch(main_url + "team_building/getTeamBuildingBenefit/" + id+'/'+moment(this.state.start_date).format('YYYY-MM-DD')+"/"+moment(this.state.end_date).format('YYYY-MM-DD'))
        // fetch(main_url + "birthday_benefit/getBirthdayBenefit/" + id + "/" + moment(this.state.s_date).format("YYYY-MM-DD") + "/" + moment(this.state.e_date).format("YYYY-MM-DD"))
            .then(response => {
                if (response.ok) return response.json()
            })
            .then(res => {
                if (res) {
                    this.setState({ 
                        data: res,
                        requestData:res.filter(v=>v.createdBy != this.state.user_id),
                    }, () => this._setTableData(this.state.requestData))
                }
            })
            .catch(error => console.error(`Fetch Error =\n`, error));

    }
    getMyBenefits() {
        let id = this.state.user_id;
        // fetch(main_url + "birthday_benefit/getBirthdayBenefit/" + id)
        fetch(main_url + "team_building/getTeamBuildingBenefit/"+ id + "/" + moment(this.state.start_date).format("YYYY-MM-DD") + "/" + moment(this.state.end_date).format("YYYY-MM-DD"))
            .then(response => {
                if (response.ok) return response.json()
            })
            .then(res => {
                if (res) {
                    this.setState({ 
                        requestData: res,
                        requestData:res.filter(v=>v.createdBy == this.state.user_id)
                    }, () => this._setTableData(this.state.requestData))
                }
            })
            .catch(error => console.error(`Fetch Error =\n`, error));

    }
    handleSelectedFromdate = async (event) => {
        this.setState({
           start_date : event
        })
    }
    
     handleSelectedTodate = async (event) => {
        this.setState({
           end_date : event
        })
    }
    handleSearchData=()=>{
        console.log("search")
        if (this.state.active_tab == 0) {
            this.getAllBenefits();
        } else if (this.state.active_tab == 1) {
            this.getMyBenefits();
        }
    }
    // requestlist = async (data) => {
    //     if (data == 'myrequest') {
    //       this.setState({
    //         requestData: this.state.datasource.filter(v => v.createdBy==this.state.user_id),
    //         requestType:"myrequest"
            
    //       })
    //     } else if (data == 'allrequest') {
    //       this.setState({
    //         requestData: this.state.datasource.filter(v => v.createdBy !=this.state.user_id),
    //         requestType:"allrequest"
            
    //       })
    //     }
    //   }


    render() {
        return (
            <div className="wedding-benefit border-bottom white-bg dashboard-header">
                <ToastContainer position={toast.POSITION.TOP_RIGHT} />

                <BenefitPageHeader pageTitle="Team Building" setupForm={this.setupForm} isAddNew={this.state.isAddNew} isView={this.state.isView} isEdit={this.state.isEdit} permission={this.state.permission_status} />

                <br />
                

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
                    <div>
                    
                        <TeamBuildingTable start_date={this.state.start_date} end_date={this.state.end_date} tab={this.state.active_tab}  goToViewForm={this.goToViewForm} goToEditForm={this.goToEditForm} permission={this.state.permission_status} /></div> : ''

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