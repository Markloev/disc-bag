globalThis.GROOVEBOX_URL_PREFIX = ".";
globalThis.GROOVEBOX_ALLOW_INSECURE_HTTP = true;

async function main() {
    let url = new URL(window.location.href);
    console.log("Hash: " + url.hash);
    if (url.hash.startsWith("#token=")) {
        let parts = url.hash.split("#token=")
        localStorage.setItem("rmx-session", parts[1]);
        const refreshUrl = parts[0].substring(0, parts[0].indexOf("#token="));
        window.location.href = refreshUrl;
    }
    let token = localStorage.getItem("rmx-session");
    if (!token) {
        //dev http://localhost/a/x/auth/google?redirect=http://localhost:8788
        window.location.href = `https://prod.remixlabs.com/a/x/auth/google?redirect=https://${url.host}`;
    }

    // url to remix file -- /<filename>.remix points to a remix file in the web directory
    // to point to another local remix file, just put your remix file in the web directory
    // and update the name
    const remixFileUrl = "/disc_bag_wasm.remix";

    // app / db name you want to run from the remix file
    const appName = "disc_bag_wasm";

    // screen name you want to run
    const screenName = "discs";

    let data = await getWasmDataUrlFromRemixFile(remixFileUrl, appName);
    let remixElement = document.createElement("rmx-runtime");
    remixElement.setAttribute("db-name", data.app);
    remixElement.setAttribute("screen-name", screenName);
    remixElement.setAttribute("code", data.url);
    remixElement.setAttribute("runtime-json", data.runtimeJson);
    remixElement.setAttribute("params", "{}");
    remixElement.setAttribute("token", token);
    document.body.appendChild(remixElement);
}

main();