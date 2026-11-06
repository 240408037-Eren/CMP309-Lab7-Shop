const VALID_EMAILS = ['240408037@st.biruni.edu.tr', '240408037@biruni.edu.tr'];
const VALID_PASSWORD = 'demo123456';

/**
 * Simulates an asynchronous login request with fixed credentials.
 * Resolves after ~500ms with { username } or rejects with Error("Invalid credentials").
 */
export function login(username, password) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const trimmedUser = (username || '').trim().toLowerCase();
      const isEmailValid = VALID_EMAILS.some((email) => email.toLowerCase() === trimmedUser);

      if (isEmailValid && password === VALID_PASSWORD) {
        resolve({ username: trimmedUser });
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, 500);
  });
}
