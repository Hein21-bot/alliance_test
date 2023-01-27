import React, { Component } from 'react';
const $ = require("jquery");
const jzip = require("jzip");
window.JSZip = jzip;
$.DataTable = require("datatables.net-bs4");
$.DataTable = require("datatables.net-responsive-bs4");
$.DataTable = require("datatables.net");
require("datatables.net-buttons/js/dataTables.buttons.min");
require("datatables.net-buttons/js/buttons.html5.min");


class LoanSettlement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data:[]
        }
  }
  
  componentDidMount(){
    this.setState({
        data:this.props.dataSource
    },()=>{
        this._setTableData(this.state.data)
    })
}
        _setTableData = (data) => {
            console.log("data=====>", data)
            var table;
            var l = [];
            var status;
            for (var i = 0; i < data.length; i++) {
              let result = data[i];
              let obj = [];
            
              obj = {
                no: i + 1,
                month: data[i].month ? data[i].month :'-',
                month: data[i].month ? data[i].month :'-',
                month: data[i].month ? data[i].month :'-',
              };
              l.push(obj);}
              
            if ($.fn.dataTable.isDataTable("#dataTables-table")) {
              table = $("#dataTables-table").dataTable();
              table.fnClearTable();
              table.fnDestroy();
              $("#dataTables-table").empty();
            }
        
            var column = [
              { title: "No", data: "no" },
              { title: "Month", data: "month" },
              { title: "Employee Id", data: "employee_id" },
              { title: "Employee Name", data: "employee_name" },
            
            ];
            table = $("#dataTables-table").DataTable({
              autofill: true,
              searching:false,
              bLengthChange: false,
              bInfo: false,
              responsive: true,
              pageLength: 50,
              paging: false,
              // buttons: true,
              dom: "Bfrtip",
              // buttons: [
              //     'copy', 'csv', 'excel', 'pdf'
              // ],
              buttons: [
                // "copy",
                // {
                //   extend: "csvHtml5",
                //   title: "Child Benefit",
                // },
                // {
                //   extend: "excelHtml5",
                //   title: "Staff Loan",
                // },
                // {
                //   extend: "pdfHtml5",
                //   title: "Child Benefit",
                // },
              ],
              data: l,
              columns: column,
            });
          };
    
    render(){ console.log(this.props.dataSource);
        return(
            <div style={{display:'flex',justifyContent:'center'}}>
            <div className='col-lg-6 col-md-8 col-sm-12' style={{ background: 'white',marginTop:30,border:"1px solid grey " }}>
   
            <div className="" style={{display:'flex',justifyContent:'center', background: '#1872ab',marginTop:20}}><h2 style={{color:"white",marginTop:10,fontSize:18,fontWeight:"bold"}}>Loan Settlement</h2>
            </div>
           <div className='col-lg-12' style={{paddingTop:'20px'}}>
           <div><div className='col-lg-6 col-md-6'><p>Requester Name</p></div><div className='col-lg-1 col-md-1' style={{padding:0}}><p>:</p></div><div className=' col-lg-5 col-md-5'><p>{this.state.data.fullname ? this.state.data.fullname :'-'}</p><div></div></div></div>
           <div><div className='col-lg-6 col-md-6'><p>Loan Disbrusement Date</p></div><div className='col-lg-1 col-md-1'style={{padding:0}}><p>:</p></div><div className=' col-lg-5 col-md-5'><p>{this.state.data.disbursement_date ? this.state.data.disbursement_date :'-'}</p><div></div></div></div>
           <div><div className='col-lg-6 col-md-6'><p>Loan Approve Amount</p></div><div className='col-lg-1 col-md-1'style={{padding:0}}><p>:</p></div><div className=' col-lg-5 col-md-5'><p>{this.state.data.approved_amount ? this.state.data.approved_amount :'-'}</p><div></div></div></div>
           <div><div className='col-lg-6 col-md-6'><p>Term in Month</p></div><div className='col-lg-1 col-md-1'style={{padding:0}}><p>:</p></div><div className=' col-lg-5 col-md-5'><p>{this.state.data.term_in_month ? this.state.data.term_in_month :'-'}</p><div></div></div></div>
           <div><div className='col-lg-6 col-md-6'><p>Monthly Installment Amount</p></div><div className='col-lg-1 col-md-1'style={{padding:0}}><p>:</p></div><div className=' col-lg-5 col-md-5'><p>{this.state.data.term_in_month ? this.state.data.term_in_month :'-'}</p><div></div></div></div>
           </div>
           <table
          width="99%"
          className="table table-striped table-bordered table-hover table-responsive nowrap dt-responsive"
          id="dataTables-table"
        />
           </div>
             </div>
        )
    }
} 
export default LoanSettlement;
