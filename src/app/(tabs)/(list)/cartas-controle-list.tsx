import { useCallback, useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import dayjs from 'dayjs';
import { Circle, HStack, Text, useTheme, View, VStack } from 'native-base';

import { Card } from '@/components/Card';
import { Loading } from '@/components/Loading';
import { ScrollScreenContainer } from '@/components/ScrollScreenContainer';

import { CartaControle } from '@/services/requests/cartas-controle/types';
import { getCartasControleRequest } from '@/services/requests/cartas-controle/utils';

import { listaTurnos } from '@/utils/listaTurnos';

export default function CartaControleList() {
  const { colors } = useTheme();

  const [loading, setLoading] = useState(false);
  const [cartasControleList, setCartasControleList] = useState<CartaControle[]>(
    [],
  );

  async function loadCartasControle() {
    setLoading(true);
    try {
      const response = await getCartasControleRequest();

      if (response?.status === 200 && response?.data?.length > 0) {
        const cartasControleFormatted = response?.data.map(item => {
          const turno = listaTurnos?.find(
            turno => turno?.value === item?.turno,
          )?.label;

          return {
            ...item,
            turno,
          };
        });

        setCartasControleList([...cartasControleFormatted]);
      }
    } catch (error) {
      console.error('Error Home loadCartasControle => ', error);
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadCartasControle();
    }, []),
  );

  return (
    <ScrollScreenContainer subtitle="Listagem de Cartas Controle">
      {loading ? (
        <Loading mt="80%" />
      ) : (
        <View mb="20%">
          {cartasControleList?.length > 0 ? (
            cartasControleList?.map(item => (
              <Card key={item?.id} p={4} borderRadius="4" mb={4}>
                <HStack
                  alignItems="center"
                  justifyContent="space-between"
                  mb={4}
                >
                  <HStack alignItems="center">
                    <Circle bg="primary.700" h={12} w={12}>
                      <MaterialIcons
                        name="calendar-month"
                        size={24}
                        color={colors.white}
                      />
                    </Circle>

                    <VStack ml={3}>
                      <Text color="gray.750" w="100%">
                        Data de Recebimento
                      </Text>
                      <Text color="black" fontWeight="semibold">
                        {dayjs(item?.dataIdentificacao).format('DD/MM/YYYY')}
                      </Text>
                    </VStack>
                  </HStack>
                </HStack>

                <VStack pl={2} mb={4}>
                  <Text color="gray.750">Turno</Text>
                  <Text color="black" fontWeight="semibold">
                    {item?.turno}
                  </Text>
                </VStack>
                <VStack pl={2} mb={4}>
                  <Text color="gray.750">Documento Transporte (DT)</Text>
                  <Text color="black" fontWeight="semibold">
                    {item?.documentoTransporte}
                  </Text>
                </VStack>
                <VStack pl={2} mb={4}>
                  <Text color="gray.750">Remessa</Text>
                  <Text color="black" fontWeight="semibold">
                    {item?.remessa}
                  </Text>
                </VStack>
                <VStack pl={2} mb={4}>
                  <Text color="gray.750">Conferente/Técnico</Text>
                  <Text color="black" fontWeight="semibold">
                    {item?.conferente}
                  </Text>
                </VStack>
                <VStack pl={2} mb={4}>
                  <Text color="gray.750">Doca</Text>
                  <Text color="black" fontWeight="semibold">
                    {item?.doca}
                  </Text>
                </VStack>

                <VStack pl={2} mb={4}>
                  <Text color="gray.750">Capacidade Veículo</Text>
                  <Text color="black" fontWeight="semibold">
                    {item?.capacidadeVeiculo}
                  </Text>
                </VStack>
                <VStack pl={2} mb={4}>
                  <Text color="gray.750">Observações Gerais</Text>
                  <Text color="black" fontWeight="semibold">
                    {item?.observacoes}
                  </Text>
                </VStack>
                {/* <VStack pl={2} mb={4} width="100%">
                  <Text color="gray.750">Evidências</Text>
                  {item?.evidencias?.length > 0 ? (
                    item?.evidencias?.map((item: any, index: number) => (
                      <Image
                        key={index}
                        source={{ uri: item }}
                        alt="image"
                        contentFit="fill"
                        transition={1000}
                        style={{ width: 80, height: 60 }}
                      />
                    ))
                  ) : (
                    <Text color="black" fontWeight="semibold">
                      Sem evidências
                    </Text>
                  )}
                </VStack> */}
              </Card>
            ))
          ) : (
            <View mt="70%" justifyContent="center" alignItems="center">
              <Text
                color="gray.750"
                fontSize="lg"
                textAlign="center"
                justifyContent={'center'}
              >
                Nenhuma carta de controle encontrada
              </Text>
            </View>
          )}
        </View>
      )}
    </ScrollScreenContainer>
  );
}
