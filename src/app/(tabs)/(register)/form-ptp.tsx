import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import DateTimePicker, {
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { StackActions } from '@react-navigation/native';
import {
  Box,
  HStack,
  Icon,
  Input,
  Pressable,
  Radio,
  Select,
  Text,
  useTheme,
  VStack,
} from 'native-base';
import * as z from 'zod';
import dayjs from 'dayjs';
import { shade } from 'polished';
import { Alert } from 'react-native';
import { router, useFocusEffect, useNavigationContainerRef } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { mask } from 'remask';

import { Button } from '@/components/Button';
import { Loading } from '@/components/Loading';
import { RadioInput } from '@/components/RadioInput';
import { SelectWithLabel } from '@/components/SelectWithLabel';
import { InputWithLabelControlled } from '@/components/InputControlled';
import { ScrollScreenContainer } from '@/components/ScrollScreenContainer';
import { SelectWithLabelControlled } from '@/components/SelectWithLabelControlled';
import { ConformidadesCheckboxControlled } from '@/components/ConformidadesCheckboxControlled';

import { listaUPsOrigem } from '@/utils/listaUPs';
import { formatEnunciadoList } from '@/utils/formatEnunciadoList';

import {
  GrupoEnunciado,
  EnunciadoToList,
  Enunciado,
} from '@/services/requests/enunciados/types';
import {
  FormPtpStatus,
  TipoCodigoProduto,
} from '@/services/requests/forms-ptp/types';
import { createFormPtpRequest } from '@/services/requests/forms-ptp/utils';
import { getEnunciadosRequest } from '@/services/requests/enunciados/utils';
import { FormPtpAnswerPost } from '@/services/requests/form-ptp-answers/types';
import { createFormPtpAnswerRequest } from '@/services/requests/form-ptp-answers/utils';

import useFormPtpStore from '@/store/forms-ptp';
import { InputNormal } from '@/components/InputNormal';

const formAnswersSchema = z.object({
  respostas: z
    .array(
      z.object({
        form_ptp_id: z.string().min(1, 'Campo obrigatório'),
        enunciado_id: z.string().min(1, 'Campo obrigatório'),
        codProduto: z.string().min(1, 'Campo obrigatório'),
        naoConformidade: z.string().min(1, 'Campo obrigatório'),
        detalheNaoConformidade: z.array(z.string()).optional(),
        lote: z.string().optional(),
        qtdPalletsNaoConforme: z.number().min(1, 'Campo obrigatório'),
        qtdCaixasNaoConforme: z.number().min(1, 'Campo obrigatório'),
      }),
    )
    .nonempty(),
});

export default function FormPtp() {
  const { colors } = useTheme();
  const { back, push, replace } = router;
  const rootNavigation = useNavigationContainerRef();

  const { selectedFormPtp, setSelectedFormPtp } = useFormPtpStore(
    state => state,
  );

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingEnunciados, setIsLoadingEnunciados] = useState(false);

  const [dataIdentificacao, setDataIdentificacao] = useState(new Date());
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [conferente, setConferente] = useState('');
  const [nota, setNota] = useState('');
  const [up, setUp] = useState('');
  const [codProduto, setCodProduto] = useState('');
  const [qtdAnalisada, setQtdAnalisada] = useState('');
  const [tipoCodigoProduto, setTipoCodigoProduto] = useState<TipoCodigoProduto>(
    TipoCodigoProduto.EXCLUSIVO,
  );
  const [enunciadosList, setEnunciadosList] = useState<
    {
      grupoFormatado: string;
      grupo: GrupoEnunciado;
      enunciados: EnunciadoToList[];
      index: number;
    }[]
  >([]);
  const [showEnunciados, setShowEnunciados] = useState(false);

  const { control, handleSubmit, watch, getValues, setValue } = useForm({
    resolver: zodResolver(formAnswersSchema),
    defaultValues: {
      respostas: enunciadosList?.flatMap(grupo =>
        grupo?.enunciados?.map(() => ({
          form_ptp_id: '',
          enunciado_id: '',
          codProduto: '',
          naoConformidade: 'nao',
          detalheNaoConformidade: [],
          lote: '',
          qtdPalletsNaoConforme: 0,
          qtdCaixasNaoConforme: 0,
        })),
      ),
    },
  });

  async function loadEnunciados() {
    // setIsLoading(true);
    // try {
    const response = await getEnunciadosRequest();

    console.log(
      'getActionsRequest response',
      JSON.stringify(response, null, 2),
    );

    if (!response) {
      setIsLoading(false);

      return console.error('Error ActionsList loadEnunciados => ', response);
    }

    // if (response?.status === 200 && response?.data?.enunciadosCount > 0) {
    const enunciadosActiveFormatted = formatEnunciadoList(response);

    console.log(
      'enunciadosActiveFormatted',
      JSON.stringify(enunciadosActiveFormatted, null, 2),
    );

    setEnunciadosList([...enunciadosActiveFormatted]);
    // }
    // } catch (error) {
    // console.error('Error ActionsList loadEnunciados => ', error);
    // console.log('enunciadosActiveFormatted', JSON.stringify(response, null, 2));
    // } finally {
    setIsLoading(false);
    // }
  }

  useFocusEffect(
    useCallback(() => {
      loadEnunciados();
    }, []),
  );

  const onChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date | undefined,
  ) => {
    setDataIdentificacao(selectedDate!);
    setIsDatePickerVisible(false);
  };

  const handleClear = useCallback(() => {
    setConferente('');
    setNota('');
    setUp('');
    setDataIdentificacao(new Date());
    setQtdAnalisada('');
    setCodProduto('');
    setTipoCodigoProduto(TipoCodigoProduto.EXCLUSIVO);
    setIsDatePickerVisible(false);

    setShowEnunciados(false);
    setValue('respostas', []);
  }, [setValue]);

  const handleBack = useCallback(() => {
    setSelectedFormPtp(null);
    back();
    handleClear();
  }, [back, handleClear, setSelectedFormPtp]);

  const handleSaveInitialFormPtp = useCallback(async () => {
    setIsLoading(true);

    if (!dataIdentificacao || !conferente || !nota || !up || !qtdAnalisada) {
      Alert.alert(
        'Salvar PTP',
        'Por favor, preencha todos os campos para responder as perguntas.',
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
      qtdAnalisada: Number(qtdAnalisada),
      tipoCodigoProduto: tipoCodigoProduto,
    };

    // console.log('formPtp', JSON.stringify(data, null, 2));

    const response = await createFormPtpRequest(data);
    // console.log('response', JSON.stringify(response, null, 2));

    if (response?.status === 201 && response?.data?.length > 0) {
      // console.log('response', JSON.stringify(response, null, 2));

      setSelectedFormPtp({
        ...response?.data[0],
      });

      setShowEnunciados(true);
    } else {
      Alert.alert(
        'Salvar PTP',
        'Ocorreu um erro ao salvar o PTP, tente novamente mais tarde.',
      );
    }
    setIsLoading(false);
  }, [
    dataIdentificacao,
    conferente,
    nota,
    up,
    qtdAnalisada,
    tipoCodigoProduto,
    setSelectedFormPtp,
  ]);

  const handleSaveFormPtpAnswers = useCallback(async () => {
    const itensProcessados: any[] = [];
    setIsLoading(true);

    console.log('tipoCodigoProduto', tipoCodigoProduto);
    console.log('codProduto', codProduto);

    const enunciadosListFormatted = enunciadosList
      ?.map(en => en.enunciados?.map(item => item)?.flatMap(f => f))
      ?.flatMap(f => f);
    console.log('ok', JSON.stringify(enunciadosListFormatted, null, 2));

    if (tipoCodigoProduto === TipoCodigoProduto.EXCLUSIVO && !codProduto) {
      Alert.alert(
        'Salvar Respostas PTP',
        'Por favor, preencha o campo Código Produto ele é obrigatório.',
      );
      setIsLoading(false);
      return;
    }

    const respostas = getValues('respostas');
    console.log('respostas', JSON.stringify(respostas, null, 2));

    try {
      for await (const resposta of respostas) {
        const haNaoConformidade = resposta?.naoConformidade === 'sim';
        const codProdutoCorreto =
          tipoCodigoProduto === TipoCodigoProduto.EXCLUSIVO
            ? codProduto
            : resposta?.codProduto;
        const itemEnunciado = enunciadosListFormatted?.find(
          (enunciado: EnunciadoToList) =>
            enunciado?.id === resposta?.enunciado_id,
        );
        const detalheNaoConformidade = itemEnunciado?.opcoesNaoConformidades;

        const data: FormPtpAnswerPost = {
          form_ptp_id: selectedFormPtp?.id!,
          enunciado_id: resposta?.enunciado_id,
          codProduto: codProdutoCorreto,
          naoConformidade: haNaoConformidade,
          detalheNaoConformidade: haNaoConformidade
            ? itemEnunciado?.isChecked
              ? detalheNaoConformidade
              : resposta?.detalheNaoConformidade
            : [],
          lote: haNaoConformidade ? resposta?.lote : null,
          qtdPalletsNaoConforme: haNaoConformidade
            ? Number(resposta?.qtdPalletsNaoConforme)
            : 0,
          qtdCaixasNaoConforme: haNaoConformidade
            ? Number(resposta?.qtdCaixasNaoConforme)
            : 0,
          necessitaCrm: haNaoConformidade,
        };

        console.log('data', JSON.stringify(data, null, 2));

        const response = await createFormPtpAnswerRequest(data);
        // console.log('response', JSON.stringify(response, null, 2));

        if (
          response?.status === 201 &&
          response?.data &&
          response?.data!?.length > 0
        ) {
          itensProcessados.push({
            ...response?.data[0],
            codigoProdutos: haNaoConformidade ? codProdutoCorreto : [],
            qtdCaixasNaoConformes: haNaoConformidade
              ? resposta?.qtdCaixasNaoConforme
              : [],
            status: 'Sucesso',
          });
        } else {
          itensProcessados.push({
            ...resposta,
            status: 'Erro',
            ...data,
          });
        }
      }

      console.log(
        'itensProcessados',
        JSON.stringify(itensProcessados, null, 2),
      );

      setIsLoading(false);

      const todosSucesso = itensProcessados.every(
        item => item.status === 'Sucesso',
      );
      const respostaErro = itensProcessados.filter(
        item => item.status === 'Erro',
      );
      console.log('respostaErro', JSON.stringify(respostaErro, null, 2));

      if (todosSucesso) {
        const haNaoConformidade = itensProcessados.some(
          answer => answer.naoConformidade,
        );

        console.log('haNaoConformidadeQuestionSix', haNaoConformidade);

        if (haNaoConformidade) {
          setSelectedFormPtp({
            ...(selectedFormPtp as any),
            lotes: itensProcessados
              ?.map(item => item?.lote)
              ?.filter(Boolean) as string[],
            codigoProdutos: itensProcessados
              ?.map(item => item?.codigoProdutos)
              ?.filter(Boolean) as string[],
            qtdCaixasNaoConformes: itensProcessados
              ?.map(item => item?.qtdCaixasNaoConformes)
              ?.filter(Boolean) as string[],
            detalheNaoConformidade: itensProcessados
              ?.map(item => item?.detalheNaoConformidade)
              ?.filter(Boolean)
              ?.flatMap(item => item) as string[],
          });

          return Alert.alert(
            'Sucesso!',
            'Respostas do PTP cadastradas com sucesso!\nVocê será redirecionado para preencher o Laudo CRM',
            [
              {
                text: 'Fechar',
                onPress: () => {
                  push(`/laudo-crm/${selectedFormPtp?.id}`);
                },
              },
            ],
          );
        } else {
          return Alert.alert(
            'Sucesso!',
            'Respostas do PTP cadastradas com sucesso!\nNão há necessidade de preencher o Laudo CRM',
            [
              {
                text: 'Fechar',
                onPress: () => {
                  handleClear();
                  rootNavigation.dispatch(StackActions.popToTop());
                  replace('/(tabs)/(list)');
                },
              },
            ],
          );
        }
      } else {
        Alert.alert(
          'Salvar Resposta do PTP',
          `Ocorreu um erro ao salvar a Resposta do PTP, tente novamente mais tarde.\n 
          ${respostaErro?.length > 1 ? 'Itens com erro' : 'Item com erro'}\n
          ${
            respostaErro?.length > 1
              ? respostaErro?.map(item => item?.enunciado_id).join(', ')
              : respostaErro?.[0]?.enunciado_id
          }
        `,
        );
      }
    } catch (error) {
      console.error('Error handleSaveFormPtpAnswers => ', error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  }, [
    push,
    replace,
    getValues,
    setSelectedFormPtp,
    selectedFormPtp?.id,
    tipoCodigoProduto,
    codProduto,
    handleClear,
    rootNavigation,
  ]);

  const respostas = watch('respostas');

  useEffect(() => {
    console.log('respostas', JSON.stringify(respostas, null, 2));
  }, [respostas]);

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
      ],
    );
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
      <ScrollScreenContainer subtitle="PTP Logístico - RECEBIMENTO DE TRANSFERÊNCIAS EXTERNA C-PTP0046">
        <VStack px={2} space={6} mb={4} pt={2}>
          <Pressable
            // onPress={() => {
            //   setIsDatePickerVisible(prevState => !prevState);
            // }}
            backgroundColor="primary.700"
            px={2}
            py={1}
            borderRadius={4}
            shadow={2}
            disabled
          >
            <HStack alignItems="center" justifyContent="space-between">
              <VStack>
                <Text color="white" fontWeight="semibold">
                  Data da identificação
                </Text>
                <Text color="white" fontWeight="bold">
                  {dayjs(dataIdentificacao).format('DD/MM/YYYY')}
                </Text>
              </VStack>
              <MaterialCommunityIcons
                name="calendar"
                color={colors.white}
                size={28}
              />
            </HStack>
          </Pressable>

          {isDatePickerVisible && (
            <Box alignSelf="center" pl={0}>
              <DateTimePicker
                mode="date"
                value={dataIdentificacao}
                locale="pt-BR"
                onChange={onChange}
                is24Hour={true}
                display="spinner"
                maximumDate={new Date()}
              />
            </Box>
          )}

          <Box mb={1}>
            <Text mb={-2} color="gray.750">
              Conferente:
            </Text>

            <Input
              w="full"
              variant="underlined"
              height={14}
              size="md"
              fontSize="md"
              pb={0}
              placeholderTextColor="gray.700"
              value={conferente}
              onChangeText={setConferente}
              _focus={{ borderColor: 'primary.700' }}
              isDisabled={showEnunciados}
              autoComplete="off"
            />
          </Box>

          <Box mb={1}>
            <Text mb={-2} color="gray.750">
              Nota Fiscal:
            </Text>
            <Input
              w="full"
              variant="underlined"
              height={14}
              size="md"
              fontSize="md"
              pb={0}
              placeholderTextColor="gray.700"
              value={nota}
              onChangeText={setNota}
              _focus={{ borderColor: 'primary.700' }}
              placeholder=""
              isDisabled={showEnunciados}
              autoComplete="off"
              keyboardType="numeric"
            />
          </Box>

          <SelectWithLabel
            label="UP de Origem"
            selectedValue={up}
            onValueChange={setUp}
            options={listaUPsOrigem?.map(s => (
              <Select.Item key={s?.value} label={s?.label} value={s?.value} />
            ))}
            isDisabled={showEnunciados}
          />

          <SelectWithLabel
            label="Quantidade analisada"
            selectedValue={qtdAnalisada}
            onValueChange={setQtdAnalisada}
            options={Array.from({ length: 30 })?.map((_, index) => (
              <Select.Item
                key={String(index + 1)}
                label={String(index + 1)}
                value={String(index + 1)}
              />
            ))}
            isDisabled={showEnunciados}
          />

          <Box mb={1} width="100%">
            <Text mb={3} color="gray.750">
              Tipo do Código Produto
            </Text>
            <Radio.Group
              name="tipoCodigoProduto"
              value={tipoCodigoProduto}
              onChange={t => setTipoCodigoProduto(t as TipoCodigoProduto)}
              flexDirection="row"
              space={3}
              alignItems={'center'}
              width="100%"
              style={{ gap: 10 }}
              isDisabled={showEnunciados}
            >
              <RadioInput
                isDisabled={showEnunciados}
                value={TipoCodigoProduto.MISTO}
              >
                <Text>Misto</Text>
              </RadioInput>
              <RadioInput
                isDisabled={showEnunciados}
                value={TipoCodigoProduto.EXCLUSIVO}
                ml={5}
              >
                <Text>Excluisivo</Text>
              </RadioInput>
            </Radio.Group>
          </Box>

          {!showEnunciados && (
            <HStack width="100%" justifyContent="space-between" mt={4}>
              <Button
                width="48%"
                h="50px"
                backgroundColor="gray.700"
                title="Cancelar"
                _pressed={{ bg: 'gray.600' }}
                variant={'solid'}
                _text={{
                  color: 'white',
                }}
                onPress={() => {
                  handleCancel();
                }}
                disabled={isLoading}
                leftIcon={<Icon as={MaterialIcons} name="delete" size="md" />}
              />

              <Button
                width="48%"
                h="50px"
                backgroundColor="primary.700"
                title="Salvar"
                _pressed={{ bg: shade(0.3, '#2e2efe') }}
                variant={'solid'}
                _text={{
                  color: 'white',
                }}
                onPress={handleSaveInitialFormPtp}
                isLoading={isLoading}
                disabled={isLoading}
                leftIcon={<Icon as={MaterialIcons} name="save" size="md" />}
              />
            </HStack>
          )}
        </VStack>

        {showEnunciados && (
          <>
            {isLoadingEnunciados ? (
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
                    {tipoCodigoProduto === TipoCodigoProduto.EXCLUSIVO && (
                      <InputNormal
                        label="Código Produto"
                        value={codProduto}
                        onChangeText={value =>
                          setCodProduto(mask(value, '99.999999'))
                        }
                        maxLength={9}
                        textTransform="none"
                        keyboardType="numeric"
                      />
                    )}

                    {enunciadosList?.map((enunciado, grupoIndex) => {
                      return (
                        <Fragment key={grupoIndex}>
                          <Text
                            color="primary.700"
                            fontSize="2xl"
                            fontWeight="bold"
                          >
                            Enunciados - {enunciado?.grupoFormatado}
                          </Text>
                          {enunciado?.enunciados?.map(item => {
                            const index = item?.index;

                            return (
                              <VStack key={index} space={3} mb={3} pt={2}>
                                <Text
                                  color="gray.800"
                                  fontSize={'lg'}
                                  fontWeight={'semibold'}
                                  mb={4}
                                >
                                  {`${item?.posicao}) ${item?.descricao}`}
                                </Text>

                                {tipoCodigoProduto ===
                                  TipoCodigoProduto.MISTO && (
                                  <InputWithLabelControlled
                                    label="Código Produto"
                                    control={control}
                                    index={index}
                                    name="codProduto"
                                    keyboardType="numeric"
                                    multiline
                                    numberOfLines={4}
                                  />
                                )}

                                <Box mb={1} width="100%">
                                  <Text mb={3} color="gray.750">
                                    Há não conformidade?
                                  </Text>

                                  <Controller
                                    control={control}
                                    name={`respostas.${index}.naoConformidade`}
                                    render={({ field }) => (
                                      <Radio.Group
                                        name="naoConformidade"
                                        value={String(field.value)}
                                        onChange={t => {
                                          field.onChange(t);
                                          setValue(
                                            `respostas.${index}.enunciado_id`,
                                            item?.id,
                                          );
                                        }}
                                        flexDirection="row"
                                        space={3}
                                        alignItems={'center'}
                                        width="100%"
                                        style={{ gap: 10 }}
                                      >
                                        <RadioInput value="sim">
                                          <Text>Sim</Text>
                                        </RadioInput>
                                        <RadioInput value="nao" ml={5}>
                                          <Text>Não</Text>
                                        </RadioInput>
                                      </Radio.Group>
                                    )}
                                  />
                                </Box>

                                {respostas[index]?.naoConformidade ===
                                  'sim' && (
                                  <>
                                    <InputWithLabelControlled
                                      label="Lote"
                                      control={control}
                                      index={index}
                                      name="lote"
                                      keyboardType="numeric"
                                      autoCorrect={false}
                                      maxLength={10}
                                    />

                                    {item?.posicao === 5 &&
                                    item?.grupo ===
                                      GrupoEnunciado.PALETE ? null : (
                                      <Box mb={1} width="100%">
                                        <ConformidadesCheckboxControlled
                                          label="Selecione as Não conformidades"
                                          control={control}
                                          index={index}
                                          name="detalheNaoConformidade"
                                          optionNaoConformidadesList={
                                            item?.opcoesNaoConformidades
                                          }
                                          isChecked={item?.isChecked}
                                        />
                                      </Box>
                                    )}

                                    <SelectWithLabelControlled
                                      label="Qtde de pallets não conforme?"
                                      control={control}
                                      index={index}
                                      name="qtdPalletsNaoConforme"
                                      options={Array.from({ length: 30 })?.map(
                                        (_, index) => (
                                          <Select.Item
                                            key={String(index + 1)}
                                            label={String(index + 1)}
                                            value={String(index + 1)}
                                          />
                                        ),
                                      )}
                                    />

                                    <InputWithLabelControlled
                                      label="Qtde de caixas/fardos não conforme?"
                                      control={control}
                                      index={index}
                                      name="qtdCaixasNaoConforme"
                                      keyboardType="numeric"
                                      autoCorrect={false}
                                    />
                                  </>
                                )}
                              </VStack>
                            );
                          })}
                        </Fragment>
                      );
                    })}
                    <HStack width="100%" justifyContent="center" mt={4}>
                      <Button
                        h="50px"
                        backgroundColor="primary.700"
                        title="Salvar Respostas"
                        _pressed={{ bg: shade(0.3, '#2e2efe') }}
                        variant={'solid'}
                        _text={{
                          color: 'white',
                        }}
                        onPress={() => handleSaveFormPtpAnswers()}
                        isLoading={isLoading}
                        disabled={isLoading}
                        leftIcon={
                          <Icon as={MaterialIcons} name="save" size="md" />
                        }
                      />
                    </HStack>
                  </>
                )}
              </VStack>
            )}
          </>
        )}
      </ScrollScreenContainer>
    </>
  );
}
