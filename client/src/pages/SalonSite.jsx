import React, { Component } from "react";
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import Grid from '@mui/material/Grid'


class SalonSite extends Component {

  constructor(props) {
    super(props);
    this.state = { apiResponse: "" }
  }

  componentDidMount() {
    this.callApi();
  }

  callApi() {
    fetch("http://127.0.0.1:8000/1")
      .then(res => res.json())
      .then(res => this.setState({ apiResponse: res }))
  }



  render() {

    console.log(this.state.apiResponse)

    return (
      <div>

        <h1> Welcome to our salon
          {/* {this.state.apiResponse.name}!  */}
        </h1>
        <h4> Email:
          {/* {this.state.apiResponse.email}  */}
          test@mysalon.com
        </h4>
        {/* <p> {this.state.apiResponse.description} </p> */}
        <p>My salon do best hairs. In service for 50 years</p>
        <Grid container
          spacing={4}
          justify="center">
          <Grid item xs={12} sm={6} md={4}>
          <Card
            style={{
              width: 400,
              backgroundColor: "white",
            }}
          >
            <CardMedia
              component="img"
              height="140"
              image="client\src\assets\appt_img.jpg"
              alt="View Appointments"
            />
            <CardContent>
              <img src="client\src\assets\appt_img.jpg" alt="View Appointments" />
              <Typography variant="h5" component="h2">
                 Schedule
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small">View Appointments</Button>
            </CardActions>
          </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
        <Card
          style={{
            width: 400,
            backgroundColor: "white",
          }}
        >
          <CardContent>
            <Typography variant="h5" component="h2">
               Serivces
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small">Manage Services</Button>
          </CardActions>
        </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
        <Card
          style={{
            width: 400,
            backgroundColor: "white",
          }}
        >
          <CardContent>
            <Typography variant="h5" component="h2">
              Make Appointments
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small">Make an Appointment</Button>
          </CardActions>
        </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
        <Card
          style={{
            width: 400,
            backgroundColor: "white",
          }}
        >
          <CardContent>
            <Typography variant="h5" component="h2">
              Employees
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small">Manage Employees</Button>
          </CardActions>
        </Card>
        </Grid>
        </Grid>
        
      </div>

    )
  }

}

export default SalonSite;
