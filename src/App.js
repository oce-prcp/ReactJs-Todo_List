import React, { useState, useEffect } from "react";
import List from "./components/List";
import Alert from "./components/Alert";

const getLocalStorage = () => {
  let list = localStorage.getItem("list");
  if (list) {
    return JSON.parse(localStorage.getItem("list"));
  } else {
    return [];
  }
};

function App() {
  const [name, setName] = useState("");
  const [list, setList] = useState([]);
  const [isEditing, setIdEditing] = useState(false);
  const [editID, setEditID] = useState(null);
  const [alert, setAlert] = useState({ show: false, msg: "", type: "" });

  useEffect(() => {
    localStorage.setItem("list", JSON.stringify(list));
  }, [list]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) {
      // display alert
      showAlert(true, "danger", "Please enter value");
    } else if (name && isEditing) {
      setList(
        list.map((item) => {
          if (item.id === editID) {
            return { ...item, title: name };
          }
          return item;
        })
      );
      setName("");
      setEditID(null);
      setIdEditing(false);
      showAlert(true, "success", "Value changed");
    } else {
      showAlert(true, "info", "Item added to the list");
      const newItem = { id: new Date().getTime().toString(), title: name };
      setList([...list, newItem]);
      setName("");
    }
  };
  const showAlert = (show = false, type = "", msg = "") => {
    setAlert({ show, type, msg });
  };
  const removeItems = (id) => {
    showAlert(true, "danger", "Item removed");
    setList(list.filter((item) => item.id !== id));
  };
  const editItems = (id) => {
    const editItem = list.find((item) => item.id === id);
    setIdEditing(true);
    setEditID(id);
    setName(editItem.title);
  };
  const clearList = () => {
    showAlert(true, "warning", "Empty list");
    setList([]);
  };

  return (
    <section className="section-center">
      <form onSubmit={handleSubmit}>
        {alert.show && <Alert {...alert} removeAlert={showAlert} list={list} />}
        <h3 style={{ marginBottom: "1.5rem", textAlign: "center" }}>
          Todo-List_IPSSI
        </h3>
        <div className="mb-3 form">
          <input
            type="text"
            className="form-control"
            placeholder="To do.."
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
          <button
            type="submit"
            className="btn btn-success"
            style={{ marginLeft: "1.5rem" }}
          >
            {isEditing ? "Edit" : "Submit"}
          </button>
        </div>
      </form>
      {list.length > 0 && (
        <div style={{ marginTop: "1.5rem" }}>
          <List items={list} removeItems={removeItems} editItems={editItems} />
          <br></br>
          <div className="text-center">
            <button className="btn btn-dark" onClick={clearList}>
              Clear Items
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default App;
