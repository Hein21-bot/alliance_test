import React, { Component } from 'react';
import BenefitPageHeader from '../BenefitPageHeader';
import BenefitWeddingTable from './BenefitWeddingTable';
import BenefitWeddingAddNew from './BenefitWeddingAddNew';
import BenefitWeddingView from './BenefitWeddingView';
import { ToastContainer, toast } from 'react-toastify';
import { main_url, getUserId, getMainRole, getWorkFlowStatus, getCookieData, getPermissionStatus, startSaving } from "../../../utils/CommonFunction";

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
            requestType:''
        }
    }

    async componentDidMount() {
        var permission_status = await getPermissionStatus(this.state.user_info.designations_id, 'Wedding Benefit', 'Benefit');
        this._getWeddingBenefit();
        this.setState({
            permission_status: permission_status
        })
    }

    _getWeddingBenefit() {
        let id = this.state.user_id;

        fetch(main_url + "wedding_benefit/getWeddingBenefit/" + id)
            .then(response => {
                if (response.ok) return response.json()
            })
            .then(res => {
                if (res) {
                    this.setState({ 
                        datasource: res,
                        requestData:res.filter(v=>v.createdBy != this.state.user_id)
                    })
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
                        <BenefitWeddingTable data={this.state.requestData} requestlist={this.requestlist} goToViewForm={this.goToViewForm} goToEditForm={this.goToEditForm} permission={this.state.permission_status} requestType={this.state.requestType} /> : ''

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