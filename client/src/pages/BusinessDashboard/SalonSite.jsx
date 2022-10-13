import React, { Component } from "react";
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import Grid from '@mui/material/Grid'
import { Link } from 'react-router-dom'


class SalonSite extends Component {

  constructor(props) {
    super(props);
    this.state = { apiResponse: "" }
  }

  componentDidMount() {
    this.callApi();
  }

  callApi() {
    fetch("http://127.0.0.1:8000/api/salon/2/")
      .then(res => res.json())
      .then(res => this.setState({ apiResponse: res }))
  }




  render() {

    console.log(this.state.apiResponse)

    return (
      <div>

        <h1> {this.state.apiResponse.name}

        </h1>
        <h4> {this.state.apiResponse.email}
        </h4>
        {/* <p> {this.state.apiResponse.description} </p> */}
        <p>{this.state.apiResponse.description}</p>
        <Grid container
          spacing={4} >
          <Grid item xs={3} >
          <Card
            style={{
              width: '20vw',
              height: 300,
              backgroundColor: "white",
            }}
          >
            {/* <CardMedia
              component="img"
              height="50"
              image="appt_img.jpg"
              alt="View Appointments"
            /> */}
            <CardContent>
              {/* <img src={require('./appt_img.jpg').default} alt="View Appointments" /> */}
              <Typography variant="h5" component="h2">
                Schedule
              </Typography>
            </CardContent>
            <CardActions>
            <Link to="/schedule"><Button size="small">View Appointments</Button></Link>
            </CardActions>
          </Card>
          </Grid>
          <Grid item xs={3} >
          <Card
            style={{
              width: '20vw',
              height: 300,
              backgroundColor: "white",
            }}
          >
            <CardContent>
              <Typography variant="h5" component="h2">
                Serivces
              </Typography>
            </CardContent>
            <CardActions>
            <Link to="/services"><Button size="small">Manage Services</Button></Link>
            </CardActions>
          </Card>
          </Grid>
          <Grid item xs={3} >
          <Card
            style={{
              width: '20vw',
              height: 300,
              backgroundColor: "white",
            }}
          >
            <CardContent>
              <Typography variant="h5" component="h2">
                Appointments
              </Typography>
            </CardContent>
            <CardActions>
            <Link to="/appointment"><Button size="small">Make an Appointment</Button></Link>
            </CardActions>
          </Card>
          </Grid>
          <Grid item xs={3} >
          <Card
            style={{
              width: '20vw',
              height: 300,
              backgroundColor: "white",
            }}
          >
            <CardContent>
              <Typography variant="h5" component="h2">
                Employees
              </Typography>
            </CardContent>
            <CardActions>
            <Link to="/employees"><Button size="small">Manage Employees</Button></Link>
            </CardActions>
          </Card>
          </Grid>
        </Grid>

      </div>

    )
  }

}

export default SalonSite;
