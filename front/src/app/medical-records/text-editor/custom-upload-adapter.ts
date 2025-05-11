// src/app/custom-upload-adapter.ts
export class CustomUploadAdapter {
  private loader: any;

  constructor(loader: any) {
    this.loader = loader;
  }

  upload() {
    return this.loader.file.then((file: File) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve({ default: reader.result as string });
      reader.onerror = error => reject(error);
    }));
  }

  abort() {
    // Abort logic can be implemented here if necessary
  }
}
