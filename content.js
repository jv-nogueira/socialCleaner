let running = false;
let arrayArmazenarNameAndUsername = [];
let i=0
let contadorUnfollow=0
let limiteContador=0
let answerTemp=0
document.addEventListener("keydown", function(event) {
    if (event.keyCode === 113) {
        if (running) {
            running = false;
            // Gera o arquivo por pressionar F2 novamente
            setTimeout(gerarArquivo,1000);
        } else {
            running = true;
            iniciarBot();
        }
    }
})
function iniciarBot(){
    var standardMessage = "\n\nSupport: jvnogueira2010@gmail.com";
    if(document.location.href.includes('followers')||document.location.href.includes('following')){
        var question = prompt("Digite no campo abaixo a quantidade de pessoas:*"+
        standardMessage)  
    }else{
        alert("Precisa clicar nos seguidores ou seguindo do instagram")
    };
    if(question > 0){
        var questionTemp = prompt("Digite no campo abaixo quantos segundos quer que dure cada ciclo:*"+
        standardMessage)
        if(!isNaN(questionTemp) && questionTemp > 9){
            limiteContador=question
            answerTemp=questionTemp/2
            percorrer()
        }else if(questionTemp < 10 && questionTemp != null){
            alert('Digite um número igual ou maior a 10!'+
            standardMessage)
            running = false;
        }else if(typeof questionTemp == 'string' && questionTemp != null){
            alert('Digite apenas números!'+
            standardMessage)
            running = false;
        }else{
            running = false;
        }; 
    }else if(typeof question == 'string' && question != 0){
        alert('Digite apenas números!'+
        standardMessage)
        running = false;
    }else if(question == 0){
        alert('Digite um número acima de 0!'+
        standardMessage)
        running = false;
    }else{
        running = false;
    }; 
}

function percorrer(){
    try{
        if (!running) return;

        // Referenciar cada perfil da lista
        var profileReference = [...document.querySelectorAll("span")].find(il => il.textContent.includes("Pesquisar"))
        .parentElement.parentElement.parentElement.parentElement.parentElement
        .children[2].children[0].children[0].children

        var getUsernameOrName = profileReference[i].children[0].children[0].children[0].children[1].children[0].children[0]
        // Pegar o nome da lista
        var getName = getUsernameOrName.children[1].children[0].innerText 
        // Pegar o username da lista
        var getUsername = getUsernameOrName.children[0].children[0].children[0].children[0].children[0].children[0].children[0].children[0].innerHTML 
        var getUsernameAndName = {getName, getUsername}
        // Botão para deixar de seguir
        var buttonUnfollow = profileReference[i].children[0].children[0].children[0].children[2].children[0].children[0]  

        fetch(chrome.runtime.getURL('usernames.txt'))
        .then(response => response.text())
        .then(permitidosUsername => {
            if(!permitidosUsername.includes(getUsername)){
                // Limite de usernames que o bot vai deixar de seguir
                if(contadorUnfollow < limiteContador){ 
                        arrayArmazenarNameAndUsername.push(getUsernameAndName)
                        setTimeout(() => {
                            buttonUnfollow.click()
                            setTimeout(() => {
                                [...document.querySelectorAll('button')].find(el => el.textContent == 'Remover'||el.textContent == 'Deixar de seguir').click()
                                contadorUnfollow++
                                i++
                                setTimeout(() => delay(profileReference, i),getRandomSeconds(1))
                            },getRandomSeconds(answerTemp))
                        },getRandomSeconds(answerTemp))
                }else{
                    // Gera o arquivo ao chegar ao limite definido
                    setTimeout(gerarArquivo,getRandomSeconds(1))
                };
            }else{
                i++
                delay(profileReference, i)
            }
        
        });
    }catch{            
        // Gera o arquivo em qualquer erro
        setTimeout(gerarArquivo,getRandomSeconds(1))
        running = false;
    }
}

// Garante a barra de rolagem
function delay(profileReference, i) {
    if (i >= profileReference.length - 4) {
        profileReference[i].scrollIntoView()
        setTimeout(percorrer, getRandomSeconds(2));
    }else if(i > 0){
        profileReference[i-1].scrollIntoView()
        setTimeout(percorrer, 100);
    }else{
        setTimeout(percorrer, 100);
    }
}

function gerarArquivo(){
    // Criar o conteúdo do CSV
    var csvContent = "\uFEFFNome\tUsername\n";
    arrayArmazenarNameAndUsername.forEach(function (item) {
    csvContent += item.getName + "\t" + item.getUsername + "\n";
    });
    // Criar um Blob com o conteúdo do CSV
    var blob = new Blob([csvContent], { type: "text/txt" });
    // Criar um link para o Blob
    var link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    // Definir o nome do arquivo
    link.download = "unfollowList.txt";
    // Adicionar o link à página e clicar automaticamente para iniciar o download
    document.body.appendChild(link);
    link.click();
    // Remover o link da página
    document.body.removeChild(link);
}

function getRandomSeconds(sum){
    // Multiplica um random number 
    let sec222 = Math.random() * 4 + sum; 
    // Diminui para 3 casas decimais, converte de string para number e multiplica por 1000 que corresponde a 1 segundo
    sec222 =  parseFloat(sec222.toFixed(3))*1000; 
    // retorna o resultado aleatorio em segundos 
    return sec222; 
};