import React, { useContext, useCallback, useMemo } from 'react';

import { setTheme } from '../themes/theme';

const CustomThemeContext = React.createContext();

function useCustomThemeContext() {
  return useContext(CustomThemeContext);
}

const initialState = {
  theme: setTheme(),
  tempTheme: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'setTheme': {
      return { ...state, theme: setTheme(action.payload) };
    }
    case 'setTempTheme': {
      return { ...state, tempTheme: action.payload };
    }
    default: {
      return initialState;
    }
  }
};

function CustomThemeContextProvider(props) {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const updateTheme = useCallback((theme) => {
    dispatch({ type: 'setTheme', payload: theme });
  }, []);

  const updateTempTheme = useCallback((theme) => {
    dispatch({ type: 'setTempTheme', payload: theme });
  }, []);

  return (
    <CustomThemeContext.Provider
      value={useMemo(
        () => [
          state,
          {
            updateTheme,
            updateTempTheme,
          },
        ],
        [state, updateTheme, updateTempTheme],
      )}
    >
      {props.children}
    </CustomThemeContext.Provider>
  );
}

export function useTheme() {
  const [state, { updateTheme }] = useCustomThemeContext();
  return [state.theme, updateTheme];
}

export function useTempTheme() {
  const [state, { updateTempTheme }] = useCustomThemeContext();
  return [state.tempTheme, updateTempTheme];
}

const CustomThemeContextConsumer = CustomThemeContext.Consumer;

export {
  CustomThemeContext,
  CustomThemeContextProvider,
  CustomThemeContextConsumer,
};
