/*
    pescaria de MAC0420/MAC5744 - Pescaria

    Nome: João Víctor Ferreira
    NUSP: 15495668

    Ao preencher esse cabeçalho com meu nome e número USP, declaro
    que todas as partes originais desse exercício programa (EP)
    foram desenvolvidas e implementadas por mim e que portanto não 
    constituem desonestidade acadêmica ou plágio.

    Declaro também que sou responsável por todas as cópias desse
    programa e que não distribuí ou facilitei a sua distribuição.
    Estou ciente que os casos de plágio e desonestidade acadêmica
    são tratados segundo os critérios divulgados na página da 
    disciplina.

    Entendo que EPs sem assinatura devem receber nota zero e, ainda
    assim, podem ser punidos por desonestidade acadêmica.

 */

const canvas = document.getElementById("meucanvas");
const ctx = canvas.getContext("2d");
const QTD_PEIXES = 100;
const TAM_BOLHA = 0.03; 
const AREIA_Y = -0.7;
const VEL_ARPAO = 0.1;
let peixesMortos =0;
let pausado = false;
let fatorVelocidade = 1;
let pauseBtn = document.getElementById("Jogar");
let passoBtn = document.getElementById("Passo");
let velBtn = document.getElementById("Vel");
let peixes = []
let bolhas = []
let arpaoX = 0.0;


    // Classes e Funções

class Peixe {
    constructor() {
        this.x = (Math.random() * 2) - 1;
        this.y = (Math.random() * 1.35) - 0.7;
        this.vx = (Math.random() * 0.01);
        this.vy = (Math.random() * 0.01);
        this.raio = 0.05 + Math.random() * 0.05; // 0.05 é o "mínimo" pq tinham peixes mt pequenos
        this.lados = [4, 8, 16][Math.floor(Math.random() * 3)];
        // 0.4 é a transparencia mínima pq abaixo disso fica difícil de ver o peixe
        this.cor = `rgba(${Math.random() * 256}, ${Math.random() * 256},${Math.random() * 256}, ${Math.max(Math.random(), 0.4)})`;
        this.ativo = true;
    }

    mover() {
        this.x += this.vx * fatorVelocidade;
        this.y += this.vy * fatorVelocidade;

        // if(this.x + this.raio > 1.0 || this.x - this.raio < -1.0) this.vx *= -1;
        // if(this.y + this.raio > 1.0 || this.y - this.raio < -0.7) this.vy *= -1; 

        // algumas bolhas estão ficando presas nas bordas, então:
        if(this.x + this.raio > 1.0) {
            this.vx *=-1;
            this.x = 1.0 - this.raio;
        }
        if(this.x - this.raio < -1.0) {
            this.vx *=-1;
            this.x = -1.0 + this.raio;
        }
        if(this.y + this.raio > 1.0) {
            this.vy *=-1;
            this.y = 1.0 - this.raio;
        }
        if(this.y - this.raio < -0.7) {
            this.vy *=-1;
            this.y = -0.7 + this.raio;
        }
    }

    desenhar(ctx, canvas) {
        ctx.fillStyle = this.cor;
        ctx.beginPath();
        
        for (let i = 0; i <= this.lados; i++) {
            let angulo = (i * 2 * Math.PI) / this.lados;
            let nx = this.x + this.raio * Math.cos(angulo);
            let ny = this.y + this.raio * Math.sin(angulo);
            let px = (nx + 1) * canvas.width / 2;
            let py = (1 - ny) * canvas.height / 2;
            
            ctx.lineTo(px, py);
        }
        ctx.fill();
    }
}

class Bolha {
    constructor(x){
        this.x = x; // Usa a posição do arpão no momento de lançar a bolha
        this.y = AREIA_Y; // posição inicial é fixa (não necessariamente AREIA_Y)
        this.vx = 0; // velocidade horizontal da bolha fixa tbm (x é ezro pq ela só vai pra cima)
        this.vy = 0.02;
        // this.cor = "black"; // não precisa de cor pq todas são black
        this.ativa = true;
    }

    mover() {
        // this.x += this.x; // na vdd nem precisa atualizar
        this.y += this.vy * fatorVelocidade; // atualiza com base na velocidade do slider
        if(this.y > 1.0) this.ativa = false; 
    }

    // A parte do desenhar() está direto dentro do atualizar() pq lá já cuido das colisões com os peixes
}

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    desenhar();
}

function desenhaFinal(){
    console.log("Fim de jogo!");
    pausado=true; 
    pauseBtn.disabled = true; 
    ctx.fillStyle = "black";
    ctx.font = "50px serif"; // Fonte totalmente aleatória
    ctx.translate(canvas.width/2, canvas.height/2);
    ctx.fillText("Fim de Jogo!", -50, -50); // aqui o texto não está normalizado
    if(confirm("Fim de Jogo! Gostaria de jogar novamente?")) window.location.reload();
}

function atualizar() {
    if(peixesMortos==QTD_PEIXES){
        desenhaFinal();
        return;
    }
    if(!pausado) {
        moverElementos();
    }
    desenhar();
    requestAnimationFrame(atualizar);
}

function moverElementos(){
    peixes.forEach((peixe) => {
        if(peixe.ativo) peixe.mover();
    });
    // Usando .filter() pq só percorrer as ativas tava lagando conforme se criavam muitas bolhas inativas.
    bolhas = bolhas.filter(b => {
        if(b.y > 1.0) return false;
        
        b.mover();
        peixes.forEach((p) => {
            if(p.ativo && checkColision(p, b)){
                p.ativo = false;
                b.ativa = false;
                peixesMortos+=1;
            }
        });
        return b.ativa; 
    });
}

function checkColision(peixe, bolha) {
    let dx = peixe.x - bolha.x;
    let dy = peixe.y - bolha.y;
    let distSq = dx * dx + dy * dy;
    let raiosSq = (peixe.raio + (TAM_BOLHA/2)) ** 2; 

    return distSq < raiosSq;
}

function desenhar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //Mar
    ctx.fillStyle = "lightblue";
    ctx.fillRect(0, 0, canvas.width, canvas.height * 0.85);

    //Areia
    ctx.fillStyle = "yellow";
    ctx.fillRect(0, canvas.height * 0.85, canvas.width, canvas.height * 0.15);

    //Peixes
    peixes.forEach(peixe => {
        if (peixe.ativo) {
            peixe.desenhar(ctx, canvas);
        }
    });

    //Bolhas
    ctx.fillStyle = "black" // todas as bolhas são pretas 
    bolhas.forEach(bolha => {
        if (!bolha.ativa) return;

        let pxCentro = (bolha.x + 1) * canvas.width / 2;
        let pyCentro = (1 - bolha.y) * canvas.height / 2;
        let tamPixel = TAM_BOLHA * (canvas.width / 2);
        let xCanto = pxCentro - (tamPixel / 2);
        let yCanto = pyCentro - (tamPixel / 2);
    
        ctx.fillRect(xCanto, yCanto, tamPixel, tamPixel);
    });

    desenharArpao(arpaoX); 
}

function desenharArpao(x) {
    ctx.fillStyle = "green";
    ctx.beginPath();
    
    let tx = (x + 1) * canvas.width / 2;
    let ty = 1.8 * canvas.height / 2; // 1.8 aqui como magic-number mesmo, mas apenas pro arpao nao encostar na areia.
    
    ctx.moveTo(tx, ty);
    ctx.lineTo(tx - (0.01*canvas.width) , ty + (0.07 * canvas.height));
    ctx.lineTo(tx + (0.01*canvas.width), ty + (0.07*canvas.height));
    ctx.closePath();
    ctx.fill();
}

    // Event Listeners

window.onresize = resize;
window.onload = atualizar;
pauseBtn.value = "Pausar"
resize();

pauseBtn.addEventListener("click", (e)=>{
    console.log(pauseBtn.value);
    // console.log(e.target); // Obs: é literalmente a mesma coisa aff
    pausado=!pausado;
    if(pausado){
        passoBtn.disabled=false;
        pauseBtn.value = "Jogar";
    } else {
        passoBtn.disabled=true;
        pauseBtn.value = "Pause";
    }
});

velBtn.addEventListener("input", (e) => {
    console.log(`Novo fator de velocidade: ${velBtn.value/3}`);
    fatorVelocidade = e.target.value/3; // Aqui eu botei /2 pq a velocidade máxima tava MUITO rapido.
})

passoBtn.addEventListener("click", () => {
    console.log("Atualizando posições via Botão Passo");
    moverElementos();
    desenhar();
});

window.addEventListener("keydown", (e) => {
    switch(e.key.toLowerCase()) {
        case 'a':
            arpaoX = Math.max(-1.0, arpaoX - VEL_ARPAO);
            break;
        case 'd':
            arpaoX = Math.min(1.0, arpaoX + VEL_ARPAO);
            break;
        case 's':
            if (!pausado) { 
                let novaBolha = new Bolha(arpaoX);
                novaBolha.y = AREIA_Y;
                bolhas.push(novaBolha);
                console.log("Nova bolha!", novaBolha);
            }
            break;
    }
});

    // Inicialização 
passoBtn.disabled=true;

for (let i=0; i<QTD_PEIXES; i++) {
    peixes.push(new Peixe());
}
