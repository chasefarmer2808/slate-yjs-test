import styled from 'styled-components';

export const BoxShadowLight = styled.div`
  box-shadow: 5px 10px 18px #888888;
`;

export const Button = styled.button`
  padding: 6px 14px;
  display: block;
  outline: none;
  background-color: transparent;
  font-size: 14px;
  text-align: center;
  white-space: nowrap;
  border: 1px solid lightgrey;
  cursor: pointer;
  transition: all 0.1s ease;

  &:active {
    -webkit-box-shadow: inset 1px 1px 10px #333;
    -moz-box-shadow: inset 1px 1px 10px #333;
    box-shadow: inset 1px 1px 10px #333;
  }
`;

export const PrimaryButton = styled(Button)`
  background-color: var(--bg-color-primary);
  color: white;
`;

interface IconButtonProps {
  active?: boolean;
}

export const IconButton = styled(Button)`
  stroke: ${(props: IconButtonProps) => (props.active ? 'blue' : '#2c3e50')};
  border: none;
  padding: 0;
  color: currentColor;
  display: flex;
  align-items: center;
`;

export const FlyoutList = styled.ul`
  visibility: hidden;
  position: absolute;
  top: 0;
  left: 100%;
  z-index: 3;
  width: 100%;
  background-color: white;
`;

interface TablePreviewBoxProps {
  hovered: boolean;
}

export const TablePreviewBox = styled.span`
  cursor: pointer;
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 1px solid grey;

  background-color: ${(props: TablePreviewBoxProps) =>
    props.hovered ? 'var(--bg-color-primary)' : 'white'};
`;
