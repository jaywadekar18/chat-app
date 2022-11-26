import React, { useState, useEffect, useRef } from 'react'
import axiosClient from '../services/axiosService';
import styles from '../styles/modal.module.css'
import { getValueFromLocalStorage } from '../services/localStorageService'
let loggedInUser
function Modal({ setShowModal }) {
    const groupName = useRef(null)
    const [searchResult, setSearchResult] = useState([]);
    const [usersInGroup, setUsersInGroup] = useState([])
    useEffect(() => {
        loggedInUser = getValueFromLocalStorage('userId');
    }, [])

    async function handleChange(e) {
        let users
        if (e.target.value.length > 0) {
            users = await axiosClient.get(`/user/searchuser/${e.target.value}`);
        }
        else setSearchResult([])

        if (users?.data?.length > 0) {
            let filteredList = users?.data.filter(user => user._id !== loggedInUser)
            setSearchResult(filteredList)
        }

    }
    function addUserInGroup(user) {
        const foundUser = usersInGroup.find(member=>member._id === user._id);
        if(foundUser){alert('this user is already added in grp!!');return}
        setUsersInGroup(prev => [user, ...prev])

    }
    function removeUserFromGroup(userToBeRemoved) {
        setUsersInGroup(prev => {
            let filteredList = prev.filter(user => user._id !== userToBeRemoved._id)
            return filteredList
        })

    }
    function createGroup() {
        let grpMemberIds = usersInGroup?.map(user => user._id)
        axiosClient.post('/chat/creategroup', {
            groupName: groupName.current.value,
            groupMembers: [...grpMemberIds, getValueFromLocalStorage('userId')]
        })
    }
    return (
        <div className={styles.modalContainer} onClick={() => setShowModal(false)}>
            <div className={styles.contentContainer} onClick={(e) => e.stopPropagation()}>

                <button className={styles.closeBtn} onClick={() => setShowModal(false)}>✖️</button>
                <p className={styles.modalTitle}>Create group</p>
                <input className={styles.inputFields} ref={groupName} placeholder="Add a Group Name.." />
                <p>Add members in group</p>
                <div className={styles.grpMembers}>
                    {
                        usersInGroup?.length > 0 && usersInGroup.map(groupMember =>
                            <span className={styles.grpMember} key={groupMember._id}>{
                                groupMember.name}
                                <span onClick={() => removeUserFromGroup(groupMember)}>➖</span>
                            </span>)
                    }
                </div>
                <div className={styles.searchContainer}>
                    <input className={styles.searchInput} onChange={handleChange} placeholder="Search users.." />
                    <div className={styles.searchResults}>
                        {
                            searchResult?.length > 0 && searchResult.map(user =>
                                <div className={styles.searchResult} key={user._id} onClick={() => addUserInGroup(user)}>
                                    <img src={user.pic} height="20px" />
                                    {user.name} ➕
                                </div>)
                        }
                    </div>
                </div>
                {/* <button disabled={usersInGroup?.length <= 0} onClick={createGroup}>Create Group</button> */}
            </div>
        </div>
    )
}

export default Modal