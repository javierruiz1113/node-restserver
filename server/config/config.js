//
// ==============
//puerto
// ==============

process.env.PORT = process.env.PORT || 3000;

// ==============
// Entorno
// ==============

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ==============
// Vencimiento del Token
// ==============
// 1000 milisegundos
// 60 segundos
// 60 minutos
// 24 horas
// 30 dias
process.env.CADUCIDAD_TOKEN = 1000 * 60 * 60 * 24 * 30;

// ==============
// SEED de autenticación
// ==============
process.env.TOKEN_SEED = process.env.TOKEN_SEED || 'este-es-el-seed-produccion';

// ==============
// Base de datos
// ==============

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;
//