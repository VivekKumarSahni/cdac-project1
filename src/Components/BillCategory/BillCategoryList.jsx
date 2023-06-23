import React, {useState, useEffect}from 'react'
import '../../style/chargeList.css'
import axios from '../axios.jsx'
import FindAllData from '../AccountCharge/FindAllData.jsx'
import {ToastContainer, toast} from 'react-toastify'
import FindAllBillCategory from './FindAllBillCategory'
import Pagination from '../Pagination'
import { privateAxios } from '../../service/helperUtil'


function BillCategoryList() {

    const [allData, setAllData]=useState([]);
    const [isError, setisError]=useState('');
    const [inputId, setInputId] = useState('');
    // const [currentPage, setCurrentPage]=useState(1);
    // const [userPerPage, setUserPerPage] = useState(3);
    const [showAllData,setShowAllData]=useState(true);


    const [pageSize, setPageSize]=useState(5);
    const [pageNumber, setPageNumber]=useState(1);
    const [datafetching, setDataFetching]=useState(false);
    const [totalElements, setTotalElements]=useState();
    const [totalPages, setTotalPages]=useState();
    const [lastIndex, setLastIndex]=useState();
    const [firstIndex,setFirstIndex]=useState();
    const [slicedAllData,setSlicedAllData]=useState([]);
    const [isAllData, setIsAllData]=useState(false);
    const [isReady , setIsready] =useState(false);
    

    // useEffect(()=>{
    //     handleFindALL();
    // },[])
   
 
     // pagination work
     if(pageSize<1){
        setPageSize(5);
    }

    useEffect(()=>{
        if(isReady){
        setDataFetching(true);        
        const res =  privateAxios.get(`/billCategory/findAll?pageNumber=${pageNumber-1}&pageSize=${pageSize}`)
        .then((res)=>{
             //alert("inside then")
            console.log(res);
            const {pageNumber} = res.data.pageList;
            
            
           
            if(pageNumber!==''){
            setIsAllData(true);
            setAllData(res.data.pageList.content);
            setTotalPages(res.data.pageList.totalPages);
            setTotalElements(res.data.pageList.totalElements);
             if(pageSize>res.data.pageList.content?.length){
                setLastIndex(Math.max(((pageNumber+1)*res.data.pageList.content?.length), res.data.pageList.totalElements))
             }
             else{
                 setLastIndex( (pageNumber+1)*pageSize);
             }
            // if(lastIndex){
            setFirstIndex(((pageNumber+1)*pageSize) - pageSize);
            // }
            // setFirstIndex(((pageNumber-1)*pageSize)+1);
            // setLastIndex(Math.min(firstIndex + pageSize-1, res.data.pageList.totalElements))
            // setSlicedAllData(res.data.pageList.content.slice(firstIndex, lastIndex));
            }
        }).catch((err)=>console.log(err))

    
       setDataFetching(false);
    }else{
        setIsready(true)
    }

    },[isReady ,pageNumber ,pageSize])



    const handleFindALL=async()=>{
        const res =  privateAxios.get(`/billCategory/findAll?pageNumber=${pageNumber-1}&pageSize=${pageSize}`)
        .then((res)=>{
             //alert("inside then")
            console.log(res);
            const {pageNumber} = res.data.pageList;
            
            
           
            if(pageNumber!==''){
            setIsAllData(true);
            setAllData(res.data.pageList.content);
            setTotalPages(res.data.pageList.totalPages);
            setTotalElements(res.data.pageList.totalElements);
             if(pageSize>res.data.pageList.content?.length){
                setLastIndex(Math.max(((pageNumber+1)*res.data.pageList.content?.length), res.data.pageList.totalElements))
             }
             else{
                 setLastIndex( (pageNumber+1)*pageSize);
             }
            // if(lastIndex){
            setFirstIndex(((pageNumber+1)*pageSize) - pageSize);
            // }
            // setFirstIndex(((pageNumber-1)*pageSize)+1);
            // setLastIndex(Math.min(firstIndex + pageSize-1, res.data.pageList.totalElements))
            // setSlicedAllData(res.data.pageList.content.slice(firstIndex, lastIndex));
            }
        }).catch((err)=>console.log(err))

    
       setDataFetching(false);
    }


    const showErrorToast=()=>{
        toast.error("Something went wrong, check your connection !!")
    }
    const showErrorNotFoundToast=()=>{
        toast.error("Not Found!!")
    }




    const fetchData=async()=>{
        
        try{
            const res = await privateAxios.get(`/billCategory/find/${inputId}`)
            setAllData([res.data.pageList.content]);
            console.log([res]);
        }catch(error){
            setisError(error.message);
            console.log(error.message);
            showErrorNotFoundToast();
        } 
    
    }


    // const findDataById = () => {
    //     return allData.find((item) => item.id === inputId);
    //   };


    
    // const lastIndex = currentPage*userPerPage;
    // const firstIndex = lastIndex - userPerPage;
    // const slicedAllData=allData.slice(firstIndex, lastIndex);



  return (

    <>
    
            <h2 id='chargeHeadID'>Bill Category List</h2>


           <div className='find-container'>
           
            {/* <div className='findButtonClass'><button className='btn-find btn btn-primary' onClick={()=>handleFindALL()}>FindAll</button></div> */}
            {/* <div className='ParentPagination'>
                  <input type="number" className='userPerPageClass' name='userPerPage' value={userPerPage} onChange={(e)=>{setUserPerPage(e.target.value)}} />
          </div> */}
            <div className="parentSearchInput">
                {/* <input type="number" className='userPerPageClass' id='Pagi_input_id' name='userPerPage' value={pageSize} onChange={(e)=>{setPageSize(e.target.value)}} /> */}
                <div className="spacer"></div>
                <input type="number" placeholder='search by ID' id='searchInput' value={inputId} onChange={(e) => setInputId(e.target.value)} /> 
                <button className='btn btn-primary' id='searchDataID' onClick={fetchData}>Search</button>   
            </div>



            <div className='table-responsive'>
                <table className='table userTable'>
                    <thead>
                        <tr>
                            <th>BillCategotyID</th> 
                            <th>billCategoryName</th>
                            <th>Action</th>
                           
                        </tr>
                    </thead>
                    <tbody>
                    <FindAllBillCategory allData={allData} setAllData={setAllData} handleFindALL={handleFindALL}/>
                    </tbody>
                  
                </table> 
                { isAllData && <Pagination totalUsers={allData.length} pageSize={pageSize} setPageSize={setPageSize} setPageNumber={setPageNumber} pageNumber={pageNumber} lastIndex={lastIndex} firstIndex={firstIndex} totalPages={totalPages} totalElements={totalElements} />}
        </div>
        </div>
   

    <ToastContainer/>
    </>

  )
}

export default BillCategoryList;