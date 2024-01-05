import styled from "styled-components/native";

const LoginImg = styled.Image.attrs(({theme}) => ({
  source: theme.mode === 'light' ? require('../../images/login.png') : require('../../images/login-dark.png')
}))`
  width: 250px;
  height: 210px;
  resize-mode: contain;
  margin-top: -50px;
`;

const LanguageModal = styled.View`
  display: flex;
  height: 120%;
  width: 100%;
  color: white;
  background: #378fd3;
  padding-top: 15%;
`        

const LanguageItem = styled.TouchableOpacity`
   display: flex;
   flex-direction: column;
   position: relative;
   padding: 25px;
   background-color: ${(props) => 
    props.className === 'selectedClass' ? "white" : "#378fd3"
    };
`

const FooterTextBtn = styled.TouchableOpacity`
  position: absolute;
  bottom: 10px;
  left: 0; right: 0;
`;

const FooterText = styled.Text`
  text-align: center;
  color: ${({theme}) => theme.primary};
  font-size: 16px;
`;

const ContentContainer = styled.View`
  flex: 1;
  paddingHorizontal: 20px;
  justify-content: center;
  align-items: center;
  background-color: ${({theme}) => theme.mode === 'light' ? '#fff' : 'transparent'};
`;

const TextB = styled.Text`
  color: ${({theme}) => theme.txt};
`;

export const LoadingWrapper = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const Row = styled.View`
  flex-direction: row;
  margin-bottom: 15px;
  top: 25px;
`;

export {FooterText, FooterTextBtn, LoginImg, ContentContainer, TextB, LanguageModal, LanguageItem, Row};
