import React, { Component } from 'react';
import DocumentList from '../Common/DocumentList';
import Select from 'react-select';
import DatePicker from 'react-datetime';

export default class AnnouncementView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data.Announcement[0],
            document: props.data.doc
        }
 }

        render() {
            return (
               <div>
                <div className="row wrapper border-bottom white-bg">
                    <div className="row margin-top-20">
                            <div className="col-md-6">
                                <div><label className="col-sm-12">Title</label></div>
                                <div className="col-sm-10">
                                    <input
                                     className="form-control input-md"
                                     value={this.state.data.title}
                                     disabled
                                      
                                    />
                                </div>
                            </div>
                            <div className=" form-group col-md-6">
                                <div><label className="col-sm-12">Target Group</label></div>
                                <div className="col-sm-10">
                                    <input
                                        className="form-control input-md"
                                        value={this.state.data.target_branch}
                                        disabled

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
                                         value={this.state.data.start_date}
                                         disabled    
                                       />
                                </div>
                            </div>
                            <div className="form-group col-md-6">
                                <div><label htmlFor="end" className="col-sm-12">End Date</label></div>
                                <div className="col-sm-10">
                                    <DatePicker
                                        dateFormat='DD-MM-YYYY'
                                        value={this.state.data.end_date}
                                        disabled
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="form-group col-md-6">
                                <div><label htmlFor="description" className="col-sm-12">Please Enter The Description </label></div>
                                <div className="col-sm-10">
                                   <textarea
                                            cols="20"
                                            rows="10"
                                            className="form-control input-md"
                                            value={this.state.data.description}
                                            disabled
               
                                     />
                                </div>
                            </div>
                       </div>
                    <div className="row">
                        {
                            this.state.document.length > 0 ?
                                <DocumentList title='Announcement Document' doc={this.state.document} path='announcement' />
                                : ''
                        }
                 </div>
            </div>  
        </div>                         
        )
    }
 }