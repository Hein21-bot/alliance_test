import React, { Component } from 'react';
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import 'datatables.net-responsive-bs4/css/responsive.bootstrap4.min.css';
import 'datatables.net-dt/css/jquery.dataTables.css'
import 'datatables.net-buttons-dt/css/buttons.dataTables.css'
import DatePicker from 'react-datetime';
import Select from 'react-select';
import moment, { months } from 'moment';
// import { main_url, getUserId, getMainRole, getTicketStatus, getFirstDayOfMonth } from '../../utils/CommonFunction';
import { main_url, getUserId, getMainRole, getTicketStatus, getFirstDayOfMonth, getBranch, getDepartment, calculationDate,calculationDate1,calculationDate2, getTicketMainCategory } from '../../utils/CommonFunction';
import { duration } from 'moment';
import { format } from 'crypto-js';
// window.JSZip = jzip;
const $ = require('jquery');
$.DataTable = require('datatables.net-bs4');
$.DataTable = require('datatables.net-responsive-bs4');
$.DataTable = require('datatables.net');

// const jzip = require('jzip');
require('datatables.net-buttons/js/dataTables.buttons.min');
require('datatables.net-buttons/js/buttons.html5.min');

export default class HelpDeskTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: this.props.data,
            user_id: getUserId("user_info"),
            ticket_status: [],
            selected_ticket_status: [],
            is_main_role: getMainRole(),
            s_date: moment(getFirstDayOfMonth()),
            e_date: moment(),
            main_category: [],
            selected_main_category: [],
            calc_date:null
        }
    }
    async componentDidMount() {
        let main_category = await getTicketMainCategory()
        let ticket_status = await getTicketStatus();
        
        let branch = await getBranch();
        let dept = await getDepartment();
        main_category.unshift({ label: 'All', value: 0 })
        ticket_status.unshift({ label: 'All', value: 0 })
        this.search();
        this.setState({ main_category: main_category, selected_main_category: main_category[0] })
        this.setState({ ticket_status: ticket_status, selected_ticket_status: ticket_status[0], branch: branch, department: dept })
        let that = this
        $("#dataTables-table").on('click', '#toView', function () {

            var data = $(this).find("#view").text();
            data = $.parseJSON(data);

            that._getHelpDeskViewData(data.helpDesk_ticket_id)

        });

        $("#dataTables-table").on('click', '#toEdit', function () {

            var data = $(this).find("#edit").text();
            data = $.parseJSON(data);
            that._getHelpDeskEditData(data.helpDesk_ticket_id)

        });
        // that.setState({
        //     main_category: main_category
        // })

    }
    // async getDay(date) {
    //     let today = new Date(date);
    //     let firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    //     let lastDayOfPreviousMonth = new Date(firstDayOfMonth - 1);
    //     return moment(lastDayOfPreviousMonth).format('DD')
    // }

    // async calculationDate(startDate, endDate) {
    //     const date1 = new Date(startDate);
    //     const date2 = new Date(endDate);
    
    //     const moment1 = moment(date1);
    //     const moment2 = moment(date2);
    
    //     const diffInMs = Math.abs(date2 - date1);
    //     const noOfDays = diffInMs / (1000 * 60 * 60 * 24)
    
    //     const years = moment2.diff(moment1, 'years');
    //     let months = moment2.diff(moment1, 'months') % 12;
    //     let days = date2.getDate() - date1.getDate();
    //     if (days < 0) {
    //         let dayCon = await this.getDay(date2)
    //         days = days + parseInt(dayCon)
    //         months = months - 1
    //     }
    
    
    //     let formatMonth = Math.ceil(noOfDays / 30)
    
    //     let formatYear = years == 0 ? months + ' months ' + days + ' days ' : years + ' years ' + months + ' months ' + days + ' days '
    //     this.setState({
    //         calc_date:formatYear
    //     },()=>{
    //         console.log("format year=====>",formatYear)
    //         console.log("return data",this.state.calc_date)
    //     })
        
    //     let returnData = [formatYear, formatMonth]
        
        
    //     // let returnData = [formatYear, years == 0 ? months : formatMonth]
    //     return formatYear;
    // }

    handleStartDate = (event) => {
        this.setState({
            s_date: event
        });
    };

    handleEndDate = (event) => {
        this.setState({
            e_date: event
        });
    };

    handleTicketStatus = (event) => {
        this.setState({
            selected_ticket_status: event
        })
    }

    handleTicketMainCategory = (event) => {
        this.setState({
            selected_main_category: event
        })
    }


    _getHelpDeskViewData(ticketId) {
        fetch(main_url + "helpDesk/getHelpDeskViewData/" + ticketId)
            .then(response => {
                if (response.ok) return response.json()
            })
            .then(res => {

                if (res) {

                    this.props.goToHelpDeskView(res);
                }
            })
            .catch(error => console.error(`Fetch Error =\n`, error));

    }
    _getHelpDeskEditData(ticketId) {

        fetch(main_url + "helpDesk/getHelpDeskViewData/" + ticketId)
            .then(response => {
                if (response.ok) return response.json()
            })
            .then(res => {

                if (res) {
                    this.props.goToHelpDeskEdit(res);
                }
            })
            .catch(error => console.error(`Fetch Error =\n`, error));
    }
    getAllHelpDeskData(s_date, e_date, status, main_category) {
        let id = this.state.user_id;
        fetch(`${main_url}helpDesk/getALLHelpDeskData/${id}/${s_date}/${e_date}/${status}/${main_category}`)
            .then(response => {
                if (response.ok) return response.json()
            })
            .then(res => {
                if (res) {
                    this.setState({ dataSource: res }, () => this._setTableData(res))

                }
            })
            .catch(error => console.error(`Fetch Error =\n`, error));
    }

    // getDataWithTicketStatus(data, status) {
    //     let list = data.filter(function (d) { return d.tick_status_id === status.value });
    //     return list;
    // }



    getDepartmentName(deptID) {

        let data = this.state.department
        let result = data.filter(d =>
            d.value === deptID
        ).map(n => (
            n.label
        ))
        return result.toString();


    }

    getBranchName(branchID) {
        let data = this.state.branch
        let result = data.filter(d =>
            d.value == branchID
        ).map(n => (
            n.label
        ))
        return result.toString();
    }

    _setTableData = async (data) => {
        var table;
        var l = [];
        let ticket_status = '';
        for (var i = 0; i < data.length; i++) {
            let result = data[i]
            
            let obj = [];
            var now = moment(result.createdAt).format('YYYY-MM-DD')
            var then =result.resolve_time ? moment(result.resolve_time).format('YYYY-MM-DD') : null
            let date1 = moment(now);
                let date2 = moment(then);

                let diffDuration = moment.duration(date2.diff(date1));

                let years = diffDuration.years();
                let months = diffDuration.months();
                let days = diffDuration.days();
            

            // console.log(`${years} years, ${months} months, and ${days} days`);
            console.log("condition",isNaN(days) && isNaN(months) && isNaN(years) ?  '-' : years+'years,'+months+'months, and '+days+'days');
            if(now !=null && then !=null){
                
                // console.log("calculation",now,then,calculationDate2(now,then).then((r)=>console.log("r=======>",r)),this.state.calc_date)
                // let temp='';
                // let diffDate=await calculationDate2(now,then)
                // let diffDate=then - now;
                // console.log("br nyar",diffDate);
                
                this.setState({
                    calc_date:years+'years, '+months+'months, and '+days+'days'
                },()=>{
                    console.log("after state",this.state.calc_date)
                })

                
                
            }else{
                this.setState({
                    calc_date:null
                })
            }
            // console.log("calc_date========>",this.state.calc_date)
            var diffTime = moment.utc(moment(then, "DD-MM-YYYY HH:mm:ss").diff(moment(now, "DD-MM-YYYY HH:mm:ss"))).format("HH:mm:ss")
            if (result.ticket_status === 'Open') {
                ticket_status = '<small class="label label-warning" style="background-color:red"> Open </small>'

            }
            else if (result.ticket_status === 'Closed') {
                ticket_status = '<small class="label label-warning" style="background-color:green"> Closed </small>'
            }
            else if (result.ticket_status === 'Need more info') {
                ticket_status = '<small class="label label-warning" style="background-color:#e67300"> Need more info </small>'
            }

            else {
                ticket_status = '<small class="label label-warning" style="background-color:orange"> ' + result.ticket_status + '</small>'
            }
            obj = {

                no: i + 1,
                user: data[i].fullname,
                ticket_id:data[i].helpDesk_ticket_id,
                //ticketCode: data[i].ticketCode,
                ticket_name: data[i].ticket_name,
                priority: data[i].priority,
                mainCategory: data[i].category_name,
                sub_category: data[i].sub_category_name,
                ticket_description: data[i].ticket_desc,
                assign_department: this.getDepartmentName(data[i].departmentId),
                assign_branch: this.getBranchName(data[i].branchId),
                assign_person: data[i].assign_person_name,
                req_comment: data[i].request_comment,
                request_date: moment(result.createdAt).utc().format('DD-MM-YYYY hh:mm a'),//moment(result.createdAt).format('YYYY-MM-DD HH:mm:ss'),
                response_date: moment(result.updatedAt).utc().format('DD-MM-YYYY hh:mm a'),
                resolve_person:result.resolve_user_id ? result.resolve_user_id : '-',
                resolve_date:result.resolve_time ? moment(result.resolve_time).format('YYYY-MM-DD') : '-',
                calculation_time: isNaN(days) && isNaN(months) && isNaN(years) ?  '-' : years+'years,'+months+'months, and '+days+'days',
                ticketStatus: ticket_status,
                action_status: result.action_status === 1 ? 'Accept' : result.action_status === 2 ? 'Reject' : 'Request',
                action:result.action_status === 2 ? '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toView" ><span id="view" class="hidden" >' + JSON.stringify(result) + '</span>  <i className="fa fa-cogs"></i>&nbsp;View</button>' :
                    '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toView" ><span id="view" class="hidden" >' + JSON.stringify(result) + '</span>  <i className="fa fa-cogs"></i>&nbsp;View</button>' +
                    '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toEdit" ><span id="edit" class="hidden" >' + JSON.stringify(result) + '</span>  <i className="fa fa-cogs"></i>&nbsp;Edit</button>'
                ,

            }
            l.push(obj)
        }

        if ($.fn.dataTable.isDataTable('#dataTables-table')) {
            table = $('#dataTables-table').dataTable();
            table.fnClearTable();
            table.fnDestroy();
            $('#dataTables-table').empty()
        }

        table = $("#dataTables-table").DataTable({

            autofill: true,
            bLengthChange: false,
            bInfo: false,
            responsive: true,
            paging: true,
            pageLength: 50,
            dom: 'Bfrtip',
            // buttons: [
            //     'copy', 'csv', 'excel', 'pdf'
            // ],
            buttons: [
                'copy', 'csv',
                {
                    extend: 'excelHtml5',
                    exportOptions: {
                        columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
                    }
                },
                'pdf',

            ],

            data: l,
            columns: [
                { title: "No", data: "no" },
                {
                    title:"Ticket ID",data:"ticket_id"
                },
                { title: "User", data: "user" },
                
                // { title: "Ticket Code", data: "ticketCode" },
                { title: "Ticket Name", data: "ticket_name" },
                { title: "Priority", data: "priority" },
                { title: "Main Category", data: "mainCategory" },
                { title: "Sub Category", data: "sub_category" },
                { title: "Ticket Status", data: "ticketStatus" },
                { title: "Action ", data: 'action_status' },
                { title: "Ticket Description", data: "ticket_description" },
                { title: "Assignment Department", data: "assign_department" },
                { title: "Assignment Branch", data: "assign_branch" },
                { title: "Assign Person", data: "assign_person" },
                { title: "Comment", data: "req_comment" },
                { title: "Request Date", data: "request_date" },
                { title: "Response Date", data: "response_date" },
                { title: "Resolve Person", data: "resolve_person" },
                { title: "Resolve Date", data: "resolve_date" },
                { title: "Calculation Time", data: "calculation_time" },
                { title: "Action", data: "action" },
            ],
        });
    }

    search() {
        let data = this.state.dataSource;
        let s_date = moment(this.state.s_date).format('YYYY-MM-DD');
        let e_date = moment(this.state.e_date).format('YYYY-MM-DD');
        let t_status = this.state.selected_ticket_status;
        let status = !Array.isArray(t_status) ? t_status.value : 0;
        let m_category = this.state.selected_main_category
        let category = !Array.isArray(m_category) ? m_category.value : 0;
        this.getAllHelpDeskData(s_date, e_date, status, category);
        // if (status > 0) {
        //     data = data.filter(d => { return d.createdAt >= s_date && d.createdAt <= e_date && t_status === d.ticket_status_id })
        // } else {
        //     data = data.filter(d => { return d.createdAt >= s_date && d.createdAt <= e_date })
        // }
        this._setTableData(data);
    }

    render() {
       console.log("calc_date======>",this.state.calc_date)
        return (
            <div>
                <div className="row border-bottom white-bg dashboard-header">
                    <div className="row">
                        <div className='col-md-10'>
                        <div className="col-md-3">
                            <div><label className="col-sm-12">Start Date</label></div>
                            <div className="col-md-12">
                                <DatePicker
                                    dateFormat="DD/MM/YYYY"
                                    value={this.state.s_date}
                                    onChange={this.handleStartDate}
                                    timeFormat={false}
                                />
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div><label className="col-sm-12">End Date</label></div>
                            <div className="col-md-12">
                                <DatePicker
                                    dateFormat="DD/MM/YYYY"
                                    value={this.state.e_date}
                                    onChange={this.handleEndDate}
                                    timeFormat={false}
                                />
                            </div>
                        </div>

                        <div className="col-md-3">
                            <div><label className="col-sm-12">Ticket Status</label></div>
                            <div className="col-md-12" style={{alignSelf: 'center'}}>
                                <Select
                                    options={this.state.ticket_status}
                                    value={this.state.selected_ticket_status}
                                    onChange={this.handleTicketStatus}
                                />
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div><label className="col-sm-12">Ticket Main Category</label></div>
                            <div className="col-md-12" style={{alignSelf: 'center'}}>
                                <Select
                                    options={this.state.main_category}
                                    value={this.state.selected_main_category}
                                    onChange={this.handleTicketMainCategory}
                                />
                            </div>
                        </div>
                        </div>
                        <div className='col-md-2'>
                        <div className="col-md-12">
                            <div className="col-md-12 margin-top-20">
                                <button type='button' className='btn btn-primary' onClick={this.search.bind(this)} >Search</button>
                            </div>
                        </div>
                        </div>
                        
                       
                    </div>
                    <hr />
                    <div className="row">
                        <div className="col-md-12">
                            <table width="99%"
                                className="table table-striped table-bordered table-hover responsive nowrap dt-responsive"
                                id="dataTables-table"
                            />
                        </div>
                    </div>
                </div>
            </div >
        )
    }
}
