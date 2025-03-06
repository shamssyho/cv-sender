# Utiliser une image Node.js
FROM node:18

# Définir le dossier de travail
WORKDIR /usr/src/app

# Copier les fichiers package.json et installer les dépendances
COPY package*.json ./
RUN npm install

# Copier le reste du projet
COPY . .

# Exposer le port utilisé par NestJS
EXPOSE 3000

# Lancer l'application
CMD ["npm", "run", "start:dev"]