import { customFetch } from '../customFetch'
import type { GetMeResponse } from './dto/GetMe'

export async function getMe(): Promise<GetMeResponse> {
  return await customFetch<GetMeResponse>('/api/users/me')
}
