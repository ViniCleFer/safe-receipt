import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import dayjs from 'dayjs';
import { Circle, HStack, Text, useTheme, View, VStack } from 'native-base';
import { useCallback, useState } from 'react';

import { Card } from '../../components/Card';
import { Loading } from '../../components/Loading';
import { ScrollScreenContainer } from '../../components/ScrollScreenContainer';
import { type FormPtp } from '../../services/requests/forms-ptp/types';
import { getFormsPtpRequest } from '../../services/requests/forms-ptp/utils';

export default function FormsPtpList() {
  const { colors } = useTheme();

  const [loading, setLoading] = useState(false);
  const [formsPtpList, setFormsPtpList] = useState([] as FormPtp[]);

  async function loadFormsPtp() {
    setLoading(true);
    try {
      const response = await getFormsPtpRequest();

      console.log(
        'getFormsPtpRequest response',
        JSON.stringify(response?.data, null, 2)
      );

      if (response?.status === 200) {
        const formsPtp = response?.data?.formsPtp;

        console.log('formsPtp', formsPtp);

        setFormsPtpList([...formsPtp]);
      }
    } catch (error) {
      console.error('Error Home loadFormsPtp => ', error);
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadFormsPtp();
    }, [])
  );

  // documentoTransporte,
  // transportador,
  // placa,
  // notaFiscal,
  // dataIdentificacao,
  // conferente,
  // turno,
  // up,
  // arquivos,

  return (
    <ScrollScreenContainer subtitle='Meus Laudos'>
      {loading ? (
        <Loading mt='80%' />
      ) : (
        <View mb='20%'>
          {formsPtpList?.map((item) => (
            <Card key={item?.id} p={4} borderRadius='4' mb={4}>
              <HStack alignItems='center' justifyContent='space-between' mb={4}>
                <HStack alignItems='center'>
                  <Circle bg='primary.700' h={12} w={12}>
                    <MaterialIcons
                      name='calendar-month'
                      size={24}
                      color={colors.white}
                    />
                  </Circle>

                  <VStack ml={3}>
                    <Text color='gray.750' w='100%'>
                      Data de Transporte
                    </Text>
                    <Text color='black' fontWeight='semibold'>
                      {dayjs(item?.dataExecucao).format('DD/MM/YYYY')}
                    </Text>
                  </VStack>
                </HStack>

                {/* <VStack>
                  <Text color="gray.750">Evento Nº</Text>
                  <Text color="black" fontWeight="semibold">
                    {item?.idEvento || 'Sem número'}
                  </Text>
                </VStack> */}
              </HStack>

              <VStack pl={2} mb={4}>
                <Text color='gray.750'>Conferente</Text>
                <Text color='black' fontWeight='semibold'>
                  {item?.conferente}
                </Text>
              </VStack>
              {/* <VStack pl={2} mb={4}>
                <Text color="gray.750">Documento Transporte</Text>
                <Text color="black" fontWeight="semibold">
                  {item?.documentoTransporte}
                </Text>
              </VStack>
              <VStack pl={2} mb={4}>
                <Text color="gray.750">Placa</Text>
                <Text color="black" fontWeight="semibold">
                  {item?.placa}
                </Text>
              </VStack> */}
              <VStack pl={2} mb={4}>
                <Text color='gray.750'>Nota Fiscal</Text>
                <Text color='black' fontWeight='semibold'>
                  {item?.notaFiscal}
                </Text>
              </VStack>
              <VStack pl={2} mb={4}>
                <Text color='gray.750'>Conferente</Text>
                <Text color='black' fontWeight='semibold'>
                  {item?.conferente}
                </Text>
              </VStack>
              {/* <VStack pl={2} mb={4}>
                <Text color="gray.750">Turno</Text>
                <Text color="black" fontWeight="semibold">
                  {item?.turno}
                </Text>
              </VStack>
              <VStack pl={2} mb={4}>
                <Text color="gray.750">Origem</Text>
                <Text color="black" fontWeight="semibold">
                  {item?.up}
                </Text>
              </VStack> */}
              {/* <VStack pl={2} mb={4}>
                <Text color="gray.750">Imagens</Text>
                {item?.arquivos?.map((item, index) => (
                  <HStack key={index} alignItems="center">
                    <Image
                      source={{ uri: item?.uri }}
                      alt="image"
                      size="sm"
                      width="80px"
                      height="30px"
                    />
                  </HStack>
                ))}
              </VStack> */}
            </Card>
          ))}
        </View>
      )}
    </ScrollScreenContainer>
  );
}
