import React, { Component } from 'react';
import moment from 'moment';
import DatePicker from 'react-datetime';
import Select from 'react-select';
import $ from 'jquery';
import { main_url, getFirstDayOfMonth } from '../../utils/CommonFunction';

export default class LeaveBalance extends Component {

    constructor(props) {
        super(props);
        this.state = {
            balance: [],
            year: moment(getFirstDayOfMonth()),
            loading: false,
            selected_department_value: 0,
            selected_location_value: 0,
            selected_region_value: 0,
        }
    }

    componentDidMount() {
        this.getBranchList();
        this.getDepartmentList();
        this.getRegionList();
    }

    getLeaveBalance() {
        let year = moment(this.state.year).format('YYYY');
        this.setState({ loading: true });
        fetch(`${main_url}leave/getLeaveBalance/${year}/${this.state.selected_location_value}/${this.state.selected_department_value}/${this.state.selected_region_value}`)
            .then(res => res.json())
            .then(data => {
                this.setState({ loading: false })
                this._setTableData(data);
            })

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
                let lists = list.unshift({ state_id: 0, state_name: 'All' })
                this.setState({
                    regionList: list.map(v => ({ ...v, label: v.state_name, value: v.state_id }))
                })
            })
    }


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
            })
    };

    handleSelectedRegion = (event) => {
        if (event !== null)
            this.setState({
                selected_region: event,
                selected_region_value: event.value
            })
    };

    filter() {
        let year = moment(this.state.year).format('YYYY')
        this.getLeaveBalance();

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
        for (var i = 0; i < data.length; i++) {
            let result = data[i];
            let status = '';
            let obj = [];

            obj = {
                id: result.employment_id,
                name: result.fullname,
                designations: result.designations,
                leave_balance: result.leave_balance_days
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
            { title: "Designations", data: "designations" },
            { title: "Leave Balance", data: "leave_balance" }

        ]

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
                        <div className="row" style={{marginBottom:10}}>
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
                        </div>
                    </div>
                    <div className='row container mt20'>
                        <table width="99%"
                            className="table table-striped table-bordered table-hover responsive nowrap dt-responsive"
                            id="dataTables-table"
                        />
                    </div>
                </div>
            )
        }
    }
}