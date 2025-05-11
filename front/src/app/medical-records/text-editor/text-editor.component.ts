// src/app/text-editor/text-editor.component.ts
import { Component } from '@angular/core';
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { CustomUploadAdapter } from './custom-upload-adapter';  // Adjust the import path accordingly

@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.css']
})
export class TextEditorComponent {
  title = 'angular';
  public Editor = DecoupledEditor;

  public onReady(editor: DecoupledEditor): void {
    const element = editor.ui.getEditableElement()!;
    const parent = element.parentElement!;



    parent.insertBefore(
      editor.ui.view.toolbar.element!,
      element
    );

    editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
      return new CustomUploadAdapter(loader);
    };
  }
  public editorConfig = {
    ui: {
      viewportOffset: {
        bottom: 50
      }
    }
  }
}
