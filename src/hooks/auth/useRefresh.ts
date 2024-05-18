import { AxiosResponse } from 'axios'
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters, useQuery } from 'react-query'
import { AuthService } from '../../service/auth.service'
import { IUser } from '../../types/User.interface'
import { setCookie } from '../../utils/cookie'
import { useAction } from '../useAction'

interface useRefreshType {
  asyncRefresh: <TPageData>(options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined) => Promise<QueryObserverResult<AxiosResponse<IUser>, unknown>>
  isLoading?: boolean
}

export const useRefresh = (): useRefreshType => {
  const { isAuth } = useAction()

  const { refetch: asyncRefresh, isLoading } = useQuery('refresh', async () => await AuthService.refresh(), {
    onSuccess: ({ data }) => {
      setCookie('tokenIncd', 'true')
      isAuth(data)
    },
    enabled: false,
    retry: false
  })

  return { asyncRefresh, isLoading }
}
