export interface GenerateSignedUrlRequest {
  bucket: string
  fileName: string
}

export interface GenerateSignedUrlResponse {
  fileKey: string
  signedUrl: string
}
