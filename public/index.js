document.getElementById('central-comment-form').addEventListener('submit', function(event) {
  event.preventDefault();

  const commentTextarea = document.getElementById('central-comment');
  const comment = commentTextarea.value;
  const topic = document.getElementById('comment-topic').value;

  saveCentralComment(comment, topic);

  // Clear the content of the textarea
  commentTextarea.value = '';

  loadCentralComments();
});

function displayCommentsByTopic(topic) {
  fetch(`http://localhost:3000/comments?topic=${topic}`)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Error al obtener los comentarios por tema');
      }
    })
    .then(comments => {
      var commentsList = document.getElementById('central-comments-list');
      commentsList.innerHTML = '';

      comments.forEach(function(comment, index) {
        var commentDiv = document.createElement('div');
        commentDiv.classList.add('comment');
        commentDiv.id = 'comment-' + comment.id;
        commentDiv.innerHTML = `<strong>Comment ${index + 1}:</strong> ${comment.comment}<br>
        <small>${comment.date}</small><br><small>Topic: ${comment.topic}</small><br><small>User: ${comment.profileName}</small>`;

        var deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', function() {
          deleteComment(comment.id);
        });
        commentDiv.appendChild(deleteButton);

        commentsList.appendChild(commentDiv);
      });
    })
    .catch(error => console.error('Error:', error));
}

var commentTopicSelect = document.getElementById('comment-topic');
commentTopicSelect.addEventListener('change', function() {
    var selectedTopic = commentTopicSelect.value;
    displayCommentsByTopic(selectedTopic);
});


function deleteComment(id) {
  fetch(`http://localhost:3000/comments/${id}`, {
    method: 'DELETE'
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Error al eliminar el comentario');
    }
  })
  .then(data => {
    console.log('Comentario eliminado exitosamente:', data);
    var selectedTopic = commentTopicSelect.value;
    displayCommentsByTopic(selectedTopic);
  })
  .catch(error => console.error('Error:', error));
}


function saveCentralComment(commentText, topic) {
  var comment = {
      comment: commentText,
      topic: topic,
      date: new Date().toLocaleString() 
  };

  fetch('http://localhost:3000/comments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(comment)
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Error al agregar el comentario');
    }
  })
  .then(data => {
    console.log('Comentario agregado exitosamente:', data);
    loadCentralComments();
  })
  .catch(error => console.error('Error:', error));
}

function getCentralCommentsFromServer() {
  return fetch('http://localhost:3000/comments')
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Error al obtener los comentarios del servidor');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      return [];
    });
}

function loadCentralComments() {
  var commentTopic = commentTopicSelect.value;
  displayCommentsByTopic(commentTopic);
}

function searchComments() {
  var searchText = document.getElementById('comment-search').value.trim().toLowerCase(); 
  var comments = Array.from(document.querySelectorAll('.comment'));

  comments.forEach(comment => {
    var commentText = comment.textContent.toLowerCase();
    var commentId = comment.id;

    // Obtener solo el texto del comentario sin el tema
    var commentContent = commentText.split('topic:')[0].trim();

    // Si la búsqueda está vacía, mostrar todos los comentarios
    if (searchText === '') {
      document.getElementById(commentId).style.display = 'block'; // Mostrar comentario
    } else {
      // Verificar si el comentario contiene el texto de búsqueda
      if (commentContent.includes(searchText)) {
        document.getElementById(commentId).style.display = 'block'; // Mostrar comentario
      } else {
        document.getElementById(commentId).style.display = 'none'; // Ocultar comentario
      }
    }
  });
}

document.getElementById('comment-search').addEventListener('input', searchComments);

window.onload = function() {
  loadCentralComments();
};
///////////////////////////////////////////////////////////////////////////
// Funciones para el formulario de inicio de sesión (login)
function closeLoginForm() {
  document.getElementById("login-container").style.display = "none";
}

function toggleLoginForm() {
  var loginContainer = document.getElementById("login-container");
  if (loginContainer.style.display === "none" || loginContainer.style.display === "") {
    loginContainer.style.display = "block";
  } else {
    loginContainer.style.display = "none";
  }
}

function closeInfoBox() {
  document.getElementById("infoBox").style.display = "none";
}

var createAccountBtn = document.getElementById("create-account-btn");
var infoBox = document.getElementById("infoBox");

createAccountBtn.addEventListener("click", function() {
  infoBox.style.display = "block";
});

document.getElementById("close-login-btn").addEventListener("click", closeLoginForm);
document.getElementById("login-link").addEventListener("click", toggleLoginForm);
document.getElementById("closeButton").addEventListener("click", closeInfoBox);

// Función para abrir el sidebar
function openSidebar() {
  var sidebar = document.getElementById("sidebar");
  sidebar.style.width = "250px"; // Establece el ancho del sidebar como 250px
}

// Función para cerrar el sidebar
function closeSidebar() {
  var sidebar = document.getElementById("sidebar");
  sidebar.style.width = "0"; // Establece el ancho del sidebar como 0, ocultándolo
}

// Event listener para abrir el sidebar al hacer clic en el botón de menú
document.getElementById("open-sidebar-btn").addEventListener("click", openSidebar);

// Event listener para cerrar el sidebar al hacer clic en el botón de cerrar dentro del sidebar
document.getElementById("close-sidebar-btn").addEventListener("click", closeSidebar);



// Función para manejar el formulario de registro
function handleRegister(event) {
  event.preventDefault();

  // Obtener los valores de los campos de entrada
  const fullName = document.getElementById('full-name').value;
  const email = document.getElementById('email-register').value;
  const password = document.getElementById('password-register').value;

  // Crear un objeto que represente el nuevo perfil de usuario
  const newProfile = {
    fullName: fullName,
    email: email,
    password: password
  };

  // Realizar una solicitud POST al servidor para agregar el nuevo perfil
  fetch('http://localhost:3000/profiles', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newProfile)
  })
  .then(response => {
    if (response.ok) {
      console.log('Profile created successfully');
      // Limpiar los campos del formulario después del registro
      document.getElementById('full-name').value = '';
      document.getElementById('email-register').value = '';
      document.getElementById('password-register').value = '';
    } else {
      console.error('Failed to create profile');
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
}

// Agregar un event listener para el envío del formulario de registro
document.getElementById('registerButton').addEventListener('click', handleRegister);

////////////////////////
function handleLogin(event) {
  event.preventDefault(); // Evitar que se recargue la página

  // Obtener los valores de los campos de entrada
  const email = document.getElementById('email-login').value;
  const password = document.getElementById('password-login').value;

  // Crear un objeto que represente los datos del inicio de sesión
  const loginData = {
    email: email,
    password: password
  };

  // Realizar una solicitud POST al servidor para verificar las credenciales de inicio de sesión
  fetch(`/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(loginData)
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Error al iniciar sesión');
    }
  })
  .then(data => {
    // Ocultar el formulario de inicio de sesión
    document.getElementById('login-container').style.display = 'none';
    // Mostrar los detalles del usuario y el botón de cerrar sesión
    const userDetails = document.getElementById('user-details');
    userDetails.style.display = 'block';
    document.getElementById('user-info').textContent = `Bienvenido, ${data.fullName} (${data.email})`;
    document.getElementById('logoutButton').style.display = 'block';
  })
  .catch(error => {
    console.error('Error:', error);
  });
}

function handleLogout(event) {
  event.preventDefault();
  // Mostrar el formulario de inicio de sesión y ocultar los detalles del usuario
  document.getElementById('login-container').style.display = 'block';
  document.getElementById('user-details').style.display = 'none';
}

// Agregar un event listener al botón de inicio de sesión
document.getElementById('loginButton').addEventListener('click', handleLogin);

// Agregar un event listener al botón de cerrar sesión
document.getElementById('logoutButton').addEventListener('click', handleLogout);
