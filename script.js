let currentUser = null;

function toggleAuth(type) {
  document.getElementById('signupSection')
    .classList.toggle('hidden', type !== 'signup');
  document.getElementById('loginSection')
    .classList.toggle('hidden', type !== 'login');
}

function signUp() {
  const email = document.getElementById('newEmail').value.trim();
  const password = document.getElementById('newPassword').value.trim();
  if (!email || !password) {
    return alert("Please enter both email and password.");
  }
  const users = JSON.parse(localStorage.getItem('users') || "{}");
  if (users[email]) {
    return alert("Email already registered.");
  }
  users[email] = { password, notes: [], files: [] };
  localStorage.setItem('users', JSON.stringify(users));
  alert("Signup successful! Please login.");
  toggleAuth('login');
}

function login() {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const users = JSON.parse(localStorage.getItem('users') || "{}");
  if (users[email] && users[email].password === password) {
    currentUser = email;
    document.getElementById('signupSection').classList.add('hidden');
    document.getElementById('loginSection').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    showSection('home');
  } else {
    alert("Invalid email or password.");
  }
}

function logout() {
  if (confirm("Are you sure you want to logout?")) {
    currentUser = null;
    document.getElementById('app').classList.add('hidden');
    toggleAuth('login');
  }
}

function showSection(section) {
  ['home', 'note', 'file', 'stats'].forEach(id => {
    document.getElementById(id + 'Section').classList.add('hidden');
  });
  document.getElementById(section + 'Section').classList.remove('hidden');
  if (section === 'home') {
    displayHomeFiles();
    displayHomeNotes();
  } else if (section === 'note') {
    displayNotes();
  } else if (section === 'file') {
    displayFiles();
  } else if (section === 'stats') {
    updateStats();
  }
}

function saveNote() {
  if (!currentUser) return;
  const title = document.getElementById('noteTitle').value.trim();
  const content = document.getElementById('noteContent').value.trim();
  if (!title || !content) return;
  const users = JSON.parse(localStorage.getItem('users'));
  users[currentUser].notes.push({ title, content });
  localStorage.setItem('users', JSON.stringify(users));
  document.getElementById('noteTitle').value = '';
  document.getElementById('noteContent').value = '';
  displayNotes();
}

function displayNotes() {
  if (!currentUser) return;
  const users = JSON.parse(localStorage.getItem('users'));
  const notes = users[currentUser].notes;
  const list = document.getElementById('noteList');
  list.innerHTML = '';
  notes.forEach((note, idx) => {
    const div = document.createElement('div');
    div.className = 'note';
    div.innerHTML = `<strong>${note.title}</strong><p>${note.content}</p>
      <button onclick="viewNote(${idx})">👁️ View</button>
      <button onclick="editNote(${idx})">✏️ Edit</button>
      <button onclick="deleteNote(${idx})">🗑 Delete</button>`;
    list.appendChild(div);
  });
}

function viewNote(idx) {
  const users = JSON.parse(localStorage.getItem('users'));
  const note = users[currentUser].notes[idx];
  openModal(`<h3>${note.title}</h3><p>${note.content}</p>`);
}

function editNote(idx) {
  const users = JSON.parse(localStorage.getItem('users'));
  const note = users[currentUser].notes.splice(idx, 1)[0];
  localStorage.setItem('users', JSON.stringify(users));
  document.getElementById('noteTitle').value = note.title;
  document.getElementById('noteContent').value = note.content;
  displayNotes();
  showSection('note');
}

function deleteNote(idx) {
  const users = JSON.parse(localStorage.getItem('users'));
  users[currentUser].notes.splice(idx, 1);
  localStorage.setItem('users', JSON.stringify(users));
  displayNotes();
}

function displayHomeNotes() {
  if (!currentUser) return;
  const users = JSON.parse(localStorage.getItem('users'));
  const notes = users[currentUser].notes;
  const homeList = document.getElementById('homeNoteList');
  homeList.innerHTML = notes.length ? '' : '<p>No notes saved yet.</p>';
  notes.forEach(note => {
    const div = document.createElement('div');
    div.className = 'note';
    div.innerHTML = `<strong>${note.title}</strong><br><em>${note.content.slice(0, 100)}…</em>`;
    homeList.appendChild(div);
  });
}

function saveFile() {
  if (!currentUser) return;
  const input = document.getElementById('fileInput');
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    const users = JSON.parse(localStorage.getItem('users'));
    users[currentUser].files.push({
      name: file.name,
      size: file.size,
      data: e.target.result
    });
    localStorage.setItem('users', JSON.stringify(users));
    displayFiles();
  };
  reader.readAsDataURL(file);
}

function displayFiles() {
  if (!currentUser) return;
  const users = JSON.parse(localStorage.getItem('users'));
  const files = users[currentUser].files;
  const list = document.getElementById('fileList');
}
 
