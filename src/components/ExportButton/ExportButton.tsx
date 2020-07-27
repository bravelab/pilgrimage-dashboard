import Button from "@material-ui/core/Button";

import axios from "axios";
import React from "react";

import { getAuthToken } from "@saleor/auth";

const ExportButton: React.FC<any> = () => {

  const onExport = () => {
    const token = 'Bearer '.concat(getAuthToken());
    axios.get('http://localhost:8000/export/orders/', {
      headers: {
        "Authorization": token,
        'Content-Disposition': "attachment; filename=template.xlsx",
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      },
      responseType: "arraybuffer"
    })
    .then((response) => {
       const url = window.URL.createObjectURL(new Blob([response.data]));
       const link = document.createElement('a');
       link.href = url;
       link.setAttribute('download', 'template.xlsx');
       document.body.appendChild(link);
       link.click();
    })
    .catch((error) => console.error(error));
  };

  return (
    <Button variant="contained" onClick={onExport}>Export</Button>
  );
};

ExportButton.displayName = "Export Button";
export default ExportButton;
