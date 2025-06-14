// src/components/ChatBox.jsx

const ChatBox = () => {
  return (
    <div className="bg-white/10 p-4 h-full rounded-xl flex flex-col">
      <h3 className="text-lg mb-2">💬 Lobby Chat</h3>
      <div className="flex-1 bg-white/10 mb-2 p-2 rounded overflow-y-auto">
        {/* Messages will go here */}
        <p className="text-sm text-white/70">Jitesh: Let's goooo!</p>
      </div>
      <input
        type="text"
        placeholder="Type message..."
        className="px-3 py-2 rounded bg-white/20 text-white placeholder:text-white/50"
      />
    </div>
  );
};

export default ChatBox;
