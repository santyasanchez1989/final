FROM node

WORKDIR /app


COPY package.json .


RUN npm install
 
# Importante!! Para que no tire errores.
RUN npm install bcryptjs

COPY . .

EXPOSE 8080

CMD ["npm", "start"]

# docker build -t final . 
# docker run -p 8080:8080 final