import React, { Component } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import TrainingAddNewParent from './TrainingAddNewParent';
import TrainingTableParent from './TrainingRequestTable';
import TrainingAdvancedView from './TrainingAdvancedView';
import TrainingAdvancedEdit from './TrainingAdvancedEdit';
import TrainingAdvancedClaimAddNew from './TrainingAdvancedClaimAddNew';
import TrainingClaimRequestView from './TrainingClaimRequestView';
import TrainingClaimRequestEdit from './TrainingClaimRequestEdit';
import TrainingAdvanceClaimView from './TrainingAdvanceClaimView';
import TrainingAdvanceClaimEdit from './TrainingAdvanceClaimEdit';
import PageHeader from '../../layouts/PageHeader';
import 'react-toastify/dist/ReactToastify.min.css'
import { main_url, getCookieData, getWorkFlowStatus, getPermissionStatus, startSaving } from '../../../utils/CommonFunction';

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
            permission_status: {}
        }
    }

    async componentDidMount() {
    //    var permission_status = await getPermissionStatus(this.state.user_info.designations_id, 'Training Allowance', 'Allowance');

        var permission_status = await getPermissionStatus(this.state.user_info.role_id, 'Training Allowance', 'Allowance');
        this._getTrainingRequest();
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
            isEdit: false
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
        var work_flow = await getWorkFlowStatus(data.training[0].user_id, this.state.user_info.user_id, 'Training Allowance', 'Allowance');
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
        var work_flow = await getWorkFlowStatus(data.advance[0].user_id, this.state.user_info.user_id, 'Training Allowance', 'Allowance');
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
        var work_flow = await getWorkFlowStatus(data.training[0].user_id, this.state.user_info.user_id, 'Training Allowance', 'Allowance');
        this.setState({
            data: data,
            isAddNew: false,
            isTable: false,
            isView: false,
            isEdit: true,
            work_flow_status: work_flow
        })
    }

    _getTrainingRequest() {
        fetch(main_url + "allowance/getTrainingAllowance")
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

    editAdvancedTraining = (userId, info, detail, expense, grandTotal, avgCostPerPerson) => {
        var data = []
        data = {
            updatedBy: userId,
            data: info,
            detail: detail,
            expense: expense,
            grandTotal: grandTotal,
            avgCostPerPerson: avgCostPerPerson
        }
        let status = 0;
        fetch(main_url + 'allowance/editAdvancedTraining/' + info.training_allowance_id, {
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

    addAdvancedTraining = (detailData, advancedData, expenseData, grandTotal, costPerPerson) => {
        var data = []
        data = {
            advanced: advancedData,
            detail: detailData,
            expense: expenseData,
            grandTotal: grandTotal,
            costPerPerson: costPerPerson
        }
        let status = 0;
        fetch(main_url + 'allowance/addAdvancedTrainingAllowance', {
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

    checkAvailableRoom(trainingVenueId, trainingRoomNoId, startDate, endDate) {
        var data = []
        data = {
            trainingVenueId: trainingVenueId,
            trainingRoomNoId: trainingRoomNoId,
            startDate: startDate,
            endDate: endDate
        }
        fetch(main_url + 'allowance/isAvailableRoom', {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `info=${JSON.stringify(data)}`

        })
            .then(data => data.text())
            .then(data => {
                if (data === 'success') {
                    toast.success(' Available', {
                        position: 'top-right',
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true
                    });

                }
                else {
                    toast.error(' Not Available Room', {
                        position: 'top-right',
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true
                    });
                }

            })
    }

    addClaimRequest = (detailData, claimData, expenseData, fileArray, grandTotal, avgCostPerPerson) => {

        const formdata = new FormData();

        var obj = document.querySelector("#CRDropzone").files.length;
        for (var i = 0; i < obj; i++) {
            var imagedata = document.querySelector("#CRDropzone").files[i];

            formdata.append('uploadfile', imagedata);
        }

        formdata.append('claim', JSON.stringify(claimData))
        formdata.append('claimDetail', JSON.stringify(detailData))
        formdata.append('expense', JSON.stringify(expenseData))
        formdata.append('grandTotal', JSON.stringify(grandTotal))
        formdata.append('avgCostPerPerson', JSON.stringify(avgCostPerPerson))
        let status = 0;
        fetch(main_url + 'allowance/addClaimRequestTraining', {
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

    editClaimRequest = (userId, info, detail, expense, doc, grandTotal, avgCostPerPerson) => {
        const formdata = new FormData();

        var obj = document.querySelector("#dropCREditZone").files.length;
        for (var i = 0; i < obj; i++) {
            var imagedata = document.querySelector("#dropCREditZone").files[i];

            formdata.append('uploadfile', imagedata);
        }

        formdata.append('claim', JSON.stringify(info))
        formdata.append('user', JSON.stringify(userId))
        formdata.append('claimDetail', JSON.stringify(detail))
        formdata.append('expense', JSON.stringify(expense))
        formdata.append('document', JSON.stringify(doc))
        formdata.append('grandTotal', JSON.stringify(grandTotal))
        formdata.append('avgCostPerPerson', JSON.stringify(avgCostPerPerson))
        let status = 0;
        fetch(main_url + 'allowance/editTrainingClaimRequest/' + info.training_allowance_id, {
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

    addTrainingAdvancedClaim = (data, detail, expenseData, grandTotal, avgCostPerPerson) => {

        const formdata = new FormData();

        var obj = document.querySelector("#advClaimDropZone").files.length;
        for (var i = 0; i < obj; i++) {
            var imagedata = document.querySelector("#advClaimDropZone").files[i];

            formdata.append('uploadfile', imagedata);
        }

        formdata.append('data', JSON.stringify(data))
        formdata.append('detail', JSON.stringify(detail))
        formdata.append('expense', JSON.stringify(expenseData))
        formdata.append('grandTotal', JSON.stringify(grandTotal))
        formdata.append('avgCostPerPerson', JSON.stringify(avgCostPerPerson))
        let status = 0;
        fetch(main_url + 'allowance/addTrainingAdvancedClaim', {
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

    editAdvanceClaimRequest = (info, detail, expense, doc, grandTotal, avgCostPerPerson) => {
        const formdata = new FormData();

        var obj = document.querySelector("#ACFile").files.length;
        for (var i = 0; i < obj; i++) {
            var imagedata = document.querySelector("#ACFile").files[i];

            formdata.append('uploadfile', imagedata);
        }

        formdata.append('claim', JSON.stringify(info))
        formdata.append('claimDetail', JSON.stringify(detail))
        formdata.append('expense', JSON.stringify(expense))
        formdata.append('document', JSON.stringify(doc))
        formdata.append('grandTotal', JSON.stringify(grandTotal))
        formdata.append('avgCostPerPerson', JSON.stringify(avgCostPerPerson))
        let status = 0;
        fetch(main_url + 'allowance/editAdvanceClaimRequest/' + info.training_allowance_id, {
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
            toast.success(text);
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

                <PageHeader pageTitle="Training Request"
                    title="Allowance"
                    setupForm={this.setupForm} isAddNew={this.state.isAddNew || this.state.isClaimAddNew}
                    isView={this.state.isView || this.state.isCRView || this.state.isACRView} 
                    isEdit={this.state.isEdit || this.state.isCREdit || this.state.isACREdit} 
                    permission={this.state.permission_status} />                
                    <div>
                    {
                        this.state.isAddNew ? <TrainingAddNewParent goBack={this.goBack} addAdvancedTraining={this.addAdvancedTraining}
                            addClaimRequest={this.addClaimRequest} checkAvailableRoom={this.checkAvailableRoom}
                            showToast={this.showToast} /> : ''
                    }
                    {
                        this.state.isTable ? <TrainingTableParent
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
                        this.state.isClaimAddNew ?
                            <TrainingAdvancedClaimAddNew data={this.state.data} goBack={this.goBack}
                                addTrainingAdvancedClaim={this.addTrainingAdvancedClaim}
                                checkAvailableRoom={this.checkAvailableRoom} showToast={this.showToast} /> : ''
                    }
                    {
                        this.state.isView ? <TrainingAdvancedView data={this.state.data} 
                        goBack={this.goBack} /> : ''
                    }
                    {
                        this.state.isEdit ? <TrainingAdvancedEdit data={this.state.data} editAdvancedTraining={this.editAdvancedTraining}
                            checkAvailableRoom={this.checkAvailableRoom} goBack={this.goBack} showToast={this.showToast} work_flow_status={this.state.work_flow_status} /> : ''
                    }

                    {
                        this.state.isCRView ? <TrainingClaimRequestView data={this.state.data} goBack={this.goBack} /> : ''
                    }

                    {
                        this.state.isCREdit ? <TrainingClaimRequestEdit data={this.state.data} editClaimRequest={this.editClaimRequest}
                            checkAvailableRoom={this.checkAvailableRoom} goBack={this.goBack} showToast={this.showToast} work_flow_status={this.state.work_flow_status} /> : ''
                    }

                    {
                        this.state.isACRView ? <TrainingAdvanceClaimView data={this.state.data} goBack={this.goBack} /> : ''
                    }
                    {
                        this.state.isACREdit ? <TrainingAdvanceClaimEdit data={this.state.data} editAdvanceClaimRequest={this.editAdvanceClaimRequest} goBack={this.goBack} showToast={this.showToast} work_flow_status={this.state.work_flow_status} /> : ''
                    }



                </div>
            </div>
        )
    }
}