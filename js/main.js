const spinner = document.getElementById("spinner");
const dialogebox = document.getElementById("found-dialoge-box");
const passwordForm = document.getElementById("password-form");
const passwordBtn = document.getElementById("password-submit-btn");
const alfabeto = {
    'a': 0, 'b': 1,  'c': 2,
    'd': 3, 'e': 4,  'f': 5,
    'g': 6, 'h': 7,  'i': 8,
    'j': 9, 'k': 10, 'l': 11,
    'm': 12,'n': 13, 'o': 14,
    'p': 15,'q': 16, 'r': 17,
    's': 18,'t': 19, 'u': 20,
    'v': 21,'w': 22, 'x': 23,
    'y': 24,'z': 25,
}
let tempo1 = Date.now();
let totaltime = 0;
const alfabetoKeys = Object.keys(alfabeto);
passwordBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    let canBreak = true;
    dialogebox.classList.add("hidden");
    passwordBtn.disabled = true;
    const password = passwordForm.querySelector("#senha").value;
    for(let i = 0; i < password.length && canBreak; i++){
        if(!alfabeto[password[i]] && alfabeto[password[i] !== 0]) {
            console.log(alfabeto[password[i]])
            canBreak = false;
        }
    }
    if(!canBreak){
        alert("A senha deve conter apenas letras minusculas");
    }
    if(password && canBreak) {
        tempo1 = Date.now();
        spinner.classList.remove("hidden")
        await breakPassword(password, alfabeto);
        totaltime = Date.now() - tempo1;
        spinner.classList.add("hidden");
        dialogebox.innerHTML = "";
        const pElement = document.createElement("p");
        pElement.innerText = `Senha quebrada em ${totaltime} milissegundos`;
        dialogebox.appendChild(pElement);
        dialogebox.classList.remove("hidden");
    }
    passwordBtn.disabled = false;
});
function breakPassword(password){
    return new Promise((resolve) => {
        step(password, "a", resolve);
    })
}
function step(password, tentativa, resolve) {
    if(tentativa === password){
        resolve(tentativa);
        return tentativa
    }
    setTimeout(() => {
        for(let n  = 0; n < 1_000_000; n++) {
            tentativa = increment(tentativa, alfabeto);
            if(tentativa === password){
                
                resolve(tentativa);
                return tentativa
            }
        }
        step(password, tentativa, resolve);
    }, 0);
}
function increment(string, alfabeto) {
    let chars = string.split('');
    let i = chars.length - 1;
    while(i>=0){
        const index = alfabeto[chars[i]];
        if(index < alfabetoKeys.length - 1){
            chars[i] = alfabetoKeys[index+1];
            return chars.join("");
        }
        chars[i] = alfabetoKeys[0];
        i--;
    }
    return "a".repeat(string.length + 1);
}