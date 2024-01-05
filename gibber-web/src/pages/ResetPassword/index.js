import React from 'react';
import {CenteredContent, Logo, Button} from "../../utils/sharedStyles";
import TextInput from '../../components/TextInput';
import {Link} from "react-router-dom";
import Api from '../../config/axios';
import {toast} from "react-toastify";
import PasswordChecklist from 'react-password-checklist';
import 'react-phone-input-2/lib/style.css'
import { useLocation } from 'react-router-dom';

export default function ResetPassword() {
    const [password, setPassword] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [isValid, setIsValid] = React.useState(false);
    const [passwordChanged, setPasswordChanged] = React.useState(false);
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get("token");
    const tokenId = searchParams.get("tokenId");

    React.useEffect(() => {
        const hasDigit = /\d/.test(password);
        const hasUppercase = /[A-Z]/.test(password);
        setIsValid(hasDigit && hasUppercase && password.length >= 8);
      }, [password, confirmPassword]);
    
    const passwordReset = React.useCallback(async () => {
        if(!isValid) {
            return toast.warning('Password is not valid!');
        }
        if(confirmPassword !== password) {
            return toast.warning('Passwords do not match! Please try again')
        }
        try {
            await Api.post('/user/reset-password', {
                newPassword: password,
                token,
                tokenId,
                email
            });
            toast.success('Your password has been reset!');
            setPasswordChanged(true);
        } catch (e) {
            toast.error("There was an issue resetting your password. You are not authorized!");
        }
    }, [password, confirmPassword, isValid, token, tokenId]);

    if(!passwordChanged) {
        return (
            <div className="container">
               <Link to="/"><Logo/></Link>
               <CenteredContent>
               <h3>Enter your email</h3>
                <TextInput type="email" placeholder="Email" value={email} onChange={setEmail}/> <br/><br/>
                <h3>Enter your new passord</h3>
                <TextInput type="password" placeholder="New Password" value={password} onChange={setPassword}/>
                <PasswordChecklist
                    rules={["minLength", "number","capital"]}
                    minLength={8}
                    value={password}
                />
                <br></br>
                <br></br>
                <h3>Confirm your new password</h3>
                <TextInput type="password" placeholder="Confirm New Password" value={confirmPassword} onChange={setConfirmPassword}/>
                <br></br>
                {/* toast SUCCESS then nav to login */}
                {/* setPage to "password has reset" (don't need to navigate to another page) */}
                <Button onClick={passwordReset}>Reset Password</Button>
               </CenteredContent>
            </div>
        );
    }
    else {
        return (
            <div className="container">
                <Link to="/"><Logo/></Link>
                <CenteredContent>
                    <h3>Your Password has been reset!</h3>
                    <h3></h3>
                </CenteredContent>
            </div>
        );
    }
    
}