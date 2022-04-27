import useSWR from 'swr'

const useSharedState = (key, initial) => {
  const { data: state, mutate: setState } = useSWR(key, {
    fallbackData: initial
  })
  return [state, setState]
}

export default useSharedState