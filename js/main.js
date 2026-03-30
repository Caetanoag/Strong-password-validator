const spinner = document.getElementById("spinner");
const dialogebox = document.getElementById("found-dialoge-box");
const passwordForm = document.getElementById("password-form");
const passwordBtn = document.getElementById("password-submit-btn");
const progressBar = document.getElementById("progress-bar");
let totaltime = 0;
let milissegundosPorTentativa;

const alfabeto = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%&*()1234567890"
const indices = {}
for (let i = 0; i < alfabeto.length; i++) {
    indices[alfabeto[i]] = i
}

const worker = new Worker('worker.js')
let msgCount = 0;
worker.onmessage = (e) => {
    const { msPorTentativa, tipo, tentativa, count, totalTentativas } = e.data
    if (tipo === 'progress') {
        msgCount++;


        if(msgCount%10 === 0){
            const pct = (100*count/(totalTentativas));
            progressBar.value = pct;
        }
        
    } else if (tipo === 'found') {
        spinner.classList.add("hidden")
        dialogebox.classList.remove("hidden")
        const p = document.createElement("p")
        p.innerText = `Sua senha foi quebrada com sucesso`
        dialogebox.appendChild(p);
        
    } else if (tipo === 'benchmark'){
        milissegundosPorTentativa = msPorTentativa;
        passwordBtn.disabled = false;
    }
}

passwordBtn.addEventListener("click", (e) => {
    e.preventDefault();
    msgCount = 0;
    dialogebox.innerHTML = "";
    dialogebox.classList.add("hidden");
    const password = passwordForm.querySelector("#senha").value;
    
    
    if(password){
        
        const totalTentativas = posicaoNaSequencia(password);
        const nsPorTentativa = BigInt(Math.round(milissegundosPorTentativa * 1_000_000))
        const tempoTotal = nsPorTentativa * totalTentativas;
        const tempoQuebrar = converterMs(tempoTotal)
        progressBar.value = 0;
        spinner.classList.remove("hidden");
        spinner.querySelector("p").innerText = `Sua senha precisará de ${tempoQuebrar.anos} anos,
        ${tempoQuebrar.meses} meses, ${tempoQuebrar.semanas} semanas, ${tempoQuebrar.dias} dias
        ${tempoQuebrar.horas} horas, ${tempoQuebrar.minutos} minutos, ${tempoQuebrar.segundos} segundos
        e ${tempoQuebrar.ms} milissegundos para ser quebrada`;
        worker.postMessage({ password, totalTentativas: Number(totalTentativas) });
    }
});
function posicaoNaSequencia(senha) {
    let pos = 0n
    for (let i = 0; i < senha.length; i++) {
        pos = pos * 71n + BigInt(indices[senha[i]] + 1)
    }
    return pos
}

function converterMs(ns) {
    const NS_POR_ANO    = 1_000_000n * 1000n * 60n * 60n * 24n * 365n
    const NS_POR_MES    = 1_000_000n * 1000n * 60n * 60n * 24n * 30n
    const NS_POR_SEMANA = 1_000_000n * 1000n * 60n * 60n * 24n * 7n
    const NS_POR_DIA    = 1_000_000n * 1000n * 60n * 60n * 24n
    const NS_POR_HORA   = 1_000_000n * 1000n * 60n * 60n
    const NS_POR_MIN    = 1_000_000n * 1000n * 60n
    const NS_POR_SEG    = 1_000_000n * 1000n
    const NS_POR_MS     = 1_000_000n

    const anos     = ns / NS_POR_ANO;    ns %= NS_POR_ANO
    const meses    = ns / NS_POR_MES;    ns %= NS_POR_MES
    const semanas  = ns / NS_POR_SEMANA; ns %= NS_POR_SEMANA
    const dias     = ns / NS_POR_DIA;    ns %= NS_POR_DIA
    const horas    = ns / NS_POR_HORA;   ns %= NS_POR_HORA
    const minutos  = ns / NS_POR_MIN;    ns %= NS_POR_MIN
    const segundos = ns / NS_POR_SEG;    ns %= NS_POR_SEG
    const ms       = ns / NS_POR_MS;     ns %= NS_POR_MS

    return { anos, meses, semanas, dias, horas, minutos, segundos, ms }
}