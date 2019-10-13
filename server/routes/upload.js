//
const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const fs = require('fs');
const path = require('path');

// default options
app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:tipo/:id', function(req, res) {
    let tipo = req.params.tipo;
    let id = req.params.id;
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'no se ha seleccionado ningun archivo'
                }
            });
    }

    // // validar tipo
    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: `Los tipos permitidos son: ${tiposValidos.join(', ')}`,
                }
            })
    }

    // El nombre del campo de entrada (es decir, "archivo") se utiliza para recuperar el archivo cargado (postman).
    let sampleFile = req.files.archivo;

    //Extenciones permitidas
    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];
    //console.log(extension);

    let extensionesValidas = ['png', 'jpg', 'git', 'jpeg', 'PNG', 'JPG', 'GIT', 'JPEG'];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400)
            .json({
                ok: false,
                message: `extenciones permittidas: ${extensionesValidas.join(', ')}`,
                ext: extension
            })

    }

    //cambiar nombre al archivo
    nombreArchivo = `${id}-${new Date().getTime() }.${extension}`;

    // Use el método mv () para colocar el archivo en algún lugar de su servidor
    sampleFile.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err)
            return res.status(500)
                .json({
                    ok: false,
                    err
                });
        // aqui, imagen cargada 

        // res.json({
        //     ok: true,
        //     message: 'Imagen subida correctamente',
        //     ext: extension
        // });

        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivo);
        } else {
            imagenProducto(id, res, nombreArchivo);
        }
        // si son varios ponemos un switch

    });
});

function imagenUsuario(id, res, nombreArchivo) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borraArchivo(nombreArchivo, 'usuarios');

            return res.status(500).json({
                ok: false,
                err: {
                    message: `Usuario ${usuarioDB} no existe`
                }
            });
        }
        if (!usuarioDB) {

            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: `Usuario ${usuarioDB} no existe`
                }
            });
        }
        borraArchivo(usuarioDB.img, 'usuarios')
        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioGuardado) => {
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            });
        });
    });

}

function imagenProducto(id, res, nombreArchivo) {
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borraArchivo(nombreArchivo, 'productos');

            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {

            borraArchivo(nombreArchivo, 'productos');
            return res.status(400).json({
                ok: false,
                err: {
                    message: `Producto ${productoDB} no existe`
                }
            });
        }
        borraArchivo(productoDB.img, 'productos')
        productoDB.img = nombreArchivo;

        productoDB.save((err, productoGuardado) => {
            res.json({
                ok: true,
                Producto: productoGuardado,
                img: nombreArchivo
            });
        });
    });

}

function borraArchivo(nombreImagen, tipo) {
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;