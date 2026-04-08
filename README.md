Este projeto implementa um pequeno jogo de "Pescaria" em HTML, usando a API do Canvas para Javascript. O jogo se baseia em controlar um 
"arpão" (o triângulo verde) na "praia" (parte inferior do canvas, em cor amarela) com as teclas "A" e "D", para se mover para esquerda e direita
respectivamente, e a tecla "S" para lançar "bolhas" (os quadrados pretos) que, ao colidir com um "peixe" (os polígonos) no "mar" (a parte
superior do Canvas, em azul-claro), capturam-nos. O objetivo final do jogo é capturar todos os peixes.

<img width="1440" height="729" alt="image" src="https://github.com/user-attachments/assets/31191bb4-4508-453a-9d40-09c5abfbaeec" />


O objetivo desse projeto foi treinar o uso da API Canvas, especificamente da Interface CanvasRenderingContext2D, para transformações 
dinâmicas em 2D (em geral, translações), assim como a manipulação de Event Handlers para controle interativo em Javascript. Foi
utilizada uma Abordagem Orientada a Objetos para facilitar o encapsulamento de diversas entidades nesse código (como é comum
em desenvolvimento de jogos).

As variáveis padrão do jogo (como a qtd. de peixes, tamanho da bolha, etc) podem ser facilmente alteradas mudando as constantes nas primeiras
linhas do arquivo pescaria.js. Por fim, a velocidade do jogo pode ser alterada dinâmicamente utilizando o slider no topo da tela. O
botão "Pausar"/"Jogar" obviamente pausa/da play do jogo, enquanto que o botão "Passo", ativo somente quando o jogo está pausado, avança 
um frame de jogo.
<img width="295" height="74" alt="image" src="https://github.com/user-attachments/assets/30c3c687-4de9-4ca5-a9ae-2fb65a14c635" />


Este projeto foi feito em uma bateria contínua de implementação de aprox. 8 horas. Durante o desenvolvimento diversas lógicas de implementação
foram mudadas. Alguns exemplos a seguir: 

 - A implementação das bolhas antes usava um array que crescia indeterminadamente, apenas marcando a flag "bolha_ativa"
como false, causando lag caso muitas bolhas fossem atiradas em uma unica partida. Isso foi corrigido usando Array.filter() para eliminar
as bolhas inativas a cada iteração.

 - O tamanho aleatório dos peixes e a lógica de movimento fazia com que diversos peixes ficasses "travados" nos cantos da tela (o pulo
para dentro não era grande o suficiente e eles ficavam pulando e trocando a direção pra sempre)

 - O resize antes fazia o canvas sumir. (Pra ser sincero até agora não entendi o que estava causando esse bug, eu reescrevi o resize() e ele
sumiu :D).

Até o momento, não existem bugs conhecidos. Sinta-se livre para me informar se encontrar um (pode ser na aba Issues desse github)!

A seguir, uma To-Do List de coisas que pensei que podem deixar o jogo mais interessante futuramente (apesar de ser uma missão difícil):
 - Adicionar um timer;
 - Adicionar sistema de pontuação (baseada no timer);
 - Adicionar dificuldade variável de acordo com fases (talvez);
 - Adicionar sistema de "loja", entre as fases, (pontos seriam moedas ?) de novas texturas e/ou itens (?);
 - Adicionar um Placar Geral (salvo como Cookie) para que jogadores possam competir localmente;

