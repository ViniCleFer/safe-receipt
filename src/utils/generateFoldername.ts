const bucketName = 'evidencias';

export function generateFolderName(
  isLaudoCrm: boolean,
  laudoCrmId?: string | null,
  divergenciaId?: string | null,
): string {
  return isLaudoCrm
    ? `${bucketName}/laudoCrm/${laudoCrmId}`
    : `${bucketName}/divergencia/${divergenciaId}`;
}
