const express = require('express');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const { profile } = require('console');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());

// Configurar el middleware de sesión
app.use(session({
  secret: 'secreto', // Cambia esto por una cadena de caracteres secreta
  resave: false,
  saveUninitialized: true
}));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/comments', (req, res) => {
  try {
    const { comment, topic } = req.body; // No necesitamos obtener userId aquí

    const dbData = JSON.parse(fs.readFileSync('db.json', 'utf-8'));

    const lastCommentId = dbData.comments.length > 0 ? dbData.comments[dbData.comments.length - 1].id : 0;
    const newCommentId = lastCommentId + 1;

    // Obtener userId de la sesión
    const userId = req.session.userId;

    // Buscar el perfil del usuario por su ID
    const user = dbData.profile.find(profile => profile.id === userId);
    const profileName = user ? user.fullName : 'Usuario'; // Obtener el nombre completo del usuario

    const newComment = {
      id: newCommentId,
      comment: comment,
      topic: topic,
      profileName: profileName, // Asignar el nombre del perfil del usuario al comentario
      date: new Date().toLocaleString()
    };

    dbData.comments.push(newComment);

    fs.writeFileSync('db.json', JSON.stringify(dbData, null, 2));

    res.status(200).json(newComment);
  } catch (error) {
    console.error('Error al agregar el comentario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});


app.get('/comments', (req, res) => {
  const { topic } = req.query;

  try {
    const dbData = JSON.parse(fs.readFileSync('db.json', 'utf-8'));

    const commentsByTopic = dbData.comments.filter(comment => comment.topic === topic);

    res.status(200).json(commentsByTopic);
  } catch (error) {
    console.error('Error al obtener los comentarios por tema:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.delete('/comments/:id', (req, res) => {
  const { id } = req.params;

  try {
    let dbData = JSON.parse(fs.readFileSync('db.json', 'utf-8'));

    dbData.comments = dbData.comments.filter(comment => comment.id !== parseInt(id));

    fs.writeFileSync('db.json', JSON.stringify(dbData, null, 2));

    res.status(200).json({ message: 'Comentario eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar el comentario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

///////////////////////////////////////////////////////////////
app.post('/profiles', (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const dbData = JSON.parse(fs.readFileSync('db.json', 'utf-8'));

    const lastProfileId = dbData.profile.length > 0 ? dbData.profile[dbData.profile.length - 1].id : 0;
    const newProfileId = lastProfileId + 1;

    const newProfile = {
      id: newProfileId,
      fullName: fullName,
      email: email,
      password: password
    };

    dbData.profile.push(newProfile);

    fs.writeFileSync('db.json', JSON.stringify(dbData, null, 2));

    res.status(200).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});


app.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;

    let dbData;
    try {
      dbData = JSON.parse(fs.readFileSync('db.json', 'utf-8'));
    } catch (error) {
      console.error('Error al leer db.json:', error);
      throw new Error('Error interno del servidor');
    }

    if (dbData && dbData.profile) {
      const user = dbData.profile.find(profile => profile.email === email && profile.password === password);

      if (user) {
        // Almacenar el ID del perfil del usuario en el objeto de sesión
        req.session.userId = user.id;
        res.status(200).json(user);
      } else {
        res.status(400).json({ error: 'Email o contraseña incorrectos' });
      }
    } else {
      console.error('No se encontraron perfiles en db.json');
      throw new Error('Error interno del servidor');
    }
  } catch (error) {
    console.error('Error al procesar la solicitud de inicio de sesión:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});



app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
