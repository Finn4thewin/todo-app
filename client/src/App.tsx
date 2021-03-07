import React, { useState, useEffect, useRef } from 'react';
import './App.css';

import Card from '@material-ui/core/Card';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import IconButton from '@material-ui/core/IconButton';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import ClearIcon from '@material-ui/icons/Clear';
import Checkbox from '@material-ui/core/Checkbox';

type TodoListItem = {
  title: string;
  completed: boolean;
}

export default function App() {
  const [todoList, setTodoList] = useState<TodoListItem[]>([]);
  const [newTodo, setNewTodo] = useState<string>("");

  // Grab the todoList on load
  useEffect(() => {
    fetch("/get-list").then(async (res) => {
      if (res.status !== 200)
        alert("Failed to retrieve list");

      setTodoList(await res.json());
    });
  }, []);

  // hook that updates the server on list changes
  // does not run on initial load
  const isFirstRun = useRef(true);
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    updateList();
  }, [todoList]);

  // api call for updating the list
  const updateList = async () => {
    let res = await fetch("/set-list", {
      "method": "POST",
      "headers": {
        "Content-Type": "application/json"
      },
      "body": JSON.stringify({ newList: todoList })
    });

    if (res.status !== 200)
      alert("Failed to update list");
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (newTodo === "")
      return;

    let newList = [...todoList];
    newList.push({
      title: newTodo,
      completed: false
    });
    setTodoList(newList);
    setNewTodo("");
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodo(e.target.value);
  }

  const handleDeleteClick = (index: number) => {
    let newList = [...todoList];
    newList.splice(index, 1);
    setTodoList(newList);
  }

  const handleCompletedClick = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    let newList = [...todoList];
    newList[index].completed = e.target.checked;
    setTodoList(newList);
  }


  return (
    <div className="App">
      <Card className="body">
        <h2>Todo</h2>
        <form onSubmit={handleSubmit}>
          <TextField
            label="what todo"
            onChange={handleTextChange}
            value={newTodo}
          />
        </form>

        <List dense>
          {todoList.map((todo, index) => (
            <div key={index}>
              <ListItem className="listItem">
                <Checkbox
                  checked={todo.completed}
                  onChange={(e) => handleCompletedClick(e, index)}
                />
                <ListItemText primary={todo.title} />
                <IconButton
                    onClick={() => handleDeleteClick(index)}
                >
                  <ClearIcon
                    fontSize="small"
                  />
                </IconButton>
              </ListItem>
              <Divider />
            </div>
          ))}
        </List>
      </Card>
    </div>
  );
}
