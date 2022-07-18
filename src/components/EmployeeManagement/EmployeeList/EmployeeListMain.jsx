import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import Select from "react-select";
import EmployeeListTable from "./EmployeeListTable"

import { main_url, getUserId, getMainRole, getWorkFlowStatus, getCookieData, getPermissionStatus, startSaving } from "../../../utils/CommonFunction";
import EmployeeListView from './EmployeeListView';
import EditEmployeeListForm from './EditEmployeeListForm';
import { useLocation } from 'react-router-dom';
import EmployeeDetailMain from '../EmploymentDetail/EmployeeDetailMain';

class EmployeeListMain extends Component {
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
            permission_status: {},
            selected_region: null,
            selected_branch: null,
            selected_department: null,
            selected_designation: null,
            branchlist: null,
            region: null,
            districtCodeList: null,
            granDistrictCodeList: null,
            nrcList: null,
            departmentlist: null,
            designationList: null,
            searchValue: '',
            employeeData: null,
            viewForm: false,
            editForm: false,
            selectedEmployeeData: null,
            bankList: null,
            degreeList: null,
            detailForm: false


        }
    }

    componentDidMount() {
        this.getRegionList();
        this.getBranchList();
        this.getDepartmentList();
        this.getDesignationList()
        this.getNRC_DistrictCode(0)
        this.getNRC_SD_Code(0)
        this.getGran_NRC_DistrictCode(0)
        this.getLevelOptions()
        this.getBankList()
        this.getDegreeList()
    }
    getDegreeList() {
        fetch(`${main_url}employee/getDegree`)
            .then(res => { if (res.ok) return res.json() })
            .then(list => {
                // let lists = list.unshift({ branch_id: 0, branch_name: 'All' })
                this.setState({
                    degreeList: list.map(v => ({ ...v, label: v.degree, value: v.id }))
                })
            })
    }

    getBankList() {
        fetch(`${main_url}employee/getBank`)
            .then(res => { if (res.ok) return res.json() })
            .then(list => {
                // let lists = list.unshift({ branch_id: 0, branch_name: 'All' })
                this.setState({
                    bankList: list.map(v => ({ ...v, label: v.bank_name, value: v.id }))
                })
            })
    }

    getNRC_DistrictCode(id) {
        fetch(`${main_url}employee/getNrc/${id}`)
            .then(res => { if (res.ok) return res.json() })
            .then(list => {

                this.setState({
                    districtCodeList: list.map(v => ({ ...v, label: v.district_code, value: v.id }))

                })
            })
    }

    getGran_NRC_DistrictCode(id) {
        fetch(`${main_url}employee/getNrc/${id}`)
            .then(res => { if (res.ok) return res.json() })
            .then(list => {

                this.setState({
                    granDistrictCodeList: list.map(v => ({ ...v, label: v.district_code, value: v.id }))

                })
            })
    }

    getLevelOptions() {
        fetch(`${main_url}allowLevel/getLevel`)
            .then(res => { if (res.ok) return res.json() })
            .then(list => { 
                this.setState({
                    level_options: list.map(v => ({ ...v, label: v.career_level, value: v.career_level_id }))
                })
            })
    }

    getNRC_SD_Code(id) {
        fetch(`${main_url}employee/getNrc/${id}`)
            .then(res => { if (res.ok) return res.json() })
            .then(list => {
                // let lists = list.unshift({ branch_id: 0, branch_name: 'All' })
                var idList = [];
                var sd_code_arr = [];
                var name = "";
                var count = 1;
                list &&
                    list.map((v, k) => {
                        if (count == 1) {
                            name = v.sd_code;
                            idList.push(v);
                            sd_code_arr.push(v.sd_code);
                        }
                        if (v.sd_code != name && !sd_code_arr.includes(v.sd_code)) {
                            sd_code_arr.push(v.sd_code);
                            idList.push(v);
                            name = v.sd_code;
                        }
                        count++;
                    });

                this.setState({
                    nrcList: idList.map(v => ({ ...v, label: v.sd_code, value: v.id })),

                })
            })
    }


    getEmployeeList(id) {

        fetch(`${main_url}employee/getEmployeeList/${id.regionId}/${id.depId}/${id.branchId}/${id.designId}`)

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

    getBranchList() {
        fetch(`${main_url}benefit/getBranchList`)
            .then(res => { if (res.ok) return res.json() })
            .then(list => {
                let lists = list.unshift({ branch_id: 0, branch_name: 'All' })
                this.setState({
                    branchlist: list.map(v => ({ ...v, label: v.branch_name, value: v.branch_id }))
                })
            })
    }

    getDepartmentList() {
        fetch(`${main_url}benefit/getDepartmentList`)
            .then(res => { if (res.ok) return res.json() })
            .then(list => {
                let lists = list.unshift({ departments_id: 0, deptname: 'All' })
                this.setState({
                    departmentlist: list.map(v => ({ ...v, label: v.deptname, value: v.departments_id }))
                })
            })
    }

    getRegionList() {
        fetch(`${main_url}benefit/getRegionList`)
            .then(res => { if (res.ok) return res.json() })
            .then(list => {
                let lists = list.unshift({ region_id: 0, region_name: 'All' })
                this.setState({
                    region: list.map(v => ({ ...v, label: v.region_name, value: v.region_id }))
                })
            })
    }

    getDesignationList() {
        fetch(`${main_url}main/getDesignations`)
            .then(res => { if (res.ok) return res.json() })
            .then(list => {
                let lists = list.unshift({ value: 0, label: 'All' })
                this.setState({
                    designationList: list//list.map(v => ({ ...v, label: v.region_name, value: v.region_id }))
                })
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

    handleSelectedRegion = (event) => {
        if (event !== null)
            this.setState({
                selected_region: event
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

    handleSearch = e => {
        e.preventDefault();
        const regionId = this.state.selected_region ? this.state.selected_region.region_id : 0
        const depId = this.state.selected_department ? this.state.selected_department.departments_id : 0
        const branchId = this.state.selected_branch ? this.state.selected_branch.branch_id : 0
        const designId = this.state.selected_designation ? this.state.selected_designation.value : 0

        this.getEmployeeList({ regionId, depId, branchId, designId })

    }

    handleAddNew = () => {
        this.props.history.push('./employee_register');
    }

    BackToTable = () => {
        this.setState({
            viewForm: false,
            editForm: false,
            selectedEmployeeData: null,
            editForm: false
        })
        const regionId = this.state.selected_region ? this.state.selected_region.region_id : 0
        const depId = this.state.selected_department ? this.state.selected_department.departments_id : 0
        const branchId = this.state.selected_branch ? this.state.selected_branch.branch_id : 0
        const designId = this.state.selected_designation ? this.state.selected_designation.value : 0

        this.getEmployeeList({ regionId, depId, branchId, designId })
    }

    goToViewForm = data => {
        this.setState({
            viewForm: true,
            selectedEmployeeData: data
        })
    }

    goToEditForm = data => {
        this.setState({
            editForm: true,
            selectedEmployeeData: data
        })
    }

    goToDetailForm = data => {
        this.setState({
            detailForm: true,
            selectedEmployeeData: data
        })
    }

    render() {
        return (
            <div className=" border-bottom white-bg dashboard-header">
                <ToastContainer position={toast.POSITION.TOP_RIGHT} />
                <div className="row wrapper border-bottom white-bg page-heading">
                    <div className="col-lg-12">
                        <h2>HR Management System</h2>
                        <ol className="breadcrumb">
                            <li>
                                Employee
                            </li>
                            <li className="active">
                                <a href="#">List</a>
                            </li>
                            {
                                this.state.viewForm &&
                                <li className="active">
                                    <a href="#">View</a>
                                </li>
                            }
                            {
                                this.state.editForm &&
                                <li className="active">
                                    <a href="#">Edit</a>
                                </li>
                            }

                        </ol>
                    </div>

                </div>
                {
                    this.state.viewForm ?
                        <EmployeeListView selectedEmployeeData={this.state.selectedEmployeeData} BackToTable={this.BackToTable} districtCodeList={this.state.districtCodeList}
                            granDistrictCodeList={this.state.granDistrictCodeList} designationList={this.state.designationList} level_options={this.state.level_options} branchlist={this.state.branchlist}
                            nrcList={this.state.nrcList} viewForm={true} editForm={false} />
                        : this.state.editForm ?
                            <EditEmployeeListForm selectedEmployeeData={this.state.selectedEmployeeData} BackToTable={this.BackToTable} viewForm={false} editForm={true} districtCodeList={this.state.districtCodeList}
                                granDistrictCodeList={this.state.granDistrictCodeList} designationList={this.state.designationList} level_options={this.state.level_options} branchlist={this.state.branchlist}
                                nrcList={this.state.nrcList} bankList={this.state.bankList} getGran_NRC_DistrictCode={this.getGran_NRC_DistrictCode} getNRC_DistrictCode={this.getNRC_DistrictCode} degreeList={this.state.degreeList} />
                            : this.state.detailForm ?
                                <EmployeeDetailMain data={this.state.selectedEmployeeData} />
                                : <>
                                    <div className='' style={{ marginTop: 20, alignItems: 'center', display: 'flex', flexWrap: 'wrap' }}>
                                        <div className='col-lg-3 col-md-4 col-sm-6' style={{ marginBottom: 10, paddingLeft: 20, paddingRight: 20 }}>
                                            <div style={{ paddingBottom: 10 }}>
                                                Region
                                            </div>

                                            <Select
                                                options={this.state.region}
                                                value={this.state.selected_region}
                                                onChange={this.handleSelectedRegion.bind(this)}
                                                className="react-select-container checkValidate"
                                                classNamePrefix="react-select"
                                            />
                                        </div>
                                        <div className='col-lg-3 col-md-4 col-sm-6' style={{ marginBottom: 10, paddingLeft: 20, paddingRight: 20 }}>
                                            <div style={{ paddingBottom: 10 }}>
                                                Department
                                            </div>

                                            <Select
                                                options={this.state.departmentlist}
                                                value={this.state.selected_department}
                                                onChange={this.handleSelectedDeaprtment.bind(this)}
                                                className="react-select-container checkValidate"
                                                classNamePrefix="react-select"
                                            />
                                        </div>
                                        <div className='col-lg-3 col-md-4 col-sm-6' style={{ marginBottom: 10, paddingLeft: 20, paddingRight: 20 }}>
                                            <div style={{ paddingBottom: 10 }}>
                                                Branch
                                            </div>

                                            <Select
                                                options={this.state.branchlist}
                                                value={this.state.selected_branch}
                                                onChange={this.handleSelectedBranch.bind(this)}
                                                className="react-select-container checkValidate"
                                                classNamePrefix="react-select"
                                            />
                                        </div>
                                        <div className='col-lg-3 col-md-4 col-sm-6' style={{ marginBottom: 10, paddingLeft: 20, paddingRight: 20 }}>
                                            <div style={{ paddingBottom: 10 }}>
                                                Designation
                                            </div>

                                            <Select
                                                options={this.state.designationList}
                                                value={this.state.selected_designation}
                                                onChange={this.handleSelectedDesignation.bind(this)}
                                                className="react-select-container checkValidate"
                                                classNamePrefix="react-select"
                                            />
                                        </div>

                                        <div className='col-lg-6 mx-2' style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'end', marginTop: 20 }}>
                                            <button onClick={this.handleSearch} className='btn btn-primary' style={{ borderRadius: 3, width: 90 }}>Search</button>

                                        </div>
                                        <div className='col-lg-6 mx-2' style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'end', marginTop: 20 }}>
                                            <button onClick={this.handleAddNew} className='btn btn-primary' style={{ borderRadius: 3, width: 90 }}>Add New</button>

                                        </div>
                                    </div>
                                    <EmployeeListTable goToViewForm={this.goToViewForm} goToEditForm={this.goToEditForm} goToDetailForm={this.goToDetailForm} data={this.state.employeeData ? this.state.employeeData : []} permission={{
                                        isEdit: 1,
                                        isView: 1
                                    }} />
                                </>
                }

            </div>
        )

    }
}


export default EmployeeListMain;