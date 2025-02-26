let arrayArmazenarNameAndUsername = [];
let i=0
document.addEventListener("keydown", function(event) {
    if (event.keyCode === 113) {
        console.log("F2 foi clicado!")
        iniciarBot();
    }
})

function iniciarBot(){
    try{
        // Referenciar cada perfil da lista
        var profileReference = [...document.querySelectorAll("span")].find(il => il.textContent.includes("Pesquisar")).parentElement.parentElement.parentElement.parentElement.parentElement.children[2].children[0].children[0].children
        var getUsernameOrName = profileReference[i].children[0].children[0].children[0].children[1].children[0].children[0]
        // Pegar o nome da lista
        var getName = getUsernameOrName.children[1].children[0].innerText 
        // Pegar o username da lista
        var getUsername = getUsernameOrName.children[0].children[0].children[0].children[0].children[0].children[0].children[0].children[0].innerHTML 
        var getUsernameAndName = {getName, getUsername}

        if(i < profileReference.length-4){
            arrayArmazenarNameAndUsername.push(getUsernameAndName)
            i++
            // Menor delay
            setTimeout(iniciarBot,100)
        }else{
            arrayArmazenarNameAndUsername.push(getUsernameAndName)
            i++
            profileReference[i].scrollIntoView()
            // Maior delay
            setTimeout(iniciarBot,2000)
        }
    }catch {
        playSound();          
        gerarArquivo();
    }
    
}

function playSound(){
    const audio = new Audio(chrome.runtime.getURL("notification.mp3"));
    audio.play().catch(err => console.error("Erro ao tocar o som:", err));
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

