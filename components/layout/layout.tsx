import { Fragment, ReactNode } from 'react';
import MainNavigation from './main-navigation';

type Props = {
  children: ReactNode | ReactNode[]
}


function Layout(props: Props) {
  return (
    <Fragment>
      <MainNavigation />
      <main>{props.children}</main>
    </Fragment>
  );
}

export default Layout;