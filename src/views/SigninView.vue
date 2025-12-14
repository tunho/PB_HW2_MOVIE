<template>
  <div class="signin-container">
    <div class="background-image"></div>
    <div class="overlay"></div>
    
    <div class="form-wrapper">
      <h1 class="logo">NETFLIX</h1>
      
      <div class="form-content">
        <h2>{{ isLogin ? 'Sign In' : 'Sign Up' }}</h2>
        
          <Transition name="flip" mode="out-in">
            <form v-if="isLogin" @submit.prevent="handleSubmit" key="login" class="auth-form">
            <div class="input-group">
              <input 
                v-model="email" 
                type="email" 
                placeholder="Email" 
                required 
              />
            </div>
            
            <div class="input-group">
              <input 
                v-model="password" 
                type="password" 
                placeholder="Password" 
                required 
                minlength="4"
              />
            </div>
            
            <button type="submit" :disabled="loading" class="submit-btn">
              {{ loading ? 'Processing...' : 'Sign In' }}
            </button>
            
            <div class="extras">
              <div class="remember-me">
                <input type="checkbox" id="remember" v-model="rememberMe" />
                <label for="remember">Remember me</label>
              </div>
              <a href="#" class="help">Need help?</a>
            </div>
          </form>

          <form v-else @submit.prevent="handleSubmit" key="signup" class="auth-form">
            <div class="input-group">
              <input 
                v-model="email" 
                type="email" 
                placeholder="Email" 
                required 
              />
            </div>
            
            <div class="input-group">
              <input 
                v-model="password" 
                type="password" 
                placeholder="Password" 
                required 
                minlength="4"
              />
            </div>

            <div class="input-group">
              <input 
                v-model="confirmPassword" 
                type="password" 
                placeholder="Confirm Password" 
                required 
              />
            </div>
            
            <button type="submit" :disabled="loading" class="submit-btn">
              {{ loading ? 'Processing...' : 'Sign Up' }}
            </button>
            
            <div class="extras">
              <div class="remember-me">
                <input type="checkbox" id="terms" v-model="termsAgreed" required />
                <label for="terms">I agree to the <a href="#" class="terms-link">Terms & Conditions</a></label>
              </div>
              <a href="#" class="help">Need help?</a>
            </div>
          </form>
        </Transition>
        
        <div class="switch-mode">
          <span class="text-gray">
            {{ isLogin ? 'New to Netflix?' : 'Already have an account?' }}
          </span>
          <a href="#" @click.prevent="toggleMode">
            {{ isLogin ? 'Sign up now.' : 'Sign in now.' }}
          </a>
        </div>
        
        <div class="error-message" v-if="error">
          {{ error }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const isLogin = ref(true);
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const rememberMe = ref(true);
const termsAgreed = ref(false);
const error = ref('');
const loading = ref(false);

const toggleMode = () => {
  isLogin.value = !isLogin.value;
  error.value = '';
  email.value = '';
  password.value = '';
  confirmPassword.value = '';
  termsAgreed.value = false;
};

const handleSubmit = async () => {
  error.value = '';
  loading.value = true;

  // Add artificial delay for better UX
  await new Promise(resolve => setTimeout(resolve, 500));

  // Basic validation
  if (!email.value.includes('@')) {
    error.value = 'Please enter a valid email address.';
    loading.value = false;
    return;
  }

  if (password.value.length < 4) {
    error.value = 'Password must be at least 4 characters.';
    loading.value = false;
    return;
  }

  try {
    if (isLogin.value) {
      const success = authStore.login(email.value, password.value);
      if (success) {
        router.push('/');
      } else {
        error.value = 'Invalid email or password.';
      }
    } else {
      if (password.value !== confirmPassword.value) {
        error.value = 'Passwords do not match.';
        loading.value = false;
        return;
      }
      
      if (!termsAgreed.value) {
        error.value = 'You must agree to the terms and conditions.';
        loading.value = false;
        return;
      }

      const success = authStore.register(email.value, password.value);
      if (success) {
        // Auto login after register or switch to login? Assignment says:
        // "Sign up success -> move to signin page and auto show login window"
        isLogin.value = true;
        alert('Registration successful! Please sign in.');
      } else {
        error.value = 'User already exists.';
      }
    }
  } catch (e) {
    error.value = 'An error occurred.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.signin-container {
  position: relative;
  height: 100vh;
  width: 100vw;
  background: black;
  overflow: hidden;
}

.background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('https://assets.nflxext.com/ffe/siteui/vlv3/f841d4c7-10e1-40af-bcae-07a3f8dc141a/f6d7434e-d6de-4185-a6d4-c77a2d08737b/US-en-20220502-popsignuptwoweeks-perspective_alpha_website_medium.jpg');
  background-size: cover;
  opacity: 0.5;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  background-image: linear-gradient(to top, rgba(0,0,0,0.8) 0, rgba(0,0,0,0) 60%, rgba(0,0,0,0.8) 100%);
}

.logo {
  position: absolute;
  top: 20px;
  left: 40px;
  color: var(--primary-color);
  font-size: 2.5rem;
  z-index: 10;
}

.form-wrapper {
  position: relative;
  z-index: 5;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.form-content {
  background: rgba(0, 0, 0, 0.75);
  padding: 60px 40px 40px;
  border-radius: 4px;
  width: 100%;
  max-width: 450px;
  min-height: 500px;
  perspective: 1000px;
}

h2 {
  color: white;
  font-size: 2rem;
  margin-bottom: 28px;
}

.input-group {
  margin-bottom: 16px;
}

input {
  width: 100%;
  padding: 16px 20px;
  border: 0;
  border-radius: 4px;
  background: #333;
  color: white;
  font-size: 1rem;
}

input:focus {
  background: #454545;
  outline: none;
}

button {
  width: 100%;
  padding: 16px;
  font-size: 1rem;
  font-weight: 700;
  margin-top: 24px;
  margin-bottom: 12px;
  transition: transform 0.1s, background-color 0.2s;
}

button:active {
  transform: scale(0.98);
  background-color: #c11119;
}

.extras {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  color: #b3b3b3;
  margin-bottom: 40px;
}

.remember-me {
  display: flex;
  align-items: center;
}

.remember-me input {
  width: auto;
  margin-right: 5px;
}

.remember-me label {
  white-space: nowrap;
}

.text-gray {
  color: #737373;
  margin-right: 8px;
  white-space: nowrap;
}

.switch-mode {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
}

.switch-mode a {
  white-space: nowrap;
  color: white;
}

.switch-mode a:hover {
  text-decoration: underline;
}

.error-message {
  color: #e87c03;
  font-size: 0.9rem;
  margin-top: 20px;
}

/* Transition Effects */
/* Transition Effects */
.flip-enter-active,
.flip-leave-active {
  transition: all 0.4s ease;
}

.flip-enter-from {
  transform: rotateY(-90deg);
  opacity: 0;
}

.flip-leave-to {
  transform: rotateY(90deg);
  opacity: 0;
}
</style>
