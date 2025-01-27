import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { type FormPtp } from '../../services/requests/forms-ptp/types';

export interface FormPtpState {
  formsPtp: Array<Partial<FormPtp>>;
  selectedFormPtp: Partial<FormPtp> | null;
  setFormsPtp: (formsPtp: FormPtp[]) => void;
  setSelectedFormPtp: (formPtp: FormPtp) => void;
}

const useFormPtpStore = create(
  persist<FormPtpState>(
    set =>
      ({
        formsPtp: [],
        selectedFormPtp: null,
        setFormsPtp: (formsPtp: FormPtp[]) => {
          set({
            formsPtp,
          });
        },
        setSelectedFormPtp: (formPtp: FormPtp) => {
          set({
            selectedFormPtp: formPtp,
          });
        },
      }) as FormPtpState,
    {
      name: 'ptpUseFormPtpStore',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export default useFormPtpStore;
