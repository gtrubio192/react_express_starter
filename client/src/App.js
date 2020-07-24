import React, { Component, isValidElement } from 'react';
import axios from 'axios';
import { Steps, Layout, Row, Col } from 'antd';
import FormPartOne from './components/QuoteForm/formPartOne';
import FormPartTwo from './components/QuoteForm/formPartTwo';
import ConfirmationPage from './components/confirmation';
import QuoteModal from './components/quoteModal';
import 'antd/dist/antd.css';
import './App.css';

const { Step } = Steps;
const { Header, Footer, Content } = Layout;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formOneComplete: false,
      formTwoComplete: false,
      currentStep: 0, 
      showModal: false,
      origins: [],
      hubs: ['78610', '77049', '75216', '80216', '78073', '43207'],
      shortestRoute: {}
    }

    // all cities in Texas, Colorado, Ohio
    // dallas - 75141
    // houston - channelview
    this.containers = {
      "20_standard_new": "20' Standard New",
      "20_highCube_new": "20' High Cube New",
      "40_standard_new": "40' Standard New", 
      "40_highCube_new": "40' High Cube New",
      "20_standard_used": "20' Standard Used",
      "20_highCube_used": "20' High Cube Used", 
      "40_standard_used": "40' Standard Used", 
      "40_highCube_used": "40' High Cube Used"
    }

  }

  calculateDistances = () => {
    let { origins, hubs } = this.state;

    axios.get(`/api/distance?origins=${origins}&hubs=${hubs}`)
      .then(res => res.data)
      .then(data => this.handleResponse(data))
      .catch(err => console.log('Unable to get distances: ', err))
  }

  handleResponse = (distances) => {
    console.log(distances);
    let initMax = Number.MAX_VALUE;

    let first = {
      distance: initMax,
      hub: ''
    };

    let userOrigin = {};

    for (let i=0; i < this.state.origins.length; i++) {
      for (let j = 0; j < this.state.hubs.length; j++) {
          let origin = distances.origin_addresses[i];
          let destination = distances.destination_addresses[j];
          if (distances.rows[0].elements[j].status === 'OK') {
              let distance = distances.rows[i].elements[j].distance.text;
              let formattedDistance = parseInt(distance.replace(/,/g, ''), 10);
              console.log('Distance from ' + origin + ' to ' + destination + ' is ' + formattedDistance);
              
              if(formattedDistance < first.distance) {
                first.distance = formattedDistance
                first.hub = destination
              }
              userOrigin.address = origin;
              userOrigin.city = origin.split(',')[0]
          } else {
              console.log(destination + ' is not reachable by land from ' + origin);
          }
      }
    }

    this.setState({
      shortestRoute: first,
      userOrigin
     }, this.getContainerCostAtHub);
  }

  calculateDeliveryRate = () => {
    let shortestRoute = this.state.shortestRoute.distance;
    if(shortestRoute <= 25) {
      this.setState({
        shippingCost: 0,
      });
      return 0;
    }
    else {
      this.setState({
        shippingCost: (shortestRoute - 25)*3,
      })
      return (shortestRoute - 25)*3
    }
  }

  getContainerCostAtHub = () => {

    axios.get(`/api/getPrice?type=${this.state.containerType}&size=${this.state.containerSize}&location=${this.state.userOrigin.city}`)
      .then(res => res.data)
      .then(data => this.handlePrices(data))
      .catch(err => console.error('Unable to fetch prices: ',err))
  }

  handlePrices = (prices) => {
    // find smallest price 
    // store in state
    let data = prices.data;
    let cheapest = {};
    let initMax = 50000;

    data.forEach(elem => {
      if(elem.hasOwnProperty('price')) {
        elem.price = elem.price.replace(/[^0-9.]/g, '');
        if(!isNaN(elem.price)) {
          if(elem.price < initMax) {
            cheapest = elem;
            initMax = elem.price;
          }
        }
      }
    });

    console.log(cheapest)

    this.setState({
      containerCost: cheapest.price
    },this.calculateTotalCost)
    // return prices.data[0].price.replace(/[^0-9.]/g, '')
  }

  calculateTotalCost = () => {

    // if(this.getContainerCostAtHub() < 0) {
    //   alert(`Were sorry, ${this.state.container} container is not available for your area`)
    // }
    // else {
      // this.getContainerCostAtHub();
      let totalPrice = this.calculateDeliveryRate() + this.state.containerCost*this.state.quantity
      this.setState({
        totalPrice,
        showModal: true
      });
    // }

  }


  formOneComplete = (isComplete, values) => {
    let containerSize = values.Size.split(',')[0];
    let containerType = values.Size.split(',')[1];
    let containerCondition = values.Size.split(',')[2];

    this.setState({
      formOneComplete: isComplete,
      currentStep: 1,
      origins: [values.Zip],
      container: values.Size,
      quantity: values.Quantity,
      containerSize,
      containerType
    }, this.calculateDistances);
  }

  handleModalOk = () => {
    console.log('user closed modal... ')
    this.setState({ showModal: false });
  }

  formTwoComplete = (isComplete, values) => {
    let { Email, Address, First, Last, Phone } = values
    this.setState({
      formTwoComplete: isComplete,
      currentStep: 2,
      userEmail: Email,
      userAddress: Address,
      userName: `${First} ${Last}`,
      userPhone: Phone
    }, this.sendEmail)
  }

  sendEmail = () => {
    
    let data = {
      email: this.state.userEmail,
      address: this.state.userAddress,
      name: this.state.userName,
      cost: this.state.totalPrice,
      container: this.containers[this.state.container],
      quantity: this.state.quantity
    }
    
    axios.post(`/api/sendEmail`, data)
      .then(res => res.data)
      .then(data => console.log(data))
      .catch(err => console.log('Email error: ', err))
  }

  render() {
    let modalDetails = {
      totalPrice: this.state.totalPrice,
      shippingCost: this.state.shippingCost,
      deliveryHub: this.state.shortestRoute.hub,
      container: this.containers[this.state.container]
    };

    return (
      <div className="App">
        <Layout>
          <Header>
            <img className="logo" src='https://cdn.shopify.com/s/files/1/0313/5032/5381/files/450x200_-logo-bobs.jpeg?v=1581624152' width="120px"/>
          </Header>
          <Content>
            <Row>
              <Col span={12} offset={6}>
                <Steps current={this.state.currentStep}>
                  <Step title="Order Info" />
                  <Step title="User Info" />
                  <Step title="Complete Order" />
                </Steps>
              </Col>
            </Row>
            {
              !this.state.formOneComplete
              ? <FormPartOne formOneComplete={this.formOneComplete} />
              : !this.state.formTwoComplete
              ? <FormPartTwo formTwoComplete={this.formTwoComplete} userOrigin={this.state.userOrigin} />
              : <ConfirmationPage />
            }
            {
              this.state.showModal
              ? <QuoteModal visible={this.state.showModal} handleOk={this.handleModalOk} details={modalDetails} />
              : null
            }
            {/* <FormPartTwo formTwoComplete={this.formTwoComplete} zip={this.state.zip} /> */}
          </Content>
          <Footer>
            Contact Us
            <p>512-271-9428</p>
            <p>sales@bobscontainers.com</p>
          </Footer>
        </Layout>
      </div>
    );
  }
}

export default App;
