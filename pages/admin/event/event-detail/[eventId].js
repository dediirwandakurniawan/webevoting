import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Card,
  CardHeader,
  Container,
  Row,
  Col,
  CardBody,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from "reactstrap";
import Admin from "layouts/Admin.js";
import Header from "components/Headers/Header.js";
import TableCalon from "../../../../components/Event/table-calon";
import Token from "../../../../components/Event/token";
import Dashboard from "../../../../components/Event/dashboard";
import axios from "axios";

const EventDetail = () => {
  // event id detail from event
  const router = useRouter();
  const eventId = router.query.eventId;
  const [namaEvent, setNamaEvent] = useState("");

  // tags
  const [tagsAktif, pilihTagsAktif] = useState("1");
  const toggleTab = (tab) => {
    if (tagsAktif !== tab) {
      pilihTagsAktif(tab);
    }
  };

  const getData = async () => {
    const { data: res } = await axios.get(
      `${process.env.NEXT_PUBLIC_URL}/event/list/option`
    );

    let namaEvent = res.find((item) => item.data.id === eventId);
    setNamaEvent(namaEvent.label);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row>
          <Col>
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <h3 className="mb-0">
                  {" "}
                  {namaEvent !== "" ? namaEvent : "Detail Event"}
                </h3>
              </CardHeader>
              <CardBody>
                <div>
                  <Nav tabs>
                    <NavItem>
                      <NavLink
                        style={{ cursor: "pointer" }}
                        className={tagsAktif === "1" ? "active" : ""}
                        onClick={() => toggleTab("1")}
                      >
                        CALON
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        style={{ cursor: "pointer" }}
                        className={tagsAktif === "2" ? "active" : ""}
                        onClick={() => toggleTab("2")}
                      >
                        TOKEN
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        style={{ cursor: "pointer" }}
                        className={tagsAktif === "3" ? "active" : ""}
                        onClick={() => toggleTab("3")}
                      >
                        HASIL VOTE
                      </NavLink>
                    </NavItem>
                  </Nav>
                  <TabContent activeTab={tagsAktif}>
                    <TabPane tabId="1">
                      <TableCalon />
                    </TabPane>
                    <TabPane tabId="2">
                      <Token />
                    </TabPane>
                    <TabPane tabId="3">
                      <Dashboard />
                    </TabPane>
                  </TabContent>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};
EventDetail.layout = Admin;

export default EventDetail;
