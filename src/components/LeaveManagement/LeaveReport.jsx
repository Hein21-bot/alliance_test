import React, { Component } from 'react';
import { main_url, getFirstDayOfMonth } from '../../utils/CommonFunction';
import Select from 'react-select';
import moment from 'moment';
import DatePicker from 'react-datetime';
import $ from 'jquery';

// var pagination = 0;
const length = 50;
export default class LeaveReport extends Component {

    constructor(props) {
        super(props);
        this.state = {
            report: [],
            year: moment(getFirstDayOfMonth()),
            arr: [],
            loading: false,
            pagination: 0,
            all: [],
            selected_department_value: 0,
            selected_location_value: 0,
            selected_region_value: 0,
            selected_user_value: 0
        }
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
                    regionList: list.map(v => ({ ...v, label: v.region_name, value: v.region_id }))
                })
            })
    }

    getUserList(departmentId) {
        fetch(`${main_url}benefit/getUserList/${departmentId}`)
            .then(res => { if (res.ok) return res.json() })
            .then(list => {
                let lists = list.unshift({ user_id: 0, fullname: 'All' })
                this.setState({
                    userList: list.map(v => ({ ...v, label: v.fullname, value: v.user_id }))
                })
            })
    }

    handleSelectedUser = (event) => {
        if (event !== null)
            this.setState({
                selected_user: event,
                selected_user_value: event.value
            })
    };

    handleSelectedLocation = (event) => {
        if (event !== null)
            this.setState({
                selected_location: event,
                selected_location_value: event.value
            })
    };

    handleSelectedDeaprtment = (event) => {
        if (event !== null)
            this.setState({
                selected_department: event,
                selected_department_value: event.value
            }, () => {
                this.getUserList(this.state.selected_department_value);
            })
    };

    handleSelectedRegion = (event) => {
        if (event !== null)
            this.setState({
                selected_region: event,
                selected_region_value: event.value
            })
    };

    componentDidMount() {
        this.getBranchList();
        this.getDepartmentList();
        this.getRegionList();
    }


    getLeaveReport(isNew) {

        let year = moment(this.state.year).format('YYYY');
        this.setState({ loading: true });
        if (isNew) {
            this.setState({ pagination: 0, report: [], all: [] }, () => {
                let pagination = this.state.pagination;
                let all = this.state.all;
                let report = this.state.report;
                fetch(`${main_url}leave/getLeaveReport/${year}/${this.state.pagination}/${this.state.selected_location_value}/${this.state.selected_department_value}/${this.state.selected_region_value}/${this.state.selected_user_value}`)
                    .then(res => res.json())
                    .then(data => {

                        if (this.state.pagination > 0) {
                            // all = report.concat(data);
                            this.setState({ all: this.state.report.concat(data) })
                        } else /* all =  */ this.setState({ all: data })
                        this.setState({
                            report: this.state.all,
                            loading: false
                        }, () => {
                            this._setTableData(this.state.all);
                            if (data.length > 0) {
                                this.pagination();
                            }

                        })
                        // this.setState({ loading: false });

                    })
            })
        } else {
            // this.setState({ pagination: 0, report: [], all: [] }, () => {
            let all = this.state.all;
            let report = this.state.report;
            let pagination = this.state.pagination + length
            // console.log("pagination111 is", pagination)
            fetch(`${main_url}leave/getLeaveReport/${year}/${pagination}/${this.state.selected_location_value}/${this.state.selected_department_value}/${this.state.selected_region_value}/${this.state.selected_user_value}`)
                .then(res => res.json())
                .then(data => {

                    if (this.state.pagination > 0) {
                        // all = report.concat(data);
                        this.setState({ all: this.state.report.concat(data) })
                    } else /* all = data */ this.setState({ all: data })
                    this.setState({
                        report: this.state.all,
                        loading: false
                    }, () => {
                        this._setTableData(this.state.all);
                        if (data.length > 0) {
                            this.pagination();
                        }

                    })
                    // this.setState({ loading: false });

                })
            // })
        }

    }

    pagination() {
        // pagination = pagination + length;

        this.setState({ pagination: this.state.pagination + length })
        this.getLeaveReport(false);
    }

    filter() {
        let year = moment(this.state.year).format('YYYY')
        this.getLeaveReport(true);

    }

    handleYear = (event) => {
        this.setState({
            year: event,
            all: []
        })
    }


    _setTableData = (data) => {
        var table;
        var l = [];
        let leave = [];
        for (var i = 0; i < data.length; i++) {
            let result = data[i];
            let obj = [];
            leave = result.leave;
            obj = {
                id: result.employment_id,
                name: result.employee_name,
                designation: result.designation
            }
            for (let i = 0; i < leave.length; i++) {
                obj[leave[i].leave_category_id] = leave[i].leave_count + '/' + leave[i].leave_quota;
            }

            l.push(obj)

        }
        if ($.fn.dataTable.isDataTable('#dataTables-table')) {
            table = $('#dataTables-table').dataTable();
            table.fnClearTable();
            table.fnDestroy();
            $('#dataTables-table').empty()
        }

        var column = [
            { title: "ID", data: "id" },
            { title: " Name", data: "name" },
            { title: "Designation", data: "designation" }
        ]
        for (let i = 0; i < leave.length; i++) {
            column.push({
                title: leave[i].leave_category, data: leave[i].leave_category_id
            });
        }

        table = $("#dataTables-table").DataTable({
            pageLength: 50,
            autofill: true,
            bLengthChange: false,
            bInfo: false,
            responsive: true,
            paging: true,
            buttons: true,
            dom: 'Bfrtip',
            buttons: [
                'csv', 'excel', 'pdf'
            ],
            data: l,
            columns: column
        });
    }

    render() {
        if (this.state.loading === true) {
            return <div style={{ display: 'flex', justifyContent: 'center' }}><h2>Loading...</h2></div>
        } else {
            return (
                <div>
                    <div className="row border-bottom white-bg dashboard-header">
                        <div className="row">
                            <div className="col-md-3">
                                <div><label className="col-sm-12">Select Year</label></div>
                                <div className="col-md-10">
                                    <DatePicker

                                        dateFormat="YYYY"
                                        // dateFormat="DD/MM/YYYY"
                                        value={moment(this.state.year).format('YYYY')}
                                        onChange={this.handleYear}
                                        selected={moment(this.state.year).format('YYYY')}
                                        timeFormat={false}
                                    />
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="col-md-10 margin-top-20">
                                    <button type="button" className="btn btn-primary" onClick={this.filter.bind(this)} >Search</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="form-group col-md-6">
                            <div><label htmlFor="region-name" className="col-sm-12">Region</label></div>
                            <div className="col-sm-10">
                                <Select
                                    options={this.state.regionList}
                                    placeholder="Please Choose Region"
                                    onChange={this.handleSelectedRegion.bind(this)}
                                    value={this.state.selected_region}
                                    className='react-select-container checkValidate'
                                    classNamePrefix="react-select"
                                />
                            </div>
                        </div>
                        <div className="form-group col-md-6">
                            <div><label htmlFor="branch-name" className="col-sm-12">Branch</label></div>
                            <div className="col-sm-10">
                                <Select
                                    options={this.state.branchlist}
                                    placeholder="Please Choose Branch"
                                    onChange={this.handleSelectedLocation.bind(this)}
                                    value={this.state.selected_location}
                                    className='react-select-container checkValidate'
                                    classNamePrefix="react-select"
                                />
                            </div>
                        </div>
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
                        <div className="form-group col-md-6">
                            <div><label htmlFor="employee-name" className="col-sm-12">Employee Name</label></div>
                            <div className="col-sm-10">
                                <Select
                                    options={this.state.userList}
                                    placeholder="Please Choose Department"
                                    onChange={this.handleSelectedUser.bind(this)}
                                    value={this.state.selected_user}
                                    className='react-select-container'
                                    classNamePrefix="react-select"
                                />
                            </div>
                        </div>
                    </div>
                    <div className='row container mt20'>
                        <table width="99%"
                            className="table table-striped table-bordered table-hover "
                            id="dataTables-table"
                        />
                    </div>
                </div>
            )
        }
    }
}