import { api } from '../../api';
import { getTokensLocalStorage, getUserLocalStorage } from '../auth/helpers';
import { type FormPtpPost } from './types';

export async function getFormsPtpRequest(
  search?: string,
  page?: number,
  size?: number,
) {
  const tokens = await getTokensLocalStorage();
  const user = await getUserLocalStorage();

  try {
    const response = await api.get(`/forms-ptp`, {
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

export async function getDetailsFormPtpRequest(idFormPtp: string) {
  const tokens = await getTokensLocalStorage();

  try {
    const response = await api.get(`/forms-ptp/${idFormPtp}`, {
      headers: {
        'X-JWT-Auth': tokens['X-JWT-Auth'],
        'X-JWT-Refresh': tokens['X-JWT-Refresh'],
      },
    });

    return response;
  } catch (error) {
    console.error('Error getFormsPtpRequest', error);
    return null;
  }
}

export async function createFormPtpRequest(data: FormPtpPost) {
  const tokens = await getTokensLocalStorage();
  const user = await getUserLocalStorage();

  const response = await api.post(`/forms-ptp`, data, {
    headers: {
      Authorization: `Bearer ${tokens['access_token']}`,
      userId: user?.id,
    },
  });

  return response;
}
