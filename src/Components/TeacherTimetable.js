import { React,useEffect,useState } from "react";
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function TeacherTimetable() {
    const[teacher,setTeacher] = useState({})
    const[finalOut,setFinalOut] = useState({})

    useEffect(()=>{
        axios.get(`http://localhost:3001/getTeachers`)
        .then(response => {
                let preTeachers = {}
                if(response.data.teachers.length !== 0){
                    response.data.teachers.map((item)=>{
                        preTeachers[item.ID] = {}
                        preTeachers[item.ID] = {
                            Name : item.Name,
                            Email : item.Email,
                            ID : item.ID,
                            Subjects : item.Subjects,
                        }
                    })
                    setTeacher(preTeachers)
                }
        })
        .catch(error => {
            console.error('Error fetching admins:', error);
        });


        axios.get(`http://localhost:3001/getTT`)
        .then(response => {
                setFinalOut(response.data.tt[0].Timetable)
        })
        .catch(error => {
            console.error('Error fetching admins:', error);
        });
    },[])

    const timetable ={
        Monday: { per1: '', per2: '', per3: '', per4: '', per5: '', per6: '', per7: '', per8: '' },
        Tuesday: { per1: '', per2: '', per3: '', per4: '', per5: '', per6: '', per7: '', per8: '' },
        Wednesday: { per1: '', per2: '', per3: '', per4: '', per5: '', per6: '', per7: '', per8: '' },
        Thursday: { per1: '', per2: '', per3: '', per4: '', per5: '', per6: '', per7: '', per8: '' },
        Friday: { per1: '', per2: '', per3: '', per4: '', per5: '', per6: '', per7: '', per8: '' },
    };

    const keysofFinalout = Object.keys(finalOut)
    console.log(keysofFinalout)
    return ( 
        <>
            {
                keysofFinalout.length !== 0 &&
                <div>
                    <h2 className='text-center'>TimeTable For Teachers</h2>  
                    {
                        Object.keys(teacher).map(list=>{  
                            return   <div className='mt-3 border p-1 rounded' style={{boxShadow:'0px 0px 20px -7px gray'}} key={list}>
                                        <h3 className='text-center'>{teacher[list]['Name']} (ID : {list})</h3>
                                        <table className='table stu-teacher-tt m-auto'>
                                            <thead className='w-100'>
                                                <tr className='w-100'>
                                                    <td className='tt-td border'><strong>DAY</strong></td>
                                                    <td className='tt-td border'><strong>Period 1</strong></td>
                                                    <td className='tt-td border'><strong>Period 2</strong></td>
                                                    <td className='tt-td border'><strong>Period 3</strong></td>
                                                    <td className='tt-td border'><strong>Period 4</strong></td>
                                                    <td className='tt-td border'><strong>Period 5</strong></td>
                                                    <td className='tt-td border'><strong>Period 6</strong></td>
                                                    <td className='tt-td border'><strong>Period 7</strong></td>
                                                    <td className='tt-td border'><strong>Period 8</strong></td>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {Object.keys(timetable).map((day, index) => (
                                                    <tr key={index}>
                                                        <td className='tt-td border'><strong>{day}</strong></td>
                                                        
                                                        {Object.keys(timetable[day]).map((period, idx) => (
                                                            <td key={idx} className='tt-td border'>
                                                                {
                                                                    keysofFinalout.map(p=>{
                                                                        if(finalOut[p][day][period] !== '' && finalOut[p][day][period]['ID'] === teacher[list]['ID']){
                                                                            return <div>
                                                                                        <p className="m-0">{p}</p>
                                                                                        <p className="m-0">{finalOut[p][day][period]['Subject']}</p>
                                                                                   </div>
                                                                        }
                                                                    })
                                                                }
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                        })
                    }
                    <div className='mt-3 border p-1 rounded' style={{boxShadow:'0px 0px 20px -7px gray'}}>
                        <h3 className='text-center'>PET</h3>
                        <table className='table stu-teacher-tt m-auto'>
                            <thead className='w-100'>
                                <tr className='w-100'>
                                    <td className='tt-td border'><strong>DAY</strong></td>
                                    <td className='tt-td border'><strong>Period 1</strong></td>
                                    <td className='tt-td border'><strong>Period 2</strong></td>
                                    <td className='tt-td border'><strong>Period 3</strong></td>
                                    <td className='tt-td border'><strong>Period 4</strong></td>
                                    <td className='tt-td border'><strong>Period 5</strong></td>
                                    <td className='tt-td border'><strong>Period 6</strong></td>
                                    <td className='tt-td border'><strong>Period 7</strong></td>
                                    <td className='tt-td border'><strong>Period 8</strong></td>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.keys(timetable).map((day, index) => (
                                    <tr key={index}>
                                        <td className='tt-td border'><strong>{day}</strong></td>
                                        
                                        {Object.keys(timetable[day]).map((period, idx) => (
                                            <td key={idx} className='tt-td border'>
                                                {
                                                    keysofFinalout.map(p=>{
                                                        if(finalOut[p][day][period] !== '' && finalOut[p][day][period]['ID'] ==='PET'){
                                                            return <div className="border m-1 text-center">
                                                                        <p className="m-0">{p}</p>
                                                                        <p className="m-0">{finalOut[p][day][period]['Subject']}</p>
                                                                    </div>
                                                        }
                                                    })
                                                }
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className='mt-3 border p-1 rounded' style={{boxShadow:'0px 0px 20px -7px gray'}}>
                        <h3 className='text-center'>Karate</h3>
                        <table className='table stu-teacher-tt m-auto'>
                            <thead className='w-100'>
                                <tr className='w-100'>
                                    <td className='tt-td border'><strong>DAY</strong></td>
                                    <td className='tt-td border'><strong>Period 1</strong></td>
                                    <td className='tt-td border'><strong>Period 2</strong></td>
                                    <td className='tt-td border'><strong>Period 3</strong></td>
                                    <td className='tt-td border'><strong>Period 4</strong></td>
                                    <td className='tt-td border'><strong>Period 5</strong></td>
                                    <td className='tt-td border'><strong>Period 6</strong></td>
                                    <td className='tt-td border'><strong>Period 7</strong></td>
                                    <td className='tt-td border'><strong>Period 8</strong></td>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.keys(timetable).map((day, index) => (
                                    <tr key={index}>
                                        <td className='tt-td border'><strong>{day}</strong></td>
                                        
                                        {Object.keys(timetable[day]).map((period, idx) => (
                                            <td key={idx} className='tt-td border'>
                                                {
                                                    keysofFinalout.map(p=>{
                                                        if(finalOut[p][day][period] !== '' && finalOut[p][day][period]['ID'] ==='Karate'){
                                                            return <div className="border m-1 text-center">
                                                                        <p className="m-0">{p}</p>
                                                                        <p className="m-0">{finalOut[p][day][period]['Subject']}</p>
                                                                    </div>
                                                        }
                                                    })
                                                }
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            }
        </>
        
  
     );
}

export default TeacherTimetable;