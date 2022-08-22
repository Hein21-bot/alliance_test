import React, { Component } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import TravelAddNewParent from './TravelAddNewParent';
import TravelRequestTable from './TravelRequestTable';
import TravelAdvancedView from './TravelAdvancedView';
import TravelAdvancedEdit from './TravelAdvancedEdit';
import TravelAdvancedClaimAddNew from './TravelAdvancedClaimAddNew';
import TravelClaimRequestView from './TravelClaimRequestView';
import TravelClaimRequestEdit from './TravelClaimRequestEdit';
import TravelAdvanceClaimView from './TravelAdvanceClaimView';
import TravelAdvanceClaimEdit from './TravelAdvanceClaimEdit';
import PageHeader from '../../layouts/PageHeader';
import 'react-toastify/dist/ReactToastify.min.css'
import moment from "moment";
import {
    main_url, getCookieData, getWorkFlowStatus, getPermissionStatus, alertText,
    startSaving, stopSaving
} from '../../../utils/CommonFunction';

export default class TravelRequestParent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user_info: getCookieData("user_info"),
            isAddNew: false,
            isTable: true,
            isView: false,
            isEdit: false,
            isCRView: false,
            isCREdit: false,
            isACRView: false,
            isACREdit: false,
            isClaimAddNew: false,
            data: [],
            work_flow_status: {},
            permission_status: {}
        }
    }

    async componentDidMount() {
        var permission_status = await getPermissionStatus(this.state.user_info.designations_id, 'Travel Allowance', 'Allowance');
        // this._getTravelRequest();
        this.setState({
            permission_status: permission_status
        })
    }

    setupForm = () => {
        this.setState({
            isAddNew: true,
            isTable: false,
            isView: false,
            isEdit: false
        })
    }

    goToAdvancedView = (data) => {
        this.setState({
            data: data,
            isAddNew: false,
            isTable: false,
            isView: true,
            isEdit: false,

        })
    }

    goToClaimRequestView = (data) => {
        this.setState({
            data: data,
            isAddNew: false,
            isTable: false,
            isView: false,
            isEdit: false,
            isCRView: true,
            isCREdit: false

        })
    }

    goToClaimRequestEdit = async (data) => {
        var work_flow = await getWorkFlowStatus(data.claimData[0].user_id, this.state.user_info.user_id, 'Travel Allowance', 'Allowance');
        this.setState({
            data: data,
            isAddNew: false,
            isTable: false,
            isView: false,
            isEdit: false,
            isCRView: false,
            isCREdit: true,
            work_flow_status: work_flow
        })
    }

    goToAdvanceClaimRequestView = (data) => {
        this.setState({
            data: data,
            isAddNew: false,
            isTable: false,
            isView: false,
            isEdit: false,
            isCRView: false,
            isCREdit: false,
            isACREdit: false,
            isACRView: true

        })
    }

    goToAdvanceClaimRequestEdit = async (data) => {
        var work_flow = await getWorkFlowStatus(data.advancedData[0].user_id, this.state.user_info.user_id, 'Travel Allowance', 'Allowance');
        this.setState({
            data: data,
            isAddNew: false,
            isTable: false,
            isView: false,
            isEdit: false,
            isCRView: false,
            isCREdit: false,
            isACREdit: true,
            isACRView: false,
            work_flow_status: work_flow
        })
    }

    goToClaimAddNewForm = (data) => {
        this.setState({
            data: data,
            isClaimAddNew: true,
            isAddNew: false,
            isTable: false,
            isView: false,
            isEdit: false
        })
    }

    goToAdvancedEdit = async (data) => {
        var work_flow = await getWorkFlowStatus(data.user_id, this.state.user_info.user_id, 'Travel Allowance', 'Allowance');

        this.setState({
            data: data,
            isAddNew: false,
            isTable: false,
            isView: false,
            isEdit: true,
            work_flow_status: work_flow
        })
    }

    _getTravelRequest() {
        fetch(main_url + "allowance/getTravelRequestAllowance/user_id=" + this.state.user_info.user_id)
            .then(response => {
                if (response.ok) return response.json()
            })
            .then(res => {
                if (res) {

                    this.setState({ data: res })
                }
            })
            .catch(error => console.error(`Fetch Error =\n`, error));
    }

    add = (data) => {

        var startDate = moment(data.startDate).format('YYYY-MM-DD');
        var endDate = moment(data.endDate).format('YYYY-MM-DD');
        var info = {
            user_id: data.user_id,
            purpose: data.purpose,
            isClaim: 0,
            advancedClaim: 0,
            startLoc: data.startLoc,
            destination: data.destination,
            startDate: startDate,
            endDate: endDate,
            noOfDays: data.noOfDays,
            noOfNights: data.noOfNights,
            meals: data.meals,
            lodging: data.lodging,
            transport: data.transport,
            amount: data.amount,
            createdBy: data.user_id,
            withdraw_location: data.withdraw_location
        }
        let status = 0
        // stopSaving();
        fetch(main_url + 'allowance/addAdvancedTravelRequestAllowance', {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `info=${JSON.stringify(info)}`

        })
            .then(res => {
                status = res.status;
                return res.text()
            })
            .then(text => {
                this.showToast(status, text);
            })
    }

    edit = (data) => {

        var startDate = moment(data.startDate).format('YYYY-MM-DD');
        var endDate = moment(data.endDate).format('YYYY-MM-DD');
        var info = {
            purpose: data.purpose,
            isAdvanced: data.selectedRequest,
            startLoc: data.startLoc,
            destination: data.destination,
            startDate: startDate,
            endDate: endDate,
            noOfDays: data.noOfDays,
            noOfNights: data.noOfNights,
            meals: data.meals,
            lodging: data.lodging,
            transport: data.transport,
            amount: data.amount,
            withdraw_location: data.withdraw_location,
            modifiedBy: data.modifiedBy
        }

        let status = 0
        // stopSaving();
        fetch(main_url + 'allowance/editAdvancedTravelRequestAllowance/' + data.id, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `info=${JSON.stringify(info)}`

        })
            .then(res => {
                status = res.status;
                return res.text()
            })
            .then(text => {
                this.showToast(status, text);
            })
    }

    addClaimRequest = (claimDetail, claimData, newDoc) => {

        const formdata = new FormData();
        var info = {
            actual_amount: claimData.actual_amount,
            user_id: claimData.user_id,
            purpose: claimData.purpose,
            isClaim: 1,
            advancedClaim: 1,
            withdraw_location: claimData.withdraw_location
        }
        // var obj = document.querySelector("#travelCRDrop").files;
        for (var i = 0; i < newDoc.length; i++) {
            var imagedata = newDoc[i];

            formdata.append('uploadfile', imagedata);
        }
        if (newDoc.length == 0) {
            this.showToast(400, 'Please Add Attachment')
        } else {
            formdata.append('claimData', JSON.stringify(info))
            formdata.append('array', JSON.stringify(claimDetail))

            let status = 0;
            // stopSaving();
            // if (obj.length > 0) {
            fetch(main_url + 'allowance/addClaimTravelRequestAllowance', {
                method: "POST",

                body: formdata

            })
                .then(res => {
                    status = res.status;
                    return res.text()
                })
                .then(text => {
                    this.showToast(status, text);
                }).catch(error => startSaving())
        }

        // } else {
        //     toast.error(alertText, {
        //         position: 'top-right',
        //         autoClose: 5000,
        //         hideProgressBar: false,
        //         closeOnClick: true,
        //         pauseOnHover: true,
        //         draggable: true
        //     });
        // }

    }

    editClaimRequest = (claimDetail, claimData) => {

        var data = []
        data = {
            claimData: claimData,
            claimDetail: claimDetail
        }
        let status = 0
        // stopSaving();
        fetch(main_url + 'allowance/editClaimTravelRequestAllowance/' + claimData[0].travel_allowance_id, {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `info=${JSON.stringify(data)}`

        })
            .then(res => {
                status = res.status;
                return res.text()
            })
            .then(text => {
                this.showToast(status, text);
            })
    }

    addTravelAdvancedClaim = (claimDetail, claimData, advancedAmount) => {
        const formdata = new FormData();
        var form_no = 'AC' + Date.now();
        var info = {
            actual_amount: claimData.actual_amount,
            user_id: claimData.user_id,
            form_no: form_no,
            advanced_form_no: claimData.advancedNo,
            advanced_travel_id: claimData.advancedId,
            purpose: claimData.purpose,
            settle_amount: claimData.settle_amount,
            advanced_amount: advancedAmount,
            isClaim: 2,
            advancedClaim: 1,
            withdraw_location: claimData.withdraw_location

        }
        var obj = document.querySelector("#travelDropzone").files.length;
        for (var i = 0; i < obj; i++) {
            var imagedata = document.querySelector("#travelDropzone").files[i];

            formdata.append('uploadfile', imagedata);
        }

        formdata.append('info', JSON.stringify(info))
        formdata.append('array', JSON.stringify(claimDetail))
        let status = 0
        // stopSaving();
        fetch(main_url + 'allowance/addAdvancedClaimTravelRequestAllowance', {
            method: "POST",

            body: formdata

        })
            .then(res => {
                status = res.status;
                return res.text()
            })
            .then(text => {
                this.showToast(status, text);
            })

    }

    editAdvanceClaimRequest = (claimDetail, claimData) => {

        var data = []
        data = {
            claimData: claimData,
            claimDetail: claimDetail
        }
        let status = 0
        // stopSaving();
        fetch(main_url + 'allowance/editAdvancedClaimTravelRequestAllowance/' + claimData[0].travel_allowance_id, {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `info=${JSON.stringify(data)}`

        })
            .then(res => {
                status = res.status;
                return res.text()
            })
            .then(text => {
                this.showToast(status, text);
            })
    }

    goBack = () => {
        this.setState({
            isAddNew: false,
            isTable: true,
            isView: false,
            isEdit: false
        })
        window.location.reload();
    }

    showToast = (status, text) => {
        if (status === 200) {
            toast.success("Your Information is successfully save!");
            window.location.reload();
        }
        else {
            startSaving();
            toast.error(text);
        }

    }

    render() {
        return (
            <div className="white-bg">
                <ToastContainer position={toast.POSITION.TOP_RIGHT} />
                <PageHeader pageTitle="Travel Request"
                    title="Allowance"
                    setupForm={this.setupForm} isAddNew={this.state.isAddNew || this.state.isClaimAddNew}
                    isView={this.state.isView || this.state.isACRView || this.state.isCRView} isEdit={this.state.isEdit || this.state.isACREdit || this.state.isCREdit} permission={this.state.permission_status} />
                <div>

                    {
                        this.state.isAddNew ? <TravelAddNewParent goBack={this.goBack} add={this.add} addClaimRequest={this.addClaimRequest} /> : ''
                    }
                    {
                        this.state.isTable ? <TravelRequestTable
                            data={this.state.data}
                            setupForm={this.setupForm} goToAdvancedView={this.goToAdvancedView}
                            goToAdvancedEdit={this.goToAdvancedEdit}
                            goToClaimAddNewForm={this.goToClaimAddNewForm}
                            goToClaimRequestView={this.goToClaimRequestView}
                            goToClaimRequestEdit={this.goToClaimRequestEdit}
                            goToAdvanceClaimRequestView={this.goToAdvanceClaimRequestView}
                            goToAdvanceClaimRequestEdit={this.goToAdvanceClaimRequestEdit}
                            permission={this.state.permission_status}
                        /> : ''
                    }
                    {
                        this.state.isView ? <TravelAdvancedView data={this.state.data} goBack={this.goBack} /> : ''
                    }
                    {
                        this.state.isEdit ? <TravelAdvancedEdit data={this.state.data} edit={this.edit} goBack={this.goBack} showToast={this.showToast} work_flow_status={this.state.work_flow_status} /> : ''
                    }
                    {
                        this.state.isClaimAddNew ? <TravelAdvancedClaimAddNew data={this.state.data} goBack={this.goBack} addTravelAdvancedClaim={this.addTravelAdvancedClaim} showToast={this.showToast} /> : ''
                    }
                    {
                        this.state.isACRView ? <TravelAdvanceClaimView data={this.state.data} goBack={this.goBack} /> : ''
                    }

                    {
                        this.state.isACREdit ? <TravelAdvanceClaimEdit data={this.state.data} editAdvanceClaimRequest={this.editAdvanceClaimRequest} goBack={this.goBack} showToast={this.showToast} work_flow_status={this.state.work_flow_status} /> : ''
                    }
                    {
                        this.state.isCRView ? <TravelClaimRequestView data={this.state.data} goBack={this.goBack} /> : ''
                    }
                    {
                        this.state.isCREdit ? <TravelClaimRequestEdit data={this.state.data} editClaimRequest={this.editClaimRequest} goBack={this.goBack} showToast={this.showToast} work_flow_status={this.state.work_flow_status} /> : ''
                    }
                    {/* {
                        this.state.isClaimAddNew ? <TravelAdvancedClaimAddNew data={this.state.data} goBack={this.goBack} addTrainingAdvancedClaim={this.addTrainingAdvancedClaim} checkAvailableRoom={this.checkAvailableRoom} /> : ''
                    }
                  
                    {
                        this.state.isACREdit ? <TravelAdvanceClaimEdit data={this.state.data} editAdvanceClaimRequest={this.editAdvanceClaimRequest} goBack={this.goBack} /> : ''
                    } */}



                </div>
            </div>
        )
    }
}