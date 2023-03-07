import React, { Component } from 'react';
import BenefitPageHeader from '../BenefitPageHeader';
import BirthdayFundTable from './BirthdayFundTable';
import BirthdayFundAddNew from './BirthdayFundAddNew';
import BirthdayFundView from './BirthdayFundView'
import BirthdayFundEdit from './BirthdayFundEdit';
import DatePicker from 'react-datetime';
import moment from 'moment'

import { main_url, getCookieData, getUserId, getMainRole, getPermissionStatus, startSaving, getFirstDayOfMonth } from "../../../utils/CommonFunction";
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
            start_date:new Date(getFirstDayOfMonth()),
            end_date:new Date(),
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
      
    // getAllBenefits() {
    //     console.log('all benefit')
    //     let id = this.state.user_id;
    //     fetch(main_url + "birthday_benefit/getBirthdayBenefit/" + id+'/'+moment(this.state.start_date).format('YYYY-MM-DD')+"/"+moment(this.state.end_date).format('YYYY-MM-DD'))
    //     // fetch(main_url + "birthday_benefit/getBirthdayBenefit/" + id + "/" + moment(this.state.s_date).format("YYYY-MM-DD") + "/" + moment(this.state.e_date).format("YYYY-MM-DD"))
    //         .then(response => {
    //             if (response.ok) return response.json()
    //         })
    //         .then(res => {
    //             if (res) {
    //                 this.setState({ 
    //                     data: res,
    //                     requestData:res.filter(v=>v.createdBy != this.state.user_id),
    //                 }
    //                 // , () => this._setTableData(this.state.requestData)
    //                 )
    //             }
    //         })
    //         .catch(error => console.error(`Fetch Error =\n`, error));

    // }
    // getMyBenefits() {
    //     console.log('mybenefit')
    //     let id = this.state.user_id;
    //     // fetch(main_url + "birthday_benefit/getBirthdayBenefit/" + id)
    //     fetch(main_url + "birthday_benefit/getBirthdayBenefit/"+ id + "/" + moment(this.state.start_date).format("YYYY-MM-DD") + "/" + moment(this.state.end_date).format("YYYY-MM-DD"))
    //         .then(response => {
    //             if (response.ok) return response.json()
    //         })
    //         .then(res => {
    //             if (res) {
    //                 this.setState({ 
    //                     requestData: res,
    //                     requestData:res.filter(v=>v.createdBy == this.state.user_id)
    //                 }
    //                 // , () => this._setTableData(this.state.requestData)
    //                 )
    //             }
    //         })
    //         .catch(error => console.error(`Fetch Error =\n`, error));

    // }
    // handleSelectedFromdate = async (event) => {
    //     this.setState({
    //        start_date : event
    //     })
    // }
    // handleSearchData=()=>{
    //     console.log("search")
    //     if (this.state.active_tab == 0) {
    //         this.getAllBenefits();
    //     } else if (this.state.active_tab == 1) {
    //         this.getMyBenefits();
    //     }
    // }
    //  handleSelectedTodate = async (event) => {
    //     this.setState({
    //        end_date : event
    //     })
    // }

    render() {
        console.log('main=====>',this.state.start_date)
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
                    
                
                        <BirthdayFundTable data={this.state.requestData} tab={this.state.active_tab} requestlist={this.requestlist} goToViewForm={this.goToViewForm} goToEditForm={this.goToEditForm} requestType={this.state.requestType} start_date={this.state.start_date} end_date={this.state.end_date} permission={this.state.permission_status} /> </div>: ''

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