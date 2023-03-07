import React, { Component } from 'react';
import BenefitPageHeader from '../BenefitPageHeader';
import BenefitWeddingTable from './BenefitWeddingTable';
import BenefitWeddingAddNew from './BenefitWeddingAddNew';
import BenefitWeddingView from './BenefitWeddingView';
import { ToastContainer, toast } from 'react-toastify';
import moment from 'moment'
import  DatePicker  from 'react-datetime';
import { main_url, getUserId, getMainRole, getWorkFlowStatus, getCookieData, getPermissionStatus, startSaving, getFirstDayOfMonth } from "../../../utils/CommonFunction";

class WeddingBenefitMain extends Component {
    constructor() {
        super();
        this.state = {
            isAddNew: false,
            user_info: getCookieData("user_info"),
            user_id: getUserId("user_info"),
            is_main_role: getMainRole(),
            isTable: true,
            isView: false,
            isEdit: false,
            datasource: [],
            requestData:[],
            permission_status: {},
            requestType:'',
            active_tab: 0,
            start_date:new Date(getFirstDayOfMonth()),
            end_date:new Date()
        }
    }

    async componentDidMount() {
       var permission_status = await getPermissionStatus(this.state.user_info.designations_id, 'Wedding Benefit', 'Benefit');

    // var permission_status = await getPermissionStatus(this.state.user_info.role_id, 'Wedding Benefit', 'Benefit');
        // this._getWeddingBenefit();
        this.setState({
            permission_status: permission_status
        })
    }

    // _getWeddingBenefit() {
    //     let id = this.state.user_id;

    //     fetch(main_url + "wedding_benefit/getWeddingBenefit/" + id)
    //         .then(response => {
    //             if (response.ok) return response.json()
    //         })
    //         .then(res => {
    //             if (res) {
    //                 this.setState({ 
    //                     datasource: res,
    //                     requestData:res.filter(v=>v.createdBy != this.state.user_id)
    //                 })
    //             }
    //         })
    //         .catch(error => console.error(`Fetch Error =\n`, error));

    // }
    changeTab(tab) {
        this.setState({ active_tab: tab},()=>{console.log(tab)})
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
        // window.location.reload();
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
            // window.location.reload();
        }
        else {
            startSaving();
            toast.error(text);
        }

    }
    // getAllBenefits() {
    //     let id = this.state.user_id;
    //     fetch(main_url + "wedding_benefit/getWeddingBenefit/" + id+'/'+moment(this.state.start_date).format('YYYY-MM-DD')+"/"+moment(this.state.end_date).format('YYYY-MM-DD'))
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
    //     let id = this.state.user_id;
    //     // fetch(main_url + "birthday_benefit/getBirthdayBenefit/" + id)
    //     fetch(main_url + "wedding_benefit/getWeddingBenefit/"+ id + "/" + moment(this.state.start_date).format("YYYY-MM-DD") + "/" + moment(this.state.end_date).format("YYYY-MM-DD"))
    //         .then(response => {
    //             if (response.ok) return response.json()
    //         })
    //         .then(res => {
    //             if (res) {
    //                 this.setState({ 
    //                     data: res,
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
    
    //  handleSelectedTodate = async (event) => {
    //     this.setState({
    //        end_date : event
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
             

    render() { console.log("request data in main",this.state.requestData);
        
        return (
            <div className="wedding-benefit border-bottom white-bg dashboard-header">
               
                <ToastContainer position={toast.POSITION.TOP_RIGHT} />

                <BenefitPageHeader pageTitle="Wedding" setupForm={this.setupForm}
                    isAddNew={this.state.isAddNew} isView={this.state.isView}
                    isEdit={this.state.isEdit} permission={this.state.permission_status} />

                <br />
                
                {
                    this.state.isAddNew || this.state.isEdit ?
                        <BenefitWeddingAddNew goToTable={this.goToTable}  data={this.state.datasource} showToast={this.showToast} /> : ''
                }

                {
                    this.state.isTable ?
            //         <div>
            //               <div>
            //                <ul className="nav nav-tabs tab" role="tablist" id="tab-pane">
            //               <li className="nav-item">
            //                <a className="nav-link " href="#wedding_benefit" role="tab" data-toggle="tab" aria-selected="true" onClick={() => this.changeTab(1)}>My Request</a>
            //               </li>
            //               <li className="nav-item1 active">
            //               <a className="nav-link active" href="#wedding_benefit" role="tab" data-toggle="tab" onClick={() => this.changeTab(0)}>All Request</a>
            //               </li>
            //               </ul>

            //               </div>
            //               <div className="row mt-2" style={{display:'flex',alignItems:'end'}}>
            //             <div className="col-md-2">
            //                 <label htmlFor="">Start Date</label>
            //                 <DatePicker
            //       dateFormat="DD/MM/YYYY"
            //       value={this.state.start_date}
            //       onChange={this.handleSelectedFromdate}
            //       timeFormat={false}
            //     />
            //             </div>
            //             <div className="col-md-2">
            //                 <label htmlFor="">End Date</label>
            //                 <DatePicker
            //       dateFormat="DD/MM/YYYY"
            //       value={this.state.end_date}
            //       onChange={this.handleSelectedTodate}
            //       timeFormat={false}
            //     />
            //             </div>
            //             <div className="col-md-2">
            // <button className='btn btn-primary text-center' 
            // style={{ marginLeft: 10, height: 30, padding: '0px 5px 0px 5px' }}
            //  onClick={() => this.handleSearchData()}>Search</button>

            //             </div>
            //         </div>
                        <BenefitWeddingTable request_data={this.state.requestData} start_date={this.state.start_date} end_date={this.state.end_date} tab={this.state.active_tab} goToViewForm={this.goToViewForm} goToEditForm={this.goToEditForm} permission={this.state.permission_status} requestType={this.state.requestType} /> 
                        // </div>
                        : ''
                    
                }
                {
                    this.state.isView ?
                        <BenefitWeddingView data={this.state.datasource} isView={this.state.isView} /> : ''
                }

            </div>
        )

    }
}


export default WeddingBenefitMain;