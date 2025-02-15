import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import DateTimePicker, {
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
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
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { decode } from 'base64-arraybuffer';

import { Button } from '@/components/Button';
import { Loading } from '@/components/Loading';
import { SelectWithLabel } from '@/components/SelectWithLabel';
import { ScrollScreenContainer } from '@/components/ScrollScreenContainer';
import { ConformidadesCheckbox } from '@/components/ConformidadesCheckbox';

import { listaTurnos } from '@/utils/listaTurnos';
import { generateFolderName } from '@/utils/generateFoldername';
import { listaUPsOrigem, listaCDsOrigem } from '@/utils/listaUPs';
import { removeDuplicatesItems } from '@/utils/removeDuplicatesItems';

import useQuestionStore from '@/store/questions';

import { LaudoCrmPost, Turno } from '@/services/requests/laudos/types';
import { createLaudoCrmRequest } from '@/services/requests/laudos/utils';
import { FormPtpAnswer } from '@/services/requests/form-ptp-answers/types';
import { getFormsPtpAnswerByFormPtpIdRequest } from '@/services/requests/form-ptp-answers/utils';

import { supabase } from '@/lib/supabase';
import useAuthStore from '@/store/auth';
import useFormPtpStore from '@/store/forms-ptp';

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
  const { replace, back } = router;

  // const { id: formPtpId = '111f2687-9f88-4500-bf1b-eb2238d22750' } =
  const { id: formPtpId } = useLocalSearchParams<{ id: string }>();

  const user = useAuthStore(state => state.user);
  const { selectedFormPtp, setSelectedFormPtp } = useFormPtpStore(
    state => state,
  );

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
  const [lotes, setLotes] = useState('');
  const [codigoProdutos, setCodigoProdutos] = useState('');

  const [naoConformidadesList, setNaoConformidadesList] = useState<any[]>([]);

  console.log('selectedFormPtp', selectedFormPtp);

  const [permission, requestPermission] = useCameraPermissions();

  const cameraRef = useRef<any>(null);

  useEffect(() => {
    requestPermission();
  }, []);

  if (!permission?.granted) {
    console.log('Não permitiu');
  }

  // async function loadFormPtp() {
  //   setIsLoading(true);
  //   try {
  //     const response = await getFormsPtpAnswerByFormPtpIdRequest(formPtpId);

  //     if (
  //       response?.status === 200 &&
  //       selectedFormPtp?.conferente &&
  //       selectedFormPtp?.notaFiscal
  //     ) {
  //       const formPtpAnswers = response?.data[0];

  //       setNotaFiscal(selectedFormPtp?.notaFiscal);
  //       setConferente(selectedFormPtp?.conferente);
  //       setLotes(selectedFormPtp?.lotes!?.map(lote => lote).join(', '));
  //       setCodigoProdutos(
  //         selectedFormPtp
  //           ?.codigoProdutos!?.map(codProduto => codProduto)
  //           ?.join(', '),
  //       );
  //       setNaoConformidadesList(selectedFormPtp?.detalheNaoConformidade!);

  //       // console.log('formPtpAnswers', JSON.stringify(formPtpAnswers, null, 2));

  //       // if (formPtpAnswers?.length > 0) {
  //       //   const naoConformidades = formPtpAnswers
  //       //     ?.map((formPtpAnswer: FormPtpAnswer) => {
  //       //       if (formPtpAnswer?.detalheNaoConformidade?.length > 0) {
  //       //         return formPtpAnswer?.detalheNaoConformidade?.split(',');
  //       //       } else {
  //       //         return null;
  //       //       }
  //       //     })
  //       //     ?.filter(Boolean)
  //       //     ?.flat();

  //       //   const naoConformidadesWithoutDuplicated =
  //       //     naoConformidades?.length > 0
  //       //       ? removeDuplicatesItems(naoConformidades)
  //       //       : [];

  //       //     }
  //     }
  //   } catch (error) {
  //     console.log('Error loadFormPtp => ', JSON.stringify(error));
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }

  // useEffect(() => {
  //   if (formPtpId) {
  //     loadFormPtp();
  //   }
  // }, [formPtpId]);

  useFocusEffect(
    useCallback(() => {
      console.log('formPtpId', formPtpId);
      console.log('formPtpId', formPtpId);
      if (selectedFormPtp) {
        // loadFormPtp();
        setNotaFiscal(selectedFormPtp?.notaFiscal!);
        setConferente(selectedFormPtp?.conferente!);
        setLotes(selectedFormPtp?.lotes!?.map(lote => lote).join(', '));
        setCodigoProdutos(
          selectedFormPtp
            ?.codigoProdutos!?.filter(
              item => !(Array.isArray(item) && item?.length === 0),
            )
            .map(codProduto => codProduto)
            ?.join(', '),
        );
        setNaoConformidadesList(selectedFormPtp?.detalheNaoConformidade!);
      }
    }, [formPtpId, selectedFormPtp]),
  );

  const onChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date | undefined,
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
    setLotes('');
    setCodigoProdutos('');
    setNaoConformidadesList([]);
    setSelectedFormPtp(null);

    replace('/(auth)/dashboard');
  }, [replace, setSelectedFormPtp]);

  const pickImageInLibrary = async () => {
    setLoadingPreview(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: false,
        base64: true,
        quality: 1,
      });

      if (!result?.canceled && result?.assets?.length > 0) {
        const uri = result?.assets[0]?.uri;
        const base64 = result?.assets[0]?.base64;
        const filename = result?.assets[0]?.fileName;
        const size = result?.assets[0]?.fileSize;

        const mimetype = mime.getType(uri);

        // console.log('result', JSON.stringify(result, null, 2));

        setImagesList(prevState => [
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

        // console.log('photo', JSON.stringify(photo, null, 2));

        setImagesList(prevState => [
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
    console.log('imagesList', JSON.stringify(imagesList.length, null, 2));
    console.log(
      'naoConformidadesList',
      JSON.stringify(naoConformidadesList, null, 2),
    );
    console.log('formPtpId', JSON.stringify(formPtpId, null, 2));
    console.log(
      'documentoTransporte',
      JSON.stringify(documentoTransporte, null, 2),
    );
    console.log('transportador', JSON.stringify(transportador, null, 2));
    console.log('placa', JSON.stringify(placa, null, 2));
    console.log('notaFiscal', JSON.stringify(notaFiscal, null, 2));
    console.log(
      'dataIdentificacao',
      JSON.stringify(dataIdentificacao, null, 2),
    );
    console.log('conferente', JSON.stringify(conferente, null, 2));
    console.log('turno', JSON.stringify(turno, null, 2));
    console.log('upOrigem', JSON.stringify(upOrigem, null, 2));
    console.log('cdOrigem', JSON.stringify(cdOrigem, null, 2));

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
        'Por favor, preencha todos os campos para cadastrar o Laudo CRM.',
      );
    }

    if (!formPtpId) {
      Alert.alert('Cadastro', 'ID do Formulário PTP não foi encontrado.');
      return;
    }

    setIsLoading(true);

    console.log('lotes?.split(', ')', lotes?.split(','));
    console.log('codigoProdutos?.split(', ')', codigoProdutos?.split(','));

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
      evidencias: [],
      form_ptp_id: formPtpId,
      tiposNaoConformidade: naoConformidadesList,
      lotes: lotes?.split(','),
      codigoProdutos: codigoProdutos?.split(','),
      user_id: user?.id!,
    };

    // console.log('data', JSON.stringify(opa, null, 2));

    const response = await createLaudoCrmRequest(data);
    // console.log('response', JSON.stringify(response, null, 2));

    if (response?.status === 201 && response?.data?.length > 0) {
      // console.log('response', JSON.stringify(response, null, 2));

      // setLaudos({
      //   ...response?.data[0],
      //   // proximoEnunciadoId: primeiroId,
      //   // proximoEnunciadoGrupo: GrupoEnunciado.PALETE,
      // });
      // const laudo = {
      //   ...response?.data[0],
      //   type: 'laudo',
      // };

      // setLaudos([...laudos, laudo]);

      const evidencias =
        imagesList?.length > 0
          ? imagesList?.map(i => {
              const extension = mime.getExtension(i?.mimetype);

              return {
                base64: i?.base64,
                mimetype: i?.mimetype,
                filename: i?.filename
                  ? i?.filename
                  : 'arquivo ' + new Date().toString() + '.' + extension,
              };
            })
          : [];

      if (evidencias?.length > 0) {
        const folderName = generateFolderName(
          true,
          response?.data[0]?.id,
          null,
        );

        let evidenciasIds: string[] = [];

        for await (const evidencia of evidencias) {
          console.log('folderName', folderName);

          const { data, error } = await supabase.storage
            .from(folderName)
            .upload(evidencia?.filename, decode(evidencia?.base64), {
              contentType: evidencia?.mimetype,
              upsert: false,
            });

          delete evidencia.base64;

          console.log('evidencia', JSON.stringify(evidencia, null, 2));

          console.log('evidencia data', JSON.stringify(data, null, 2));
          console.log('evidencia error', JSON.stringify(error, null, 2));

          if (error !== null) {
            setIsLoading(false);
            Alert.alert(
              'Ops!',
              'Ocorreu um erro ao salvar as Evidências do Laudo CRM, tente novamente mais tarde.',
            );
          }

          console.log('evidencia2 data', JSON.stringify(data, null, 2));
          console.log('evidencia2 error', JSON.stringify(error, null, 2));

          evidenciasIds = [...evidenciasIds, data?.path!];
        }

        if (evidenciasIds?.length > 0) {
          const isUnique = evidenciasIds.filter(
            (value, index, self) => self.indexOf(value) === index,
          );

          const responseUpdate = await supabase
            .from('laudos-crm')
            .update({
              evidencias: [...isUnique],
            })
            .eq('id', response?.data[0]?.id)
            .select();
          console.log(
            'responseUpdate',
            JSON.stringify(responseUpdate, null, 2),
          );

          setIsLoading(false);

          if (responseUpdate?.error !== null) {
            return Alert.alert(
              'Ops!',
              'Ocorreu um erro ao vincular as Evidências ao Laudo CRM, tente novamente mais tarde.',
            );
          }

          if (responseUpdate?.status === 200) {
            return Alert.alert(
              'Sucesso!',
              'Laudo CRM cadastrado com sucesso!',
              [
                {
                  text: 'Fechar',
                  onPress: () => {
                    handleBack();
                  },
                },
              ],
            );
          }
        }
      }

      setIsLoading(false);
      return Alert.alert('Sucesso!', 'Laudo CRM cadastrado com sucesso!', [
        {
          text: 'Fechar',
          onPress: () => {
            handleBack();
          },
        },
      ]);
    } else {
      Alert.alert(
        'Salvar Laudo',
        'Ocorreu um erro ao salvar o Laudo CRM, tente novamente mais tarde.',
      );
    }

    setIsLoading(false);
  }, [
    replace,
    imagesList,
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
    selectedFormPtp,
    naoConformidadesList,
    formPtpId,
    user,
    setSelectedFormPtp,
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
      ],
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
          height="100%"
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
        facing="back"
      >
        <Box style={styles.takePictureContainer} backgroundColor="transparent">
          <TouchableOpacity onPress={takePicture}>
            <Box
              borderRadius="full"
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
            <MaterialIcons name="cancel" size={40} color="white" />
          </TouchableOpacity>
        </Box>
      </CameraView>
    </View>
  ) : (
    <Fragment>
      {isLoading && (
        <Loading
          flex={1}
          height="100%"
          position={'absolute'}
          top={0}
          left={0}
          right={0}
          bottom={0}
          zIndex={100}
          backgroundColor={'rgba(000, 000, 000, 0.6)'}
        />
      )}
      <ScrollScreenContainer subtitle="LAUDO CRM">
        <VStack px={2} space={6} mb="20%" pt={2}>
          <Box mb={1}>
            <Text mb={-2} color="gray.750">
              Documento de Transporte:
            </Text>
            <Input
              w="full"
              variant="underlined"
              height={14}
              size="md"
              fontSize="md"
              pb={0}
              placeholderTextColor="gray.700"
              value={documentoTransporte}
              onChangeText={t => {
                setDocumentoTransporte(t);
              }}
              _focus={{ borderColor: 'primary.700' }}
              autoComplete="off"
            />
          </Box>

          <Box mb={1}>
            <Text mb={-2} color="gray.750">
              Transportador:
            </Text>
            <Input
              w="full"
              variant="underlined"
              height={14}
              size="md"
              fontSize="md"
              pb={0}
              placeholderTextColor="gray.700"
              value={transportador}
              onChangeText={t => {
                setTransportador(t);
              }}
              _focus={{ borderColor: 'primary.700' }}
              autoComplete="off"
            />
          </Box>

          <Box mb={1}>
            <Text mb={-2} color="gray.750">
              Placa:
            </Text>
            <Input
              w="full"
              variant="underlined"
              height={14}
              size="md"
              fontSize="md"
              pb={0}
              placeholderTextColor="gray.700"
              value={placa}
              onChangeText={t => {
                setPlaca(t);
              }}
              _focus={{ borderColor: 'primary.700' }}
              placeholder="000-0000"
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
              value={notaFiscal}
              // onChangeText={setNotaFiscal}
              isDisabled
              _disabled={{
                color: 'gray.900',
                opacity: 1,
                borderColor: 'gray.700',
              }}
              _focus={{ borderColor: 'primary.700' }}
              autoComplete="off"
            />
          </Box>

          <Box mb={1}>
            <Text mb={-2} color="gray.750">
              Lotes:
            </Text>
            <Input
              w="full"
              variant="underlined"
              height={14}
              size="md"
              fontSize="md"
              pb={0}
              placeholderTextColor="gray.700"
              value={lotes}
              isDisabled
              _disabled={{
                color: 'gray.900',
                opacity: 1,
                borderColor: 'gray.700',
              }}
              _focus={{ borderColor: 'primary.700' }}
              autoComplete="off"
              multiline
            />
          </Box>

          <Box mb={1}>
            <Text mb={-2} color="gray.750">
              Códigos dos Produtos:
            </Text>
            <Input
              w="full"
              variant="underlined"
              height={14}
              size="md"
              fontSize="md"
              pb={0}
              placeholderTextColor="gray.700"
              value={codigoProdutos}
              isDisabled
              _disabled={{
                color: 'gray.900',
                opacity: 1,
                borderColor: 'gray.700',
              }}
              _focus={{ borderColor: 'primary.700' }}
              autoComplete="off"
              multiline
            />
          </Box>

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
          </Box>

          <SelectWithLabel
            label="Turno"
            selectedValue={turno}
            onValueChange={setTurno}
            options={listaTurnos?.map(s => (
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
            label="UP Origem"
            selectedValue={upOrigem}
            onValueChange={setUpOrigem}
            options={listaUPsOrigem?.map(s => (
              <Select.Item key={s?.value} label={s?.label} value={s?.value} />
            ))}
          />

          <SelectWithLabel
            label="CD Origem"
            selectedValue={cdOrigem}
            onValueChange={setCdOrigem}
            options={listaCDsOrigem?.map(s => (
              <Select.Item key={s?.value} label={s?.label} value={s?.value} />
            ))}
          />

          <VStack>
            <Text color="gray.750" mb={4}>
              Evidência(s)
            </Text>

            {imagesList && imagesList?.length > 0 && (
              <VStack mt={1} mb={3}>
                {imagesList?.map((image, index) => (
                  <HStack
                    key={index}
                    space={2}
                    mb={4}
                    w="full"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <HStack space={2} alignItems="center">
                      <Image
                        key={index}
                        source={{ uri: image.uri }}
                        alt="image"
                        size="sm"
                        width="80px"
                        height="30px"
                      />

                      <Text>{index}</Text>
                    </HStack>
                    <Pressable
                      onPress={() => {
                        const newImagesList = imagesList?.filter(
                          (_, idx) => idx !== index,
                        );

                        setImagesList(newImagesList);
                      }}
                    >
                      <MaterialIcons
                        name="delete"
                        color={colors.secondary[700]}
                        size={24}
                      />
                    </Pressable>
                  </HStack>
                ))}
              </VStack>
            )}

            <HStack
              alignItems="center"
              justifyContent="flex-start"
              mb="24px"
              space={5}
            >
              <Pressable onPress={handlePhotoLibrary}>
                <MaterialIcons
                  name="photo"
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
                  name="camera"
                  color={colors.gray[800]}
                  size={28}
                />
              </Pressable>
            </HStack>
          </VStack>

          <Box mb={1} width="100%">
            <ConformidadesCheckbox
              listaNaoConformidades={naoConformidadesList}
              setListaNaoConformidades={setNaoConformidadesList}
              label="Anomalias encontradas:"
              isOnlyView
            />
          </Box>

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
              onPress={handleSaveLaudoCrm}
              isLoading={isLoading}
              disabled={isLoading}
              leftIcon={<Icon as={MaterialIcons} name="save" size="md" />}
            />
          </HStack>
        </VStack>
      </ScrollScreenContainer>
    </Fragment>
  );
}
