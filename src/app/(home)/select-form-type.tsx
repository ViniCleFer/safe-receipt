import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { HStack, Pressable, Text, useTheme } from 'native-base';
import { useCallback } from 'react';

import { Card } from '../../components/Card';
import { ScrollScreenContainer } from '../../components/ScrollScreenContainer';
import { router } from 'expo-router';

export default function SelectFormType() {
  const { colors } = useTheme();
  const { navigate } = router;

  const handleCreateFormPtp = useCallback(() => {
    navigate('/(home)/form-ptp');
  }, [navigate]);

  const handleCreateLaudoCrm = useCallback(() => {
    navigate('/(home)/laudo-crm');
  }, [navigate]);

  const handleCreateDivergencia = useCallback(() => {
    navigate('/(home)/select-divergency-type');
  }, [navigate]);

  return (
    <ScrollScreenContainer>
      <Pressable onPress={handleCreateFormPtp}>
        <Card
          bg='white'
          mt='8px'
          mb='12px'
          h='80px'
          justifyContent='center'
          p={3}
        >
          <HStack bg='white' alignItems='center' space={3}>
            <MaterialIcons
              name='warning'
              size={30}
              color={colors.primary[700]}
            />
            <Text color='gray.700' fontSize='lg'>
              PTP Logístico
            </Text>
          </HStack>
        </Card>
      </Pressable>
      <Pressable onPress={handleCreateLaudoCrm}>
        <Card
          bg='white'
          mt='8px'
          mb='12px'
          h='80px'
          justifyContent='center'
          p={3}
        >
          <HStack bg='white' alignItems='center' space={3}>
            <MaterialIcons
              name='warning'
              size={30}
              color={colors.primary[700]}
            />
            <Text color='gray.700' fontSize='lg'>
              Laudo CRM
            </Text>
          </HStack>
        </Card>
      </Pressable>
      <Pressable onPress={handleCreateDivergencia}>
        <Card
          bg='white'
          mt='8px'
          mb='12px'
          h='80px'
          justifyContent='center'
          p={3}
        >
          <HStack bg='white' alignItems='center' space={3}>
            <MaterialIcons
              name='warning'
              size={30}
              color={colors.primary[700]}
            />
            <Text color='gray.700' fontSize='lg'>
              Divergência
            </Text>
          </HStack>
        </Card>
      </Pressable>
    </ScrollScreenContainer>
  );
}
