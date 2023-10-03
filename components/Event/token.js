import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
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
} from "reactstrap";
// core components
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import axios from "axios";
import Cookies from "universal-cookie";

const Token = () => {
  const router = useRouter();
  const eventId = router.query.eventId;
  const cookies = new Cookies();

  const [modal, setModal] = useState(false);
  const [action, setAction] = useState("create");
  const [loading, setLoading] = useState(false);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [data, setData] = useState([]);
  const [jumlahToken, setJumlahToken] = useState(0);
  const paginationComponentOptions = {
    selectAllRowsItem: true,
    selectAllRowsItemText: "ALL",
  };
  const toggle = () => setModal(!modal);
  const columns = [
    {
      name: "Tanggal Generate",
      selector: (row) => row.created_date,
    },
    {
      name: "Token",
      selector: (row) => row.token,
    },
    {
      name: "Is Valid",
      selector: (row) => (
        <>
          {row.is_valid == 1 ? (
            <Badge color="primary" pill>
              Yes
            </Badge>
          ) : (
            <Badge color="danger" pill>
              No
            </Badge>
          )}
        </>
      ),
    },
    {
      name: "Done Vote",
      selector: (row) => (
        <>
          {row.is_vote == 1 ? (
            <Badge color="primary" pill>
              Yes
            </Badge>
          ) : (
            <Badge color="danger" pill>
              No
            </Badge>
          )}
        </>
      ),
    },

    {
      name: "Action",
      selector: (row) => (
        <>
          {row.is_valid !== 0 ? (
            <Button
              onClick={() => handleDelete(row.id)}
              color="danger"
              size="sm"
            >
              Hapus
            </Button>
          ) : null}
        </>
      ),
    },
  ];

  const handleDelete = (id) => {
    Swal.fire({
      title: "Anda Yakin ?",
      text: "Data yang telah dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yakin!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${process.env.NEXT_PUBLIC_URL}/token/${id} `, {
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
            getData();
          });
      }
    });
  };

  const getData = async () => {
    setLoading(true);
    const { data: res } = await axios.get(
      `${process.env.NEXT_PUBLIC_URL}/token/${eventId}/?page=${currentPage}&size=${perPage}`
    );
    setTotalRows(res.data.totalData);
    setData(res.data.content);
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, [currentPage, perPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setPerPage(newPerPage);
  };

  let handleSubmit = async () => {
    const data = {
      number_token: jumlahToken,
    };

    await axios
      .post(`${process.env.NEXT_PUBLIC_URL}/token/${eventId}`, data, {
        headers: {
          Authorization: `Bearer ${cookies.get("token")}`,
        },
      })
      .then((res) => {
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Token berhasil dibuat !",
        });
        setModal(false);
        getData();
      })
      .catch((e) => {
        console.log(e);
        if (e?.response?.data?.error_messages) {
          Swal.fire({
            icon: "error",
            title: "Terjadi Kesalahan!",
            text: e?.response?.data?.error_messages[0]?.msg,
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

  let handleDownloadToken = () => {
    axios
      .get(`${process.env.NEXT_PUBLIC_URL}/token/${eventId}/download`, {
        responseType: "blob",
      })
      .then((response) => {
        let FileSaver = require("file-saver");

        FileSaver.saveAs(response.data, `List Token`);
      });
  };
  return (
    <>
      <Row>
        <Col>
          <Card className="shadow">
            <CardBody>
              <Button color="danger" onClick={toggle} size="sm">
                Generate Token
              </Button>
              <Button
                color="danger"
                onClick={() => handleDownloadToken()}
                size="sm"
              >
                Download Token
              </Button>

              <Row>
                <Col>
                  <DataTable
                    paginationComponentOptions={paginationComponentOptions}
                    columns={columns}
                    data={data}
                    pagination
                    paginationServer
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

      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Generate Token</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="jumlahToken">Jumlah Token</Label>
              <Input
                id="jumlahToken"
                name="jumlah_token"
                placeholder="Masukkan jumlah token"
                type="number"
                onChange={(e) => setJumlahToken(e.target.value)}
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={() => handleSubmit()}>
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

export default Token;
