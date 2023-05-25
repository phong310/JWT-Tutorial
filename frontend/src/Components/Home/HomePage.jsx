import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteUsers, getAllUsers } from "../../redux/apiRequest";
import { createAxios } from "../../createInstance";
import { useNavigate } from "react-router-dom";
import "./home.css";
import { loginSuccess } from "../../redux/authSlice";

const HomePage = () => {
  const user = useSelector((state) => state.auth.login?.currentUser);
  // "?" Optional chaining
  const userList = useSelector((state) => state.users.users?.allUsers);
  const errMessage = useSelector((state) => state.users?.msg);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let axiosJWT = createAxios(user, dispatch, loginSuccess)


  const HandleDelete = (id) => {
    deleteUsers(user?.accessToken, dispatch, id, axiosJWT);
  }

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
    if (user?.accessToken) {
      getAllUsers(user?.accessToken, dispatch, axiosJWT);
    }
  }, []);

  return (
    <main className="home-container">
      <div className="home-title">User List</div>
      <div className="home-role">{`Your role: ${user?.admin ? `Admin` : `User`}`}</div>
      <div className="home-userlist">
        {userList?.map((user) => {
          return (
            <div className="user-container">
              <div className="home-user">{user.username}</div>
              <div className="delete-user" onClick={() => { HandleDelete(user._id) }}> Delete </div>
            </div>
          );
        })}
      </div>
      <div className="errorMsg">{errMessage}</div>
    </main>
  );
};

export default HomePage;
