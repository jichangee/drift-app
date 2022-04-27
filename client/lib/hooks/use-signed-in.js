import useSharedState from './use-shared-state'
import Cookies from 'js-cookie'
import { useEffect } from 'react'

export const DRIFT_TOKEN = 'drift-token'

const useSignedIn = () => {
  const [signedIn, setSignedIn] = useSharedState('signedIn', 
    typeof window === 'undefined' ? undefined : !!Cookies.get(DRIFT_TOKEN)
  )

  const signin = token => {
    setSignedIn(true)
    Cookies.set(DRIFT_TOKEN, token)
  }

  const token = Cookies.get(DRIFT_TOKEN)
  useEffect(() => {
    setSignedIn(!!token)
  }, [setSignedIn, token])

  return { signin, signedIn, token }
}

export default useSignedIn