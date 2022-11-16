import React, { Component } from "react";

export default class ResignOrDismissSalaryView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: null,
    };
  }

  render() {
    var on = {
        ATM_Cash: 0,
        SSC_employee: 3700,
        SSC_employer: 5550,
        after_deduction_or_addition: 185000,
        approve_by: null,
        check_by: null,
        createdAt: "2022-11-16T14:19:32.023Z",
        createdBy: 17,
        deduction_or_addition: 10000,
        deptname: "Admin",
        designations: "Security",
        exit_status: 2,
        form_no: null,
        gross_salary: 175000,
        id: 10,
        income_tax: null,
        last_working_day: "2022-11-16T02:12:28.000Z",
        location_master_name: "Meiktila",
        maintenance: 0,
        petrol: 0,
        reason: "hahha1",
        referback_by: null,
        request_month: null,
        state_name: "Mandalay South Region",
        status: null,
        total_salary: 181300,
        user_id: 40,
        verify_by: null,
      };
      const {request_month} = this.props.dataSource
    return (
      <div>
        <div className="row margin-top-20 col-md-12">
          <div className="col-md-3">
            <label>Request Month</label>
            <input
              className="form-control"
              disabled
              type="number"
              data-name="ssc3"
              value={request_month}
            />
          </div>
          <div className="col-md-3">
            <label>SSC (Employee 2%)</label>
            <input
              className="form-control"
              disabled
              type="number"
              data-name="ssc2"
              value={addNewData.ssc2}
            />
          </div>
          <div className="col-md-3">
            <label>Income Tax</label>
            <input
              className="form-control checkValidate"
              type="number"
              data-name="incomeTax"
              value={addNewData.incomeTax}
              placeholder={"Enter Income Tax"}
              onChange={this.onIncomeTaxChange}
            />
          </div>
          <div className="col-md-3">
            <label>Maintenance</label>
            <input
              className="form-control"
              type="number"
              data-name="maintenance"
              value={addNewData.maintenance}
              placeholder="Enter Maintenance"
              onChange={this.onMaintenanceChange}
            />
          </div>
        </div>
      </div>
    );
  }
}
