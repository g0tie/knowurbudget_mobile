import * as Layout from '../layout';
import AddExpenseBtn from '../components/AddExpenseBtn';
import React, { useEffect } from 'react';
import { useMainContext } from '../store/contexts';
import { getCurrentUser, persistData } from '../store/database';
import { syncData } from '../api';
import { getDefaultUserData } from '../helpers/common';
import { useNavigate } from 'react-router-dom';
import { Tabs } from 'rmc-tabs';
import 'rmc-tabs/assets/index.css';

const Dashboard  = () => {
  const { state, dispatch } = useMainContext();
  const navigate = useNavigate();

  useEffect( () => {
    
    async function fetchDataAndInitContext() {
      const isUserLogged = JSON.parse( window.localStorage.getItem("logged")) ?? false;
      const lastLog =  Math.abs( new Date( window.localStorage.getItem("lastlog")).getDate() - new Date().getDate() );
    
      if (isUserLogged) {
        let data = await syncData(getCurrentUser(), state.csrf);
        await dispatch({type: "setCSRF", payload: data.data.csrf}); 

        if (data.status === 403) {

          if (lastLog > 7) {
            navigate('/login');
            return;
            
          } else {
            const newState = await getDefaultUserData(state);
            await console.log(newState)
            await dispatch({type:"initContext", payload: newState});
            return;
          }
        }
        
        await dispatch({type: "setUserData", payload: data.data});
        await persistData(state, getCurrentUser());
    
      } else {
        const newState = await getDefaultUserData(state);
        await dispatch({type:"initContext", payload: newState});

      }
    }

    fetchDataAndInitContext();
  } , []);

  const baseStyle = {
    display: 'flex', flexDirection: 'column', fontSize:"13px", height:"800px"
  } 
  return (
    <div className="App md:p-8 xs:pt-4 bg-slate-50">
    <Layout.Header />

    {/* <div className='xs:flex-wrap xs:flex-col lg:flex-wrap xl:flex-nowrap flex xl:flex-row justify-evenly md:items-center xs:overflow-hidden'> */}
    <div style={{...baseStyle}}>
      <Tabs tabs={[
          { title: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
          <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
        </svg>
        
         },
          { title: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path fillRule="evenodd" d="M2.25 13.5a8.25 8.25 0 018.25-8.25.75.75 0 01.75.75v6.75H18a.75.75 0 01.75.75 8.25 8.25 0 01-16.5 0z" clipRule="evenodd" />
          <path fillRule="evenodd" d="M12.75 3a.75.75 0 01.75-.75 8.25 8.25 0 018.25 8.25.75.75 0 01-.75.75h-7.5a.75.75 0 01-.75-.75V3z" clipRule="evenodd" />
        </svg>
         },
        ]} initialPage={1} tabBarPosition="bottom" prerenderingSiblingsNumber={1}
        >
          {[
            <div key={1}>
              <Layout.History />
            </div>
            ,
            <div key={2} >
              <Layout.Graphics />
            </div>
          ]}
      </Tabs>
    </div>

        <AddExpenseBtn />
    </div>
  );
}


export default Dashboard;
