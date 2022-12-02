import React,{Component} from "react";
import { main_url } from '../../../utils/CommonFunction';
import DatePicker from "react-datetime";
import Select from "react-select";
import moment from "moment";
const $ = require('jquery');





export default class QuarterlyIncentive extends Component{
    constructor(props){
        super(props);
        this.state={
            dataSource:[],
            regionList : [],
            branchList : [],
            departmentList : [],
            selected_month : new Date(),
            selected_region :'',
            selected_branch :'',
            selected_department :'',
        }};
        componentDidMount(){
            this.$el = $(this.el);
            this.getRegionList();
            this.getBranchList();
            this.getDepartment();
            this.setDataTable(this.state.dataSource);
        }

     

        getDepartment(){
            fetch(main_url + `main/getDepartment`)
            .then((res) => {
              if (res.ok) return res.json();
            })
            .then((res1) => {
              res1.unshift({ label: "All", value: 0 })
              this.setState({ departmentList: res1 });
            })
            .catch((error) => console.error(`Fetch Error =\n`, error));
          };

        getBranchList() {
            fetch(`${main_url}main/getBranch`)
                .then((res) => {
                    if (res.ok) return res.json();
                })
                .then((list) => {
                    let lists = list.unshift({ value: 0, label: 'All' })
                    this.setState({
                        branchList: list
                    });
                });
          };

        getRegionList() {
            fetch(`${main_url}benefit/getRegionList`)
                .then(res => { if (res.ok) return res.json() })
                .then(list => {
                    let lists = list.unshift({ state_id: 0, state_name: 'All' })
                    this.setState({
                        regionList: list.map(v => ({ ...v, label: v.state_name, value: v.state_id }))
                    })
                })
          };

          handleSelectedDeaprtment = (event) => {
            if (event !== null)
              this.setState({
                selected_department: event,
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

          handleSelectedMonth = (event) => {
            this.setState({
                selected_month: event,
              });
          };
          
          handleSelectedBranch = (event) => {
            if (event !== null)
              this.setState({
                selected_branch: event,
              });
          };

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
                employment_id: data[i].employment_id ? data[i].employment_id : "-",
                co_count:data[i].request_type == 1 ? "Back Pay Salary" : data[i].request_type ==2 ? "Refund Salary" : "•	Temporary Contract Salary",
                co_incentive: data[i].fullname ? data[i].fullname : "-",
                co_incentive_total: data[i].designations ? data[i].designations : "-",
              };
              l.push(obj);
            }
        
            table = $("#dataTables-Table").DataTable({
              autofill: false,
              bLengthChange: false,
              bInfo: false,
              responsive: true,
              paging: false,
              buttons: false,
        
              data: l,
              columns: [
                { title: "Employee Id", data: "employment_id" },
                { title: "CO Count", data: "co_count" },
                { title: "CO Incentive", data: "co_incentive" },
                { title :"CO Incentive Total",data:"co_incentive_total"},
              ],
            });
          };

        render(){
            return(
                <div>
    <div className='col-lg-3' >
        <label>Request Month</label>
        <DatePicker
            dateFormat="MM/YYYY"
            value={this.state.selected_month}
            timeFormat={false}
            onChange={this.handleSelectedMonth}

        /></div>

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

    <div className='col-lg-3' style={{marginBottom:20}} >
        <label>Department</label>
        <Select 
          options={this.state.departmentList}
          onChange={this.handleSelectedDeaprtment}
          value={this.state.selected_department}
          className="react-select-container"
          classNamePrefix="react-select"/></div>
          
    <div className="row" style={{display:'flex',justifyContent:'end',marginBottom:20,paddingRight:25}}><button className='btn-primary btn'>Search</button></div>

           <div>
                <table
                      width="99%"
                      className="table table-striped table-bordered table-hover responsive nowrap dt-responsive"
                      id="dataTables-Table"
                    /></div>
                </div>
            )
        }
}