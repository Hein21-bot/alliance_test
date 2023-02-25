import React, { Component } from "react";
import { main_url } from "../../../utils/CommonFunction";
import Select from "react-select";
import { toast, ToastContainer } from "react-toastify";
import moment from "moment";

export default class PayrollAtmCash extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      dataSourceToFilter: [],
      steps: [],
      atmOrCashSelected: null,
      atmOrCashOption: [
        { label: "ATM", value: 1 },
        { label: "Cash", value: 2 },
      ],
      atmOrCashList:[
        { label:'Please Choose ATM or Cash',value:0},
        { label: "ATM", value: 1 },
        { label: "Cash", value: 2 },
      ],
     
      
    };
  }

  async componentDidMount() {
    await this.getPayrollHeader();
   

    let tempArray = [];
    this.props.dataSource.map((v, i) => {
      var obj = { ...v };
      obj["payment_type"] = this.state.atmOrCashSelected;
      tempArray.push(obj);
    });
    
    this.setState({
      dataSource: tempArray,
      dataSourceToFilter: tempArray,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.dataSource != this.props.dataSource) {
      let tempArray = [];
      this.props.dataSource.map((v, i) => {
        var obj = { ...v };
        obj["payment_type"] = this.state.atmOrCashSelected;
        tempArray.push(obj);
      });
      this.setState({
        dataSource: tempArray,
        dataSourceToFilter: tempArray,
      });
    }
  }
 

  getPayrollHeader = async () => {
    await fetch(`${main_url}payroll/getPayrollHeader`)
      .then((response) => {
        if (response.ok) return response.json();
      })
      .then((res) => {
        var formatData = [];

        res.map((v) => {
          formatData.push(v.name);
        });

        if (res) {
          this.setState({ steps: formatData });
        }
      })
      .catch((error) => console.error(`Fetch Error =\n`, error));
  };

  handleSelectedAll = (e) => {
    console.log("e ====>", e);
    const newData = this.state.dataSource;
    const newArray = [];

    newData.map((a) => {
      var obj = { ...a };
      obj.payment_type = e;
      newArray.push(obj);
    });

    this.setState({
      atmOrCashSelected: e,
      dataSource: newArray,
      dataSourceToFilter: newArray,
    });
  };

  handleSelectedForEachRow = (e, id) => {
    const newData = this.state.dataSource;
    newData.map((v, i) => {
      if (v.user_id == id) {
        v.payment_type = e;
        return v;
      } else {
        return v;
      }
    });
    // newData.map((k, i) => {
    //     k.user_id == id ? k.payment_type = e : k.payment_type
    // })
    // let filterData = newData.filter(d => d.user_id == id)
    // let index = newData.findIndex(d=> d.user_id == id)
    // newData[index] = [...filterData]

    console.log("newData each row ====>", newData);
    this.setState({ dataSource: newData, dataSourceToFilter: newData });
  };

  handleGenerate = () => {
    let postData = this.state.dataSource.map((v) => ({
      id: v.id,
      payment_type: v.payment_type
    }))
    console.log("post Data====>",postData)
    let status = 0;
    fetch(main_url + `payroll/paymentTypeUpdate/`+moment(this.props.filterDate).format('YYYY-MM'), {
      method: "POST",
      headers: {
        // "Content-Type": "application/x-www-form-urlencoded",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    })
      .then((response) => {
        status = response.status;
        return response.text();
      })
      .then((text) => {
        if (status == 200) {
          toast.success(text, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          this.props.handleSelectRegion({ label: "Mandalay Region", value: 3 });
          this.props.handleSelectDept(null);
          this.props.handleSelectDesign(null);
          this.props.handleSelectBranch(null);
          this.setState({
            atmOrCashSelected: null
          })
          // window.location.reload();
        } else {
          toast.error(text, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
      }).then(() => {
        this.props.handleSearchAtmOrCash();
      })
  };

  render() {
    // console.log('dataSource ===>', this.props.payrollCalculatedAllData)
    return (
      <div>
        <ToastContainer position={toast.POSITION.TOP_RIGHT} />
        <div className="row col-md-12">
          <div className="form-horizontal" name="demo-form">
            {/* <div className="col-md-12" style={{ marginTop: 20 }}>
              <div className="ibox float-e-margins" id="add_check_form">
                <div className="ibox-content p-md"> */}
            <div className="row" style={{display:'flex',justifyContent:'end',alignItems:'end'}}>
              <div className="col-md-2">
                <label htmlFor="">Date</label>
                <input type="text" value={moment(this.props.filterDate).format('YYYY-MM')} className="form-control" disabled />
              </div>
              <div className="col-md-2">
                <label>Region</label>
                <Select
                  options={this.props.regionList}
                  value={this.props.selectedRegion}
                  onChange={this.props.handleSelectRegion}
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
              </div>
              <div className="col-md-2">
                <label>Department</label>
                <Select
                  options={this.props.departmentList}
                  value={this.props.selectedDept}
                  onChange={this.props.handleSelectDept}
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
              </div>
              <div className="col-md-2">
                <label>Designation</label>
                <Select
                  options={this.props.designationList}
                  value={this.props.selectedDesign}
                  onChange={this.props.handleSelectDesign}
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
              </div>
              <div className="col-md-2">
                <label>Branch</label>
                <Select
                  options={this.props.branchList}
                  value={this.props.selectedBrnach}
                  onChange={this.props.handleSelectBranch}
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
              </div>
              <div className="col-md-2">
                <label>Employee ID</label>
                <Select
                  options={this.props.employeeIdList}
                  value={this.props.empId}
                  onChange={this.props.handleSelectedEmpId}
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
              </div>
              <div className="col-md-2">
                <label>Employee Name</label>
                <Select
                  options={this.props.empNameList}
                  value={this.props.employeeName}
                  onChange={this.props.handleSelectedName}
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
              </div>
              <div className="">
              <button
                  className="btn-primary btn"
                  onClick={this.props.handleSearchAtmOrCash}
                  // style={{ marginTop: 20, marginRight: 10 }}
                >
                  Search
                </button>
              </div>
             
            </div>
            <div className="row" style={{display:'flex',justifyContent:'end',marginBottom:10,marginTop:10}}>
              <div className="col-lg-3 col-md-5 col-sm-6" style={{border:'1px solid black'}}>
                <h3 style={{textAlign:'center'}}>Payroll Generate</h3>
              <div className="row" style={{display:'flex',justifyContent:'space-between',alignItems:'end',marginBottom:10}}>
            
            <div className="col-md-6">
                <label>ATM / Cash</label>
                <Select
                  options={this.state.atmOrCashOption}
                  value={this.state.atmOrCashSelected}
                  onChange={this.handleSelectedAll}
                  className="react-select-container"
                  classNamePrefix="react-select"
                  placeholder="Please Choose ATM or Cash"
                />
                
            </div>
            <div>
                <div className="row">
               <div className="col-md-6">
                <button
                    className="btn-primary btn"
                    onClick={this.handleGenerate}
                    style={{ marginRight:5 }}
                  >
                    Generate
                  </button>
                </div>
               
            <div className="col-md-6">
            <button
                className="btn-primary btn"
                onClick={this.props.handleNextForATMOrCash}
                // style={{ marginTop: 20 }}
              >
                Next
              </button>
            </div>
                </div>
            </div>
            
            {/* <div
              className="btn-leftend"
              style={{ marginRight: 10 }}
            >
              
              
              
            </div> */}
            
          </div>
              </div>
            </div>
           
          </div>
        </div>
        {/* <div className="row col-md-12"></div> */}
        <div style={{marginTop:5}}>
          <table
            className="table table-bordered"
            id="payroll_atm_cash"
            style={{
              display: "block",
              overflowX: "Scroll",
              whiteSpace: "nowrap",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "blue", color: "white" }}>
                <th
                  style={{
                    // width: 20,
                    textAlign: "center",
                    // borderColor: "white",
                  }}
                >
                  No
                </th>
                <th
                  style={{
                    // width: 50,
                    textAlign: "center",
                    // borderCOlor: "white",
                  }}
                >
                  Employee ID
                </th>
                <th
                  style={{
                    // width: 100,
                    textAlign: "center",
                    // borderColor: "white",
                  }}
                >
                  Employee Name
                </th>
                <th
                  style={{
                    // width: 100,
                    textAlign: "center",
                    // borderColor: "white",
                  }}
                >
                  ATM/Cash
                </th>
                <th
                  style={{
                    // width: 150,
                    textAlign: "center",
                    // borderColor: "white",
                  }}
                >
                  Designation
                </th>
                <th
                  style={{
                    // width: 50,
                    textAlign: "center",
                    // borderColor: "white",
                  }}
                >
                  Department
                </th>
                <th
                  style={{
                    // width: 150,
                    textAlign: "center",
                    // borderColor: "white",
                  }}
                >
                  Branch
                </th>
                <th
                  style={{
                    // width: 100,
                    textAlign: "center",
                    // borderColor: "white",
                  }}
                >
                  Region
                </th>
                {this.state.steps &&
                  this.state.steps.map((v, i) => (
                    <th
                      style={{
                        // width: 100,
                        textAlign: "center",
                        // borderColor: "white",
                      }}
                      key={i}
                    >
                      {v}
                    </th>
                  ))}
                <th
                  style={{
                    // width: 100,
                    textAlign: "center",
                    // borderColor: "white",
                  }}
                >
                  Net Salary
                </th>
              </tr>
            </thead>
            <tbody>
              {this.state.dataSource.map((v1, i1) => {
                // console.log("payment type",v1.payment_type!=null ? v1.payment_type : this.state.atmOrCashOption.filter(v=>v.value == v1.cash_or_atm) ? this.state.atmOrCashOption.filter(v=>v.value == v1.cash_or_atm)[0] : 'Please Choose ATM or Cash',v1.payment_type,v1.cash_or_atm)
                // console.log("atm or cash",this.state.dataSource,this.state.atmOrCashOption,this.state.dataSource && this.state.atmOrCashOption && this.state.atmOrCashOption.filter(v=>v.value == v1.cash_or_atm))
                return (
                  <>
                    <tr style={{ textAlign: "center" }} key={i1}>
                      <td style={{ textAlign: "center" }}>{i1 + 1}</td>
                      <td style={{ textAlign: "center" }}>{v1.employee_id}</td>
                      <td style={{ textAlign: "center" }}>{v1.name}</td>
                      <td style={{ textAlign: "center" }}>
                        <div style={{width: '100px'}}>
                        <Select
                          options={this.state.atmOrCashOption}
                          value={v1.payment_type!=null ? v1.payment_type : this.state.atmOrCashList.filter(v=>v.value == v1.cash_or_atm) && this.state.atmOrCashList.filter(v=>v.value == v1.cash_or_atm)[0]}
                          onChange={(e) =>
                            this.handleSelectedForEachRow(e, v1.user_id)
                          }
                          className="react-select-container checkValidate"
                          classNamePrefix="react-select"
                          placeholder="Please Choose ATM or Cash"
                        />
                        </div>
                        
                        {/* <div
                          onChange={this.onRadioChangeEachRow}
                          className="row"
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            //   alignItems: "center",
                          }}
                        >
                          <input
                            type="radio"
                            value={0}
                            name="work"
                            // checked={v1.payment_type == 0 ? 'checked' : 'checked'}
                            checked = 'checked'
                          />{" "}
                          <span>ATM</span>
                          <input
                            type="radio"
                            value={1}
                            name="work"
                            checked={v1.payment_type == 1 ? true : false}
                          />{" "}
                          <span>Cash</span>
                        </div> */}
                      </td>
                      <td style={{ textAlign: "center" }}>{v1.designation}</td>
                      <td style={{ textAlign: "center" }}>{v1.department}</td>
                      <td style={{ textAlign: "center" }}>{v1.branch}</td>
                      <td style={{ textAlign: "center" }}>{v1.region}</td>
                      {this.state.steps.map((v2, i2) => (
                        <td style={{ textAlign: "center" }} key={i2}>
                          {v1.labels.filter((a) => a.label == v2)[0]
                            ? v1.labels.filter((a) => a.label == v2)[0].value.toLocaleString('en-US',{maximumFractionDigits:2})
                            : "-"}
                        </td>
                      ))}
                      <td style={{ textAlign: "center" }}>
                        {v1.detail_amount.toLocaleString('en-US',{maximumFractionDigits:2})}
                      </td>
                    </tr>
                  </>
                );
              })}
              {/* <tr>
                                <td style={{textAlign:'center'}} colSpan={3}>
                                    Total
                                </td>
                                <td style={{textAlign:'center'}}>{this.state.Field_Staff_Final_Total}</td>
                                <td style={{textAlign:'center'}}>{this.state.Managerial_Final_Total}</td>
                                <td style={{textAlign:'center'}}>{this.state.OtherStaff_Final_Total}</td>
                                <td style={{textAlign:'center'}}>{this.state.TotalStaff_Final_Total}</td>
                                <td style={{textAlign:'center'}}>{this.state.NewStaff_Final_Total}</td>
                                <td style={{textAlign:'center'}}>{this.state.QuitStaff_Final_Total}</td>
                               
                            </tr> */}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
