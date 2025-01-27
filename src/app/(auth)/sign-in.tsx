import { useCallback, useState } from 'react';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import { Box, Icon, Image, Link, Pressable, Text, VStack } from 'native-base';
import { useForm } from 'react-hook-form';
import { Alert } from 'react-native';
import { z } from 'zod';
import * as Constants from 'expo-constants';

import Logo from '@/assets/ype.png';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';

import useAuthStore from '@/store/auth';

import { supabase } from '@/lib/supabase';

import { setUserLocalStorage } from '@/services/requests/auth/helpers';
import { router } from 'expo-router';

interface FormData {
  email: string;
  password: string;
}

export default function SignIn() {
  const { navigate, reset } = useNavigation();

  const currentVersion = Constants?.default?.expoConfig?.version;

  const setUserAuthenticated = useAuthStore(
    (state) => state.setUserAuthenticated
  );

  const [isLoading, setIsLoading] = useState(false);
  const [closedEyes, setClosedEyes] = useState(true);

  const formValidation = useCallback((): any => {
    return z.object({
      email: z.string({ required_error: 'O campo RE/E-mail é obrigatório.' }),
      password: z.string({ required_error: 'O campo senha é obrigatório' }),
    });
  }, []);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formValidation()),
  });

  const actualYear = new Date().getFullYear();

  async function handleLogin(formData: any) {
    setIsLoading(true);

    const {
      error,
      data: { session },
    } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      Alert.alert(
        'Login',
        'Erro ao logar um usuário, por favor tente novamente mais tarde'
      );
      console.error(
        'SignUp => handleSignUp',
        JSON.stringify(error?.message, null, 2)
      );
    }

    if (session) {
      const { access_token, refresh_token, user } = session;

      const tokens = {
        access_token,
        refresh_token,
      };

      await setUserLocalStorage(user);
      setUserAuthenticated(user, tokens);
    }
    setIsLoading(false);

    // Alert.alert('Login', 'Usuário ou senha inválidos');
  }

  return (
    <VStack
      alignItems='center'
      justifyContent='center'
      zIndex={100}
      w='100%'
      px={'8%'}
      bg='transparent'
      flex={1}
    >
      {/* <Text color="gray.750" mb={10}>
        EHS
      </Text> */}
      <Image
        alt='logo'
        source={Logo}
        defaultSource={Logo}
        width={'60%'}
        height={'25%'}
        resizeMode='contain'
        ml={5}
      />

      <Input
        label='LOGIN'
        name='email'
        control={control}
        placeholder='E-mail ou RE'
        autoCapitalize='none'
        autoCorrect={false}
        keyboardType='email-address'
        error={errors.email}
        _focus={{ borderColor: 'primary.700' }}
      />
      <Input
        label='SENHA'
        name='password'
        control={control}
        error={errors.password}
        placeholder='Senha'
        secureTextEntry={closedEyes}
        autoComplete='off'
        _focus={{ borderColor: 'primary.700' }}
        InputRightElement={
          <Pressable
            display='center'
            alignItems='center'
            justifyContent='center'
            p={4}
            onPress={() => {
              setClosedEyes((prevState) => !prevState);
            }}
          >
            <Icon
              as={Feather}
              name={closedEyes ? 'eye-off' : 'eye'}
              color={errors.password ? 'secondary.700' : 'gray.700'}
              size={4}
              focusable
            />
          </Pressable>
        }
      />

      <Button
        backgroundColor='primary.700'
        title='Entrar'
        my={2}
        _pressed={{ bg: 'primary.600' }}
        variant={'solid'}
        _text={{
          color: 'white',
        }}
        onPress={handleSubmit(handleLogin)}
        isLoading={isLoading}
        disabled={isLoading}
        leftIcon={<Icon as={MaterialIcons} name='login' size='md' />}
      />

      <Link
        onPress={() => {
          router.navigate('/(auth)/forgot-password');
        }}
        alignSelf='center'
        padding={2}
      >
        Cadastre-se
      </Link>

      <Link
        onPress={() => {
          router.navigate('/(auth)/forgot-password');
        }}
        alignSelf='center'
        padding={2}
      >
        Esqueceu a senha?
      </Link>

      <Box
        justifyContent='center'
        alignItems='center'
        position='absolute'
        bottom={16}
      >
        <Text color='gray.750' fontSize='12px' fontWeight='semibold'>
          @Copyright VF Code LTDA {actualYear}
        </Text>
        <Text color='gray.700' fontSize='12px'>
          Versão {currentVersion}
        </Text>
      </Box>
    </VStack>
  );
}
