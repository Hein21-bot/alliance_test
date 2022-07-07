import React, { Component } from 'react';

class SettingHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pathname: window.location.pathname
        }
    }

    render() {
        const permission = this.props.permission;
        return (
            <div className="row wrapper border-bottom white-bg page-heading" style={{display: 'flex', alignItems: 'center'}}>
                <div className="col-lg-10">
                    <h2>{this.props.pageTitle}</h2>
                    {/* <ol className="breadcrumb">
                        <li>
                            Setting
                        </li>
                        <li className="active">
                            <a href="#"> {this.props.pageTitle} </a>
                        </li>

                    </ol> */}
                </div>

                <div className="col-lg-2">
                    {

                        this.props.isAddNew || this.props.isView || this.props.isEdit ?
                            <a href={this.state.pathname}>
                                <button className="btn btn-primary" >
                                    Back To List</button></a>
                            : 
                            permission.isAddNew ?
                                <button className="btn btn-primary" onClick={this.props.setupForm}>
                                    <i className="fa fa-plus" aria-hidden="true" style={{fontSize: 12, margin: '0px 4px 0px 0px'}}></i>
                                    Add New 
                                </button>
                                : ''
                    }

                </div>

            </div>
        )
    }
}

export default SettingHeader;