import React, { Component } from 'react';
import Select from 'react-select';
import '../../Benefits/Benefits.css';
import { ToastContainer, toast } from 'react-toastify';
import moment from 'moment'
import { main_url, getUserId, getCookieData, validate, stopSaving, startSaving } from "../../../utils/CommonFunction";
let limit_amount = 17500;
let form_validate = true;
class TeamBuildingAddNew extends Component {
    constructor(props) {
        super(props);
        var user_info = getCookieData("user_info");
        this.state = {
            one_benefit: this.props.data,
            quater_list: [],
            status: 0,
            createdBy: 0,
            updatedBy: 0,
            user_id: user_info.user_id,
            total_amount: 0,
            selected_quater: [],
            selected_location: [],
            employee_list: [],
            branchlist: [],
            all_amount: 0,
            amount: 0,
            selected_department: [],
            employee_id: '',
            employeeList: [],
            selectedEmployee: [],
            allEmployeeID: [],
            year_list: [],
            year: '',
            // dataSource: {
            //     employeeName: '',
            //     designation: '',
            //     spouseName: '',
            //     spouseCompanyOption: ''
            // },
        }
    }

    getBranchList() {
        fetch(`${main_url}benefit/getBranchList`)
            .then(res => { if (res.ok) return res.json() })
            .then(list => {
                this.setState({
                    // 
                    branchlist: list.map(v => ({ ...v, label: v.branch_name, value: v.branch_id }))
                })
            })
    }

    getDepartmentList() {
        fetch(`${main_url}benefit/getDepartmentList`)
            .then(res => { if (res.ok) return res.json() })
            .then(list => {
                this.setState({
                    departmentlist: list.map(v => ({ ...v, label: v.deptname, value: v.departments_id }))
                })
            })
    }

    getQuaterList() {
        fetch(`${main_url}team_building/getQuater`)
            .then(res => { if (res.ok) return res.json() })
            .then(list => {
                this.setState({
                    quater_list: list
                })
            })
    }

    componentDidUpdate() {
        if (!form_validate) validate("check_form")
    }

    componentDidMount() {
        this.getBranchList();
        this.getQuaterList();
        this.getDepartmentList();
        this.getEmployeeList();
        this.getYearList();
    }

    getEmployeeList() {
        fetch(`${main_url}main/getEmployeeWithDesignation/0`)
            .then(res => res.json())
            .then(data => {
                console.log("data is ===>", data)
                // console.log(data[1].employment_id,'...')
                // const all = data.map(v => (v.employment_id).trim())
                this.setState({
                    employeeList: data.map(v => ({ ...v, label: v.employment_id, value: v.value, designation: v.designation, name: v.label })),
                    // allEmployeeID: all
                })

            })
    }

    handleChangeEmployee = e => {
        this.setState({
            selectedEmployee: e
        })
    }

    getEmployeeListByBranch(id) {
        fetch(`${main_url}main/getEmployeeListByBranch/${id}`)
            .then(res => { if (res.ok) return res.json() })
            .then(list => {
                this.setState({
                    employee_list: list
                })
                // console.log("emp list is", this.state.employee_list)
            })
    }

    getEmployeeDepByList(id) {
        fetch(`${main_url}team_building/getDepartment/${id}`)
            .then(res => { if (res.ok) return res.json() })
            .then(list => {
                this.setState({
                    employee_list: list
                })
            })
    }



    handleSelectedLocation = (event) => {
        if (event !== null) this.getEmployeeListByBranch(event.value);
        this.setState({
            selected_location: event
        })
    };

    handleSelectedDeaprtment = (event) => {
        if (event !== null) this.getEmployeeDepByList(event.value);
        this.setState({
            selected_department: event
        })
    };

    handleSelectedQuater = (event) => {
        this.setState({
            selected_quater: event
        })
    };

    handleAmount = (index, e) => {
        if (e.target.value > limit_amount) {
            toast.error('Your amount is too much.Please check the amount!', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
        } else {
            var data = this.state.employee_list;
            data[index].amount = e.target.value;
            this.setState({
                employee_list: data
            })
        }

    }

    handleAllAmount = (e) => {
        this.setState({
            all_amount: e.target.value
        })
    }

    addEmpId = (e) => {
        if (e != null) {
            this.setState({
                employee_id: e.target.value
            })
        } else {
            this.setState({
                employee_id: null
            })
        }
    }
    getYearList() {
        var d = new Date();
        var lastYear = d.getFullYear();
        var previousYear = (d.getFullYear() - 1);
        const options = [
            { value: lastYear, label: lastYear },
            { value: previousYear, label: previousYear }

        ]
        this.setState({
            year_list: options
            //list.map(v => ({ ...v, label: v.branch_name, value: v.branch_id }))
        })
    }
    handleYear = (event) => {
        this.setState({
            year: event
        });
    };

    addEmployeeInList() {
        // console.log("add employee", this.state.selectedEmployee.value)
        let employee_id = this.state.selectedEmployee.value
        fetch(`${main_url}team_building/getEmployee`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `employee_id=${JSON.stringify(employee_id)}`
        })
            .then(res => { if (res.ok) return res.json() })
            .then(list => {
                if (list.length == 0) {
                    this.setState({
                        employee_list: this.state.employee_list,
                        employee_id: ''
                    })
                } else {
                    this.state.employee_list.filter(v => v.fullname == list[0].fullname).length > 0 ?
                        toast.error(list[0].fullname + " already exist in table") :
                        this.setState({
                            employee_list: this.state.employee_list.concat(list[0]),
                            employee_id: ''
                        })
                }
            })
    }
    removeEmployeeInList() {
        // console.log("remove employee", this.state.employee_id)
        let employee_id = this.state.selectedEmployee.value
        fetch(`${main_url}team_building/getEmployee`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `employee_id=${JSON.stringify(employee_id)}`
        })
            .then(res => { if (res.ok) return res.json() })
            .then(list => {
                if (list.length == 0) {
                    this.setState({
                        employee_list: this.state.employee_list,
                        employee_id: ''
                    })
                } else {
                    this.setState({
                        employee_list: this.state.employee_list.filter(v => v.user_id !== list[0].user_id),
                        employee_id: ''
                    })
                }
            })
    }



    addAmount = () => {
        if (this.state.all_amount > limit_amount) {
            toast.error('Your amount is too much.Please check the amount!', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
        } else {
            var data = this.state.employee_list;
            var amount = this.state.all_amount;
            for (let i = 0; i < data.length; i++) {
                data[i].amount = amount;
            }
            this.setState({
                employee_list: data
            })
        }
    }

    save(total_amount) {
        stopSaving();

        let one_benefit = this.state.one_benefit;
        if (validate('check_form')) {
            stopSaving();
            var data = {
                location_id: this.state.selected_location.value,
                quater: this.state.selected_quater.value,
                // designation: this.state.designation,
                year: this.state.year.value,
                total_amount: total_amount,
                detail: this.state.employee_list,
                status: this.state.status,
                createdBy: this.state.user_id,
                updatedBy: this.state.user_id
            }
            // const formdata = new FormData();

            // formdata.append('benefit', JSON.stringify(data))
            let status = 0;
            let path = '';

            if (!Array.isArray(one_benefit) && one_benefit !== null) {
                path = `editTeamBuilding/${one_benefit.benefit_id}`;
            }
            else {
                path = `saveTeamBuilding`;
            }

            console.log("data is", JSON.stringify(data))

            fetch(`${main_url}team_building/${path}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `benefit=${JSON.stringify(data)}`
                // body: `${console.log("form data",JSON.stringify(data))}`

            })
                .then(res => {
                    status = res.status;
                    return res.text()
                })
                .then(text => {
                    this.props.showToast(status, text);
                })
        } else {
            startSaving();
            form_validate = false;
        }
    }

    render() {
        console.log("selected employee is ===>", this.state.selectedEmployee)
        this.total_amount = 0;
        return (
            <div className="container">
                <div className='row'>
                    <div id="check_form">
                        <div className="row">
                            <div className="form-group col-md-6">
                                <div><label htmlFor="employee-name" className="col-sm-12">Select Location</label></div>
                                <div className="col-sm-10">
                                    <Select
                                        options={this.state.branchlist}
                                        placeholder="Please Choose Branch"
                                        onChange={this.handleSelectedLocation.bind(this)}
                                        value={this.state.selected_location}
                                        className='react-select-container checkValidate'
                                        classNamePrefix="react-select"
                                    />
                                    {/* <input type="text" className="form-control input-md" value={this.state.user_info.fullname} disabled /> */}

                                </div>
                            </div>
                            <div className="col-md-6">
                                <div><label htmlFor="employee-Name" className="col-sm-12">Select Year</label></div>
                                <div className="col-sm-10">
                                    <Select
                                        placeholder="Select Year"
                                        options={this.state.year_list}
                                        value={this.state.year}
                                        onChange={this.handleYear}
                                        className='react-select-container checkValidate'
                                        classNamePrefix="react-select"
                                    />
                                </div>
                            </div>

                        </div>

                        <div className="row">
                            <div className="form-group col-md-6">
                                <div>
                                    <label htmlFor="employee-Name" className="col-sm-12">Employee Id</label>
                                </div>
                                <div className="col-sm-10">

                                    {/* <input type="value" min="0" max="17500" placeholder="Add Employee Id" className="form-control input-md" value={this.state.employee_id} onChange={this.addEmpId.bind(this)} /> */}
                                    <Select
                                        placeholder="Select Employee"
                                        options={this.state.employeeList}
                                        value={this.state.selectedEmployee}
                                        onChange={this.handleChangeEmployee}
                                        className='react-select-container'
                                        classNamePrefix="react-select"
                                    />
                                </div>
                            </div>
                            <div className="form-group col-md-6">
                                <div><label htmlFor="designation" className="col-sm-12">Select Quater</label></div>
                                <div className="col-sm-10">
                                    <Select
                                        options={this.state.quater_list}
                                        placeholder="Please Choose Quater"
                                        onChange={this.handleSelectedQuater.bind(this)}
                                        value={this.state.selected_quater}
                                        className='react-select-container checkValidate'
                                        classNamePrefix="react-select"
                                    />

                                    {/* <input
                                        type="text"
                                        // placeholder="Please Provide The Designation"
                                        className="form-control"
                                        value={this.state.user_info.designations}
                                        disabled
                                    /> */}
                                </div>
                            </div>




                            {/* <div className="col-md-3">
                                <div className="form-group float-right">

                                    <div className="col-sm-10" style={{ marginTop: 20 }}>

                                        <button className="btn btn-danger" onClick={() => this.removeEmployeeInList()}><span>Remove Employee</span> </button>

                                    </div>
                                </div>
                            </div> */}
                        </div>

                        <div className="row">
                            <div className="form-group col-md-6">
                                <div>
                                    <label htmlFor="employee-Id" className="col-sm-12">Employee Name</label>
                                </div>
                                <div className="col-sm-10">

                                    <input type="value" min="0" max="17500" placeholder="Employee Id" className="form-control input-md" value={this.state.selectedEmployee.name} />
                                </div>
                            </div>
                            <div className="col-md4"></div>
                            <div className="col-md-3">
                                <div className="form-group float-right">

                                    <div className="col-sm-10" style={{ marginTop: 20 }}>
                                        <button className="btn btn-primary" onClick={() => this.addEmployeeInList()}><span>Add Employee</span> </button>

                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="form-group float-right">

                                    <div className="col-sm-10" style={{ marginTop: 20 }}>

                                        <button className="btn btn-danger" onClick={() => this.removeEmployeeInList()}><span>Remove Employee</span> </button>

                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className="row">
                            {/* <div className="form-group col-md-6">
                                <div><label htmlFor="employee-name" className="col-sm-12">Amount</label></div>
                                <div className="col-sm-10">

                                    <input type="number" min="0" max="17500" className="form-control input-md" value={this.state.all_amount} onChange={this.handleAllAmount.bind(this)} />

                                </div>
                            </div> */}
                            <div className="form-group col-md-6">
                                <div>
                                    <label htmlFor="position" className="col-sm-12">Position</label>
                                </div>
                                <div className="col-sm-10">

                                    <input type="value" min="0" max="17500" placeholder="position" className="form-control input-md" value={this.state.selectedEmployee.designations} />
                                </div>
                            </div>

                            <div className="col-md4"></div>



                        </div>
                        <div className='row'>
                            <div className="form-group col-md-6">
                                <div><label htmlFor="employee-name" className="col-sm-12">Amount</label></div>
                                <div className="col-sm-10">

                                    <input type="number" min="0" max="17500" className="form-control input-md" value={this.state.all_amount} onChange={this.handleAllAmount.bind(this)} />

                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group float-right">

                                    <div className="col-sm-10" style={{ marginTop: 20 }}>

                                        <button className="btn btn-primary" onClick={() => this.addAmount()}><span>Add</span> </button>

                                    </div>
                                </div>
                            </div>
                        </div>

                        {this.state.selected_location.branch_id == 1 ?
                            <div className="row">
                                <div className="form-group col-md-6">
                                    <div><label htmlFor="department-name" className="col-sm-12">Select Department</label></div>
                                    <div className="col-sm-10">
                                        <Select
                                            options={this.state.departmentlist}
                                            placeholder="Please Choose Department"
                                            onChange={this.handleSelectedDeaprtment.bind(this)}
                                            value={this.state.selected_department}
                                            className='react-select-container'
                                            classNamePrefix="react-select"
                                        />
                                        {/* <input type="text" className="form-control input-md" value={this.state.user_info.fullname} disabled /> */}

                                    </div>
                                </div>
                            </div>
                            : " "}

                        {/* <div className="row">
                            <div className="form-group col-md-6">
                                <div><label htmlFor="employee-name" className="col-sm-12">Total Amount</label></div>
                                <div className="col-sm-10">

                                    <input type="number" className="form-control input-md" value={this.state.total_amount} disabled />

                                </div>
                            </div>
                        </div> */}
                        <div className="row">
                            <div className="funeral-detail col-md-11">
                                <table className="table table-bordered table-responsive">
                                    <thead>
                                        <tr>
                                            <th>No</th>
                                            <th>Employee Id</th>
                                            <th>Employee Name</th>
                                            <th>Position</th>
                                            <th>Amount</th>
                                        </tr>
                                    </thead>

                                    <tbody>

                                        {
                                            this.state.employee_list.length <= 0 ?
                                                <tr>
                                                    <td colSpan="7" className="text-center">No Data To Show</td>
                                                </tr> :

                                                this.state.employee_list.map((data, index) => {
                                                    this.total_amount += Number(data.amount)
                                                    return (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>{data.employment_id}</td>
                                                            <td>{data.fullname}</td>
                                                            <td>{data.position}</td>
                                                            <td>
                                                                <input type="number" min="0"
                                                                    className="form-control "
                                                                    onChange={this.handleAmount.bind(this, index)}
                                                                    value={data.amount}
                                                                />
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                        }
                                        <tr>
                                            <td>Total Amount</td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td>{this.total_amount}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row save-btn">
                    <button className="btn btn-primary" id="saving_button" type="button" onClick={this.save.bind(this, this.total_amount)}>Add </button>
                </div>
                <hr />

            </div>
        )
    }
}

export default TeamBuildingAddNew;