import { http, HttpResponse } from 'msw'
import { CATEGORIES, RENTAL_ITEM_DETAIL, RENTAL_ITEMS } from './mockData'

export const handlers = [
  http.get('/api/categories', () => {
    return HttpResponse.json(CATEGORIES)
  }),

  http.get('/api/rental-items', () => {
    return HttpResponse.json(RENTAL_ITEMS)
  }),

  http.get('/api/rental-items/:id', () => {
    return HttpResponse.json(RENTAL_ITEM_DETAIL)
  })
]
