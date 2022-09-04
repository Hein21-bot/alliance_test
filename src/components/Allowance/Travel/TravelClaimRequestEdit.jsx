import React, { Component } from "react";
import DocumentList from "../../Common/DocumentList";
import "datatables.net-bs4/css/dataTables.bootstrap4.min.css";
import "datatables.net-responsive-bs4/css/responsive.bootstrap4.min.css";
import "datatables.net-dt/css/jquery.dataTables.css";
import "datatables.net-buttons-dt/css/buttons.dataTables.css";
import { toast, ToastContainer } from "react-toastify";
import ApprovalForm from "../../Common/ApprovalForm";
import moment from "moment";
import Select from "react-select";
import DatePicker, { CalendarContainer } from "react-datepicker";
import DatePicker1_ from 'react-datetime';
import { format } from 'date-fns'
import "react-datepicker/dist/react-datepicker.css";
import {
  getUserId,
  validate,
  getActionStatus,
  main_url,
  havePermissionForAmount,
  stopSaving,
  startSaving,
  getBranch,
  isRequestedUser,
  fno,
} from "../../../utils/CommonFunction";
import { Fragment } from "react";
const $ = require("jquery");
const jzip = require("jzip");
window.JSZip = jzip;
$.DataTable = require("datatables.net-bs4");
$.DataTable = require("datatables.net-responsive-bs4");
$.DataTable = require("datatables.net");
require("datatables.net-buttons/js/dataTables.buttons.min");
require("datatables.net-buttons/js/buttons.html5.min");
var form_validate = true;
var saveBtn = false;
export default class TravelClaimRequestEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editId: null,
      branch: [],
      selected_location: [],
      claimDetailData: [
        {
          purpose: '',
          actual_date: new Date(),
          start_location: '',
          destination: '',
          start_time: new Date(),
          end_time: new Date(),
          noOfDays: 1,
          noOfNights: 0,
          meals: 0,
          lodging: 0,
          transport: 0,
          amount: 0,
          withdraw_location: 0
        }
      ],
      claimData: props.data.claimData[0],
      newDoc: [],
      document: props.data.document,
      updatedBy: getUserId("user_info"),
      is_main_role: havePermissionForAmount(
        this.props.work_flow_status,
        props.data.claimData[0].createdBy
      ),
      status_title: "",
      comment: "",

      showPicker: false,
      editPosition: {},
      selectedPicker: {
        id: null,
        isDatePicker: null,
        dataName: null,
        dateTimeValue: null,
      },
      initalDataState: null,
      dataSource: props.data.claimDetail,
      data: {
        user_id: getUserId("user_info"),
        actual_amount: 0,
        purpose: '',
        withdraw_location: 0
      },
    };
  }

  removeOldDocument(index, event) {
    var array = this.state.document;
    array.splice(index, 1);
    this.setState({
      document: array,
    });
  }

  removeNewDocument(index, event) {
    var array = this.state.newDoc;
    array.splice(index, 1);
    this.setState({
      newDoc: array,
    });
  }

  changeActualDate(index, value) {
    var array = this.state.dataSource;
    let data = this.state.claimDetailData[index];
    data.actual_date = value;
    array[index] = data;
    this.setState({
      claimDetailData: array,
    });
  }

  changeStartTime(index, value) {
    var array = this.state.dataSource;
    let data = this.state.claimDetailData[index];
    data.start_time = value;
    array[index] = data;
    this.setState({
      claimDetailData: array,
    });
  }

  changeEndTime(index, value) {
    var array = this.state.dataSource;
    let data = this.state.claimDetailData[index];
    data.end_time = value;
    array[index] = data;
    this.setState({
      claimDetailData: array,
    });
  }

  approvalStatus = (text, comment) => {
    this.setState({ status_title: text, comment: comment }, () => this.check());
  };

  changePurpose(index, e) {
    let data = this.state.claimDetailData;
    data[index].purpose = e.target.value;

    this.setState({
      claimDetailData: data,
    });
  }

  changeWithdrawLocation = (e) => {
    let data = this.state.claimData;
    data.withdraw_location = e.value;
    this.setState({
      selected_location: e,
      claimData: data,
    });
  };

  handleChangeMeal(index, value) {
    var array = this.state.dataSource;
    var claimData = this.state.claimData;
    var totalAmount = 0;
    let data = array[index];
    data.meals = value;

    data.amount =
      Number(data.meals) + Number(data.transport) + Number(data.lodging);
    array[index] = data;
    for (var i = 0; i < array.length; i++) {
      totalAmount += Number(array[i].amount);
    }
    claimData.actual_amount = totalAmount;
    this.setState(
      {
        claimDetailData: array,
        claimData: claimData,
      },
      () => this.showClaimData()
    );
  }

  handleChangelodging(index, value) {
    var array = this.state.dataSource;
    var claimData = this.state.claimData;
    var totalAmount = 0;
    let data = array[index];
    data.lodging = value;

    data.amount =
      Number(data.meals) + Number(data.transport) + Number(data.lodging);
    array[index] = data;
    for (var i = 0; i < array.length; i++) {
      totalAmount += Number(array[i].amount);
    }
    claimData.actual_amount = totalAmount;
    this.setState(
      {
        claimDetailData: array,
        claimData: claimData,
      },
      () => this.showClaimData()
    );
  }

  handleChangeTransport(index, value) {
    var array = this.state.dataSource;
    var claimData = this.state.claimData;
    var totalAmount = 0;
    let data = array[index];
    data.transport = value;

    data.amount =
      Number(data.meals) + Number(data.transport) + Number(data.lodging);
    array[index] = data;
    for (var i = 0; i < array.length; i++) {
      totalAmount += Number(array[i].amount);
    }
    claimData.actual_amount = totalAmount;
    this.setState(
      {
        claimDetailData: array,
        claimData: claimData,
      },
      () => this.showClaimData()
    );
  }

  claimChangeText(index, value) {
    var totalAmount = 0;
    const array = this.state.claimDetailData;
    var claimData = this.state.claimData;
    var name = value.target.dataset.name;
    let data = this.state.claimDetailData[index];
    data[name] = value.target.value;


    if (name === "meals" || name === "transport" || name === "lodging") {
      data.amount =
        Number(data.meals) + Number(data.transport) + Number(data.lodging);
    }
    array[index] = data;
    for (var i = 0; i < array.length; i++) {
      totalAmount += Number(array[i].amount);
    }
    claimData.actual_amount = totalAmount;
    this.setState({
      claimDetailData: array,
      //claimData: claimData,
    });
  }


  changeactual_date(index, value) {
    var array = this.state.dataSource;
    let data = this.state.claimDetailData[index];
    data.actual_date = value;
    array[index] = data;
    this.setState({
      claimDetailData: array,
    });
  }

  async componentDidMount() {
    let branch = await getBranch();
    let selected_location = this.getSelectedLocation(
      branch,
      this.props.data.claimData[0].withdraw_location
    );
    this.showClaimData();
    this.setState({
      branch: branch,
      selected_location: selected_location,
    });
    var that = this;
    $("#claim-table").on("change", "#meal", function () {
      var index = $(this).next().text();
      var value = $(this).val();
      that.handleChangeMeal(index, value);
    });
    $("#claim-table").on("change", "#lodging", function () {
      var index = $(this).next().text();
      var value = $(this).val();
      that.handleChangelodging(index, value);
    });
    $("#claim-table").on("change", "#transport", function () {
      var index = $(this).next().text();
      var value = $(this).val();
      that.handleChangeTransport(index, value);
    });

    that.setDataTable(this.state.dataSource)

    $(document).on('click', '#toRemove', function () {

      var data = $(this).find("#remove").text();
      data = $.parseJSON(data);

      let newData = that.state.dataSource;
      newData.splice(data, 1);

      let claimData = that.state.data;
      var totalAmount = 0

      for (var i = 0; i < newData.length; i++) {
        totalAmount += newData[i].amount;
      }
      claimData.actual_amount = totalAmount;
      that.setState({
        dataSource: newData,
        data: claimData
      }, () => that.setDataTable(newData))

    });

    $(document).on('click', '#toEdit', function () {
      var data = $(this).find("#edit").text();
      data = $.parseJSON(data);
      var newObj = { ...that.state.claimDetailData[0] }
      newObj.purpose = data.purpose
      newObj.actual_date = moment(data.actual_date).format('DD/MM/YYYY')
      newObj.start_location = data.start_location
      newObj.destination = data.destination
      newObj.start_time = data.start_time
      newObj.end_time = data.end_time
      newObj.noOfDays = data.noOfDays
      newObj.noOfNights = data.noOfNights
      newObj.meals = data.meals
      newObj.lodging = data.lodging
      newObj.transport = data.transport
      newObj.amount = data.amount
      that.setState({ claimDetailData: [newObj], editId: data.travel_detail_id })
    });
  }

  getSelectedLocation(branch, location) {
    let selected = branch.filter(function (b) {
      return b.value == location;
    });
    return selected;
  }

  componentDidUpdate(prevProps) {
    if (!form_validate) validate("check_form");

    if (prevProps.claimData !== this.props.claimData) {
      this.setState({
        claimData: this.props.claimData
      })
    }
  }

  handlefileChanged(event) {
    event.preventDefault();
    let newDoc = this.state.newDoc;
    var obj = document.querySelector("#dropTravelCREdit").files.length;
    for (var i = 0; i < obj; i++) {
      var getfile = document.querySelector("#dropTravelCREdit").files[i];
      newDoc.push(getfile);
    }
    document.querySelector("#dropTravelCREdit").value = ''
    this.setState({
      newDoc: newDoc,
    });
  }

  check = () => {
    console.log("fjaksfjsjfj")
    if (validate("check_form")) {
      stopSaving();
      var { status_title, is_main_role } = this.state;
      var info = [this.state.claimData].map((v) => ({
        ...v,
        status: v.status == 5 ? 0 : v.status,
      }))[0];
      var newData = this.state.dataSource.map((v) => ({
        ...v,
        start_time: moment(v.start_time).utc().format('YYYY-MM-DD HH:mm:ss'),
        end_time: moment(v.end_time).utc().format('YYYY-MM-DD HH:mm:ss')
      }))
      //	TR22030002
      if (status_title !== "" && is_main_role) {
        var action = getActionStatus(
          status_title,
          this.state.claimData,
          this.state.updatedBy,
          this.state.comment
        );
        info.referback_by = action.referback_by;
        info.checked_by = action.checked_by;
        info.verified_by = action.verified_by;
        info.approved_by = action.approved_by;
        info.rejected_by = action.rejected_by;
        info.referback_date = action.referback_date;
        info.checked_date = action.checked_date;
        info.verified_date = action.verified_date;
        info.approved_date = action.approved_date;
        info.rejected_date = action.rejected_date;
        info.referback_comment = action.referback_comment;
        info.checked_comment = action.checked_comment;
        info.verified_comment = action.verified_comment;
        info.approved_comment = action.approved_comment;
        info.status = action.status;
      }
      const formdata = new FormData();

      var obj = this.state.newDoc.length;
      for (var i = 0; i < obj; i++) {
        var imagedata = this.state.newDoc[i];
        formdata.append("uploadfile", imagedata);
      }

      formdata.append("claimData", JSON.stringify(info));
      formdata.append("document", JSON.stringify(this.state.document));
      // formdata.append("claimDetail", JSON.stringify(this.state.dataSource));
      formdata.append("claimDetail", JSON.stringify(newData));
      formdata.append("updatedBy", JSON.stringify(info));
      let status = 0;
      // fetch(
      //   main_url +
      //   "allowance/editClaimTravelRequestAllowancefas/" +
      //   this.props.data.claimData[0].travel_allowance_id,
      //   {
      //     method: "POST",
      //     body: formdata,
      //   }
      // )
      //   .then((res) => {
      //     status = res.status;
      //     return res.text();
      //   })
      //   .then((text) => {
      //     this.props.showToast(status, text);
      //   });
    } else {
      // startSaving();
      form_validate = false;
    }
  };

  showClaimData() {
    var claimDetail = [];
    var table;
    for (var i = 0; i < this.state.claimDetailData.length; i++) {
      var data = this.state.claimDetailData[i];
      data.index = i;
      claimDetail.push(
        {
          actualDate: `<button
                          id='${i}'
                          data-name='actual_date'
                          class="form-control ${"actual_date" + i}"
                          value='${data.actual_date}'
                        >
                        ${moment(data.actual_date).format("DD/MM/YYYY")}  
                        </button>
                `,
          startLoc: `<input
                        id='${i}'
                        class="form-control checkValidate"
                        data-name="start_location"
                        value='${data.start_location}'
                        onChange=${this.claimChangeText.bind(this, i)}
                    />`,
          destination: `<input
            id='${i}'
                        data-name="destination"
                        class="form-control checkValidate"
                        value='${data.destination}'
                        onChange=${this.claimChangeText.bind(this, i)}
                    />`,
          startTime: `<button
                        id='${i}'
                        data-name='start_time'
                        class="form-control ${"start_time" + i}"
                        value='${data.start_time}'
                      >
                      ${moment(data.start_time).utc().format("h:mm a")}
                      </button>`,
          endTime: `<button
                    id='${i}'
                    data-name='end_time'
                    class="form-control ${'end_time' + i}"
                    value='${data.end_time}'
                  >
                  ${moment(data.end_time).utc().format("h:mm a")}
                  </button>`,
          noOfDays: `<input type="number"
                        id='${i}'
                        class="form-control checkValidate"
                        value=${data.noOfDays}
                        data-name="noOfDays"
                        onChange=${this.claimChangeText.bind(this, i)}
                    />`,
          noOfNights: `<input type="number"
                        id='${i}'
                        class="form-control"
                        value=${data.noOfNights}
                        data-name="noOfNights"
                        onChange=${this.claimChangeText.bind(this, i)}
                    />`,
          meals: `<input type="number"
                        id="${i}"
                        class="form-control"
                        data-name="meals"
                        value=${data.meals}
                        ${isRequestedUser(
            this.state.updatedBy,
            this.state.claimData.createdBy
          )
              ? "disabled"
              : ""
            }
                    /><span class="hidden">${i}</span>`,
          lodging: `<input type="number"
                        id="${i}"
                        class="form-control"
                        value=${data.lodging}
                        data-name="lodging"
                        ${isRequestedUser(
            this.state.updatedBy,
            this.state.claimData.createdBy
          )
              ? "disabled"
              : ""
            }
                    /><span class="hidden">${i}</span>`,
          transport: `<input type="number"
                        id="${i}"
                        class="form-control"
                        value=${data.transport}
                        data-name="transport"
                        ${isRequestedUser(
            this.state.updatedBy,
            this.state.claimData.createdBy
          )
              ? "disabled"
              : ""
            }
                    /><span class="hidden">${i}</span>`,
          amount: `<input
                        id='${i}'
                        class="form-control amount1"
                        value=${data.amount}
                        disabled
                    />`,
          purpose: `<input 
          id='${i}'
                        class="form-control"
                        value='${data.purpose}'
                        type="textarea"
                        data-name="purpose"
                        onChange=${this.changePurpose.bind(this, i)}
                    />`,
        }
      );
    }

    if ($.fn.dataTable.isDataTable("#claim-table")) {
      table = $("#claim-table").dataTable({
        destroy: true,
        searching: false,
        // "columnDefs": [ {
        //   "targets": -1,
        //   "data": null,
        //   "defaultContent": '<input id="check" type="checkbox">'
        // }]
      });
      // table.fnClearTable();
      table.fnDestroy();
      //  $("#claim-table").empty();
    }

    var column = [
      { title: "Acutal Date", data: "actualDate" },
      { title: "Start Location", data: "startLoc" },
      { title: "Destination", data: "destination" },
      { title: "Start Time", data: "startTime" },
      { title: "End Time", data: "endTime" },
      { title: "No Of Days", data: "noOfDays" },
      { title: "No Of Nights", data: "noOfNights" },
      { title: "Meals", data: "meals" },
      { title: "Lodging", data: "lodging" },
      { title: "Transport", data: "transport" },
      { title: "Amount", data: "amount" },
      { title: "Purpose", data: "purpose" },
    ];
    table = $("#claim-table").DataTable({
      autofill: true,
      searching: false,
      bLengthChange: false,
      bInfo: false,
      responsive: true,
      buttons: false,
      paging: false,
      // dom: 'Bfrtip',
      buttons: [],
      data: claimDetail,
      columns: column,
    });

    var self = this;

    $("#claim-table").on("click", "tbody button", function (e) {
      const dataName = e.target.dataset.name;
      const id = e.target.id;
      const element = document.getElementsByClassName(dataName + e.target.id)[0];

      const top = element.offsetTop;
      const left = element.offsetLeft;

      const parentTop = element.parentElement.offsetTop == 0 ?
        element.parentElement.parentElement.offsetTop + 80 :
        element.parentElement.offsetTop;
      const parentLeft = element.parentElement.offsetLeft

      const editPosition = {
        top: top + parentTop,
        left: left + parentLeft,
      };
      var obj = { ...self.state.selectedPicker };
      obj.id = id;
      obj.isDatePicker = dataName == "actual_date" ? true : false;
      obj.dataName = dataName;
      obj.dateTimeValue = e.target.value;
      self.setState(
        {
          editPosition,
          selectedPicker: obj,
        },
        () => self.setState({ showPicker: true })
      );
    });

    var table = $('#claim-table').DataTable();

    $("#claim-table").on("keyup", "tbody  input", function (e) {
      if (e.target.dataset.name == "purpose") {
        let data = self.state.claimDetailData;
        data[e.target.id].purpose = e.target.value;

        self.setState({
          claimDetailData: data,
        });
      } else {
        var totalAmount = 0;
        var array = self.state.claimDetailData;
        const claimData = self.state.claimData;
        var name = e.target.dataset.name;
        let data = self.state.claimDetailData[e.target.id];
        data[name] = e.target.value;
        if (name === "meals" || name === "transport" || name === "lodging") {
          data.amount =
            Number(data.meals) + Number(data.transport) + Number(data.lodging);
        }


        array[e.target.id] = data;
        for (var i = 0; i < array.length; i++) {
          totalAmount += Number(array[i].amount);
        }

        claimData.actual_amount = totalAmount;
        // array[e.target.id].amount = totalAmount;
        self.setState({
          claimDetailData: array,
          claimData: claimData,
        }, () => {
        });
      }
    });
  }

  addData = (e) => {
    if (validate('add_check_form')) {
      var data = this.state.dataSource;
      let claimData = this.state.data;
      var totalAmount = 0
      if (this.state.editId) {
        const index = data.findIndex(v => v.travel_detail_id === this.state.editId)
        const editData = { travel_detail_id: this.state.editId, ...this.state.claimDetailData[0] }
        data.splice(index, 1, editData)
      } else {
        data.push(this.state.claimDetailData[0])
      }

      this.setState({
        dataSource: data
      })

      for (var i = 0; i < data.length; i++) {

        totalAmount += parseInt(data[i].amount);
      }
      // let claimData = this.state.data;
      claimData.actual_amount = totalAmount;
      saveBtn = true
      form_validate = true
      this.setDataTable(data)
      this.setState({
        claimDetailData: [{
          purpose: '',
          actual_date: new Date(),
          start_location: '',
          destination: '',
          start_time: new Date(),
          end_time: new Date(),
          noOfDays: 1,
          noOfNights: 0,
          meals: 0,
          lodging: 0,
          transport: 0,
          amount: 0,
          withdraw_location: 0
        }],
        data: claimData,
      })
    }
    else {
      form_validate = false;
    }


  }

  setDataTable(data) {
    var table;
    if ($.fn.dataTable.isDataTable('#dataTables-claimTable')) {
      table = $('#dataTables-claimTable').dataTable();
      table.fnClearTable();
      table.fnDestroy();
      $('#dataTables-claimTable').empty()
    }

    var l = []
    for (var i = 0; i < data.length; i++) {
      const index = i
      const obj = {
        no: i + 1,
        actual_date: moment(data[i].actual_date).format("DD/MM/YYYY"),
        start_location: data[i].start_location,
        destination: data[i].destination,
        start_time: data[i].start_time ? moment(data[i].start_time).utc().format(' h:mm a') : 0,
        end_time: data[i].end_time ? moment(data[i].end_time).utc().format(' h:mm a') : 0,
        noOfDays: data[i].noOfDays,
        noOfNights: data[i].noOfNights,
        meals: data[i].meals,
        lodging: data[i].lodging,
        transport: data[i].transport,
        amount: data[i].amount,
        action:
          '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toEdit" ><span id="edit" class="hidden" >' + JSON.stringify(data[i]) + '</span>  <i className="fa fa-cogs"></i>&nbsp;Edit</button><button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toRemove" ><span id="remove" class="hidden" >' + index + '</span>  <i className="fa fa-cogs"></i>&nbsp;Remove</button>'
      }
      l.push(obj)
    }

    table = $("#dataTables-claimTable").DataTable({
      autofill: false,
      bLengthChange: false,
      bInfo: false,
      responsive: true,
      paging: false,
      buttons: false,

      data: l,
      columns: [
        { title: 'No', data: 'no' },
        { title: "Acutal Date", data: "actual_date" },
        { title: "Start Location", data: "start_location" },
        { title: "Destination", data: "destination" },
        { title: "Start Time", data: "start_time" },
        { title: "End Time", data: "end_time" },
        { title: "No Of Days", data: "noOfDays" },
        { title: "No Of Nights", data: "noOfNights" },
        { title: "Meals", data: "meals" },
        { title: "Lodging", data: "lodging" },
        { title: "Transport", data: "transport" },
        { title: "Amount", data: "amount" },
        { title: "Action", data: "action" }

      ],
    });

  }

  handleSelectPicker = (date) => {

    const array = this.state.claimDetailData;
    const i = this.state.selectedPicker.id;
    const dataName = this.state.selectedPicker.dataName;

    array[i][dataName] = new Date(date);

    this.setState({ claimDetailData: array, showPicker: false }, () =>
      this.showClaimData(),
    );
  };

  MyContainer = ({ className, children }) => {
    return (
      <CalendarContainer className={className}>
        <div className='d-flex flex-row text-right mx-3' style={{ margin: '5px 10px 0px 10px' }}>
          <i className="fa fa-close text-muted" style={{ cursor: 'pointer' }} onClick={() => this.setState({ showPicker: false })}></i>
        </div>
        <div style={{ position: "relative" }}>{children}</div>
      </CalendarContainer>
    );
  };

  render() {
    let total_lodging = this.state.dataSource.length > 0 ?
      this.state.dataSource
        .map((v) => v.lodging ? parseInt(v.lodging) : v.lodging)
        .reduce(
          (accumulator, currentValue, currentIndex, array) =>
            accumulator + currentValue + (this.state.claimDetailData[0].amount)
        ) : 0;
    let total_actual_amount = this.state.dataSource.length > 0 ?
      this.state.dataSource
        .map((v) => v.actual_amount ? parseInt(v.amount) : v.amount)
        .reduce(
          (accumulator, currentValue, currentIndex, array) =>
            accumulator + currentValue
        ) : 0;

    let total_meals = this.state.dataSource.length > 0 ?
      this.state.dataSource
        .map((v) => v.meals ? parseInt(v.meals) : v.meals)
        .reduce(
          (accumulator, currentValue, currentIndex, array) =>
            accumulator + currentValue
        ) : 0;
    let total_transport = this.state.dataSource.length > 0 ?
      this.state.dataSource
        .map((v) => v.transport ? parseInt(v.transport) : v.transport)
        .reduce(
          (accumulator, currentValue, currentIndex, array) =>
            accumulator + currentValue
        ) : 0;
    let { is_main_role, selectedPicker, editPosition } = this.state;

    return (
      <div>
        <ToastContainer position={toast.POSITION.TOP_RIGHT} />
        {this.state.showPicker &&
          <Fragment>
            {selectedPicker.isDatePicker ? (
              <div
                style={{
                  position: "absolute",
                  zIndex: 100,
                  marginTop: editPosition.top + 85,
                  marginLeft: editPosition.left,
                }}
              >
                <DatePicker
                  calendarContainer={this.MyContainer}
                  selected={new Date(selectedPicker.dateTimeValue)}
                  onChange={(date) => this.handleSelectPicker(date)}
                  inline
                />
              </div>
            ) : (
              <div
                style={{
                  position: "absolute",
                  zIndex: 100,
                  marginTop: editPosition.top + 90,
                  marginLeft: editPosition.left + 40,
                }}
              >
                <DatePicker
                  calendarContainer={this.MyContainer}
                  selected={new Date(selectedPicker.dateTimeValue)}
                  onChange={(date) => this.handleSelectPicker(date)}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={1}
                  timeCaption="Time"
                  dateFormat="h:mm aa"
                  inline
                />
              </div>
            )
            }
          </Fragment>
        }
        <div className="row wrapper border-bottom white-bg">
          <div className="row margin-top-20" >
            <div className="form-horizontal" name="demo-form">
              <div className="col-md-12" style={{ marginBottom: 20 }}>
                <div className="p-md">
                  {/* <table
                    width="99%"
                    className="table table-striped table-bordered table-hover table-responsive nowrap dt-responsive"
                    id="claim-table"
                  /> */}
                </div>
                <div className="ibox float-e-margins" id="add_check_form">
                  <div className="ibox-content p-md">
                    <div className="row">
                      <div className="col-md-3">
                        <label>Actual Date</label>
                        <DatePicker1_
                          dateFormat="DD/MM/YYYY"
                          value={(this.state.claimDetailData[0].actual_date)}
                          timeFormat={false}
                          onChange={this.changeactual_date.bind(this, 0)}
                        />
                      </div>
                      <div className="col-md-3">
                        <label>Start Location</label>
                        <input
                          className="form-control checkValidate"
                          type="text"
                          data-name='start_location'
                          value={this.state.claimDetailData[0].start_location}
                          placeholder="Enter Start Location"
                          onChange={this.claimChangeText.bind(this, 0)}

                        />
                      </div>
                      <div className="col-md-3">
                        <label>Destination</label>
                        <input
                          className="form-control checkValidate"
                          type="text"
                          data-name='destination'
                          value={this.state.claimDetailData[0].destination}
                          placeholder="Enter Destination"
                          onChange={this.claimChangeText.bind(this, 0)}

                        />

                      </div>
                    </div>
                    <div className="row margin-top-20">
                      <div className="col-md-3">
                        <label>Start Time</label>
                        <DatePicker1_
                          timeFormat={true}
                          value={moment(this.state.claimDetailData[0].start_time).format("h:mm a")}
                          dateFormat={false}
                          onChange={this.changeStartTime.bind(this, 0)}
                        />
                      </div>
                      <div className="col-md-3">
                        <label>End Time</label>
                        <DatePicker1_
                          timeFormat={true}
                          value={moment(this.state.claimDetailData[0].end_time).format("h:mm a")}
                          dateFormat={false}
                          onChange={this.changeEndTime.bind(this, 0)}
                        />
                      </div>
                      <div className="col-md-3">
                        <label>No Of Days</label>
                        <input
                          className="form-control checkValidate"
                          type="number"
                          data-name='noOfDays'
                          value={this.state.claimDetailData[0].noOfDays}
                          placeholder="No Of Days"
                          onChange={this.claimChangeText.bind(this, 0)}

                        />
                      </div>
                      <div className="col-md-3">
                        <label>No Of Nights</label>
                        <input
                          className="form-control"
                          type="number"
                          data-name='noOfNights'
                          value={this.state.claimDetailData[0].noOfNights}
                          placeholder="No Of Nights"
                          onChange={this.claimChangeText.bind(this, 0)}
                        />
                      </div>
                    </div>
                    <div className="row margin-top-20">
                      <div className="col-md-3">
                        <label>Meals</label>
                        <input
                          className="form-control"
                          type="number"
                          data-name='meals'
                          value={this.state.claimDetailData[0].meals}
                          placeholder="Enter Meals"
                          onChange={this.claimChangeText.bind(this, 0)}

                        />
                      </div>
                      <div className="col-md-3">
                        <label>Lodging</label>
                        <input
                          className="form-control"
                          type="number"
                          data-name='lodging'
                          value={this.state.claimDetailData[0].lodging}
                          placeholder="Enter Lodging"
                          onChange={this.claimChangeText.bind(this, 0)}

                        />
                      </div>
                      <div className="col-md-3">
                        <label>Transport</label>
                        <input
                          className="form-control"
                          type="number"
                          data-name='transport'
                          value={this.state.claimDetailData[0].transport}
                          placeholder="Enter Transport"
                          onChange={this.claimChangeText.bind(this, 0)}

                        />
                      </div>
                      <div className="col-md-3">
                        <label>Total Amount</label>
                        <input
                          className="form-control input-md"
                          type="number"
                          disabled
                          data-name='amount'
                          value={this.state.claimDetailData[0].amount}

                        />
                      </div>
                    </div>
                    <div className="row margin-top-20">
                      <div className="col-md-6">
                        <label>Purpose</label>
                        <input
                          className="form-control"
                          type="textarea"
                          data-name='purpose'
                          rows="5" cols="30"
                          value={this.state.claimDetailData[0].purpose}
                          placeholder="Enter Purpose"
                          onChange={this.changePurpose.bind(this, 0)}

                        />
                      </div>
                      <div className="col-md-6 btn-rightend">

                        <button className="btn-primary btn" onClick={this.addData} style={{ marginTop: 20 }}>Add</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-12">

                <table width="99%"
                  className="table table-striped table-bordered table-hover responsive nowrap dt-responsive"
                  id="dataTables-claimTable"
                />

              </div>
              <div className="col-md-12" id="check_form">
                <div className="col-md-2">
                  <label>Actual Amount </label>
                  <input
                    className="form-control"
                    disabled
                    value={total_actual_amount}
                  />
                </div>
                <div className="col-md-2">
                  <label>Total Meals </label>
                  <input
                    className="form-control"
                    value={total_meals}
                    disabled
                  />
                </div>
                <div className="col-md-2">
                  <label>Total Lodging </label>
                  <input
                    className="form-control"
                    value={total_lodging}
                    disabled
                  />
                </div>
                <div className="col-md-2">
                  <label>Total Transport </label>
                  <input
                    className="form-control"
                    value={total_transport}
                    disabled
                  />
                </div>
                <div className="col-md-4">
                  <label>Withdraw Location</label>
                  <Select
                    data-name="withdraw_loction"
                    value={this.state.selected_location}
                    onChange={this.changeWithdrawLocation}
                    options={this.state.branch}
                    className="react-select-container checkValidate"
                    classNamePrefix="react-select"
                  />
                </div>
                <div className="col-md-3">
                  <label>Branch</label>
                  <input
                    className="form-control"
                    value={this.props.data.claimData[0].branch_name}
                    disabled
                  />
                </div>
                <div className="col-md-3">
                  <label>Name</label>
                  <input
                    className="form-control"
                    value={this.props.data.claimData[0].fullname}
                    disabled
                  />
                </div>
                <div className="col-md-3">
                  <label>Position</label>
                  <input
                    className="form-control"
                    value={this.props.data.claimData[0].position}
                    disabled
                  />
                </div>
                <div className="col-md-3">
                  <label>Voucher No</label>
                  <input
                    className="form-control"
                    value={
                      fno.fno_travel + this.props.data.claimData[0].form_no
                    }
                    disabled
                  />
                </div>
              </div>
              {this.state.is_main_role ? (
                this.state.document.length > 0 ? (
                  <div className="margin-top-20 col-md-12 document-main">
                    <input
                      className="full_width hidden"
                      type="file"
                      id="dropTravelCREdit"
                    ></input>

                    <DocumentList
                      title="Travel Document"
                      doc={this.state.document}
                      path="travel"
                    />
                  </div>
                ) : (
                  <input
                    className="full_width hidden"
                    type="file"
                    id="dropTravelCREdit"
                  ></input>
                )
              ) : (
                <div className="col-md-12 margin-top-20">
                  <div className="col-md-12">
                    <h4>Travel Document</h4>
                  </div>
                  <div className="col-md-12">
                    <input
                      type="file"
                      className="dropZone"
                      id="dropTravelCREdit"
                      onChange={this.handlefileChanged.bind(this)}
                      multiple
                    />
                  </div>

                  <div className="ibox float-e-margins">
                    <div className="p-md col-md-12" style={{ float: "left" }}>
                      {this.state.document.map((data, index) => (
                        <div
                          key={index}
                          className="fileuploader-items col-md-4"
                        >
                          <ul className="fileuploader-items-list">
                            <li className="fileuploader-item file-has-popup file-type-application file-ext-odt">
                              <div className="columns">
                                <div className="column-title">
                                  <a
                                    href={`${main_url}travel/getCRDocumentData/${data.name}`}
                                    download
                                    target="_blank"
                                    className="btn btn-primary document-body-bt document-width"
                                  >
                                    {data.name.split("&@")[1]}
                                  </a>
                                </div>
                                <div className="column-actions">
                                  <a
                                    className="fileuploader-action fileuploader-action-remove"
                                    onClick={(event) =>
                                      this.removeOldDocument(index, event)
                                    }
                                  >
                                    {" "}
                                    <i></i>
                                  </a>
                                </div>
                              </div>
                            </li>
                          </ul>
                        </div>
                      ))}
                      {this.state.newDoc.map((data, index) => (
                        <div className="fileuploader-items col-md-4">
                          <ul className="fileuploader-items-list">
                            <li className="fileuploader-item file-has-popup file-type-application file-ext-odt">
                              <div className="columns">
                                <div className="column-title">
                                  <a
                                    href="#"
                                    className="btn btn-primary document-body-bt document-width"
                                  >
                                    {data.name}
                                  </a>
                                </div>
                                <div className="column-actions">
                                  <a
                                    className="fileuploader-action fileuploader-action-remove"
                                    onClick={(event) =>
                                      this.removeNewDocument(index, event)
                                    }
                                  >
                                    {" "}
                                    <i></i>
                                  </a>
                                </div>
                              </div>
                            </li>
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="row save-btn margin-top-20">
            {is_main_role ? (
              <ApprovalForm
                approvalStatus={this.approvalStatus.bind(this)}
                status={this.state.claimData.status}
                work_flow={this.props.work_flow_status}
                total_amount={this.state.claimData.total_amount}
              />
            ) : (
              <div className="col-md-12 btn-rightend">
                <div>
                  {this.state.claimData.status == undefined ||
                    this.state.claimData.status == 5 ? (
                    <div>
                      <button
                        onClick={this.check.bind(this)}
                        className="btn btn-primary"
                        id="saving_button"
                        type="button"
                      >
                        <span>Confirm</span>{" "}
                      </button>
                    </div>
                  ) : (
                    ""
                  )}
                </div>

                {/* <button
                    onClick={this.check.bind(this)}
                    id="saving_button"
                    className="btn btn-primary"
                  >
                    <span>Confirm</span>{" "}
                  </button> */}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}