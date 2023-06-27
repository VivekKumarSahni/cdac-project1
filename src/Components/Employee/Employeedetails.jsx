import React, { useState, useEffect } from 'react'
import '../../style/chargeList.css'
import axios from '../axios.jsx'

import { ToastContainer, toast } from 'react-toastify'
import { privateAxios } from '../../service/helperUtil'
import Pagination from '../Pagination'
import { useNavigate } from 'react-router-dom'
import Mymodal from '../ShowModal.jsx';
import '../../style/modal.css'


import '../../style/UserData.css'
import { MDBContainer, MDBCol, MDBRow, MDBBtn, MDBIcon, MDBInput, MDBCheckbox } from 'mdb-react-ui-kit';
import FindAllEmployees from './FindAllEmployees'

function Employeedetails() {
      const navigate = useNavigate();
      const [allData, setAllData] = useState([]);
      const [isError, setisError] = useState('');
      const [inputId, setInputId] = useState('');
      const [showAllData, setShowAllData] = useState(true);
     
      const [pageSize, setPageSize]=useState(5);
      const [pageNumber, setPageNumber]=useState(1);
      const [datafetching, setDataFetching]=useState(false);
      const [totalElements, setTotalElements]=useState();
      const [totalPages, setTotalPages]=useState();
      const [lastIndex, setLastIndex]=useState();
      const [firstIndex,setFirstIndex]=useState();
      const [slicedAllData,setSlicedAllData]=useState([]);
      const [isAllData, setIsAllData]=useState(false);
       const [isReady , setIsready] =useState(false)
      // useEffect(() => {
      //     handleFindALL();
      // },[])
      const [ShowModal, setShowModal] = useState(false);
      const [isSubmitting, setIsSubmitting]=useState(false);
  
      // let lastIndex = pageNumber*pageSize;
      // let firstIndex = lastIndex - pageSize;
      // let slicedAllData=allData.slice(firstIndex, lastIndex);
      const [user, setUser] = useState({
          chargeName: '',
          chargeType: '',
          chargeRate: '',
          entryDate: '',
          chargeAmount: '',
          chargeApplyOnBaseAmount: '',
          roundingType: '',
          hoaPostingRequired: false,
          depositToGovt: false,
        }, []);
      
        const [users, setUsers] = useState([]);
        const closeModal = () => {
          return setShowModal(false);
        }
      
      
        const handleInputChange = (event) => {
          const { name, value, type, checked } = event.target;
          const inputValue = type === 'checkbox' ? checked : value;
          setUser((prevUser) => ({ ...prevUser, [name]: inputValue }));
        };
        const handleSubmit = async (event) => {
  
          event.preventDefault();
          setIsSubmitting(true);
      
          console.log(user);
      
      
          try {
            const res = await  privateAxios.post("/charge/save", user)
            .then( (Response)=>console.log(Response))
            .catch( (err) => console.log(err))
      
            toast.success('Submit Successfully')
            setUsers([...users, user]);
            console.log(res);
      
          } catch (error) {
            toast.error("Form not Submitted !! , please try again")
            console.log(error);
          }
      
          setIsSubmitting(false);
          closeModal();
      
        };
      
  
      useEffect(()=>{
          if(isReady){
          setDataFetching(true);        
          const res =  privateAxios.get(`/charge/getUserList?pageNumber=${pageNumber-1}&pageSize=${pageSize}`)
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
  
  
  
  
      // pagination work
      if(pageSize<1){
          setPageSize(5);
      }
  
     
      // axios.interceptors.request.use(
      //     (config) => {
      //       const token = localStorage.getItem('token');
      //       if (token) {
      //         config.headers['Authorization'] = `Bearer ${token}`;
      //       }
      //       return config;
      //     },
      //     (error) => {
      //       return Promise.reject(error);
      //     }
      //   );
  
  
      const handleFindALL = async () => {
          alert("handleFindAll called")
          setDataFetching(true);
  
          try {
  
              const res = await privateAxios.get(`/charge/getUserList?pageNumber=${pageNumber-1}&pageSize=${pageSize}`)
              // .then((res)=>console.log(res)).catch((err)=>console.log(err));
              if(res){
                  console.log(res);
                  setAllData(res.data.pageList.content);
                  setTotalPages(res.data.pageList.totalPages);
                  setTotalElements(res.data.pageList.totalElements);
                  setLastIndex( (pageNumber)*pageSize);
                  
                      setFirstIndex(lastIndex - pageSize);
                  
              // setFirstIndex(((pageNumber-1)*pageSize)+1);
              // setLastIndex(Math.min(firstIndex + pageSize-1, res.data.pageList.totalElements))
              setSlicedAllData(res.data.pageList.content.slice(firstIndex, lastIndex));
              }
  
  
              
          } catch (error) {
              setisError(error.message);
              console.log(error.message);
              showErrorToast();
          }
  
          setDataFetching(false);
      }
  
   
  
  
  
  
      const showErrorToast = () => {
          toast.error("Something went wrong, check your connection !!")
      }
      const showErrorNotFoundToast = () => {
          toast.error("Not Found!!")
      }
  
  
      // for search by ID
      const fetchData = async () => {
  
          try {
              const res = await privateAxios.get(`/charge/find/${inputId}`)
              setAllData([res.data.pageList.content]);
              console.log([res.data.pageList.content]);
          } catch (error) {
              setisError(error.message);
              console.log(error.message);
              showErrorNotFoundToast();
          }
  
      }
  
      useEffect(()=>{
          console.log(firstIndex + " --first");
          console.log(lastIndex+ " --lastIndex");
          console.log(slicedAllData +" sliced data");
      })
      
  

    return (

        <>

            <h2 id='chargeHeadID'>Employee List</h2>

            {datafetching ? (<div class="d-flex justify-content-center">
                            <div class="spinner-border" role="status">
                                <span class="sr-only">Loading...</span>
                            </div>
                             </div>):""
            }


            <div className='find-container'>
                {/* <div className='findButtonClass'><button className='btn-find btn btn-primary' onClick={()=>handleFindALL()}>FindAll</button></div> */}
                <div className="parentSearchInput">
                    <div> <button className='btn btn-primary' id='searchDataID' onClick={() => navigate('/register') }>Add Employee</button>
      </div>
                     {/* <input type="number" className='userPerPageClass' id='Pagi_input_id' name='userPerPage' value={pageSize} onChange={(e) => { setPageSize(e.target.value) }} /> */}
                    <div className="spacer"></div>
                    <input type="number" placeholder='search by ID' id='searchInput' value={inputId} onChange={(e) => setInputId(e.target.value)} />
                    <button className='btn btn-primary' id='searchDataID' onClick={fetchData}>Search</button>
                </div>



                <div className='table-responsive'>
                    <table className='table userTable'>
                        <thead>
                            <tr>
                                
                                <th>Employee ID</th>
                                <th>Employee UserName</th>
                                <th>Email</th>
                                <th>Mobile No</th>
                                <th>Actions</th>
                               
                            </tr>
                        </thead>
                        <tbody>
                        <FindAllEmployees allData={allData} setAllData={setAllData} handleFindALL={handleFindALL} />
                        </tbody>

                    </table>

                </div>
                      { isAllData && <Pagination totalUsers={allData.length} pageSize={pageSize} setPageSize={setPageSize} setPageNumber={setPageNumber} pageNumber={pageNumber} lastIndex={lastIndex} firstIndex={firstIndex} totalPages={totalPages} totalElements={totalElements} />}
            </div>


            <ToastContainer />
        </>

    )
}

export default Employeedetails