import axios from 'axios'
import { useState } from 'react'

function usePost(){
    const [data,setData]=useState(null)
    const [loading,setLoading]=useState(false)
    const [error,setError]=useState(null)

    const post= async (url , apiData) => {
        try {
            setLoading(true)
            const {data:responseData} = await axios.post(url,apiData,{headers: {"Content-Type":"application/json",},});
            setData(responseData)
            setLoading(false)
        } catch (error) {
            setError(error)
            setLoading(false)
        }
    }

    return {data,loading,error, post}

}

export default usePost