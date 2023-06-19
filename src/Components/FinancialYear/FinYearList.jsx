import React, { useState, useEffect } from 'react'
import '../../style/chargeList.css'
import axios from '../axios.jsx'
import FindAllData from '../AccountCharge/FindAllData.jsx'
import { ToastContainer, toast } from 'react-toastify'
import FindAllFinYear from './FindAllFinYear'


function FinYearList() {

    const [allData, setAllData] = useState([]);
    const [isError, setisError] = useState('');
    const [inputId, setInputId] = useState('');
    const [showAllData, setShowAllData] = useState(true);

    useEffect(() => {
        handleFindALL();
    }, [])


    const handleFindALL = async () => {

        try {

            const res = await axios.get("finYear/findAll");
            setAllData(res.data);
            console.log(res.data);


        } catch (error) {
            setisError(error.message);
            console.log(error.message);
            showErrorToast();
        }
    }

    useEffect(() => {
        handleFindALL();
    }, [])

    // findAll && handleFindALL();



    const showErrorToast = () => {
        toast.error("Something went wrong, check your connection !!")
    }
    const showErrorNotFoundToast = () => {
        toast.error("Not Found!!")
    }




    const fetchData = async () => {

        try {
            const res = await axios.get(`finYear/find/${inputId}`)
            setAllData([res.data]);
            console.log([res.data]);
        } catch (error) {
            setisError(error.message);
            console.log(error.message);
            showErrorNotFoundToast();
        }

    }


    // const findDataById = () => {
    //     return allData.find((item) => item.id === inputId);
    //   };



    return (

        <>

            <h2 id='chargeHeadID'>Financial Year List</h2>


            <div className='find-container'>
                {/* <div className='findButtonClass'><button className='btn-find btn btn-primary' onClick={()=>handleFindALL()}>FindAll</button></div> */}

                <div className="parentSearchInput">
                    <div className="spacer"></div>
                    <input type="number" placeholder='search by ID' id='searchInput' value={inputId} onChange={(e) => setInputId(e.target.value)} />
                    <button className='btn btn-primary' id='searchDataID' onClick={fetchData}>Search</button>
                </div>



                <div className='table-responsive'>
                    <table className='table userTable'>
                        <thead>
                            <tr>
                                <th>FinYear ID</th>
                                <th>finYearStartDate</th>
                                <th>finYearEndDate</th>
                                <th>finYearName</th>
                                <th>remarks</th>
                                <th>entryDate</th>
                                <th>Action</th>


                            </tr>
                        </thead>
                        <tbody>
                            <FindAllFinYear allData={allData} setAllData={setAllData} handleFindALL={handleFindALL} />
                        </tbody>

                    </table>
                </div>
            </div>


            <ToastContainer />
        </>

    )
}

export default FinYearList;