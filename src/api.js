import { getToken } from "./auth";

const API = "https://prodify-backend-oxmw.onrender.com/api";

export async function getTasks(){

  try{

    const res = await fetch(`${API}/api/tasks`,{
      headers:{
        Authorization: getToken()
      }
    });

    if(!res.ok){
      return [];
    }

    return await res.json();

  }catch(err){

    console.log("API error:",err);
    return [];

  }

}

export async function createTask(task){

  const res = await fetch(`${API}/api/tasks`,{
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      Authorization:getToken()
    },
    body:JSON.stringify(task)
  });

  return res.json();

}

export async function deleteTask(id){

  await fetch(`${API}/api/tasks/${id}`,{
    method:"DELETE",
    headers:{
      Authorization:getToken()
    }
  });

}