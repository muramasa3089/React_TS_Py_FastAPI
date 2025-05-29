import { useState } from "react";
import styled from "styled-components";

export default function Index() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1>Hi This is Index Page</h1>
      <p>times: {count}</p>
      <Wrapper onClick={() => setCount((count) => count + 1)}>Styled Component</Wrapper>
    </>
  );
}

const Wrapper = styled.button`
  color: white;
  background-color: blue;
  padding: 10px;
  border-radius: 5px;
  margin-top: 10px;
  cursor: pointer;
  &:hover {
    background-color: red;
    color: blue;
  }
`;
