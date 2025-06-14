import React from 'react';

function App() {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-700 text-center">
      <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white drop-shadow-lg animate-pulse tracking-wide">
        Let<span className="text-yellow-300">'</span>s <span className="text-pink-300">Rando!</span>
      </h1>
      <p className="mt-4 text-xl md:text-2xl text-gray-200 font-medium tracking-wider">
        Online Card Multiplayer Game
      </p>
    </div>
  );
}

export default App;