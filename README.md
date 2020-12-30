Simple project to demonstrate the bug with stageBlock upload progress.

You will need to generate a connection string that contains a SAS token - can be done via the azure portal.

Upload a file that will take a while based upon your connection (I used a 99mb file) OR limit your network speed using chrome dev tools.

You will see that the loaded bytes quickly match the file size but the upload is still in progress.
