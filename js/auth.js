// frontend/js/auth.js - SIMPLE VERSION (FIXED)

// GANTI: const API_BASE = window.CONFIG...
// MENJADI: const AUTH_API = window.CONFIG...
const AUTH_API = window.CONFIG ? window.CONFIG.API_BASE : 'https://ahp-jurusan-backend-production.up.railway.app/api';

console.log('🔗 Auth.js loaded. Using API:', AUTH_API);

// Test koneksi - FIX ENDPOINT (coba tanpa /health)
fetch(AUTH_API + '/')
  .then(res => {
    console.log('🏥 Backend Status:', res.status);
    return res.text();
  })
  .then(text => {
    if(text.includes('html')) {
      console.log('✅ Backend is running (HTML response)');
    } else {
      console.log('✅ Backend response:', text.substring(0, 100));
    }
  })
  .catch(err => console.warn('⚠️ Backend check (optional):', err.message));

async function handleLogin(email, password) {
    console.log('🔄 Login attempt:', email);
    
    const btn = document.getElementById('loginBtn');
    const btnText = document.getElementById('btnText');
    const spinner = document.getElementById('loadingSpinner');
    const messageDiv = document.getElementById('message');
    
    // Show loading
    if (btn) btn.disabled = true;
    if (btnText) btnText.textContent = 'Memproses...';
    if (spinner) spinner.classList.remove('hidden');
    
    try {
        const response = await fetch(AUTH_API + '/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        console.log('📊 Status:', response.status);
        
        const data = await response.json();
        console.log('📦 Response:', data);
        
        if (data.token) {
            // Success
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            // Show success message
            if (messageDiv) {
                messageDiv.innerHTML = '<div class="p-3 bg-green-100 text-green-700 rounded">✅ Login berhasil! Mengalihkan...</div>';
                messageDiv.classList.remove('hidden');
            }
            
            // Redirect
            setTimeout(() => {
                if (data.user.role === 'superadmin') {
                    window.location.href = 'superadmin.html';
                } else if (data.user.role === 'admin') {
                    window.location.href = 'admin.html';
                } else {
                    window.location.href = 'dashboard.html';
                }
            }, 1000);
            
        } else {
            // Error
            if (messageDiv) {
                messageDiv.innerHTML = `<div class="p-3 bg-red-100 text-red-700 rounded">❌ ${data.message || 'Login gagal'}</div>`;
                messageDiv.classList.remove('hidden');
            }
        }
    } catch (error) {
        console.error('🚨 Error:', error);
        if (messageDiv) {
            messageDiv.innerHTML = `<div class="p-3 bg-red-100 text-red-700 rounded">⚠️ Gagal terhubung ke server: ${error.message}</div>`;
            messageDiv.classList.remove('hidden');
        }
    } finally {
        // Reset button
        setTimeout(() => {
            if (btn) btn.disabled = false;
            if (btnText) btnText.textContent = 'Masuk ke Akun';
            if (spinner) spinner.classList.add('hidden');
        }, 2000);
    }
}

// Setup login form
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        console.log('✅ Login form found');
        
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email')?.value.trim();
            const password = document.getElementById('password')?.value.trim();
            
            if (!email || !password) {
                const messageDiv = document.getElementById('message');
                if (messageDiv) {
                    messageDiv.innerHTML = '<div class="p-3 bg-red-100 text-red-700 rounded">⚠️ Harap isi email dan password</div>';
                    messageDiv.classList.remove('hidden');
                }
                return;
            }
            
            handleLogin(email, password);
        });
    }
});

// Logout function
function logout() {
    if (confirm('Yakin ingin logout?')) {
        localStorage.clear();
        window.location.href = 'login.html';
    }
}

// Export
window.authHelpers = { logout, handleLogin };