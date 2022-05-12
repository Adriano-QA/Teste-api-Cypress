/// <reference types="cypress" />

const { faker } = require('@faker-js/faker');
import contrato from '../contracts/usuarios.contract'


describe('Testes da Funcionalidade Usuários', () => {

    it('Deve validar contrato de usuários', () => {
     cy.request('usuarios').then(response =>{
          return contrato.validateAsync(response.body)
          
      }).then(() => {
           cy.log("Contrato de usuário válido")
      })
    });

    it('Deve listar usuários cadastrados', () => {
         cy.request({
              method: 'GET',
              url: 'usuarios'
              
         }).then((response)=>{
          expect(response.status).to.equal(200)
          expect(response.body).to.have.property('quantidade')
          
         })
    });

    it('Deve cadastrar um usuário com sucesso', () => {
         let novoNome = faker.name.firstName() +" "+ faker.name.lastName();
         let novoEmail = faker.internet.email(novoNome);

         cy.cadastrarUsuario(novoNome, novoEmail, "teste", "true")
         .then((response)=>{
          expect(response.status).to.equal(201)
          expect(response.body.message).to.equal("Cadastro realizado com sucesso")
         })
    });

    it('Deve validar um usuário com email inválido', () => {
     cy.request({
          method: 'POST',    
          url:'usuarios',
          failOnStatusCode: false,
          body:{
               "nome": "Fulano Silva",
               "email": "fulanano$qa.com.br",
               "password": "teste",
               "administrador": "true"
             }
         }).then((response)=>{
          expect(response.status).to.equal(400)
          expect(response.body.email).to.equal("email deve ser um email válido")
         })
    });

    it('Deve editar um usuário previamente cadastrado', () => {
     let novoNome = faker.name.firstName() +" "+ faker.name.lastName();
     let novoEmail = faker.internet.email(novoNome);

     cy.cadastrarUsuario(novoNome, novoEmail, "teste", "true")
     .then((response)=>{
          let id = response.body._id
     
     cy.request({
          method: 'PUT',    
          url:`usuarios/${id}`,
          body:{
              "nome": novoNome+"Nome Editado",
              "email": novoEmail,
              "password": "teste",
              "administrador": "true"
            },
             failOnStatusCode: false
         })
     }).then((response) =>{
          expect(response.status).to.equal(200)
          expect(response.body.message).to.equal("Registro alterado com sucesso")
     })
    });

    it('Deve deletar um usuário previamente cadastrado', () => {
     let novoNome = faker.name.firstName() +" "+ faker.name.lastName();
     let novoEmail = faker.internet.email(novoNome);

     cy.cadastrarUsuario(novoNome, novoEmail, "teste", "true")
     .then((response)=>{
          let id = response.body._id

          cy.request({
               method: 'DELETE',    
               url:`usuarios/${id}`
          }).then((response) =>{
               expect(response.status).to.equal(200)
               expect(response.body.message).to.equal("Registro excluído com sucesso")
          })

    });
    })
});
