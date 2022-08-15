import React,{Component} from "react";
import {main_url} from '../../utils/CommonFunction';
import DatePicker from 'react-datetime';
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import 'datatables.net-responsive-bs4/css/responsive.bootstrap4.min.css';
import 'datatables.net-dt/css/jquery.dataTables.css'
import 'datatables.net-buttons-dt/css/buttons.dataTables.css';
import 'jspdf-autotable';
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
            // branch:[],
            // region:[],
            // department:[],
            // branchId:null,
            // regionId:null,
            // departmentId:null,
            // from_date:moment(),
            // to_date:moment() 
        }
    }
    
    async componentDidMount (){
        this.$el = $(this.el);
        this.setState(
          {
            dataSource: this.props.data,
    
          },
          () => {
            this._setTableData(this.state.dataSource);
          }
        );
    }
    _setTableData = (data) => { 
        var table;
        var l = [];
        if (data){
        // for (var i = 0; i < data.length; i++) {
        //     let result = data[i];
        //     let obj = [];
        //         obj = {
        //         designation:data[i].designations ? data[i].designations : "-",
        //         location:data[i].location ? data[i].location : "-",
        //         department:data[i].deptname ? data[i].deptname : "-",
        //         level:data[i].career_level ? data[i].career_level : "-",
        //         employed_date:data[i].employed_date ? data[i].employed_date : "-",
        //         salary:data[i].salary ? data[i].salary : "-",
        //     }
            
        //     l.push(obj)
        // }
        }
        if ($.fn.dataTable.isDataTable('#dataTables-table')) {
            table = $('#dataTables-table').dataTable();
            table.fnClearTable();
            table.fnDestroy();
            $('#dataTables-table').empty();
        }
        var column = [
            { title: "Designation", data: "no" },
            { title: "Location", data: "location" },
            { title: "Department", data: "employee_epartment" },
            { title: "Level", data: "level" },
            { title: "Employed Date/Promotion Date", data: "employed_date" },
            { title: "Salary", data: "branch" },
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
   
  
        render(){
          
        return (
            <div>
            <div >
              <div className='white-bg ' style={{ paddingTop: 20, border: '1px solid lightgrey', display: 'grid', borderTop: 'none', marginTop: -10, paddingBottom: 20, boxShadow: '5px 5px 5px lightgrey' }}>
                           <h3 style={{textAlign:'center'}}>Employee History</h3>
                            <div style={{paddingLeft:45}}>
                             <div style={{ border: '1px solid grey', width: 140, height: 120, borderStyle: 'dashed' }}>
                                 <img src="" alt="" style={{ width: 140, height: 120, objectFit: 'contain' }} />
                             </div></div>
                             <div className="col-lg-12">
                             <div className='col-lg-6 col-md-6 col-sm-6' style={{}}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 15,textAlign:"start" }}>
                        <div className='col-lg-5 col-md-5 col-sm-5'>
                                Employee ID
                            </div>
                            <div className='col-lg-2 col-md-2 col-sm-2'>
                                :
                            </div>
                            <div className='col-lg-5 col-md-5 col-sm-5'>BaLa</div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 15,textAlign:"start" }}>
                        <div className='col-lg-5 col-md-5 col-sm-5'>
                                Employee Name
                            </div>
                            <div className='col-lg-2 col-md-2 col-sm-2'>
                                :
                            </div>
                            <div className='col-lg-5 col-md-5 col-sm-5'>BaLa</div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 15 }}>
                        <div className='col-lg-5 col-md-5 col-sm-5'>
                                Address
                            </div>
                            <div className='col-lg-2 col-md-2 col-sm-2'>
                                :
                            </div>
                            <div className='col-lg-5 col-md-5 col-sm-5'>BaLa</div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 15 }}>
                        <div className='col-lg-5 col-md-5 col-sm-5'>
                                Phone No
                            </div>
                            <div className='col-lg-2 col-md-2 col-sm-2'>
                                :
                            </div>
                            <div className='col-lg-5 col-md-5 col-sm-5'>BaLa</div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 15 }}>
                        <div className='col-lg-5 col-md-5 col-sm-5'>
                                Join Date
                            </div>
                           <div className='col-lg-2 col-md-2 col-sm-2'>
                                :
                            </div>
                            <div className='col-lg-5 col-md-5 col-sm-5'>BaLa</div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 15 }}>
                        <div className='col-lg-5 col-md-5 col-sm-5'>
                               Service Year
                            </div>
                           <div className='col-lg-2 col-md-2 col-sm-2'>
                                :
                            </div>
                            <div className='col-lg-5 col-md-5 col-sm-5'>BaLa</div>
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
                            <div className='col-lg-5 col-md-5 col-sm-5'>BaLa</div>
                        </div><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 15 }}>
                        <div className='col-lg-5 col-md-5 col-sm-5'>
                                Designation
                            </div>
                           <div className='col-lg-2 col-md-2 col-sm-2'>
                                :
                            </div>
                            <div className='col-lg-5 col-md-5 col-sm-5'>BaLa</div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 15 }}>
                        <div className='col-lg-5 col-md-5 col-sm-5'>
                                Location
                            </div>
                           <div className='col-lg-2 col-md-2 col-sm-2'>
                                :
                            </div>
                            <div className='col-lg-5 col-md-5 col-sm-5'>BaLa</div>
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
                        <div className='col-lg-5 col-md-5 col-sm-5'>
                                Resign Status
                            </div>
                           <div className='col-lg-2 col-md-2 col-sm-2'>
                                :
                            </div>
                            <div className='col-lg-5 col-md-5 col-sm-5'>BaLa</div>
                        </div>
                    </div>

                    </div>
             </div>
           </div>
           <div className='white-bg ' style={{ paddingTop: 20, border: '1px solid lightgrey', display: 'grid', borderTop: 'none', marginTop: -10, paddingBottom: 20, boxShadow: '5px 5px 5px lightgrey' }}>
            <table width="99%"
                    className="table table-striped table-bordered table-hover table-responsive nowrap dt-responsive"
                    id="dataTables-table"
                /></div>
           </div>
        )
    }
}
    export default HistoryReport;