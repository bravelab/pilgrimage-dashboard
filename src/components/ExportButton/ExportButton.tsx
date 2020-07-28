import Button from "@material-ui/core/Button";

import axios from "axios";
import React from "react";

import { getAuthToken } from "@saleor/auth";

const API_URL = "http://localhost:8000/";

interface ExportButtonProps {
  exportApiUrl: string;
  fileName: string;
}

const ExportButton: React.FC<ExportButtonProps> = props => {
  const { exportApiUrl, fileName } = props;

  const onExport = () => {
    const token = `JWT ${getAuthToken()}`;
    axios.get(`${API_URL}${exportApiUrl}`, {
      headers: {
        "Authorization": token,
        'Content-Disposition': `attachment; filename=${fileName}.xlsx`,
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      },
      responseType: "arraybuffer"
    })
    .then((response) => {
       const url = window.URL.createObjectURL(new Blob([response.data]));
       const link = document.createElement('a');
       link.href = url;
       link.setAttribute('download', `${fileName}.xlsx`);
       document.body.appendChild(link);
       link.click();
    })
    .catch((error) => console.error(error));
  };

  return (
    <Button color="primary" variant="contained" onClick={onExport}>Export</Button>
  );
};

ExportButton.displayName = "Export Button";
export default ExportButton;
