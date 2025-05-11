export class CustomUploadAdapter {
  loader: any;
  xhr: XMLHttpRequest;

  constructor(loader: any) {
    this.loader = loader;
    this.xhr = new XMLHttpRequest();
  }

  upload(): Promise<{ default: string }> {
    return this.loader.file
      .then((file: File) => new Promise((resolve, reject) => {
        this._initRequest();
        this._initListeners(resolve, reject, file);
        this._sendRequest(file);
      }));
  }

  abort() {
    if (this.xhr) {
      this.xhr.abort();
    }
  }

  _initRequest() {
    this.xhr.open('POST', 'YOUR_IMAGE_UPLOAD_URL', true);
    this.xhr.responseType = 'json';
  }

  _initListeners(resolve: any, reject: any, file: File) {
    const genericErrorText = `Couldn't upload file: ${file.name}.`;
    this.xhr.addEventListener('error', () => reject(genericErrorText));
    this.xhr.addEventListener('abort', () => reject());
    this.xhr.addEventListener('load', () => {
      const response = this.xhr.response;

      if (!response || response.error) {
        return reject(response && response.error ? response.error.message : genericErrorText);
      }

      resolve({
        default: response.url
      });
    });

    if (this.xhr.upload) {
      this.xhr.upload.addEventListener('progress', (evt: ProgressEvent) => {
        if (evt.lengthComputable) {
          this.loader.uploadTotal = evt.total;
          this.loader.uploaded = evt.loaded;
        }
      });
    }
  }

  _sendRequest(file: File) {
    const data = new FormData();
    data.append('upload', file);
    this.xhr.send(data);
  }
}
