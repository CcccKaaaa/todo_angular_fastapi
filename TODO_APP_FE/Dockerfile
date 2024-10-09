FROM node:18

RUN npm install -g @angular/cli
RUN npm install @ng-bootstrap/ng-bootstrap bootstrap


WORKDIR /TODO_APP_FE

COPY package.json .

RUN npm install

COPY . .

EXPOSE 4200

CMD ng serve --host 0.0.0.0
