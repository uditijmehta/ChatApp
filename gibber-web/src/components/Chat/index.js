import React from 'react';
import {ChatContainer, ChatContent, Header, HeaderAvatar, LoadBtn, MessageText, StatusTxt} from "./styles";
import {getAvatarPath, mapMessageData, translateText} from "../../utils/helpers";
import { Bubble, Avatar, GiftedChat  } from "react-native-gifted-chat";
import { Text, Linking } from "react-native";
import LocationMessage from "./components/LocationMessage";
import {getBubbleProps} from "./components/bubbleProps";
import {theme} from "../../config/theme";
import ChatInput from "./components/ChatInput";
import Api from '../../config/axios';
import {CenteredContent, Row} from "../../utils/sharedStyles";
import {disconnectSocket, initiateSocket, sendMessage, subscribeToChat, subscribeToUserTypingStatus, userTyping} from "./socket";
import VideoMessage from "./components/VideoMessage";
import AudioMessage from "./components/AudioMessage";
import ImageMessage from "./components/ImageMessage";
import {Spinner, Switch} from '../index'
import Icon from '../Icon';
import useDimensions from "../../utils/useDimensions";
import {checkRecipientOnline, removeListeners, subscribeToOffline, subscribeToOnline, subscribeToRecipientOnlineStatus} from "../../pages/ChatRoom/socket";
import styled from 'styled-components/native';
import Hyperlink from "react-native-hyperlink";

let timeout;


function Chat({data, user, mode, sideBarToggle,sidebarStatus, ...props}) {
  const { width } = useDimensions();
  const [messages, setMessages] = React.useState([]);
  const [message, setMessage] = React.useState('');
  const [isGroup, setIsGroup] = React.useState(false);
  const [groupName, setGroupName] = React.useState('');
  const [groupImage, setGroupImage] = React.useState('');
  const [recipient, setRecipient] = React.useState();
  const [recipients, setRecipients] = React.useState([]);
  const [isReady, setIsReady] = React.useState(false);
  const [loadingMoreMsg, setLoadingMoreMsg] = React.useState(false);
  const [noMoreMsg, setNoMoreMsg] = React.useState(false);
  const [page, setPage] = React.useState(0);
  const [isOnline, setIsOnline] = React.useState(false);
  const [recipientTyping, setRecipientTyping] = React.useState(false);
  const [isTyping, setIsTyping] = React.useState(false);
  const [selectedBubble, setSelectedBubble] = React.useState(null);
  //Testing something out for load more button here
  const [totalPages, setTotalPages] = React.useState(1);
  const [userLang, setUserLang] = React.useState(user.language);
  const [text, setText] = React.useState([]);

  React.useEffect(() => {
    setIsReady(false);
    setMessages([]);
    setMessage('');
    setIsGroup(false);
    setGroupName('');
    setGroupImage('');
    setRecipient();
    setRecipients([]);
    setLoadingMoreMsg(false);
    setNoMoreMsg(false);
    setPage(0);
    setData();
  }, [data]);

  const setData = React.useCallback(async () => {
    if (data._id) {
      removeListeners(['userOnline', 'userOffline']);
      disconnectSocket();
      initiateSocket(data._id);
      subscribeToChat(data => {
        if (data.message) {

          setMessages(oldChats =>[data.message, ...oldChats]);
          setSeenMessages([data.message._id]);
        }
      });
      if (!data.isGroup) {
        const recipientUser = data.users.find(x => x._id !== user._id);
        setRecipient(recipientUser);
        subscribeToOnline(recipientUser._id, () => setIsOnline(true));
        subscribeToOffline(recipientUser._id, () => setIsOnline(false));
        subscribeToUserTypingStatus(status => setRecipientTyping(status));
        subscribeToRecipientOnlineStatus(status => setIsOnline(status));
        checkRecipientOnline(recipientUser._id);
      }
      else {
        setRecipients(data.users.filter(x => x._id !== user._id));
        setGroupName(data.name);
        setGroupImage(data.image);
        setIsGroup(true);
      }
      setMessages(data.messages || []);
      const unseenMessages = data.messages.filter(m => m.user !== user._id && !m.seenBy?.includes(user._id)).map(m => m._id);
      setSeenMessages(unseenMessages);
      setIsReady(true);
    }
  }, [data]);

  const setSeenMessages = React.useCallback(async (messageIds) => {
    const reqData = {messageIds, conversationId: data._id, userId: user._id};
    await Api.put('/chat/conversation/set-seen-messages', {messageIds});
    props.setSeenMessages(reqData);
  }, [data, user]);

  const messagesData = React.useMemo(() => mapMessageData(messages), [messages]);

  const onSend = React.useCallback(async (id, message) => {
    const res = await Api.post('/chat/conversation/reply/' + id, {messageData: {...message}, originalLang: user.language});
    props.updateLastMessage(id, res.data.message);
    setMessages(messages => messages.map((msg, i) => i === 0 ? res.data.message : msg));
    sendMessage({...res.data.message, recipientIds: isGroup ? recipients.map(r => r._id) : [recipient._id]});
  }, [isGroup, recipients, recipient, data]);

  const onChangeTimeoutFunc = React.useCallback(() => {
    setIsTyping(false);
    userTyping(false);
  }, []);
  React.useEffect(() => {
    if (message && isOnline) {
      if(!isTyping) {
        setIsTyping(true);
        userTyping(true);
        timeout = setTimeout(onChangeTimeoutFunc, 1500);
      } else {
        clearTimeout(timeout);
        timeout = setTimeout(onChangeTimeoutFunc, 1500);
      }
    }
  }, [message]);

  const appendMessage = React.useCallback((message) => {
    setMessages(previousMessages => [{
      _id: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10),
      ...message,
      createdAt: new Date(),
      user: {_id: user._id, name: user.name, avatar: user.avatar},
    }, ...previousMessages]);

  }, [user, recipients, isGroup, recipient]);

  const deleteMessage = React.useCallback(async (message) => {
    if (message.user._id === user._id) {
      await Api.delete('/chat/conversation/message/' + message._id);
      setMessages(messages => messages.filter(msg => msg._id !== message._id));
      const isLastMsg = messages.findIndex(m => m._id === message._id) === 0;
      if (isLastMsg) props.updateLastMessage(data._id, messages[1]);
    }
  }, [user._id, messages, data._id, props]);

  const onBubbleLongPress = React.useCallback((context, message) => {
    const options = message.user._id === user._id
    ?  ['Show Original Text', 'Delete Message', 'Cancel']
    : ['Show Original Text', 'Cancel'];

    if(!message.originalText) options.shift();

    if (selectedBubble === message._id) {
      options[0] = 'Hide Original Text';
    }
    const cancelButtonIndex = options.length - 1;
    if (options.length === 3) {
      context.actionSheet().showActionSheetWithOptions({options, cancelButtonIndex}, async (buttonIndex) => {
        if (buttonIndex === 0 && options[0] === 'Show Original Text') setSelectedBubble(message._id);
        if (buttonIndex === 0 && options[0] === 'Hide Original Text') setSelectedBubble(null);
        if (buttonIndex === 1) deleteMessage(message);
      })
    } else if (options.length === 2) {
      context.actionSheet().showActionSheetWithOptions({options, cancelButtonIndex}, async (buttonIndex) => {
        if (buttonIndex === 0 && options[0] === 'Show Original Text') setSelectedBubble(message._id);
        if (buttonIndex === 0 && options[0] === 'Hide Original Text') setSelectedBubble(null);
      })
    }
  }, [messages, data._id, selectedBubble]);


  const loadMore = React.useCallback(async () => {
    const newPage = page + 1;
    setLoadingMoreMsg(true);
    const resPageCount = await Api.get(`/chat/conversation/${data._id}/messages/totalPages`);
    const pageCount = resPageCount.data.pageCount - 1;

    const res = await Api.get(`/chat/conversation/${data._id}/messages?page=${newPage}`);
    setMessages(state => [...state, ...res.data.messages]);
    setLoadingMoreMsg(false);
    if(newPage === pageCount) {
      setNoMoreMsg(true);
    } else {
      setPage(newPage);
    }
  }, [data._id, messages.length, page]);


    const renderLoadMoreBtn = React.useMemo(() => {
    if(messages.length > 19 && !noMoreMsg) {
      return (
        <LoadBtn onClick={loadMore} disabled={loadingMoreMsg}>
          {loadingMoreMsg ? <Spinner size={25} color="#fff"/> : 'Load More'}
        </LoadBtn>
      );
    } else {
      return null;
    }
  }, [loadingMoreMsg, messages, loadMore, noMoreMsg]);

  const formatLink = (text) => {
    //This is no longer necessary, but can be used in the future for emails?
    //const linkRegex = /(https?:\/\/[^\s]+)/g;

    // return text.split(linkRegex).map((token, index) => {
    //   if (token.match(linkRegex)) {
    //     return (
    //       <Text key={index} style={{ color: 'blue', textDecorationLine: 'underline'}} onPress={() => Linking.openURL(token)}>
    //         {token}
    //       </Text>
    //     );
    //   }
    //   return token;
    // });
    return (
      <Hyperlink linkDefault={true} linkStyle={{ color: 'blue', textDecorationLine: 'underline'}}>
        <div style={{fontSize: `${user.fontSize}rem`}}>{text}</div>
      </Hyperlink>
    )
  }

  //This has to reformat the text before rendering?
  //Renders the message for split second, also doesn't save new messages, because no backend help?
  //Front end attempt
  const handleNewTranslation = async (text, targetLang) => {
    // try {
    //   const translatedText = await translateText(text, 'es');
    //   setMessages(translatedText);
    // } catch (e) {
    //   console.log(e);
    // }
    // return (
    //   <div>
    //     {text}
    //   </div>
    // )
  }
  
  //Back end attempt
  // const handleNewTranslation = React.useCallback(async () => {
    //Format the text before calling the api
      //Make api call to new api
      
      //Translates all messages and stores new objects/arrays in the user's new language
  // }, [userLang, messages]);

  if (!isReady) return <CenteredContent className="loading"><Spinner/></CenteredContent>;
  return (
    <ChatContainer onFocus={() => {
        if(sidebarStatus === 'open') sideBarToggle('close');
      }}>
      <Header>
      {width < 700 ? <div onClick={sideBarToggle}><Icon name="menu-outline" color="#848484" /></div>: <></>}
        <Row align="center" onClick={() => !isGroup && props.setProfile(recipient._id)}>
          <HeaderAvatar src={getAvatarPath(isGroup ? groupImage : recipient.avatar, isGroup)} />
          <div>
            {isGroup ? groupName : recipient.name}
            {!isGroup && recipientTyping ? <StatusTxt>Typing...</StatusTxt> : isOnline ? <StatusTxt>Online</StatusTxt> : null}
          </div>
        </Row>
        <Switch onChange={() => props.setMode(mode === 'dark' ? 'light' : 'dark')} checked={mode === 'dark'} checkedIcon={false} height={25} uncheckedIcon={false} />
      </Header>
      <ChatContent>
        <GiftedChat
          messages={messagesData}
          user={{_id: user._id}}
          minInputToolbarHeight={60}
          renderBubble={props => {
            if (props.currentMessage.location) return <LocationMessage location={props.currentMessage.location} messagePosition={props.position}/>;
            if (props.currentMessage.audio) return <AudioMessage src={props.currentMessage.audio}/>;

            else {
              const allProps = {...props, ...getBubbleProps(theme[mode]),onLongPress: onBubbleLongPress};
              return (
                <>
                  <Bubble {...allProps} />
                </>
              )
            }
          }}
          renderMessageText={props => {
          const { currentMessage } = props;
          const text = typeof currentMessage?.text === 'string' ? currentMessage?.text : (currentMessage?.text.find(i => i.language === user.language))?.text;
          if (selectedBubble === currentMessage._id) {
            return <MessageText right={props.position === 'right'}>{formatLink(text)}
            <StyledText mode={theme[mode]}>
              {currentMessage.originalText}
            </StyledText>
            </MessageText>
          } else {
            return <MessageText right={props.position === 'right'}>{formatLink(text)}</MessageText>
          }
        }}
          renderAvatar={props => <Avatar {...props} containerStyle={{left: {top: -10, marginRight: 0}}} />}
          renderInputToolbar={() => <ChatInput sidebarStatus={sidebarStatus} value={message} onChange={setMessage} onSend={onSend} appendMessage={appendMessage} chatId={data._id} mode={mode} user={user} />}
          renderMessageVideo={props => <VideoMessage src={props.currentMessage.video}/>}
          renderMessageImage={props => <ImageMessage src={props.currentMessage.image} />}
          listViewProps={{ListFooterComponent: renderLoadMoreBtn}}
          extraData={[mode]}
          shouldUpdateMessage={(props, nextProps) => props.extraData !== nextProps.extraData}
        />
      </ChatContent>
    </ChatContainer>
  )
}

const StyledText = styled.Text`
  font-style: italic;
  color: ${props => (props.mode.mode === 'light' ? '#5A5A5A' : '#D3D3D3')};
`;


export default Chat;
