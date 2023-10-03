import React from "react";

// reactstrap components
import { Spinner, Button } from "reactstrap";

// core components

export default function PageChange(props) {
  return (
    <div>
      <div className="page-transition-wrapper-div">
        <div className="page-transition-icon-wrapper mb-3">
          <Button variant="primary" disabled>
            <Spinner
              as="span"
              animation="grow"
              role="status"
              aria-hidden="true"
            />
              <div className="ml-4">Harap Tunggu...</div>
          </Button>
        </div>
        {/* <h4 className="title text-white">
          Loading page contents for: {props.path}
        </h4> */}
      </div>
    </div>
  );
}
