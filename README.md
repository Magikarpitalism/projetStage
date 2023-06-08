## Instalation 

1. importe nvm dpuis git
```shell
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
```

2. rentrez la commande suivante
```shell
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
```

3. installer node 14
```shell
nvm install 14
```

4. utiliser node 14
```shell
nvm use 14
```

5. installer les dépendances via yarn
```shell
yarn install
```

6. lancez le serveur en local
```shell
yarn serve
```

7. lancer le proxy du dossier proxy-server dans un autre terminal
```shell
node index.js
```
