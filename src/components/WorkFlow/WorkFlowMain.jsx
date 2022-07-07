import React, { Component } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import WorkFlowAddNewMain from './WorkFlowAddNewMain';
import WorkFlowTable from './WorkFlowTable';
import WorkFlowTableForMore from './WorkFlowTableForMore';
import WorkFlowView from './WorkFlowView';
import WorkFlowViewForMore from './WorkFlowViewForMore'
import WorkFlowEdit from './WorkFlowEdit';
import WorkFlowEditForMore from './WorkFlowEditForMore';
import { main_url, getMainRole, getUserId } from "../../utils/CommonFunction";
import PageHeader from '../layouts/PageHeader';
class WorkFlowMain extends Component {
    constructor() {
        super();
        this.state = {
            isAddNew: false,
            isTable: true,
            isView: false,
            isEdit: false,
            data: [],
            work_flow_type: 1,
            user_id: getUserId("user_info"),
            is_main_role: getMainRole()
        }
    }
    componentDidMount() {
        this._getWorkFlow();
    }

    _getWorkFlow() {
        fetch(main_url + "workflow/getWorkFlow")
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

    goToViewForm = (data) => {
        this.setState({
            data: data,
            isAddNew: false,
            isView: true,
            isTable: false
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

    goToEditForm = (data) => {
        this.setState({
            data: data,
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
        else toast.error(text);

    }

    changeWorkFlow = event => {
        this.setState({
            work_flow_type: event.value
        })
    }

    render() {
        return (
            <div>
                <ToastContainer position={toast.POSITION.TOP_RIGHT} />
                <PageHeader pageTitle="Work FLow" title="Work Flow"
                    setupForm={this.setupForm} isAddNew={this.state.isAddNew} isEdit={this.state.isEdit}
                    isView={this.state.isView} />
                {
                    this.state.isAddNew ?
                        <WorkFlowAddNewMain showToast={this.showToast} /> : ''
                }

                {
                    this.state.isTable ?
                        this.state.work_flow_type === 1 ?
                            <WorkFlowTable data={this.state.data} setupForm={this.setupForm} goToViewForm={this.goToViewForm} goToEditForm={this.goToEditForm} type={this.state.work_flow_type} changeWorkFlow={this.changeWorkFlow} />
                            : <WorkFlowTableForMore data={this.state.data} setupForm={this.setupForm} goToViewForm={this.goToViewForm} goToEditForm={this.goToEditForm} type={this.state.work_flow_type} changeWorkFlow={this.changeWorkFlow} />
                        : ''
                }
                {
                    this.state.isView ?
                        this.state.work_flow_type === 1 ?
                            <WorkFlowView data={this.state.data} goBack={this.goBack} type={this.state.work_flow_type} changeWorkFlow={this.changeWorkFlow} /> :
                            <WorkFlowViewForMore data={this.state.data} goBack={this.goBack} type={this.state.work_flow_type} changeWorkFlow={this.changeWorkFlow} />
                        : ''
                }
                {
                    this.state.isEdit ?
                        this.state.work_flow_type === 1 ?
                            <WorkFlowEdit data={this.state.data} goBack={this.goBack} showToast={this.showToast} type={this.state.work_flow_type} changeWorkFlow={this.changeWorkFlow} /> :
                            <WorkFlowEditForMore data={this.state.data} goBack={this.goBack} showToast={this.showToast} type={this.state.work_flow_type} changeWorkFlow={this.changeWorkFlow} />
                        : ''

                }
            </div>
        )
    }
}

export default WorkFlowMain;