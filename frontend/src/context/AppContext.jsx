import { useContext, useEffect, useState } from "react";
import { createContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const AppContext = createContext();

export const AppProvider = ({ children }) => {


    const navigate = useNavigate();
    const [token, setToken] = useState(null);
    const [blogs, setBlogs] = useState([]);
    const [filter, setFilter] = useState("");
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')))

    const fetchBlogs = async () => {
        try {
            const { data } = await axios.get("/blogs/blog");
            data.success ? setBlogs(data.data.blogs) : toast.error(data.data.message);
        } catch (error) {
            toast.error(error.message);
        }
    }

    useEffect(() => {
        
        fetchBlogs();

    }, []);

  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");

    if (storedUser) {
        setUser(JSON.parse(storedUser));
    }

    if (token) {
        setToken(token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
}, []);

    useEffect(() => {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        } else {
            localStorage.removeItem("user");
        }
    }, [user]);

    // ✅ Keep token in sync with axios headers
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            localStorage.setItem("token", token);
        } else {
            delete axios.defaults.headers.common["Authorization"];
            localStorage.removeItem("token");
        }
    }, [token]);

    const value = {
        axios,
        navigate,
        token,
        setToken,
        blogs,
        setBlogs,
        filter,
        setFilter,
        user,
        setUser
    }

    return (


        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => {
    return useContext(AppContext);
}