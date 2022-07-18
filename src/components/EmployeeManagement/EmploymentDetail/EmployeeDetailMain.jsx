import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import Select from "react-select";
import EmploymentDetailTable from "./EmploymentDetailTable"
import EmploymentDetailsForSingleUserTable from './EmploymentDetailForSingleUser';

import { main_url, getUserId, getMainRole, getWorkFlowStatus, getCookieData, getPermissionStatus, startSaving } from "../../../utils/CommonFunction";
import EmploymentForm from './EmploymentForm';
import moment from 'moment';

class EmployeeDetailMain extends Component {
    constructor() {
        super();
        this.state = {
            isAddNew: false,
            user_info: getCookieData("user_info"),
            user_id: getUserId("user_info"),
            is_main_role: getMainRole(),
            isTable: true,
            isView: false,
            tableView: false,
            isEdit: false,
            datasource: [],
            permission_status: {},
            selected_region: null,
            selected_branch: null,
            selected_department: null,
            selected_designation: null,
            branchlist: null,
            employeeIdList: null,
            region: null,
            departmentlist: null,
            designationList: null,
            exitStatusList: null,
            selected_exit_status: null,
            searchValue: '',
            employeeData: null,
            addNew: false,
            employeeName: '',
            statusList: [{ value: 1, label: 'Permanent' }, { value: 2, label: 'Part-Time' }, { value: 3, label: 'Training' }],
            selected_status: null,
            employedDate: '',
            effectiveDate: '',
            actualDate: '',
            salary: '',
            disconDate: '',
            resignReason: '',
            selectedEmploymentData: null,
            selectedEmployeeId: '',
            edit: false,
            level_options: null,
            sub_level_options: null,
            career_level: null,
            career_sub_level: null,
            jobList: null,
            selected_job: null,
            selected_disCon_status: null,
            disConStatusList: [{ value: 1, label: 'True' }, { value: 2, label: 'False' }],
            employmentDataForSingleUser: null,
            salaryList: []
        }
    }

    async componentDidMount() {

        this.getEmployeeList()
        this.getDesignationList()
        this.getBranchList()
        this.getDepartmentList()
        this.getExitStatus()
        this.getEmployeeCodeList()
        this.getJobList()
        this.getSalaryTemplate()
        const level = await this.getLevelOptions();
        const sub_level = await this.getCareerSubLevelOptions();
        const level_options = level && level.map(v => (
            {
                ...v,
                label: v.career_level,
                value: v.career_level
            }
        ))
        const sub_level_options = sub_level && sub_level.map(v => (
            {
                ...v,
                label: v.career_sub_level,
                value: v.career_sub_level
            }
        ))
        this.setState({
            level_options,
            sub_level_options
        })

        if (this.props.data) {
            this.goToViewForm(this.props.data)
        }

    }

    getSalaryTemplate() {
        fetch(`${main_url}salaryTemplate/getSalaryTemplate`)
            .then(res => { if (res.ok) return res.json() })
            .then(list => {
                this.setState({
                    salaryList: list
                })
            })
    }

    getExitStatus() {
        fetch(`${main_url}employee/getExitStatus`)
            .then(res => { if (res.ok) return res.json() })
            .then(list => { 
                this.setState({
                    exitStatusList: list.map(v => ({ ...v, label: v.status, value: v.id }))
                })
            })
    }

    getEmployeeCodeList() {
        fetch(`${main_url}employee/getEmployeeCode`)
            .then(res => { if (res.ok) return res.json() })
            .then(list => {
                this.setState({
                    employeeIdList: list.map(v => ({ ...v, label: v.employee_code, value: v.user_id }))
                })
            })
    }

    getJobList() {
        fetch(`${main_url}employee/getJobTitle`)
            .then(res => { if (res.ok) return res.json() })
            .then(list => { 
                this.setState({
                    jobList: list.map(v => ({ ...v, label: v.job_title, value: v.id }))
                })
            })
    }

    getLevelOptions = async () => {
        var res = await fetch(`${main_url}allowLevel/getLevel`);
        if (res.ok) return res.json();
        else return [];
    }

    getCareerSubLevelOptions = async () => {
        var res = await fetch(`${main_url}allowLevel/getCareerSubLevel`);
        if (res.ok) return res.json();
        else return [];
    }


    getEmployeeList() {

        fetch(`${main_url}employee/getEmployeeDetail`)

            .then(response => {
                if (response.ok) return response.json()
            })
            .then(res => {

                if (res) {
                    this.setState({ employeeData: res })
                }
            })
            .catch(error => console.error(`Fetch Error =\n`, error));
    }

    getDesignationList() {
        fetch(`${main_url}main/getDesignations`)
            .then(res => { if (res.ok) return res.json() })
            .then(list => { 
                this.setState({
                    designationList: list//list.map(v => ({ ...v, label: v.region_name, value: v.region_id }))
                })
            })
    }

    getBranchList() {
        fetch(`${main_url}benefit/getBranchList`)
            .then(res => { if (res.ok) return res.json() })
            .then(list => {
                // let lists = list.unshift({ branch_id: 0, branch_name: 'All' })
                this.setState({
                    branchlist: list.map(v => ({ ...v, label: v.branch_name, value: v.branch_id }))
                })
            })
    }

    getDepartmentList() {
        fetch(`${main_url}benefit/getDepartmentList`)
            .then(res => { if (res.ok) return res.json() })
            .then(list => {
                // let lists = list.unshift({ departments_id: 0, deptname: 'All' })
                this.setState({
                    departmentlist: list.map(v => ({ ...v, label: v.deptname, value: v.departments_id }))
                })
            })
    }

    getData(id) {
        fetch(`${main_url}employee/getUserDetail/${id}`)
            .then(res => { if (res.ok) return res.json() })
            .then(data => {
                if (data.length > 0) {
                    this.setState({
                        selectedEmploymentData: data[0],
                        edit: false,
                        addNew: true,
                        date: moment(new Date()).format('YYYY-MM-DD'),
                        employeeName: data[0].fullname,
                        selected_designation: this.state.designationList.find(c => c.value == data[0].designations_id),//
                        selected_branch: this.state.branchlist.find(c => parseInt(c.branch_id) === (data[0].branch_name ? parseInt(data[0].branch_name) : data[0].branch_name)),
                        selected_department: this.state.departmentlist.find(c => c.departments_id == data[0].departments_id),
                        selected_status: this.state.statusList.find(v => v.value === parseInt(data[0].employed_status)),
                        selected_exit_status: this.state.exitStatusList.find(v => v.id === parseInt(data[0].exit_status)),
                        employedDate: data[0].employee_date,
                        effectiveDate: data[0].effective_date,
                        actualDate: data[0].actual_date,
                        discontinute_date: data[0].discontinute_date ? moment(data[0].discontinute_date).format('YYYY-MM-DD') : null,
                        selected_disCon_status: this.state.disConStatusList.find(v => v.value === parseInt(data[0].discontinute_status)) ? this.state.disConStatusList.find(v => v.value === parseInt(data[0].discontinute_status)) : [{ value: 2, label: 'False' }],
                        salary: data[0].salary,
                        resignReason: data[0].resign_reason,
                        selected_job: this.state.jobList.find(v => v.id === parseInt(data[0].job_title)),
                        career_level: this.state.level_options.find(v => parseInt(v.career_level_id) === parseInt(data[0].career_level_id)),
                        career_sub_level: this.state.sub_level_options.find(v => v.career_sub_level_id === data[0].career_sub_level_id)
                    })
                } else {
                    this.setState({
                        selectedEmploymentData: null,
                        edit: false,
                        addNew: true,
                        date: moment(new Date()).format('YYYY-MM-DD'),
                        employeeName: null,
                        selected_designation: null,//
                        selected_branch: null,
                        selected_department: null,
                        selected_status: null,
                        selected_exit_status: null,
                        employedDate: null,
                        effectiveDate: null,
                        actualDate: null,
                        discontinute_date: null,
                        selected_disCon_status: null,
                        salary: null,
                        resignReason: null,
                        selected_job: null,
                        career_level: null,
                        career_sub_level: null,
                    })
                }
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

    handleSelectedDeaprtment = (event) => {
        if (event !== null)
            this.setState({
                selected_department: event
            })
    };

    handleSelectedBranch = (event) => {
        if (event !== null)
            this.setState({
                selected_branch: event
            })
    };

    handleSelectedDesignation = (event) => {
        if (event !== null)
            this.setState({
                selected_designation: event
            })
    };

    handleSelectedStatus = (event) => {
        if (event !== null)
            this.setState({
                selected_status: event
            })
    };

    handleSelectedEmployeeId = (event) => {
        if (event !== null)
            this.getData(event.user_id)
        this.setState({
            selectedEmployeeId: event
        })
    };

    handleSelectedExitStatus = (event) => {
        if (event !== null)
            this.setState({
                selected_exit_status: event
            })
    };

    handleSelectedDisConStatus = (event) => {
        if (event !== null)
            this.setState({
                selected_disCon_status: event
            })
    };

    handleSelectedJob = (event) => {
        if (event !== null)
            this.setState({
                selected_job: event
            })
    };

    handleSearch = e => {
        e.preventDefault();
    }

    handleAddFormInputChange = e => {
        if (e.target.name === "employeeName") {
            this.setState({
                employeeName: e.target.value
            })
        }
        else if (e.target.name === "employedDate") {
            this.setState({
                employedDate: e.target.value
            })
        }
        else if (e.target.name === "effectiveDate") {
            this.setState({
                effectiveDate: e.target.value
            })
        }
        else if (e.target.name === "actualDate") {
            this.setState({
                actualDate: e.target.value
            })
        }
        else if (e.target.name === "salary") {
            this.setState({
                salary: e.target.value
            })
        }
        else if (e.target.name === "disconDate") {
            this.setState({
                disconDate: e.target.value
            })
        }
        else if (e.target.name === "resignReason") {
            this.setState({
                resignReason: e.target.value
            })
        }
    }
    submitAddForm = e => {
        e.preventDefault();
        const { selected_status, effectiveDate, actualDate, salary, selected_job, selected_disCon_status, disconDate, resignReason, employedDate, career_sub_level, selected_exit_status, selected_branch, career_level, selected_department, selected_designation, employeeName, selectedEmployeeId, user_id } = this.state
        let data = {
            user_id: user_id,
            employed_status: selected_status ? selected_status.value : null,
            employee_name: employeeName,
            employee_code: selectedEmployeeId ? selectedEmployeeId.label.trim() : null,
            designation: selected_designation ? selected_designation.value : null,
            branch: selected_branch ? parseInt(selected_branch.branch_id) : null,
            department: selected_department ? selected_department.departments_id : null,
            career_level: career_level ? career_level.career_level_id : null,
            career_sub_level: career_sub_level ? career_sub_level.career_sub_level_id : null,
            exit_status: selected_exit_status ? selected_exit_status.value : null,
            employee_date: employedDate ? employedDate : '',
            effective_date: effectiveDate ? effectiveDate : '',
            salary: salary ? salary : '',
            job_title: selected_job ? selected_job.value : null,
            discontinute_status: selected_disCon_status ? selected_disCon_status.value : null,
            discontinute_date: disconDate ? disconDate : '',
            resign_reason: resignReason ? resignReason : '',
            date: actualDate ? actualDate : '',
        }
        let status = 0;
        fetch(`${main_url}employee/addEmploymentDetail`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `employee=${JSON.stringify(data)}`
        })
            .then(res => {
                status = res.status;
                return res.text()
            })
            .then(text => {
                if (status === 200) {
                    toast.success(text);
                    window.location.reload();
                }
                else toast.error(text);
                window.location.replace("/employment_details");

            })
        this.setState({
            addNew: false
        })
    }
    goToEditForm = data => {
        this.setState({
            selectedEmploymentData: data,
            edit: true,
            addNew: false,
            user_id: data.user_id,
            selectedEmployeeId: this.state.employeeIdList.find(v => v.user_id == data.user_id),
            employeeName: data.employee_name,
            selected_designation: this.state.designationList.find(c => c.label == data.designations),//
            selected_branch: this.state.branchlist.find(c => parseInt(c.branch_id) == (data.branch ? parseInt(data.branch) : data.branch)),
            selected_department: this.state.departmentlist,
            selected_status: this.state.statusList.find(v => v.value == parseInt(data.employed_status)),
            selected_exit_status: this.state.exitStatusList.find(v => v.id == parseInt(data.exit_status)),
            employedDate: data.employee_date,
            effectiveDate: data.effective_date,
            actualDate: data.actual_date,
            disconDate: data.discontinute_date,
            selected_disCon_status: this.state.disConStatusList.find(v => v.value == parseInt(data.discontinute_status)) ? this.state.disConStatusList.find(v => v.value == parseInt(data.discontinute_status)) : [{ value: 2, label: 'False' }],
            salary: data.salary,
            resignReason: data.resign_reason,
            selected_job: this.state.jobList.find(v => v.id == parseInt(data.job_title)),
            career_level: this.state.level_options.find(v => v.career_level == data.career_level),
            career_sub_level: this.state.sub_level_options.find(v => v.career_sub_level == data.career_sub_level)
        })
    }


    goToViewForm = data => {
        this.setState({
            tableView: true
        })
        fetch(`${main_url}employee/getEmployUserDetail/${data.user_id}`)

            .then(response => {
                if (response.ok) return response.json()
            })
            .then(res => {

                if (res) {
                    this.setState({ employmentDataForSingleUser: res })
                }
            })
            .catch(error => console.error(`Fetch Error =\n`, error));
    }

    handleUpdatData = (e) => {
        e.preventDefault()
        const { selected_status, effectiveDate, selectedEmploymentData, actualDate, salary, selected_job, selected_disCon_status, disconDate, resignReason, employedDate, career_sub_level, selected_exit_status, selected_branch, career_level, selected_department, selected_designation, employeeName, selectedEmployeeId, user_id } = this.state

        let data = {
            user_id: user_id,
            employed_status: selected_status ? selected_status.value : null,
            employee_name: employeeName,
            employee_code: selectedEmployeeId ? selectedEmployeeId.label.trim() : null,
            designation: selected_designation ? selected_designation.value : null,
            branch: selected_branch ? parseInt(selected_branch.branch_id) : null,
            deparment: selected_department ? selected_department.departments_id : null,
            career_level: career_level ? career_level.career_level_id : null,
            career_sub_level: career_sub_level ? career_sub_level.career_sub_level_id : null,
            exit_status: selected_exit_status ? selected_exit_status.value : null,
            employee_date: employedDate ? moment(employedDate).format('YYYY-MM-DD') : null,
            effective_date: effectiveDate ? moment(effectiveDate).format('YYYY-MM-DD') : null,
            date: actualDate ? moment(actualDate).format('YYYY-MM-DD') : null,
            salary: salary ? salary : '',
            job_title: selected_job ? selected_job.value : null,
            discontinute_status: selected_disCon_status ? selected_disCon_status.value : null,
            discontinute_date: disconDate ? moment(disconDate).format('YYYY-MM-DD') : null,
            resign_reason: resignReason ? resignReason : '',
        }
        let status = 0;
        fetch(`${main_url}employee/updateEmploymentDetail/${selectedEmploymentData.id}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `employee=${JSON.stringify(data)}`
        })
            .then(res => {
                status = res.status;
                return res.text()
            })
            .then(text => {
                if (status === 200) {
                    toast.success(text);
                    window.location.reload();
                }
                else toast.error(text);
                window.location.replace("/employment_details");

            })
    }

    handleFormCancel = () => {
        this.setState({
            addNew: false
        })
        this.getEmployeeList()
        this.clearFormData()
    }

    handleLevelSelectorChange = (val, key) => {
        const { sub_level_options, level_options } = this.state;
        const value = key === 'career_level' ?
            ((level_options.find(v => Number(v.career_level_id) === Number(val.career_level_id)))) :
            ((sub_level_options.find(v => Number(v.career_sub_level_id) === Number(val.career_sub_level_id))));
        const setState = {};
        setState[key] = value;
        this.setState(setState, () => {
            if (key != 'career_level') {
                this.setState({
                    salary: this.state.salaryList.filter(v => v.career_sub_level == value.career_sub_level_id)[0].basic_salary
                })
            }
        })
    }

    clearFormData = () => {
        this.setState({
            selected_region: null,
            selected_branch: null,
            selected_department: null,
            selected_designation: null,
            selected_exit_status: null,
            addNew: false,
            employeeName: '',
            selected_status: null,
            employedDate: '',
            effectiveDate: '',
            actualDate: '',
            salary: '',
            disconDate: '',
            resignReason: '',
            selectedEmploymentData: null,
            selectedEmployeeId: '',
            edit: false,
            career_level: null,
            career_sub_level: null,
            selected_job: null,
            selected_disCon_status: null,
        })
    }

    render() {
        const { addNew, level_options, sub_level_options, employeeName, jobList, selected_job, statusList, exitStatusList, selected_exit_status, selected_status, employeeIdList, employedDate, disconDate, resignReason, selectedEmployeeId, effectiveDate, actualDate, salary,
            designationList, selected_designation, employmentDataForSingleUser, branchlist, selected_branch, disConStatusList, selected_disCon_status, departmentlist, selected_department, edit, career_level, career_sub_level } = this.state
        return (
            <div className=" border-bottom white-bg dashboard-header">
                <ToastContainer position={toast.POSITION.TOP_RIGHT} />
                {/* <form > */}
                <div className="row wrapper white-bg page-heading" style={{ display: 'flex', alignItems: 'center' }}>
                    <div className="col-lg-10">
                        <h2>HR Management System</h2>
                        <ol className="breadcrumb">
                            <li>
                                Employee
                            </li>
                            <li className="active">
                                <a href="#"> Employment Details</a>
                            </li>

                        </ol>
                    </div>
                    {
                        (addNew || edit) ? null :
                            <button onClick={() => this.setState({ addNew: true })} style={{ borderRadius: 5, padding: 10, background: '#337ab7', color: 'white', border: 'none' }}>
                                + Add New Employment
                            </button>
                    }


                </div>
                {
                    this.state.tableView ? <div style={{}}>
                        <button onClick={() => { this.setState({ tableView: false }); this.getEmployeeList() }} style={{ borderRadius: 5, padding: 10, background: '#337ab7', color: 'white', border: 'none' }}>
                            {'< Back'}
                        </button>
                        <EmploymentDetailsForSingleUserTable goToViewForm={null} goToEditForm={null} data={this.state.employmentDataForSingleUser ? this.state.employmentDataForSingleUser : []} permission={{
                            isEdit: 0,
                            isView: 0
                        }} />
                    </div> : <>
                        {
                            (addNew || edit) ?
                                <EmploymentForm
                                    edit={edit} selectedEmployeeId={selectedEmployeeId} level_options={level_options} sub_level_options={sub_level_options}
                                    employeeName={employeeName} statusList={statusList} selected_status={selected_status}
                                    handleAddFormInputChange={this.handleAddFormInputChange}
                                    handleSelectedStatus={this.handleSelectedStatus}
                                    employedDate={employedDate} effectiveDate={effectiveDate}
                                    actualDate={actualDate} salary={salary} disconDate={disconDate}
                                    designationList={designationList} selected_designation={selected_designation}
                                    branchlist={branchlist} selected_branch={selected_branch}
                                    departmentlist={departmentlist} selected_department={selected_department}
                                    handleSelectedBranch={this.handleSelectedBranch}
                                    handleSelectedDeaprtment={this.handleSelectedDeaprtment}
                                    handleSelectedDesignation={this.handleSelectedDesignation}
                                    submitAddForm={this.submitAddForm}
                                    handleFormCancel={this.handleFormCancel}
                                    handleUpdatData={this.handleUpdatData}
                                    handleSelectedEmployeeId={this.handleSelectedEmployeeId}
                                    handleLevelSelectorChange={this.handleLevelSelectorChange}
                                    career_level={career_level} career_sub_level={career_sub_level}
                                    employeeIdList={employeeIdList} exitStatusList={exitStatusList}
                                    selected_exit_status={selected_exit_status}
                                    handleSelectedExitStatus={this.handleSelectedExitStatus}
                                    jobList={jobList} selected_job={selected_job} handleSelectedJob={this.handleSelectedJob}
                                    disConStatusList={disConStatusList} resignReason={resignReason}
                                    selected_disCon_status={selected_disCon_status} handleSelectedDisConStatus={this.handleSelectedDisConStatus}
                                /> :
                                <div style={{}}>
                                    <EmploymentDetailTable goToViewForm={this.goToViewForm} goToEditForm={this.goToEditForm} data={this.state.employeeData ? this.state.employeeData : []} permission={{
                                        isEdit: 1,
                                        isView: 1
                                    }} />
                                </div>
                        }</>
                }






            </div>
        )

    }
}


export default EmployeeDetailMain;