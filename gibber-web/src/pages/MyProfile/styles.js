import styled from "styled-components";
export const Container = styled.div`
  height: 100%;
  width: 100%;
  padding: 0px;
  margin: 0px;
  display: flex;
  flex-direction: column;
  border-color: gray;
  border-radius: 0px 0px 25px 25px;
  align-items: center;
  overflow-y:  scroll;
  background-color: ${props => props.theme.bg};
  color: ${props => props.theme.txt};
  position: relative;
`

export const Divider = styled.div`
  width: 130px;
  height: 2px;
  background-color: ${props => props.theme.title};
  @media screen and (max-width: 350px) {
    width: 110px;
  }
`;

export const TextField = styled.div`

    margin-left: calc(50% - 100px);

    & h5 {
        display: inline-block;
        text-align: left;
        margin: 5px 5px 5px 0px;
    }
    

    & input {
        color: ${props => props.theme.title} !important;
    }
`;

export const AvatarDisplay = styled.img`
  height: 200px;
  width: 200px;
  border-radius: 50%;
  border: 2px solid grey;
  margin-top: 25px;
`;

export const CustomCheckbox = styled.input`
    margin-left: 10px;
    margin-right: 10px;
`;

export const Input = styled.input`
  border: none;
  background-image: none;
  background-color: transparent;
  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  box-shadow: none;
  border-bottom: 2px solid #848484;
  font-size: calc(.5rem + .5vw);
  width: calc(100% - 20px);
  padding-inline: 15%;
  padding: 5px 5px 5px 15px;
  font-weight: 500;

  &:focus {
    outline: none;
  }
`

export const ProfileHeader = styled.header`
  width: 100%;
  position: relative;
  z-index: 2;
  border-radius: 25px 25px 0px 0px;
  background-color: ${({theme}) => theme.bg};
  display: flex;
  transition: all 0.3s ease-in;
  overflow: hidden;
  .loading {
    width: 100%;
    justify-content: center;
  }
`;

export const ProfileForm = styled.div`
  margin-bottom: 50px;
  padding: 50px;
  background-color: ${({theme}) => theme.bg};
  border: none;
  border-radius: 25px;
  box-shadow: lightgray 0px 0px 5px;
  justify-content: space-between;
`;

export const CenteredDiv = styled.div`
  justify-self: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: ${({vertical}) => vertical || 'flex-start'};
  width: ${({width}) => window.innerWidth < 500 ? '75%' : width || '75%'};
  box-shadow: gray 0px 0px 5px;
  border-radius: 25px;
`;