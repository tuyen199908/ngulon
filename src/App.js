
import React, {useEffect,useState} from 'react'
import 'bootstrap/dist/css/bootstrap.css';
import { Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import TextField from '@atlaskit/textfield'; 
import Button from '@atlaskit/button'; 
import { Label } from '@atlaskit/field-base';
import { DateTimePicker } from '@atlaskit/datetime-picker';
import moment from 'moment';
import TextArea from '@atlaskit/textarea';
import axios from 'axios';
import {RiDeleteBin5Line} from 'react-icons/ri'




function App() {

  const [modal, setModal] = useState(false);
  const [value, setValue] = useState(new Date());
  const [invalid, setInvalid] = useState(false);
  const [content, setContent] = useState('');
  const [title, setTitle] =useState('')
  const [data, setData] = useState('');
  const [date, setDate] = useState(new Date())

  const toggle = () => setModal(!modal);

  async function getList() {
    axios.get('https://60e5715a5bcbca001749ed24.mockapi.io/api/todo').then((res) => {
      setData(res.data);
    })
  }
  useEffect(()=>{
    getList()
  },[])

  useEffect(() => {
    setInterval(() => {
      setDate(new Date());
    }, 1000)
  })


  const add = () => {
    console.log(add)
    if (content !== '' && value !== '') {
      let item = {
        content: content,
        id: 'data.length + 1',
        date: value,
        status: 0,
        // countdown: countDown,
      };
      axios.post('https://60e5715a5bcbca001749ed24.mockapi.io/api/todo', item).then(() => {
        getList();
      })
      setModal(!modal);
    }
  }

  const del = (index) => {
    console.log('del', index)
    if (index !== -1) {
      axios.delete(`https://60e5715a5bcbca001749ed24.mockapi.io/api/todo/${index}`).then(() => {
        getList();
      })
    }
  }
  const edit = (value) => {
    console.log(value)
    if (value) {
      const data = {
        id: value.id,
        content: value.content,
        date: value.date,
        status: 1,
      }
      axios.put(`https://60e5715a5bcbca001749ed24.mockapi.io/api/todo/${value.id}`, data).then((res) => {
        getList();
        console.log(res)
      })
    }

  }

  function handlChange(date, dateString) {
  console.log(date, dateString);
}

  return (
    <div className="body">
      <div className="All">
        <h3 className="header">ToDo List</h3>
        <div>
        {
            data.length > 0 ?
              <ul key={title} className="list" >
                {
                  data?.map((item, index) => {//{item.content} <br /> {moment(item.date).format('DD-MM-YYYY')}
                    return (
                      <li style={{ listStyle:"none", width: "100%", height:"auto" }} >
                        <Button style={{height:"auto", width: "100%", background: "none" , textDecoration: item.status == 1 ? '#c656e2c6 line-through' : 'none'}} 
                        iconBefore={
                          <span className="radio" onClick={() => edit(item)} style={{background: item.status == 1? "#c656e2c6" : "none" }}></span>
                        }
                        iconAfter={
                          <span style={{display: item.status == 1? "inline-block" : "none"}} onClick={() => del(item.id)}><RiDeleteBin5Line/></span>
                        }
                        ><p style={{color: item.status == 0 && (moment(item.date)-moment(date)) < 180000 ? '#d41414c6' : '#9f9ea0c6'}}>{item.content} <br /> {moment(item.date).format('DD-MM-YYYY')} at: {moment(item.date).format('hh:mm')}</p></Button>
                      </li>
                    )
                  })}
              </ul>
              :
              null
          }
        </div>
        <div className="Task">
          <button type="button" class="Creat" onClick={toggle}>+ New Task</button>
        </div>
        <Modal isOpen={modal} toggle={toggle}>
          <ModalHeader toggle={toggle}>Create Task</ModalHeader>
          <ModalBody>
            <form>
              <div>
                <Label label="Content"/>
                <TextArea resize="auto" placeholder="Nhập nội dung ..." name="area" testId="autoResizeTextArea" onChange={(e)=> setContent(e.target.value) }/>
              </div>
              <div>
                <Label label={`Current time is: ${moment(value).format('DD-MM-YYYY')} at: ${moment(value).format('hh:mm')}`} />
                <DateTimePicker
                  value={value}
                  onChange={handlChange}
                  timeIsEditable
                  isInvalid={invalid}
                />
              </div>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button appearance="primary" onClick={add} >Create</Button>{' '}
            <Button color="secondary" onClick={toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    </div>
  );
}

export default App;
