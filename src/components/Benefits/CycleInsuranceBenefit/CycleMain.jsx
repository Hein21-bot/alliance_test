import React, { Component } from 'react';
import CycleView from './CycleView'
import CycleAddNew from './CycleAddNew'
import CycleTable from './CycleTable'
import { getUserId, getCookieData, getPermissionStatus, main_url, startSaving } from "../../../utils/CommonFunction";
import { toast, ToastContainer } from 'react-toastify';
import BenefitPageHeader from '../BenefitPageHeader';
class CycleMain extends Component {
    constructor () {
        super()
        this.state = {
            user_id: getUserId("user_info"),
            user_info: getCookieData("user_info"),
            isAddNew: false,
            isTable: true,
            isView: false,
            isEdit: false,
            data: [],
            permission_status: {},
            requestData:[]
        }
    }  
    async componentDidMount() {
        var permission_status = await getPermissionStatus(this.state.user_info.designations_id, 'Cycle Insurance', 'Benefit')
        this._getCycleInsurance();
        // this._getEmployeeId();
        this.setState({
            permission_status: permission_status
        })
    }
    _getCycleInsurance() {
        let id = this.state.user_id;
        
        fetch(main_url + "cycleInsurance/getCycleInsurance/" + id)
            .then(response => {
                if (response.ok) return response.json()
            })
            .then(res => {
                this.setState({ data: res, requestData:res.filter(v=>v.createdBy ==this.state.user_id) })
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

    goToTable = () => {
        this.setState({
            isAddNew: false,
            isTable: true,
            isView: false
        })
        window.location.reload();
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

    render(){
        return (
            <div className="border-bottom white-bg dashboard-header">
            <ToastContainer position={toast.POSITION.TOP_RIGHT} />
            <BenefitPageHeader pageTitle="Cycle Insurance" setupForm={this.setupForm} isAddNew={this.state.isAddNew} isView={this.state.isView} isEdit={this.state.isEdit} permission={this.state.permission_status} />
            <br />
            
               {
                   this.state.isAddNew || this.state.isEdit ?
                       <CycleAddNew data={this.state.data} goToTable={this.goToTable} showToast={this.showToast} /> : ''
               }

               {
                   this.state.isTable ?
                       <CycleTable goToViewForm={this.goToViewForm} requestlist={this.requestlist} data={this.state.requestData} goToEditForm={this.goToEditForm} permission={this.state.permission_status} /> : ''
               }
               {
                   this.state.isView ?
                       <CycleView data={this.state.data} /> : ''
               }
       </div>
    )}

}

export default CycleMain