import React from 'react';
import { VStack, Text, Select, Box, Input, Radio } from 'native-base';

import { RadioInput } from '../RadioInput';
import { SelectWithLabel } from '../SelectWithLabel';
import { ConformidadesCheckbox } from '../ConformidadesCheckbox';

interface AnswerCardProps {
  key: string;
  descricao: string;
  posicao: number;
  data: any;
  onChange: any;
}

export function AnswerCard({
  key,
  descricao,
  posicao,
  data,
  onChange,
}: AnswerCardProps) {
  return (
    <VStack key={key} px={2} space={3} mb={3} pt={2}>
      <Text color="gray.800" fontSize={'lg'} fontWeight={'semibold'} mb={4}>
        {`${posicao}) ${descricao}`}
      </Text>

      <SelectWithLabel
        label="Quantidade analisada"
        selectedValue={data[posicao]?.qtdAnalisada}
        onValueChange={t => {
          onChange('qtdAnalisada', t, posicao);
          onChange('enunciado_id', key, posicao);
        }}
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
          value={data[posicao]?.codigoProduto}
          onChangeText={t => onChange('codigoProduto', t, posicao)}
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
          value={data[posicao]?.haNaoConformidade}
          onChange={t => onChange('haNaoConformidade', t, posicao)}
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

      {data[posicao]?.haNaoConformidade === 'sim' && (
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
            value={data[posicao]?.lote}
            onChangeText={t => onChange('lote', t, posicao)}
            maxLength={10}
            _focus={{ borderColor: 'primary.700' }}
            placeholder=""
            autoComplete="off"
          />
        </Box>
      )}

      {data[posicao]?.haNaoConformidade === 'sim' && (
        <Box mb={1} width="100%">
          <ConformidadesCheckbox
            listaNaoConformidades={data[posicao]?.listaNaoConformidades}
            setListaNaoConformidades={t =>
              onChange('listaNaoConformidades', t, posicao)
            }
          />
        </Box>
      )}

      <SelectWithLabel
        label="Qtde de pallets não conforme?"
        selectedValue={data[posicao]?.qtdPalletsNaoConforme}
        onValueChange={t => onChange('qtdPalletsNaoConforme', t, posicao)}
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
        selectedValue={data[posicao]?.qtdCaixasNaoConforme}
        onValueChange={t => onChange('qtdCaixasNaoConforme', t, posicao)}
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
    </VStack>
  );
}
