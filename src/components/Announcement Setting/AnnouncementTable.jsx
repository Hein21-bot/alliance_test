import React, { Component } from 'react';
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import 'datatables.net-responsive-bs4/css/responsive.bootstrap4.min.css';
import 'datatables.net-dt/css/jquery.dataTables.css'
import 'datatables.net-buttons-dt/css/buttons.dataTables.css';
import 'jspdf-autotable';
import * as jsPDF from 'jspdf';
import { getMainRole,fno, getUserId ,main_url,getCookieData} from "../../utils/CommonFunction";
import moment from 'moment';
const $ = require('jquery');
const jzip = require('jzip');
window.JSZip = jzip;
$.DataTable = require('datatables.net-bs4');
$.DataTable = require('datatables.net-responsive-bs4');
$.DataTable = require('datatables.net');
require('datatables.net-buttons/js/dataTables.buttons.min');
require('datatables.net-buttons/js/buttons.html5.min');

export default class AnnouncemetTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user_info: getCookieData("user_info"),
            dataSource: this.props.data,
            user_id: getUserId("user_info"),
            is_main_role: getMainRole()
        }
    }
    async componentDidMount() {
        this._setTableData(this.state.dataSource)
        var that = this;
        $("#dataTables-table").on('click', '#toView', function () {

            var data = $(this).find("#view").text();
            data = $.parseJSON(data);
            that.getViewData(data.announcement_id);

        });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.data !== this.props.data) {
            this.setState({
                dataSource: this.props.data
            }, () => {
                this._setTableData(this.state.dataSource);

            })
        }
    }

    getViewData(AnnounceId) {
        fetch(main_url + "announcement/getAnnouncementViewData/" + AnnounceId)
            .then(response => {
                if (response.ok) return response.json()
            })
            .then(res => {
                this.props.goToAnnouncementView(res);
            })
            .catch(error => console.error(`Fetch Error =\n`, error));

    }

    _setTableData = (data) => {
        var table;
        var l = [];
        for (var i = 0; i < data.length; i++) {
            let result = data[i];
            let obj = [];
           
            obj = {
                no: i + 1,
                form_no: fno.fno_announce + data[i].form_no,
                title: data[i].title,
                branch: data[i].target_branch,
                startDate: moment(result.start_date).format('DD-MM-YYYY'),
                endDate: moment(result.end_date).format('DD-MM-YYYY'),
                action:
                    '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toView" ><span id="view" class="hidden" >' + JSON.stringify(result) + '</span>  <i className="fa fa-cogs"></i>&nbsp;View</button>' 
            }               
            l.push(obj)

        }
       
        if ($.fn.dataTable.isDataTable('#dataTables-table')) {
            table = $('#dataTables-table').dataTable();
            table.fnClearTable();
            table.fnDestroy();
            $('#dataTables-table').empty();
        }
        
        table = $("#dataTables-table").dataTable({
                    autofill: true,
                    bLengthChange: false,
                    bInfo: false,
                    pageLength: 50,
                    responsive: true,
                    paging: true,
                    buttons: true,
                       dom: 'Bfrtip',
                    buttons: [
                        'copy', 'csv', 'excel', 'pdf'
                    ],
        
                    data: l,
                    columns :  [
                        { title: "No", data: "no" },
                        { title: "Form No", data: "form_no" },
                        { title: "Title Name", data: "title" },
                        { title: "Target Branch", data: "branch" },
                        { title: "Start Date", data: "startDate" },
                        { title: "End Date", data: "endDate" },
                        { title: "Action", data: "action" }
                        
                    ]
             
                });
    
}
    render() {
         return (
            <div>
                <div className="row border-bottom white-bg dashboard-header">
                <div className="row">
                <div className="col-md-12">
                <table width="99%"
                    className="table table-striped table-bordered table-hover table-responsive nowrap dt-responsive"
                    id="dataTables-table"
                />
            </div>
            </div>
            </div >
        </div>
        )
    }
}