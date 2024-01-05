import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {theme} from "../../config/theme";
import {ThemeProvider} from "styled-components";
import { useOutletContext} from "react-router-dom";
import {Button, CenteredContent, Logo, Row} from "../../utils/sharedStyles";
import {CustomCheckbox, Container, Divider, TextField, ProfileHeader, ProfileForm, CenteredDiv, Input} from "./styles";
import PasswordChecklist from 'react-password-checklist';
import Api from "../../config/axios";
import "./index.css";
import { toast } from "react-toastify";
import FileUpload from "../../components/FileUpload";
import {getAvatarPath} from "../../utils/helpers";
import {useOutsideAlerter} from "../../utils/useOutsideAlerter";
import {Icon, Switch} from "../../components";
import DropdownInput from "../../components/DropdownInput";
import {languages} from "../../utils/languages";
import { useNavigate } from 'react-router-dom';

function MyProfile(props) {
  const location = useLocation();
  const userData = location.state;
  //This state variable will store the current language and change the user's language
  const [userLanguage, setUserLanguage] = React.useState(userData.language);
  const navigate = useNavigate();

  // This state variable will keep track of whether the component is in edit mode or not,
  // if true user is allowed to edit the profile
  const [isEditMode, setIsEditMode] = useState(false);

  const [toggle, setToggle] = useState(userData.translateUser);
  const [avatar, setAvatar] = useState(getAvatarPath(userData.avatar));
  const [username, setUsername] = useState(userData.name);
  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [mode, setMode] = useOutletContext();
  const [actionsVisible, setActionsVisible] = React.useState(false);
  const actionsRef = React.useRef(null);
  const [newText, setNewText] = React.useState('')

  useOutsideAlerter(actionsRef, () => setActionsVisible(false));

  const handleDelete = async() => {
    const confirmed = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');
    if (!confirmed) return;
    try {
      await Api.delete(`/user/${userData._id}`);
      console.log('Account deleted successfully.');
      navigate('/app/login');
      toast.success('Account Successfully Deleted!')
    } catch (error) {
      console.error(error);
    }
  }

  const handleProfileUpdateSubmit = async () => {
    if (!username || username.trim() === '') {
      toast.warn('Invalid name');
      return;
    }
    if (username !== userData.name) {
      await Api.put(`/user`, { name: username } );
    }
    if (newText) {
      await Api.put(`/user/changeText/${userData._id}`, { textSize: newText });
    }
    if (!password.newPassword && !password.confirmPassword && !password.currentPassword) {
      toast.success('Profile Updated');
      return;
    }
    if (password.newPassword === password.confirmPassword) {
      try {
        await Api.put(`/user/password/${userData._id}`, { userNewPassword: password.newPassword, userOldPassword: password.currentPassword });
      } catch (error) {
        toast.warn("Invalid password or mismatched")
        return;
      }
    }else if (password.newPassword !== password.confirmPassword) {
      toast.warn("Invalid password or mismatched");
      return;
    }
    toast.success('Profile Updated');
    setPassword({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    if(isEditMode){
      handleProfileUpdateSubmit();
    }
  }

  const handleChangeUserName = (event) => {
    setUsername(event.target.value);
  };

  const handleCheckboxChange = async (event) => {
    setToggle(event);
    await Api.put(`/user/translateUser`, { translateUser: event } );
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setPassword({ ...password, [name]: value });
  };

  const handleAvatarChange = (source) => {
    const uri = URL.createObjectURL(source);
    let data = {['image']: uri};
    const formData = new FormData();
    formData.append('file', source);
    Api.put(`/user/avatar`, formData)
        .then((res) => {
          toast.success("Avatar Updated");
          setAvatar(getAvatarPath(res.data.path));
          return res.data.path;
        })
        .catch((error) => {
          toast.error("Error");
        });
  }

  const handleTextChange = (event) => {
    if (event.target.value === "small") setNewText('0.80');
    if (event.target.value === "medium") setNewText('0.90');
    if (event.target.value === "large") setNewText("1.15");
    return;
  }

  // const languageOptions = languages.map((language) => (
  //   <option 
  //     key={language.language} 
  //     value={language.name}
  //     selected={language.name === userLanguage}
  //     >
  //     {language.name}
  //   </option>
  // ));

  //Handle language change here
  //Need to communiate with backend to change the lanuage

  const handleLanguageChange = React.useCallback(async (e) => {
    const selectedLanguage = e.target.value;
    setUserLanguage(selectedLanguage);
  
    // Map the language code to its corresponding name
    const selectedLanguageName = languages.find(
      (language) => language.language === selectedLanguage
    )?.name;
  
    // Map the user language code to its corresponding name
    const userLanguageName = languages.find(
      (language) => language.language === userLanguage
    )?.name;
  
    if (selectedLanguage === userLanguage) {
      toast.success('Your language is already set to ' + (userLanguageName));
    } else {
      try {
        await Api.put(`/user/language/${userData._id}`, {
          language: selectedLanguage,
        });
        toast.success('Your language has been changed to ' + (selectedLanguageName));
        setUserLanguage(selectedLanguage);
      } catch (error) {
        toast.error('Failed to update language');
      }
    }
  });
  
  const languageDropdown = (
    <DropdownInput
      label="Language"
      value={userLanguage}
      onChange={handleLanguageChange}
      style={{marginTop: 0}}
      />
  );

  useEffect(async () => {
    let imag = await getAvatarPath(userData.avatar);
    setAvatar(imag);
  }, [userData.avatar])

  return (
      <ThemeProvider theme={mode === 'dark' ? theme.dark : theme.light}>
        <ProfileHeader>
          <NavLink to="/app/chat" className="back-to-chat" style={{alignSelf:"flex-start"}}>
            <Icon style={{position:'fixed'}}name="arrow-back-outline" size={40} color={'gray'}/>
          </NavLink>
        </ProfileHeader>
        <Container>
            <CenteredContent>
              <div className='avatar-container'>
                <div className='outer'>
                  <img src={avatar} className='image' style={{height: '200px', width: '200px', borderRadius:"50%"}}/>
                  <div className='inner'>
                    <FileUpload accept="image/*" onChange={handleAvatarChange}>
                      <Icon name="edit-outline" size={25} color={'white'}/>
                    </FileUpload>
                  </div>
                </div>
              </div>
              <h1 className="profile-h1">Account Information</h1>
            </CenteredContent>
            {isEditMode ? (
                <CenteredDiv>
                  <div className='element-container'>
                    <h3 className='element-label'>Name</h3>
                    <TextField>
                      <Input type='text' name='username' placeholder={userData.name} onChange={handleChangeUserName}/>
                    </TextField>
                  </div>
                  <Divider style={{background:'gray', width:'90%', height:'1px'}}/>
                  <div className='element-container' style={{paddingTop:'0px'}}>
                    <h3 className='element-label' style={{paddingTop:'35px'}}>Language</h3>
                    <h3 className='element-label' style={{paddingTop:'35px', textAlign:'left'}}>
                      {languageDropdown}
                    </h3>
                    {/*<DropdownInput onChange={nullFunction}/>*/}
                  </div>
                  <div className='element-container' style={{paddingTop:'15px', justifyContent:'left', marginLeft:'25px'}}>
                    <h4 className='element-label' style={{paddingRight:'35px', paddingTop:'10px'}}>Translate my messages</h4>
                      <div className="form-check form-switch" style={{display:'flex'}}>
                        <Switch
                            onChange={handleCheckboxChange}
                            checked={Boolean(toggle)}
                            type="checkbox"
                            role="switch"
                          />
                      </div>
                  </div>
                  <div className='element-container' style={{paddingTop:'0px'}}>
                    <h3 className='element-label' style={{paddingTop:'0.75rem'}}>Text Size</h3>
                    <select className="custom-select" onChange={handleTextChange}>
                      <option value=""></option>
                      <option value="small">small</option>
                      <option value="medium">medium</option>
                      <option value="large">large</option>
                    </select>
                  </div>
                  <Divider style={{background:'gray', width:'90%', height:'1px'}}/>
                  <h2 className='element-label'>Change Password</h2>
                  <div className='element-container'>
                    <h3 className='element-label'>Current Password</h3>
                    <TextField>
                      <Input type='password' value={password.currentPassword} name='currentPassword' onChange={handlePasswordChange}/>
                    </TextField>
                  </div>
                  <div className='element-container'>
                    <h3 className='element-label'>New Password</h3>
                    <TextField>
                      <Input type='password' value={password.newPassword} name='newPassword' onChange={handlePasswordChange}/>
                    </TextField>
                  </div>
                  <div className='element-container' style={{alignContent:'center'}}>
                      <PasswordChecklist
                          rules={["minLength", "number","capital"]}
                          minLength={8}
                          value={password.newPassword}
                      />
                      <br/>
                    </div>
                  <div className='element-container'>
                    <h3 className='element-label'>Confirm Password</h3>
                    <TextField>
                      <Input type='password' value={password.confirmPassword} name='confirmPassword' onChange={handlePasswordChange}/>
                    </TextField>
                  </div>
                </CenteredDiv>
            ):(
                <CenteredDiv className="form-container" style={{width:'75%'}}>
                  <div className='element-container'>
                    <h2 className='element-label' style={{color:'gray'}}>Name</h2>
                    <h2 className='element-label' >{userData.name}</h2>
                  </div>
                  <Divider style={{background:'gray', width:'90%', height:'1px'}}/>
                  <div className='element-container'>
                    <h2 className='element-label' style={{color:'gray'}}>Email</h2>
                    <h2 className='element-label'>{userData.email}</h2>
                  </div>
                  <Divider style={{background:'gray', width:'90%', height:'1px'}}/>
                  <div className='element-container'>
                    <h2 className='element-label' style={{justifyContent:'left', color:'gray'}}>Phone</h2>
                    <h2 className='element-label'>{userData.phone}</h2>
                  </div>
                  <Divider style={{background:'gray', width:'90%', height:'1px'}}/>
                  <div className='element-container'>
                    <h2 className='element-label' style={{justifyContent:'left', color:'gray'}}>Language</h2>
                    <h2 className='element-label'>{(languages.find(value => value.language === userData.language)).name}</h2>
                  </div>
                  <Divider style={{background:'gray', width:'90%', height:'1px'}}/>
                  <div className='element-container'>
                    <h2 className='element-label' style={{justifyContent:'left', color:'gray'}}>Delete Account</h2>
                    <button className="noselect" style={{ marginTop: '20px', borderRadius: '4px' }} onClick={handleDelete}><span className="text">Delete</span><span className="icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"></path></svg></span></button>
                  </div>

                </CenteredDiv>
            )}
          <div style={{display:'flex', paddingTop:'25px', justifyContent:'center', paddingBottom:'25px'}}>
            <button className="rounded-button" onClick={toggleEditMode}>{isEditMode ? 'Save' : 'Edit'}</button>
          </div>
        </Container>
      </ThemeProvider>
  );
}
export default MyProfile;