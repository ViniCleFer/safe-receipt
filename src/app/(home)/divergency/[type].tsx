import React, { useCallback, useEffect, useRef, useState } from 'react';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
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
  Text,
  useTheme,
  View,
  VStack,
} from 'native-base';
import { Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { shade } from 'polished';

import { Button } from '@/components/Button';
import { Loading } from '@/components/Loading';
import { ScrollScreenContainer } from '@/components/ScrollScreenContainer';

import {
  DivergenciaPost,
  TipoDivergencia,
} from '@/services/requests/divergences/types';
import { createDivergenceRequest } from '@/services/requests/divergences/utils';
import { router, useLocalSearchParams } from 'expo-router';

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

export default function Divergency() {
  const { colors } = useTheme();

  const { back } = router;
  const { type } = useLocalSearchParams<{ type: string }>();

  console.log('routes', type);

  const [isLoading, setIsLoading] = useState(false);

  const [isCameraActive, setIsCameraActive] = useState(false);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [imagesList, setImagesList] = useState<any[]>([]);

  const [sku, setSku] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [skuNotaFiscal, setSkuNotaFiscal] = useState('');
  const [quantidadeNotaFiscal, setQuantidadeNotaFiscal] = useState('');

  const [permission, requestPermission] = useCameraPermissions();

  const cameraRef = useRef<any>(null);

  useEffect(() => {
    requestPermission();
  }, []);

  if (!permission?.granted) {
    console.log('Não permitiu');
  }

  const divergencyType = () => {
    if (type && type === 'falta') {
      return {
        type: TipoDivergencia.FALTA,
        text: 'Falta',
      };
    }
    if (type && type === 'sobra') {
      return {
        type: TipoDivergencia.SOBRA,
        text: 'Sobra',
      };
    }
    if (type && type === 'inversa') {
      return {
        type: TipoDivergencia.INVERSAO,
        text: 'Inversão',
      };
    }
  };

  const getNextStepsByDivergencyType = (
    tipoDivergencia: TipoDivergencia,
    sku: string,
    quantidade: string,
    skuNotaFiscal: string,
    quantidadeNotaFiscal: string
  ) => {
    const nextSteps = {
      [TipoDivergencia.FALTA]: `Solicitar o envio do saldo para a origem. (${sku} - ${quantidade})`,
      [TipoDivergencia.SOBRA]: `Solicitar para a origem o envio do saldo. (${sku} - ${quantidade})`,
      [TipoDivergencia.INVERSAO]: `Solicitar a origem que envie o saldo do físico recebido (${sku} - ${quantidade}). \n
          E devolver o saldo da nota fiscal para origem (${skuNotaFiscal} - ${quantidadeNotaFiscal}).`,
    };

    return nextSteps[tipoDivergencia];
  };

  const handleBack = useCallback(() => {
    setSku('');
    setQuantidade('');
    setImagesList([]);
    setSkuNotaFiscal('');
    setQuantidadeNotaFiscal('');

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

      if (!result.canceled && result?.assets?.length > 0) {
        const uri = result?.assets[0]?.uri;
        const fileBase64 = result?.assets[0]?.base64;
        const filename = result?.assets[0]?.fileName;
        const size = result?.assets[0]?.fileSize;

        const mimetype = mime.getType(uri);

        console.log('result', JSON.stringify(result, null, 2));

        setImagesList((prevState) => [
          ...prevState,
          { uri, base64: fileBase64, mimetype, filename, size },
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

        const size = photo?.size;

        console.log('photo', JSON.stringify(photo, null, 2));

        setImagesList((prevState) => [
          ...prevState,
          { uri: photo?.uri, base64: photo?.base64, filename, mimetype, size },
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

  const handleSaveEvent = useCallback(async () => {
    if (!sku || !quantidade || imagesList?.length === 0) {
      setIsLoading(false);
      return Alert.alert(
        'Cadastro de Divergência',
        'Por favor, preencha todos os campos para cadastrar o evento.'
      );
    }

    if (divergencyType()?.type === TipoDivergencia.INVERSAO) {
      if (!skuNotaFiscal || !quantidadeNotaFiscal) {
        setIsLoading(false);
        return Alert.alert(
          'Cadastro de Divergência',
          'Por favor, preencha todos os campos para cadastrar o evento.'
        );
      }
    }

    setIsLoading(true);

    try {
      const evidencias =
        imagesList?.length > 0
          ? imagesList?.map((i, idx) => {
              const extension = mime.getExtension(i?.mimetype);

              return {
                base64: i?.base64,
                mimetype: i?.mimetype,
                size: i?.size,
                filename: i?.filename
                  ? i?.filename
                  : 'arquivo ' + idx + '.' + extension,
              };
            })
          : [];

      const proximoPasso = getNextStepsByDivergencyType(
        divergencyType()?.type!,
        sku,
        quantidade,
        skuNotaFiscal,
        quantidadeNotaFiscal
      );

      const data: DivergenciaPost = {
        tipoDivergencia: divergencyType()?.type!,
        evidencias,
        skuFaltandoFisicamente:
          divergencyType()?.type === TipoDivergencia.FALTA ? sku : null,
        qtdFaltandoFisicamente:
          divergencyType()?.type === TipoDivergencia.FALTA
            ? Number(quantidade)
            : null,
        skuSobrandoFisicamente:
          divergencyType()?.type === TipoDivergencia.SOBRA ? sku : null,
        qtdSobrandoFisicamente:
          divergencyType()?.type === TipoDivergencia.SOBRA
            ? Number(quantidade)
            : null,
        skuRecebemosFisicamente:
          divergencyType()?.type === TipoDivergencia.INVERSAO ? sku : null,
        qtdRecebemosFisicamente:
          divergencyType()?.type === TipoDivergencia.INVERSAO
            ? Number(quantidade)
            : null,
        skuNotaFiscal:
          divergencyType()?.type === TipoDivergencia.INVERSAO
            ? skuNotaFiscal
            : null,
        qtdNotaFiscal:
          divergencyType()?.type === TipoDivergencia.INVERSAO
            ? Number(quantidadeNotaFiscal)
            : null,
        proximoPasso,
      };

      const response = await createDivergenceRequest(data);

      if (response?.status === 201) {
        console.log('response', JSON.stringify(response?.data, null, 2));

        Alert.alert('Próximos Passos', proximoPasso, [
          {
            text: 'OK, entendi',
            onPress: () => {
              handleBack();
            },
          },
        ]);
      } else {
        Alert.alert(
          'Ops!',
          'Ocorreu um erro ao salvar a Divergência, tente novamente mais tarde.'
        );
      }
    } catch (error) {
      Alert.alert('Ops!', 'Ocorreu um erro ao salvar a Divergência.');
      console.log('Error response', JSON.stringify(error, null, 2));
    } finally {
      setIsLoading(false);
    }
  }, [
    back,
    imagesList,
    divergencyType,
    getNextStepsByDivergencyType,
    sku,
    quantidade,
    skuNotaFiscal,
    quantidadeNotaFiscal,
  ]);

  const handleCancel = useCallback(() => {
    Alert.alert(
      'Cancelar Divergência',
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
    <>
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
      <ScrollScreenContainer
        subtitle={`Divergência - ${divergencyType()?.text}`}
      >
        <VStack px={2}>
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
                      source={{ uri: image?.uri }}
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
              <MaterialIcons name='photo' color={colors.gray[800]} size={28} />
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

        {divergencyType()?.type === TipoDivergencia.FALTA && (
          <VStack px={2} space={6} pt={2}>
            <Box mb={1}>
              <Text mb={-2} color='gray.750'>
                Qual SKU está faltando fisicamente?
              </Text>
              <Input
                w='full'
                variant='underlined'
                height={14}
                size='md'
                fontSize='md'
                pb={0}
                placeholderTextColor='gray.700'
                value={sku}
                onChangeText={(t) => {
                  setSku(t);
                }}
                _focus={{ borderColor: 'primary.700' }}
                autoComplete='off'
              />
            </Box>
            <Box mb={1}>
              <Text mb={-2} color='gray.750'>
                Qual a quantidade que está faltando fisicamente?
              </Text>
              <Input
                w='full'
                variant='underlined'
                height={14}
                size='md'
                fontSize='md'
                pb={0}
                placeholderTextColor='gray.700'
                value={quantidade}
                onChangeText={(t) => {
                  setQuantidade(t);
                }}
                _focus={{ borderColor: 'primary.700' }}
                autoComplete='off'
              />
            </Box>

            {/* {isAlertVisible && (
              <HStack
                space={3}
                alignItems={'center'}
                background={'gray.100'}
                py={2}
                px={4}
                borderRadius={4}
              >
                <MaterialCommunityIcons
                  name="alert"
                  color={colors.primary[700]}
                  size={24}
                />
                <VStack>
                  <Text
                    fontSize={'md'}
                    fontWeight={'semibold'}
                    mb={-2}
                    color="black"
                  >
                    Próximo passo:
                  </Text>
                  <Text
                    fontSize={'md'}
                    fontWeight={'semibold'}
                    mt={2}
                    color="primary.700"
                  >
                    {`Solicitar o envio do saldo para a origem. (${sku} - ${quantidade})`}
                  </Text>
                </VStack>
              </HStack>
            )} */}
          </VStack>
        )}

        {divergencyType()?.type === TipoDivergencia.SOBRA && (
          <VStack px={2} space={6} pt={2}>
            <Box mb={1}>
              <Text mb={-2} color='gray.750'>
                Qual SKU está sobrando fisicamente?
              </Text>
              <Input
                w='full'
                variant='underlined'
                height={14}
                size='md'
                fontSize='md'
                pb={0}
                placeholderTextColor='gray.700'
                value={sku}
                onChangeText={(t) => {
                  setSku(t);
                }}
                _focus={{ borderColor: 'primary.700' }}
                autoComplete='off'
              />
            </Box>
            <Box mb={1}>
              <Text mb={-2} color='gray.750'>
                Qual a quantidade que está sobrando fisicamente?
              </Text>
              <Input
                w='full'
                variant='underlined'
                height={14}
                size='md'
                fontSize='md'
                pb={0}
                placeholderTextColor='gray.700'
                value={quantidade}
                onChangeText={(t) => {
                  setQuantidade(t);
                }}
                _focus={{ borderColor: 'primary.700' }}
                autoComplete='off'
              />
            </Box>

            {/* {isAlertVisible && (
              <HStack
                space={3}
                alignItems={'center'}
                background={'gray.100'}
                py={2}
                px={4}
                borderRadius={4}
              >
                <MaterialCommunityIcons
                  name="alert"
                  color={colors.primary[700]}
                  size={24}
                />
                <VStack>
                  <Text
                    fontSize={'md'}
                    fontWeight={'semibold'}
                    mb={-2}
                    color="black"
                  >
                    Próximo passo:
                  </Text>
                  <Text
                    fontSize={'md'}
                    fontWeight={'semibold'}
                    mt={2}
                    color="primary.700"
                  >
                    {`Solicitar o envio do saldo para a origem. (${sku} - ${quantidade})`}
                  </Text>
                </VStack>
              </HStack>
            )} */}
          </VStack>
        )}

        {divergencyType()?.type === TipoDivergencia.INVERSAO && (
          <VStack px={2} space={6} pt={2}>
            <Box mb={1}>
              <Text mb={-2} color='gray.750'>
                Qual SKU recebemos fisicamente?
              </Text>
              <Input
                w='full'
                variant='underlined'
                height={14}
                size='md'
                fontSize='md'
                pb={0}
                placeholderTextColor='gray.700'
                value={sku}
                onChangeText={(t) => {
                  setSku(t);
                }}
                _focus={{ borderColor: 'primary.700' }}
                autoComplete='off'
              />
            </Box>
            <Box mb={1}>
              <Text mb={-2} color='gray.750'>
                Qual a quantidade que recebemos fisicamente?
              </Text>
              <Input
                w='full'
                variant='underlined'
                height={14}
                size='md'
                fontSize='md'
                pb={0}
                placeholderTextColor='gray.700'
                value={quantidade}
                onChangeText={(t) => {
                  setQuantidade(t);
                }}
                _focus={{ borderColor: 'primary.700' }}
                autoComplete='off'
              />
            </Box>
            <Box mb={1}>
              <Text mb={-2} color='gray.750'>
                Qual SKU está na nota fiscal?
              </Text>
              <Input
                w='full'
                variant='underlined'
                height={14}
                size='md'
                fontSize='md'
                pb={0}
                placeholderTextColor='gray.700'
                value={skuNotaFiscal}
                onChangeText={(t) => {
                  setSkuNotaFiscal(t);
                }}
                _focus={{ borderColor: 'primary.700' }}
                autoComplete='off'
              />
            </Box>
            <Box mb={1}>
              <Text mb={-2} color='gray.750'>
                Qual a quantidade que está na nota fiscal?
              </Text>
              <Input
                w='full'
                variant='underlined'
                height={14}
                size='md'
                fontSize='md'
                pb={0}
                placeholderTextColor='gray.700'
                value={quantidadeNotaFiscal}
                onChangeText={(t) => {
                  setQuantidadeNotaFiscal(t);
                }}
                _focus={{ borderColor: 'primary.700' }}
                autoComplete='off'
              />
            </Box>

            {/* {isAlertVisible && (
              <HStack
                space={3}
                alignItems={'center'}
                background={'gray.100'}
                py={2}
                px={4}
                borderRadius={4}
              >
                <MaterialCommunityIcons
                  name="alert"
                  color={colors.primary[700]}
                  size={24}
                />
                <VStack>
                  <Text
                    fontSize={'md'}
                    fontWeight={'semibold'}
                    mb={-2}
                    color="black"
                  >
                    Próximo passo:
                  </Text>
                  <Text
                    fontSize={'md'}
                    fontWeight={'semibold'}
                    mt={2}
                    color="primary.700"
                  >
                    {`Solicitar o envio do saldo para a origem. (${sku} - ${quantidade})`}
                  </Text>
                </VStack>
              </HStack>
            )} */}
          </VStack>
        )}

        <HStack mt='8%' px={2} width='100%' justifyContent='space-between'>
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
            onPress={handleSaveEvent}
            isLoading={isLoading}
            disabled={isLoading}
            leftIcon={<Icon as={MaterialIcons} name='save' size='md' />}
          />
        </HStack>
      </ScrollScreenContainer>
    </>
  );
}
