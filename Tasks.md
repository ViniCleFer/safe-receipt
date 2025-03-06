## APLICAÇÃO MOBILE

[X] Incluir na listagem de UP Origem (Tela Formulário PTP)
LN01 - Lonado
LN02 - Lonado

### Formulário PTP

[X] Adicionar um campo Tipo do Código Produto de Radio com as opções Misto ou Exclusivo
[X] Se Exclusivo = É preciso digitar o "Código Produto" uma vez e ele preenche para todos as respostas
Se Misto = Se é misto deixar o "Código Produto" em branco
[X] O campo "Quantidade Analisada" não precisa aparecer em todos os enunciados, apenas no ínicio das Respostas (Movido para o Form PTP)

### Respostas do PTP

[X] Em cada enunciado quando o campo "Há não conformidade" for "não" precisa ocultar os campos "Qtde Palletes Não Conforme" e "Qtde Caixas Não Conforme"
[X] O campo lote precisa ser um array (Deixei string)
[X] O campo "Lote" precisa ser teclado numérico igual SKU de Cadastro de Divergência
[X] O campo "Qtde Caixas Não Conforme" pode ser aberto e precisa ser teclado numérico igual SKU de Cadastro de Divergência
[X] O campo "Código de Produto" precisa ser um array (Mais de um código de produto por Resposta) vai depender se é exclusivo ou misto
[X] Campo "Código Produto" precisa ser teclado numérico igual SKU de Cadastro de Divergência (Tentar manter XX.XXXXXX sempre 2 dígitos e um ponto (.) e mais 6 no final)
[X] Trocar a label de "Qtde de caixas não conforme?" para "Qtde de caixas/fardos não conforme?"

Opções de Não Conformidade precisa vir de acordo com as questões

### Enunciados PALETE

[X] Item 1) Palete com falta - precisa vir checkado - sem as outras opções
[X] Item 2) Palete Desalinhado, Palete Tombado - precisa vir desmarcado - sem as outras opções
[X] Item 3) Excluir o Enunciado 3
[X] Item 4) é o novo 3) Palete quebrado - precisa vir checkado - sem as outras opções
[X] Item 5) é o novo 4) Palete com strech rasgado, Pallet sem strech no pé - precisa vir desmarcado - sem as outras opções
[X] Item 6) Excluir o Enunciado 6
[X] Item 7) é o novo 5) Remover as opções de Não Conformidade e Remover "Quantidade de caixas não conforme"

### Enunciados CAIXA E FARDO

[X] Item 1) Palete Sujidade, Palete Avaria - precisa vir desmarcado - sem as outras opções
[X] Item 2) Palete com avaria - precisa vir checkado - sem as outras opções
[X] Item 3) CAIXA SEM ETIQUETA (Precisa criar essa opção no Banco) - precisa vir checkado - sem as outras opções
[X] Item 4) CAIXA COM MAIS DE UMA ETIQUETA (Precisa criar essa opção no Banco) - precisa vir checkado - sem as outras opções
[X] Item 5) ETIQUETA NÃO EQUIVALE AO PRODUTO (Precisa criar essa opção no Banco) - precisa vir checkado - sem as outras opções
[X] Item 6) PRODUTO EM SHELF LIFE (Precisa criar essa opção no Banco) - precisa vir checkado - sem as outras opções

### Laudo

[X] No ínicio do Laudo perguntar Se há Divergência (Se "Não", só finalizar, se "Sim" escolher uma das 3 opções e mostrar o formulário de acordo com a divergência escolhida sem a opção de anexar Evidencias)
[X] Trazer a quantidade de caixas não conforme igual o lote, ser um array separado por vírgula
[X] O campo "Documento de Transporte" pode ser aberto e precisa ser teclado numérico igual SKU de Cadastro de Divergência
[X] Campo "Placa" tentar manter XXX-XXXX sempre 3 dígitos e um hifen (-) e depois mais 4 caracteres
[X] Trazer a UP de Origem do Formulário PTP
[X] Validar se dá para serpara as Evidencias em 4 opções (UC / Etiqueta Caixa / Avarias / Palletes) manter a funcionalidade como está limitando por 3 fotos de cada
[X] Adicionar um campo livre "Obervações Gerais" limite de 1000 caracteres depois das anomalias encontradas
[X] Colocar o campo "Turno" acima do campo "Nota Fiscal"

### Evidências

[ ] Alinhar as imagens, está tudo colado (Imagem no código)

### Melhorias Técnicas

[ ] Colocar uma validação geral no momento de salvar as evidências
[ ] Padronizar o tamanho das imagens com tamanho de 300x300 (L x A)
[ ] Mostrar qual campo falta preencher na validação

## APLICAÇÃO WEB

[ ] Listagem de PTP com as respostas
[ ] Listagem de Laudo com imagens
[ ] Listagem de Divergências que forem feitas separado com imagens
[ ] Possibilidade de exportar um Relatório em Excel sem as imagens
[ ] Possibilidade de Gerar um PDF do Laudo com as imagens (Conforme o card do APP)
