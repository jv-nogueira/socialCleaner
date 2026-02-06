document.getElementById("executar").addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  // Esconde o botão
  window.close();


  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: extrairDados
  });
});

function extrairDados() {
    const arrayArmazenarNameAndUsername = [];
    let i = 0;

    const gerarArquivo = () => {
        let csvContent = "\uFEFFImagem\tNome\tUsername\n";
        arrayArmazenarNameAndUsername.forEach(item => {
            csvContent += item.getImage + "\t" + item.getName + "\t" + item.getUsername + "\n";
        });
        const blob = new Blob([csvContent], { type: "text/txt" });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = "unfollowList.txt";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const extrair = () => {
        try {
            const profileReference = [...document.querySelectorAll("span")]
                .find(el => el.textContent.includes("Pesquisar"))
                .parentElement.parentElement.parentElement.parentElement.parentElement
                .children[2].children[0].children[0].children;

            const getUsernameOrName = profileReference[i].children[0].children[0].children[0].children[1].children[0].children[0];
            const getImage = profileReference[i].querySelector("img").src;
            const getName = getUsernameOrName.children[1].children[0].innerText;
            const getUsername = getUsernameOrName.children[0].children[0].children[0].children[0].children[0].children[0].children[0].children[0].innerHTML;

            arrayArmazenarNameAndUsername.push({ getImage, getName, getUsername });

            if (i < profileReference.length - 4) {
                i++;
                setTimeout(extrair, 100);
            } else {
                i++;
                if (profileReference[i]) profileReference[i].scrollIntoView();
                setTimeout(extrair, 2000);
            }
        } catch {
            gerarArquivo();
        }
    };

    extrair();
}
