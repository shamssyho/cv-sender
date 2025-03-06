# Utiliser une image Node.js
FROM node:18

# Définir le dossier de travail
WORKDIR /usr/src/app

# Copier les fichiers package.json et installer les dépendances
COPY package*.json ./
RUN npm install

# Copier le reste du projet
COPY . .

# Exposer le port utilisé par React
EXPOSE 5173

# Lancer l'application
CMD ["npm", "start"]