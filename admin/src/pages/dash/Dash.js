import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Dash.scss';

const Dash = () => {
    const [users, setUsers] = useState([]);
    const nameRef = useRef();
    const surnameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const messageRef = useRef();

    const isIncorrectEmail = (mail) => {
        return !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(mail);
    };

    const getUsers = async () => {
        try {
            const response = await axios.get('/api/users');

            if (response.data.success) {
                setUsers(response.data.users);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const notifySuccess = (message) => toast.success(message);
    const notifyError = (message) => toast.error(message);

    const validateForm = () => {
        const name = nameRef.current.value;
        const surname = surnameRef.current.value;
        const email = emailRef.current.value;
        const password = passwordRef.current.value;

        if (
            name.length < 5 ||
            surname.length < 5 ||
            password.length < 5 ||
            isIncorrectEmail(email)
        ) {
            return false;
        }

        return true;
    };

    const addUser = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            console.log('Incorrect data');
            return;
        }

        const data = {
            name: nameRef.current.value,
            surname: surnameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value,
        };

        try {
            const response = await axios.post('/api/users', data);

            if (response.data.success) {
                getUsers();
                notifySuccess('User successfully added');
                nameRef.current.value = '';
                surnameRef.current.value = '';
                emailRef.current.value = '';
                passwordRef.current.value = '';
            }
        } catch (error) {
            console.error(error);
            notifyError('Error adding user');
        }
    };

    const removeUser = async (id) => {
        try {
            const response = await axios.post('/api/users/remove', { id });

            if (response.data.success) {
                getUsers();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const sendMessage = async (email) => {
        const message = messageRef.current.value;

        if (message.trim() === '') {
            console.log('Message is empty');
            return;
        }

        try {
            const response = await axios.post('/api/send-message', { email, message });

            if (response.data.success) {
                notifySuccess('Message sent successfully');
                messageRef.current.value = '';
            }
        } catch (error) {
            console.error(error);
            notifyError('Error sending message');
        }
    };

    useEffect(() => {
        getUsers();
    }, []);

    return (
        <div className="Dashboard-container">
            <ToastContainer theme="dark" position="bottom-right" />
            <h1>Welcome to my mailer dash</h1>
            <form>
                <input ref={nameRef} type="text" placeholder="Name" />
                <input ref={surnameRef} type="text" placeholder="Surname" />
                <input ref={emailRef} type="text" placeholder="Email" />
                <input ref={passwordRef} type="password" placeholder="Password" />
                <button onClick={addUser}>Add User</button>
            </form>
            <h2 className="emailList">Email List</h2>
            <div className="listEmails">
                <div className="field">
                    <h3>Name | Surname | Email | Password</h3>
                </div>
                {users.map((user) => (
                    <div key={user._id} className="users">
                        <p className="name">
                            {user.name.length < 25 ? user.name : `${user.name.substr(0, 22)}...`}
                        </p>
                        <p className="surname">
                            {user.surname.length < 25 ? user.surname : `${user.surname.substr(0, 22)}...`}
                        </p>
                        <p className="email">
                            {user.email.length < 25 ? user.email : `${user.email.substr(0, 22)}...`}
                        </p>
                        <p className="password">
                            {user.password.length < 25 ? user.password : `${user.password.substr(0, 22)}...`}
                        </p>
                        <button onClick={() => removeUser(user._id)}>Remove User</button>
                        <button onClick={() => sendMessage(user.email)}>Send Message</button>
                    </div>
                ))}
            </div>
            <div className="messageContainer">
                <h2>Send Message</h2>
                <input ref={messageRef} type="text" placeholder="Message" />
                <button onClick={() => sendMessage(emailRef.current.value)}>Send</button>
            </div>
        </div>
    );
};

export default Dash;