import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleRight } from "@fortawesome/free-solid-svg-icons";

// reactstrap components
import { Button, Container, Row, Col } from "reactstrap";

function Header() {
  return (
    <>
      <div className="header pb-8 pt-5 pt-lg-8 d-flex align-items-center">
        <span className="mask bg-gradient-default opacity-8" />
        <Container className="d-flex align-items-center" fluid>
            {/* <div lg="5" md="10" className="ml-auto">
              <Button
                color="info"
                href="/auth/login"
              >
              <FontAwesomeIcon icon={faArrowCircleRight} />  Keluar
              </Button>
            </div> */}
        </Container>
      </div>
    </>
  );
}


export default Header;
