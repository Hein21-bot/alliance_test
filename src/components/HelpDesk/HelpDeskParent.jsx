import React, { Component } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css'
import PageHeader from '../layouts/PageHeader';
import HelpDeskAddNew from './HelpDeskAddNew';
import HelpDeskView from './HelpDeskView';
import HelpDeskEdit from './HelpDeskEdit';
import HelpDeskTable from './HelpDeskTable';
import { main_url, startSaving, getUserId } from "../../utils/CommonFunction";
export default class HelpDeskParent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user_id: getUserId("user_info"),
            isAddnew: false,
            isTable: true,
            isView: false,
            isEdit: false,
            data: [],
        }
    }

    async componentDidMount() {
        let action = this.props.edit; // get from notification 
        let data = this.props.data; // help desk info from notification
        if (action !== undefined && action) {
            this.setState({
                isEdit: action,
                isTable: false,
                data: data
            })
        }

    }

    getAllHelpDeskData() {
        fetch(main_url + "helpDesk/getHelpDeskData/" + this.state.user_id)
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


    addHelpDesk = (data) => {
        const formdata = new FormData();

        var obj = document.querySelector("#HDDropZone").files.length;
        for (var i = 0; i < obj; i++) {
            var imagedata = document.querySelector("#HDDropZone").files[i];

            formdata.append('uploadfile', imagedata);
        }

        formdata.append('info', JSON.stringify(data))
        let status = 0;
        fetch(main_url + 'helpDesk/addHelpDesk', {
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

    editHelpDesk = (userId, data, doc, newDoc) => {
        const formdata = new FormData();
        data.updatedBy = userId;
        var obj = document.querySelector("#HDEdit").files.length;
        for (var i = 0; i < newDoc.length; i++) {
            var imagedata = newDoc[i];

            formdata.append('uploadfile', imagedata);
        }
        formdata.append('updatedBy', JSON.stringify(userId));
        formdata.append('info', JSON.stringify(data));
        formdata.append('document', JSON.stringify(doc));
        let status = 0;
        fetch(main_url + 'helpDesk/editHelpDesk/' + data.helpDesk_ticket_id, {
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

    helpDeskAddForm = () => {
        this.setState({
            isAddnew: true,
            isTable: false,
            isView: false,
            isEdit: false
        })
    }

    goToHelpDeskView = (data) => {

        this.setState({
            data: data,
            isAddnew: false,
            isTable: false,
            isView: true,
            isEdit: false
        })
    }
    goToHelpDeskEdit = (data) => {
        this.setState({
            data: data,
            isAddnew: false,
            isTable: false,
            isView: false,
            isEdit: true
        })
    }

    goBack = () => {
        this.setState({
            isAddnew: false,
            isTable: true,
            isView: false,
            isEdit: false
        })
        window.location.reload();
    }

    setupForm = () => {
        this.setState({
            isAddnew: true,
            isTable: false,
            isView: false
        });
    };

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
            <div className="wedding-benefit border-bottom white-bg dashboard-header">
                <ToastContainer position={toast.POSITION.TOP_RIGHT} />
                <PageHeader pageTitle="Help Desk"
                    title="Help Desk"
                    setupForm={this.setupForm} isAddNew={this.state.isAddnew}
                    isView={this.state.isView} isEdit={this.state.isEdit} />
                <div>
                    {
                        this.state.isAddnew ? <HelpDeskAddNew addHelpDesk={this.addHelpDesk} 
                        goBack={this.goBack} showToast={this.showToast} /> : ''
                    }
                    {
                        this.state.isTable ? <HelpDeskTable
                            helpDeskAddForm={this.helpDeskAddForm}
                            goToHelpDeskView={this.goToHelpDeskView}
                            goToHelpDeskEdit={this.goToHelpDeskEdit}
                            data={this.state.data}
                        /> : ''
                    }
                    {
                        this.state.isView ? <HelpDeskView goBack={this.goBack} data={this.state.data} /> : ''
                    }

                    {
                        this.state.isEdit ? <HelpDeskEdit goBack={this.goBack} data={this.state.data} editHelpDesk={this.editHelpDesk} showToast={this.showToast} /> : ''
                    }


                </div>
            </div>
        )
    }
}