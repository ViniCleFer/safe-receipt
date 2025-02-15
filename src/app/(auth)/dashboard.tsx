import { useCallback } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { HStack, Pressable, Text, useTheme } from 'native-base';

import { Card } from '../../components/Card';
import { ScrollScreenContainer } from '../../components/ScrollScreenContainer';
import { router } from 'expo-router';

export default function Home() {
  const { colors } = useTheme();

  const handleCreateFormPtp = useCallback(() => {
    router.navigate('/(auth)/select-form-type-to-register');
  }, [router]);

  const handleFormsPtpList = useCallback(() => {
    router.navigate('/(auth)/select-form-type-to-list');
  }, [router]);

  return (
    <ScrollScreenContainer>
      <Pressable onPress={handleCreateFormPtp}>
        <Card bg="white" mt="8px" mb="12px">
          <HStack bg="white" alignItems="center" ml="-4px" mb="4px">
            <MaterialIcons
              name="open-in-new"
              size={26}
              color={colors.primary[700]}
            />
          </HStack>

          <Text color="gray.700" fontSize="lg" mt={3}>
            Cadastrar Formulários
          </Text>
        </Card>
      </Pressable>

      <Pressable onPress={handleFormsPtpList}>
        <Card bg="white" mt="8px" mb="12px">
          <HStack bg="white" alignItems="center" ml="-4px" mb="4px">
            <MaterialIcons
              name="format-list-bulleted"
              size={26}
              color={colors.primary[700]}
            />
          </HStack>

          <Text color="gray.700" fontSize="lg" mt={3}>
            Meus Formulários
          </Text>
        </Card>
      </Pressable>

      {/* <Pressable onPress={handleActionsList}>
        <Card bg="white" mt="8px" mb="12px">
          <HStack bg="white" alignItems="center" ml="-4px" mb="4px">
            <FontAwesome5
              name="clipboard-check"
              size={26}
              color={colors.primary[700]}
            />
          </HStack>

          <Text color="gray.700" fontSize="lg" mt={3}>
            Ações Pendentes
          </Text>
          {user?.perfilPadrao === 2 && (
            <Box
              w="100%"
              mt={3}
              display={'flex'}
              justifyContent="flex-start"
              backgroundColor={'blue.300'}
              borderRadius={4}
              py={2}
              px={3}
            >
              <HStack
                space={2}
                alignItems={'center'}
                justifyContent="flex-start"
              >
                <Alert.Icon color={'blue.600'} />
                <Text color="blue.700" fontSize="md">
                  Total de {totalRecords} etiqueta(s) com criticidade/prioridade
                  A
                </Text>
              </HStack>
            </Box>
          )}
        </Card>
      </Pressable> */}
    </ScrollScreenContainer>
  );
}
