const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Conexión a la base de datos SQLite
const db = new sqlite3.Database('./students.sqlite', (err) => {
    if (err) {
        console.error('Error al abrir la base de datos:', err.message);
    } else {
        console.log('Conectado a la base de datos SQLite.');
    }
});

// Ruta para obtener todos los estudiantes o crear uno nuevo
app.route('/students')
    .get((req, res) => {
        const sql = 'SELECT * FROM students';
        db.all(sql, [], (err, rows) => {
            if (err) {
                res.status(400).json({ "error": err.message });
                return;
            }
            res.json({
                "message": "success",
                "data": rows
            });
        });
    })
    .post((req, res) => {
        const { firstname, lastname, gender, age } = req.body;
        const sql = 'INSERT INTO students (firstname, lastname, gender, age) VALUES (?, ?, ?, ?)';
        const params = [firstname, lastname, gender, age];
        db.run(sql, params, function (err) {
            if (err) {
                res.status(400).json({ "error": err.message });
                return;
            }
            res.json({
                "message": "success",
                "data": { id: this.lastID, firstname, lastname, gender, age }
            });
        });
    });

// Ruta para obtener, actualizar o eliminar un estudiante por ID
app.route('/student/:id')
    .get((req, res) => {
        const sql = 'SELECT * FROM students WHERE id = ?';
        const params = [req.params.id];
        db.get(sql, params, (err, row) => {
            if (err) {
                res.status(400).json({ "error": err.message });
                return;
            }
            res.json({
                "message": "success",
                "data": row
            });
        });
    })
    .put((req, res) => {
        const { firstname, lastname, gender, age } = req.body;
        const sql = 'UPDATE students SET firstname = ?, lastname = ?, gender = ?, age = ? WHERE id = ?';
        const params = [firstname, lastname, gender, age, req.params.id];
        db.run(sql, params, function (err) {
            if (err) {
                res.status(400).json({ "error": err.message });
                return;
            }
            res.json({
                "message": "success",
                "data": { id: req.params.id, firstname, lastname, gender, age },
                "changes": this.changes
            });
        });
    })
    .delete((req, res) => {
        const sql = 'DELETE FROM students WHERE id = ?';
        const params = [req.params.id];
        db.run(sql, params, function (err) {
            if (err) {
                res.status(400).json({ "error": err.message });
                return;
            }
            res.json({
                "message": "deleted",
                "changes": this.changes
            });
        });
    });

app.listen(8001, () => {
    console.log('Servidor escuchando en el puerto 8001');
});

