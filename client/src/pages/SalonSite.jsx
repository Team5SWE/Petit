import React, {Component} from "react";
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';



class SalonSite extends Component {

  constructor(props){
    super(props);
    this.state = {apiResponse: ""}
  }

  componentDidMount(){
    this.callApi();
  }

  callApi(){
    fetch("http://127.0.0.1:8000/1")
    .then(res => res.json())
    .then(res => this.setState({apiResponse: res}))
  }



  render(){

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
      <Card
        style={{
          width: 400,
          backgroundColor: "white",
        }}
      >
        <CardMedia image="../assets/appt_img.jpg"/>
        <CardContent>
        <img src="../assets/appt_img.jpg" alt="View Appointments" />
        {/* <Card.Img as={Image} src={"../assets/appt_img.jpg"} fluid={true} alt="Card image" /> */}
          <Typography variant="h5" component="h2">
           Appointments Schedule
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small">View Appointments</Button>
        </CardActions>
      </Card>

      </div>

    )
  }

}

export default SalonSite;
