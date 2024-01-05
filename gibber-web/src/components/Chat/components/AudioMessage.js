import React, {useEffect, useState} from 'react';
import AudioPlayer from 'react-audio-player';
import Api from "../../../config/axios";
import "./AudioMessageStyles.css";


function AudioMessage({src}) {

  return (

    <div className="audio-player-container" style={{marginBottom: 15, marginLeft: 5}}>
      <AudioPlayer
        src={src}
        controls
        
      />
    </div>
  )
}

export default AudioMessage;
