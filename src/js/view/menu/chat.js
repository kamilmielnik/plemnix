export default function ChatView({ onSubmitMessage }) {
  const chatNode = document.getElementById('chat');
  const chatInputNode = document.getElementById('chat-input');

  document.addEventListener('keydown', (event) => {
    const { key } = event;
    if(key === 'Tab') {
      chatInputNode.focus();
      event.preventDefault();
    }
  });

  chatInputNode.addEventListener('keydown', (event) => {
    const { key } = event;
    event.stopPropagation();

    if(key === 'Enter') {
      onSubmitMessage(event.target.value);
      chatInputNode.value = '';
    }

    if(['Tab', 'Enter', 'Escape'].includes(key)) {
      event.preventDefault();
      chatInputNode.blur();
    }
  });

  return {
    paint(chat) {
      const { height } = chatNode.getBoundingClientRect();
      const { scrollHeight, scrollTop } = chatNode;
      const didNotHadScroll = scrollHeight < height;
      const wasScrolledToBottom = scrollHeight - scrollTop <= height;
      const { messages } = chat;
      chatNode.textContent = messages.join('\n');
      const hasScroll = chatNode.scrollHeight >= height;
      const hasScrollAppeared = didNotHadScroll && hasScroll;
      if(wasScrolledToBottom || hasScrollAppeared) {
        chatNode.scrollTop = Number.MAX_SAFE_INTEGER;
      }
    }
  };
}
