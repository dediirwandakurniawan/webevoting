import React, { useState } from "react";
import { Alert, Button, Card, CardBody, CardHeader, Col, Form, FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText, Label, Spinner } from "reactstrap";
import Auth from "layouts/Auth.js";
import axios from "axios";
import Swal from "sweetalert2";
import Cookies from "universal-cookie";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginSebagai, setLoginSebagai] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const cookies = new Cookies();
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    const data = {
      email: username,
      password,
    };

    axios
      .post(`${process.env.NEXT_PUBLIC_URL}/mst-user/login`, data)
      .then((res) => {
        setLoading(false);
        let data = res.data.data;
        cookies.set("token", data.token);
        cookies.set("roles", data.role);
        if (data.role === "admin") {
          router.push("/admin/event");
        } else {
          router.push("/user");
        }
      })
      .catch((e) => {
        setLoading(false);
      
        if (e?.response?.data?.error_messages?.length > 0) {
          Swal.fire({
            icon: "error",
            title: "Terjadi kesalahan...",
            text: e.response.data.error_messages[0].msg,
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Terjadi kesalahan...",
            text: e?.response?.data?.message,
          });
        }
      });
  };

  return (
    <>
      <Col lg="5" md="7">
        <Card className="bg-secondary shadow border-0">
          <CardHeader className="bg-transparent ">
            <div className="text-muted text-center">
              <h3>Login</h3>
            </div>
          </CardHeader>
          <CardBody className="px-lg-5 py-lg-5">
            {showAlert && (
              <div className="text-center text-muted mb-4">
                <Alert color="danger">Username Atau Password Salah</Alert>
              </div>
            )}
            <Form onSubmit={(e) => handleLogin(e)}>
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-circle-08" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input placeholder="Username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                </InputGroup>
              </FormGroup>

              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input placeholder="Password" type={showPassword ? "text" : "password"} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
                  <InputGroupAddon addonType="append">
                    <Button onClick={handleTogglePassword} color="primary">
                      {showPassword ? <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon icon={faEyeSlash} />}
                    </Button>
                  </InputGroupAddon>
                </InputGroup>
              </FormGroup>
              <div className="text-center">
                <Button className="my-4" color="success" type="submit" disabled={loading}>
                  {loading ? (
                    <div>
                      <Spinner size="sm" color="light" /> Harap Tunggu
                    </div>
                  ) : (
                    <>
                      <i className="fa fa-arrow-circle-right mr-2" aria-hidden="true"></i>
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

Login.layout = Auth;

export default Login;
