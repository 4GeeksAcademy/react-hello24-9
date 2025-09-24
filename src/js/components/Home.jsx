import React, { useState, useEffect } from "react";

const Home = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newTask, setNewTask] = useState("");

  // Cargar tareas al iniciar
  useEffect(() => {
    fetchTodos();
  }, []);

  // Obtener todas las tareas
  const fetchTodos = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://playground.4geeks.com/todo/todos/CarlosAguayo");
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error("Error al cargar las tareas:", error);
      alert("No se pudieron cargar las tareas. Verifica la consola para más detalles.");
    } finally {
      setLoading(false);
    }
  };

  // Agregar una nueva tarea
  const addTask = async () => {
    if (!newTask.trim()) {
      alert("Por favor, ingresa una tarea válida.");
      return;
    }

    setLoading(true);
    try {
      const taskToAdd = {
        label: newTask,
        is_done: false,
      };

      const response = await fetch("https://playground.4geeks.com/todo/todos/CarlosAguayo", {
        method: "POST",
        body: JSON.stringify(taskToAdd),
        headers: { "Content-Type": "application/json" }
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      // Limpiar el campo de entrada y recargar las tareas
      setNewTask("");
      await fetchTodos();
    } catch (error) {
      console.error("Error al agregar la tarea:", error);
      alert("No se pudo agregar la tarea. Verifica la consola para más detalles.");
    } finally {
      setLoading(false);
    }
  };

  // Eliminar una tarea
  const deleteTask = async (taskId) => {
    setLoading(true);
    try {
      const response = await fetch(`https://playground.4geeks.com/todo/todos/31`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      await fetchTodos();
    } catch (error) {
      console.error("Error al eliminar la tarea:", error);
      alert("No se pudo eliminar la tarea. Verifica la consola para más detalles.");
    } finally {
      setLoading(false);
    }
  };

  // Limpiar todas las tareas
  const clearAllTasks = async () => {
    if (todos.length === 0) return;
    
    setLoading(true);
    try {
      // Crear un array de promesas para eliminar todas las tareas
      const deletePromises = todos.map(todo => 
        fetch(`https://playground.4geeks.com/todo/todos/31`, {
          method: "DELETE"
        })
      );
      
      // Esperar a que todas las eliminaciones se completen
      await Promise.all(deletePromises);
      
      // Recargar la lista de tareas
      await fetchTodos();
    } catch (error) {
      console.error("Error al eliminar las tareas:", error);
      alert("No se pudieron eliminar todas las tareas. Verifica la consola para más detalles.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Lista de Tareas</h1>
      
      <div className="row justify-content-center">
        <div className="col-md-8">
          {/* Formulario para agregar tareas */}
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Escribe una nueva tarea..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
              disabled={loading}
            />
            <button 
              className="btn btn-primary" 
              onClick={addTask}
              disabled={loading}
            >
              {loading ? "Añadiendo..." : "Añadir tarea"}
            </button>
          </div>

          {/* Lista de tareas */}
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <span>Tus tareas ({todos.length})</span>
              {todos.length > 0 && (
                <button 
                  className="btn btn-sm btn-danger"
                  onClick={clearAllTasks}
                  disabled={loading}
                >
                  {loading ? "Limpiando..." : "Limpiar todo"}
                </button>
              )}
            </div>
            
            <ul className="list-group list-group-flush">
              {loading && todos.length === 0 ? (
                <li className="list-group-item text-center">Cargando tareas...</li>
              ) : todos.length === 0 ? (
                <li className="list-group-item text-center">No hay tareas. ¡Agrega una nueva!</li>
              ) : (
                todos.map((todo) => (
                  <li key={todo.id} className="list-group-item d-flex justify-content-between align-items-center">
                    {todo.label}
                    <button 
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => deleteTask(todo.id)}
                      disabled={loading}
                    >
                      ×
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;