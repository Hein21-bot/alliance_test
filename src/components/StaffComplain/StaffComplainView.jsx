import React, { Component } from 'react';
import moment from "moment";
import DocumentList from '../Common/DocumentList';
import { main_url } from "../../utils/CommonFunction";

class StaffComplainAddNew extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data,
            doc: []
        }
    }

    componentDidMount() {
        console.log("props.data is ====>", this.props.data)
        fetch(`${main_url}staff_complain/getDocument/` + this.props.data.staff_complain_id)
            .then(res => { if (res.ok) return res.json() })
            .then(list => {
                this.setState({
                    doc: list
                })
            })
    }

    render() {
        return (
            <div className="benefits benefits-other">

                <div className="row wrapper border-bottom white-bg page-heading">
                    <div className="col-lg-10">
                        <h2>HR Management System</h2>
                        <ol className="breadcrumb">
                            <li>
                                Staff Complain
                                </li>
                            <li>
                                Staff Complain View
                                </li>

                        </ol>
                    </div>
                    <div className="col-lg-2" style={{ marginTop: '2%' }}>
                        <a href={window.location.pathname} className="btn btn-primary" >Back To List</a>
                    </div>
                </div>
                <div className="form-horizontal mt20" name="demo-form">
                    <div className='row'>
                        <form className="form-group">
                            <div className="col-md-6">
                                <div><label className="col-sm-12">Case Date</label></div>
                                <div className="col-sm-10">
                                    <input
                                        className="form-control"
                                        value={this.state.data.case_date}
                                        disabled
                                    />
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div><label className="col-sm-12">Case Time</label></div>
                                <div className="col-sm-10">
                                    <input
                                        className="form-control"
                                        value={moment.utc(this.state.data.case_time).format('h:mm a')}
                                        disabled
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div><label htmlFor="description" className="col-sm-12">Please Enter The Description</label></div>
                                <div className="col-sm-10">
                                    <textarea
                                        name="description"
                                        value={this.state.data.complain_text}
                                        rows="10"
                                        cols="24"
                                        className="form-control"
                                        disabled
                                    >

                                    </textarea>
                                </div>
                            </div>
                            <div className="col-md-6">
                                {
                                    this.state.data.isAnonymous === 1 ?
                                        (
                                            <div>
                                                <div><label htmlFor="description" className="col-sm-12">Is Anonymous</label></div>
                                                <div className="col-sm-3">
                                                    <input
                                                        // className="form-control"
                                                        type="checkbox"
                                                        disabled
                                                        checked='checked'
                                                    />
                                                </div>
                                            </div>
                                        ) :
                                        (
                                            <div>
                                                <div><label htmlFor="description" className="col-sm-12">User Name</label></div>
                                                <div className="col-sm-10">
                                                    <input
                                                        className="form-control"
                                                        type="text"
                                                        disabled
                                                        value={this.state.data.fullname}
                                                    />
                                                </div>
                                            </div>
                                        )
                                }
                            </div>

                        </form>
                    </div>
                </div>
                <div className="row document-main">
                    {
                        this.state.doc.length > 0 ?
                            <DocumentList title='Staff Complain Document' doc={this.state.doc} path='staff_complain' />
                            : ''
                    }
                </div>
            </div >
        )
    }
}

export default StaffComplainAddNew;