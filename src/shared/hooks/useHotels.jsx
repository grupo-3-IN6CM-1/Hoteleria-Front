import { useState, useEffect } from 'react'
import {
  getHotels,
  createHotel,
  updateHotel,
  deleteHotel
} from '../../services/api'

export default function useHotels() {
  const [hotels, setHotels]   = useState([])
  const [loading, setLoading] = useState(false)

  const fetch = async () => {
    setLoading(true)
    const { data } = await getHotels()
    setHotels(data.hotels)             // viene en { success, hotels: [...] }
    setLoading(false)
  }

  const create = async h => {
    const { data } = await createHotel(h)
    setHotels(prev => [data.hotel, ...prev])
  }

  const update = async (id, h) => {
    const { data } = await updateHotel(id, h)
    setHotels(prev =>
      prev.map(x => (x._id === id ? data.hotel : x))
    )
  }

  const remove = async id => {
    await deleteHotel(id)
    setHotels(prev => prev.filter(x => x._id !== id))
  }

  useEffect(() => { fetch() }, [])

  return { hotels, loading, fetch, create, update, remove }
}
