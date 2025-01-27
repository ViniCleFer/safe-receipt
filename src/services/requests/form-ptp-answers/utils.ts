import { api } from '../../api';
import { getTokensLocalStorage, getUserLocalStorage } from '../auth/helpers';
import { type FormPtpAnswerPost } from './types';

export async function getFormsPtpRequest(
  search?: string,
  page?: number,
  size?: number,
) {
  const tokens = await getTokensLocalStorage();
  const user = await getUserLocalStorage();

  try {
    const response = await api.get(`/forms-ptp-answers`, {
      params: {
        search: '',
        page,
        size,
      },
      headers: {
        Authorization: `Bearer ${tokens['access_token']}`,
        userId: user?.id,
      },
    });

    return response;
  } catch (error) {
    console.error('Error getFormsPtpRequest', error);
    return null;
  }
}

export async function getFormsPtpAnswerByFormPtpIdRequest(idFormPtp: string) {
  const tokens = await getTokensLocalStorage();
  const user = await getUserLocalStorage();

  try {
    const response = await api.get(`/forms-ptp-answers/form-ptp`, {
      headers: {
        Authorization: `Bearer ${tokens['access_token']}`,
        userId: user?.id,
        id: idFormPtp,
      },
    });

    return response;
  } catch (error) {
    console.error('Error getFormsPtpRequest', error);
    return null;
  }
}

export async function createFormPtpAnswerRequest(data: FormPtpAnswerPost) {
  const tokens = await getTokensLocalStorage();
  const user = await getUserLocalStorage();

  const response = await api.post(`/forms-ptp-answers`, data, {
    headers: {
      Authorization: `Bearer ${tokens['access_token']}`,
      userId: user?.id,
    },
  });

  return response;
}
