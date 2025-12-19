import type {
  GenerateSignedUrlRequest,
  GenerateSignedUrlResponse
} from './dto/GenerateSignedUrl'
import type {
  GenerateUploadSignedUrlRequest,
  GenerateUploadSignedUrlResponse
} from './dto/GenerateUploadSignedUrl'
import type { StorageFileRemoveRequest } from './dto/StorageFileRemove'

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL!
const API_BASE_URL = 'http://localhost:8080'

export async function generateUploadSignedUrl(
  request: GenerateUploadSignedUrlRequest
): Promise<GenerateUploadSignedUrlResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/storage/upload/signed-url`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    }
  )

  if (!response.ok) throw new Error('Failed to fetch signed url')
  return response.json()
}

export async function generateSignedUrl(
  request: GenerateSignedUrlRequest
): Promise<GenerateSignedUrlResponse> {
  const response = await fetch(`${API_BASE_URL}/api/storage/signed-url`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(request)
  })

  if (!response.ok) throw new Error('Failed to fetch signed url')
  return response.json()
}

export async function removeFile(
  request: StorageFileRemoveRequest
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/storage/file`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(request)
  })

  if (!response.ok) throw new Error('스토리지 파일 삭제에 실패했습니다')
}
