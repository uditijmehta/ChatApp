import React from 'react';
import {theme} from "../../config/theme";
import {ThemeProvider} from "styled-components";
import {Chat, Profile, Sidebar} from "../../components";
import {Container} from "./styles";
import {Header} from "./styles";
import {useNavigate, useOutletContext} from "react-router-dom";
import Api from "../../config/axios";
import {LoadScript} from "@react-google-maps/api";
import constants from "../../config/constants";
import {createChat, disconnectSocket, initiateSocket, newChat, refreshMessages, setOffline, setOnline} from "./socket";
import Spinner from "../../components/Spinner";
import useDimensions from "../../utils/useDimensions";
import {CenteredContent} from "../../utils/sharedStyles";
import {useBeforeunload} from 'react-beforeunload';

function ChatRoom() {
  const {width} = useDimensions();
  const [loading, setLoading] = React.useState(true);
  const [mode, setMode] = useOutletContext();
  const [user, setUser] = React.useState({});
  const [conversations, setConversations] = React.useState([]);
  const [chatId, setChatId] = React.useState('');
  const [chatData, setChatData] = React.useState({});
  const [profile, setProfile] = React.useState();
  const [sidebarStatus, setSidebarStatus] = React.useState('open');
  const navigate = useNavigate();

  React.useEffect(() => {
    fetchData();
    return () => {disconnectSocket()}
  }, []);

  const fetchData = React.useCallback(async () => {
    const token = localStorage.getItem('token');
    if (token) {
      Api.setToken(token);
      const user = (await Api.get('/user')).data;
      if (!user) {
        localStorage.removeItem('token');
        navigate('/app/login');
        return;
      }
      const conversations = (await Api.get('/chat/conversation')).data.data;
      setUser(user);
      setConversations(conversations);
      setOnline(user._id);
      setLoading(false);
    } else
      navigate('/app/login');
  }, []);

  useBeforeunload(() => {setOffline(user._id)});

  const fetchChatData = React.useCallback(async () => {
    if (chatId) {
      const res = await Api.get('/chat/conversation/' + chatId);
      setChatData(res.data);
      setSidebarStatus('close')
    }
  }, [chatId]);
  React.useEffect(() => {
    fetchChatData()
  }, [chatId, fetchChatData]);

  React.useEffect(() => {
    if (user._id) {
      initiateSocket(user._id);
      refreshMessages(data => {
        setConversations(state => state.map(c => c._id === data.conversationId ?
          ({...c, message: data, unseenMessageLength: (c.unseenMessageLength||0)+1}) : c));
      });
      newChat(data => {
        setConversations(state => [data, ...state])
      });
    }
  }, [user._id]);

  React.useEffect(() => {}, [sidebarStatus]);

  const updateLastMessage = React.useCallback((id, message) => {
    setConversations(state => state.map(c => c._id === id ? {...c, message} : c))
  }, []);

  const setSeenMessages = React.useCallback((data) => {
    setConversations(state => state.map(c => c._id === data.conversationId ?
      ({...c, message: {...c.message, seenBy: [...(c.message?.seenBy || []), data.userId]}, unseenMessageLength: 0}) : c))
  }, []);

  const createConversation = React.useCallback((newChat) => {
    setConversations(state => [newChat, ...state]);
    createChat(newChat);
  }, []);

  const setThemeMode = React.useCallback(val => {
    setMode(val);
    localStorage.setItem('mode', val);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate('/')
  }

  const handleProfileClick = (event) => {
    event.preventDefault();
    navigate(`/app/myprofile`, { state: user })
  }

  const sideBarToggle = (val) => {
    if(width < 700 && val === 'close'){
      setSidebarStatus(val);
    }else {
      if(sidebarStatus === 'close') setSidebarStatus('open');
      else setSidebarStatus('close');

    }
  }

  return (
    <ThemeProvider theme={mode === 'dark' ? theme.dark : theme.light}>
      <Header style={{display: "flex", justifyContent: "flex-end"}}>
        <a href={`/app/myprofile`} style={{ fontSize: 14, marginTop: 5, color: 'royalblue'}} onClick={handleProfileClick}>My Profile</a>
        <span style={{marginLeft: 5, marginRight: 5, marginTop: 5, color: 'gray'}}>|</span>
        <a href='/' style={{ fontSize: 14, marginTop: 5, marginRight:25, color: 'royalblue'}} onClick={handleLogout}>Logout</a>
      </Header>

      <Container>
        {loading ? <CenteredContent className="loading"><Spinner color="#358bd0"/></CenteredContent>:
          <>
            {width >= 700 || ( sidebarStatus === 'open') ? <Sidebar width={width} user={user} conversations={conversations} setConversations={setConversations} setChatId={setChatId} createChat={createConversation} setSidebarStatus={setSidebarStatus} /> : <></>}
            {chatData._id &&
            <LoadScript googleMapsApiKey={constants.maps_api}>
              {width > 950 || !profile ? <Chat
                updateLastMessage={updateLastMessage}
                setSeenMessages={setSeenMessages}
                setProfile={setProfile}
                data={chatData}
                user={user}
                mode={mode}
                setMode={setThemeMode}
                sideBarToggle={sideBarToggle}
                sidebarStatus={sidebarStatus}
              />: <></>}
            </LoadScript>
            }
            {profile ? <Profile id={profile} setProfile={setProfile} /> : null}
          </>
        }
      </Container>
    </ThemeProvider>
  )
}

export default ChatRoom;
