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
//process.env.CADUCIDAD_TOKEN = 1000 * 60 * 60 * 24 * 30;
process.env.CADUCIDAD_TOKEN = '48h';

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

// ==============
// Google client ID
// ==============
process.env.CLIENT_ID = process.env.CLIENT_ID || '234135693928 - i4asa22n7m2c41t3801l43gierco48kp.apps.googleusercontent.com';

//