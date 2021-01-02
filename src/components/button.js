import React from "react";
import styled from "styled-components";

import { getColor } from "../styles/palette";

export const StyledButton = styled.button`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 4rem;
  padding: 1.1rem 2.4rem;
  font-family: inherit;
  font-size: 1.3rem;
  font-weight: 600;
  line-height: 2rem;
  border-radius: 100px;
  border: none;
  background-color: transparent;
  cursor: pointer;
  transition: 0.2s all;
  outline: none;
  text-align: start;
  &.primary {
    background-color: ${getColor("primary")};
    color: ${getColor("white")};
    :hover:enabled,
    :focus:enabled {
      background-color: ${getColor("blue300")};
    }
    :active:enabled {
      background-color: ${getColor("blue500")};
    }
    :disabled {
      background-color: ${getColor("blue000")};
      cursor: default;
    }
  }
  &.warning {
    background-color: ${getColor("red400")};
    color: ${getColor("white")};
    :hover:enabled,
    :focus:enabled {
      background-color: ${getColor("red300")};
    }
    :active:enabled {
      background-color: ${getColor("red500")};
    }
    :disabled {
      background-color: ${getColor("red000")};
      cursor: default;
    }
  }
  &.secondary {
    background-color: ${getColor("white")};
    border: 1px solid ${getColor("grey300")};
    color: ${getColor("font")};
    :hover:enabled,
    :focus:enabled {
      background-color: ${getColor("grey100")};
    }
    :active:enabled {
      background-color: ${getColor("grey200")};
    }
    :disabled {
      background-color: ${getColor("white")};
      border: 1px solid ${getColor("grey200")};
      cursor: default;
    }
  }
  &.text-button {
    background-color: transparent;
    padding: 0;
    height: auto;
    width: auto;
    color: ${getColor("font")};
    :disabled {
      color: ${getColor("grey300")};
      cursor: default;
    }
  }
  &.with-icon {
    padding: 0 1.8rem;
    .icon-wrapper {
      display: inline-block;
      margin: 0.2rem 0.5rem;
      transform: translate(-0.2rem, 0.2rem);
    }
  }
  &.step-button {
    background-color: transparent;
    padding: 0;
    height: 2.4rem;
    color: ${getColor("font")};
    font-weight: 400;
    transition: none;
  }
  &.icon-button {
    padding: 0;
    margin: 0;
    justify-content: center;
    height: auto;
    width: auto;
    :disabled {
      color: ${getColor("grey200")};
      cursor: default;
    }
  }
  &.long-button {
    width: 100%;
    flex-wrap: wrap;
    align-content: center;
  }
  .icon-button-wrapper {
    padding: 0;
  }
`;

const Button = ({
  className,
  onClick,
  content,
  value,
  selected,
  type,
  id,
  children,
  disabled,
  withIcon = null,
  iconButton = null,
  appendIcon = null,
}) => {
  return (
    <StyledButton
      onClick={onClick}
      value={value}
      type={type}
      id={id}
      disabled={disabled}
      className={`${className} ${withIcon && "with-icon"}`}
      selected={selected}
      // aria-label={content}
    >
      {withIcon && <span className="icon-wrapper">{withIcon}</span>}
      {children}
      {content}
      {appendIcon && <span className="icon-wrapper">{appendIcon}</span>}
      {iconButton && <span className="icon-button-wrapper">{iconButton}</span>}
    </StyledButton>
  );
};

export default Button;
