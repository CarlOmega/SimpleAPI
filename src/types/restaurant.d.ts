interface Restaurant {
  id?: string,
  owner?: string,
  total?: number,
  avg?: number,
  ratings?: number
  name: string,
  description: string,
}

interface Review {
  id?: string,
  author?: string,
  rating: number,
  comment: string,
  reply?: string
}