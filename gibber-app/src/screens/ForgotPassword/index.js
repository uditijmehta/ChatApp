import React, { useEffect } from 'react';
import {Alert, View, Text} from "react-native";
import {Button, Header, Icon, Input} from "../../components";
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useDispatch, useSelector} from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Head, Row, IconBtn, Avatar, InputContainer, AvatarContainer, LogoutBtn} from './styles';
import {forgotPassword} from "../../redux/actions";
import constants from "../../config/constants";
import {Api} from "../../config";

const ForgotPassword = (props) => {
    const [email, setEmail] = React.useState('');
    const [phone, setPhone] = React.useState('');
    const [isValid, setIsValid] = React.useState(false);
    const [changeScreen, setChangeScreen] = React.useState(false);
    const dispatch = useDispatch();

    const passwordResetSender = React.useCallback(() => {
        if(!(email.length > 0) || !email) {
            return alert("Please enter an email address!");
        }
        if(!(/\S+@\S+\.\S+/.test(email))) {
            return alert("Valid email is required!");
        }
        dispatch(forgotPassword({email: email}));
        Alert.alert('Successful', 'If an account exists with that email it will be sent shortly!');
    }, [email]);

    return (
        <View style={{flex: 1}}>
            <Header title="Forgot Password" showBack titleStyle={{top: 1}}/>
            <KeyboardAwareScrollView contentContainerStyle={{padding: 25}}>
                <Row>
                    <Text>Enter the email associated with your Gibber account below and we'll send you a link to reset your password.</Text>
                </Row>
                <Row style={{marginTop: 50}}>
                    <Icon name="email" size={25}/>
                    <InputContainer><Input label="Email" value={email} onChange={setEmail} keyboardType="email-address" autoCapitalize={"none"}/></InputContainer>
                </Row>
                <Button title="Continue" onPress={passwordResetSender}/>
            </KeyboardAwareScrollView>
        </View>
    )

};

export default ForgotPassword;