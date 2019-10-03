const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto');

// =========================
// Obtener productos
// =========================
app.get('/productos', verificaToken, (req, res) => {
    //trae todos los productos
    //populate: usuario categoria
    // paginado
    let desde = req.query.desde || 0;
    desde = Number(desde); // para transformar a numero

    let limite = req.query.limite || 5;
    limite = Number(limite); // para transformar a numero

    Producto.find({ disponible: true })
        .skip(desde) //salta los primeros "x" usuarios de la DB
        .limit(limite) // muestra "x" usuarios de la DB
        .populate('usuarios', 'nombre email') //muestra los usuario y en segundo argumentos los campos q queremos ver id anidados
        .populate('categoria', 'descripcion ') //muestra los usuario y en segundo argumentos los campos q queremos ver id anidados
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos,
            })

        })
});

// =========================
// Obtener un producto por id
// =========================
app.get('/productos/:id', verificaToken, (req, res) => {
    //populate: usuario categoria
    let id = req.params.id;
    Producto.findById(id)
        .populate('usuario', 'nombre email') //muestra los usuario y en segundo argumentos los campos q queremos ver id anidados
        .populate('categoria', 'nombre') //muestra los usuario y en segundo argumentos los campos q queremos ver id anidados
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El id no es correcto'
                    }
                });
            }
            res.json({
                ok: true,
                productoDB
            })
        })

});
// =========================
// crear un producto 
// =========================

app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');
    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion ')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'dddd',
                        err
                    }
                });
            }
            res.status(201).json({
                ok: true,
                productos
            })

        })

});

// =========================
// crear un producto 
// =========================
app.post('/productos', verificaToken, (req, res) => {
    //grabar el usuario
    //grabar una categoria del listado
    let body = req.body;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });
    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        })
    });

});

// =========================
// actualizar un producto 
// =========================
app.put('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'dddd',
                    err
                }
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }
        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.descripcion = body.descripcion;
        productoDB.disponible = body.disponible;
        productoDB.categoria = body.categoria;

        productoDB.save((err, productoGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'dddd',
                        err
                    }
                });
            }
            res.status(201).json({
                ok: true,
                producto: productoGuardado
            })
        });
    });

});

// =========================
// borrar un producto 
// =========================
app.delete('/productos/:id', verificaToken, (req, res) => {
    // cambiar el estado 
    let id = req.params.id;

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB.disponible) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }
        productoDB.disponible = false;

        productoDB.save((err, productoInActivo) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'dddd',
                        err
                    }
                });
            }

            res.json({
                ok: true,
                producto: productoInActivo,
                message: 'Producto borrado'
            });
        });








    });
});



module.exports = app;