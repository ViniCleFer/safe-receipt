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

  const handleListFormPtp = useCallback(() => {
    navigate('/(auth)/forms-ptp-list');
  }, [navigate]);

  const handleListLaudoCrm = useCallback(() => {
    navigate('/(auth)/laudos-crm-list');
  }, [navigate]);

  const handleListDivergencia = useCallback(() => {
    navigate('/(auth)/divergencies-list');
  }, [navigate]);

  return (
    <ScrollScreenContainer subtitle="Selecione o evento para listagem">
      <Pressable onPress={handleListFormPtp}>
        <Card
          bg="white"
          mt="8px"
          mb="12px"
          h="80px"
          justifyContent="center"
          p={3}
        >
          <HStack bg="white" alignItems="center" space={3}>
            <MaterialIcons
              name="warning"
              size={30}
              color={colors.primary[700]}
            />
            <Text color="gray.700" fontSize="lg">
              PTP Logístico
            </Text>
          </HStack>
        </Card>
      </Pressable>
      <Pressable onPress={handleListLaudoCrm}>
        <Card
          bg="white"
          mt="8px"
          mb="12px"
          h="80px"
          justifyContent="center"
          p={3}
        >
          <HStack bg="white" alignItems="center" space={3}>
            <MaterialIcons
              name="warning"
              size={30}
              color={colors.primary[700]}
            />
            <Text color="gray.700" fontSize="lg">
              Laudo CRM
            </Text>
          </HStack>
        </Card>
      </Pressable>
      <Pressable onPress={handleListDivergencia}>
        <Card
          bg="white"
          mt="8px"
          mb="12px"
          h="80px"
          justifyContent="center"
          p={3}
        >
          <HStack bg="white" alignItems="center" space={3}>
            <MaterialIcons
              name="warning"
              size={30}
              color={colors.primary[700]}
            />
            <Text color="gray.700" fontSize="lg">
              Divergência
            </Text>
          </HStack>
        </Card>
      </Pressable>
    </ScrollScreenContainer>
  );
}
