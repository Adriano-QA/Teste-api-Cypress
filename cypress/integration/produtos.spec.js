/// <reference types="cypress"/>

describe('Teste da funcionalidade produtos', () => {

    it('Listar produtos', () => {
        cy.request({
            method: 'GET',
            url: 'produtos'
        }).then((response) =>{
            expect(response.body.produtos[0].nome).to.equal('Logitech MX Vertical')
            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('produtos')
            expect(response.duration).to.be.lessThan(15)
        })
    });

    it.only('Cadastrar produto', () => {
        cy.request({
            method:'POST',
            url: 'produtos',
            body: {
                "nome": "Produtp Adriano EBAC",
                "preco": 47,
                "descricao": "Produto Novo",
                "quantidade": 31
              },
              headers: {authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImZ1bGFub0BxYS5jb20iLCJwYXNzd29yZCI6InRlc3RlIiwiaWF0IjoxNjUyMzY0MDA4LCJleHAiOjE2NTIzNjQ2MDh9.z1LorJbS_3u-FXSv-Fm6mojaUHLtwxPoXRs_0rekOO4'}
        }).then((response) => {
            expect(response.status).to.equal(201)
            expect(response.body.message).to.equal('Cadastro realizado com sucesso')
        })
        
    });
});