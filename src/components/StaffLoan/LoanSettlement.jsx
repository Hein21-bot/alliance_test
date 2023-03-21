import React, { Component } from 'react';
import moment from "moment";
import {getNumberWithCommas} from '../../utils/CommonFunction'
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
        this._setTableData(this.state.data[0].data)
    })
}
        _setTableData = (data) => {
            var table;
            var l = [];
            var status;
            if(data != undefined){
            for (var i = 0; i < data.length; i++) {
              let result = data[i];
              let obj = [];
            
              obj = {
                no: i + 1,
                month: data[i].month ? data[i].month :'-',
                monthlyinstall: data[i].monthly_installment ? getNumberWithCommas(data[i].monthly_installment) :'-',
                loanbalance: data[i].loanBalance ? getNumberWithCommas(data[i].loanBalance) :'-',
              };
              l.push(obj);}
            }
              
            if ($.fn.dataTable.isDataTable("#dataTables-table")) {
              table = $("#dataTables-table").dataTable();
              table.fnClearTable();
              table.fnDestroy();
              $("#dataTables-table").empty();
            }
        
            var column = [
              { title: "No", data: "no" },
              { title: "Month", data: "month" },
              { title: "Monthly Installment", data: "monthlyinstall" },
              { title: "Loan Balance", data: "loanbalance" },
            
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
    
    render(){ 
      let temp=this.props.dataSource!=null && this.props.dataSource.length > 0 && this.props.dataSource[0]
      let filterKeyName=Object.keys(temp)
      let filterData=filterKeyName.filter(v=>v == 'data')
      console.log("filter data====<",filterData)
      console.log("filter key name",filterKeyName)
      // console.log("datasource====>",this.props.dataSource!=null && this.props.dataSource.length >0 && this.props.dataSource[0]. );
        return(
            <div style={{display:'flex',justifyContent:'center'}}>
            <div className='col-lg-6 col-md-8 col-sm-12' style={{ background: 'white',marginTop:30,border:"1px solid grey ",marginBottom: "90px" }}>
   
            <div className="" style={{display:'flex',justifyContent:'center', background: '#1872ab',marginTop:20}}><h2 style={{color:"white",marginTop:10,fontSize:18,fontWeight:"bold"}}>Loan Settlement</h2>
            </div>
           <div className='col-lg-12' style={{paddingTop:'20px'}}>
           <div><div className='col-lg-6 col-md-6'><p>Requester Name</p></div><div className='col-lg-1 col-md-1' style={{padding:0}}><p>:</p></div><div className=' col-lg-5 col-md-5'><p>{this.props.dataSource[0].name ? this.props.dataSource[0].name :'-'}</p><div></div></div></div>
           <div><div className='col-lg-6 col-md-6'><p>Loan Disbrusement Date</p></div><div className='col-lg-1 col-md-1'style={{padding:0}}><p>:</p></div><div className=' col-lg-5 col-md-5'><p>{this.props.dataSource[0].disbursement_date ? moment(this.props.dataSource[0].disbursement_date).format('DD-MM-YYYY') :'-'}</p><div></div></div></div>
           <div><div className='col-lg-6 col-md-6'><p>Loan Approve Amount</p></div><div className='col-lg-1 col-md-1'style={{padding:0}}><p>:</p></div><div className=' col-lg-5 col-md-5'><p>{this.props.dataSource[0].approved_amount ? getNumberWithCommas(this.props.dataSource[0].approved_amount) :'-'}</p><div></div></div></div>
           <div><div className='col-lg-6 col-md-6'><p>Term in Month</p></div><div className='col-lg-1 col-md-1'style={{padding:0}}><p>:</p></div><div className=' col-lg-5 col-md-5'><p>{this.props.dataSource[0].term_in_month ? this.props.dataSource[0].term_in_month:'-'}</p><div></div></div></div>
           {
            filterData.length > 0 ? <div><div className='col-lg-6 col-md-6'><p>Monthly Installment Amount</p></div><div className='col-lg-1 col-md-1'style={{padding:0}}><p>:</p></div><div className=' col-lg-5 col-md-5'><p>{this.props.dataSource[0].data[0].monthly_installment ? getNumberWithCommas(this.props.dataSource[0].data[0].monthly_installment) :'-'}</p><div></div></div></div> : ''
           }
           
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
