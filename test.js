/* eslint-disable max-len */
import { InboxOutlined } from "@ant-design/icons";
import { Modal, Upload, message } from "antd";
import Papa from "papaparse";
import { useContext, useState } from "react";
import { TaskContext } from "../../../../context/TaskContext";

interface popupProps {
  open: boolean;
  openPopup: (setter: boolean) => void;
}
interface CsvData {
  [key: string]: string;
}

const ImportTaskPopUp = (props: popupProps) => {
  const [csvData, setCsvData] = useState<CsvData[]>([]);
  const { open, openPopup } = props;
  const { addTask } = useContext(TaskContext);

  console.log(csvData);

  const uploadProps = {
    accept: ".csv",
    name: "file",
    multiple: false,
    beforeUpload: (file: File) => {
      handleFileUpload(file);
      return false; // Prevent default upload behavior
    },
  };

  const handleFileUpload = (file: File) => {
    setCsvData([]);
    Papa.parse(file, {
      header: true,
      complete: (result: any) => {
        setCsvData(result.data);
      },
      error: (error: any) => {
        console.error("Error parsing CSV file:", error);
        message.error("Failed to parse CSV file.");
        setCsvData([]);
      },
    });
  };
  const handleCancelUpload = () => {
    // Clear the uploaded file data
    setCsvData([]);
  };
  const handleOnUpload = async () => {
    if (csvData.length === 0) {
      message.error("No data to upload.");
      return;
    }
    console.log(csvData);
    // Convert the CSV data into a list of tasks
    const tasks = csvData.map((row) => {
      console.log(row.Area);
      return {
        area: row.Area,
        task: row.Task,
        outcome: row.Outcome,
        siteId: parseInt(row.SiteId, 10),
        clientId: row.ClientId,
      };
    });

    // Upload the tasks
    for (const task of tasks) {
      if (task) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        addTask(task);
      }
    }

    // Clear the uploaded file data
    setCsvData([]);
  };

  return (
    <>
      <Modal
        title="Upload CSV File"
        centered
        open={open}
        onOk={() => {
          handleOnUpload();
          return openPopup(false);
        }}
        onCancel={() => {
          handleCancelUpload();
          return openPopup(false);
        }}
        okText="Upload"
      >
        <p>
          Use the given template to upload a CSV file containing your data. Once
          uploaded, you can process and analyze the data using our tools.
        </p>
        <br></br>
        <Upload.Dragger {...uploadProps}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag file to this area to upload
          </p>
        </Upload.Dragger>
      </Modal>
    </>
  );
};

export default ImportTaskPopUp;
