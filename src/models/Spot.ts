export interface Spot {
  id?: string,
  name: string,
  description: string,
  pictures: any[],
  coordinates: { latitud, longitud },
  averageRating: number
}
