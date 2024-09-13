import Admin from "./Components/Admin";
import TeacherTimetable from "./Components/TeacherTimetable";
import {Routes, Route } from "react-router-dom";

function App() {
  return (
        <>
            <Routes>
              <Route path="/" element={<Admin></Admin>}></Route>
              <Route path="/TeacherTimetable" element={<TeacherTimetable></TeacherTimetable>}></Route>
            </Routes>
        </>
  );
}

export default App;
