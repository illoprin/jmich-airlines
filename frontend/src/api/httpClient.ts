import { BASE_API } from '@/store/primaryStore'
import { useUserStore } from '@/store/userStore';
import ky from 'ky'

const $host = ky.create(
  {
    prefixUrl: BASE_API + "/api",
  }
);

const $authHost = ky.create(
  {
    prefixUrl: BASE_API + "/api",
    hooks: {
      beforeRequest: [
        (req) => {
          const { token } = useUserStore();
          req.headers.set('Authorization', `Bearer ${token}`);
        }
      ]
    }
  },
);

export { $host, $authHost };