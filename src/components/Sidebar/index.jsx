import React, { useEffect, Fragment } from 'react';
import routes from 'utils/reactRoutes';

import LinkSidebar from 'components/Linksidebar';

import { useLocation, useHistory } from "react-router-dom";

export default function Sidebar ({ ...rest }) {

  const location = useLocation();
  const history = useHistory();

  useEffect(() => {

    const currentPath = location.pathname;
    
    if(currentPath === "/") history.push("/home")

  }, [location, history])

  return (
    <div className="grid-item-sidebar">
      <ul>
        {routes.map((route) =>
          <Fragment key={route.key}>
            {!route.hide && (
              <LinkSidebar
                item={route.key}
                name={route.name}
                path={route.path}
              />
            )}
          </Fragment>
        )}
      </ul>
    </div>
  )
}