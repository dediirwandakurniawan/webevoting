import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleRight } from "@fortawesome/free-solid-svg-icons";
import Cookies from "universal-cookie";

// reactstrap components
import { Button, Container, Row, Col } from "reactstrap";
import { useRouter } from "next/router";

function Header() {
  const cookies = new Cookies();
  const router = useRouter();

  let handleLogout = () => {
    cookies.remove("token");
    cookies.remove("roles");
    router.push("/auth/login");
  };
  return (
    <>
      <div className="header pb-4 pt-5 pt-lg-4 d-flex align-items-center">
        <span className="mask bg-gradient-default opacity-8" />
        <Container className="d-flex align-items-center" fluid>
          <div lg="5" md="10" className="ml-auto">
            <Button color="info" onClick={handleLogout}>
              <FontAwesomeIcon icon={faArrowCircleRight} /> Keluar
            </Button>
          </div>
        </Container>
      </div>
    </>
  );
}

export default Header;
