import React,{Component} from "react";
import { main_url} from "../../../utils/CommonFunction";
import DatePicker from "react-datetime";
import Select from "react-select";
import moment from "moment";
import ReactHTMLTableToExcel from "react-html-table-to-excel";

const $ = require('jquery');

export default class MonthlyIncentiveReport extends Component{
    constructor(props){
      super(props);{
        this.state={
      employeeIdList: [],
      EmployeeNameList: [],
      regionList: [],
      branchList: [],
      designationList: [],
      coData:[],
      fxData:[],
      roData:[],
      bmData:[],
      co_fx: [
        { value: 1, label: "CO" ,name:'co'},
        { value: 2, label: "FX" ,name:'fx' },
        // { value: 3, label: "RO" ,name:'ro'},
        // { value: 4, label: "BM/DBM" ,name:'bm' },
      ],
      selected_month: new Date(),
      selected_region: "",
      selected_branch: "",
      selected_designation: "",
      selected_employeeID: "",
      selected_employee: "",
      selected_type: { value: 1, label: "CO",name:'co' },
      table_type:1
        }
      }};
componentDidMount(){
    this.getEmployeeCodeList();
    this.getEmployeeName();
    this.getBranchList();
    this.getRegionList();
    this.getDesignationList();
}

getRegionList() {
    fetch(`${main_url}benefit/getRegionList`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        let lists = list.unshift({ state_id: 0, state_name: "All" });
        this.setState({
          regionList: list.map((v) => ({
            ...v,
            label: v.state_name,
            value: v.state_id,
          })),
        });
      });
  };

  getDesignationList() {
    fetch(`${main_url}main/getDesignations`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        let lists = list.unshift({ value: 0, label: "All" });
        this.setState({
          designationList: list,
        });
      });
  };

  getBranchList() {
    fetch(`${main_url}main/getBranch`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        let lists = list.unshift({ value: 0, label: "All" });
        this.setState({
          branchList: list,
        });
      });
  };

  getEmployeeCodeList() {
    fetch(`${main_url}employee/getEmployeeCode`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        this.setState({
          employeeIdList: list.map((v) => ({
            ...v,
            label: v.employee_code,
            value: v.user_id,
          })),
        });
      });
  };

  getEmployeeName() {
    fetch(`${main_url}report/employeeName`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        this.setState({
          EmployeeNameList: list,
        });
      });
  };

  handleSelectedRegion = (event) => {
    if (event !== null)
      this.setState({
        selected_region: event,
      });
  };

  handleSelectedBranch = (event) => {
    if (event !== null)
      this.setState({
        selected_branch: event,
      });
  };

  handleSelectedDesignation = (event) => {
    if (event !== null)
      this.setState({
        selected_designation: event,
      });
  };

  handleSelectedEmployeeId = (event) => {
    if (event !== null)
      this.setState({
        selected_employeeID: event,
        selected_employee: this.state.EmployeeNameList.filter(
          (v) => v.value == event.user_id
        )[0].label,
      });
  };

  handleSelectedMonth = (event) => {
    this.setState({
      selected_month: event,
    });
  };
 
  handleSelectedType = (event) => {
    this.setState(
        {
          selected_type: event,
      
        });
    };

   handleSearch=(e)=>{
  this.setState({
    coData:[],
    fxData:[],
    roData:[],
    bmData:[],
    loading:true
  })
  const employee = this.state.selected_employeeID ? this.state.selected_employeeID.value : 0
  const designationId = this.state.selected_designation ? this.state.selected_designation.value : 0
  const branchId = this.state.selected_branch ? this.state.selected_branch.value :0
  const regionId = this.state.selected_region ? this.state.selected_region.value : 0

    fetch(main_url + "salary_report/monthlyReport/" + employee + "/" + designationId + "/" + branchId + "/" + regionId + "/" + this.state.selected_type.name + "/" + moment(this.state.selected_month).format('YYYY-MM') + "/" +'1' ) 
      .then(res => { if (res.ok) {return res.json()} else { return res.text} })
      .then(list => {
        if (this.state.selected_type.value === 1){
        this.setState({
            coData:[list] || [],
            fxData:[],
            roData:[],
            bmData:[],
            table_type:1,
            loading:false
        });} 
        else if (this.state.selected_type.value === 2) { 
          this.setState({
            fxData:list || [],
            coData:[],
            roData:[],
            bmData:[],
            table_type:2,
            loading:false

        },()=>{
          this.setDataTable(list)
        });
        }
        // else if (this.state.selected_type.value === 3) { 
        //   this.setState({
        //     roData:list || [],
        //     bmData:[],
        //     fxData: [],
        //     coData: [],
        //     table_type:3,
        //     loading:false

        // },()=>{
        //   this.setDataTableRo(list)
        // });
        // }
        // else if (this.state.selected_type.value === 4) { 
        //   this.setState({
        //     bmData:list || [],
        //     coData:[],
        //     fxData: [],
        //     roData: [],
        //     table_type:4,
        //     loading:false

        // },()=>{
        //   this.setDataTableBm(list)
        // });
        // }
      })
      .catch((error)=>{
        throw(error)
      })
}

    setDataTable(data) {
        var table;
        if ($.fn.dataTable.isDataTable("#dataTables-Table")) {
          table = $("#dataTables-Table").dataTable();
          table.fnClearTable();
          table.fnDestroy();
          $("#dataTables-Table").empty();
        }
        var l = [];
        for (var i = 0; i < data.length; i++) {
          const index = i;
          const result = data[i];
          const obj = {
            no: index + 1,
            employment_id: data[i].employeeID ? data[i].employeeID: "-",
            co_count:data[i].coCount ? data[i].coCount : "-",
            co_incentive: data[i].incentiveAmount ? data[i].incentiveAmount : "-",
            co_incentive_total: data[i].coIncentiveTotal ? data[i].coIncentiveTotal : "-",
          };
          l.push(obj);
        }
    
        table = $("#dataTables-Table").DataTable({
          autofill: true,
          bLengthChange: false,
          bInfo: false,
          responsive: true,
          paging: true,
          retrieve: true,
          buttons: false,
          dom: 'Bfrtip',

          buttons:  [
            // 'copy',
        // {
        //         extend: 'csvHtml5',
        //         title: 'Birthday Fund',
        // },
        {
            extend: 'excelHtml5',
            title: 'Monthly Incentive Report(FX)',
        },
        // {
        //     extend: 'pdfHtml5',
        //     title: 'Birthday Fund',
        // }
      ],
          data: l,
          columns: [
            { title: "Employee Id", data: "employment_id" },
            { title: "CO Count", data: "co_count" },
            { title: "CO Incentive Amount", data: "co_incentive" },
            { title: "CO Incentive Total", data: "co_incentive_total" },
          ],
        });
      };

      // setDataTableRo(data) {
      //   var table;
      //   if ($.fn.dataTable.isDataTable("#dataTables-Table-Ro")) {
      //     table = $("#dataTables-Table-Ro").dataTable();
      //     table.fnClearTable();
      //     table.fnDestroy();
      //     $("#dataTables-Table-Ro").empty();
      //   }
      //   var l = [];
      //   for (var i = 0; i < data.length; i++) {
      //     const index = i;
      //     const result = data[i];
      //     const obj = {
      //               no: index + 1,
      //               employment_id: data[i].employeeID ? data[i].employeeID : "-",
      //               name: data[i].coCount ? data[i].coCount : "-",
      //               par_percent: data[i].par_percent ? data[i].par_percent : "-",
      //               collection_percent :  data[i].collection_percent ? data[i].collection_percent : "-",
      //               par: data[i].par ? data[i].par : "-",
      //               collection: data[i].collection ? data[i].collection : "-",
      //               total: data[i].total ? data[i].total : "-",
      //               remark: data[i].remark ? data[i].remark : "-",
      //     };
      //     l.push(obj);
      //   }
    
      //   table = $("#dataTables-Table-Ro").DataTable({
      //     autofill: true,
      //     bLengthChange: false,
      //     bInfo: false,
      //     responsive: true,
      //     paging: true,
      //     retrieve: true,
      //     buttons: false,
      //     dom: 'Bfrtip',

      //     buttons:  [
      //       // 'copy',
      //   // {
      //   //         extend: 'csvHtml5',
      //   //         title: 'Birthday Fund',
      //   // },
      //   {
      //       extend: 'excelHtml5',
      //       title: 'Monthly Incentive Report(RO)',
      //   },
      //   // {
      //   //     extend: 'pdfHtml5',
      //   //     title: 'Birthday Fund',
      //   // }
      // ],
      //     data: l,
      //     columns: [
      //       { title: "No", data: "no" },
      //             { title: "Employee Id", data: "employment_id" },
      //             { title: "name", data: "name" },
      //             { title: "PAR %", data: "par_percent" },
      //             { title: "Collection %", data: "collection_percent" },
      //             { title: "PAR", data: "par" },
      //             { title: "Collection", data: "collection" },
      //             { title: "Total", data: "total" },
      //             { title: "Remark", data: "remark" },
      //     ],
      //   });
      // };

      // setDataTableBm(data) {
      //   var table;
      //   if ($.fn.dataTable.isDataTable("#dataTables-Table-Bm")) {
      //     table = $("#dataTables-Table-Bm").dataTable();
      //     table.fnClearTable();
      //     table.fnDestroy();
      //     $("#dataTables-Table-Bm").empty();
      //   }
      //   var l = [];
      //   for (var i = 0; i < data.length; i++) {
      //     const index = i;
      //     const result = data[i];
      //     const obj = {
      //       no: index + 1,
      //       employment_id: data[i].employeeID ? data[i].employeeID : "-",
      //       name: data[i].fullname ? data[i].fullname : "-",
      //       amount: data[i].amount ? data[i].amount : "-",        
      //     };
      //     l.push(obj);
      //   }
    
      //   table = $("#dataTables-Table-Bm").DataTable({
      //     autofill: true,
      //     bLengthChange: false,
      //     bInfo: false,
      //     responsive: true,
      //     paging: true,
      //     retrieve: true,
      //     buttons: false,
      //     dom: 'Bfrtip',

      //     buttons:  [
      //       // 'copy',
      //   // {
      //   //         extend: 'csvHtml5',
      //   //         title: 'Birthday Fund',
      //   // },
      //   {
      //       extend: 'excelHtml5',
      //       title: 'Monthly Incentive Report(BM/DBM)',
      //   },
      //   // {
      //   //     extend: 'pdfHtml5',
      //   //     title: 'Birthday Fund',
      //   // }
      // ],
      //     data: l,
      //     columns: [
      //       { title: "No", data: "no" },
      //       { title: "Employee Id", data: "employment_id" },
      //       { title: "Name", data: "name" },
      //       { title: "Amount", data: "amount" },
      //     ],
      //   });
      // };

    render(){
    return(

        <div>
            <h3 style={{margin:'15px 15px 15px 15px'}}>Monthly Incentive Report</h3>

            {/* <div className="col-lg-12" style={{marginLeft:0,padding:0}}> */}
            <div className="row">

          <div className="col-lg-3" >
            <label>Request Month</label>
            <DatePicker
              dateFormat="MM/YYYY"
              value={this.state.selected_month}
              timeFormat={false}
              onChange={this.handleSelectedMonth}
            />
          </div>

          <div className="col-lg-3">
            <label>CO/FX</label>
            <Select
              options={this.state.co_fx}
              onChange={this.handleSelectedType}
              value={this.state.selected_type}
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>

          <div className='col-lg-3' >
        <label>Region</label>
        <Select 
          options={this.state.regionList}
          onChange={this.handleSelectedRegion}
          value={this.state.selected_region}
          className="react-select-container"
          classNamePrefix="react-select"/></div>

          <div className='col-lg-3' >
        <label>Branch </label>
        <Select 
          options={this.state.branchList}
          onChange={this.handleSelectedBranch}
          value={this.state.selected_branch}
          className="react-select-container"
          classNamePrefix="react-select"/></div>

          <div className="col-lg-3">
            <label>Designation</label>
            <Select
              options={this.state.designationList}
              onChange={this.handleSelectedDesignation}
              value={this.state.selected_designation}
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>

          <div className='col-lg-3' >
        <label>Employee Id </label>
        <Select 
                                options={this.state.employeeIdList}
                                onChange={this.handleSelectedEmployeeId}
                                value={this.state.selected_employeeID}
                                className="react-select-container"
                                classNamePrefix="react-select"/>

          </div>

          <div className='col-lg-3' >
           <label>Employee Name</label>
              <input 
                        className="form-control checkValidate"
                        disabled={true}
                        type="text"
                        data-name="fullname"
                        value={this.state.selected_employee}
                        placeholder="Employee Name"
                         onChange={this.claimChangeText}/>
           </div>

           <div
            className="col-lg-3"
            style={{
              marginTop: "25px",
            }}
          >
            <button className="btn-primary btn" onClick={this.handleSearch.bind(this)}>Search</button>
          </div> 
          { this.state.table_type == 1 ?(
          <div className="col-lg-12" style={{paddingTop:30}}>
                        <ReactHTMLTableToExcel 
                         className="btn-excel"
                         table="monthly_incentive"
                         filename={"Monthly Incentive Report "+moment(this.state.selected_month).format('YYYY-MM')}
                         buttonText="Excel"
                         sheet="Sheet"
                        
                         />
                        </div>):(<></>)
                        }
            </div>
            <div className="col-lg-12" style={{padding:'0px 0px 0px 0px',margin:'0px 0px 0px 0px', backgroundColor:'#fff'}}>
            {  this.state.table_type === 1  && this.state.coData.length > 0 ? (  
               
                       
               <table
               id="monthly_incentive"
              className="table table-bordered"
              style={{ overflow: "Scroll",display:'block',whiteSpace:'nowrap' }}
            >
              <thead>
                <tr
                  style={{
                    backgroundColor: "blue",
                    color: "white",
                    overflow: "scroll",
                  }}
                >
                  <th
                    style={{ textAlign: "center", verticalAlign: "middle" }}
                    rowSpan={3}
                  >
                    Employee ID
                  </th>
                  <th
                    style={{ textAlign: "center", verticalAlign: "middle" }}
                    rowSpan={3}
                  >
                    FX Name
                  </th>
                  <th
                    style={{ textAlign: "center", verticalAlign: "middle" }}
                    rowSpan={3}
                  >
                    Client Officer Name
                  </th>
                  <th
                    style={{ textAlign: "center", verticalAlign: "middle" }}
                    rowSpan={3}
                  >
                    Branch Name
                  </th>
                  <th
                    style={{ textAlign: "center", verticalAlign: "middle" }}
                    rowSpan={3}
                  >
                    Product Name
                  </th>
                  <th style={{ textAlign: "center" }} colSpan={4}>
                    Credit
                  </th>
                  <th style={{ textAlign: "center" }}>Saving</th>
                  <th style={{ textAlign: "center" }} colSpan={2}>
                    Collection Rate
                  </th>
                  <th style={{ textAlign: "center" }} colSpan={2}>
                    PAR
                  </th>
                  <th
                    style={{ textAlign: "center", verticalAlign: "middle" }}
                    rowSpan={3}
                  >
                    Credit Incentive
                  </th>
                  <th
                    style={{ textAlign: "center", verticalAlign: "middle" }}
                    rowSpan={3}
                  >
                    Saving Incentive
                  </th>
                  <th
                    style={{ textAlign: "center", verticalAlign: "middle" }}
                    rowSpan={3}
                  >
                    Collective Rate Incentive
                  </th>
                  <th
                    style={{ textAlign: "center", verticalAlign: "middle" }}
                    rowSpan={3}
                  >
                    PAR Deduction Incentive
                  </th>
                  <th
                    style={{ textAlign: "center", verticalAlign: "middle" }}
                    rowSpan={3}
                  >
                   Grand Total
                  </th>
                </tr>
                <tr>
                  <th style={{ textAlign: "center" }} colSpan={2}>
                    Disbursement
                  </th>
                  <th style={{ textAlign: "center" }} colSpan={2}>
                    Portfolio
                  </th>
                  <th
                    style={{ textAlign: "center", verticalAlign: "middle" }}
                    rowSpan={2}
                  >
                    Outstanding
                  </th>
                  <th
                    style={{ textAlign: "center", verticalAlign: "middle" }}
                    rowSpan={2}
                  >
                    Demand
                  </th>
                  <th
                    style={{ textAlign: "center", verticalAlign: "middle" }}
                    rowSpan={2}
                  >
                    Actual
                  </th>
                  <th
                    style={{ textAlign: "center", verticalAlign: "middle" }}
                    rowSpan={2}
                  >
                    NO.s
                  </th>
                  <th
                    style={{ textAlign: "center", verticalAlign: "middle" }}
                    rowSpan={2}
                  >
                    Amount
                  </th>
                </tr>
                <tr>
                  <th style={{ textAlign: "center" }}>NO.s</th>
                  <th style={{ textAlign: "center" }}>Amount</th>
                  <th style={{ textAlign: "center" }}>NO.s</th>
                  <th style={{ textAlign: "center" }}>Outstanding</th>
                </tr>
              </thead>
              <tbody style={{ textAlign: "center" }}>
                {this.state.coData[0].data ? this.state.coData[0].data.map((v, i) => { 
                  return (
                    <>
                      <tr style={{backgroundColor:'#fff'}}>
                        <td>{v.employeeID}</td>
                        <td>{v.fx_name}</td>
                        <td>{v.co_name}</td>
                        <td>{v.branch_name}</td>
                        <td>{v.product_name}</td>
                        <td>{v.creditDisbursementNo}</td>
                        <td>{v.creditDisbursementAmount}</td>
                        <td>{v.creditPortfolioNo}</td>
                        <td>{v.creditPortfolOutstanding}</td>
                        <td>{v.savingOutstanding}</td>
                        <td>{v.collectionRateDemand}</td>
                        <td>{v.collectionActual}</td>
                        <td>{v.parNo}</td>
                        <td>{v.parAmount}</td>
                        <td>{v.creditIncentive}</td>
                        <td>{v.savingIncentive}</td>
                        <td>{v.collectiveRateIncentive}</td>
                        <td>{v.parDeductionRate}</td>
                        <td>{v.totalIncentive}</td>
                      </tr>
                    </>
                  );
                }):''}
              </tbody>
            </table>
                
            ) : this.state.table_type === 1 && this.state.coData.length === 0 ? (
              
                <table
                className="table table-bordered"
                id='monthly_incentive'
                style={{ overflow: "scroll"}}
              >
                <thead>
                  <tr
                    style={{
                      backgroundColor: "blue",
                      color: "white",
                      overflow: "scroll",
                    }}
                  >
                    <th
                      style={{ textAlign: "center", verticalAlign: "middle" }}
                      rowSpan={3}
                    >
                      Employee ID
                    </th>
                    <th
                    style={{ textAlign: "center", verticalAlign: "middle" }}
                    rowSpan={3}
                  >
                    FX Name
                  </th>
                  <th
                    style={{ textAlign: "center", verticalAlign: "middle" }}
                    rowSpan={3}
                  >
                    Client Officer Name
                  </th>
                  <th
                    style={{ textAlign: "center", verticalAlign: "middle" }}
                    rowSpan={3}
                  >
                    Branch Name
                  </th>
                  <th
                    style={{ textAlign: "center", verticalAlign: "middle" }}
                    rowSpan={3}
                  >
                    Product Name
                  </th>
                    <th style={{ textAlign: "center" }} colSpan={4}>
                      Credit
                    </th>
                    <th style={{ textAlign: "center" }}>Saving</th>
                    <th style={{ textAlign: "center" }} colSpan={2}>
                      Collection Rate
                    </th>
                    <th style={{ textAlign: "center" }} colSpan={2}>
                      PAR
                    </th>
                    <th
                      style={{ textAlign: "center", verticalAlign: "middle" }}
                      rowSpan={3}
                    >
                      Credit Incentive
                    </th>
                    <th
                      style={{ textAlign: "center", verticalAlign: "middle" }}
                      rowSpan={3}
                    >
                      Saving Incentive
                    </th>
                    <th
                      style={{ textAlign: "center", verticalAlign: "middle" }}
                      rowSpan={3}
                    >
                      Collective Rate Incentive
                    </th>
                    <th
                      style={{ textAlign: "center", verticalAlign: "middle" }}
                      rowSpan={3}
                    >
                      PAR Deduction Incentive
                    </th>
                    <th
                  style={{ textAlign: "center", verticalAlign: "middle" }}
                  rowSpan={3}
                >
                  Grand Total
                </th>
                  </tr>
                  <tr>
                    <th style={{ textAlign: "center" }} colSpan={2}>
                      Disbursement
                    </th>
                    <th style={{ textAlign: "center" }} colSpan={2}>
                      Portfolio
                    </th>
                    <th
                      style={{ textAlign: "center", verticalAlign: "middle" }}
                      rowSpan={2}
                    >
                      Outstanding
                    </th>
                    <th
                      style={{ textAlign: "center", verticalAlign: "middle" }}
                      rowSpan={2}
                    >
                      Demand
                    </th>
                    <th
                      style={{ textAlign: "center", verticalAlign: "middle" }}
                      rowSpan={2}
                    >
                      Actual
                    </th>
                    <th
                      style={{ textAlign: "center", verticalAlign: "middle" }}
                      rowSpan={2}
                    >
                      NO.s
                    </th>
                    <th
                      style={{ textAlign: "center", verticalAlign: "middle" }}
                      rowSpan={2}
                    >
                      Amount
                    </th>
                  </tr>
                  <tr>
                    <th style={{ textAlign: "center" }}>NO.s</th>
                    <th style={{ textAlign: "center" }}>Amount</th>
                    <th style={{ textAlign: "center" }}>NO.s</th>
                    <th style={{ textAlign: "center" }}>Outstanding</th>
                  </tr>
                </thead>
                <tbody style={{ textAlign: "center" }}>
                  <tr>
                  <td colSpan={18}style={{ textAlign: "center", verticalAlign: "middle",height:35,fontSize:15,borderBottom:'1px solid black' }}>No data available in table</td>
                  </tr>
                </tbody>
                </table>
                
          ): this.state.table_type === 2 && this.state.fxData.length >= 0 ? ( 
            <div className="col-lg-12" style={{marginTop:30}}>
            <table
            width="99%"
            className="table table-striped table-bordered table-hover responsive nowrap dt-responsive"
            id="dataTables-Table"
          /></div>
            )

            // : this.state.table_type === 3 && this.state.roData.length >= 0 ? ( 
            
            //   <div className="col-lg-12" style={{marginTop:30}}>
            //   <table
            //   width="99%"
            //   className="table table-striped table-bordered table-hover responsive nowrap dt-responsive"
            //   id="dataTables-Table-Ro"
            // /></div>
            //   )
            //   : this.state.table_type === 4 && this.state.bmData.length >= 0 ? ( 
            
            //     <div className="col-lg-12" style={{marginTop:30}}>
            //     <table
            //     width="99%"
            //     className="table table-striped table-bordered table-hover responsive nowrap dt-responsive"
            //     id="dataTables-Table-Bm"
            //   /></div>
            //     )

            :(<></>)
          }
            </div>
            </div>
   ) }

}