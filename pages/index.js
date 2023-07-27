import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'
import axios from 'axios';
import { useState } from 'react';
const url = 'https://nextjs-todo-indol.vercel.app/';

export default function Home(props) {
  const [todos,setTodos] = useState(props.todos);
  const [todo, setTodo] = useState({todo:""});

  const handleChange = ({currentTarget:input}) => {
    input.value ===""
    ? setTodo({todo:""})
    : setTodo((prev)=> ({...prev, todo: input.value}));
  };
  const addTodo = async (e) => {
    e.preventDefault();
    try {
      if(todo._id){
        const {data} = await axios.put(url + "/" + todo._id, {
          todo: todo.todo,
        });
        const orginalTodos = [...todos];
        const index = orginalTodos.findIndex((t) => t._id === todo._id);
        orginalTodos[index] = data.data;
        setTodos(orginalTodos);
        setTodo({todo: ""});
      } else {
        const {data} = await axios.post(url, todo);
        setTodos((prev) => [...prev, data.data]);
        setTodo({todo:""});
        console.log(data.message);
      }
    } catch (error){
      console.log(error)
    }
  }
  const updateTodo = async (id) => {
    try {
      const orginalTodos = [...todos];
      const index = orginalTodos.findIndex((t)=> t._id === id);
      const {data} = await axios.put(url + '/' + id, {
        completed: !orginalTodos[index].completed,
      })
      orginalTodos[index]= data.data;
      setTodos(orginalTodos);
      console.log(data.message);
    } catch(error){
      console.log(error);
    }
  }
  const handleDelete = async (id) => {
    try {
      const {data} = await axios.delete(url + '/' + id);
      setTodos((prev) => prev.filter((todo) => todo._id !== id));
      console.log(data.message);
    } catch(error){
      console.log(error);
    }
  }
  const editTodo = async (id) => {
    const currentTodo = todos.filter((todo)=> todo._id ===id);
    setTodo(currentTodo[0]);
  }
  return (
    <>
      <Head>
        <title>Zadania do zrobienia</title>
        <meta name="description" content="Strona z zadaniami bojowymi" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className={`${styles.main}`}>
        <h1>Zadania:</h1>
        {todos.map((todo)=> (
          <div className={`${styles.todo}`} key={todo._id}>
            <p className={styles.todoTitle}>{todo.todo}</p>
            <input type="checkbox"
              checked={todo.completed}
              onChange={()=> updateTodo(todo._id)}
              className={styles.inputCheckobox}
            />
            <button className={styles.button} onClick={() => editTodo(todo._id)}>Up</button>
            <button className={styles.button} onClick={(e) => handleDelete(todo._id)}>X</button>
          </div>
        ))}
        <form onSubmit={addTodo}>
          <input 
            type="text"
            placeholder='Bojowe zadania'
            onChange={handleChange}
            value={todo.todo}
            className={styles.submitInput}
            />
          <button className={styles.submitButton} type="submit">
            {todo._id ? "Update" : "Dodaj"}
          </button>
        </form>
        {/* <h1>Test</h1>
         <ol>
          <li>Utworzenie połączenia z bazą danych "dbConnect"</li>
          <li>Utworzenie schematu models/Todo.js</li>
          <li>Przygotowanie API pages/api/todo index.js + [id].js</li>
          <li>Prace z plikiem index.js w celu pobrania danych</li>
          <li>Pobieranie danych do elementu getServerSideProps</li>
         </ol> */}
      </main>
    </>
  )
}

export const getServerSideProps = async () => {
  const {data} = await axios.get(url);
  return {
    props: {
      todos: data.data,
    }
  }
}