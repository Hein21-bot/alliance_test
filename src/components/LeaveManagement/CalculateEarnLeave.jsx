import React, { Component } from 'react';
import { main_url, getFirstDayOfMonth } from '../../utils/CommonFunction';
import moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';
import DatePicker from 'react-datetime';
import $ from 'jquery';

// var pagination = 0;
const length = 50;
export default class CalculateEarnLeave extends Component {

    constructor(props) {
        super(props);
        this.state = {
            balance: [],
            year: moment(getFirstDayOfMonth()),
            loading: false
        }
    }



    getLeaveBalance() {
        let year = moment(this.state.year).format('YYYY');
        this.setState({ loading: true });
        let status = 0;
        fetch(`${main_url}leave/calculateEarnLeave/${year}`)
            .then(res => res.json())
            .then(data => {
                this.setState({ loading: false })
                this._setTableData(data);
            }).catch(error => {
                this.setState({ loading: false })
                toast.error("already calculate");
            });

    }

    handleYear = (event) => {
        this.setState({
            year: event,
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
                leave_balance_days: result.leave_balance_days,
                leave_balance_year: result.leave_balance_year
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
            { title: "Leave Balance", data: "leave_balance_days" },
            { title: "Years", data: "leave_balance_year" }

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
                    <ToastContainer
                        position="top-right"
                        autoClose={15000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                    />
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
                                    <button type="button" className="btn btn-primary" onClick={this.getLeaveBalance.bind(this)} >Calcuate</button>
                                </div>
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