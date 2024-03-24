import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";
import Nav from './Navigation';
import NotFound from './NotFound';
import ToolAccounting from './ToolAccounting';
import Tools from './Tools';
import Users from './Users';
import "./css/main.css"


function App() {

    return (


        <BrowserRouter>
            <div className="main">

                <Nav/>
                <Routes>
                    <Route path="/" element={<ToolAccounting />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/tools" element={<Tools />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>

            </div>
        </BrowserRouter>
    )
   
}

export default App;