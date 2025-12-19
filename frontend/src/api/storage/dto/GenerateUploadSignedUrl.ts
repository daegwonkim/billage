export interface GenerateUploadSignedUrlRequest {
  bucket: string
  fileName: string
}

export interface GenerateUploadSignedUrlResponse {
  fileKey: string
  signedUrl: string
}
