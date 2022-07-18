import React, { Component } from "react";
import {
  main_url,
  getMainRole,
  getCookieData,
  getInformation,
  print,
  fno,
  getFirstDayOfMonth,
  getBranch,
  getUserId,
} from "../../../utils/CommonFunction";
import "datatables.net-bs4/css/dataTables.bootstrap4.min.css";
import "datatables.net-responsive-bs4/css/responsive.bootstrap4.min.css";
import "datatables.net-dt/css/jquery.dataTables.css";
import "datatables.net-buttons-dt/css/buttons.dataTables.css";
import "jspdf-autotable";
import moment from "moment";
import { imgData } from "../../../utils/Global";
import * as jsPDF from "jspdf";
import DatePicker from "react-datetime";
import Select from "react-select";
const $ = require("jquery");
const jzip = require("jzip");
window.JSZip = jzip;
$.DataTable = require("datatables.net-bs4");
$.DataTable = require("datatables.net-responsive-bs4");
$.DataTable = require("datatables.net");
require("datatables.net-buttons/js/dataTables.buttons.min");
require("datatables.net-buttons/js/buttons.html5.min");

const default_y = 10;
export default class TravelRequestAdvancedTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      user_id: getUserId("user_info"),
      user_info: getCookieData("user_info"),
      is_main_role: getMainRole(),
      branch_id: "",
      selected_branch: [],
      s_date: moment(getFirstDayOfMonth()),
      e_date: moment(),
    };
  }

  async componentDidMount() {
    let branch = await getBranch();
    this.filter();
    this.setState({
      branch: branch,
    });
    this._setTableData(this.state.dataSource);
    this.getTravelRequestAllowance(this.state.user_id);

    let that = this;
    $("#dataTables-table").on("click", "#toView", function () {
      var data = $(this).find("#view").text();
      data = $.parseJSON(data);
      that.props.goToAdvancedView(data);
    });

    $("#dataTables-table").on("click", "#toEdit", function () {
      var data = $(this).find("#edit").text();
      data = $.parseJSON(data);
      that.props.goToAdvancedEdit(data);
    });

    $("#dataTables-table").on("click", "#toClaim", function () {
      var data = $(this).find("#claim").text();
      data = $.parseJSON(data);
      that._getAdvancedData(data.travel_allowance_id);
    });

    $("#dataTables-table").on("click", "#toClaimRequestView", function () {
      var data = $(this).find("#CRView").text();
      data = $.parseJSON(data);
      that._getClaimRequestViewData(data.travel_allowance_id);
    });

    $("#dataTables-table").on("click", "#toClaimRequestEdit", function () {
      var data = $(this).find("#CREdit").text();
      data = $.parseJSON(data);
      that._getClaimRequestEditData(data.travel_allowance_id);
    });

    $("#dataTables-table").on(
      "click",
      "#toAdvanceClaimRequestView",
      function () {
        var data = $(this).find("#ACRView").text();
        data = $.parseJSON(data);
        that._getAdvanceClaimViewData(
          data.travel_allowance_id,
          data.advanced_travel_id
        );
      }
    );

    $("#dataTables-table").on(
      "click",
      "#toAdvanceClaimRequestEdit",
      function () {
        var data = $(this).find("#ACREdit").text();
        data = $.parseJSON(data);
        that._getAdvanceClaimRequestEdit(
          data.travel_allowance_id,
          data.advanced_travel_id
        );
      }
    );

    $("#dataTables-table").on("click", "#toPrint", function () {
      var data = $(this).find("#print").text();
      data = $.parseJSON(data);
      if (data.isClaim === 2) {
        that.getPrintDataForTravelAdvanceClaim(data);
      } else {
        that.getPrintData(data);
      }
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) {
      this.setState(
        {
          dataSource: this.props.data,
        },
        () => {
          this._setTableData(this.state.dataSource);
        }
      );
    }
  }

  _getAdvanceClaimViewData(claimId, advancedId) {
    fetch(
      main_url +
      "allowance/getAdvancedClaimViewData/" +
      claimId +
      "/" +
      advancedId
    )
      .then((response) => {
        if (response.ok) return response.json();
      })
      .then((res) => {
        if (res) {
          this.props.goToAdvanceClaimRequestView(res);
        }
      })
      .catch((error) => console.error(`Fetch Error =\n`, error));
  }

  _getAdvanceClaimRequestEdit(claimId, advancedId) {
    fetch(
      main_url +
      "allowance/getAdvancedClaimViewData/" +
      claimId +
      "/" +
      advancedId
    )
      .then((response) => {
        if (response.ok) return response.json();
      })
      .then((res) => {
        if (res) {
          this.props.goToAdvanceClaimRequestEdit(res);
        }
      })
      .catch((error) => console.error(`Fetch Error =\n`, error));
  }

  _getAdvancedData(travelId) {
    fetch(main_url + "allowance/getDataByTravelId/" + travelId)
      .then((response) => {
        if (response.ok) return response.json();
      })
      .then((res) => {
        if (res) {
          this.props.goToClaimAddNewForm(res);
        }
      })
      .catch((error) => console.error(`Fetch Error =\n`, error));
  }

  _getClaimRequestViewData(travelId) {
    fetch(main_url + "allowance/getTravelClaimViewData/" + travelId)
      .then((response) => {
        if (response.ok) return response.json();
      })
      .then((res) => {
        if (res) {
          this.props.goToClaimRequestView(res);
        }
      })
      .catch((error) => console.error(`Fetch Error =\n`, error));
  }

  _getClaimRequestEditData(travelId) {
    fetch(main_url + "allowance/getTravelClaimViewData/" + travelId)
      .then((response) => {
        if (response.ok) return response.json();
      })
      .then((res) => {
        if (res) {
          this.props.goToClaimRequestEdit(res);
        }
      })
      .catch((error) => console.error(`Fetch Error =\n`, error));
  }

  getRequest() {
    this.search(0);
  }
  getCheck() {
    this.search(1);
  }
  getVerified() {
    this.search(2);
  }
  getApprove() {
    this.search(3);
  }
  getReject() {
    this.search(4);
  }

  search(status) {
    let data = this.state.data;
    data = data.filter((d) => {
      return status === d.status;
    });
    this._setTableData(data);
  }

  handleBranch = (event) => {
    this.setState({
      selected_branch: event,
    });
  };

  handleStartDate = (event) => {
    this.setState({
      s_date: event,
    });
  };

  handleEndDate = (event) => {
    this.setState({
      e_date: event,
    });
  };

  getTravelRequestFilter(s_date, e_date, user_id, branch_id) {
    fetch(
      main_url +
      "allowance/getTravelRequestFilter/" +
      s_date +
      "/" +
      e_date +
      "/" +
      user_id +
      "/" +
      branch_id
    )
      // fetch(main_url+ "allowance/getTravelRequestFilter/")
      .then((response) => {
        if (response.ok) return response.json();
      })
      .then((res) => {
        if (res) {
          this.setState({ data: res }, () => this._setTableData(res));
        }
      })
      .catch((error) => console.error(`Fetch Error =\n`, error));
  }

  getTravelRequestAllowance(user_id) {
    fetch(
      main_url +
      "allowance/getTravelRequestAllowance/user_id=" +
      this.state.user_info.user_id
    )
      .then((response) => {
        if (response.ok) return response.json();
      })
      .then((res) => {
        if (res) {
          this.setState({ data: res }, () => this._setTableData(res));
        }
      })
      .catch((error) => console.error(`Fetch Error =\n`, error));
  }

  async setTravelAdvanceData(doc, data, y) {
    var withdraw_location = data.withdraw_location_name
    var col = ["Title", "No. of Day", "Cost Per Day", "Amount"];
    var rows = [];
    if (data.isClaim === 2) {
      var one = await this.getAdvanceData(data.advanced_travel_id);
      data = one.length > 0 ? one[0] : data;
    }
    let day_count = data.noOfDays > 1 ? data.noOfNights : data.noOfDays;
    rows.push(
      [
        "Meal Allowance",
        data.noOfDays,
        Number(data.meals / data.noOfDays).toFixed(2),
        data.meals,
      ],
      [
        "Lodging",
        data.noOfDays,
        Number(data.lodging / day_count).toFixed(2),
        data.lodging,
      ],
      [
        "Transport",
        data.noOfDays,
        Number(data.transport / data.noOfDays).toFixed(2),
        data.transport,
      ],
      ["Total Amount", "", "", data.advanced_amount]
    );
    doc.text("Travel Advance", 13, y);
    doc.text(
      "Location of Start: " + data.start_location,
      13,
      y + default_y * 1
    );
    doc.text("Destination(s): " + data.destination, 150, y + default_y * 1);
    doc.text(
      "Withdraw Location: " + withdraw_location,
      13,
      y + default_y * 2
    );
    doc.text("Purpose of Travel", 13, y + default_y * 3);
    doc.text(
      "Start Date: " + moment(data.start_date).format("DD-MM-YYYY"),
      13,
      y + default_y * 4
    );
    doc.text(
      "End Date: " + moment(data.end_date).format("DD-MM-YYYY"),
      150,
      y + default_y * 4
    );
    doc.text("Number of Day(s): " + data.noOfDays, 13, y + default_y * 5);
    doc.text("Number of Night(s): " + data.noOfNights, 150, y + default_y * 5);
    doc.autoTable(col, rows, { startY: y + default_y * 6 });
  }

  getTime(start, end) {
    return moment(start).format("HH:mm") + " - " + moment(end).format("HH:mm");
  }

  async setTravelClaimData(doc, data, id, y) {
    var col = [
      "Actual Travel Date",
      "Location From",
      "Location To",
      "StartTime - ArrivalTime",
      "Meal",
      "Lodging",
      "Transport",
      "Daily Total",
    ];
    var rows = [];
    doc.text("Travel Claim", 13, y);
    var claim = await this.getClaimData(id);
    let one = {};
    if (claim.length > 0) {
      for (let i = 0; i < claim.length; i++) {
        one = claim[i];
        rows.push([
          one.actual_date,
          one.start_location,
          one.destination,
          this.getTime(moment(one.start_time), moment(one.end_time)),
          one.meals,
          one.lodging,
          one.transport,
          one.amount,
        ]);
      }

      doc.text(
        "Start Date: " + moment(claim[0].actual_date).format("DD-MM-YYYY"),
        13,
        y + default_y * 1
      );
      doc.text(
        "End Date: " +
        moment(claim[claim.length - 1].actual_date).local().format("DD-MM-YYYY"),
        150,
        y + default_y * 1
      );
      doc.text(
        "Withdraw Location: " + data.withdraw_location_name,
        13,
        y + default_y * 2
      );
      doc.text("Purpose:" + claim[0].purpose, 150, y + default_y * 2);
    }
    rows.push(["Total Amount", "", "", "", "", "", "", data.actual_amount]);
    doc.autoTable(col, rows, { startY: y + default_y * 3 });
    doc.text(
      "Advanced Amount:" + data.advanced_amount,
      13,
      doc.previousAutoTable.finalY + default_y
    );
    doc.text(
      "Actual Amount:" + data.actual_amount,
      100,
      doc.previousAutoTable.finalY + default_y
    );
    doc.text(
      "Settle Amount:" + data.settle_amount,
      200,
      doc.previousAutoTable.finalY + default_y
    );
  }

  async getAdvanceData(id) {
    var res = await fetch(`${main_url}allowance/getTravelAdvanceData/${id}`);
    if (res.ok) return res.json();
    else return [];
  }

  async getClaimData(id) {
    var res = await fetch(`${main_url}allowance/getTravelClaimData/${id}`);
    if (res.ok) return res.json();
    else return [];
  }

  async getPrintData(data) {
    var info = await getInformation("travel", data.travel_allowance_id);
    var doc = new jsPDF("l", "mm", "a4");

    var today = moment(Date.now()).format("DD-MM-YYYY");
    // var name = '';
    doc.setFontSize(12);
    doc.addImage(imgData, "image/jpeg", 10, 10, 50, 15);
    doc.text("HR_0029", 200, 15);
    doc.text("Travel Form", 200, 25);
    doc.text("Generate Date: " + today, 13, 40);
    doc.text("Voucher No: " + fno.fno_travel + data.form_no, 200, 40);
    if (data.isClaim === 0) {
      // name = 'TravelAdvance';
      this.setTravelAdvanceData(doc, data, 50);
    } else if (data.isClaim === 1) {
      // name = 'TravelClaim';
      await this.setTravelClaimData(doc, data, data.travel_allowance_id, 50);
    }
    if (doc.previousAutoTable.finalY > 150) {
      doc.addPage();
      doc.previousAutoTable.finalY = 0;
    }
    doc.setFontSize(10);
    doc.setFontType("bold");
    doc.text("Request By", 13, doc.previousAutoTable.finalY + 20);
    doc.text("Check By", 65, doc.previousAutoTable.finalY + 20);
    doc.text("Verify By", 114, doc.previousAutoTable.finalY + 20);
    doc.text("Approve By", 164, doc.previousAutoTable.finalY + 20);
    doc.setFontSize(9);
    doc.setFontType("normal");
    doc.text(
      info.requested.requested_date,
      13,
      doc.previousAutoTable.finalY + 25
    );
    doc.text(
      info.requested.employment_id,
      13,
      doc.previousAutoTable.finalY + 30
    );
    doc.text(
      info.requested.requested_by,
      13,
      doc.previousAutoTable.finalY + 35
    );
    doc.text(info.requested.branch_name, 13, doc.previousAutoTable.finalY + 40);
    doc.text(
      info.requested.designations,
      13,
      doc.previousAutoTable.finalY + 45
    );
    doc.text(info.checked.checked_date, 65, doc.previousAutoTable.finalY + 25);
    doc.text(info.checked.employment_id, 65, doc.previousAutoTable.finalY + 30);
    doc.text(info.checked.checked_by, 65, doc.previousAutoTable.finalY + 35);
    doc.text(info.checked.branch_name, 65, doc.previousAutoTable.finalY + 40);
    doc.text(info.checked.designations, 65, doc.previousAutoTable.finalY + 45);
    doc.text(
      info.verified.verified_date,
      114,
      doc.previousAutoTable.finalY + 25
    );
    doc.text(
      info.verified.employment_id,
      114,
      doc.previousAutoTable.finalY + 30
    );
    doc.text(info.verified.verified_by, 114, doc.previousAutoTable.finalY + 35);
    doc.text(info.verified.branch_name, 114, doc.previousAutoTable.finalY + 40);
    doc.text(
      info.verified.designations,
      114,
      doc.previousAutoTable.finalY + 45
    );
    doc.text(
      info.approved.approved_date,
      164,
      doc.previousAutoTable.finalY + 25
    );
    doc.text(
      info.approved.employment_id,
      164,
      doc.previousAutoTable.finalY + 30
    );
    doc.text(info.approved.approved_by, 164, doc.previousAutoTable.finalY + 35);
    doc.text(info.approved.branch_name, 164, doc.previousAutoTable.finalY + 40);
    doc.text(
      info.approved.designations,
      164,
      doc.previousAutoTable.finalY + 45
    );
    // doc.save(name + '.pdf');
    print(doc, data);
  }

  async getPrintDataForTravelAdvanceClaim(data) {
    var info = await getInformation("travel", data.advanced_travel_id);
    var doc = new jsPDF("l", "mm", "a4");
    var today = moment(Date.now()).format("DD-MM-YYYY");
    doc.setFontSize(12);
    doc.addImage(imgData, "image/jpeg", 10, 10, 50, 15);
    doc.text("HR_0029", 200, 15);
    doc.text("Travel Form", 200, 25);
    doc.text("Generate Date: " + today, 13, 40);
    doc.text("Voucher No: " + fno.fno_travel + data.form_no, 200, 40);
    await this.setTravelAdvanceData(doc, data, 50);
    if (doc.previousAutoTable.finalY > 150) {
      doc.addPage();
      doc.previousAutoTable.finalY = 0;
    }
    doc.setFontSize(10);
    doc.setFontType("bold");
    doc.text("Request By", 13, doc.previousAutoTable.finalY + 20);
    doc.text("Check By", 65, doc.previousAutoTable.finalY + 20);
    doc.text("Verify By", 114, doc.previousAutoTable.finalY + 20);
    doc.text("Approve By", 164, doc.previousAutoTable.finalY + 20);
    doc.setFontSize(9);
    doc.setFontType("normal");
    doc.text(
      info.requested.requested_date,
      13,
      doc.previousAutoTable.finalY + 25
    );
    doc.text(
      info.requested.employment_id,
      13,
      doc.previousAutoTable.finalY + 30
    );
    doc.text(
      info.requested.requested_by,
      13,
      doc.previousAutoTable.finalY + 35
    );
    doc.text(info.requested.branch_name, 13, doc.previousAutoTable.finalY + 40);
    doc.text(
      info.requested.designations,
      13,
      doc.previousAutoTable.finalY + 45
    );
    doc.text(info.checked.checked_date, 65, doc.previousAutoTable.finalY + 25);
    doc.text(info.checked.employment_id, 65, doc.previousAutoTable.finalY + 30);
    doc.text(info.checked.checked_by, 65, doc.previousAutoTable.finalY + 35);
    doc.text(info.checked.branch_name, 65, doc.previousAutoTable.finalY + 40);
    doc.text(info.checked.designations, 65, doc.previousAutoTable.finalY + 45);
    doc.text(
      info.verified.verified_date,
      114,
      doc.previousAutoTable.finalY + 25
    );
    doc.text(
      info.verified.employment_id,
      114,
      doc.previousAutoTable.finalY + 30
    );
    doc.text(info.verified.verified_by, 114, doc.previousAutoTable.finalY + 35);
    doc.text(info.verified.branch_name, 114, doc.previousAutoTable.finalY + 40);
    doc.text(
      info.verified.designations,
      114,
      doc.previousAutoTable.finalY + 45
    );
    doc.text(
      info.approved.approved_date,
      164,
      doc.previousAutoTable.finalY + 25
    );
    doc.text(
      info.approved.employment_id,
      164,
      doc.previousAutoTable.finalY + 30
    );
    doc.text(info.approved.approved_by, 164, doc.previousAutoTable.finalY + 35);
    doc.text(info.approved.branch_name, 164, doc.previousAutoTable.finalY + 40);
    doc.text(
      info.approved.designations,
      164,
      doc.previousAutoTable.finalY + 45
    );
    doc.setFontSize(12);
    if (doc.previousAutoTable.finalY + 60 > 150) {
      doc.addPage();
      doc.previousAutoTable.finalY = 20;
    } else {
      doc.previousAutoTable.finalY = doc.previousAutoTable.finalY + 55;
    }
    await this.setTravelClaimData(
      doc,
      data,
      data.travel_allowance_id,
      doc.previousAutoTable.finalY
    );
    info = await getInformation("travel", data.travel_allowance_id);
    if (doc.previousAutoTable.finalY > 150) {
      doc.addPage();
      doc.previousAutoTable.finalY = 0;
    }
    doc.setFontSize(10);
    doc.setFontType("bold");
    doc.text("Request By", 13, doc.previousAutoTable.finalY + 20);
    doc.text("Check By", 65, doc.previousAutoTable.finalY + 20);
    doc.text("Verify By", 114, doc.previousAutoTable.finalY + 20);
    doc.text("Approve By", 164, doc.previousAutoTable.finalY + 20);
    doc.setFontSize(9);
    doc.setFontType("normal");
    doc.text(
      info.requested.requested_date,
      13,
      doc.previousAutoTable.finalY + 25
    );
    doc.text(
      info.requested.employment_id,
      13,
      doc.previousAutoTable.finalY + 30
    );
    doc.text(
      info.requested.requested_by,
      13,
      doc.previousAutoTable.finalY + 35
    );
    doc.text(info.requested.branch_name, 13, doc.previousAutoTable.finalY + 40);
    doc.text(
      info.requested.designations,
      13,
      doc.previousAutoTable.finalY + 45
    );
    doc.text(info.checked.checked_date, 65, doc.previousAutoTable.finalY + 25);
    doc.text(info.checked.employment_id, 65, doc.previousAutoTable.finalY + 30);
    doc.text(info.checked.checked_by, 65, doc.previousAutoTable.finalY + 35);
    doc.text(info.checked.branch_name, 65, doc.previousAutoTable.finalY + 40);
    doc.text(info.checked.designations, 65, doc.previousAutoTable.finalY + 45);
    doc.text(
      info.verified.verified_date,
      114,
      doc.previousAutoTable.finalY + 25
    );
    doc.text(
      info.verified.employment_id,
      114,
      doc.previousAutoTable.finalY + 30
    );
    doc.text(info.verified.verified_by, 114, doc.previousAutoTable.finalY + 35);
    doc.text(info.verified.branch_name, 114, doc.previousAutoTable.finalY + 40);
    doc.text(
      info.verified.designations,
      114,
      doc.previousAutoTable.finalY + 45
    );
    doc.text(
      info.approved.approved_date,
      164,
      doc.previousAutoTable.finalY + 25
    );
    doc.text(
      info.approved.employment_id,
      164,
      doc.previousAutoTable.finalY + 30
    );
    doc.text(info.approved.approved_by, 164, doc.previousAutoTable.finalY + 35);
    doc.text(info.approved.branch_name, 164, doc.previousAutoTable.finalY + 40);
    doc.text(
      info.approved.designations,
      164,
      doc.previousAutoTable.finalY + 45
    );
    // doc.save('TravelAdvanceClaimAllowance.pdf');
    print(doc, data);
  }

  _setTableData = (data) => {
    var table;
    let btnview,
      btnedit,
      view,
      edit = "";
    var l = [];
    var permission = this.props.permission;
    var has_action =
      permission.isView === 1 || permission.isEdit === 1 ? true : false;

    for (var i = 0; i < data.length; i++) {
      let result = data[i];
      let status = "";
      let obj = [];
      if (result.status === 0) {
        status =
          '<small class="label label-warning" style="background-color:#509aed"> Request </small>';
      } else if (result.status === 1) {
        status =
          '<small class="label label-warning" style="background-color:#b33ce0"> Check </small>';
      } else if (result.status === 2) {
        status =
          '<small class="label label-warning" style="background-color:#f2a509"> Verify </small>';
      } else if (result.status === 3) {
        status =
          '<small class="label label-warning" style="background-color:#29a50a"> Approve </small>';
      } else if (result.status === 4) {
        status =
          '<small class="label label-warning" style="background-color:#f60e2f"> Reject </small>';
      }
      else if (result.status === 5) {
        status = '<small class="label label-warning" style="background-color:#cc0066"> ReferBack </small>'
      }

      if (result.isClaim === 0) {
        btnview = "toView";
        btnedit = "toEdit";
        view = "view";
        edit = "edit";
      } else if (result.isClaim === 1) {
        btnview = "toClaimRequestView";
        btnedit = "toClaimRequestEdit";
        view = "CRView";
        edit = "CREdit";
      } else if (result.isClaim === 2) {
        btnview = "toAdvanceClaimRequestView";
        btnedit = "toAdvanceClaimRequestEdit";
        view = "ACRView";
        edit = "ACREdit";
      }
      obj = {
        no: i + 1,
        form_no: fno.fno_travel + result.form_no,
        employee_id: result.employment_id,
        employee: result.fullname,
        position: result.designations ? result.designations : "-",
        branch: result.branch_name,
        locationUnder: result.locationUnder ? result.locationUnder : "",
        // advancedNo: result.form_no,
        request_amount: result.advanced_amount,
        claim_amount: result.actual_amount,
        date: moment(result.createdAt).format("DD-MM-YYYY"),

        status: status,
        title:
          result.isClaim === 0
            ? '<small class="label label-warning" style="background-color:#b33ce0"> Advanced  </small>'
            : ' <small class="label label-warning" style="background-color:#f2a509"> Claimed  </small>',
      };
      if (has_action) {
        if (result.status !== 3) {
          obj.action =
            permission.isView === 1
              ? '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="' +
              btnview +
              '" ><span id="' +
              view +
              '"  class="hidden" >' +
              JSON.stringify(result) +
              '</span>  <i className="fa fa-cogs"></i>&nbsp;View</button>'
              : "";
          obj.action +=
            permission.isEdit === 1
              || (result.status == 5 && result.createdBy == this.state.user_id) ? '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="' +
              btnedit +
              '" ><span id="' +
              edit +
              '"  class="hidden" >' +
              JSON.stringify(result) +
            '</span>  <i className="fa fa-cogs"></i>&nbsp;Edit</button>'
              : "";
        } else {
          obj.action =
            permission.isView === 1
              ? '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="' +
              btnview +
              '" ><span id="' +
              view +
              '"  class="hidden" >' +
              JSON.stringify(result) +
              '</span>  <i className="fa fa-cogs"></i>&nbsp;View</button>'
              : "";
          if (result.print === 1) {
            obj.action +=
              '<button style="margin-right:10px" class="btn btn-info btn-sm own-btn-edit" id="toPrint" ><span id="print" class="hidden" >' +
              JSON.stringify(result) +
              '</span>  <i className="fa fa-cogs"></i>&nbsp;Printed</button>';
          } else {
            obj.action +=
              '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toPrint" ><span id="print" class="hidden" >' +
              JSON.stringify(result) +
              '</span>  <i className="fa fa-cogs"></i>&nbsp;Print</button>';
          }

        }
      }
      if (
        result.isClaim === 0 &&
        result.advancedClaim === 0 &&
        result.status === 3 &&
        result.createdBy === this.state.user_info.user_id
      ) {
        obj.action +=
          '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toClaim" ><span id="claim" class="hidden" >' +
          JSON.stringify(result) +
          '</span>  <i className="fa fa-cogs"></i>&nbsp;Claim</button>';
      }
      l.push(obj);
    }
    if ($.fn.dataTable.isDataTable("#dataTables-table")) {
      table = $("#dataTables-table").dataTable();
      table.fnClearTable();
      table.fnDestroy();
      $("#dataTables-table").empty();
    }

    var column = [
      { title: "No", data: "no" },
      { title: "Form No", data: "form_no" },
      { title: "Employee Id", data: "employee_id" },
      { title: "Employee Name", data: "employee" },
      { title: "Position", data: "position" },
      { title: "Branch", data: "branch" },
      { title: "Location under", data: "locationUnder" },
      // { title: "Form Number", data: "advancedNo" },
      { title: "Request Amount", data: "request_amount" },
      { title: "Claim Amount", data: "claim_amount" },
      { title: "Date", data: "date" },
      { title: "Status", data: "status" },
      { title: "Title", data: "title" },
    ];

    if (has_action) {
      column.push({ title: "Action", data: "action" });
    }

    table = $("#dataTables-table").DataTable({
      autofill: true,
      bLengthChange: false,
      bInfo: false,
      responsive: true,
      paging: true,
      buttons: true,
      pageLength: 50,
      dom: "Bfrtip",
      // buttons: ["copy", "csv", "excel", "pdf"],
      buttons: [
        'copy',
        {
          extend: 'csvHtml5',
          title: 'Travel Request',
        },
        {
          extend: 'excelHtml5',
          title: 'Travel Request',
        },
        {
          extend: 'pdfHtml5',
          title: 'Travel Request',
        }],
      data: l,
      columns: column,
    });
  };

  filter() {
    let s_date = moment(this.state.s_date).format("YYYY-MM-DD");
    let e_date = moment(this.state.e_date).format("YYYY-MM-DD");
    let branch_id = Array.isArray(this.state.selected_branch)
      ? 0
      : this.state.selected_branch.value;
    this.getTravelRequestFilter(
      s_date,
      e_date,
      this.state.user_info.user_id,
      branch_id
    );
  }

  render() {
    return (
      <div>
        <div className="row border-bottom white-bg dashboard-header">
          <div className="row">
            <div className="col-md-3">
              <div>
                <label className="col-sm-12">Start Date</label>
              </div>
              <div className="col-md-10">
                <DatePicker
                  dateFormat="DD/MM/YYYY"
                  value={this.state.s_date}
                  onChange={this.handleStartDate}
                  timeFormat={false}
                />
              </div>
            </div>
            <div className="col-md-3">
              <div>
                <label className="col-sm-12">End Date</label>
              </div>
              <div className="col-md-10">
                <DatePicker
                  dateFormat="DD/MM/YYYY"
                  value={this.state.e_date}
                  onChange={this.handleEndDate}
                  timeFormat={false}
                />
              </div>
            </div>
            <div className="col-md-3">
              <div>
                <label className="col-sm-12">Branch</label>
              </div>
              <div className="col-md-10">
                <Select
                  options={this.state.branch}
                  value={this.state.selected_branch}
                  onChange={this.handleBranch}
                  className="react-select-container checkValidate"
                  classNamePrefix="react-select"
                />
              </div>
            </div>
            <div className="col-md-3">
              <div className="col-md-10 margin-top-20">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={this.filter.bind(this)}
                >
                  Search
                </button>
              </div>
            </div>
          </div>
          <hr />
          <div className="row">
            <div class="btn-group-g ">
              <button
                type="button"
                class="btn label-request g"
                onClick={this.getRequest.bind(this)}
              >
                Request
              </button>
              <button
                type="button"
                class=" btn label-check g"
                onClick={this.getCheck.bind(this)}
              >
                Check
              </button>
              <button
                type="button"
                class="btn label-verified g"
                onClick={this.getVerified.bind(this)}
              >
                Verify
              </button>
              <button
                type="button"
                class="btn label-approve g"
                onClick={this.getApprove.bind(this)}
              >
                Approve
              </button>
              <button
                type="button"
                class="btn label-reject g"
                onClick={this.getReject.bind(this)}
              >
                Reject
              </button>
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-md-12">
              <table
                width="99%"
                className="table table-striped table-bordered table-hover responsive nowrap dt-responsive"
                id="dataTables-table"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
