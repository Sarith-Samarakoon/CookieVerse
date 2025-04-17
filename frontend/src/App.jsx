import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/api/hello")
      .then((res) => res.text())
      .then(setMessage)
      .catch(console.error);
  }, []);

  return <h1>{message}</h1>;
}

export default App;
