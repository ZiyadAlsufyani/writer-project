import React, { useState } from "react";

function App() {
  const [formData, setFormData] = useState({ x: "", y: "", shapesize: "" });
  const [backendData, setBackendData] = useState([{}]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const convertedFormData = {
      x: parseInt(formData.x, 10),
      y: parseInt(formData.y, 10),
      shapesize: parseInt(formData.shapesize, 10)
    };
    console.log("running handleSumbit method")
    fetch("/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    }).then(response => response.json())
      .then(data => {
        setBackendData(data);
      });
  };


  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          X:
          <input type="number" name="x" value={formData.x} onChange={handleChange} />
        </label>
        <label>
          Y:
          <input type="number" name="y" value={formData.y} onChange={handleChange} />
        </label>
        <label>
          Shape Size:
          <input type="number" name="shapesize" value={formData.shapesize} onChange={handleChange} />
        </label>
        <button type="submit">Submit</button>
      </form>

      {(typeof backendData.users === 'undefined') ? (
        <p>Loading ...</p>
      ) : (
        backendData.users.map((user, i) => (
          <p key={i}>{user}</p>
        ))
      )}
    </div>
  );
}

export default App;