import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Card,
  CardBody,
} from "reactstrap";
import DataTable from "react-data-table-component";
import axios from "axios";
import Swal from "sweetalert2";
import Cookies from "universal-cookie";

const TableCalon = () => {
  const [modal, setModal] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [namaKandidat, setNamaKandidat] = useState("");
  const [fotoKandidat, setfotoKandidat] = useState(null);
  const [dataCandidate, setCandidateDetail] = useState([]);
  const [action, setAction] = useState("create");
  const [loading, setLoading] = useState(false);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [id, setId] = useState(null);
  const cookies = new Cookies();

  useEffect(() => {
    getCandidate();
  }, [currentPage, perPage]);

  const router = useRouter();
  const eventId = router.query.eventId;

  const paginationComponentOptions = {
    selectAllRowsItem: true,
    selectAllRowsItemText: "ALL",
  };

  const getCandidate = async () => {
    setLoading(true);
    const { data: res } = await axios.get(
      `${process.env.NEXT_PUBLIC_URL}/candidate/${eventId}/?page=${currentPage}&size=${perPage}`
    );
    setTotalRows(res.data.totalData);
    setCandidateDetail(res.data.content);
    setLoading(false);
  };

  const toggle = () => setModal(!modal);

  const columnCalon = [
    {
      name: "Nama",
      selector: (row) => row.candidate_name,
    },
    {
      name: "Foto",
      cell: (row) => (
        <img
          src={row.photo_url}
          alt={row.photo_url}
          style={{ width: "50px" }}
        />
      ),
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          <Button
            onClick={() => handleEditForm(row.id)}
            color="primary"
            size="sm"
          >
            Edit
          </Button>
          <Button onClick={() => handleDelete(row.id)} color="danger" size="sm">
            Hapus
          </Button>
        </>
      ),
    },
  ];

  let handleTambah = () => {
    setAction("create");
    setModal(true);
  };

  const handleEditForm = async (id) => {
    setAction("update");
    setId(id);
    await axios
      .get(`${process.env.NEXT_PUBLIC_URL}/candidate/detail/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.get("token")}`,
        },
      })
      .then((res) => {
        let data = res.data.data;
        setNamaKandidat(data.candidate_name);
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

  const handleDelete = (id) => {
    Swal.fire({
      title: "Hapus Calon?",
      text: "Data yang telah dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Hapus!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${process.env.NEXT_PUBLIC_URL}/candidate/${id} `, {
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
            getCandidate();
          });
      }
    });
  };

  const handleSubmitEvent = async () => {
    let formData = new FormData(); //formdata object

    formData.append("image", fotoKandidat);
    formData.append("candidate_name", namaKandidat);

    if (action === "create") {
      await axios
        .post(`${process.env.NEXT_PUBLIC_URL}/candidate/${eventId}`, formData, {
          headers: {
            // "Content-Type": "application/json",
            "Content-Type": "multipart/form-data",
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
          getCandidate();
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
        .put(`${process.env.NEXT_PUBLIC_URL}/candidate/${id}`, formData, {
          headers: {
            // "Content-Type": "application/json",
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${cookies.get("token")}`,
          },
        })
        .then((res) => {
          Swal.fire({
            icon: "success",
            title: "Berhasil",
            text: "Data Berhasil Diupdate !",
          });
          setModal(false);
          getCandidate();
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

  let onClosedModal = () => {
    setId(null);
    setNamaKandidat("");
    setfotoKandidat("");
  };

  let handleChange = (e, field) => {
    if (field === "kandidat") {
      setNamaKandidat(e.target.value);
    } else if (field === "foto") {
      setfotoKandidat(e.target.files[0]);
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
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
      <Card className="mt-2 mb-2" color="secondary">
        <CardBody>
          <Button color="primary" onClick={() => handleTambah(true)}>
            Tambah
          </Button>
        </CardBody>
      </Card>

      {/* table data calon */}
      <DataTable
        paginationComponentOptions={paginationComponentOptions}
        columns={columnCalon}
        data={dataCandidate}
        pagination
        paginationServer
        progressPending={loading}
        paginationTotalRows={totalRows}
        paginationDefaultPage={currentPage}
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
      />

      {/* modal edit calon */}
      <Modal isOpen={modal} toggle={toggle} onClosed={onClosedModal}>
        <ModalHeader toggle={toggle}>
          {action === "create" ? "Tambah Calon" : "Edit Calon"}
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="namaKandidat">Nama Calon</Label>
              <Input
                id="namaKandidat"
                name="nama"
                placeholder="Nama Calon"
                type="text"
                value={namaKandidat}
                onChange={(e) => handleChange(e, "kandidat")}
              />
            </FormGroup>
            <FormGroup>
              <Label for="fotoKandidat">Foto Calon</Label>
              <Input
                id="fotoKandidat"
                name="foto"
                type="file"
                onChange={(e) => handleChange(e, "foto")}
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={() => handleSubmitEvent()}>
            Simpan
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default TableCalon;
