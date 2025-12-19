export interface GenerateSignedUrlRequest {
  bucket: string
  fileKey: string
}

export interface GenerateSignedUrlResponse {
  signedUrl: string
}
