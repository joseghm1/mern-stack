function LoggedInName() {
    const _ud = localStorage.getItem('user_data');
    const ud = _ud ? JSON.parse(_ud) : { id: '', firstName: '', lastName: '' };
    const { id: userId, firstName, lastName } = ud;

    const doLogout = (event: React.MouseEvent<HTMLButtonElement>): void => {
        event.preventDefault();
        localStorage.removeItem('user_data');
        window.location.href = '/';
    };

    return (
        <div id="loggedInDiv">
            <span id="userName">Logged In As {firstName} {lastName}</span><br />
            <button
                type="button"
                id="logoutButton"
                className="buttons"
                onClick={doLogout}
            >
                Log Out
            </button>
        </div>
    );
}

export default LoggedInName;