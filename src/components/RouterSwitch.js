import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "../App";
import AddItem from "./AddItem";

const RouterSwitch = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/addItem" element={<AddItem />} />
      </Routes>
    </BrowserRouter>
  )
}

export default RouterSwitch;
