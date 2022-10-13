import ProgressBar from "../components/ProgressBar";
import ProfileIcon from "../components/ProfileIcon";
import {useMainContext} from "../store/contexts"
import React from "react";

const Header = () => {
    const {state} = useMainContext()
    return (
      <div className="m-5 flex flex-row justify-center  xs:justify-between xs:mb-0 xs:mb-2">
        <ProgressBar />
        <ProfileIcon username={state.user.name}/>
      </div>
    );
  }
  
  export default Header;
  