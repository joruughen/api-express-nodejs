const sqlite3 = require('sqlite3').verbose();

// Crear conexión a la base de datos
const db = new sqlite3.Database('./students.sqlite', (err) => {
    if (err) {
        console.error(err.message);
        throw err;
    }
    console.log('Conectado a la base de datos SQLite.');

    // Crear tabla "students" si no existe
    const createStudentsTable = `
    CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        firstname TEXT NOT NULL,
        lastname TEXT NOT NULL,
        gender TEXT NOT NULL,
        age TEXT
    );`;
    
    db.run(createStudentsTable, (err) => {
        if (err) {
            console.error('Error creando la tabla students:', err.message);
        } else {
            console.log('Tabla students creada o ya existe.');
        }
    });
});

