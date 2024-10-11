# Project Name
Todo App with FastAPI and Angular

## Description
Todo App using SQLAlchemy for ORM & FastAPI for communication between application & network, Angular for front end.

## Installation

1. Create .env file
   Save a .env file in project's backend root directory with format
```bash
ENVIRONMENT=<Evironment_name>           # accept one of values `production` or `development`. Default is `development`
SERVER_INTERFACE=<Server_interface>     # Default is 127.0.0.1 for security (if you want to access server from other host, set to 0.0.0.0)


```sh
docker compose up -d
```

Access with http://localhost:4200

## Author

[Lương Minh Chương](mailto:chuong.luong@bnksolution.com)

