import React, { Component } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import HospitalizationAddNew from './HospitalizationAddNew'
import HospitalizationTable from './HospitalizationTable';
import HospitalizationView from './HospitalizationView';
import BenefitPageHeader from '../BenefitPageHeader';
import DatePicker from 'react-datetime'
import moment from 'moment'
import { getUserId, getCookieData, getPermissionStatus, main_url, startSaving, getEmployeeId, getFirstDayOfMonth } from "../../../utils/CommonFunction";

class HospitalizationMain extends Component {
    constructor () {
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
            requestData:[],
            active_tab: 0,
            start_date:new Date(getFirstDayOfMonth()),
            end_date:new Date()

        }

    }
    async componentDidMount() {
        var permission_status = await getPermissionStatus(this.state.user_info.designations_id, 'Hospitalization Benefit', 'Benefit')

        // var permission_status = await getPermissionStatus(this.state.user_info.role_id, 'Hospitalization Benefit', 'Benefit')
        // this._getHospitalizationBenefit();
        
        // this._getEmployeeId();
        this.setState({
            permission_status: permission_status
        })
    }
    // _getHospitalizationBenefit() {
    //     let id = this.state.user_id;
    //     fetch(main_url + "hospitalization_benefit/getHospitalizationBenefit/" + id)
    //         .then(response => {
    //             if (response.ok) return response.json()
    //         })
    //         .then(res => {
    //             this.setState({ data: res,requestData:res.filter(v=>v.createdBy != this.state.user_id) })
    //         })
            
    //         .catch(error => console.error(`Fetch Error =\n`, error));

    // }
    // _getEmployeeId() {
    //     fetch(main_url + "benefit/getEmployeeList")
    //         .then(response => {
    //             if (response.ok) return response.json()
    //         })
    //         .then(res => {
    //             // var joined = this.state.data.push(res)
    //             this.setState({ data: [...this.state.data, res] })
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
        fetch(main_url + "hospitalization_benefit/getHospitalizationBenefit/" + id+'/'+moment(this.state.start_date).format('YYYY-MM-DD')+"/"+moment(this.state.end_date).format('YYYY-MM-DD'))
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
        fetch(main_url + "hospitalization_benefit/getHospitalizationBenefit/"+ id + "/" + moment(this.state.start_date).format("YYYY-MM-DD") + "/" + moment(this.state.end_date).format("YYYY-MM-DD"))
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
            <div className="border-bottom white-bg dashboard-header">
                 <ToastContainer position={toast.POSITION.TOP_RIGHT} />
                 <BenefitPageHeader pageTitle="Hospitalization" setupForm={this.setupForm} isAddNew={this.state.isAddNew} isView={this.state.isView} isEdit={this.state.isEdit} permission={this.state.permission_status} />
                 <br />
                 
                    {
                        this.state.isAddNew || this.state.isEdit ?
                            <HospitalizationAddNew data={this.state.data} goToTable={this.goToTable} showToast={this.showToast} /> : ''
                    }

                    {
                        this.state.isTable ?
                        <div>
                        {/* <div>
                         <ul className="nav nav-tabs tab" role="tablist" id="tab-pane">
                        <li className="nav-item">
                         <a className="nav-link " href="#wedding_benefit" role="tab" data-toggle="tab" aria-selected="true" onClick={() => this.changeTab(1)}>My Request</a>
                        </li>
                        <li className="nav-item1 active">
                        <a className="nav-link active" href="#wedding_benefit" role="tab" data-toggle="tab" onClick={() => this.changeTab(0)}>All Request</a>
                        </li>
                        </ul>
    
                        </div>
                        <div className="row mt-2" style={{display:'flex',alignItems:'end'}}>
                        <div className="col-md-2">
                            <label htmlFor="">Start Date</label>
                            <DatePicker
                  dateFormat="DD/MM/YYYY"
                  value={this.state.start_date}
                  onChange={this.handleSelectedFromdate}
                  timeFormat={false}
                />
                        </div>
                        <div className="col-md-2">
                            <label htmlFor="">End Date</label>
                            <DatePicker
                  dateFormat="DD/MM/YYYY"
                  value={this.state.end_date}
                  onChange={this.handleSelectedTodate}
                  timeFormat={false}
                />
                        </div>
                        <div className="col-md-2">
            <button className='btn btn-primary text-center' 
            style={{ marginLeft: 10, height: 30, padding: '0px 5px 0px 5px' }}
             onClick={() => this.handleSearchData()}>Search</button>

                        </div>
                    </div> */}
                            <HospitalizationTable start_date={this.state.start_date} end_date={this.state.end_date} tab={this.state.active_tab} goToViewForm={this.goToViewForm}  goToEditForm={this.goToEditForm} permission={this.state.permission_status} /></div> : ''
                    }
                    {
                        this.state.isView ?
                            <HospitalizationView data={this.state.data} /> : ''
                    }
            </div>
        )
    }
}

export default HospitalizationMain