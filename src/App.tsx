
import React from "react";

// Apply dark theme immediately
document.documentElement.classList.add('dark');

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <h1 className="text-4xl font-bold mb-4">Test App</h1>
      <p className="text-lg">React is working if you can see this!</p>
    </div>
  );
}

export default App;
