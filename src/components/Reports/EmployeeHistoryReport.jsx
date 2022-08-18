import React, { Component } from "react";
import { main_url, getBranch, getRegion, getDepartment } from '../../utils/CommonFunction';
import DatePicker from 'react-datetime';
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import 'datatables.net-responsive-bs4/css/responsive.bootstrap4.min.css';
import 'datatables.net-dt/css/jquery.dataTables.css'
import 'datatables.net-buttons-dt/css/buttons.dataTables.css';
import 'jspdf-autotable';
import Select from 'react-select';
const $ = require('jquery');
const jzip = require('jzip');
window.JSZip = jzip;
$.DataTable = require('datatables.net-bs4');
$.DataTable = require('datatables.net-responsive-bs4');
$.DataTable = require('datatables.net');
require('datatables.net-buttons/js/dataTables.buttons.min');
require('datatables.net-buttons/js/buttons.html5.min');


class HistoryReport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            branch: [],
            empNameList: [],
            region: [],
            empIdList: [],
            department: [],
            branchId: null,
            regionId: null,
            depId: null,
            empId: null,
            empName: null,
            employeeName: null,
            empProfile: []
        }
    }

    async componentDidMount() {
        this.$el = $(this.el);
        this.setState(
            {
                dataSource: this.props.data,

            },
            () => {
                this._setTableData(this.state.dataSource);
            }
        );
        let branch = await getBranch();
        branch.unshift({ label: 'All', value: 0 });
        let region = await getRegion();
        region.unshift({ region_name: 'ALL', region_id: 0 });
        await this.getEmployeeName();
        await this.getEmployeeList();
        // await getDate;
        let department = await getDepartment();
        department.unshift({ label: 'ALL', value: 0 });
        this.setState({
            branch: branch,
            department: department,
            region: region.map(v => ({ ...v, label: v.region_name, value: v.region_id })),
            // empNameList:empNameList
        })
    }
    getEmployeeList() {
        fetch(`${main_url}main/getEmployeeWithDesignation/0`)
            .then(res => res.json())
            .then(data => {
                // const all = data.map(v => (v.employment_id).trim())
                this.setState({
                    employeeList: data.map(v => ({ ...v, label: v.employment_id, value: v.value, name: v.label })),
                    // allEmployeeID: all
                })

            })
    }
    getEmployeeName() {
        fetch(`${main_url}report/employeeName`)
            .then((res) => {
                if (res.ok) return res.json();
            })
            .then((list) => {
                let lists = list.unshift({ value: 0, label: "All" });
                this.setState({
                    empNameList: list.map((v) => ({
                        ...v
                    }))
                })
            })
    }
    handleSelectedBranch = async (event) => {
        this.setState({
            branchId: event
        })
    }
    handleSelectedEmpId = async (event) => {

        this.setState({
            empId: event,
            empName: event.name,
            empNameList: this.state.empNameList.filter(v => v.value == event.value)
        }, () => { console.log("name>>>>>", this.state.empId) })
    }

    handleSelectedRegion = async (event) => {
        this.setState({
            regionId: event,
            branch: this.state.branch.filter(v => v.region_id == event.region_id)

        }, () => { console.log("region>>>>", this.state.regionId) })
    }
    handleSelectedName = async (event) => {
        this.setState({
            employeeName: event,
        })
    }
    handleSelectedDepartment = async (event) => {
        if (event != null)
            this.setState({
                depId: event
            }, () => { console.log("dtaa===>>>", this.state.depId.value) })
    }
    handleSearchData = () => {
        fetch(`${main_url}report/historyReport/${this.state.regionId ? this.state.regionId.value : 0}/${this.state.branchId ? this.state.branchId.value : 0}/${this.state.depId ? this.state.depId.value : 0}/${this.state.empId ? this.state.empId.label : 0}/${this.state.empName ? this.state.empName : 0}`)
            .then(res => { if (res.ok) return res.json() })
            .then(list => {
                // let data=list
                
                this.setState({
                    empProfile: list
                }, () => { 
                    console.log(this.state.empProfile[0].history)
                   
                })
                this._setTableData(this.state.empProfile[0].history);
            })
    }
    _setTableData = (data) => {
        var table;
        var l = [];
        if (data) {
            for (var i = 0; i < data.length; i++) {   
                let result = data[i];
                let obj = [];
                obj = {
                    designation: data[i].designations ? data[i].designations : "-",
                    location: data[i].location_type_name ? data[i].location_type_name : "-",
                    department: data[i].deptname ? data[i].deptname : "-",
                    level: data[i].career_sub_level ? data[i].career_sub_level : "-",
                    employed_date: data[i].effective_date ? data[i].effective_date : "-",
                    salary: data[i].salary ? data[i].salary : "-",
                }

                l.push(obj)
            }
        }

        if ($.fn.dataTable.isDataTable('#dataTables-table')) {
            table = $('#dataTables-table').dataTable();
            table.fnClearTable();
            table.fnDestroy();
            $('#dataTables-table').empty();
        }
        var column = [
            { title: "Designation", data: "designation" },
            { title: "Location", data: "location" },
            { title: "Department", data: "department" },
            { title: "Level", data: "level" },
            { title: "Employed Date/Promotion Date", data: "employed_date" },
            { title: "Salary", data: "salary" },
        ]
        table = $("#dataTables-table").DataTable({

            autofill: true,
            bLengthChange: false,
            bInfo: false,
            responsive: true,
            pageLength: 50,
            paging: true,

            //     // buttons: true,
            dom: 'Btiprl',
            //     // buttons: [
            //     //     'copy', 'csv', 'excel', 'pdf'
            //     // ],
            buttons: [
                //         // 'copy',
                //         // {
                //         //         extend: 'csvHtml5',
                //         //         title: 'Child Benefit',
                //         // },
                //         // {
                //         //     extend: 'excelHtml5',
                //         //     title: 'Child Benefit',
                //         // },
                //         // {
                //         //     extend: 'pdfHtml5',
                //         //     title: 'Child Benefit',
                //         // }
            ],
            data: l,
            columns: column
        });
    }


    render() {

        return (
            <div className="col-12">
                    <div className='white-bg ' style={{ paddingTop: 20, border: '1px solid lightgrey', display: 'grid', borderTop: 'none', marginTop: -10, paddingBottom: 20, boxShadow: '5px 5px 5px lightgrey',paddingLeft: 20}}>
                        <h3 className=""style={{paddingLeft:"40px"}} >Employee History Report</h3>
                        <div className='flex-row' style={{ display: 'flex', justifyContent: 'left', alignItems: 'center', margin: '10px 10px 10px 10px', paddingLeft: 20, paddingRight: 20 }}>
                            <Select
                                styles={{
                                    container: base => ({
                                        ...base,
                                        //   flex: 1
                                        width: 150,
                                        paddingLeft: 10,
                                        paddingRight: 10,
                                        paddingLeft: 10,
                                        paddingRight: 10
                                    }),
                                    control: base => ({
                                        ...base,
                                        minHeight: '18px'
                                    }),

                                }}
                                placeholder="Region"
                                options={this.state.region}
                                onChange={this.handleSelectedRegion}
                                value={this.state.regionId}
                                className='react-select-container'
                                classNamePrefix="react-select"
                            />
                            <Select
                                styles={{
                                    container: base => ({
                                        ...base,
                                        //   flex: 1
                                        width: 150,
                                        paddingLeft: 10,
                                        paddingRight: 10,
                                        paddingLeft: 10,
                                        paddingRight: 10
                                    }),
                                    control: base => ({
                                        ...base,
                                        minHeight: '18px'
                                    }),

                                }}
                                placeholder="Branch"
                                options={this.state.branch}
                                onChange={this.handleSelectedBranch}
                                value={this.state.branchId}
                                className='react-select-container'
                                classNamePrefix="react-select"
                            />
                            <Select
                                styles={{
                                    container: base => ({
                                        ...base,
                                        //   flex: 1
                                        width: 150,
                                        paddingLeft: 10,
                                        paddingRight: 10
                                    }),
                                    control: base => ({
                                        ...base,
                                        minHeight: '18px'
                                    }),

                                }}
                                placeholder="Department"
                                options={this.state.department}
                                onChange={this.handleSelectedDepartment}
                                value={this.state.depId}
                                className="react-select-container"
                                classNamePrefix="react-select"
                            />
                            <Select
                                styles={{
                                    container: base => ({
                                        ...base,
                                        //   flex: 1
                                        width: 150,
                                        paddingLeft: 10,
                                        paddingRight: 10
                                    }),
                                    control: base => ({
                                        ...base,
                                        minHeight: '18px'
                                    }),

                                }}
                                placeholder="Employee ID"
                                options={this.state.employeeList}
                                onChange={this.handleSelectedEmpId}
                                value={this.state.empId}
                                className='react-select-container'
                                classNamePrefix="react-select"
                            />
                            <Select
                                styles={{
                                    container: base => ({
                                        ...base,
                                        //   flex: 1
                                        width: 160,
                                        paddingLeft: 10,
                                        paddingRight: 10
                                    }),
                                    control: base => ({
                                        ...base,
                                        minHeight: '18px'
                                    }),

                                }}
                                placeholder="Employee Name"
                                options={this.state.empNameList}
                                onChange={this.handleSelectedName}
                                type="value"
                                value={this.state.employeeName}
                                className='react-select-container'
                                classNamePrefix="react-select"
                            />
                            <button className='btn btn-primary text-center' style={{ marginLeft: 10, height: 30, padding: '0px 5px 0px 5px' }} onClick={() => this.handleSearchData()}>Search</button>
                        </div>
                        {this.state.empProfile.length > 0 ?        
                                <div className="col-lg-12" style={{ paddingLeft: 45 }}>
                                     <div>
                                    <div style={{ border: '1px solid grey', width: 140, height: 120, borderStyle: 'dashed' }}>
                                        <img src="" alt="" style={{ width: 140, height: 120, objectFit: 'contain' }} />
                                    </div>                               
                               
                                    <div className='col-lg-6 col-md-6 col-sm-6' style={{}}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 15, textAlign: "start", }}>
                                            <div className='col-lg-5 col-md-5 col-sm-5'>
                                                Employee ID
                                            </div>
                                            <div className='col-lg-2 col-md-2 col-sm-2'>
                                                :
                                            </div>
                                            <div className='col-lg-5 col-md-5 col-sm-5'>{this.state.empProfile[0].employment_id}</div>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 15, textAlign: "start" }}>
                                            <div className='col-lg-5 col-md-5 col-sm-5'>
                                                Employee Name
                                            </div>
                                            <div className='col-lg-2 col-md-2 col-sm-2'>
                                                :
                                            </div>
                                            <div className='col-lg-5 col-md-5 col-sm-5'>{this.state.empProfile[0].fullname}</div>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 15 }}>
                                            <div className='col-lg-5 col-md-5 col-sm-5'>
                                                Address
                                            </div>
                                            <div className='col-lg-2 col-md-2 col-sm-2'>
                                                :
                                            </div>
                                            <div className='col-lg-5 col-md-5 col-sm-5'>{this.state.empProfile[0].address}</div>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 15 }}>
                                            <div className='col-lg-5 col-md-5 col-sm-5'>
                                                Phone No
                                            </div>
                                            <div className='col-lg-2 col-md-2 col-sm-2'>
                                                :
                                            </div>
                                            <div className='col-lg-5 col-md-5 col-sm-5'>{this.state.empProfile[0].phone}</div>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 15 }}>
                                            <div className='col-lg-5 col-md-5 col-sm-5'>
                                                Join Date
                                            </div>
                                            <div className='col-lg-2 col-md-2 col-sm-2'>
                                                :
                                            </div>
                                            <div className='col-lg-5 col-md-5 col-sm-5'>{this.state.empProfile[0].joining_date}</div>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 15,paddingBottom:20 }}>
                                            <div className='col-lg-5 col-md-5 col-sm-5'>
                                                Service Year
                                            </div>
                                            <div className='col-lg-2 col-md-2 col-sm-2'>
                                                :
                                            </div>
                                            <div className='col-lg-5 col-md-5 col-sm-5'>{this.state.empProfile[0].service_year[0]}</div>
                                        </div>
                                    </div>
                                    <div className='col-lg-6 col-md-6 col-sm-6' style={{}}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 15 }}>
                                            <div className='col-lg-5 col-md-5 col-sm-5'>
                                                Employed Date
                                            </div>
                                            <div className='col-lg-2 col-md-2 col-sm-2'>
                                                :
                                            </div>
                                            <div className='col-lg-5 col-md-5 col-sm-5'>{this.state.empProfile[0].effective_date}</div>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 15 }}>
                                            <div className='col-lg-5 col-md-5 col-sm-5'>
                                                Designation
                                            </div>
                                            <div className='col-lg-2 col-md-2 col-sm-2'>
                                                :
                                            </div>
                                            <div className='col-lg-5 col-md-5 col-sm-5'>{this.state.empProfile[0].designations}</div>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 15}}>
                                            <div className='col-lg-5 col-md-5 col-sm-5'>
                                                Location
                                            </div>
                                            <div className='col-lg-2 col-md-2 col-sm-2'>
                                                :
                                            </div>
                                            <div className='col-lg-5 col-md-5 col-sm-5'>{this.state.empProfile[0].location_type_name}</div>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 15 }}>
                                            <div className='col-lg-5 col-md-5 col-sm-5'>
                                                Department
                                            </div>
                                            <div className='col-lg-2 col-md-2 col-sm-2'>
                                                :
                                            </div>
                                            <div className='col-lg-5 col-md-5 col-sm-5'>BaLa</div>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 15 }}>
                                            <div className='col-lg-5 col-md-5 col-sm-5'>
                                                Resign Date
                                            </div>
                                            <div className='col-lg-2 col-md-2 col-sm-2'>
                                                :
                                            </div>
                                            <div className='col-lg-5 col-md-5 col-sm-5'>BaLa</div>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 15 }}>
                                            <div className='col-lg-5 col-md-5 col-sm-5 '>
                                                Resign Status
                                            </div>
                                            <div className='col-lg-2 col-md-2 col-sm-2'>
                                                :
                                            </div>
                                            <div className='col-lg-5 col-md-5 col-sm-5'>BaLa</div>
                                        </div>
                                    </div>

                                </div>
                                {/* <div className='white-bg col-lg-12 ' style={{ paddingTop: 20, border: '1px solid lightgrey', display: 'grid', borderTop: 'none', marginTop: -10, paddingBottom: 20, boxShadow: '5px 5px 5px lightgrey' }}> */}
                                    <table width="99%"
                                        className="table table-striped table-bordered table-hover table-responsive nowrap dt-responsive"
                                        id="dataTables-table"
                                    />
                                {/* </div> */}
                                </div>
                                 : null}
                    </div>
                </div>
        )
    }
}
export default HistoryReport;