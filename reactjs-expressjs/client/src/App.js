import React from 'react'

function App() {
  const handleClick = () => {
    fetch('/test')
      .then(response => response.json())
      .then(data => {
        const message = data.message
        window.alert(message)
      })
      .catch(error => {
        console.error('Error:', error)
      })
  }

  return (
    <div>
      <button onClick={handleClick}>Click me to say "Hi!"</button>
    </div>
  )
}

export default App
