# Playwright - qa-junior-playwright-api
Automação de testes API utilizando Playwright com TypeScript

## Requisitos do sitema
* Precisará do Node.js instalado, versão mais recente: latest 20.x, 22.x or 24.x.
* Versões do Windows recomendadas: Windows 11+, Windows Server 2019+ ou Subsistema Windows para Linux (WSL).
* Versões do macOS recomendadas: macOS 14 (Ventura) ou posterior.
* Versões do Linux recomendadas: Debian 12/13, Ubuntu 22.04/24.04 (x86-64 ou arm64).

### Para realizar a instalação do Playwright, execute a linha abaixo:
```npm init playwright@latest```
OBS.: Para utilizar npm é necessário a instalação do Node.js antes

Como os testes estão em *typescript*, sugiro escolher *typescript* assim que for perguntado no terminal, após executar o comando acima 
Isso criará alguns arquivos de configuração, exemplos, um fluxo de trabalho de ação do GitHub e um primeiro teste example.spec.ts. 

### Para instalar/atualizar as depêndencias, execute a linha de comando abaixo:
```npm i -D @playwright/test```

### Para executar os testes da suite completa:
```npx playwright test```

### Para executar os testes de uma suite específica por exemplo:
```npx playwright test tests\api\users.spec.ts```

### Para mostrar o report dos testes, execute a linha de comando abaixo:
```npx playwright show-report```

### Como o a variável de token está configurada para executar via código, não é necessário passar o mesmo como parâmetro na linha de comando para executar os testes
