import React, { Component } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import BenefitPageHeader from '../BenefitPageHeader';
import BenefitOtherTable from './BenefitOtherTable';
import BenefitOtherAddNew from './BenefitOtherAddNew';
import BenefitOtherView from './BenefitOtherView';
import BenefitOtheEdit from './BenefitOtherEdit';
import DatePicker from 'react-datetime';
import moment from 'moment';
import { main_url, getUserId, getMainRole, getCookieData, getPermissionStatus, startSaving, getFirstDayOfMonth } from "../../../utils/CommonFunction";
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
            requestData:[],
            active_tab: 0,
            start_date:new Date(getFirstDayOfMonth()),
            end_date:new Date()
        }
    }

    async componentDidMount() {
        var permission_status = await getPermissionStatus(this.state.user_info.designations_id, 'Other Benefit', 'Benefit');

    //    var permission_status = await getPermissionStatus(this.state.user_info.role_id, 'Other Benefit', 'Benefit');
        // this.getOtherBenefit();
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
    // getOtherBenefit() {
    //     let id = this.state.user_id;

    //     fetch(main_url + "benefit/getOtherBenefit/" + id)
    //         .then(response => {
    //             if (response.ok) return response.json()
    //         })
    //         .then(res => {

    //             if (res) {
    //                 this.setState({ data: res,requestData:res.filter(v=>v.createdBy != this.state.user_id) })
    //             }
    //         })
    //         .catch(error => console.error(`Fetch Error =\n`, error));

    // }
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
        fetch(main_url + "benefit/getOtherBenefit/" + id+'/'+moment(this.state.start_date).format('YYYY-MM-DD')+"/"+moment(this.state.end_date).format('YYYY-MM-DD'))
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
        fetch(main_url + "benefit/getOtherBenefit/"+ id + "/" + moment(this.state.start_date).format("YYYY-MM-DD") + "/" + moment(this.state.end_date).format("YYYY-MM-DD"))
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

    render() {
        return (
            <div className="wedding-benefit border-bottom white-bg dashboard-header">
                <ToastContainer position={toast.POSITION.TOP_RIGHT} />

                <BenefitPageHeader pageTitle="Other" setupForm={this.setupForm} isAddNew={this.state.isAddNew} isView={this.state.isView} isEdit={this.state.isEdit} permission={this.state.permission_status} />

                <br />
               

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
                        <BenefitOtherTable start_date={this.state.start_date} end_date={this.state.end_date} tab={this.state.active_tab} goToViewForm={this.goToViewForm} goToEditForm={this.goToEditForm} permission={this.state.permission_status} /> </div>:
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