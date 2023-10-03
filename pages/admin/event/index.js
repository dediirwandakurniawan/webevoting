import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
// reactstrap components
import { Button, Card, CardHeader, CardBody, FormGroup, Form, Input, Container, Row, Col, Badge, Modal, ModalHeader, ModalBody, ModalFooter, Label } from "reactstrap";
// layout for this page
import Admin from "layouts/Admin.js";
// core components
import Header from "components/Headers/Header.js";
import DataTable from "react-data-table-component";
import axios from "axios";
import Swal from "sweetalert2";
import Cookies from "universal-cookie";

const Event = () => {
  const router = useRouter();
  const [modal, setModal] = useState(false);
  const [namaEvent, setNamaEvent] = useState("");
  const [deskripsiEvent, setDeskripsiEvent] = useState("");
  const [activeEvent, setActiveEvent] = useState(false);
  const [jumlahKandidat, setJumlahKandidat] = useState("");
  const [showFotoEvent, setShowFotoEvent] = useState(false);
  const [action, setAction] = useState("create");
  const [events, setEvents] = useState([]);
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);

  const cookies = new Cookies();

  useEffect(() => {
    getEvent();
  }, [perPage, currentPage]);

  const getEvent = async () => {
    setLoading(true);
    const { data: res } = await axios.get(`${process.env.NEXT_PUBLIC_URL}/event?page=${currentPage}&size=${perPage}`);
    setTotalRows(res.data.totalData);
    setEvents(res.data.content);
    setLoading(false);
  };

  const toggle = () => setModal(!modal);
  const columns = [
    {
      name: "Nama Event",
      selector: (row) => (row.event_name ? row.event_name : "-"),
    },
    {
      name: "Deskripsi",
      selector: (row) => (row.description ? row.description : "-"),
    },
    {
      name: "Active",
      selector: (row) =>
        row.is_active === 1 ? (
          <Badge color="primary" pill>
            Yes
          </Badge>
        ) : (
          <Badge color="danger" pill>
            No
          </Badge>
        ),
    },
    {
      name: "Kuota Vote",
      selector: (row) => row.quota,
    },
    {
      name: "Tampilkan Foto",
      selector: (row) =>
        row.show_photo === 1 ? (
          <Badge color="primary" pill>
            Yes
          </Badge>
        ) : (
          <Badge color="danger" pill>
            No
          </Badge>
        ),
    },
    {
      name: "Action",
      selector: (row) => (
        <div style={{ width: 800, height: "auto" }}>
          {/* <a onClick={() => handleEditForm()}>Edit</a> | <a>Delete</a> |{" "} */}
          <Button color="primary" size="sm" onClick={() => handleDetailEvent(row.id)}>
            Detail
          </Button>
          <Button color="success" size="sm" onClick={() => handleEditForm(row.id)}>
            Edit
          </Button>
          <Button color="danger" size="sm" onClick={() => handleDelete(row.id)}>
            Hapus
          </Button>
        </div>
      ),
    },
  ];

  let handleDetailEvent = async (id) => {
    router.push(`event/event-detail/${id}`);
  };

  let handleEditForm = async (id) => {
    setAction("update");
    await axios
      .get(`${process.env.NEXT_PUBLIC_URL}/event/${id} `, {
        headers: {
          Authorization: `Bearer ${cookies.get("token")}`,
        },
      })
      .then((res) => {
        let data = res.data.data;
        console.log(data, "data detail edit");
        setId(data.id);
        setNamaEvent(data.event_name);
        setActiveEvent(data.is_active);
        setShowFotoEvent(data.show_photo);
        setJumlahKandidat(data.quota);
        setDeskripsiEvent(data.description);
        setModal(true);
      })
      .catch((e) => {
        Swal.fire({
          icon: "error",
          title: "Terjadi Kesalahan!",
          text: e,
        });
      });
  };

  let handleDelete = (id) => {
    Swal.fire({
      title: "Hapus Event?",
      text: "Data yang telah dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Hapus",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${process.env.NEXT_PUBLIC_URL}/event/${id} `, {
            headers: {
              Authorization: `Bearer ${cookies.get("token")}`,
            },
          })
          .then((res) => {
            Swal.fire({
              icon: "success",
              title: "Berhasil",
              text: "Data Berhasil Dihapus !",
            });
            getEvent();
          });
      }
    });
  };

  let handleSubmitEvent = async () => {
    let data = {
      event_name: namaEvent,
      is_active: activeEvent,
      quota: jumlahKandidat,
      show_photo: showFotoEvent,
      description: deskripsiEvent,
    };

    if (action === "create") {
      await axios
        .post(`${process.env.NEXT_PUBLIC_URL}/event`, data, {
          headers: {
            Authorization: `Bearer ${cookies.get("token")}`,
          },
        })
        .then((res) => {
          Swal.fire({
            icon: "success",
            title: "Berhasil",
            text: "Data Berhasil Disimpan !",
          });
          setModal(false);
          getEvent();
        })
        .catch((e) => {
          console.log(e);
          if (e.response.data.error_messages) {
            Swal.fire({
              icon: "error",
              title: "Terjadi Kesalahan!",
              text: e.response.data.error_messages[0].msg,
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Terjadi Kesalahan!",
              text: e,
            });
          }
        });
    } else {
      await axios
        .put(`${process.env.NEXT_PUBLIC_URL}/event/${id}`, data, {
          headers: {
            Authorization: `Bearer ${cookies.get("token")}`,
          },
        })
        .then((res) => {
          Swal.fire({
            icon: "success",
            title: "Berhasil",
            text: "Data Berhasil Disimpan !",
          });
          setModal(false);
          getEvent();
        })
        .catch((e) => {
          console.log(e);
          if (e.response.data.error_messages) {
            Swal.fire({
              icon: "error",
              title: "Terjadi Kesalahan!",
              text: e.response.data.error_messages[0].msg,
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Terjadi Kesalahan!",
              text: e,
            });
          }
        });
    }
  };

  let handleTambah = () => {
    setAction("create");
    setModal(true);
  };

  let onClosedModal = () => {
    setId(null);
    setNamaEvent("");
    setActiveEvent(false);
    setShowFotoEvent(false);
    setJumlahKandidat("");
    setDeskripsiEvent("");
  };

  let handleChange = (e, field) => {
    let data = e.target.value;
    if (field === "nama") {
      setNamaEvent(data);
    } else if (field === "active") {
      setActiveEvent(e.target.checked);
    } else if (field === "deskripsi") {
      setDeskripsiEvent(data);
    } else if (field === "jumlah") {
      setJumlahKandidat(data);
    } else if (field === "foto") {
      setShowFotoEvent(e.target.checked);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setPerPage(newPerPage);
  };

  return (
    <>
      <Header />

      <Container className="mt--7" fluid>
        <Row>
          <Col>
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <h3 className="mb-0">Event</h3>
              </CardHeader>
              <CardBody>
                <Button color="danger" onClick={() => handleTambah()}>
                  Tambah Event
                </Button>

                <Row>
                  <Col>
                    <DataTable
                      columns={columns}
                      data={events}
                      pagination
                      progressPending={loading}
                      paginationTotalRows={totalRows}
                      paginationDefaultPage={currentPage}
                      onChangeRowsPerPage={handlePerRowsChange}
                      onChangePage={handlePageChange}
                    />
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>

      <Modal isOpen={modal} toggle={toggle} onClosed={onClosedModal}>
        <ModalHeader toggle={toggle}>
        {action === "create" ? "Tambah Event" : "Edit Event"}
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="namaEvent">Event</Label>
              <Input id="namaEvent" name="event" placeholder="Masukkan Nama Event" type="text" onChange={(e) => handleChange(e, "nama")} value={namaEvent} />
            </FormGroup>
            <FormGroup check className="mb-3">
              <Input type="checkbox" checked={activeEvent} defaultValue={activeEvent} onChange={(e) => handleChange(e, "active")} /> <Label check>Active</Label>
            </FormGroup>
            <FormGroup>
              <Label for="deskripsi">Deskripsi Event</Label>
              <Input id="deskripsi" name="deskripsi" type="textarea" onChange={(e) => handleChange(e, "deskripsi")} value={deskripsiEvent} />
            </FormGroup>
            <FormGroup>
              <Label for="jumlahKandidat">Jumlah Kandidat yang Dapat Dipilih</Label>
              <Input id="jumlahKandidat" name="jumlah_kandidat" placeholder="Masukkan jumlah kandidat" type="number" onChange={(e) => handleChange(e, "jumlah")} value={jumlahKandidat} />
            </FormGroup>
            <FormGroup check>
              <Input type="checkbox" checked={showFotoEvent} onChange={(e) => handleChange(e, "foto")} /> <Label check>Tampilkan Foto Kandidat</Label>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={() => handleSubmitEvent()}>
            Simpan
          </Button>{" "}
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

Event.layout = Admin;

export default Event;
