import React, { Component } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import BenefitPageHeader from '../BenefitPageHeader';
import BenefitFuneralTable from './BenefitFuneralTable';
import BenefitFuneralAddNew from './BenefitFuneralAddNew';
import BenefitFuneralView from './BenefitFuneralView';
import BenefitFuneralEdit from './BenefitFuneralEdit';
import { main_url, getUserId, getMainRole, getCookieData, getPermissionStatus, startSaving } from "../../../utils/CommonFunction";

class FuneralBenefitMain extends Component {
    constructor() {
        super();
        this.state = {
            user_id: getUserId("user_info"),
            user_info: getCookieData("user_info"),
            is_main_role: getMainRole(),
            isAddNew: false,
            isTable: true,
            datasource: [],
            permission_status: {},
            requestData:[],
        }
    }

    async componentDidMount() {
        var permission_status = await getPermissionStatus(this.state.user_info.designations_id, 'Funeral Benefit', 'Benefit');
        this.getFunealBenefit();
        this.setState({
            permission_status: permission_status
        })
    }

    getFunealBenefit() {
        let id = this.state.user_id;

        fetch(main_url + "funeral_benefit/getFuneralBenefit/" + id)
            .then(response => {
                if (response.ok) return response.json()
            })
            .then(res => {
                if (res) {
                    this.setState({ datasource: res,requestData:res.filter(v=>v.createdBy != this.state.user_id) })
                }
            })
            .catch(error => console.error(`Fetch Error =\n`, error));
    }


    setupForm = () => {
        this.setState({
            isAddNew: true,
            isTable: false
        });
    };

    goToTable = () => {
        this.setState({
            isAddNew: false,
            isTable: true
        })
        window.location.reload();
    }

    goToViewForm = (data) => {
        this.setState({
            isAddNew: false,
            isTable: false,
            isView: true,
            datasource: data
        })
    }
    goToEditForm = (data) => {
        this.setState({
            datasource: data,
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

                <BenefitPageHeader pageTitle="Funeral" setupForm={this.setupForm} isAddNew={this.state.isAddNew} isView={this.state.isView} isEdit={this.state.isEdit} permission={this.state.permission_status} />

                <br />
               

                {
                    this.state.isTable ?
                        <BenefitFuneralTable data={this.state.requestData} requestlist={this.requestlist} goToViewForm={this.goToViewForm} goToEditForm={this.goToEditForm} permission={this.state.permission_status} /> : ''

                }
                {
                    this.state.isAddNew ?
                        <BenefitFuneralAddNew goToTable={this.goToTable} data={this.state.datasource} showToast={this.showToast} /> : ''
                }{
                    this.state.isView ?
                        <BenefitFuneralView data={this.state.datasource} /> : ''
                }
                {
                    this.state.isEdit ?
                        <BenefitFuneralEdit data={this.state.datasource} editFuneralBenefit={this.editFuneralBenefit} showToast={this.showToast} /> : ''
                }

            </div>
        )
    }
}

export default FuneralBenefitMain;