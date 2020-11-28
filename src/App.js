import React, { Component } from 'react'
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation'
import SignIn from './components/SignIn/SignIn'
import Register from './components/Register/Register'
import Logo from './components/Logo/Logo'
import Rank from './components/Rank/Rank'
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm'
import FaceRecognition from './components/FaceRecognition/FaceRecognition'
import './App.css';

const particleOptions = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
};

const initialState = {
  input: '',
  imageURL: '',
  box: '',
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: '',
  }
}

class App extends Component {
  constructor() {
    super();
    this.myRef = React.createRef();
    this.state = {
      input: '',
      imageURL: '',
      box: '',
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: '',
      }
    };
  }

  // componentDidMount() {
  //   fetch('http://localhost:3000')
  //     .then(response => response.json())
  //     .then(console.log)
  // };

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined,
      }
    })
  }

  calculateFaceLocation = (data) => {
    const facesCoordinates = data;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    const box = [];
    facesCoordinates.map((object, index) => {
      return box.push({
        x1: facesCoordinates[index].x1 * width,
        x2: width - (facesCoordinates[index].x2 * width),
        y1: facesCoordinates[index].y1 * height,
        y2: height - (facesCoordinates[index].y2 * height),
      })
    })
    console.log(box)
    return box

  };

  displayFaceBox = (box) => {
    this.setState({ box: box });
  };




  onInputChange = (event) => {
    this.setState({ input: event.target.value })
  };


  faceApiRewuest = () => {
    // let sightengine = require('sightengine')('287673599', 'pVZPbBdw3YQsHRYvkt3T');
    // sightengine.check(['faces']).set_url(this.state.imageURL)
    fetch('http://localhost:3000/imageurl', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: this.state.input
      })
    })
      .then(response => response.json())
      .then(response => {
        if (response) {
          fetch('http://localhost:3000/image', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(entries => {
              this.setState(Object.assign(this.state.user, { entries: entries }))
            })
            .catch(console.log)
        }
        this.displayFaceBox(this.calculateFaceLocation(response.faces))
      }).catch(function (err) {
        console.log(err)
      });

  }

  onButtonSubmit = () => {
    this.setState({ imageURL: this.state.input }, this.faceApiRewuest)
  };

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState(initialState)
    } else if (route === 'home') {
      this.setState({ isSignedIn: true })
    }
    this.setState({ route: route });
  };

  render() {
    return (
      <div className="App">
        <Particles className='particles'
          params={particleOptions}
        />
        <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange} />
        {this.state.route === 'home'
          ? <div ref={this.myRef}>
            <Logo />
            <Rank name={this.state.user.name} entries={this.state.user.entries} />
            <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
            <FaceRecognition box={this.state.box} imageSource={this.state.imageURL} />
          </div>
          :
          (
            (this.state.route === 'signin' || this.state.route === 'signout')
              ? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
              : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
          )
        }
      </div>
    );
  }
};

export default App;