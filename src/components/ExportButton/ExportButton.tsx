import Button from "@material-ui/core/Button";

import axios from "axios";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { getAuthToken } from "@saleor/auth";
import { PILGRIMAGE_API_URI } from "@saleor/config";
import { commonMessages } from "@saleor/intl";
import useAppState from "@saleor/hooks/useAppState";
import useNotifier from "@saleor/hooks/useNotifier";

interface ExportButtonProps {
  exportApiUrl: string;
  fileName: string;
}

const ExportButton: React.FC<ExportButtonProps> = props => {
  const { exportApiUrl, fileName } = props;
  const [, dispatchAppState] = useAppState();
  const notify = useNotifier();
  const intl = useIntl();

  const onExport = () => {
    dispatchLoading(true);

    const token = `JWT ${getAuthToken()}`;
    axios.get(`${PILGRIMAGE_API_URI}${exportApiUrl}`, {
      headers: {
        "Authorization": token,
        'Content-Disposition': `attachment; filename=${fileName}.xlsx`,
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      },
      responseType: "arraybuffer"
    })
    .then((response) => downloadFile(response.data))
    .catch(() => notify({text: intl.formatMessage(commonMessages.somethingWentWrong)}))
    .then(() => dispatchLoading(false));
  };

  const downloadFile = (data) => {
    const url = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${fileName}.xlsx`);
    document.body.appendChild(link);
    link.click();
  };

  const dispatchLoading = (isLoading: boolean) => {
    dispatchAppState({
      payload: {
        value: isLoading
      },
      type: "displayLoader"
    });
  };

  return (
    <Button color="primary" variant="contained" onClick={onExport}>
      <FormattedMessage
        defaultMessage="Export"
        id="exportButton"
      />
    </Button>
  );
};

ExportButton.displayName = "Export Button";
export default ExportButton;
