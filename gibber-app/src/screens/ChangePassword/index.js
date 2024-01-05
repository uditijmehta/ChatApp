import React, { useEffect } from 'react';
import {Alert, View, Text} from "react-native";
import {Button, Header, Icon, Input} from "../../components";
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useDispatch, useSelector} from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Head, Row, IconBtn, Avatar, InputContainer, AvatarContainer, LogoutBtn} from './styles';
import {getImageFromLibrary} from "../../utils/imagePicker";
import {logout, updatePassword} from "../../redux/actions";
import {getAvatarPath, getFileObj, getUploadHeaders} from "../../utils/helpers";
import constants from "../../config/constants";
import {Api} from "../../config";

const ChangePassword = (props) => {
    const [password, setPassword] = React.useState('');
    const [oldPassword, setOldPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [isValid, setIsValid] = React.useState(false);
    const [passwordChanged, setPasswordChanged] = React.useState(false);
    const user = useSelector(state => state.main.user.data);
    const dispatch = useDispatch();

    React.useEffect(() => {
        setPassword(user.password);
        setConfirmPassword(user.confirmPassword);
    }, [user]);
    
    React.useEffect(() => {
        const hasDigit = /\d/.test(password);
        const hasUppercase = /[A-Z]/.test(password);
        setIsValid(hasDigit && hasUppercase && (password.length >= 8));
    }, [password, confirmPassword]);

    const updateUserPassword = React.useCallback(() => {
        if(!isValid || !oldPassword) {
            return alert('Please enter a valid password! \nMust have a minimum of 8 characters, including 1 number, and 1 capitalized letter.')
        }
        if(confirmPassword !== password) {
            return alert('Passwords do not match!');
        }
        dispatch(updatePassword({userOldPassword: oldPassword, userNewPassword: password, id: user._id}));

        Alert.alert('Successful', 'Your password has been updated!');
    }, [password, oldPassword, confirmPassword, isValid]);

    const useLogout = React.useCallback(async () => {
        await AsyncStorage.removeItem('token');
        Api.setToken('');
        props.navigation.replace('Login');
        dispatch(logout());
      }, []);

    return (
        <View style={{flex: 1}}>
            <Header title="Change Password" showBack titleStyle={{top: 1}}/>
            <KeyboardAwareScrollView contentContainerStyle={{padding: 25}}>
                <Row>
                    <Text>Update your password below</Text>
                </Row>
                <Row></Row>
                <Row>
                    <Icon name="lock" size={25}/>
                    <InputContainer><Input label="Old Password" value={oldPassword} onChange={setOldPassword} secureTextEntry/></InputContainer>
                </Row>
                <Row>
                    <Icon name="lock" size={25}/>
                    <InputContainer><Input label="New Password" value={password} onChange={setPassword} secureTextEntry/></InputContainer>
                </Row>
                <Row>
                    <Icon name="lock" size={25}/>
                    <InputContainer><Input label="Confirm Password" value={confirmPassword} onChange={setConfirmPassword} secureTextEntry/></InputContainer>
                </Row>
                <Button onPress={updateUserPassword} title="Update Password" disabled={!password || !confirmPassword}/>
                <LogoutBtn onPress={useLogout}>Logout</LogoutBtn>
            </KeyboardAwareScrollView>
        </View>
    )
};

export default ChangePassword;