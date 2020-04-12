import React from 'react';
import { Menu, Container, Button } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import {  NavLink } from 'react-router-dom';

const NavBar: React.FC = () => {
  return (
    <Menu fixed='top' inverted>  
      <Container>
        {/* This is for HomePage Link */}
        <Menu.Item header as={NavLink} exact to='/'>
            <img src="/assets/logo.png" alt="logo" style={{marginRight: 10}}/>
            Reactivities
        </Menu.Item>
        {/* This is for List ActivitiesPage Link */}
        <Menu.Item name='Activities' as={NavLink} to='/activities'/>
        {/* This is for the Create ActivityPage Link */}
        <Menu.Item>
            <Button as={NavLink} to='/createActivity' positive content='Create Activity' />
        </Menu.Item>
      </Container>
    </Menu>
  );
};

export default observer(NavBar);
