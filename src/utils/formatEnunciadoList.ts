import { Enunciado } from '@/services/requests/enunciados/types';
import { wordNormalize } from './wordNormalize';

export const formatEnunciadoList = (enunciadoList: Enunciado[]) => {
  if (enunciadoList?.length === 0) {
    return [];
  }

  const resultado = enunciadoList?.reduce((acc, item) => {
    const { grupo } = item;

    const existingGroup = acc?.find(group => group?.grupo === grupo);

    if (existingGroup) {
      existingGroup?.enunciados?.push(item);
    } else {
      acc.push({
        grupo,
        grupoFormatado: wordNormalize(grupo),
        enunciados: [item],
      });
    }

    return acc;
  }, []);

  return resultado;
};
