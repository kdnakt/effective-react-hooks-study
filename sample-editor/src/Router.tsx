import React from 'react';
import { History } from 'history';
import uuidv4 from 'uuidv4';

import Edit from './pages/Edit';
import Index from './pages/Index';

const RouterContext = React.createContext<History | null>(null);

type RouterProps = { history: History };

export const Router: React.FC<RouterProps> = ({ history }) => {
  const [pathname, setPathname] = React.useState(history!.location.pathname);
  React.useEffect(() => {
    const unlisten = history!.listen(location => {
      setPathname(location.pathname);
    });
    return unlisten;
  }, [history]);

  const content = React.useMemo(() => {
    if (pathname === '/') {
      return <Index />
    } else if (uuidv4.is(pathname.slice(1))) {
      return <Edit textId={pathname.slice(1)} />;
    } else {
      return <div>404 not found</div>;
    }
  }, [pathname]);

  return (
    <RouterContext.Provider value={history}>
      {content}
    </RouterContext.Provider>
  );
};

type LinkProps = { href: string, as?: string };

export const Link: React.FC<LinkProps> = ({ href, as = 'a', children}) => {
  const history = React.useContext(RouterContext);
  const onClick = React.useCallback(
    (ev: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      ev.preventDefault();
      history!.push(href);
    }, [history, href]
  );
  return React.createElement(as, { onClick, href }, children);
};