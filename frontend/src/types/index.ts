export interface Category {
  label: string
  value: string
}

export type NavTab = 'home' | 'category' | 'add' | 'chat' | 'my'

export const categories: Category[] = [
  { label: '전체', value: 'ALL' },
  { label: '가정용품', value: 'HOUSEHOLD' },
  { label: '여행용품', value: 'TRAVEL' },
  { label: '스포츠/운동', value: 'SPORTS' },
  { label: '전자기기', value: 'ELECTRONICS' },
  { label: '패션잡화', value: 'FASHION' },
  { label: '육아/교육', value: 'CHILDCARE' }
]
