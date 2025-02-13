document.addEventListener("keydown", function(event) {
    fetch(chrome.runtime.getURL('usernames.txt'))
    .then(response => response.text())
    .then(permitidosUsername => {
    var standardMessage = "\n\nSupport: jvnogueira2010@gmail.com";
    if(document.location.href.includes('followers')||document.location.href.includes('following')){
        if (event.keyCode === 113) {
            if(document.location.href.includes('followers')){
                var promptUnfollow = 'remover dos seguidores' 
            }else if(document.location.href.includes('following')){
                var promptUnfollow = 'deixar de seguir (unfollow)' 
            };
            var question = prompt("Digite no campo abaixo a quantidade de pessoas que o bot vai "+promptUnfollow+":*"+
            standardMessage)
        }
    };
    if(question > 0){
        var questionTemp = prompt("Digite no campo abaixo quantos segundos quer que dure cada ciclo de intervalo de tempo para o unfollow. Lembrando que quanto maior o intervalo de tempo, mais seguidores o bot vai "+promptUnfollow+" sem ser impedido pelo instagram."+
        standardMessage)
        if(!isNaN(questionTemp) && questionTemp > 10){
            var answerTemp = questionTemp/2 // Pega a resposta do prompt e divide por 2 para dividir igualmente os segundos entre os intervalos
            var i=0
            var contadorUnfollow=0
            var arrayArmazenarNameAndUsername = [];
            percorrer()
            function percorrer(){
                var profileReference = [...document.querySelectorAll("span")].find(il => il.textContent.includes("Pesquisar")).parentElement.parentElement.parentElement.parentElement.parentElement.children[2].children[0].children[0].children[i] // Referenciar cada perfil da lista
                if(i>0){
                    var viewProfile = [...document.querySelectorAll("span")].find(il => il.textContent.includes("Pesquisar")).parentElement.parentElement.parentElement.parentElement.parentElement.children[2].children[0].children[0].children[i-1].scrollIntoView() // Rola a página para que o elemento fique vísivel 
                };
                var lastIndex = [...document.querySelectorAll("span")].find(il => il.textContent.includes("Pesquisar")).parentElement.parentElement.parentElement.parentElement.parentElement.children[2].children[0].children[0].children.length -1 // Referencia o last index da lista de perfis
                var lastElementIndex = [...document.querySelectorAll("span")].find(il => il.textContent.includes("Pesquisar")).parentElement.parentElement.parentElement.parentElement.parentElement.children[2].children[0].children[0].children[lastIndex] // Visualiza o last element do index da lista de perfis
                var getUsernameOrName = profileReference.children[0].children[0].children[0].children[1].children[0].children[0]
                var getName = getUsernameOrName.children[1].children[0].innerText // Pegar o nome da lista
                var getUsername = getUsernameOrName.children[0].children[0].children[0].children[0].children[0].children[0].children[0].children[0].innerHTML // Pegar o username da lista
                var getUsernameAndName = {getName, getUsername}
                var limiteContador = question;
                var buttonUnfollow = profileReference.children[0].children[0].children[0].children[2].children[0].children[0] // Botão para deixar de seguir 
                    if(!permitidosUsername.includes(getUsername)){
                            viewProfile 
                        if(contadorUnfollow < limiteContador){ // Limite de usernames que o bot vai deixar de seguir
                            arrayArmazenarNameAndUsername.push(getUsernameAndName)
                            setTimeout(() => {
                                buttonUnfollow.click()
                                setTimeout(() => {
                                    if(document.location.href.includes('followers')){
                                        var buttonFollowingOrFollowers = 'Remover' // As duas opções são: 'Remover' ou 'Cancelar'
                                    }else if(document.location.href.includes('following')){
                                        var buttonFollowingOrFollowers = 'Deixar de seguir' // As duas opções são: 'Deixar de seguir' ou 'Cancelar'
                                    };
                                    [...document.querySelectorAll('button')].find(el => el.textContent == buttonFollowingOrFollowers).click()
                                    contadorUnfollow++
                                    i++
                                    percorrer()
                                },getRandomSeconds(answerTemp))
                            },getRandomSeconds(answerTemp))
                        }else{
                            setTimeout(() => {
                            var removeWhiteSpace = limiteContador.replace(/\s/g, '')
                            var singular = "" 
                            var plural = ""
                            if(limiteContador > 1){
                                plural = "s"
                            }else{
                                singular = ""
                            };
                            if(document.location.href.includes('followers')){
                                var phraseUnfollow = "removeu dos seguidores"
                            }else if(document.location.href.includes('following')){
                                var phraseUnfollow = "deixou de seguir"
                            }
                            var questionFinal = confirm("Chegou ao limite de "+removeWhiteSpace+" pessoa"+singular+plural+" que o bot "+phraseUnfollow+"!\n\n"+
                            "Deseja a lista com as pessoas que o bot "+phraseUnfollow+"? Se sim, clique em 'Ok' ou aperte 'Enter' para o download do arquivo 'unfollowList.txt'"+
                            standardMessage)
                            if(questionFinal == true){
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
                            },getRandomSeconds(answerTemp))
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

function getRandomSeconds(sum){
    let sec222 = Math.random() * 4 + sum; // Multiplica um random number e soma 
    sec222 =  parseFloat(sec222.toFixed(3))*1000; // Diminui para 3 casas decimais, converte de string para number e multiplica por 1000 que corresponde a 1 segundo
    return sec222; // retorna o resultado aleatorio em segundos 
};
});
})