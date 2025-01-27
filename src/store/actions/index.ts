import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { Action } from '../../services/requests/actions/types';

export interface ActionState {
  selectedAction: Action | null;
  setSelectedAction: (action: Action) => void;
}

const useActionStore = create(
  persist<ActionState>(
    set =>
      ({
        selectedAction: null,
        setSelectedAction: (action: Action) => {
          set({
            selectedAction: action,
          });
        },
      }) as ActionState,
    {
      name: 'sheUseActionStore',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export default useActionStore;
