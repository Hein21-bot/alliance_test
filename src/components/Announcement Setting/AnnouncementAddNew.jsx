import React, { Component } from 'react';
import Select from 'react-select';
import DatePicker from 'react-datetime';
import { main_url, getCookieData, validate,stopSaving, getBranch, startSaving,getUserId } from "../../utils/CommonFunction";
var form_validate = true;

var form_validate = true;
export default class AnnouncementAddNew 
    extends Component {
    constructor(props) {
        super(props);
         this.state = {
            branchlist: [],
            selected_branch:[],
            data: {
                user_id: getUserId("user_info"),
                createdBy: getUserId("user_info"),
                title:'',
                description:'',
                startDate: new Date(),
                endDate: new Date(),
                target_branch: ''          
              },
              
        }
    }

    componentDidUpdate() {
        if (!form_validate) validate('check_form')
    }

    async componentDidMount() {
        let branch = await getBranch();
        branch.unshift({ label: 'All', value: 0 })
        this.setState({
            branchlist: branch,
        })
    }

    handleBranch = (event) => {
        let data =  this.state.data;
        data.target_branch = event.value;
        this.setState({
            selected_branch: event,
            data: data
        })
    }

    changeStartDate(value) {
        let data = this.state.data;
        data.startDate = value
        this.setState({
            data: data,

        })
    }

    changeEndDate(value) {
        let data = this.state.data;
        data.endDate = value
        this.setState({
            data: data,

        })
    }

    handleTitle = (event) => {
        let data = this.state.data;
        data.title = event.target.value
        this.setState({
            data: data
        })
    }

    handleDescription = (event) => {
        let data = this.state.data;
        data.description = event.target.value
        this.setState({
           data: data       
         });
    };

    handlefileChanged(event) {
        event.preventDefault();
        let arr = [];
        let url = [];
        for (let i = 0; i < event.target.files.length; i++) {
            let reader = new FileReader();
            let getfile = event.target.files[i];
            reader.onloadend = (r) => {
                url.push(r.target.result);
            }
            reader.readAsDataURL(getfile);
            arr.push(getfile);
        }
    }
    
    addAnnouncement = (data) => {
        const formdata = new FormData();

        var obj = document.querySelector("#HDDropZone").files.length;
        for (var i = 0; i < obj; i++) {
            var imagedata = document.querySelector("#HDDropZone").files[i];
            formdata.append('uploadfile', imagedata);
        }

        formdata.append('info', JSON.stringify(data))
        let status = 0;
        fetch(main_url + 'announcement/addAnnouncement', {
            method: "POST",
            body: formdata
        })
            .then(res => {
                status = res.status;
                return res.text()
            })
            .then(text => {
                this.props.showToast(status, text);
            })
    }
    

    check = () => {
        stopSaving();
        if (validate('check_form')) {
            this.props.addAnnouncement(this.state.data);
        }
        else {
            startSaving();
            form_validate = false;
        }
    }

    render() {
        return (
            <div className="wrapper wrapper-content">
              <div className="form-horizontal" id="check_form">
                   <div className='row'>
                        <div className=" form-group col-md-6">
                            <div><label className="col-sm-12">Title</label></div>
                            <div className="col-sm-10">
                                <input
                                 className="form-control input-md checkValidate"
                                 type="text"
                                 onChange={this.handleTitle}
                                 value={this.state.data.title}
                                 placeholder="Enter Title"
                                  />
                            </div>
                        </div>
                        <div className=" form-group col-md-6">
                            <div><label htmlFor="target-group" className="col-sm-12">Target Group</label></div>
                            <div className="col-sm-10">
                                <Select
                                    options={this.state.branchlist}
                                    placeholder="Choose Your Target Group"
                                    value={this.state.selected_branch}
                                    onChange={this.handleBranch}
                                    className='react-select-container  checkValidate'
                                    classNamePrefix="react-select"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="form-group col-md-6">
                            <div><label htmlFor="start" className="col-sm-12">Start Date</label></div>
                            <div className="col-sm-10">
                                <DatePicker
                                     dateFormat="DD-MM-YYYY"
                                     value={this.state.data.startDate}
                                     timeFormat={false}
                                     onChange={this.changeStartDate.bind(this)}
                                   />
                            </div>
                        </div>
                        <div className="form-group col-md-6">
                            <div><label htmlFor="end" className="col-sm-12">End Date</label></div>
                            <div className="col-sm-10">
                                <DatePicker
                                    dateFormat='DD-MM-YYYY'
                                    value={this.state.data.endDate}
                                    timeFormat = {false}
                                    onChange={this.changeEndDate.bind(this)}
                                />
                            </div>
                        </div>
                    </div>
                     <div className="row">
                        <div className="form-group col-md-6">
                            <div><label htmlFor="description" className="col-sm-12">Please Enter The Description </label></div>
                            <div className="col-sm-10">
                                <textarea
                                    name="description"
                                    className="form-control checkValidate"
                                    cols="10"
                                    rows="6"
                                    value={this.state.data.description}
                                    placeholder="Provice The Description"
                                    onChange={this.handleDescription}
                                 />
                            </div>
                        </div>
                        <div className="form-group col-md-6">
                            <div><label className="col-sm-12">Announcement Document</label></div>
                            <div className="col-sm-10">
                                <input type="file" id="HDDropZone"  className="dropZone form-control" onChange={this.handlefileChanged.bind(this)} multiple></input>
                            </div>
                        </div>
                    </div>
                </div>
            <div className="row save-btn">
                <div className="col-md-12">
                    <div className= "btn-rightend margin-top-20">
                        <button onClick={this.check.bind(this)} id="saving_button" className="btn btn-primary">Save</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
}
