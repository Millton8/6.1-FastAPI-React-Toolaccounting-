import { NavLink } from "react-router-dom";
import "./css/navigation.css"
export default function Nav() {
    return (

        <div className="navigation">
            <NavLink className="navitabs" to="/">Учет инструментов</NavLink>
            <NavLink className="navitabs" to="/users">Пользователи</NavLink>
            <NavLink className="navitabs" to="/tools">Инструменты</NavLink>
        </div>
    )
}