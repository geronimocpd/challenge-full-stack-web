const express = require('express');
const router = express.Router();
const cadAlunos = require('../services/cadAlunos');

/* Rotas definidas para as requisições - GET ALL */
router.get('/', async function(req, res, next) {
    try {
        res.json(await cadAlunos.getMultiple(req.body.page));
    } catch (err) {
        console.error(`Error while getting programming languages `, err.message);
        next(err);
    }
});

/* Rotas definidas para as requisições - GET ID */
router.get('/:id', async function(req, res, next) {
    try {
        res.json(await cadAlunos.getOne(req.params.id));
    } catch (err) {
        console.error(`Error while getting programming languages `, err.message);
        next(err);
    }
});

/* Rotas definidas para as requisições - GET NOME */
router.get('/find/:nome', async function(req, res, next) {
    console.log(req.params.nome);
    try {
        res.json(await cadAlunos.getName(req.params.nome));
    } catch (err) {
        console.error(`Error while getting programming languages `, err.message);
        next(err);
    }
});

/* Rotas definidas para as requisições - POST REGISTRO */
router.post('/', async  function(req, res, next) {

    try {
        res.json(await  cadAlunos.create(req.body));

        console.log(`Registro inserido`);
    } catch (err) {
        console.error(`Erro criando o cadastro solicitado`, req.body);
        next(err);
    }
});

/* Rotas definidas para as requisições - PUT REGISTRO */
router.put('/:id', async function(req, res, next) {
    try {
        res.json(await cadAlunos.update(req.params.id, req.body));
    } catch (err) {
        console.error(`Erro atualizando o registro solicitado`, err.message);
        next(err);
    }
});

/* Rotas definidas para as requisições - DELETE REGISTRO */
router.delete('/:id', async function(req, res, next) {
    try {
        res.json(await cadAlunos.remove(req.params.id));
    } catch (err) {
        console.error(`Erro deletando o registro solicitado`, err.message);
        next(err);
    }
});

module.exports = router;