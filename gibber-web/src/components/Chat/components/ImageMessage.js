import React, {useEffect, useState} from 'react';
import Api from "../../../config/axios";
import {ImgMessage} from '../styles';


function ImageMessage({src}) {

  return (
    <div style={{marginBottom: 15}}>
      <ImgMessage
        src={src}
        controls
      />
    </div>
  )
}

export default ImageMessage;
