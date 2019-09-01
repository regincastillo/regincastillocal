import React, { Component } from 'react';

class MessModal extends Component {

  constructor(props) {
    super(props);
    this.state = {

    };


    this.hideModal = this.hideModal.bind(this)
  }



  hideModal () {
    this.props.hideModal()
  }
  render () {
    return (
      <div className="modal" style={this.props.showModal}>
        <div className="modal_outside" onClick={this.hideModal}></div>
        <div className="modal_body">
          <h3>Error Message</h3>
          <p>{this.props.errorMess}</p>
          <button onClick={this.hideModal}>Ok</button>
        </div>
      </div>
    )
  }
}


export default MessModal;
