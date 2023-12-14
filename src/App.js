import React, { useState, useEffect } from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import 'tachyons';

const PAT = 'bb06795ea60a45d2a210faee14877836';
const USER_ID = 'reinerknudsen';
const APP_ID = 'smartbrain';
const MODEL_ID = 'face-detection';

const initialstate = {
  imageUrl: '',
  box: {},
  route: 'signout',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: '',
    joined: '',
  },
};

function App() {
  const [imageUrl, setImageUrl] = useState(initialstate.imageUrl);
  const [box, setBox] = useState(initialstate.box);
  const [route, setRoute] = useState(initialstate.route);
  const [isSignedIn, setIsSignedIn] = useState(initialstate.isSignedIn);
  const [user, setUser] = useState(initialstate.user);

  useEffect(() => {
    fetch('http://localhost:3000/').then((response) => response.json());
  });

  function loadUserProfile(data) {
    setUser({
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined,
    });
  }

  const resetAppState = () => {
    setImageUrl(initialstate.imageUrl);
    setBox(initialstate.box);
    setRoute(initialstate.route);
    setIsSignedIn(initialstate.isSignedIn);
    setUser(initialstate.user);
  };

  const onInputChange = (event) => {
    setImageUrl(event.target.value);
  };

  const calculateFaceLocation = (data) => {
    //debugger;
    const faceData = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: faceData.left_col * width,
      topRow: faceData.top_row * height,
      rightCol: width - faceData.right_col * width,
      bottomRow: height - faceData.bottom_row * height,
    };
  };

  const displayFacebox = (box) => {
    setBox(box);
  };

  const onImageSubmit = () => {
    // Face Recognition API
    const raw = JSON.stringify({
      user_app_id: {
        user_id: USER_ID,
        app_id: APP_ID,
      },
      inputs: [
        {
          data: {
            image: {
              url: imageUrl,
            },
          },
        },
      ],
    });
    const requestOptions = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: 'Key ' + PAT,
      },
      body: raw,
    };
    fetch('https://api.clarifai.com/v2/models/' + MODEL_ID + '/outputs', requestOptions)
      .then((response) => response.json())
      //.then((data) => displayFacebox(calculateFaceLocation(data)))
      .then((data) => {
        if (data) {
          fetch('http://localhost:3000/image', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: user.id,
            }),
          })
            .then((response) => response.json())
            .then((count) => {
              setUser({ name: user.name, entries: count });
            })
            .catch((err) => console.log('User not found', err));
        }
        displayFacebox(calculateFaceLocation(data));
      })
      .catch((err) => console.log('Error in API communication', err));
  };

  const onRouteChange = (routeChange) => {
    if (route === 'signout') {
      setIsSignedIn(false);
      //resetAppState();
    } else if (route === 'home') {
      setIsSignedIn(true);
    }
    setRoute(routeChange);
  };

  return (
    <div className='App'>
      {route === 'home' ? (
        <>
          <Navigation onRouteChange={onRouteChange} />
          <Logo />
          <Rank name={user.name} entries={user.entries} />
          <ImageLinkForm onInputChange={onInputChange} onImageSubmit={onImageSubmit} />
          <FaceRecognition box={box} imageUrl={imageUrl} isSignedIn={isSignedIn} />
        </>
      ) : route === 'signout' ? (
        <SignIn onRouteChange={onRouteChange} loadUserProfile={loadUserProfile} />
      ) : (
        <Register onRouteChange={onRouteChange} loadUserProfile={loadUserProfile} />
      )}
    </div>
  );
}

export default App;
