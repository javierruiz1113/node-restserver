const express = require('express');
let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');
let app = express();
let Categoria = require('../models/categoria');

// ===============================
// Mostrar todas la categorias
// ===============================

app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find({})
        .sort('descripcion') // ordena por descripcion o lo q se ponga aqui
        .populate('usuario', 'nombre email') //muestra los usuario y en segundo argumentos los campos q queremos ver id anidados
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                categorias
            })
        })
});

// ===============================
// Mostrar una categorias por ID
// ===============================

app.get('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    Categoria.findById(id, (err, categoriaDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!categoriaDB) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'El id no es correcto'
                    }
                });
            }
            res.json({
                ok: true,
                categoriaDB
            })
        })
        // mostra unicamente el id
        //Categoria.findById(.....)
});

// ===============================
// Crear una categorias 
// ===============================

app.post('/categoria', verificaToken, (req, res) => {

    // regresa la nueva categoria
    // tengo el id del usuario en el token q lo creo
    //req.usuario._id aqui se encuentra el id de user q lo creo
    let body = req.body;
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id,
        estado: body.estado

    });
    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        })
    });
});

// ===============================
// actualizar categorias 
// ===============================

app.put('/categoria/:id', verificaToken, (req, res) => {

    // actualizar nombre o descripcion de la categoria
    let id = req.params.id;
    let body = req.body;
    let descCategoria = {
        descripcion: body.descripcion
    }
    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        })
    });

});

// ===============================
// borrar categorias 
// ===============================

app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    // solo un administrador puede borrar categoria
    //eliminar fisicamente
    // Categoria.findByIdAndRemove
    let id = req.params.id;
    // let cambiaEstado = {
    //     estado: false
    // };
    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {
        //Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true, }, (err, categoriaBorrada) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaBorrada) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }
        res.json({
            ok: true,
            message: 'Categoria borrada'
        });
    });
});

module.exports = app;