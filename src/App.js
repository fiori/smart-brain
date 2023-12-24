import React, { useState, useEffect } from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from "@tsparticles/slim"; // if you are going to use `loadSlim`, install the "@tsparticles/slim" package too.
import MyParticles from './components/Particles/Particles';


function App() {
  const [init, setInit] = useState(false);
  const [input, setInput] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [box, setBox] = useState([]);
  
  // this should be run only once per application lifetime
  useEffect(() => {
    initParticlesEngine(async engine => {
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

  const onInputChange = event => {
    setInput(event.target.value);
  };

  const onButtonSubmit = () => {
    setImageUrl(input);

    // https://api.clarifai.com/v2/models/{YOUR_MODEL_ID}/outputs
    // this will default to the latest version_id
    fetch('https://api.clarifai.com/v2/models/face-detection/outputs', requestOptions(input))
      .then(response => response.json())
      .then(result => {
        console.log(result);
        const regions = result.outputs[0].data.regions;

        var myBoxes = [];

        regions.forEach(region => {
          // Accessing and rounding the bounding box values
          const boundingBox = region.region_info.bounding_box;
          const topRow = boundingBox.top_row.toFixed(3);
          const leftCol = boundingBox.left_col.toFixed(3);
          const bottomRow = boundingBox.bottom_row.toFixed(3);
          const rightCol = boundingBox.right_col.toFixed(3);
          const value = region.value;

          myBoxes.push({
            topRow,
            bottomRow,
            leftCol,
            rightCol,
            value,
          });
        });
        
        setBox(myBoxes);
        console.log(myBoxes)
      })
      .catch(error => console.log('error', error));
  };





  // NOTE: MODEL_VERSION_ID is optional, you can also call prediction with the MODEL_ID only
  // https://api.clarifai.com/v2/models/{YOUR_MODEL_ID}/outputs
  // this will default to the latest version_id
  if (init) {
    return (
      <div className="App">
        <MyParticles />
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm onInputChange={onInputChange} onButtonSubmit={onButtonSubmit} />
        <FaceRecognition imageUrl={imageUrl} box={box} />
      </div>
    );
  }

  return <></>;

  function requestOptions(imgUrl) {
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // In this section, we set the user authentication, user and app ID, model details, and the URL
    // of the image we want as an input. Change these strings to run your own example.
    //////////////////////////////////////////////////////////////////////////////////////////////////

    // Your PAT (Personal Access Token) can be found in the portal under Authentification
    const PAT = '61368c3a306f4400b35e0d0b9949ff49';
    // Specify the correct user_id/app_id pairings
    // Since you're making inferences outside your app's scope
    const USER_ID = 'clarifai';
    const APP_ID = 'main';
    // Change these to whatever model and image URL you want to use
    const IMAGE_URL = imgUrl;

    ///////////////////////////////////////////////////////////////////////////////////
    // YOU DO NOT NEED TO CHANGE ANYTHING BELOW THIS LINE TO RUN THIS EXAMPLE
    ///////////////////////////////////////////////////////////////////////////////////
    const raw = JSON.stringify({
      user_app_id: {
        user_id: USER_ID,
        app_id: APP_ID,
      },
      inputs: [
        {
          data: {
            image: {
              url: IMAGE_URL,
              // "base64": IMAGE_BYTES_STRING
            },
          },
        },
      ],
    });

    return {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: 'Key ' + PAT,
      },
      body: raw,
    };
  }
}

export default App;
