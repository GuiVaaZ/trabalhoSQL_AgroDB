# 🌱 AgroDB – Cadastro de Produtores Rurais e Vendas de Produtos Orgânicos

Este projeto foi desenvolvido como parte do trabalho acadêmico de modelagem de banco de dados.  
O objetivo é criar um sistema que conecte **produtores rurais** a **clientes**, permitindo o cadastro de produtos orgânicos e a realização de vendas de forma organizada e transparente.

---

## 🎯 Objetivos do Sistema

- **Cadastrar produtores rurais**, suas propriedades e certificações.
- **Cadastrar produtos orgânicos**, incluindo categoria, preço e estoque.
- **Cadastrar clientes** com seus dados pessoais e de contato.
- **Registrar pedidos**, que podem conter múltiplos produtos de diferentes produtores.
- **Gerenciar pagamentos e entregas** dos pedidos.
- **Permitir avaliações** de produtos e produtores após a compra.
- **Gerar relatórios** de vendas, estoque e movimentação.


---

## 🗄️ Scripts SQL

- **01_create_tables.sql**  
  Cria o banco de dados, todas as tabelas e os relacionamentos com chaves primárias e estrangeiras.

- **02_insert_data.sql**  
  Insere dados iniciais de exemplo (produtores, clientes, produtos, pedidos, etc.).

- **03_queries.sql**  
  Contém exemplos de consultas (SELECT), relatórios, e comandos de manipulação (UPDATE/DELETE).

- **agrodb_entrega_completa.sql**  
  Arquivo unificado contendo **todo o código em sequência**: criação, inserção e consultas.