function errorsHandler(status,ok) {
    if (status == 200)
        ok()
    else
        alert("Ошибка")
}
export default errorsHandler;