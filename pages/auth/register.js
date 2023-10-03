import React, { useState } from "react";

// reactstrap components
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Spinner,
} from "reactstrap";
// layout for this page
import Auth from "layouts/Auth.js";

function Register() {
  const [selectedOption, setSelectedOption] = useState("option1");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    if (username === "admin" && password === "password") {
      window.location.href = "/admin/dashboard";
    } else {
      setShowAlert(true);
      setLoading(false);
    }
  };

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };
  return (
    <>
      <Col lg="6" md="8">
        <Card className="bg-secondary shadow border-0">
          <CardHeader className="bg-transparent pb-5">
            <div className="text-muted text-center mb-4">
              <small>Login Untuk Peserta</small>
            </div>
            <div className="text-center">
              <Button
                className="btn-success btn-icon"
                color="success"
                onClick={(e) => {
                  window.location.href = "/auth/login";
                }}
              >
                <span className="btn-inner--icon">
                  <i class="fa fa-user" aria-hidden="true"></i>
                </span>
                <span className="btn-inner--text">Login Admin</span>
              </Button>
              <Button
                className="btn-success btn-icon"
                color="success"
                onClick={() => {
                  window.location.href = "/auth/register";
                }}
              >
                <span className="btn-inner--icon">
                  <i class="fa fa-users" aria-hidden="true"></i>
                </span>
                <span className="btn-inner--text">Login Peserta</span>
              </Button>
            </div>
          </CardHeader>
          <CardBody className="px-lg-5 py-lg-5">
            {showAlert && (
              <div className="text-center text-muted mb-4">
                <Alert color="danger">Username Atau Password Salah</Alert>
              </div>
            )}
            <Form onSubmit={handleLogin}>
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-circle-08" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Password"
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </InputGroup>
              </FormGroup>
              <div className="form-group">
                <div className="input-group input-group-alternative">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <i className="ni ni-bullet-list-67" />
                    </span>
                  </div>
                  <select
                    id="option-select"
                    value={selectedOption}
                    onChange={handleOptionChange}
                    className="form-control"
                  >
                    <option value="option1">Pilih Event</option>
                    <option value="option2">Opsi 2</option>
                    <option value="option3">Opsi 3</option>
                  </select>
                </div>
              </div>

              <div className="text-center">
                <Button
                  className="my-4"
                  color="success"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <div>
                      <Spinner size="sm" color="light" /> Harap Tunggu
                    </div>
                  ) : (
                    <>
                      <i
                        className="fa fa-arrow-circle-right mr-2"
                        aria-hidden="true"
                      ></i>
                      Masuk
                    </>
                  )}
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </>
  );
}

Register.layout = Auth;

export default Register;
