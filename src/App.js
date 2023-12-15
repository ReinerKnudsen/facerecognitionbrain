import React, { useState } from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import 'tachyons';

const initialstate = {
  imageUrl: '',
  box: {},
  route: 'signin',
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

  function loadUserProfile(data) {
    console.log('Load profile data', data);
    setUser({
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined,
    });
  }

  const resetAppState = () => {
    console.log('Reset App State');
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
    const faceData = data.regions[0].region_info.bounding_box;
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

  async function onImageSubmit() {
    try {
      let response = await fetch('http://localhost:3000/imageUrl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl,
        }),
      });
      let data = await response.json();
      if (data) {
        try {
          let thisUser = await fetch('http://localhost:3000/image', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: user.id,
            }),
          });
          let count = await thisUser.json();
          setUser({ name: user.name, entries: count });
        } catch (error) {
          console.log('App.js (102): User not found', error);
        }
      }
      displayFacebox(calculateFaceLocation(data));
    } catch (error) {
      console.log('App.js (106) There was an issue catching the face coordinates', error);
    }
  }

  const onRouteChange = (routeChange) => {
    console.log(`Von Route ${route} nach Route ${routeChange}`);
    switch (routeChange) {
      case 'home':
        setIsSignedIn(true);
        break;
      case 'signout':
        resetAppState();
        setIsSignedIn(false);
        break;
      default:
        break;
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
      ) : route === 'signin' || route === 'signout' ? (
        <SignIn onRouteChange={onRouteChange} loadUserProfile={loadUserProfile} />
      ) : (
        <Register onRouteChange={onRouteChange} loadUserProfile={loadUserProfile} />
      )}
    </div>
  );
}

export default App;
