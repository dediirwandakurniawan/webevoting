import React, { useEffect, useState } from "react";
// node.js library that concatenates classes (strings)

import { Bar } from "react-chartjs-2";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  NavItem,
  NavLink,
  Nav,
  Progress,
  Table,
  Container,
  Row,
  Col,
} from "reactstrap";
// layout for this page
import Admin from "layouts/Admin.js";
import { useRouter } from "next/router";
import axios from "axios";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

// core components

const Dashboard = (props) => {
  const router = useRouter();

  // const Chart = require("chart.js");
  const [dataVote, setDataVote] = useState([]);
  const [showChart, setShowChart] = useState(false);
  const eventId = router.query.eventId;

  const getData = async () => {
    const { data: res } = await axios.get(
      `${process.env.NEXT_PUBLIC_URL}/dashboard/vote-candidate/${eventId}`
    );
    setDataVote(res.data);
  };

  // const options = {
  //   chart: {
  //     type: "column",
  //   },
  //   title: {
  //     text: "",
  //     align: "left",
  //   },
  //   subtitle: {
  //     text: "",
  //     align: "left",
  //   },

  //   xAxis: {
  //     categories: dataVote && dataVote.categories,
  //     crosshair: true,
  //     accessibility: {
  //       description: "Kandidat",
  //     },
  //   },
  //   credits: {
  //     enabled: false,
  //   },
  //   yAxis: {
  //     min: 0,
  //     title: {
  //       text: "Jumlah",
  //     },
  //     Animation: true,
  //   },
  //   tooltip: {
  //     valueSuffix: "",
  //   },
  //   plotOptions: {
  //     column: {
  //       pointPadding: 0.2,
  //       borderWidth: 0,
  //     },
  //   },
  //   series: [{ name: "Kandidat", data: dataVote && dataVote?.series?.data }],
  // };

  const options = {
    chart: {
      type: "bar",
    },

    exporting: {
      enabled: true,
    },
    title: {
      text: "",
      align: "left",
    },
    subtitle: {
      text: "",

      align: "left",
    },
    xAxis: {
      categories: dataVote && dataVote.categories,
      title: {
        text: null,
      },
      gridLineWidth: 1,
      lineWidth: 0,
    },
    yAxis: {
      min: 0,
      title: {
        text: "",
        align: "high",
      },
      labels: {
        overflow: "justify",
      },
      gridLineWidth: 0,
      tickInterval: 1,
    },
    tooltip: {
      x: {
        formatter: function (
          value,
          { series, seriesIndex, dataPointIndex, w }
        ) {
          return value;
        },
      },
    },
    exporting: {
      buttons: {
        contextButton: {
          menuItems: [
            "viewFullscreen",
            "separator",
            "downloadPNG",
            "downloadSVG",
            "downloadPDF",
            "separator",
            "downloadXLS",
          ],
        },
      },
      enabled: true,
    },
    navigation: {
      buttonOptions: {
        align: "right",
        verticalAlign: "top",
        y: 0,
      },
    },
    plotOptions: {
      bar: {
        borderRadius: "50%",
        dataLabels: {
          enabled: true,
        },
        groupPadding: 0.1,
      },
    },
    legend: {
      // layout: "top",
      itemDistance: 1,
      align: "center",
      verticalAlign: "bottom",
      floating: false,
      borderWidth: 1,
      backgroundColor: "#FFFFFF",
      shadow: true,
    },
    credits: {
      enabled: false,
    },
    series: [{ name: "Vote", data: dataVote && dataVote?.series?.data }],
  };

  const handleActiveChart = () => {
    getData();
    setShowChart(true);
  };

  return (
    <>
      {/* Page content */}
      <Container fluid className="mt-3">
        <Row className="justify-content-center">
          <Col xl="8" md="12">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <div className="col">
                    {/* <h6 className="text-uppercase text-muted ls-1 mb-1">Performance</h6> */}
                    <h2 className="mb-0">Hasil Vote</h2>
                  </div>
                </Row>
              </CardHeader>
              <CardBody>
                {showChart === false ? (
                  <Button
                    onClick={() => handleActiveChart()}
                    color="success"
                    className="mb-3"
                  >
                    Kalkulasi Sekarang
                  </Button>
                ) : null}

                {/* Chart */}
                {/* <div className="chart">
                  <Bar data={chartHasilVote.data} options={chartHasilVote.options} />
                </div> */}
                {showChart ? (
                  <HighchartsReact highcharts={Highcharts} options={options} />
                ) : null}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

Dashboard.layout = Admin;

export default Dashboard;
