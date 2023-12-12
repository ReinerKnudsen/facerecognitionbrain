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

// Your PAT (Personal Access Token) can be found in the portal under Authentification
const PAT = 'bb06795ea60a45d2a210faee14877836';
// Specify the correct user_id/app_id pairings
// Since you're making inferences outside your app's scope
const USER_ID = 'reinerknudsen';
const APP_ID = 'smartbrain';
// Change these to whatever model and image URL you want to use
const MODEL_ID = 'face-detection';
//const IMAGE_URL = imageUrl;

function App() {
  const [imageUrl, setImageUrl] = useState('');
  const [box, setBox] = useState({});
  const [route, setRoute] = useState('signout');
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState({
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: '',
  });

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
  const onInputChange = (event) => {
    setImageUrl(event.target.value);
  };

  const calculateFaceLocation = (data) => {
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
      .then((result) => displayFacebox(calculateFaceLocation(result)))
      .catch((error) => console.log('error', error));
  };

  const onRouteChange = (routeChange) => {
    if (route === 'signout') {
      setIsSignedIn(false);
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
