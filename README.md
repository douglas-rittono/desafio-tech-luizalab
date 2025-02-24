# desafio-tech-luizalab

## Descrição

Este projeto é uma API para o desafio técnico da LuizaLabs.

A persistência dos dados está sendo feita em um banco de dados MongoDB para melhor organização dos dados e performance.

O OrderID foi considerado único para o desenvolvimento.

## Pré-requisitos

- Node.js
- Docker
- Docker Compose

## Instalação

1. Clone o repositório:
    ```sh
    git clone <URL_DO_REPOSITORIO>
    cd desafio-tech-luizalab
    ```

2. Instale as dependências:
    ```sh
    make install
    ```

## Executando a Aplicação

### Localmente

1. Inicie as dependências:
    ```sh
    make start-dependencies
    ```

2. Inicie a aplicação:
    ```sh
    make run-local
    ```
Atenção o run-local está com comandos para Windows, caso esteja utilizando outro SO, validar as mudanças necessárias.

A aplicação estará disponível em `http://localhost:3000`.

### Usando Docker

1. Construa a imagem Docker:
    ```sh
    make build
    ```

2. Inicie a aplicação:
    ```sh
    make run
    ```

A aplicação estará disponível em `http://localhost:3000`.

### Documentação da API

A documentação da API, gerada pelo Swagger, estará disponível em `http://localhost:3000/api-docs`.

## Testes

Para rodar os testes, execute:
```sh
make test-local
```
Atenção o run-local está com comandos para Windows, caso esteja utilizando outro SO, validar as mudanças necessárias.