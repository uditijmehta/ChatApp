import React from 'react';
import {View, SafeAreaView, Keyboard, Modal} from 'react-native';
import {Button, Header, Input, Text as TextComp} from "../../components";
import {FooterTextBtn, FooterText, LoginImg, ContentContainer, TextB} from './styles';
import * as Animatable from 'react-native-animatable';
import {useDispatch} from "react-redux";
import {register} from "../../redux/actions";
import LangModal from "./LangModal";
import {useNavigate, Router} from "react-router-dom";
// import PasswordChecklist from 'react-password-checklist';
// import ToastManager, {Toast} from "toastify-react-native";

const SignUp = (props) => {
  const [loginType, setLoginType] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [name, setName] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [language, setLanguage] = React.useState('');
  const [footerVisible, setFooterVisible] = React.useState(true);
  const [isValid, setIsValid] = React.useState('');
  const [langModalVisible, setLangModalVisible] = React.useState(false);

  const dispatch = useDispatch();


  React.useEffect(() => {
    Keyboard.addListener('keyboardDidShow', () => setFooterVisible(false));
    Keyboard.addListener('keyboardDidHide', () => setFooterVisible(true));
    return () => {
      Keyboard.removeAllListeners('keyboardDidShow');
      Keyboard.removeAllListeners('keyboardDidHide');
    }
  }, []);

  React.useEffect(() => {
    const hasDigit = /\d/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    setIsValid(hasDigit && hasUppercase && (password.length >= 8));
  }, [password])

  const signUp = React.useCallback(() => {
    if (!(email.length > 0 && phone.length > 4)) {
      return alert('Please enter an email and phone number!')
    }
    if(!(/\S+@\S+\.\S+/.test(email))){
      return alert('Valid email is required!')
    }
    if (!name) {
      return alert('Please enter your name!')
    }
    if (!password || !isValid) {
      return alert('Please enter a valid password! \nMust have a minimum of 8 characters, including 1 number, and 1 capitalized letter.')
    }
    if (!language) {
      return alert('Please select your language!')
    }
    try {
      dispatch(register({name, email, phone, password, language}));
    } catch (e) {
      console.log(e.response.data.message)
    }
  },[name, email, phone, password, language, isValid]);

  return (
    <>
      {/* <Header {...props} title="gibber" hideRight/> */}
        <Animatable.View animation="fadeIn" style={{flex: 1}}>
          <View style={{padding: 20, marginTop: "15%"}}>
          <TextComp size="larger" weight="900">Sign Up</TextComp>
            <Input label="Name" value={name} onChange={setName} />
            <Input label="Phone" value={phone} onChange={setPhone} keyboardType="phone-pad" />
            <Input label="Email" value={email} onChange={setEmail} keyboardType="email-address" autoCapitalize={"none"} />
            <Input label="Password" value={password} onChange={setPassword} secureTextEntry />

            <Button 
              title="Choose Your Language" 
              style={{marginTop: "10%", marginBottom: "10%"}} 
              onPress={() => setLangModalVisible(true)} />
            <Button title="Sign Up" onPress={signUp} style={{marginTop: 25}} />
          </View>
          <LangModal visible={langModalVisible} close={() => setLangModalVisible(false)} animationType='slide' setLang={setLanguage}/>
        </Animatable.View>
      
      {footerVisible ? <FooterTextBtn onPress={() => props.navigation.goBack()}>
        <SafeAreaView>
          <FooterText><TextB>Have an account?</TextB> Login</FooterText>
        </SafeAreaView>
      </FooterTextBtn> : null}
    </>
  )
};

export default SignUp;
