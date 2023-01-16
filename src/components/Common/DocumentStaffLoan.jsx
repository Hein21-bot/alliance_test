import React, { Component } from 'react';
import { main_url } from '../../utils/CommonFunction';

export default class DocumentStaffLoan extends Component {

    constructor(props) {
        super(props);
        this.state = {
            doc: this.props.doc
        }
    }

    render() {
        return (
            <div className="main-info">
                <div className="header-info col-sm-12">
                    <h4>{this.props.title}</h4>
                </div>
                <div className="row body-info">
                    {this.state.doc.map((data, index) =>
                        <div className="col-sm-4 maring-top-20 approval-main" key={index}>
                            <a href={`${main_url}${this.props.path}/getCRDocumentData/${data.name}`}
                                download target='_blank'
                                className="btn btn-primary document-body-bt document-width">
                                {data.name ? data.name.split("&@")[1] : ''}
                            </a>
                        </div>
                    )}
                </div>

            </div>
        )
    }
}