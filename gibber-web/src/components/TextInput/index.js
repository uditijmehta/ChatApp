import React from 'react';
import {Text} from "./styles";

function TextInput({value, onChange, placeholder, ...props}) {
  return <Text value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} {...props} />
}

export default TextInput;
