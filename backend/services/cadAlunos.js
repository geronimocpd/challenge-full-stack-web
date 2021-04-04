const db = require('./db');
const helper = require('../helper');
const config = require('../config');

/*Buscar todos os registros*/
async function getMultiple(page = 1){
    const offset = helper.getOffset(page, config.listPerPage);
    const rows = await db.query(
        `SELECT id, nome, email, ra, cpf
         FROM alunos LIMIT ?,?`,
        [offset, config.listPerPage]
    );
    const data = helper.emptyOrRows(rows);
    const meta = {page};

    /*Meta será responsavel pelas informações adicionais ex: paginação*/
    return {
        data,
        meta
    }
}

/*Criar novo registro*/
async  function create(cadAluno){
    const result = await db.query(
        `INSERT INTO alunos 
    (nome, email, ra, cpf) 
    VALUES 
    (?, ?, ?, ?)`,
        [
            cadAluno.nome,
            cadAluno.email,
            cadAluno.ra,
            cadAluno.cpf
        ]
    );

    let message = 'Erro inserindo o registro';

    if (result.affectedRows) {
        message = 'Registro inserido com sucesso';
    }

    return {message};
}


/*Atualizando registros*/
async function update(id, cadAluno){
    const result = await db.query(
        `UPDATE alunos
            SET nome=?, 
            email=?, 
            cpf=?, 
            ra=? 
    WHERE id=?`,
        [
            cadAluno.nome,
            cadAluno.email,
            cadAluno.cpf,
            cadAluno.ra,
            id
        ]
    );

    let message = 'Erro atualizando o cadastro';

    if (result.affectedRows) {
        message = 'Cadastro Atualizado com sucesso';
    }

    return {message};
}

/*Deletando registros*/
async function remove(id){
    const result = await db.query(
        `DELETE FROM alunos WHERE id=?`,
        [id]
    );

    let message = 'erro deletando o registro';

    if (result.affectedRows) {
        message = 'registro deletado com sucesso!';
    }

    return {message};
}

/*buscar  registro pelo ID*/
async function getOne(id){
    const rows = await db.query(
        `SELECT * FROM alunos WHERE id=?`,
        [id]
    );

    const data = helper.emptyOrRows(rows);


    return {
        data
    }
}

/*buscar  registro pelo nome*/
async function getName(nome){
    const rows = await db.query(
        "SELECT * FROM alunos where nome like '%"+nome+"%'",
        [nome]
    );

    const data = helper.emptyOrRows(rows);


    return {
        data
    }
}

module.exports = {
    getOne,
    getName,
    getMultiple,
    create,
    update,
    remove
}
