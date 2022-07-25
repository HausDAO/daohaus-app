import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { RiArrowRightLine, RiArrowLeftLine } from 'react-icons/ri';
import { Box, Flex, Icon, Input } from '@chakra-ui/react';
import styled from '@emotion/styled';

import FieldWrapper from './fieldWrapper';

const CustomWrapper = styled(Box)`
  .react-datepicker {
    display: flex;
    flex-direction: row;
  }

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
    z-index: 3;
    padding: var(--chakra-space-1);
    offset-top: var(--chakra-space-3);
    background: var(--chakra-colors-blackAlpha-900);
    border-radius: var(--chakra-radii-md);
    border: 1px solid var(--chakra-colors-whiteAlpha-200);
  }

  .react-datepicker__navigation {
    border: solid 1px rgba(0, 0, 0, 0);
    position: relative;
    span:hover {
      border: solid 1px var(--chakra-colors-secondary-500);
      border-radius: var(--chakra-radii-md);
    }
  }

  .react-datepicker__navigation-icon {
    padding: var(--chakra-space-1);
  }

  .react-datepicker__navigation--next {
  }

  .react-datepicker__navigation--previous {
  }

  .react-datepicker__current-month {
    text-align: center;
  }

  .react-datepicker__day-names,
  .react-datepicker__week {
    display: flex;
    flex-direction: row;
  }

  .react-datepicker__day-names {
    opacity: 0.6;
  }

  .react-datepicker__day-name,
  .react-datepicker__day {
    width: calc(var(--chakra-fontSizes-md) * 2);
    border-radius: var(--chakra-radii-md);
    text-align: center;
    border-width: 1px;
    border-color: rgba(0, 0, 0, 0);
  }

  .react-datepicker__day:hover {
    border: solid 1px var(--chakra-colors-secondary-500);
  }

  .react-datepicker__day--disabled {
    opacity: 0.5;
    cursor: auto;

    &:hover {
      background: none;
    }
  }

  .react-datepicker__day--selected {
    background-color: var(--chakra-colors-secondary-800);
  }

  .react-datepicker__header--time {
    padding: var(--chakra-space-2);
  }

  .react-datepicker-time__header {
    text-align: center;
  }

  .react-datepicker__time-container {
    padding-left: var(--chakra-space-5);
    height: var(--chakra-sizes-3xs);
    box-sizing: border-box;

    .react-datepicker__time-box {
      overflow-y: scroll;

      &::-webkit-scrollbar {
        display: block;
        width: 4px;
      }

      &::-webkit-scrollbar-thumb {
        background: var(--chakra-colors-whiteAlpha-500);
        border-radius: 999px;
      }

      ul {
        list-style-type: none;
        padding: 0px;

        .react-datepicker__time-list-item--selected {
          background-color: var(--chakra-colors-secondary-800);
        }

        .react-datepicker__time-list-item--disabled {
          opacity: 0.5;
          &:hover {
            border-color: rgba(0, 0, 0, 0);
            cursor: auto;
          }
        }

        li {
          border-radius: var(--chakra-radii-md);
          width: 100%;
          padding-left: var(--chakra-space-1);
          padding-right: var(--chakra-space-1);
          text-align: right;
          border: solid 1px rgba(0, 0, 0, 0);

          &:hover {
            border-color: var(--chakra-colors-secondary-500);
            border-radius: var(--chakra-radii-md);
            cursor: pointer;
          }
        }
      }
    }
  }
`;

const DateSelect = props => {
  const {
    placeholderText,
    showTimeSelect,
    minDate,
    minTime,
    maxDate,
    maxTime,
    localForm,
    name,
    htmlFor,
    width,
  } = props;
  const { register, setValue } = localForm;

  const [selected, setSelected] = useState();
  useEffect(() => {
    setValue(name, parseInt(new Date(selected).getTime() / 1000));
  }, [selected]);

  const renderHeader = ({
    date,
    decreaseMonth,
    increaseMonth,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled,
  }) => (
    <Flex p={2} direction='row' align='center' justify='space-between'>
      <Icon
        as={RiArrowLeftLine}
        onClick={prevMonthButtonDisabled ? null : decreaseMonth}
        opacity={prevMonthButtonDisabled ? 0.5 : 1}
        _hover={{
          cursor: prevMonthButtonDisabled ? null : 'pointer',
          color: nextMonthButtonDisabled ? null : 'secondary.500',
        }}
      />
      <p>
        {date.toLocaleString('en-US', {
          month: 'long',
          year: 'numeric',
        })}
      </p>
      <Icon
        as={RiArrowRightLine}
        onClick={nextMonthButtonDisabled ? null : increaseMonth}
        opacity={nextMonthButtonDisabled ? 0.5 : 1}
        _hover={{
          cursor: nextMonthButtonDisabled ? null : 'pointer',
          color: nextMonthButtonDisabled ? null : 'secondary.500',
        }}
      />
    </Flex>
  );

  return (
    <FieldWrapper {...props}>
      <CustomWrapper width={width}>
        <Input type='hidden' htmlFor={htmlFor} name={name} ref={register} />
        <DatePicker
          placeholderText={placeholderText}
          showTimeSelect={showTimeSelect}
          renderCustomHeader={renderHeader}
          selected={selected}
          onChange={setSelected}
          minDate={minDate}
          minTime={minTime}
          dateFormat='dd/MM/yyyy h:mm aa'
          maxDate={maxDate}
          maxTime={maxTime}
        />
      </CustomWrapper>
    </FieldWrapper>
  );
};

export default DateSelect;
