import React, { useEffect, useState } from "react";
import "./style.css";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  CardGroup,
  CardSubtitle,
  Form,
  Input,
  Container,
  Row,
  Col,
  Badge,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  CardTitle,
  CardText,
  CardFooter,
  CardImg,
} from "reactstrap";
// layout for this page
import Admin from "layouts/Admin.js";
// core components
import HeaderUser from "components/Headers/HeaderUser.js";
import DataTable from "react-data-table-component";
import axios from "axios";
import Cookies from "universal-cookie";
import Swal from "sweetalert2";
import Select from "react-select";
import PlaceholderImage from "../../assets/img/icons/placeholder.png";

const User = () => {
  const cookies = new Cookies();

  const [modal, setModal] = useState(false);
  const [idEvent, setIdEvent] = useState("");
  const [token, setToken] = useState("");
  const [dataEvent, setDataEvent] = useState(null);
  const [eventOption, setEventOption] = useState([]);
  const [idEventActive, setIdEventActive] = useState(false);
  const [tokenActive, setTokenActive] = useState(false);

  const [dataKandidat, setDataKandidat] = useState([]);
  const [kandidatDipilih, setKandidatDipilih] = useState([]);

  let handleSubmitEvent = () => {
    setIdEventActive(true);
  };

  let handleSubmitToken = async () => {
    const data = {
      token: token,
    };
    await axios
      .post(
        `${process.env.NEXT_PUBLIC_URL}/token/check-token/${idEvent}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${cookies.get("token")}`,
          },
        }
      )
      .then((res) => {
        setTokenActive(true);
        setDataKandidat(res.data.data.content);
      })
      .catch((e) => {
        console.log(e);
        if (e.response.data.message) {
          Swal.fire({
            icon: "error",
            title: "Terjadi Kesalahan!",
            text: e.response.data.message,
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Terjadi Kesalahan!",
            text: e,
          });
        }
      });
  };

  let handleVote = async () => {
    const data = {
      token,
      candidate_id: kandidatDipilih,
    };

    await axios
      .post(`${process.env.NEXT_PUBLIC_URL}/vote/${idEvent}`, data, {
        headers: {
          Authorization: `Bearer ${cookies.get("token")}`,
        },
      })
      .then((res) => {
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Vote Berhasil",
          timer: 2000,
        });
        setTokenActive(false);
        setKandidatDipilih([]);
        setToken("");
      })
      .catch((e) => {
        console.log(e);
        if (e?.response?.data?.message) {
          Swal.fire({
            icon: "error",
            title: "Terjadi Kesalahan!",
            text: e.response.data.message,
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Terjadi Kesalahan!",
            text: e,
          });
        }
      });
  };

  let hanldePilihKandidat = (id) => {
    if (!kandidatDipilih.includes(id)) {
      setKandidatDipilih([...kandidatDipilih, id]);
    } else {
      let newKandidat = kandidatDipilih.filter((item) => item !== id);
      setKandidatDipilih(newKandidat);
    }
  };

  let handleChangeEvent = (e) => {
    let data = e.data;
    console.log(data, "ini data");
    setIdEvent(data.id);
    setDataEvent(data);
  };

  let getOptionEvent = async () => {
    const { data: res } = await axios.get(
      `${process.env.NEXT_PUBLIC_URL}/event/list/option`
    );
    setEventOption(res);
  };

  useEffect(() => {
    getOptionEvent();
  }, []);
  return (
    <>
      <HeaderUser />

      <Container className="mt-1" fluid>
        <Row>
          <Col>
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <h3 className="mb-0">
                  {dataEvent !== null ? dataEvent?.event_name : "Event"}
                </h3>
              </CardHeader>
              <CardBody>
                {idEventActive === false ? (
                  <Form>
                    <Row className="row-cols-lg-auto g-3 align-items-end">
                      <Col>
                        <Label
                          className="visually-hidden"
                          for="examplePassword"
                        >
                          Pilih Event
                        </Label>
                        {/* <Input id="exampleSelect" name="select" type="select" onChange={(e) => setIdEvent(e.target.value)}>
                          {eventOption && eventOption.map((item) => <option value={item.data.id}>{item.label}</option>)}
                        </Input> */}

                        <Select
                          options={eventOption}
                          onChange={(e) => handleChangeEvent(e)}
                        />
                      </Col>

                      <Col className="align-items-center">
                        <Label
                          className="visually-hidden"
                          for="examplePassword"
                        ></Label>
                        <Button
                          color="primary"
                          onClick={() => handleSubmitEvent()}
                        >
                          Submit
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                ) : null}

                {idEventActive ? (
                  <Form>
                    <Row className="row-cols-lg-auto g-3 align-items-end">
                      <Col>
                        <Label
                          className="visually-hidden"
                          for="examplePassword"
                        >
                          Token
                        </Label>
                        <Input
                          id="token"
                          disabled={tokenActive}
                          name="token"
                          value={token}
                          placeholder="masukkan token"
                          onChange={(e) => setToken(e.target.value)}
                        />
                      </Col>

                      <Col className="align-items-center">
                        <Label
                          className="visually-hidden"
                          for="examplePassword"
                        >
                          {" "}
                        </Label>
                        <Button
                          color={tokenActive ? "secondary" : "primary"}
                          onClick={() => handleSubmitToken()}
                          disabled={tokenActive}
                        >
                          Submit
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                ) : null}

                {tokenActive ? (
                  <>
                    <div className="row justify-content-center mt-3">
                      <h2>
                        Jumlah Vote : {kandidatDipilih.length}/
                        {dataEvent?.quota}
                      </h2>
                    </div>
                    {kandidatDipilih.length === dataEvent?.quota ? (
                      <Button
                        className=" mb-1"
                        onClick={() => handleVote()}
                        color="success"
                        style={{ width: "100%" }}
                      >
                        Pilih
                      </Button>
                    ) : null}

                    <div class="row justify-content-center align-items-center">
                      <CardGroup>
                        {dataKandidat.map((item) => {
                          return (
                            // <div className="col-sm-12 col-md-2">
                            //   <button
                            //     style={{ border: "none" }}
                            //     disabled={
                            //       kandidatDipilih.length === dataEvent?.quota &&
                            //       !kandidatDipilih.includes(item.id)
                            //     }
                            //     onClick={() => hanldePilihKandidat(item.id)}
                            //   >
                            //     <Card className="" color="primary" outline>
                            //       <CardHeader>
                            //         <div className="row">
                            //           <div className="col-sm-12">
                            //             <h5 className="text-center">
                            //               {item.candidate_name}
                            //             </h5>
                            //           </div>
                            //           <div className="col-sm-12 justify-content-center text-center">
                            //             {kandidatDipilih.includes(item.id) ? (
                            //               <div
                            //                 style={{
                            //                   backgroundColor: "#5cb85c",
                            //                   borderRadius: "100%",
                            //                   height: "25px",
                            //                   width: "25px",
                            //                 }}
                            //                 className=" d-flex align-items-center justify-content-center"
                            //               >
                            //                 <i
                            //                   class="fa fa-check"
                            //                   style={{ color: "white" }}
                            //                   aria-hidden="true"
                            //                 ></i>
                            //               </div>
                            //             ) : null}
                            //           </div>
                            //         </div>
                            //       </CardHeader>
                            //       {dataEvent?.show_photo === 1 ? (
                            //         <CardImg
                            //           alt="Card image cap"
                            //           src={
                            //             item.photo_url !== null
                            //               ? item.photo_url
                            //               : PlaceholderImage
                            //           }
                            //           className={
                            //             kandidatDipilih.includes(item.id)
                            //               ? "image-dipilih"
                            //               : ""
                            //           }
                            //           top
                            //           width="150px"
                            //           height="200px"
                            //           style={{ objectFit: "cover" }}
                            //         />
                            //       ) : (
                            //         ""
                            //       )}
                            //       <CardBody>
                            //         {/* <CardTitle tag="h5"></CardTitle>
                            //       <CardText></CardText> */}
                            //         <div className="d-flex justify-content-between">
                            //           <Button
                            //             size="sm"
                            //             onClick={() =>
                            //               hanldePilihKandidat(item.id)
                            //             }
                            //             color={
                            //               kandidatDipilih.includes(item.id)
                            //                 ? "danger"
                            //                 : kandidatDipilih.length ===
                            //                   dataEvent?.quota
                            //                 ? "secondary"
                            //                 : "primary"
                            //             }
                            //             disabled={
                            //               kandidatDipilih.length ===
                            //                 dataEvent?.quota &&
                            //               !kandidatDipilih.includes(item.id)
                            //             }
                            //             style={{ width: "100%" }}
                            //           >
                            //             {kandidatDipilih.includes(item.id)
                            //               ? "Batal"
                            //               : "Pilih"}
                            //           </Button>
                            //         </div>
                            //       </CardBody>
                            //     </Card>
                            //   </button>
                            // </div>
                            <button
                              style={{ border: "none" }}
                              disabled={
                                kandidatDipilih.length === dataEvent?.quota &&
                                !kandidatDipilih.includes(item.id)
                              }
                              onClick={() => hanldePilihKandidat(item.id)}
                            >
                              <Card
                                style={{ width: "11rem" }}
                                className={
                                  kandidatDipilih.length === dataEvent?.quota &&
                                  !kandidatDipilih.includes(item.id)
                                    ? "card-blur"
                                    : ""
                                }
                                color="dark"
                                outline
                              >
                                <CardTitle tag="h4">
                                  {item.candidate_name}
                                </CardTitle>

                                {dataEvent?.show_photo === 1 ? (
                                  <CardImg
                                    alt="Card image cap"
                                    src={
                                      item.photo_url !== null
                                        ? item.photo_url
                                        : PlaceholderImage
                                    }
                                    className={
                                      kandidatDipilih.includes(item.id)
                                        ? "image-dipilih"
                                        : ""
                                    }
                                    top
                                    width="200px"
                                    height="200px"
                                    style={{ objectFit: "cover" }}
                                  />
                                ) : null}
                                <CardBody>
                                  <CardSubtitle
                                    className="mb-2 text-muted"
                                    tag="h6"
                                  ></CardSubtitle>
                                  <CardText>
                                    <div className="col-sm-12 justify-content-center text-center">
                                      {kandidatDipilih.includes(item.id) ? (
                                        <div
                                          style={{
                                            backgroundColor: "#5cb85c",
                                            borderRadius: "100%",
                                            height: "25px",
                                            width: "25px",
                                          }}
                                          className=" d-flex align-items-center justify-content-center"
                                        >
                                          <i
                                            class="fa fa-check"
                                            style={{ color: "white" }}
                                            aria-hidden="true"
                                          ></i>
                                        </div>
                                      ) : null}
                                    </div>
                                  </CardText>
                                  <Button
                                    size="sm"
                                    onClick={() => hanldePilihKandidat(item.id)}
                                    color={
                                      kandidatDipilih.includes(item.id)
                                        ? "danger"
                                        : kandidatDipilih.length ===
                                          dataEvent?.quota
                                        ? "secondary"
                                        : "primary"
                                    }
                                    disabled={
                                      kandidatDipilih.length ===
                                        dataEvent?.quota &&
                                      !kandidatDipilih.includes(item.id)
                                    }
                                    style={{ width: "100%" }}
                                  >
                                    {kandidatDipilih.includes(item.id)
                                      ? "Batal"
                                      : "Pilih"}
                                  </Button>
                                </CardBody>
                              </Card>
                            </button>
                          );
                        })}
                      </CardGroup>
                    </div>

                    {kandidatDipilih.length === dataEvent?.quota ? (
                      <Button
                        className="mt-5 my-2"
                        onClick={() => handleVote()}
                        color="success"
                        style={{ width: "100%" }}
                      >
                        Pilih
                      </Button>
                    ) : null}
                  </>
                ) : null}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

// User.layout = Admin;

export default User;
