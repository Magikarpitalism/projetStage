## Instalation 

1. Cloner le repository dans un dossier:
```shell
git clone https://github.com/Magikarpitalism/projetStage
```

## Dans votre IDE

2. Ouvrez le terminal de votre IDE et diriger vous dans le dossier proxy-server:
```shell
cd proxy-server
```

3. lancer le proxy du dossier proxy-server
```shell
node index.js
```

4. Ouvrez un autre terminal et diriger vous ensuite dans le dossier vue-template:
```shell
cd vue-template
```

5. importe nvm dpuis git
```shell
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
```

6. rentrez la commande suivante
```shell
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
```

7. installer node 14
```shell
nvm install 14
```

8. utiliser node 14
```shell
nvm use 14
```

9. installer les dépendances via yarn
```shell
yarn install
```

10. lancez le serveur en local
```shell
yarn serve
```

## lancement subsequent

A chaque fois que vous relancerez le projet, répétez les étapes 2 à 6, 8 et 10.