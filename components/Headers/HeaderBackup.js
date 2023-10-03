import React from "react";
import {
  Navbar,
  Container,
  Nav,
  UncontrolledDropdown,
  DropdownToggle,
  Media,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

const HeaderBackup = () => {
  return (
    <Navbar
      className="navbar-top navbar-dark bg-dark"
      expand="md"
      id="navbar-main"
    >
      <Container fluid>
        <Nav className="align-items-center d-none d-md-flex ml-auto" navbar>
          <UncontrolledDropdown nav inNavbar>
            <DropdownToggle className="pr-0" nav>
              <Media className="align-items-center">
                <span className="avatar avatar-sm rounded-circle bg-primary">
                  <img alt="..." src={require("assets/img/theme/147142.png")} />
                </span>
                <Media className="ml-2 d-none d-lg-block">
                  <span className="mb-0 text-sm font-weight-bold text-white">
                    User
                  </span>
                </Media>
              </Media>
            </DropdownToggle>
            <DropdownMenu className="dropdown-menu-arrow" right>
              <DropdownItem className="noti-title" header tag="div">
                <h6 className="text-overflow m-0">User</h6>
              </DropdownItem>
              <DropdownItem divider />
              <DropdownItem href="/auth/login">
                <i className="ni ni-user-run" />
                <span>Logout</span>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default HeaderBackup;
