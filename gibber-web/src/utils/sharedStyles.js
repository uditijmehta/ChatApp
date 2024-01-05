import styled from "styled-components";

export const Logo = styled.img.attrs({src: require('../images/logo.png')})`
  width: 100px;
  padding-bottom: 20px;
  padding-top: 20px;
`;

export const MocUp = styled.img.attrs({src: require('../images/mocup.png')})`
  width: 600px;
`;
export const MockUpContainer = styled.div`
  display: flex;
  justify-content: center;
`;
export const MockUpSource = styled.img.attrs({src: require('../images/mockupSource.png')})`
  top: 17px;
  width: 265px;
  height: 577px;
  position: absolute;
  border-radius: 35px;
`;

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: ${({align}) => align || 'flex-start'};
  justify-content: ${({justify}) => justify || 'flex-start'};
`;

export const Button = styled.a`
  width: ${({width}) => width ? width + 'px' : 'auto'};
  padding: 16px 66px;
  background-color: #358bd0;
  color: #fff;
  border-radius: 4px;
  font-size: 18px;
  border: 1px solid #358bd0;
  transition: all 0.3s;
  text-align: center;
  cursor: pointer;
  text-decoration: none;
  &:hover {
    background-color: #fff;
    color: #358bd0;
  }
`;


export const CenteredContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: ${({vertical}) => vertical || 'flex-start'};
`;

export const Divider = styled.div`
  width: 130px;
  height: 2px;
  background-color: #333;
  @media screen and (max-width: 350px) {
    width: 110px;
  }
`;
