import React, {Component} from 'react';
import {DayPilot, DayPilotNavigator} from "@daypilot/daypilot-lite-react";
import "./calendar.css";

class Calendar extends Component {

  render() {
    return (
      <div>
        <div>
          <DayPilotNavigator
            selectMode={"week"}
            showMonths={3}
            skipMonths={3}
            startDate={"2023-03-07"}
            selectionDay={"2023-03-07"}
            onTimeRangeSelected={ args => {
              this.calendar.update({
                startDate: args.day
              });
            }}
          />
        </div>
      </div>
    );
  }
}

export default Calendar;