/// <reference types="cypress" />

context('Dev Finances Agilizei', () => {

    //hooks:trechos decódigo que executam antes e depois do teste
    //before: antes de todos os testes
    //beforeEach: antes de cada teste
    //after: depois de todos os testes
    //afterEach: depois de cada teste

    beforeEach(() => {

        cy.visit('https://dev-finance.netlify.app')
        cy.get('#data-table tbody tr').should('have.length', 0)
    });

    it('Cadastrar entradas', () => {

        cy.get('#transaction .button') .click() //id + classe
        cy.get('#description').type('Mesada') //id
        cy.get('[name=amount]').type('12') //atributo
        cy.get('[type=date]').type('2019-06-25') //atributo
        cy.get('button').contains('Salvar').click() //tipo e valor

        cy.get('#data-table tbody tr').should('have.length', 1)
        
    });

    //Cadastrar saídas

    it('Cadastrar saídas', () => {

        cy.get('#transaction .button') .click() //id + classe
        cy.get('#description').type('Mesada') //id
        cy.get('[name=amount]').type('-12') //atributo
        cy.get('[type=date]').type('2019-06-25') //atributo
        cy.get('button').contains('Salvar').click() //tipo e valor

        cy.get('#data-table tbody tr').should('have.length', 1)
        
    });

    //Remover entradas e saídas

    it('Remover entradas e saídas', () => {

        const entrada = 'Mesada'
        const saída = 'OvoPáscoa'  
        
        cy.get('#transaction .button') .click() //id + classe
        cy.get('#description').type(entrada) //id
        cy.get('[name=amount]').type('120') //atributo
        cy.get('[type=date]').type('2019-06-25') //atributo
        cy.get('button').contains('Salvar').click() //tipo e valor

        cy.get('#transaction .button') .click() //id + classe
        cy.get('#description').type(saída) //id
        cy.get('[name=amount]').type('-30') //atributo
        cy.get('[type=date]').type('2019-06-25') //atributo
        cy.get('button').contains('Salvar').click() //tipo e valor

        //estratégia 1: voltar para o elemento pai e avançar para um td img attr

        cy.get('td.description') //filtra onde está buscando o texto
            .contains(entrada) //texto
            .parent() //linha
            .find('img[onclick*=remove]') //busca o elemento dentro do contexto da linha
            .click()

        //estratégia 2: buscar todos os irmãos e buscar o que tem img + attr

        cy.get('td.description') //filtra onde está buscando o texto
            .contains(saída) //texto
            .siblings() //irmão
            .children('img[onclick*=remove]') //filho
            .click()

        cy.get('#data-table tbody tr').should('have.length', 0)
    });
    
});