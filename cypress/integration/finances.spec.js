/// <reference types="cypress" />

import {format, prepareLocalStorage} from '../support/utils'

//cy.viewport
//arquivos de config
//configs por linha de comando npx cypress open --config viewportWidth=330,viewportHeight=600

context('Dev Finances Agilizei', () => {

    //hooks:trechos decódigo que executam antes e depois do teste
    //before: antes de todos os testes
    //beforeEach: antes de cada teste
    //after: depois de todos os testes
    //afterEach: depois de cada teste

    beforeEach(() => {

        cy.visit('https://dev-finance.netlify.app', {
            onBeforeLoad: (win) => {
                prepareLocalStorage(win)
            }
        })
        
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

       // cy.get('#data-table tbody tr').should('have.length', 0)
    });

    it.only('Validar saldo com diversar transações', () => {

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

        //capturar as linhas com as transações
        //formatar esses valores das linhas
        //somar os valores das linhas
        //capturar o texto do total
        //comparar o somatorio de entradas e despesas com o total

        let incomes = 0
        let expenses = 0

        cy.get('#data-table tbody tr')
        .each(($el, index, $list) => {
            cy.log(index)
            cy.get($el).find('td.income, td.expense').invoke('text').then(text => {

                if(text.includes('-')){
                    expenses = expenses +format(text)
                } else {
                    incomes = incomes + format(text)
                }


                cy.log('entradas',incomes)
                cy.log('saídas', expenses)

            })
        }) 

        cy.get('#totalDisplay').invoke('text').then(text => {
            cy.log('valor total', format(text))

            let formattedTotalDisplay = format(text)
            let expectedTotal = incomes + expenses

            expect(formattedTotalDisplay).to.eq(expectedTotal)
        })
        
    });
    
});

//entender o fluxo manualmente
//mapear os elementos que vamos interagir
//descrever as interações com o cypress
//adicionar as asserções que a gente precisa