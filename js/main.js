const spinner = document.getElementById("spinner");
const dialogebox = document.getElementById("found-dialoge-box");
const passwordForm = document.getElementById("password-form");
const passwordBtn = document.getElementById("password-submit-btn");
const progressBar = document.getElementById("progress-bar");
let tempo1 = Date.now();
let totaltime = 0;

const alfabeto = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%&*()1234567890"
const indices = {}
for (let i = 0; i < alfabeto.length; i++) {
    indices[alfabeto[i]] = i
}

const worker = new Worker('worker.js')
let msgCount = 0;
worker.onmessage = (e) => {
    const { tipo, tentativa, count, totalTentativas } = e.data
   
    if (tipo === 'progress') {
        msgCount++;
        if(msgCount%10 === 0){
            const pct = (100*count/totalTentativas).toFixed(1);
            progressBar.value = parseInt(pct);
        }
        
    } else if (tipo === 'found') {
        const totaltime = Date.now() - tempo1
        spinner.classList.add("hidden")
        dialogebox.classList.remove("hidden")
        const p = document.createElement("p")
        p.innerText = `Sua senha foi quebrada em ${totaltime} milissegundos`
        dialogebox.appendChild(p);
        
    }
}

passwordBtn.addEventListener("click", (e) => {
    e.preventDefault();
    tempo1 = Date.now();
    dialogebox.innerHTML = "";
    dialogebox.classList.add("hidden");
    const password = passwordForm.querySelector("#senha").value;
    spinner.classList.remove("hidden");
    
    if(password){
        worker.postMessage({ password, totalTentativas: posicaoNaSequencia(password, alfabeto) });
    }
});
function posicaoNaSequencia(senha, alfabeto) {
    let pos = 0
    for (let i = 0; i < senha.length; i++) {
        pos = pos * alfabeto.length + ((indices[senha[i]]) + 1)
    }
    return pos
}
