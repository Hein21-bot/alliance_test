import React, { Component } from "react";
import { main_url } from '../../../utils/CommonFunction';
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import Select from 'react-select';
import moment from "moment";
import DatePicker from 'react-datetime';
class SalaryHistoryReport extends Component {

    constructor(props) {
        super(props);
        this.state = {

            
            data: [
               
            ],
            start_date:moment().format('YYYY-MM-DD'),
            end_date:moment().format('YYYY-MM-DD'),
            EmployeeNameList:[],
            selected_employee:null,
            listTotal: [],
            uniqueMap: null,
            mapValue: null,
            dataRow: []
        }
    }
    componentDidMount() {
       this.getWiseStaffReport()
       this.getEmployeeName()
    }
    getEmployeeName() {
        fetch(`${main_url}report/employeeName`)
          .then((res) => {
            if (res.ok) return res.json();
          })
          .then((list) => {
            let lists = list.unshift({ value: 0, label: "All" });
            this.setState({
              EmployeeNameList: list.map((v) => ({
                ...v
              }))
            })
          })
      }
      handleSelectedEmpName = async (event) => {
        if (event != null)
          this.setState(
            {
              selected_employee: event
            }
          )
      }
      handleSelectedStartDate=async (event)=>{
        this.setState({
            start_date:event
        })
      }
      handleSelectedEndDate=async (event)=>{
        this.setState({
            end_date:event
        })
      }
      handleSearchData=()=>{
        
    const employee = this.state.selected_employee ? this.state.selected_employee.value : 0
    const StartDate=moment(this.state.start_date).format('YYYY-MM-DD');
    const EndDate=moment(this.state.end_date).format('YYYY-MM-DD');
    // })

    fetch(main_url + "report/employeeReport/"+StartDate+'/'+EndDate+ "/" + employee)
      .then(res => { if (res.ok) return res.json() })
      .then(list => {
        this.setState({
            data:list
        })
      })
      }
      
    getWiseStaffReport=()=>{
        fetch(`${main_url}report/regionWiseReport`)
            .then((res) => {
                if (res.ok) return res.json();
            })
            .then((list) => {
                let totalList=list;
                let collectedTotal=[];
                totalList.forEach((v1,i1)=>{
                    let total=0;
                    v1.designations.forEach(v2 => {
                        let subTotal = v2.gender.filter(v => typeof v == "number").reduce((p, c) => { return p + c }, 0);
                        // console.log("sub total ====>", subTotal)
                        total += subTotal;
                        console.log(total);
                    })
                    collectedTotal[i1] = total;
                    
                })
                let uniqueDesign = new Set();                
                list.forEach(v => {
                    v.designations.forEach(v1 => {
                        uniqueDesign.add(v1.designations)
                    });
                });
                

                let uniqueMap = new Map();
                uniqueDesign.forEach(v=>{
                    uniqueMap.set(v, {
                        "designations": v,
                        "gender":["female", 0, "male", 0]
                    })
                });
                console.log("uniqueMap",uniqueMap)

                let mapValue = [...uniqueMap.values()]
                
                let dataRow = list;
                dataRow = dataRow.map(v=>{
                    let temp = [...v.designations];
                    v.designations = mapValue;

                    v.designations = v.designations.map(designation=>{
                        temp.forEach(originValue=>{
                            if(designation.designations == originValue.designations){
                                designation = originValue;
                            }
                            
                        })
                        return designation;
                    })
                    return v;
                })

                
                console.log("DataRow",dataRow);

                
                this.setState({
                    listTotal:collectedTotal,
                    dataRow,
                    uniqueMap:uniqueMap,
                    mapValue,
                    data: list
                })


            })
    }

   


    render() {

        return (
            <div style={{overflowX:'auto'}}>
                <h3 className="">Salary History Report</h3>
                <ReactHTMLTableToExcel 
                    className="btn-excel"
                    table="reg_wise_staff"
                    filename="Salary History Report"
                    buttonText="Excel"
                    sheet="Sheet"
                    />
                    <table className="table table-bordered" style={{width:'20%'}}>
                        <thead>
                        <tr>
                            <th>Employee ID</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Name</td>
                                <td>Ye Htet</td>
                            </tr>
                            <tr>
                                <td>Position</td>
                                <td>Ye Htet</td>
                            </tr>
                            <tr>
                                <td>Department</td>
                                <td>Ye Htet</td>
                            </tr>
                            <tr>
                                <td>Branch</td>
                                <td>Ye Htet</td>
                            </tr>
                            <tr>
                                <td>Region</td>
                                <td>Ye Htet</td>
                            </tr>
                            
                        </tbody>
                    </table>
                     <div className='flex-row' style={{ display: 'flex', justifyContent: 'left', alignItems: 'end', margin: '10px 10px 10px 10px' }}>
         
                     <div style={{marginRight:'10px'}}>
                        <label htmlFor="">Start Date</label>
                     <DatePicker
                            dateFormat="DD/MM/YYYY"
                            value={this.state.start_date}
                            onChange={this.handleSelectedStartDate}
                            timeFormat={false}
                        />
                     </div>
                    <div style={{marginRight:'10px'}}>
                        <label htmlFor="">End Date</label>
                        <DatePicker
                            dateFormat="DD/MM/YYYY"
                            value={this.state.end_date}
                            onChange={this.handleSelectedEndDate}
                            timeFormat={false}
                        />
                    </div>
                    <div>
                        <label htmlFor="">Employee Name</label>
                        <Select
                    styles={{
                        container: base => ({
                        ...base,
                        //   flex: 1
                        width: 180
                        }),
                        control: base => ({
                        ...base,
                        minHeight: '18px'
                        }),

                    }}
                    placeholder="Employee Name"
                    options={this.state.EmployeeNameList}
                    onChange={this.handleSelectedEmpName}
                    value={this.state.selected_employee}
                    className='react-select-container'
                    classNamePrefix="react-select"
                    />
                    </div>
                        
                   
                    
                        <div>
                    <button className='btn btn-primary text-center' style={{ marginLeft: 10, height: 30, padding: '0px 5px 0px 5px' }} onClick={() => this.handleSearchData()}>Search</button>

                        </div>
                    
          </div>
                <table className="table table-bordered" id="reg_wise_staff" style={{overflow:'scroll'}}>
                    <thead>
                        <tr style={{ backgroundColor: 'blue', color: 'white',overflow:'scroll' }}>
                            <th style={{textAlign:'center',width:100}} rowSpan={2}><div style={{width:100}}></div></th>
                            {
                                    this.state.mapValue != null && this.state.mapValue.map((v1)=>{
                                        
                                        return(
                                            <th style={{textAlign:'center',width:100}}>
                                                {v1.designations}
                                            </th>
                                        ) 
                                    })
                                }

                        </tr>
                    </thead>
                    <tbody style={{ textAlign:'center'}}>
                            {
                                this.state.dataRow.map((v1,k)=>{
                                    return(
                                        <tr>
                                             <td style={{borderColor:'white'}}>{v1.branch_name}</td>
                                             {
                                            v1.designations.map((designation,i)=>{
                                                return(
                                                    <>
                                                            <td style={{ borderColor: 'white' }}> {designation.gender[0].toLowerCase() == "female" ? designation.gender[1] : 0}</td>  
                                                           
                                                    </>
                                                )
                                            })
                                        }
                                        </tr>
                                    )
                                })
                            }
                    </tbody>

                </table>
            </div>
        )
    }
}
export default SalaryHistoryReport;