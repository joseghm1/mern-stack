import React, { useState } from 'react';

function Login() {
    const [message, setMessage] = useState<string>('');
    const [loginName, setLoginName] = useState<string>('');
    const [loginPassword, setPassword] = useState<string>('');

    const handleSetLoginName = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setLoginName(e.target.value);
    };

    const handleSetPassword = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setPassword(e.target.value);
    };

    const doLogin = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();

        const obj = { Login: loginName, Password: loginPassword }; // Match API field names
        const js = JSON.stringify(obj);

        try {
            const response = await fetch('https://mern-stack-backend-9gvk.onrender.com/api/login', {
                method: 'POST',
                body: js,
                headers: { 'Content-Type': 'application/json' },
            });

            const res = await response.json(); // Parse JSON directly

            if (res.id <= 0) {
                setMessage('User/Password combination incorrect');
            } else {
                const user = {
                    firstName: res.FirstName, // Match API response
                    lastName: res.LastName,   // Match API response
                    id: res.id,
                };
                localStorage.setItem('user_data', JSON.stringify(user));
                setMessage('');
                window.location.href = '/cards';
            }
        } catch (error: any) {
            alert(error.toString());
        }
    };

    return (
        <div id="loginDiv">
            <span id="loginResult">{message}</span><br />
            <form onSubmit={doLogin}>
                <input
                    type="text"
                    id="loginName"
                    placeholder="Username"
                    value={loginName}
                    onChange={handleSetLoginName}
                /><br />
                <input
                    type="password"
                    id="loginPassword"
                    placeholder="Password"
                    value={loginPassword}
                    onChange={handleSetPassword}
                /><br />
                <input
                    type="submit"
                    id="loginButton"
                    className="buttons"
                    value="Do It"
                />
            </form>
            <span id="loginResult"></span>
        </div>
    );
}

export default Login;