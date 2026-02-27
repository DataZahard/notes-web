const API_URL = '/api/v1';
let token = localStorage.getItem('token');

// Initialize view
if (token) showDashboard();

function showToast(msg) {
    const toast = document.getElementById('message-toast');
    toast.innerText = msg;
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 3000);
}

async function handleAuth(type) {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    const endpoint = type === 'register' ? '/register' : '/login';
    
    try {
        const res = await fetch(API_URL + endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, role })
        });
        const data = await res.json();

        if (res.ok) {
            if (type === 'login') {
                token = data.token;
                localStorage.setItem('token', token);
                localStorage.setItem('username', data.username);
                showDashboard();
            } else {
                showToast("Registration successful! Please login.");
            }
        } else {
            showToast(data.error);
        }
    } catch (err) {
        showToast("Server connection failed");
    }
}

function showDashboard() {
    document.getElementById('auth-section').classList.add('hidden');
    document.getElementById('main-content').classList.remove('hidden');
    document.getElementById('user-info').classList.remove('hidden');
    document.getElementById('username-display').innerText = `Hi, ${localStorage.getItem('username')}`;
    fetchNotes();
}

async function fetchNotes() {
    const res = await fetch(`${API_URL}/notes`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const notes = await res.json();
    const container = document.getElementById('notes-list');
    
    container.innerHTML = notes.map(n => `
        <div class="note-item">
            <strong>${n.title}</strong>
            <p>${n.content}</p>
            <small>${new Date(n.createdAt).toLocaleDateString()}</small>
        </div>
    `).join('') || '<p>No notes found.</p>';
}

async function createNote() {
    const title = document.getElementById('note-title').value;
    const content = document.getElementById('note-content').value;

    const res = await fetch(`${API_URL}/notes`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ title, content })
    });

    if (res.ok) {
        document.getElementById('note-title').value = '';
        document.getElementById('note-content').value = '';
        fetchNotes();
        showToast("Note saved!");
    }
}

function logout() {
    localStorage.clear();
    location.reload();
}
