import { useMutation, useQuery } from '@tanstack/react-query'
import db from '../services/dbServices'

const dbMutation = (queryClient, dbFn) => {
  return useMutation({
    mutationFn: dbFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
    onError: (error) => {
      console.error(`dbMutation (${dbFn.name}): onError`, error)
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
  })
}

const add = (queryClient) => {
  return dbMutation(queryClient, db.add)
}

const del = (queryClient) => {
  return dbMutation(queryClient, db.del)
}

const likes = (queryClient) => {
  return dbMutation(queryClient, db.updateLikes)
}

const comment = (queryClient) => {
  return dbMutation(queryClient, db.addComment)
}

const all = () => {
  return useQuery({
    queryKey: ['blogs'],
    queryFn: db.getAll,
    retry: 1,
  })
}

export default { all, add, del, likes, comment }
