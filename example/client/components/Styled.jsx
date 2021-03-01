import styled from 'styled-components'

export const GridForm = styled.form`
  width: 50%;
  display: grid;
  grid-gap: 10px;
  grid-template-columns: auto 1fr;
`

export const ColOne = styled.label`
  grid-column: 1;
`

export const ColTwo = styled.input`
  grid-column: 2;
`

export const Button = styled.button`
  display: block;
  grid-column: 2;
  width: 50%;
`

export const Error = styled.div`
  color: red;
  cursor: pointer;
`

export const Info = styled.div`
  color: green;
  cursor: pointer;
`
