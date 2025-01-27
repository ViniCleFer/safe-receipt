import { api } from '../../api';
import { getTokensLocalStorage, getUserLocalStorage } from '../auth/helpers';
import { type LaudoCrmPost } from './types';

export async function getLaudosCrmRequest(
  search?: string,
  page?: number,
  size?: number,
) {
  const tokens = await getTokensLocalStorage();
  const user = await getUserLocalStorage();

  try {
    const response = await api.get(`/laudos-crm`, {
      params: {
        search,
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

export async function getLaudosCrmByFormPtpIdRequest(
  idFormPtp: string,
  search?: string,
  page?: number,
  size?: number,
) {
  const tokens = await getTokensLocalStorage();

  try {
    const response = await api.get(`/laudos-crm/ptp/${idFormPtp}`, {
      params: {
        search,
        page,
        size,
      },
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

export async function createLaudoCrmRequest(data: LaudoCrmPost) {
  const tokens = await getTokensLocalStorage();
  const user = await getUserLocalStorage();

  const response = await api.post(`/laudos-crm`, data, {
    headers: {
      Authorization: `Bearer ${tokens['access_token']}`,
      userId: user?.id,
    },
  });

  return response;
}
