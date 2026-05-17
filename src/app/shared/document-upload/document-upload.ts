import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LineiconsComponent } from '@lineiconshq/angular-lineicons';
import { 
  CloudUploadOutlined, 
  Search1Outlined, 
  CheckOutlined, 
  XOutlined 
} from '@lineiconshq/free-icons';

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: Date;
}

export interface DocumentType {
  id: string;
  name: string;
  description: string;
  required: boolean;
  acceptedTypes: string[];
  maxSize: number; // in MB
}

@Component({
  selector: 'app-document-upload',
  standalone: true,
  imports: [
    CommonModule,
    LineiconsComponent
  ],
  templateUrl: './document-upload.html',
  styleUrl: './document-upload.css'
})
export class DocumentUpload {
  @Input() documentTypes: DocumentType[] = [];
  @Input() multiple: boolean = false;
  @Input() maxFiles: number = 5;
  @Input() disabled: boolean = false;
  @Output() filesUploaded = new EventEmitter<UploadedFile[]>();
  @Output() fileRemoved = new EventEmitter<UploadedFile>();

  readonly CloudUploadOutlined = CloudUploadOutlined;
  readonly Search1Outlined = Search1Outlined;
  readonly CheckOutlined = CheckOutlined;
  readonly XOutlined = XOutlined;

  uploadedFiles: UploadedFile[] = [];
  isDragging = false;
  uploadProgress: { [key: string]: number } = {};

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (!this.disabled) {
      this.isDragging = true;
    }
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    if (this.disabled) return;

    const files = event.dataTransfer?.files;
    if (files) {
      this.handleFiles(files);
    }
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (files) {
      this.handleFiles(files);
    }
    // Reset input value to allow selecting the same file again
    input.value = '';
  }

  private handleFiles(files: FileList): void {
    const fileArray = Array.from(files);
    
    // Check if adding files would exceed the limit
    if (!this.multiple && fileArray.length > 1) {
      return;
    }

    if (this.uploadedFiles.length + fileArray.length > this.maxFiles) {
      return;
    }

    fileArray.forEach(file => {
      this.validateAndUploadFile(file);
    });
  }

  private validateAndUploadFile(file: File): void {
    // Check file size (convert MB to bytes)
    const maxSizeBytes = 10 * 1024 * 1024; // Default 10MB
    if (file.size > maxSizeBytes) {
      return;
    }

    // Check if file type is accepted (basic validation)
    const acceptedTypes = ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!acceptedTypes.includes(fileExtension)) {
      return;
    }

    // Simulate file upload
    this.uploadFile(file);
  }

  private uploadFile(file: File): void {
    const fileId = `file-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    
    // Initialize progress
    this.uploadProgress[fileId] = 0;

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      this.uploadProgress[fileId] += 10;
      
      if (this.uploadProgress[fileId] >= 100) {
        clearInterval(progressInterval);
        
        // Create uploaded file object
        const uploadedFile: UploadedFile = {
          id: fileId,
          name: file.name,
          size: file.size,
          type: file.type,
          url: URL.createObjectURL(file), // In real app, this would be server URL
          uploadedAt: new Date()
        };

        this.uploadedFiles.push(uploadedFile);
        delete this.uploadProgress[fileId];
        
        this.filesUploaded.emit(this.uploadedFiles);
      }
    }, 200);
  }

  removeFile(file: UploadedFile): void {
    this.uploadedFiles = this.uploadedFiles.filter(f => f.id !== file.id);
    this.fileRemoved.emit(file);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  getFileIcon(fileType: string): string {
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('image')) return '🖼️';
    if (fileType.includes('word') || fileType.includes('document')) return '📝';
    return '📎';
  }

  isUploading(): boolean {
    return Object.keys(this.uploadProgress).length > 0;
  }

  viewDocument(url: string): void {
    window.open(url, '_blank');
  }
}
