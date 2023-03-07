import React, { Component } from 'react';
import BenefitPageHeader from '../BenefitPageHeader';
import { toast, ToastContainer } from 'react-toastify';
import moment from 'moment'
import BenefitChildTable from './BenefitChildTable';
import BenefitChildAddNew from './BenefitChildAddNew';
import BenefitChildView from './BenefitChildView';
import DatePicker from 'react-datetime';

import BenefitChildEdit from './BenefitChildEdit'
import { main_url, getUserId, getMainRole, getCookieData, getPermissionStatus, startSaving, getFirstDayOfMonth } from "../../../utils/CommonFunction";

class ChildBenefitMain extends Component {
    constructor() {
        super();
        this.state = {
            user_id: getUserId("user_info"),
            user_info: getCookieData("user_info"),
            is_main_role: getMainRole(),
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
        var permission_status = await getPermissionStatus(this.state.user_info.designations_id, 'Child Benefit', 'Benefit');

        // var permission_status = await getPermissionStatus(this.state.user_info.role_id, 'Child Benefit', 'Benefit');
        this._getChildBenefit();
        this.setState({
            permission_status: permission_status
        })

    }

    _getChildBenefit() {
        let id = this.state.user_id;

        fetch(main_url + "child_benefit/getChildBenefit/" + id + "/" + moment(this.state.from_date).format("YYYY-MM-DD") + "/" + moment(this.state.to_date).format("YYYY-MM-DD"))
            .then(response => {
                if (response.ok) return response.json()
            })
            .then(res => {

                if (res) {
                    this.setState({ data: res,
                        requestData:res.filter(v=>v.createdBy !=this.state.user_id)})
                }
            })
            .catch(error => console.error(`Fetch Error =\n`, error));

    }
    changeTab(tab) {
        this.setState({ active_tab: tab},()=>{console.log(tab)})
    }

    setupForm = () => {
        this.setState({
            isAddNew: true,
            isEdit: false,
            isTable: false,
            isView: false
        });
    };

    goToTable = () => {
        this.setState({
            isAddNew: false,
            isEdit: false,
            isTable: true,
            isView: false
        })
        window.location.reload();
    }

    goToViewForm = (data) => {
        this.setState({
            data: data,
            isAddNew: false,
            isEdit: false,
            isView: true,
            isTable: false
        })
    }

    goToEditForm = (data) => {
        this.setState({
            data: data,
            isAddNew: false,
            isEdit: true,
            isView: false,
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
      getAllBenefits() {
        let id = this.state.user_id;
        fetch(main_url + "child_benefit/getChildBenefit/" + id+'/'+moment(this.state.start_date).format('YYYY-MM-DD')+"/"+moment(this.state.end_date).format('YYYY-MM-DD'))
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
        fetch(main_url + "child_benefit/getChildBenefit/"+ id + "/" + moment(this.state.start_date).format("YYYY-MM-DD") + "/" + moment(this.state.end_date).format("YYYY-MM-DD"))
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
                <BenefitPageHeader pageTitle="Child" setupForm={this.setupForm} isAddNew={this.state.isAddNew} isView={this.state.isView}
                    isEdit={this.state.isEdit} permission={this.state.permission_status} />

                <br />
                
                {
                    this.state.isAddNew ? <BenefitChildAddNew goToTable={this.goToTable} showToast={this.showToast} /> : ''
                }
                {
                    this.state.isView ? <BenefitChildView data={this.state.data} /> : ''
                }
                {
                    this.state.isEdit ? <BenefitChildEdit data={this.state.data} showToast={this.showToast} /> : ''
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
                          
                        <BenefitChildTable goToViewForm={this.goToViewForm}tab={this.state.active_tab} goToEditForm={this.goToEditForm} data={this.state.requestData} requestlist={this.requestlist} start_date={this.state.start_date} end_date={this.state.end_date} permission={this.state.permission_status} />
                        </div> : ''
                }

            </div>
        )
    }
}

export default ChildBenefitMain;