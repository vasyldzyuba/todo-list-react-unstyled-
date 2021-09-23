import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/button';

function App() {

  const [todos, setTodos] = useState([]);
  const [subtodos, setSubTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [edited, setEdited] = useState('');
  const [isOpen, setOpen] = useState(false);
  const [isOpenModal, setOpenModal] = useState(false);
  const [isOpenSub, setOpenSub] = useState(false);
  const [valId, setValId] = useState('');
  const [subItemId, setSubItemId] = useState('');
  const [subNewTodo, setSubNewTodo] = useState('');
  const [inputVal, setInputVal] = useState('');
  const [editedSubItem, setEditedSubItem] = useState('');
  const [handleEdit, setHandleEdit] = useState('');
  const [editedSubId, setEditedSubId] = useState('');
  const [isLoginOpen, setIsLoginOpen] = useState(true);
  const [login, setLogin] = useState('');
  const [pass, setPass] = useState('');
  const [token, setToken] = useState('');
  const [basic, setBasic] = useState('');


  function onChangeLogin(e) {
    setLogin(e.target.value);
  }

  function onChangePass(e) {
    setPass(e.target.value);
  }

  function open(data, id) {
    setOpen(true);
    setInputVal(data);
    setValId(id);
  }
  function closeLogin() {
    setIsLoginOpen(false);
  }

  function openSub(id) {
    setSubItemId(id);
    setOpenSub(true);
  }

  function openSubModal(id, data, todoId) {
    setOpenModal(true);
    setEditedSubId(id);
    setHandleEdit(data);
    setEditedSubItem(todoId);
  }

  function handleSubEdit(e) {
    setHandleEdit(e.target.value);
  }

  function closeModal() {
    setOpenModal(false);
  }

  function close() {
    setOpen(false);
    setEdited('');
  }

  function closeSub() {
    setOpenSub(false);
  }

  function handleChange(event) {
    setNewTodo(event.target.value);
  }

  function setEditedOnType(event) {
    setEdited(event.target.value);
  }

  function handleSub(e) {
    setSubNewTodo(e.target.value);
  }

  function getLogin() {
    axios.post(`https://candidate.flash-web.net/login?username=${encodeURIComponent(login)}&password=${pass}`).then((response) => {
      setToken(response.data.token);
      setBasic(response.data.tokenType);
      getTodos(response.data.token, response.data.tokenType);
      console.log('eeeee ', `${response.data.token} ${response.data.tokenType}`, encodeURIComponent(login), encodeURIComponent(pass));
      return response;
    }).then((res) => {
      closeLogin();
      return res;
    }).catch(e => {
      console.log(e)
    });
  }

  function onStrike(firstId, item, itemId) {
    item.checked = !item.checked;
    console.log(item.checked);
    setSubTodos((prev) => {
      return [item, ...prev]
    });

    axios({
      url: `https://candidate.flash-web.net/to-do/${firstId}/change-check-item/${itemId}`,
      params: {
        checked: item.checked
      },
      method: 'PUT',
      headers: {
        'Authorization': `${basic} ${token}`,
        'Accept': '*/*'
      }
    }).then((res) => {
      setEdited('');
      return res;
    }).catch(e => console.log(e));
  }

  function editSubTodo() {
    subtodos.map(todo => {
      return todo.items.map((el) => {
        if (el.id === editedSubId) {
          return el.itemText = handleEdit;
        }
      })
    });
    closeModal()
    axios({
      url: `https://candidate.flash-web.net/to-do/${editedSubItem}/edit-item/${editedSubId}`,
      data: {
        text: handleEdit
      },
      method: 'PUT',
      headers: {
        'Accept': '*/*',
        'Content-Type': 'application/json',
        'Authorization': `${basic} ${token}`
      }
    }).then((res) => {
      return res;
    }).catch(e => {
      console.log(e)
    });
  }



  function addSubTodo() {
    setSubTodos((prev) => {
      return [{ itemText: subNewTodo, ...prev }];
    });

    setSubNewTodo('');
    axios({
      url: `https://candidate.flash-web.net/to-do/${subItemId}/add-item`,
      data: {
        text: subNewTodo
      },
      method: 'POST',
      headers: {
        'Accept': '*/*',
        'Authorization': `${basic} ${token}`,
        'Content-Type': 'application/json'
      }
    }).then((res) => {
      setSubItemId('');
      setSubTodos(prev => {
        return [res.data, ...prev]
      });
      return res;
    }).catch(e => {
      console.log(e)
    });
    closeSub();
  }

  function saveEditedTodo() {
    todos.map(todo => {
      if (todo.id === valId) {
        return todo.toDoListName = edited;
      }
    });
    axios({
      url: `https://candidate.flash-web.net/to-do/${valId}`,
      params: {
        name: edited
      },
      method: 'PUT',
      headers: {
        'Authorization': `${basic} ${token}`,
        'Accept': '*/*'
      }
    }).then((res) => {
      setEdited('');
      return res;
    }).catch(e => console.log(e));
    close();
  }

  const deleteTodo = (id) => {
    const newTodos = todos.filter((item) => item.id !== id);
    setTodos(newTodos);
    axios({
      url: `https://candidate.flash-web.net/to-do/${id}`,
      method: 'DELETE',
      headers: {
        'Authorization': `${basic} ${token}`,
        'Accept': '*/*'
      }
    }).then((res) => {
      return res;
    }).catch(e => console.log(e));
  }

  const deleteSubTodo = (id, subId) => {
    const newSubTodos = subtodos.filter((item) => item.id !== id);
    setSubTodos(newSubTodos);
    axios({
      url: `https://candidate.flash-web.net/to-do/${id}/delete-item/${subId}`,
      method: 'DELETE',
      headers: {
        'Authorization': `${basic} ${token}`,
        'Accept': '*/*'
      }
    }).then((res) => {
      return res;
    }).catch(e => console.log(e));
  }


  function addTodo() {
    if (newTodo.trim().length) {
      axios({
        url: 'https://candidate.flash-web.net/to-do',
        params: {
          name: `${newTodo}`
        },
        method: 'POST',
        headers:
        {
          'Authorization': `${basic} ${token}`
        }
      }).then((res) => {
        setTodos((prev) => {
          return [res.data, ...prev];
        });
        setNewTodo('');
      });
    }
  }

  function getTodos(tok, bas) {
    axios({
      url: 'https://candidate.flash-web.net/to-do',
      method: 'GET',
      headers: {
        'Authorization': `${bas} ${tok}`,
        'Accept': '*/*'
      }
    }).then((res) => {
      setTodos(res.data.content);
      return res.data.content;
    });
  }

  function getSubTodos(id) {
    axios({
      url: `https://candidate.flash-web.net/to-do/${id}`,
      method: 'GET',
      headers: {
        'Authorization': `${basic} ${token}`
      }
    }).then((res) => {
      if (!(subtodos.filter(e => e.id === id).length > 0)) {
        setSubTodos(prev => { return [res.data, ...prev] });
      }
    })
  }

  // useEffect(() => {

  // }, []);

  return (<div>
    <input type="text" placeholder="Add todo" onChange={handleChange} value={newTodo} />
    <Button size="sm" type="button" className="add-btn" variant="success" onClick={() => addTodo()}>Add</Button>
    <ul className="top-ul"> {
      todos.map((todo) => {
        return (<li className="top-li" key={todo.id}>
          {todo.toDoListName}
          <div className="btn-wrap"> <Button size="sm" type="Button" onClick={() => { getSubTodos(todo.id); }}>
            Open &#x2193;</Button>
            <Button size="sm" type="Button" onClick={() => deleteTodo(todo.id)}>Remove ToDo</Button>
            <Button size="sm" type="Button" onClick={() => open(todo.toDoListName, todo.id)}>Edit</Button>
            <Button size="sm" type="Button" onClick={() => openSub(todo.id)}>Add SubToDo</Button></div>
          <ul className="inner-ul">{subtodos.length ?
            subtodos.map((item) => {
              return (item.id === todo.id ? item.items.map((el) => {
                return (<div className="wrapped" key={el.id}><li className={el.checked ? 'completed inner-li' : 'inner-li'}>
                  <input type="checkbox" size="sm" defaultChecked={el.checked ? 'checked' : ''} onClick={() => onStrike(todo.id, el, el.id)} />
                  {el.itemText}
                </li><Button onClick={() => deleteSubTodo(todo.id, el.id)} type="Button" size="sm">Remove</Button><Button type="Button" onClick={() => { openSubModal(el.id, el.itemText, todo.id) }} size="sm">Edit</Button></div>);
              }) : null)
            }) : null}
          </ul>
        </li>)
      })
    } </ul>

    <Modal show={isOpen} onHide={close}>
      <Modal.Header closeButton>
        <Modal.Title>Modal heading</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group >
          <Form.Label>Todo Name: </Form.Label>
          <Form.Control type="text" onChange={setEditedOnType} defaultValue={inputVal} />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" disabled={!edited.length || inputVal == edited} onClick={() => saveEditedTodo()}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>

    <Modal show={isOpenSub} onHide={closeSub}>
      <Modal.Header closeButton>
        <Modal.Title>Modal heading</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group >
          <Form.Label>SubTodo Name: </Form.Label>
          <Form.Control type="text" onChange={handleSub} defaultValue={subNewTodo} />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={() => addSubTodo()}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>

    <Modal show={isOpenModal} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>Modal heading</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group >
          <Form.Label>SubTodo Name: </Form.Label>
          <Form.Control type="text" onChange={handleSubEdit} defaultValue={handleEdit} />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={() => editSubTodo()}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>

    <Modal show={isLoginOpen} onHide={closeLogin}>
      <Modal.Header >
        <Modal.Title>Please Login</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group >
          <Form.Label>Email: </Form.Label>
          <Form.Control type="text" onChange={onChangeLogin} defaultValue={''} />
        </Form.Group>
        <Form.Group >
          <Form.Label>Password: </Form.Label>
          <Form.Control type="text" onChange={onChangePass} defaultValue={''} />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={() => getLogin()}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  </div>);
}

export default App;
