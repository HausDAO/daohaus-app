import React, { useContext } from 'react';
// import { ToggleLayer, anchor } from 'react-laag';
// import { Switch } from 'antd';

import { ExploreContext } from '../../contexts/ExploreContext';

const ExploreFilterList = ({ name, options, filterKey }) => {
  const { state, dispatch } = useContext(ExploreContext);

  const renderOptions = () => {
    return options.map((option) => {
      const isSelected = state.filters[filterKey].includes(option.value);

      return (
        <div
          key={option.value}
          onClick={() => handleChange(option, isSelected)}
        >
          {option.label}
          {/* <Switch
            defaultChecked
            checked={isSelected}
            className={isSelected ? 'selected' : ''}
            onChange={() => handleChange(option, isSelected)}
          /> */}
        </div>
      );
    });
  };

  const handleChange = (option, isSelected) => {
    let updatedFilterValues;
    if (isSelected) {
      updatedFilterValues = state.filters[filterKey].filter(
        (f) => f !== option.value,
      );
    } else {
      updatedFilterValues = [...state.filters[filterKey], option.value];
    }

    dispatch({
      type: 'updateFilter',
      payload: { [filterKey]: updatedFilterValues },
    });
  };

  return (
    <div>
      filter list
      {/* <ToggleLayer
        placement={{ anchor: anchor.BOTTOM_LEFT }}
        closeOnOutsideClick={true}
        renderLayer={({ layerProps, isOpen }) =>
          isOpen && (
            <div
              ref={layerProps.ref}
              className='DropdownList'
              style={{
                ...layerProps.style,
              }}
            >
              {renderOptions()}
            </div>
          )
        }
      >
        {({ toggle, triggerRef, isOpen }) => (
          <div
            className={isOpen ? 'Trigger Active' : 'Trigger'}
            ref={triggerRef}
            onClick={toggle}
          >
            {name}{' '}
            <span className='ActiveFilters'>
              {state.filters[filterKey].length}
            </span>
          </div>
        )}
      </ToggleLayer> */}
    </div>
  );
};

export default ExploreFilterList;
