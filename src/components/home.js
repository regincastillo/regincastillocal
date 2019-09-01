import React, { Component } from 'react';
import moment from 'moment';
import Calendar from 'react-big-calendar';
import axios from 'axios';
import "react-big-calendar/lib/css/react-big-calendar.css";
import { GoogleLogin } from 'react-google-login';

import EventsModal from './EventsModal'
import ModalMess from './ModalMess'
import LoaderDiv from './LoaderDiv'

Calendar.momentLocalizer(moment)

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loader:{
        opacity: 0,
        zIndex: -1
      },
      current_event: {},
      errorMess: '',
      events: [],
      token: '',
      pick_start: '',
      pick_end: '',
      login_style: {
        opacity: 1,
        zIndex: 5

      },
      showModal: {
        opacity: 0,
        zIndex: -1
      },
      showMessModal: {
        opacity: 0,
        zIndex: -1
      },
      enableDelete: {
        display: 'none'
      },
      clearData: false

    }
    this.AddEvent = this.AddEvent.bind(this)
    this.editEvent = this.editEvent.bind(this)
    this.formatEvents = this.formatEvents.bind(this)
    this.successLogin = this.successLogin.bind(this)
    this.sendEvent = this.sendEvent.bind(this)
    this.hideModal = this.hideModal.bind(this)
    this.showModal = this.showModal.bind(this)
    this.deleteEvent = this.deleteEvent.bind(this)
    this.updateEvent = this.updateEvent.bind(this)
    this.hideMessModal = this.hideMessModal.bind(this)
  }
  componentDidMount () {

    this.getEvents()
  }

  // functions
  AddEvent ({start, end}) {
    this.showModal()
    this.setState({
      pick_start: start,
      pick_end: end,
      current_event: {}
    })

  }

  deleteEvent () {
    this.setState({
      loader: {
        opacity: 1,
        zIndex: 9
      }
    })
    axios.delete(`${process.env.REACT_APP_API_URL}/${process.env.REACT_APP_CALENDAR_ID}/events/${this.state.current_event.id}`,{
      headers: {
        'Authorization': 'Bearer ' + this.state.token
      }
    })
    .then (data => {

      let array = this.state.events
      let filter_array = array.filter((data)=> {
        return data.id !== this.state.current_event.id
      })
      this.setState({
        events: filter_array,
        current_event: {},
        loader: {
          opacity: 0,
          zIndex: -1
        }
      })
      this.hideModal()
    }).
    catch(data => {
      this.setState({
        loader: {
          opacity: 0,
          zIndex: -1
        }
      })
      alert('something went wrong please try aagin')
    })
  }



  editEvent (event,e) {

    let array = this.state.events

    this.setState({
      enableDelete:{
        display: 'block'
      },
      current_event: event
    })
    this.showModal()
    return

  }


  getEvents(){
    axios.get(`${process.env.REACT_APP_API_URL}/${process.env.REACT_APP_CALENDAR_ID}/events?fields=items(summary,id,end,start,end)&key=${process.env.REACT_APP_API_KEY}`)
    .then ( data => {

      this.formatEvents(data.data.items)
    })
  }

  formatEvents (data) {
    console.log('array', data)
    var new_array = []
    for (let i = 0; i < data.length; i++) {
      let new_data = {
        title: data[i].summary,
        end: moment(data[i].end.dateTime)._d,
        start: moment(data[i].start.dateTime)._d,
        id: data[i].id
      }
      new_array.push(new_data)
    }

    this.setState({
      events: new_array
    })

  }
  successLogin (data)  {

    this.setState(
      {
        token: data.accessToken,
        login_style: {
          opacity: 0,
          zIndex: -1
        }
      }
    )
  }

  failureLogin (data) {
    alert('Please try again')
  }

  updateEvent (modal_data) {
    this.setState({
      loader: {
        opacity: 1,
        zIndex: 9
      }
    })
    var formatted_start = moment(this.state.current_event.start).format('YYYY-MM-DD')
    axios.put(`${process.env.REACT_APP_API_URL}/${process.env.REACT_APP_CALENDAR_ID}/events/${this.state.current_event.id}`,{
      summary: modal_data.title,
      start: {
        dateTime: moment(formatted_start + ' ' + modal_data.start_time).format()
      },
      end: {
        dateTime: moment(formatted_start+ ' ' + modal_data.end_time).format()
      }
    },{
      headers: {
        'Authorization': 'Bearer ' + this.state.token
      }
    })
    .then(data => {
      let response = data.data
      let array = this.state.events
      for (let i = 0; i < array.length; i++) {
        if (array[i].id == this.state.current_event.id) {
          array[i].title = modal_data.title
          array[i].start = moment(response.start.dateTime)._d
          array[i].end =moment(response.end.dateTime)._d
          this.setState({
            events: array
          })
        }
      }
      this.hideModal()
      this.setState({
        current_event: {},
        loader: {
          opacity: 0,
          zIndex: -1
        }
      })
    })
    .catch(error => {

      this.setState({
        errorMess:  error.response.data.error.message,
        showMessModal: {
          opacity: 1,
          zIndex: 6
        },
        loader: {
          opacity: 0,
          zIndex: -1
        }
      })
    })
  }

  sendEvent (modal_data) {
    var formatted_start = moment(this.state.pick_start).format('YYYY-MM-DD')

      axios.post(`${process.env.REACT_APP_API_URL}/${process.env.REACT_APP_CALENDAR_ID}/events`,{
        summary: modal_data.title,
        start: {
          dateTime: moment(formatted_start + ' ' + modal_data.start_time).format()
        },
        end: {
          dateTime: moment(formatted_start+ ' ' + modal_data.end_time).format()
        }
      }, {
        headers: {
          'Authorization': 'Bearer ' + this.state.token
        }
      })
      .then (data => {

        this.setState({
        events: [
            ...this.state.events,
            {
              title: modal_data.title,
              start: moment(data.data.start.dateTime)._d,
              end: moment(data.data.end.dateTime)._d,
              id: data.data.id
            }
          ]
        })

        this.hideModal()
      })
      .catch(error => {

        this.setState({
          clearData: false,
          errorMess:  error.response.data.error.message,
          showMessModal: {
            opacity: 1,
            zIndex: 6
          }
        })
      })
  }

  showModal () {
    this.setState({
      showModal: {
        opacity: 1,
        zIndex: 5
      },
      clearData: true
    })
  }

  hideModal () {
    this.setState({
      showModal: {
        opacity: 0,
        zIndex: -1
      },
      enableDelete: {
        display: 'none'
      },
      clearData: false
    })
  }
  hideMessModal () {
    this.setState({
      showMessModal: {
        opacity: 0,
        zIndex: -1
      }
    })
  }

  render () {
    return (
      <div>
        <h3>
          Click any days to add Events and Click events to edit or delete

        </h3>
        <LoaderDiv showLoader={this.state.loader}/>

        <div className="login_cont" style={this.state.login_style}>
          <div>
          <h4>Login</h4>
            <GoogleLogin
                clientId={process.env.REACT_APP_CLIENT_ID}
                buttonText="Sign in using google account"
                scope="https://www.googleapis.com/auth/calendar"
                onSuccess={this.successLogin}
                onFailure={this.failureLogin}
                cookiePolicy={'single_host_origin'}
              />
            </div>
        </div>

        <EventsModal
                    title="Events"
                    onSend={this.sendEvent}
                    updateEvent={this.updateEvent}
                    hideModal={this.hideModal}
                    showModal={this.state.showModal}
                    enableDelete={this.state.enableDelete}
                    data={this.state.current_event}
                    deleteEvent={this.deleteEvent}
                    clearData={this.state.clearData}/>

        <ModalMess
              showModal={this.state.showMessModal}
              hideModal={this.hideMessModal}
              errorMess={this.state.errorMess}
            />

        <Calendar
            selectable
            style={{ height: 500 }}
            events={this.state.events}
            step={30}
            defaultView='month'
            views={['month','week','day']}
            defaultDate={new Date()}
            onSelectEvent={this.editEvent}
            onSelectSlot={this.AddEvent}
            />
      </div>
    )
  }
}
export default Home;
