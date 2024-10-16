import {
  ElementRef,
  OnInit,
  OnDestroy,
  ViewChild,
  inject,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
} from '@angular/core';
import * as LR from '@uploadcare/blocks';
import '@uploadcare/blocks/web/lr-file-uploader-regular.min.css';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import * as UC from '@uploadcare/file-uploader';
import '@uploadcare/file-uploader/web/uc-file-uploader-regular.min.css';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { OutputFileEntry } from '@uploadcare/file-uploader';
import '@uploadcare/blocks/web/lr-file-uploader-regular.min.css';
import '@uploadcare/file-uploader/web/uc-file-uploader-regular.min.css';

// UC.defineComponents(UC);

@Component({
  selector: 'app-photo-upload-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="uploadcare-container">
      <lr-config
        [attr.ctx-name]="ctxName"
        pubkey="2872c2dfae955ee2fff8"
        max-local-file-size-bytes="10000000"
        [attr.multiple]="multiple"
        img-only="false"
        source-list="local, url, gdrive"
      ></lr-config>

      <lr-file-uploader-regular
        [attr.ctx-name]="ctxName"
      ></lr-file-uploader-regular>

      <lr-upload-ctx-provider
        [attr.ctx-name]="ctxName"
        #ctxProvider
      ></lr-upload-ctx-provider>
    </div>
  `,
  styles: [
    `
      .uploadcare-container {
        --darkmode: 0;
        --h-accent: 144;
        --s-accent: 67%;
        --l-accent: 57%;

        /* Custom styles to reduce size */
        font-size: 14px;
      }

      .uploadcare-container ::ng-deep {
        /* Target Uploadcare components */
        .lr-button {
          padding: 8px 16px;
          font-size: 14px;
        }

        .lr-file-uploader-regular {
          max-width: 400px;
        }

        .lr-file-item {
          padding: 8px;
          font-size: 12px;
        }

        /* Add more custom styles as needed */
      }
    `,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PhotoUploadModalComponent implements OnInit, OnDestroy {
  @Output() cdnUrl: EventEmitter<string> = new EventEmitter<string>();
  @Input() multiple: boolean = false;
  @Input() ctxName: string = 'my-uploader';

  file: OutputFileEntry<'success'> | null = null;
  @ViewChild('ctxProvider', { static: true }) ctxProviderRef!: ElementRef<
    InstanceType<LR.UploadCtxProvider>
  >;

  ngOnInit(): void {
    LR.registerBlocks(LR);
    this.ctxProviderRef.nativeElement.addEventListener(
      'change',
      this.handleChangeEvent
    );
  }

  ngOnDestroy() {
    this.ctxProviderRef.nativeElement.removeEventListener(
      'change',
      this.handleChangeEvent
    );
  }

  handleChangeEvent = (e: LR.EventMap['change']) => {
    const successfulEntries = e.detail.allEntries.filter(
      (f) => f.status === 'success'
    ) as OutputFileEntry<'success'>[];
    this.file = successfulEntries.length > 0 ? successfulEntries[0] : null;
    console.log(this.file?.cdnUrl, 'consoling the url from upload component');
    this.cdnUrl.emit(this.file?.cdnUrl);
  };
}
