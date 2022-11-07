import React, { useEffect, useState } from 'react'
import style from '../styles/chats.module.css';
import axiosClient from '../services/axiosService';
import { getValueFromLocalStorage } from '../services/localStorageService'
let loggedInUser;
function Chats() {
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState({});
  const [msgInput, setMsgInput] = useState('');
  const [selectedChat, setSelectedChat] = useState(null)
  useEffect(() => {
    getAllChats();
    loggedInUser = getValueFromLocalStorage('userId');

  }, [])
  async function getAllChats() {
    try {
      let res = await axiosClient.get('/chat');
      if (res?.data.length > 0) {
        setChats(res?.data)
      }
    }
    catch (err) {

    }

  }
  async function getChat(id) {
    try {
      let res = await axiosClient.get(`/chat/${id}`);
      console.log("res id", res);
      if (res?.data) {
        console.log('messa');
        setSelectedChat(res?.data)
        setMessages(res?.data?.messages)
      }
    }
    catch (err) {

    }

  }

  function g(chats) {

    let chatList = chats?.reduce((acc, curr) => {
      if (curr.isGroupChat) {
        acc.push(curr.groupChatName)
      }
      else {
        let otherPerson = curr.peopleInvolvedInChat.filter(person =>
          person?._id !== loggedInUser);
        acc.push(otherPerson[0].name)
      }

      return acc
    }, [])

    console.log("listttttt", chatList)
    return chatList || []
  }
  function nameToShow(chat) {
    let otherPerson = chat.peopleInvolvedInChat.filter(person =>
      person?._id !== loggedInUser);
    return otherPerson[0].name
  }
  async function sendMessage() {
    console.log('selectedChat', selectedChat)
    if (msgInput === '') {
      alert('Type something to send msg...');
      return;
    }
    if (selectedChat) {
      let receiver = selectedChat.peopleInvolvedInChat.filter(person =>
        person?._id !== loggedInUser);
      let peopleInvolvedInChat = selectedChat.peopleInvolvedInChat.map(person => person._id);
      let res = await axiosClient.post('/chat', {
        peopleInvolvedInChat,
        isGroupChat: false,
        message: {
          content: msgInput,
          senderId: loggedInUser,
          receiverId: receiver[0]._id
        }
      })
    }

  }
  function handleChange(e) {
    setMsgInput(e.target.value)
  }
  return (
    <div className={style.chatContainer}>
      <section className={style.usersSection}>
        <p>My Chats</p>
        <button>New group</button>
        {chats?.length > 0 ? chats?.map(chat =>
          <div className={style.user} onClick={() => getChat(chat._id)}>
            {
              nameToShow(chat)

            }
          </div>) : "NO chats"}
      </section>
      <section className={style.chatsSection}>
        {messages?.length > 0 ? messages?.map(message => (<p key={message._id}
          style={{ textAlign: message.senderId === loggedInUser ? 'right' : 'left' }}>
          <span className={style.message}>{message.content}</span>
        </p>)) : 'No mesagses'}
        <div className={style.sendMsgSection}>
          <input type="text" className={style.addMessageInput} placeholder="Send a message.." onChange={handleChange} />
          <button onClick={sendMessage}>Send</button>
        </div>

      </section>
    </div>
  )
}

export default Chats