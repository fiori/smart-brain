import React, { useState, useEffect } from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim'; // if you are going to use `loadSlim`, install the "@tsparticles/slim" package too.
import MyParticles from './components/Particles/Particles';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';

function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [init, setInit] = useState(false);
  const [input, setInput] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [boxes, setBoxes] = useState([]);
  const [route, setRoute] = useState('signin');
  const [user, setUser] = useState(null);

  const resetAllStates = () => {
    setIsSignedIn(false);
    setInput('');
    setImageUrl('');
    setBoxes([]);
    setUser(null);
  };

  // this should be run only once per application lifetime
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
      // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
      // starting from v2 you can add only the features you need reducing the bundle size
      //await loadAll(engine);
      //await loadFull(engine);
      await loadSlim(engine);
      //await loadBasic(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const updateUserEntries = (entries) => {
    setUser((prevData) => ({ ...prevData, entries: entries }));
  };

  const onInputChange = (event) => {
    setInput(event.target.value);
  };

  const calculateFaceLocation = (region) => {
    // Accessing and rounding the bounding box values
    const boundingBox = region.region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    const topRow = boundingBox.top_row.toFixed(3) * height;
    const leftCol = boundingBox.left_col.toFixed(3) * width;
    const bottomRow = height - boundingBox.bottom_row.toFixed(3) * height;
    const rightCol = width - boundingBox.right_col.toFixed(3) * width;
    const value = region.value;

    return {
      topRow,
      bottomRow,
      leftCol,
      rightCol,
      value,
    };
  };

  const onRouteChange = (route) => {
    if (route === 'signout') {
      resetAllStates();
    } else if (route === 'home') {
      setIsSignedIn(true);
    }

    setRoute(route);
  };

  const onPictureSubmit = () => {
    setImageUrl(input);

    fetch('http://localhost:3000/imageurl', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: input,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          // Check for 400 status code
          if (response.status === 400) {
            throw new Error('Bad Request - Cant work with api');
          }
          // Handle other non-successful status codes here if needed
          throw new Error(`Server Error: ${response.status}`);
        }
        return response.json();
      })
      .then((response) => {
        if (response) {
          fetch('http://localhost:3000/image', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: user.id }),
          })
            .then((r) => r.json())
            .then(updateUserEntries)
            .catch(console.log);
          const regions = response.outputs[0].data.regions;
          var myBoxes = [];
          regions.forEach((region) => {
            myBoxes.push(calculateFaceLocation(region));
          });
          setBoxes(myBoxes);
        }
      })
      .catch((error) => console.log('error', error));
  };

  if (init) {
    return (
      <div className="App">
        <MyParticles />
        <Navigation isSignedIn={isSignedIn} onRouteChange={onRouteChange} />
        {route === 'home' ? (
          <>
            <Logo />
            <Rank user={user} />
            <ImageLinkForm onInputChange={onInputChange} onButtonSubmit={onPictureSubmit} />
            <FaceRecognition imageUrl={imageUrl} box={boxes} />
          </>
        ) : route === 'register' ? (
          <Register onRouteChange={onRouteChange} setUser={setUser} />
        ) : (
          <Signin onRouteChange={onRouteChange} setUser={setUser} />
        )}
      </div>
    );
  } else return <></>;
}

export default App;
