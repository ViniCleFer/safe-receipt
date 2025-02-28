## APLICAÇÃO MOBILE

[X] Incluir na listagem de UP Origem (Tela Formulário PTP)
LN01 - Lonado
LN02 - Lonado

### Formulário PTP

[ ] Adicionar um campo Tipo do Código Produto de Radio com as opções Misto ou Exclusivo
Se Exclusivo = É preciso digitar o "Código Produto" uma vez e ele preenche para todos as respostas
Se Misto = Se é misto deixar o "Código Produto" em branco

### Respostas do PTP

[ ] O campo "Quantidade Analisada" não precisa aparecer em todos os enunciados, apenas no ínicio das Respostas
[ ] Em cada enunciado quando o campo "Há não conformidade" for "não" precisa ocultar os campos "Qtde Palletes Não Conforme" e "Qtde Caixas Não Conforme"
[ ] O campo "Código de Produto" precisa ser um array (Mais de um código de produto por Resposta) vai depender se é exclusivo ou misto
[ ] O campo lote precisa ser um array
[ ] O campo "Qtde Caixas Não Conforme" pode ser aberto e precisa ser teclado numérico igual SKU de Cadastro de Divergência
[ ] O campo "Lote" precisa ser teclado numérico igual SKU de Cadastro de Divergência
[ ] Campo "Código Produto" precisa ser teclado numérico igual SKU de Cadastro de Divergência (Tentar manter XX.XXXXXXXX sempre 2 dígitos e um ponto (.))

Opções de Não Conformidade precisa vir de acordo com as questões

### Enunciados PALETE

[ ] Item 1) Palete com falta - precisa vir checkado - sem as outras opções
[ ] Item 2) Palete Desalinhado, Palete Tombado - precisa vir desmarcado - sem as outras opções
[X] Item 3) Excluir o Enunciado 3
[ ] Item 4) Palete quebrado - precisa vir checkado - sem as outras opções
[ ] Item 5) Palete com strech rasgado, Pallet sem strech no pé - precisa vir desmarcado - sem as outras opções
[X] Item 6) Excluir o Enunciado 6
[ ] Item 7) Remover as opções de Não Conformidade e Remover "Quantidade de caixas não conforme"

### Enunciados CAIXA E FARDO

[ ] Item 1) Palete Sujidade, Palete Avaria - precisa vir desmarcado - sem as outras opções
[ ] Item 2) Palete com avaria - precisa vir checkado - sem as outras opções
[ ] Item 3) CAIXA SEM ETIQUETA (Precisa criar essa opção no Banco) - precisa vir checkado - sem as outras opções
[ ] Item 4) CAIXA COM MAIS DE UMA ETIQUETA (Precisa criar essa opção no Banco) - precisa vir checkado - sem as outras opções
[ ] Item 5) ETIQUETA NÃO EQUIVALE AO PRODUTO (Precisa criar essa opção no Banco) - precisa vir checkado - sem as outras opções
[ ] Item 6) PRODUTO EM SHELF LIFE (Precisa criar essa opção no Banco) - precisa vir checkado - sem as outras opções

### Laudo

[ ] No ínicio do Laudo perguntar Se há Divergência (Se "Não", só finalizar, se "Sim" escolher uma das 3 opções e mostrar o formulário de acordo com a divergência escolhida sem a opção de anexar Evidencias)
[ ] Trazer a quantidade de caixas igual o lote, ser um array separado por vírgula
[ ] O campo "Documento de Transporte" pode ser aberto e precisa ser teclado numérico igual SKU de Cadastro de Divergência
[ ] Campo "Placa" tentar manter XXX-XXXX sempre 3 dígitos e um hifen (-) e depois mais 4 caracteres
[ ] Trazer a UP de Origem do Formulário PTP
[ ] Validar se dá para serpara as Evidencias em 4 opções (UC / Etiqueta Caixa / Avarias / Palletes) manter a funcionalidade como está limitando por 3 fotos de cada
[ ] Adicionar um campo livre "Obervações Gerais" limite de 1000 caracteres depois das anomalias encontradas

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
