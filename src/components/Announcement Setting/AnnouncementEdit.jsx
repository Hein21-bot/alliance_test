import React, { Component } from 'react';
import openSocket from 'socket.io-client';
import Select from 'react-select';
import DatePicker from 'react-datetime';
import {
    main_url, validate, getBranch, getUserId, startSaving, stopSaving} from '../../utils/CommonFunction';

var form_validate = true;

export default class AnnouncementEdit extends Component {
       constructor(props) {
        super(props);
        this.state = {
            branchlist: [],
            datasource: props.data.data[0],

            //data: props.data,
            document: props.data.doc,
            updatedBy: getUserId("user_info"),
            newDoc: [],
            
         }
    }

    componentDidUpdate() {
        if (!form_validate) validate('check_form')
    }

    handlefileChanged(event) {

        event.preventDefault();

        let newDoc = this.state.newDoc;
        var obj = document.querySelector("#HDEdit").files.length;
        for (var i = 0; i < obj; i++) {
            var getfile = document.querySelector("#HDEdit").files[i];
            newDoc.push(getfile)
        }
        this.setState({
            newDoc: newDoc
        })
    }

 async componentDidMount() {
        let branchlist = await getBranch();
        this.setState({
            branchlist: branchlist,
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
 
changeTitle = (event) => {
     let data = this.state.datasource
     data.title = event.target.value
     this.setState({
        datasource: data
        })
     }

    handleBranch = (event) => {
        let data = this.state.data
        data.target_branch = event.value;
        this.setState({
            data: data
        })
    }

    handleDescription = (event) => {
        let data = this.state.data;
        data.description = event.target.value
        this.setState({
           data : data       
         });
    }


    removeOldDocument(index, event) {
        var array = this.state.document;
        array.splice(index, 1);
        this.setState({
            document: array
        })
    }

    removeNewDocument(index, event) {
        var array = this.state.newDoc;
        array.splice(index, 1);
        this.setState({
            newDoc: array
        })
    }

     check = () => {
         stopSaving();
         if (validate('check_form')) {
            this.props.editAnnouncement(this.state.updatedBy, this.state.data, this.state.document);
         } else {
             startSaving();
             form_validate = false;
         }
     }
    
    render() {
        return (
         <div className="wrapper wrapper-content">
            <div className="form-horizontal" id="check_form">                   
              <div className="row">
                        <div className=" form-group col-md-6">
                            <div><label className="col-sm-12" >Title</label></div>
                                <div className="col-sm-10" >
                                    <input
                                        className="form-control input-md checkValidate"
                                        value={this.state.datasource.title}
                                        disabled
                                    />
                                </div>
                            </div>
                            <div className= "form-group col-md-6">
                            <div><label htmlFor="target-group" className="col-sm-12">Target Group</label></div>
                            <div className="col-sm-10">
                               
                        </div>
                        </div>
                    </div>
                   <div className="row">
                      <div className="form-group col-md-6">
                          <div><label htmlFor="start" className="col-sm-12">Start Date</label></div>
                          <div className="col-sm-10">
                              <DatePicker
                                   dateFormat="DD-MM-YYYY"
                                   value={this.state.datasource.startDate}
                                   data-name='startDate'
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
                                  value={this.state.datasource.endDate}
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
                                  cols="10"
                                  rows="6"
                                  className="form-control input-md checkValidate"
                                  value={this.state.datasource.description}
                                  onChange={this.handleDescription}
                               />
                          </div>
                      </div>
                     <div className="form-group col-md-6" >
                                <div><label className="col-sm-12" >Announcement Document</label></div>
                                <div className="col-md-10">
                                    <input type="file" id="HDEdit" className="dropZone form-control" 
                                    onChange={this.handlefileChanged.bind(this)} multiple />
                                </div>
                            </div>
                    </div>
                    </div>
                    <div className="row">
                        <div className="ibox float-e-margins">
                            <div className="p-md col-md-12" style={{ float: 'left', }}>

                                {this.state.document.map((data, index) =>
                                    <div key={index} className="fileuploader-items col-md-4">
                                        <ul className="fileuploader-items-list">
                                            <li className="fileuploader-item file-has-popup file-type-application file-ext-odt">
                                                <div className="columns">
                                                    <div className="column-title">
                                                        <a href={`${main_url}helpDesk/getCRDocumentData/${data.name}`}
                                                            download target='_blank'
                                                            className="btn btn-primary document-body-bt document-width">
                                                            {data.name.split("&@")[1]}
                                                        </a>
                                                    </div>
                                                    <div className="column-actions">
                                                        <a className="fileuploader-action fileuploader-action-remove" onClick={(event) => this.removeOldDocument(index, event)}> <i></i></a>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                )

                                }

                                {this.state.newDoc.map((data, index) =>

                                    <div className="fileuploader-items col-md-4">
                                        <ul className="fileuploader-items-list">

                                            <li className="fileuploader-item file-has-popup file-type-application file-ext-odt">
                                                <div className="columns">
                                                    <div className="column-title">
                                                        <a href='#'

                                                            className="btn btn-primary document-body-bt document-width">
                                                            {data.name}
                                                        </a>
                                                    </div>
                                                    <div className="column-actions">
                                                        <a className="fileuploader-action fileuploader-action-remove" onClick={(event) => this.removeOldDocument(index, event)}> <i></i></a>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                )
                                }
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

