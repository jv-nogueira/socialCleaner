let running = false;
let arrayArmazenarNameAndUsername = [];
document.addEventListener("keydown", function(event) {
    if (event.keyCode === 113) {
        if (running) {
            running = false;
            // Gera o arquivo ao pressionar F2 novamente
            setTimeout(gerarArquivo,1000);
        } else {
            running = true;
            iniciarBot();
        }
    }
})
function iniciarBot(){
    fetch(chrome.runtime.getURL('usernames.txt'))
    .then(response => response.text())
    .then(permitidosUsername => {
        var standardMessage = "\n\nSupport: jvnogueira2010@gmail.com";
        if(document.location.href.includes('followers')||document.location.href.includes('following')){
            if(document.location.href.includes('followers')){
                var promptUnfollow = 'remover dos seguidores' 
            }else if(document.location.href.includes('following')){
                var promptUnfollow = 'deixar de seguir (unfollow)' 
            };
            var question = prompt("Digite no campo abaixo a quantidade de pessoas que o bot vai "+promptUnfollow+":*"+
            standardMessage)  
        }else{alert("Para funcionar, precisa entrar no Instagram e clicar nos seguidores ou seguindo")};
        
        if(question > 0){
            var questionTemp = prompt("Digite no campo abaixo quantos segundos quer que dure cada ciclo de intervalo de tempo para o unfollow. Lembrando que quanto maior o intervalo de tempo, mais seguidores o bot vai "+promptUnfollow+" sem ser impedido pelo instagram."+
            standardMessage)
            if(!isNaN(questionTemp) && questionTemp > 10){
                // Pega a resposta do prompt e divide
                var answerTemp = questionTemp/2
                var i=0
                var contadorUnfollow=0
                percorrer()
                function percorrer(){
                    if (!running) return;
                    // Referenciar cada perfil da lista
                    var profileReference = [...document.querySelectorAll("span")].find(il => il.textContent.includes("Pesquisar")).parentElement.parentElement.parentElement.parentElement.parentElement.children[2].children[0].children[0].children[i] 
                    if(i>0){
                        // Rola a página para que o elemento fique vísivel 
                        var viewProfile = [...document.querySelectorAll("span")].find(il => il.textContent.includes("Pesquisar")).parentElement.parentElement.parentElement.parentElement.parentElement.children[2].children[0].children[0].children[i-1].scrollIntoView() 
                    };
                    // Referencia o last index da lista de perfis
                    var lastIndex = [...document.querySelectorAll("span")].find(il => il.textContent.includes("Pesquisar")).parentElement.parentElement.parentElement.parentElement.parentElement.children[2].children[0].children[0].children.length -1 
                    // Visualiza o last element do index da lista de perfis
                    var lastElementIndex = [...document.querySelectorAll("span")].find(il => il.textContent.includes("Pesquisar")).parentElement.parentElement.parentElement.parentElement.parentElement.children[2].children[0].children[0].children[lastIndex] 
                    var getUsernameOrName = profileReference.children[0].children[0].children[0].children[1].children[0].children[0]
                    // Pegar o nome da lista
                    var getName = getUsernameOrName.children[1].children[0].innerText 
                    // Pegar o username da lista
                    var getUsername = getUsernameOrName.children[0].children[0].children[0].children[0].children[0].children[0].children[0].children[0].innerHTML 
                    var getUsernameAndName = {getName, getUsername}
                    var limiteContador = question;
                    // Botão para deixar de seguir
                    var buttonUnfollow = profileReference.children[0].children[0].children[0].children[2].children[0].children[0]  
                        if(!permitidosUsername.includes(getUsername)){
                            viewProfile 
                            // Limite de usernames que o bot vai deixar de seguir
                            if(contadorUnfollow < limiteContador){ 
                                arrayArmazenarNameAndUsername.push(getUsernameAndName)
                                setTimeout(() => {
                                    buttonUnfollow.click()
                                    setTimeout(() => {
                                        [...document.querySelectorAll('button')].find(el => el.textContent == 'Remover'||el.textContent == 'Deixar de seguir').click()
                                        contadorUnfollow++
                                        i++
                                        percorrer
                                    },getRandomSeconds(answerTemp))
                                },getRandomSeconds(answerTemp))
                            }else{
                                // Gera o arquivo ao chegar ao limite definido
                                setTimeout(gerarArquivo,getRandomSeconds(1))
                            };
                        }else if(i < lastIndex){
                            i++
                            percorrer()
                        }else{
                            setTimeout(() => {
                                lastElementIndex.scrollIntoView()
                                setTimeout(() => {
                                    percorrer()
                                },getRandomSeconds(1))
                            },getRandomSeconds(1))
                        }
                }
            }else if(questionTemp <= 10){
                alert('Digite um número acima de 10!'+
                standardMessage)
            }else if(typeof questionTemp == 'string'){
                alert('Digite apenas números!'+
                standardMessage)
            }; 
            }else if(typeof question == 'string' && question != 0){
                alert('Digite apenas números!'+
                standardMessage)
            }else if(question == 0){
                alert('Digite um número acima de 0!'+
                standardMessage)
            }; 
    });
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

function getRandomSeconds(){
    // Multiplica um random number 
    let sec222 = Math.random() * 4; 
    // Diminui para 3 casas decimais, converte de string para number e multiplica por 1000 que corresponde a 1 segundo
    sec222 =  parseFloat(sec222.toFixed(3))*1000; 
    // retorna o resultado aleatorio em segundos 
    return sec222; 
};