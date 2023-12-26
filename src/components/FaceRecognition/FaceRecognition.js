import React from 'react';
import './FaceRecognition.css'

const FaceRecognition = ({imageUrl, box}) => {
  return (
    <div className="center ma">
      <div className='absolute mt2'>
        <img id='inputImage' src={imageUrl} alt="" width='500px' height='auto' />
        {box && box.map((face, index) => {
          debugger;
          return (<div
            key={index}
            className='bounding-box'
            style={{
              top: face.topRow,
              bottom: face.bottomRow,
              left: face.leftCol,
              right: face.rightCol
            }}
          >

          </div>)  
        })}
      </div>
    </div>
  );
};

export default FaceRecognition;
