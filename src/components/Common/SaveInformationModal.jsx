import React, { Component } from 'react';
import Rodal from 'rodal';

export default class SaveInformationModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false
        }
    }

    showModal() {
        this.setState({ visible: true });
    }

    hide() {
        this.setState({ visible: false });
    }

    render() {
        return (
            <Rodal width={500} height={300} visible={this.props.visible} onClose={this.hide.bind(this)} >
                <div>Your Information is saving.........</div>
            </Rodal>
        )
    }
}