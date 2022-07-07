import React, { Component } from 'react';

class BenefitPageHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pathname: window.location.pathname
        }
    }

    render() {
        const permission = this.props.permission;
        return (
            <div className="row wrapper border-bottom white-bg page-heading">
                <div className="col-lg-10">
                    <h2>HR Management System</h2>
                    <ol className="breadcrumb">
                        <li>
                            Benefit
                        </li>
                        <li className="active">
                            <a href="#"> {this.props.pageTitle} Benefit</a>
                        </li>

                    </ol>
                </div>

                <div className="col-lg-2">
                    {

                        this.props.isAddNew || this.props.isView || this.props.isEdit ?
                            <a href={this.state.pathname}>
                                <button className="btn btn-primary" >
                                    Back To List</button></a>
                            : permission.isAddNew ?
                                <button className="btn btn-primary" onClick={this.props.setupForm}>
                                    Add New</button>
                                : ''
                    }

                </div>

            </div>
        )
    }
}

export default BenefitPageHeader;