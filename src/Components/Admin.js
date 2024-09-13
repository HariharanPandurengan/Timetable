import React, { useEffect, useState } from 'react';
import "../App.css"
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import Select from 'react-select';
import TeacherTimetable from './TeacherTimetable';

function Admin() {
    const [t_name , setT_name] = useState('');
    const [t_email , setT_email] = useState('');
    const [t_id , setT_id] = useState('');
    const [teacher , setTeacher] = useState({});
    const [subjects, setSubjects] = useState([{ subject: '', class: ''}]);
    const [selectedOptions, setSelectedOptions] = useState({});
    const [sections , setSections] = useState({
        'STD 1' : '',
        'STD 2' : '',
        'STD 3' : '',
        'STD 4' : '',
        'STD 5' : '',
        'STD 6' : '',
        'STD 7' : '',
        'STD 8' : '',
        'STD 9' : '',
        'STD 10' : '',
        'STD 11' : '',
        'STD 12' : '',
    })
    const [subsForClasses,setSubsForClasses] = useState()
    const [genTT , setGentt] = useState({})
    const [teachersForStd,setTeachersForStd] = useState([]);
    const [finalOut,setFinalOut] = useState([]);
    const [checkvalue11,setCheckvalue11] = useState('')
    const [checkvalue12,setCheckvalue12] = useState('')
    const [groupsForSections11,setGroupsForSections11] = useState({})
    const [groupsForSections12,setGroupsForSections12] = useState({})
    const timetable ={
        Monday: { per1: '', per2: '', per3: '', per4: '', per5: '', per6: '', per7: '', per8: '' },
        Tuesday: { per1: '', per2: '', per3: '', per4: '', per5: '', per6: '', per7: '', per8: '' },
        Wednesday: { per1: '', per2: '', per3: '', per4: '', per5: '', per6: '', per7: '', per8: '' },
        Thursday: { per1: '', per2: '', per3: '', per4: '', per5: '', per6: '', per7: '', per8: '' },
        Friday: { per1: '', per2: '', per3: '', per4: '', per5: '', per6: '', per7: '', per8: '' },
    };
 
    const options = [
        { value: 'Tamil', label: 'Tamil' },
        { value: 'English', label: 'English' },
        { value: 'Maths', label: 'Maths' },
        { value: 'Science', label: 'Science' },
        { value: 'Social Science', label: 'Social Science' },
        { value: 'PET', label: 'PET' },
        { value: 'Physics', label: 'Physics' },
        { value: 'Chemistry', label: 'Chemistry' },
        { value: 'Computer Science', label: 'Computer Science' },
        { value: 'Biology', label: 'Biology' },
        { value: 'Yoga', label: 'Yoga' },
        { value: 'Hindi', label: 'Hindi' },
        { value: 'Economy', label: 'Economy' },
        { value: 'Business Maths', label: 'Business Maths' },
        { value: 'Accountancy', label: 'Accountancy' },
        { value: 'Commerce', label: 'Commerce' },
        { value: 'Economics', label: 'Economics' },
        { value: 'EAS', label: 'EAS' },

    ];

    // const handleChange = (index, selectedOptionsforclass) => {
    //     const newSelectedOptions = [...selectedOptions];
    //     newSelectedOptions[index] = selectedOptionsforclass;
    //     setSelectedOptions(newSelectedOptions);
    // };


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


        axios.get(`http://localhost:3001/getSubjectsList`)
        .then(response => {
                if(response.data.subs.length !== 0){
                    setSelectedOptions(response.data.subs[0].Subjects)
                    setSections(response.data.subs[0].Sections)
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

   
    const handleSubjectChange = (index, value) => {
        const newSubjects = [...subjects];
        newSubjects[index].subject = value;
        setSubjects(newSubjects);
    };

    const handleClassChange = (index, value) => {
        const newSubjects = [...subjects];
        newSubjects[index].class = value;
        setSubjects(newSubjects);
    };

    const handleAddSubject = () => {
        setSubjects([...subjects, { subject: '', class: ''}]);
    };

    const handleDeleteSubject = (index) => {
        const newSubjects = [...subjects];
        newSubjects.splice(index, 1);
        setSubjects(newSubjects);
    };

    function addTeacher(e){
        e.preventDefault()
        const hasEmptySelection = subjects.some(subject => subject.subject === '' || subject.class === '');
        if(t_name === ''){
            alert('Enter teacher name !!!')
        }
        // else if(t_email === ''){
        //     alert('Enter teacher email !!!')
        // }
        else if(t_id === ''){
            alert('Enter teacher ID !!!')
        }
        else if(hasEmptySelection) {
            alert('Select All Subjects and Class Fields !!!');
        }
        else{
            axios.post('http://localhost:3001/checkTeacherID', {
                TeacherID: t_id
            }).then(response => {
                if (response?.data?.message === 'ID already exist') {
                    alert("Teacher ID already Exist");
                }
                else{
    
                    axios.post('http://localhost:3001/createTeacher', {
                        TeacherID : t_id,
                        TeacherDetails : {
                            Name : t_name,
                            Email : t_email,
                            ID : t_id,
                            Subjects : subjects
                        }
    
                    }).then(response => {
                        if(response?.data.message === 'Teacher added successfully'){
                            alert("Teacher added successfully")

                            axios.get(`http://localhost:3001/getTeachers`)
                            .then(response => {
                                    let preTeachers = {}
                                    if(response.data.teachers.length !== 0){
                                        response.data.teachers.map((item) => {
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
                        } 
                        else{
                            alert("There are some issues in adding teacher!!!")
                        }
        
                        setT_name('')
                        setT_email('')
                        setT_id('')
                        setSubjects([{ subject: '', class: '' ,section : ''}])
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
                }
            }).catch(error => {
                console.error('Error:', error);
            });
            
        }
    }

    function saveSubjects(){
        const objfor11and12groups = {
            '11' : groupsForSections11,
            '12' : groupsForSections12
        }
        // console.log(sections)
        axios.post('http://localhost:3001/subjectsList', {
            subjectsList11and12 : objfor11and12groups,
            sections : sections
        }).then(response => {
            if(response?.data.message === 'Subjects list updated successfully'){
                alert('Subjects list updated successfully')
        }})
        .catch(error => {
            console.error('Error fetching admins:', error);
        });
   
    }

    function GenerateTT(){
        let prett = {...timetable}
        let newtt = {}
        const tecs = []
        for(let key in sections){
            
            const std = parseInt(key.match(/\d+/)[0])
            const vv = []
            Object.keys(teacher).map((items)=>{
                teacher[items]['Subjects'].map((item) => {
                    if (std === Number(item.class)) {
                        vv.push({Name : teacher[items].Name , ID : teacher[items].ID , Subject : item.subject})
                    }
                });
            });
            tecs.push(vv)
            for(let i=1;i<=Number(sections[key]);i++){
                let sec;
                if(i === 1){
                    sec = 'A'
                }
                else if(i === 2){
                    sec = 'B'
                }
                else if(i === 3){
                    sec = 'C'
                }
                else if(i === 4){
                    sec = 'D'
                }
                else if(i === 5){
                    sec = 'E'
                }
                else if(i === 6){
                    sec = 'F'
                }

                if(std === 11){
                    if(i === 1){
                        sec = 'A ' + ((selectedOptions[0].hasOwnProperty('11') && selectedOptions[0]['11'].hasOwnProperty('1')) ? selectedOptions[0]['11']['1'] : '')
                    }
                    else if(i === 2){
                        sec = 'B '  + ((selectedOptions[0].hasOwnProperty('11') && selectedOptions[0]['11'].hasOwnProperty('2')) ? selectedOptions[0]['11']['2'] : '')
                    }
                    else if(i === 3){
                        sec = 'C ' + ((selectedOptions[0].hasOwnProperty('11') && selectedOptions[0]['11'].hasOwnProperty('3')) ? selectedOptions[0]['11']['3'] : '')
                    }
                    else if(i === 4){
                        sec = 'D ' + ((selectedOptions[0].hasOwnProperty('11') && selectedOptions[0]['11'].hasOwnProperty('4')) ? selectedOptions[0]['11']['4'] : '')
                    }
                    else if(i === 5){
                        sec = 'E ' + ((selectedOptions[0].hasOwnProperty('11') && selectedOptions[0]['11'].hasOwnProperty('5')) ? selectedOptions[0]['11']['5'] : '')
                    }
                    else if(i === 6){
                        sec = 'F ' + ((selectedOptions[0].hasOwnProperty('11') && selectedOptions[0]['11'].hasOwnProperty('6')) ? selectedOptions[0]['11']['6'] : '')
                    }
                }

                if(std === 12){
                    if(i === 1){
                        sec = 'A ' + ((selectedOptions[0].hasOwnProperty('12') && selectedOptions[0]['12'].hasOwnProperty('1')) ? selectedOptions[0]['12']['1'] : '')
                    }
                    else if(i === 2){
                        sec = 'B '  + ((selectedOptions[0].hasOwnProperty('12') && selectedOptions[0]['12'].hasOwnProperty('2')) ? selectedOptions[0]['12']['2'] : '')
                    }
                    else if(i === 3){
                        sec = 'C ' + ((selectedOptions[0].hasOwnProperty('12') && selectedOptions[0]['12'].hasOwnProperty('3')) ? selectedOptions[0]['12']['3'] : '')
                    }
                    else if(i === 4){
                        sec = 'D ' + ((selectedOptions[0].hasOwnProperty('12') && selectedOptions[0]['12'].hasOwnProperty('4')) ? selectedOptions[0]['12']['4'] : '')
                    }
                    else if(i === 5){
                        sec = 'E ' + ((selectedOptions[0].hasOwnProperty('12') && selectedOptions[0]['12'].hasOwnProperty('5')) ? selectedOptions[0]['12']['5'] : '')
                    }
                    else if(i === 6){
                        sec = 'F ' + ((selectedOptions[0].hasOwnProperty('12') && selectedOptions[0]['12'].hasOwnProperty('6')) ? selectedOptions[0]['12']['6'] : '')
                    }
                }
                newtt[std+sec] = prett
               
            }
        }

        setGentt(newtt)
        setTeachersForStd(tecs)
    }

    useEffect(()=>{
        if(Object.keys(genTT).length !== 0){
            let copyGenTT = {...genTT}  

            // Function to deep copy an object
            function deepCopy(obj) {
                let copy = {};
                for (let key in obj) {
                    if (typeof obj[key] === 'object' && obj[key] !== null) {
                        copy[key] = deepCopy(obj[key]);
                    } else {
                        copy[key] = obj[key];
                    }
                }
                return copy;
            }

            let deepCopied = deepCopy(copyGenTT);

            // 1st STD
            deepCopied['1A']['Monday']['per1'] = {
                ID : 1,
                Subject : 'Tamil',
                Name : 'R.Sudha'
            }
            deepCopied['1A']['Tuesday']['per5'] = {
                ID : 4,
                Subject : 'Abacus',
                Name : 'G.Hemalatha'
            }
            deepCopied['1A']['Wednesday']['per1'] = {
                ID : 3,
                Subject : 'Hindi',
                Name : 'Devi'
            }
            deepCopied['1B']['Friday']['per1'] = {
                ID : 3,
                Subject : 'Hindi',
                Name : 'Devi'
            }

            // 2nd STD
            deepCopied['2A']['Monday']['per1'] = {
                ID : 5,
                Subject : 'Tamil',
                Name : 'R.Abinayasundari'
            }
            deepCopied['2A']['Tuesday']['per1'] = {
                ID : 3,
                Subject : 'Hindi',
                Name : 'Devi'
            }

            // 4th STD
            deepCopied['4A']['Monday']['per1'] = {
                ID : 12,
                Subject : 'Tamil',
                Name : 'S.DIVYAMEENATCHI'
            }

            // 5th STD
            deepCopied['5A']['Monday']['per1'] = {
            ID : 14,
            Subject : 'Tamil',
            Name : 'N.Lalitha'
            }

            // 6th STD
            deepCopied['6A']['Monday']['per1'] = {
                ID : 32,
                Subject : 'Tamil',
                Name : 'Stella Mary'
            }
            deepCopied['6A']['Wednesday']['per1'] = {
                ID : 24,
                Subject : 'English',
                Name : 'Nivedha'
            }
            deepCopied['6A']['Tuesday']['per1'] = {
                ID : 4,
                Subject : 'Maths',
                Name : 'G.Hemalatha'
            }
            deepCopied['6A']['Monday']['per4'] = {
                ID : 29,
                Subject : 'Social Science',
                Name : 'M.Karthika'
            }
            deepCopied['6A']['Wednesday']['per3'] = {
                ID : 24,
                Subject : 'Science',
                Name : 'Nivedha'
            }
            deepCopied['6A']['Thursday']['per5'] = {
                ID : 23,
                Subject : 'GK',
                Name : 'Durga'
            }

            deepCopied['6B']['Monday']['per5'] = {
                ID : 23,
                Subject : 'Science',
                Name : 'Durga'
            }

            // 7th STD
            deepCopied['7A']['Monday']['per1'] = {
                ID : 33,
                Subject : 'Tamil',
                Name : 'Saravana Priyan'
            }
            deepCopied['7A']['Tuesday']['per1'] = {
                ID : 24,
                Subject : 'English',
                Name : 'Nivedha'
            }
            deepCopied['7A']['Wednesday']['per1'] = {
                ID : 4,
                Subject : 'Maths',
                Name : 'G.Hemalatha'
            }
            deepCopied['7A']['Monday']['per5'] = {
                ID : 29,
                Subject : 'Social Science',
                Name : 'M.Karthika'
            }
            deepCopied['7A']['Wednesday']['per4'] = {
                ID : 24,
                Subject : 'Science',
                Name : 'Nivedha'
            }
            deepCopied['7A']['Thursday']['per6'] = {
                ID : 23,
                Subject : 'GK',
                Name : 'Durga'
            }
            deepCopied['7A']['Thursday']['per6'] = {
                ID : 6,
                Subject : 'Computer Science',
                Name : 'Eniya'
            }

            // 8th STD
            deepCopied['8A']['Tuesday']['per1'] = {
                ID : 32,
                Subject : 'Tamil',
                Name : 'Stella Mary'
            }
            deepCopied['8A']['Monday']['per1'] = {
                ID : 36,
                Subject : 'English',
                Name : 'Sivaragini'
            }
            deepCopied['8A']['Wednesday']['per5'] = {
                ID : 4,
                Subject : 'Maths',
                Name : 'G.Hemalatha'
            }
            deepCopied['8A']['Monday']['per5'] = {
                ID : 28,
                Subject : 'Social Science',
                Name : 'S.Saraswathi'
            }
            deepCopied['8A']['Wednesday']['per5'] = {
                ID : 24,
                Subject : 'Science',
                Name : 'Nivedha'
            }
            deepCopied['8A']['Thursday']['per7'] = {
                ID : 25,
                Subject : 'GK',
                Name : 'Madhumathi'
            }
            deepCopied['8A']['Thursday']['per6'] = {
                ID : 37,
                Subject : 'Computer Science',
                Name : 'Ayeesha Begam'
            }

            deepCopied['8B']['Tuesday']['per5'] = {
                ID : 9,
                Subject : 'GK',
                Name : 'T.Shobana'
            }

            // 9th STD
            deepCopied['9A']['Tuesday']['per1'] = {
                ID : 33,
                Subject : 'Tamil',
                Name : 'Saravana Priyan'
            }
            deepCopied['9A']['Monday']['per1'] = {
                ID : 34,
                Subject : 'English',
                Name : 'S.Bhuvaneswari'
            }
            deepCopied['9A']['Wednesday']['per6'] = {
                ID : 4,
                Subject : 'Maths',
                Name : 'G.Hemalatha'
            }
            deepCopied['9A']['Monday']['per6'] = {
                ID : 29,
                Subject : 'Social Science',
                Name : 'M.Karthika'
            }
            deepCopied['9A']['Wednesday']['per5'] = {
                ID : 23,
                Subject : 'Science',
                Name : 'Durga'
            }
            deepCopied['9A']['Thursday']['per5'] = {
                ID : 4,
                Subject : 'GK',
                Name : 'G.Hemalatha'
            }
            deepCopied['9A']['Thursday']['per7'] = {
                ID : 37,
                Subject : 'Computer Science',
                Name : 'Ayeesha Begam'
            }

            // 10th STD
            deepCopied['10A']['Monday']['per1'] = { // A section
                ID : 31,
                Subject : 'Tamil',
                Name : 'R.Thiyagarajan'
            }
            deepCopied['10A']['Tuesday']['per1'] = {
                ID : 34,
                Subject : 'English',
                Name : 'S.Bhuvaneswari'
            }
            deepCopied['10A']['Wednesday']['per1'] = {
                ID : 16,
                Subject : 'Maths',
                Name : 'V.Kavitha'
            }
            deepCopied['10A']['Monday']['per7'] = {
                ID : 16,
                Subject : 'Maths',
                Name : 'V.Kavitha'
            }
            deepCopied['10A']['Thursday']['per4'] = {
                ID : 16,
                Subject : 'Maths',
                Name : 'V.Kavitha'
            }
            deepCopied['10A']['Tuesday']['per4'] = {
                ID : 16,
                Subject : 'Maths',
                Name : 'V.Kavitha'
            }


            deepCopied['10A']['Monday']['per3'] = {
                ID : 'Aruna',
                Subject : 'Maths',
                Name : 'Aruna'
            }
            deepCopied['10A']['Tuesday']['per2'] = {
                ID : 'Aruna',
                Subject : 'Maths',
                Name : 'Aruna'
            }
            deepCopied['10A']['Friday']['per2'] = {
                ID : 'Aruna',
                Subject : 'Maths',
                Name : 'Aruna'
            }
            deepCopied['10A']['Wednesday']['per2'] = {
                ID : 'Aruna',
                Subject : 'Maths',
                Name : 'Aruna'
            }


            deepCopied['10C']['Wednesday']['per7'] = {
                ID : 26,
                Subject : 'Social Science',
                Name : 'N.Vijayalakshmi'
            }
            deepCopied['10C']['Thursday']['per5'] = {
                ID : 26,
                Subject : 'Social Science',
                Name : 'N.Vijayalakshmi'
            }
            deepCopied['10C']['Monday']['per8'] = {
                ID : 26,
                Subject : 'Social Science',
                Name : 'N.Vijayalakshmi'
            }
            deepCopied['10C']['Tuesday']['per6'] = {
                ID : 26,
                Subject : 'Social Science',
                Name : 'N.Vijayalakshmi'
            }

            deepCopied['10C']['Friday']['per5'] = {
                ID : 27,
                Subject : 'Social Science',
                Name : 'S.Satheesh'
            }
            deepCopied['10C']['Friday']['per6'] = {
                ID : 27,
                Subject : 'Social Science',
                Name : 'S.Satheesh'
            }
            deepCopied['10C']['Thursday']['per8'] = {
                ID : 27,
                Subject : 'Social Science',
                Name : 'S.Satheesh'
            }
            deepCopied['10C']['Tuesday']['per7'] = {
                ID : 27,
                Subject : 'Social Science',
                Name : 'S.Satheesh'
            }


            deepCopied['10A']['Monday']['per6'] = {
                ID : 26,
                Subject : 'Social Science',
                Name : 'N.Vijayalakshmi'
            }
            deepCopied['10A']['Wednesday']['per5'] = {
                ID : 18,
                Subject : 'Science1',
                Name : 'R.Kamala'
            }
            deepCopied['10A']['Wednesday']['per6'] = {
                ID : 22,
                Subject : 'Science2',
                Name : 'Kowsalya'
            }

            deepCopied['10B']['Friday']['per1'] = { // B section
                ID : 33,
                Subject : 'Tamil',
                Name : 'Saravana Priyan'
            }
            deepCopied['10B']['Tuesday']['per1'] = {
                ID : 36,
                Subject : 'English',
                Name : 'Sivaragini'
            }
            deepCopied['10B']['Wednesday']['per2'] = {
                ID : 16,
                Subject : 'Maths',
                Name : 'V.Kavitha'
            }
            deepCopied['10B']['Friday']['per7'] = {
                ID : 27,
                Subject : 'Social Science',
                Name : 'S.Satheesh'
            }
            deepCopied['10B']['Tuesday']['per8'] = {
                ID : 27,
                Subject : 'Social Science',
                Name : 'S.Satheesh'
            }
            deepCopied['10B']['Wednesday']['per6'] = {
                ID : 24,
                Subject : 'Science1',
                Name : 'Nivedha'
            }
            deepCopied['10B']['Wednesday']['per4'] = {
                ID : 19,
                Subject : 'Science2',
                Name : 'A.Rajadurai'
            }
      

            //karate and yoga(9 and 11 std) period generation
            Object.keys(deepCopied).map(items=>{
                const std = parseInt(items.match(/\d+/)[0])
                const Karate = {
                    ID : 'Karate',
                    Subject : 'Karate'
                }
                const Yoga = {
                    ID : 'Yoga',
                    Subject : 'Yoga'
                }
                if(std < 6){
                    deepCopied[items]['Tuesday']['per3'] = Karate
                    deepCopied[items]['Thursday']['per3'] = Karate
                }

                if(std > 5 && std <= 8){ //
                    if(items.includes('A')){ //for girls
                        deepCopied[items]['Tuesday']['per4'] = Karate //6 to 8 girls karate
                    }
                    else{
                        deepCopied[items]['Thursday']['per4'] = Karate //6 to 8 boys karate
                    }
                }

                if(std === 9){
                    deepCopied[items]['Monday']['per3'] = Yoga
                    deepCopied[items]['Monday']['per4'] = Yoga
                }
                if(std === 11){
                    deepCopied[items]['Wednesday']['per3'] = Yoga
                    deepCopied[items]['Wednesday']['per4'] = Yoga
                }

                if(std === 1){
                    deepCopied[items]['Monday']['per2'] = Yoga
                }
                if(std === 2){
                    deepCopied[items]['Monday']['per4'] = Yoga
                }
                if(std === 3){
                    deepCopied[items]['Monday']['per6'] = Yoga
                }
                if(std === 4){
                    deepCopied[items]['Monday']['per8'] = Yoga
                }
                if(std === 5){
                    deepCopied[items]['Tuesday']['per2'] = Yoga
                }
                if(std === 6){
                    deepCopied[items]['Tuesday']['per6'] = Yoga
                }
                if(std === 7){
                    deepCopied[items]['Tuesday']['per8'] = Yoga
                }
                if(std === 8){
                    deepCopied[items]['Tuesday']['per2'] = Yoga
                }
                if(std === 10){
                    deepCopied[items]['Wednesday']['per4'] = Yoga
                }
                if(std === 12){
                    deepCopied[items]['Wednesday']['per6'] = Yoga
                }
            })

            // PET period generation
            Object.keys(deepCopied).map(items=>{
                const std = parseInt(items.match(/\d+/)[0])
                const days = ['Monday','Tuesday','Wednesday','Thursday','Friday']
                const PET = {
                    ID : 'PET',
                    Subject : 'PET'
                }
                let isCount2 = 0;
                for(let i=1 ; i<=8 ; i++){
                    let per = 'per'+i;
                    let bre = false
                
                    if(i!==1 && i!==4 && i!==5){
                        if(std > 2 && std !== 11){
                            for(let d=0;d<days.length;d++){
                                let bre2 = false;
                                const isIDExist = Object.keys(deepCopied).some(k=>{
                                    if(deepCopied[k][days[d]][per] !== ''){
                                        return deepCopied[k][days[d]][per]['ID'] === PET.ID
                                    } 
                                })
    
                                if(isIDExist === false){
                                    if(deepCopied[items][days[d]][per] === ''){
                                        deepCopied[items][days[d]][per] = PET
                                        
                                            bre = true
                                            break
                                        
                                    } 
                                }
                                else{
                                    for(let iw=1 ; iw<=8 ; iw++){
                                        let perInsideThisLoop = 'per'+iw;
                                        if(iw!==1 && iw!==4 && iw!==5){
                                            const isIDExistINL = Object.keys(deepCopied).some(k=>{
                                                if(deepCopied[k][days[d]][perInsideThisLoop] !== ''){
                                                    return deepCopied[k][days[d]][perInsideThisLoop]['ID'] === PET.ID
                                                }  
                                            })
                                            if(isIDExistINL === false){
                                                if(deepCopied[items][days[d]][perInsideThisLoop] === ''){
                                                    deepCopied[items][days[d]][perInsideThisLoop] = PET
                                                    
                                                        bre = true
                                                        bre2 = true
                                                        break
                                                    
                                                }
                                            }
                                        }
                                    }
                                }
    
                                if(bre2){
                                    break
                                }
                            }
                        }
                        else{
                            for(let d=0;d<days.length;d++){
                                let bre2 = false;
                                const isIDExist = Object.keys(deepCopied).some(k=>{
                                    if(deepCopied[k][days[d]][per] !== ''){
                                        return deepCopied[k][days[d]][per]['ID'] === PET.ID
                                    } 
                                })
    
                                if(isIDExist === false){
                                    if(deepCopied[items][days[d]][per] === ''){
                                        deepCopied[items][days[d]][per] = PET
                                        isCount2++
                                        if(isCount2 === 2){
                                            bre = true
                                            break
                                        }
                                    } 
                                }
                                else{
                                    for(let iw=1 ; iw<=8 ; iw++){
                                        let perInsideThisLoop = 'per'+iw;
                                        if(iw!==1 && iw!==4 && iw!==5){
                                            const isIDExistINL = Object.keys(deepCopied).some(k=>{
                                                if(deepCopied[k][days[d]][perInsideThisLoop] !== ''){
                                                    return deepCopied[k][days[d]][perInsideThisLoop]['ID'] === PET.ID
                                                }  
                                            })
                                            if(isIDExistINL === false){
                                                if(deepCopied[items][days[d]][perInsideThisLoop] === ''){
                                                    deepCopied[items][days[d]][perInsideThisLoop] = PET
                                                    isCount2++
                                                    if(isCount2 === 2){
                                                        bre = true
                                                        bre2 = true
                                                        break
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
    
                                if(bre2){
                                    break
                                }
                            }
                        }
                    }
                    if(bre === true){
                        break
                    }    
                } 
            })

            // Filling Empty Section without PET Period
            Object.keys(deepCopied).map(items=>{
                const std = parseInt(items.match(/\d+/)[0])
                const zzz = Object.values(deepCopied[items]) //values of days in a section
                const isSectionNotEmpty = zzz.some(item=>{
                    for(let key in item){
                        if(item[key] !== '' && item[key]['ID'] === 'PET'){
                            return true;
                        }
                    }
                })
                if(!isSectionNotEmpty && std !== 11){
                    const days = ['Monday','Tuesday','Wednesday','Thursday','Friday']
                    const PET = {
                        ID : 'PET',
                        Subject : 'PET'
                    }
                    for(let i=1 ; i<=8 ; i++){
                        let per = 'per'+i;
                        let bre = false
                    
                        if(i!==1 && i!==4 && i!==5){
                            for(let d=0;d<days.length;d++){
                                let bre2 = false;
                                let count = 0;
                                const isIDExist = Object.keys(deepCopied).some(k=>{
                                    if(deepCopied[k][days[d]][per] !== ''){
                                        if(deepCopied[k][days[d]][per]['ID'] === PET.ID){
                                            count++
                                        }
                                    } 
                                    if(count === 2){
                                        return true
                                    }
                                })
    
                                if(isIDExist === false){
                                    if(std === 12){
                                        let gendercheck = items.substring(items.length - 3)
                                        deepCopied[items][days[d]][per] = PET
                                        Object.keys(deepCopied).map(l=>{
                                            let checkSTD = parseInt(l.match(/\d+/)[0])
                                            if(checkSTD === 12 && l.includes(gendercheck)){
                                              
                                                deepCopied[l][days[d]][per] = PET
                                            }
                                        })
                                    }
                                    else{
                                        deepCopied[items][days[d]][per] = PET
                                    }
                                    bre = true
                                    break
                                }
                                else{
                                    
                                    for(let iw=1 ; iw<=8 ; iw++){
                                        let perInsideThisLoop = 'per'+iw;
                                        let count2 = 0;
                                        if(iw!==1 && iw!==4 && iw!==5){
                                            const isIDExistINL = Object.keys(deepCopied).some(k=>{
                                                if(deepCopied[k][days[d]][perInsideThisLoop] !== ''){
                                                    if(deepCopied[k][days[d]][perInsideThisLoop]['ID'] === PET.ID){
                                                        count2++
                                                    }
                                                } 
                                                if(count2 === 2){
                                                    return true
                                                }
                                            })
                                            if(isIDExistINL === false){
                                                if(std === 12){
                                                    let gendercheck = items.substring(items.length - 3)
                                                    deepCopied[items][days[d]][perInsideThisLoop] = PET
                                                    Object.keys(deepCopied).map(l=>{
                                                        let checkSTD = parseInt(l.match(/\d+/)[0])
                                                        if(checkSTD === 12 && l.includes(gendercheck)){
                                                          
                                                            deepCopied[l][days[d]][perInsideThisLoop] = PET
                                                        }
                                                    })
                                                }
                                                else{
                                                    deepCopied[items][days[d]][perInsideThisLoop] = PET
                                                }
                                                bre = true
                                                bre2 = true
                                                break
                                            }
                                        }
                                    }
                                }
    
                                if(bre2){
                                    break
                                }
                            }
                        }
                        if(bre === true){
                            break
                        }    
                    } 
                }
            })

            function capitalizeFirstLetter(string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            }

            //Main periods loop
            Object.keys(deepCopied).reverse().map(items=>{
                const std = parseInt(items.match(/\d+/)[0])
                
                let group = '';
                if(std === 11 || std === 12){
                    group = items.slice(4)
                    group = group.slice(0, -4)
                }
                let gender = ''
                if(std === 11 || std === 12){
                    gender = items.substring(items.length - 3)
                }

                let TeacherList = teachersForStd[std-1];
                const days = ['Monday','Tuesday','Wednesday','Thursday','Friday']

                function shuffleArray(array) {
                    for (let i = array.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [array[i], array[j]] = [array[j], array[i]];
                    }
                    return array;
                }

                const subObj = {
                    Biology : ['Tamil','English','Maths','Zoology','Botony','Physics','Chemistry'],
                    CS : ['Tamil','English','Maths','Computer Science','Physics','Chemistry'],
                    Commerce : ['Tamil','English','Commerce','Computer Application','Accountancy','Economy'],
                    GN : ['Tamil','English','General Nurshing','Zoology','Botony','Physics','Chemistry'],
                    BM : ['Tamil','English','Economics','Commerce','Business Maths','Accountancy'],
                    VN : ['Tamil','English','Zoology','Botony','Vocational Nurshing','EAS'],
                    VA : ['Tamil','English','Vocational Automobile','EAS','Maths'],
                } 

                if(!(TeacherList.length === 0)){
                    shuffleArray(days).map(d=>{
                    for(let i=1 ; i<=8 ; i++){
                        let per = 'per'+i;

                        
                            if(deepCopied[items][d][per] ===  ''){
                                shuffleArray(TeacherList).map((o,index)=>{
                                    let teacherWithDifferentGroupSubjectFor11and12 = false
                                    if(std === 11 || std === 12){
                                        if(subObj.hasOwnProperty(group)){
                                            teacherWithDifferentGroupSubjectFor11and12 = subObj[group].some(subs=>{
                                                if(subs === o.Subject){
                                                    
                                                    return true
                                                }
                                            })
                                        } 
                                    }

                                    // 1 and 2 std conditions
                                    let GkCount1to2 = 0;
                                    let GK2times1to2 = false;
                                    if(std <= 2 && capitalizeFirstLetter(o.Subject) === 'GK'){
                                        const zzz = Object.values(deepCopied[items]) //values of days in a section
                                        GK2times1to2 = zzz.some(item=>{
                                            for(let key in item){
                                                if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'GK'){
                                                    GkCount1to2++;
                                                    if(GkCount1to2 === 2){
                                                        return true;
                                                    }
                                                }
                                            }
                                        })
                                    }

                                    let abacusCount1to2 = 0;
                                    let abacus3times1to2 = false;
                                    if(std <= 2 && capitalizeFirstLetter(o.Subject) === 'Abacus'){
                                        const zzz = Object.values(deepCopied[items]) //values of days in a section
                                        abacus3times1to2 = zzz.some(item=>{
                                            for(let key in item){
                                                if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Abacus'){
                                                    abacusCount1to2++;
                                                    if(abacusCount1to2 === 3){
                                                        return true;
                                                    }
                                                }
                                            }
                                        })
                                    }

                                    let evsCount1to2 = 0;
                                    let evs6times1to2 = false;
                                    if(std <= 2 && capitalizeFirstLetter(o.Subject) === 'EVS'){
                                        const zzz = Object.values(deepCopied[items]) //values of days in a section
                                        evs6times1to2 = zzz.some(item=>{
                                            for(let key in item){
                                                if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'EVS'){
                                                    evsCount1to2++;
                                                    if(evsCount1to2 === 6){
                                                        return true;
                                                    }
                                                }
                                            }
                                        })
                                    }

                                    let hindiCount1to5 = 0;
                                    let hindi2times1to5 = false;
                                    if(std <= 5 && capitalizeFirstLetter(o.Subject) === 'Hindi'){
                                        const zzz = Object.values(deepCopied[items]) //values of days in a section
                                        hindi2times1to5 = zzz.some(item=>{
                                            for(let key in item){
                                                if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Hindi'){
                                                    hindiCount1to5++;
                                                    if(hindiCount1to5 === 2){
                                                        return true;
                                                    }
                                                }
                                            }
                                        })
                                    }

                                    let hindiCount6to8 = 0;
                                    let hindi3times6to8 = false;
                                    if(std > 5 && std <= 8  && capitalizeFirstLetter(o.Subject) === 'Hindi'){
                                        const zzz = Object.values(deepCopied[items]) //values of days in a section
                                        hindi3times6to8 = zzz.some(item=>{
                                            for(let key in item){
                                                if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Hindi'){
                                                    hindiCount6to8++;
                                                    if(hindiCount6to8 === 3){
                                                        return true;
                                                    }
                                                }
                                            }
                                        })
                                    }

                                    let drawingCount1to2 = 0;
                                    let drawing1times1to2 = false;
                                    if(std <= 8 && capitalizeFirstLetter(o.Subject) === 'Drawing'){
                                        const zzz = Object.values(deepCopied[items]) //values of days in a section
                                        drawing1times1to2 = zzz.some(item=>{
                                            for(let key in item){
                                                if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Drawing'){
                                                    drawingCount1to2++;
                                                    if(drawingCount1to2 === 1){
                                                        return true;
                                                    }
                                                }
                                            }
                                        })
                                    }

                                    let HandWritingCount1to2 = 0;
                                    let HandWriting2times1to2 = false;
                                    if(std <= 2 && capitalizeFirstLetter(o.Subject) === 'HW'){
                                        const zzz = Object.values(deepCopied[items]) //values of days in a section
                                        HandWriting2times1to2 = zzz.some(item=>{
                                            for(let key in item){
                                                if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'HW'){
                                                    HandWritingCount1to2++;
                                                    if(HandWritingCount1to2 === 2){
                                                        return true;
                                                    }
                                                }
                                            }
                                        })
                                    }

                                    let csCount1to2 = 0;
                                    let cs3times1to2 = false;
                                    if(std <= 2 && capitalizeFirstLetter(o.Subject) === 'Computer Science'){
                                        const zzz = Object.values(deepCopied[items]) //values of days in a section
                                        cs3times1to2 = zzz.some(item=>{
                                            for(let key in item){
                                                if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Computer Science'){
                                                    csCount1to2++;
                                                    if(csCount1to2 === 3){
                                                        return true;
                                                    }
                                                }
                                            }
                                        })
                                    }

                                    let tamilCount1to2 = 0;
                                    let tamil5times1to2 = false;
                                    if(std <= 2 && capitalizeFirstLetter(o.Subject) === 'Tamil'){
                                        const zzz = Object.values(deepCopied[items]) //values of days in a section
                                        tamil5times1to2 = zzz.some(item=>{
                                            for(let key in item){
                                                if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Tamil'){
                                                    tamilCount1to2++;
                                                    if(tamilCount1to2 === 5){
                                                        return true;
                                                    }
                                                }
                                            }
                                        })
                                    }

                                    let englishCount1to2 = 0;
                                    let english5times1to2 = false;
                                    if(std <= 2 && capitalizeFirstLetter(o.Subject) === 'English'){
                                        const zzz = Object.values(deepCopied[items]) //values of days in a section
                                        english5times1to2 = zzz.some(item=>{
                                            for(let key in item){
                                                if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'English'){
                                                    englishCount1to2++;
                                                    if(englishCount1to2 === 5){
                                                        return true;
                                                    }
                                                }
                                            }
                                        })
                                    }

                                    let MathsCount1to2 = 0;
                                    let maths6times1to2 = false;
                                    if(std <= 2 && capitalizeFirstLetter(o.Subject) === 'Maths'){
                                        const zzz = Object.values(deepCopied[items]) //values of days in a section
                                        maths6times1to2 = zzz.some(item=>{
                                            for(let key in item){
                                                if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Maths'){
                                                    MathsCount1to2++;
                                                    if(MathsCount1to2 === 6){
                                                        return true;
                                                    }
                                                }
                                            }
                                        })
                                    }

                                    //3 to 8 std conditions
                                    
                                    let tamilCount3to8 = 0;
                                    let tamil5times3to8 = false;
                                    if(std > 2 && std <= 8 && capitalizeFirstLetter(o.Subject) === 'Tamil'){
                                        const zzz = Object.values(deepCopied[items]) //values of days in a section
                                        tamil5times3to8 = zzz.some(item=>{
                                            for(let key in item){
                                                if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Tamil'){
                                                    tamilCount3to8++;
                                                    if(tamilCount3to8 === 5){
                                                        return true;
                                                    }
                                                }
                                            }
                                        })
                                    }

                                    let englishCount3to8 = 0;
                                    let english5times3to8 = false;
                                    if(std > 2 && std <= 8 && capitalizeFirstLetter(o.Subject) === 'English'){
                                        const zzz = Object.values(deepCopied[items]) //values of days in a section
                                        english5times3to8 = zzz.some(item=>{
                                            for(let key in item){
                                                if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'English'){
                                                    englishCount3to8++;
                                                    if(englishCount3to8 === 5){
                                                        return true;
                                                    }
                                                }
                                            }
                                        })
                                    }

                                    let MathsCount3to8 = 0;
                                    let maths5times3to8 = false;
                                    if(std > 2 && std <= 8 && capitalizeFirstLetter(o.Subject) === 'Maths'){
                                        const zzz = Object.values(deepCopied[items]) //values of days in a section
                                        maths5times3to8 = zzz.some(item=>{
                                            for(let key in item){
                                                if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Maths'){
                                                    MathsCount3to8++;
                                                    if(MathsCount3to8 === 5){
                                                        return true;
                                                    }
                                                }
                                            }
                                        })
                                    }

                                    // let MathsCount6to8 = 0;
                                    // let maths6times6to8 = false;
                                    // if(std > 2 && std <= 5 && capitalizeFirstLetter(o.Subject) === 'Maths'){
                                    //     const zzz = Object.values(deepCopied[items]) //values of days in a section
                                    //     maths6times6to8 = zzz.some(item=>{
                                    //         for(let key in item){
                                    //             if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Maths'){
                                    //                 MathsCount6to8++;
                                    //                 if(MathsCount6to8 === 6){
                                    //                     return true;
                                    //                 }
                                    //             }
                                    //         }
                                    //     })
                                    // }

                                    let scienceCount3to8 = 0;
                                    let science5times3to8 = false;
                                    if(std > 2 && std <= 8 && capitalizeFirstLetter(o.Subject) === 'Science'){
                                        const zzz = Object.values(deepCopied[items]) //values of days in a section
                                        science5times3to8 = zzz.some(item=>{
                                            for(let key in item){
                                                if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Science'){
                                                    scienceCount3to8++;
                                                    if(scienceCount3to8 === 5){
                                                        return true;
                                                    }
                                                }
                                            }
                                        })
                                    }

                                    let socialscienceCount3to8 = 0;
                                    let socialscience5times3to8 = false;
                                    if(std > 2 && std <= 8 && capitalizeFirstLetter(o.Subject) === 'Social Science'){
                                        const zzz = Object.values(deepCopied[items]) //values of days in a section
                                        socialscience5times3to8 = zzz.some(item=>{
                                            for(let key in item){
                                                if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Social Science'){
                                                    socialscienceCount3to8++;
                                                    if(socialscienceCount3to8 === 5){
                                                        return true;
                                                    }
                                                }
                                            }
                                        })
                                    }

                                    let GkCount3to8 = 0;
                                    let GK3times3to8 = false;
                                    if(std > 2 && std <= 8 && capitalizeFirstLetter(o.Subject) === 'GK'){
                                        const zzz = Object.values(deepCopied[items]) //values of days in a section
                                        GK3times3to8 = zzz.some(item=>{
                                            for(let key in item){
                                                if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'GK'){
                                                    GkCount3to8++;
                                                    if(GkCount3to8 === 3){
                                                        return true;
                                                    }
                                                }
                                            }
                                        })
                                    }

                                    let abacusCount3to8 = 0;
                                    let abacus2times3to8 = false;
                                    if(std > 2 && std <= 8 && capitalizeFirstLetter(o.Subject) === 'Abacus'){
                                        const zzz = Object.values(deepCopied[items]) //values of days in a section
                                        abacus2times3to8 = zzz.some(item=>{
                                            for(let key in item){
                                                if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Abacus'){
                                                    abacusCount3to8++;
                                                    if(abacusCount3to8 === 2){
                                                        return true;
                                                    }
                                                }
                                            }
                                        })
                                    }

                                    let csCount3to8 = 0;
                                    let cs3times3to8 = false;
                                    if(std > 2 && std <= 8 && capitalizeFirstLetter(o.Subject) === 'Computer Science'){
                                        const zzz = Object.values(deepCopied[items]) //values of days in a section
                                        cs3times3to8 = zzz.some(item=>{
                                            for(let key in item){
                                                if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Computer Science'){
                                                    csCount3to8++;
                                                    if(csCount3to8 === 3){
                                                        return true;
                                                    }
                                                }
                                            }
                                        })
                                    }

                                    
                                      // 9 std condition
                                      let tamilCount9 = 0;
                                      let tamil6times9 = false;
                                      if(std === 9 && capitalizeFirstLetter(o.Subject) === 'Tamil'){
                                          const zzz = Object.values(deepCopied[items]) //values of days in a section
                                          tamil6times9 = zzz.some(item=>{
                                              for(let key in item){
                                                  if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Tamil'){
                                                        tamilCount9++;
                                                      if(tamilCount9 === 6){
                                                          return true;
                                                      }
                                                  }
                                              }
                                          })
                                      }
  
                                      let englishCount9 = 0;
                                      let english6times9 = false;
                                      if(std === 9 && capitalizeFirstLetter(o.Subject) === 'English'){
                                          const zzz = Object.values(deepCopied[items]) //values of days in a section
                                          english6times9 = zzz.some(item=>{
                                              for(let key in item){
                                                  if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'English'){
                                                      englishCount9++;
                                                      if(englishCount9 === 6){
                                                          return true;
                                                      }
                                                  }
                                              }
                                          })
                                      }
  
                                      let MathsCount9 = 0;
                                      let maths7times9 = false;
                                      if(std === 9 && capitalizeFirstLetter(o.Subject) === 'Maths'){
                                          const zzz = Object.values(deepCopied[items]) //values of days in a section
                                          maths7times9 = zzz.some(item=>{
                                              for(let key in item){
                                                  if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Maths'){
                                                    MathsCount9++;
                                                      if(MathsCount9 === 7){
                                                          return true;
                                                      }
                                                  }
                                              }
                                          })
                                      }
  
                                      let scienceCount9 = 0;
                                      let science6times9 = false;
                                      if(std === 9 && capitalizeFirstLetter(o.Subject) === 'Science'){
                                          const zzz = Object.values(deepCopied[items]) //values of days in a section
                                          science6times9 = zzz.some(item=>{
                                              for(let key in item){
                                                  if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Science'){
                                                      scienceCount9++;
                                                      if(scienceCount9 === 6){
                                                          return true;
                                                      }
                                                  }
                                              }
                                          })
                                      }
  
                                      let socialscienceCount9 = 0;
                                      let socialscience6times9 = false;
                                      if(std === 9 && capitalizeFirstLetter(o.Subject) === 'Social Science'){
                                          const zzz = Object.values(deepCopied[items]) //values of days in a section
                                          socialscience6times9 = zzz.some(item=>{
                                              for(let key in item){
                                                  if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Social Science'){
                                                      socialscienceCount9++;
                                                      if(socialscienceCount9 === 6){
                                                          return true;
                                                      }
                                                  }
                                              }
                                          })
                                      }
  
                                      let GkCount9 = 0;
                                      let GK3times9 = false;
                                      if(std === 9 && capitalizeFirstLetter(o.Subject) === 'GK'){
                                          const zzz = Object.values(deepCopied[items]) //values of days in a section
                                          GK3times9 = zzz.some(item=>{
                                              for(let key in item){
                                                  if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'GK'){
                                                      GkCount9++;
                                                      if(GkCount9 === 3){
                                                          return true;
                                                      }
                                                  }
                                              }
                                          })
                                      }

                                      let csCount9 = 0;
                                      let cs3times9 = false;
                                      if(std === 9 && capitalizeFirstLetter(o.Subject) === 'Computer Science'){
                                          const zzz = Object.values(deepCopied[items]) //values of days in a section
                                          cs3times9 = zzz.some(item=>{
                                              for(let key in item){
                                                  if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Computer Science'){
                                                      csCount9++;
                                                      if(csCount9 === 3){
                                                          return true;
                                                      }
                                                  }
                                              }
                                          })
                                      }

                                      // 10 std condition
                                      let tamilCount10 = 0;
                                      let tamil7times10 = false;
                                      if(std === 10 && capitalizeFirstLetter(o.Subject) === 'Tamil'){
                                          const zzz = Object.values(deepCopied[items]) //values of days in a section
                                          tamil7times10 = zzz.some(item=>{
                                              for(let key in item){
                                                  if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Tamil'){
                                                    tamilCount10++;
                                                      if(tamilCount10 === 7){
                                                          return true;
                                                      }
                                                  }
                                              }
                                          })
                                      }
  
                                      let englishCount10 = 0;
                                      let english7times10 = false;
                                      if(std === 10 && capitalizeFirstLetter(o.Subject) === 'English'){
                                          const zzz = Object.values(deepCopied[items]) //values of days in a section
                                          english7times10 = zzz.some(item=>{
                                              for(let key in item){
                                                  if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'English'){
                                                    englishCount10++;
                                                      if(englishCount10 === 7){
                                                          return true;
                                                      }
                                                  }
                                              }
                                          })
                                      }
  
                                      let MathsCount10 = 0;
                                      let maths8times10 = false;
                                      if(std === 10 && capitalizeFirstLetter(o.Subject) === 'Maths'){
                                          const zzz = Object.values(deepCopied[items]) //values of days in a section
                                          maths8times10 = zzz.some(item=>{
                                              for(let key in item){
                                                  if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Maths'){
                                                    MathsCount10++;
                                                      if(MathsCount10 === 8){
                                                          return true;
                                                      }
                                                  }
                                              }
                                          })
                                      }
  
                                      let science1Count10 = 0;
                                      let science14times10 = false;
                                      if(std === 10 && capitalizeFirstLetter(o.Subject) === 'Science1'){
                                          const zzz = Object.values(deepCopied[items]) //values of days in a section
                                          science14times10 = zzz.some(item=>{
                                              for(let key in item){
                                                  if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Science1'){
                                                    science1Count10++;
                                                      if(science1Count10 === 4){
                                                          return true;
                                                      }
                                                  }
                                              }
                                          })
                                      }

                                      let science2Count10 = 0;
                                      let science24times10 = false;
                                      if(std === 10 && capitalizeFirstLetter(o.Subject) === 'Science2'){
                                          const zzz = Object.values(deepCopied[items]) //values of days in a section
                                          science24times10 = zzz.some(item=>{
                                              for(let key in item){
                                                  if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Science2'){
                                                    science2Count10++;
                                                      if(science2Count10 === 4){
                                                          return true;
                                                      }
                                                  }
                                              }
                                          })
                                      }
  
                                      let socialscienceCount10 = 0;
                                      let socialscience8times10 = false;
                                      if(std === 10 && capitalizeFirstLetter(o.Subject) === 'Social Science'){
                                          const zzz = Object.values(deepCopied[items]) //values of days in a section
                                          socialscience8times10 = zzz.some(item=>{
                                              for(let key in item){
                                                  if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Social Science'){
                                                    socialscienceCount10++;
                                                      if(socialscienceCount10 === 8){
                                                          return true;
                                                      }
                                                  }
                                              }
                                          })
                                      }

                                            // 11 and 12 std condition
                                            let tamilCount11and12 = 0;
                                            let tamil5times11and12= false;
                                            if(std > 10 && capitalizeFirstLetter(o.Subject) === 'Tamil'){
                                                const zzz = Object.values(deepCopied[items]) //values of days in a section
                                                tamil5times11and12 = zzz.some(item=>{
                                                    for(let key in item){
                                                        if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Tamil'){
                                                            tamilCount11and12++;
                                                            if(tamilCount11and12 === 5){
                                                                return true;
                                                            }
                                                        }
                                                    }
                                                })
                                            }
        
                                            let englishCount11and12 = 0;
                                            let english5times11and12 = false;
                                            if(std > 10 && capitalizeFirstLetter(o.Subject) === 'English'){
                                                const zzz = Object.values(deepCopied[items]) //values of days in a section
                                                english5times11and12 = zzz.some(item=>{
                                                    for(let key in item){
                                                        if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'English'){
                                                            englishCount11and12++;
                                                            if(englishCount11and12 === 5){
                                                                return true;
                                                            }
                                                        }
                                                    }
                                                })
                                            }

                                            let mathsCount11and12 = 0;
                                            let maths7times11and12 = false;
                                            if(std > 10 && capitalizeFirstLetter(o.Subject) === 'Maths'){
                                                const zzz = Object.values(deepCopied[items]) //values of days in a section
                                                maths7times11and12 = zzz.some(item=>{
                                                    for(let key in item){
                                                        if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Maths'){
                                                            mathsCount11and12++;
                                                            if(mathsCount11and12 === 7){
                                                                return true;
                                                            }
                                                        }
                                                    }
                                                })
                                            }

                                            let physicsCount11and12 = 0;
                                            let physics7times11and12 = false;
                                            if(std > 10 && capitalizeFirstLetter(o.Subject) === 'Physics'){
                                                const zzz = Object.values(deepCopied[items]) //values of days in a section
                                                physics7times11and12 = zzz.some(item=>{
                                                    for(let key in item){
                                                        if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Physics'){
                                                            physicsCount11and12++;
                                                            if(physicsCount11and12 === 7){
                                                                return true;
                                                            }
                                                        }
                                                    }
                                                })
                                            }

                                            let chemistyCount11and12 = 0;
                                            let chemisty7times11and12 = false;
                                            if(std > 10 && capitalizeFirstLetter(o.Subject) === 'Chemistry'){
                                                const zzz = Object.values(deepCopied[items]) //values of days in a section
                                                chemisty7times11and12 = zzz.some(item=>{
                                                    for(let key in item){
                                                        if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Chemistry'){
                                                            chemistyCount11and12++;
                                                            if(chemistyCount11and12 === 7){
                                                                return true;
                                                            }
                                                        }
                                                    }
                                                })
                                            }

                                            let csCount11and12 = 0;
                                            let cs7times11and12 = false;
                                            if(std > 10 && capitalizeFirstLetter(o.Subject) === 'Computer Science'){
                                                const zzz = Object.values(deepCopied[items]) //values of days in a section
                                                cs7times11and12 = zzz.some(item=>{
                                                    for(let key in item){
                                                        if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Computer Science'){
                                                            csCount11and12++;
                                                            if(csCount11and12 === 7){
                                                                return true;
                                                            }
                                                        }
                                                    }
                                                })
                                            }

                                            let botonyCount11and12 = 0;
                                            let botony4times11and12 = false;
                                            if(std > 10 && capitalizeFirstLetter(o.Subject) === 'Botony'){
                                                const zzz = Object.values(deepCopied[items]) //values of days in a section
                                                botony4times11and12 = zzz.some(item=>{
                                                    for(let key in item){
                                                        if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Botony'){
                                                            botonyCount11and12++;
                                                            if(botonyCount11and12 >= 4){
                                                                return true;
                                                            }
                                                        }
                                                    }
                                                })
                                            }

                                            
                                            let zoologyCount11and12 = 0;
                                            let zoology3times11and12 = false;
                                            if(std > 10 && capitalizeFirstLetter(o.Subject) === 'Zoology'){
                                                const zzz = Object.values(deepCopied[items]) //values of days in a section
                                                zoology3times11and12 = zzz.some(item=>{
                                                    for(let key in item){
                                                        if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Zoology'){
                                                            zoologyCount11and12++;
                                                            if(zoologyCount11and12 >= 3){
                                                                return true;
                                                            }
                                                        }
                                                    }
                                                })
                                            }

                                            let commerceCount11and12 = 0;
                                            let commerce7times11and12 = false;
                                            if(std > 10 && capitalizeFirstLetter(o.Subject) === 'Commerce'){
                                                const zzz = Object.values(deepCopied[items]) //values of days in a section
                                                commerce7times11and12 = zzz.some(item=>{
                                                    for(let key in item){
                                                        if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Commerce'){
                                                            commerceCount11and12++;
                                                            if(commerceCount11and12 === 7){
                                                                return true;
                                                            }
                                                        }
                                                    }
                                                })
                                            }

                                            let economyCount11and12 = 0;
                                            let economy7times11and12 = false;
                                            if(std > 10 && capitalizeFirstLetter(o.Subject) === 'Economy'){
                                                const zzz = Object.values(deepCopied[items]) //values of days in a section
                                                economy7times11and12 = zzz.some(item=>{
                                                    for(let key in item){
                                                        if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Economy'){
                                                            economyCount11and12++;
                                                            if(economyCount11and12 === 7){
                                                                return true;
                                                            }
                                                        }
                                                    }
                                                })
                                            }

                                            let accountancyCount11and12 = 0;
                                            let accountancy7times11and12 = false;
                                            if(std > 10 && capitalizeFirstLetter(o.Subject) === 'Accountancy'){
                                                const zzz = Object.values(deepCopied[items]) //values of days in a section
                                                accountancy7times11and12 = zzz.some(item=>{
                                                    for(let key in item){
                                                        if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Accountancy'){
                                                            accountancyCount11and12++;
                                                            if(accountancyCount11and12 === 7){
                                                                return true;
                                                            }
                                                        }
                                                    }
                                                })
                                            }

                                            let computerApplicationCount11and12 = 0;
                                            let computerApplication7times11and12 = false;
                                            if(std > 10 && capitalizeFirstLetter(o.Subject) === 'Computer Application'){
                                                const zzz = Object.values(deepCopied[items]) //values of days in a section
                                                computerApplication7times11and12 = zzz.some(item=>{
                                                    for(let key in item){
                                                        if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Computer Application'){
                                                            computerApplicationCount11and12++;
                                                            if(computerApplicationCount11and12 === 7){
                                                                return true;
                                                            }
                                                        }
                                                    }
                                                })
                                            }

                                            let EASCount11and12 = 0;
                                            let EAS7times11and12 = false;
                                            if(std > 10 && capitalizeFirstLetter(o.Subject) === 'EAS'){
                                                const zzz = Object.values(deepCopied[items]) //values of days in a section
                                                EAS7times11and12 = zzz.some(item=>{
                                                    for(let key in item){
                                                        if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'EAS'){
                                                            EASCount11and12++;
                                                            if(EASCount11and12 === 7){
                                                                return true;
                                                            }
                                                        }
                                                    }
                                                })
                                            }

                                            let BMCount11and12 = 0;
                                            let BM7times11and12 = false;
                                            if(std > 10 && capitalizeFirstLetter(o.Subject) === 'Business Maths'){
                                                const zzz = Object.values(deepCopied[items]) //values of days in a section
                                                BM7times11and12 = zzz.some(item=>{
                                                    for(let key in item){
                                                        if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Business Maths'){
                                                            BMCount11and12++;
                                                            if(BMCount11and12 === 7){
                                                                return true;
                                                            }
                                                        }
                                                    }
                                                })
                                            }

                                            let VNCount11and12 = 0;
                                            let VN7times11and12 = false;
                                            if(std > 10 && capitalizeFirstLetter(o.Subject) === 'Vocational Nurshing'){
                                                const zzz = Object.values(deepCopied[items]) //values of days in a section
                                                VN7times11and12 = zzz.some(item=>{
                                                    for(let key in item){
                                                        if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Vocational Nurshing'){
                                                            VNCount11and12++;
                                                            if(VNCount11and12 === 7){
                                                                return true;
                                                            }
                                                        }
                                                    }
                                                })
                                            }

                                            let VACount11and12 = 0;
                                            let VA7times11and12 = false;
                                            if(std > 10 && capitalizeFirstLetter(o.Subject) === 'Vocational Automobile'){
                                                const zzz = Object.values(deepCopied[items]) //values of days in a section
                                                VA7times11and12 = zzz.some(item=>{
                                                    for(let key in item){
                                                        if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Vocational Automobile'){
                                                            VACount11and12++;
                                                            if(VACount11and12 === 7){
                                                                return true;
                                                            }
                                                        }
                                                    }
                                                })
                                            }

                                            let GNCount11and12 = 0;
                                            let GN7times11and12 = false;
                                            if(std > 10 && capitalizeFirstLetter(o.Subject) === 'General Nurshing'){
                                                const zzz = Object.values(deepCopied[items]) //values of days in a section
                                                GN7times11and12 = zzz.some(item=>{
                                                    for(let key in item){
                                                        if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'General Nurshing'){
                                                            GNCount11and12++;
                                                            if(GNCount11and12 === 7){
                                                                return true;
                                                            }
                                                        }
                                                    }
                                                })
                                            }



                                    if(!GK2times1to2 && !abacus3times1to2 && !evs6times1to2 && !hindi2times1to5 && !hindi3times6to8 && !drawing1times1to2 && !HandWriting2times1to2 && !cs3times1to2 && !tamil5times1to2 && !english5times1to2 && !maths6times1to2 && !tamil5times3to8 && !english5times3to8 && !maths5times3to8 && !science5times3to8 && !socialscience5times3to8 && !GK3times3to8 && !abacus2times3to8 && !cs3times3to8 && !tamil6times9 && !english6times9 && !maths7times9 && !science6times9 && !socialscience6times9 && !GK3times9 && !cs3times9 && !tamil7times10 && !english7times10 && !maths8times10  && !science14times10 && !science24times10 && !socialscience8times10 && !tamil5times11and12 && !english5times11and12 && !maths7times11and12 && !physics7times11and12 && !chemisty7times11and12 && !cs7times11and12 && !botony4times11and12 && !zoology3times11and12 && !commerce7times11and12 && !economy7times11and12 && !accountancy7times11and12 && !computerApplication7times11and12 && !EAS7times11and12 && !BM7times11and12 && !VN7times11and12 && !VA7times11and12 && !GN7times11and12){
                                        let IsAnyStaffinMorethanaSectionsForaSTD = false; //staff more than a section for a std
                                        let IsAnyStaffinMorethanaSectionsForaSTDCount = 0;
                                        let FORIFCONditionIsAnyStaffinMorethanaSectionsForaSTDCount = 0;
                                        if(std === 11 || std === 12){
                                            FORIFCONditionIsAnyStaffinMorethanaSectionsForaSTDCount = 5
                                        }
                                        else{
                                            if(std !== 8 && o.Subject === 'Hindi'){
                                                FORIFCONditionIsAnyStaffinMorethanaSectionsForaSTDCount = 2
                                            }
                                            else if(std === 10 && o.Subject === 'Maths'){
                                                FORIFCONditionIsAnyStaffinMorethanaSectionsForaSTDCount = 2
                                            }
                                            else if(items === '6B' && o.Subject === 'Science'){
                                                FORIFCONditionIsAnyStaffinMorethanaSectionsForaSTDCount = 2
                                            }
                                            else if(std === 10 && (o.Subject === 'Social Science' || (o.Subject === 'Science1' && o.ID === 18) || (o.Subject === 'Science2' && o.ID === 19))){
                                                FORIFCONditionIsAnyStaffinMorethanaSectionsForaSTDCount = 2
                                            }
                                            else if(std > 2 && o.Subject === 'Computer Science'){
                                                FORIFCONditionIsAnyStaffinMorethanaSectionsForaSTDCount = 2
                                            }
                                            else if(std > 1 && o.Subject === 'Abacus'){
                                                FORIFCONditionIsAnyStaffinMorethanaSectionsForaSTDCount = 2
                                            }
                                            else if(std <= 2 && o.Subject === 'HW'){
                                                FORIFCONditionIsAnyStaffinMorethanaSectionsForaSTDCount = 2
                                            }
                                            else if(std < 9 && o.Subject === 'Drawing'){
                                                FORIFCONditionIsAnyStaffinMorethanaSectionsForaSTDCount = 2
                                            }
                                            else{
                                                FORIFCONditionIsAnyStaffinMorethanaSectionsForaSTDCount = 1
                                            }
                                        }

                                        if((std === 11 || std === 12) && teacherWithDifferentGroupSubjectFor11and12){
                                            const currentStdSectionsValues = [];
                                            const keysInWholeSchool = Object.keys(deepCopied)
                                            keysInWholeSchool.map(list=>{
                                                if(parseInt(list.match(/\d+/)[0]) === std){
                                                    currentStdSectionsValues.push(deepCopied[list])
                                                }
                                            })
                                            for(let i=0;i<currentStdSectionsValues.length;i++){     //current std's sections loop
                                                let EachsectionValue = Object.values(currentStdSectionsValues[i]) //current sections value
                                                for(let yy=0;yy<EachsectionValue.length;yy++){   //days loop
                                                    let EachDayValues = Object.values(EachsectionValue[yy])
                                                    let b = false;
                                                    for(let xx=0;xx<EachDayValues.length;xx++){   //periods loop
                                                        let sameSction = false;
                                                        if(i === 0 && items.includes('A')){
                                                            sameSction = true
                                                        }
                                                        else if(i === 1 && items.includes('B')){
                                                            sameSction = true
                                                        }
                                                        else if(i === 2 && items.includes('C')){
                                                            sameSction = true
                                                        }
                                                        else if(i === 3 && items.includes('D')){
                                                            sameSction = true
                                                        }
                                                        else if(i === 4 && items.includes('E')){
                                                            sameSction = true
                                                        }
                                                        
                                                        if(!sameSction){
                                                            if(EachDayValues[xx] !== '' && EachDayValues[xx]['ID'] === o.ID){
                                                                IsAnyStaffinMorethanaSectionsForaSTDCount++;
                                                                b = true;
                                                                break;
                                                            }
                                                        }
                                                    
                                                    }
                                                    if(b){
                                                        break;
                                                    }
                                                }
                                                if(IsAnyStaffinMorethanaSectionsForaSTDCount >= FORIFCONditionIsAnyStaffinMorethanaSectionsForaSTDCount){
                                                    IsAnyStaffinMorethanaSectionsForaSTD = true;
                                                    break
                                                }
                                            }
                
                                            let MultipleTeacherWithSameSubject = false;
                                            for(let key in deepCopied[items]){
                                                for(let checkPer in deepCopied[items][key]){
                                                    if(deepCopied[items][key][checkPer] !== '' && o.Subject === deepCopied[items][key][checkPer]['Subject'] && o.ID !== deepCopied[items][key][checkPer]['ID']){
                                                        MultipleTeacherWithSameSubject = true;
                                                        break;
                                                    }
                                                }
                                            }

                                            let TeacherinDifferentGender = false

                                            if(std === 11){
                                                if(gender === '(G)'){
                                                    TeacherinDifferentGender = Object.keys(deepCopied).some(po=>{
                                                        const stdForCheck = parseInt(po.match(/\d+/)[0])
                                                        if(stdForCheck === 11){
                                                            const gendertoCheck = po.substring(po.length - 3)
                                                            if(gendertoCheck === '(B)'){
                                                                // console.log(items , po)
                                                                for(let tkey in deepCopied[po]){ //days
                                                                    for(let tper in deepCopied[po][tkey]){ //periods
                                                                        if(deepCopied[po][tkey][tper] !== '' && deepCopied[po][tkey][tper]['ID'] === o.ID && (deepCopied[po][tkey][tper]['Subject'] !== 'Botony' && deepCopied[po][tkey][tper]['Subject'] !== 'Computer Application' && deepCopied[po][tkey][tper]['Subject'] !== 'Zoology' && deepCopied[po][tkey][tper]['Subject'] !== 'Computer Science' && deepCopied[po][tkey][tper]['Subject'] !== 'Commerce' && deepCopied[po][tkey][tper]['Subject'] !== 'Economy' && deepCopied[po][tkey][tper]['Subject'] !== 'Accountancy' && deepCopied[po][tkey][tper]['Subject'] !== 'Business Maths'))
                                                                        {
                                                                            return true;
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    })
                                                }

                                                if(gender === '(B)'){
                                                    TeacherinDifferentGender = Object.keys(deepCopied).some(po=>{
                                                        const stdForCheck = parseInt(po.match(/\d+/)[0])
                                                        if(stdForCheck === 11){
                                                            const gendertoCheck = po.substring(po.length - 3)
                                                            if(gendertoCheck === '(G)'){
                                                                for(let tkey in deepCopied[po]){ //days
                                                                    for(let tper in deepCopied[po][tkey]){ //periods
                                                                        if(deepCopied[po][tkey][tper] !== '' && deepCopied[po][tkey][tper]['ID'] === o.ID && (deepCopied[po][tkey][tper]['Subject'] !== 'Botony' && deepCopied[po][tkey][tper]['Subject'] !== 'Computer Application' && deepCopied[po][tkey][tper]['Subject'] !== 'Zoology' && deepCopied[po][tkey][tper]['Subject'] !== 'Computer Science' && deepCopied[po][tkey][tper]['Subject'] !== 'Commerce' && deepCopied[po][tkey][tper]['Subject'] !== 'Economy' && deepCopied[po][tkey][tper]['Subject'] !== 'Accountancy' && deepCopied[po][tkey][tper]['Subject'] !== 'Business Maths'))
                                                                        {
                                                                            return true;
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    })
                                                }
                                            }

                                            if(std === 12){
                                                if(gender === '(G)'){
                                                    TeacherinDifferentGender = Object.keys(deepCopied).some(po=>{
                                                        const stdForCheck = parseInt(po.match(/\d+/)[0])
                                                        if(stdForCheck === 12){
                                                            const gendertoCheck = po.substring(po.length - 3)
                                                            if(gendertoCheck === '(B)'){
                                                                for(let tkey in deepCopied[po]){ //days
                                                                    for(let tper in deepCopied[po][tkey]){ //periods
                                                                        if(deepCopied[po][tkey][tper] !== '' && deepCopied[po][tkey][tper]['ID'] === o.ID && (deepCopied[po][tkey][tper]['Subject'] !== 'Botony' && deepCopied[po][tkey][tper]['Subject'] !== 'Computer Application' && deepCopied[po][tkey][tper]['Subject'] !== 'Zoology' && deepCopied[po][tkey][tper]['Subject'] !== 'Computer Science' && deepCopied[po][tkey][tper]['Subject'] !== 'Commerce' && deepCopied[po][tkey][tper]['Subject'] !== 'Economy' && deepCopied[po][tkey][tper]['Subject'] !== 'Accountancy' && deepCopied[po][tkey][tper]['Subject'] !== 'Business Maths'))
                                                                        {
                                                                            return true;
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    })
                                                }

                                                if(gender === '(B)'){
                                                    TeacherinDifferentGender = Object.keys(deepCopied).some(po=>{
                                                        const stdForCheck = parseInt(po.match(/\d+/)[0])
                                                        if(stdForCheck === 12){
                                                            const gendertoCheck = po.substring(po.length - 3)
                                                            if(gendertoCheck === '(G)'){
                                                                for(let tkey in deepCopied[po]){ //days
                                                                    for(let tper in deepCopied[po][tkey]){ //periods
                                                                        if(deepCopied[po][tkey][tper] !== '' && deepCopied[po][tkey][tper]['ID'] === o.ID && (deepCopied[po][tkey][tper]['Subject'] !== 'Botony' && deepCopied[po][tkey][tper]['Subject'] !== 'Computer Application' && deepCopied[po][tkey][tper]['Subject'] !== 'Zoology' && deepCopied[po][tkey][tper]['Subject'] !== 'Computer Science' && deepCopied[po][tkey][tper]['Subject'] !== 'Commerce' && deepCopied[po][tkey][tper]['Subject'] !== 'Economy' && deepCopied[po][tkey][tper]['Subject'] !== 'Accountancy' && deepCopied[po][tkey][tper]['Subject'] !== 'Business Maths'))
                                                                        {
                                                                            return true;
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    })
                                                }
                                            }

                                            if(!IsAnyStaffinMorethanaSectionsForaSTD && !TeacherinDifferentGender){
                                                if(!MultipleTeacherWithSameSubject){
                                                    const isIDExist = Object.keys(deepCopied).some(k=>{
                                                        if(deepCopied[k][d][per] !== ''){
                                                            return deepCopied[k][d][per]['ID'] === o.ID
                                                        } 
                                                    })
                                                    if(deepCopied[items][d][per] === '' && isIDExist === false){
                                                        if(i>1){
                                                            const prevprePeriod = 'per'+(i-2);
                                                            if(deepCopied[items][d][prevprePeriod] !== '' && i>=3 && deepCopied[items][d][prevprePeriod]['ID'] !== o.ID){
                                                                let isSubjectFound = false;
                                                                const data = deepCopied[items][d];
                        
                                                                for (const key in data) {
                                                                    if (Object.hasOwnProperty.call(data, key)) {
                                                                        const period = data[key];
                                                                        if (period && period.Subject === o.Subject) {
                                                                            isSubjectFound = true;
                                                                            break;
                                                                        }
                                                                    }
                                                                }
                        
                                                                if (!isSubjectFound) {
                                                                    
                                                                    // if(o.Subject !== 'Botony' && o.Subject !== 'Zoology' && o.Subject !== 'Computer Science' && o.Subject !== 'Commerce' && o.Subject !== 'Economy' && o.Subject !== 'Accountancy' && o.Subject !== 'Business Maths' && o.Subject !== 'Tamil' && o.Subject !== 'English' && o.Subject !== 'Computer Application'){
                                                                    //     if(d === 'Tuesday' && deepCopied[items]['Monday'][per] !== '' && o.Subject !== deepCopied[items]['Monday'][per]['Subject']){
                                                                    //         if(deepCopied[items][d][per] === '') {
                                                                                
                                                                    //             deepCopied[items][d][per] = o// subject placed
                                                                    //         }
                                                                    //     }
                                                                    //     if(d === 'Wednesday' && deepCopied[items]['Tuesday'][per] !== '' && o.Subject !== deepCopied[items]['Tuesday'][per]['Subject']){
                                                                    //         if(deepCopied[items][d][per] === '') {
                                                                                
                                                                    //             deepCopied[items][d][per] = o// subject placed
                                                                    //         }
                                                                    //     }
                                                                    //     else{
                                                                    //         if(deepCopied[items][d][per] === '') {
                                                                                
                                                                    //             deepCopied[items][d][per] = o// subject placed
                                                                    //         }
                                                                    //     } 
                                                                    // }

                                                                    // if bio / cs / com / acc / com / BM /Girls Boys Combiend 
                                                                    if(o.Subject === 'Botony' || o.Subject === 'Zoology' || o.Subject === 'Computer Science' || o.Subject === 'Computer Application' || o.Subject === 'Commerce' || o.Subject === 'Economy' || o.Subject === 'Accountancy' || o.Subject === 'Business Maths'){
                                                                        Object.keys(deepCopied).map(sec=>{
                                                                            let stdcheckForCombinedClasses = parseInt(sec.match(/\d+/)[0])
                                                                            if(std === stdcheckForCombinedClasses){
                                                                                let groupForCheck = '';
                                                                                groupForCheck = sec.slice(4)
                                                                                groupForCheck = groupForCheck.slice(0, -4)

                                                                                let loopingSectionConatinsCurrentSubject = subObj[groupForCheck].some(subListForCkeck=>{
                                                                                    return subListForCkeck === o.Subject
                                                                                })

                                                                                if(loopingSectionConatinsCurrentSubject){
                                                                                    if(o.Subject === 'Botony' || o.Subject === 'Zoology'){
                                                                                        let botonyTest = 0;
                                                                                        let botonyTestR = false;
                                                                                        if(std > 10 && capitalizeFirstLetter(o.Subject) === 'Botony'){
                                                                                            const zzz = Object.values(deepCopied[items]) //values of days in a section
                                                                                            botonyTestR = zzz.some(item=>{
                                                                                                for(let key in item){
                                                                                                    if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Botony'){
                                                                                                        botonyTest++;
                                                                                                        if(botonyTest >= 4){
                                                                                                            return true;
                                                                                                        }
                                                                                                    }
                                                                                                }
                                                                                            })
                                                                                        }

                                                                                        let zooTest = 0;
                                                                                        let zooTestR = false;
                                                                                        if(std > 10 && capitalizeFirstLetter(o.Subject) === 'Zoology'){
                                                                                            const zzz = Object.values(deepCopied[items]) //values of days in a section
                                                                                            zooTestR = zzz.some(item=>{
                                                                                                for(let key in item){
                                                                                                    if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Zoology'){
                                                                                                        zooTest++;
                                                                                                        if(zooTest >= 3){
                                                                                                            return true;
                                                                                                        }
                                                                                                    }
                                                                                                }
                                                                                            })
                                                                                        }

                                                                                        if(!botonyTestR && !zooTestR){
                                                                                            if(deepCopied[sec][d][per] === ''){
                                                                                                deepCopied[sec][d][per] = o
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                    else{
                                                                                        if(deepCopied[sec][d][per] === ''){
                                                                                            deepCopied[sec][d][per] = o
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        })
                                                                    }

                                                                    if(o.Subject === 'Tamil' || o.Subject === 'English' || o.Subject === 'Maths' || o.Subject === 'Physics' || o.Subject === 'Chemistry'){ //tamil and engilsh for all boys and girls
                                                                        let rrr = Object.keys(deepCopied).some(f=>{
                                                                            let stdForCheck = parseInt(f.match(/\d+/)[0])
                                                                            if(stdForCheck === std){
                                                                                
                                                                                let groupForCheck = '';
                                                                                groupForCheck = f.slice(4)
                                                                                groupForCheck = groupForCheck.slice(0, -4)
                                                                                
                                                                                if(f.includes(gender)){
                                                                                   
                                                                                    let loopingSectionConatinsCurrentSubject = subObj[groupForCheck].some(subListForCkeck=>{
                                                                                        return subListForCkeck === o.Subject
                                                                                    })
        
                                                                                    if(loopingSectionConatinsCurrentSubject){
                                                                                        if(deepCopied[f][d][per] !== ''){
                                                                                            return true
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        })
                                                                        if(rrr === false){
                                                                            deepCopied[items][d][per] = o
                                                                        
                                                                            Object.keys(deepCopied).map(f=>{
                                                                                let stdForCheck = parseInt(f.match(/\d+/)[0])
                                                                                if(stdForCheck === std){
                                                                                    
                                                                                    let groupForCheck = '';
                                                                                    groupForCheck = f.slice(4)
                                                                                    groupForCheck = groupForCheck.slice(0, -4)
                                                                                    
                                                                                    if(f.includes(gender)){
                                                                                       
                                                                                        let loopingSectionConatinsCurrentSubject = subObj[groupForCheck].some(subListForCkeck=>{
                                                                                            return subListForCkeck === o.Subject
                                                                                        })
        
                                                                                        if(loopingSectionConatinsCurrentSubject){
                                                                                            deepCopied[f][d][per] = o
                                                                                        }
                                                                                    }
                                                                                }
                                                                            })
                                                                        }
                                                                    }
                                                                    
                                                                }
                                                            }
                                                            else if(i===2){
                                                                let isSubjectFound = false;
                                                                const data = deepCopied[items][d];
                                                                for (const key in data) {
                                                                    if (Object.hasOwnProperty.call(data, key)) {
                                                                        const person = data[key];
                                                                        if (person && person.Subject === o.Subject) {
                                                                            isSubjectFound = true;
                                                                            break;
                                                                        }
                                                                    }
                                                                }
                                                                if(isSubjectFound === false){
                                                                    if(o.Subject !== 'Botony' && o.Subject !== 'Zoology' && o.Subject !== 'Computer Science' && o.Subject !== 'Computer Application' && o.Subject !== 'Commerce' && o.Subject !== 'Economy' && o.Subject !== 'Accountancy' && o.Subject !== 'Business Maths' && o.Subject !== 'Tamil' && o.Subject !== 'English'){
                                                                        if(d === 'Tuesday' && deepCopied[items]['Monday'][per] !== '' && o.Subject !== deepCopied[items]['Monday'][per]['Subject']){
                                                                            if(deepCopied[items][d][per] === '') {
                                                                                
                                                                                deepCopied[items][d][per] = o// subject placed
                                                                            }
                                                                        }
                                                                        if(d === 'Wednesday' && deepCopied[items]['Tuesday'][per] !== '' && o.Subject !== deepCopied[items]['Tuesday'][per]['Subject']){
                                                                            if(deepCopied[items][d][per] === '') {
                                                                                
                                                                                deepCopied[items][d][per] = o// subject placed
                                                                            }
                                                                        }
                                                                        else{
                                                                            if(deepCopied[items][d][per] === '') {
                                                                                
                                                                                deepCopied[items][d][per] = o// subject placed
                                                                            }
                                                                        } 
                                                                    }

                                                                    // if bio / cs / com / acc / com / BM /Girls Boys Combiend 
                                                                    if(o.Subject === 'Botony' || o.Subject === 'Zoology' || o.Subject === 'Computer Science' || o.Subject === 'Computer Application' || o.Subject === 'Commerce' || o.Subject === 'Economy' || o.Subject === 'Accountancy' || o.Subject === 'Business Maths'){
                                                                        
                                                                        Object.keys(deepCopied).map(sec=>{
                                                                            let stdcheckForCombinedClasses = parseInt(sec.match(/\d+/)[0])
                                                                            if(std === stdcheckForCombinedClasses){
                                                                                let groupForCheck = '';
                                                                                groupForCheck = sec.slice(4)
                                                                                groupForCheck = groupForCheck.slice(0, -4)

                                                                                let loopingSectionConatinsCurrentSubject = subObj[groupForCheck].some(subListForCkeck=>{
                                                                                    return subListForCkeck === o.Subject
                                                                                })

                                                                                if(loopingSectionConatinsCurrentSubject){ 
                                                                                    
                                                                                    if(o.Subject === 'Botony' || o.Subject === 'Zoology'){
                                                                                        let botonyTest = 0;
                                                                                        let botonyTestR = false;
                                                                                        if(std > 10 && capitalizeFirstLetter(o.Subject) === 'Botony'){
                                                                                            const zzz = Object.values(deepCopied[items]) //values of days in a section
                                                                                            botonyTestR = zzz.some(item=>{
                                                                                                for(let key in item){
                                                                                                    if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Botony'){
                                                                                                        botonyTest++;
                                                                                                        if(botonyTest >= 4){
                                                                                                            return true;
                                                                                                        }
                                                                                                    }
                                                                                                }
                                                                                            })
                                                                                        }

                                                                                        let zooTest = 0;
                                                                                        let zooTestR = false;
                                                                                        if(std > 10 && capitalizeFirstLetter(o.Subject) === 'Zoology'){
                                                                                            const zzz = Object.values(deepCopied[items]) //values of days in a section
                                                                                            zooTestR = zzz.some(item=>{
                                                                                                for(let key in item){
                                                                                                    if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Zoology'){
                                                                                                        zooTest++;
                                                                                                        if(zooTest >= 3){
                                                                                                            return true;
                                                                                                        }
                                                                                                    }
                                                                                                }
                                                                                            })
                                                                                        }

                                                                                        if(!botonyTestR && !zooTestR){
                                                                                            if(deepCopied[sec][d][per] === ''){
                                                                                                deepCopied[sec][d][per] = o
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                    else{
                                                                                        if(deepCopied[sec][d][per] === ''){
                                                                                            deepCopied[sec][d][per] = o
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        })
                                                                    }

                                                                    if(o.Subject === 'Tamil' || o.Subject === 'English'){
                                                                        let rrr = Object.keys(deepCopied).some(f=>{
                                                                            let stdForCheck = parseInt(f.match(/\d+/)[0])
                                                                            if(stdForCheck === std){
                                                                                
                                                                                let groupForCheck = '';
                                                                                groupForCheck = f.slice(4)
                                                                                groupForCheck = groupForCheck.slice(0, -4)
                                                                                
                                                                                if(f.includes(gender)){
                                                                                   
                                                                                    let loopingSectionConatinsCurrentSubject = subObj[groupForCheck].some(subListForCkeck=>{
                                                                                        return subListForCkeck === o.Subject
                                                                                    })
        
                                                                                    if(loopingSectionConatinsCurrentSubject){
                                                                                        if(deepCopied[f][d][per] !== ''){
                                                                                            return true
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        })
                                                                        if(rrr === false){
                                                                            deepCopied[items][d][per] = o
                                                                        
                                                                            Object.keys(deepCopied).map(f=>{
                                                                                let stdForCheck = parseInt(f.match(/\d+/)[0])
                                                                                if(stdForCheck === std){
                                                                                    
                                                                                    let groupForCheck = '';
                                                                                    groupForCheck = f.slice(4)
                                                                                    groupForCheck = groupForCheck.slice(0, -4)
                                                                                    
                                                                                    if(f.includes(gender)){
                                                                                       
                                                                                        let loopingSectionConatinsCurrentSubject = subObj[groupForCheck].some(subListForCkeck=>{
                                                                                            return subListForCkeck === o.Subject
                                                                                        })
        
                                                                                        if(loopingSectionConatinsCurrentSubject){
                                                                                            deepCopied[f][d][per] = o
                                                                                        }
                                                                                    }
                                                                                }
                                                                            })
                                                                        }
                                                                    }
                                                                    
                                                                }
                                                            }
                                                        }
                                                        else{
                                                            
                                                            if(o.Subject === 'Tamil' || o.Subject === 'English'){
                                                                let rrr = Object.keys(deepCopied).some(f=>{
                                                                    let stdForCheck = parseInt(f.match(/\d+/)[0])
                                                                    if(stdForCheck === std){
                                                                        
                                                                        let groupForCheck = '';
                                                                        groupForCheck = f.slice(4)
                                                                        groupForCheck = groupForCheck.slice(0, -4)
                                                                        
                                                                        if(f.includes(gender)){
                                                                           
                                                                            let loopingSectionConatinsCurrentSubject = subObj[groupForCheck].some(subListForCkeck=>{
                                                                                return subListForCkeck === o.Subject
                                                                            })

                                                                            if(loopingSectionConatinsCurrentSubject){
                                                                                if(deepCopied[f][d][per] !== ''){
                                                                                    return true
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                })
                                                                if(rrr === false){
                                                                    deepCopied[items][d][per] = o
                                                                
                                                                    Object.keys(deepCopied).map(f=>{
                                                                        let stdForCheck = parseInt(f.match(/\d+/)[0])
                                                                        if(stdForCheck === std){
                                                                            
                                                                            let groupForCheck = '';
                                                                            groupForCheck = f.slice(4)
                                                                            groupForCheck = groupForCheck.slice(0, -4)
                                                                            
                                                                            if(f.includes(gender)){
                                                                               
                                                                                let loopingSectionConatinsCurrentSubject = subObj[groupForCheck].some(subListForCkeck=>{
                                                                                    return subListForCkeck === o.Subject
                                                                                })

                                                                                if(loopingSectionConatinsCurrentSubject){
                                                                                    deepCopied[f][d][per] = o
                                                                                }
                                                                            }
                                                                        }
                                                                    })
                                                                }
                                                            }
                                                            // else if(o.Subject === 'Maths'){
                                                            //     deepCopied[items][d][per] = o
                                                            // }
                                                            // else if(o.Subject === 'Commerce'){
                                                            //     Object.keys(deepCopied).map(sec=>{
                                                            //         let stdcheckForCombinedClasses = parseInt(sec.match(/\d+/)[0])
                                                            //         if(std === stdcheckForCombinedClasses){
                                                            //             let groupForCheck = '';
                                                            //             groupForCheck = sec.slice(4)
                                                            //             groupForCheck = groupForCheck.slice(0, -4)

                                                            //             let loopingSectionConatinsCurrentSubject = subObj[groupForCheck].some(subListForCkeck=>{
                                                            //                 return subListForCkeck === o.Subject
                                                            //             })

                                                            //             if(loopingSectionConatinsCurrentSubject){
                                                            //                 deepCopied[sec][d][per] = o
                                                            //             }
                                                            //         }
                                                            //     })             
                                                            // }
                                                            
                                                            // if(d === 'Monday' && (o.Subject === 'Tamil' || o.Subject === 'English' || o.Subject === 'Maths' || o.Subject === 'Science' || o.Subject === 'Maths')){
                                                            //     deepCopied[items][d][per] = o
                                                            // }
                                                            // else if(d === 'Tuesday' && o.subject !== deepCopied[items]['Monday'][per]['Subject'] && (o.Subject === 'Tamil' || o.Subject === 'English' || o.Subject === 'Maths' || o.Subject === 'Science' || o.Subject === 'Maths')){
                                                            //     deepCopied[items][d][per] = o
                                                            // }
                                                            // else if(d === 'Wednesday' && o.subject !== deepCopied[items]['Tuesday'][per]['Subject'] && (o.Subject === 'Tamil' || o.Subject === 'English' || o.Subject === 'Maths' || o.Subject === 'Science' || o.Subject === 'Maths')){
                                                            //     deepCopied[items][d][per] = o
                                                            // }
                                                            
                                                            // if((d === 'Thursday' || d === 'Friday') && (o.Subject === 'Tamil' || o.Subject === 'English' || o.Subject === 'Maths' || o.Subject === 'Science' || o.Subject === 'Maths')){
                                                            //     deepCopied[items][d][per] = o
                                                            // }
                                                        }
                                                    }
                                                }
                                            }
                                        }

                                        if(std !== 11 && std !== 12){
                                            if(std <= 5){
                                                if(std === 1 || std === 2){
                                                    const currentStdSectionsValues = [];
                                                    const keysInWholeSchool = Object.keys(deepCopied)
                                                    keysInWholeSchool.map(list=>{
                                                        if(parseInt(list.match(/\d+/)[0]) === std){
                                                            currentStdSectionsValues.push(deepCopied[list])
                                                        }
                                                    })
                                                    for(let i=0;i<currentStdSectionsValues.length;i++){     //current std's sections loop
                                                        let EachsectionValue = Object.values(currentStdSectionsValues[i]) //current sections value
                                                        for(let yy=0;yy<EachsectionValue.length;yy++){   //days loop
                                                            let EachDayValues = Object.values(EachsectionValue[yy])
                                                            let b = false;
                                                            for(let xx=0;xx<EachDayValues.length;xx++){   //periods loop
                                                                let sameSction = false;
                                                                if(i === 0 && items.includes('A')){
                                                                    sameSction = true
                                                                }
                                                                else if(i === 1 && items.includes('B')){
                                                                    sameSction = true
                                                                }
                                                                else if(i === 2 && items.includes('C')){
                                                                    sameSction = true
                                                                }
                                                                else if(i === 3 && items.includes('D')){
                                                                    sameSction = true
                                                                }
                                                                else if(i === 4 && items.includes('E')){
                                                                    sameSction = true
                                                                }
                                                                
                                                                if(!sameSction){
                                                                    if(EachDayValues[xx] !== '' && EachDayValues[xx]['ID'] === o.ID){
                                                                        IsAnyStaffinMorethanaSectionsForaSTDCount++;
                                                                        b = true;
                                                                        break;
                                                                    }
                                                                }
                                                            
                                                            }
                                                            if(b){
                                                                break;
                                                            }
                                                        }
                                                        if(IsAnyStaffinMorethanaSectionsForaSTDCount === FORIFCONditionIsAnyStaffinMorethanaSectionsForaSTDCount){
                                                            IsAnyStaffinMorethanaSectionsForaSTD = true;
                                                            break
                                                        }
                                                    }
                        
                                                    let MultipleTeacherWithSameSubject = false;
                                       
                                                    for(let key in deepCopied[items]){
                                                        for(let checkPer in deepCopied[items][key]){
                                                            if(deepCopied[items][key][checkPer] !== '' && o.Subject === deepCopied[items][key][checkPer]['Subject'] && o.ID !== deepCopied[items][key][checkPer]['ID']){
                                                                MultipleTeacherWithSameSubject = true;
                                                                break;
                                                            }
                                                        }
                                                    }

                                                    
                                                
                                                    if(!IsAnyStaffinMorethanaSectionsForaSTD){
                                                        if(!MultipleTeacherWithSameSubject){
                                                            const isIDExist = Object.keys(deepCopied).some(k=>{
                                                                if(deepCopied[k][d][per] !== ''){
                                                                    return deepCopied[k][d][per]['ID'] === o.ID
                                                                } 
                                                            })
                                                            if(deepCopied[items][d][per] === '' && isIDExist === false){
                                                                if(i>1){
                                                                    let motherTeacher = false;
                                                                    let otherSubjectTecaher = false;
                                                                    if(o.Subject === 'Tamil' || o.Subject === 'English' || o.Subject === 'Maths' || o.Subject === 'EVS' || o.Subject === 'GK' || o.Subject === 'Computer Science'){
                                                                        if(o.ID === deepCopied[items]['Monday']['per1']['ID']){
                                                                            motherTeacher = true
                                                                        }
                                                                    }
                                                                    else{
                                                                        otherSubjectTecaher = true;
                                                                    }
                                                                    
                                                                    if(motherTeacher){
                                                                        const prevprevPeriod = 'per'+(i-2);
                                                                        const prevPeriod = 'per'+(i-1);
                                                                        if(deepCopied[items][d][prevPeriod] !== '' && deepCopied[items][d][prevPeriod]['ID'] !== o.ID){  //previos period check
                                                                            let isSubjectFound = false; //already subject exist in this day
                                                                            const data = deepCopied[items][d];
                                    
                                                                            for (const key in data) {
                                                                                if (Object.hasOwnProperty.call(data, key)) {
                                                                                    const period = data[key];
                                                                                    if (period && period.Subject === o.Subject) {
                                                                                        isSubjectFound = true;
                                                                                        break;
                                                                                    }
                                                                                }
                                                                            }
                                    
                                                                            if (!isSubjectFound) {
                                                                                deepCopied[items][d][per] = o;
                                                                            }
                                                                        }
                                                                        else if((i>=3) && deepCopied[items][d][prevprevPeriod] !== '' && deepCopied[items][d][prevprevPeriod]['ID'] !== o.ID){ //previos of previos period check
                                                                            let isSubjectFound = false; //already subject exist in this day
                                                                            const data = deepCopied[items][d];
                                    
                                                                            for (const key in data) {
                                                                                if (Object.hasOwnProperty.call(data, key)) {
                                                                                    const period = data[key];
                                                                                    if (period && period.Subject === o.Subject) {
                                                                                        isSubjectFound = true;
                                                                                        break;
                                                                                    }
                                                                                }
                                                                            }
                                    
                                                                            if (!isSubjectFound) {
                                                                                deepCopied[items][d][per] = o;
                                                                            }
                                                                        }
                                                                        else if(deepCopied[items][d][prevPeriod] === '' ){
                                                                            let isSubjectFound = false; //already subject exist in this day
                                                                            const data = deepCopied[items][d];
                                    
                                                                            for (const key in data) {
                                                                                if (Object.hasOwnProperty.call(data, key)) {
                                                                                    const period = data[key];
                                                                                    if (period && period.Subject === o.Subject) {
                                                                                        isSubjectFound = true;
                                                                                        break;
                                                                                    }
                                                                                }
                                                                            }
                                    
                                                                            if (!isSubjectFound) {
                                                                                deepCopied[items][d][per] = o;
                                                                            }
                                                                        }
                                                                    }
                                                                    else if(otherSubjectTecaher){
                                                                        
                                                                        if(d === 'Tuesday'){
                                                                            if(deepCopied[items]['Monday'][per]['Subject'] !== o.Subject){
                                                                                const prevPeriod = 'per'+(i-1);
                                                                                if(deepCopied[items][d][prevPeriod] !== '' && deepCopied[items][d][prevPeriod]['ID'] !== o.ID){  //previos period check
                                                                                    let isSubjectFound = false; //already subject exist in this day
                                                                                    const data = deepCopied[items][d];
                                            
                                                                                    for (const key in data) {
                                                                                        if (Object.hasOwnProperty.call(data, key)) {
                                                                                            const period = data[key];
                                                                                            if (period && period.Subject === o.Subject) {
                                                                                                isSubjectFound = true;
                                                                                                break;
                                                                                            }
                                                                                        }
                                                                                    }
                                            
                                                                                    if (!isSubjectFound) {
                                                                                        deepCopied[items][d][per] = o;
                                                                                    }
                                                                                }
                                                                                else if(deepCopied[items][d][prevPeriod] === '' ){
                                                                                    let isSubjectFound = false; //already subject exist in this day
                                                                                    const data = deepCopied[items][d];
                                            
                                                                                    for (const key in data) {
                                                                                        if (Object.hasOwnProperty.call(data, key)) {
                                                                                            const period = data[key];
                                                                                            if (period && period.Subject === o.Subject) {
                                                                                                isSubjectFound = true;
                                                                                                break;
                                                                                            }
                                                                                        }
                                                                                    }
                                            
                                                                                    if (!isSubjectFound) {
                                                                                        deepCopied[items][d][per] = o;
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                        else if(d === 'Wednesday'){
                                                                            if(deepCopied[items]['Tuesday'][per]['Subject'] !== o.Subject){
                                                                                const prevPeriod = 'per'+(i-1);
                                                                                if(deepCopied[items][d][prevPeriod] !== '' && deepCopied[items][d][prevPeriod]['ID'] !== o.ID){  //previos period check
                                                                                    let isSubjectFound = false; 
                                                                                    const data = deepCopied[items][d];
                                            
                                                                                    for (const key in data) {
                                                                                        if (Object.hasOwnProperty.call(data, key)) {
                                                                                            const period = data[key];
                                                                                            if (period && period.Subject === o.Subject) {
                                                                                                isSubjectFound = true;
                                                                                                break;
                                                                                            }
                                                                                        }
                                                                                    }
                                            
                                                                                    if (!isSubjectFound) {
                                                                                        deepCopied[items][d][per] = o;
                                                                                    }
                                                                                }
                                                                                else if(deepCopied[items][d][prevPeriod] === '' ){
                                                                                    let isSubjectFound = false; //already subject exist in this day
                                                                                    const data = deepCopied[items][d];
                                            
                                                                                    for (const key in data) {
                                                                                        if (Object.hasOwnProperty.call(data, key)) {
                                                                                            const period = data[key];
                                                                                            if (period && period.Subject === o.Subject) {
                                                                                                isSubjectFound = true;
                                                                                                break;
                                                                                            }
                                                                                        }
                                                                                    }
                                            
                                                                                    if (!isSubjectFound) {
                                                                                        deepCopied[items][d][per] = o;
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                        else{
                                                                            const prevPeriod = 'per'+(i-1);
                                                                            if(deepCopied[items][d][prevPeriod] !== '' && deepCopied[items][d][prevPeriod]['ID'] !== o.ID){  //previos period check
                                                                                let isSubjectFound = false; 
                                                                                const data = deepCopied[items][d];
                                        
                                                                                for (const key in data) {
                                                                                    if (Object.hasOwnProperty.call(data, key)) {
                                                                                        const period = data[key];
                                                                                        if (period && period.Subject === o.Subject) {
                                                                                            isSubjectFound = true;
                                                                                            break;
                                                                                        }
                                                                                    }
                                                                                }
                                        
                                                                                if (!isSubjectFound) {
                                                                                    deepCopied[items][d][per] = o;
                                                                                }
                                                                            }
                                                                            else if(deepCopied[items][d][prevPeriod] === '' ){
                                                                                let isSubjectFound = false; //already subject exist in this day
                                                                                const data = deepCopied[items][d];
                                        
                                                                                for (const key in data) {
                                                                                    if (Object.hasOwnProperty.call(data, key)) {
                                                                                        const period = data[key];
                                                                                        if (period && period.Subject === o.Subject) {
                                                                                            isSubjectFound = true;
                                                                                            break;
                                                                                        }
                                                                                    }
                                                                                }
                                        
                                                                                if (!isSubjectFound) {
                                                                                    deepCopied[items][d][per] = o;
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                                else{
                                                                    if(d === 'Monday' && (o.Subject === 'Tamil' || o.Subject === 'English' || o.Subject === 'Maths' || o.Subject === 'EVS')){
                                                                        deepCopied[items][d][per] = o
                                                                    }
                                                                    else if(d === 'Tuesday' && o.subject !== deepCopied[items]['Monday'][per]['Subject'] && (o.Subject === 'Tamil' || o.Subject === 'English' || o.Subject === 'Maths' || o.Subject === 'EVS')){
                                                                        if(o.ID === deepCopied[items]['Monday']['per1']['ID'] && o.Subject !== deepCopied[items]['Monday']['per1']['Subject']){
                                                                            deepCopied[items][d][per] = o
                                                                        }    
                                                                    }
                                                                    else if(d === 'Wednesday' && o.subject !== deepCopied[items]['Tuesday'][per]['Subject'] && (o.Subject === 'Tamil' || o.Subject === 'English' || o.Subject === 'Maths' || o.Subject === 'EVS')){
                                                                        if(o.ID === deepCopied[items]['Monday']['per1']['ID'] && o.Subject !== deepCopied[items]['Tuesday']['per1']['Subject']){
                                                                            deepCopied[items][d][per] = o
                                                                        } 
                                                                    }
                                                                    
                                                                    if((d === 'Thursday' || d === 'Friday') && ( o.Subject === 'Tamil' || o.Subject === 'English' || o.Subject === 'Maths' || o.Subject === 'EVS')){
                                                                        if(o.ID === deepCopied[items]['Monday']['per1']['ID'] && o.Subject !== deepCopied[items]['Wednesday']['per1']['Subject']){
                                                                            deepCopied[items][d][per] = o
                                                                        } 
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                                else{ // 3,4,5 std
                                                    const currentStdSectionsValues = [];
                                                    const keysInWholeSchool = Object.keys(deepCopied)
                                                    keysInWholeSchool.map(list=>{
                                                        if(parseInt(list.match(/\d+/)[0]) === std){
                                                            currentStdSectionsValues.push(deepCopied[list])
                                                        }
                                                    })
                                                    for(let i=0;i<currentStdSectionsValues.length;i++){     //current std's sections loop
                                                        let EachsectionValue = Object.values(currentStdSectionsValues[i]) //current sections value
                                                        for(let yy=0;yy<EachsectionValue.length;yy++){   //days loop
                                                            let EachDayValues = Object.values(EachsectionValue[yy])
                                                            let b = false;
                                                            for(let xx=0;xx<EachDayValues.length;xx++){   //periods loop
                                                                let sameSction = false;
                                                                if(i === 0 && items.includes('A')){
                                                                    sameSction = true
                                                                }
                                                                else if(i === 1 && items.includes('B')){
                                                                    sameSction = true
                                                                }
                                                                else if(i === 2 && items.includes('C')){
                                                                    sameSction = true
                                                                }
                                                                else if(i === 3 && items.includes('D')){
                                                                    sameSction = true
                                                                }
                                                                else if(i === 4 && items.includes('E')){
                                                                    sameSction = true
                                                                }
                                                                
                                                                if(!sameSction){
                                                                    if(EachDayValues[xx] !== '' && EachDayValues[xx]['ID'] === o.ID){
                                                                        IsAnyStaffinMorethanaSectionsForaSTDCount++;
                                                                        b = true;
                                                                        break;
                                                                    }
                                                                }
                                                            
                                                            }
                                                            if(b){
                                                                break;
                                                            }
                                                        }
                                                        if(IsAnyStaffinMorethanaSectionsForaSTDCount === FORIFCONditionIsAnyStaffinMorethanaSectionsForaSTDCount){
                                                            IsAnyStaffinMorethanaSectionsForaSTD = true;
                                                            break
                                                        }
                                                    }
                        
                                                    let MultipleTeacherWithSameSubject = false;
                                                    for(let key in deepCopied[items]){
                                                        for(let checkPer in deepCopied[items][key]){
                                                            if(deepCopied[items][key][checkPer] !== '' && o.Subject === deepCopied[items][key][checkPer]['Subject'] && o.ID !== deepCopied[items][key][checkPer]['ID']){
                                                                MultipleTeacherWithSameSubject = true;
                                                                break;
                                                            }
                                                        }
                                                    }
                                                    if(!IsAnyStaffinMorethanaSectionsForaSTD){
                                                        if(!MultipleTeacherWithSameSubject){
                                                            const isIDExist = Object.keys(deepCopied).some(k=>{
                                                                if(deepCopied[k][d][per] !== ''){
                                                                    return deepCopied[k][d][per]['ID'] === o.ID
                                                                } 
                                                            })
                                                            if(deepCopied[items][d][per] === '' && isIDExist === false){
                                                                if(i>1){
                                                                    let motherTeacher = false;
                                                                    let otherSubjectTecaher = false;
                                                                    if(o.Subject === 'Tamil' || o.Subject === 'English' || o.Subject === 'Maths' || o.Subject === 'Science' || o.Subject === 'Social Science' || o.Subject === 'GK'){
                                                                        if(o.ID === deepCopied[items]['Monday']['per1']['ID']){
                                                                            motherTeacher = true
                                                                        }
                                                                    }
                                                                    else{
                                                                        otherSubjectTecaher = true;
                                                                    }
                                                                    
                                                                    if(motherTeacher){
                                                                        const prevprevPeriod = 'per'+(i-2);
                                                                        const prevPeriod = 'per'+(i-1);
                                                                        if(deepCopied[items][d][prevPeriod] !== '' && deepCopied[items][d][prevPeriod]['ID'] !== o.ID){  //previos period check
                                                                            let isSubjectFound = false; //already subject exist in this day
                                                                            const data = deepCopied[items][d];
                                    
                                                                            for (const key in data) {
                                                                                if (Object.hasOwnProperty.call(data, key)) {
                                                                                    const period = data[key];
                                                                                    if (period && period.Subject === o.Subject) {
                                                                                        isSubjectFound = true;
                                                                                        break;
                                                                                    }
                                                                                }
                                                                            }
                                    
                                                                            if (!isSubjectFound) {
                                                                                deepCopied[items][d][per] = o;
                                                                            }
                                                                        }
                                                                        else if((i>=3) && deepCopied[items][d][prevprevPeriod] !== '' && deepCopied[items][d][prevprevPeriod]['ID'] !== o.ID){ //previos of previos period check
                                                                            let isSubjectFound = false; //already subject exist in this day
                                                                            const data = deepCopied[items][d];
                                    
                                                                            for (const key in data) {
                                                                                if (Object.hasOwnProperty.call(data, key)) {
                                                                                    const period = data[key];
                                                                                    if (period && period.Subject === o.Subject) {
                                                                                        isSubjectFound = true;
                                                                                        break;
                                                                                    }
                                                                                }
                                                                            }
                                    
                                                                            if (!isSubjectFound) {
                                                                                deepCopied[items][d][per] = o;
                                                                            }
                                                                        }
                                                                        else if(deepCopied[items][d][prevPeriod] === '' ){
                                                                            let isSubjectFound = false; //already subject exist in this day
                                                                            const data = deepCopied[items][d];
                                    
                                                                            for (const key in data) {
                                                                                if (Object.hasOwnProperty.call(data, key)) {
                                                                                    const period = data[key];
                                                                                    if (period && period.Subject === o.Subject) {
                                                                                        isSubjectFound = true;
                                                                                        break;
                                                                                    }
                                                                                }
                                                                            }
                                    
                                                                            if (!isSubjectFound) {
                                                                                deepCopied[items][d][per] = o;
                                                                            }
                                                                        }
                                                                    }
                                                                    else if(otherSubjectTecaher){
                                                                        
                                                                        if(d === 'Tuesday'){
                                                                            if(deepCopied[items]['Monday'][per]['Subject'] !== o.Subject){
                                                                                const prevPeriod = 'per'+(i-1);
                                                                                if(deepCopied[items][d][prevPeriod] !== '' && deepCopied[items][d][prevPeriod]['ID'] !== o.ID){  //previos period check
                                                                                    let isSubjectFound = false; //already subject exist in this day
                                                                                    const data = deepCopied[items][d];
                                            
                                                                                    for (const key in data) {
                                                                                        if (Object.hasOwnProperty.call(data, key)) {
                                                                                            const period = data[key];
                                                                                            if (period && period.Subject === o.Subject) {
                                                                                                isSubjectFound = true;
                                                                                                break;
                                                                                            }
                                                                                        }
                                                                                    }
                                            
                                                                                    if (!isSubjectFound) {
                                                                                        deepCopied[items][d][per] = o;
                                                                                    }
                                                                                }
                                                                                else if(deepCopied[items][d][prevPeriod] === '' ){
                                                                                    let isSubjectFound = false; //already subject exist in this day
                                                                                    const data = deepCopied[items][d];
                                            
                                                                                    for (const key in data) {
                                                                                        if (Object.hasOwnProperty.call(data, key)) {
                                                                                            const period = data[key];
                                                                                            if (period && period.Subject === o.Subject) {
                                                                                                isSubjectFound = true;
                                                                                                break;
                                                                                            }
                                                                                        }
                                                                                    }
                                            
                                                                                    if (!isSubjectFound) {
                                                                                        deepCopied[items][d][per] = o;
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                        else if(d === 'Wednesday'){
                                                                            if(deepCopied[items]['Tuesday'][per]['Subject'] !== o.Subject){
                                                                                const prevPeriod = 'per'+(i-1);
                                                                                if(deepCopied[items][d][prevPeriod] !== '' && deepCopied[items][d][prevPeriod]['ID'] !== o.ID){  //previos period check
                                                                                    let isSubjectFound = false; 
                                                                                    const data = deepCopied[items][d];
                                            
                                                                                    for (const key in data) {
                                                                                        if (Object.hasOwnProperty.call(data, key)) {
                                                                                            const period = data[key];
                                                                                            if (period && period.Subject === o.Subject) {
                                                                                                isSubjectFound = true;
                                                                                                break;
                                                                                            }
                                                                                        }
                                                                                    }
                                            
                                                                                    if (!isSubjectFound) {
                                                                                        deepCopied[items][d][per] = o;
                                                                                    }
                                                                                }
                                                                                else if(deepCopied[items][d][prevPeriod] === '' ){
                                                                                    let isSubjectFound = false; //already subject exist in this day
                                                                                    const data = deepCopied[items][d];
                                            
                                                                                    for (const key in data) {
                                                                                        if (Object.hasOwnProperty.call(data, key)) {
                                                                                            const period = data[key];
                                                                                            if (period && period.Subject === o.Subject) {
                                                                                                isSubjectFound = true;
                                                                                                break;
                                                                                            }
                                                                                        }
                                                                                    }
                                            
                                                                                    if (!isSubjectFound) {
                                                                                        deepCopied[items][d][per] = o;
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                        else{
                                                                            const prevPeriod = 'per'+(i-1);
                                                                            if(deepCopied[items][d][prevPeriod] !== '' && deepCopied[items][d][prevPeriod]['ID'] !== o.ID){  //previos period check
                                                                                let isSubjectFound = false; 
                                                                                const data = deepCopied[items][d];
                                        
                                                                                for (const key in data) {
                                                                                    if (Object.hasOwnProperty.call(data, key)) {
                                                                                        const period = data[key];
                                                                                        if (period && period.Subject === o.Subject) {
                                                                                            isSubjectFound = true;
                                                                                            break;
                                                                                        }
                                                                                    }
                                                                                }
                                        
                                                                                if (!isSubjectFound) {
                                                                                    deepCopied[items][d][per] = o;
                                                                                }
                                                                            }
                                                                            else if(deepCopied[items][d][prevPeriod] === '' ){
                                                                                let isSubjectFound = false; //already subject exist in this day
                                                                                const data = deepCopied[items][d];
                                        
                                                                                for (const key in data) {
                                                                                    if (Object.hasOwnProperty.call(data, key)) {
                                                                                        const period = data[key];
                                                                                        if (period && period.Subject === o.Subject) {
                                                                                            isSubjectFound = true;
                                                                                            break;
                                                                                        }
                                                                                    }
                                                                                }
                                        
                                                                                if (!isSubjectFound) {
                                                                                    deepCopied[items][d][per] = o;
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                                else{
                                                                    if(d === 'Monday' && (o.Subject === 'Tamil' || o.Subject === 'English' || o.Subject === 'Maths' || o.Subject === 'Science' || o.Subject === 'Social Science')){
                                                                        deepCopied[items][d][per] = o
                                                                    }
                                                                    else if(d === 'Tuesday' && o.subject !== deepCopied[items]['Monday'][per]['Subject'] && (o.Subject === 'Tamil' || o.Subject === 'English' || o.Subject === 'Maths' || o.Subject === 'Science' || o.Subject === 'Social Science')){
                                                                        if(o.ID === deepCopied[items]['Monday']['per1']['ID']){
                                                                            deepCopied[items][d][per] = o
                                                                        }    
                                                                    }
                                                                    else if(d === 'Wednesday' && o.subject !== deepCopied[items]['Tuesday'][per]['Subject'] && (o.Subject === 'Tamil' || o.Subject === 'English' || o.Subject === 'Maths' || o.Subject === 'Science' || o.Subject === 'Social Science')){
                                                                        if(o.ID === deepCopied[items]['Monday']['per1']['ID']){
                                                                            deepCopied[items][d][per] = o
                                                                        } 
                                                                    }
                                                                    
                                                                    if((d === 'Thursday' || d === 'Friday') && o.subject !== deepCopied[items]['Wednesday'][per]['Subject'] && (o.Subject === 'Tamil' || o.Subject === 'English' || o.Subject === 'Maths' || o.Subject === 'Science' || o.Subject === 'Social Science')){
                                                                        if(o.ID === deepCopied[items]['Monday']['per1']['ID']){
                                                                            deepCopied[items][d][per] = o
                                                                        } 
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                            else{                                  //std 6,7,8,9,10
                                                const currentStdSectionsValues = [];
                                                const keysInWholeSchool = Object.keys(deepCopied)
                                                keysInWholeSchool.map(list=>{
                                                    if(parseInt(list.match(/\d+/)[0]) === std){
                                                        currentStdSectionsValues.push(deepCopied[list])
                                                    }
                                                })
                                                for(let i=0;i<currentStdSectionsValues.length;i++){     //current std's sections loop
                                                    let EachsectionValue = Object.values(currentStdSectionsValues[i]) //current sections value
                                                    for(let yy=0;yy<EachsectionValue.length;yy++){   //days loop
                                                        let EachDayValues = Object.values(EachsectionValue[yy])
                                                        let b = false;
                                                        for(let xx=0;xx<EachDayValues.length;xx++){   //periods loop
                                                            let sameSction = false;
                                                            if(i === 0 && items.includes('A')){
                                                                sameSction = true
                                                            }
                                                            else if(i === 1 && items.includes('B')){
                                                                sameSction = true
                                                            }
                                                            else if(i === 2 && items.includes('C')){
                                                                sameSction = true
                                                            }
                                                            else if(i === 3 && items.includes('D')){
                                                                sameSction = true
                                                            }
                                                            else if(i === 4 && items.includes('E')){
                                                                sameSction = true
                                                            }
                                                            
                                                            if(!sameSction){
                                                                if(EachDayValues[xx] !== '' && EachDayValues[xx]['ID'] === o.ID){
                                                                    IsAnyStaffinMorethanaSectionsForaSTDCount++;
                                                                    b = true;
                                                                    break;
                                                                }
                                                            }
                                                        
                                                        }
                                                        if(b){
                                                            break;
                                                        }
                                                    }
                                                    if(IsAnyStaffinMorethanaSectionsForaSTDCount === FORIFCONditionIsAnyStaffinMorethanaSectionsForaSTDCount){
                                                        IsAnyStaffinMorethanaSectionsForaSTD = true;
                                                        break
                                                    }
                                                }
                    
                                                let MultipleTeacherWithSameSubject = false;
                                                for(let key in deepCopied[items]){
                                                    for(let checkPer in deepCopied[items][key]){
                                                        if(deepCopied[items][key][checkPer] !== '' && o.Subject === deepCopied[items][key][checkPer]['Subject'] && o.ID !== deepCopied[items][key][checkPer]['ID']){
                                                            MultipleTeacherWithSameSubject = true;
                                                            break;
                                                        }
                                                    }
                                                }

                                                if(!IsAnyStaffinMorethanaSectionsForaSTD){
                                                    if(!MultipleTeacherWithSameSubject){
                                                        const isIDExist = Object.keys(deepCopied).some(k=>{
                                                            if(deepCopied[k][d][per] !== ''){
                                                                return deepCopied[k][d][per]['ID'] === o.ID
                                                            } 
                                                        })
                                                        if(deepCopied[items][d][per] === '' && isIDExist === false){
                                                            if(i>1){
                                                                const prevPeriod = 'per'+(i-1);
                                                                if(deepCopied[items][d][prevPeriod] !== '' && deepCopied[items][d][prevPeriod]['Subject'] !== o.Subject){
                                                                    let isSubjectFound = false;
                                                                    const data = deepCopied[items][d];
                            
                                                                    for (const key in data) {
                                                                        if (Object.hasOwnProperty.call(data, key)) {
                                                                            const period = data[key];
                                                                            if (period && period.Subject === o.Subject) {
                                                                                isSubjectFound = true;
                                                                                break;
                                                                            }
                                                                        }
                                                                    }
                            
                                                                    if (!isSubjectFound) {
                                                                        if(d === 'Tuesday'){
                                                                            if(deepCopied[items]['Monday'][per]['Subject'] !== o.Subject){
                                                                                deepCopied[items][d][per] = o;
                                                                            }
                                                                        }
                                                                        else if(d === 'Wednesday'){
                                                                            if(deepCopied[items]['Tuesday'][per]['Subject'] !== o.Subject){
                                                                                deepCopied[items][d][per] = o;
                                                                            }
                                                                        }
                                                                        else{
                                                                            deepCopied[items][d][per] = o;
                                                                        }
                                                                    }
                                                                }
                                                                else{
                                                                    let isSubjectFound = false;
                                                                    const data = deepCopied[items][d];
                                                                    for (const key in data) {
                                                                        if (Object.hasOwnProperty.call(data, key)) {
                                                                            const person = data[key];
                                                                            if (person && person.Subject === o.Subject) {
                                                                                isSubjectFound = true;
                                                                                break;
                                                                            }
                                                                        }
                                                                    }
                                                                    if(isSubjectFound === false){
                                                                        if(d === 'Tuesday'){
                                                                            if(deepCopied[items]['Monday'][per]['Subject'] !== o.Subject){
                                                                                deepCopied[items][d][per] = o;
                                                                            }
                                                                        }
                                                                        else if(d === 'Wednesday'){
                                                                            if(deepCopied[items]['Tuesday'][per]['Subject'] !== o.Subject){
                                                                                deepCopied[items][d][per] = o;
                                                                            }
                                                                        }
                                                                        else{
                                                                            deepCopied[items][d][per] = o;
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                            else{
                                                                if(d === 'Monday' && (o.Subject === 'Tamil' || o.Subject === 'English' || o.Subject === 'Maths' || o.Subject === 'Science' || o.Subject === 'Science1' || o.Subject === 'Science2' || o.Subject === 'Social Science')){
                                                                    deepCopied[items][d][per] = o
                                                                }
                                                                else if(d === 'Tuesday' && o.subject !== deepCopied[items]['Monday'][per]['Subject'] && (o.Subject === 'Tamil' || o.Subject === 'English' || o.Subject === 'Maths' || o.Subject === 'Science' || o.Subject === 'Science1' || o.Subject === 'Science2'  || o.Subject === 'Social Science')){
                                                                    
                                                                        deepCopied[items][d][per] = o
                                                                      
                                                                }
                                                                else if(d === 'Wednesday' && o.subject !== deepCopied[items]['Tuesday'][per]['Subject'] && (o.Subject === 'Tamil' || o.Subject === 'English' || o.Subject === 'Maths' || o.Subject === 'Science' || o.Subject === 'Science1' || o.Subject === 'Science2'  || o.Subject === 'Social Science')){
                                                                    
                                                                        deepCopied[items][d][per] = o
                                                                     
                                                                }
                                                                
                                                                if((d === 'Thursday' || d === 'Friday') && o.subject !== deepCopied[items]['Wednesday'][per]['Subject'] && (o.Subject === 'Tamil' || o.Subject === 'English' || o.Subject === 'Maths' || o.Subject === 'Science' || o.Subject === 'Science1' || o.Subject === 'Science2'  || o.Subject === 'Social Science')){
                                                                    
                                                                        deepCopied[items][d][per] = o
                                                                     
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                       }
                                     
                                    }
                                   
                                })
                            }
                        
                    }
                })

                    // Empty period in the endings
                   

                        days.map(d=>{
                            for(let i=1 ; i<=8 ; i++){
                                let per = 'per'+i;
                            if(deepCopied[items][d][per] ===  ''){
                                TeacherList.map((o,index)=>{
                                    let teacherWithDifferentGroupSubjectFor11and12 = false
                                    if(std === 11 || std === 12){
                                        if(subObj.hasOwnProperty(group)){
                                            teacherWithDifferentGroupSubjectFor11and12 = subObj[group].some(subs=>{
                                                if(subs === o.Subject){
                                                    return true
                                                }
                                            })
                                        } 
                                    }
                                    // 1 and 2 std conditions
                                    let GkCount1to2 = 0;
                                    let GK2times1to2 = false;
                                    if(std <= 2 && capitalizeFirstLetter(o.Subject) === 'GK'){
                                        const zzz = Object.values(deepCopied[items]) //values of days in a section
                                        GK2times1to2 = zzz.some(item=>{
                                            for(let key in item){
                                                if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'GK'){
                                                    GkCount1to2++;
                                                    if(GkCount1to2 === 2){
                                                        return true;
                                                    }
                                                }
                                            }
                                        })
                                    }

                                    let abacusCount1to2 = 0;
                                    let abacus3times1to2 = false;
                                    if(std <= 2 && capitalizeFirstLetter(o.Subject) === 'Abacus'){
                                        const zzz = Object.values(deepCopied[items]) //values of days in a section
                                        abacus3times1to2 = zzz.some(item=>{
                                            for(let key in item){
                                                if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Abacus'){
                                                    abacusCount1to2++;
                                                    if(abacusCount1to2 === 3){
                                                        return true;
                                                    }
                                                }
                                            }
                                        })
                                    }

                                    let evsCount1to2 = 0;
                                    let evs6times1to2 = false;
                                    if(std <= 2 && capitalizeFirstLetter(o.Subject) === 'EVS'){
                                        const zzz = Object.values(deepCopied[items]) //values of days in a section
                                        evs6times1to2 = zzz.some(item=>{
                                            for(let key in item){
                                                if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'EVS'){
                                                    evsCount1to2++;
                                                    if(evsCount1to2 === 6){
                                                        return true;
                                                    }
                                                }
                                            }
                                        })
                                    }

                                    let hindiCount1to5 = 0;
                                    let hindi2times1to5 = false;
                                    if(std <= 5 && capitalizeFirstLetter(o.Subject) === 'Hindi'){
                                        const zzz = Object.values(deepCopied[items]) //values of days in a section
                                        hindi2times1to5 = zzz.some(item=>{
                                            for(let key in item){
                                                if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Hindi'){
                                                    hindiCount1to5++;
                                                    if(hindiCount1to5 === 2){
                                                        return true;
                                                    }
                                                }
                                            }
                                        })
                                    }

                                    let hindiCount6to8 = 0;
                                    let hindi3times6to8 = false;
                                    if(std > 5 && std <= 8 && capitalizeFirstLetter(o.Subject) === 'Hindi'){
                                        const zzz = Object.values(deepCopied[items]) //values of days in a section
                                        hindi3times6to8 = zzz.some(item=>{
                                            for(let key in item){
                                                if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Hindi'){
                                                    hindiCount6to8++;
                                                    if(hindiCount6to8 === 3){
                                                        return true;
                                                    }
                                                }
                                            }
                                        })
                                    }

                                    let drawingCount1to2 = 0;
                                    let drawing1times1to2 = false;
                                    if(std <= 8 && capitalizeFirstLetter(o.Subject) === 'Drawing'){
                                        const zzz = Object.values(deepCopied[items]) //values of days in a section
                                        drawing1times1to2 = zzz.some(item=>{
                                            for(let key in item){
                                                if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Drawing'){
                                                    drawingCount1to2++;
                                                    if(drawingCount1to2 === 1){
                                                        return true;
                                                    }
                                                }
                                            }
                                        })
                                    }

                                    let HandWritingCount1to2 = 0;
                                    let HandWriting2times1to2 = false;
                                    if(std <= 2 && capitalizeFirstLetter(o.Subject) === 'HW'){
                                        const zzz = Object.values(deepCopied[items]) //values of days in a section
                                        HandWriting2times1to2 = zzz.some(item=>{
                                            for(let key in item){
                                                if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'HW'){
                                                    HandWritingCount1to2++;
                                                    if(HandWritingCount1to2 === 2){
                                                        return true;
                                                    }
                                                }
                                            }
                                        })
                                    }

                                    let csCount1to2 = 0;
                                    let cs3times1to2 = false;
                                    if(std <= 2 && capitalizeFirstLetter(o.Subject) === 'Computer Science'){
                                        const zzz = Object.values(deepCopied[items]) //values of days in a section
                                        cs3times1to2 = zzz.some(item=>{
                                            for(let key in item){
                                                if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Computer Science'){
                                                    csCount1to2++;
                                                    if(csCount1to2 === 3){
                                                        return true;
                                                    }
                                                }
                                            }
                                        })
                                    }

                                    let tamilCount1to2 = 0;
                                    let tamil5times1to2 = false;
                                    if(std <= 2 && capitalizeFirstLetter(o.Subject) === 'Tamil'){
                                        const zzz = Object.values(deepCopied[items]) //values of days in a section
                                        tamil5times1to2 = zzz.some(item=>{
                                            for(let key in item){
                                                if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Tamil'){
                                                    tamilCount1to2++;
                                                    if(tamilCount1to2 === 5){
                                                        return true;
                                                    }
                                                }
                                            }
                                        })
                                    }

                                    let englishCount1to2 = 0;
                                    let english5times1to2 = false;
                                    if(std <= 2 && capitalizeFirstLetter(o.Subject) === 'English'){
                                        const zzz = Object.values(deepCopied[items]) //values of days in a section
                                        english5times1to2 = zzz.some(item=>{
                                            for(let key in item){
                                                if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'English'){
                                                    englishCount1to2++;
                                                    if(englishCount1to2 === 5){
                                                        return true;
                                                    }
                                                }
                                            }
                                        })
                                    }

                                    let MathsCount1to2 = 0;
                                    let maths6times1to2 = false;
                                    if(std <= 2 && capitalizeFirstLetter(o.Subject) === 'Maths'){
                                        const zzz = Object.values(deepCopied[items]) //values of days in a section
                                        maths6times1to2 = zzz.some(item=>{
                                            for(let key in item){
                                                if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Maths'){
                                                    MathsCount1to2++;
                                                    if(MathsCount1to2 === 6){
                                                        return true;
                                                    }
                                                }
                                            }
                                        })
                                    }

                                      //3 to 8 std conditions
                                    
                                      let tamilCount3to8 = 0;
                                      let tamil5times3to8 = false;
                                      if(std > 2 && std <= 8 && capitalizeFirstLetter(o.Subject) === 'Tamil'){
                                          const zzz = Object.values(deepCopied[items]) //values of days in a section
                                          tamil5times3to8 = zzz.some(item=>{
                                              for(let key in item){
                                                  if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Tamil'){
                                                      tamilCount3to8++;
                                                      if(tamilCount3to8 === 5){
                                                          return true;
                                                      }
                                                  }
                                              }
                                          })
                                      }
  
                                      let englishCount3to8 = 0;
                                      let english5times3to8 = false;
                                      if(std > 2 && std <= 8 && capitalizeFirstLetter(o.Subject) === 'English'){
                                          const zzz = Object.values(deepCopied[items]) //values of days in a section
                                          english5times3to8 = zzz.some(item=>{
                                              for(let key in item){
                                                  if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'English'){
                                                      englishCount3to8++;
                                                      if(englishCount3to8 === 5){
                                                          return true;
                                                      }
                                                  }
                                              }
                                          })
                                      }
  
                                     
                                    let MathsCount3to8 = 0;
                                    let maths5times3to8 = false;
                                    if(std > 2 && std <= 8 && capitalizeFirstLetter(o.Subject) === 'Maths'){
                                        const zzz = Object.values(deepCopied[items]) //values of days in a section
                                        maths5times3to8 = zzz.some(item=>{
                                            for(let key in item){
                                                if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Maths'){
                                                    MathsCount3to8++;
                                                    if(MathsCount3to8 === 5){
                                                        return true;
                                                    }
                                                }
                                            }
                                        })
                                    }

                                    // let MathsCount6to8 = 0;
                                    // let maths6times6to8 = false;
                                    // if(std > 2 && std <= 5 && capitalizeFirstLetter(o.Subject) === 'Maths'){
                                    //     const zzz = Object.values(deepCopied[items]) //values of days in a section
                                    //     maths6times6to8 = zzz.some(item=>{
                                    //         for(let key in item){
                                    //             if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Maths'){
                                    //                 MathsCount6to8++;
                                    //                 if(MathsCount6to8 === 6){
                                    //                     return true;
                                    //                 }
                                    //             }
                                    //         }
                                    //     })
                                    // }
  
                                      let scienceCount3to8 = 0;
                                      let science5times3to8 = false;
                                      if(std > 2 && std <= 8 && capitalizeFirstLetter(o.Subject) === 'Science'){
                                          const zzz = Object.values(deepCopied[items]) //values of days in a section
                                          science5times3to8 = zzz.some(item=>{
                                              for(let key in item){
                                                  if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Science'){
                                                      scienceCount3to8++;
                                                      if(scienceCount3to8 === 5){
                                                          return true;
                                                      }
                                                  }
                                              }
                                          })
                                      }
  
                                      let socialscienceCount3to8 = 0;
                                      let socialscience5times3to8 = false;
                                      if(std > 2 && std <= 8 && capitalizeFirstLetter(o.Subject) === 'Social Science'){
                                          const zzz = Object.values(deepCopied[items]) //values of days in a section
                                          socialscience5times3to8 = zzz.some(item=>{
                                              for(let key in item){
                                                  if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Social Science'){
                                                      socialscienceCount3to8++;
                                                      if(socialscienceCount3to8 === 5){
                                                          return true;
                                                      }
                                                  }
                                              }
                                          })
                                      }
  
                                      let GkCount3to8 = 0;
                                      let GK3times3to8 = false;
                                      if(std > 2 && std <= 8 && capitalizeFirstLetter(o.Subject) === 'GK'){
                                          const zzz = Object.values(deepCopied[items]) //values of days in a section
                                          GK3times3to8 = zzz.some(item=>{
                                              for(let key in item){
                                                  if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'GK'){
                                                      GkCount3to8++;
                                                      if(GkCount3to8 === 3){
                                                          return true;
                                                      }
                                                  }
                                              }
                                          })
                                      }
  
                                      let abacusCount3to8 = 0;
                                      let abacus2times3to8 = false;
                                      if(std > 2 && std <= 8 && capitalizeFirstLetter(o.Subject) === 'Abacus'){
                                          const zzz = Object.values(deepCopied[items]) //values of days in a section
                                          abacus2times3to8 = zzz.some(item=>{
                                              for(let key in item){
                                                  if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Abacus'){
                                                      abacusCount3to8++;
                                                      if(abacusCount3to8 === 2){
                                                          return true;
                                                      }
                                                  }
                                              }
                                          })
                                      }
  
                                      let csCount3to8 = 0;
                                      let cs3times3to8 = false;
                                      if(std > 2 && std <= 8 && capitalizeFirstLetter(o.Subject) === 'Computer Science'){
                                          const zzz = Object.values(deepCopied[items]) //values of days in a section
                                          cs3times3to8 = zzz.some(item=>{
                                              for(let key in item){
                                                  if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Computer Science'){
                                                      csCount3to8++;
                                                      if(csCount3to8 === 3){
                                                          return true;
                                                      }
                                                  }
                                              }
                                          })
                                      }

                                      // 9 std condition
                                      let tamilCount9 = 0;
                                      let tamil6times9 = false;
                                      if(std === 9 && capitalizeFirstLetter(o.Subject) === 'Tamil'){
                                          const zzz = Object.values(deepCopied[items]) //values of days in a section
                                          tamil6times9 = zzz.some(item=>{
                                              for(let key in item){
                                                  if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Tamil'){
                                                        tamilCount9++;
                                                      if(tamilCount9 === 6){
                                                          return true;
                                                      }
                                                  }
                                              }
                                          })
                                      }
  
                                      let englishCount9 = 0;
                                      let english6times9 = false;
                                      if(std === 9 && capitalizeFirstLetter(o.Subject) === 'English'){
                                          const zzz = Object.values(deepCopied[items]) //values of days in a section
                                          english6times9 = zzz.some(item=>{
                                              for(let key in item){
                                                  if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'English'){
                                                      englishCount9++;
                                                      if(englishCount9 === 6){
                                                          return true;
                                                      }
                                                  }
                                              }
                                          })
                                      }
  
                                      let MathsCount9 = 0;
                                      let maths7times9 = false;
                                      if(std === 9 && capitalizeFirstLetter(o.Subject) === 'Maths'){
                                          const zzz = Object.values(deepCopied[items]) //values of days in a section
                                          maths7times9 = zzz.some(item=>{
                                              for(let key in item){
                                                  if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Maths'){
                                                    MathsCount9++;
                                                      if(MathsCount9 === 7){
                                                          return true;
                                                      }
                                                  }
                                              }
                                          })
                                      }
  
                                      let scienceCount9 = 0;
                                      let science6times9 = false;
                                      if(std === 9 && capitalizeFirstLetter(o.Subject) === 'Science'){
                                          const zzz = Object.values(deepCopied[items]) //values of days in a section
                                          science6times9 = zzz.some(item=>{
                                              for(let key in item){
                                                  if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Science'){
                                                      scienceCount9++;
                                                      if(scienceCount9 === 6){
                                                          return true;
                                                      }
                                                  }
                                              }
                                          })
                                      }
  
                                      let socialscienceCount9 = 0;
                                      let socialscience6times9 = false;
                                      if(std === 9 && capitalizeFirstLetter(o.Subject) === 'Social Science'){
                                          const zzz = Object.values(deepCopied[items]) //values of days in a section
                                          socialscience6times9 = zzz.some(item=>{
                                              for(let key in item){
                                                  if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Social Science'){
                                                      socialscienceCount9++;
                                                      if(socialscienceCount9 === 6){
                                                          return true;
                                                      }
                                                  }
                                              }
                                          })
                                      }
  
                                      let GkCount9 = 0;
                                      let GK3times9 = false;
                                      if(std === 9 && capitalizeFirstLetter(o.Subject) === 'GK'){
                                          const zzz = Object.values(deepCopied[items]) //values of days in a section
                                          GK3times9 = zzz.some(item=>{
                                              for(let key in item){
                                                  if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'GK'){
                                                      GkCount9++;
                                                      if(GkCount9 === 3){
                                                          return true;
                                                      }
                                                  }
                                              }
                                          })
                                      }

                                      let csCount9 = 0;
                                      let cs3times9 = false;
                                      if(std === 9 && capitalizeFirstLetter(o.Subject) === 'Computer Science'){
                                          const zzz = Object.values(deepCopied[items]) //values of days in a section
                                          cs3times9 = zzz.some(item=>{
                                              for(let key in item){
                                                  if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Computer Science'){
                                                      csCount9++;
                                                      if(csCount9 === 3){
                                                          return true;
                                                      }
                                                  }
                                              }
                                          })
                                      }

                                                // 10 std condition
                                                let tamilCount10 = 0;
                                                let tamil7times10 = false;
                                                if(std === 10 && capitalizeFirstLetter(o.Subject) === 'Tamil'){
                                                    const zzz = Object.values(deepCopied[items]) //values of days in a section
                                                    tamil7times10 = zzz.some(item=>{
                                                        for(let key in item){
                                                            if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Tamil'){
                                                              tamilCount10++;
                                                                if(tamilCount10 === 7){
                                                                    return true;
                                                                }
                                                            }
                                                        }
                                                    })
                                                }
            
                                                let englishCount10 = 0;
                                                let english7times10 = false;
                                                if(std === 10 && capitalizeFirstLetter(o.Subject) === 'English'){
                                                    const zzz = Object.values(deepCopied[items]) //values of days in a section
                                                    english7times10 = zzz.some(item=>{
                                                        for(let key in item){
                                                            if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'English'){
                                                              englishCount10++;
                                                                if(englishCount10 === 7){
                                                                    return true;
                                                                }
                                                            }
                                                        }
                                                    })
                                                }
            
                                                let MathsCount10 = 0;
                                                let maths8times10 = false;
                                                if(std === 10 && capitalizeFirstLetter(o.Subject) === 'Maths'){
                                                    const zzz = Object.values(deepCopied[items]) //values of days in a section
                                                    maths8times10 = zzz.some(item=>{
                                                        for(let key in item){
                                                            if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Maths'){
                                                              MathsCount10++;
                                                                if(MathsCount10 === 8){
                                                                    return true;
                                                                }
                                                            }
                                                        }
                                                    })
                                                }
            
                                                let science1Count10 = 0;
                                                let science14times10 = false;
                                                if(std === 10 && capitalizeFirstLetter(o.Subject) === 'Science1'){
                                                    const zzz = Object.values(deepCopied[items]) //values of days in a section
                                                    science14times10 = zzz.some(item=>{
                                                        for(let key in item){
                                                            if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Science1'){
                                                              science1Count10++;
                                                                if(science1Count10 === 4){
                                                                    return true;
                                                                }
                                                            }
                                                        }
                                                    })
                                                }
          
                                                let science2Count10 = 0;
                                                let science24times10 = false;
                                                if(std === 10 && capitalizeFirstLetter(o.Subject) === 'Science2'){
                                                    const zzz = Object.values(deepCopied[items]) //values of days in a section
                                                    science24times10 = zzz.some(item=>{
                                                        for(let key in item){
                                                            if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Science2'){
                                                              science2Count10++;
                                                                if(science2Count10 === 4){
                                                                    return true;
                                                                }
                                                            }
                                                        }
                                                    })
                                                }
            
                                                let socialscienceCount10 = 0;
                                                let socialscience8times10 = false;
                                                if(std === 10 && capitalizeFirstLetter(o.Subject) === 'Social Science'){
                                                    const zzz = Object.values(deepCopied[items]) //values of days in a section
                                                    socialscience8times10 = zzz.some(item=>{
                                                        for(let key in item){
                                                            if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Social Science'){
                                                              socialscienceCount10++;
                                                                if(socialscienceCount10 === 8){
                                                                    return true;
                                                                }
                                                            }
                                                        }
                                                    })
                                                }

                                                 // 11 and 12 std condition
                                            let tamilCount11and12 = 0;
                                            let tamil5times11and12= false;
                                            if(std > 10 && capitalizeFirstLetter(o.Subject) === 'Tamil'){
                                                const zzz = Object.values(deepCopied[items]) //values of days in a section
                                                tamil5times11and12 = zzz.some(item=>{
                                                    for(let key in item){
                                                        if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Tamil'){
                                                            tamilCount11and12++;
                                                            if(tamilCount11and12 === 5){
                                                                return true;
                                                            }
                                                        }
                                                    }
                                                })
                                            }
        
                                            let englishCount11and12 = 0;
                                            let english5times11and12 = false;
                                            if(std > 10 && capitalizeFirstLetter(o.Subject) === 'English'){
                                                const zzz = Object.values(deepCopied[items]) //values of days in a section
                                                english5times11and12 = zzz.some(item=>{
                                                    for(let key in item){
                                                        if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'English'){
                                                            englishCount11and12++;
                                                            if(englishCount11and12 === 5){
                                                                return true;
                                                            }
                                                        }
                                                    }
                                                })
                                            }

                                            let mathsCount11and12 = 0;
                                            let maths7times11and12 = false;
                                            if(std > 10 && capitalizeFirstLetter(o.Subject) === 'Maths'){
                                                const zzz = Object.values(deepCopied[items]) //values of days in a section
                                                maths7times11and12 = zzz.some(item=>{
                                                    for(let key in item){
                                                        if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Maths'){
                                                            mathsCount11and12++;
                                                            if(mathsCount11and12 === 7){
                                                                return true;
                                                            }
                                                        }
                                                    }
                                                })
                                            }

                                            let physicsCount11and12 = 0;
                                            let physics7times11and12 = false;
                                            if(std > 10 && capitalizeFirstLetter(o.Subject) === 'Physics'){
                                                const zzz = Object.values(deepCopied[items]) //values of days in a section
                                                physics7times11and12 = zzz.some(item=>{
                                                    for(let key in item){
                                                        if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Physics'){
                                                            physicsCount11and12++;
                                                            if(physicsCount11and12 === 7){
                                                                return true;
                                                            }
                                                        }
                                                    }
                                                })
                                            }

                                            let chemistyCount11and12 = 0;
                                            let chemisty7times11and12 = false;
                                            if(std > 10 && capitalizeFirstLetter(o.Subject) === 'Chemistry'){
                                                const zzz = Object.values(deepCopied[items]) //values of days in a section
                                                chemisty7times11and12 = zzz.some(item=>{
                                                    for(let key in item){
                                                        if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Chemistry'){
                                                            chemistyCount11and12++;
                                                            if(chemistyCount11and12 === 7){
                                                                return true;
                                                            }
                                                        }
                                                    }
                                                })
                                            }

                                            let csCount11and12 = 0;
                                            let cs7times11and12 = false;
                                            if(std > 10 && capitalizeFirstLetter(o.Subject) === 'Computer Science'){
                                                const zzz = Object.values(deepCopied[items]) //values of days in a section
                                                cs7times11and12 = zzz.some(item=>{
                                                    for(let key in item){
                                                        if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Computer Science'){
                                                            csCount11and12++;
                                                            if(csCount11and12 === 7){
                                                                return true;
                                                            }
                                                        }
                                                    }
                                                })
                                            }

                                            let botonyCount11and12 = 0;
                                            let botony4times11and12 = false;
                                            if(std > 10 && capitalizeFirstLetter(o.Subject) === 'Botony'){
                                                const zzz = Object.values(deepCopied[items]) //values of days in a section
                                                botony4times11and12 = zzz.some(item=>{
                                                    for(let key in item){
                                                        if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Botony'){
                                                            botonyCount11and12++;
                                                            if(botonyCount11and12 >= 2){
                                                                return true;
                                                            }
                                                        }
                                                    }
                                                })
                                            }
                                            botonyCount11and12 = 0
                                            
                                            let zoologyCount11and12 = 0;
                                            let zoology3times11and12 = false;
                                            if(std > 10 && capitalizeFirstLetter(o.Subject) === 'Zoology'){
                                                const zzz = Object.values(deepCopied[items]) //values of days in a section
                                                zoology3times11and12 = zzz.some(item=>{
                                                    for(let key in item){
                                                        if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Zoology'){
                                                            zoologyCount11and12++;
                                                        
                                                           
                                                            if(zoologyCount11and12 >= 3){
                                                                return true;
                                                            }
                                                        }
                                                    }
                                                })
                                            }
                                            zoologyCount11and12 = 0;

                                            let commerceCount11and12 = 0;
                                            let commerce7times11and12 = false;
                                            if(std > 10 && capitalizeFirstLetter(o.Subject) === 'Commerce'){
                                                const zzz = Object.values(deepCopied[items]) //values of days in a section
                                                commerce7times11and12 = zzz.some(item=>{
                                                    for(let key in item){
                                                        if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Commerce'){
                                                            commerceCount11and12++;
                                                            if(commerceCount11and12 === 7){
                                                                return true;
                                                            }
                                                        }
                                                    }
                                                })
                                            }

                                            let economyCount11and12 = 0;
                                            let economy7times11and12 = false;
                                            if(std > 10 && capitalizeFirstLetter(o.Subject) === 'Economy'){
                                                const zzz = Object.values(deepCopied[items]) //values of days in a section
                                                economy7times11and12 = zzz.some(item=>{
                                                    for(let key in item){
                                                        if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Economy'){
                                                            economyCount11and12++;
                                                            if(economyCount11and12 === 7){
                                                                return true;
                                                            }
                                                        }
                                                    }
                                                })
                                            }

                                            let accountancyCount11and12 = 0;
                                            let accountancy7times11and12 = false;
                                            if(std > 10 && capitalizeFirstLetter(o.Subject) === 'Accountancy'){
                                                const zzz = Object.values(deepCopied[items]) //values of days in a section
                                                accountancy7times11and12 = zzz.some(item=>{
                                                    for(let key in item){
                                                        if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Accountancy'){
                                                            accountancyCount11and12++;
                                                            if(accountancyCount11and12 === 7){
                                                                return true;
                                                            }
                                                        }
                                                    }
                                                })
                                            }

                                            let computerApplicationCount11and12 = 0;
                                            let computerApplication7times11and12 = false;
                                            if(std > 10 && capitalizeFirstLetter(o.Subject) === 'Computer Application'){
                                                const zzz = Object.values(deepCopied[items]) //values of days in a section
                                                computerApplication7times11and12 = zzz.some(item=>{
                                                    for(let key in item){
                                                        if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Computer Application'){
                                                            computerApplicationCount11and12++;
                                                            if(computerApplicationCount11and12 === 7){
                                                                return true;
                                                            }
                                                        }
                                                    }
                                                })
                                            }

                                            let EASCount11and12 = 0;
                                            let EAS7times11and12 = false;
                                            if(std > 10 && capitalizeFirstLetter(o.Subject) === 'EAS'){
                                                const zzz = Object.values(deepCopied[items]) //values of days in a section
                                                EAS7times11and12 = zzz.some(item=>{
                                                    for(let key in item){
                                                        if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'EAS'){
                                                            EASCount11and12++;
                                                            if(EASCount11and12 === 7){
                                                                return true;
                                                            }
                                                        }
                                                    }
                                                })
                                            }

                                            let BMCount11and12 = 0;
                                            let BM7times11and12 = false;
                                            if(std > 10 && capitalizeFirstLetter(o.Subject) === 'Business Maths'){
                                                const zzz = Object.values(deepCopied[items]) //values of days in a section
                                                BM7times11and12 = zzz.some(item=>{
                                                    for(let key in item){
                                                        if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Business Maths'){
                                                            BMCount11and12++;
                                                            if(BMCount11and12 === 7){
                                                                return true;
                                                            }
                                                        }
                                                    }
                                                })
                                            }

                                            let VNCount11and12 = 0;
                                            let VN7times11and12 = false;
                                            if(std > 10 && capitalizeFirstLetter(o.Subject) === 'Vocational Nurshing'){
                                                const zzz = Object.values(deepCopied[items]) //values of days in a section
                                                VN7times11and12 = zzz.some(item=>{
                                                    for(let key in item){
                                                        if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Vocational Nurshing'){
                                                            VNCount11and12++;
                                                            if(VNCount11and12 === 7){
                                                                return true;
                                                            }
                                                        }
                                                    }
                                                })
                                            }

                                            let VACount11and12 = 0;
                                            let VA7times11and12 = false;
                                            if(std > 10 && capitalizeFirstLetter(o.Subject) === 'Vocational Automobile'){
                                                const zzz = Object.values(deepCopied[items]) //values of days in a section
                                                VA7times11and12 = zzz.some(item=>{
                                                    for(let key in item){
                                                        if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Vocational Automobile'){
                                                            VACount11and12++;
                                                            if(VACount11and12 === 7){
                                                                return true;
                                                            }
                                                        }
                                                    }
                                                })
                                            }

                                            let GNCount11and12 = 0;
                                            let GN7times11and12 = false;
                                            if(std > 10 && capitalizeFirstLetter(o.Subject) === 'General Nurshing'){
                                                const zzz = Object.values(deepCopied[items]) //values of days in a section
                                                GN7times11and12 = zzz.some(item=>{
                                                    for(let key in item){
                                                        if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'General Nurshing'){
                                                            GNCount11and12++;
                                                            if(GNCount11and12 === 7){
                                                                return true;
                                                            }
                                                        }
                                                    }
                                                })
                                            }


                                    if(!GK2times1to2 && !abacus3times1to2 && !evs6times1to2 && !hindi2times1to5 && !hindi3times6to8  && !drawing1times1to2 && !HandWriting2times1to2 && !cs3times1to2 && !tamil5times1to2 && !english5times1to2 && !maths6times1to2 && !tamil5times3to8 && !english5times3to8 && !maths5times3to8 && !science5times3to8 && !socialscience5times3to8 && !GK3times3to8 && !abacus2times3to8 && !cs3times3to8 && !tamil6times9 && !english6times9 && !maths7times9 && !science6times9 && !socialscience6times9 && !GK3times9 && !cs3times9 && !tamil7times10 && !english7times10 && !maths8times10 && !science14times10 && !science24times10 && !socialscience8times10 && !tamil5times11and12 && !english5times11and12 && !maths7times11and12 && !physics7times11and12 && !chemisty7times11and12 && !cs7times11and12 && !botony4times11and12 && !zoology3times11and12 && !commerce7times11and12 && !economy7times11and12 && !accountancy7times11and12 && !computerApplication7times11and12 && !EAS7times11and12 && !BM7times11and12 && !VN7times11and12 && !VA7times11and12 && !GN7times11and12){
                                        let IsAnyStaffinMorethanaSectionsForaSTD = false;  //Any staff more than a section
                                        let IsAnyStaffinMorethanaSectionsForaSTDCount = 0;
                                        let FORIFCONditionIsAnyStaffinMorethanaSectionsForaSTDCount = 0;
                                        if(std === 11 || std === 12){
                                            FORIFCONditionIsAnyStaffinMorethanaSectionsForaSTDCount = 5
                                        }
                                        else{
                                            if(std !== 8 && o.Subject === 'Hindi'){
                                                FORIFCONditionIsAnyStaffinMorethanaSectionsForaSTDCount = 2
                                            }
                                            else if(std === 10 && o.Subject === 'Maths'){
                                                FORIFCONditionIsAnyStaffinMorethanaSectionsForaSTDCount = 2
                                            }
                                            else if(std === 10 && (o.Subject === 'Social Science' || (o.Subject === 'Science1' && o.ID === 18) || (o.Subject === 'Science2' && o.ID === 19))){
                                                FORIFCONditionIsAnyStaffinMorethanaSectionsForaSTDCount = 2
                                            }
                                            else if(std > 2 && o.Subject === 'Computer Science'){
                                                FORIFCONditionIsAnyStaffinMorethanaSectionsForaSTDCount = 2
                                            }
                                            else if(std <= 2 && o.Subject === 'HW'){
                                                FORIFCONditionIsAnyStaffinMorethanaSectionsForaSTDCount = 2
                                            }
                                            else if(std < 9 && o.Subject === 'Drawing'){
                                                FORIFCONditionIsAnyStaffinMorethanaSectionsForaSTDCount = 2
                                            }
                                            else if(std > 1 && o.Subject === 'Abacus'){
                                                FORIFCONditionIsAnyStaffinMorethanaSectionsForaSTDCount = 2
                                            }
                                            else{
                                                FORIFCONditionIsAnyStaffinMorethanaSectionsForaSTDCount = 1
                                            }
                                        }
                                        
                                        if((std === 11 || std === 12) && teacherWithDifferentGroupSubjectFor11and12){
                                            
                                            const currentStdSectionsValues = [];
                                            const keysInWholeSchool = Object.keys(deepCopied)
                                            keysInWholeSchool.map(list=>{
                                                if(Number(list.slice(0, -1)) === std){
                                                    currentStdSectionsValues.push(deepCopied[list])
                                                }
                                            })
                                            for(let i=0;i<currentStdSectionsValues.length;i++){     //sections
                                                let ff = Object.values(currentStdSectionsValues[i])
                                                for(let yy=0;yy<ff.length;yy++){   //days
                                                    let hh = Object.values(ff[yy])
                                                    let b = false;
                                                    for(let xx=0;xx<hh.length;xx++){   //periods
                                                        let sameSction = false;
                                                        if(i === 0 && items.includes('A')){
                                                            sameSction = true
                                                        }
                                                        else if(i === 1 && items.includes('B')){
                                                            sameSction = true
                                                        }
                                                        else if(i === 2 && items.includes('C')){
                                                            sameSction = true
                                                        }
                                                        else if(i === 3 && items.includes('D')){
                                                            sameSction = true
                                                        }
                                                        else if(i === 4 && items.includes('E')){
                                                            sameSction = true
                                                        }
                                                        
                                                        if(!sameSction){
                                                            if(hh[xx] !== '' && hh[xx]['ID'] === o.ID){
                                                                IsAnyStaffinMorethanaSectionsForaSTDCount++;
                                                                b = true;
                                                                break;
                                                            }
                                                        }
                                                    
                                                    }
                                                    if(b){
                                                        break;
                                                    }
                                                }
                                                if(IsAnyStaffinMorethanaSectionsForaSTDCount >= FORIFCONditionIsAnyStaffinMorethanaSectionsForaSTDCount){
                                                    IsAnyStaffinMorethanaSectionsForaSTD = true;
                                                    break
                                                }
                                            }
                
                                            let MultipleTeacherWithSameSubject = false;
                                            for(let key in deepCopied[items]){ //days
                                                for(let checkPer in deepCopied[items][key]){ //periods
                                                    if(deepCopied[items][key][checkPer] !== '' && o.Subject === deepCopied[items][key][checkPer]['Subject'] && o.ID !== deepCopied[items][key][checkPer]['ID']){
                                                        MultipleTeacherWithSameSubject = true;
                                                        break;
                                                    }
                                                }
                                            }

                                            let TeacherinDifferentGender = false

                                            if(std === 11){
                                                if(gender === '(G)'){
                                                    TeacherinDifferentGender = Object.keys(deepCopied).some(po=>{
                                                        const stdForCheck = parseInt(po.match(/\d+/)[0])
                                                        if(stdForCheck === 11){
                                                            const gendertoCheck = po.substring(po.length - 3)
                                                            if(gendertoCheck === '(B)'){
                                                                // console.log(items , po)
                                                                for(let tkey in deepCopied[po]){ //days
                                                                    for(let tper in deepCopied[po][tkey]){ //periods
                                                                        if(deepCopied[po][tkey][tper] !== '' && deepCopied[po][tkey][tper]['ID'] === o.ID && (deepCopied[po][tkey][tper]['Subject'] !== 'Botony' && deepCopied[po][tkey][tper]['Subject'] !== 'Computer Application' && deepCopied[po][tkey][tper]['Subject'] !== 'Zoology' && deepCopied[po][tkey][tper]['Subject'] !== 'Computer Science' && deepCopied[po][tkey][tper]['Subject'] !== 'Commerce' && deepCopied[po][tkey][tper]['Subject'] !== 'Economy' && deepCopied[po][tkey][tper]['Subject'] !== 'Accountancy' && deepCopied[po][tkey][tper]['Subject'] !== 'Business Maths'))
                                                                        {
                                                                            return true;
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    })
                                                }

                                                if(gender === '(B)'){
                                                    TeacherinDifferentGender = Object.keys(deepCopied).some(po=>{
                                                        const stdForCheck = parseInt(po.match(/\d+/)[0])
                                                        if(stdForCheck === 11){
                                                            const gendertoCheck = po.substring(po.length - 3)
                                                            if(gendertoCheck === '(G)'){
                                                                for(let tkey in deepCopied[po]){ //days
                                                                    for(let tper in deepCopied[po][tkey]){ //periods
                                                                        if(deepCopied[po][tkey][tper] !== '' && deepCopied[po][tkey][tper]['ID'] === o.ID && (deepCopied[po][tkey][tper]['Subject'] !== 'Botony' && deepCopied[po][tkey][tper]['Subject'] !== 'Computer Application' && deepCopied[po][tkey][tper]['Subject'] !== 'Zoology' && deepCopied[po][tkey][tper]['Subject'] !== 'Computer Science' && deepCopied[po][tkey][tper]['Subject'] !== 'Commerce' && deepCopied[po][tkey][tper]['Subject'] !== 'Economy' && deepCopied[po][tkey][tper]['Subject'] !== 'Accountancy' && deepCopied[po][tkey][tper]['Subject'] !== 'Business Maths'))
                                                                        {
                                                                            return true;
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    })
                                                }
                                            }

                                            if(std === 12){
                                                if(gender === '(G)'){
                                                    TeacherinDifferentGender = Object.keys(deepCopied).some(po=>{
                                                        const stdForCheck = parseInt(po.match(/\d+/)[0])
                                                        if(stdForCheck === 12){
                                                            const gendertoCheck = po.substring(po.length - 3)
                                                            if(gendertoCheck === '(B)'){
                                                                for(let tkey in deepCopied[po]){ //days
                                                                    for(let tper in deepCopied[po][tkey]){ //periods
                                                                        if(deepCopied[po][tkey][tper] !== '' && deepCopied[po][tkey][tper]['ID'] === o.ID && (deepCopied[po][tkey][tper]['Subject'] !== 'Botony' && deepCopied[po][tkey][tper]['Subject'] !== 'Computer Application' && deepCopied[po][tkey][tper]['Subject'] !== 'Zoology' && deepCopied[po][tkey][tper]['Subject'] !== 'Computer Science' && deepCopied[po][tkey][tper]['Subject'] !== 'Commerce' && deepCopied[po][tkey][tper]['Subject'] !== 'Economy' && deepCopied[po][tkey][tper]['Subject'] !== 'Accountancy' && deepCopied[po][tkey][tper]['Subject'] !== 'Business Maths'))
                                                                        {
                                                                            return true;
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    })
                                                }

                                                if(gender === '(B)'){
                                                    TeacherinDifferentGender = Object.keys(deepCopied).some(po=>{
                                                        const stdForCheck = parseInt(po.match(/\d+/)[0])
                                                        if(stdForCheck === 12){
                                                            const gendertoCheck = po.substring(po.length - 3)
                                                            if(gendertoCheck === '(G)'){
                                                                for(let tkey in deepCopied[po]){ //days
                                                                    for(let tper in deepCopied[po][tkey]){ //periods
                                                                        if(deepCopied[po][tkey][tper] !== '' && deepCopied[po][tkey][tper]['ID'] === o.ID && (deepCopied[po][tkey][tper]['Subject'] !== 'Botony' && deepCopied[po][tkey][tper]['Subject'] !== 'Computer Application' && deepCopied[po][tkey][tper]['Subject'] !== 'Zoology' && deepCopied[po][tkey][tper]['Subject'] !== 'Computer Science' && deepCopied[po][tkey][tper]['Subject'] !== 'Commerce' && deepCopied[po][tkey][tper]['Subject'] !== 'Economy' && deepCopied[po][tkey][tper]['Subject'] !== 'Accountancy' && deepCopied[po][tkey][tper]['Subject'] !== 'Business Maths'))
                                                                        {
                                                                            return true;
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    })
                                                }
                                            }

                                            if(!IsAnyStaffinMorethanaSectionsForaSTD && !TeacherinDifferentGender){
                                                if(!MultipleTeacherWithSameSubject){
                                                    const isIDExist = Object.keys(deepCopied).some(k=>{
                                                        if(deepCopied[k][d][per] !== ''){
                                                            return deepCopied[k][d][per]['ID'] === o.ID
                                                        } 
                                                    })
                                                    if(deepCopied[items][d][per] === '' && isIDExist === false){
                                                        if(i>1){
                                                            const prevprePeriod = 'per'+(i-2);
                                                            if(deepCopied[items][d][prevprePeriod] !== '' && i>=3 && deepCopied[items][d][prevprePeriod]['ID'] !== o.ID){
                                                                let isSubjectFound = false;
                                                                let subjectCount = 0; 
                                                                let TeacherMorethan3timesinaDay = false;
                                                                let TM3Count = 0;
                                                                const data = deepCopied[items][d];
                        
                                                                for (const key in data) {
                                                                    if (Object.hasOwnProperty.call(data, key)) {
                                                                        const period = data[key];
                                                                        if(period && period.ID === o.ID){
                                                                            TM3Count++; 
                                                                            if (TM3Count >= 3) { 
                                                                                TeacherMorethan3timesinaDay = true;
                                                                                break;
                                                                            }
                                                                        }
                                                                        if (period && period.Subject === o.Subject) {
                                                                            subjectCount++; 
                                                                            if (subjectCount >= 2) { 
                                                                                isSubjectFound = true;
                                                                                break;
                                                                            }
                                                                        }
                                                                    }
                                                                }
                        
                                                                if (!TeacherMorethan3timesinaDay && !isSubjectFound) {
                                                                    
                                                                    if(o.Subject !== 'Botony' && o.Subject !== 'Zoology' && o.Subject !== 'Computer Science' && o.Subject !== 'Computer Application' && o.Subject !== 'Commerce' && o.Subject !== 'Economy' && o.Subject !== 'Accountancy' && o.Subject !== 'Business Maths'  && o.Subject !== 'Tamil' && o.Subject !== 'English'){
                                                                        if(d === 'Tuesday' && deepCopied[items]['Monday'][per] !== '' && o.Subject !== deepCopied[items]['Monday'][per]['Subject']){
                                                                            if(deepCopied[items][d][per] === '') {
                                                                            
                                                                                deepCopied[items][d][per] = o// subject placed
                                                                            }
                                                                        }
                                                                        if(d === 'Wednesday' && deepCopied[items]['Tuesday'][per] !== '' && o.Subject !== deepCopied[items]['Tuesday'][per]['Subject']){
                                                                            if(deepCopied[items][d][per] === '') {
                                                                                
                                                                                deepCopied[items][d][per] = o// subject placed
                                                                            }
                                                                        }
                                                                        else{
                                                                            if(deepCopied[items][d][per] === '') {
                                                                                
                                                                                deepCopied[items][d][per] = o// subject placed
                                                                            }
                                                                        } 
                                                                    }

                                                                    // if bio / cs / com / acc / com / BM /Girls Boys Combiend 
                                                                    if(o.Subject === 'Botony' || o.Subject === 'Zoology' || o.Subject === 'Computer Science' || o.Subject === 'Computer Application' || o.Subject === 'Commerce' || o.Subject === 'Economy' || o.Subject === 'Accountancy' || o.Subject === 'Business Maths'){
                                                                        Object.keys(deepCopied).map(sec=>{
                                                                            let stdcheckForCombinedClasses = parseInt(sec.match(/\d+/)[0])
                                                                            if(std === stdcheckForCombinedClasses){
                                                                                let groupForCheck = '';
                                                                                groupForCheck = sec.slice(4)
                                                                                groupForCheck = groupForCheck.slice(0, -4)

                                                                                let loopingSectionConatinsCurrentSubject = subObj[groupForCheck].some(subListForCkeck=>{
                                                                                    return subListForCkeck === o.Subject
                                                                                })

                                                                                if(loopingSectionConatinsCurrentSubject){
                                                                                    
                                                                                    if(o.Subject === 'Botony' || o.Subject === 'Zoology'){
                                                                                        let botonyTest = 0;
                                                                                        let botonyTestR = false;
                                                                                        if(std > 10 && capitalizeFirstLetter(o.Subject) === 'Botony'){
                                                                                            const zzz = Object.values(deepCopied[items]) //values of days in a section
                                                                                            botonyTestR = zzz.some(item=>{
                                                                                                for(let key in item){
                                                                                                    if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Botony'){
                                                                                                        botonyTest++;
                                                                                                        if(botonyTest >= 4){
                                                                                                            return true;
                                                                                                        }
                                                                                                    }
                                                                                                }
                                                                                            })
                                                                                        }

                                                                                        let zooTest = 0;
                                                                                        let zooTestR = false;
                                                                                        if(std > 10 && capitalizeFirstLetter(o.Subject) === 'Zoology'){
                                                                                            const zzz = Object.values(deepCopied[items]) //values of days in a section
                                                                                            zooTestR = zzz.some(item=>{
                                                                                                for(let key in item){
                                                                                                    if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Zoology'){
                                                                                                        zooTest++;
                                                                                                        if(zooTest >= 3){
                                                                                                            return true;
                                                                                                        }
                                                                                                    }
                                                                                                }
                                                                                            })
                                                                                        }

                                                                                        if(!botonyTestR && !zooTestR){
                                                                                            if(deepCopied[sec][d][per] === ''){
                                                                                                deepCopied[sec][d][per] = o
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                    else{
                                                                                        if(deepCopied[sec][d][per] === ''){
                                                                                            deepCopied[sec][d][per] = o
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        })
                                                                    }

                                                                    if(o.Subject === 'Tamil' || o.Subject === 'English'){
                                                                        let rrr = Object.keys(deepCopied).some(f=>{
                                                                            let stdForCheck = parseInt(f.match(/\d+/)[0])
                                                                            if(stdForCheck === std){
                                                                                
                                                                                let groupForCheck = '';
                                                                                groupForCheck = f.slice(4)
                                                                                groupForCheck = groupForCheck.slice(0, -4)
                                                                                
                                                                                if(f.includes(gender)){
                                                                                   
                                                                                    let loopingSectionConatinsCurrentSubject = subObj[groupForCheck].some(subListForCkeck=>{
                                                                                        return subListForCkeck === o.Subject
                                                                                    })
        
                                                                                    if(loopingSectionConatinsCurrentSubject){
                                                                                        if(deepCopied[f][d][per] !== ''){
                                                                                            return true
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        })
                                                                        if(rrr === false){
                                                                            deepCopied[items][d][per] = o
                                                                        
                                                                            Object.keys(deepCopied).map(f=>{
                                                                                let stdForCheck = parseInt(f.match(/\d+/)[0])
                                                                                if(stdForCheck === std){
                                                                                    
                                                                                    let groupForCheck = '';
                                                                                    groupForCheck = f.slice(4)
                                                                                    groupForCheck = groupForCheck.slice(0, -4)
                                                                                    
                                                                                    if(f.includes(gender)){
                                                                                       
                                                                                        let loopingSectionConatinsCurrentSubject = subObj[groupForCheck].some(subListForCkeck=>{
                                                                                            return subListForCkeck === o.Subject
                                                                                        })
        
                                                                                        if(loopingSectionConatinsCurrentSubject){
                                                                                            deepCopied[f][d][per] = o
                                                                                        }
                                                                                    }
                                                                                }
                                                                            })
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                            else if(i===2){
                                                         
                                                                let isSubjectFound = false;
                                                                let subjectCount = 0; 
                                                                let TeacherMorethan3timesinaDay = false;
                                                                let TM3Count = 0;
                                                                const data = deepCopied[items][d];
                        
                                                                for (const key in data) {
                                                                    if (Object.hasOwnProperty.call(data, key)) {
                                                                        const period = data[key];
                                                                        if(period && period.ID === o.ID){
                                                                            TM3Count++; 
                                                                            if (TM3Count >= 3) { 
                                                                                TeacherMorethan3timesinaDay = true;
                                                                                break;
                                                                            }
                                                                        }
                                                                        if (period && period.Subject === o.Subject) {
                                                                            subjectCount++; 
                                                                            if (subjectCount >= 2) { 
                                                                                isSubjectFound = true;
                                                                                break;
                                                                            }
                                                                        }
                                                                    }
                                                                }

                                                                if(!TeacherMorethan3timesinaDay || isSubjectFound === false){
                                                                    if(o.Subject !== 'Botony' && o.Subject !== 'Zoology' && o.Subject !== 'Computer Science' && o.Subject !== 'Computer Application' && o.Subject !== 'Commerce' && o.Subject !== 'Economy' && o.Subject !== 'Accountancy' && o.Subject !== 'Business Maths' && o.Subject !== 'Tamil' && o.Subject !== 'English'){
                                                                        if(d === 'Tuesday' && deepCopied[items]['Monday'][per] !== '' && o.Subject !== deepCopied[items]['Monday'][per]['Subject']){
                                                                            if(deepCopied[items][d][per] === '') {
                                                                                
                                                                                deepCopied[items][d][per] = o// subject placed
                                                                            }
                                                                        }
                                                                        if(d === 'Wednesday' && deepCopied[items]['Tuesday'][per] !== '' && o.Subject !== deepCopied[items]['Tuesday'][per]['Subject']){
                                                                            if(deepCopied[items][d][per] === '') {
                                                                              
                                                                                deepCopied[items][d][per] = o// subject placed
                                                                            }
                                                                        }
                                                                        else{
                                                                            if(deepCopied[items][d][per] === '') {
                                                                             
                                                                                deepCopied[items][d][per] = o// subject placed
                                                                            }
                                                                        } 
                                                                    }
                                                                    // if bio / cs / com / acc / com / BM /Girls Boys Combiend 
                                                                    if(o.Subject === 'Botony' || o.Subject === 'Zoology' || o.Subject === 'Computer Science' || o.Subject === 'Computer Application' || o.Subject === 'Commerce' || o.Subject === 'Economy' || o.Subject === 'Accountancy' || o.Subject === 'Business Maths'){
                                                                        Object.keys(deepCopied).map(sec=>{
                                                                            let stdcheckForCombinedClasses = parseInt(sec.match(/\d+/)[0])
                                                                            if(std === stdcheckForCombinedClasses){
                                                                                let groupForCheck = '';
                                                                                groupForCheck = sec.slice(4)
                                                                                groupForCheck = groupForCheck.slice(0, -4)

                                                                                let loopingSectionConatinsCurrentSubject = subObj[groupForCheck].some(subListForCkeck=>{
                                                                                    return subListForCkeck === o.Subject
                                                                                })

                                                                                if(loopingSectionConatinsCurrentSubject){
                                                                                    
                                                                                    if(o.Subject === 'Botony' || o.Subject === 'Zoology'){
                                                                                        let botonyTest = 0;
                                                                                        let botonyTestR = false;
                                                                                        if(std > 10 && capitalizeFirstLetter(o.Subject) === 'Botony'){
                                                                                            const zzz = Object.values(deepCopied[items]) //values of days in a section
                                                                                            botonyTestR = zzz.some(item=>{
                                                                                                for(let key in item){
                                                                                                    if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Botony'){
                                                                                                        botonyTest++;
                                                                                                        if(botonyTest >= 4){
                                                                                                            return true;
                                                                                                        }
                                                                                                    }
                                                                                                }
                                                                                            })
                                                                                        }

                                                                                        let zooTest = 0;
                                                                                        let zooTestR = false;
                                                                                        if(std > 10 && capitalizeFirstLetter(o.Subject) === 'Zoology'){
                                                                                            const zzz = Object.values(deepCopied[items]) //values of days in a section
                                                                                            zooTestR = zzz.some(item=>{
                                                                                                for(let key in item){
                                                                                                    if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Zoology'){
                                                                                                        zooTest++;
                                                                                                        if(zooTest >= 3){
                                                                                                            return true;
                                                                                                        }
                                                                                                    }
                                                                                                }
                                                                                            })
                                                                                        }

                                                                                        if(!botonyTestR && !zooTestR){
                                                                                            if(deepCopied[sec][d][per] === ''){
                                                                                                deepCopied[sec][d][per] = o
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                    else{
                                                                                        if(deepCopied[sec][d][per] === ''){
                                                                                            deepCopied[sec][d][per] = o
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        })
                                                                    }

                                                                    if(o.Subject === 'Tamil' || o.Subject === 'English'){
                                                                        let rrr = Object.keys(deepCopied).some(f=>{
                                                                            let stdForCheck = parseInt(f.match(/\d+/)[0])
                                                                            if(stdForCheck === std){
                                                                                
                                                                                let groupForCheck = '';
                                                                                groupForCheck = f.slice(4)
                                                                                groupForCheck = groupForCheck.slice(0, -4)
                                                                                
                                                                                if(f.includes(gender)){
                                                                                   
                                                                                    let loopingSectionConatinsCurrentSubject = subObj[groupForCheck].some(subListForCkeck=>{
                                                                                        return subListForCkeck === o.Subject
                                                                                    })
        
                                                                                    if(loopingSectionConatinsCurrentSubject){
                                                                                        if(deepCopied[f][d][per] !== ''){
                                                                                            return true
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        })
                                                                        if(rrr === false){
                                                                            deepCopied[items][d][per] = o
                                                                        
                                                                            Object.keys(deepCopied).map(f=>{
                                                                                let stdForCheck = parseInt(f.match(/\d+/)[0])
                                                                                if(stdForCheck === std){
                                                                                    
                                                                                    let groupForCheck = '';
                                                                                    groupForCheck = f.slice(4)
                                                                                    groupForCheck = groupForCheck.slice(0, -4)
                                                                                    
                                                                                    if(f.includes(gender)){
                                                                                       
                                                                                        let loopingSectionConatinsCurrentSubject = subObj[groupForCheck].some(subListForCkeck=>{
                                                                                            return subListForCkeck === o.Subject
                                                                                        })
        
                                                                                        if(loopingSectionConatinsCurrentSubject){
                                                                                            deepCopied[f][d][per] = o
                                                                                        }
                                                                                    }
                                                                                }
                                                                            })
                                                                        }
                                                                    }
                                              
                                                                }
                                                            }
                                                        }
                                                        else{
                                                            
                                                            if(o.Subject === 'Tamil' || o.Subject === 'English'){
                                                                let rrr = Object.keys(deepCopied).some(f=>{
                                                                    let stdForCheck = parseInt(f.match(/\d+/)[0])
                                                                    if(stdForCheck === std){
                                                                        
                                                                        let groupForCheck = '';
                                                                        groupForCheck = f.slice(4)
                                                                        groupForCheck = groupForCheck.slice(0, -4)
                                                                        
                                                                        if(f.includes(gender)){
                                                                           
                                                                            let loopingSectionConatinsCurrentSubject = subObj[groupForCheck].some(subListForCkeck=>{
                                                                                return subListForCkeck === o.Subject
                                                                            })

                                                                            if(loopingSectionConatinsCurrentSubject){
                                                                                if(deepCopied[f][d][per] !== ''){
                                                                                    return true
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                })
                                                                if(rrr === false){
                                                                    deepCopied[items][d][per] = o
                                                                
                                                                    Object.keys(deepCopied).map(f=>{
                                                                        let stdForCheck = parseInt(f.match(/\d+/)[0])
                                                                        if(stdForCheck === std){
                                                                            
                                                                            let groupForCheck = '';
                                                                            groupForCheck = f.slice(4)
                                                                            groupForCheck = groupForCheck.slice(0, -4)
                                                                            
                                                                            if(f.includes(gender)){
                                                                               
                                                                                let loopingSectionConatinsCurrentSubject = subObj[groupForCheck].some(subListForCkeck=>{
                                                                                    return subListForCkeck === o.Subject
                                                                                })

                                                                                if(loopingSectionConatinsCurrentSubject){
                                                                                    deepCopied[f][d][per] = o
                                                                                }
                                                                            }
                                                                        }
                                                                    })
                                                                }
                                                            }
                                                            // else if(o.Subject === 'Maths'){
                                                            //     deepCopied[items][d][per] = o
                                                            // }
                                                            // else if(o.Subject === 'Commerce'){
                                                            //     Object.keys(deepCopied).map(sec=>{
                                                            //         let stdcheckForCombinedClasses = parseInt(sec.match(/\d+/)[0])
                                                            //         if(std === stdcheckForCombinedClasses){
                                                            //             let groupForCheck = '';
                                                            //             groupForCheck = sec.slice(4)
                                                            //             groupForCheck = groupForCheck.slice(0, -4)

                                                            //             let loopingSectionConatinsCurrentSubject = subObj[groupForCheck].some(subListForCkeck=>{
                                                            //                 return subListForCkeck === o.Subject
                                                            //             })

                                                            //             if(loopingSectionConatinsCurrentSubject){
                                                            //                 deepCopied[sec][d][per] = o
                                                            //             }
                                                            //         }
                                                            //     })             
                                                            // }




                                                            
                                                            // if(d === 'Monday' && (o.Subject === 'Tamil' || o.Subject === 'English' || o.Subject === 'Maths' || o.Subject === 'Science' || o.Subject === 'Maths')){
                                                            //     deepCopied[items][d][per] = o
                                                            // }
                                                            // else if(d === 'Tuesday' && o.subject !== deepCopied[items]['Monday'][per]['Subject'] && (o.Subject === 'Tamil' || o.Subject === 'English' || o.Subject === 'Maths' || o.Subject === 'Science' || o.Subject === 'Maths')){
                                                            //     deepCopied[items][d][per] = o
                                                            // }
                                                            // else if(d === 'Wednesday' && o.subject !== deepCopied[items]['Tuesday'][per]['Subject'] && (o.Subject === 'Tamil' || o.Subject === 'English' || o.Subject === 'Maths' || o.Subject === 'Science' || o.Subject === 'Maths')){
                                                            //     deepCopied[items][d][per] = o
                                                            // }
                                                            
                                                            // if((d === 'Thursday' || d === 'Friday') && (o.Subject === 'Tamil' || o.Subject === 'English' || o.Subject === 'Maths' || o.Subject === 'Science' || o.Subject === 'Maths')){
                                                            //     deepCopied[items][d][per] = o
                                                            // }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        if(std !== 11 && std !== 12){
                                            if(std <= 5){
                                                if(std === 1 || std === 2){
                                                    const currentStdSectionsValues = [];
                                                    const keysInWholeSchool = Object.keys(deepCopied)
                                                    keysInWholeSchool.map(list=>{
                                                        if(parseInt(list.match(/\d+/)[0]) === std){
                                                            currentStdSectionsValues.push(deepCopied[list])
                                                        }
                                                    })
                                                    for(let i=0;i<currentStdSectionsValues.length;i++){     //current std's sections loop
                                                        let EachsectionValue = Object.values(currentStdSectionsValues[i]) //current sections value
                                                        for(let yy=0;yy<EachsectionValue.length;yy++){   //days loop
                                                            let EachDayValues = Object.values(EachsectionValue[yy])
                                                            let b = false;
                                                            for(let xx=0;xx<EachDayValues.length;xx++){   //periods loop
                                                                let sameSction = false;
                                                                if(i === 0 && items.includes('A')){
                                                                    sameSction = true
                                                                }
                                                                else if(i === 1 && items.includes('B')){
                                                                    sameSction = true
                                                                }
                                                                else if(i === 2 && items.includes('C')){
                                                                    sameSction = true
                                                                }
                                                                else if(i === 3 && items.includes('D')){
                                                                    sameSction = true
                                                                }
                                                                else if(i === 4 && items.includes('E')){
                                                                    sameSction = true
                                                                }
                                                                
                                                                if(!sameSction){
                                                                    if(EachDayValues[xx] !== '' && EachDayValues[xx]['ID'] === o.ID){
                                                                        IsAnyStaffinMorethanaSectionsForaSTDCount++;
                                                                        b = true;
                                                                        break;
                                                                    }
                                                                }
                                                            
                                                            }
                                                            if(b){
                                                                break;
                                                            }
                                                        }
                                                        if(IsAnyStaffinMorethanaSectionsForaSTDCount === FORIFCONditionIsAnyStaffinMorethanaSectionsForaSTDCount){
                                                            IsAnyStaffinMorethanaSectionsForaSTD = true;
                                                            break
                                                        }
                                                    }
                        
                                                    let MultipleTeacherWithSameSubject = false;
                                                    for(let key in deepCopied[items]){
                                                        for(let checkPer in deepCopied[items][key]){
                                                            if(deepCopied[items][key][checkPer] !== '' && o.Subject === deepCopied[items][key][checkPer]['Subject'] && o.ID !== deepCopied[items][key][checkPer]['ID']){
                                                                MultipleTeacherWithSameSubject = true;
                                                                break;
                                                            }
                                                        }
                                                    }
                                                    if(!IsAnyStaffinMorethanaSectionsForaSTD){
                                                        if(!MultipleTeacherWithSameSubject){
                                                            const isIDExist = Object.keys(deepCopied).some(k=>{
                                                                if(deepCopied[k][d][per] !== ''){
                                                                    return deepCopied[k][d][per]['ID'] === o.ID
                                                                } 
                                                            })
                                                            if(deepCopied[items][d][per] === '' && isIDExist === false){
                                                                if(i>1){
                                                                    let motherTeacher = false;
                                                                    let otherSubjectTecaher = false;
                                                                    if(o.Subject === 'Tamil' || o.Subject === 'English' || o.Subject === 'Maths' || o.Subject === 'EVS' || o.Subject === 'GK' || o.Subject === 'Computer Science'){
                                                                        if(o.ID === deepCopied[items]['Monday']['per1']['ID']){
                                                                    
                                                                            motherTeacher = true
                                                                        }
                                                                    }
                                                                    else{
                                                                        otherSubjectTecaher = true;
                                                                    }
                                                                    
                                                                    if(motherTeacher){
                                                                        const prevprevPeriod = 'per'+(i-2);
                                                                        const prevPeriod = 'per'+(i-1);
                                                                        if(deepCopied[items][d][prevPeriod] !== '' && deepCopied[items][d][prevPeriod]['ID'] !== o.ID){  //previos period check
                                                                            let isSubjectFoundCount = 0;
                                                                            let isSubjectFound = false; 
                                                                            const data = deepCopied[items][d];
                                    
                                                                            for (const key in data) {
                                                                                if (Object.hasOwnProperty.call(data, key)) {
                                                                                    const period = data[key];
                                                                                    if (period && period.Subject === o.Subject) {
                                                                                        isSubjectFoundCount++
                                                                                        if(isSubjectFoundCount === 2){
                                                                                            isSubjectFound = true;
                                                                                            break;
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                    
                                                                            if (!isSubjectFound) {
                                                                                deepCopied[items][d][per] = o;
                                                                            }
                                                                        }
                                                                        else if((i>=3) && deepCopied[items][d][prevprevPeriod] !== '' && deepCopied[items][d][prevprevPeriod]['ID'] !== o.ID){ //previos of previos period check
                                                                            let isSubjectFound = false;
                                                                            let isSubjectFoundCount = 0;
                                                                            const data = deepCopied[items][d];
                                    
                                                                            for (const key in data) {
                                                                                if (Object.hasOwnProperty.call(data, key)) {
                                                                                    const period = data[key];
                                                                                    if (period && period.Subject === o.Subject) {
                                                                                        isSubjectFoundCount++
                                                                                        if(isSubjectFoundCount === 2){
                                                                                            isSubjectFound = true;
                                                                                            break;
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                    
                                                                            if (!isSubjectFound) {
                                                                                deepCopied[items][d][per] = o;
                                                                            }
                                                                        }
                                                                        else if(deepCopied[items][d][prevPeriod] === '' ){
                                                                            let isSubjectFound = false; //already subject exist in this day
                                                                            let isSubjectFoundCount = 0;
                                                                            const data = deepCopied[items][d];
                                    
                                                                            for (const key in data) {
                                                                                if (Object.hasOwnProperty.call(data, key)) {
                                                                                    const period = data[key];
                                                                                    if (period && period.Subject === o.Subject) {
                                                                                        isSubjectFoundCount++
                                                                                        if(isSubjectFoundCount === 2){
                                                                                            isSubjectFound = true;
                                                                                            break;
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                    
                                                                            if (!isSubjectFound) {
                                                                                deepCopied[items][d][per] = o;
                                                                            }
                                                                        }
                                                                    }
                                                                    else if(otherSubjectTecaher){
                                                                        
                                                                        if(d === 'Tuesday'){
                                                                            if(deepCopied[items]['Monday'][per]['Subject'] !== o.Subject){
                                                                                const prevPeriod = 'per'+(i-1);
                                                                                if(deepCopied[items][d][prevPeriod] !== '' && deepCopied[items][d][prevPeriod]['ID'] !== o.ID){  //previos period check
                                                                                    let isSubjectFound = false; 
                                                                                    let isSubjectFoundCount = 0;
                                                                                    const data = deepCopied[items][d];
                                            
                                                                                    for (const key in data) {
                                                                                        if (Object.hasOwnProperty.call(data, key)) {
                                                                                            const period = data[key];
                                                                                            if (period && period.Subject === o.Subject) {
                                                                                                isSubjectFoundCount++
                                                                                        if(isSubjectFoundCount === 2){
                                                                                            isSubjectFound = true;
                                                                                            break;
                                                                                        }
                                                                                            }
                                                                                        }
                                                                                    }
                                            
                                                                                    if (!isSubjectFound) {
                                                                                        deepCopied[items][d][per] = o;
                                                                                    }
                                                                                }
                                                                                else if(deepCopied[items][d][prevPeriod] === '' ){
                                                                                    let isSubjectFound = false; //already subject exist in this day
                                                                                    let isSubjectFoundCount = 0;
                                                                                    const data = deepCopied[items][d];
                                            
                                                                                    for (const key in data) {
                                                                                        if (Object.hasOwnProperty.call(data, key)) {
                                                                                            const period = data[key];
                                                                                            if (period && period.Subject === o.Subject) {
                                                                                                isSubjectFoundCount++
                                                                                                if(isSubjectFoundCount === 2){
                                                                                                    isSubjectFound = true;
                                                                                                    break;
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    }
                                            
                                                                                    if (!isSubjectFound) {
                                                                                        deepCopied[items][d][per] = o;
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                        else if(d === 'Wednesday'){
                                                                            if(deepCopied[items]['Tuesday'][per]['Subject'] !== o.Subject){
                                                                                const prevPeriod = 'per'+(i-1);
                                                                                if(deepCopied[items][d][prevPeriod] !== '' && deepCopied[items][d][prevPeriod]['ID'] !== o.ID){  //previos period check
                                                                                    let isSubjectFound = false; 
                                                                                    let isSubjectFoundCount = 0;
                                                                                    const data = deepCopied[items][d];
                                            
                                                                                    for (const key in data) {
                                                                                        if (Object.hasOwnProperty.call(data, key)) {
                                                                                            const period = data[key];
                                                                                            if (period && period.Subject === o.Subject) {
                                                                                                isSubjectFoundCount++
                                                                                                if(isSubjectFoundCount === 2){
                                                                                                    isSubjectFound = true;
                                                                                                    break;
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    }
                                            
                                                                                    if (!isSubjectFound) {
                                                                                        deepCopied[items][d][per] = o;
                                                                                    }
                                                                                }
                                                                                else if(deepCopied[items][d][prevPeriod] === '' ){
                                                                                    let isSubjectFound = false; //already subject exist in this day
                                                                                    let isSubjectFoundCount = 0;
                                                                                    const data = deepCopied[items][d];
                                            
                                                                                    for (const key in data) {
                                                                                        if (Object.hasOwnProperty.call(data, key)) {
                                                                                            const period = data[key];
                                                                                            if (period && period.Subject === o.Subject) {
                                                                                                isSubjectFoundCount++
                                                                                                if(isSubjectFoundCount === 2){
                                                                                                    isSubjectFound = true;
                                                                                                    break;
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    }
                                            
                                                                                    if (!isSubjectFound) {
                                                                                        deepCopied[items][d][per] = o;
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                        else{
                                                                            const prevPeriod = 'per'+(i-1);
                                                                            if(deepCopied[items][d][prevPeriod] !== '' && deepCopied[items][d][prevPeriod]['ID'] !== o.ID){  //previos period check
                                                                                let isSubjectFound = false; 
                                                                                let isSubjectFoundCount = 0;
                                                                                const data = deepCopied[items][d];
                                        
                                                                                for (const key in data) {
                                                                                    if (Object.hasOwnProperty.call(data, key)) {
                                                                                        const period = data[key];
                                                                                        if (period && period.Subject === o.Subject) {
                                                                                            isSubjectFoundCount++
                                                                                            if(isSubjectFoundCount === 2){
                                                                                                isSubjectFound = true;
                                                                                                break;
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                        
                                                                                if (!isSubjectFound) {
                                                                                    deepCopied[items][d][per] = o;
                                                                                }
                                                                            }
                                                                            else if(deepCopied[items][d][prevPeriod] === '' ){
                                                                                let isSubjectFound = false; //already subject exist in this day
                                                                                let isSubjectFoundCount = 0;
                                                                                const data = deepCopied[items][d];
                                        
                                                                                for (const key in data) {
                                                                                    if (Object.hasOwnProperty.call(data, key)) {
                                                                                        const period = data[key];
                                                                                        if (period && period.Subject === o.Subject) {
                                                                                            isSubjectFoundCount++
                                                                                            if(isSubjectFoundCount === 2){
                                                                                                isSubjectFound = true;
                                                                                                break;
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                        
                                                                                if (!isSubjectFound) {
                                                                                    deepCopied[items][d][per] = o;
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                                else{
                                                                    if(d === 'Monday' && (o.Subject === 'Tamil' || o.Subject === 'English' || o.Subject === 'Maths' || o.Subject === 'EVS')){
                                                                        deepCopied[items][d][per] = o
                                                                    }
                                                                    else if(d === 'Tuesday' && o.subject !== deepCopied[items]['Monday'][per]['Subject'] && (o.Subject === 'Tamil' || o.Subject === 'English' || o.Subject === 'Maths' || o.Subject === 'EVS')){
                                                                        if(o.ID === deepCopied[items]['Monday']['per1']['ID']){
                                                                            deepCopied[items][d][per] = o
                                                                        }    
                                                                    }
                                                                    else if(d === 'Wednesday' && o.subject !== deepCopied[items]['Tuesday'][per]['Subject'] && (o.Subject === 'Tamil' || o.Subject === 'English' || o.Subject === 'Maths' || o.Subject === 'EVS')){
                                                                        if(o.ID === deepCopied[items]['Monday']['per1']['ID']){
                                                                            deepCopied[items][d][per] = o
                                                                        } 
                                                                    }
                                                                    
                                                                    if((d === 'Thursday' || d === 'Friday') && o.subject !== deepCopied[items]['Wednesday'][per]['Subject'] && (o.Subject === 'Tamil' || o.Subject === 'English' || o.Subject === 'Maths' || o.Subject === 'EVS')){
                                                                        if(o.ID === deepCopied[items]['Monday']['per1']['ID']){
                                                                            deepCopied[items][d][per] = o
                                                                        } 
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                                else{ // 3,4,5 std
                                                    const currentStdSectionsValues = [];
                                                    const keysInWholeSchool = Object.keys(deepCopied)
                                                    keysInWholeSchool.map(list=>{
                                                        if(parseInt(list.match(/\d+/)[0]) === std){
                                                            currentStdSectionsValues.push(deepCopied[list])
                                                        }
                                                    })
                                                    for(let i=0;i<currentStdSectionsValues.length;i++){     //current std's sections loop
                                                        let EachsectionValue = Object.values(currentStdSectionsValues[i]) //current sections value
                                                        for(let yy=0;yy<EachsectionValue.length;yy++){   //days loop
                                                            let EachDayValues = Object.values(EachsectionValue[yy])
                                                            let b = false;
                                                            for(let xx=0;xx<EachDayValues.length;xx++){   //periods loop
                                                                let sameSction = false;
                                                                if(i === 0 && items.includes('A')){
                                                                    sameSction = true
                                                                }
                                                                else if(i === 1 && items.includes('B')){
                                                                    sameSction = true
                                                                }
                                                                else if(i === 2 && items.includes('C')){
                                                                    sameSction = true
                                                                }
                                                                else if(i === 3 && items.includes('D')){
                                                                    sameSction = true
                                                                }
                                                                else if(i === 4 && items.includes('E')){
                                                                    sameSction = true
                                                                }
                                                                
                                                                if(!sameSction){
                                                                    if(EachDayValues[xx] !== '' && EachDayValues[xx]['ID'] === o.ID){
                                                                        IsAnyStaffinMorethanaSectionsForaSTDCount++;
                                                                        b = true;
                                                                        break;
                                                                    }
                                                                }
                                                            
                                                            }
                                                            if(b){
                                                                break;
                                                            }
                                                        }
                                                        if(IsAnyStaffinMorethanaSectionsForaSTDCount === FORIFCONditionIsAnyStaffinMorethanaSectionsForaSTDCount){
                                                            IsAnyStaffinMorethanaSectionsForaSTD = true;
                                                            break
                                                        }
                                                    }
                        
                                                    let MultipleTeacherWithSameSubject = false;
                                                    for(let key in deepCopied[items]){
                                                        for(let checkPer in deepCopied[items][key]){
                                                            if(deepCopied[items][key][checkPer] !== '' && o.Subject === deepCopied[items][key][checkPer]['Subject'] && o.ID !== deepCopied[items][key][checkPer]['ID']){
                                                                MultipleTeacherWithSameSubject = true;
                                                                break;
                                                            }
                                                        }
                                                    }
                                                    if(!IsAnyStaffinMorethanaSectionsForaSTD){
                                                        if(!MultipleTeacherWithSameSubject){
                                                            const isIDExist = Object.keys(deepCopied).some(k=>{
                                                                if(deepCopied[k][d][per] !== ''){
                                                                    return deepCopied[k][d][per]['ID'] === o.ID
                                                                } 
                                                            })
                                                            if(deepCopied[items][d][per] === '' && isIDExist === false){
                                                                if(i>1){
                                                                    let motherTeacher = false;
                                                                    let otherSubjectTecaher = false;
                                                                    if(o.Subject === 'Tamil' || o.Subject === 'English' || o.Subject === 'Maths' || o.Subject === 'Science' || o.Subject === 'Social Science' || o.Subject === 'GK'){
                                                                        if(o.ID === deepCopied[items]['Monday']['per1']['ID']){
                                                                            motherTeacher = true
                                                                        }
                                                                    }
                                                                    else{
                                                                        otherSubjectTecaher = true;
                                                                    }
                                                                    
                                                                    if(motherTeacher){
                                                                        const prevprevPeriod = 'per'+(i-2);
                                                                        const prevPeriod = 'per'+(i-1);
                                                                        if(deepCopied[items][d][prevPeriod] !== '' && deepCopied[items][d][prevPeriod]['ID'] !== o.ID){  //previos period check
                                                                            let isSubjectFoundCount = 0;
                                                                            let isSubjectFound = false; 
                                                                            const data = deepCopied[items][d];
                                    
                                                                            for (const key in data) {
                                                                                if (Object.hasOwnProperty.call(data, key)) {
                                                                                    const period = data[key];
                                                                                    if (period && period.Subject === o.Subject) {
                                                                                        isSubjectFoundCount++
                                                                                        if(isSubjectFoundCount === 2){
                                                                                            isSubjectFound = true;
                                                                                            break;
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                    
                                                                            if (!isSubjectFound) {
                                                                                deepCopied[items][d][per] = o;
                                                                            }
                                                                        }
                                                                        else if((i>=3) && deepCopied[items][d][prevprevPeriod] !== '' && deepCopied[items][d][prevprevPeriod]['ID'] !== o.ID){ //previos of previos period check
                                                                            let isSubjectFound = false;
                                                                            let isSubjectFoundCount = 0;
                                                                            const data = deepCopied[items][d];
                                    
                                                                            for (const key in data) {
                                                                                if (Object.hasOwnProperty.call(data, key)) {
                                                                                    const period = data[key];
                                                                                    if (period && period.Subject === o.Subject) {
                                                                                        isSubjectFoundCount++
                                                                                        if(isSubjectFoundCount === 2){
                                                                                            isSubjectFound = true;
                                                                                            break;
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                    
                                                                            if (!isSubjectFound) {
                                                                                deepCopied[items][d][per] = o;
                                                                            }
                                                                        }
                                                                        else if(deepCopied[items][d][prevPeriod] === '' ){
                                                                            let isSubjectFound = false; //already subject exist in this day
                                                                            let isSubjectFoundCount = 0;
                                                                            const data = deepCopied[items][d];
                                    
                                                                            for (const key in data) {
                                                                                if (Object.hasOwnProperty.call(data, key)) {
                                                                                    const period = data[key];
                                                                                    if (period && period.Subject === o.Subject) {
                                                                                        isSubjectFoundCount++
                                                                                        if(isSubjectFoundCount === 2){
                                                                                            isSubjectFound = true;
                                                                                            break;
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                    
                                                                            if (!isSubjectFound) {
                                                                                deepCopied[items][d][per] = o;
                                                                            }
                                                                        }
                                                                    }
                                                                    else if(otherSubjectTecaher){
                                                                        
                                                                        if(d === 'Tuesday'){
                                                                            if(deepCopied[items]['Monday'][per]['Subject'] !== o.Subject){
                                                                                const prevPeriod = 'per'+(i-1);
                                                                                if(deepCopied[items][d][prevPeriod] !== '' && deepCopied[items][d][prevPeriod]['ID'] !== o.ID){  //previos period check
                                                                                    let isSubjectFound = false; 
                                                                                    let isSubjectFoundCount = 0;
                                                                                    const data = deepCopied[items][d];
                                            
                                                                                    for (const key in data) {
                                                                                        if (Object.hasOwnProperty.call(data, key)) {
                                                                                            const period = data[key];
                                                                                            if (period && period.Subject === o.Subject) {
                                                                                                isSubjectFoundCount++
                                                                                        if(isSubjectFoundCount === 2){
                                                                                            isSubjectFound = true;
                                                                                            break;
                                                                                        }
                                                                                            }
                                                                                        }
                                                                                    }
                                            
                                                                                    if (!isSubjectFound) {
                                                                                        deepCopied[items][d][per] = o;
                                                                                    }
                                                                                }
                                                                                else if(deepCopied[items][d][prevPeriod] === '' ){
                                                                                    let isSubjectFound = false; //already subject exist in this day
                                                                                    let isSubjectFoundCount = 0;
                                                                                    const data = deepCopied[items][d];
                                            
                                                                                    for (const key in data) {
                                                                                        if (Object.hasOwnProperty.call(data, key)) {
                                                                                            const period = data[key];
                                                                                            if (period && period.Subject === o.Subject) {
                                                                                                isSubjectFoundCount++
                                                                                                if(isSubjectFoundCount === 2){
                                                                                                    isSubjectFound = true;
                                                                                                    break;
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    }
                                            
                                                                                    if (!isSubjectFound) {
                                                                                        deepCopied[items][d][per] = o;
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                        else if(d === 'Wednesday'){
                                                                            if(deepCopied[items]['Tuesday'][per]['Subject'] !== o.Subject){
                                                                                const prevPeriod = 'per'+(i-1);
                                                                                if(deepCopied[items][d][prevPeriod] !== '' && deepCopied[items][d][prevPeriod]['ID'] !== o.ID){  //previos period check
                                                                                    let isSubjectFound = false; 
                                                                                    let isSubjectFoundCount = 0;
                                                                                    const data = deepCopied[items][d];
                                            
                                                                                    for (const key in data) {
                                                                                        if (Object.hasOwnProperty.call(data, key)) {
                                                                                            const period = data[key];
                                                                                            if (period && period.Subject === o.Subject) {
                                                                                                isSubjectFoundCount++
                                                                                                if(isSubjectFoundCount === 2){
                                                                                                    isSubjectFound = true;
                                                                                                    break;
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    }
                                            
                                                                                    if (!isSubjectFound) {
                                                                                        deepCopied[items][d][per] = o;
                                                                                    }
                                                                                }
                                                                                else if(deepCopied[items][d][prevPeriod] === '' ){
                                                                                    let isSubjectFound = false; //already subject exist in this day
                                                                                    let isSubjectFoundCount = 0;
                                                                                    const data = deepCopied[items][d];
                                            
                                                                                    for (const key in data) {
                                                                                        if (Object.hasOwnProperty.call(data, key)) {
                                                                                            const period = data[key];
                                                                                            if (period && period.Subject === o.Subject) {
                                                                                                isSubjectFoundCount++
                                                                                                if(isSubjectFoundCount === 2){
                                                                                                    isSubjectFound = true;
                                                                                                    break;
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    }
                                            
                                                                                    if (!isSubjectFound) {
                                                                                        deepCopied[items][d][per] = o;
                                                                                    }
                                                                                }
                                                                            }
                                                                            
                                                                        }
                                                                        else{
                                                                            const prevPeriod = 'per'+(i-1);
                                                                            if(deepCopied[items][d][prevPeriod] !== '' && deepCopied[items][d][prevPeriod]['ID'] !== o.ID){  //previos period check
                                                                                let isSubjectFound = false; 
                                                                                let isSubjectFoundCount = 0;
                                                                                const data = deepCopied[items][d];
                                        
                                                                                for (const key in data) {
                                                                                    if (Object.hasOwnProperty.call(data, key)) {
                                                                                        const period = data[key];
                                                                                        if (period && period.Subject === o.Subject) {
                                                                                            isSubjectFoundCount++
                                                                                            if(isSubjectFoundCount === 2){
                                                                                                isSubjectFound = true;
                                                                                                break;
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                        
                                                                                if (!isSubjectFound) {
                                                                                    deepCopied[items][d][per] = o;
                                                                                }
                                                                            }
                                                                            else if(deepCopied[items][d][prevPeriod] === '' ){
                                                                                let isSubjectFound = false; //already subject exist in this day
                                                                                let isSubjectFoundCount = 0;
                                                                                const data = deepCopied[items][d];
                                        
                                                                                for (const key in data) {
                                                                                    if (Object.hasOwnProperty.call(data, key)) {
                                                                                        const period = data[key];
                                                                                        if (period && period.Subject === o.Subject) {
                                                                                            isSubjectFoundCount++
                                                                                            if(isSubjectFoundCount === 2){
                                                                                                isSubjectFound = true;
                                                                                                break;
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                        
                                                                                if (!isSubjectFound) {
                                                                                    deepCopied[items][d][per] = o;
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                                else{
                                                                    if(d === 'Monday' && (o.Subject === 'Tamil' || o.Subject === 'English' || o.Subject === 'Maths' || o.Subject === 'Science' || o.Subject === 'Social Science')){
                                                                        deepCopied[items][d][per] = o
                                                                    }
                                                                    else if(d === 'Tuesday' && o.subject !== deepCopied[items]['Monday'][per]['Subject'] && (o.Subject === 'Tamil' || o.Subject === 'English' || o.Subject === 'Maths' || o.Subject === 'Science' || o.Subject === 'Social Science')){
                                                                        if(o.ID === deepCopied[items]['Monday']['per1']['ID']){
                                                                            deepCopied[items][d][per] = o
                                                                        }    
                                                                    }
                                                                    else if(d === 'Wednesday' && o.subject !== deepCopied[items]['Tuesday'][per]['Subject'] && (o.Subject === 'Tamil' || o.Subject === 'English' || o.Subject === 'Maths' || o.Subject === 'Science' || o.Subject === 'Social Science')){
                                                                        if(o.ID === deepCopied[items]['Monday']['per1']['ID']){
                                                                            deepCopied[items][d][per] = o
                                                                        } 
                                                                    }
                                                                    
                                                                    if((d === 'Thursday' || d === 'Friday') && o.subject !== deepCopied[items]['Wednesday'][per]['Subject'] && (o.Subject === 'Tamil' || o.Subject === 'English' || o.Subject === 'Maths' || o.Subject === 'Science' || o.Subject === 'Social Science')){
                                                                        if(o.ID === deepCopied[items]['Monday']['per1']['ID']){
                                                                            deepCopied[items][d][per] = o
                                                                        } 
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                            else{                                     //std 6,7,8,9,10
                                                const currentStdSectionsValues = [];
                                                const keysInWholeSchool = Object.keys(deepCopied)
                                                keysInWholeSchool.map(list=>{
                                                    if(parseInt(list.match(/\d+/)[0]) === std){
                                                        currentStdSectionsValues.push(deepCopied[list])
                                                    }
                                                })
                                                for(let i=0;i<currentStdSectionsValues.length;i++){     //current std's sections loop
                                                    let EachsectionValue = Object.values(currentStdSectionsValues[i]) //current sections value
                                                    for(let yy=0;yy<EachsectionValue.length;yy++){   //days loop
                                                        let EachDayValues = Object.values(EachsectionValue[yy])
                                                        let b = false;
                                                        for(let xx=0;xx<EachDayValues.length;xx++){   //periods loop
                                                            let sameSction = false;
                                                            if(i === 0 && items.includes('A')){
                                                                sameSction = true
                                                            }
                                                            else if(i === 1 && items.includes('B')){
                                                                sameSction = true
                                                            }
                                                            else if(i === 2 && items.includes('C')){
                                                                sameSction = true
                                                            }
                                                            else if(i === 3 && items.includes('D')){
                                                                sameSction = true
                                                            }
                                                            else if(i === 4 && items.includes('E')){
                                                                sameSction = true
                                                            }
                                                            
                                                            if(!sameSction){
                                                                if(EachDayValues[xx] !== '' && EachDayValues[xx]['ID'] === o.ID){
                                                                    IsAnyStaffinMorethanaSectionsForaSTDCount++;
                                                                    b = true;
                                                                    break;
                                                                }
                                                            }
                                                        
                                                        }
                                                        if(b){
                                                            break;
                                                        }
                                                    }
                                                    if(IsAnyStaffinMorethanaSectionsForaSTDCount === FORIFCONditionIsAnyStaffinMorethanaSectionsForaSTDCount){
                                                        IsAnyStaffinMorethanaSectionsForaSTD = true;
                                                        break
                                                    }
                                                }
                    
                                                let MultipleTeacherWithSameSubject = false;
                                                for(let key in deepCopied[items]){
                                                    for(let checkPer in deepCopied[items][key]){
                                                        if(deepCopied[items][key][checkPer] !== '' && o.Subject === deepCopied[items][key][checkPer]['Subject'] && o.ID !== deepCopied[items][key][checkPer]['ID']){
                                                            MultipleTeacherWithSameSubject = true;
                                                            break;
                                                        }
                                                    }
                                                }
                                                if(!IsAnyStaffinMorethanaSectionsForaSTD){
                                                    if(!MultipleTeacherWithSameSubject){
                                                        const isIDExist = Object.keys(deepCopied).some(k=>{
                                                            if(deepCopied[k][d][per] !== ''){
                                                                return deepCopied[k][d][per]['ID'] === o.ID
                                                            } 
                                                        })
                                                        if(deepCopied[items][d][per] === '' && isIDExist === false){
                                                            if(i>1){
                                                                const prevPeriod = 'per'+(i-1);
                                                                if(deepCopied[items][d][prevPeriod] !== ''){
                                                                    let isSubjectFound = false;
                                                                    let isSubjectFoundCount =0;
                                                                    const data = deepCopied[items][d];
                            
                                                                    for (const key in data) {
                                                                        if (Object.hasOwnProperty.call(data, key)) {
                                                                            const period = data[key];
                                                                            if (period && period.Subject === o.Subject) {
                                                                                isSubjectFoundCount++
                                                                                if(isSubjectFoundCount === 2){
                                                                                    isSubjectFound = true;
                                                                                    break;
                                                                                }   
                                                                            }
                                                                        }
                                                                    }
                            
                                                                    if (!isSubjectFound) {
                                                                        if(d === 'Tuesday'){
                                                                            if(deepCopied[items]['Monday'][per]['Subject'] !== o.Subject){
                                                                                deepCopied[items][d][per] = o;
                                                                            }
                                                                        }
                                                                        else if(d === 'Wednesday'){
                                                                            if(deepCopied[items]['Tuesday'][per]['Subject'] !== o.Subject){
                                                                                deepCopied[items][d][per] = o;
                                                                            }
                                                                        }
                                                                        else{
                                                                            deepCopied[items][d][per] = o;
                                                                        }
                                                                    }
                                                                }
                                                                else{
                                                                    let isSubjectFound = false;
                                                                    let isSubjectFoundCount = 0;
                                                                    const data = deepCopied[items][d];
                                                                    for (const key in data) {
                                                                        if (Object.hasOwnProperty.call(data, key)) {
                                                                            const period = data[key];
                                                                            if (period && period.Subject === o.Subject) {
                                                                                isSubjectFoundCount++
                                                                                if(isSubjectFoundCount === 2){
                                                                                    isSubjectFound = true;
                                                                                    break;
                                                                                }   
                                                                            }
                                                                        }
                                                                    }
                                                                    if(isSubjectFound === false){
                                                                        if(d === 'Tuesday'){
                                                                            if(deepCopied[items]['Monday'][per]['Subject'] !== o.Subject){
                                                                                deepCopied[items][d][per] = o;
                                                                            }
                                                                        }
                                                                        else if(d === 'Wednesday'){
                                                                            if(deepCopied[items]['Tuesday'][per]['Subject'] !== o.Subject){
                                                                                deepCopied[items][d][per] = o;
                                                                            }
                                                                        }
                                                                        else{
                                                                            deepCopied[items][d][per] = o;
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                            else{
                                                                if(d === 'Monday' && (o.Subject === 'Tamil' || o.Subject === 'English' || o.Subject === 'Maths' || o.Subject === 'Science' || o.Subject === 'Science1' || o.Subject === 'Science2' || o.Subject === 'Social Science')){
                                                                    deepCopied[items][d][per] = o
                                                                }
                                                                else if(d === 'Tuesday' && o.subject !== deepCopied[items]['Monday'][per]['Subject'] && (o.Subject === 'Tamil' || o.Subject === 'English' || o.Subject === 'Maths' || o.Subject === 'Science' || o.Subject === 'Science1' || o.Subject === 'Science2'  || o.Subject === 'Social Science')){
                                                                    deepCopied[items][d][per] = o
                                                                }
                                                                else if(d === 'Wednesday' && o.subject !== deepCopied[items]['Tuesday'][per]['Subject'] && (o.Subject === 'Tamil' || o.Subject === 'English' || o.Subject === 'Maths' || o.Subject === 'Science' || o.Subject === 'Science1' || o.Subject === 'Science2'  || o.Subject === 'Social Science')){
                                                                    deepCopied[items][d][per] = o
                                                                }
                                                                
                                                                if((d === 'Thursday' || d === 'Friday') && (o.Subject === 'Tamil' || o.Subject === 'English' || o.Subject === 'Maths' || o.Subject === 'Science' || o.Subject === 'Science1' || o.Subject === 'Science2'  || o.Subject === 'Social Science')){
                                                                    deepCopied[items][d][per] = o
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                })
                            }
                        }
                        })
              
                    

                }  
            })

            // empty period again filling
            Object.keys(deepCopied).reverse().map(items=>{
                const std = parseInt(items.match(/\d+/)[0])
                let group = '';
                if(std === 11 || std === 12){
                    group = items.slice(4)
                    group = group.slice(0, -4)
                }
                let gender = ''
                if(std === 11 || std === 12){
                    gender = items.substring(items.length - 3)
                }

                let TeacherList = teachersForStd[std-1];
                const days = ['Monday','Tuesday','Wednesday','Thursday','Friday']

                function shuffleArray(array) {
                    for (let i = array.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [array[i], array[j]] = [array[j], array[i]];
                    }
                    return array;
                }

                const subObj = {
                    Biology : ['Tamil','English','Maths','Zoology','Botony','Physics','Chemistry'],
                    CS : ['Tamil','English','Maths','Computer Science','Physics','Chemistry'],
                    Commerce : ['Tamil','English','Commerce','Computer Application','Accountancy','Economy'],
                    GN : ['Tamil','English','General Nurshing','Zoology','Botony','Physics','Chemistry'],
                    BM : ['Tamil','English','Economics','Commerce','Business Maths','Accountancy'],
                    VN : ['Tamil','English','Zoology','Botony','Vocational Nurshing','EAS'],
                    VA : ['Tamil','English','Vocational Automobile','EAS','Maths'],
                } 

                if(!(TeacherList.length === 0)){
                    // Empty period in the endings
                    for(let i=1 ; i<=8 ; i++){
                        let per = 'per'+i;

                        days.map(d=>{
                            if(deepCopied[items][d][per] ===  ''){
                                shuffleArray(TeacherList).map((o,index)=>{
                                    let teacherWithDifferentGroupSubjectFor11and12 = false
                                    if(std === 11 || std === 12){
                                        if(subObj.hasOwnProperty(group)){
                                            teacherWithDifferentGroupSubjectFor11and12 = subObj[group].some(subs=>{
                                                if(subs === o.Subject){
                                                    return true
                                                }
                                            })
                                        } 
                                    }

                                    // 1 and 2 std conditions
                                    let GkCount1to2 = 0;
                                    let GK2times1to2 = false;
                                    if(std <= 2 && capitalizeFirstLetter(o.Subject) === 'GK'){
                                        const zzz = Object.values(deepCopied[items]) //values of days in a section
                                        GK2times1to2 = zzz.some(item=>{
                                            for(let key in item){
                                                if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'GK'){
                                                    GkCount1to2++;
                                                    if(GkCount1to2 === 2){
                                                        return true;
                                                    }
                                                }
                                            }
                                        })
                                    }

                                    let abacusCount1to2 = 0;
                                    let abacus3times1to2 = false;
                                    if(std <= 2 && capitalizeFirstLetter(o.Subject) === 'Abacus'){
                                        const zzz = Object.values(deepCopied[items]) //values of days in a section
                                        abacus3times1to2 = zzz.some(item=>{
                                            for(let key in item){
                                                if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Abacus'){
                                                    abacusCount1to2++;
                                                    if(abacusCount1to2 === 3){
                                                        return true;
                                                    }
                                                }
                                            }
                                        })
                                    }

                                    let evsCount1to2 = 0;
                                    let evs6times1to2 = false;
                                    if(std <= 2 && capitalizeFirstLetter(o.Subject) === 'EVS'){
                                        const zzz = Object.values(deepCopied[items]) //values of days in a section
                                        evs6times1to2 = zzz.some(item=>{
                                            for(let key in item){
                                                if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'EVS'){
                                                    evsCount1to2++;
                                                    if(evsCount1to2 === 6){
                                                        return true;
                                                    }
                                                }
                                            }
                                        })
                                    }

                                    let hindiCount1to5 = 0;
                                    let hindi2times1to5 = false;
                                    if(std <= 5 && capitalizeFirstLetter(o.Subject) === 'Hindi'){
                                        const zzz = Object.values(deepCopied[items]) //values of days in a section
                                        hindi2times1to5 = zzz.some(item=>{
                                            for(let key in item){
                                                if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Hindi'){
                                                    hindiCount1to5++;
                                                    if(hindiCount1to5 === 2){
                                                        return true;
                                                    }
                                                }
                                            }
                                        })
                                    }

                                    let hindiCount6to8 = 0;
                                    let hindi3times6to8 = false;
                                    if(std > 5 && std <= 8 && capitalizeFirstLetter(o.Subject) === 'Hindi'){
                                        const zzz = Object.values(deepCopied[items]) //values of days in a section
                                        hindi3times6to8 = zzz.some(item=>{
                                            for(let key in item){
                                                if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Hindi'){
                                                    hindiCount6to8++;
                                                    if(hindiCount6to8 === 3){
                                                        return true;
                                                    }
                                                }
                                            }
                                        })
                                    }

                                    let drawingCount1to2 = 0;
                                    let drawing1times1to2 = false;
                                    if(std <= 8 && capitalizeFirstLetter(o.Subject) === 'Drawing'){
                                        const zzz = Object.values(deepCopied[items]) //values of days in a section
                                        drawing1times1to2 = zzz.some(item=>{
                                            for(let key in item){
                                                if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Drawing'){
                                                    drawingCount1to2++;
                                                    if(drawingCount1to2 === 1){
                                                        return true;
                                                    }
                                                }
                                            }
                                        })
                                    }

                                    let HandWritingCount1to2 = 0;
                                    let HandWriting2times1to2 = false;
                                    if(std <= 2 && capitalizeFirstLetter(o.Subject) === 'HW'){
                                        const zzz = Object.values(deepCopied[items]) //values of days in a section
                                        HandWriting2times1to2 = zzz.some(item=>{
                                            for(let key in item){
                                                if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'HW'){
                                                    HandWritingCount1to2++;
                                                    if(HandWritingCount1to2 === 2){
                                                        return true;
                                                    }
                                                }
                                            }
                                        })
                                    }

                                    let csCount1to2 = 0;
                                    let cs3times1to2 = false;
                                    if(std <= 2 && capitalizeFirstLetter(o.Subject) === 'Computer Science'){
                                        const zzz = Object.values(deepCopied[items]) //values of days in a section
                                        cs3times1to2 = zzz.some(item=>{
                                            for(let key in item){
                                                if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Computer Science'){
                                                    csCount1to2++;
                                                    if(csCount1to2 === 3){
                                                        return true;
                                                    }
                                                }
                                            }
                                        })
                                    }

                                    let tamilCount1to2 = 0;
                                    let tamil5times1to2 = false;
                                    if(std <= 2 && capitalizeFirstLetter(o.Subject) === 'Tamil'){
                                        const zzz = Object.values(deepCopied[items]) //values of days in a section
                                        tamil5times1to2 = zzz.some(item=>{
                                            for(let key in item){
                                                if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Tamil'){
                                                    tamilCount1to2++;
                                                    if(tamilCount1to2 === 5){
                                                        return true;
                                                    }
                                                }
                                            }
                                        })
                                    }

                                    let englishCount1to2 = 0;
                                    let english5times1to2 = false;
                                    if(std <= 2 && capitalizeFirstLetter(o.Subject) === 'English'){
                                        const zzz = Object.values(deepCopied[items]) //values of days in a section
                                        english5times1to2 = zzz.some(item=>{
                                            for(let key in item){
                                                if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'English'){
                                                    englishCount1to2++;
                                                    if(englishCount1to2 === 5){
                                                        return true;
                                                    }
                                                }
                                            }
                                        })
                                    }

                                    let MathsCount1to2 = 0;
                                    let maths6times1to2 = false;
                                    if(std <= 2 && capitalizeFirstLetter(o.Subject) === 'Maths'){
                                        const zzz = Object.values(deepCopied[items]) //values of days in a section
                                        maths6times1to2 = zzz.some(item=>{
                                            for(let key in item){
                                                if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Maths'){
                                                    MathsCount1to2++;
                                                    if(MathsCount1to2 === 6){
                                                        return true;
                                                    }
                                                }
                                            }
                                        })
                                    }

                                      //3 to 8 std conditions
                                    
                                      let tamilCount3to8 = 0;
                                      let tamil5times3to8 = false;
                                      if(std > 2 && std <= 8 && capitalizeFirstLetter(o.Subject) === 'Tamil'){
                                          const zzz = Object.values(deepCopied[items]) //values of days in a section
                                          tamil5times3to8 = zzz.some(item=>{
                                              for(let key in item){
                                                  if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Tamil'){
                                                      tamilCount3to8++;
                                                      if(tamilCount3to8 === 5){
                                                          return true;
                                                      }
                                                  }
                                              }
                                          })
                                      }
  
                                      let englishCount3to8 = 0;
                                      let english5times3to8 = false;
                                      if(std > 2 && std <= 8 && capitalizeFirstLetter(o.Subject) === 'English'){
                                          const zzz = Object.values(deepCopied[items]) //values of days in a section
                                          english5times3to8 = zzz.some(item=>{
                                              for(let key in item){
                                                  if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'English'){
                                                      englishCount3to8++;
                                                      if(englishCount3to8 === 5){
                                                          return true;
                                                      }
                                                  }
                                              }
                                          })
                                      }
  
                                     
                                    let MathsCount3to8 = 0;
                                    let maths5times3to8 = false;
                                    if(std > 2 && std <= 8 && capitalizeFirstLetter(o.Subject) === 'Maths'){
                                        const zzz = Object.values(deepCopied[items]) //values of days in a section
                                        maths5times3to8 = zzz.some(item=>{
                                            for(let key in item){
                                                if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Maths'){
                                                    MathsCount3to8++;
                                                    if(MathsCount3to8 === 5){
                                                        return true;
                                                    }
                                                }
                                            }
                                        })
                                    }

                                    // let MathsCount6to8 = 0;
                                    // let maths6times6to8 = false;
                                    // if(std > 2 && std <= 5 && capitalizeFirstLetter(o.Subject) === 'Maths'){
                                    //     const zzz = Object.values(deepCopied[items]) //values of days in a section
                                    //     maths6times6to8 = zzz.some(item=>{
                                    //         for(let key in item){
                                    //             if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Maths'){
                                    //                 MathsCount6to8++;
                                    //                 if(MathsCount6to8 === 6){
                                    //                     return true;
                                    //                 }
                                    //             }
                                    //         }
                                    //     })
                                    // }
  
                                      let scienceCount3to8 = 0;
                                      let science5times3to8 = false;
                                      if(std > 2 && std <= 8 && capitalizeFirstLetter(o.Subject) === 'Science'){
                                          const zzz = Object.values(deepCopied[items]) //values of days in a section
                                          science5times3to8 = zzz.some(item=>{
                                              for(let key in item){
                                                  if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Science'){
                                                      scienceCount3to8++;
                                                      if(scienceCount3to8 === 5){
                                                          return true;
                                                      }
                                                  }
                                              }
                                          })
                                      }
  
                                      let socialscienceCount3to8 = 0;
                                      let socialscience5times3to8 = false;
                                      if(std > 2 && std <= 8 && capitalizeFirstLetter(o.Subject) === 'Social Science'){
                                          const zzz = Object.values(deepCopied[items]) //values of days in a section
                                          socialscience5times3to8 = zzz.some(item=>{
                                              for(let key in item){
                                                  if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Social Science'){
                                                      socialscienceCount3to8++;
                                                      if(socialscienceCount3to8 === 5){
                                                          return true;
                                                      }
                                                  }
                                              }
                                          })
                                      }
  
                                      let GkCount3to8 = 0;
                                      let GK3times3to8 = false;
                                      if(std > 2 && std <= 8 && capitalizeFirstLetter(o.Subject) === 'GK'){
                                          const zzz = Object.values(deepCopied[items]) //values of days in a section
                                          GK3times3to8 = zzz.some(item=>{
                                              for(let key in item){
                                                  if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'GK'){
                                                      GkCount3to8++;
                                                      if(GkCount3to8 === 3){
                                                          return true;
                                                      }
                                                  }
                                              }
                                          })
                                      }
  
                                      let abacusCount3to8 = 0;
                                      let abacus2times3to8 = false;
                                      if(std > 2 && std <= 8 && capitalizeFirstLetter(o.Subject) === 'Abacus'){
                                          const zzz = Object.values(deepCopied[items]) //values of days in a section
                                          abacus2times3to8 = zzz.some(item=>{
                                              for(let key in item){
                                                  if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Abacus'){
                                                      abacusCount3to8++;
                                                      if(abacusCount3to8 === 2){
                                                          return true;
                                                      }
                                                  }
                                              }
                                          })
                                      }
  
                                      let csCount3to8 = 0;
                                      let cs3times3to8 = false;
                                      if(std > 2 && std <= 8 && capitalizeFirstLetter(o.Subject) === 'Computer Science'){
                                          const zzz = Object.values(deepCopied[items]) //values of days in a section
                                          cs3times3to8 = zzz.some(item=>{
                                              for(let key in item){
                                                  if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Computer Science'){
                                                      csCount3to8++;
                                                      if(csCount3to8 === 3){
                                                          return true;
                                                      }
                                                  }
                                              }
                                          })
                                      }

                                      // 9 std condition
                                      let tamilCount9 = 0;
                                      let tamil6times9 = false;
                                      if(std === 9 && capitalizeFirstLetter(o.Subject) === 'Tamil'){
                                          const zzz = Object.values(deepCopied[items]) //values of days in a section
                                          tamil6times9 = zzz.some(item=>{
                                              for(let key in item){
                                                  if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Tamil'){
                                                        tamilCount9++;
                                                      if(tamilCount9 === 6){
                                                          return true;
                                                      }
                                                  }
                                              }
                                          })
                                      }
  
                                      let englishCount9 = 0;
                                      let english6times9 = false;
                                      if(std === 9 && capitalizeFirstLetter(o.Subject) === 'English'){
                                          const zzz = Object.values(deepCopied[items]) //values of days in a section
                                          english6times9 = zzz.some(item=>{
                                              for(let key in item){
                                                  if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'English'){
                                                      englishCount9++;
                                                      if(englishCount9 === 6){
                                                          return true;
                                                      }
                                                  }
                                              }
                                          })
                                      }
  
                                      let MathsCount9 = 0;
                                      let maths7times9 = false;
                                      if(std === 9 && capitalizeFirstLetter(o.Subject) === 'Maths'){
                                          const zzz = Object.values(deepCopied[items]) //values of days in a section
                                          maths7times9 = zzz.some(item=>{
                                              for(let key in item){
                                                  if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Maths'){
                                                    MathsCount9++;
                                                      if(MathsCount9 === 7){
                                                          return true;
                                                      }
                                                  }
                                              }
                                          })
                                      }
  
                                      let scienceCount9 = 0;
                                      let science6times9 = false;
                                      if(std === 9 && capitalizeFirstLetter(o.Subject) === 'Science'){
                                          const zzz = Object.values(deepCopied[items]) //values of days in a section
                                          science6times9 = zzz.some(item=>{
                                              for(let key in item){
                                                  if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Science'){
                                                      scienceCount9++;
                                                      if(scienceCount9 === 6){
                                                          return true;
                                                      }
                                                  }
                                              }
                                          })
                                      }
  
                                      let socialscienceCount9 = 0;
                                      let socialscience6times9 = false;
                                      if(std === 9 && capitalizeFirstLetter(o.Subject) === 'Social Science'){
                                          const zzz = Object.values(deepCopied[items]) //values of days in a section
                                          socialscience6times9 = zzz.some(item=>{
                                              for(let key in item){
                                                  if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Social Science'){
                                                      socialscienceCount9++;
                                                      if(socialscienceCount9 === 6){
                                                          return true;
                                                      }
                                                  }
                                              }
                                          })
                                      }
  
                                      let GkCount9 = 0;
                                      let GK3times9 = false;
                                      if(std === 9 && capitalizeFirstLetter(o.Subject) === 'GK'){
                                          const zzz = Object.values(deepCopied[items]) //values of days in a section
                                          GK3times9 = zzz.some(item=>{
                                              for(let key in item){
                                                  if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'GK'){
                                                      GkCount9++;
                                                      if(GkCount9 === 3){
                                                          return true;
                                                      }
                                                  }
                                              }
                                          })
                                      }

                                      let csCount9 = 0;
                                      let cs3times9 = false;
                                      if(std === 9 && capitalizeFirstLetter(o.Subject) === 'Computer Science'){
                                          const zzz = Object.values(deepCopied[items]) //values of days in a section
                                          cs3times9 = zzz.some(item=>{
                                              for(let key in item){
                                                  if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Computer Science'){
                                                      csCount9++;
                                                      if(csCount9 === 3){
                                                          return true;
                                                      }
                                                  }
                                              }
                                          })
                                      }

                                                // 10 std condition
                                                let tamilCount10 = 0;
                                                let tamil7times10 = false;
                                                if(std === 10 && capitalizeFirstLetter(o.Subject) === 'Tamil'){
                                                    const zzz = Object.values(deepCopied[items]) //values of days in a section
                                                    tamil7times10 = zzz.some(item=>{
                                                        for(let key in item){
                                                            if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Tamil'){
                                                              tamilCount10++;
                                                                if(tamilCount10 === 7){
                                                                    return true;
                                                                }
                                                            }
                                                        }
                                                    })
                                                }
            
                                                let englishCount10 = 0;
                                                let english7times10 = false;
                                                if(std === 10 && capitalizeFirstLetter(o.Subject) === 'English'){
                                                    const zzz = Object.values(deepCopied[items]) //values of days in a section
                                                    english7times10 = zzz.some(item=>{
                                                        for(let key in item){
                                                            if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'English'){
                                                              englishCount10++;
                                                                if(englishCount10 === 7){
                                                                    return true;
                                                                }
                                                            }
                                                        }
                                                    })
                                                }
            
                                                let MathsCount10 = 0;
                                                let maths8times10 = false;
                                                if(std === 10 && capitalizeFirstLetter(o.Subject) === 'Maths'){
                                                    const zzz = Object.values(deepCopied[items]) //values of days in a section
                                                    maths8times10 = zzz.some(item=>{
                                                        for(let key in item){
                                                            if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Maths'){
                                                              MathsCount10++;
                                                                if(MathsCount10 === 8){
                                                                    return true;
                                                                }
                                                            }
                                                        }
                                                    })
                                                }
            
                                                let science1Count10 = 0;
                                                let science14times10 = false;
                                                if(std === 10 && capitalizeFirstLetter(o.Subject) === 'Science1'){
                                                    const zzz = Object.values(deepCopied[items]) //values of days in a section
                                                    science14times10 = zzz.some(item=>{
                                                        for(let key in item){
                                                            if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Science1'){
                                                              science1Count10++;
                                                                if(science1Count10 === 4){
                                                                    return true;
                                                                }
                                                            }
                                                        }
                                                    })
                                                }
          
                                                let science2Count10 = 0;
                                                let science24times10 = false;
                                                if(std === 10 && capitalizeFirstLetter(o.Subject) === 'Science2'){
                                                    const zzz = Object.values(deepCopied[items]) //values of days in a section
                                                    science24times10 = zzz.some(item=>{
                                                        for(let key in item){
                                                            if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Science2'){
                                                              science2Count10++;
                                                                if(science2Count10 === 4){
                                                                    return true;
                                                                }
                                                            }
                                                        }
                                                    })
                                                }
            
                                                let socialscienceCount10 = 0;
                                                let socialscience8times10 = false;
                                                if(std === 10 && capitalizeFirstLetter(o.Subject) === 'Social Science'){
                                                    const zzz = Object.values(deepCopied[items]) //values of days in a section
                                                    socialscience8times10 = zzz.some(item=>{
                                                        for(let key in item){
                                                            if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Social Science'){
                                                              socialscienceCount10++;
                                                                if(socialscienceCount10 === 8){
                                                                    return true;
                                                                }
                                                            }
                                                        }
                                                    })
                                                }

                                                 // 11 and 12 std condition
                                            let tamilCount11and12 = 0;
                                            let tamil5times11and12= false;
                                            if(std > 10 && capitalizeFirstLetter(o.Subject) === 'Tamil'){
                                                const zzz = Object.values(deepCopied[items]) //values of days in a section
                                                tamil5times11and12 = zzz.some(item=>{
                                                    for(let key in item){
                                                        if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Tamil'){
                                                            tamilCount11and12++;
                                                            if(tamilCount11and12 === 5){
                                                                return true;
                                                            }
                                                        }
                                                    }
                                                })
                                            }
        
                                            let englishCount11and12 = 0;
                                            let english5times11and12 = false;
                                            if(std > 10 && capitalizeFirstLetter(o.Subject) === 'English'){
                                                const zzz = Object.values(deepCopied[items]) //values of days in a section
                                                english5times11and12 = zzz.some(item=>{
                                                    for(let key in item){
                                                        if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'English'){
                                                            englishCount11and12++;
                                                            if(englishCount11and12 === 5){
                                                                return true;
                                                            }
                                                        }
                                                    }
                                                })
                                            }

                                            let mathsCount11and12 = 0;
                                            let maths7times11and12 = false;
                                            if(std > 10 && capitalizeFirstLetter(o.Subject) === 'Maths'){
                                                const zzz = Object.values(deepCopied[items]) //values of days in a section
                                                maths7times11and12 = zzz.some(item=>{
                                                    for(let key in item){
                                                        if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Maths'){
                                                            mathsCount11and12++;
                                                            if(mathsCount11and12 === 7){
                                                                return true;
                                                            }
                                                        }
                                                    }
                                                })
                                            }

                                            let physicsCount11and12 = 0;
                                            let physics7times11and12 = false;
                                            if(std > 10 && capitalizeFirstLetter(o.Subject) === 'Physics'){
                                                const zzz = Object.values(deepCopied[items]) //values of days in a section
                                                physics7times11and12 = zzz.some(item=>{
                                                    for(let key in item){
                                                        if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Physics'){
                                                            physicsCount11and12++;
                                                            if(physicsCount11and12 === 7){
                                                                return true;
                                                            }
                                                        }
                                                    }
                                                })
                                            }

                                            let chemistyCount11and12 = 0;
                                            let chemisty7times11and12 = false;
                                            if(std > 10 && capitalizeFirstLetter(o.Subject) === 'Chemistry'){
                                                const zzz = Object.values(deepCopied[items]) //values of days in a section
                                                chemisty7times11and12 = zzz.some(item=>{
                                                    for(let key in item){
                                                        if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Chemistry'){
                                                            chemistyCount11and12++;
                                                            if(chemistyCount11and12 === 7){
                                                                return true;
                                                            }
                                                        }
                                                    }
                                                })
                                            }

                                            let csCount11and12 = 0;
                                            let cs7times11and12 = false;
                                            if(std > 10 && capitalizeFirstLetter(o.Subject) === 'Computer Science'){
                                                const zzz = Object.values(deepCopied[items]) //values of days in a section
                                                cs7times11and12 = zzz.some(item=>{
                                                    for(let key in item){
                                                        if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Computer Science'){
                                                            csCount11and12++;
                                                            if(csCount11and12 === 7){
                                                                return true;
                                                            }
                                                        }
                                                    }
                                                })
                                            }

                                            let botonyCount11and12 = 0;
                                            let botony4times11and12 = false;
                                            if(std > 10 && capitalizeFirstLetter(o.Subject) === 'Botony'){
                                                const zzz = Object.values(deepCopied[items]) //values of days in a section
                                                botony4times11and12 = zzz.some(item=>{
                                                    for(let key in item){
                                                        if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Botony'){
                                                            botonyCount11and12++;
                                                            if(botonyCount11and12 === 4){
                                                                return true;
                                                            }
                                                        }
                                                    }
                                                })
                                            }

                                            
                                            let zoologyCount11and12 = 0;
                                            let zoology3times11and12 = false;
                                            if(std > 10 && capitalizeFirstLetter(o.Subject) === 'Zoology'){
                                                const zzz = Object.values(deepCopied[items]) //values of days in a section
                                                zoology3times11and12 = zzz.some(item=>{
                                                    for(let key in item){
                                                        if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Zoology'){
                                                            zoologyCount11and12++;
                                                            if(zoologyCount11and12 === 3){
                                                                return true;
                                                            }
                                                        }
                                                    }
                                                })
                                            }

                                            let commerceCount11and12 = 0;
                                            let commerce7times11and12 = false;
                                            if(std > 10 && capitalizeFirstLetter(o.Subject) === 'Commerce'){
                                                const zzz = Object.values(deepCopied[items]) //values of days in a section
                                                commerce7times11and12 = zzz.some(item=>{
                                                    for(let key in item){
                                                        if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Commerce'){
                                                            commerceCount11and12++;
                                                            if(commerceCount11and12 === 7){
                                                                return true;
                                                            }
                                                        }
                                                    }
                                                })
                                            }

                                            let economyCount11and12 = 0;
                                            let economy7times11and12 = false;
                                            if(std > 10 && capitalizeFirstLetter(o.Subject) === 'Economy'){
                                                const zzz = Object.values(deepCopied[items]) //values of days in a section
                                                economy7times11and12 = zzz.some(item=>{
                                                    for(let key in item){
                                                        if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Economy'){
                                                            economyCount11and12++;
                                                            if(economyCount11and12 === 7){
                                                                return true;
                                                            }
                                                        }
                                                    }
                                                })
                                            }

                                            let accountancyCount11and12 = 0;
                                            let accountancy7times11and12 = false;
                                            if(std > 10 && capitalizeFirstLetter(o.Subject) === 'Accountancy'){
                                                const zzz = Object.values(deepCopied[items]) //values of days in a section
                                                accountancy7times11and12 = zzz.some(item=>{
                                                    for(let key in item){
                                                        if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Accountancy'){
                                                            accountancyCount11and12++;
                                                            if(accountancyCount11and12 === 7){
                                                                return true;
                                                            }
                                                        }
                                                    }
                                                })
                                            }

                                            let computerApplicationCount11and12 = 0;
                                            let computerApplication7times11and12 = false;
                                            if(std > 10 && capitalizeFirstLetter(o.Subject) === 'Computer Application'){
                                                const zzz = Object.values(deepCopied[items]) //values of days in a section
                                                computerApplication7times11and12 = zzz.some(item=>{
                                                    for(let key in item){
                                                        if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Computer Application'){
                                                            computerApplicationCount11and12++;
                                                            if(computerApplicationCount11and12 === 7){
                                                                return true;
                                                            }
                                                        }
                                                    }
                                                })
                                            }

                                            let EASCount11and12 = 0;
                                            let EAS7times11and12 = false;
                                            if(std > 10 && capitalizeFirstLetter(o.Subject) === 'EAS'){
                                                const zzz = Object.values(deepCopied[items]) //values of days in a section
                                                EAS7times11and12 = zzz.some(item=>{
                                                    for(let key in item){
                                                        if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'EAS'){
                                                            EASCount11and12++;
                                                            if(EASCount11and12 === 7){
                                                                return true;
                                                            }
                                                        }
                                                    }
                                                })
                                            }

                                            let BMCount11and12 = 0;
                                            let BM7times11and12 = false;
                                            if(std > 10 && capitalizeFirstLetter(o.Subject) === 'Business Maths'){
                                                const zzz = Object.values(deepCopied[items]) //values of days in a section
                                                BM7times11and12 = zzz.some(item=>{
                                                    for(let key in item){
                                                        if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Business Maths'){
                                                            BMCount11and12++;
                                                            if(BMCount11and12 === 7){
                                                                return true;
                                                            }
                                                        }
                                                    }
                                                })
                                            }

                                            let VNCount11and12 = 0;
                                            let VN7times11and12 = false;
                                            if(std > 10 && capitalizeFirstLetter(o.Subject) === 'Vocational Nurshing'){
                                                const zzz = Object.values(deepCopied[items]) //values of days in a section
                                                VN7times11and12 = zzz.some(item=>{
                                                    for(let key in item){
                                                        if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Vocational Nurshing'){
                                                            VNCount11and12++;
                                                            if(VNCount11and12 === 7){
                                                                return true;
                                                            }
                                                        }
                                                    }
                                                })
                                            }

                                            let VACount11and12 = 0;
                                            let VA7times11and12 = false;
                                            if(std > 10 && capitalizeFirstLetter(o.Subject) === 'Vocational Automobile'){
                                                const zzz = Object.values(deepCopied[items]) //values of days in a section
                                                VA7times11and12 = zzz.some(item=>{
                                                    for(let key in item){
                                                        if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'Vocational Automobile'){
                                                            VACount11and12++;
                                                            if(VACount11and12 === 7){
                                                                return true;
                                                            }
                                                        }
                                                    }
                                                })
                                            }

                                            let GNCount11and12 = 0;
                                            let GN7times11and12 = false;
                                            if(std > 10 && capitalizeFirstLetter(o.Subject) === 'General Nurshing'){
                                                const zzz = Object.values(deepCopied[items]) //values of days in a section
                                                GN7times11and12 = zzz.some(item=>{
                                                    for(let key in item){
                                                        if(item[key] !== '' && capitalizeFirstLetter(item[key]['Subject']) === 'General Nurshing'){
                                                            GNCount11and12++;
                                                            if(GNCount11and12 === 7){
                                                                return true;
                                                            }
                                                        }
                                                    }
                                                })
                                            }


                                    if(!GK2times1to2 && !abacus3times1to2 && !evs6times1to2 && !hindi2times1to5 && !hindi3times6to8 && !drawing1times1to2 && !HandWriting2times1to2 && !cs3times1to2 && !tamil5times1to2 && !english5times1to2 && !maths6times1to2 && !tamil5times3to8 && !english5times3to8 && !maths5times3to8 && !science5times3to8 && !socialscience5times3to8 && !GK3times3to8 && !abacus2times3to8 && !cs3times3to8 && !tamil6times9 && !english6times9 && !maths7times9 && !science6times9 && !socialscience6times9 && !GK3times9 && !cs3times9 && !tamil7times10 && !english7times10 && !maths8times10 && !science14times10 && !science24times10 && !socialscience8times10 && !tamil5times11and12 && !english5times11and12 && !maths7times11and12 && !physics7times11and12 && !chemisty7times11and12 && !cs7times11and12 && !botony4times11and12 && !zoology3times11and12 && !commerce7times11and12 && !economy7times11and12 && !accountancy7times11and12 && !computerApplication7times11and12 && !EAS7times11and12 && !BM7times11and12 && !VN7times11and12 && !VA7times11and12 && !GN7times11and12){
                                        if((std === 11 || std === 12) && teacherWithDifferentGroupSubjectFor11and12){
                                            let teacherAlreadyInTheClass = Object.values(deepCopied[items]).some(jl=>{
                                                for(let h in jl){
                                                    if(jl[h]['Name'] === o.Name){
                                                        return true
                                                    }
                                                }
                                            })
                                            const isIDExist = Object.keys(deepCopied).some(k=>{
                                                if(deepCopied[k][d][per] !== ''){
                                                    return deepCopied[k][d][per]['ID'] === o.ID
                                                } 
                                            })
                                            if(teacherAlreadyInTheClass && (isIDExist === false)){
                                                // o.ID = o.ID + ' from loop 3'
                                                // if(deepCopied[items][d][per] === ''){
                                                    // deepCopied[items][d][per] = o
                                                // }
                                                
                                            }
                                            
                                        }
                                        else{
                                            const prevPeriod = 'per'+(i-1);

                                            let teacherAlreadyInTheClass = Object.values(deepCopied[items]).some(jl=>{
                                                for(let h in jl){
                                                    if(jl[h]['Name'] === o.Name){
                                                        return true
                                                    }
                                                }
                                            })
                                            const isIDExist = Object.keys(deepCopied).some(k=>{
                                                if(deepCopied[k][d][per] !== ''){
                                                    return deepCopied[k][d][per]['ID'] === o.ID
                                                } 
                                            })

                                            if(teacherAlreadyInTheClass && (isIDExist === false)){
                                                if(per === 'per1' && d === 'Tuesday'){
                                                    if(deepCopied[items]['Monday'][per] !== '' && deepCopied[items]['Monday'][per]['Subject'] !== o.Subject){
                                                        deepCopied[items][d][per] = o
                                                    }
                                                }
                                                else if(per === 'per1' && d === 'Thursday'){
                                                    if(deepCopied[items]['Wednesday'][per] !== '' && deepCopied[items]['Wednesday'][per]['Subject'] !== o.Subject){
                                                        deepCopied[items][d][per] = o
                                                    }
                                                }
                                                else{
                                                    deepCopied[items][d][per] = o
                                                }
                                            }
                                           
                                        }
                                    }
                                })    
                            }
                        })
                    }
                }  
            })

            setFinalOut(deepCopied)
        
        }
    },[genTT])

    return ( 
        <>
            <h2 className="text-center bg-primary text-white py-2">TIMETABLE GENERATOR</h2>
            <div className='row justify-content-between align-items-start m-auto' style={{width:'90%'}}>
                <div className='add-teacher col-lg-6'>
                    <h4 className='text-decoration-underline text-center mb-3'>Add Teacher</h4>
                    <form className='p-3 rounded' onSubmit={e => addTeacher(e)} style={{boxShadow:'0px 0px 10px 0px gray'}}>
                        <label className='me-2'>Name :</label><input className='mb-1' value={t_name} placeholder='Enter Teacher Name' onChange={(e)=>setT_name(e.target.value)}/> <br></br>
                        <label className='me-2'>Email :</label><input type='email' value={t_email} className='mb-1' placeholder='Enter Teacher Email' onChange={(e)=>setT_email(e.target.value)}/> <br></br>
                        <label className='me-2'>ID :</label><input type='number' value={t_id} className='mb-1' placeholder='Enter Teacher Email' onChange={(e)=>setT_id(e.target.value)}/> <br></br>
                        <div className='text-start border rounded p-1'>
                            <h5>Select subject and class</h5>
                            {subjects.map((subject, index) => (
                                <div className='d-flex mb-2' key={index}>
                                    <select className='me-2 rounded' value={subject.subject} onChange={(e) => handleSubjectChange(index, e.target.value)}>
                                        <option value="">Select a subject</option>
                                        <option value="Tamil">Tamil</option>
                                        <option value="English">English</option>
                                        <option value="Maths">Maths</option>
                                        <option value="Science">Science</option>
                                        <option value="Social Science">Social Science</option>
                                        <option value="Hindi">Hindi</option>
                                        <option value="PET">PET</option>
                                        <option value="Physics">Physics</option>
                                        <option value="Chemistry">Chemistry</option>
                                        <option value="Computer Science">Computer Science</option>
                                        <option value="Computer Application">Computer Application</option>
                                        <option value="Botony">Botony</option>
                                        <option value="Zoology">Zoology</option>
                                        <option value="Commerce">Commerce</option>
                                        <option value="Economy">Economics</option>
                                        <option value="Accountancy">Accountancy</option>
                                        <option value="Business Maths">Business Maths</option>
                                        <option value="EAS">EAS</option>
                                        <option value="General Nurshing">General Nurshing</option>
                                        <option value="Vocational Nurshing">Vocational Nurshing</option>
                                        <option value="Vocational Automobile">Vocational Automobile</option>
                                        <option value="GK">General Knowledge</option>
                                        <option value="EVS">EVS</option>
                                        <option value="Abacus">Abacus</option>
                                        <option value="HW">Handwritten</option>
                                        <option value="Draw">Drawing</option>
                                    </select>
                                    <select className='me-2 rounded' value={subject.class} onChange={(e) => handleClassChange(index, e.target.value)}>
                                        <option value="">Select an STD</option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                        <option value="6">6</option>
                                        <option value="7">7</option>
                                        <option value="8">8</option>
                                        <option value="9">9</option>
                                        <option value="10">10</option>
                                        <option value="11">11</option>
                                        <option value="12">12</option>
                                    </select>
                                    <button className='btn-danger text-white btn' onClick={() => handleDeleteSubject(index)}>Delete</button>
                                </div>
                            ))}
                            <button className='btn btn-success' onClick={handleAddSubject}>Add</button>
                        </div>
                        <button type='submit' className='btn btn-primary mt-2'>ADD TEACHER</button>
                    </form>

                    <div className='mt-3 rounded text-center' style={{boxShadow:'0px 0px 10px 0px gray'}}>
                        <h4 className='text-center'>Select Subjects For All Standards</h4>
                        {
                            Array.from({length : 12}).map((_, index) => 
                                (
                                    <div className='border m-2 p-2 rounded text-start' key={index}>
                                        <h5>{index+1} STD</h5>
                                        <select className='mb-2' value={sections['STD '+(index+1)]} onChange={(e)=>{
                                            let preSections = {...sections}
                                            preSections['STD '+(index+1)] = e.target.value
                                            setSections(preSections)
                                            if(index === 10){
                                                setCheckvalue11(e.target.value)
                                            }
                                            if(index === 11){
                                                setCheckvalue12(e.target.value)
                                            }
                                          }}>
                                            <option value="">Select no of sections</option>
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                            <option value="5">5</option>
                                            <option value="6">6</option>
                                            <option value="7">7</option>
                                            <option value="8">8</option>
                                            <option value="9">9</option>
                                            <option value="10">10</option>
                                        </select>
                                        {
                                            (index === 10 && checkvalue11 !== '') &&
                                            <div>
                                                {
                                                    Array.from({length : Number(checkvalue11)}).map((_,index)=>{
                                                        return  <div key={index} className='d-flex mb-3 align-items-center'>
                                                                    <p className='m-0 me-2'>Section {index+1}</p> 
                                                                    <select value={groupsForSections11.hasOwnProperty((index+1).toString()) ? groupsForSections11[index+1] : ''} onChange={(e)=>{
                                                                        const obj11 = {...groupsForSections11}
                                                                        obj11[index+1] = e.target.value
                                                                        setGroupsForSections11(obj11)
                                                                    }}>
                                                                        <option value=''>Select Group</option>
                                                                        <option value='Biology (G)'>Biology (G)</option>
                                                                        <option value='CS (G)'>Computer Science (G)</option>
                                                                        <option value='GN (G)'>General Nurshing (G)</option>
                                                                        <option value='Commerce (G)'>Commerce (G)</option>
                                                                        <option value='VA (G)'>Vocational Automobile (G)</option>

                                                                        <option value='Biology (B)'>Biology (B)</option>
                                                                        <option value='CS (B)'>Computer Science (B)</option>
                                                                        <option value='GN (B)'>General Nurshing (B)</option>
                                                                        <option value='Commerce (B)'>Commerce (B)</option>
                                                                        <option value='VA (B)'>Vocational Automobile (B)</option>

                                                                        <option value='Biology (C)'>Biology (C)</option>
                                                                        <option value='CS (C)'>Computer Science (C)</option>
                                                                        <option value='GN (C)'>General Nurshing (C)</option>
                                                                        <option value='Commerce (C)'>Commerce (C)</option>
                                                                        <option value='VA (C)'>Vocational Automobile (C)</option>
                                                                    </select>
                                                                </div>
                                                    })
                                                }
                                            </div>
                                        }
                                        {
                                            (index === 11 && checkvalue12 !== '') &&
                                            <div>
                                                {
                                                    Array.from({length : Number(checkvalue12)}).map((_,index)=>{
                                                        return  <div key={index} className='d-flex mb-3 align-items-center'>
                                                                    <p className='m-0 me-2'>Section {index+1}</p> 
                                                                    <select value={groupsForSections12.hasOwnProperty((index+1).toString()) ? groupsForSections12[index+1] : ''} onChange={(e)=>{
                                                                         const obj12 = {...groupsForSections12}
                                                                         obj12[index+1] = e.target.value
                                                                         setGroupsForSections12(obj12)
                                                                    }}>
                                                                        <option value=''>Select Group</option>
                                                                        <option value='Biology (G)'>Biology (G)</option>
                                                                        <option value='CS (G)'>Computer Science (G)</option>
                                                                        <option value='Commerce (G)'>Commerce (G)</option>
                                                                        <option value='BM (G)'>Business Maths (G)</option>
                                                                        <option value='GN (G)'>General Nurshing (G)</option>                                                              
                                                                        <option value='VN (G)'>Vocational Nurshing (G)</option>
                                                                        <option value='VA (G)'>Vocational Automobile (G)</option>

                                                                        <option value='Biology (B)'>Biology (B)</option>
                                                                        <option value='CS (B)'>Computer Science (B)</option>
                                                                        <option value='Commerce (B)'>Commerce (B)</option>
                                                                        <option value='BM (B)'>Business Maths (B)</option>
                                                                        <option value='GN (B)'>General Nurshing (B)</option>                                                              
                                                                        <option value='VN (B)'>Vocational Nurshing (B)</option>
                                                                        <option value='VA (B)'>Vocational Automobile (B)</option>

                                                                        <option value='Biology (C)'>Biology (C)</option>
                                                                        <option value='CS (C)'>Computer Science (C)</option>
                                                                        <option value='Commerce (C)'>Commerce (C)</option>
                                                                        <option value='BM (C)'>Business Maths (C)</option>
                                                                        <option value='GN (C)'>General Nurshing (C)</option>                                                              
                                                                        <option value='VN (C)'>Vocational Nurshing (C)</option>
                                                                        <option value='VA (C)'>Vocational Automobile (C)</option>
                                                                    </select>
                                                                </div>
                                                    })
                                                }
                                            </div>
                                        }
                                        {/* <Select 
                                            options={options}
                                            value={selectedOptions[index]}
                                            onChange={(selected) => handleChange(index, selected)}
                                            isMulti={true}
                                        /> */}
                                    </div>
                                ))
                        }
                        <button className='btn btn-primary' onClick={saveSubjects}>SAVE</button>
                    </div>
                </div> 
                <div className='add-teacher col-lg-5 text-center'>
                        <h4>Teacher List</h4>
                        <ol className='text-start'>
                            {
                               Object.keys(teacher).length !== 0 && Object.keys(teacher).map(key => {
                                                                        return  <li key={teacher[key]['ID']} className='border p-2 mb-2' style={{position:'relative'}}>
                                                                                    <p>Name : {teacher[key]['Name']}</p>
                                                                                    <p>Email : {teacher[key]['Email']}</p>
                                                                                    <p>ID : {teacher[key]['ID']}</p>
                                                                                    <h5>Subjects</h5>
                                                                                    <ol>
                                                                                    {
                                                                                        teacher[key]['Subjects'].map((item,index) => {
                                                                                            return <li key={index}>{item.subject} - '{item.class} STD'</li>
                                                                                        })
                                                                                    }
                                                                                    </ol>
                                                                               
                                                                                    <FontAwesomeIcon icon={faTrash} className='ms-2 text-danger border p-1' style={{position:'absolute',top:'2%',right:'2%'}} onClick={()=>{
                                                                                        axios.post('http://localhost:3001/deleteTeacher', {
                                                                                            TeacherID : teacher[key]['ID'],
                                                                                        }).then(response => {
                                                                                            if(response?.data.message === 'Teacher Deleted Successfully'){
                                                                                                alert("Teacher Deleted Successfully")
                                                                                                axios.get(`http://localhost:3001/getTeachers`)
                                                                                                .then(response => {
                                                                                                        let preTeachers = {}
                                                                                                        if(response.data.teachers.length !== 0){
                                                                                                            response.data.teachers.map((item) => {
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
                                                                                            }
                                                                                            else{
                                                                                                alert("Teacher Not Found or Already Deleted")
                                                                                            }
                                                                                        })
                                                                                        .catch(error => {
                                                                                            console.error('Error fetching admins:', error);
                                                                                        });
                                                                                    }}/>
                                                                                </li>
                                                                    })
                            }
                        </ol>
                </div>      
            </div>
            <div className='text-center border p-2'>
                <button onClick={GenerateTT}>Generate New TimeTable</button>
                <div className="m-auto mt-5 table-container" style={{ overflowX: 'auto', maxWidth: '100%',position:'relative'}}> 
                    {
                        finalOut.length !== 0 && Object.keys(finalOut).map(list=>{
                           return <div className='mt-3 border p-1 rounded' style={{boxShadow:'0px 0px 20px -7px gray'}} key={list}>
                                    <h3>{list}</h3>
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
                                            {Object.keys(finalOut[list]).map((day, index) => (
                                                <tr key={index}>
                                                    <td className='tt-td border'><strong>{day}</strong></td>
                                                    {Object.keys(finalOut[list][day]).map((period, idx) => (
                                                        <td key={idx} className='tt-td border'>
                                                            {/* {finalOut[list][day][period]['Subject']} */}
                                                            <p className='m-0 border mb-2'>Subject : {finalOut[list][day][period]['Subject']}</p>
                                                            <p className='m-0'>Staff : {finalOut[list][day][period]['Name']}</p>
                                                            <p className='m-0'>Staff ID : {finalOut[list][day][period]['ID']}</p>
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                        })
                    }
                   
                </div>
                <button className='btn btn-primary mt-3 mb-5' onClick={()=>{
                    axios.post('http://localhost:3001/SaveTimetable', {
                        finalOut : finalOut,
                    }).then(response => {
                        if(response?.data.message === 'Time Table updated successfully'){
                            alert('Time Table updated successfully')
                    }})
                    .catch(error => {
                        console.error('Error fetching admins:', error);
                    });
                }}>Save Timetable</button>
            </div>
        </>
     );
}

export default Admin;