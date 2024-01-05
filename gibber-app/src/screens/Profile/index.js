import React from 'react';
import {Alert, View, Text} from "react-native";
import {Button, Header, Icon, Input} from "../../components";
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useDispatch, useSelector} from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Head, Row, IconBtn, Avatar, InputContainer, AvatarContainer, LogoutBtn} from './styles';
import {getImageFromLibrary} from "../../utils/imagePicker";
import {logout, updateAvatarSuccess, updateProfile, updateTranslateOption} from "../../redux/actions";
import {getAvatarPath, getFileObj, getUploadHeaders} from "../../utils/helpers";
import constants from "../../config/constants";
import {Api} from "../../config";
import {languages} from "../../utils/languages";
import ToggleButton from "../../components/ToggleButton";


const Profile = (props) => {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [language, setLanguage] = React.useState('');
  const [avatar, setAvatar] = React.useState('');
  const user = useSelector(state => state.main.user.data);
  const dispatch = useDispatch();
  const [isEnabled, setIsEnabled] = React.useState(user.translateUser);

  React.useEffect(() => {
    setName(user.name);
    setEmail(user.email);
    setPhone(user.phone);
    setLanguage(user.language);
    setAvatar(user.avatar);
  }, [user]);

  const updateProfileData = React.useCallback(() => {
    if (!(email.length > 0 && phone.length > 4)) {
      return alert('Please enter an email and phone number!')
    }
    if(!(/\S+@\S+\.\S+/.test(email))){
      return alert('Valid email is required!')
    }
    if (!name) {
      return alert('Please enter your name!')
    }
    dispatch(updateProfile({name, email, phone}))
  }, [name, email, phone]);


  const uploadImage = React.useCallback(async () => {
    const imageFile = await getImageFromLibrary();
    if (imageFile.uri) {
      setAvatar(imageFile.uri);
      let data = new FormData();
      data.append('file', getFileObj(imageFile));
      let obj = {method: 'PUT', headers: await getUploadHeaders(), body: data};
      const res = await (await fetch(constants.base_url + '/api/v1/user/avatar', obj)).json();
      dispatch(updateAvatarSuccess(res.path));
      Alert.alert('Successful', 'Avatar updated')
    }
  }, []);

  const useLogout = React.useCallback(async () => {
    await AsyncStorage.removeItem('token');
    Api.setToken('');
    props.navigation.replace('Login');
    dispatch(logout());
  }, []);

  const toggleSwitch = async () => {
    setIsEnabled(previousState => !previousState);
    dispatch(updateTranslateOption({translateUser: !isEnabled}))
  };

  return (
      <View style={{flex: 1}}>
        <Header title="Profile" showBack titleStyle={{top: 1}}/>
        <KeyboardAwareScrollView contentContainerStyle={{padding: 25}}>
          <Head>
            <AvatarContainer>
              <Avatar source={getAvatarPath(avatar)} />
              <IconBtn onPress={uploadImage}><Icon name="camera-outline" size={20} color="#fff" /></IconBtn>
            </AvatarContainer>
          </Head>
          <Row>
            <Icon name="person" size={25} />
            <InputContainer><Input label="Name" value={name} onChange={setName} /></InputContainer>
          </Row>
          <Row>
            <Icon name="phone" size={25} />
            <InputContainer><Input label="Phone" value={phone} onChange={setPhone} keyboardType="phone-pad" /></InputContainer>
          </Row>
          <Row>
            <Icon name="email" size={25} />
            <InputContainer><Input label="Email" value={email} onChange={setEmail}/></InputContainer>
          </Row>
          <Row>
            <Icon name="globe-2" size={25} />
            <Text style={{fontSize:18, marginLeft:10, fontWeight:'bold'}}>{languages.find(value => value.language === language)?.name}</Text>
          </Row>
          <Row style={{marginLeft:10}}>
            <Icon name="alert-circle-outline" size={20} />
            <Text style={{marginLeft:5, fontSize:15}}>Translate my messages</Text>
            <InputContainer>
              <ToggleButton value={isEnabled} onValueChange={toggleSwitch} />
            </InputContainer>
          </Row>
          <Text style={{marginBottom: 15}}>*Note: To update your password, Go to https://www.gibber.chat</Text>
          <Button onPress={updateProfileData} title="Update" disabled={!name || !email || !phone} />
          <LogoutBtn onPress={useLogout}>Logout</LogoutBtn>
        </KeyboardAwareScrollView>
      </View>
  )
};

export default Profile;