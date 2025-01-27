import { api } from '../../api';
import { getTokensLocalStorage, getUserLocalStorage } from '../auth/helpers';
import { type DivergenciaPost } from './types';

export async function getDivergencesRequest(
  search?: string,
  page?: number,
  size?: number,
) {
  const tokens = await getTokensLocalStorage();
  const user = await getUserLocalStorage();

  try {
    const response = await api.get(`/divergencias`, {
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
    console.error('Error getDivergencesRequest', error);
    return null;
  }
}

export async function getDetailsDivergenceRequest(idDivergencia: string) {
  const tokens = await getTokensLocalStorage();

  try {
    const response = await api.get(`/divergencias/${idDivergencia}`, {
      headers: {
        'X-JWT-Auth': tokens['X-JWT-Auth'],
        'X-JWT-Refresh': tokens['X-JWT-Refresh'],
      },
    });

    return response;
  } catch (error) {
    console.error('Error getDivergencesRequest', error);
    return null;
  }
}

export async function createDivergenceRequest(data: DivergenciaPost) {
  const tokens = await getTokensLocalStorage();
  const user = await getUserLocalStorage();

  const response = await api.post(`/divergencias`, data, {
    headers: {
      Authorization: `Bearer ${tokens['access_token']}`,
      userId: user?.id,
    },
  });

  return response;
}
