import { Component } from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import { RecordsService } from '../service/records.service';
import { DomSanitizer } from '@angular/platform-browser';
import {a} from "@fullcalendar/core/internal-common";

@Component({
  selector: 'app-attachement',
  templateUrl: './attachement.component.html',
  styleUrls: ['./attachement.component.css']
})
export class AttachementComponent {
  fileUrl: any;
   fileType: any;
  fileName: string = '';
  constructor(private attachmentService: RecordsService, private sanitizer: DomSanitizer) {}

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      const formData = new FormData();
      formData.append('attachments', file);

      this.attachmentService.uploadAttachement(formData).subscribe(
        (res:any) => {
        },
        (err: any) => {
          console.log(err);
        }
      );
    }
  }





  getFile(id: number) {
    this.attachmentService.getAttachment(id).subscribe(
      (res: HttpResponse<Blob>) => {
        const contentDispositionHeader = res.headers.get('content-disposition');
        const contentTypeHeader = res.headers.get('content-type');
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        if (contentDispositionHeader != null) {
          let matches = filenameRegex.exec(contentDispositionHeader);
          if (matches != null && matches[1]) {
            this.fileName = matches[1].replace(/['"]/g, '');
          }
        }
        // @ts-ignore
        const blob = new Blob([res.body], { type: contentTypeHeader });



        const url = window.URL.createObjectURL(blob);
        this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);

        if (contentTypeHeader === 'application/pdf' || contentTypeHeader?.startsWith('image/')) {
          this.fileType = contentTypeHeader;
        } else {
          const link = document.createElement('a');
          link.href = url;
          if (contentDispositionHeader != null) {
            link.download = contentDispositionHeader;
          } // Set the file name here
          link.click();

          // Revoke the object URL after the download has started
          link.addEventListener('click', () => {
            window.URL.revokeObjectURL(url);
          });
        }

      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  someMethod() {
    // Change fileName in this method
    this.fileName = 'newFileName';
  }

  anotherMethod() {
    // Access the changed fileName in this method
  }
  downloadFile() {
    const link = document.createElement('a');
    link.href = this.fileUrl.changingThisBreaksApplicationSecurity;
    link.download = this.fileName; // Use the file name here
    link.click();

    // Revoke the object URL after the download has started
    link.addEventListener('click', () => {
      window.URL.revokeObjectURL(this.fileUrl.changingThisBreaksApplicationSecurity);
    });
  }
}
