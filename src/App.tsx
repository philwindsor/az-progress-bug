import React, { useEffect, useRef, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { BlobServiceClient } from "@azure/storage-blob";
import { v4 as uuidv4 } from "uuid";

type State = {
  connectionString: string;
  fileSize: number;
  bytesSent: number;
  status: "Pending" | "Uploading" | "Finished";
};

const App = () => {
  const [state, setState] = useState<State>({
    connectionString: "",
    fileSize: 0,
    bytesSent: 0,
    status: "Pending",
  });

  const fileInputRef = useRef<HTMLInputElement>(null!);

  const azureStuff = async (file: FileList) => {
    const blobServiceClient = BlobServiceClient.fromConnectionString(
      state.connectionString
    );
    let container = await blobServiceClient.createContainer(uuidv4());

    const blockBlobClient = container.containerClient.getBlockBlobClient(
      uuidv4()
    );

    const blockId = btoa(uuidv4());

    await blockBlobClient.stageBlock(blockId, file[0], file[0].size, {
      onProgress: (e) => {
        console.log("bytes sent: " + e.loadedBytes);
        setState({ ...state, bytesSent: e.loadedBytes, status: "Uploading" }); // This gets to 100% before the upload has completed
      },
    });

    setState({ ...state, status: "Finished" });
  };

  return (
    <>
      <label htmlFor="connectionString">Connection string:</label>
      <input
        name="connectionString"
        value={state.connectionString}
        onChange={(e) =>
          setState({ ...state, connectionString: e.target.value })
        }
      />
      <br />
      <input
        name="inputFile"
        type="file"
        ref={fileInputRef}
        onChange={(e) =>
          setState({ ...state, fileSize: e.target!.files![0].size ?? 0 })
        }
      />
      <br />
      <button
        type="button"
        onClick={() => azureStuff(fileInputRef.current.files!)}
      >
        Upload
      </button>
      <br />
      <br />
      <p>File Size: {state.fileSize} </p>
      <p>Bytes sent: {state.bytesSent} </p>
      <p>Status: {state.status}</p>
    </>
  );
};

export default App;
