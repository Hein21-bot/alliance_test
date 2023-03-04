import React, { Component } from 'react';
import BenefitPageHeader from '../BenefitPageHeader';
import BenefitMedicalTable from './BenefitMedicalTable';
import BenefitMedicalAddNew from './BenefitMedicalAddNew';
import BenefitMedicalView from './MedicalBenefitView';
import { ToastContainer, toast } from 'react-toastify';
import  DatePicker from 'react-datetime';
import moment from 'moment';
import { getUserId, getCookieData, getPermissionStatus, main_url, startSaving, getEmployeeId, getFirstDayOfMonth } from "../../../utils/CommonFunction";
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
            start_date:new Date(getFirstDayOfMonth()),
            end_date:new Date()

        }
    }

    async componentDidMount() {
        // var permission_status = await getPermissionStatus(this.state.user_info.designations_id, 'Medical Benefit', 'Benefit');

        var permission_status = await getPermissionStatus(this.state.user_info.role_id, 'Medical Benefit', 'Benefit');
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

    getAllBenefits() {
        let id = this.state.user_id;
        fetch(main_url + "medical_benefit/getMedicalBenefit/" + id+'/'+moment(this.state.start_date).format('YYYY-MM-DD')+"/"+moment(this.state.end_date).format('YYYY-MM-DD'))
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
        fetch(main_url + "medical_benefit/getMedicalBenefit/"+ id + "/" + moment(this.state.start_date).format("YYYY-MM-DD") + "/" + moment(this.state.end_date).format("YYYY-MM-DD"))
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
                    
                        <BenefitMedicalTable start_date={this.state.start_date} end_date={this.state.end_date} tab={this.state.active_tab} goToViewForm={this.goToViewForm} goToEditForm={this.goToEditForm} permission={this.state.permission_status} /></div> : ''
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