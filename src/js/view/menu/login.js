export default function LoginView({ onSubmitName }) {
  const nameInputNode = document.getElementById('name-input');

  const loggedOutNode = document.getElementById('logged-out');
  const loggedInNode = document.getElementById('logged-in');

  nameInputNode.addEventListener('keydown', (event) => {
    const { key } = event;
    event.stopPropagation();

    if(key === 'Enter') {
      onSubmitName(event.target.value);
      nameInputNode.value = '';
    }
  });

  return {
    paint(isLoggedIn) {
      loggedOutNode.style.display = isLoggedIn ? 'none' : 'block';
      loggedInNode.style.display = isLoggedIn ? 'block' : 'none';
    }
  };
}
