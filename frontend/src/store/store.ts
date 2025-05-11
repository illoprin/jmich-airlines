import { reactive, ref } from "vue";
import type { TokenData } from "@/service/api/types/local/token.ts";
import { UserRole } from "@/service/api/types/entities/user.ts";
import { jwtDecode } from "jwt-decode";

const token = reactive<TokenData>({
  id   : 0,
  role : UserRole.Customer,
  login: "guest",
});

const count = ref<number>(0);

function deltaCount(delta) {
  count.value += delta;
}

function addToken(tokenString: string) {
  const decoded = jwtDecode<TokenData>(tokenString);

  token.id    = decoded.id;
  token.role  = decoded.role;
  token.login = decoded.login;
}

export { token, count, deltaCount, addToken };

