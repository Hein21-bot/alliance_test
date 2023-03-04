import React, { Component } from 'react';
import BenefitPageHeader from '../BenefitPageHeader';
import { toast, ToastContainer } from 'react-toastify';
import BenefitExternalTrainingTable from './BenefitExternalTrainingTable';
import BenefitExternalTrainingAddNew from './BenefitExternalTrainingAddNew';
import BenefitExternalTrainingView from './BenefitExternalTrainingView';
import BenefitExternalTrainingEdit from './BenefitExternalTrainingEdit';
import DatePicker from 'react-datetime'
import moment from 'moment'
//import { timingSafeEqual } from 'crypto';
import { main_url, getMainRole, getUserId, getCookieData, getPermissionStatus, startSaving, getFirstDayOfMonth } from "../../../utils/CommonFunction";
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
            start_date:new Date(getFirstDayOfMonth()),
            end_date:new Date()
            
        }
    }

    async componentDidMount() {
        // var permission_status = await getPermissionStatus(this.state.user_info.designations_id, 'External Training Benefit', 'Benefit');

        var permission_status = await getPermissionStatus(this.state.user_info.role_id, 'External Training Benefit', 'Benefit');
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
    getAllBenefits() {
        let id = this.state.user_id;
        fetch(main_url + "external_benefit/getExternalBenefit/" + id+'/'+moment(this.state.start_date).format('YYYY-MM-DD')+"/"+moment(this.state.end_date).format('YYYY-MM-DD'))
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
        fetch(main_url + "external_benefit/getExternalBenefit/"+ id + "/" + moment(this.state.start_date).format("YYYY-MM-DD") + "/" + moment(this.state.end_date).format("YYYY-MM-DD"))
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
                    
                        <BenefitExternalTrainingTable start_date={this.state.start_date} end_date={this.state.end_date} tab={this.state.active_tab}  goToViewForm={this.goToViewForm} goToEditForm={this.goToEditForm} permission={this.state.permission_status} /></div> : ' '
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