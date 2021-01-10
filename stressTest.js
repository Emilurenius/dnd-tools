import http from "k6/http"
import { check, sleep } from "k6"

export let options = {
    vus: 3000,
    duration: "20s",
}

export default function() {
    let res = http.get("http://192.168.1.124:8080/")
    check(res, {
        "success": (r) => 
r.status == 200
    })
}