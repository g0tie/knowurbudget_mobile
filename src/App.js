import {MainProvider, useMainContext, MainContext} from "./store/contexts"
import * as Layout from "./layout";
import Dashboard from "./layout/Dashboard";
import { useLocation, Navigate } from "react-router-dom";

import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";


function App() {
  return (
    <MainProvider>
      <div className="flex flex-row justify-center items-center text-xl mt-2">
        <img className="w-8" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAAFOUlEQVRoge2ZXWwUVRTHf2ems7tdWlOh0O8QQ0IhRSgpKCkqpYlGFK3QFBPRxBhTqYUYY/TFaJpo1MQHhQDyEXxQMSoIRSPGEAGDUSmg8GAU4oOUttsKQYQK+9Hd40MpKTuzM7vdxcTY39uee869///MvTtz78A44/z3OfzUwJxvnzhbPpZayYWAFlVzqJfbEgaLBeqAGUAZUNC57meAQaAP5SToMdTcT3BmFx2SADjc2n8QWKAi2xJD0Zfqt1Wd/1cMNPVqlWHQjvKoQoVTzlUDTvQgfPDKpYJ9d0fzvwYdiZ9DWbNga+lH6WgYk4GWkE6OKa8CjwM+t1wXAwA8/3dhvDkSMEcZABSBd0xKn5m3RWJu9Ua6okdo6tNHYsqvQCse4r3IV+HeqN90alNoG6J/93fPnsl36yNtA62q1rI+3SqwHZiYoVZHlkQDTFDXSXC/XDZ3HujQvFQJaRl4oE+Df4TYo/BkpiLdaA4H0km7zx/qeztVo6eBVlXLhJ3Akgy0eTJ3yGJaPOWFvQ5B2r9fFVrh1OZp4GyIjeRYPMDysOvUtqO64VDb6ZuTw64GlvXpylxPG4CJCYPFUX+mZcVWwnw5OZjSwLIenaSQcu5lw0ORfCz3xeuIIm1HW38vGx1LaUANXgOKM5fnjoHQlN7idcIfNfIevL4/B5b3aCXDD6mcc2fUojTh+NefkkFR/jL0QwOtrd9UuXl0m+PfgJqsRrN7SKWiORxMKy8BHLNi7PVH2O+LEhHt5vVZJ5LzbHegQ9VQZWX2Uu1UJkzmx9yvyzkjwfuBK7QUXWBN4UW+9EWIoKDyGC2f2G6d7Q6c6OV2DCpzqPsazeGg45xNoByzYnT6r3DQFyN+3XvRCFrBLTV1QNfoqM3A1VfinONHWJq0eLvNOJ/7w3zhC3PeSHh3IjTiZcCAeU7+s+WeSICb1CAqyiErQmfgMkesmOO1To3WJUecFvH0sYp0oyZm8eaES3zlC3MpnavthEh1cshmQId3UjnnjYKLOehFbdqc1lRBDka6URQmB9J7HcyCmQtLDl7ov9KQq/5CSb+d7sBgrgYDqK4rbiiaEvgmR93Z5qHNgNhNZk31/Ml3FRT5D2Xbj0B/cszpDpzKdiCnsWsWTrkjWGRla+KX5IDNQAKOZjlIKmRWfWl9IGj9MOYeVH9MDtkMmAb7xzyAByKYty4qqbPy87q8sx1Q3ZccshmYXUIXcGZMA6SBYYg1t6G01vKbP2VY2t0Xmnrc1l9yoEMkocNHJzcMMcRXu7is2vIZNkGpi3hv5ChyNI4bGjPBBiA6doneGKYE5zSUTcvLE/eju2HCZkw2OfbjFNxVKT0K72alMA1MyyisbSyvMEw56Z4pW3raqnqdWlLuiX1xXgTOZaUwDUzLKKptLC82TPktRcqAFUt0pKpPaWBHlZwXZU3WCtPA8hmTahvKCsWQ07ZGlfbup6f+marW9Vxod4V8JLDZLSdXWAGzZM6isjwR6bkWVN4KtVZ96lbneTKXV0Y70Jm9RG/8QbNi9qKSODCgwmehvqoXvGo8DewQicdhJbA3FyK9CEywptbUl+wtuBxZQYcMeeWnvf1tVbUGQqwTWJWdRE/WWmU8t0Mknk5yxvv3pl59WIT15P7U7izQ2lkuGU3XjL/Q7KmQjyXBDJSNQCTT+mQUwsBaIkzPVDxk+ZFv6RmtME1Wy/Aaqcqw/LTAdrFYv2uyjHkPkpMjoA5V43g/80RpBOoUqhn+ajmyvx4UoQfllCpHDIMDu0o5isiNOMEZZ5z/Ff8AEJh98NfTMEkAAAAASUVORK5CYII="/>
        <span className="font-bold">KnowUrBudget</span>
      </div>
      <Router>
        <Routes>
              <Route path="/" element={
                  <Dashboard />
              } />
              
              <Route path="/login" element={
                <RequireLogout>
                  <Layout.Login/>
                </RequireLogout>
              }/>
              <Route path="/register" element={
                <RequireLogout>
                  <Layout.Register />
                </RequireLogout>
              }/>
              <Route path="*" element={ <Layout.NotFound />} />
        </Routes>
      </Router>
    </MainProvider>
  );
}

function RequireLogout({children}) {
  let {state} = useMainContext();
  let location = useLocation();

  if (state.logged) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}


function RequireAuth({ children }) {
  let {state} = useMainContext();
  let location = useLocation();

  if (!state.logged) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default App;
