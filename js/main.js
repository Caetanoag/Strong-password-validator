const spinner = document.getElementById("spinner");
const dialogebox = document.getElementById("found-dialoge-box");
const passwordForm = document.getElementById("password-form");
const passwordBtn = document.getElementById("password-submit-btn");
let tempo1 = Date.now();
let totaltime = 0;

const worker = new Worker('worker.js')

worker.onmessage = (e) => {
    const totaltime = e.data
    spinner.classList.add("hidden")
    dialogebox.classList.remove("hidden");
    const p = document.createElement("p");
    p.innerText = `Sua senha foi quebrada em ${totaltime} milissegundos`;
    dialogebox.appendChild(p);
    console.log(totaltime)
}

passwordBtn.addEventListener("click", (e) => {
    e.preventDefault();
    dialogebox.innerHTML = "";
    dialogebox.classList.add("hidden");
    const password = passwordForm.querySelector("#senha").value;
    spinner.classList.remove("hidden");
    if(password){
        worker.postMessage(password);
    }
})