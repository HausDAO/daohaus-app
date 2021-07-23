import React from 'react';
import styled from '@emotion/styled';
import { Box } from '@chakra-ui/react';
import DatePicker from 'react-datepicker';

const CustomWrapper = styled(Box)`
  input {
    width: 100%;
    transition: all 200ms;
    color: var(--chakra-colors-mode-900);
    background: transparent;
    border: 1px solid var(--chakra-colors-mode-900);
    border-radius: var(--chakra-radii-md);
    line-height: inherit;
    height: var(--chakra-sizes-10);
    padding: 0 var(--chakra-space-4);

    &:focus {
      border-color: var(--chakra-colors-secondary-500);
      box-shadow: 0 0 0 2px var(--chakra-colors-secondary-500);
      outline: none;
    }

    &:hover {
      opacity: 0.5;
    }
  }

  .react-datepicker-popper {
    padding: var(--chakra-space-1);
    margin-top: var(--chakra-space-3);
    background: var(--chakra-colors-blackAlpha-600);
    border-radius: var(--chakra-radii-md);
    border: 1px solid var(--chakra-colors-whiteAlpha-200);
  }

  .react-datepicker__navigation {
    position: relative;
    span:hover {
      background-color: var(--chakra-colors-secondary-500);
      border-radius: var(--chakra-radii-md);
    }
  }

  .react-datepicker__navigation-icon {
    padding: var(--chakra-space-1);
  }

  .react-datepicker__navigation--next {
    align-self: flex-end;
  }

  .react-datepicker__navigation--previous {
    align-self: flex-start;
  }

  .react-datepicker__current-month {
    text-align: center;
  }

  .react-datepicker__day-names,
  .react-datepicker__week {
    display: flex;
    flex-direction: row;
  }

  .react-datepicker__day-name,
  .react-datepicker__day {
    width: calc(var(--chakra-fontSizes-md) * 2);
    border-radius: var(--chakra-radii-md);
    text-align: center;
  }

  .react-datepicker__day:hover {
    background-color: var(--chakra-colors-secondary-500);
  }

  .react-datepicker__day--disabled {
    opacity: 0.5;
    cursor: auto;

    &:hover {
      background: none;
    }
  }

  .react-datepicker__input-time-container {
    padding: var(--chakra-space-1);
  }
`;

const DateSelect = ({
  placeholderText,
  showTimeInput,
  selected,
  onChange,
  minDate,
  maxDate,
  ...props
}) => {
  return (
    <CustomWrapper {...props}>
      <DatePicker
        placeholderText={placeholderText}
        showTimeInput={showTimeInput}
        selected={selected}
        onChange={onChange}
        minDate={minDate}
        maxDate={maxDate}
      />
    </CustomWrapper>
  );
};

export default DateSelect;
