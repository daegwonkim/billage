import { customFetch } from '../customFetch'
import type {
  GenerateSignedUrlRequest,
  GenerateSignedUrlResponse
} from './dto/GenerateSignedUrl'
import type {
  GenerateUploadSignedUrlRequest,
  GenerateUploadSignedUrlResponse
} from './dto/GenerateUploadSignedUrl'
import type { RemoveStorageFileRequest } from './dto/RemoveStorageFile'

export async function generateUploadSignedUrl(
  request: GenerateUploadSignedUrlRequest
): Promise<GenerateUploadSignedUrlResponse> {
  return await customFetch<GenerateUploadSignedUrlResponse>(
    '/api/storage/upload/signed-url',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    }
  )
}

export async function generateSignedUrl(
  request: GenerateSignedUrlRequest
): Promise<GenerateSignedUrlResponse> {
  return await customFetch<GenerateSignedUrlResponse>(
    `/api/storage/signed-url`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    }
  )
}

export async function removeFile(
  request: RemoveStorageFileRequest
): Promise<void> {
  await customFetch(`/api/storage/file`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(request)
  })
}
