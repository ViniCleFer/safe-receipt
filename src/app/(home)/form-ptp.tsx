import React, { useCallback, useState } from 'react';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import DateTimePicker, {
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import {
  Box,
  HStack,
  Icon,
  Input,
  Pressable,
  Select,
  Text,
  useTheme,
  VStack,
} from 'native-base';
import { Alert } from 'react-native';
import { shade } from 'polished';

import { Button } from '@/components/Button';
import { SelectWithLabel } from '@/components/SelectWithLabel';
import { ScrollScreenContainer } from '@/components/ScrollScreenContainer';
import { AnswerCard } from '@/components/AnswerCard';

import useQuestionStore from '@/store/questions';

import { listaUPsOrigem } from '@/utils/listaUPs';
import { createFormPtpRequest } from '@/services/requests/forms-ptp/utils';
import { FormPtpStatus } from '@/services/requests/forms-ptp/types';
import {
  Enunciado,
  GrupoEnunciado,
} from '@/services/requests/enunciados/types';
import {
  createEnunciadoRequest,
  getEnunciadosRequest,
} from '@/services/requests/enunciados/utils';
import { FormPtpAnswerPost } from '@/services/requests/form-ptp-answers/types';
import { formatEnunciadoList } from '@/utils/formatEnunciadoList';
import useEnunciadoStore from '@/store/enunciados';
import { Backdrop } from '@/components/Backdrop';
import { Loading } from '@/components/Loading';
import { router, useFocusEffect } from 'expo-router';

export default function FormPtp() {
  const { colors } = useTheme();
  const { back, push } = router;

  const setSelectedInitialQuestion = useQuestionStore(
    (state) => state.setSelectedInitialQuestion
  );
  const setSelectedQuestionOne = useQuestionStore(
    (state) => state.setSelectedQuestionOne
  );
  const { enunciados, setEnunciados } = useEnunciadoStore((state) => state);

  const [isLoading, setIsLoading] = useState(false);
  // const [isLoadingEnunciados, setIsLoadingEnunciados] = useState(false);

  const [dataIdentificacao, setDataIdentificacao] = useState(new Date());
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [conferente, setConferente] = useState('');
  const [nota, setNota] = useState('');
  const [up, setUp] = useState('');
  const [enunciadosList, setEnunciadosList] = useState<
    { grupoFormatado: string; grupo: GrupoEnunciado; enunciados: Enunciado[] }[]
  >([]);
  // const [answersList, setAnswersList] = useState<any[]>([]);

  async function loadEnunciados() {
    // setIsLoading(true);
    // try {
    const response = await getEnunciadosRequest();

    console.log(
      'getActionsRequest response',
      JSON.stringify(response, null, 2)
    );

    // if (response?.status === 200 && response?.data?.enunciadosCount > 0) {
    // const enunciadosActive = response?.data?.enunciados;

    // const enunciadosActiveFormatted = formatEnunciadoList(enunciadosActive);

    // console.log(
    //   'enunciadosActiveFormatted',
    //   JSON.stringify(
    //     enunciadosList,
    //     null,
    //     2,
    //   ),
    // );

    // setEnunciadosList([...enunciadosActiveFormatted]);
    // setEnunciados([...enunciadosActiveFormatted]);
    // }
    // } catch (error) {
    // console.error('Error ActionsList loadEnunciados => ', error);
    console.log('response', JSON.stringify(response, null, 2));
    // } finally {
    setIsLoading(false);
    // }
  }

  useFocusEffect(
    useCallback(() => {
      loadEnunciados();
    }, [])
  );

  const onChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date | undefined
  ) => {
    setDataIdentificacao(selectedDate!);
    setIsDatePickerVisible(false);
  };

  const handleBack = useCallback(() => {
    back();

    setConferente('');
    setNota('');
    setUp('');
    setDataIdentificacao(new Date());
    setIsDatePickerVisible(false);

    setSelectedQuestionOne(null);
  }, [back, setSelectedQuestionOne]);

  const handleSaveInitialFormPtp = useCallback(async () => {
    setIsLoading(true);

    if (!dataIdentificacao || !conferente || !nota || !up) {
      Alert.alert(
        'Salvar PTP',
        'Por favor, preencha todos os campos para responder as perguntas.'
      );
      setIsLoading(false);
      return;
    }

    const data = {
      dataExecucao: dataIdentificacao,
      conferente,
      notaFiscal: nota,
      opcaoUp: up,
      status: FormPtpStatus.EM_ANDAMENTO,
    };

    console.log('formPtp', JSON.stringify(data, null, 2));
    // console.log('answersList', JSON.stringify(answersList, null, 2));
    console.log('enunciadosList', JSON.stringify(enunciadosList, null, 2));
    console.log('enunciados', JSON.stringify(enunciados, null, 2));
    console.log('enunciados', JSON.stringify(enunciados, null, 2));

    const objetoGrupo = enunciadosList?.find(
      (item) => item?.grupo === GrupoEnunciado.PALETE
    );
    const primeiroId = objetoGrupo ? objetoGrupo?.enunciados[0]?.id : null;

    push(`/(home)/enunciado/${primeiroId}?grupo=${GrupoEnunciado.PALETE}`);

    // try {
    //   const response = await createFormPtpRequest(data);

    //   if (response?.status === 201) {
    //     setSelectedInitialQuestion(response?.data);

    //     console.log('response', JSON.stringify(response?.data, null, 2));

    //     navigate('QuestionOne', {
    //       id: enunciados[GrupoEnunciado.PALETE]?.enunciados[0]?.id,
    //       grupo: GrupoEnunciado.PALETE,
    //     });

    //     // const answers = answersList?.map(answer => {
    //     //   // navigate('QuestionOne');
    //     //   const naoConformidadesList =
    //     //     answer?.listaNaoConformidades?.length > 0
    //     //       ? answer?.listaNaoConformidades
    //     //           ?.map((n: any) => n?.naoConformidade)
    //     //           ?.join(',')
    //     //       : '';

    //     //   const dataFormPtpAnswerPost: FormPtpAnswerPost = {
    //     //     form_ptp_id: answer?.selectedInitialQuestion?.id,
    //     //     enunciado_id: answer?.enunciado_id,
    //     //     qtdAnalisada: Number(answer?.qtdAnalisada),
    //     //     codProduto: answer?.codigoProduto,
    //     //     naoConformidade:
    //     //       answer?.haNaoConformidadeNumCamadas === 'sim' ? true : false,
    //     //     detalheNaoConformidade: naoConformidadesList,
    //     //     lote:
    //     //       answer?.haNaoConformidadeNumCamadas === 'sim' ? answer?.lote : null,
    //     //     qtdPalletsNaoConforme: Number(answer?.qtdPalletsNaoConforme),
    //     //     qtdCaixasNaoConforme: Number(answer?.qtdCaixasNaoConforme),
    //     //     necessitaCrm:
    //     //       answer?.haNaoConformidadeNumCamadas === 'sim' ? true : false,
    //     //   };

    //     //   return dataFormPtpAnswerPost;
    //     // });

    //     // console.log('answers', JSON.stringify(answers, null, 2));
    //   } else {
    //     Alert.alert(
    //       'Salvar PTP',
    //       'Ocorreu um erro ao salvar o PTP, tente novamente mais tarde.',
    //     );
    //   }
    // } catch (error) {
    //   console.log('Error handleSaveInitialFormPtp', error);
    //   Alert.alert(
    //     'Salvar PTP',
    //     'Ocorreu um erro ao salvar o PTP, tente novamente mais tarde.',
    //   );
    // } finally {
    //   setIsLoading(false);
    // }
    setIsLoading(false);
  }, [
    dataIdentificacao,
    conferente,
    nota,
    up,
    push,
    setSelectedInitialQuestion,
    // answersList,
    enunciadosList,
    enunciados,
  ]);

  const handleCancel = useCallback(() => {
    Alert.alert(
      'Cancelar PTP',
      'Você deseja cancelar o lançamento? Se sim irá apagar tudo que foi respondido',
      [
        {
          text: 'Não',
        },
        {
          text: 'Sim',
          onPress: () => {
            handleBack();
          },
        },
      ]
    );
  }, [handleBack]);

  const createEnunciado = useCallback(async () => {
    const res = await createEnunciadoRequest();

    console.log('res', JSON.stringify(res, null, 2));
  }, [handleBack]);

  return (
    <>
      {isLoading && (
        <Loading
          flex={1}
          position={'absolute'}
          top={0}
          left={0}
          right={0}
          bottom={0}
          zIndex={100}
          backgroundColor={'rgba(000, 000, 000, 0.6)'}
        />
      )}
      <ScrollScreenContainer subtitle='PTP Logístico - RECEBIMENTO DE TRANSFERÊNCIAS EXTERNA C-PTP0046'>
        <VStack px={2} space={6} mb={4} pt={2}>
          <Pressable
            // onPress={() => {
            //   setIsDatePickerVisible(prevState => !prevState);
            // }}
            backgroundColor='primary.700'
            px={2}
            py={1}
            borderRadius={4}
            shadow={2}
            disabled
          >
            <HStack alignItems='center' justifyContent='space-between'>
              <VStack>
                <Text color='white' fontWeight='semibold'>
                  Data da identificação
                </Text>
                <Text color='white' fontWeight='bold'>
                  {dayjs(dataIdentificacao).format('DD/MM/YYYY')}
                </Text>
              </VStack>
              <MaterialCommunityIcons
                name='calendar'
                color={colors.white}
                size={28}
              />
            </HStack>
          </Pressable>

          {isDatePickerVisible && (
            <Box alignSelf='center' pl={0}>
              <DateTimePicker
                mode='date'
                value={dataIdentificacao}
                locale='pt-BR'
                onChange={onChange}
                is24Hour={true}
                display='spinner'
                maximumDate={new Date()}
              />
            </Box>
          )}

          <Box mb={1}>
            <Text mb={-2} color='gray.750'>
              Conferente:
            </Text>
            <Input
              w='full'
              variant='underlined'
              height={14}
              size='md'
              fontSize='md'
              pb={0}
              placeholderTextColor='gray.700'
              value={conferente}
              onChangeText={setConferente}
              _focus={{ borderColor: 'primary.700' }}
              autoComplete='off'
            />
          </Box>

          <Box mb={1}>
            <Text mb={-2} color='gray.750'>
              Nota Fiscal:
            </Text>
            <Input
              w='full'
              variant='underlined'
              height={14}
              size='md'
              fontSize='md'
              pb={0}
              placeholderTextColor='gray.700'
              value={nota}
              onChangeText={setNota}
              _focus={{ borderColor: 'primary.700' }}
              placeholder=''
              autoComplete='off'
            />
          </Box>

          <SelectWithLabel
            label='UP de Origem'
            selectedValue={up}
            onValueChange={setUp}
            options={listaUPsOrigem?.map((s) => (
              <Select.Item key={s?.value} label={s?.label} value={s?.value} />
            ))}
          />

          <HStack width='100%' justifyContent='space-between' mt={4}>
            <Button
              width='48%'
              h='50px'
              backgroundColor='gray.700'
              title='Cancelar'
              _pressed={{ bg: 'gray.600' }}
              variant={'solid'}
              _text={{
                color: 'white',
              }}
              onPress={() => {
                handleCancel();
              }}
              disabled={isLoading}
              leftIcon={<Icon as={MaterialIcons} name='delete' size='md' />}
            />

            <Button
              width='48%'
              h='50px'
              backgroundColor='primary.700'
              title='Salvar'
              _pressed={{ bg: shade(0.3, '#2e2efe') }}
              variant={'solid'}
              _text={{
                color: 'white',
              }}
              onPress={handleSaveInitialFormPtp}
              isLoading={isLoading}
              disabled={isLoading}
              leftIcon={<Icon as={MaterialIcons} name='save' size='md' />}
            />
          </HStack>
          <Button
            width='48%'
            h='50px'
            backgroundColor='primary.700'
            title='Criar Enunciado'
            _pressed={{ bg: shade(0.3, '#2e2efe') }}
            variant={'solid'}
            _text={{
              color: 'white',
            }}
            onPress={() => createEnunciado()}
            isLoading={isLoading}
            disabled={isLoading}
            leftIcon={<Icon as={MaterialIcons} name='save' size='md' />}
          />
        </VStack>

        {/* {isLoadingEnunciados ? (
        <VStack
          justifyContent="center"
          alignItems="center"
          space={2}
          mb="20%"
          pt={2}
        >
          <Text color="primary.700" fontSize="2xl" fontWeight="bold">
            Carregando Enunciados...
          </Text>
        </VStack>
      ) : (
        <VStack px={2} space={2} mb="20%" pt={2}>
          {enunciadosList?.length > 0 && (
            <>
              {enunciadosList?.map(enunciado => (
                <>
                  <Text color="primary.700" fontSize="2xl" fontWeight="bold">
                    Enunciados - {enunciado?.item}
                  </Text>
                  {enunciado?.data?.map(item => (
                    <AnswerCard
                      key={item?.id}
                      descricao={item?.descricao}
                      posicao={item?.posicao}
                      data={answersList}
                      onChange={setAnswersList}
                    />
                  ))}
                </>
              ))}


            </>
          )}
        </VStack>
      )} */}
      </ScrollScreenContainer>
    </>
  );
}
