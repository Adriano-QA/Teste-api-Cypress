/// <reference types="cypress"/>

describe('Teste da funcionalidade produtos', () => {
    let token

    before(() => {
        cy.token('fulano@qa.com', 'teste').then(tkn => {token= tkn})
    })

    it('Listar produtos', () => {
        cy.request({
            method: 'GET',
            url: 'produtos'
        }).then((response) =>{
            expect(response.body.produtos[2].nome).to.equal('Produto EBAC Adriano 247')
            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('produtos')
            expect(response.duration).to.be.lessThan(15)
        })
    });

    it('Cadastrar produto', () => {
        let produto = `Produto EBAC Adriano ${Math.floor(Math.random() * 1000)}`

        cy.request({
            method:'POST',
            url: 'produtos',
            body: {
                "nome": produto,
                "preco": 47,
                "descricao": "Produto Novo",
                "quantidade": 31
              },
              headers: {authorization: token}
        }).then((response) => {
            expect(response.status).to.equal(201)
            expect(response.body.message).to.equal('Cadastro realizado com sucesso')
        })
        
    });

    it('Deve validar mensagem de erro ao cadastrar produto repetido', () => {
       cy.cadastrarProduto(token, 'Produto EBAC Adriano 222', 47, 'Descricao produto', 31)
        .then((response) => {
            expect(response.status).to.equal(400)
            expect(response.body.message).to.equal('Já existe produto com esse nome')
        })
    });

    it('Deve editar um produto ja cadastrado', () => {
        cy.request('produtos').then(response => {
            let id= response.body.produtos[3]._id
            cy.request({
                method:'PUT',
                url: `produtos/${id}`,
                headers: {authorization: token},
                failOnStatusCode: false,
                body: {
                    "nome": 'Produto editado Adriano',
                    "preco": 100,
                    "descricao": "Produto Editado",
                    "quantidade": 30
                  },
            }).then(response => {
                expect(response.body.message).to.equal('Registro alterado com sucesso')
            })
        })
    });

    
    it('Deve editar um produto cadastrado previamente', () => {
        let produto = `Produto EBAC Adriano ${Math.floor(Math.random() * 1000)}`
        cy.cadastrarProduto(token, produto, 47, 'Descricao produto', 31)
        .then(response => {
            let id= response.body._id
            cy.request({
                method:'PUT',
                url: `produtos/${id}`,
                headers: {authorization: token},
                body: {
                    "nome": produto,
                    "preco": 400,
                    "descricao": "Produto Editado",
                    "quantidade": 300
                  },
            }).then(response => {
                expect(response.body.message).to.equal('Registro alterado com sucesso')
            })
        })
    });

    it('Deve deletar um produto cadastrado previamente', () => {
        let produto = `Produto EBAC Adriano ${Math.floor(Math.random() * 1000)}`
        cy.cadastrarProduto(token, produto, 47, 'Descricao produto', 31)
        .then(response => {
            let id= response.body._id
            cy.request({
                method:'DELETE',
                url: `produtos/${id}`,
                headers: {authorization: token}
            }).then(response => {
                expect(response.body.message).to.equal('Registro excluído com sucesso')
                expect(response.status).to.equal(200)
            })
        })
    });

});