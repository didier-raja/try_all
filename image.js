const express = require('express');
const cors = require('cors');
const path = require('path');
const mysql2 = require('mysql2');
const fs = require('fs');
const multer = require('multer');

const app = express();
app.use(cors());
app.use(express.json());

const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}
// Serves the folder so images are accessible via URL
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const connection = mysql2.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "image"
});

connection.connect((err) => {
    if (err) console.log('Database connection failed');
    else console.log('Database connected successfully');
});
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage: storage });

app.post('/insert', upload.single('image'), (req, res) => {
    const { name, email } = req.body;
    // Fix: Replace backslashes with forward slashes for browser compatibility
    const imagePath = req.file ? req.file.path.replace(/\\/g, "/") : null;
    
    const sql = "INSERT INTO user (name, email, image_path) VALUES(?,?,?)";
    connection.query(sql, [name, email, imagePath], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Success", image: imagePath });
    });
});

app.get('/get', (req, res) => {
    const sql = "SELECT * FROM user";
    connection.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});

app.listen(3000, () => console.log(`Server running at http://localhost:3000`));