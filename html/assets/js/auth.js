document.addEventListener('DOMContentLoaded', function() {
    const loginBtn = document.getElementById('login-btn');
    
    loginBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // In a complete implementation, this would open a login modal
        // or redirect to a login page
        alert('Login functionality will be implemented in the next version!');
        
        // For now, just toggle a "logged in" state
        if (loginBtn.textContent.includes('Login')) {
            loginBtn.innerHTML = '<i class="fas fa-user"></i> My Account';
        } else {
            loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
        }
    });
});