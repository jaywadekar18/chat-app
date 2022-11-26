import React, { useEffect, useState } from 'react'
import style from '../styles/chats.module.css';
import axiosClient from '../services/axiosService';
import { getValueFromLocalStorage } from '../services/localStorageService'
import Modal from '../components/Modal';
import io from 'socket.io-client';


let loggedInUser;
// loggedInUser = getValueFromLocalStorage('userId');
let socket
function Chats() {
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [msgInput, setMsgInput] = useState('');
  const [selectedChat, setSelectedChat] = useState({});
  const [searchResults, setSearchResults] = useState([]);
  const [showModal, setShowModal] = useState(false)
  useEffect(() => {
    loggedInUser = getValueFromLocalStorage('userId');
    getAllChats();
  }, [])
  useEffect(() => {
    socket = io('http://localhost:5000');
    socket.on('connection', () => {
      console.log('connected')
    });

    socket.emit("setup", loggedInUser);
    return () => {
      socket.off('connection');
    }
  }, [loggedInUser]);
  useEffect(() => {
    if (socket) {
      socket.on('message received', (msg) => {
        newMsgReceived(msg)
      })
    }
    return () => {
      socket.off('message received');
    }
  })

  useEffect(() => {
    console.log('seletced chat----->>', selectedChat)
    if (selectedChat?.chatId) {
      socket.emit("join chat", selectedChat?._id);
    }

    // return () => {
    //   console.log("canceled join chat")
    //   socket.off('join chat');
    // }
  }, [selectedChat])
  async function newMsgReceived(msg) {
    console.log("msg", msg);
    console.log("message received .........", messages);
    console.log("selectedChat", selectedChat);

    console.log('mmmmmmmmmmssssssssssssggggggggg', msg);
    let chatExistInList = chats.find(chat =>
      chat.chatId === msg.chatId);
    console.log('chatExistInList', chatExistInList)
    if (loggedInUser !== msg.senderId && msg.chatId === selectedChat?.chatId) {
      console.log('iff')
      setMessages(prev => [...prev, msg])
      return;
    }
    // else if (chats.length === 0) {
    //   console.log('chats.length === 0 1 else if')
    //   getAllChats().then(() => {
    //     if (chats.length <= 0) return
    //     let modifiedChat = chats?.map(chat => {

    //       if (chat.chatId === msg.chatId) {
    //         chat.isMsgPending = true;
    //       }
    //       return chat
    //     })
    //     console.log('modifiedChat', modifiedChat)
    //     setChats(modifiedChat);
    //   })
    // }
    else if (chatExistInList) {
      console.log('chatExistInList 2 else if')
      let modifiedChat = chats.map(chat => {

        if (chat.chatId === msg.chatId) {
          chat.isMsgPending = true;
        }
        return chat
      })
      console.log('modifiedChat', modifiedChat)
      setChats(modifiedChat);
    }

    else {
      console.log('elseeeeeee');
      // getAllChats()
      let res = await axiosClient.get(`/chat/${msg.chatId}`);
      let chat = res.data;
      let newChat
      if (chat.isGroupChat) {
        newChat = { ...chat, chatId: chat._id }
      }
      else {
        let filteredList = chat?.peopleInvolvedInChat
          ?.filter(person => person._id !== loggedInUser);
        newChat = { ...filteredList[0], chatId: chat._id }
      }


      newChat.isMsgPending = true;


      console.log("newChat", newChat);

      setChats(prevChats => [...prevChats, newChat])
    }


  }
  async function getAllChats() {
    try {
      let res = await axiosClient.get(`/chat/allchats/${loggedInUser}`);
      if (res?.data.length > 0) {
        let data1 = res.data.map(chat => {
          if (chat.isGroupChat) {
            return { ...chat, chatId: chat._id }
          }
          else {
            let filteredList = chat?.peopleInvolvedInChat
              ?.filter(person => person._id !== loggedInUser);
            return { ...filteredList[0], chatId: chat._id }
          }
        });
        setChats(data1)
        console.log('data', data1)
      }
    }
    catch (err) {

    }
  }
  async function getChat(chat) {
    try {
      setSelectedChat(chat)
      let res;
      if (chat?.chatId) {
        res = await axiosClient.get(`/chat/${chat.chatId}`);
      }
      else {
        res = await axiosClient.get(`/chat/between/${chat._id}/${loggedInUser}`);
      }
      console.log("res id", res);
      if (res?.data) {
        console.log('messa');
        socket.emit('join chat', res?.data?._id)  ///_id is chatId
        setMessages(res?.data?.messages);
        if(chat.chatId){
          let allChats = chats?.map(c=>{
             if(c.chatId === chat.chatId ){
                 c.isMsgPending = false;
             }
             return chat
          })
          setChats(allChats)
        }
      }
    }
    catch (err) {

      setMessages(null)
    }

  }
  async function sendMessage() {
    console.log('selectedChat', selectedChat)
    if (msgInput === '') {
      alert('Type something to send msg...');
      return;
    }
    let res
    if (selectedChat.isGroupChat) {
      res = await axiosClient.post('/chat', {
        isGroupChat: true,
        chatId: selectedChat._id,
        message: {
          content: msgInput,
          senderId: loggedInUser,
          // receiverId: selectedChat._id
        }
      })
    }
    else {
      res = await axiosClient.post('/chat', {
        isGroupChat: false,
        chatId: selectedChat?.chatId,
        message: {
          content: msgInput,
          senderId: loggedInUser,
          receiverId: selectedChat._id
        }
      })
    }
    console.log("res", res)
    if (res.data) {
      setMessages(prev => {
        if (prev?.length > 0) {
          return [...prev, res.data];
        }
        else return [res.data]
      }
      );
      setMsgInput('');
      if (res.data.isNew) {
        //modify the selectedchat and chats array
        socket.emit('new message', res.data.chatId, { ...res.data, chatId: res.data.chatId })
        setSelectedChat(prev => { return { ...prev, chatId: res.data.chatId } })
      }
      else {
        socket.emit('new message', selectedChat.chatId, { ...res.data, chatId: selectedChat.chatId })
      }
    }

  }
  function handleChange(e) {
    setMsgInput(e.target.value)
  }
  async function handleUserSearchChange(e) {
    let users
    if (e.target.value === '') setSearchResults([])
    if (e.target.value.length > 0) {
      users = await axiosClient.get(`/user/searchuser/${e.target.value}`);
    }

    if (users?.data?.length > 0) {
      setSearchResults(users?.data)
    }

  }
  async function addUserInChatList(user) {
    setSearchResults([])
    await getChat(user)
    const foundChat = chats.find(chat => chat._id === user._id);
    if (foundChat) {
      let filteredChats = chats.filter(chat => chat._id !== foundChat._id);
      filteredChats.unshift(foundChat);
      setChats(filteredChats)
    }
    else
      setChats(prev => {
        return [user, ...prev]
      })

  }
  return (
    <div className={style.container}>
      <div className={style.chatContainer}>
        <section className={style.usersSection}>
          <p>My Chats</p>
          <button className={style.createNewGrpBtn} onClick={() => setShowModal(true)}>New group</button>
          {
            showModal && <Modal setShowModal={setShowModal} />
          }
          {chats?.length > 0 ? chats?.map(chat =>
            <div key={chat._id} className={style.user} onClick={() => getChat(chat)}
              style={{ backgroundColor: chat?.isMsgPending ? "red" : '' }}>
              <img className={style.profilePic} src={chat?.pic ?? 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'} alt="profile pic" />
              {chat.name ?? chat.groupName}
              {/* {chat?.isMsgPending && <p style={{ backgroundColor: "red" }}>...1...</p>} */}
            </div>) : "NO chats"}
        </section>
        <section className={style.chatsSection}>
          <div className={style.searchContainer}>
            <input type="text" className={style.searchUserInput}
              onChange={handleUserSearchChange} placeholder="🔍Search user..." />
            <div className={style.dropdownContainer}>
              {searchResults?.length > 0 && searchResults.map(user => <p key={user?._id}
                onClick={() => addUserInChatList(user)}
                className={style.searchResult}>
                <img className={style.profilePic}
                  src={user?.pic ?? 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'}
                  alt="profile pic" /><span style={{ marginLeft: '5px' }}>{user.name}</span></p>)}


            </div>
          </div>
          <div className={style.messages}>
            {messages?.length > 0 ? messages?.map(message => (<p key={message._id}
              style={{ textAlign: message.senderId === loggedInUser ? 'right' : 'left' }}>
              <span className={style.message}>{message.content}</span>
            </p>)) : <div className={style.emptyState}>

              Select a chat to see Messages...
            </div>}
          </div>
          <div className={style.sendMsgSection}>
            <input type="text" className={style.addMessageInput} placeholder="Send a message.."
              value={msgInput}
              onChange={handleChange} />
            <button onClick={sendMessage}>Send</button>
          </div>

        </section>
      </div>
    </div>
  )
}

export default Chats