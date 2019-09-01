import React from 'react';
import ReactDOM from 'react-dom';
import Home from './components/home';

it('format the data changes object property from summary to title', () => {
    const div = document.createElement('div');
    const render_div = ReactDOM.render(<Home />, div);
    let mock_data = [
      {
        end: { dateTime: "2019-09-20T13:30:00+08:00"},
        id: "13avq25f9f4b1keb794nf61oaj",
        start: {dateTime: "2019-09-20T12:30:00+08:00"},
        summary: "sample event"
      }
    ]
    render_div.formatEvents(mock_data)
    expect(typeof render_div.state.events[0].summary === 'undefined').toBe(true)
    expect(typeof render_div.state.events[0].title != 'undefined').toBe(true)
});
