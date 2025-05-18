import { HTTPError } from "ky";
import { useFetchingErrorModal } from "@/store/fetchingModalStore";
import { capitalizeFirstLetter } from "@/lib/string/switchCaseFirstChar";

export async function handleHttpError(err: unknown) {

  console.log(err);
  const fetchingModal = useFetchingErrorModal();

  if (!(err instanceof HTTPError)) {
    // Непредвиденная ошибка — возможно, ошибка сети, CORS и т.д.
    fetchingModal.visible =  true;
    fetchingModal.title = "Сетевая ошибка";
    fetchingModal.contents = "Проверьте подключение к интернету или попробуйте позже.";
    return new Error("Проверьте подключение к интернету или попробуйте позже.");
  }

  const status = err.response.status;
  let error: string | null = null;

  try {
    error = (await err.response.json() as any).message;
    error = capitalizeFirstLetter(error as string);
  } catch {
  }

  const serverMessage = error || "Неизвестная ошибка";

  switch (status) {
    case 400:
      fetchingModal.visible = true;
      fetchingModal.title = "Ошибка запроса";
      fetchingModal.contents =  serverMessage;
      break;

    case 401:
      fetchingModal.visible = true;
      fetchingModal.title = "Ошибка авторизации";
      fetchingModal.contents = "Ваша сессия устарела. Пожалуйста, войдите заново.";
      break;

    case 403:
      fetchingModal.visible = true;
      fetchingModal.title = "Доступ запрещён";
      fetchingModal.contents = serverMessage;
      break;

    case 404:
      fetchingModal.visible = true;
      fetchingModal.title = "Не найдено";
      fetchingModal.contents = serverMessage;
      break;

    case 409:
      fetchingModal.visible = true;
      fetchingModal.title = "Конфликт данных";
      fetchingModal.contents = serverMessage;
      break;

    case 500:
      fetchingModal.visible = true;
      fetchingModal.title = "Внутренняя ошибка сервера";
      fetchingModal.contents = "Попробуйте позже или обратитесь в поддержку.";
      break;

    default:
      fetchingModal.visible = true;
      fetchingModal.title = `Ошибка ${status}`;
      fetchingModal.contents = serverMessage;
      break;
  }
  return new Error(serverMessage);
}
