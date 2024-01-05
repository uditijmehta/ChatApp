import styled from "styled-components";

export const Container = styled.div`
  width: 1400px;
  margin: auto;
  height: 100%;
  display: flex;
  padding: 25px 0;
  justify-content: space-between;
  position: relative;
  @media screen and (max-width: 1500px) {
    width: 90%;
  }
`;

export const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100vw;
  p {
    margin: 35px 0;
  }
  h1 {
    margin-top: -15px;
  }
`;

export const RightSection = styled.div`
  align-self: center;
  position: relative;
  @media screen and (max-width: 1100px) {
    display: none;
  }
`;

export const StoreBtn = styled.img`
  width: 180px;
  margin-right: 15px;
`;

export const Shape = styled.img`
  position: absolute;
  width: 130px;
`;

export const HomeText = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 100vh;
`;
