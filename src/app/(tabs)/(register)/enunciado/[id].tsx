import { useCallback, useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  Box,
  HStack,
  Icon,
  Input,
  Radio,
  Select,
  Text,
  VStack,
} from 'native-base';
import { Alert } from 'react-native';
import { router, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { shade } from 'polished';

import { Button } from '@/components/Button';
import { RadioInput } from '@/components/RadioInput';
import { SelectWithLabel } from '@/components/SelectWithLabel';
import { ConformidadesCheckbox } from '@/components/ConformidadesCheckbox';
import { ScrollScreenContainer } from '@/components/ScrollScreenContainer';

import {
  Enunciado as IEnunciado,
  GrupoEnunciado,
} from '@/services/requests/enunciados/types';
import { FormPtpAnswerPost } from '@/services/requests/form-ptp-answers/types';
import { getDetailsEnunciadoRequest } from '@/services/requests/enunciados/utils';
import { createFormPtpAnswerRequest } from '@/services/requests/form-ptp-answers/utils';

import { wordNormalize } from '@/utils/wordNormalize';

import useQuestionStore from '@/store/questions';
import useEnunciadoStore from '@/store/enunciados';

export default function Enunciado() {
  const { back, push, replace } = router;
  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  const { setSelectedQuestionOne, selectedInitialQuestion } = useQuestionStore(
    state => state,
  );

  const { enunciados, setEnunciados, answers, setAnswers } = useEnunciadoStore(
    state => state,
  );

  const [isLoading, setIsLoading] = useState(false);

  const [enunciadoId, setEnunciadoId] = useState('');
  const [group, setGroup] = useState('');
  const [qtdAnalisada, setQtdAnalisada] = useState('');
  const [codigoProduto, setCodigoProduto] = useState('');
  const [haNaoConformidadeNumCamadas, setHaNaoConformidadeNumCamadas] =
    useState('');
  const [listaNaoConformidades, setListaNaoConformidades] = useState<string[]>(
    [],
  );
  const [qtdPalletsNaoConforme, setQtdPalletsNaoConforme] = useState('');
  const [qtdCaixasNaoConforme, setQtdCaixasNaoConforme] = useState('');
  const [lote, setLote] = useState('');

  const [enunciadoFounded, setEnunciadoFounded] = useState<IEnunciado | null>(
    {} as IEnunciado,
  );
  const [isLoadingEnunciados, setIsLoadingEnunciados] = useState(false);

  async function loadEnunciados() {
    setIsLoadingEnunciados(true);
    try {
      const response = await getDetailsEnunciadoRequest(enunciadoId);

      console.log(
        'getActionsRequest response',
        JSON.stringify(response?.data, null, 2),
      );

      if (response?.status === 200 && response?.data?.length > 0) {
        console.log('enunciado', JSON.stringify(response?.data, null, 2));

        setEnunciadoFounded(response?.data[0]);
      }

      // const grupoSelected = params?.params?.grupo;
      // const enunciadoId = params?.params?.id;

      // // console.log('grupoSelected', grupoSelected);
      // // console.log('enunciadoId', enunciadoId);

      // const objetoGrupo = enunciados?.find(
      //   item => item?.grupo === grupoSelected,
      // );
      // const enunciado = objetoGrupo?.enunciados?.find(
      //   item => item?.id === enunciadoId,
      // );

      // console.log('enunciado', JSON.stringify(enunciado, null, 2));

      // setEnunciadoFounded(enunciado);
    } catch (error) {
      console.error('Error ActionsList loadEnunciados => ', error);
    } finally {
      setIsLoadingEnunciados(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      console.log('params?.id', id);
      if (id) {
        const groupSplit = id?.split('--');
        console.log('enunciado.id', groupSplit[0]);
        console.log('groupSplit', groupSplit[1]);
        setEnunciadoId(groupSplit[0]);
        setGroup(groupSplit[1]);
      }
    }, [id, setGroup, setEnunciadoId]),
  );

  useFocusEffect(
    useCallback(() => {
      console.log('enunciadoId', enunciadoId);
      if (enunciadoId) {
        loadEnunciados();
      }
    }, [enunciadoId]),
  );

  const handleBack = useCallback(() => {
    setLote('');
    setQtdAnalisada('');
    setCodigoProduto('');
    setHaNaoConformidadeNumCamadas('');
    setListaNaoConformidades([]);
    setQtdPalletsNaoConforme('');
    setQtdCaixasNaoConforme('');

    setSelectedQuestionOne(null);
    back();
  }, [back, setSelectedQuestionOne]);

  const handleClear = useCallback(() => {
    setLote('');
    setQtdAnalisada('');
    setCodigoProduto('');
    setHaNaoConformidadeNumCamadas('');
    setListaNaoConformidades([]);
    setQtdPalletsNaoConforme('');
    setQtdCaixasNaoConforme('');
  }, []);

  const handleSaveFormPtpAnswerOne = useCallback(async () => {
    if (!enunciadoFounded?.id) {
      return Alert.alert(
        'Cadastro',
        'ID do enunciado não foi encontrado, tente novamente mais tarde.',
      );
    }

    if (
      !qtdAnalisada ||
      !codigoProduto ||
      !haNaoConformidadeNumCamadas ||
      !qtdPalletsNaoConforme ||
      !qtdCaixasNaoConforme ||
      (haNaoConformidadeNumCamadas === 'sim' &&
        listaNaoConformidades?.length === 0) ||
      (haNaoConformidadeNumCamadas === 'sim' && !lote)
    ) {
      Alert.alert(
        'Cadastro',
        'Por favor, preencha todos os campos para cadastrar o evento.',
      );
      return;
    }

    if (!enunciadoFounded) {
      Alert.alert('Cadastro', 'ID do Formulário PTP não foi encontrado.');
      return;
    }

    setIsLoading(true);

    const naoConformidadesList =
      listaNaoConformidades?.length > 0
        ? listaNaoConformidades?.map((n: any) => n?.naoConformidade)?.join(',')
        : [];

    const data: FormPtpAnswerPost = {
      form_ptp_id: selectedInitialQuestion?.id!,
      enunciado_id: enunciadoFounded?.id,
      qtdAnalisada: Number(qtdAnalisada),
      codProduto: codigoProduto,
      naoConformidade: haNaoConformidadeNumCamadas === 'sim' ? true : false,
      detalheNaoConformidade: naoConformidadesList,
      lote: haNaoConformidadeNumCamadas === 'sim' ? lote : null,
      qtdPalletsNaoConforme: Number(qtdPalletsNaoConforme),
      qtdCaixasNaoConforme: Number(qtdCaixasNaoConforme),
      necessitaCrm: haNaoConformidadeNumCamadas === 'sim' ? true : false,
    };

    console.log('data', JSON.stringify(data, null, 2));

    try {
      const response = await createFormPtpAnswerRequest(data);

      if (response?.status === 201) {
        setAnswers([...answers, { ...response?.data }]);

        console.log(
          'response createFormPtpAnswerRequest',
          JSON.stringify(response?.data, null, 2),
        );

        // push('QuestionOne');
        const objetoGrupo = enunciados?.find(
          item => item?.grupo === GrupoEnunciado.PALETE,
        );
        const enunciadoIndex = objetoGrupo?.enunciados?.findIndex(
          item => item?.id === enunciadoFounded?.id,
        );
        const thereIsNextEnunciado =
          enunciadoIndex !== -1 || enunciadoIndex !== undefined;

        if (thereIsNextEnunciado) {
          const nextIndex = enunciadoIndex! + 1;
          const proximoEnunciado = objetoGrupo?.enunciados?.[nextIndex];
          const proximoEnunciadoId = proximoEnunciado?.id;

          const routeParams = `${proximoEnunciadoId}--${enunciadoFounded?.grupo}`;

          handleClear();
          push(`/enunciado/${routeParams}`);
        } else {
          const haNaoConformidadeQuestionOne = answers[0]?.naoConformidade;
          const haNaoConformidadeQuestionTwo = answers[1]?.naoConformidade;
          const haNaoConformidadeQuestionThree = answers[2]?.naoConformidade;
          const haNaoConformidadeQuestionFour = answers[3]?.naoConformidade;
          const haNaoConformidadeQuestionFive = answers[4]?.naoConformidade;
          const haNaoConformidadeQuestionSix = answers[5]?.naoConformidade;
          const haNaoConformidadeQuestionSeven =
            response?.data[0]?.naoConformidade;

          console.log(
            'haNaoConformidadeQuestionOne',
            haNaoConformidadeQuestionOne,
          );
          console.log(
            'haNaoConformidadeQuestionTwo',
            haNaoConformidadeQuestionTwo,
          );
          console.log(
            'haNaoConformidadeQuestionThree',
            haNaoConformidadeQuestionThree,
          );
          console.log(
            'haNaoConformidadeQuestionFour',
            haNaoConformidadeQuestionFour,
          );
          console.log(
            'haNaoConformidadeQuestionFive',
            haNaoConformidadeQuestionFive,
          );
          console.log(
            'haNaoConformidadeQuestionSix',
            haNaoConformidadeQuestionSix,
          );
          console.log(
            'haNaoConformidadeQuestionSeven',
            haNaoConformidadeQuestionSeven,
          );

          const abrirLaudo =
            haNaoConformidadeQuestionOne ||
            haNaoConformidadeQuestionTwo ||
            haNaoConformidadeQuestionThree ||
            haNaoConformidadeQuestionFour ||
            haNaoConformidadeQuestionFive ||
            haNaoConformidadeQuestionSix ||
            haNaoConformidadeQuestionSeven;

          console.log('abrirLaudo', abrirLaudo);

          if (abrirLaudo) {
            push('/laudo-crm/selectedInitialQuestion?.id!');
          } else {
            replace('/(tabs)/(list)');
            setAnswers([]);
          }
        }
      } else {
        Alert.alert(
          'Salvar PTP',
          'Ocorreu um erro ao salvar o PTP, tente novamente mais tarde.',
        );
      }
    } catch (error) {
      console.log('Error handleSaveFormPtpAnswerOne', error);
      Alert.alert(
        'Salvar PTP',
        'Ocorreu um erro ao salvar o PTP, tente novamente mais tarde.',
      );
    } finally {
      setIsLoading(false);
    }
  }, [
    qtdAnalisada,
    codigoProduto,
    haNaoConformidadeNumCamadas,
    listaNaoConformidades,
    qtdPalletsNaoConforme,
    qtdCaixasNaoConforme,
    selectedInitialQuestion?.id,
    lote,
    push,
    replace,
    setSelectedQuestionOne,
    enunciadoFounded?.id,
    enunciadoFounded?.grupo,
    enunciados,
    answers,
    setAnswers,
    handleClear,
  ]);

  return (
    <ScrollScreenContainer
      subtitle={`Questão ${enunciadoFounded?.posicao} - ${wordNormalize(
        group,
      )}`}
    >
      <VStack px={2} space={6} mb="20%" pt={2}>
        <Text color="gray.800" fontSize={'lg'} fontWeight={'semibold'} mb={4}>
          {enunciadoFounded?.descricao}{' '}
          {/* Número de camadas e formação e alinhamento do pallet. */}
        </Text>

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
        />

        <Box>
          <Text mb={-2} color="gray.750">
            Código Produto
          </Text>
          <Input
            w="full"
            variant="underlined"
            height={14}
            size="md"
            fontSize="md"
            pb={0}
            placeholderTextColor="gray.700"
            value={codigoProduto}
            onChangeText={t => {
              setCodigoProduto(t);
            }}
            maxLength={10}
            _focus={{ borderColor: 'primary.700' }}
            placeholder=""
            autoComplete="off"
          />
        </Box>

        <Box mb={1} width="100%">
          <Text mb={3} color="gray.750">
            Há não conformidade?
          </Text>
          <Radio.Group
            name="haNaoConformidade"
            value={haNaoConformidadeNumCamadas}
            onChange={value => setHaNaoConformidadeNumCamadas(value)}
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
        </Box>

        {haNaoConformidadeNumCamadas === 'sim' && (
          <Box>
            <Text mb={-2} color="gray.750">
              Lote
            </Text>
            <Input
              w="full"
              variant="underlined"
              height={14}
              size="md"
              fontSize="md"
              pb={0}
              placeholderTextColor="gray.700"
              value={lote}
              onChangeText={t => {
                setLote(t);
              }}
              maxLength={10}
              _focus={{ borderColor: 'primary.700' }}
              placeholder=""
              autoComplete="off"
            />
          </Box>
        )}

        {haNaoConformidadeNumCamadas === 'sim' && (
          <Box mb={1} width="100%">
            <ConformidadesCheckbox
              listaNaoConformidades={listaNaoConformidades}
              setListaNaoConformidades={setListaNaoConformidades}
            />
          </Box>
        )}

        <SelectWithLabel
          label="Qtde de pallets não conforme?"
          selectedValue={qtdPalletsNaoConforme}
          onValueChange={setQtdPalletsNaoConforme}
          options={Array.from({ length: 30 })?.map((_, index) => (
            <Select.Item
              key={String(index + 1)}
              label={String(index + 1)}
              value={String(index + 1)}
            />
          ))}
        />

        <SelectWithLabel
          label="Qtde de caixas não conforme?"
          selectedValue={qtdCaixasNaoConforme}
          onValueChange={setQtdCaixasNaoConforme}
          options={Array.from({ length: 30 })?.map((_, index) => (
            <Select.Item
              key={String(index + 1)}
              label={String(index + 1)}
              value={String(index + 1)}
            />
          ))}
        />

        {/* <Box mb={1} width="100%">
          <Text mb={3} color="gray.750">
            É necessário abrir CRM?
          </Text>
          <Radio.Group
            name="abrirLaudo"
            value={abrirLaudo}
            onChange={value => setAbrirLaudo(value)}
            flexDirection="row"
            space={3}
            alignItems={'center'}
            width="100%"
            style={{ gap: 10 }}
          >
            <Radio value="sim">
              <Text>Sim</Text>
            </Radio>
            <Radio value="nao" ml={5}>
              <Text>Não</Text>
            </Radio>
          </Radio.Group>
        </Box> */}

        <HStack width="100%" justifyContent="space-between" mt={4}>
          <Button
            width="48%"
            h="50px"
            backgroundColor="gray.700"
            title="Voltar"
            _pressed={{ bg: 'gray.600' }}
            variant={'solid'}
            _text={{
              color: 'white',
              fontWeight: 'bold',
            }}
            disabled={isLoading}
            onPress={handleBack}
            leftIcon={
              <Icon
                as={MaterialCommunityIcons}
                name="arrow-left"
                size="lg"
                color="white"
              />
            }
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
              fontWeight: 'bold',
            }}
            isLoading={isLoading}
            disabled={isLoading}
            onPress={handleSaveFormPtpAnswerOne}
            rightIcon={
              <Icon
                as={MaterialCommunityIcons}
                name="arrow-right"
                size="lg"
                color="white"
              />
            }
          />
        </HStack>
      </VStack>
    </ScrollScreenContainer>
  );
}
