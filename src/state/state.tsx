import React, { createContext, useContext, useReducer } from 'react';
import { Patient } from '../types';
import { Action } from './reducer';
//import getAll from '../services';

export type State = {
  patients: { [id: string]: Patient };
};

const initialState: State = {
  patients: {},
};

export const StateContext = createContext<[State, React.Dispatch<Action>]>([
  initialState,
  () => initialState,
]);

type StateProviderProps = {
  reducer: React.Reducer<State, Action>;
  children: React.ReactElement;
};

export const StateProvider: React.FC<StateProviderProps> = ({
  reducer,
  children,
}: StateProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <StateContext.Provider value={[state, dispatch]}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateValue = () => useContext(StateContext);

/* const [, dispatch] = useStateValue();

export const getPatients = () => {
  return async () => {
    const { data: patientListFromApi } = await getAll();

    dispatch({ type: 'SET_PATIENT_LIST', payload: patientListFromApi });
  };
}; */
