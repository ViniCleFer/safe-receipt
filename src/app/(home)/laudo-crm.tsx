import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import DateTimePicker, {
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import {
  type CameraPictureOptions,
  CameraView,
  useCameraPermissions,
} from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import mime from 'mime';
import {
  Box,
  HStack,
  Icon,
  Image,
  Input,
  Pressable,
  Select,
  Text,
  useTheme,
  View,
  VStack,
} from 'native-base';
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { shade } from 'polished';

import { Button } from '@/components/Button';
import { Loading } from '@/components/Loading';
import { SelectWithLabel } from '@/components/SelectWithLabel';
import { ScrollScreenContainer } from '@/components/ScrollScreenContainer';
import { ConformidadesCheckbox } from '@/components/ConformidadesCheckbox';

import { listaUPsOrigem, listaCDsOrigem } from '@/utils/listaUPs';
import { listaTurnos } from '@/utils/listaTurnos';
import useQuestionStore from '@/store/questions';
import { getFormsPtpAnswerByFormPtpIdRequest } from '@/services/requests/form-ptp-answers/utils';
import { FormPtpAnswer } from '@/services/requests/form-ptp-answers/types';
import { removeDuplicatesItems } from '@/utils/removeDuplicatesItems';
import { LaudoCrmPost, Turno } from '@/services/requests/laudos/types';
import { createLaudoCrmRequest } from '@/services/requests/laudos/utils';
import { router } from 'expo-router';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  takePictureContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    bottom: '-40%',
    position: 'relative',
  },
  closeCamera: {
    position: 'absolute',
    right: 30,
  },
});

// pegar codigoProduto, notaFiscal, UpOrigem do FormPtp

export default function LaudoCrm() {
  const { colors } = useTheme();
  const { navigate, back } = router;

  const selectedInitialQuestion = useQuestionStore(
    (state) => state.selectedInitialQuestion
  );

  const laudos = useQuestionStore((state) => state.laudos);
  const setLaudos = useQuestionStore((state) => state.setLaudos);

  const [isLoading, setIsLoading] = useState(false);

  const [isCameraActive, setIsCameraActive] = useState(false);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [imagesList, setImagesList] = useState<any[]>([]);

  const [documentoTransporte, setDocumentoTransporte] = useState('');
  const [transportador, setTransportador] = useState('');
  const [placa, setPlaca] = useState('');
  const [notaFiscal, setNotaFiscal] = useState(''); // inicial
  const [conferente, setConferente] = useState(''); // inicial
  const [dataIdentificacao, setDataIdentificacao] = useState(new Date());
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [turno, setTurno] = useState('');
  const [upOrigem, setUpOrigem] = useState('');
  const [cdOrigem, setCdOrigem] = useState('');
  // const [lotes, setLotes] = useState('');
  // const [codigoProdutos, setCodigoProdutos] = useState('');

  const [naoConformidadesList, setNaoConformidadesList] = useState<any[]>([]);

  console.log('selectedInitialQuestion', selectedInitialQuestion);

  const [permission, requestPermission] = useCameraPermissions();

  const cameraRef = useRef<any>(null);

  useEffect(() => {
    requestPermission();
  }, []);

  if (!permission?.granted) {
    console.log('Não permitiu');
  }

  async function loadFormPtp() {
    setIsLoading(true);
    try {
      const response = await getFormsPtpAnswerByFormPtpIdRequest(
        // selectedInitialQuestion?.id,
        '70b77547-7403-45ed-847e-1439c14327d6'
      );

      if (response?.status === 200) {
        const formPtpAnswers = response?.data;

        console.log('formPtpAnswers', JSON.stringify(formPtpAnswers, null, 2));

        if (formPtpAnswers?.length > 0) {
          const naoConformidades = formPtpAnswers
            ?.map((formPtpAnswer: FormPtpAnswer) => {
              if (formPtpAnswer?.detalheNaoConformidade?.length > 0) {
                return formPtpAnswer?.detalheNaoConformidade?.split(',');
              } else {
                return null;
              }
            })
            ?.filter(Boolean)
            ?.flat();

          const naoConformidadesWithoutDuplicated =
            naoConformidades?.length > 0
              ? removeDuplicatesItems(naoConformidades)
              : [];

          setNaoConformidadesList(naoConformidadesWithoutDuplicated);
        }
      }
    } catch (error) {
      console.log('Error loadFormPtp => ', JSON.stringify(error));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadFormPtp();
  }, []);

  const onChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date | undefined
  ) => {
    setDataIdentificacao(selectedDate!);
    setIsDatePickerVisible(false);
  };

  const handleBack = useCallback(() => {
    setDocumentoTransporte('');
    setTransportador('');
    setPlaca('');
    setNotaFiscal('');
    setDataIdentificacao(new Date());
    setIsDatePickerVisible(false);
    setConferente('');
    setTurno('');
    setUpOrigem('');
    setImagesList([]);

    back();
  }, [back]);

  const pickImageInLibrary = async () => {
    setLoadingPreview(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        base64: true,
        quality: 1,
      });

      if (!result?.canceled && result?.assets?.length > 0) {
        const uri = result?.assets[0]?.uri;
        const base64 = result?.assets[0]?.base64;
        const filename = result?.assets[0]?.fileName;
        const size = result?.assets[0]?.fileSize;

        const mimetype = mime.getType(uri);

        console.log('result', JSON.stringify(result, null, 2));

        setImagesList((prevState) => [
          ...prevState,
          { uri, base64, mimetype, filename, size },
        ]);
      }
    } catch (error) {
      setLoadingPreview(false);
      console.log('Error pickImageInLibrary => ', JSON.stringify(error));
    } finally {
      setLoadingPreview(false);
    }
  };

  const takePicture = useCallback(async () => {
    setLoadingPreview(true);
    try {
      if (cameraRef?.current) {
        const options: CameraPictureOptions = { quality: 1, base64: true };

        const photo = await cameraRef?.current?.takePictureAsync(options);

        const mimetype = mime.getType(photo?.uri);

        const filename = photo?.uri?.split('/')?.pop();

        const size = photo?.uri?.length;

        console.log('photo', JSON.stringify(photo, null, 2));

        setImagesList((prevState) => [
          ...prevState,
          {
            uri: photo?.uri,
            base64: photo?.base64,
            mimetype,
            size,
            filename,
          },
        ]);

        setIsCameraActive(false);
        setLoadingPreview(false);
      }
      setIsCameraActive(false);
      setLoadingPreview(false);
    } catch (error) {
      console.log('Error takePicture => ', JSON.stringify(error));
      setIsCameraActive(false);
      setLoadingPreview(false);
    } finally {
      setIsCameraActive(false);
      setLoadingPreview(false);
    }
  }, []);

  const handleCamera = useCallback(() => {
    console.log('permission', permission);
    if (permission && !permission?.granted) {
      requestPermission();
    } else {
      if (imagesList?.length >= 3) {
        Alert.alert('Atenção', 'Você atingiu o limite de 3 imagens.');
      } else {
        setIsCameraActive(true);
      }
    }
  }, [permission, requestPermission, imagesList]);

  const handleSaveLaudoCrm = useCallback(async () => {
    if (
      !documentoTransporte ||
      !transportador ||
      !placa ||
      !notaFiscal ||
      !dataIdentificacao ||
      !conferente ||
      !turno ||
      !upOrigem ||
      !cdOrigem ||
      imagesList?.length === 0
    ) {
      setIsLoading(false);
      return Alert.alert(
        'Laudo CRM',
        'Por favor, preencha todos os campos para cadastrar o Laudo CRM.'
      );
    }

    if (!selectedInitialQuestion) {
      Alert.alert('Cadastro', 'ID do Formulário PTP não foi encontrado.');
      return;
    }

    setIsLoading(true);

    const arquivos =
      imagesList?.length > 0
        ? imagesList?.map((i, idx) => {
            const extension = mime.getExtension(i?.mimetype);

            return {
              base64: i?.base64,
              mimetype: i?.mimetype,
              filename: i?.filename
                ? i?.filename
                : 'arquivo ' + idx + '.' + extension,
              size: i?.size,
            };
          })
        : [];

    const data: LaudoCrmPost = {
      documentoTransporte,
      transportador,
      placa,
      notaFiscal,
      dataIdentificacao,
      conferente,
      turno: turno as Turno,
      upOrigem: upOrigem,
      cdOrigem: cdOrigem,
      evidencias: arquivos,
      form_ptp_id: '70b77547-7403-45ed-847e-1439c14327d6', // selectedInitialQuestion?.id,
      tipsoNaoConformidade: naoConformidadesList,
    };

    const opa = { ...data, evidencias: [] };

    console.log('data', JSON.stringify(opa, null, 2));

    try {
      const response = await createLaudoCrmRequest(data);
      console.log('response', JSON.stringify(response, null, 2));

      if (response?.status === 201) {
        const laudo = {
          ...response?.data,
          type: 'laudo',
        };

        setLaudos([...laudos, laudo]);

        console.log('response', JSON.stringify(response?.data, null, 2));

        Alert.alert('Sucesso!', 'O Laudo CRM foi salvo com sucesso.');

        navigate('/(home)/dashboard');
      } else {
        Alert.alert(
          'Erro!',
          'Ocorreu um erro ao salvar o Laudo CRM, tente novamente mais tarde.'
        );
      }
    } catch (error) {
      console.log('Error handleSaveLaudoCrm', JSON.stringify(error, null, 2));
      Alert.alert(
        'Erro!',
        'Ocorreu um erro ao salvar o Laudo CRM, tente novamente mais tarde.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [
    navigate,
    imagesList,
    laudos,
    setLaudos,
    documentoTransporte,
    transportador,
    placa,
    notaFiscal,
    dataIdentificacao,
    isDatePickerVisible,
    conferente,
    turno,
    upOrigem,
    cdOrigem,
    selectedInitialQuestion,
    naoConformidadesList,
  ]);

  const handleCancel = useCallback(() => {
    Alert.alert(
      'Cancelar Laudo',
      'Você deseja cancelar o preenchimento? Se sim irá apagar tudo que foi respondido',
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

  const handlePhotoLibrary = useCallback(async () => {
    if (imagesList?.length >= 3) {
      Alert.alert('Atenção', 'Você atingiu o limite de 3 imagens.');
    } else {
      await pickImageInLibrary();
    }
  }, [imagesList]);

  return isCameraActive ? (
    <View style={styles.container}>
      {loadingPreview && (
        <Loading
          flex={1}
          height='100%'
          position={'absolute'}
          top={0}
          left={0}
          right={0}
          bottom={0}
          zIndex={100}
          backgroundColor={'rgba(000, 000, 000, 0.7)'}
        />
      )}
      <CameraView
        ref={cameraRef}
        style={{ flex: 1, flexDirection: 'row' }}
        facing='back'
      >
        <Box style={styles.takePictureContainer} backgroundColor='transparent'>
          <TouchableOpacity onPress={takePicture}>
            <Box
              borderRadius='full'
              style={{
                backgroundColor: '#fff',
                height: 60,
                width: 60,
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.closeCamera}
            onPress={() => {
              setIsCameraActive(false);
            }}
          >
            <MaterialIcons name='cancel' size={40} color='white' />
          </TouchableOpacity>
        </Box>
      </CameraView>
    </View>
  ) : (
    <Fragment>
      {isLoading && (
        <Loading
          flex={1}
          height='100%'
          position={'absolute'}
          top={0}
          left={0}
          right={0}
          bottom={0}
          zIndex={100}
          backgroundColor={'rgba(000, 000, 000, 0.6)'}
        />
      )}
      <ScrollScreenContainer subtitle='LAUDO CRM'>
        <VStack px={2} space={6} mb='20%' pt={2}>
          <Box mb={1}>
            <Text mb={-2} color='gray.750'>
              Documento de Transporte:
            </Text>
            <Input
              w='full'
              variant='underlined'
              height={14}
              size='md'
              fontSize='md'
              pb={0}
              placeholderTextColor='gray.700'
              value={documentoTransporte}
              onChangeText={(t) => {
                setDocumentoTransporte(t);
              }}
              _focus={{ borderColor: 'primary.700' }}
              autoComplete='off'
            />
          </Box>

          <Box mb={1}>
            <Text mb={-2} color='gray.750'>
              Transportador:
            </Text>
            <Input
              w='full'
              variant='underlined'
              height={14}
              size='md'
              fontSize='md'
              pb={0}
              placeholderTextColor='gray.700'
              value={transportador}
              onChangeText={(t) => {
                setTransportador(t);
              }}
              _focus={{ borderColor: 'primary.700' }}
              autoComplete='off'
            />
          </Box>

          <Box mb={1}>
            <Text mb={-2} color='gray.750'>
              Placa:
            </Text>
            <Input
              w='full'
              variant='underlined'
              height={14}
              size='md'
              fontSize='md'
              pb={0}
              placeholderTextColor='gray.700'
              value={placa}
              onChangeText={(t) => {
                setPlaca(t);
              }}
              _focus={{ borderColor: 'primary.700' }}
              placeholder='000-0000'
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
              value={selectedInitialQuestion?.notaFiscal}
              // onChangeText={setNotaFiscal}
              isDisabled
              _disabled={{
                color: 'gray.900',
                opacity: 1,
                borderColor: 'gray.700',
              }}
              _focus={{ borderColor: 'primary.700' }}
              autoComplete='off'
            />
          </Box>

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
              value={selectedInitialQuestion?.conferente}
              // onChangeText={setConferente}
              isDisabled
              _disabled={{
                color: 'gray.900',
                opacity: 1,
                borderColor: 'gray.700',
              }}
              _focus={{ borderColor: 'primary.700' }}
              autoComplete='off'
            />
          </Box>

          <SelectWithLabel
            label='Turno'
            selectedValue={turno}
            onValueChange={setTurno}
            options={listaTurnos?.map((s) => (
              <Select.Item key={s?.value} label={s?.label} value={s?.value} />
            ))}
          />

          {/* <Box mb={1}>
            <Text mb={-2} color="gray.750">
              UP Origem:
            </Text>
            <Input
              w="full"
              variant="underlined"
              height={14}
              size="md"
              fontSize="md"
              pb={0}
              placeholderTextColor="gray.700"
              value={selectedInitialQuestion?.opcaoUp}
              // onChangeText={setConferente}
              isDisabled
              _disabled={{
                color: 'gray.900',
                opacity: 1,
                borderColor: 'gray.700',
              }}
              _focus={{ borderColor: 'primary.700' }}
              autoComplete="off"
            />
          </Box> */}

          <SelectWithLabel
            label='UP Origem'
            selectedValue={upOrigem}
            onValueChange={setUpOrigem}
            options={listaUPsOrigem?.map((s) => (
              <Select.Item key={s?.value} label={s?.label} value={s?.value} />
            ))}
          />

          <SelectWithLabel
            label='CD Origem'
            selectedValue={cdOrigem}
            onValueChange={setCdOrigem}
            options={listaCDsOrigem?.map((s) => (
              <Select.Item key={s?.value} label={s?.label} value={s?.value} />
            ))}
          />

          <VStack>
            <Text color='gray.750' mb={4}>
              Evidência(s)
            </Text>

            {imagesList && imagesList?.length > 0 && (
              <VStack mt={1} mb={3}>
                {imagesList?.map((image, index) => (
                  <HStack
                    key={index}
                    space={2}
                    mb={4}
                    w='full'
                    justifyContent='space-between'
                    alignItems='center'
                  >
                    <HStack space={2} alignItems='center'>
                      <Image
                        key={index}
                        source={{ uri: image.uri }}
                        alt='image'
                        size='sm'
                        width='80px'
                        height='30px'
                      />

                      <Text>{index}</Text>
                    </HStack>
                    <Pressable
                      onPress={() => {
                        const newImagesList = imagesList?.filter(
                          (_, idx) => idx !== index
                        );

                        setImagesList(newImagesList);
                      }}
                    >
                      <MaterialIcons
                        name='delete'
                        color={colors.secondary[700]}
                        size={24}
                      />
                    </Pressable>
                  </HStack>
                ))}
              </VStack>
            )}

            <HStack
              alignItems='center'
              justifyContent='flex-start'
              mb='24px'
              space={5}
            >
              <Pressable onPress={handlePhotoLibrary}>
                <MaterialIcons
                  name='photo'
                  color={colors.gray[800]}
                  size={28}
                />
              </Pressable>
              <Pressable
                onPress={() => {
                  handleCamera();
                }}
              >
                <MaterialCommunityIcons
                  name='camera'
                  color={colors.gray[800]}
                  size={28}
                />
              </Pressable>
            </HStack>
          </VStack>

          <Box mb={1} width='100%'>
            <ConformidadesCheckbox
              listaNaoConformidades={naoConformidadesList}
              setListaNaoConformidades={setNaoConformidadesList}
              label='Anomalias encontradas:'
              isOnlyView
            />
          </Box>

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
              onPress={handleSaveLaudoCrm}
              isLoading={isLoading}
              disabled={isLoading}
              leftIcon={<Icon as={MaterialIcons} name='save' size='md' />}
            />
          </HStack>
        </VStack>
      </ScrollScreenContainer>
    </Fragment>
  );
}
