import React, { Component } from 'react';
import moment from 'moment'

class EventsModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      title: '',
      id: '',
      startTime: '10:10',
      endTime: '10:10',
    };

    this.handleChange = this.handleChange.bind(this)
    this.sendDAta = this.sendDAta.bind(this)
    this.hideModal = this.hideModal.bind(this)
    this.editDataFile = this.editDataFile.bind(this)
    this.deleteEvent = this.deleteEvent.bind(this)
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.clearData) {
      this.setState({
        title: '',
        id: '',
        startTime: '10:10',
        endTime: '10:10',
      })
    }
    this.editDataFile(nextProps.data)
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value});

  }

  hideModal () {
    this.setState({
      title: '',
      startTime: '10:10',
      endTime: '10:10'
    })
    this.props.hideModal()
  }

  sendDAta () {
    let data = {

      title: this.state.title,
      start_time: this.state.startTime,
      end_time: this.state.endTime,
    }

    if (this.props.data.id) {
      this.props.updateEvent(data)
    } else {
      this.props.onSend(data)
    }
  }



  editDataFile (data) {

    if (data.id) {

      this.setState({
        title: data.title,
        startTime: moment(data.start).format('HH:mm'),
        endTime: moment(data.end).format('HH:mm'),
        id: this.props.data.id
      })
    }
  }

  deleteEvent () {
    this.props.deleteEvent()
  }


  render () {
    return (
      <div className="modal" style={this.props.showModal}>
      <div className="modal_outside" onClick={this.hideModal}></div>
        <div className="modal_body">

          <h2>{this.props.title}</h2>

          <div className="form_group">
            <label>Event </label>
            <input type="text" placeholdr="Event title"  value={this.state.title} name="title" onChange={this.handleChange} />
          </div>
          <div className="form_group">
            <label>Start</label>
            <input type="time" className="time_input" value={this.state.startTime} name="startTime"  onChange={this.handleChange} />
          </div>

          <div className="form_group">
            <label>End</label>
            <input type="time" className="time_input" value={this.state.endTime} name="endTime" onChange={this.handleChange} />
          </div>
          <div className="modal_btn">
            <button onClick={this.sendDAta}>Send</button>
            <button style={this.props.enableDelete} onClick={this.deleteEvent}>Delete</button>
            <button onClick={this.hideModal}>Cancel</button>
          </div>

        </div>
      </div>
    )
  }

}


export default EventsModal;
