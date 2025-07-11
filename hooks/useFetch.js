import axios from 'axios'
import { useEffect, useState } from 'react'

function useFetch(url){
    const [error,setError] = useState(null)
    const [loading,setLoading] =useState(true)
    const [data,setData] = useState([])

    const fetchData = async () => {
        try {
            const {data:responseData} = await axios.get(url)
            setData(responseData)
            setLoading(false) 

        } catch (error) {
            setError(error.message)
            setLoading(false)
        }    
    }
    //this is the usage type for taking data
    useEffect( ()=>{
        fetchData()
    },[])

    return {
        error,loading,data
    }
}

export default useFetch