import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {

  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState({ id: '', name: '', description: '' });

  useEffect(() => {
    db.collection('task')
    .orderBy('date', 'asc')
    .onSnapshot((query) => {
      let docs = [];
      query.forEach(doc => {
        docs.push({ ...doc.data(), id: doc.id });
      });
      setTasks(docs);
    });
  });

  const handlerSubmit = async (e) => {
    e.preventDefault();
    if(task.id.length){
      try{
        await db
          .collection('task')
          .doc(task.id)
          .update({ name: task.name, description: task.description });
      }catch(e){
        console.log(e);
      }
    }else{
      try{
        await db
          .collection('task')
          .doc()
          .set({ ...task, date: new Date() });
      }catch(e){
        console.log(e);
      }
    }
    setTask({ id: '', name: '', description: '' });
  }

  const handlerChange = (e) => {
    setTask({
      ...task,
      [e.target.name]: e.target.value
    });
  }

  const handlerDelete = async (currentId) => {
    try{
      await db.collection('task').doc(currentId).delete();
    }catch(e){
      console.log(e)
    }
  }

  const handlerUpdate = (data) => {
    setTask({...data});
  }

  return(
    <div className='container mt-4'>
      <div className='row'>
        <div className='col-4'>
          <form className='card card-body' onSubmit={(e) => handlerSubmit(e)}>
            <div className='form-group'>
              <label>Titulo</label>
              <input type='text' className='form-control' name='name' value={task.name} onChange={handlerChange} />
            </div>
            <div className='form-group'>
              <label>Descripcion</label>
              <textarea rows='3' className='form-control' name='description' value={task.description} onChange={handlerChange} />
            </div>
            <button type='submit' className='btn btn-primary'>{task.id.length ? 'Modificar' : 'Guardar'}</button>
            {task.id &&
              <button className='btn btn-danger btn-sm mt-2' onClick={() => setTask({ id: '', name: '', description: '' })}>Cancelar</button>
            }
          </form>
        </div>
        <div className='col-4'>
          {
            tasks.map(task => (
              <div className='card card-body mt-2' key={task.date}>
                <h3>{task.name}</h3>
                <p>{task.description}</p>
                <button className='btn btn-primary btn-sm mb-2' onClick={() => handlerUpdate(task)}>Modificar</button>
                <button className='btn btn-danger btn-sm' onClick={() => handlerDelete(task.id)}>Borrar</button>
              </div>
            ))
          }
        </div>
      </div>
    </div> 
  )
};

export default App;