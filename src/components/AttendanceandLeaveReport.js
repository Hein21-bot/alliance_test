import React, { Component } from 'react';
import PageHeader from './layouts/PageHeader';
import DatePicker from 'react-datetime';
import { SyncLoader } from 'react-spinners';
import $ from 'jquery';
import Select from 'react-select';
import moment from 'moment';
import Rodal from 'rodal';
import { main_url, getBranch, getDepartment, atten_report, getUserId } from '../utils/CommonFunction';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';

var pagination = 0;
var itemPerPage = 10;
export default class AttendanceAndLeaveReport extends Component {
    constructor() {
        super();
        this.state = {
            user_id: getUserId('user_info'),
            isHR: false,
            loading: false,
            month: moment(),
            branch: [],
            dept: [],
            selectedBranch: [],
            selectedDept: [],
            days: [],
            employee_list: [],
            show: false,
            employee_name: '',
            holiday: '',
            leave: '',
            check: 1, // 1 for check in and 2 for check out
            check_in: '00:00:00',
            check_out: '00:00:00',
            missing_check_in: '00:00:00',
            missing_check_out: '00:00:00',
            time: '',
            status: 0, // 0 for holiday and 1 for attendance
            showtime: false,
            showInOut: false,
            attenIndex: 0,
            employeeIndex: 0,
            not_check_list: []
        };
    }

    async componentDidMount() {
        var branch = await getBranch();
        var dept = await getDepartment();
        this.isHR();
        this.setState({
            branch: branch,
            dept: dept
        })
        var that = this;
        $(document).on('click', '#check-out', function () {
            that.setState({
                showtime: true,
                show: false,
                check: 2
            })
        })
        $(document).on('click', '#check-in', function () {
            that.setState({
                showtime: true,
                show: false,
                check: 1
            })
        })

        var fixmeTop = $('.report-table').offset().top;
        $(window).scroll(function(){
            var currentScroll = $(window).scrollTop();
            if(currentScroll >= fixmeTop){
                $('.fixme').css({
                    position: 'static',
                    top: 0
                })
            }else {
                $('.fixme').css({
                    position: 'static'
                })
            }
        })
    }

    isHR() {
        fetch(`${main_url}main/isHR/${this.state.user_id}`)
            .then(res => res.json())
            .then(check => {
                this.setState({ isHR: check.isHR })
            })
    }

    handleChangeDate = e => {
        this.setState({ month: e })
    }

    handleChangeBranch = e => {
        this.setState({ selectedBranch: e })
    }

    handleChangeDept = e => {
        this.setState({ selectedDept: e })
    }

    handleFormVisibility = () => {
        this.setState({ formVisible: true });
      }
    view=async ()=> {
        pagination = 0;
        var branch = this.state.selectedBranch;
        var department = this.state.selectedDept;
        var branch_id = !Array.isArray(branch) ? branch.value : 0;
        var dept = !Array.isArray(department) ? department.value : 0;
        var year = moment(this.state.month).format('YYYY');
        var month = moment(this.state.month).format('MM');
        this.setState({
            loading: true,
            employee_list: [],
            not_check_list: [],
        })
        await this.getEmployeeList(year, month, branch_id, dept);
        await this.handleFormVisibility();
    }

    getEmployeeList(year, month, branch_id, dept) {
        var employee_list = [];
        var all_list = [];

        fetch(`${main_url}report/getEmployeeList/${year}/${month}/${branch_id}/${dept}/${pagination}`)
            .then(res => res.json())
            .then(res => {
                if (pagination === 1) {
                    all_list = res.list;
                } else {
                    employee_list = this.state.employee_list;
                    all_list = employee_list.concat(res.list);
                }
                this.setState({
                    loading: false,
                    employee_list: all_list,
                    days: res.days
                }, () => res.list.length > 0 ? this.pagination(year, month, branch_id, dept) : '')
            })
    }

    pagination(year, month, branch_id, dept) {
        pagination += itemPerPage;
        this.getEmployeeList(year, month, branch_id, dept);
    }

    showAttendance = (atten, aIndex, name, eIndex, status) => {
        this.setState({
            show: true,
            holiday: atten.holiday_title,
            leave: atten.leave_title,
            employee_name: name,
            check_in: atten.check_in,
            check_out: atten.check_out,
            status: status,
            attenIndex: aIndex,
            employeeIndex: eIndex
        })
    }

    hide() {
        this.setState({
            show: false,
            employee_name: '',
            holiday: '',
            leave: '',
            employeeIndex: 0,
            attenIndex: 0,
            time: '',
            check_in: '00:00:00',
            check_out: '00:00:00'
        })
    }

    hideTime() {
        this.setState({
            showtime: false,
            employee_name: '',
            holiday: '',
            leave: '',
            employeeIndex: 0,
            attenIndex: 0,
            time: '',
            check_in: '00:00:00',
            check_out: '00:00:00'
        })
    }

    hideInOut() {
        this.setState({
            showInOut: false,
            missing_check_in: '00:00:00',
            missing_check_out: '00:00:00'
        })
    }

    handleCheckOut = event => {
        this.setState({ time: event.target.value })
    }

    setCheckOut() {
        var { employee_list, attenIndex, employeeIndex } = this.state;
        var time = this.state.time;
        var attendance = employee_list[employeeIndex].summary.attendance;
        if (this.state.check === 1) {
            attendance[attenIndex].check_in = time;
        } else {
            attendance[attenIndex].check_out = time;
        }
        employee_list[employeeIndex].summary.attendance = attendance;
        this.setClockTime(attendance[attenIndex].attendance_id, time, this.state.check);
        this.setState({
            employee_list: employee_list
        })
    }

    setClockTime(id, time, status) {
        fetch(`${main_url}report/setClockTime/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `time=${JSON.stringify({ time: time, status: status })}`
        })
            .then(res => res.text())
            .then(text => {
                this.hideTime();
            })
    }

    add(index, user_id) {
        var list = this.state.not_check_list;
        var date = this.state.days[index];
        var check = list.filter(l => { return l.date === date && l.user_id === user_id })
        if (check.length > 0) {
            list = list.filter(l => { return l.date !== date && l.user_id !== user_id })

        } else {
            list.push({ date: date, user_id: user_id });
        }
        this.setState({
            not_check_list: list
        })
    }

    checkAttendanceId(index, user_id) {
        var date = this.state.days[index];
        var check = this.state.not_check_list.filter(l => { return l.date === date && l.user_id === user_id })
        if (check.length > 0) return true;
        return false;
    }

    setTime() {
        this.setState({
            showInOut: true
        })
    }

    handleMissingCheckIn = event => {
        this.setState({ missing_check_in: event.target.value })
    }
    handleMissingCheckOut = event => {
        this.setState({ missing_check_out: event.target.value })
    }

    setCheckInOut() {
        var time = {
            check_in: this.state.missing_check_in,
            check_out: this.state.missing_check_out
        }
        fetch(`${main_url}report/setCheckInOut`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `data=${JSON.stringify({ list: this.state.not_check_list, time: time })}`
        })
            .then(res => res.text())
            .then(text => {
                this.hideInOut();
                this.view();
            })
    }
 

    render() {
        var workingDay = moment(moment(this.state.check_out,"HH:mm:ss").utc().diff(moment(this.state.check_in,"HH:mm:ss").utc())).utc().format("hh:mm:ss")
        var branch = this.state.selectedBranch;
        return (
            <div>
                <div className="row wrapper border-bottom white-bg page-heading">
                    <div className="col-lg-12">
                        <h2>HR Management System</h2>
                        <ol className="breadcrumb">
                            <li>
                                Attendance and Leave
                            </li>
                            <li className="active">
                                <a href="#"> Report</a>
                            </li>

                        </ol>
                    </div>
                </div>
                <div className='row border-bottom white-bg dashboard-header'>
                    <div className='row'>
                        <div className='col-sm-3'>
                            <div><label className='col-sm-12'>Select Month</label></div>
                            <div className='col-sm-10'>
                                <DatePicker dateFormat='MM-YYYY' value={this.state.month}
                                    onChange={this.handleChangeDate.bind(this)} timeFormat={false} />
                            </div>
                        </div>
                        <div className='col-sm-3'>
                            <div><label className='col-sm-12'>Select Branch</label></div>
                            <div className='col-sm-10'>
                                <Select value={this.state.selectedBranch} options={this.state.branch}
                                    onChange={this.handleChangeBranch.bind(this)} />
                            </div>
                        </div>
                        <div className='col-sm-3'>
                            <div><label className='col-sm-12'>Select Department</label></div>
                            <div className='col-sm-10'>
                                <Select value={this.state.selectedDept} options={this.state.dept}
                                    onChange={this.handleChangeDept.bind(this)} />
                            </div>
                        </div>
                        <div className='col-sm-3 margin-top-20'>
                            <div className='col-sm-10 '>
                                <button type='button' className='btn btn-primary' onClick={() => this.view()}>View</button>
                                {
                                    this.state.isHR ?
                                        <button type='button' className='btn btn-primary f-right'
                                            disabled={this.state.not_check_list.length > 0 ? false : true}
                                            onClick={() => this.setTime()}>Set Time</button> : ''
                                }

                            </div>
                        </div>
                    </div>
                    <hr></hr>
                    <div className='row mt20'>
                        <div className='col-sm-3'>
                            <p><i className='fas fa-running work-day'></i> Working Day</p>
                        </div>
                        <div className='col-sm-3'>
                            <p><i className='fas fa-check-circle leave'></i> Paid Leave-Approved</p>
                        </div>
                        <div className='col-sm-3'>
                            <p><i class="fas fa-exclamation-triangle unpaid-leave"></i> Attendance Missing</p>
                        </div>
                        <div className='col-sm-3'>
                            <p>PL Paid Leave</p>
                        </div>
                        <div className='col-sm-3'>
                            <p><i className='fas fa-running work'></i> Worked on Holiday</p>
                        </div>
                        <div className='col-sm-3'>
                            <p><i className='far fa-circle leave'></i> Paid Leave-Not Approved</p>
                        </div>
                        <div className='col-sm-3'>
                            <p>WD Working Days</p>
                        </div>
                        <div className='col-sm-3'>
                            <p>UL Unpaid Leave</p>
                        </div>
                        <div className='col-sm-3'>
                            <p><i className='fas fa-running not-check'></i> Missing CheckIn/CheckOut</p>
                        </div>
                    </div>
                    
                    {
                            this.state.formVisible ? (
                          <div>
                             <ReactHTMLTableToExcel  
                                 className="btn btn-info"  
                                 table="leave"  
                                 filename= "Attendance & Leave Report"
                                 sheet="Sheet"  
                                 buttonText="Export excel" /> 
                             
                         </div>):null
                    }
                   

                    <div className='report-loader'>
                        <SyncLoader
                            size={10}
                            color={'#1ab394'}
                            loading={this.state.loading}
                        // loadin={true}
                        />
                    </div>
                    <div className='row table-responsive'>
                        <table id= "leave" className='table table-striped table-hover table-bordered report-table'>
                            <thead className='fixme' >
                                <tr>
                                    <th>All Employees</th>
                                    {
                                        this.state.days.map((d, i) =>
                                            <th key={i}>{moment(d).format('ddd')}</th>)
                                    }
                                    <th className='total'>WD</th>
                                    <th className='total'>PL</th>
                                    <th className='total unpaid_leave'>UL</th>
                                    <th className='last-child'>All Employees</th>
                                </tr>
                                <tr>
                                    <th>Group By</th>
                                    {
                                        this.state.days.map((d, i) =>
                                            <th key={i}>{moment(d).format('DD')}</th>)
                                    }
                                    <th className='total'></th>
                                    <th className='total'></th>
                                    <th className='total unpaid_leave'></th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td colSpan={this.state.days.length + 5} className='title'>
                                        Employee With Leave
                                    </td>
                                </tr>
                                {
                                    this.state.employee_list.map((e, i) =>
                                        <tr key={i}>
                                            <td className='ename'>{e.employee_name}</td>
                                            {
                                                e.summary.attendance.map((d, j) =>
                                                    d.attendance === atten_report.work ?
                                                        <td key={j}>
                                                            <a href='#' onClick={this.showAttendance.bind(this, d, j, e.employee_name, i, 1)}>
                                                                <i className={d.check_in === '00:00:00' || d.check_out === '00:00:00' ? 'fas fa-running not-check': 'fas fa-running work-day'}></i>
                                                                A
                                                            </a>
                                                        </td> :
                                                        d.attendance === atten_report.work_in_pholiday ?
                                                            <td key={j}>
                                                                <a href='#' onClick={this.showAttendance.bind(this, d, j, e.employee_name, i, 1)}>
                                                                    <i className={d.check_in === '00:00:00' || d.check_out === '00:00:00' ? 'fas fa-running not-check' : 'fas fa-running work'}>B</i>
                                                                </a>
                                                            </td> :
                                                            d.attendance === atten_report.work_in_holiday ?
                                                                <td key={j} className='holiday'>
                                                                    <a href='#' onClick={this.showAttendance.bind(this, d, j, e.employee_name, i, 1)}>
                                                                        <i className={d.check_in === '00:00:00' || d.check_out === '00:00:00' ? 'fas fa-running not-check' : 'fas fa-running work'}>H</i>
                                                                    </a>
                                                                </td> :
                                                                d.attendance === atten_report.holiday ?
                                                                    <td key={j} className='holiday'>
                                                                        <a href='#' onClick={this.showAttendance.bind(this, d, j, e.employee_name, i, 2)}>
                                                                            <i className='fas fa-calendar-times holiday-color'></i>
                                                                        </a>
                                                                    </td> :
                                                                    d.attendance === atten_report.pholiday ?
                                                                        <td key={j}></td> :
                                                                        d.attendance === atten_report.approve_leave ?
                                                                            <td key={j}>
                                                                                <a href='#' onClick={this.showAttendance.bind(this, d, j, e.employee_name, i, 3)}>
                                                                                    <i className='fas fa-check-circle leave'></i>
                                                                                </a>
                                                                            </td> :
                                                                            d.attendance === atten_report.not_approve_leave ?
                                                                                <td key={j}>
                                                                                    <a href='#' onClick={this.showAttendance.bind(this, d, j, e.employee_name, i, 3)}>
                                                                                        <i className='far fa-circle leave'></i>
                                                                                    </a>
                                                                                </td> :
                                                                                d.attendance === atten_report.absent ?
                                                                                    <td key={j} className={this.checkAttendanceId(j, e.user_id) ? 'add-check' : ''}>
                                                                                        <a onClick={() => this.add(j, e.user_id)}>
                                                                                            <i class="fas fa-exclamation-triangle unpaid-leave"></i>
                                                                                            !
                                                                                        </a>
                                                                                    </td> : <td></td>

                                                )
                                            }
                                            <td className='total'>{e.summary.work_count}</td>
                                            <td className='total'>{e.summary.leave_count}</td>
                                            <td className='total unpaid_leave'>{e.summary.unpaid_leave_count}</td>
                                            <td className='ename'>{e.employee_name}</td>
                                        </tr>
                                    )
                                }

                            </tbody>
                        </table>

                    </div>
                </div>
                 {
                    this.state.status === 1 ?
                    
                        <Rodal width={400} height={210} visible={this.state.show} onClose={this.hide.bind(this)}>
                            <div className='col-sm-12'>Attendance Time</div>
                            <hr />
                            <div className='col-md-12'>
                                <div className='row' style ={{padding:'2px'}}>
                                    <div className='col-sm-6'>Employee Name: </div>
                                    <div className='col-sm-6'>{this.state.employee_name}</div>
                                </div>
                                <div className='row' style ={{padding:'2px'}}>
                                    <div className='col-sm-6'>Location: </div>
                                    <div className='col-sm-6'>{branch.label}</div>
                                </div>
                                <div className='row' style ={{padding:'2px'}}>
                                    <div className='col-sm-6'>Date: </div>
                                    <div className='col-sm-6'>{this.state.days[this.state.attenIndex]}</div>
                                </div>
                                <div className='row' style ={{padding:'2px'}}>
                                    <div className='col-sm-6'>Check-In Time: </div>
                                    <div className='col-sm-6'>
                                        {
                                            this.state.check_in === '00:00:00' && this.state.isHR ?
                                         
                                            <a href='#' id='check-in' className='not-check'>{this.state.check_in}</a> : this.state.check_in
                                        
                                        }
                                    </div>
                                </div>
                                <div className='row' style ={{padding:'2px'}}>
                                    <div className='col-sm-6'>Check-Out Time: </div>
                                    <div className='col-sm-6'>
                                        {
                                            this.state.check_out === '00:00:00' && this.state.isHR ?
                                                <a href='#' id='check-out' className='not-check'>{this.state.check_out}</a> : this.state.check_out
                                        }
                                    </div>
                                </div>
                                <div className='row' style ={{padding:'2px'}}>
                                    <div className='col-sm-6'>Total Working Hour: </div>
                                    <div className='col-sm-6'>
                                        {
                                            this.state.check_out === '00:00:00' && this.state.isHR ?
                                                <a href='#' id='working-day' className='working-day'>{workingDay}</a> : workingDay
                                        }
                                    </div>
                                </div>

                            </div>
                        </Rodal>
                        : this.state.status === 2 ?

                            <Rodal width={400} height={100} visible={this.state.show} onClose={this.hide.bind(this)}>
                                <div className='col-sm-12'>Holiday</div>
                                <hr />
                                <div className='col-sm-12'>
                                    <div className='row'>
                                        <p> {this.state.days[this.state.attenIndex]} is {this.state.holiday}.</p>
                                    </div>
                                </div>

                            </Rodal> :
                            <Rodal width={400} height={100} visible={this.state.show} onClose={this.hide.bind(this)}>
                                <div className='col-sm-12'>Leave</div>
                                <hr />
                                <div className='col-sm-12'>
                                    <div className='row'>
                                        <p> {this.state.employee_name} leaved on {this.state.days[this.state.attenIndex]} as {this.state.leave}.</p>
                                    </div>
                                </div>

                            </Rodal>
                }

                <Rodal width={400} height={120} visible={this.state.showtime} onClose={this.hideTime.bind(this)}>
                    <div className='col-sm-12'>Set Time</div>
                    <hr />
                    <div className='col-sm-12'>
                        <div className='row'>
                            <div className='col-sm-4'>Time: </div>
                            <div className='col-sm-6'><input type='time' value={this.state.time} onChange={this.handleCheckOut.bind(this)}></input></div>
                            <div className='col-sm-2'><button type='button' className='btn btn-primary' onClick={() => this.setCheckOut()}>Set</button></div>
                        </div>

//                     </div>

                </Rodal>

                <Rodal width={400} height={150} visible={this.state.showInOut} onClose={this.hideInOut.bind(this)}>
                    <div className='col-sm-12'>Set Time</div>
                    <hr />
                    <div className='col-sm-12'>
                        <div className='row'>
                            <div className='col-sm-4'>Check In: </div>
                            <div className='col-sm-6'><input type='time' onChange={this.handleMissingCheckIn.bind(this)}></input></div>
                        </div>
                        <div className='row mt20'>
                            <div className='col-sm-4'>Check Out: </div>
                            <div className='col-sm-6'><input type='time' onChange={this.handleMissingCheckOut.bind(this)}></input></div>
                            <div className='col-sm-2'><button type='button' className='btn btn-primary' onClick={() => this.setCheckInOut()}>Set</button></div>
                        </div>

                    </div>

                </Rodal>
            </div >
        )
    }
}
