import { supabase } from '@/lib/supabase';
import { type CartaControlePost } from './types';

export async function getCartasControleRequest(
  search?: string,
  page?: number,
  size?: number,
) {
  // const tokens = await getTokensLocalStorage();
  // const user = await getUserLocalStorage();

  // try {
  //   const response = await api.get(`/laudos-crm`, {
  //     params: {
  //       search,
  //       page,
  //       size,
  //     },
  //     headers: {
  //       Authorization: `Bearer ${tokens['access_token']}`,
  //       userId: user?.id,
  //     },
  //   });

  //   return response;
  // } catch (error) {
  //   console.error('Error getFormsPtpRequest', error);
  //   return null;
  // }
  const { data, error, status } = await supabase
    .from('cartas-controle')
    .select()
    .order('created_at', { ascending: false });

  if (error) {
    console.error(
      'Error getCartasControleRequest',
      JSON.stringify(error, null, 2),
    );
    return null;
  }

  return { data, status };
}

export async function getCartasControleByIdRequest(cartaControleId: string) {
  const { data, error, status, statusText, count } = await supabase
    .from('cartas-controle')
    .select()
    .eq('id', cartaControleId);

  if (error) {
    console.error(
      'Error getCartasControleByIdRequest',
      JSON.stringify(error, null, 2),
    );
    return null;
  }

  console.log(
    'Success getCartasControleByIdRequest',
    JSON.stringify(
      {
        data,
        status,
        statusText,
        count,
      },
      null,
      2,
    ),
  );

  return { data, status };
}

export async function createCartaControleRequest(
  cartaControleData: CartaControlePost,
) {
  // const tokens = await getTokensLocalStorage();
  // const user = await getUserLocalStorage();

  // const response = await api.post(`/laudos-crm`, data, {
  //   headers: {
  //     Authorization: `Bearer ${tokens['access_token']}`,
  //     userId: user?.id,
  //   },
  // });

  // return response;
  const { error, data, status, statusText, count } = await supabase
    .from('cartas-controle')
    .insert(cartaControleData)
    .select();

  if (error) {
    console.error(
      'Error createCartaControleRequest',
      JSON.stringify(error, null, 2),
    );
    return null;
  }
  console.log(
    'Success createCartaControleRequest',
    JSON.stringify(
      {
        data,
        status,
        statusText,
        count,
      },
      null,
      2,
    ),
  );

  return { data, status };
}

export async function updateEvidenciasCartaControleRequest(
  cartaControleId: string,
  evidencias: string[],
) {
  // const tokens = await getTokensLocalStorage();
  // const user = await getUserLocalStorage();

  // const response = await api.post(`/laudos-crm`, data, {
  //   headers: {
  //     Authorization: `Bearer ${tokens['access_token']}`,
  //     userId: user?.id,
  //   },
  // });

  // return response;
  const { error, data, status, statusText, count } = await supabase
    .from('cartas-controle')
    .update({
      evidencias: [...evidencias],
    })
    .eq('id', cartaControleId)
    .select();

  if (error) {
    console.error(
      'Error updateEvidenciasCartaControleRequest',
      JSON.stringify(error, null, 2),
    );
    return null;
  }
  console.log(
    'Success updateEvidenciasCartaControleRequest',
    JSON.stringify(
      {
        data,
        status,
        statusText,
        count,
      },
      null,
      2,
    ),
  );

  return { data, status };
}
