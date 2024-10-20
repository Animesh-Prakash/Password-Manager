import React, { useState, useEffect, useRef } from 'react';
import Add from '../assets/add.svg';
import Eye from '../assets/eye.svg';
import eyecross from '../assets/eyecross.svg';
import Edit from '../assets/edit.svg'
import Delete from '../assets/delete.svg'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { v4 as uuidv4 } from 'uuid';

const Manager = () => {
  const passwordRef = useRef();
  const [form, setform] = useState({ site: "", username: "", password: "" });
  const [passwordArray, setPasswordArray] = useState([]);
  const [showPassword, setShowPassword] = useState(false); // State to track password visibility

  const getPasswords=async()=>{
    let req=await fetch('http://localhost:3000/')
    let passwords = await req.json()
 
      setPasswordArray(passwords);
    console.log(passwords)
  }
  useEffect(() => {
  getPasswords()
    
  }, []);

  // Toggle password visibility
  const handleShowPassword = () => {
    setShowPassword(!showPassword); // Toggle the showPassword state
    if (passwordRef.current) {
      passwordRef.current.type = showPassword ? 'password' : 'text';
    }
  };

  const savePassword = async() => {
    if(form.site.length>3 && form.username.length>3 && form.password.length>3){
      //If any such id exists in the db, delete it 
       await fetch('http://localhost:3000/',{method: "DELETE", headers:{"Content-Type":"application/json"}, body:JSON.stringify({id:form.id})})

      setPasswordArray([...passwordArray, {...form, id: uuidv4()}]);
    await fetch('http://localhost:3000/',{method: "POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({...form, id:uuidv4()})})

      // localStorage.setItem("passwords", JSON.stringify([...passwordArray, form]));
      setform({ site: "", username: "", password: "" })
      // console.log([...passwordArray, form]);
      toast('Password Saved!',{
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
  
      })
    }
    else{
      toast("Error: Password is not saved!");
    }
  };

  const deletePassword = async(id) => {
    let c=confirm("Do you really want to delete password");
    if(c){
      setPasswordArray([...passwordArray, {...form, id: uuidv4()}]);
      setPasswordArray(passwordArray.filter(item=>item.id!==id))
      // localStorage.setItem("passwords", JSON.stringify(passwordArray.filter(item=>item.id!==id)));
      let res= await fetch('http://localhost:3000/',{method: "DELETE", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ id})})

      toast('Password Deleted!',{
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",

      })
    }
  
  };

  const editPassword = (id) => {
    setform({...passwordArray.filter(i=>i.id===id)[0], id: id});
     setPasswordArray(passwordArray.filter(item=>item.id!==id));
    // localStorage.setItem("passwords", JSON.stringify([...passwordArray, {...form, id: uuidv4()}]));
    // console.log([...passwordArray, form]);
  };

  const handleChange = (e) => {
    setform({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <>
    <ToastContainer />
      <div className="absolute top-0 z-[-2] min-h-full w-screen rotate-180 transform ]"></div>
      <div className=" p-3 md:mycontainer min-h-[80.7vh] ">
        <h1 className='text-4xl font-bold text-center'>
          <span className='text-green-700'> &lt;</span>
          <span>Pass</span>
          <span className='text-green-700'>OP/&gt;</span>
        </h1>
        <p className='text-green-700 text-lg text-center'>your own Password Manager</p>
        <div className="text-black flex flex-col p-4 gap-8 items-center">
          <input value={form.site} onChange={handleChange} placeholder='Enter Website URL' className='rounded-full border-green-500 w-full p-4 py-1' type="text" name='site' id='' />
          <div className="flex flex-col md:flex-row w-full justify-between gap-8">
            <input value={form.username} onChange={handleChange} placeholder='Enter username' className='rounded-full border-green-500 w-full p-4 py-1' type="text" name='username' id='' />
            <div className="relative ">
              <input ref={passwordRef} value={form.password} onChange={handleChange} placeholder='Enter Password' className='rounded-full border-green-500 below-1000:w-full p-4 py-1 w-[20vw]' type="password" name='password' id='' />
              <span className='absolute right-[3px] top-[2px] cursor-pointer' onClick={handleShowPassword}>
                <img className='w-[30px]' src={showPassword ? eyecross : Eye} alt="toggle visibility" />
              </span>
            </div>
          </div>
          <button onClick={savePassword} className='flex justify-between items-center bg-green-400 rounded-[10px] px-2 py-1 gap-2 w-fit hover:bg-green-300 border-2 border-green-900'>
            <img className='w-[30px]' src={Add} alt="Add" />
            Save
          </button>
        </div>
        <div className="passwords mx-2 mb-3">
  <h2 className="font-bold text-xl py-4">Your Passwords</h2>

  {passwordArray.length === 0 && <div>No Password to show</div>}

  {passwordArray.length !== 0 && (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-green-100 rounded-md ">
        <thead className="bg-green-800 text-white">
          <tr>
            <th className="py-2 px-4 text-left">Site</th>
            <th className="py-2 px-4 text-left">Username</th>
            <th className="py-2 px-4 text-left">Password</th>
            <th className="py-2 px-4 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {passwordArray.map((item, index) => (
            <tr key={index} className="border-b">
              <td className="py-2 px-4 border border-white text-left break-words max-w-[150px]">
                <a href={item.site} target="_blank" rel="noopener noreferrer">{item.site}</a>
              </td>
              <td className="py-2 px-4 border border-white text-left break-words max-w-[150px]">
                {item.username}
              </td>
              <td className="py-2 px-4 border border-white text-left break-words max-w-[150px]">
                {item.password}
              </td>
              <td className="py-2 px-4 border border-white text-left">
                <div className="flex justify-center space-x-3">
                  <span className="cursor-pointer" onClick={() => editPassword(item.id)}>
                    <img src={Edit} className="w-7" alt="Edit" />
                  </span>
                  <span className="cursor-pointer" onClick={() => deletePassword(item.id)}>
                    <img src={Delete} className="w-7" alt="Delete" />
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</div>

      </div>
    </>
  );
};

export default Manager;
